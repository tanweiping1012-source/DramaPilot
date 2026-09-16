/** A-owned orchestration test double; production mock provider belongs to B. */
import { appendFileSync, mkdirSync, writeFileSync, readFileSync, existsSync, } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { familyFixture, fixtureCapabilities } from "../contracts/fixture.js";
import { canonicalHash, currentRevisions } from "../contracts/validate.js";
export function requestFixture(operation = "op-1", shot = "s1") {
    const plan = familyFixture.plans.find((p) => p.shot_id === shot);
    return {
        operation_id: operation,
        project_id: familyFixture.project.project_id,
        shot_id: shot,
        task: "video",
        model_version: fixtureCapabilities.model_version,
        evidence: "mock",
        input_artifacts: [],
        input_revisions: currentRevisions(familyFixture).filter((r) => ["source", "adaptation", "locale"].includes(r.kind) ||
            (r.kind === "shot" && r.id === shot) ||
            plan.target_character_revisions.some((c) => c.kind === r.kind && c.id === r.id) ||
            plan.line_revisions.some((c) => c.kind === r.kind && c.id === r.id)),
        plan,
        parameters: {
            prompt: "offline fixture",
            seed: null,
            audio_mode: "separate",
            driving_audio_artifact_id: null,
            dialogue: plan.line_revisions.map((ref) => {
                const line = familyFixture.lines.find((l) => l.line_id === ref.id);
                return {
                    line_ref: ref,
                    speaker_ref: plan.target_character_revisions[0],
                    target_text: line.target_text,
                    voice_ref: null,
                    emotion: line.emotion,
                    pronunciation: line.pronunciation,
                    duration_budget_ms: line.duration_budget_ms,
                };
            }),
        },
    };
}
export class TestProvider {
    dir;
    scenario;
    cost;
    beforeSubmit;
    constructor(dir, scenario = "success", cost = 1_000_000, beforeSubmit) {
        this.dir = dir;
        this.scenario = scenario;
        this.cost = cost;
        this.beforeSubmit = beforeSubmit;
        mkdirSync(dir, { recursive: true });
    }
    record(method) {
        appendFileSync(join(this.dir, "calls.jsonl"), JSON.stringify({ method, pid: process.pid }) + "\n");
    }
    count(method) {
        const p = join(this.dir, "calls.jsonl");
        return existsSync(p)
            ? readFileSync(p, "utf8")
                .trim()
                .split("\n")
                .filter((l) => JSON.parse(l).method === method).length
            : 0;
    }
    async capabilities(signal) {
        signal.throwIfAborted();
        return {
            ...fixtureCapabilities,
            cancel: this.scenario === "cancel_pending"
                ? "supported"
                : "unsupported",
        };
    }
    async quote(r, signal) {
        signal.throwIfAborted();
        return {
            quote_id: "q1",
            provider: fixtureCapabilities.provider,
            model_version: fixtureCapabilities.model_version,
            request_hash: canonicalHash(r),
            cost: {
                basis: "mock",
                currency: "USD",
                amount_micros: this.cost,
            },
            expires_at: null,
        };
    }
    async submit(r, signal) {
        signal.throwIfAborted();
        this.beforeSubmit?.();
        this.record("submit");
        writeFileSync(join(this.dir, `${r.operation_id}.json`), JSON.stringify(r));
        if (this.scenario === "lost_receipt")
            throw new Error("Connection lost after acceptance");
        return {
            status: "accepted",
            job_id: r.operation_id,
            receipts: [],
        };
    }
    async poll(id, signal) {
        signal.throwIfAborted();
        this.record("poll");
        if (this.scenario === "poll_timeout")
            throw new Error("Poll timeout");
        return {
            job_id: id,
            status: "succeeded",
            receipts: [],
            message: null,
        };
    }
    async cancel(id, signal) {
        signal.throwIfAborted();
        this.record("cancel");
        return { job_id: id, status: "cancel_requested", receipts: [] };
    }
    async collect(id, signal) {
        signal.throwIfAborted();
        this.record("collect");
        const r = JSON.parse(readFileSync(join(this.dir, `${id}.json`), "utf8"));
        const path = join(this.dir, `${id}.txt`);
        writeFileSync(path, "MOCK REPORT — NOT MEDIA");
        const a = {
            artifact_id: `${id}-report`,
            kind: "report",
            uri: path,
            sha256: this.scenario === "corrupt"
                ? "0".repeat(64)
                : createHash("sha256").update(readFileSync(path)).digest("hex"),
            evidence: "mock",
            input_revisions: r.input_revisions,
            operation_id: id,
            media_type: "text/plain",
            duration_ms: null,
            probe: null,
            expires_at: null,
        };
        return {
            job_id: id,
            status: "collected",
            artifacts: [a],
            receipts: [],
        };
    }
}
