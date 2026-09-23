import { z } from "zod";
import { type ParsedSrt } from "./srt.js";
export { parseSrt } from "./srt.js";
export declare const ASSISTED_INGEST_VERSION: "0.1.0";
export declare const INGEST_LIMITS: Readonly<{
    assets: 16;
    text_bytes: number;
    media_bytes: number;
    total_bytes: number;
    manifest_bytes: number;
}>;
export declare const AssistedSourceManifestSchema: z.ZodObject<{
    ingest_manifest_version: z.ZodLiteral<"0.1.0">;
    source_package: z.ZodObject<{
        id: z.ZodString;
        revision: z.ZodNumber;
        source_locale: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        revision: number;
        source_locale: string;
    }, {
        id: string;
        revision: number;
        source_locale: string;
    }>;
    assets: z.ZodArray<z.ZodDiscriminatedUnion<"media_kind", [z.ZodObject<{
        media_kind: z.ZodLiteral<"video">;
        id: z.ZodString;
        revision: z.ZodNumber;
        path: z.ZodString;
        evidence: z.ZodEnum<["fixture", "external_manual"]>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "video";
    }, {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "video";
    }>, z.ZodObject<{
        media_kind: z.ZodLiteral<"script">;
        id: z.ZodString;
        revision: z.ZodNumber;
        path: z.ZodString;
        evidence: z.ZodEnum<["fixture", "external_manual"]>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "script";
    }, {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "script";
    }>, z.ZodObject<{
        media_kind: z.ZodLiteral<"subtitles">;
        video_asset_id: z.ZodString;
        id: z.ZodString;
        revision: z.ZodNumber;
        path: z.ZodString;
        evidence: z.ZodEnum<["fixture", "external_manual"]>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "subtitles";
        video_asset_id: string;
    }, {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "subtitles";
        video_asset_id: string;
    }>]>, "many">;
    annotations: z.ZodObject<{
        evidence: z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source_evidence">;
            id: z.ZodString;
            revision: z.ZodNumber;
            source_asset_id: z.ZodString;
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
            uncertainties: z.ZodArray<z.ZodString, "many">;
        } & {
            evidence: z.ZodEnum<["fixture", "external_manual"]>;
            method: z.ZodEnum<["manual_annotation", "creator_supplied", "approximate_reconstruction", "authored_fixture"]>;
        }, "strict", z.ZodTypeAny, {
            kind: "source_evidence";
            id: string;
            revision: number;
            evidence: "fixture" | "external_manual";
            source_asset_id: string;
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
            method: "manual_annotation" | "creator_supplied" | "approximate_reconstruction" | "authored_fixture";
            uncertainties: string[];
        }, {
            kind: "source_evidence";
            id: string;
            revision: number;
            evidence: "fixture" | "external_manual";
            source_asset_id: string;
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
            method: "manual_annotation" | "creator_supplied" | "approximate_reconstruction" | "authored_fixture";
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
            kind: z.ZodLiteral<"source_storyboard">;
            id: z.ZodString;
            revision: z.ZodNumber;
        } & {
            shots: z.ZodArray<z.ZodObject<Omit<{
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
            }, "source_asset_sha256">, "strict", z.ZodTypeAny, {
                kind: "source_shot";
                id: string;
                revision: number;
                source_in_ms: number;
                source_out_ms: number;
                character_ids: string[];
                dialogue_ids: string[];
                source_asset_id: string;
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
                evidence_ids: string[];
                scene_id: string;
                prop_ids: string[];
                action: string;
            }>, "many">;
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
                evidence_ids: string[];
                scene_id: string;
                prop_ids: string[];
                action: string;
            }[];
        }>;
        unknowns: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        evidence: {
            kind: "source_evidence";
            id: string;
            revision: number;
            evidence: "fixture" | "external_manual";
            source_asset_id: string;
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
            method: "manual_annotation" | "creator_supplied" | "approximate_reconstruction" | "authored_fixture";
            uncertainties: string[];
        }[];
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
                evidence_ids: string[];
                scene_id: string;
                prop_ids: string[];
                action: string;
            }[];
        };
    }, {
        evidence: {
            kind: "source_evidence";
            id: string;
            revision: number;
            evidence: "fixture" | "external_manual";
            source_asset_id: string;
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
            method: "manual_annotation" | "creator_supplied" | "approximate_reconstruction" | "authored_fixture";
            uncertainties: string[];
        }[];
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
                evidence_ids: string[];
                scene_id: string;
                prop_ids: string[];
                action: string;
            }[];
        };
    }>;
    preparation: z.ZodObject<{
        declared_minutes: z.ZodNullable<z.ZodNumber>;
        notes: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        declared_minutes: number | null;
        notes: string;
    }, {
        declared_minutes: number | null;
        notes: string;
    }>;
}, "strict", z.ZodTypeAny, {
    assets: ({
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "video";
    } | {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "script";
    } | {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "subtitles";
        video_asset_id: string;
    })[];
    source_package: {
        id: string;
        revision: number;
        source_locale: string;
    };
    ingest_manifest_version: "0.1.0";
    annotations: {
        evidence: {
            kind: "source_evidence";
            id: string;
            revision: number;
            evidence: "fixture" | "external_manual";
            source_asset_id: string;
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
            method: "manual_annotation" | "creator_supplied" | "approximate_reconstruction" | "authored_fixture";
            uncertainties: string[];
        }[];
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
                evidence_ids: string[];
                scene_id: string;
                prop_ids: string[];
                action: string;
            }[];
        };
    };
    preparation: {
        declared_minutes: number | null;
        notes: string;
    };
}, {
    assets: ({
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "video";
    } | {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "script";
    } | {
        path: string;
        id: string;
        revision: number;
        evidence: "fixture" | "external_manual";
        media_kind: "subtitles";
        video_asset_id: string;
    })[];
    source_package: {
        id: string;
        revision: number;
        source_locale: string;
    };
    ingest_manifest_version: "0.1.0";
    annotations: {
        evidence: {
            kind: "source_evidence";
            id: string;
            revision: number;
            evidence: "fixture" | "external_manual";
            source_asset_id: string;
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
            method: "manual_annotation" | "creator_supplied" | "approximate_reconstruction" | "authored_fixture";
            uncertainties: string[];
        }[];
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
                evidence_ids: string[];
                scene_id: string;
                prop_ids: string[];
                action: string;
            }[];
        };
    };
    preparation: {
        declared_minutes: number | null;
        notes: string;
    };
}>;
export type AssistedSourceManifest = z.infer<typeof AssistedSourceManifestSchema>;
export type VideoProbe = {
    format: string;
    width: number;
    height: number;
    codec: string;
    duration_ms: number;
    frame_count: number | null;
    avg_frame_rate: string;
    r_frame_rate: string;
    audio_streams: number;
};
export type IngestedAsset = {
    id: string;
    uri: string;
    sha256: string;
    bytes: number;
    media_kind: "video" | "script" | "subtitles";
    probe: VideoProbe | null;
    subtitles: (ParsedSrt & {
        video_asset_id: string;
    }) | null;
};
export type AssistedIngestReceipt = {
    ingest_manifest_version: typeof ASSISTED_INGEST_VERSION;
    status: "complete";
    mode: "assisted";
    created_at: string;
    elapsed_ms: number;
    source_package_sha256: string;
    manifest_sha256: string;
    assets: IngestedAsset[];
    preparation: AssistedSourceManifest["preparation"];
    offset_unit: "utf16_code_units";
    recognition: "not_run";
    semantic_quality: "unverified";
    warnings: string[];
};
/** Offline, assisted file import. Annotations remain human assertions, not machine video understanding. */
export declare function importAssistedSource(input: {
    manifest: unknown;
    workspaceRoot: string;
    outputDir: string;
    tools?: {
        ffprobe?: string;
    };
    signal?: AbortSignal;
}): Promise<{
    outputDir: string;
    packagePath: string;
    reportPath: string;
    receiptPath: string;
    sourcePackage: {
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
    };
    receipt: AssistedIngestReceipt;
}>;
