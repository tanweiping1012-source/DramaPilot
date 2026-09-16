import { type GenerationProvider, type GenerationRequest, type ProviderCapabilities } from '../contracts/index.js';
import { type MediaTools } from '../media/local.ts';
export type MockScenario = 'success' | 'lost_receipt' | 'poll_timeout' | 'failed' | 'cancel_unsupported' | 'cancel_pending' | 'artifact_expired';
export type MockOptions = {
    storeDir: string;
    scenario?: MockScenario;
    pollTimeouts?: number;
    fixtureByShot?: Record<string, string>;
    tools?: MediaTools;
    /** Synthetic accounting units only, not a vendor quote. */
    quoteMicros?: number;
    /** Host test hook: observe A's persisted operation at the actual submit boundary. */
    onSubmit?: (request: GenerationRequest) => void | Promise<void>;
};
/** Disk state models a surviving remote service only. No operation deduplication or budget ownership. */
export declare class MockGenerationProvider implements GenerationProvider {
    #private;
    constructor(options: MockOptions);
    capabilities(signal: AbortSignal): Promise<ProviderCapabilities>;
    quote(request: GenerationRequest, signal: AbortSignal): Promise<{
        quote_id: string;
        provider: string;
        model_version: string;
        request_hash: string;
        cost: {
            currency: string;
            amount_micros: number;
            basis: "mock";
        };
        expires_at: null;
    }>;
    submit(request: GenerationRequest, signal: AbortSignal): Promise<{
        status: "submission_unknown";
        reason: string;
        job_id?: never;
        receipts?: never;
    } | {
        status: "accepted";
        job_id: string;
        receipts: never[];
        reason?: never;
    }>;
    poll(jobId: string, signal: AbortSignal): Promise<{
        job_id: string;
        status: "unknown";
        receipts: never[];
        message: string;
    } | {
        job_id: string;
        status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
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
        message: null;
    }>;
    cancel(jobId: string, signal: AbortSignal): Promise<{
        job_id: string;
        status: "unsupported";
        receipts: never[];
    } | {
        job_id: string;
        status: "cancelled";
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
    } | {
        job_id: string;
        status: "unknown";
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
    } | {
        job_id: string;
        status: "cancel_requested";
        receipts: never[];
    }>;
    collect(jobId: string, signal: AbortSignal): Promise<{
        job_id: string;
        status: "failed";
        artifacts: never[];
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
    } | {
        job_id: string;
        status: "pending";
        artifacts: never[];
        receipts: never[];
    } | {
        job_id: string;
        status: "expired";
        artifacts: never[];
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
    } | {
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
    diagnostics(): Promise<{
        submitCount: number;
        pollCount: number;
        cancelCount: number;
        collectCount: number;
        events: {
            method: string;
            jobId: string | null;
            operationId: string | null;
        }[];
    }>;
}
export declare function loadFixtureShotMap(directory: string): Record<string, string>;
