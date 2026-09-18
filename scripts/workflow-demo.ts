import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { makeWorkflowDraftFixture } from "../src/contracts/workflow-fixture.js";
import { WORKFLOW_DRAFT_VERSION, auditLegacyMigration, workflowHash } from "../src/contracts/workflow-draft.js";
import { familyFixture } from "../src/contracts/fixture.js";
const output = resolve(process.argv[2] ?? `.runtime/workflow-draft-${Date.now()}`);
// Refuse an existing run directory to preserve prior evidence.
await mkdir(dirname(output), { recursive: true });
await mkdir(output, { recursive: false });
const fixture = makeWorkflowDraftFixture();
const summary = {
  contract_version: WORKFLOW_DRAFT_VERSION,
  scope: "authored metadata validation only; no media recognition, rendering or provider calls",
  evidence: "fixture", execution_authorized: false, media_rendered: false,
  source_shots: fixture.source.storyboard.shots.length,
  target_shots: fixture.target.shots.map(s => ({ id: s.id, source_shot_ids: s.source_shot_ids, reason: s.creative_rationale })),
  previs: fixture.previs.map(p => ({ id: p.id, domain: p.domain, status: p.status })),
  production_package_hash: workflowHash(fixture.production),
  migration: auditLegacyMigration(familyFixture),
  not_implemented: ["automatic video understanding", "source asset file import", "previs rendering", "trusted production grants", "new DSH stage tools", "real media generation"],
};
await writeFile(resolve(output, "fixture.json"), JSON.stringify(fixture, null, 2) + "\n");
await writeFile(resolve(output, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify({ output, ...summary }, null, 2));
