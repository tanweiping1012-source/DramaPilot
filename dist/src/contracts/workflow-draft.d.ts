import { z } from "zod";
/** An isolated design contract. It is not accepted by the 0.2.1 runtime. */
export declare const WORKFLOW_DRAFT_VERSION: "0.3.0-draft.1";
declare const kinds: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
export declare const WorkflowRefSchema: z.ZodObject<{
    kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
    id: z.ZodString;
    revision: z.ZodNumber;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
    id: string;
    revision: number;
    sha256: string;
}, {
    kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
    id: string;
    revision: number;
    sha256: string;
}>;
export type WorkflowRef = z.infer<typeof WorkflowRefSchema>;
export declare const SourceAssetSchema: z.ZodObject<{
    media_kind: z.ZodEnum<["video", "script", "subtitles", "image", "audio"]>;
    uri: z.ZodString;
    sha256: z.ZodString;
    duration_ms: z.ZodNullable<z.ZodNumber>;
    frame_count: z.ZodNullable<z.ZodNumber>;
    char_count: z.ZodNullable<z.ZodNumber>;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    kind: z.ZodLiteral<"source_asset">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "source_asset";
    id: string;
    revision: number;
    frame_count: number | null;
    uri: string;
    sha256: string;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    duration_ms: number | null;
    media_kind: "video" | "subtitles" | "script" | "image" | "audio";
    char_count: number | null;
}, {
    kind: "source_asset";
    id: string;
    revision: number;
    frame_count: number | null;
    uri: string;
    sha256: string;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    duration_ms: number | null;
    media_kind: "video" | "subtitles" | "script" | "image" | "audio";
    char_count: number | null;
}>;
export declare const SourceEvidenceSchema: z.ZodObject<{
    source_asset_id: z.ZodString;
    source_asset_sha256: z.ZodString;
    locator: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"time">;
        start_ms: z.ZodNumber;
        end_ms: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "time";
        start_ms: number;
        end_ms: number;
    }, {
        kind: "time";
        start_ms: number;
        end_ms: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"frames">;
        start_frame: z.ZodNumber;
        end_frame_exclusive: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "frames";
        start_frame: number;
        end_frame_exclusive: number;
    }, {
        kind: "frames";
        start_frame: number;
        end_frame_exclusive: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"text">;
        start_char: z.ZodNumber;
        end_char_exclusive: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "text";
        start_char: number;
        end_char_exclusive: number;
    }, {
        kind: "text";
        start_char: number;
        end_char_exclusive: number;
    }>]>;
    statement: z.ZodString;
    epistemic_status: z.ZodEnum<["observed", "inferred", "reconstructed"]>;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    method: z.ZodEnum<["manual_annotation", "creator_supplied", "automatic_analysis", "approximate_reconstruction", "authored_fixture"]>;
    uncertainties: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"source_evidence">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "source_evidence";
    id: string;
    revision: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    source_asset_id: string;
    source_asset_sha256: string;
    locator: {
        kind: "time";
        start_ms: number;
        end_ms: number;
    } | {
        kind: "frames";
        start_frame: number;
        end_frame_exclusive: number;
    } | {
        kind: "text";
        start_char: number;
        end_char_exclusive: number;
    };
    statement: string;
    epistemic_status: "observed" | "inferred" | "reconstructed";
    method: "manual_annotation" | "creator_supplied" | "automatic_analysis" | "approximate_reconstruction" | "authored_fixture";
    uncertainties: string[];
}, {
    kind: "source_evidence";
    id: string;
    revision: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    source_asset_id: string;
    source_asset_sha256: string;
    locator: {
        kind: "time";
        start_ms: number;
        end_ms: number;
    } | {
        kind: "frames";
        start_frame: number;
        end_frame_exclusive: number;
    } | {
        kind: "text";
        start_char: number;
        end_char_exclusive: number;
    };
    statement: string;
    epistemic_status: "observed" | "inferred" | "reconstructed";
    method: "manual_annotation" | "creator_supplied" | "automatic_analysis" | "approximate_reconstruction" | "authored_fixture";
    uncertainties: string[];
}>;
export declare const SourceStoryboardSchema: z.ZodObject<{
    shots: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        source_asset_id: z.ZodString;
        source_asset_sha256: z.ZodString;
        source_in_ms: z.ZodNumber;
        source_out_ms: z.ZodNumber;
        character_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        dialogue_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        scene_id: z.ZodString;
        prop_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        action: z.ZodString;
        kind: z.ZodLiteral<"source_shot">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_shot";
        id: string;
        revision: number;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        source_asset_id: string;
        source_asset_sha256: string;
        evidence_ids: string[];
        scene_id: string;
        prop_ids: string[];
        action: string;
    }, {
        kind: "source_shot";
        id: string;
        revision: number;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        source_asset_id: string;
        source_asset_sha256: string;
        evidence_ids: string[];
        scene_id: string;
        prop_ids: string[];
        action: string;
    }>, "many">;
    kind: z.ZodLiteral<"source_storyboard">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "source_storyboard";
    id: string;
    revision: number;
    shots: {
        kind: "source_shot";
        id: string;
        revision: number;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        source_asset_id: string;
        source_asset_sha256: string;
        evidence_ids: string[];
        scene_id: string;
        prop_ids: string[];
        action: string;
    }[];
}, {
    kind: "source_storyboard";
    id: string;
    revision: number;
    shots: {
        kind: "source_shot";
        id: string;
        revision: number;
        source_in_ms: number;
        source_out_ms: number;
        character_ids: string[];
        dialogue_ids: string[];
        source_asset_id: string;
        source_asset_sha256: string;
        evidence_ids: string[];
        scene_id: string;
        prop_ids: string[];
        action: string;
    }[];
}>;
export declare const SourceAssetPackageSchema: z.ZodObject<{
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    source_locale: z.ZodString;
    assets: z.ZodArray<z.ZodObject<{
        media_kind: z.ZodEnum<["video", "script", "subtitles", "image", "audio"]>;
        uri: z.ZodString;
        sha256: z.ZodString;
        duration_ms: z.ZodNullable<z.ZodNumber>;
        frame_count: z.ZodNullable<z.ZodNumber>;
        char_count: z.ZodNullable<z.ZodNumber>;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        kind: z.ZodLiteral<"source_asset">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset";
        id: string;
        revision: number;
        frame_count: number | null;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number | null;
        media_kind: "video" | "subtitles" | "script" | "image" | "audio";
        char_count: number | null;
    }, {
        kind: "source_asset";
        id: string;
        revision: number;
        frame_count: number | null;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number | null;
        media_kind: "video" | "subtitles" | "script" | "image" | "audio";
        char_count: number | null;
    }>, "many">;
    evidence: z.ZodArray<z.ZodObject<{
        source_asset_id: z.ZodString;
        source_asset_sha256: z.ZodString;
        locator: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"time">;
            start_ms: z.ZodNumber;
            end_ms: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "time";
            start_ms: number;
            end_ms: number;
        }, {
            kind: "time";
            start_ms: number;
            end_ms: number;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"frames">;
            start_frame: z.ZodNumber;
            end_frame_exclusive: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "frames";
            start_frame: number;
            end_frame_exclusive: number;
        }, {
            kind: "frames";
            start_frame: number;
            end_frame_exclusive: number;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"text">;
            start_char: z.ZodNumber;
            end_char_exclusive: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "text";
            start_char: number;
            end_char_exclusive: number;
        }, {
            kind: "text";
            start_char: number;
            end_char_exclusive: number;
        }>]>;
        statement: z.ZodString;
        epistemic_status: z.ZodEnum<["observed", "inferred", "reconstructed"]>;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        method: z.ZodEnum<["manual_annotation", "creator_supplied", "automatic_analysis", "approximate_reconstruction", "authored_fixture"]>;
        uncertainties: z.ZodArray<z.ZodString, "many">;
        kind: z.ZodLiteral<"source_evidence">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_evidence";
        id: string;
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        source_asset_id: string;
        source_asset_sha256: string;
        locator: {
            kind: "time";
            start_ms: number;
            end_ms: number;
        } | {
            kind: "frames";
            start_frame: number;
            end_frame_exclusive: number;
        } | {
            kind: "text";
            start_char: number;
            end_char_exclusive: number;
        };
        statement: string;
        epistemic_status: "observed" | "inferred" | "reconstructed";
        method: "manual_annotation" | "creator_supplied" | "automatic_analysis" | "approximate_reconstruction" | "authored_fixture";
        uncertainties: string[];
    }, {
        kind: "source_evidence";
        id: string;
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        source_asset_id: string;
        source_asset_sha256: string;
        locator: {
            kind: "time";
            start_ms: number;
            end_ms: number;
        } | {
            kind: "frames";
            start_frame: number;
            end_frame_exclusive: number;
        } | {
            kind: "text";
            start_char: number;
            end_char_exclusive: number;
        };
        statement: string;
        epistemic_status: "observed" | "inferred" | "reconstructed";
        method: "manual_annotation" | "creator_supplied" | "automatic_analysis" | "approximate_reconstruction" | "authored_fixture";
        uncertainties: string[];
    }>, "many">;
    characters: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        description: z.ZodString;
        kind: z.ZodLiteral<"source_character">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_character";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }, {
        kind: "source_character";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }>, "many">;
    relations: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        from_character_id: z.ZodString;
        to_character_id: z.ZodString;
        description: z.ZodString;
        kind: z.ZodLiteral<"source_relation">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_relation";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        from_character_id: string;
        to_character_id: string;
    }, {
        kind: "source_relation";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        from_character_id: string;
        to_character_id: string;
    }>, "many">;
    dialogue: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        speaker_character_id: z.ZodString;
        text: z.ZodString;
        kind: z.ZodLiteral<"source_dialogue">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_dialogue";
        id: string;
        revision: number;
        speaker_character_id: string;
        text: string;
        evidence_ids: string[];
    }, {
        kind: "source_dialogue";
        id: string;
        revision: number;
        speaker_character_id: string;
        text: string;
        evidence_ids: string[];
    }>, "many">;
    scenes: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        description: z.ZodString;
        kind: z.ZodLiteral<"source_scene">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_scene";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }, {
        kind: "source_scene";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }>, "many">;
    props: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        description: z.ZodString;
        kind: z.ZodLiteral<"source_prop">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_prop";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }, {
        kind: "source_prop";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }>, "many">;
    beats: z.ZodArray<z.ZodObject<{
        evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        description: z.ZodString;
        required: z.ZodBoolean;
        source_shot_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        kind: z.ZodLiteral<"source_beat">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_beat";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        required: boolean;
        source_shot_ids: string[];
    }, {
        kind: "source_beat";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        required: boolean;
        source_shot_ids: string[];
    }>, "many">;
    storyboard: z.ZodObject<{
        shots: z.ZodArray<z.ZodObject<{
            evidence_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
            source_asset_id: z.ZodString;
            source_asset_sha256: z.ZodString;
            source_in_ms: z.ZodNumber;
            source_out_ms: z.ZodNumber;
            character_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
            dialogue_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
            scene_id: z.ZodString;
            prop_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
            action: z.ZodString;
            kind: z.ZodLiteral<"source_shot">;
            id: z.ZodString;
            revision: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            kind: "source_shot";
            id: string;
            revision: number;
            source_in_ms: number;
            source_out_ms: number;
            character_ids: string[];
            dialogue_ids: string[];
            source_asset_id: string;
            source_asset_sha256: string;
            evidence_ids: string[];
            scene_id: string;
            prop_ids: string[];
            action: string;
        }, {
            kind: "source_shot";
            id: string;
            revision: number;
            source_in_ms: number;
            source_out_ms: number;
            character_ids: string[];
            dialogue_ids: string[];
            source_asset_id: string;
            source_asset_sha256: string;
            evidence_ids: string[];
            scene_id: string;
            prop_ids: string[];
            action: string;
        }>, "many">;
        kind: z.ZodLiteral<"source_storyboard">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "source_storyboard";
        id: string;
        revision: number;
        shots: {
            kind: "source_shot";
            id: string;
            revision: number;
            source_in_ms: number;
            source_out_ms: number;
            character_ids: string[];
            dialogue_ids: string[];
            source_asset_id: string;
            source_asset_sha256: string;
            evidence_ids: string[];
            scene_id: string;
            prop_ids: string[];
            action: string;
        }[];
    }, {
        kind: "source_storyboard";
        id: string;
        revision: number;
        shots: {
            kind: "source_shot";
            id: string;
            revision: number;
            source_in_ms: number;
            source_out_ms: number;
            character_ids: string[];
            dialogue_ids: string[];
            source_asset_id: string;
            source_asset_sha256: string;
            evidence_ids: string[];
            scene_id: string;
            prop_ids: string[];
            action: string;
        }[];
    }>;
    unknowns: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"source_package">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "source_package";
    id: string;
    revision: number;
    evidence: {
        kind: "source_evidence";
        id: string;
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        source_asset_id: string;
        source_asset_sha256: string;
        locator: {
            kind: "time";
            start_ms: number;
            end_ms: number;
        } | {
            kind: "frames";
            start_frame: number;
            end_frame_exclusive: number;
        } | {
            kind: "text";
            start_char: number;
            end_char_exclusive: number;
        };
        statement: string;
        epistemic_status: "observed" | "inferred" | "reconstructed";
        method: "manual_annotation" | "creator_supplied" | "automatic_analysis" | "approximate_reconstruction" | "authored_fixture";
        uncertainties: string[];
    }[];
    assets: {
        kind: "source_asset";
        id: string;
        revision: number;
        frame_count: number | null;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number | null;
        media_kind: "video" | "subtitles" | "script" | "image" | "audio";
        char_count: number | null;
    }[];
    source_locale: string;
    characters: {
        kind: "source_character";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }[];
    relations: {
        kind: "source_relation";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        from_character_id: string;
        to_character_id: string;
    }[];
    beats: {
        kind: "source_beat";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        required: boolean;
        source_shot_ids: string[];
    }[];
    unknowns: string[];
    contract_version: "0.3.0-draft.1";
    dialogue: {
        kind: "source_dialogue";
        id: string;
        revision: number;
        speaker_character_id: string;
        text: string;
        evidence_ids: string[];
    }[];
    scenes: {
        kind: "source_scene";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }[];
    props: {
        kind: "source_prop";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }[];
    storyboard: {
        kind: "source_storyboard";
        id: string;
        revision: number;
        shots: {
            kind: "source_shot";
            id: string;
            revision: number;
            source_in_ms: number;
            source_out_ms: number;
            character_ids: string[];
            dialogue_ids: string[];
            source_asset_id: string;
            source_asset_sha256: string;
            evidence_ids: string[];
            scene_id: string;
            prop_ids: string[];
            action: string;
        }[];
    };
}, {
    kind: "source_package";
    id: string;
    revision: number;
    evidence: {
        kind: "source_evidence";
        id: string;
        revision: number;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        source_asset_id: string;
        source_asset_sha256: string;
        locator: {
            kind: "time";
            start_ms: number;
            end_ms: number;
        } | {
            kind: "frames";
            start_frame: number;
            end_frame_exclusive: number;
        } | {
            kind: "text";
            start_char: number;
            end_char_exclusive: number;
        };
        statement: string;
        epistemic_status: "observed" | "inferred" | "reconstructed";
        method: "manual_annotation" | "creator_supplied" | "automatic_analysis" | "approximate_reconstruction" | "authored_fixture";
        uncertainties: string[];
    }[];
    assets: {
        kind: "source_asset";
        id: string;
        revision: number;
        frame_count: number | null;
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number | null;
        media_kind: "video" | "subtitles" | "script" | "image" | "audio";
        char_count: number | null;
    }[];
    source_locale: string;
    characters: {
        kind: "source_character";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }[];
    relations: {
        kind: "source_relation";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        from_character_id: string;
        to_character_id: string;
    }[];
    beats: {
        kind: "source_beat";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
        required: boolean;
        source_shot_ids: string[];
    }[];
    unknowns: string[];
    contract_version: "0.3.0-draft.1";
    dialogue: {
        kind: "source_dialogue";
        id: string;
        revision: number;
        speaker_character_id: string;
        text: string;
        evidence_ids: string[];
    }[];
    scenes: {
        kind: "source_scene";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }[];
    props: {
        kind: "source_prop";
        id: string;
        revision: number;
        description: string;
        evidence_ids: string[];
    }[];
    storyboard: {
        kind: "source_storyboard";
        id: string;
        revision: number;
        shots: {
            kind: "source_shot";
            id: string;
            revision: number;
            source_in_ms: number;
            source_out_ms: number;
            character_ids: string[];
            dialogue_ids: string[];
            source_asset_id: string;
            source_asset_sha256: string;
            evidence_ids: string[];
            scene_id: string;
            prop_ids: string[];
            action: string;
        }[];
    };
}>;
export type SourceAssetPackage = z.infer<typeof SourceAssetPackageSchema>;
export declare const TargetStoryboardSchema: z.ZodObject<{
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    source_ref: z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>;
    locale: z.ZodLiteral<"en-US">;
    audience_brief: z.ZodString;
    cultural_decisions: z.ZodArray<z.ZodString, "many">;
    characters: z.ZodArray<z.ZodObject<{
        source_character_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        design: z.ZodString;
        rationale: z.ZodString;
        kind: z.ZodLiteral<"target_character">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "target_character";
        id: string;
        revision: number;
        source_character_ids: string[];
        design: string;
        rationale: string;
    }, {
        kind: "target_character";
        id: string;
        revision: number;
        source_character_ids: string[];
        design: string;
        rationale: string;
    }>, "many">;
    scenes: z.ZodArray<z.ZodObject<{
        source_scene_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        design: z.ZodString;
        rationale: z.ZodString;
        kind: z.ZodLiteral<"target_scene">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "target_scene";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_scene_ids: string[];
    }, {
        kind: "target_scene";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_scene_ids: string[];
    }>, "many">;
    props: z.ZodArray<z.ZodObject<{
        source_prop_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        design: z.ZodString;
        rationale: z.ZodString;
        kind: z.ZodLiteral<"target_prop">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "target_prop";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_prop_ids: string[];
    }, {
        kind: "target_prop";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_prop_ids: string[];
    }>, "many">;
    lines: z.ZodArray<z.ZodObject<{
        source_dialogue_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        speaker_character_id: z.ZodString;
        text: z.ZodString;
        rationale: z.ZodString;
        kind: z.ZodLiteral<"target_line">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "target_line";
        id: string;
        revision: number;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        text: string;
        rationale: string;
    }, {
        kind: "target_line";
        id: string;
        revision: number;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        text: string;
        rationale: string;
    }>, "many">;
    shots: z.ZodArray<z.ZodObject<{
        source_shot_ids: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
        creative_rationale: z.ZodString;
        preserved_beat_ids: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>, string[], string[]>;
        character_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>, "many">, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[], {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[]>;
        scene_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        prop_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>, "many">, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[], {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[]>;
        line_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>, "many">, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[], {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[]>;
        action: z.ZodString;
        duration_ms: z.ZodNumber;
        route: z.ZodEnum<["edit", "regenerate", "reuse"]>;
        audio_mode: z.ZodEnum<["native_audio", "separate_audio", "silent"]>;
        overlapping_dialogue: z.ZodEnum<["forbidden", "intentional"]>;
        kind: z.ZodLiteral<"target_shot">;
        id: z.ZodString;
        revision: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        kind: "target_shot";
        id: string;
        revision: number;
        duration_ms: number;
        route: "edit" | "regenerate" | "reuse";
        audio_mode: "native_audio" | "separate_audio" | "silent";
        source_shot_ids: string[];
        action: string;
        creative_rationale: string;
        preserved_beat_ids: string[];
        character_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        scene_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        prop_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        line_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        overlapping_dialogue: "forbidden" | "intentional";
    }, {
        kind: "target_shot";
        id: string;
        revision: number;
        duration_ms: number;
        route: "edit" | "regenerate" | "reuse";
        audio_mode: "native_audio" | "separate_audio" | "silent";
        source_shot_ids: string[];
        action: string;
        creative_rationale: string;
        preserved_beat_ids: string[];
        character_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        scene_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        prop_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        line_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        overlapping_dialogue: "forbidden" | "intentional";
    }>, "many">;
    omitted_beat_decisions: z.ZodArray<z.ZodObject<{
        source_beat_id: z.ZodString;
        rationale: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        rationale: string;
        source_beat_id: string;
    }, {
        rationale: string;
        source_beat_id: string;
    }>, "many">;
    unknowns: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"target_storyboard">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "target_storyboard";
    locale: "en-US";
    id: string;
    revision: number;
    characters: {
        kind: "target_character";
        id: string;
        revision: number;
        source_character_ids: string[];
        design: string;
        rationale: string;
    }[];
    unknowns: string[];
    audience_brief: string;
    contract_version: "0.3.0-draft.1";
    shots: {
        kind: "target_shot";
        id: string;
        revision: number;
        duration_ms: number;
        route: "edit" | "regenerate" | "reuse";
        audio_mode: "native_audio" | "separate_audio" | "silent";
        source_shot_ids: string[];
        action: string;
        creative_rationale: string;
        preserved_beat_ids: string[];
        character_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        scene_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        prop_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        line_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        overlapping_dialogue: "forbidden" | "intentional";
    }[];
    lines: {
        kind: "target_line";
        id: string;
        revision: number;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        text: string;
        rationale: string;
    }[];
    scenes: {
        kind: "target_scene";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_scene_ids: string[];
    }[];
    props: {
        kind: "target_prop";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_prop_ids: string[];
    }[];
    source_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    cultural_decisions: string[];
    omitted_beat_decisions: {
        rationale: string;
        source_beat_id: string;
    }[];
}, {
    kind: "target_storyboard";
    locale: "en-US";
    id: string;
    revision: number;
    characters: {
        kind: "target_character";
        id: string;
        revision: number;
        source_character_ids: string[];
        design: string;
        rationale: string;
    }[];
    unknowns: string[];
    audience_brief: string;
    contract_version: "0.3.0-draft.1";
    shots: {
        kind: "target_shot";
        id: string;
        revision: number;
        duration_ms: number;
        route: "edit" | "regenerate" | "reuse";
        audio_mode: "native_audio" | "separate_audio" | "silent";
        source_shot_ids: string[];
        action: string;
        creative_rationale: string;
        preserved_beat_ids: string[];
        character_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        scene_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        prop_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        line_refs: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }[];
        overlapping_dialogue: "forbidden" | "intentional";
    }[];
    lines: {
        kind: "target_line";
        id: string;
        revision: number;
        source_dialogue_ids: string[];
        speaker_character_id: string;
        text: string;
        rationale: string;
    }[];
    scenes: {
        kind: "target_scene";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_scene_ids: string[];
    }[];
    props: {
        kind: "target_prop";
        id: string;
        revision: number;
        design: string;
        rationale: string;
        source_prop_ids: string[];
    }[];
    source_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    cultural_decisions: string[];
    omitted_beat_decisions: {
        rationale: string;
        source_beat_id: string;
    }[];
}>;
export type TargetStoryboard = z.infer<typeof TargetStoryboardSchema>;
/** Planned metadata is intentionally distinct from an actual rendered media record. */
export declare const PrevisArtifactSchema: z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
    status: z.ZodLiteral<"skipped">;
    reason: z.ZodString;
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    domain: z.ZodEnum<["source", "target"]>;
    shot_refs: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    input_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    uncertainties: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"previs">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    status: "skipped";
    kind: "previs";
    id: string;
    revision: number;
    reason: string;
    contract_version: "0.3.0-draft.1";
    uncertainties: string[];
    domain: "source" | "target";
    shot_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
}, {
    status: "skipped";
    kind: "previs";
    id: string;
    revision: number;
    reason: string;
    contract_version: "0.3.0-draft.1";
    uncertainties: string[];
    domain: "source" | "target";
    shot_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
}>, z.ZodObject<{
    status: z.ZodLiteral<"planned">;
    output: z.ZodNull;
    dimension: z.ZodLiteral<"2D">;
    method: z.ZodEnum<["manual", "imported", "reconstructed", "fixture"]>;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    coordinate_system: z.ZodLiteral<"normalized_screen">;
    duration_ms: z.ZodNumber;
    fps_num: z.ZodNumber;
    fps_den: z.ZodNumber;
    frame_count: z.ZodNumber;
    entity_tracks: z.ZodArray<z.ZodObject<{
        entity_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        keyframes: z.ZodArray<z.ZodObject<{
            at_ms: z.ZodNumber;
            x: z.ZodNumber;
            y: z.ZodNumber;
            action: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }, {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }, {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }>, "many">;
    camera_keyframes: z.ZodArray<z.ZodObject<{
        at_ms: z.ZodNumber;
        framing: z.ZodString;
        movement: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        at_ms: number;
        framing: string;
        movement: string;
    }, {
        at_ms: number;
        framing: string;
        movement: string;
    }>, "many">;
    dialogue_timing: z.ZodArray<z.ZodObject<{
        line_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        start_ms: z.ZodNumber;
        read_duration_ms: z.ZodNullable<z.ZodNumber>;
        method: z.ZodEnum<["manual_read", "test_fixture", "estimate", "unknown"]>;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        audio_sha256: z.ZodNullable<z.ZodString>;
        assessment: z.ZodEnum<["fits", "overflow", "unknown"]>;
    }, "strict", z.ZodTypeAny, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }>, "many">;
    overlapping_dialogue: z.ZodEnum<["forbidden", "intentional"]>;
    capabilities: z.ZodObject<{
        motion: z.ZodEnum<["present", "unknown"]>;
        camera: z.ZodEnum<["present", "unknown"]>;
        depth: z.ZodEnum<["present", "unknown"]>;
    }, "strict", z.ZodTypeAny, {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    }, {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    }>;
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    domain: z.ZodEnum<["source", "target"]>;
    shot_refs: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    input_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    uncertainties: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"previs">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    status: "planned";
    kind: "previs";
    id: string;
    revision: number;
    fps_num: number;
    fps_den: number;
    frame_count: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    duration_ms: number;
    contract_version: "0.3.0-draft.1";
    method: "fixture" | "reconstructed" | "manual" | "imported";
    uncertainties: string[];
    overlapping_dialogue: "forbidden" | "intentional";
    domain: "source" | "target";
    shot_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    output: null;
    dimension: "2D";
    coordinate_system: "normalized_screen";
    entity_tracks: {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }[];
    camera_keyframes: {
        at_ms: number;
        framing: string;
        movement: string;
    }[];
    dialogue_timing: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }[];
    capabilities: {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    };
}, {
    status: "planned";
    kind: "previs";
    id: string;
    revision: number;
    fps_num: number;
    fps_den: number;
    frame_count: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    duration_ms: number;
    contract_version: "0.3.0-draft.1";
    method: "fixture" | "reconstructed" | "manual" | "imported";
    uncertainties: string[];
    overlapping_dialogue: "forbidden" | "intentional";
    domain: "source" | "target";
    shot_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    output: null;
    dimension: "2D";
    coordinate_system: "normalized_screen";
    entity_tracks: {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }[];
    camera_keyframes: {
        at_ms: number;
        framing: string;
        movement: string;
    }[];
    dialogue_timing: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }[];
    capabilities: {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    };
}>, z.ZodObject<{
    status: z.ZodLiteral<"rendered">;
    output: z.ZodObject<{
        kind: z.ZodLiteral<"previs_video">;
        uri: z.ZodString;
        sha256: z.ZodString;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    }, "strict", z.ZodTypeAny, {
        kind: "previs_video";
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
    }, {
        kind: "previs_video";
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
    }>;
    dimension: z.ZodLiteral<"2D">;
    method: z.ZodEnum<["manual", "imported", "reconstructed", "fixture"]>;
    evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    coordinate_system: z.ZodLiteral<"normalized_screen">;
    duration_ms: z.ZodNumber;
    fps_num: z.ZodNumber;
    fps_den: z.ZodNumber;
    frame_count: z.ZodNumber;
    entity_tracks: z.ZodArray<z.ZodObject<{
        entity_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        keyframes: z.ZodArray<z.ZodObject<{
            at_ms: z.ZodNumber;
            x: z.ZodNumber;
            y: z.ZodNumber;
            action: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }, {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }, {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }>, "many">;
    camera_keyframes: z.ZodArray<z.ZodObject<{
        at_ms: z.ZodNumber;
        framing: z.ZodString;
        movement: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        at_ms: number;
        framing: string;
        movement: string;
    }, {
        at_ms: number;
        framing: string;
        movement: string;
    }>, "many">;
    dialogue_timing: z.ZodArray<z.ZodObject<{
        line_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        start_ms: z.ZodNumber;
        read_duration_ms: z.ZodNullable<z.ZodNumber>;
        method: z.ZodEnum<["manual_read", "test_fixture", "estimate", "unknown"]>;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        audio_sha256: z.ZodNullable<z.ZodString>;
        assessment: z.ZodEnum<["fits", "overflow", "unknown"]>;
    }, "strict", z.ZodTypeAny, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }>, "many">;
    overlapping_dialogue: z.ZodEnum<["forbidden", "intentional"]>;
    capabilities: z.ZodObject<{
        motion: z.ZodEnum<["present", "unknown"]>;
        camera: z.ZodEnum<["present", "unknown"]>;
        depth: z.ZodEnum<["present", "unknown"]>;
    }, "strict", z.ZodTypeAny, {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    }, {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    }>;
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    domain: z.ZodEnum<["source", "target"]>;
    shot_refs: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    input_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    uncertainties: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"previs">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    status: "rendered";
    kind: "previs";
    id: string;
    revision: number;
    fps_num: number;
    fps_den: number;
    frame_count: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    duration_ms: number;
    contract_version: "0.3.0-draft.1";
    method: "fixture" | "reconstructed" | "manual" | "imported";
    uncertainties: string[];
    overlapping_dialogue: "forbidden" | "intentional";
    domain: "source" | "target";
    shot_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    output: {
        kind: "previs_video";
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
    };
    dimension: "2D";
    coordinate_system: "normalized_screen";
    entity_tracks: {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }[];
    camera_keyframes: {
        at_ms: number;
        framing: string;
        movement: string;
    }[];
    dialogue_timing: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }[];
    capabilities: {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    };
}, {
    status: "rendered";
    kind: "previs";
    id: string;
    revision: number;
    fps_num: number;
    fps_den: number;
    frame_count: number;
    evidence: "fixture" | "mock" | "live" | "external_manual";
    duration_ms: number;
    contract_version: "0.3.0-draft.1";
    method: "fixture" | "reconstructed" | "manual" | "imported";
    uncertainties: string[];
    overlapping_dialogue: "forbidden" | "intentional";
    domain: "source" | "target";
    shot_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    output: {
        kind: "previs_video";
        uri: string;
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
    };
    dimension: "2D";
    coordinate_system: "normalized_screen";
    entity_tracks: {
        entity_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        keyframes: {
            action: string;
            at_ms: number;
            x: number;
            y: number;
        }[];
    }[];
    camera_keyframes: {
        at_ms: number;
        framing: string;
        movement: string;
    }[];
    dialogue_timing: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
    }[];
    capabilities: {
        motion: "unknown" | "present";
        camera: "unknown" | "present";
        depth: "unknown" | "present";
    };
}>]>;
export type PrevisArtifact = z.infer<typeof PrevisArtifactSchema>;
export declare const ProductionPackageSchema: z.ZodObject<{
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    source_ref: z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>;
    target_ref: z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>;
    purpose: z.ZodEnum<["offline_rehearsal", "production_candidate"]>;
    previs_refs: z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    audio: z.ZodArray<z.ZodObject<{
        line_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        sha256: z.ZodString;
        duration_ms: z.ZodNumber;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number;
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }, {
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number;
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }>, "many">;
    dialogue_timing: z.ZodArray<z.ZodObject<{
        line_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
        start_ms: z.ZodNumber;
        read_duration_ms: z.ZodNullable<z.ZodNumber>;
        method: z.ZodEnum<["manual_read", "test_fixture", "estimate", "unknown"]>;
        evidence: z.ZodEnum<["fixture", "mock", "live", "external_manual"]>;
        audio_sha256: z.ZodNullable<z.ZodString>;
        assessment: z.ZodEnum<["fits", "overflow", "unknown"]>;
    } & {
        shot_ref: z.ZodObject<{
            kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
            id: z.ZodString;
            revision: z.ZodNumber;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }, {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
        shot_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }, {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
        shot_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }>, "many">;
    delivery: z.ZodObject<{
        aspect_ratio: z.ZodEnum<["9:16", "16:9", "1:1"]>;
        fps_num: z.ZodNumber;
        fps_den: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        fps_num: number;
        fps_den: number;
        aspect_ratio: "9:16" | "16:9" | "1:1";
    }, {
        fps_num: number;
        fps_den: number;
        aspect_ratio: "9:16" | "16:9" | "1:1";
    }>;
    unresolved_items: z.ZodArray<z.ZodString, "many">;
    kind: z.ZodLiteral<"production_package">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "production_package";
    id: string;
    revision: number;
    contract_version: "0.3.0-draft.1";
    audio: {
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number;
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }[];
    source_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    dialogue_timing: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
        shot_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }[];
    target_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    purpose: "offline_rehearsal" | "production_candidate";
    previs_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    delivery: {
        fps_num: number;
        fps_den: number;
        aspect_ratio: "9:16" | "16:9" | "1:1";
    };
    unresolved_items: string[];
}, {
    kind: "production_package";
    id: string;
    revision: number;
    contract_version: "0.3.0-draft.1";
    audio: {
        sha256: string;
        evidence: "fixture" | "mock" | "live" | "external_manual";
        duration_ms: number;
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }[];
    source_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    dialogue_timing: {
        evidence: "fixture" | "mock" | "live" | "external_manual";
        line_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
        start_ms: number;
        method: "unknown" | "estimate" | "manual_read" | "test_fixture";
        read_duration_ms: number | null;
        audio_sha256: string | null;
        assessment: "unknown" | "fits" | "overflow";
        shot_ref: {
            kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
            id: string;
            revision: number;
            sha256: string;
        };
    }[];
    target_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    purpose: "offline_rehearsal" | "production_candidate";
    previs_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    delivery: {
        fps_num: number;
        fps_den: number;
        aspect_ratio: "9:16" | "16:9" | "1:1";
    };
    unresolved_items: string[];
}>;
export type ProductionPackage = z.infer<typeof ProductionPackageSchema>;
export declare const StagePlanSchema: z.ZodObject<{
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    stage: z.ZodEnum<["understanding", "reference_images", "previs"]>;
    input_refs: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>, "many">, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[], {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[]>;
    source_asset_hashes: z.ZodArray<z.ZodString, "many">;
    actions: z.ZodArray<z.ZodString, "many">;
    provider: z.ZodString;
    external_upload: z.ZodBoolean;
    budget: z.ZodObject<{
        currency: z.ZodString;
        max_amount_micros: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        currency: string;
        max_amount_micros: number;
    }, {
        currency: string;
        max_amount_micros: number;
    }>;
    kind: z.ZodLiteral<"stage_plan">;
    id: z.ZodString;
    revision: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    kind: "stage_plan";
    id: string;
    revision: number;
    external_upload: boolean;
    provider: string;
    contract_version: "0.3.0-draft.1";
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    stage: "previs" | "understanding" | "reference_images";
    source_asset_hashes: string[];
    actions: string[];
    budget: {
        currency: string;
        max_amount_micros: number;
    };
}, {
    kind: "stage_plan";
    id: string;
    revision: number;
    external_upload: boolean;
    provider: string;
    contract_version: "0.3.0-draft.1";
    input_refs: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }[];
    stage: "previs" | "understanding" | "reference_images";
    source_asset_hashes: string[];
    actions: string[];
    budget: {
        currency: string;
        max_amount_micros: number;
    };
}>;
export type StagePlan = z.infer<typeof StagePlanSchema>;
/** Never an execution credential: callers must obtain separate host-owned authority. */
export declare const UntrustedConfirmationSchema: z.ZodDiscriminatedUnion<"scope", [z.ZodObject<{
    scope: z.ZodLiteral<"preproduction_stage">;
    stage: z.ZodEnum<["understanding", "reference_images", "previs"]>;
    stage_plan_ref: z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>;
    stage_input_sha256: z.ZodString;
    id: z.ZodString;
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    authority: z.ZodLiteral<"untrusted_record">;
    status: z.ZodEnum<["proposed", "confirmed", "rejected"]>;
    asserted_by: z.ZodString;
    asserted_at: z.ZodString;
    provider: z.ZodString;
    source_asset_hashes: z.ZodArray<z.ZodString, "many">;
    external_upload: z.ZodBoolean;
    budget: z.ZodObject<{
        currency: z.ZodString;
        max_amount_micros: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        currency: string;
        max_amount_micros: number;
    }, {
        currency: string;
        max_amount_micros: number;
    }>;
    repair_scope: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "proposed" | "rejected" | "confirmed";
    id: string;
    external_upload: boolean;
    provider: string;
    contract_version: "0.3.0-draft.1";
    stage: "previs" | "understanding" | "reference_images";
    source_asset_hashes: string[];
    budget: {
        currency: string;
        max_amount_micros: number;
    };
    scope: "preproduction_stage";
    stage_plan_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    stage_input_sha256: string;
    authority: "untrusted_record";
    asserted_by: string;
    asserted_at: string;
    repair_scope: string[];
}, {
    status: "proposed" | "rejected" | "confirmed";
    id: string;
    external_upload: boolean;
    provider: string;
    contract_version: "0.3.0-draft.1";
    stage: "previs" | "understanding" | "reference_images";
    source_asset_hashes: string[];
    budget: {
        currency: string;
        max_amount_micros: number;
    };
    scope: "preproduction_stage";
    stage_plan_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
    stage_input_sha256: string;
    authority: "untrusted_record";
    asserted_by: string;
    asserted_at: string;
    repair_scope: string[];
}>, z.ZodObject<{
    scope: z.ZodLiteral<"production">;
    production_package_ref: z.ZodObject<{
        kind: z.ZodEnum<["source_asset", "source_evidence", "source_character", "source_relation", "source_dialogue", "source_scene", "source_prop", "source_beat", "source_shot", "source_storyboard", "source_package", "target_character", "target_scene", "target_prop", "target_line", "target_shot", "target_storyboard", "previs", "production_package", "stage_plan"]>;
        id: z.ZodString;
        revision: z.ZodNumber;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }, {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    }>;
    id: z.ZodString;
    contract_version: z.ZodLiteral<"0.3.0-draft.1">;
    authority: z.ZodLiteral<"untrusted_record">;
    status: z.ZodEnum<["proposed", "confirmed", "rejected"]>;
    asserted_by: z.ZodString;
    asserted_at: z.ZodString;
    provider: z.ZodString;
    source_asset_hashes: z.ZodArray<z.ZodString, "many">;
    external_upload: z.ZodBoolean;
    budget: z.ZodObject<{
        currency: z.ZodString;
        max_amount_micros: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        currency: string;
        max_amount_micros: number;
    }, {
        currency: string;
        max_amount_micros: number;
    }>;
    repair_scope: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "proposed" | "rejected" | "confirmed";
    id: string;
    external_upload: boolean;
    provider: string;
    contract_version: "0.3.0-draft.1";
    source_asset_hashes: string[];
    budget: {
        currency: string;
        max_amount_micros: number;
    };
    scope: "production";
    authority: "untrusted_record";
    asserted_by: string;
    asserted_at: string;
    repair_scope: string[];
    production_package_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
}, {
    status: "proposed" | "rejected" | "confirmed";
    id: string;
    external_upload: boolean;
    provider: string;
    contract_version: "0.3.0-draft.1";
    source_asset_hashes: string[];
    budget: {
        currency: string;
        max_amount_micros: number;
    };
    scope: "production";
    authority: "untrusted_record";
    asserted_by: string;
    asserted_at: string;
    repair_scope: string[];
    production_package_ref: {
        kind: "source_asset" | "source_evidence" | "source_character" | "source_relation" | "source_dialogue" | "source_scene" | "source_prop" | "source_beat" | "source_shot" | "source_storyboard" | "source_package" | "target_character" | "target_scene" | "target_prop" | "target_line" | "target_shot" | "target_storyboard" | "previs" | "production_package" | "stage_plan";
        id: string;
        revision: number;
        sha256: string;
    };
}>]>;
export type UntrustedConfirmation = z.infer<typeof UntrustedConfirmationSchema>;
type Versioned = {
    kind: z.infer<typeof kinds>;
    id: string;
    revision: number;
};
/** Reject non-JSON values rather than silently hashing a lossy serialization. */
export declare function workflowHash(value: unknown): string;
export declare function revisionRef(value: Versioned): WorkflowRef;
export declare function assertImmutableRevision(before: Versioned, after: Versioned): void;
export declare function validateSourceAssetPackage(input: unknown): SourceAssetPackage;
export declare function validateTargetStoryboard(input: unknown, sourceInput: unknown): TargetStoryboard;
export declare function validatePrevisArtifact(input: unknown, context: {
    source: unknown;
    target?: unknown;
}): PrevisArtifact;
export declare function validateProductionPackage(input: unknown, context: {
    source: unknown;
    target: unknown;
    previs: unknown[];
}): ProductionPackage;
/** Binding integrity only. Even a confirmed record conveys zero execution authority. */
export declare function validateUntrustedConfirmation(input: unknown, context: {
    stagePlan?: unknown;
    productionPackage?: unknown;
}): UntrustedConfirmation;
/** Reports losses; deliberately creates neither a draft package nor an execution grant. */
export declare function auditLegacyMigration(input: unknown): {
    source_contract_version: "0.2.1";
    target_contract_version: "0.3.0-draft.1";
    legacy_sha256: string;
    lossless: false;
    execution_authorized: false;
    candidate_shot_mappings: {
        source_shot_id: string;
        legacy_plan_revision: number;
        target_identity: null;
    }[];
    missing: string[];
    discarded_authority: string;
    ledger_action: "none";
};
/** An old plan cannot represent splits, merges or new shots without information loss. */
export declare function assertLegacyShotMappingCompatible(targetInput: unknown, sourceInput: unknown): void;
export {};
