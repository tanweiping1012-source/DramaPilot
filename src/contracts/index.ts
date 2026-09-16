import { z } from "zod";

export const CONTRACT_VERSION = "0.2.1" as const;
const id = z.string().min(1);
const revision = z.number().int().positive();
const ms = z.number().int().nonnegative();
const strings = z.array(id);
export const EvidenceKindSchema = z.enum([
  "fixture",
  "mock",
  "live",
  "external_manual",
]);
export const SupportSchema = z.enum(["supported", "unsupported", "unknown"]);
export const RevisionRefSchema = z
  .object({
    kind: z.enum([
      "source",
      "character",
      "locale",
      "line",
      "shot",
      "adaptation",
    ]),
    id,
    revision,
  })
  .strict();
export const RevisionRefsSchema = z
  .array(RevisionRefSchema)
  .superRefine((refs, ctx) => {
    const keys = refs.map((r) => `${r.kind}:${r.id}`);
    if (new Set(keys).size !== keys.length)
      ctx.addIssue({
        code: "custom",
        message: "Duplicate dependency identity",
      });
  });
export const MoneySchema = z
  .object({
    currency: z.string().regex(/^[A-Z]{3}$/),
    amount_micros: z.number().int().nonnegative(),
    basis: z.enum(["mock", "estimate", "actual"]),
  })
  .strict();
