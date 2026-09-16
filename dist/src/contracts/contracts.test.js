import test from "node:test";
import assert from "node:assert/strict";
import { familyFixture } from "./fixture.js";
import { AdaptationPackageSchema, CostSchema, RevisionRefsSchema, ResolvedTimelineSchema, ShotSchema, } from "./index.js";
test("original fixture strictly separates facts and proposed US changes", () => {
    assert.equal(AdaptationPackageSchema.parse(familyFixture).project.evidence, "fixture");
    assert.throws(() => AdaptationPackageSchema.parse({ ...familyFixture, extra: "shell" }));
});
test("unknown money differs from explicit zero mock cost", () => {
    assert.deepEqual(CostSchema.parse({ basis: "unknown" }), {
        basis: "unknown",
    });
    assert.throws(() => CostSchema.parse({ basis: "unknown", amount_micros: 0 }));
});
test("reject duplicate revisions, overlapping frames and reversed source interval", () => {
    assert.throws(() => RevisionRefsSchema.parse([
        { kind: "line", id: "l1", revision: 1 },
        { kind: "line", id: "l1", revision: 2 },
    ]));
    assert.throws(() => ResolvedTimelineSchema.parse({
        fps_num: 24,
        fps_den: 1,
        segments: [
            { shot_id: "s1", artifact_id: "v1", in_frame: 1, out_frame: 10 },
        ],
    }));
    assert.throws(() => ShotSchema.parse({ ...familyFixture.shots[0], source_out_ms: 0 }));
});
import { validateAdaptation } from "./validate.js";
test("cross-object validation rejects invented speaker and wrong revision kinds", () => {
    validateAdaptation(familyFixture);
    const p = structuredClone(familyFixture);
    p.lines[0].speaker_character_id = "invented";
    assert.throws(() => validateAdaptation(p));
    const q = structuredClone(familyFixture);
    q.plans[0].setting_revision.kind = "character";
    assert.throws(() => validateAdaptation(q));
});
