# 新工作流契约：可运行的 draft

这个模块把新链路中的资产、镜头、预演和确认记录变成可检查的数据。它是 `0.3.0-draft.1` 实验契约，独立于现有 `0.2.1` 运行契约；软件包与既有工程预览 Release 仍为0.2.0。

该实验模块随仓库最新源码提供；旧 `v0.2.0-engineering.1` Release 下载包不包含它，本次不覆盖旧包。

## 先运行一个例子

```bash
npm ci --ignore-scripts
npm test
npm run demo:workflow
```

命令打印输出目录，包含 `fixture.json` 和 `summary.json`。默认每次创建新目录；也可以指定尚不存在的目录：

```bash
npm run demo:workflow -- .runtime/my-workflow-draft
```

例子完全自编，只验证元数据，不识别视频、不生成图片/配音/白模、不提交供应商任务。源文件URI使用 `fixture-metadata://`，其中的hash是说明性元数据，不能作真实媒体已存在的证据。输出固定包含 `execution_authorized: false` 和 `media_rendered: false`。

| 目标镜头 | 来源 | 改编的含义 |
|---|---|---|
| t1 | s1 | 原长镜头的第一段：主人移开椅子 |
| t2 | s1 | 拆出的第二段近景 |
| t3 | s2 + s3 | 合并两个反应镜头 |
| t4 | 无直接源画面 | 有叙事依据和理由的新反应镜头，不编造源时间戳 |

目标t1有一个**尚未渲染的2D预演计划**，描述人物和椅子的位置、动作、机位及测试对白时长；其他镜头明确记录跳过原因。源白模也记录为跳过，因为这个文字样例没有真实视频可以逆向。输出不是白模成片。

## 数据和校验入口

实验模块通过 `dramapilot/workflow-draft` 导出，自编例子通过 `dramapilot/workflow-fixture` 导出。当前只支持下表范围；draft未来仍可能调整，不应把它当作已冻结的生产接口。

| 入口 | 检查什么 |
|---|---|
| `validateSourceAssetPackage(input)` | 源资产、时间/帧/字符定位、hash引用、人物/对白/关系/场景/道具/节拍及源镜头；区分观察、推断、重建与fixture等执行来源 |
| `validateTargetStoryboard(input, source)` | 独立目标ID、拆/合/新增映射、故事节拍覆盖、角色/场景/道具/对白的确切引用 |
| `validatePrevisArtifact(input, {source, target})` | source/target用途、planned/rendered/skipped状态、具体输入依赖、2D站位/动作/机位、帧数时长及试读时长；源预演无需目标包，当前限定单源镜头同长 |
| `validateProductionPackage(input, {source, target, previs})` | 内容快照与预演引用；每镜有预演或跳过说明；制作包独立保存每镜对白时长并检查重叠意图；正式候选不接受尚未渲染预演或缺失时长 |
| `validateUntrustedConfirmation(input, context)` | 前置阶段绑定其输入/计划hash，正式制作记录绑定制作包hash；确认记录始终不可信，不产生执行授权 |
| `revisionRef` / `workflowHash` | 类型、ID、revision与内容hash绑定；拒绝不能无损表示为JSON的输入 |
| `assertImmutableRevision(before, after)` | 同类型/ID/revision不能变内容，revision不能回退；更高版本是新候选，不等于已批准 |
| `auditLegacyMigration(legacy)` | 对0.2.1做纯读取审计，报告缺项、不能无损转换的原因和原始hash；不修改旧账本 |
| `assertLegacyShotMappingCompatible(target, source)` | 拒绝把拆镜、合镜、新增或重排镜头静默降级成旧版一对一计划 |

所有schema拒绝未声明字段。结构校验能检查记录是否自洽，**不能核实文件真的存在、演员身份是否识别正确、文化改编是否自然或用户确实做过确认**。实际本地文件由独立[人工辅助导入模块](ASSISTED_INGEST.md)核对；可信host授权与内容人工审阅仍是另外的工作。

## 三个容易混淆的边界

目标镜头用 `overlapping_dialogue` 声明对白是否有意重叠；默认样例为 `forbidden`。即使跳过视觉预演，两句试读分别放得下也不能未经声明同时播放。预演的重叠策略必须与目标镜头一致。

1. **元数据通过不等于媒体通过。** `planned`预演没有输出文件；即使提供`rendered`记录，当前校验也只检查元数据和引用，媒体文件读取/probe仍待DP-N4接入。当前draft只接受2D结构，2.5D/3D尚未建模。
2. **确认记录不等于执行凭据。** 即使状态是`confirmed`，`authority`仍必须是`untrusted_record`。模块不创建host grant、不调用供应商；前置记录不能作为正式制作记录使用。真实权限和费用执行属于DP-N5。
3. **内容快照不等于自动重做。** 预演绑定实际引用的镜头、角色、场景和对白；无关目标镜头变动可保持有效。持久保存、变更传播、局部重做及DSH阶段工具仍待后续任务实现。

`offline_rehearsal`制作包可用尚未渲染的预演来讨论计划；`production_candidate`拒绝这些计划及合成测试预演，即使跳过视觉预演也必须有对白试读，并检查原生音频驱动的正式音轨、试读与预演所引用的音轨hash/时长一致。两种包都只是数据，均不代表已经完成真实素材授权、角色/场景图制作、媒体核验、质量审阅或费用放行。

## 旧数据怎样处理

现有0.2.1契约、provider接口、工具和恢复账本保持原行为。迁移审计给旧镜头列出候选对应关系，但目标ID保持未指定，明确列出源定位证据、源对白、场景/道具、独立目标分镜、白模与确认等缺项，不补造资产。旧`approved`记录不会变成新执行权限。

DP-N2已提供本地文件与人工剧本/SRT/镜头资料导入；下一步DP-N3接入独立目标分镜的保存和制作请求；DP-N4才渲染预演。自动识片、真实生成和自动3D仍为后续范围。

参见[完整工作流](WORKFLOW.md)、[路线图](ROADMAP.md)及[工程验证](VALIDATION.md)。
