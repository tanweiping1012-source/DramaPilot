import { createHash } from "node:crypto";
import { z } from "zod";
import { validateAdaptation } from "./validate.js";
/** An isolated design contract. It is not accepted by the 0.2.1 runtime. */
export const WORKFLOW_DRAFT_VERSION = "0.3.0-draft.1";
const id = z.string().trim().min(1);
const revision = z.number().int().positive().safe();
const ms = z.number().int().nonnegative().safe();
const positive = z.number().int().positive().safe();
const sha = z.string().regex(/^[a-f0-9]{64}$/);
const ids = z.array(id).superRefine((v, c) => {
    if (new Set(v).size !== v.length)
        c.addIssue({ code: "custom", message: "Duplicate identity" });
});
const nonemptyIds = ids.refine(v => v.length > 0, "At least one identity required");
const version = z.literal(WORKFLOW_DRAFT_VERSION);
const provenance = z.enum(["fixture", "mock", "live", "external_manual"]);
const kinds = z.enum(["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]);
export const WorkflowRefSchema = z.object({ kind: kinds, id, revision, sha256: sha }).strict();
const refs = z.array(WorkflowRefSchema).superRefine((v, c) => {
    if (new Set(v.map(r => `${r.kind}:${r.id}`)).size !== v.length)
        c.addIssue({ code: "custom", message: "Duplicate reference identity" });
});
const base = (kind) => ({ kind: z.literal(kind), id, revision });
const sourced = { evidence_ids: nonemptyIds };
export const SourceAssetSchema = z.object({ ...base("source_asset"), media_kind: z.enum(["video", "script", "subtitles", "image", "audio"]), uri: id, sha256: sha, duration_ms: positive.nullable(), frame_count: positive.nullable(), char_count: positive.nullable(), evidence: provenance }).strict();
const locator = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("time"), start_ms: ms, end_ms: positive }).strict(),
    z.object({ kind: z.literal("frames"), start_frame: ms, end_frame_exclusive: positive }).strict(),
    z.object({ kind: z.literal("text"), start_char: ms, end_char_exclusive: positive }).strict(),
]);
export const SourceEvidenceSchema = z.object({ ...base("source_evidence"), source_asset_id: id, source_asset_sha256: sha, locator, statement: id, epistemic_status: z.enum(["observed", "inferred", "reconstructed"]), evidence: provenance, method: z.enum(["manual_annotation", "creator_supplied", "automatic_analysis", "approximate_reconstruction", "authored_fixture"]), uncertainties: z.array(id) }).strict();
const sourceCharacter = z.object({ ...base("source_character"), description: id, ...sourced }).strict();
const sourceRelation = z.object({ ...base("source_relation"), from_character_id: id, to_character_id: id, description: id, ...sourced }).strict();
const sourceDialogue = z.object({ ...base("source_dialogue"), speaker_character_id: id, text: id, ...sourced }).strict();
const sourceScene = z.object({ ...base("source_scene"), description: id, ...sourced }).strict();
const sourceProp = z.object({ ...base("source_prop"), description: id, ...sourced }).strict();
const sourceBeat = z.object({ ...base("source_beat"), description: id, required: z.boolean(), source_shot_ids: nonemptyIds, ...sourced }).strict();
const sourceShot = z.object({ ...base("source_shot"), source_asset_id: id, source_asset_sha256: sha, source_in_ms: ms, source_out_ms: positive, character_ids: ids, dialogue_ids: ids, scene_id: id, prop_ids: ids, action: id, ...sourced }).strict();
export const SourceStoryboardSchema = z.object({ ...base("source_storyboard"), shots: z.array(sourceShot).min(1) }).strict();
export const SourceAssetPackageSchema = z.object({ ...base("source_package"), contract_version: version, source_locale: id, assets: z.array(SourceAssetSchema).min(1), evidence: z.array(SourceEvidenceSchema).min(1), characters: z.array(sourceCharacter).min(1), relations: z.array(sourceRelation), dialogue: z.array(sourceDialogue), scenes: z.array(sourceScene).min(1), props: z.array(sourceProp), beats: z.array(sourceBeat).min(1), storyboard: SourceStoryboardSchema, unknowns: z.array(id) }).strict();
const targetCharacter = z.object({ ...base("target_character"), source_character_ids: ids, design: id, rationale: id }).strict();
const targetScene = z.object({ ...base("target_scene"), source_scene_ids: ids, design: id, rationale: id }).strict();
const targetProp = z.object({ ...base("target_prop"), source_prop_ids: ids, design: id, rationale: id }).strict();
const targetLine = z.object({ ...base("target_line"), source_dialogue_ids: ids, speaker_character_id: id, text: id, rationale: id }).strict();
const targetShot = z.object({ ...base("target_shot"), source_shot_ids: ids, creative_rationale: id, preserved_beat_ids: nonemptyIds, character_refs: refs, scene_ref: WorkflowRefSchema, prop_refs: refs, line_refs: refs, action: id, duration_ms: positive, route: z.enum(["edit", "regenerate", "reuse"]), audio_mode: z.enum(["native_audio", "separate_audio", "silent"]), overlapping_dialogue: z.enum(["forbidden", "intentional"]) }).strict();
export const TargetStoryboardSchema = z.object({ ...base("target_storyboard"), contract_version: version, source_ref: WorkflowRefSchema, locale: z.literal("en-US"), audience_brief: id, cultural_decisions: z.array(id).min(1), characters: z.array(targetCharacter).min(1), scenes: z.array(targetScene).min(1), props: z.array(targetProp), lines: z.array(targetLine), shots: z.array(targetShot).min(1), omitted_beat_decisions: z.array(z.object({ source_beat_id: id, rationale: id }).strict()), unknowns: z.array(id) }).strict();
const point = z.object({ at_ms: ms, x: z.number().finite().min(0).max(1), y: z.number().finite().min(0).max(1), action: id }).strict();
const track = z.object({ entity_ref: WorkflowRefSchema, keyframes: z.array(point).min(1) }).strict();
const cameraPoint = z.object({ at_ms: ms, framing: id, movement: id }).strict();
const timing = z.object({ line_ref: WorkflowRefSchema, start_ms: ms, read_duration_ms: positive.nullable(), method: z.enum(["manual_read", "test_fixture", "estimate", "unknown"]), evidence: provenance, audio_sha256: sha.nullable(), assessment: z.enum(["fits", "overflow", "unknown"]) }).strict();
const previsBase = { ...base("previs"), contract_version: version, domain: z.enum(["source", "target"]), shot_refs: refs.refine(v => v.length > 0, "A previs must bind a shot"), input_refs: refs, uncertainties: z.array(id) };
const previsPlan = { dimension: z.literal("2D"), method: z.enum(["manual", "imported", "reconstructed", "fixture"]), evidence: provenance, coordinate_system: z.literal("normalized_screen"), duration_ms: positive, fps_num: positive, fps_den: positive, frame_count: positive, entity_tracks: z.array(track), camera_keyframes: z.array(cameraPoint).min(1), dialogue_timing: z.array(timing), overlapping_dialogue: z.enum(["forbidden", "intentional"]), capabilities: z.object({ motion: z.enum(["present", "unknown"]), camera: z.enum(["present", "unknown"]), depth: z.enum(["present", "unknown"]) }).strict() };
/** Planned metadata is intentionally distinct from an actual rendered media record. */
export const PrevisArtifactSchema = z.discriminatedUnion("status", [
    z.object({ ...previsBase, status: z.literal("skipped"), reason: id }).strict(),
    z.object({ ...previsBase, ...previsPlan, status: z.literal("planned"), output: z.null() }).strict(),
    z.object({ ...previsBase, ...previsPlan, status: z.literal("rendered"), output: z.object({ kind: z.literal("previs_video"), uri: id, sha256: sha, evidence: provenance }).strict() }).strict(),
]);
const audio = z.object({ line_ref: WorkflowRefSchema, sha256: sha, duration_ms: positive, evidence: provenance }).strict();
export const ProductionPackageSchema = z.object({ ...base("production_package"), contract_version: version, source_ref: WorkflowRefSchema, target_ref: WorkflowRefSchema, purpose: z.enum(["offline_rehearsal", "production_candidate"]), previs_refs: refs, audio: z.array(audio), dialogue_timing: z.array(timing.extend({ shot_ref: WorkflowRefSchema }).strict()), delivery: z.object({ aspect_ratio: z.enum(["9:16", "16:9", "1:1"]), fps_num: positive, fps_den: positive }).strict(), unresolved_items: z.array(id) }).strict();
const budget = z.object({ currency: z.string().regex(/^[A-Z]{3}$/), max_amount_micros: ms }).strict();
export const StagePlanSchema = z.object({ ...base("stage_plan"), contract_version: version, stage: z.enum(["understanding", "reference_images", "previs"]), input_refs: refs.refine(v => v.length > 0), source_asset_hashes: z.array(sha).min(1), actions: z.array(id).min(1), provider: id, external_upload: z.boolean(), budget }).strict();
const confirmationBase = { id, contract_version: version, authority: z.literal("untrusted_record"), status: z.enum(["proposed", "confirmed", "rejected"]), asserted_by: id, asserted_at: z.string().datetime(), provider: id, source_asset_hashes: z.array(sha).min(1), external_upload: z.boolean(), budget, repair_scope: z.array(id) };
/** Never an execution credential: callers must obtain separate host-owned authority. */
export const UntrustedConfirmationSchema = z.discriminatedUnion("scope", [
    z.object({ ...confirmationBase, scope: z.literal("preproduction_stage"), stage: z.enum(["understanding", "reference_images", "previs"]), stage_plan_ref: WorkflowRefSchema, stage_input_sha256: sha }).strict(),
    z.object({ ...confirmationBase, scope: z.literal("production"), production_package_ref: WorkflowRefSchema }).strict(),
]);
function fail(message) { throw new Error(message); }
function requireThat(condition, message) { if (!condition)
    fail(message); }
