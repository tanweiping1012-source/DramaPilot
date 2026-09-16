import { type ProviderCapabilities } from "./index.js";
export declare const fixtureCapabilities: ProviderCapabilities;
export declare const familyFixture: {
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
};
