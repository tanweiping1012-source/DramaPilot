import { type AdaptationPackage, type Artifact, type RevisionRef } from "../contracts/index.js";
import { JobStore } from "../orchestration/store.js";
export declare function saveAdaptation(store: JobStore, input: unknown): AdaptationPackage;
export declare function readAdaptation(store: JobStore, revision?: number): AdaptationPackage;
/** Concrete dependencies drive invalidation; adaptation revision is retained as provenance.
 * The caller retains all old artifacts, and must rebuild aggregate timeline/QA each revision.
 */
export declare function invalidatedArtifacts(artifacts: Artifact[], change: RevisionRef, audioMode: "native" | "separate" | "none"): string[];
