import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { CancelResultSchema, CollectResultSchema, PollResultSchema, ProviderCapabilitiesSchema, QuoteSchema, SubmitResultSchema, } from "../contracts/index.js";
import { assertCurrent, canonicalHash, validateRequest, } from "../contracts/validate.js";
export class JobOrchestrator {
    store;
    provider;
    authorization;
    constructor(store, provider, authorization) {
        this.store = store;
        this.provider = provider;
        this.authorization = authorization;
    }
    async quote(input, p, signal) {
        signal.throwIfAborted();
        const r = validateRequest(input, p);
        this.authorization.assertAllowed(this.provider, r, p);
        const caps = ProviderCapabilitiesSchema.parse(await this.provider.capabilities(signal));
        if (caps.evidence !== "mock" ||
            caps.provider !== r.plan.provider_capabilities.provider ||
            caps.model_version !== r.model_version)
            throw new Error("Provider identity or evidence mismatch");
        const q = QuoteSchema.parse(await this.provider.quote(r, signal));
        if (q.provider !== caps.provider ||
            q.model_version !== r.model_version ||
            q.request_hash !== canonicalHash(r))
            throw new Error("Quote request binding mismatch");
        if (q.expires_at && Date.parse(q.expires_at) <= Date.now())
            throw new Error("Quote expired");
        if (q.cost.basis !== "mock" || !Number.isSafeInteger(q.cost.amount_micros))
            throw new Error("Unknown/non-mock quote cannot reserve");
        return q;
    }
    async submit(input, p, signal) {
        signal.throwIfAborted();
        const request = validateRequest(input, p);
        this.authorization.assertAllowed(this.provider, request, p);
        // Identity duplicates must not call providers, including after restart. A different operation ID
        // cannot bypass semantic de-duplication in the transactional store.
        const existing = this.store.get(request.operation_id);
        if (existing) {
            if (existing.request_hash !== canonicalHash(request))
                throw new Error("Operation identity conflict");
            if (existing.status === "submitting" && !existing.job_id)
                return this.store.update(existing.operation_id, (j) => ({
                    ...j,
                    status: "submission_unknown",
                    billing_state: "unknown",
                }), "duplicate_or_restart_unknown");
            return existing;
        }
        const quote = await this.quote(request, p, signal);
        if (quote.cost.basis !== "mock")
            throw new Error("Expected mock quote");
        signal.throwIfAborted();
        const job = {
            operation_id: request.operation_id,
            provider: quote.provider,
            model_version: request.model_version,
            job_id: null,
            request_hash: canonicalHash(request),
            input_revisions: request.input_revisions,
            status: "submitting",
            billing_state: "reserved",
            reserved: quote.cost,
            receipts: [],
            artifacts: [],
            request,
        };
        const { operation_id: _, ...semantic } = request;
        const reserved = this.store.reserve(job, canonicalHash(semantic));
        if (!reserved.created)
            return reserved.job;
        try {
            const result = SubmitResultSchema.parse(await this.provider.submit(request, signal));
            return this.store.update(job.operation_id, (j) => {
                if (result.status === "accepted") {
                    j.job_id = result.job_id;
                    j.status = "queued";
                    this.receipts(j, result.receipts);
                }
                else if (result.status === "rejected") {
                    j.status = "failed";
                    this.receipts(j, result.receipts);
                }
                else {
                    j.status = "submission_unknown";
                    j.billing_state = "unknown";
                }
                return j;
            }, "submit_result");
        }
        catch (error) {
            // Conservatively unknown even if an adapter threw before sending. Never auto-resubmit.
            return this.store.update(job.operation_id, (j) => ({
                ...j,
                status: "submission_unknown",
                billing_state: "unknown",
            }), "submit_unknown");
        }
    }
    receipts(j, receipts) {
        for (const r of receipts) {
            const old = j.receipts.find((x) => x.receipt_id === r.receipt_id);
            if (old && canonicalHash(old) !== canonicalHash(r))
                throw new Error("Conflicting receipt identity");
            if (r.cost.basis !== "unknown" &&
                (r.cost.basis !== "mock" ||
                    r.cost.currency !== j.reserved.currency ||
                    !Number.isSafeInteger(r.cost.amount_micros)))
                throw new Error("Receipt billing unit mismatch");
            if (!old)
                j.receipts.push(r);
        }
        j.billing_state =
            j.receipts.some((r) => r.final) &&
                j.receipts.every((r) => r.cost.basis !== "unknown")
                ? "settled"
                : "unknown";
    }
    known(id) {
        const job = this.store.get(id);
        if (!job)
            throw new Error("Unknown operation");
        return job;
    }
    async poll(id, signal) {
        signal.throwIfAborted();
        const job = this.known(id);
        if (!job.job_id) {
            if (job.status === "submitting")
                return this.store.update(id, (j) => ({
                    ...j,
                    status: "submission_unknown",
                    billing_state: "unknown",
                }), "recover_unknown");
            return job;
        }
        const result = PollResultSchema.parse(await this.provider.poll(job.job_id, signal));
        if (result.job_id !== job.job_id)
            throw new Error("Poll job identity mismatch");
        return this.store.update(id, (j) => {
            this.receipts(j, result.receipts);
            if (result.status !== "unknown" &&
                !["needs_review", "succeeded", "failed", "cancelled"].includes(j.status))
                j.status = result.status;
            return j;
        }, "poll_result");
    }
    async cancel(id, signal) {
        signal.throwIfAborted();
        const job = this.known(id);
        if (!job.job_id)
            return { job, cancel_status: "unknown_no_job_id" };
        if (["succeeded", "failed", "cancelled", "needs_review"].includes(job.status))
            return { job, cancel_status: "already_terminal" };
        const caps = ProviderCapabilitiesSchema.parse(await this.provider.capabilities(signal));
        if (caps.cancel !== "supported")
            return {
                job,
                cancel_status: `${caps.cancel}: remote may still run and bill`,
            };
        const result = CancelResultSchema.parse(await this.provider.cancel(job.job_id, signal));
        if (result.job_id !== job.job_id)
            throw new Error("Cancel identity mismatch");
        return {
            job: this.store.update(id, (j) => {
                this.receipts(j, result.receipts);
                if (result.status === "cancelled" ||
                    result.status === "cancel_requested")
                    j.status = result.status;
                return j;
            }, "cancel_result"),
            cancel_status: result.status,
        };
    }
    async collect(id, signal) {
        signal.throwIfAborted();
        const job = this.known(id);
        if (!job.job_id || !["succeeded", "needs_review"].includes(job.status))
            throw new Error("Remote generation is not complete");
        const result = CollectResultSchema.parse(await this.provider.collect(job.job_id, signal));
        if (result.job_id !== job.job_id)
            throw new Error("Collect job identity mismatch");
        if (result.status !== "collected" || result.artifacts.length === 0)
            throw new Error(`Media unavailable: ${result.status}`);
        for (const a of result.artifacts) {
            if (a.operation_id !== id || !["mock", "fixture"].includes(a.evidence))
                throw new Error("Artifact operation/evidence mismatch");
            assertCurrent(job.input_revisions, a.input_revisions);
            assertCurrent(a.input_revisions, job.input_revisions);
            if (a.expires_at && Date.parse(a.expires_at) <= Date.now())
                throw new Error("Artifact expired");
            const path = a.uri.startsWith("file:") ? fileURLToPath(a.uri) : a.uri;
            if (!path.startsWith("/"))
                throw new Error("Collected artifact must be local");
            const data = await readFile(path, { signal });
            if (createHash("sha256").update(data).digest("hex") !== a.sha256)
                throw new Error("Artifact hash mismatch");
        }
        return this.store.update(id, (j) => {
            this.receipts(j, result.receipts);
            j.artifacts = result.artifacts;
            j.status = "needs_review";
            return j;
        }, "media_collected_not_quality_passed");
    }
}
