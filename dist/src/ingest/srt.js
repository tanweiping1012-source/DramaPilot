export function parseSrt(text, videoDurationMs) {
    if (!Number.isSafeInteger(videoDurationMs) || videoDurationMs <= 0)
        throw new Error("Invalid subtitle video duration");
    if (!text.length || text.includes("\0") || /\r(?!\n)/.test(text))
        throw new Error("SRT must contain nonempty text with LF or CRLF lines");
    const lines = [];
    const pattern = /([^\r\n]*)(\r\n|\n|$)/g;
    for (let match; (match = pattern.exec(text)) && match[0];) {
        const raw = match[1];
        lines.push({ text: lines.length === 0 ? raw.replace(/^\uFEFF/, "") : raw, start: match.index, end: match.index + raw.length });
    }
    let cursor = 0;
    const cues = [], overlaps = [];
    const toMs = (h, m, s, ms) => Number(h) * 3600000 + Number(m) * 60000 + Number(s) * 1000 + Number(ms);
    while (cursor < lines.length) {
        while (lines[cursor]?.text.trim() === "")
            cursor++;
        if (cursor >= lines.length)
            break;
        const indexLine = lines[cursor++];
        if (!/^[1-9]\d*$/.test(indexLine.text) || Number(indexLine.text) !== cues.length + 1)
            throw new Error("SRT indices must be consecutive starting at 1");
        const timeline = lines[cursor++]?.text;
        const match = timeline?.match(/^(\d{2}):([0-5]\d):([0-5]\d),(\d{3}) --> (\d{2}):([0-5]\d):([0-5]\d),(\d{3})$/);
        if (!match)
            throw new Error("Invalid SRT timestamp; expected HH:MM:SS,mmm --> HH:MM:SS,mmm");
        const start = toMs(match[1], match[2], match[3], match[4]);
        const end = toMs(match[5], match[6], match[7], match[8]);
        if (end <= start || end > videoDurationMs)
            throw new Error("SRT time interval out of video bounds");
        if (cues.length && start < cues[cues.length - 1].start_ms)
            throw new Error("SRT cues must be ordered by start time");
        const first = cursor;
        while (cursor < lines.length && lines[cursor].text.trim() !== "")
            cursor++;
        if (first === cursor)
            throw new Error("SRT cue text is empty");
        const startChar = lines[first].start, endChar = lines[cursor - 1].end;
        const cue = { index: cues.length + 1, start_ms: start, end_ms: end, text: text.slice(startChar, endChar), start_char: startChar, end_char_exclusive: endChar, speaker: null };
        for (const earlier of cues)
            if (earlier.end_ms > start)
                overlaps.push({ first: earlier.index, second: cue.index });
        cues.push(cue);
        if (cues.length > 10000 || overlaps.length > 10000)
            throw new Error("SRT cue/overlap limit exceeded");
    }
    if (!cues.length)
        throw new Error("SRT contains no cues");
    return { cues, overlaps, offset_unit: "utf16_code_units" };
}
