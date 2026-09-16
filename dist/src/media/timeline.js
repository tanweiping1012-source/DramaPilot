function integer(value, name, min = 0) {
    if (!Number.isSafeInteger(value) || value < min)
        throw new Error(`Invalid ${name}`);
}
export function frameMs(frame, rate) {
    integer(frame, 'frame');
    integer(rate.numerator, 'rate numerator', 1);
    integer(rate.denominator, 'rate denominator', 1);
    return Math.round(frame * 1000 * rate.denominator / rate.numerator);
}
export function resolveFrames(clips) {
    if (!clips.length)
        throw new Error('Empty timeline');
    const ids = new Set();
    let cursor = 0;
    return clips.map(({ shotId, frames }) => {
        integer(frames, 'frames', 1);
        if (!shotId || ids.has(shotId))
            throw new Error('Duplicate or empty shot ID');
        ids.add(shotId);
        const startFrame = cursor;
        cursor += frames;
        integer(cursor, 'total frames');
        return { shotId, startFrame, endFrame: cursor };
    });
}
function timestamp(ms) {
    const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
}
export function renderSrt(timeline, cues, rate) {
    let previousEnd = 0;
    return cues.map((cue, index) => {
        const shot = timeline.find(s => s.shotId === cue.shotId);
        integer(cue.startFrame, 'cue start');
        integer(cue.endFrame, 'cue end', 1);
        if (!shot || cue.endFrame <= cue.startFrame || cue.endFrame > shot.endFrame - shot.startFrame)
            throw new Error('Cue outside resolved shot');
        const start = frameMs(shot.startFrame + cue.startFrame, rate), end = frameMs(shot.startFrame + cue.endFrame, rate);
        if (start < previousEnd || end <= start)
            throw new Error('Overlapping or sub-millisecond cue');
        if (!cue.text.trim() || /[\r\n\0]/.test(cue.text))
            throw new Error('Cue must be a single text line');
        previousEnd = end;
        return `${index + 1}\n${timestamp(start)} --> ${timestamp(end)}\n${cue.text}\n`;
    }).join('\n');
}
/** Convert measured target duration/cue position to frames; caller chooses containment policy. */
export function msToFrame(milliseconds, rate, rounding) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0)
        throw new Error('Invalid milliseconds');
    frameMs(0, rate);
    const value = milliseconds * rate.numerator / (1000 * rate.denominator);
    const result = rounding === 'floor' ? Math.floor(value) : rounding === 'ceil' ? Math.ceil(value) : Math.round(value);
    integer(result, 'converted frame');
    return result;
}
