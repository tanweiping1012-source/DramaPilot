/** Authored metadata only: no video, reference image, speech or previs is rendered. */
export declare function makeWorkflowDraftFixture(): {
    source: {
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
    target: {
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
    };
    previs: ({
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
    } | {
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
    } | {
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
    })[];
    production: {
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
    };
    stagePlan: {
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
    };
    stageConfirmation: {
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
    } | {
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
    };
    productionConfirmation: {
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
    } | {
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
    };
};
