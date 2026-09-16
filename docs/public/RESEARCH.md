# 研究与选型记录

研究对象：已有中文真人/AI 短剧的角色视觉、语言表演和文化改编。首个目标为美国、美式英语。

商业及开源资料核查于 **2026-09-14**；成本另于 **2026-09-15** 查询官方报价。下文是官方文档研究与据此提出的工程判断，没有对商业产品做付费实测，没有下载或运行开源模型。版本、权限、时长限制和许可在真实集成前需要复核。

## 1. 怎么定义竞争关系

直接参照是完整的视频本地化制作流程：改编、选角、译配、口型、视效、合成和审阅。软件市场里的相关能力分布在多个产品中。

- **影视视觉译配**关心保留原演员和表演。它与重新选角解决的问题不同。
- **多语言译配**关心声音、翻译和口型。是否能执行创作者批准的改稿，需要单独核对。
- **生成式视频编辑**能研究改人物、衣服、道具或环境，但没有因此自动理解故事的文化背景。
- **参考角色生成**适合重新演绎镜头；不等于保留原片所有动作。
- 自动切片、广告素材和字幕工具是外围参考，不覆盖本项目三项核心目标。

## 2. 九家商业产品

| 产品 | 文档确认的方向 | 关键限制/未知 | 对项目的影响 |
|---|---|---|---|
| [Flawless TrueSync / DeepEditor](https://flawlessai.com/localization-and-dubbing) | 视觉译配和表演/对白编辑；TrueSync 保留演员身份，接收目标配音 | 本轮未确认公开自助生产 API；不能把保留身份的译配当换角色 | 参考专业表演和精修标准，暂不作为已可接入组件 |
| [Deepdub](https://docs.deepdub.ai/quickstart) | 公开 TTS API 和声音表达 | 完整视频译配、角色替换与账号权限未核实 | 声音供应候选；产品主页模型名称不能直接当 API 型号 |
| [HeyGen Translation](https://developers.heygen.com/reference/create-proofread-session) | 译配与口型；[校订 SRT](https://developers.heygen.com/reference/upload-proofread-srt)可用于控制改稿 | 工作台功能不等于同名 API 权限；同屏多人和跨镜头追踪未实测 | 测试已批准台词是否被严格执行，再评估整合 |
| [Rask](https://docs.api.rask.ai/workflow/speakers) | 说话人/声音编辑、重新译配及[口型流程](https://docs.api.rask.ai/workflow/lipsync) | 多个声音不等于多个同屏人物同时说话可用；商业开通条件需确认 | 作为可编辑译配基线研究 |
| [ElevenLabs Dubbing](https://elevenlabs.io/dubbing-api) | Dubbing v2 Alpha 与多语言音频；部分编辑/再生能力有 Enterprise 限制 | 网页旧版 Studio 和 v2 API 不应混用；[Dubbing 本身不做口型](https://elevenlabs.io/docs/help-center/product/dubbing/do-you-offer-lip-sync-in-dubbing) | 若必须执行固定改稿，需核实权限或考虑按批准文本 TTS |
| [Runway Aleph 2](https://docs.dev.runwayml.com/guides/models/) | 已有视频的主体、服装和环境编辑 | 多人身份隔离、原动作保真、跨镜头连续性未实测 | 原镜头编辑路线候选 |
| [Luma Ray 3.2](https://docs.agents.lumalabs.ai/guides/videos/editing/) | 源视频与引导关键帧驱动的编辑 API | 旧版 Ray3 工作台控件不能照搬成新版 API；译配需独立实现 | 原镜头编辑的另一候选，先做同输入对比 |
| [Vidu](https://platform.vidu.com/docs/introduction) | 参考角色生成、独立[口型 API](https://platform.vidu.com/docs/lip-sync) | 参考生成不是无损编辑；口型每次选择一张脸，参考脸用于定位而非换脸 | 更适合重新演绎镜头的候选 |
| [Sync](https://sync.so/docs/developer-guides/segments) | 目标音轨驱动口型，按片段指定音轨和说话人 | 不负责翻译或文化判断；遮挡、侧脸与多脸选择需实测 | 声音与视觉分开制作时的口型候选 |

没有公开证据，不等于产品没有该能力；“公开 API 存在”也不等于当前账号已获得使用权限。本项目尚未验证任何一套供应商组合能完成目标场景。

## 3. 七组开源项目

| 项目 | 可以研究什么 | 为什么没有直接作为首版依赖 |
|---|---|---|
| [Wan2.2 Animate](https://github.com/Wan-Video/Wan2.2#run-wan-animate) / [Wan-Animate-2](https://github.com/Wan-Video/Wan-Animate-2) | 人物动作与表演迁移、部分角色替换路线 | 旧版预处理有单人限制；新旧版输入与资源要求不能混用，需要逐镜头 GPU 验证 |
| [LatentSync](https://github.com/bytedance/LatentSync) | 已有视频加目标音频的口型编辑 | 需要人物路由、CUDA 环境与权重/附加检测器许可核查 |
| [MuseTalk](https://github.com/TMElyralab/MuseTalk) | 局部口型修补与速度对比 | 嘴部细节和人物一致性需实测；代码与权重许可分别处理 |
| [VideoReTalking](https://github.com/OpenTalker/video-retalking) | 表情、口型与面部增强的组合基线 | 旧依赖和多段面部变换可能增加整合风险 |
| [HuMo](https://github.com/Phantom-video/HuMo) | 角色图、文字、音频共同驱动镜头生成 | 短片段能力不自动扩展到 30 秒场景；算力与长片质量需验证 |
| [Phantom](https://github.com/Phantom-video/Phantom) | 多参考主体与道具驱动的镜头生成 | 多参考不代表多人对白和口型可独立控制 |
| [CosyVoice](https://github.com/QwenAudio/CosyVoice) | 英语声音、跨语言音色与语音指令 | 语言支持不代表美式戏剧表演通过；声音参考和资源要求单独确认 |

以上项目均为候选，没有将其代码、权重或演示素材重新分发到 DramaPilot。真实接入时记录具体提交、模型版本、依赖清单、硬件、单镜头耗时和失败样本。不能用代码库的 MIT/Apache 标签覆盖权重及其附加模型的条款。

## 4. 从调研到设计决策

### 每个镜头选择路线

**编辑原片**适合保留动作和空间关系；**重新演绎**适合文化动作或场景逻辑变化。先在同一个小场景比较，不预设某个供应商能处理所有镜头。

### 在生成之前固定文化改编

记录原意思、目标表达、保留的故事冲突，以及需要一起修改的台词、道具和行为。“可以输入提示词”不证明输出文化合理。借鉴[Netflix 译配原则](https://partnerhelp.netflixstudios.com/hc/en-us/articles/10258052221459-Dubbing-Guiding-Principles)对原作意图、自然表达和表演的重视，不宣称认证。

### 先用三镜头暴露问题

计划用角色 A 说话、角色 B 回应、角色 A 再出现三个镜头，检查跨镜头角色、声音、道具和动作。通过后再做 20–40 秒场景。只有三层在真实成片中同时出现，才称为完整本地化验证。

### 用同素材比较，避免把假设当效果

后续比较原片、语言译配版和三层改编版；检查理解程度、人物一致性、自然程度及继续观看意愿。整体对比不能把收益单独归因于换角色；若要验证选角影响，须固定语言和文化等其他条件。

## 5. 目前没有回答的问题

- 哪类真实短剧最适合改编，源素材是否具有充分处理/改编/公开范围？
- 目标受众偏好什么设定，何时应保留中国背景？
- 具体供应商能否在同一场景中兼顾角色、表演、口型和文化动作？
- 一个被创作者接受的成片，包含失败候选和修复后究竟多少钱、多久？
- 在没有母语/文化审阅者时，应怎样清晰交付未验证项？

这些是接下来实验和用户研究要回答的问题，不是现有代码已经证明的结论。

## 新链路补充：源重建与白模预演

补充日期：2026-09-17；下列官方仓库已于9月16日查看，仅作技术方向研究，尚未安装、下载权重或用短剧实测。具体许可、附加人体模型、硬件及输出接口在DP-N8实验设计时分别复核。

| 官方项目 | 可研究的环节 | 在本项目中的边界 |
|---|---|---|
| [GVHMR](https://github.com/zju3dv/GVHMR) / [WHAM](https://github.com/yohanshin/WHAM) | 从视频估计人体运动，作为源动作参考候选 | 人体动作估计不等于恢复剧本、道具交互或完整场景工程；近景、遮挡、多人与相机运动要逐项验证 |
| [SAM 2](https://github.com/facebookresearch/sam2) | 视频对象分割与跟踪，辅助分离人物和前景 | 分割结果本身不是三维几何或可编辑角色 |
| [Video Depth Anything](https://github.com/DepthAnything/Video-Depth-Anything) | 连续视频深度估计，辅助空间关系分析 | 深度图不是完整场景资产，也不能直接证明物理尺度和动作接触正确 |
| [VGGT](https://github.com/facebookresearch/vggt) | 图像的相机与几何估计，辅助场景重建研究 | 估计结果仍需转换、校正和制作，不能宣传自动还原原始三维工程 |

以上边界是基于各项目任务范围提出的工程判断，尚无组合使用效果结论。没有一个链接被当作“导入整剧即可得到精确白模”的验证证据。

新链路把这部分分为两个用途：源白模保留原动作/构图的近似参考；目标白模根据文化改编后的动作、场景和语言时长重新预演。两者分别保存版本与不确定项。若有创作者原始剧本、角色图或场景工程，先复用已有资产。

当前里程碑选择本地2D占位人物、场景与时间线，把源/目标资产、对白时长、变更依赖和审阅先串起来；自动三维逆向属于后续研究。白模是否能约束某个视频模型，须核实其输入接口并另做同素材实验。见[新链路](WORKFLOW.md)、[架构提案](ARCHITECTURE.md)和[任务路线图](ROADMAP.md)。
