import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MockGenerationProvider, type MockScenario } from './mock.js';
import { familyFixture } from '../contracts/fixture.js';
import { currentRevisions, validateRequest, canonicalHash } from '../contracts/validate.js';
import { SubmitResultSchema, PollResultSchema, CancelResultSchema, CollectResultSchema, type GenerationRequest } from '../contracts/index.js';
const signal = new AbortController().signal;
function request(): GenerationRequest {
  const plan = familyFixture.plans[0]!;
  const lines = familyFixture.lines.filter(l => plan.line_revisions.some(r => r.id === l.line_id));
  return validateRequest({ operation_id: 'op-1', project_id: familyFixture.project.project_id, shot_id: plan.shot_id, task: 'video', model_version: 'offline-v1', evidence: 'mock', input_artifacts: [], input_revisions: currentRevisions(familyFixture), plan, parameters: { prompt: 'FIXTURE ONLY', seed: null, audio_mode: 'none', driving_audio_artifact_id: null, dialogue: lines.map(l => ({ line_ref: { kind: 'line', id: l.line_id, revision: l.revision }, speaker_ref: { kind: 'character', id: l.speaker_character_id, revision: 1 }, target_text: l.target_text, voice_ref: null, emotion: l.emotion, pronunciation: l.pronunciation, duration_budget_ms: l.duration_budget_ms })) } }, familyFixture);
}
async function setup(scenario: MockScenario, fn: (provider: MockGenerationProvider, dir: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), 'dp-mock space-'));
  try { await fn(new MockGenerationProvider({ storeDir: dir, scenario }), dir); } finally { await rm(dir, { recursive: true }); }
}
async function submit(provider: MockGenerationProvider) { const result = SubmitResultSchema.parse(await provider.submit(request(), signal)); assert.equal(result.status, 'accepted'); if (result.status !== 'accepted') throw new Error('Missing ID'); return result.job_id; }
async function finish(provider: MockGenerationProvider, id: string) { for (let i = 0; i < 3; i++) await provider.poll(id, signal); }
test('quote binds canonical exact request and explicitly simulated zero', async () => setup('success', async p => {
  const q = await p.quote(request(), signal); assert.equal(q.request_hash, canonicalHash(request())); assert.deepEqual(q.cost, { currency: 'USD', amount_micros: 0, basis: 'mock' });
}));
test('queued/running/succeeded and collection use contract; report is never fake video', async () => setup('success', async p => {
  const id = await submit(p);
  assert.equal((await p.collect(id, signal)).status, 'pending');
  for (const expected of ['queued', 'running', 'succeeded']) assert.equal(PollResultSchema.parse(await p.poll(id, signal)).status, expected);
  const collection = CollectResultSchema.parse(await p.collect(id, signal));
  assert.equal(collection.status, 'collected'); assert.equal(collection.artifacts[0]!.kind, 'report'); assert.equal(collection.artifacts[0]!.evidence, 'mock');
  assert.deepEqual(collection.artifacts[0]!.input_revisions, request().input_revisions);
  assert.equal((await p.diagnostics()).submitCount, 1);
}));
test('receipt loss persists remote acceptance across instance restart with no fabricated ID', async () => setup('lost_receipt', async (p, dir) => {
  assert.equal((await p.submit(request(), signal)).status, 'submission_unknown');
  const restarted = new MockGenerationProvider({ storeDir: dir });
  const diagnostics = await restarted.diagnostics(); assert.equal(diagnostics.submitCount, 1);
  assert.ok(diagnostics.events[0]!.jobId); // Test operator sees remote logs; caller must not infer a receipt.
  assert.equal((await readFile(join(dir, 'remote.json'), 'utf8')).includes('op-1'), true);
}));
test('poll timeout survives persistence and recovery polls same ID without submit', async () => setup('poll_timeout', async (p, dir) => {
  const id = await submit(p); await assert.rejects(p.poll(id, signal), /MOCK_POLL_TIMEOUT/);
  const restarted = new MockGenerationProvider({ storeDir: dir }); await finish(restarted, id);
  assert.equal((await restarted.collect(id, signal)).status, 'collected');
  assert.equal((await restarted.diagnostics()).submitCount, 1); assert.equal((await restarted.diagnostics()).pollCount, 4);
}));
test('unsupported cancellation leaves remote running; requested cancellation is not settled', async () => {
  await setup('cancel_unsupported', async p => { const id = await submit(p); assert.equal(CancelResultSchema.parse(await p.cancel(id, signal)).status, 'unsupported'); await finish(p, id); assert.equal((await p.collect(id, signal)).status, 'collected'); });
  await setup('cancel_pending', async p => { const id = await submit(p); const cancelled = await p.cancel(id, signal); assert.equal(cancelled.status, 'cancel_requested'); assert.deepEqual(cancelled.receipts, []); assert.equal((await p.poll(id, signal)).status, 'cancelled'); });
});
test('failed and expired jobs never cause collection to submit again', async () => {
  for (const scenario of ['failed', 'artifact_expired'] as const) await setup(scenario, async p => { const id = await submit(p); await finish(p, id); assert.equal((await p.collect(id, signal)).status, scenario === 'failed' ? 'failed' : 'expired'); assert.equal((await p.diagnostics()).submitCount, 1); });
});
test('changed collected bytes are rejected without regeneration', async () => setup('success', async p => {
  const id = await submit(p); await finish(p, id); const a = (await p.collect(id, signal)).artifacts[0]!;
  await writeFile(fileURLToPath(a.uri), 'corrupted'); await assert.rejects(p.collect(id, signal), /hash mismatch/); assert.equal((await p.diagnostics()).submitCount, 1);
}));
test('raw provider is not idempotent: duplicate submit remains visible to test A safeguards', async () => setup('success', async p => {
  const ids = await Promise.all([submit(p), submit(p)]); assert.notEqual(ids[0], ids[1]); assert.equal((await p.diagnostics()).submitCount, 2);
}));
test('aborted and live inputs do not submit', async () => setup('success', async p => {
  const controller = new AbortController(); controller.abort(); await assert.rejects(p.submit(request(), controller.signal));
  await assert.rejects(p.submit({ ...request(), evidence: 'live' }, signal), /only fixture/); assert.equal((await p.diagnostics()).submitCount, 0);
}));
