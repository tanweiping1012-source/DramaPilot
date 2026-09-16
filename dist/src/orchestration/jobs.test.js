import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { JobStore } from "./store.js";
import { JobOrchestrator } from "./jobs.js";
import { OfflineAuthorization } from "./authorization.js";
import { TestProvider, requestFixture } from "./test-support.js";
import { familyFixture } from "../contracts/fixture.js";
const signal = () => new AbortController().signal;
function setup(scenario = "success", cost = 1_000_000) {
    const root = mkdtempSync(join(tmpdir(), "dp-unit-"));
    const store = new JobStore(join(root, "jobs.sqlite"), {
        basis: "mock",
        currency: "USD",
        amount_micros: 10_000_000,
    });
    const provider = new TestProvider(join(root, "provider"), scenario, cost, () => {
        const saved = store.get("op-1");
        assert.ok(saved);
        assert.equal(saved.status, "submitting");
        assert.equal(saved.reserved.amount_micros, cost);
    });
    const auth = new OfflineAuthorization([provider]);
    auth.approveFixture(familyFixture);
    return {
        root,
        store,
        provider,
        engine: new JobOrchestrator(store, provider, auth),
        cleanup() {
            store.close();
            rmSync(root, { recursive: true, force: true });
        },
    };
}
function worker(root, ...args) {
    return new Promise((resolve) => {
        const p = spawn(process.execPath, [fileURLToPath(new URL("./worker.js", import.meta.url)), root, ...args], { stdio: ["ignore", "pipe", "pipe"] });
        let out = "";
        p.stdout.on("data", (d) => (out += d));
        p.stderr.on("data", (d) => (out += d));
        p.on("close", (code) => resolve({ code, out }));
    });
}
test("reserve exists at submit boundary; accepted and collected do not claim quality", async () => {
    const x = setup();
    try {
        const j = await x.engine.submit(requestFixture(), familyFixture, signal());
        assert.equal(j.status, "queued");
        assert.equal(x.provider.count("submit"), 1);
        await x.engine.poll(j.operation_id, signal());
        assert.equal((await x.engine.collect(j.operation_id, signal())).status, "needs_review");
        assert.equal(x.store.get(j.operation_id).billing_state, "unknown");
    }
    finally {
        x.cleanup();
    }
});
test("lost receipt survives restart and changing operation cannot bypass semantic identity", async () => {
    const x = setup("lost_receipt", 7_000_000);
    try {
        assert.equal((await x.engine.submit(requestFixture(), familyFixture, signal())).status, "submission_unknown");
        const restarted = await worker(x.root, "submit", "op-1", "s1", "lost_receipt", "7000000");
        assert.equal(restarted.code, 0, restarted.out);
        await x.engine.submit(requestFixture("other-op"), familyFixture, signal());
        assert.equal(x.provider.count("submit"), 1);
        assert.equal(x.store.get("op-1").reserved.amount_micros, 7_000_000);
        await assert.rejects(() => x.engine.submit(requestFixture("new-shot", "s2"), familyFixture, signal()), /Budget exhausted/);
    }
    finally {
        x.cleanup();
    }
});
test("known job restart only polls; no duplicate submit", async () => {
    const x = setup();
    try {
        await x.engine.submit(requestFixture(), familyFixture, signal());
        const r = await worker(x.root, "poll");
        assert.equal(r.code, 0, r.out);
        assert.equal(x.provider.count("submit"), 1);
        assert.equal(x.provider.count("poll"), 1);
    }
    finally {
        x.cleanup();
    }
});
test("poll timeout preserves budget; unsupported cancel never calls endpoint", async () => {
    const x = setup("poll_timeout");
    try {
        await x.engine.submit(requestFixture(), familyFixture, signal());
        await assert.rejects(() => x.engine.poll("op-1", signal()));
        await x.engine.cancel("op-1", signal());
        assert.equal(x.provider.count("cancel"), 0);
        assert.equal(x.store.get("op-1").status, "queued");
        assert.equal(x.provider.count("submit"), 1);
    }
    finally {
        x.cleanup();
    }
});
test("cancel request alone is not cancelled or refunded; corrupt media rejected", async () => {
    const x = setup("cancel_pending");
    try {
        await x.engine.submit(requestFixture(), familyFixture, signal());
        const cancelled = await x.engine.cancel("op-1", signal());
        assert.equal(cancelled.job.status, "cancel_requested");
        assert.equal(cancelled.job.billing_state, "unknown");
    }
    finally {
        x.cleanup();
    }
    const y = setup("corrupt");
    try {
        await y.engine.submit(requestFixture(), familyFixture, signal());
        await y.engine.poll("op-1", signal());
        await assert.rejects(() => y.engine.collect("op-1", signal()), /hash mismatch/);
    }
    finally {
        y.cleanup();
    }
});
test("two processes share atomic operation identity and total budget", async () => {
    const root = mkdtempSync(join(tmpdir(), "dp-process-"));
    try {
        const first = await Promise.all([
            worker(root, "submit", "op-1", "s1", "success", "6000000"),
            worker(root, "submit", "op-1", "s1", "success", "6000000"),
        ]);
        assert.ok(first.every((r) => r.code === 0), JSON.stringify(first));
        const provider = new TestProvider(join(root, "provider"));
        assert.equal(provider.count("submit"), 1);
        const second = await worker(root, "submit", "op-2", "s2", "success", "6000000");
        assert.notEqual(second.code, 0);
        assert.equal(provider.count("submit"), 1);
    }
    finally {
        rmSync(root, { recursive: true, force: true });
    }
});
