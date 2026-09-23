/** Authored story + existing synthetic color/tone clip. No recognition or generation API. */
import { mkdir, realpath, stat, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { importAssistedSource } from "../src/ingest/assisted.js";
const workspaceRoot = await realpath(process.cwd());
const video = await realpath(resolve(process.argv[2] ?? ".runtime/color-fixture/fixture-only.mp4"));
const videoRelative = relative(workspaceRoot, video);
if (isAbsolute(videoRelative) || videoRelative === ".." || videoRelative.startsWith("../") || !(await stat(video)).isFile()) {
    throw new Error("Demo input must be a local fixture video inside this workspace");
}
const runDir = resolve(process.argv[3] ?? `.runtime/ingest-demo-${Date.now()}`);
const runRelative = relative(workspaceRoot, runDir);
if (isAbsolute(runRelative) || runRelative === ".." || runRelative.startsWith("../"))
    throw new Error("Demo output must stay inside workspace");
await mkdir(resolve(runDir, ".."), { recursive: true });
await mkdir(runDir, { recursive: false });
const script = [
    "FIXTURE ONLY · 自编文字故事，视频只有色块和测试音，没有人物或配音。",
    "人物：成年家族掌权者、成年姻亲。场景：宗祠门口。道具：门。",
    "掌权者：你没有资格进这个门。",
    "姻亲：那我就自己闯出一片天地。",
    "故事核心：受到排斥，产生反抗动机。人物关系须由创作者复核。",
].join("\n");
const subtitles = "1\n00:00:00,200 --> 00:00:01,700\n你没有资格进这个门。\n\n2\n00:00:05,100 --> 00:00:06,700\n那我就自己闯出一片天地。\n";
await writeFile(resolve(runDir, "script.txt"), script);
await writeFile(resolve(runDir, "source.srt"), subtitles);
const evidence = (id, text, inferred = false) => {
    const start = script.indexOf(text);
    if (start < 0)
        throw new Error("Demo evidence excerpt missing");
    return { kind: "source_evidence", id, revision: 1, source_asset_id: "script", locator: { kind: "text", start_char: start, end_char_exclusive: start + text.length }, statement: text, epistemic_status: inferred ? "inferred" : "observed", evidence: "fixture", method: "authored_fixture", uncertainties: inferred ? ["人物关系仅为自编候选，待创作者确认，未从视频识别"] : [] };
};
const e = [evidence("people", "人物：成年家族掌权者、成年姻亲。场景：宗祠门口。道具：门。"), evidence("line1", "你没有资格进这个门。"), evidence("line2", "那我就自己闯出一片天地。"), evidence("story", "故事核心：受到排斥，产生反抗动机。人物关系须由创作者复核。", true)];
const manifest = {
    ingest_manifest_version: "0.1.0",
    source_package: { id: "source-family-import", revision: 1, source_locale: "zh-CN" },
    assets: [
        { id: "video", revision: 1, path: videoRelative, media_kind: "video", evidence: "fixture" },
        { id: "script", revision: 1, path: relative(workspaceRoot, resolve(runDir, "script.txt")), media_kind: "script", evidence: "fixture" },
        { id: "subtitles", revision: 1, path: relative(workspaceRoot, resolve(runDir, "source.srt")), media_kind: "subtitles", evidence: "fixture", video_asset_id: "video" },
    ],
    annotations: {
        evidence: e,
        characters: [
            { kind: "source_character", id: "elder", revision: 1, description: "自编成年掌权者；未在色块视频识别人脸", evidence_ids: ["people"] },
            { kind: "source_character", id: "outsider", revision: 1, description: "自编成年姻亲；未在色块视频识别人脸", evidence_ids: ["people"] },
        ],
        relations: [{ kind: "source_relation", id: "power", revision: 1, from_character_id: "elder", to_character_id: "outsider", description: "候选家族权力关系，待确认", evidence_ids: ["story"] }],
        dialogue: [
            { kind: "source_dialogue", id: "d1", revision: 1, speaker_character_id: "elder", text: "你没有资格进这个门。", evidence_ids: ["line1"] },
            { kind: "source_dialogue", id: "d2", revision: 1, speaker_character_id: "outsider", text: "那我就自己闯出一片天地。", evidence_ids: ["line2"] },
        ],
        scenes: [{ kind: "source_scene", id: "hall", revision: 1, description: "自编宗祠门口；色块视频不展示此场景", evidence_ids: ["people"] }],
        props: [{ kind: "source_prop", id: "door", revision: 1, description: "自编场景的门", evidence_ids: ["people"] }],
        beats: [{ kind: "source_beat", id: "exclusion", revision: 1, description: "排斥引起反抗动机", required: true, source_shot_ids: ["s1", "s2", "s3"], evidence_ids: ["story"] }],
        storyboard: { kind: "source_storyboard", id: "source-board", revision: 1, shots: [[0, 2000], [2000, 5000], [5000, 7000]].map(([start, end], i) => ({ kind: "source_shot", id: `s${i + 1}`, revision: 1, source_asset_id: "video", source_in_ms: start, source_out_ms: end, character_ids: ["elder", "outsider"], dialogue_ids: i === 0 ? ["d1"] : i === 2 ? ["d2"] : [], scene_id: "hall", prop_ids: ["door"], action: `测试片第${i + 1}段；剧情来自文字标注，视频仅色块`, evidence_ids: ["story"] })) },
        unknowns: ["视频仅含色块与测试音，全部剧情/人物/台词为人工自编输入", "未运行ASR或视觉模型，角色关系与故事动机未验证", "字幕不是已配音证据，目标改编尚未开始"],
    },
    preparation: { declared_minutes: null, notes: "工程fixture由脚本写入；未测量创作者准备时间" },
};
const manifestPath = resolve(runDir, "input-manifest.json");
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const result = await importAssistedSource({ manifest, workspaceRoot, outputDir: resolve(runDir, "imported") });
console.log(JSON.stringify({ manifestPath, outputDir: result.outputDir, packagePath: result.packagePath, reportPath: result.reportPath, receiptPath: result.receiptPath, evidence: "fixture", automatic_recognition: false, paid_calls: 0 }, null, 2));
