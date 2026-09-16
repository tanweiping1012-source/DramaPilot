# 第三方与样例说明

DramaPilot 的 MIT 许可只覆盖本仓库自有代码、文档与自编测试输入。

- **Zod**：运行依赖；锁定版本在 package-lock.json，原项目 https://github.com/colinhacks/zod 。保留依赖包自带许可。
- **TypeScript、@types/node**：构建/开发依赖；不把其许可重新定义为 DramaPilot 的许可。具体版本与依赖许可随 npm 包提供。
- **DeepSeek Harness**：独立运行时 https://github.com/deepseek-ai/deepseek-harness 。本项目固定测试 0.1.5-rc.2；未复制或重新发布其源码和二进制。
- **FFmpeg / ffprobe**：外部工具 https://ffmpeg.org/ 。构建选项影响其许可；本仓库和 Release 不含这些二进制。
- **字体**：从运行者本地系统读取，用于测试水印；不随包分发。
- **研究提及的视频、口型、声音模型**：仅作为候选链接，未集成或分发代码/权重。代码许可、权重许可、辅助模型及素材权限应分别核查。
- **测试情节与媒体**：家庭冲突情节和台词是自编说明性输入；fixture 生成器只创建色块与正弦测试音，没有真实人物、声音克隆或第三方短剧。

供应商名称仅用于说明技术研究，不表示合作或背书。链接目标和其条款可能变化。