export const CostSchema = z.union([
  MoneySchema,
  z.object({ basis: z.literal("unknown") }).strict(),
]);
export const MediaProbeSchema = z
  .object({
    fps_num: z.number().int().positive(),
    fps_den: z.number().int().positive(),
    frame_count: ms,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();
export const ArtifactSchema = z
  .object({
    artifact_id: id,
    kind: z.enum([
      "source_video",
      "reference_image",
      "video",
      "dialogue_audio",
      "me_audio",
      "lip_sync",
      "subtitles",
      "mix",
      "episode",
      "report",
    ]),
    uri: id,
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    evidence: EvidenceKindSchema,
    input_revisions: RevisionRefsSchema,
    operation_id: id.nullable(),
    media_type: id,
    duration_ms: ms.nullable(),
    probe: MediaProbeSchema.nullable(),
    expires_at: z.string().datetime().nullable(),
  })
  .strict();
export const RightsScopeSchema = z
  .object({
    process: z.boolean(),
    external_upload: z.boolean(),
    visual_adaptation: z.boolean(),
    voice_use: z.boolean(),
    public_demo: z.boolean(),
    evidence_refs: strings,
  })
  .strict();
export const SourceProjectSchema = z
  .object({
    project_id: id,
    revision,
    assets: z.array(ArtifactSchema),
    source_locale: id,
    source_type: z.enum(["live_action", "ai", "mixed"]),
    rights_scope: RightsScopeSchema,
    input_hashes: z.array(z.string().regex(/^[a-f0-9]{64}$/)),
    evidence: EvidenceKindSchema,
  })
  .strict();
export const ShotSchema = z
  .object({
    shot_id: id,
    source_in_ms: ms,
    source_out_ms: ms,
    character_ids: strings,
    dialogue_ids: strings,
    visual_evidence: strings,
    ingest_mode: z.enum(["automatic", "assisted", "fixture"]),
  })
  .strict()
  .refine((s) => s.source_out_ms > s.source_in_ms, "Invalid source interval");
export const StoryBibleSchema = z
  .object({
    characters: z.array(
      z
        .object({
          character_id: id,
          source_description: id,
          evidence_refs: strings,
        })
        .strict(),
    ),
    relations: z.array(
      z
        .object({ from: id, to: id, relation: id, evidence_refs: strings })
        .strict(),
    ),
    beats: z.array(
      z
        .object({ beat_id: id, source_fact: id, evidence_refs: strings })
        .strict(),
    ),
    invariants: strings,
    unknowns: strings,
  })
  .strict();
export const ApprovalSchema = z
  .object({
    status: z.enum(["proposed", "approved", "rejected"]),
    approver: id.nullable(),
    approved_at: z.string().datetime().nullable(),
    revision,
  })
  .strict()
  .refine(
    (a) =>
      a.status !== "approved" ||
      (a.approver !== null && a.approved_at !== null),
    "Approved decisions require actor and timestamp",
  );
export const LocaleBibleSchema = z
  .object({
    locale: z.literal("en-US"),
    audience_brief: id,
    setting: id,
    register: id,
    culture_decisions: strings,
    review_status: z.enum(["unreviewed", "needs_review", "reviewed"]),
    revision,
  })
  .strict();
export const CharacterBibleSchema = z
  .object({
    character_id: id,
    source_binding: strings,
    target_ref_ids: strings,
    appearance_brief: id,
    wardrobe: id,
    voice_ref: id.nullable(),
    revision,
  })
  .strict();
export const AdaptationMapSchema = z
  .object({
    change_id: id,
    source_refs: strings,
    source_meaning: id,
    target_change: id,
    reason: id,
    strategy: z.enum(["retain", "explain", "rewrite", "rebuild"]),
    preserved_beats: strings,
    affected_assets: strings,
    approval: ApprovalSchema,
  })
  .strict();
export const LocalizedLineSchema = z
  .object({
    line_id: id,
    source_dialogue_ids: strings,
    speaker_character_id: id,
    target_text: id,
    emotion: id,
    pronunciation: strings,
    duration_budget_ms: ms,
    actual_duration_ms: ms.nullable(),
    revision,
  })
  .strict();
export const ProviderCapabilitiesSchema = z
  .object({
    provider: id,
    model_version: id,
    evidence: EvidenceKindSchema,
    async: SupportSchema,
    poll: SupportSchema,
    cancel: SupportSchema,
    idempotency: SupportSchema,
    request_lookup: SupportSchema,
    native_audio_driven_video: SupportSchema,
    audio_input: SupportSchema,
    multi_character: SupportSchema,
    dialogue_editing: SupportSchema,
    requires_upload: SupportSchema,
    max_input_duration_ms: ms.nullable(),
    max_character_references: ms.nullable(),
    resolutions: z.array(id).nullable(),
    job_retention_seconds: ms.nullable(),
    artifact_retention_seconds: ms.nullable(),
  })
  .strict();
export const ShotPlanSchema = z
  .object({
    shot_id: id,
    revision,
    route: z.enum(["edit", "regenerate", "keep"]),
    target_character_revisions: RevisionRefsSchema,
    setting_revision: RevisionRefSchema,
    line_revisions: RevisionRefsSchema,
    duration_policy: z.enum(["preserve", "fit_audio", "approved_retime"]),
    constraints: strings,
    provider_capabilities: ProviderCapabilitiesSchema,
  })
  .strict();
export const AdaptationPackageSchema = z
  .object({
    contract_version: z.literal(CONTRACT_VERSION),
    project: SourceProjectSchema,
    story: StoryBibleSchema,
    locale: LocaleBibleSchema,
    characters: z.array(CharacterBibleSchema).min(2),
    shots: z.array(ShotSchema).min(1),
    changes: z.array(AdaptationMapSchema),
    lines: z.array(LocalizedLineSchema),
    plans: z.array(ShotPlanSchema),
    revision,
    approval: ApprovalSchema,
  })
  .strict();
export const GenerationRequestSchema = z
  .object({
    operation_id: id,
    project_id: id,
    shot_id: id,
    task: z.enum([
      "reference",
      "video",
      "tts",
      "lip_sync",
      "me",
      "assembly",
      "llm",
    ]),
    model_version: id,
    evidence: EvidenceKindSchema,
    input_artifacts: z.array(ArtifactSchema),
    input_revisions: RevisionRefsSchema,
    plan: ShotPlanSchema,
    parameters: z
      .object({
        prompt: z.string(),
        seed: z.number().int().nullable(),
        audio_mode: z.enum(["none", "separate", "native"]),
        dialogue: z.array(
          z
            .object({
              line_ref: RevisionRefSchema,
              speaker_ref: RevisionRefSchema,
              target_text: id,
              voice_ref: id.nullable(),
              emotion: id,
              pronunciation: strings,
              duration_budget_ms: ms,
            })
            .strict(),
        ),
        driving_audio_artifact_id: id.nullable(),
      })
      .strict(),
  })
  .strict();
export const QuoteSchema = z
  .object({
    quote_id: id,
    provider: id,
    model_version: id,
    request_hash: z.string().regex(/^[a-f0-9]{64}$/),
    cost: CostSchema,
    expires_at: z.string().datetime().nullable(),
  })
  .strict();
export const ReceiptSchema = z
  .object({
    receipt_id: id,
    cost: CostSchema,
    final: z.boolean(),
    evidence_ref: id,
  })
  .strict();
export const SubmitResultSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("accepted"),
      job_id: id,
      receipts: z.array(ReceiptSchema),
    })
    .strict(),
  z
    .object({
      status: z.literal("rejected"),
      reason: id,
      receipts: z.array(ReceiptSchema),
    })
    .strict(),
  z.object({ status: z.literal("submission_unknown"), reason: id }).strict(),
]);
export const PollResultSchema = z
  .object({
    job_id: id,
    status: z.enum([
      "queued",
      "running",
      "succeeded",
      "failed",
      "cancelled",
      "unknown",
    ]),
    receipts: z.array(ReceiptSchema),
    message: z.string().nullable(),
  })
  .strict();
