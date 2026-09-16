# 本地运行

当前版本只执行项目自带的离线 fixture/mock。fixture 是固定测试素材，mock 是模拟供应商：它们可验证软件行为，不生成真实演员或英语表演。

## 环境

- Node.js 24.x；验证版本 24.15.0。实现使用内置 SQLite；其他版本/平台尚未独立验证。
- Git 和 npm。依赖版本由 package-lock.json 固定。
- 只运行默认报告不需要 FFmpeg、GPU 或 API Key。
- 视频模式需要可执行的 FFmpeg/ffprobe；FFmpeg 需支持 libx264、AAC、drawtext。

```bash
npm ci
npm test
npm run demo
```

在浏览器打开 `.runtime/demo/review.html`。`.runtime/demo/demo.json` 是机器可读摘要。再次用相同目录运行会读取原任务，不应增加模拟提交次数。若要从头演示，传入新的运行目录，而不是删除旧账本。

```bash
npm run demo -- .runtime/another-demo
```

## 视频模式

若 `ffmpeg` 和 `ffprobe` 已在 PATH 中，代码会直接使用。否则显式设置可执行文件位置：

```bash
export DRAMAPILOT_FFMPEG=/absolute/path/to/ffmpeg
export DRAMAPILOT_FFPROBE=/absolute/path/to/ffprobe
```

默认水印字体是 macOS 自带 Arial。Linux 等系统请指定已安装的 TTF 字体（示例位置应按本机实际情况修改）：

```bash
export DRAMAPILOT_FIXTURE_FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
```

不下载或随包分发字体。当前字体路径只接受字母、数字、空格及 `_ / . -` 字符。命令示例采用 bash/zsh；Windows shell 尚未验证。

```bash
npm run fixture:media -- .runtime/color-fixture
DRAMAPILOT_FIXTURE_DIR=.runtime/color-fixture npm run demo -- .runtime/video-demo
```

查看 `.runtime/video-demo/review.html`、`demo.json` 和 `fixture-episode-r1.mp4`。字幕在同目录，具体文件由 demo 摘要/目录确认。测试片为 7 秒、25fps、175 帧；只有色块和测试音，不含英文配音。

fixture 生成器拒绝覆盖已存在的视频。运行失败后保留该目录，换新目录重试，避免把不同尝试的文件混为同一次成功结果。合成采用独有临时文件，完整探测/解码后再写最终路径。

## DSH 协议验证

使用项目独立安装，不改已有 DSH 工作目录：

```bash
npm install --prefix .runtime/dsh-install --ignore-scripts --save-exact @deepseek-ai/dsh@0.1.5-rc.2 pnpm@11.7.0
npm run smoke:dsh
```

固定基线为 `0.1.5-rc.2` / `fb2c4b9e698e30edb738bca4cf0618587db7d203`。脚本检查 CLI 版本，使用 `.runtime/dsh-home` 与 `dramapilot-smoke` profile，通过真实 registry 调用工具。

结果写到 `.runtime/dsh-smoke/result.json`。检查内容包括 canonical 输出、预先取消、保存改编、报价、提交、查询、收集和报告；不调用 LLM，不证明模型能自主理解真实视频或完成对话式改编。

插件有 11 个 `drama_` 工具；发布包根目录声明 `dsh.bundle.patch`。源码先构建再安装：

```bash
npm run build
DSH_HOME="$PWD/.runtime/dsh-manual-home" PATH="$PWD/.runtime/dsh-install/node_modules/.bin:$PATH" .runtime/dsh-install/node_modules/.bin/dsh plugin --profile dramapilot add "$PWD"
```

公开仓库同时保留源码与已编译 `dist/`，CI 检查二者同步；Release 的 `.tgz` 包也包含已编译入口。源码路径的 smoke 和发布包安装结果在[验证记录](VALIDATION.md)中分开报告。npm 注册表尚未发布 `dramapilot`，不要使用 `npm install dramapilot` 来安装本项目。

下载 [Release](https://github.com/tanweiping1012-source/DramaPilot/releases/tag/v0.2.0-engineering.1) 中的 tgz 后，也可以用本地包路径安装（替换最后的文件位置）：

```bash
DSH_HOME="$PWD/.runtime/dsh-package-home" PATH="$PWD/.runtime/dsh-install/node_modules/.bin:$PATH" .runtime/dsh-install/node_modules/.bin/dsh plugin --profile dramapilot add /absolute/path/to/dramapilot-0.2.0.tgz
```

## 状态与费用

- `needs_review`：已收集并核实产物，仍需内容审阅。
- `submission_unknown`：模拟远端可能已接受，但本地未得到身份。保留费用预留，不自动再提交。
- 取消请求发出不等于远端已取消，也不等于退款。
- 默认 `USD` 数值是模拟单位，不是实际账单。
- 模型写入 `approved` 不构成执行权限。默认运行只信任内置 fixture；编辑 JSON 不能开启真实生成。

`.runtime/` 包含本地 SQLite 状态、模拟远端状态和运行产物，默认不进入 Git。不要上传这个目录或凭据来报告问题。

## 报错时先看哪里

| 现象 | 检查 |
|---|---|
| SQLite 不可用 | 确认 Node 24.x，且终端实际运行的是该版本 |
| 找不到 FFmpeg | 检查 PATH 或两个 `DRAMAPILOT_` 工具路径 |
| 无法绘制水印 | 检查 drawtext 支持及本地 TTF 路径 |
| 文件已存在 | 改用新的 fixture 输出目录，保留旧证据 |
| DSH 版本不符 | 在项目 `.runtime/dsh-install` 安装固定版本，不升级其他项目 |
| 修改样例后提交被拒绝 | 当前只批准内置固定样例；这是离线模式限制 |

## 已知限制

没有真实供应商、自动识片、上传网页或自主模型规划。旧视频在台词变更后，可能被列为复用候选，但合成阶段仍保守拒绝旧台词依赖；没有实现完整的重新审阅后复用流程。不能把候选复用当作真实修复成本节省的证据。
