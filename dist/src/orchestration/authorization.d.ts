import type { AdaptationPackage, GenerationProvider, GenerationRequest } from "../contracts/index.js";
/** Host-owned trust boundary. This first release deliberately cannot grant paid execution.
 * No grant/import method is exposed as a DSH tool. Model approval fields are documentary only.
 */
export declare class OfflineAuthorization {
    #private;
    constructor(trustedOfflineProviders: readonly GenerationProvider[]);
    approveFixture(plan: AdaptationPackage): void;
    assertAllowed(provider: GenerationProvider, request: GenerationRequest, plan: AdaptationPackage): void;
}
