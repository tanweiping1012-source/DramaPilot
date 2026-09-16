import { z } from "zod";
export declare const CONTRACT_VERSION: "0.2.1";
export declare const EvidenceKindSchema: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
export declare const SupportSchema: z.ZodEnum<["supported", "unsupported", "unknown"]>;
export declare const RevisionRefSchema: z.ZodObject<{
    kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
    id: string;
    revision: number;
}, {
    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
    id: string;
    revision: number;
}>;
export declare const RevisionRefsSchema: z.ZodEffects<z.ZodArray<z.ZodObject<{
    kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
    id: string;
    revision: number;
}, {
    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
    id: string;
    revision: number;
}>, "many">, {
    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
    id: string;
    revision: number;
}[], {
    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
    id: string;
    revision: number;
}[]>;
export declare const MoneySchema: z.ZodObject<{
    currency: z.ZodString;
    amount_micros: z.ZodNumber;
    basis: z.ZodEnum<["mock", "estimate", "actual"]>;
}, "strict", z.ZodTypeAny, {
    currency: string;
    amount_micros: number;
    basis: "mock" | "estimate" | "actual";
}, {
    currency: string;
    amount_micros: number;
    basis: "mock" | "estimate" | "actual";
}>;
export declare const CostSchema: z.ZodUnion<[z.ZodObject<{
    currency: z.ZodString;
    amount_micros: z.ZodNumber;
    basis: z.ZodEnum<["mock", "estimate", "actual"]>;
}, "strict", z.ZodTypeAny, {
    currency: string;
    amount_micros: number;
    basis: "mock" | "estimate" | "actual";
}, {
    currency: string;
    amount_micros: number;
    basis: "mock" | "estimate" | "actual";
}>, z.ZodObject<{
    basis: z.ZodLiteral<"unknown">;
}, "strict", z.ZodTypeAny, {
    basis: "unknown";
}, {
    basis: "unknown";
}>]>;
export declare const MediaProbeSchema: z.ZodObject<{
    fps_num: z.ZodNumber;
    fps_den: z.ZodNumber;
    frame_count: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    fps_num: number;
    fps_den: number;
    frame_count: number;
    width: number;
    height: number;
}, {
    fps_num: number;
    fps_den: number;
    frame_count: number;
    width: number;
    height: number;
}>;
export declare const ArtifactSchema: z.ZodObject<{
    artifact_id: z.ZodString;
    kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
    uri: z.ZodString;
    sha256: z.ZodString;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>, "many">, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[], {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[]>;
    operation_id: z.ZodNullable<z.ZodString>;
    media_type: z.ZodString;
    duration_ms: z.ZodNullable<z.ZodNumber>;
    probe: z.ZodNullable<z.ZodObject<{
        fps_num: z.ZodNumber;
        fps_den: z.ZodNumber;
        frame_count: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        fps_num: number;
        fps_den: number;
        frame_count: number;
        width: number;
        height: number;
    }, {
        fps_num: number;
        fps_den: number;
        frame_count: number;
        width: number;
        height: number;
    }>>;
    expires_at: z.ZodNullable<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
    artifact_id: string;
    uri: string;
    sha256: string;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    operation_id: string | null;
    media_type: string;
    duration_ms: number | null;
    probe: {
        fps_num: number;
        fps_den: number;
        frame_count: number;
        width: number;
        height: number;
    } | null;
    expires_at: string | null;
}, {
    kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
    artifact_id: string;
    uri: string;
    sha256: string;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    operation_id: string | null;
    media_type: string;
    duration_ms: number | null;
    probe: {
        fps_num: number;
        fps_den: number;
        frame_count: number;
        width: number;
        height: number;
    } | null;
    expires_at: string | null;
}>;
export declare const RightsScopeSchema: z.ZodObject<{
    process: z.ZodBoolean;
    external_upload: z.ZodBoolean;
    visual_adaptation: z.ZodBoolean;
    voice_use: z.ZodBoolean;
    public_demo: z.ZodBoolean;
    evidence_refs: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    process: boolean;
    external_upload: boolean;
    visual_adaptation: boolean;
    voice_use: boolean;
    public_demo: boolean;
    evidence_refs: string[];
}, {
    process: boolean;
    external_upload: boolean;
    visual_adaptation: boolean;
    voice_use: boolean;
    public_demo: boolean;
    evidence_refs: string[];
}>;
export declare const SourceProjectSchema: z.ZodObject<{
    project_id: z.ZodString;
    revision: z.ZodNumber;
    assets: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    source_locale: z.ZodString;
    source_type: z.ZodEnum<["live_action", "ai", "mixed"]>;
    rights_scope: z.ZodObject<{
        process: z.ZodBoolean;
        external_upload: z.ZodBoolean;
        visual_adaptation: z.ZodBoolean;
        voice_use: z.ZodBoolean;
        public_demo: z.ZodBoolean;
        evidence_refs: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        process: boolean;
        external_upload: boolean;
        visual_adaptation: boolean;
        voice_use: boolean;
        public_demo: boolean;
        evidence_refs: string[];
    }, {
        process: boolean;
        external_upload: boolean;
        visual_adaptation: boolean;
        voice_use: boolean;
        public_demo: boolean;
        evidence_refs: string[];
    }>;
    input_hashes: z.ZodArray<z.ZodString, "many">;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
}, "strict", z.ZodTypeAny, {
    revision: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    project_id: string;
    assets: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    source_locale: string;
    source_type: "live_action" | "ai" | "mixed";
    rights_scope: {
        process: boolean;
        external_upload: boolean;
        visual_adaptation: boolean;
        voice_use: boolean;
        public_demo: boolean;
        evidence_refs: string[];
    };
    input_hashes: string[];
}, {
    revision: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    project_id: string;
    assets: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    source_locale: string;
    source_type: "live_action" | "ai" | "mixed";
    rights_scope: {
        process: boolean;
        external_upload: boolean;
        visual_adaptation: boolean;
        voice_use: boolean;
        public_demo: boolean;
        evidence_refs: string[];
    };
    input_hashes: string[];
}>;
export declare const ShotSchema: z.ZodEffects<z.ZodObject<{
    shot_id: z.ZodString;
    source_in_ms: z.ZodNumber;
    source_out_ms: z.ZodNumber;
    character_ids: z.ZodArray<z.ZodString, "many">;
    dialogue_ids: z.ZodArray<z.ZodString, "many">;
    visual_evidence: z.ZodArray<z.ZodString, "many">;
    ingest_mode: z.ZodEnum<["automatic", "assisted", "fixture"]>;
}, "strict", z.ZodTypeAny, {
    shot_id: string;
    source_in_ms: number;
    source_out_ms: number;
    character_ids: string[];
    dialogue_ids: string[];
    visual_evidence: string[];
    ingest_mode: "fixture" | "automatic" | "assisted";
}, {
    shot_id: string;
    source_in_ms: number;
    source_out_ms: number;
    character_ids: string[];
    dialogue_ids: string[];
    visual_evidence: string[];
    ingest_mode: "fixture" | "automatic" | "assisted";
}>, {
    shot_id: string;
    source_in_ms: number;
    source_out_ms: number;
    character_ids: string[];
    dialogue_ids: string[];
    visual_evidence: string[];
    ingest_mode: "fixture" | "automatic" | "assisted";
}, {
    shot_id: string;
    source_in_ms: number;
    source_out_ms: number;
    character_ids: string[];
    dialogue_ids: string[];
    visual_evidence: string[];
    ingest_mode: "fixture" | "automatic" | "assisted";
}>;
export declare const StoryBibleSchema: z.ZodObject<{
    characters: z.ZodArray<z.ZodObject<{
        character_id: z.ZodString;
        source_description: z.ZodString;
        evidence_refs: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        evidence_refs: string[];
        character_id: string;
        source_description: string;
    }, {
        evidence_refs: string[];
        character_id: string;
        source_description: string;
    }>, "many">;
    relations: z.ZodArray<z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        relation: z.ZodString;
        evidence_refs: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        evidence_refs: string[];
        from: string;
        to: string;
        relation: string;
    }, {
        evidence_refs: string[];
        from: string;
        to: string;
        relation: string;
    }>, "many">;
    beats: z.ZodArray<z.ZodObject<{
        beat_id: z.ZodString;
        source_fact: z.ZodString;
        evidence_refs: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        evidence_refs: string[];
        beat_id: string;
        source_fact: string;
    }, {
        evidence_refs: string[];
        beat_id: string;
        source_fact: string;
    }>, "many">;
    invariants: z.ZodArray<z.ZodString, "many">;
    unknowns: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    characters: {
        evidence_refs: string[];
        character_id: string;
        source_description: string;
    }[];
    relations: {
        evidence_refs: string[];
        from: string;
        to: string;
        relation: string;
    }[];
    beats: {
        evidence_refs: string[];
        beat_id: string;
        source_fact: string;
    }[];
    invariants: string[];
    unknowns: string[];
}, {
    characters: {
        evidence_refs: string[];
        character_id: string;
        source_description: string;
    }[];
    relations: {
        evidence_refs: string[];
        from: string;
        to: string;
        relation: string;
    }[];
    beats: {
        evidence_refs: string[];
        beat_id: string;
        source_fact: string;
    }[];
    invariants: string[];
    unknowns: string[];
}>;
export declare const ApprovalSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["proposed", "approved", "rejected"]>;
    approver: z.ZodNullable<z.ZodString>;
    approved_at: z.ZodNullable<z.ZodString>;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    status: "proposed" | "approved" | "rejected";
    revision: number;
    approver: string | null;
    approved_at: string | null;
}, {
    status: "proposed" | "approved" | "rejected";
    revision: number;
    approver: string | null;
    approved_at: string | null;
}>, {
    status: "proposed" | "approved" | "rejected";
    revision: number;
    approver: string | null;
    approved_at: string | null;
}, {
    status: "proposed" | "approved" | "rejected";
    revision: number;
    approver: string | null;
    approved_at: string | null;
}>;
export declare const LocaleBibleSchema: z.ZodObject<{
    locale: z.ZodLiteral<"en-US">;
    audience_brief: z.ZodString;
    setting: z.ZodString;
    register: z.ZodString;
    culture_decisions: z.ZodArray<z.ZodString, "many">;
    review_status: z.ZodEnum<["unreviewed", "needs_review", "reviewed"]>;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    locale: "en-US";
    revision: number;
    audience_brief: string;
    setting: string;
    register: string;
    culture_decisions: string[];
    review_status: "unreviewed" | "needs_review" | "reviewed";
}, {
    locale: "en-US";
    revision: number;
    audience_brief: string;
    setting: string;
    register: string;
    culture_decisions: string[];
    review_status: "unreviewed" | "needs_review" | "reviewed";
}>;
export declare const CharacterBibleSchema: z.ZodObject<{
    character_id: z.ZodString;
    source_binding: z.ZodArray<z.ZodString, "many">;
    target_ref_ids: z.ZodArray<z.ZodString, "many">;
    appearance_brief: z.ZodString;
    wardrobe: z.ZodString;
    voice_ref: z.ZodNullable<z.ZodString>;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    revision: number;
    character_id: string;
    source_binding: string[];
    target_ref_ids: string[];
    appearance_brief: string;
    wardrobe: string;
    voice_ref: string | null;
}, {
    revision: number;
    character_id: string;
    source_binding: string[];
    target_ref_ids: string[];
    appearance_brief: string;
    wardrobe: string;
    voice_ref: string | null;
}>;
export declare const AdaptationMapSchema: z.ZodObject<{
    change_id: z.ZodString;
    source_refs: z.ZodArray<z.ZodString, "many">;
    source_meaning: z.ZodString;
    target_change: z.ZodString;
    reason: z.ZodString;
    strategy: z.ZodEnum<["retain", "explain", "rewrite", "rebuild"]>;
    preserved_beats: z.ZodArray<z.ZodString, "many">;
    affected_assets: z.ZodArray<z.ZodString, "many">;
    approval: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["proposed", "approved", "rejected"]>;
        approver: z.ZodNullable<z.ZodString>;
        approved_at: z.ZodNullable<z.ZodString>;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }>, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }>;
}, "strict", z.ZodTypeAny, {
    change_id: string;
    source_refs: string[];
    source_meaning: string;
    target_change: string;
    reason: string;
    strategy: "retain" | "explain" | "rewrite" | "rebuild";
    preserved_beats: string[];
    affected_assets: string[];
    approval: {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    };
}, {
    change_id: string;
    source_refs: string[];
    source_meaning: string;
    target_change: string;
    reason: string;
    strategy: "retain" | "explain" | "rewrite" | "rebuild";
    preserved_beats: string[];
    affected_assets: string[];
    approval: {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    };
}>;
export declare const LocalizedLineSchema: z.ZodObject<{
    line_id: z.ZodString;
    source_dialogue_ids: z.ZodArray<z.ZodString, "many">;
    speaker_character_id: z.ZodString;
    target_text: z.ZodString;
    emotion: z.ZodString;
    pronunciation: z.ZodArray<z.ZodString, "many">;
    duration_budget_ms: z.ZodNumber;
    actual_duration_ms: z.ZodNullable<z.ZodNumber>;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    revision: number;
    line_id: string;
    source_dialogue_ids: string[];
    speaker_character_id: string;
    target_text: string;
    emotion: string;
    pronunciation: string[];
    duration_budget_ms: number;
    actual_duration_ms: number | null;
}, {
    revision: number;
    line_id: string;
    source_dialogue_ids: string[];
    speaker_character_id: string;
    target_text: string;
    emotion: string;
    pronunciation: string[];
    duration_budget_ms: number;
    actual_duration_ms: number | null;
}>;
export declare const ProviderCapabilitiesSchema: z.ZodObject<{
    provider: z.ZodString;
    model_version: z.ZodString;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    async: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    poll: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    cancel: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    idempotency: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    request_lookup: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    native_audio_driven_video: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    audio_input: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    multi_character: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    dialogue_editing: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    requires_upload: z.ZodEnum<["supported", "unsupported", "unknown"]>;
    max_input_duration_ms: z.ZodNullable<z.ZodNumber>;
    max_character_references: z.ZodNullable<z.ZodNumber>;
    resolutions: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    job_retention_seconds: z.ZodNullable<z.ZodNumber>;
    artifact_retention_seconds: z.ZodNullable<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    evidence: "fixture" | "mock" | "live" | "external_manual";
    provider: string;
    model_version: string;
    async: "supported" | "unsupported" | "unknown";
    poll: "supported" | "unsupported" | "unknown";
    cancel: "supported" | "unsupported" | "unknown";
    idempotency: "supported" | "unsupported" | "unknown";
    request_lookup: "supported" | "unsupported" | "unknown";
    native_audio_driven_video: "supported" | "unsupported" | "unknown";
    audio_input: "supported" | "unsupported" | "unknown";
    multi_character: "supported" | "unsupported" | "unknown";
    dialogue_editing: "supported" | "unsupported" | "unknown";
    requires_upload: "supported" | "unsupported" | "unknown";
    max_input_duration_ms: number | null;
    max_character_references: number | null;
    resolutions: string[] | null;
    job_retention_seconds: number | null;
    artifact_retention_seconds: number | null;
}, {
    evidence: "fixture" | "mock" | "live" | "external_manual";
    provider: string;
    model_version: string;
    async: "supported" | "unsupported" | "unknown";
    poll: "supported" | "unsupported" | "unknown";
    cancel: "supported" | "unsupported" | "unknown";
    idempotency: "supported" | "unsupported" | "unknown";
    request_lookup: "supported" | "unsupported" | "unknown";
    native_audio_driven_video: "supported" | "unsupported" | "unknown";
    audio_input: "supported" | "unsupported" | "unknown";
    multi_character: "supported" | "unsupported" | "unknown";
    dialogue_editing: "supported" | "unsupported" | "unknown";
    requires_upload: "supported" | "unsupported" | "unknown";
    max_input_duration_ms: number | null;
    max_character_references: number | null;
    resolutions: string[] | null;
    job_retention_seconds: number | null;
    artifact_retention_seconds: number | null;
}>;
export declare const ShotPlanSchema: z.ZodObject<{
    shot_id: z.ZodString;
    revision: z.ZodNumber;
    route: z.ZodEnum<["edit", "regenerate", "keep"]>;
    target_character_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>, "many">, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[], {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[]>;
    setting_revision: z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>;
    line_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>, "many">, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[], {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[]>;
    duration_policy: z.ZodEnum<["preserve", "fit_audio", "approved_retime"]>;
    constraints: z.ZodArray<z.ZodString, "many">;
    provider_capabilities: z.ZodObject<{
        provider: z.ZodString;
        model_version: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        async: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        poll: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        cancel: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        idempotency: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        request_lookup: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        native_audio_driven_video: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        audio_input: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        multi_character: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        dialogue_editing: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        requires_upload: z.ZodEnum<["supported", "unsupported", "unknown"]>;
        max_input_duration_ms: z.ZodNullable<z.ZodNumber>;
        max_character_references: z.ZodNullable<z.ZodNumber>;
        resolutions: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
        job_retention_seconds: z.ZodNullable<z.ZodNumber>;
        artifact_retention_seconds: z.ZodNullable<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        provider: string;
        model_version: string;
        async: "supported" | "unsupported" | "unknown";
        poll: "supported" | "unsupported" | "unknown";
        cancel: "supported" | "unsupported" | "unknown";
        idempotency: "supported" | "unsupported" | "unknown";
        request_lookup: "supported" | "unsupported" | "unknown";
        native_audio_driven_video: "supported" | "unsupported" | "unknown";
        audio_input: "supported" | "unsupported" | "unknown";
        multi_character: "supported" | "unsupported" | "unknown";
        dialogue_editing: "supported" | "unsupported" | "unknown";
        requires_upload: "supported" | "unsupported" | "unknown";
        max_input_duration_ms: number | null;
        max_character_references: number | null;
        resolutions: string[] | null;
        job_retention_seconds: number | null;
        artifact_retention_seconds: number | null;
    }, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        provider: string;
        model_version: string;
        async: "supported" | "unsupported" | "unknown";
        poll: "supported" | "unsupported" | "unknown";
        cancel: "supported" | "unsupported" | "unknown";
        idempotency: "supported" | "unsupported" | "unknown";
        request_lookup: "supported" | "unsupported" | "unknown";
        native_audio_driven_video: "supported" | "unsupported" | "unknown";
        audio_input: "supported" | "unsupported" | "unknown";
        multi_character: "supported" | "unsupported" | "unknown";
        dialogue_editing: "supported" | "unsupported" | "unknown";
        requires_upload: "supported" | "unsupported" | "unknown";
        max_input_duration_ms: number | null;
        max_character_references: number | null;
        resolutions: string[] | null;
        job_retention_seconds: number | null;
        artifact_retention_seconds: number | null;
    }>;
}, "strict", z.ZodTypeAny, {
    revision: number;
    shot_id: string;
    route: "edit" | "regenerate" | "keep";
    target_character_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    setting_revision: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    };
    line_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    duration_policy: "preserve" | "fit_audio" | "approved_retime";
    constraints: string[];
    provider_capabilities: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        provider: string;
        model_version: string;
        async: "supported" | "unsupported" | "unknown";
        poll: "supported" | "unsupported" | "unknown";
        cancel: "supported" | "unsupported" | "unknown";
        idempotency: "supported" | "unsupported" | "unknown";
        request_lookup: "supported" | "unsupported" | "unknown";
        native_audio_driven_video: "supported" | "unsupported" | "unknown";
        audio_input: "supported" | "unsupported" | "unknown";
        multi_character: "supported" | "unsupported" | "unknown";
        dialogue_editing: "supported" | "unsupported" | "unknown";
        requires_upload: "supported" | "unsupported" | "unknown";
        max_input_duration_ms: number | null;
        max_character_references: number | null;
        resolutions: string[] | null;
        job_retention_seconds: number | null;
        artifact_retention_seconds: number | null;
    };
}, {
    revision: number;
    shot_id: string;
    route: "edit" | "regenerate" | "keep";
    target_character_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    setting_revision: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    };
    line_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    duration_policy: "preserve" | "fit_audio" | "approved_retime";
    constraints: string[];
    provider_capabilities: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        provider: string;
        model_version: string;
        async: "supported" | "unsupported" | "unknown";
        poll: "supported" | "unsupported" | "unknown";
        cancel: "supported" | "unsupported" | "unknown";
        idempotency: "supported" | "unsupported" | "unknown";
        request_lookup: "supported" | "unsupported" | "unknown";
        native_audio_driven_video: "supported" | "unsupported" | "unknown";
        audio_input: "supported" | "unsupported" | "unknown";
        multi_character: "supported" | "unsupported" | "unknown";
        dialogue_editing: "supported" | "unsupported" | "unknown";
        requires_upload: "supported" | "unsupported" | "unknown";
        max_input_duration_ms: number | null;
        max_character_references: number | null;
        resolutions: string[] | null;
        job_retention_seconds: number | null;
        artifact_retention_seconds: number | null;
    };
}>;
export declare const AdaptationPackageSchema: z.ZodObject<{
    contract_version: z.ZodLiteral<"0.2.1">;
    project: z.ZodObject<{
        project_id: z.ZodString;
        revision: z.ZodNumber;
        assets: z.ZodArray<z.ZodObject<{
            artifact_id: z.ZodString;
            kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
            uri: z.ZodString;
            sha256: z.ZodString;
            evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
            input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>, "many">, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[], {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[]>;
            operation_id: z.ZodNullable<z.ZodString>;
            media_type: z.ZodString;
            duration_ms: z.ZodNullable<z.ZodNumber>;
            probe: z.ZodNullable<z.ZodObject<{
                fps_num: z.ZodNumber;
                fps_den: z.ZodNumber;
                frame_count: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            }, {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            }>>;
            expires_at: z.ZodNullable<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }, {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }>, "many">;
        source_locale: z.ZodString;
        source_type: z.ZodEnum<["live_action", "ai", "mixed"]>;
        rights_scope: z.ZodObject<{
            process: z.ZodBoolean;
            external_upload: z.ZodBoolean;
            visual_adaptation: z.ZodBoolean;
            voice_use: z.ZodBoolean;
            public_demo: z.ZodBoolean;
            evidence_refs: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            process: boolean;
            external_upload: boolean;
            visual_adaptation: boolean;
            voice_use: boolean;
            public_demo: boolean;
            evidence_refs: string[];
        }, {
            process: boolean;
            external_upload: boolean;
            visual_adaptation: boolean;
            voice_use: boolean;
            public_demo: boolean;
            evidence_refs: string[];
        }>;
        input_hashes: z.ZodArray<z.ZodString, "many">;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    }, "strict", z.ZodTypeAny, {
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        project_id: string;
        assets: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        source_locale: string;
        source_type: "live_action" | "ai" | "mixed";
        rights_scope: {
            process: boolean;
            external_upload: boolean;
            visual_adaptation: boolean;
            voice_use: boolean;
            public_demo: boolean;
            evidence_refs: string[];
        };
        input_hashes: string[];
    }, {
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        project_id: string;
        assets: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        source_locale: string;
        source_type: "live_action" | "ai" | "mixed";
        rights_scope: {
            process: boolean;
            external_upload: boolean;
            visual_adaptation: boolean;
            voice_use: boolean;
            public_demo: boolean;
            evidence_refs: string[];
        };
        input_hashes: string[];
    }>;
    story: z.ZodObject<{
        characters: z.ZodArray<z.ZodObject<{
            character_id: z.ZodString;
            source_description: z.ZodString;
            evidence_refs: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            evidence_refs: string[];
            character_id: string;
            source_description: string;
        }, {
            evidence_refs: string[];
            character_id: string;
            source_description: string;
        }>, "many">;
        relations: z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
            relation: z.ZodString;
            evidence_refs: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            evidence_refs: string[];
            from: string;
            to: string;
            relation: string;
        }, {
            evidence_refs: string[];
            from: string;
            to: string;
            relation: string;
        }>, "many">;
        beats: z.ZodArray<z.ZodObject<{
            beat_id: z.ZodString;
            source_fact: z.ZodString;
            evidence_refs: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            evidence_refs: string[];
            beat_id: string;
            source_fact: string;
        }, {
            evidence_refs: string[];
            beat_id: string;
            source_fact: string;
        }>, "many">;
        invariants: z.ZodArray<z.ZodString, "many">;
        unknowns: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        characters: {
            evidence_refs: string[];
            character_id: string;
            source_description: string;
        }[];
        relations: {
            evidence_refs: string[];
            from: string;
            to: string;
            relation: string;
        }[];
        beats: {
            evidence_refs: string[];
            beat_id: string;
            source_fact: string;
        }[];
        invariants: string[];
        unknowns: string[];
    }, {
        characters: {
            evidence_refs: string[];
            character_id: string;
            source_description: string;
        }[];
        relations: {
            evidence_refs: string[];
            from: string;
            to: string;
            relation: string;
        }[];
        beats: {
            evidence_refs: string[];
            beat_id: string;
            source_fact: string;
        }[];
        invariants: string[];
        unknowns: string[];
    }>;
    locale: z.ZodObject<{
        locale: z.ZodLiteral<"en-US">;
        audience_brief: z.ZodString;
        setting: z.ZodString;
        register: z.ZodString;
        culture_decisions: z.ZodArray<z.ZodString, "many">;
        review_status: z.ZodEnum<["unreviewed", "needs_review", "reviewed"]>;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        locale: "en-US";
        revision: number;
        audience_brief: string;
        setting: string;
        register: string;
        culture_decisions: string[];
        review_status: "unreviewed" | "needs_review" | "reviewed";
    }, {
        locale: "en-US";
        revision: number;
        audience_brief: string;
        setting: string;
        register: string;
        culture_decisions: string[];
        review_status: "unreviewed" | "needs_review" | "reviewed";
    }>;
    characters: z.ZodArray<z.ZodObject<{
        character_id: z.ZodString;
        source_binding: z.ZodArray<z.ZodString, "many">;
        target_ref_ids: z.ZodArray<z.ZodString, "many">;
        appearance_brief: z.ZodString;
        wardrobe: z.ZodString;
        voice_ref: z.ZodNullable<z.ZodString>;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        revision: number;
        character_id: string;
        source_binding: string[];
        target_ref_ids: string[];
        appearance_brief: string;
        wardrobe: string;
        voice_ref: string | null;
    }, {
        revision: number;
        character_id: string;
        source_binding: string[];
        target_ref_ids: string[];
        appearance_brief: string;
        wardrobe: string;
        voice_ref: string | null;
    }>, "many">;
    shots: z.ZodArray<z.ZodEffects<z.ZodObject<{
        shot_id: z.ZodString;
        source_in_ms: z.ZodNumber;
        source_out_ms: z.ZodNumber;
        character_ids: z.ZodArray<z.ZodString, "many">;
        dialogue_ids: z.ZodArray<z.ZodString, "many">;
        visual_evidence: z.ZodArray<z.ZodString, "many">;
        ingest_mode: z.ZodEnum<["automatic", "assisted", "fixture"]>;
    }, "strict", z.ZodTypeAny, {
        shot_id: string;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        visual_evidence: string[];
        ingest_mode: "fixture" | "automatic" | "assisted";
    }, {
        shot_id: string;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        visual_evidence: string[];
        ingest_mode: "fixture" | "automatic" | "assisted";
    }>, {
        shot_id: string;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        visual_evidence: string[];
        ingest_mode: "fixture" | "automatic" | "assisted";
    }, {
        shot_id: string;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        visual_evidence: string[];
        ingest_mode: "fixture" | "automatic" | "assisted";
    }>, "many">;
    changes: z.ZodArray<z.ZodObject<{
        change_id: z.ZodString;
        source_refs: z.ZodArray<z.ZodString, "many">;
        source_meaning: z.ZodString;
        target_change: z.ZodString;
        reason: z.ZodString;
        strategy: z.ZodEnum<["retain", "explain", "rewrite", "rebuild"]>;
        preserved_beats: z.ZodArray<z.ZodString, "many">;
        affected_assets: z.ZodArray<z.ZodString, "many">;
        approval: z.ZodEffects<z.ZodObject<{
            status: z.ZodEnum<["proposed", "approved", "rejected"]>;
            approver: z.ZodNullable<z.ZodString>;
            approved_at: z.ZodNullable<z.ZodString>;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        }, {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        }>, {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        }, {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        }>;
    }, "strict", z.ZodTypeAny, {
        change_id: string;
        source_refs: string[];
        source_meaning: string;
        target_change: string;
        reason: string;
        strategy: "retain" | "explain" | "rewrite" | "rebuild";
        preserved_beats: string[];
        affected_assets: string[];
        approval: {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        };
    }, {
        change_id: string;
        source_refs: string[];
        source_meaning: string;
        target_change: string;
        reason: string;
        strategy: "retain" | "explain" | "rewrite" | "rebuild";
        preserved_beats: string[];
        affected_assets: string[];
        approval: {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        };
    }>, "many">;
    lines: z.ZodArray<z.ZodObject<{
        line_id: z.ZodString;
        source_dialogue_ids: z.ZodArray<z.ZodString, "many">;
        speaker_character_id: z.ZodString;
        target_text: z.ZodString;
        emotion: z.ZodString;
        pronunciation: z.ZodArray<z.ZodString, "many">;
        duration_budget_ms: z.ZodNumber;
        actual_duration_ms: z.ZodNullable<z.ZodNumber>;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        revision: number;
        line_id: string;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        target_text: string;
        emotion: string;
        pronunciation: string[];
        duration_budget_ms: number;
        actual_duration_ms: number | null;
    }, {
        revision: number;
        line_id: string;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        target_text: string;
        emotion: string;
        pronunciation: string[];
        duration_budget_ms: number;
        actual_duration_ms: number | null;
    }>, "many">;
    plans: z.ZodArray<z.ZodObject<{
        shot_id: z.ZodString;
        revision: z.ZodNumber;
        route: z.ZodEnum<["edit", "regenerate", "keep"]>;
        target_character_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        setting_revision: z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>;
        line_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        duration_policy: z.ZodEnum<["preserve", "fit_audio", "approved_retime"]>;
        constraints: z.ZodArray<z.ZodString, "many">;
        provider_capabilities: z.ZodObject<{
            provider: z.ZodString;
            model_version: z.ZodString;
            evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
            async: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            poll: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            cancel: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            idempotency: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            request_lookup: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            native_audio_driven_video: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            audio_input: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            multi_character: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            dialogue_editing: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            requires_upload: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            max_input_duration_ms: z.ZodNullable<z.ZodNumber>;
            max_character_references: z.ZodNullable<z.ZodNumber>;
            resolutions: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
            job_retention_seconds: z.ZodNullable<z.ZodNumber>;
            artifact_retention_seconds: z.ZodNullable<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        }, {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        }>;
    }, "strict", z.ZodTypeAny, {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    }, {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    }>, "many">;
    revision: z.ZodNumber;
    approval: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["proposed", "approved", "rejected"]>;
        approver: z.ZodNullable<z.ZodString>;
        approved_at: z.ZodNullable<z.ZodString>;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }>, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }, {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    }>;
}, "strict", z.ZodTypeAny, {
    locale: {
        locale: "en-US";
        revision: number;
        audience_brief: string;
        setting: string;
        register: string;
        culture_decisions: string[];
        review_status: "unreviewed" | "needs_review" | "reviewed";
    };
    revision: number;
    characters: {
        revision: number;
        character_id: string;
        source_binding: string[];
        target_ref_ids: string[];
        appearance_brief: string;
        wardrobe: string;
        voice_ref: string | null;
    }[];
    approval: {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    };
    contract_version: "0.2.1";
    project: {
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        project_id: string;
        assets: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        source_locale: string;
        source_type: "live_action" | "ai" | "mixed";
        rights_scope: {
            process: boolean;
            external_upload: boolean;
            visual_adaptation: boolean;
            voice_use: boolean;
            public_demo: boolean;
            evidence_refs: string[];
        };
        input_hashes: string[];
    };
    story: {
        characters: {
            evidence_refs: string[];
            character_id: string;
            source_description: string;
        }[];
        relations: {
            evidence_refs: string[];
            from: string;
            to: string;
            relation: string;
        }[];
        beats: {
            evidence_refs: string[];
            beat_id: string;
            source_fact: string;
        }[];
        invariants: string[];
        unknowns: string[];
    };
    shots: {
        shot_id: string;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        visual_evidence: string[];
        ingest_mode: "fixture" | "automatic" | "assisted";
    }[];
    changes: {
        change_id: string;
        source_refs: string[];
        source_meaning: string;
        target_change: string;
        reason: string;
        strategy: "retain" | "explain" | "rewrite" | "rebuild";
        preserved_beats: string[];
        affected_assets: string[];
        approval: {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        };
    }[];
    lines: {
        revision: number;
        line_id: string;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        target_text: string;
        emotion: string;
        pronunciation: string[];
        duration_budget_ms: number;
        actual_duration_ms: number | null;
    }[];
    plans: {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    }[];
}, {
    locale: {
        locale: "en-US";
        revision: number;
        audience_brief: string;
        setting: string;
        register: string;
        culture_decisions: string[];
        review_status: "unreviewed" | "needs_review" | "reviewed";
    };
    revision: number;
    characters: {
        revision: number;
        character_id: string;
        source_binding: string[];
        target_ref_ids: string[];
        appearance_brief: string;
        wardrobe: string;
        voice_ref: string | null;
    }[];
    approval: {
        status: "proposed" | "approved" | "rejected";
        revision: number;
        approver: string | null;
        approved_at: string | null;
    };
    contract_version: "0.2.1";
    project: {
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        project_id: string;
        assets: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        source_locale: string;
        source_type: "live_action" | "ai" | "mixed";
        rights_scope: {
            process: boolean;
            external_upload: boolean;
            visual_adaptation: boolean;
            voice_use: boolean;
            public_demo: boolean;
            evidence_refs: string[];
        };
        input_hashes: string[];
    };
    story: {
        characters: {
            evidence_refs: string[];
            character_id: string;
            source_description: string;
        }[];
        relations: {
            evidence_refs: string[];
            from: string;
            to: string;
            relation: string;
        }[];
        beats: {
            evidence_refs: string[];
            beat_id: string;
            source_fact: string;
        }[];
        invariants: string[];
        unknowns: string[];
    };
    shots: {
        shot_id: string;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        visual_evidence: string[];
        ingest_mode: "fixture" | "automatic" | "assisted";
    }[];
    changes: {
        change_id: string;
        source_refs: string[];
        source_meaning: string;
        target_change: string;
        reason: string;
        strategy: "retain" | "explain" | "rewrite" | "rebuild";
        preserved_beats: string[];
        affected_assets: string[];
        approval: {
            status: "proposed" | "approved" | "rejected";
            revision: number;
            approver: string | null;
            approved_at: string | null;
        };
    }[];
    lines: {
        revision: number;
        line_id: string;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        target_text: string;
        emotion: string;
        pronunciation: string[];
        duration_budget_ms: number;
        actual_duration_ms: number | null;
    }[];
    plans: {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    }[];
}>;
export declare const GenerationRequestSchema: z.ZodObject<{
    operation_id: z.ZodString;
    project_id: z.ZodString;
    shot_id: z.ZodString;
    task: z.ZodEnum<["reference", "video", "tts", "lip_sync", "me", "assembly", "llm"]>;
    model_version: z.ZodString;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    input_artifacts: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>, "many">, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[], {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[]>;
    plan: z.ZodObject<{
        shot_id: z.ZodString;
        revision: z.ZodNumber;
        route: z.ZodEnum<["edit", "regenerate", "keep"]>;
        target_character_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        setting_revision: z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>;
        line_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        duration_policy: z.ZodEnum<["preserve", "fit_audio", "approved_retime"]>;
        constraints: z.ZodArray<z.ZodString, "many">;
        provider_capabilities: z.ZodObject<{
            provider: z.ZodString;
            model_version: z.ZodString;
            evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
            async: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            poll: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            cancel: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            idempotency: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            request_lookup: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            native_audio_driven_video: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            audio_input: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            multi_character: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            dialogue_editing: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            requires_upload: z.ZodEnum<["supported", "unsupported", "unknown"]>;
            max_input_duration_ms: z.ZodNullable<z.ZodNumber>;
            max_character_references: z.ZodNullable<z.ZodNumber>;
            resolutions: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
            job_retention_seconds: z.ZodNullable<z.ZodNumber>;
            artifact_retention_seconds: z.ZodNullable<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        }, {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        }>;
    }, "strict", z.ZodTypeAny, {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    }, {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    }>;
    parameters: z.ZodObject<{
        prompt: z.ZodString;
        seed: z.ZodNullable<z.ZodNumber>;
        audio_mode: z.ZodEnum<["none", "separate", "native"]>;
        dialogue: z.ZodArray<z.ZodObject<{
            line_ref: z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>;
            speaker_ref: z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>;
            target_text: z.ZodString;
            voice_ref: z.ZodNullable<z.ZodString>;
            emotion: z.ZodString;
            pronunciation: z.ZodArray<z.ZodString, "many">;
            duration_budget_ms: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            voice_ref: string | null;
            target_text: string;
            emotion: string;
            pronunciation: string[];
            duration_budget_ms: number;
            line_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            speaker_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
        }, {
            voice_ref: string | null;
            target_text: string;
            emotion: string;
            pronunciation: string[];
            duration_budget_ms: number;
            line_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            speaker_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
        }>, "many">;
        driving_audio_artifact_id: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        prompt: string;
        seed: number | null;
        audio_mode: "none" | "separate" | "native";
        dialogue: {
            voice_ref: string | null;
            target_text: string;
            emotion: string;
            pronunciation: string[];
            duration_budget_ms: number;
            line_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            speaker_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
        }[];
        driving_audio_artifact_id: string | null;
    }, {
        prompt: string;
        seed: number | null;
        audio_mode: "none" | "separate" | "native";
        dialogue: {
            voice_ref: string | null;
            target_text: string;
            emotion: string;
            pronunciation: string[];
            duration_budget_ms: number;
            line_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            speaker_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
        }[];
        driving_audio_artifact_id: string | null;
    }>;
}, "strict", z.ZodTypeAny, {
    evidence: "fixture" | "mock" | "live" | "external_manual";
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    operation_id: string;
    project_id: string;
    shot_id: string;
    model_version: string;
    task: "video" | "lip_sync" | "reference" | "tts" | "me" | "assembly" | "llm";
    input_artifacts: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    plan: {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    };
    parameters: {
        prompt: string;
        seed: number | null;
        audio_mode: "none" | "separate" | "native";
        dialogue: {
            voice_ref: string | null;
            target_text: string;
            emotion: string;
            pronunciation: string[];
            duration_budget_ms: number;
            line_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            speaker_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
        }[];
        driving_audio_artifact_id: string | null;
    };
}, {
    evidence: "fixture" | "mock" | "live" | "external_manual";
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    operation_id: string;
    project_id: string;
    shot_id: string;
    model_version: string;
    task: "video" | "lip_sync" | "reference" | "tts" | "me" | "assembly" | "llm";
    input_artifacts: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    plan: {
        revision: number;
        shot_id: string;
        route: "edit" | "regenerate" | "keep";
        target_character_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        setting_revision: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        };
        line_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        duration_policy: "preserve" | "fit_audio" | "approved_retime";
        constraints: string[];
        provider_capabilities: {
            evidence: "fixture" | "mock" | "live" | "external_manual";
            provider: string;
            model_version: string;
            async: "supported" | "unsupported" | "unknown";
            poll: "supported" | "unsupported" | "unknown";
            cancel: "supported" | "unsupported" | "unknown";
            idempotency: "supported" | "unsupported" | "unknown";
            request_lookup: "supported" | "unsupported" | "unknown";
            native_audio_driven_video: "supported" | "unsupported" | "unknown";
            audio_input: "supported" | "unsupported" | "unknown";
            multi_character: "supported" | "unsupported" | "unknown";
            dialogue_editing: "supported" | "unsupported" | "unknown";
            requires_upload: "supported" | "unsupported" | "unknown";
            max_input_duration_ms: number | null;
            max_character_references: number | null;
            resolutions: string[] | null;
            job_retention_seconds: number | null;
            artifact_retention_seconds: number | null;
        };
    };
    parameters: {
        prompt: string;
        seed: number | null;
        audio_mode: "none" | "separate" | "native";
        dialogue: {
            voice_ref: string | null;
            target_text: string;
            emotion: string;
            pronunciation: string[];
            duration_budget_ms: number;
            line_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            speaker_ref: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
        }[];
        driving_audio_artifact_id: string | null;
    };
}>;
export declare const QuoteSchema: z.ZodObject<{
    quote_id: z.ZodString;
    provider: z.ZodString;
    model_version: z.ZodString;
    request_hash: z.ZodString;
    cost: z.ZodUnion<[z.ZodObject<{
        currency: z.ZodString;
        amount_micros: z.ZodNumber;
        basis: z.ZodEnum<["mock", "estimate", "actual"]>;
    }, "strict", z.ZodTypeAny, {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    }, {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    }>, z.ZodObject<{
        basis: z.ZodLiteral<"unknown">;
    }, "strict", z.ZodTypeAny, {
        basis: "unknown";
    }, {
        basis: "unknown";
    }>]>;
    expires_at: z.ZodNullable<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    expires_at: string | null;
    provider: string;
    model_version: string;
    quote_id: string;
    request_hash: string;
    cost: {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    } | {
        basis: "unknown";
    };
}, {
    expires_at: string | null;
    provider: string;
    model_version: string;
    quote_id: string;
    request_hash: string;
    cost: {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    } | {
        basis: "unknown";
    };
}>;
export declare const ReceiptSchema: z.ZodObject<{
    receipt_id: z.ZodString;
    cost: z.ZodUnion<[z.ZodObject<{
        currency: z.ZodString;
        amount_micros: z.ZodNumber;
        basis: z.ZodEnum<["mock", "estimate", "actual"]>;
    }, "strict", z.ZodTypeAny, {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    }, {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    }>, z.ZodObject<{
        basis: z.ZodLiteral<"unknown">;
    }, "strict", z.ZodTypeAny, {
        basis: "unknown";
    }, {
        basis: "unknown";
    }>]>;
    final: z.ZodBoolean;
    evidence_ref: z.ZodString;
}, "strict", z.ZodTypeAny, {
    cost: {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    } | {
        basis: "unknown";
    };
    receipt_id: string;
    final: boolean;
    evidence_ref: string;
}, {
    cost: {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    } | {
        basis: "unknown";
    };
    receipt_id: string;
    final: boolean;
    evidence_ref: string;
}>;
export declare const SubmitResultSchema: z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
    status: z.ZodLiteral<"accepted">;
    job_id: z.ZodString;
    receipts: z.ZodArray<z.ZodObject<{
        receipt_id: z.ZodString;
        cost: z.ZodUnion<[z.ZodObject<{
            currency: z.ZodString;
            amount_micros: z.ZodNumber;
            basis: z.ZodEnum<["mock", "estimate", "actual"]>;
        }, "strict", z.ZodTypeAny, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }>, z.ZodObject<{
            basis: z.ZodLiteral<"unknown">;
        }, "strict", z.ZodTypeAny, {
            basis: "unknown";
        }, {
            basis: "unknown";
        }>]>;
        final: z.ZodBoolean;
        evidence_ref: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    status: "accepted";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}, {
    status: "accepted";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}>, z.ZodObject<{
    status: z.ZodLiteral<"rejected">;
    reason: z.ZodString;
    receipts: z.ZodArray<z.ZodObject<{
        receipt_id: z.ZodString;
        cost: z.ZodUnion<[z.ZodObject<{
            currency: z.ZodString;
            amount_micros: z.ZodNumber;
            basis: z.ZodEnum<["mock", "estimate", "actual"]>;
        }, "strict", z.ZodTypeAny, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }>, z.ZodObject<{
            basis: z.ZodLiteral<"unknown">;
        }, "strict", z.ZodTypeAny, {
            basis: "unknown";
        }, {
            basis: "unknown";
        }>]>;
        final: z.ZodBoolean;
        evidence_ref: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    status: "rejected";
    reason: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}, {
    status: "rejected";
    reason: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}>, z.ZodObject<{
    status: z.ZodLiteral<"submission_unknown">;
    reason: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "submission_unknown";
    reason: string;
}, {
    status: "submission_unknown";
    reason: string;
}>]>;
export declare const PollResultSchema: z.ZodObject<{
    job_id: z.ZodString;
    status: z.ZodEnum<["queued", "running", "succeeded", "failed", "cancelled", "unknown"]>;
    receipts: z.ZodArray<z.ZodObject<{
        receipt_id: z.ZodString;
        cost: z.ZodUnion<[z.ZodObject<{
            currency: z.ZodString;
            amount_micros: z.ZodNumber;
            basis: z.ZodEnum<["mock", "estimate", "actual"]>;
        }, "strict", z.ZodTypeAny, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }>, z.ZodObject<{
            basis: z.ZodLiteral<"unknown">;
        }, "strict", z.ZodTypeAny, {
            basis: "unknown";
        }, {
            basis: "unknown";
        }>]>;
        final: z.ZodBoolean;
        evidence_ref: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }>, "many">;
    message: z.ZodNullable<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    message: string | null;
    status: "unknown" | "queued" | "running" | "succeeded" | "failed" | "cancelled";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}, {
    message: string | null;
    status: "unknown" | "queued" | "running" | "succeeded" | "failed" | "cancelled";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}>;
