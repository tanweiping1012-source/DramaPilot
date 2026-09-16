import test from "node:test";
import assert from "node:assert/strict";
import { familyFixture } from "./fixture.js";
import { currentRevisions, validateEpisode } from "./validate.js";
function episode() {
    const refs = currentRevisions(familyFixture);
    const assets = familyFixture.plans.map((plan, i) => ({
        artifact_id: `v${i}`,
        kind: "video",
        uri: `/tmp/v${i}`,
        sha256: "0".repeat(64),
        evidence: "fixture",
        input_revisions: refs.filter((r) => r.kind !== "shot" || r.id === plan.shot_id),
        operation_id: `o${i}`,
        media_type: "video/mp4",
        duration_ms: 2000,
        probe: {
            fps_num: 25,
            fps_den: 1,
            frame_count: 50,
            width: 640,
            height: 360,
        },
        expires_at: null,
    }));
    return {
        revision: 1,
        shot_assets: assets,
        dialogue_stems: [],
        me_stems: [],
        subtitles: [],
        input_revisions: refs,
        resolved_timeline: {
            fps_num: 25,
            fps_den: 1,
            segments: assets.map((a, i) => ({
                shot_id: `s${i + 1}`,
                artifact_id: a.artifact_id,
                in_frame: i * 50,
                out_frame: (i + 1) * 50,
            })),
        },
        qa_report: {
            evidence: "fixture",
            technical: "pass",
            visual: "unverified",
            language: "unverified",
            culture: "unverified",
            issues: [],
        },
    };
}
test("C-001 missing character/line dependency rejected", () => {
    const e = episode();
    validateEpisode(e, familyFixture);
    e.shot_assets[0].input_revisions = e.shot_assets[0].input_revisions.filter((r) => r.kind !== "character");
    assert.throws(() => validateEpisode(e, familyFixture), /Missing\/stale/);
});
test("C-002 empty episode cannot pass coverage", () => {
    const e = episode();
    e.shot_assets = [];
    e.input_revisions = [];
    e.resolved_timeline.segments = [];
    assert.throws(() => validateEpisode(e, familyFixture), /Incomplete/);
});
test("C-003 mock/fixture quality cannot turn green even if report says live", () => {
    const e = episode();
    e.qa_report.visual = "pass";
    assert.throws(() => validateEpisode(e, familyFixture), /Synthetic/);
    e.qa_report.evidence = "live";
    assert.throws(() => validateEpisode(e, familyFixture), /Synthetic/);
});
test("source media bounds enforced in integer frame units", () => {
    const e = episode();
    e.shot_assets[0].probe.frame_count = 49;
    assert.throws(() => validateEpisode(e, familyFixture), /exceeds/);
});
