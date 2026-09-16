import test from 'node:test';
import assert from 'node:assert/strict';
import { frameMs, resolveFrames, renderSrt } from './timeline.ts';
test('final clip durations, not source timestamps, determine subtitles', () => {
  const timeline = resolveFrames([{ shotId: 'a', frames: 75 }, { shotId: 'b', frames: 50 }]);
  assert.deepEqual(timeline[1], { shotId: 'b', startFrame: 75, endFrame: 125 });
  assert.match(renderSrt(timeline, [{ shotId: 'b', startFrame: 0, endFrame: 25, text: 'FIXTURE ONLY' }], { numerator: 25, denominator: 1 }), /00:00:03,000 --> 00:00:04,000/);
});
test('fractional rates round absolute frames without per-clip accumulated drift', () => {
  assert.equal(frameMs(30000, { numerator: 30000, denominator: 1001 }), 1001000);
});
test('invalid boundaries, duplicate shots and subtitle payloads fail closed', () => {
  assert.throws(() => resolveFrames([{ shotId: 'a', frames: 2.5 }]));
  assert.throws(() => resolveFrames([{ shotId: 'a', frames: 2 }, { shotId: 'a', frames: 2 }]));
  const timeline = resolveFrames([{ shotId: 'a', frames: 25 }]);
  for (const cue of [{ startFrame: 0, endFrame: 26, text: 'x' }, { startFrame: 2, endFrame: 1, text: 'x' }, { startFrame: 0, endFrame: 2, text: 'x\n\n2' }]) assert.throws(() => renderSrt(timeline, [{ shotId: 'a', ...cue }], { numerator: 25, denominator: 1 }));
});
test('longer target dialogue shifts every following shot using actual generated frames', () => {
  const original = resolveFrames([{ shotId: 'a', frames: 25 }, { shotId: 'b', frames: 25 }]);
  const revised = resolveFrames([{ shotId: 'a', frames: 40 }, { shotId: 'b', frames: 25 }]);
  const cue = [{ shotId: 'b', startFrame: 0, endFrame: 25, text: 'Synthetic cue' }];
  const rate = { numerator: 25, denominator: 1 };
  assert.match(renderSrt(original, cue, rate), /00:00:01,000 --> 00:00:02,000/);
  assert.match(renderSrt(revised, cue, rate), /00:00:01,600 --> 00:00:02,600/);
});
test('zero, negative, infinite durations and overlapping subtitles are rejected', () => {
  for (const frames of [0, -1, NaN, Infinity]) assert.throws(() => resolveFrames([{ shotId: 'a', frames }]));
  const timeline = resolveFrames([{ shotId: 'a', frames: 25 }]);
  assert.throws(() => renderSrt(timeline, [{ shotId: 'a', startFrame: 0, endFrame: 20, text: 'a' }, { shotId: 'a', startFrame: 19, endFrame: 25, text: 'b' }], { numerator: 25, denominator: 1 }));
});
test('fractional milliseconds map explicitly to contained frame boundaries', async () => {
  const { msToFrame } = await import('./timeline.ts');
  const rate = { numerator: 30000, denominator: 1001 };
  assert.equal(msToFrame(1001.5, rate, 'floor'), 30);
  assert.equal(msToFrame(1001.5, rate, 'ceil'), 31);
  assert.throws(() => msToFrame(-0.1, rate, 'ceil'));
});
