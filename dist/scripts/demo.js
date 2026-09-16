import { resolve, join } from "node:path";
import { writeFile } from "node:fs/promises";
import { createRuntime } from "../src/orchestration/runtime.js";
import { buildRequest } from "../src/adaptation/request.js";
import { readAdaptation } from "../src/adaptation/service.js";
const runtime = await createRuntime({
    runtimeDir: resolve(process.argv[2] ?? ".runtime/demo"),
    ...(process.env.DRAMAPILOT_FIXTURE_DIR
        ? { fixtureDir: process.env.DRAMAPILOT_FIXTURE_DIR }
        : {}),
});
try {
    const signal = new AbortController().signal;
    const p = readAdaptation(runtime.store);
    for (const plan of p.plans) {
        const request = buildRequest(p, `demo-r${p.revision}-${plan.shot_id}`, plan.shot_id);
        let job = await runtime.jobs.submit(request, p, signal);
        for (let i = 0; i < 5 &&
            !["succeeded", "needs_review", "failed", "submission_unknown"].includes(job.status); i++)
            job = await runtime.jobs.poll(job.operation_id, signal);
        if (job.status === "succeeded")
            await runtime.jobs.collect(job.operation_id, signal);
    }
    const assembly = process.env.DRAMAPILOT_FIXTURE_DIR
        ? await runtime.assemble(signal)
        : {
            status: "not_run",
            reason: "Set DRAMAPILOT_FIXTURE_DIR to generated B color/tone clips for local video assembly",
        };
    const report = await runtime.review();
    const diagnostics = await runtime.provider.diagnostics();
    const summary = {
        evidence: "offline_fixture_mock",
        report,
        assembly,
        diagnostics,
        paid_calls: 0,
        quality: "not_verified",
    };
    await writeFile(join(runtime.root, "demo.json"), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify({
        root: runtime.root,
        report: report.path,
        assembly: "path" in assembly ? assembly.path : assembly,
        submitCount: diagnostics.submitCount,
        paid_calls: 0,
        quality: "not_verified",
    }, null, 2));
}
finally {
    runtime.close();
}
