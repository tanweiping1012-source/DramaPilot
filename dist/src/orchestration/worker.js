import { JobStore } from "./store.js";
import { JobOrchestrator } from "./jobs.js";
import { OfflineAuthorization } from "./authorization.js";
import { TestProvider, requestFixture } from "./test-support.js";
import { familyFixture } from "../contracts/fixture.js";
const [root, action, operation = "op-1", shot = "s1", scenario = "success", cost = "1000000",] = process.argv.slice(2);
if (!root)
    throw new Error("root required");
const provider = new TestProvider(`${root}/provider`, scenario, Number(cost));
const store = new JobStore(`${root}/jobs.sqlite`, {
    basis: "mock",
    currency: "USD",
    amount_micros: 10_000_000,
});
const auth = new OfflineAuthorization([provider]);
auth.approveFixture(familyFixture);
const engine = new JobOrchestrator(store, provider, auth);
try {
    const result = action === "poll"
        ? await engine.poll(operation, new AbortController().signal)
        : await engine.submit(requestFixture(operation, shot), familyFixture, new AbortController().signal);
    console.log(JSON.stringify(result));
}
finally {
    store.close();
}
