import test from "node:test";
import assert from "node:assert/strict";
import { OfflineAuthorization } from "./authorization.js";
import { familyFixture } from "../contracts/fixture.js";
test("model approved fields do not confer execution permission", () => {
    const fake = {};
    const guard = new OfflineAuthorization([fake]);
    const p = structuredClone(familyFixture);
    p.approval = {
        status: "approved",
        revision: 1,
        approver: "model",
        approved_at: new Date().toISOString(),
    };
    const r = { evidence: "mock" };
    assert.throws(() => guard.assertAllowed(fake, r, p));
    guard.approveFixture(p);
    guard.assertAllowed(fake, r, p);
    assert.throws(() => guard.assertAllowed({}, r, p));
    assert.throws(() => guard.assertAllowed(fake, { ...r, evidence: "live" }, p));
});
