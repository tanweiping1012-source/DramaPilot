import test from "node:test";
import assert from "node:assert/strict";
import { makeWorkflowDraftFixture } from "./workflow-fixture.js";
import { WORKFLOW_DRAFT_VERSION, workflowHash, revisionRef, assertImmutableRevision, validateSourceAssetPackage, validateTargetStoryboard, validatePrevisArtifact, validateProductionPackage, validateUntrustedConfirmation, auditLegacyMigration, assertLegacyShotMappingCompatible, } from "./workflow-draft.js";
import { CONTRACT_VERSION, AdaptationPackageSchema, ArtifactSchema } from "./index.js";
import { familyFixture } from "./fixture.js";
import { OfflineAuthorization } from "../orchestration/authorization.js";
const base = makeWorkflowDraftFixture;
const planned = (f) => {
    const p = f.previs.find(p => p.status === "planned");
    assert.ok(p && p.status === "planned");
    return p;
};
test("draft uses independent version and cannot enter strict 0.2.1 schema", () => {
    assert.equal(CONTRACT_VERSION, "0.2.1");
    assert.equal(WORKFLOW_DRAFT_VERSION, "0.3.0-draft.1");
    assert.deepEqual(AdaptationPackageSchema.parse(familyFixture), familyFixture);
    assert.throws(() => AdaptationPackageSchema.parse({ ...familyFixture, target_storyboard: base().target }));
    assert.throws(() => AdaptationPackageSchema.parse(base().source));
});
test("complete authored fixture has split, merge and new shots with no fabricated source time", () => {
    const f = base();
    const before = workflowHash(f.source);
    assert.deepEqual(validateTargetStoryboard(f.target, f.source).shots.map(s => s.source_shot_ids), [["s1"], ["s1"], ["s2", "s3"], []]);
    assert.equal(workflowHash(f.source), before);
    assert.equal(validateProductionPackage(f.production, f).purpose, "offline_rehearsal");
    assert.equal(planned(f).output, null);
});
for (const [name, mutate] of [
    ["source time evidence exceeds media", (f) => { f.source.evidence[0].locator = { kind: "time", start_ms: 0, end_ms: 12001 }; }],
    ["text evidence exceeds script", (f) => { f.source.evidence[1].locator = { kind: "text", start_char: 0, end_char_exclusive: 999 }; }],
    ["evidence hash mismatch", (f) => { f.source.evidence[0].source_asset_sha256 = "0".repeat(64); }],
    ["source interval reversed", (f) => { f.source.storyboard.shots[0].source_out_ms = 0; }],
    ["unknown source scene", (f) => { f.source.storyboard.shots[0].scene_id = "unknown"; }],
    ["source story evidence missing", (f) => { f.source.beats[0].evidence_ids = ["missing"]; }],
    ["reconstruction labeled observation", (f) => { f.source.evidence[0].method = "approximate_reconstruction"; }],
    ["synthetic source relabeled live", (f) => { f.source.evidence[0].evidence = "live"; }],
])
    test(name, () => { const f = base(); mutate(f); assert.throws(() => validateSourceAssetPackage(f.source)); });
test("inference keeps uncertainty and remains separate from execution evidence", () => {
    const f = base();
    f.source.evidence[0].epistemic_status = "inferred";
    const s = validateSourceAssetPackage(f.source);
    assert.equal(s.evidence[0].evidence, "fixture");
    assert.equal(s.evidence[0].epistemic_status, "inferred");
    f.source.evidence[0].uncertainties = [];
    assert.throws(() => validateSourceAssetPackage(f.source));
});
for (const [name, mutate] of [
    ["target source hash stale", (f) => { f.target.source_ref.sha256 = "0".repeat(64); }],
    ["new target shot fakes source time", (f) => { Object.assign(f.target.shots[3], { source_in_ms: 0 }); }],
    ["new shot requires rationale", (f) => { f.target.shots[3].creative_rationale = " "; }],
    ["new shot cannot edit nonexistent source", (f) => { f.target.shots[3].route = "edit"; }],
    ["missing target scene ref", (f) => { f.target.shots[0].scene_ref.id = "unknown"; }],
    ["missing line speaker in target shot", (f) => { f.target.shots[0].character_refs = f.target.shots[0].character_refs.filter(r => r.id !== "host"); }],
    ["required story beat omitted", (f) => { f.target.shots.forEach(s => s.preserved_beat_ids = []); f.target.omitted_beat_decisions = [{ source_beat_id: "exclusion", rationale: "removed" }]; }],
])
    test(name, () => { const f = base(); mutate(f); assert.throws(() => validateTargetStoryboard(f.target, f.source)); });
