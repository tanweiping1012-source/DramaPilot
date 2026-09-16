import { randomUUID } from "node:crypto";
import { resolve, join } from "node:path";
import { mkdir, writeFile, readFile, rm, link } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { MockGenerationProvider, loadFixtureShotMap, } from "../providers/mock.js";
import { concatenateFixture, mediaHash, runMedia, defaultTools, } from "../media/local.js";
import { resolveFrames, renderSrt } from "../media/timeline.js";
import { familyFixture } from "../contracts/fixture.js";
import { currentRevisions, validateEpisode, canonicalHash, } from "../contracts/validate.js";
import { saveAdaptation, readAdaptation } from "../adaptation/service.js";
import { OfflineAuthorization } from "./authorization.js";
import { JobStore } from "./store.js";
import { JobOrchestrator } from "./jobs.js";
import { exportReview, reviewReport } from "../review/report.js";
export async function createRuntime(options) {
    const root = resolve(options.runtimeDir);
    await mkdir(root, { recursive: true });
    const fixtureByShot = options.fixtureDir
        ? await loadFixtureShotMap(options.fixtureDir)
        : undefined;
    const provider = new MockGenerationProvider({
        storeDir: join(root, "mock-remote"),
        quoteMicros: 1_000_000,
        ...(fixtureByShot ? { fixtureByShot } : {}),
    });
    const store = new JobStore(join(root, "jobs.sqlite"), {
        basis: "mock",
        currency: "USD",
        amount_micros: 10_000_000,
    });
    const authorization = new OfflineAuthorization([provider]);
    authorization.approveFixture(familyFixture);
    if (!store.db.prepare("SELECT revision FROM adaptations LIMIT 1").get())
        saveAdaptation(store, familyFixture);
    const jobs = new JobOrchestrator(store, provider, authorization);
    return {
        root,
        store,
        provider,
        authorization,
        jobs,
        close: () => store.close(),
        async review() {
            const path = join(root, "review.html");
            const report = await exportReview(path, readAdaptation(store), store.list());
            return { path, report };
        },
        async assemble(signal) {
            signal.throwIfAborted();
            const p = readAdaptation(store);
            const all = store.list();
            const artifacts = p.plans.map((plan) => {
                const found = all
                    .filter((j) => j.request.shot_id === plan.shot_id && j.status === "needs_review")
                    .flatMap((j) => j.artifacts)
                    .filter((a) => a.kind === "video" || a.kind === "lip_sync");
                const artifact = found
                    .reverse()
                    .find((a) => a.input_revisions.some((r) => r.kind === "shot" &&
                    r.id === plan.shot_id &&
                    r.revision === plan.revision));
                if (!artifact?.probe)
                    throw new Error(`No collected video for ${plan.shot_id}`);
                return artifact;
            });
            const probe = artifacts[0].probe;
            const timeline = resolveFrames(artifacts.map((a, i) => ({
                shotId: p.plans[i].shot_id,
                frames: a.probe.frame_count,
            })));
            if (artifacts.some((a) => a.probe.fps_num !== probe.fps_num ||
                a.probe.fps_den !== probe.fps_den))
                throw new Error("Normalize frame rates before assembly");
            const episode = validateEpisode({
                revision: p.revision,
                shot_assets: artifacts,
                dialogue_stems: [],
                me_stems: [],
                subtitles: [],
                input_revisions: currentRevisions(p),
                resolved_timeline: {
                    fps_num: probe.fps_num,
                    fps_den: probe.fps_den,
                    segments: timeline.map((s, i) => ({
                        shot_id: s.shotId,
                        artifact_id: artifacts[i].artifact_id,
                        in_frame: s.startFrame,
                        out_frame: s.endFrame,
                    })),
                },
                qa_report: reviewReport(all),
            }, p);
            for (const a of artifacts) {
                const path = a.uri.startsWith("file:") ? fileURLToPath(a.uri) : a.uri;
                if ((await mediaHash(path, signal)) !== a.sha256)
                    throw new Error("Collected media changed before assembly");
            }
            const output = join(root, `fixture-episode-r${p.revision}.mp4`), manifest = join(root, `episode-r${p.revision}.json`);
            try {
                const old = JSON.parse(await readFile(manifest, "utf8"));
                if (canonicalHash(old.episode) !== canonicalHash(episode) ||
                    (await mediaHash(output, signal)) !== old.sha256)
                    throw new Error("Existing episode identity mismatch");
                return old;
            }
            catch (e) {
                if (e.code !== "ENOENT")
                    throw e;
            }
            signal.throwIfAborted();
            const temporary = join(root, `fixture-r${p.revision}-${randomUUID()}.mp4`);
            try {
                const media = await concatenateFixture(artifacts.map((a) => a.uri.startsWith("file:") ? fileURLToPath(a.uri) : a.uri), temporary, defaultTools, signal);
                await runMedia(defaultTools.ffmpeg, ["-nostdin", "-v", "error", "-i", temporary, "-f", "null", "-"], signal);
                const srt = renderSrt(timeline, timeline.map((s) => ({
                    shotId: s.shotId,
                    startFrame: 0,
                    endFrame: s.endFrame - s.startFrame,
                    text: `FIXTURE ONLY ${s.shotId}: test tone, not English performance`,
                })), { numerator: probe.fps_num, denominator: probe.fps_den });
                await writeFile(join(root, `fixture-episode-r${p.revision}.srt`), srt);
                signal.throwIfAborted();
                await link(temporary, output); // atomic no-overwrite publication
                const result = {
                    episode,
                    path: output,
                    sha256: media.sha256,
                    evidence: "fixture",
                    decoded: true,
                };
                await writeFile(manifest, JSON.stringify(result, null, 2));
                return result;
            }
            finally {
                await rm(temporary, { force: true });
            }
        },
    };
}
