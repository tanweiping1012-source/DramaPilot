import test from "node:test";
import assert from "node:assert/strict";
import { OfflineAuthorization } from "./authorization.js";
import { familyFixture } from "../contracts/fixture.js";
import type {
  GenerationProvider,
  GenerationRequest,
} from "../contracts/index.js";
test("model approved fields do not confer execution permission", () => {
  const fake = {} as GenerationProvider;
  const guard = new OfflineAuthorization([fake]);
  const p = structuredClone(familyFixture);
  p.approval = {
    status: "approved",
    revision: 1,
    approver: "model",
    approved_at: new Date().toISOString(),
  };
  const r = { evidence: "mock" } as GenerationRequest;
  assert.throws(() => guard.assertAllowed(fake, r, p));
  guard.approveFixture(p);
  guard.assertAllowed(fake, r, p);
  assert.throws(() => guard.assertAllowed({} as GenerationProvider, r, p));
  assert.throws(() => guard.assertAllowed(fake, { ...r, evidence: "live" }, p));
});
