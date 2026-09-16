import { createHash } from "node:crypto";
import { AdaptationPackageSchema, GenerationRequestSchema, LocalizedEpisodeSchema, } from "./index.js";
/** Stable lossless JSON hash; provider quote must bind the validated exact request. */
export function canonicalHash(value) {
    const sort = (v) => Array.isArray(v)
        ? v.map(sort)
        : v !== null && typeof v === "object"
            ? Object.fromEntries(Object.keys(v)
                .sort()
                .map((k) => [k, sort(v[k])]))
            : v;
    return createHash("sha256")
        .update(JSON.stringify(sort(value)))
        .digest("hex");
}
export function currentRevisions(p) {
    return [
        { kind: "source", id: p.project.project_id, revision: p.project.revision },
        { kind: "adaptation", id: p.project.project_id, revision: p.revision },
        { kind: "locale", id: p.locale.locale, revision: p.locale.revision },
        ...p.characters.map((c) => ({
            kind: "character",
            id: c.character_id,
            revision: c.revision,
        })),
        ...p.lines.map((l) => ({
            kind: "line",
            id: l.line_id,
            revision: l.revision,
        })),
        ...p.plans.map((s) => ({
            kind: "shot",
            id: s.shot_id,
            revision: s.revision,
        })),
    ];
}
export function assertCurrent(refs, current) {
    for (const r of refs)
        if (!current.some((c) => c.kind === r.kind && c.id === r.id && c.revision === r.revision))
            throw new Error(`Missing/stale dependency ${r.kind}:${r.id}@${r.revision}`);
}
const unique = (values, label) => {
    if (new Set(values).size !== values.length)
        throw new Error(`Duplicate ${label}`);
};
export function validateAdaptation(input) {
    const p = AdaptationPackageSchema.parse(input), refs = currentRevisions(p);
    unique(p.characters.map((c) => c.character_id), "character");
    unique(p.shots.map((s) => s.shot_id), "shot");
    unique(p.plans.map((s) => s.shot_id), "plan");
    unique(p.lines.map((l) => l.line_id), "line");
    unique(p.changes.map((c) => c.change_id), "change");
    unique(p.story.beats.map((b) => b.beat_id), "beat");
    const chars = new Set(p.characters.map((c) => c.character_id));
    const sources = new Set(p.shots.flatMap((s) => s.dialogue_ids));
    for (const c of p.story.characters)
        if (!chars.has(c.character_id))
            throw new Error("Unknown story character");
    for (const c of p.characters)
        if (!p.story.characters.some((s) => s.character_id === c.character_id))
            throw new Error("Missing source character binding");
    for (const r of p.story.relations)
        if (!chars.has(r.from) || !chars.has(r.to))
            throw new Error("Unknown relation character");
    for (const s of p.shots)
        for (const id of s.character_ids)
            if (!chars.has(id))
                throw new Error("Unknown shot character");
    for (const l of p.lines) {
        if (!chars.has(l.speaker_character_id))
            throw new Error("Unknown speaker");
        for (const id of l.source_dialogue_ids)
            if (!sources.has(id))
                throw new Error("Unknown source dialogue");
    }
    for (const plan of p.plans) {
        const shot = p.shots.find((s) => s.shot_id === plan.shot_id);
        if (!shot)
            throw new Error("Unknown plan shot");
        if (plan.target_character_revisions.some((r) => r.kind !== "character") ||
            plan.setting_revision.kind !== "locale" ||
            plan.line_revisions.some((r) => r.kind !== "line"))
            throw new Error("Incorrect dependency kind");
        assertCurrent([
            ...plan.target_character_revisions,
            plan.setting_revision,
            ...plan.line_revisions,
        ], refs);
        if (shot.character_ids.some((id) => !plan.target_character_revisions.some((r) => r.id === id)))
            throw new Error("Missing shot character dependency");
        for (const r of plan.line_revisions) {
            const line = p.lines.find((l) => l.line_id === r.id);
            if (!line.source_dialogue_ids.some((id) => shot.dialogue_ids.includes(id)))
                throw new Error("Line not bound to shot");
        }
    }
    if (p.shots.some((s) => !p.plans.some((plan) => plan.shot_id === s.shot_id)))
        throw new Error("Missing shot plan");
    for (const c of p.changes) {
        if (c.preserved_beats.some((id) => !p.story.beats.some((b) => b.beat_id === id)))
            throw new Error("Unknown preserved beat");
        if (c.approval.revision !== p.revision)
            throw new Error("Stale change approval");
    }
    if (p.approval.revision !== p.revision)
        throw new Error("Stale adaptation approval");
    return p;
}
export function validateRequest(input, p) {
    const r = GenerationRequestSchema.parse(input);
    validateAdaptation(p);
    if (r.project_id !== p.project.project_id)
        throw new Error("Project mismatch");
    const plan = p.plans.find((s) => s.shot_id === r.shot_id);
    if (!plan || canonicalHash(plan) !== canonicalHash(r.plan))
        throw new Error("Unapproved shot plan");
    if (r.model_version !== plan.provider_capabilities.model_version)
        throw new Error("Model mismatch");
    assertCurrent(r.input_revisions, currentRevisions(p));
    const required = [
        { kind: "source", id: p.project.project_id, revision: p.project.revision },
        { kind: "adaptation", id: p.project.project_id, revision: p.revision },
        { kind: "shot", id: plan.shot_id, revision: plan.revision },
        ...plan.target_character_revisions,
        plan.setting_revision,
        ...plan.line_revisions,
    ];
    assertCurrent(required, r.input_revisions);
    for (const a of r.input_artifacts)
        assertCurrent(a.input_revisions, r.input_revisions);
    unique(r.parameters.dialogue.map((d) => d.line_ref.id), "dialogue line");
    if (r.parameters.audio_mode === "native" &&
        r.parameters.driving_audio_artifact_id === null)
        throw new Error("Native audio requires driving audio artifact");
    for (const d of r.parameters.dialogue) {
        if (d.line_ref.kind !== "line" || d.speaker_ref.kind !== "character")
            throw new Error("Invalid dialogue dependency kind");
        assertCurrent([d.line_ref, d.speaker_ref], r.input_revisions);
        const l = p.lines.find((l) => l.line_id === d.line_ref.id), c = p.characters.find((c) => c.character_id === d.speaker_ref.id);
        if (!l ||
            !c ||
            l.speaker_character_id !== c.character_id ||
            l.target_text !== d.target_text ||
            c.voice_ref !== d.voice_ref ||
            l.emotion !== d.emotion ||
            canonicalHash(l.pronunciation) !== canonicalHash(d.pronunciation) ||
            l.duration_budget_ms !== d.duration_budget_ms)
            throw new Error("Dialogue differs from approved structured data");
    }
    if (["video", "tts", "lip_sync"].includes(r.task) &&
        plan.line_revisions.some((ref) => !r.parameters.dialogue.some((d) => d.line_ref.id === ref.id)))
        throw new Error("Missing structured dialogue");
    if (r.parameters.audio_mode === "native" &&
        plan.provider_capabilities.native_audio_driven_video !== "supported")
        throw new Error("Native audio capability unverified");
    if (r.parameters.driving_audio_artifact_id !== null &&
        !r.input_artifacts.some((a) => a.artifact_id === r.parameters.driving_audio_artifact_id &&
            a.kind === "dialogue_audio"))
        throw new Error("Missing driving audio");
    return r;
}
export function validateEpisode(input, p) {
    const e = LocalizedEpisodeSchema.parse(input);
    if (e.revision !== p.revision)
        throw new Error("Stale episode revision");
    if (e.shot_assets.length === 0 ||
        e.resolved_timeline.segments.length !== p.plans.length)
        throw new Error("Incomplete episode coverage");
    unique(e.resolved_timeline.segments.map((s) => s.shot_id), "timeline shot");
    assertCurrent(currentRevisions(p), e.input_revisions);
    assertCurrent(e.input_revisions, currentRevisions(p));
    if (e.qa_report.evidence !== "live" &&
        [e.qa_report.visual, e.qa_report.language, e.qa_report.culture].includes("pass"))
        throw new Error("Synthetic evidence cannot pass media quality");
    for (const a of [
        ...e.shot_assets,
        ...e.dialogue_stems,
        ...e.me_stems,
        ...e.subtitles,
    ]) {
        assertCurrent(a.input_revisions.filter((r) => r.kind !== "adaptation"), currentRevisions(p));
        if (a.evidence !== "live" &&
            [e.qa_report.visual, e.qa_report.language, e.qa_report.culture].includes("pass"))
            throw new Error("Synthetic artifacts cannot pass media quality");
    }
    for (const s of e.resolved_timeline.segments) {
        const a = e.shot_assets.find((a) => a.artifact_id === s.artifact_id);
        if (!a?.probe)
            throw new Error("Missing probed video");
        const plan = p.plans.find((p) => p.shot_id === s.shot_id);
        if (!plan)
            throw new Error("Unknown timeline shot");
        if (!["video", "lip_sync"].includes(a.kind))
            throw new Error("Non-video artifact in timeline");
        assertCurrent([
            {
                kind: "source",
                id: p.project.project_id,
                revision: p.project.revision,
            },
            ...plan.target_character_revisions,
            plan.setting_revision,
            ...plan.line_revisions,
        ], a.input_revisions);
        assertCurrent([
            {
                kind: "shot",
                id: s.shot_id,
                revision: p.plans.find((p) => p.shot_id === s.shot_id).revision,
            },
        ], a.input_revisions);
        const t = e.resolved_timeline;
        if (BigInt(s.out_frame - s.in_frame) *
            BigInt(t.fps_den) *
            BigInt(a.probe.fps_num) >
            BigInt(a.probe.frame_count) * BigInt(a.probe.fps_den) * BigInt(t.fps_num))
            throw new Error("Timeline exceeds collected media");
    }
    return e;
}
