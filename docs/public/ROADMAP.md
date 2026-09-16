# 开发路线图与任务

更新：2026-09-17。**v0.3是新链路的产品方案版本；当前公开软件仍为0.2.0工程预览，运行契约0.2.1，DSH固定0.1.5-rc.2。** 下列新增功能均未宣布实现；建立Issue不等于开始运行或验收通过。

## 下一里程碑

[v0.3 · 新链路离线闭环](https://github.com/tanweiping1012-source/DramaPilot/milestone/1)

用完全自编的数据和本地fixture走通：

**人工辅助源资产包 → 目标文化改编与独立分镜 → 本地2D白模预演及对白时长 → 制作包冻结 → mock逐镜头制作 → 合成审阅 → 一次局部修改 → 最终确认与本地导出。**

视频理解先采用明确标注的assisted ingest：导入现有剧本/SRT、人工镜头与角色/场景标注。模型自动识片与自动逆向三维不属于本里程碑的完成证明。首版预演用简化人物/场景和动作时间线，不使用当前色块片冒充白模。

## 任务与依赖

| GitHub任务 | 交付 | 责任角色 | 前置依赖 | 状态 |
|---|---|---|---|---|
| [DP-N1 · #1](https://github.com/tanweiping1012-source/DramaPilot/issues/1) | 新工作流契约草案与0.2.1迁移边界 | A + Owner | 可先开始契约评审 | planned / ready |
| [DP-N2 · #2](https://github.com/tanweiping1012-source/DramaPilot/issues/2) | 人工辅助导入源资产包与可定位证据 | A | [DP-N1](https://github.com/tanweiping1012-source/DramaPilot/issues/1) | planned；待前置实现 |
| [DP-N3 · #3](https://github.com/tanweiping1012-source/DramaPilot/issues/3) | 目标文化改编与独立目标分镜 | A | [DP-N1](https://github.com/tanweiping1012-source/DramaPilot/issues/1)、[DP-N2](https://github.com/tanweiping1012-source/DramaPilot/issues/2) | planned；待前置实现 |
| [DP-N4 · #4](https://github.com/tanweiping1012-source/DramaPilot/issues/4) | 本地2D白模预演与目标对白时长检查 | B | [DP-N1](https://github.com/tanweiping1012-source/DramaPilot/issues/1)、[DP-N2](https://github.com/tanweiping1012-source/DramaPilot/issues/2)、[DP-N3](https://github.com/tanweiping1012-source/DramaPilot/issues/3) | planned；可先准备自编样例 |
| [DP-N5 · #5](https://github.com/tanweiping1012-source/DramaPilot/issues/5) | 制作包冻结、可信确认与依赖失效 | A + Owner | [DP-N1](https://github.com/tanweiping1012-source/DramaPilot/issues/1)、[DP-N3](https://github.com/tanweiping1012-source/DramaPilot/issues/3) | planned；待前置实现 |
| [DP-N6 · #6](https://github.com/tanweiping1012-source/DramaPilot/issues/6) | DSH新链路阶段编排与审阅交互 | A | [DP-N2](https://github.com/tanweiping1012-source/DramaPilot/issues/2)、[DP-N3](https://github.com/tanweiping1012-source/DramaPilot/issues/3)、[DP-N4](https://github.com/tanweiping1012-source/DramaPilot/issues/4)、[DP-N5](https://github.com/tanweiping1012-source/DramaPilot/issues/5) | planned；待前置实现 |
| [DP-N7 · #7](https://github.com/tanweiping1012-source/DramaPilot/issues/7) | 独立验收新链路与旧工程回归 | C | [DP-N1](https://github.com/tanweiping1012-source/DramaPilot/issues/1)、[DP-N2](https://github.com/tanweiping1012-source/DramaPilot/issues/2)、[DP-N3](https://github.com/tanweiping1012-source/DramaPilot/issues/3)、[DP-N4](https://github.com/tanweiping1012-source/DramaPilot/issues/4)、[DP-N5](https://github.com/tanweiping1012-source/DramaPilot/issues/5)、[DP-N6](https://github.com/tanweiping1012-source/DramaPilot/issues/6)、[DP-N9](https://github.com/tanweiping1012-source/DramaPilot/issues/8) | planned；可先准备验收，执行待集成 |
| [DP-N8 · #9](https://github.com/tanweiping1012-source/DramaPilot/issues/9) | 真实素材三镜头验证与自动白模研究 | B + Owner | [DP-N7](https://github.com/tanweiping1012-source/DramaPilot/issues/7) | not_started；待素材/预算 |
| [DP-N9 · #8](https://github.com/tanweiping1012-source/DramaPilot/issues/8) | 最终成片确认与本地交付包 | A + Owner | [DP-N5](https://github.com/tanweiping1012-source/DramaPilot/issues/5)、[DP-N6](https://github.com/tanweiping1012-source/DramaPilot/issues/6) | planned；待前置实现 |

DP-N5在某镜头需要白模时，还需DP-N4提供对应的有效预演；不需要时写出跳过理由。DP-N7现在可以准备测试，正式独立验收等待N9在内的固定集成提交，所以N9不反向依赖N7。DP-N8不放入无收费里程碑；它包含后续待拆分的真实能力实验，而非当前收费执行单。

每个Issue包含当前差距、交付范围、可检查的完成标准和禁止虚报的反例。任务编号DP-N与GitHub Issue编号分别保留，以表格映射为准。责任角色表示开发分工；实际执行状态会随提交和验收证据更新。

## Owner接下来要做什么

1. 组织A的独立契约草案评审，B给预演/声音/媒体约束，C给迁移与权限反例；冻结明确版本和提交后再接入运行代码。
2. 按源资产、目标分镜、预演和确认的依赖集成，维护任务状态及阻塞；源事实不被目标改写覆盖。
3. 给C固定集成提交与完整有效样例，核对独立结果、0.2.1兼容、恢复和局部修复。
4. 发布经验证的新工程包和演示，继续公开实际能力与未验证项；代码变化前不把本次文档更新伪装为新软件Release。
5. 后续取得真实素材/费用范围后，重新报价并组织三镜头实验、20–40秒三层场景与一次修复。DSH市场提交前单独复核安装、规则和展示证据；市场收录与推广不算本次已完成事项。

A负责核心/契约/DSH及根依赖，B负责媒体/provider，C负责独立验收。开发团队分工与产品是否运行DSH子agent分别记证据。

## 里程碑怎样算完成

- 源文件与证据可定位，事实、推断、重建、创作者输入来源明确；目标新增对白不会写回原片。
- 独立目标镜头支持拆镜、合镜、新增，并校验故事节拍、角色、场景和对白引用。
- 至少一个自编动作镜头有本地2D预演与时长检查；明确源/目标用途，不能进入正式镜头合成。
- 可信主机的前置确认绑定阶段输入/计划hash，正式制作确认绑定完整制作包hash和范围，模型不能自批；对白或场景变动引起正确依赖失效，保留无关镜头与旧历史。
- 在固定DSH实际工具接口运行mock流程，完成一次局部修改、恢复及确认导出；这不代表真实LLM自主创作。
- C按固定提交验收正反例，公开pass/fail/not_run/blocked及输入/产物hash；fixture真实质量保持未验证。

## 后续真实阶段

获准源素材、目标受众/选角、供应商和额度后，先做三镜头能力验证，再决定真实小场景。源白模/自动3D只在需要的镜头研究，保留人工预演路径；不以自动3D为所有镜头的硬前置。两名目标角色视觉、美式英语/口型、文化动作/场景一致性和局部修复分别验收。

前置理解、参考图、声音试读、白模等若发生收费，需在首次调用前确认其阶段额度，不能到正式视频制作才开始计账。[历史成本方案](COST_PLAN.md)尚未覆盖这条新链路的全部成本。

## 已有基线

0.2.0工程预览已提供结构化改编、可信fixture模拟任务、持久预算/恢复、测试片合成、HTML审阅及真实DSH工具协议检查。[验证记录](VALIDATION.md)限定了这些结论的范围。0.3方案所需的数据与交互新增不因复用这些组件而自动完成。

相关文档：[新链路](WORKFLOW.md) · [架构增量](ARCHITECTURE.md) · [研究](RESEARCH.md) · [当前运行方式](RUNNING.md)
