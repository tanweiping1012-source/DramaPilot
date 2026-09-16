import { mkdir, readFile, writeFile, rename, rm, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { GenerationRequestSchema, ArtifactSchema } from '../contracts/index.js';
import { canonicalHash } from '../contracts/validate.js';
import { fixtureCapabilities } from '../contracts/fixture.js';
import { probe, mediaHash, defaultTools } from "../media/local.js";
/** Disk state models a surviving remote service only. No operation deduplication or budget ownership. */
export class MockGenerationProvider {
    #options;
    #directory;
    constructor(options) {
        if (options.pollTimeouts !== undefined && (!Number.isSafeInteger(options.pollTimeouts) || options.pollTimeouts < 0))
            throw new Error('Invalid poll timeout count');
        if (options.quoteMicros !== undefined && (!Number.isSafeInteger(options.quoteMicros) || options.quoteMicros < 0))
            throw new Error('Invalid mock quote');
        this.#directory = resolve(options.storeDir);
        this.#options = { ...options };
    }
    async #transaction(signal, fn) {
        signal.throwIfAborted();
        await mkdir(this.#directory, { recursive: true });
        const lock = join(this.#directory, 'remote.lock');
        let acquired = false;
        for (let attempt = 0; attempt < 100; attempt++) {
            signal.throwIfAborted();
            try {
                await mkdir(lock);
                acquired = true;
                break;
            }
            catch (error) {
                if (error.code !== 'EEXIST')
                    throw error;
            }
            await delay(10, undefined, { signal });
        }
        if (!acquired)
            throw new Error('Mock remote busy: stale lock requires explicit inspection');
        try {
            let state;
            try {
                state = JSON.parse(await readFile(join(this.#directory, 'remote.json'), 'utf8'));
            }
            catch (error) {
                if (error.code !== 'ENOENT')
                    throw error;
                state = { version: 1, jobs: {}, events: [] };
            }
            if (state.version !== 1)
                throw new Error('Unsupported mock remote state');
            let result;
            let failure;
            let failed = false;
            try {
                result = await fn(state);
            }
            catch (error) {
                failure = error;
                failed = true;
            }
            const temporary = join(this.#directory, `remote-${randomUUID()}.tmp`);
            await writeFile(temporary, JSON.stringify(state), { flag: 'wx' });
            await rename(temporary, join(this.#directory, 'remote.json'));
            if (failed)
                throw failure;
            return result;
        }
        finally {
            await rm(lock, { recursive: true });
        }
    }
    #request(value) {
        const request = GenerationRequestSchema.parse(value);
        if (!['mock', 'fixture'].includes(request.evidence) || request.input_artifacts.some(a => !['mock', 'fixture'].includes(a.evidence)))
            throw new Error('Mock provider accepts only fixture/mock inputs');
        if (request.model_version !== fixtureCapabilities.model_version || request.plan.provider_capabilities.provider !== fixtureCapabilities.provider)
            throw new Error('Mock provider/model mismatch');
        return request;
    }
    #receipt(job) {
        return [{ receipt_id: `mock-receipt-${job.id}`, cost: { currency: 'USD', amount_micros: job.quoteMicros, basis: 'mock' }, final: true, evidence_ref: `mock://accounting/${job.id}` }];
    }
    async capabilities(signal) {
        signal.throwIfAborted();
        return { ...fixtureCapabilities, cancel: this.#options.scenario === 'cancel_pending' ? 'supported' : 'unsupported' };
    }
    async quote(request, signal) {
        signal.throwIfAborted();
        const validated = this.#request(request);
        return { quote_id: `mock-quote-${canonicalHash(validated)}`, provider: fixtureCapabilities.provider, model_version: fixtureCapabilities.model_version, request_hash: canonicalHash(validated), cost: { currency: 'USD', amount_micros: this.#options.quoteMicros ?? 0, basis: 'mock' }, expires_at: null };
    }
    async submit(request, signal) {
        const validated = this.#request(request);
        signal.throwIfAborted();
        await this.#options.onSubmit?.(validated);
        signal.throwIfAborted();
        return this.#transaction(signal, state => {
            const id = `mock-job-${randomUUID()}`;
            const scenario = this.#options.scenario ?? 'success';
            state.events.push({ method: 'submit', jobId: id, operationId: validated.operation_id });
            state.jobs[id] = { id, request: validated, scenario, polls: 0, timeoutsRemaining: scenario === 'poll_timeout' ? this.#options.pollTimeouts ?? 1 : 0, status: 'queued', cancelRequested: false, artifact: null, fixturePath: ['video', 'lip_sync', 'assembly'].includes(validated.task) ? this.#options.fixtureByShot?.[validated.shot_id] ?? null : null, quoteMicros: this.#options.quoteMicros ?? 0 };
            return scenario === 'lost_receipt' ? { status: 'submission_unknown', reason: 'Mock accepted request but receipt was lost' } : { status: 'accepted', job_id: id, receipts: [] };
        });
    }
    async poll(jobId, signal) {
        const result = await this.#transaction(signal, state => {
            const job = state.jobs[jobId];
            state.events.push({ method: 'poll', jobId, operationId: job?.request.operation_id ?? null });
            if (!job)
                return { job_id: jobId, status: 'unknown', receipts: [], message: 'Unknown mock job', timeout: false };
            if (job.timeoutsRemaining > 0) {
                job.timeoutsRemaining--;
                return { job_id: jobId, status: job.status, receipts: [], message: null, timeout: true };
            }
            if (!['succeeded', 'failed', 'cancelled'].includes(job.status)) {
                job.polls++;
                job.status = job.cancelRequested ? 'cancelled' : job.polls === 1 ? 'queued' : job.polls === 2 ? 'running' : job.scenario === 'failed' ? 'failed' : 'succeeded';
            }
            return { job_id: jobId, status: job.status, receipts: ['succeeded', 'failed', 'cancelled'].includes(job.status) ? this.#receipt(job) : [], message: null, timeout: false };
        });
        if (result.timeout)
            throw new Error('MOCK_POLL_TIMEOUT');
        const { timeout: _, ...response } = result;
        return response;
    }
    async cancel(jobId, signal) {
        return this.#transaction(signal, state => {
            const job = state.jobs[jobId];
            state.events.push({ method: 'cancel', jobId, operationId: job?.request.operation_id ?? null });
            if (!job)
                return { job_id: jobId, status: 'unknown', receipts: [] };
            if (job.scenario !== 'cancel_pending')
                return { job_id: jobId, status: 'unsupported', receipts: [] };
            if (job.status === 'cancelled')
                return { job_id: jobId, status: 'cancelled', receipts: this.#receipt(job) };
            if (['succeeded', 'failed'].includes(job.status))
                return { job_id: jobId, status: 'unknown', receipts: this.#receipt(job) };
            job.cancelRequested = true;
            return { job_id: jobId, status: 'cancel_requested', receipts: [] };
        });
    }
    async collect(jobId, signal) {
        return this.#transaction(signal, async (state) => {
            const job = state.jobs[jobId];
            state.events.push({ method: 'collect', jobId, operationId: job?.request.operation_id ?? null });
            if (!job || ['failed', 'cancelled'].includes(job.status))
                return { job_id: jobId, status: 'failed', artifacts: [], receipts: job ? this.#receipt(job) : [] };
            if (job.status !== 'succeeded')
                return { job_id: jobId, status: 'pending', artifacts: [], receipts: [] };
            if (job.scenario === 'artifact_expired')
                return { job_id: jobId, status: 'expired', artifacts: [], receipts: this.#receipt(job) };
            if (!job.artifact) {
                const path = join(this.#directory, `${job.id}${job.fixturePath ? '.mp4' : '.json'}`);
                let mediaProbe = null, duration = null;
                if (job.fixturePath) {
                    await copyFile(job.fixturePath, path);
                    const metadata = await probe(path, this.#options.tools ?? defaultTools, signal);
                    const video = metadata.streams.find((s) => s.codec_type === 'video');
                    if (!video || video.r_frame_rate !== video.avg_frame_rate)
                        throw new Error('Fixture must have constant frame rate video');
                    const [num, den] = String(video.avg_frame_rate).split('/').map(Number);
                    mediaProbe = { fps_num: num, fps_den: den, frame_count: Number(video.nb_read_frames), width: Number(video.width), height: Number(video.height) };
                    duration = Math.round(mediaProbe.frame_count * 1000 * mediaProbe.fps_den / mediaProbe.fps_num);
                }
                else {
                    await writeFile(path, JSON.stringify({ evidence: 'mock', media_generated: false, job_id: job.id, request_hash: canonicalHash(job.request), quality: 'unverified' }));
                }
                job.artifact = ArtifactSchema.parse({ artifact_id: `artifact-${job.id}`, kind: job.fixturePath ? 'video' : 'report', uri: pathToFileURL(path).href, sha256: await mediaHash(path, signal), evidence: job.fixturePath ? 'fixture' : 'mock', input_revisions: job.request.input_revisions, operation_id: job.request.operation_id, media_type: job.fixturePath ? 'video/mp4' : 'application/json', duration_ms: duration, probe: mediaProbe, expires_at: null });
            }
            // Cached collection still verifies bytes; never regenerate missing or changed output.
            const path = new URL(job.artifact.uri);
            if (await mediaHash(fileURLToPath(path), signal) !== job.artifact.sha256)
                throw new Error('Collected mock artifact hash mismatch');
            return { job_id: jobId, status: 'collected', artifacts: [job.artifact], receipts: this.#receipt(job) };
        });
    }
    async diagnostics() {
        return this.#transaction(new AbortController().signal, state => ({ submitCount: state.events.filter(e => e.method === 'submit').length, pollCount: state.events.filter(e => e.method === 'poll').length, cancelCount: state.events.filter(e => e.method === 'cancel').length, collectCount: state.events.filter(e => e.method === 'collect').length, events: structuredClone(state.events) }));
    }
}
export function loadFixtureShotMap(directory) {
    return { s1: resolve(directory, 'fixture-a1.mp4'), s2: resolve(directory, 'fixture-b1.mp4'), s3: resolve(directory, 'fixture-a2.mp4') };
}