function unique(items, label) { requireThat(new Set(items.map(x => x.id)).size === items.length, `Duplicate ${label} identity`); }
function has(idsToCheck, items, label) { for (const value of idsToCheck)
    requireThat(items.some(x => x.id === value), `Missing ${label}: ${value}`); }
/** Reject non-JSON values rather than silently hashing a lossy serialization. */
export function workflowHash(value) {
    const walk = (v) => {
        if (v === null || typeof v === "string" || typeof v === "boolean")
            return v;
        if (typeof v === "number") {
            requireThat(Number.isFinite(v), "Non-finite JSON number");
            return v;
        }
        if (Array.isArray(v)) {
            requireThat(Object.keys(v).length === v.length && Array.from({ length: v.length }, (_, i) => Object.hasOwn(v, i)).every(Boolean), "Sparse/decorated array is not lossless JSON");
            requireThat(Object.getOwnPropertySymbols(v).length === 0, "Symbol properties are not JSON");
            return v.map(walk);
        }
        requireThat(typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype, "Value is not plain JSON");
        requireThat(Object.getOwnPropertySymbols(v).length === 0 && Object.values(Object.getOwnPropertyDescriptors(v)).every(d => d.enumerable && "value" in d), "Hidden/accessor properties are not JSON");
        return Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, x]) => [k, walk(x)]));
    };
    return createHash("sha256").update(JSON.stringify(walk(value))).digest("hex");
}
export function revisionRef(value) { return WorkflowRefSchema.parse({ kind: value.kind, id: value.id, revision: value.revision, sha256: workflowHash(value) }); }
export function assertImmutableRevision(before, after) {
    requireThat(before.kind === after.kind && before.id === after.id, "Revision comparison requires the same typed identity");
    requireThat(after.revision >= before.revision, "Revision rollback");
    if (before.revision === after.revision)
        requireThat(workflowHash(before) === workflowHash(after), "Immutable revision content changed");
}
function match(ref, value, label) { requireThat(ref.kind === value.kind && ref.id === value.id && ref.revision === value.revision && ref.sha256 === workflowHash(value), `Missing/stale/hash-mismatched ${label}`); }
function resolve(ref, items, label) {
    const found = items.find(x => x.kind === ref.kind && x.id === ref.id);
    requireThat(found, `Missing ${label}: ${ref.kind}:${ref.id}`);
    match(ref, found, label);
    return found;
}
function sourceObjects(p) { return [p, p.storyboard, ...p.assets, ...p.evidence, ...p.characters, ...p.relations, ...p.dialogue, ...p.scenes, ...p.props, ...p.beats, ...p.storyboard.shots]; }
function targetObjects(t) { return [t, ...t.characters, ...t.scenes, ...t.props, ...t.lines, ...t.shots]; }
export function validateSourceAssetPackage(input) {
    const p = SourceAssetPackageSchema.parse(input);
    for (const [label, items] of Object.entries({ assets: p.assets, evidence: p.evidence, characters: p.characters, relations: p.relations, dialogue: p.dialogue, scenes: p.scenes, props: p.props, beats: p.beats, shots: p.storyboard.shots }))
        unique(items, label);
    for (const e of p.evidence) {
        const a = p.assets.find(a => a.id === e.source_asset_id);
        requireThat(a && a.sha256 === e.source_asset_sha256, "Evidence asset/hash mismatch");
        const l = e.locator;
        if (l.kind === "time")
            requireThat(a.duration_ms !== null && l.end_ms > l.start_ms && l.end_ms <= a.duration_ms, "Evidence time out of bounds");
        if (l.kind === "frames")
            requireThat(a.media_kind === "video" && a.frame_count !== null && l.end_frame_exclusive > l.start_frame && l.end_frame_exclusive <= a.frame_count, "Evidence frame out of bounds");
        if (l.kind === "text")
            requireThat(["script", "subtitles"].includes(a.media_kind) && a.char_count !== null && l.end_char_exclusive > l.start_char && l.end_char_exclusive <= a.char_count, "Invalid text evidence locator");
        if (e.epistemic_status !== "observed")
            requireThat(e.uncertainties.length > 0, "Inference/reconstruction requires uncertainty");
        if (e.method === "approximate_reconstruction")
            requireThat(e.epistemic_status === "reconstructed", "Reconstruction cannot be observed fact");
        if (a.evidence === "fixture" || a.evidence === "mock")
            requireThat(e.evidence === a.evidence, "Synthetic evidence cannot be relabeled live/manual");
        if (e.method === "authored_fixture")
            requireThat(e.evidence === "fixture", "Fixture method requires fixture evidence");
    }
    for (const x of [...p.characters, ...p.relations, ...p.dialogue, ...p.scenes, ...p.props, ...p.beats, ...p.storyboard.shots])
        has(x.evidence_ids, p.evidence, "source evidence");
    for (const r of p.relations)
        has([r.from_character_id, r.to_character_id], p.characters, "relation character");
    for (const d of p.dialogue)
        has([d.speaker_character_id], p.characters, "source speaker");
    const lastEnds = new Map();
    for (const s of p.storyboard.shots) {
        const a = p.assets.find(a => a.id === s.source_asset_id);
        requireThat(a && a.sha256 === s.source_asset_sha256 && a.media_kind === "video" && a.duration_ms !== null, "Source shot requires exact video asset");
        requireThat(s.source_out_ms > s.source_in_ms && s.source_out_ms <= a.duration_ms, "Source shot interval out of bounds");
        requireThat(s.source_in_ms >= (lastEnds.get(a.id) ?? 0), "Source storyboard order/overlap invalid");
        lastEnds.set(a.id, s.source_out_ms);
        has(s.character_ids, p.characters, "shot character");
        has(s.dialogue_ids, p.dialogue, "shot dialogue");
        has([s.scene_id], p.scenes, "shot scene");
        has(s.prop_ids, p.props, "shot prop");
    }
    for (const b of p.beats)
        has(b.source_shot_ids, p.storyboard.shots, "beat source shot");
    return p;
}
export function validateTargetStoryboard(input, sourceInput) {
    const source = validateSourceAssetPackage(sourceInput), t = TargetStoryboardSchema.parse(input);
    match(t.source_ref, source, "source package");
    for (const [label, items] of Object.entries({ characters: t.characters, scenes: t.scenes, props: t.props, lines: t.lines, shots: t.shots }))
        unique(items, `target ${label}`);
    for (const c of t.characters)
        has(c.source_character_ids, source.characters, "source character binding");
    for (const s of t.scenes)
        has(s.source_scene_ids, source.scenes, "source scene binding");
    for (const p of t.props)
        has(p.source_prop_ids, source.props, "source prop binding");
    for (const l of t.lines) {
        has(l.source_dialogue_ids, source.dialogue, "source dialogue binding");
        has([l.speaker_character_id], t.characters, "target line speaker");
    }
    for (const shot of t.shots) {
        has(shot.source_shot_ids, source.storyboard.shots, "source shot mapping");
        has(shot.preserved_beat_ids, source.beats, "source beat mapping");
        for (const r of shot.character_refs)
            resolve(r, t.characters, "target character");
        resolve(shot.scene_ref, t.scenes, "target scene");
        for (const r of shot.prop_refs)
            resolve(r, t.props, "target prop");
        for (const r of shot.line_refs) {
            const line = resolve(r, t.lines, "target line");
            requireThat(shot.character_refs.some(c => c.id === line.speaker_character_id), "Shot omits line speaker character");
        }
        if (shot.route !== "regenerate")
            requireThat(shot.source_shot_ids.length > 0, "Edit/reuse requires a source shot mapping");
        if (shot.route === "reuse")
            requireThat(shot.source_shot_ids.length === 1, "Reuse requires one exact source shot mapping");
        if (shot.audio_mode === "silent")
            requireThat(shot.line_refs.length === 0, "Silent shot has dialogue");
    }
    unique(t.omitted_beat_decisions.map(d => ({ id: d.source_beat_id })), "omitted beat decision");
    for (const d of t.omitted_beat_decisions) {
        has([d.source_beat_id], source.beats, "omitted beat");
        requireThat(!source.beats.find(b => b.id === d.source_beat_id).required, "Required narrative beat cannot be omitted");
        requireThat(!t.shots.some(s => s.preserved_beat_ids.includes(d.source_beat_id)), "Beat both preserved and omitted");
    }
    for (const b of source.beats)
        requireThat(t.shots.some(s => s.preserved_beat_ids.includes(b.id)) || t.omitted_beat_decisions.some(d => d.source_beat_id === b.id), `Unaccounted narrative beat: ${b.id}`);
    return t;
}
export function validatePrevisArtifact(input, context) {
    const source = validateSourceAssetPackage(context.source), p = PrevisArtifactSchema.parse(input);
    const target = p.domain === "target" ? validateTargetStoryboard(context.target, source) : null;
    const objects = p.domain === "source" ? sourceObjects(source) : [...sourceObjects(source), ...targetObjects(target)];
    for (const r of p.input_refs)
        resolve(r, objects, "previs input");
    const shotObjects = p.domain === "source" ? source.storyboard.shots : target.shots;
    for (const r of p.shot_refs)
        resolve(r, shotObjects, "previs shot scope");
    requireThat(p.shot_refs.length === 1, "Draft previs binds exactly one source or target shot");
    // Bind concrete inputs; an unrelated storyboard edit does not invalidate this previs.
    const selectedShots = p.shot_refs.map(r => resolve(r, shotObjects, "previs shot"));
    const expectedObjects = [...selectedShots];
    if (p.domain === "source") {
        for (const shot of selectedShots) {
            expectedObjects.push(...source.assets.filter(a => a.id === shot.source_asset_id), ...source.characters.filter(c => shot.character_ids.includes(c.id)), ...source.scenes.filter(s => s.id === shot.scene_id), ...source.props.filter(v => shot.prop_ids.includes(v.id)), ...source.evidence.filter(e => shot.evidence_ids.includes(e.id)));
        }
    }
    else {
        for (const shot of selectedShots) {
            for (const r of [...shot.character_refs, shot.scene_ref, ...shot.prop_refs, ...shot.line_refs])
                expectedObjects.push(resolve(r, targetObjects(target), "previs concrete input"));
        }
    }
    for (const object of expectedObjects) {
        const r = revisionRef(object);
        requireThat(p.input_refs.some(i => i.kind === r.kind && i.id === r.id && i.sha256 === r.sha256 && i.revision === r.revision), "Previs lacks concrete input binding");
    }
    if (p.status === "skipped")
        return p;
    requireThat(BigInt(p.duration_ms) * BigInt(p.fps_num) === BigInt(p.frame_count) * BigInt(p.fps_den) * 1000n, "Previs duration/frame timeline mismatch");
    requireThat(p.capabilities.depth === "unknown", "2D draft cannot claim reconstructed depth");
    if (p.method === "fixture")
        requireThat(p.evidence === "fixture", "Fixture previs cannot claim live evidence");
    if (p.method === "reconstructed")
        requireThat(p.uncertainties.length > 0, "Reconstructed previs needs uncertainty");
    if (p.status === "rendered")
        requireThat(p.output.evidence === p.evidence, "Previs output evidence mismatch");
    const selectedSource = source.storyboard.shots.filter(s => p.shot_refs.some(r => r.id === s.id));
    const selectedTarget = target?.shots.filter(s => p.shot_refs.some(r => r.id === s.id)) ?? [];
    if (p.domain === "source")
        requireThat(p.duration_ms === selectedSource[0].source_out_ms - selectedSource[0].source_in_ms, "Source previs retiming requires a future explicit mapping");
    const entities = p.domain === "source" ? [...source.characters, ...source.props] : [...target.characters, ...target.props];
    const entityIds = p.domain === "source" ? selectedSource.flatMap(s => [...s.character_ids.map(id => `source_character:${id}`), ...s.prop_ids.map(id => `source_prop:${id}`)]) : selectedTarget.flatMap(s => [...s.character_refs, ...s.prop_refs].map(r => `${r.kind}:${r.id}`));
    unique(p.entity_tracks.map(t => ({ id: `${t.entity_ref.kind}:${t.entity_ref.id}` })), "previs entity track");
    const ordered = (points) => { let last = -1; for (const point of points) {
        requireThat(point.at_ms > last && point.at_ms <= p.duration_ms, "Previs keyframes must be ordered and in bounds");
        last = point.at_ms;
    } requireThat(points[0]?.at_ms === 0, "Previs needs an initial state at zero"); };
    for (const t of p.entity_tracks) {
        resolve(t.entity_ref, entities, "previs entity");
        requireThat(entityIds.includes(`${t.entity_ref.kind}:${t.entity_ref.id}`), "Previs entity outside selected shot");
        ordered(t.keyframes);
    }
    for (const entityId of new Set(entityIds))
        requireThat(p.entity_tracks.some(t => `${t.entity_ref.kind}:${t.entity_ref.id}` === entityId), `Missing initial entity track: ${entityId}`);
    ordered(p.camera_keyframes);
    unique(p.dialogue_timing.map(t => ({ id: t.line_ref.id })), "previs dialogue timing");
    if (p.domain === "source")
        requireThat(p.dialogue_timing.length === 0, "Target dialogue timing cannot be stored on source previs");
    const requiredLines = selectedTarget.flatMap(s => s.line_refs);
    for (const timing of p.dialogue_timing) {
        resolve(timing.line_ref, target.lines, "previs dialogue");
        requireThat(requiredLines.some(r => r.id === timing.line_ref.id), "Timing line outside target shot");
        requireThat(timing.start_ms < p.duration_ms, "Dialogue start outside previs");
        requireThat((timing.method === "unknown") === (timing.read_duration_ms === null), "Unknown timing must have no measured duration");
        if (timing.method === "unknown" || timing.read_duration_ms === null)
            requireThat(timing.assessment === "unknown", "Unknown timing cannot pass");
        else {
            const overflow = timing.start_ms + timing.read_duration_ms > p.duration_ms;
            requireThat(timing.assessment === (overflow ? "overflow" : timing.method === "estimate" ? "unknown" : "fits"), "Timing assessment does not match measured interval");
        }
        if (timing.method === "test_fixture")
            requireThat(timing.evidence === "fixture", "Fixture timing cannot claim live evidence");
    }
    if (p.domain === "target") {
        requireThat(p.duration_ms === selectedTarget[0].duration_ms, "Target previs duration differs from shot");
        requireThat(p.overlapping_dialogue === selectedTarget[0].overlapping_dialogue, "Previs overlap intent differs from target shot");
        for (const r of requiredLines)
            requireThat(p.dialogue_timing.some(t => t.line_ref.id === r.id), "Target dialogue timing missing");
    }
    if (p.overlapping_dialogue === "forbidden") {
        const measured = p.dialogue_timing.filter(t => t.read_duration_ms !== null).sort((a, b) => a.start_ms - b.start_ms);
        for (let i = 1; i < measured.length; i++)
            requireThat(measured[i].start_ms >= measured[i - 1].start_ms + measured[i - 1].read_duration_ms, "Unapproved overlapping dialogue");
    }
    return p;
}
export function validateProductionPackage(input, context) {
    const source = validateSourceAssetPackage(context.source), target = validateTargetStoryboard(context.target, source), p = ProductionPackageSchema.parse(input);
    match(p.source_ref, source, "production source");
    match(p.target_ref, target, "production target");
    const previs = context.previs.map(v => validatePrevisArtifact(v, { source, target }));
    unique(previs, "previs");
    for (const r of p.previs_refs)
        resolve(r, previs, "production previs");
    const selected = p.previs_refs.map(r => previs.find(x => x.id === r.id));
    for (const s of target.shots)
        requireThat(selected.filter(v => v.domain === "target" && v.shot_refs.some(r => r.id === s.id)).length === 1, "Every target shot needs one previs or explicit skip");
    unique(p.audio.map(a => ({ id: a.line_ref.id })), "production audio");
    for (const a of p.audio)
        resolve(a.line_ref, target.lines, "production audio line");
    unique(p.dialogue_timing.map(t => ({ id: `${t.shot_ref.id}:${t.line_ref.id}` })), "production timing");
    for (const t of p.dialogue_timing) {
        const shot = resolve(t.shot_ref, target.shots, "production timing shot");
        resolve(t.line_ref, target.lines, "production timing line");
        requireThat(shot.line_refs.some(r => r.id === t.line_ref.id), "Timing line outside production shot");
        requireThat(t.start_ms < shot.duration_ms, "Production dialogue starts outside shot");
        requireThat((t.method === "unknown") === (t.read_duration_ms === null), "Unknown production timing has a duration");
        const expected = t.read_duration_ms === null ? "unknown" : t.start_ms + t.read_duration_ms > shot.duration_ms ? "overflow" : t.method === "estimate" ? "unknown" : "fits";
        requireThat(t.assessment === expected, "Production timing assessment mismatch");
        if (t.method === "test_fixture")
            requireThat(t.evidence === "fixture", "Fixture production timing relabeled");
    }
    for (const shot of target.shots) {
        if (shot.overlapping_dialogue === "intentional")
            continue;
        const intervals = p.dialogue_timing.filter(t => t.shot_ref.id === shot.id && t.read_duration_ms !== null).sort((a, b) => a.start_ms - b.start_ms);
        for (let i = 1; i < intervals.length; i++)
            requireThat(intervals[i].start_ms >= intervals[i - 1].start_ms + intervals[i - 1].read_duration_ms, "Unapproved overlapping production dialogue");
    }
    if (p.purpose === "production_candidate") {
        for (const shot of target.shots)
            for (const lineRef of shot.line_refs) {
                const t = p.dialogue_timing.find(t => t.shot_ref.id === shot.id && t.line_ref.id === lineRef.id);
                requireThat(t && t.assessment === "fits" && t.evidence !== "fixture" && t.evidence !== "mock", "Every spoken production shot needs measured fitting timing even when previs is skipped");
                if (shot.audio_mode === "native_audio") {
                    const a = p.audio.find(a => a.line_ref.id === lineRef.id);
                    requireThat(a && a.evidence !== "fixture" && a.evidence !== "mock" && t.audio_sha256 === a.sha256 && t.read_duration_ms === a.duration_ms, "Native audio must match the measured timing audio and duration");
                }
            }
        for (const v of selected) {
            requireThat(v.status !== "planned", "Production candidate cannot freeze unrendered previs");
            if (v.status === "rendered") {
                requireThat(v.evidence !== "fixture" && v.evidence !== "mock", "Synthetic previs is rehearsal only");
                requireThat(v.dialogue_timing.every(t => t.assessment === "fits" && t.evidence !== "fixture" && t.evidence !== "mock"), "Production timing not measured and fitting");
                for (const t of v.dialogue_timing) {
                    const matching = p.dialogue_timing.find(x => x.shot_ref.id === v.shot_refs[0].id && x.line_ref.id === t.line_ref.id);
                    requireThat(matching && matching.audio_sha256 === t.audio_sha256 && matching.read_duration_ms === t.read_duration_ms && matching.start_ms === t.start_ms, "Previs and production timing/audio differ");
                }
            }
        }
        for (const s of target.shots.filter(s => s.audio_mode === "native_audio"))
            for (const r of s.line_refs)
                requireThat(p.audio.some(a => a.line_ref.id === r.id && a.evidence !== "fixture" && a.evidence !== "mock"), "Native audio shot requires exact non-synthetic audio binding");
    }
    return p;
}
/** Binding integrity only. Even a confirmed record conveys zero execution authority. */
export function validateUntrustedConfirmation(input, context) {
    const c = UntrustedConfirmationSchema.parse(input);
    requireThat(new Set(c.source_asset_hashes).size === c.source_asset_hashes.length, "Duplicate confirmation source hash");
    if (c.scope === "preproduction_stage") {
        requireThat(context.stagePlan !== undefined, "Missing stage plan");
        const plan = StagePlanSchema.parse(context.stagePlan);
        match(c.stage_plan_ref, plan, "confirmation stage plan");
        requireThat(c.stage_input_sha256 === workflowHash(plan.input_refs), "Stage input hash mismatch");
        requireThat(c.stage === plan.stage && c.provider === plan.provider && c.external_upload === plan.external_upload && workflowHash(c.budget) === workflowHash(plan.budget), "Stage confirmation scope mismatch");
        requireThat(workflowHash([...c.source_asset_hashes].sort()) === workflowHash([...plan.source_asset_hashes].sort()), "Stage confirmation source scope mismatch");
    }
    else {
        requireThat(context.productionPackage !== undefined, "Missing production package");
        const p = ProductionPackageSchema.parse(context.productionPackage);
        match(c.production_package_ref, p, "confirmation production package");
    }
    return c;
}
/** Reports losses; deliberately creates neither a draft package nor an execution grant. */
export function auditLegacyMigration(input) {
    const legacy = validateAdaptation(input);
    return {
        source_contract_version: "0.2.1", target_contract_version: WORKFLOW_DRAFT_VERSION, legacy_sha256: workflowHash(legacy), lossless: false, execution_authorized: false,
        candidate_shot_mappings: legacy.plans.map(p => ({ source_shot_id: p.shot_id, legacy_plan_revision: p.revision, target_identity: null })),
        missing: ["locatable_source_evidence", "source_dialogue_text", "source_scene_and_prop_entities", "independent_target_shot_ids", "versioned_previs", "production_package_confirmation"],
        discarded_authority: "Legacy approval metadata is retained only in the original package; it cannot authorize a draft stage or production.",
        ledger_action: "none",
    };
}
/** An old plan cannot represent splits, merges or new shots without information loss. */
export function assertLegacyShotMappingCompatible(targetInput, sourceInput) {
    const t = validateTargetStoryboard(targetInput, sourceInput), s = validateSourceAssetPackage(sourceInput);
    requireThat(t.shots.length === s.storyboard.shots.length && t.shots.every((shot, i) => shot.source_shot_ids.length === 1 && shot.source_shot_ids[0] === s.storyboard.shots[i].id), "Lossy legacy mapping: split/merge/new/reordered target shots are unsupported");
}
