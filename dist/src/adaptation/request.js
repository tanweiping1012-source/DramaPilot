import { currentRevisions, validateRequest } from "../contracts/validate.js";
export function buildRequest(p, operation, shotId, task = "video") {
    const plan = p.plans.find((s) => s.shot_id === shotId);
    if (!plan)
        throw new Error("Unknown shot");
    const request = {
        operation_id: operation,
        project_id: p.project.project_id,
        shot_id: shotId,
        task,
        model_version: plan.provider_capabilities.model_version,
        evidence: "mock",
        input_artifacts: [],
        input_revisions: currentRevisions(p).filter((r) => ["source", "adaptation", "locale"].includes(r.kind) ||
            (r.kind === "shot" && r.id === shotId) ||
            plan.target_character_revisions.some((c) => c.kind === r.kind && c.id === r.id) ||
            plan.line_revisions.some((c) => c.kind === r.kind && c.id === r.id)),
        plan,
        parameters: {
            prompt: "Offline engineering fixture. No actual source recognition or media quality claim.",
            seed: null,
            audio_mode: "separate",
            driving_audio_artifact_id: null,
            dialogue: plan.line_revisions.map((ref) => {
                const l = p.lines.find((l) => l.line_id === ref.id);
                const c = p.characters.find((c) => c.character_id === l.speaker_character_id);
                return {
                    line_ref: ref,
                    speaker_ref: {
                        kind: "character",
                        id: c.character_id,
                        revision: c.revision,
                    },
                    target_text: l.target_text,
                    voice_ref: c.voice_ref,
                    emotion: l.emotion,
                    pronunciation: l.pronunciation,
                    duration_budget_ms: l.duration_budget_ms,
                };
            }),
        },
    };
    return validateRequest(request, p);
}
