import {
  WORKFLOW_DRAFT_VERSION as version, revisionRef as ref, workflowHash,
  validateSourceAssetPackage, validateTargetStoryboard, validatePrevisArtifact,
  validateProductionPackage, validateUntrustedConfirmation, StagePlanSchema,
  type PrevisArtifact,
} from "./workflow-draft.js";

/** Authored metadata only: no video, reference image, speech or previs is rendered. */
export function makeWorkflowDraftFixture() {
  const evidenceHash = workflowHash({ synthetic: "family story metadata; no source media file" });
  const script = "成年家族成员在门前阻拦姻亲，姻亲受到排斥后决定反抗。";
  const source = validateSourceAssetPackage({
    kind: "source_package", id: "source-family", revision: 1, contract_version: version,
    source_locale: "zh-CN",
    assets: [
      { kind: "source_asset", id: "source-video", revision: 1, media_kind: "video", uri: "fixture-metadata://not-rendered/source-video", sha256: evidenceHash, duration_ms: 12000, frame_count: 300, char_count: null, evidence: "fixture" },
      { kind: "source_asset", id: "source-script", revision: 1, media_kind: "script", uri: "fixture-metadata://authored/script", sha256: workflowHash(script), duration_ms: null, frame_count: null, char_count: script.length, evidence: "fixture" },
    ],
    evidence: [
      { kind: "source_evidence", id: "source-observation", revision: 1, source_asset_id: "source-video", source_asset_sha256: evidenceHash, locator: { kind: "time", start_ms: 0, end_ms: 12000 }, statement: "自编测试故事：家族掌权者阻拦姻亲。并非视频识别结果。", epistemic_status: "observed", evidence: "fixture", method: "authored_fixture", uncertainties: ["视频不存在；这里只验证元数据结构"] },
      { kind: "source_evidence", id: "source-text", revision: 1, source_asset_id: "source-script", source_asset_sha256: workflowHash(script), locator: { kind: "text", start_char: 0, end_char_exclusive: script.length }, statement: script, epistemic_status: "observed", evidence: "fixture", method: "authored_fixture", uncertainties: [] },
    ],
    characters: [
      { kind: "source_character", id: "elder", revision: 1, description: "成年家族掌权者", evidence_ids: ["source-text"] },
      { kind: "source_character", id: "outsider", revision: 1, description: "成年姻亲", evidence_ids: ["source-text"] },
    ],
    relations: [{ kind: "source_relation", id: "family-power", revision: 1, from_character_id: "elder", to_character_id: "outsider", description: "家族内部排斥", evidence_ids: ["source-text"] }],
    dialogue: [
      { kind: "source_dialogue", id: "d1", revision: 1, speaker_character_id: "elder", text: "你没有资格进这个门。", evidence_ids: ["source-observation"] },
      { kind: "source_dialogue", id: "d2", revision: 1, speaker_character_id: "outsider", text: "那我就自己闯出一片天地。", evidence_ids: ["source-observation"] },
    ],
    scenes: [{ kind: "source_scene", id: "hall", revision: 1, description: "宗祠门口", evidence_ids: ["source-observation"] }],
    props: [{ kind: "source_prop", id: "door", revision: 1, description: "象征家族边界的门", evidence_ids: ["source-observation"] }],
    beats: [{ kind: "source_beat", id: "exclusion", revision: 1, description: "被排斥并产生反抗动机", required: true, source_shot_ids: ["s1", "s2", "s3"], evidence_ids: ["source-text"] }],
    storyboard: { kind: "source_storyboard", id: "source-board", revision: 1, shots: [0, 1, 2].map(i => ({
      kind: "source_shot", id: `s${i + 1}`, revision: 1, source_asset_id: "source-video", source_asset_sha256: evidenceHash,
      source_in_ms: i * 4000, source_out_ms: (i + 1) * 4000, character_ids: ["elder", "outsider"], dialogue_ids: [i === 2 ? "d2" : "d1"], scene_id: "hall", prop_ids: ["door"], action: "阻拦、受辱与反抗", evidence_ids: ["source-observation"],
    })) },
    unknowns: ["全部为自编元数据，未读取任何真实短剧"],
  });
  const characters = [
    { kind: "target_character" as const, id: "host", revision: 1, source_character_ids: ["elder"], design: "虚构成年家族主人，晚宴正装", rationale: "保留掌权者功能" },
    { kind: "target_character" as const, id: "guest", revision: 1, source_character_ids: ["outsider"], design: "虚构成年姻亲，晚宴正装", rationale: "保留被排斥者功能" },
  ];
  const scene = { kind: "target_scene" as const, id: "dinner", revision: 1, source_scene_ids: ["hall"], design: "家族私人晚宴", rationale: "以座位资格表达家族排斥" };
  const prop = { kind: "target_prop" as const, id: "chair", revision: 1, source_prop_ids: ["door"], design: "被收走的餐椅", rationale: "阻拦入席" };
  const line = { kind: "target_line" as const, id: "l1", revision: 1, source_dialogue_ids: ["d1"], speaker_character_id: "host", text: "That doesn't give you a seat at this table.", rationale: "保留排斥含义" };
  const target = validateTargetStoryboard({
    kind: "target_storyboard", id: "us-board", revision: 1, contract_version: version, source_ref: ref(source), locale: "en-US",
    audience_brief: "当代家庭冲突的测试受众，尚未访谈", cultural_decisions: ["宗祠门口排斥改为家族晚宴席位排斥"], characters, scenes: [scene], props: [prop], lines: [line],
    shots: [["s1"], ["s1"], ["s2", "s3"], []].map((mapping, i) => ({
      kind: "target_shot", id: `t${i + 1}`, revision: 1, source_shot_ids: mapping,
      creative_rationale: i === 3 ? "新增姻亲反应近景以强化反抗动机" : i < 2 ? "把阻拦长镜头拆为全景与近景" : "合并两个反应镜头", preserved_beat_ids: ["exclusion"],
      character_refs: characters.map(ref), scene_ref: ref(scene), prop_refs: [ref(prop)], line_refs: i === 0 ? [ref(line)] : [], action: i === 0 ? "主人移开椅子，客人停下" : "角色反应", duration_ms: 4000, route: "regenerate", audio_mode: i === 0 ? "separate_audio" : "silent", overlapping_dialogue: "forbidden",
    })), omitted_beat_decisions: [], unknowns: ["角色图、真实英语与文化质量未验证"],
  }, source);
  const targetPrevis = target.shots.map(shot => validatePrevisArtifact({
    kind: "previs", id: `previs-${shot.id}`, revision: 1, contract_version: version, domain: "target", shot_refs: [ref(shot)],
    input_refs: [ref(shot), ...shot.character_refs, shot.scene_ref, ...shot.prop_refs, ...shot.line_refs], uncertainties: ["未渲染的自编2D动作计划"],
    ...(shot.id === "t1" ? {
      status: "planned", output: null, dimension: "2D", method: "fixture", evidence: "fixture", coordinate_system: "normalized_screen", duration_ms: 4000, fps_num: 25, fps_den: 1, frame_count: 100,
      entity_tracks: [
        { entity_ref: ref(characters[0]!), keyframes: [{ at_ms: 0, x: 0.7, y: 0.5, action: "站在椅旁" }, { at_ms: 2000, x: 0.6, y: 0.5, action: "移开椅子" }] },
        { entity_ref: ref(characters[1]!), keyframes: [{ at_ms: 0, x: 0.2, y: 0.5, action: "接近餐桌" }, { at_ms: 2000, x: 0.4, y: 0.5, action: "停步" }] },
        { entity_ref: ref(prop), keyframes: [{ at_ms: 0, x: 0.55, y: 0.7, action: "椅子在桌旁" }, { at_ms: 2000, x: 0.8, y: 0.7, action: "椅子被移开" }] },
      ], camera_keyframes: [{ at_ms: 0, framing: "双人中景", movement: "固定机位" }],
      dialogue_timing: [{ line_ref: ref(line), start_ms: 0, read_duration_ms: 3200, method: "test_fixture", evidence: "fixture", audio_sha256: null, assessment: "fits" }],
      overlapping_dialogue: "forbidden", capabilities: { motion: "present", camera: "present", depth: "unknown" },
    } : { status: "skipped", reason: "本契约样例的简单反应镜头不制作预演，未做质量验证" }),
  }, { source, target }));
  const shot = source.storyboard.shots[0]!;
  const sourcePrevis = validatePrevisArtifact({
    kind: "previs", id: "previs-source-s1", revision: 1, contract_version: version, domain: "source", shot_refs: [ref(shot)],
    input_refs: [ref(shot), ref(source.assets[0]!), ...source.characters.map(ref), ...source.scenes.map(ref), ...source.props.map(ref), ref(source.evidence[0]!)],
    uncertainties: ["没有真实源视频，不声称完成逆向"], status: "skipped", reason: "自编元数据不存在可逆向的源视频",
  }, { source, target });
  const previs: PrevisArtifact[] = [sourcePrevis, ...targetPrevis];
  const production = validateProductionPackage({
    kind: "production_package", id: "family-rehearsal", revision: 1, contract_version: version, source_ref: ref(source), target_ref: ref(target), purpose: "offline_rehearsal", previs_refs: previs.map(ref), audio: [], dialogue_timing: [], delivery: { aspect_ratio: "9:16", fps_num: 25, fps_den: 1 }, unresolved_items: ["未生成角色/场景参考图、白模、配音或视频；不可执行正式制作"],
  }, { source, target, previs });
  const stagePlan = StagePlanSchema.parse({
    kind: "stage_plan", id: "previs-plan", revision: 1, contract_version: version, stage: "previs", input_refs: [ref(target)], source_asset_hashes: source.assets.map(a => a.sha256), actions: ["本地验证预演元数据"], provider: "offline-metadata-only", external_upload: false, budget: { currency: "USD", max_amount_micros: 0 },
  });
  const common = { contract_version: version, authority: "untrusted_record", status: "confirmed", asserted_by: "fixture-creator", asserted_at: "2026-09-17T00:00:00Z", provider: stagePlan.provider, source_asset_hashes: stagePlan.source_asset_hashes, external_upload: false, budget: stagePlan.budget, repair_scope: ["metadata only"] };
  const stageConfirmation = validateUntrustedConfirmation({ ...common, id: "stage-confirmation", scope: "preproduction_stage", stage: "previs", stage_plan_ref: ref(stagePlan), stage_input_sha256: workflowHash(stagePlan.input_refs) }, { stagePlan });
  const productionConfirmation = validateUntrustedConfirmation({ ...common, id: "production-confirmation", scope: "production", production_package_ref: ref(production) }, { productionPackage: production });
  return { source, target, previs, production, stagePlan, stageConfirmation, productionConfirmation };
}