export declare const CancelResultSchema: z.ZodObject<{
    job_id: z.ZodString;
    status: z.ZodEnum<["cancel_requested", "cancelled", "unsupported", "unknown"]>;
    receipts: z.ZodArray<z.ZodObject<{
        receipt_id: z.ZodString;
        cost: z.ZodUnion<[z.ZodObject<{
            currency: z.ZodString;
            amount_micros: z.ZodNumber;
            basis: z.ZodEnum<["mock", "estimate", "actual"]>;
        }, "strict", z.ZodTypeAny, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }>, z.ZodObject<{
            basis: z.ZodLiteral<"unknown">;
        }, "strict", z.ZodTypeAny, {
            basis: "unknown";
        }, {
            basis: "unknown";
        }>]>;
        final: z.ZodBoolean;
        evidence_ref: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    status: "unsupported" | "unknown" | "cancelled" | "cancel_requested";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}, {
    status: "unsupported" | "unknown" | "cancelled" | "cancel_requested";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
}>;
export declare const CollectResultSchema: z.ZodObject<{
    job_id: z.ZodString;
    status: z.ZodEnum<["collected", "pending", "expired", "failed"]>;
    artifacts: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    receipts: z.ZodArray<z.ZodObject<{
        receipt_id: z.ZodString;
        cost: z.ZodUnion<[z.ZodObject<{
            currency: z.ZodString;
            amount_micros: z.ZodNumber;
            basis: z.ZodEnum<["mock", "estimate", "actual"]>;
        }, "strict", z.ZodTypeAny, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }>, z.ZodObject<{
            basis: z.ZodLiteral<"unknown">;
        }, "strict", z.ZodTypeAny, {
            basis: "unknown";
        }, {
            basis: "unknown";
        }>]>;
        final: z.ZodBoolean;
        evidence_ref: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    status: "failed" | "collected" | "pending" | "expired";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
    artifacts: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
}, {
    status: "failed" | "collected" | "pending" | "expired";
    job_id: string;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
    artifacts: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
}>;
export declare const JobStatusSchema: z.ZodEnum<["planned", "submitting", "queued", "running", "succeeded", "failed", "cancel_requested", "cancelled", "submission_unknown", "needs_review"]>;
export declare const GenerationJobSchema: z.ZodObject<{
    operation_id: z.ZodString;
    provider: z.ZodString;
    model_version: z.ZodString;
    job_id: z.ZodNullable<z.ZodString>;
    request_hash: z.ZodString;
    input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>, "many">, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[], {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[]>;
    status: z.ZodEnum<["planned", "submitting", "queued", "running", "succeeded", "failed", "cancel_requested", "cancelled", "submission_unknown", "needs_review"]>;
    billing_state: z.ZodEnum<["reserved", "unknown", "settled"]>;
    reserved: z.ZodObject<{
        currency: z.ZodString;
        amount_micros: z.ZodNumber;
        basis: z.ZodEnum<["mock", "estimate", "actual"]>;
    }, "strict", z.ZodTypeAny, {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    }, {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    }>;
    receipts: z.ZodArray<z.ZodObject<{
        receipt_id: z.ZodString;
        cost: z.ZodUnion<[z.ZodObject<{
            currency: z.ZodString;
            amount_micros: z.ZodNumber;
            basis: z.ZodEnum<["mock", "estimate", "actual"]>;
        }, "strict", z.ZodTypeAny, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }, {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        }>, z.ZodObject<{
            basis: z.ZodLiteral<"unknown">;
        }, "strict", z.ZodTypeAny, {
            basis: "unknown";
        }, {
            basis: "unknown";
        }>]>;
        final: z.ZodBoolean;
        evidence_ref: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }, {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }>, "many">;
    artifacts: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    request: z.ZodObject<{
        operation_id: z.ZodString;
        project_id: z.ZodString;
        shot_id: z.ZodString;
        task: z.ZodEnum<["reference", "video", "tts", "lip_sync", "me", "assembly", "llm"]>;
        model_version: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_artifacts: z.ZodArray<z.ZodObject<{
            artifact_id: z.ZodString;
            kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
            uri: z.ZodString;
            sha256: z.ZodString;
            evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
            input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>, "many">, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[], {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[]>;
            operation_id: z.ZodNullable<z.ZodString>;
            media_type: z.ZodString;
            duration_ms: z.ZodNullable<z.ZodNumber>;
            probe: z.ZodNullable<z.ZodObject<{
                fps_num: z.ZodNumber;
                fps_den: z.ZodNumber;
                frame_count: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            }, {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            }>>;
            expires_at: z.ZodNullable<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }, {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }>, "many">;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        plan: z.ZodObject<{
            shot_id: z.ZodString;
            revision: z.ZodNumber;
            route: z.ZodEnum<["edit", "regenerate", "keep"]>;
            target_character_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>, "many">, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[], {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[]>;
            setting_revision: z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>;
            line_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                id: z.ZodString;
                revision: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }>, "many">, {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[], {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[]>;
            duration_policy: z.ZodEnum<["preserve", "fit_audio", "approved_retime"]>;
            constraints: z.ZodArray<z.ZodString, "many">;
            provider_capabilities: z.ZodObject<{
                provider: z.ZodString;
                model_version: z.ZodString;
                evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
                async: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                poll: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                cancel: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                idempotency: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                request_lookup: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                native_audio_driven_video: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                audio_input: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                multi_character: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                dialogue_editing: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                requires_upload: z.ZodEnum<["supported", "unsupported", "unknown"]>;
                max_input_duration_ms: z.ZodNullable<z.ZodNumber>;
                max_character_references: z.ZodNullable<z.ZodNumber>;
                resolutions: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
                job_retention_seconds: z.ZodNullable<z.ZodNumber>;
                artifact_retention_seconds: z.ZodNullable<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            }, {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            }>;
        }, "strict", z.ZodTypeAny, {
            revision: number;
            shot_id: string;
            route: "edit" | "regenerate" | "keep";
            target_character_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            setting_revision: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            line_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            duration_policy: "preserve" | "fit_audio" | "approved_retime";
            constraints: string[];
            provider_capabilities: {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            };
        }, {
            revision: number;
            shot_id: string;
            route: "edit" | "regenerate" | "keep";
            target_character_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            setting_revision: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            line_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            duration_policy: "preserve" | "fit_audio" | "approved_retime";
            constraints: string[];
            provider_capabilities: {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            };
        }>;
        parameters: z.ZodObject<{
            prompt: z.ZodString;
            seed: z.ZodNullable<z.ZodNumber>;
            audio_mode: z.ZodEnum<["none", "separate", "native"]>;
            dialogue: z.ZodArray<z.ZodObject<{
                line_ref: z.ZodObject<{
                    kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                    id: z.ZodString;
                    revision: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                }, {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                }>;
                speaker_ref: z.ZodObject<{
                    kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
                    id: z.ZodString;
                    revision: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                }, {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                }>;
                target_text: z.ZodString;
                voice_ref: z.ZodNullable<z.ZodString>;
                emotion: z.ZodString;
                pronunciation: z.ZodArray<z.ZodString, "many">;
                duration_budget_ms: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }, {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }>, "many">;
            driving_audio_artifact_id: z.ZodNullable<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            prompt: string;
            seed: number | null;
            audio_mode: "none" | "separate" | "native";
            dialogue: {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }[];
            driving_audio_artifact_id: string | null;
        }, {
            prompt: string;
            seed: number | null;
            audio_mode: "none" | "separate" | "native";
            dialogue: {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }[];
            driving_audio_artifact_id: string | null;
        }>;
    }, "strict", z.ZodTypeAny, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string;
        project_id: string;
        shot_id: string;
        model_version: string;
        task: "video" | "lip_sync" | "reference" | "tts" | "me" | "assembly" | "llm";
        input_artifacts: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        plan: {
            revision: number;
            shot_id: string;
            route: "edit" | "regenerate" | "keep";
            target_character_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            setting_revision: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            line_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            duration_policy: "preserve" | "fit_audio" | "approved_retime";
            constraints: string[];
            provider_capabilities: {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            };
        };
        parameters: {
            prompt: string;
            seed: number | null;
            audio_mode: "none" | "separate" | "native";
            dialogue: {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }[];
            driving_audio_artifact_id: string | null;
        };
    }, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string;
        project_id: string;
        shot_id: string;
        model_version: string;
        task: "video" | "lip_sync" | "reference" | "tts" | "me" | "assembly" | "llm";
        input_artifacts: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        plan: {
            revision: number;
            shot_id: string;
            route: "edit" | "regenerate" | "keep";
            target_character_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            setting_revision: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            line_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            duration_policy: "preserve" | "fit_audio" | "approved_retime";
            constraints: string[];
            provider_capabilities: {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            };
        };
        parameters: {
            prompt: string;
            seed: number | null;
            audio_mode: "none" | "separate" | "native";
            dialogue: {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }[];
            driving_audio_artifact_id: string | null;
        };
    }>;
}, "strict", z.ZodTypeAny, {
    status: "needs_review" | "submission_unknown" | "queued" | "running" | "succeeded" | "failed" | "cancelled" | "cancel_requested" | "planned" | "submitting";
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    operation_id: string;
    provider: string;
    model_version: string;
    request_hash: string;
    job_id: string | null;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
    artifacts: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    billing_state: "unknown" | "reserved" | "settled";
    reserved: {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    };
    request: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string;
        project_id: string;
        shot_id: string;
        model_version: string;
        task: "video" | "lip_sync" | "reference" | "tts" | "me" | "assembly" | "llm";
        input_artifacts: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        plan: {
            revision: number;
            shot_id: string;
            route: "edit" | "regenerate" | "keep";
            target_character_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            setting_revision: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            line_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            duration_policy: "preserve" | "fit_audio" | "approved_retime";
            constraints: string[];
            provider_capabilities: {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            };
        };
        parameters: {
            prompt: string;
            seed: number | null;
            audio_mode: "none" | "separate" | "native";
            dialogue: {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }[];
            driving_audio_artifact_id: string | null;
        };
    };
}, {
    status: "needs_review" | "submission_unknown" | "queued" | "running" | "succeeded" | "failed" | "cancelled" | "cancel_requested" | "planned" | "submitting";
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    operation_id: string;
    provider: string;
    model_version: string;
    request_hash: string;
    job_id: string | null;
    receipts: {
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock" | "estimate" | "actual";
        } | {
            basis: "unknown";
        };
        receipt_id: string;
        final: boolean;
        evidence_ref: string;
    }[];
    artifacts: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    billing_state: "unknown" | "reserved" | "settled";
    reserved: {
        currency: string;
        amount_micros: number;
        basis: "mock" | "estimate" | "actual";
    };
    request: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string;
        project_id: string;
        shot_id: string;
        model_version: string;
        task: "video" | "lip_sync" | "reference" | "tts" | "me" | "assembly" | "llm";
        input_artifacts: {
            kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
            artifact_id: string;
            uri: string;
            sha256: string;
            evidence: "fixture" | "mock" | "live" | "external_manual";
            input_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            operation_id: string | null;
            media_type: string;
            duration_ms: number | null;
            probe: {
                fps_num: number;
                fps_den: number;
                frame_count: number;
                width: number;
                height: number;
            } | null;
            expires_at: string | null;
        }[];
        plan: {
            revision: number;
            shot_id: string;
            route: "edit" | "regenerate" | "keep";
            target_character_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            setting_revision: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            };
            line_revisions: {
                kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                id: string;
                revision: number;
            }[];
            duration_policy: "preserve" | "fit_audio" | "approved_retime";
            constraints: string[];
            provider_capabilities: {
                evidence: "fixture" | "mock" | "live" | "external_manual";
                provider: string;
                model_version: string;
                async: "supported" | "unsupported" | "unknown";
                poll: "supported" | "unsupported" | "unknown";
                cancel: "supported" | "unsupported" | "unknown";
                idempotency: "supported" | "unsupported" | "unknown";
                request_lookup: "supported" | "unsupported" | "unknown";
                native_audio_driven_video: "supported" | "unsupported" | "unknown";
                audio_input: "supported" | "unsupported" | "unknown";
                multi_character: "supported" | "unsupported" | "unknown";
                dialogue_editing: "supported" | "unsupported" | "unknown";
                requires_upload: "supported" | "unsupported" | "unknown";
                max_input_duration_ms: number | null;
                max_character_references: number | null;
                resolutions: string[] | null;
                job_retention_seconds: number | null;
                artifact_retention_seconds: number | null;
            };
        };
        parameters: {
            prompt: string;
            seed: number | null;
            audio_mode: "none" | "separate" | "native";
            dialogue: {
                voice_ref: string | null;
                target_text: string;
                emotion: string;
                pronunciation: string[];
                duration_budget_ms: number;
                line_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
                speaker_ref: {
                    kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
                    id: string;
                    revision: number;
                };
            }[];
            driving_audio_artifact_id: string | null;
        };
    };
}>;
export declare const ResolvedTimelineSchema: z.ZodEffects<z.ZodObject<{
    fps_num: z.ZodNumber;
    fps_den: z.ZodNumber;
    segments: z.ZodArray<z.ZodObject<{
        shot_id: z.ZodString;
        artifact_id: z.ZodString;
        in_frame: z.ZodNumber;
        out_frame: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        artifact_id: string;
        shot_id: string;
        in_frame: number;
        out_frame: number;
    }, {
        artifact_id: string;
        shot_id: string;
        in_frame: number;
        out_frame: number;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    fps_num: number;
    fps_den: number;
    segments: {
        artifact_id: string;
        shot_id: string;
        in_frame: number;
        out_frame: number;
    }[];
}, {
    fps_num: number;
    fps_den: number;
    segments: {
        artifact_id: string;
        shot_id: string;
        in_frame: number;
        out_frame: number;
    }[];
}>, {
    fps_num: number;
    fps_den: number;
    segments: {
        artifact_id: string;
        shot_id: string;
        in_frame: number;
        out_frame: number;
    }[];
}, {
    fps_num: number;
    fps_den: number;
    segments: {
        artifact_id: string;
        shot_id: string;
        in_frame: number;
        out_frame: number;
    }[];
}>;
export declare const ReviewReportSchema: z.ZodObject<{
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    technical: z.ZodEnum<["pass", "fail", "unverified"]>;
    visual: z.ZodEnum<["pass", "fail", "unverified"]>;
    language: z.ZodEnum<["pass", "fail", "unverified"]>;
    culture: z.ZodEnum<["pass", "fail", "unverified"]>;
    issues: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    issues: string[];
    evidence: "fixture" | "mock" | "live" | "external_manual";
    technical: "pass" | "fail" | "unverified";
    visual: "pass" | "fail" | "unverified";
    language: "pass" | "fail" | "unverified";
    culture: "pass" | "fail" | "unverified";
}, {
    issues: string[];
    evidence: "fixture" | "mock" | "live" | "external_manual";
    technical: "pass" | "fail" | "unverified";
    visual: "pass" | "fail" | "unverified";
    language: "pass" | "fail" | "unverified";
    culture: "pass" | "fail" | "unverified";
}>;
export declare const LocalizedEpisodeSchema: z.ZodObject<{
    revision: z.ZodNumber;
    shot_assets: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    dialogue_stems: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    me_stems: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    subtitles: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        kind: z.ZodEnum<["source_video", "reference_image", "video", "dialogue_audio", "me_audio", "lip_sync", "subtitles", "mix", "episode", "report"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }>, "many">, {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[], {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[]>;
        operation_id: z.ZodNullable<z.ZodString>;
        media_type: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        probe: z.ZodNullable<z.ZodObject<{
            fps_num: z.ZodNumber;
            fps_den: z.ZodNumber;
            frame_count: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }, {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        }>>;
        expires_at: z.ZodNullable<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }, {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }>, "many">;
    input_revisions: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source", "character", "locale", "line", "shot", "adaptation"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }>, "many">, {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[], {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[]>;
    resolved_timeline: z.ZodEffects<z.ZodObject<{
        fps_num: z.ZodNumber;
        fps_den: z.ZodNumber;
        segments: z.ZodArray<z.ZodObject<{
            shot_id: z.ZodString;
            artifact_id: z.ZodString;
            in_frame: z.ZodNumber;
            out_frame: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }, {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        fps_num: number;
        fps_den: number;
        segments: {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }[];
    }, {
        fps_num: number;
        fps_den: number;
        segments: {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }[];
    }>, {
        fps_num: number;
        fps_den: number;
        segments: {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }[];
    }, {
        fps_num: number;
        fps_den: number;
        segments: {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }[];
    }>;
    qa_report: z.ZodObject<{
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        technical: z.ZodEnum<["pass", "fail", "unverified"]>;
        visual: z.ZodEnum<["pass", "fail", "unverified"]>;
        language: z.ZodEnum<["pass", "fail", "unverified"]>;
        culture: z.ZodEnum<["pass", "fail", "unverified"]>;
        issues: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        issues: string[];
        evidence: "fixture" | "mock" | "live" | "external_manual";
        technical: "pass" | "fail" | "unverified";
        visual: "pass" | "fail" | "unverified";
        language: "pass" | "fail" | "unverified";
        culture: "pass" | "fail" | "unverified";
    }, {
        issues: string[];
        evidence: "fixture" | "mock" | "live" | "external_manual";
        technical: "pass" | "fail" | "unverified";
        visual: "pass" | "fail" | "unverified";
        language: "pass" | "fail" | "unverified";
        culture: "pass" | "fail" | "unverified";
    }>;
}, "strict", z.ZodTypeAny, {
    revision: number;
    subtitles: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    shot_assets: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    dialogue_stems: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    me_stems: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    resolved_timeline: {
        fps_num: number;
        fps_den: number;
        segments: {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }[];
    };
    qa_report: {
        issues: string[];
        evidence: "fixture" | "mock" | "live" | "external_manual";
        technical: "pass" | "fail" | "unverified";
        visual: "pass" | "fail" | "unverified";
        language: "pass" | "fail" | "unverified";
        culture: "pass" | "fail" | "unverified";
    };
}, {
    revision: number;
    subtitles: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    input_revisions: {
        kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
        id: string;
        revision: number;
    }[];
    shot_assets: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    dialogue_stems: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    me_stems: {
        kind: "source_video" | "reference_image" | "video" | "dialogue_audio" | "me_audio" | "lip_sync" | "subtitles" | "mix" | "episode" | "report";
        artifact_id: string;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        input_revisions: {
            kind: "source" | "character" | "locale" | "line" | "shot" | "adaptation";
            id: string;
            revision: number;
        }[];
        operation_id: string | null;
        media_type: string;
        duration_ms: number | null;
        probe: {
            fps_num: number;
            fps_den: number;
            frame_count: number;
            width: number;
            height: number;
        } | null;
        expires_at: string | null;
    }[];
    resolved_timeline: {
        fps_num: number;
        fps_den: number;
        segments: {
            artifact_id: string;
            shot_id: string;
            in_frame: number;
            out_frame: number;
        }[];
    };
    qa_report: {
        issues: string[];
        evidence: "fixture" | "mock" | "live" | "external_manual";
        technical: "pass" | "fail" | "unverified";
        visual: "pass" | "fail" | "unverified";
        language: "pass" | "fail" | "unverified";
        culture: "pass" | "fail" | "unverified";
    };
}>;
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
    submit(request: GenerationRequest, signal: AbortSignal): Promise<z.infer<typeof SubmitResultSchema>>;
    poll(jobId: string, signal: AbortSignal): Promise<z.infer<typeof PollResultSchema>>;
    cancel(jobId: string, signal: AbortSignal): Promise<z.infer<typeof CancelResultSchema>>;
    collect(jobId: string, signal: AbortSignal): Promise<z.infer<typeof CollectResultSchema>>;
}
