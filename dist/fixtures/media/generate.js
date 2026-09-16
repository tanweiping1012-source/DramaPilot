/** Generates only synthetic color and tone signals. No people, speech or source footage. */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defaultTools, runMedia, probe, concatenateFixture } from "../../src/media/local.js";
import { resolveFrames, renderSrt } from "../../src/media/timeline.js";
const output = resolve(process.argv[2] || '.runtime/media-fixture');
await mkdir(output, { recursive: true });
const shots = [
    { shotId: 'fixture-a1', color: 'blue', frames: 50, tone: 440 },
    { shotId: 'fixture-b1', color: 'green', frames: 75, tone: 660 },
    { shotId: 'fixture-a2', color: 'red', frames: 50, tone: 440 },
];
const font = process.env.DRAMAPILOT_FIXTURE_FONT || '/System/Library/Fonts/Supplemental/Arial.ttf';
if (!/^[a-zA-Z0-9_/. -]+$/.test(font))
    throw new Error('Unsupported fixture font path');
const clips = [];
for (const shot of shots) {
    const path = resolve(output, `${shot.shotId}.mp4`);
    await runMedia(defaultTools.ffmpeg, ['-nostdin', '-v', 'error', '-n', '-f', 'lavfi', '-i', `color=c=${shot.color}:s=640x360:r=25:d=${shot.frames / 25}`, '-f', 'lavfi', '-i', `sine=frequency=${shot.tone}:sample_rate=48000:duration=${shot.frames / 25}`, '-vf', `drawtext=fontfile=${font}:text='FIXTURE ONLY - NO REAL LOCALIZATION':fontcolor=white:fontsize=20:x=20:y=170`, '-af', 'volume=0.15', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-t', String(shot.frames / 25), '-metadata', 'comment=DRAMAPILOT SYNTHETIC FIXTURE', path]);
    const metadata = await probe(path);
    const video = metadata.streams.find((s) => s.codec_type === 'video');
    if (Number(video?.nb_read_frames) !== shot.frames)
        throw new Error(`Unexpected encoded frames: ${shot.shotId}`);
    clips.push({ ...shot, path, sha256: metadata.sha256, metadata });
}
const timeline = resolveFrames(clips);
const srt = renderSrt(timeline, shots.map(s => ({ shotId: s.shotId, startFrame: 0, endFrame: s.frames, text: `FIXTURE ONLY: ${s.shotId} / test tone, no speech` })), { numerator: 25, denominator: 1 });
await writeFile(resolve(output, 'fixture.en-US.srt'), srt);
const finalPath = resolve(output, 'fixture-only.mp4');
const final = await concatenateFixture(clips.map(c => c.path), finalPath);
const finalVideo = final.streams.find((s) => s.codec_type === 'video');
if (Number(finalVideo?.nb_read_frames) !== 175)
    throw new Error('Unexpected final frame count');
await runMedia(defaultTools.ffmpeg, ['-nostdin', '-v', 'error', '-i', finalPath, '-f', 'null', '-']);
await writeFile(resolve(output, 'manifest.json'), JSON.stringify({ evidence: 'fixture_only', quality: 'not_evaluated', generatedSpeech: false, paidCalls: 0, rate: { numerator: 25, denominator: 1 }, timeline, clips, final: { path: finalPath, ...final } }, null, 2));
console.log(JSON.stringify({ output, finalSha256: final.sha256, frames: 175, quality: 'not_evaluated', evidence: 'fixture_only' }, null, 2));
