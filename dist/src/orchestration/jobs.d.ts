import { type AdaptationPackage, type GenerationJob, type GenerationProvider } from "../contracts/index.js";
import { JobStore } from "./store.js";
import { OfflineAuthorization } from "./authorization.js";
export declare class JobOrchestrator {
    readonly store: JobStore;
    readonly provider: GenerationProvider;
    readonly authorization: OfflineAuthorization;
    constructor(store: JobStore, provider: GenerationProvider, authorization: OfflineAuthorization);
    quote(input: unknown, p: AdaptationPackage, signal: AbortSignal): Promise<{
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
    submit(input: unknown, p: AdaptationPackage, signal: AbortSignal): Promise<GenerationJob>;
    private receipts;
    private known;
    poll(id: string, signal: AbortSignal): Promise<GenerationJob>;
    cancel(id: string, signal: AbortSignal): Promise<{
        job: GenerationJob;
        cancel_status: string;
    }>;
    collect(id: string, signal: AbortSignal): Promise<GenerationJob>;
}
