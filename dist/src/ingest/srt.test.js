import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSrt } from './srt.js';
test('SRT offsets preserve BOM, CRLF, multiline Chinese and emoji without guessing speaker', () => {
    const raw = '\uFEFF1\r\n00:00:00,100 --> 00:00:01,200\r\n甲🙂：第一行\r\n第二行\r\n';
    const r = parseSrt(raw, 2000), c = r.cues[0];
    assert.equal(c.text, '甲🙂：第一行\r\n第二行');
    assert.equal(raw.slice(c.start_char, c.end_char_exclusive), c.text);
    assert.equal(c.start_char, raw.indexOf('甲'));
    assert.equal(c.speaker, null);
    assert.equal(c.start_ms, 100);
    assert.equal(c.end_ms, 1200);
});
test('overlapping subtitles retain both cues and disclose overlap', () => {
    const r = parseSrt('1\n00:00:00,000 --> 00:00:02,000\n甲\n\n2\n00:00:01,000 --> 00:00:03,000\n乙', 3000);
    assert.deepEqual(r.overlaps, [{ first: 1, second: 2 }]);
    assert.deepEqual(r.cues.map(c => c.speaker), [null, null]);
});
test('malformed SRT cannot silently truncate or repair timestamps', () => {
    const valid = '1\n00:00:00,000 --> 00:00:01,000\n原文';
    assert.equal(parseSrt(valid, 1000).cues.length, 1);
    for (const bad of ['', valid.replace('1\n', '2\n'), valid.replace('00:01,000', '00:02,000'), valid.replace('00:01,000', '00:00,000'), valid.replace('00:01,000', '00:60,000'), valid.replace('原文', ''), valid + '\n\n1\n00:00:00,500 --> 00:00:00,800\n重复', valid + '\n\n未完成的字幕'])
        assert.throws(() => parseSrt(bad, 1000));
});
test('SRT start order is distinct from permitted overlap', () => {
    assert.throws(() => parseSrt('1\n00:00:01,000 --> 00:00:02,000\n甲\n\n2\n00:00:00,500 --> 00:00:01,500\n乙', 3000), /ordered/);
});