test("required beat cannot be silently omitted even when every shot cites another beat", () => {
    const f = base();
    f.source.beats.push({ ...f.source.beats[0], id: "optional", required: false });
    f.target.source_ref = revisionRef(f.source);
    f.target.shots.forEach(s => s.preserved_beat_ids = ["optional"]);
    assert.throws(() => validateTargetStoryboard(f.target, f.source), /Unaccounted narrative beat/);
});
for (const [name, mutate] of [
    ["target previs points at source shot", (f) => { planned(f).shot_refs = [revisionRef(f.source.storyboard.shots[0])]; }],
    ["previs misses concrete scene", (f) => { planned(f).input_refs = planned(f).input_refs.filter(r => r.kind !== "target_scene"); }],
    ["previs keyframe out of bounds", (f) => { planned(f).entity_tracks[0].keyframes[1].at_ms = 4001; }],
    ["previs missing initial character position", (f) => { planned(f).entity_tracks.pop(); }],
    ["2D cannot masquerade as 3D", (f) => { Object.assign(planned(f), { dimension: "3D" }); }],
    ["2D cannot claim depth", (f) => { planned(f).capabilities.depth = "present"; }],
    ["mismatched frame timeline", (f) => { planned(f).frame_count = 99; }],
    ["dialogue overflow marked fitting", (f) => { planned(f).dialogue_timing[0].read_duration_ms = 4500; }],
    ["unknown dialogue starts outside shot", (f) => { Object.assign(planned(f).dialogue_timing[0], { method: "unknown", read_duration_ms: null, assessment: "unknown", start_ms: 4500 }); }],
])
    test(name, () => { const f = base(); mutate(f); assert.throws(() => validatePrevisArtifact(planned(f), f)); });
