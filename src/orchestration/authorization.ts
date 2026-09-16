import type {
  AdaptationPackage,
  GenerationProvider,
  GenerationRequest,
} from "../contracts/index.js";
import { canonicalHash } from "../contracts/validate.js";
/** Host-owned trust boundary. This first release deliberately cannot grant paid execution.
 * No grant/import method is exposed as a DSH tool. Model approval fields are documentary only.
 */
export class OfflineAuthorization {
  readonly #providers: ReadonlySet<GenerationProvider>;
  readonly #approved = new Set<string>();
  constructor(trustedOfflineProviders: readonly GenerationProvider[]) {
    this.#providers = new Set(trustedOfflineProviders);
  }
  approveFixture(plan: AdaptationPackage): void {
    if (plan.project.evidence !== "fixture")
      throw new Error("Only fixture approval enabled");
    this.#approved.add(canonicalHash(plan));
  }
  assertAllowed(
    provider: GenerationProvider,
    request: GenerationRequest,
    plan: AdaptationPackage,
  ): void {
    if (
      !this.#providers.has(provider) ||
      request.evidence !== "mock" ||
      plan.project.evidence !== "fixture"
    )
      throw new Error("Live/external execution is not authorized");
    if (!this.#approved.has(canonicalHash(plan)))
      throw new Error("Host fixture approval required");
  }
}
