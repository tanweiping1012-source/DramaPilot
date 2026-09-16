/** Direct B adapter/media smoke; not DSH or A orchestration acceptance. */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MockGenerationProvider, loadFixtureShotMap } from './mock.js';
import { familyFixture } from '../contracts/fixture.js';
import { validateRequest, currentRevisions, validateEpisode } from '../contracts/validate.js';
import { concatenateFixture, mixAudioStems } from "../media/local.js";
import { resolveFrames, renderSrt } from "../media/timeline.js";
const fixtureDirectory = process.argv[2], target = process.argv[3];
if (!fixtureDirectory || !target)
    throw new Error('Usage: node dist/src/providers/smoke.js <B fixture directory> <new output directory>');
const directory = resolve(target);
await mkdir(directory); // Refuse accidental rerun/overwrite.
const provider = new MockGenerationProvider({ storeDir: join(directory, 'remote'), fixtureByShot: loadFixtureShotMap(fixtureDirectory) });
const signal = new AbortController().signal;
const artifacts = [];
for (const plan of familyFixture.plans) {
    const lines = familyFixture.lines.filter(l => plan.line_revisions.some(r => r.id === l.line_id));
    const request = validateRequest({ operation_id: `smoke-${plan.shot_id}`, project_id: familyFixture.project.project_id, shot_id: plan.shot_id, task: 'video', model_version: 'offline-v1', evidence: 'fixture', input_artifacts: [], input_revisions: currentRevisions(familyFixture), plan, parameters: { prompt: 'SYNTHETIC FIXTURE ONLY', seed: null, audio_mode: 'none', driving_audio_artifact_id: null, dialogue: lines.map(l => ({ line_ref: { kind: 'line', id: l.line_id, revision: l.revision }, speaker_ref: { kind: 'character', id: l.speaker_character_id, revision: 1 }, target_text: l.target_text, voice_ref: null, emotion: l.emotion, pronunciation: l.pronunciation, duration_budget_ms: l.duration_budget_ms })) } }, familyFixture);
    const result = await provider.submit(request, signal);
    if (result.status !== 'accepted')
        throw new Error('Smoke submit failed');
    for (let i = 0; i < 3; i++)
        await provider.poll(result.job_id, signal);
    const collected = await provider.collect(result.job_id, signal);
    if (collected.status !== 'collected' || !collected.artifacts[0]?.probe)
        throw new Error('Missing probed fixture');
    artifacts.push(collected.artifacts[0]);
}
const timeline = resolveFrames(artifacts.map((a, i) => ({ shotId: familyFixture.plans[i].shot_id, frames: a.probe.frame_count })));
const episode = validateEpisode({ revision: familyFixture.revision, shot_assets: artifacts, dialogue_stems: [], me_stems: [], subtitles: [], input_revisions: currentRevisions(familyFixture), resolved_timeline: { fps_num: 25, fps_den: 1, segments: timeline.map((s, i) => ({ shot_id: s.shotId, artifact_id: artifacts[i].artifact_id, in_frame: s.startFrame, out_frame: s.endFrame })) }, qa_report: { evidence: 'fixture', technical: 'unverified', visual: 'unverified', language: 'unverified', culture: 'unverified', issues: ['Synthetic color and tone fixture; no localization or DSH quality claim'] } }, familyFixture);
const srt = renderSrt(timeline, timeline.map(t => ({ shotId: t.shotId, startFrame: 0, endFrame: t.endFrame - t.startFrame, text: `FIXTURE ONLY ${t.shotId}` })), { numerator: 25, denominator: 1 });
await writeFile(join(directory, 'fixture.srt'), srt);
const final = await concatenateFixture(artifacts.map(a => fileURLToPath(a.uri)), join(directory, 'assembled-fixture.mp4'));
const mixed = await mixAudioStems({ video: join(directory, 'assembled-fixture.mp4'), dialogue: join(fixtureDirectory, 'fixture-only.mp4'), background: join(fixtureDirectory, 'fixture-only.mp4'), output: join(directory, 'explicit-stems-fixture.mp4'), frames: 175, fps: 25, backgroundGain: 0.1 });
const diagnostics = await provider.diagnostics();
if (diagnostics.submitCount !== 3)
    throw new Error('Unexpected submit count');
const evidence = { contract: '0.2.1', scope: 'B direct adapter/media smoke only', paidCalls: 0, diagnostics, episode, final, mixed };
await writeFile(join(directory, 'evidence.json'), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ directory, submits: diagnostics.submitCount, artifactCount: artifacts.length, finalSha256: final.sha256, mixedSha256: mixed.sha256, quality: 'unverified' }, null, 2));
