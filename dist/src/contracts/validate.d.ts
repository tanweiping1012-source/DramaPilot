import { type AdaptationPackage, type RevisionRef, type GenerationRequest } from "./index.js";
/** Stable lossless JSON hash; provider quote must bind the validated exact request. */
export declare function canonicalHash(value: unknown): string;
export declare function currentRevisions(p: AdaptationPackage): RevisionRef[];
export declare function assertCurrent(refs: RevisionRef[], current: RevisionRef[]): void;
export declare function validateAdaptation(input: unknown): AdaptationPackage;
export declare function validateRequest(input: unknown, p: AdaptationPackage): GenerationRequest;
export declare function validateEpisode(input: unknown, p: AdaptationPackage): {
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
};
