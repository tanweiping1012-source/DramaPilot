import { DatabaseSync } from "node:sqlite";
import type { GenerationJob, Money } from "../contracts/index.js";
export declare class JobStore {
    readonly path: string;
    readonly db: DatabaseSync;
    constructor(path: string, budget: Money);
    close(): void;
    budget(): Money;
    get(id: string): GenerationJob | undefined;
    list(): GenerationJob[];
    event(id: string, event: string, data: unknown): void;
    exposure(job: GenerationJob): number;
    reserve(job: GenerationJob, semanticHash: string): {
        job: GenerationJob;
        created: boolean;
    };
    update(id: string, mutate: (job: GenerationJob) => GenerationJob, event: string): GenerationJob;
}
