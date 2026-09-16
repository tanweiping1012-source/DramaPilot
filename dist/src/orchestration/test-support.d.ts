import type { GenerationProvider, GenerationRequest, Receipt } from "../contracts/index.js";
export declare function requestFixture(operation?: string, shot?: string): GenerationRequest;
export declare class TestProvider implements GenerationProvider {
    readonly dir: string;
    readonly scenario: string;
    readonly cost: number;
    readonly beforeSubmit?: (() => void) | undefined;
    constructor(dir: string, scenario?: string, cost?: number, beforeSubmit?: (() => void) | undefined);
    record(method: string): void;
    count(method: string): number;
    capabilities(signal: AbortSignal): Promise<{
        cancel: "supported" | "unsupported";
        evidence: "fixture" | "mock" | "live" | "external_manual";
        provider: string;
        model_version: string;
        async: "supported" | "unsupported" | "unknown";
        poll: "supported" | "unsupported" | "unknown";
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
    quote(r: GenerationRequest, signal: AbortSignal): Promise<{
        quote_id: string;
        provider: string;
        model_version: string;
        request_hash: string;
        cost: {
            basis: "mock";
            currency: string;
            amount_micros: number;
        };
        expires_at: null;
    }>;
    submit(r: GenerationRequest, signal: AbortSignal): Promise<{
        status: "accepted";
        job_id: string;
        receipts: never[];
    }>;
    poll(id: string, signal: AbortSignal): Promise<{
        job_id: string;
        status: "succeeded";
        receipts: never[];
        message: null;
    }>;
    cancel(id: string, signal: AbortSignal): Promise<{
        job_id: string;
        status: "cancel_requested";
        receipts: never[];
    }>;
    collect(id: string, signal: AbortSignal): Promise<{
        job_id: string;
        status: "collected";
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
        receipts: Receipt[];
    }>;
}