export const CancelResultSchema = z
  .object({
    job_id: id,
    status: z.enum(["cancel_requested", "cancelled", "unsupported", "unknown"]),
    receipts: z.array(ReceiptSchema),
  })
  .strict();
export const CollectResultSchema = z
  .object({
    job_id: id,
    status: z.enum(["collected", "pending", "expired", "failed"]),
    artifacts: z.array(ArtifactSchema),
    receipts: z.array(ReceiptSchema),
  })
  .strict();
export const JobStatusSchema = z.enum([
  "planned",
  "submitting",
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancel_requested",
  "cancelled",
  "submission_unknown",
  "needs_review",
]);
export const GenerationJobSchema = z
  .object({
    operation_id: id,
    provider: id,
    model_version: id,
    job_id: id.nullable(),
    request_hash: z.string().regex(/^[a-f0-9]{64}$/),
    input_revisions: RevisionRefsSchema,
    status: JobStatusSchema,
    billing_state: z.enum(["reserved", "unknown", "settled"]),
    reserved: MoneySchema,
    receipts: z.array(ReceiptSchema),
    artifacts: z.array(ArtifactSchema),
    request: GenerationRequestSchema,
  })
  .strict();
export const ResolvedTimelineSchema = z
  .object({
    fps_num: z.number().int().positive(),
    fps_den: z.number().int().positive(),
    segments: z.array(
      z
        .object({ shot_id: id, artifact_id: id, in_frame: ms, out_frame: ms })
        .strict(),
    ),
  })
  .strict()
  .superRefine((t, c) => {
    let end = 0;
    for (const s of t.segments) {
      if (s.in_frame !== end || s.out_frame <= s.in_frame)
        c.addIssue({
          code: "custom",
          message: "Timeline must be positive contiguous integer frame spans",
        });
      end = s.out_frame;
    }
  });
export const ReviewReportSchema = z
  .object({
    evidence: EvidenceKindSchema,
    technical: z.enum(["pass", "fail", "unverified"]),
    visual: z.enum(["pass", "fail", "unverified"]),
    language: z.enum(["pass", "fail", "unverified"]),
    culture: z.enum(["pass", "fail", "unverified"]),
    issues: strings,
  })
  .strict();
export const LocalizedEpisodeSchema = z
  .object({
    revision,
    shot_assets: z.array(ArtifactSchema),
    dialogue_stems: z.array(ArtifactSchema),
    me_stems: z.array(ArtifactSchema),
    subtitles: z.array(ArtifactSchema),
    input_revisions: RevisionRefsSchema,
    resolved_timeline: ResolvedTimelineSchema,
    qa_report: ReviewReportSchema,
  })
  .strict();
export type RevisionRef = z.infer<typeof RevisionRefSchema>;
export type Artifact = z.infer<typeof ArtifactSchema>;
export type AdaptationPackage = z.infer<typeof AdaptationPackageSchema>;
export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type GenerationJob = z.infer<typeof GenerationJobSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type Money = z.infer<typeof MoneySchema>;
export type ProviderCapabilities = z.infer<typeof ProviderCapabilitiesSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
export type ReviewReport = z.infer<typeof ReviewReportSchema>;
/** Providers never own orchestration state or silently retry submit. Unknown means no support assumption. */
export interface GenerationProvider {
  capabilities(signal: AbortSignal): Promise<ProviderCapabilities>;
  quote(request: GenerationRequest, signal: AbortSignal): Promise<Quote>;
  submit(
    request: GenerationRequest,
    signal: AbortSignal,
  ): Promise<z.infer<typeof SubmitResultSchema>>;
  poll(
    jobId: string,
    signal: AbortSignal,
  ): Promise<z.infer<typeof PollResultSchema>>;
  cancel(
    jobId: string,
    signal: AbortSignal,
  ): Promise<z.infer<typeof CancelResultSchema>>;
  collect(
    jobId: string,
    signal: AbortSignal,
  ): Promise<z.infer<typeof CollectResultSchema>>;
}
