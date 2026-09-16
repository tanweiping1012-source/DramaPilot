import { MockGenerationProvider } from "../providers/mock.js";
import { OfflineAuthorization } from "./authorization.js";
import { JobStore } from "./store.js";
import { JobOrchestrator } from "./jobs.js";
export declare function createRuntime(options: {
    runtimeDir: string;
    fixtureDir?: string;
}): Promise<{
    root: string;
    store: JobStore;
    provider: MockGenerationProvider;
    authorization: OfflineAuthorization;
    jobs: JobOrchestrator;
    close: () => void;
    review(): Promise<{
        path: string;
        report: {
            issues: string[];
            evidence: "fixture" | "mock" | "live" | "external_manual";
            technical: "pass" | "fail" | "unverified";
            visual: "pass" | "fail" | "unverified";
            language: "pass" | "fail" | "unverified";
            culture: "pass" | "fail" | "unverified";
        };
    }>;
    assemble(signal: AbortSignal): Promise<any>;
}>;