test("timing overflow is representable but cannot claim fits", () => {
    const f = base();
    Object.assign(planned(f).dialogue_timing[0], { read_duration_ms: 4500, assessment: "overflow" });
    const result = validatePrevisArtifact(planned(f), f);
    assert.equal(result.status, "planned");
});
test("editing unrelated shot preserves concrete previs; editing its scene invalidates it", () => {
    const f = base();
    const p = structuredClone(planned(f));
    f.target.revision++;
    f.target.shots[3].revision++;
    f.target.shots[3].action = "无关镜头的新动作";
    validatePrevisArtifact(p, f);
    f.target.scenes[0].revision++;
    f.target.scenes[0].design = "不同布局";
    f.target.shots.forEach(s => { s.scene_ref = revisionRef(f.target.scenes[0]); });
    assert.throws(() => validatePrevisArtifact(p, f), /previs/);
});
test("skipping previs needs a reason; rendered output stays a separate artifact kind", () => {
    const f = base();
    const skip = f.previs.find(p => p.status === "skipped");
    assert.throws(() => validatePrevisArtifact({ ...skip, reason: "" }, f));
    assert.throws(() => ArtifactSchema.parse({ ...planned(f), kind: "previs_video" }));
});
test("production cannot freeze planned previs or substitute an old manifest", () => {
    const f = base();
    assert.throws(() => validateProductionPackage({ ...f.production, purpose: "production_candidate" }, f), /unrendered|measured fitting timing/);
    f.production.previs_refs[0].sha256 = "0".repeat(64);
    assert.throws(() => validateProductionPackage(f.production, f), /hash/);
});
test("stage confirmation binds stage inputs and cannot be used for production", () => {
    const f = base();
    assert.equal(validateUntrustedConfirmation(f.stageConfirmation, f).authority, "untrusted_record");
    assert.throws(() => validateUntrustedConfirmation(f.stageConfirmation, { productionPackage: f.production }));
    assert.throws(() => validateUntrustedConfirmation({ ...f.stageConfirmation, scope: "production" }, { productionPackage: f.production }));
    if (f.stageConfirmation.scope !== "preproduction_stage")
        assert.fail();
    f.stageConfirmation.stage_input_sha256 = "0".repeat(64);
    assert.throws(() => validateUntrustedConfirmation(f.stageConfirmation, f), /hash/);
});
test("confirmed metadata creates no host capability and a changed production hash is rejected", () => {
    const f = base();
    validateUntrustedConfirmation(f.productionConfirmation, { productionPackage: f.production });
    const provider = {};
    const guard = new OfflineAuthorization([provider]);
    const legacy = structuredClone(familyFixture);
    legacy.approval = { status: "approved", approver: f.productionConfirmation.asserted_by, revision: 1, approved_at: f.productionConfirmation.asserted_at };
    assert.throws(() => guard.assertAllowed(provider, { evidence: "mock" }, legacy));
    assert.throws(() => validateUntrustedConfirmation({ ...f.productionConfirmation, authority: "host" }, { productionPackage: f.production }));
    f.production.unresolved_items.push("changed");
    assert.throws(() => validateUntrustedConfirmation(f.productionConfirmation, { productionPackage: f.production }), /hash/);
});
test("same typed identity and revision are immutable, newer revision remains a candidate", () => {
    const f = base();
    const c = f.target.characters[0];
    const next = { ...c, design: "new wardrobe" };
    assert.throws(() => assertImmutableRevision(c, next));
    assertImmutableRevision(c, { ...next, revision: 2 });
    assert.throws(() => assertImmutableRevision({ ...c, revision: 2 }, c));
});
test("legacy migration audits gaps without mutation or new execution permission", () => {
    const legacy = structuredClone(familyFixture);
    legacy.approval = { status: "approved", approver: "model", revision: 1, approved_at: "2026-09-17T00:00:00Z" };
    const freeze = (o) => { Object.values(o).filter(x => x && typeof x === "object").forEach(freeze); return Object.freeze(o); };
    freeze(legacy);
    const hash = workflowHash(legacy);
    const r = auditLegacyMigration(legacy);
    assert.equal(r.lossless, false);
    assert.equal(r.execution_authorized, false);
    assert.equal(r.ledger_action, "none");
    assert.ok(r.missing.includes("locatable_source_evidence"));
    assert.ok(r.candidate_shot_mappings.every(m => m.target_identity === null));
    assert.equal(workflowHash(legacy), hash);
    assert.deepEqual(auditLegacyMigration(legacy), r);
    assert.throws(() => assertLegacyShotMappingCompatible(base().target, base().source), /Lossy legacy mapping/);
});
test("canonical hashing is stable for JSON and rejects lossy values", () => {
    assert.equal(workflowHash({ b: 2, a: 1 }), workflowHash({ a: 1, b: 2 }));
    for (const input of [{ x: undefined }, [NaN], new Date(), new Array(2), { [Symbol()]: 1 }, Object.defineProperty({}, "hidden", { value: 1 })])
        assert.throws(() => workflowHash(input));
});
function candidateFixture() {
    const f = base();
    f.target.shots[0].audio_mode = "native_audio";
    f.target.shots[0].revision++;
    f.target.revision++;
    f.previs = [f.previs[0], ...f.target.shots.map(s => validatePrevisArtifact({
            kind: "previs", id: `candidate-${s.id}`, revision: 1, contract_version: WORKFLOW_DRAFT_VERSION,
            domain: "target", shot_refs: [revisionRef(s)], input_refs: [revisionRef(s), ...s.character_refs, s.scene_ref, ...s.prop_refs, ...s.line_refs],
            uncertainties: ["Metadata validation only; no rendered media"], status: "skipped", reason: "Simple shot; visual previs omitted but dialogue timing still required",
        }, f))];
    f.production.target_ref = revisionRef(f.target);
    f.production.previs_refs = f.previs.map(revisionRef);
    f.production.purpose = "production_candidate";
    f.production.audio = [{ line_ref: revisionRef(f.target.lines[0]), sha256: "1".repeat(64), duration_ms: 3200, evidence: "external_manual" }];
    f.production.dialogue_timing = [{ shot_ref: revisionRef(f.target.shots[0]), line_ref: revisionRef(f.target.lines[0]), start_ms: 0, read_duration_ms: 3200, method: "manual_read", evidence: "external_manual", audio_sha256: "1".repeat(64), assessment: "fits" }];
    validateProductionPackage(f.production, f);
    return f;
}
test("source previs can be checked before any target version exists and cannot silently retime", () => {
    const f = base();
    assert.equal(validatePrevisArtifact(f.previs[0], { source: f.source }).domain, "source");
    const { reason: _reason, ...sourceBinding } = f.previs[0];
    const p = {
        ...planned(f), ...sourceBinding, status: "planned", output: null, dialogue_timing: [],
        entity_tracks: [...f.source.characters, ...f.source.props].map(entity => ({ entity_ref: revisionRef(entity), keyframes: [{ at_ms: 0, x: 0.5, y: 0.5, action: "自编站位" }] })),
    };
    validatePrevisArtifact(p, { source: f.source });
    assert.throws(() => validatePrevisArtifact({ ...p, duration_ms: 40000, frame_count: 1000 }, { source: f.source }), /retiming/);
});
test("skipping visual previs does not skip spoken timing and native audio checks", () => {
    const f = candidateFixture();
    f.production.dialogue_timing = [];
    assert.throws(() => validateProductionPackage(f.production, f), /measured fitting timing/);
    const g = candidateFixture();
    g.production.audio[0].sha256 = "2".repeat(64);
    assert.throws(() => validateProductionPackage(g.production, g), /Native audio/);
    const h = candidateFixture();
    h.production.audio[0].duration_ms = 3300;
    assert.throws(() => validateProductionPackage(h.production, h), /Native audio/);
});
test("previs rehearsal audio cannot be substituted for different production audio", () => {
    const f = candidateFixture();
    const original = planned(base());
    const shot = f.target.shots[0];
    const rendered = validatePrevisArtifact({
        ...original, id: "metadata-rendered-record", status: "rendered", method: "manual", evidence: "external_manual",
        shot_refs: [revisionRef(shot)], input_refs: [revisionRef(shot), ...shot.character_refs, shot.scene_ref, ...shot.prop_refs, ...shot.line_refs],
        dialogue_timing: original.dialogue_timing.map(t => ({ ...t, method: "manual_read", evidence: "external_manual", audio_sha256: "1".repeat(64) })),
        output: { kind: "previs_video", uri: "metadata-record://not-verified-on-disk", sha256: "3".repeat(64), evidence: "external_manual" },
    }, f);
    f.previs[1] = rendered;
    f.production.previs_refs = f.previs.map(revisionRef);
    validateProductionPackage(f.production, f);
    assert.ok(rendered.status === "rendered");
    rendered.dialogue_timing[0].audio_sha256 = "2".repeat(64);
    f.production.previs_refs = f.previs.map(revisionRef);
    assert.throws(() => validateProductionPackage(f.production, f), /Previs and production timing/);
});
test("skipped previs does not permit accidental production dialogue overlap", () => {
    const f = candidateFixture();
    const shot = f.target.shots[0];
    const second = { ...f.target.lines[0], id: "l2", source_dialogue_ids: ["d2"], speaker_character_id: "guest", text: "Then I'll make my own place." };
    f.target.lines.push(second);
    shot.line_refs.push(revisionRef(second));
    const rebind = () => {
        f.production.target_ref = revisionRef(f.target);
        const skip = f.previs[1];
        skip.shot_refs = [revisionRef(shot)];
        skip.input_refs = [revisionRef(shot), ...shot.character_refs, shot.scene_ref, ...shot.prop_refs, ...shot.line_refs];
        f.production.previs_refs = f.previs.map(revisionRef);
        f.production.dialogue_timing.forEach(t => { t.shot_ref = revisionRef(shot); });
    };
    f.production.audio[0].duration_ms = 1800;
    f.production.dialogue_timing[0].read_duration_ms = 1800;
    f.production.audio.push({ line_ref: revisionRef(second), sha256: "2".repeat(64), duration_ms: 1800, evidence: "external_manual" });
    f.production.dialogue_timing.push({ ...f.production.dialogue_timing[0], line_ref: revisionRef(second), start_ms: 2000, audio_sha256: "2".repeat(64) });
    rebind();
    validateProductionPackage(f.production, f);
    f.production.dialogue_timing[1].start_ms = 0;
    assert.throws(() => validateProductionPackage(f.production, f), /overlapping production/);
    shot.overlapping_dialogue = "intentional";
    rebind();
    validateProductionPackage(f.production, f);
});
test("previs cannot silently override target dialogue overlap policy", () => {
    const f = base();
    const p = planned(f);
    p.overlapping_dialogue = "intentional";
    assert.throws(() => validatePrevisArtifact(p, f), /overlap intent/);
});
