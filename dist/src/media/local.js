import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
const execute = promisify(execFile);
export const defaultTools = { ffmpeg: process.env.DRAMAPILOT_FFMPEG || 'ffmpeg', ffprobe: process.env.DRAMAPILOT_FFPROBE || 'ffprobe' };
export async function runMedia(executable, args, signal) {
    return execute(executable, args, { timeout: 120000, maxBuffer: 8 * 1024 * 1024, encoding: 'utf8', shell: false, ...(signal ? { signal } : {}) });
}
export async function mediaHash(path, signal) {
    signal?.throwIfAborted();
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(path)) {
        signal?.throwIfAborted();
        hash.update(chunk);
    }
    return hash.digest('hex');
}
export async function probe(path, tools = defaultTools, signal) {
    signal?.throwIfAborted();
    if (!(await stat(path)).isFile())
        throw new Error('Media input must be a local file');
    const { stdout } = await runMedia(tools.ffprobe, ['-v', 'error', '-protocol_whitelist', 'file,pipe', '-count_frames', '-show_streams', '-show_format', '-of', 'json', resolve(path)], signal);
    const result = JSON.parse(stdout);
    if (!Array.isArray(result.streams) || !result.streams.length)
        throw new Error('No media streams');
    return { ...result, sha256: await mediaHash(path, signal) };
}
/** Concatenate only already-normalized fixture clips. Explicit maps prevent accidental source-audio mixing. */
export async function concatenateFixture(paths, output, tools = defaultTools, signal) {
    signal?.throwIfAborted();
    if (!paths.length || paths.length > 5)
        throw new Error('Expected 1–5 clips');
    const metadata = await Promise.all(paths.map(p => probe(p, tools, signal)));
    const first = metadata[0].streams.find((s) => s.codec_type === 'video');
    if (!first)
        throw new Error('Missing video');
    for (const item of metadata) {
        const video = item.streams.find((s) => s.codec_type === 'video');
        const audio = item.streams.find((s) => s.codec_type === 'audio');
        if (!video || !audio || video.width !== first.width || video.height !== first.height || video.r_frame_rate !== first.r_frame_rate || video.avg_frame_rate !== video.r_frame_rate)
            throw new Error('Clips need matching constant frame rate video and audio');
    }
    const filter = paths.map((_, i) => `[${i}:v:0]setpts=PTS-STARTPTS[v${i}];[${i}:a:0]aresample=48000,asetpts=PTS-STARTPTS[a${i}]`).join(';') + ';' + paths.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${paths.length}:v=1:a=1[v][a]`;
    await runMedia(tools.ffmpeg, ['-nostdin', '-v', 'error', '-n', ...paths.flatMap(p => ['-protocol_whitelist', 'file,pipe', '-i', resolve(p)]), '-filter_complex', filter, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart', '-metadata', 'comment=DRAMAPILOT FIXTURE ONLY - NO REAL LOCALIZATION', resolve(output)], signal);
    return probe(output, tools, signal);
}
/** Replace the video track's audio with explicitly selected target/test stems; never mix original audio implicitly. */
export async function mixAudioStems(input, tools = defaultTools, signal) {
    signal?.throwIfAborted();
    if (!Number.isSafeInteger(input.frames) || input.frames <= 0 || !Number.isSafeInteger(input.fps) || input.fps <= 0 || input.fps > 120)
        throw new Error('Invalid output frame specification');
    if (!Number.isFinite(input.backgroundGain) || input.backgroundGain < 0 || input.backgroundGain > 1)
        throw new Error('Invalid background gain');
    const video = await probe(input.video, tools, signal), dialogue = await probe(input.dialogue, tools, signal), background = await probe(input.background, tools, signal);
    const v = video.streams.find((s) => s.codec_type === 'video');
    if (!v || v.avg_frame_rate !== `${input.fps}/1` || v.r_frame_rate !== v.avg_frame_rate || Number(v.nb_read_frames) !== input.frames)
        throw new Error('Output spec must match actual constant-frame-rate video');
    const duration = input.frames / input.fps;
    for (const [label, media] of [['dialogue', dialogue], ['background', background]]) {
        const a = media.streams.find((s) => s.codec_type === 'audio');
        if (!a || !Number.isFinite(Number(a.duration)) || Number(a.duration) <= 0)
            throw new Error(`Missing ${label} audio duration`);
        if (label === 'dialogue' && Number(a.duration) > duration + 1 / input.fps)
            throw new Error('Target dialogue exceeds video; revise shot duration explicitly');
    }
    const filter = `[1:a:0]aresample=48000,apad,atrim=duration=${duration},asetpts=PTS-STARTPTS[d];[2:a:0]aresample=48000,volume=${input.backgroundGain},apad,atrim=duration=${duration},asetpts=PTS-STARTPTS[b];[d][b]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]`;
    await runMedia(tools.ffmpeg, ['-nostdin', '-v', 'error', '-n', ...[input.video, input.dialogue, input.background].flatMap(p => ['-protocol_whitelist', 'file,pipe', '-i', resolve(p)]), '-filter_complex', filter, '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-t', String(duration), '-movflags', '+faststart', resolve(input.output)], signal);
    return probe(input.output, tools, signal);
}
