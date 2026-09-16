import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JobStore } from "../orchestration/store.js";
import { familyFixture } from "../contracts/fixture.js";
import { saveAdaptation, invalidatedArtifacts } from "./service.js";
import type { Artifact } from "../contracts/index.js";
test("revision same content immutable; hidden changed character cannot reuse revision", () => {
  const root = mkdtempSync(join(tmpdir(), "dp-revisions-"));
  const store = new JobStore(join(root, "jobs.sqlite"), {
    basis: "mock",
    currency: "USD",
    amount_micros: 0,
  });
  try {
    saveAdaptation(store, familyFixture);
    const p = structuredClone(familyFixture);
    p.characters[0]!.appearance_brief = "changed";
    assert.throws(() => saveAdaptation(store, p), /immutable/);
    p.revision = 2;
    p.approval.revision = 2;
    p.changes.forEach((c) => (c.approval.revision = 2));
    assert.throws(() => saveAdaptation(store, p), /advance revision/);
  } finally {
    store.close();
    rmSync(root, { recursive: true, force: true });
  }
});
test("native dialogue change invalidates its video; unrelated character stays reusable", () => {
  const artifact = (id: string, char: string, line: string): Artifact => ({
    artifact_id: id,
    kind: "video",
    uri: "/tmp/x",
    sha256: "0".repeat(64),
    evidence: "mock",
    input_revisions: [
      { kind: "character", id: char, revision: 1 },
      { kind: "line", id: line, revision: 1 },
    ],
    operation_id: "o",
    media_type: "video/mp4",
    duration_ms: null,
    probe: null,
    expires_at: null,
  });
  const a = [
    artifact("s1", "elder", "l1"),
    artifact("s2", "outsider", "l2"),
    artifact("s3", "elder", "l1"),
  ];
  assert.deepEqual(
    invalidatedArtifacts(
      a,
      { kind: "character", id: "elder", revision: 2 },
      "separate",
    ),
    ["s1", "s3"],
  );
  assert.deepEqual(
    invalidatedArtifacts(a, { kind: "line", id: "l1", revision: 2 }, "native"),
    ["s1", "s3"],
  );
  assert.deepEqual(
    invalidatedArtifacts(
      a,
      { kind: "line", id: "l1", revision: 2 },
      "separate",
    ),
    [],
  );
});
