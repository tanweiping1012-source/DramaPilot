import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { chmod, lstat, mkdir, open, readFile, realpath, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { z } from "zod";
import { SourceAssetPackageSchema, SourceEvidenceSchema, WORKFLOW_DRAFT_VERSION, validateSourceAssetPackage, workflowHash, type SourceAssetPackage } from "../contracts/workflow-draft.js";
import { renderSourceReport } from "../review/source-report.js";
import { parseSrt, type ParsedSrt } from "./srt.js";
export { parseSrt } from "./srt.js";

export const ASSISTED_INGEST_VERSION = "0.1.0" as const;
export const INGEST_LIMITS = Object.freeze({ assets: 16, text_bytes: 2 * 1024 * 1024, media_bytes: 2 * 1024 * 1024 * 1024, total_bytes: 4 * 1024 * 1024 * 1024, manifest_bytes: 4 * 1024 * 1024 });
const id = z.string().trim().min(1).max(200);
const revision = z.number().int().positive().safe();
const provenance = z.enum(["fixture", "external_manual"]);
const baseAsset = { id, revision, path: z.string().min(1).max(4096), evidence: provenance };
const shape = SourceAssetPackageSchema.shape;
export const AssistedSourceManifestSchema = z.object({
  ingest_manifest_version: z.literal(ASSISTED_INGEST_VERSION),
  source_package: z.object({ id, revision, source_locale: id }).strict(),
  assets: z.array(z.discriminatedUnion("media_kind", [
    z.object({ ...baseAsset, media_kind: z.literal("video") }).strict(),
    z.object({ ...baseAsset, media_kind: z.literal("script") }).strict(),
    z.object({ ...baseAsset, media_kind: z.literal("subtitles"), video_asset_id: id }).strict(),
  ])).min(1).max(INGEST_LIMITS.assets),
  annotations: z.object({
    evidence: z.array(SourceEvidenceSchema.omit({ source_asset_sha256: true }).extend({ evidence: provenance, method: z.enum(["manual_annotation", "creator_supplied", "approximate_reconstruction", "authored_fixture"]) }).strict()).min(1),
    characters: shape.characters, relations: shape.relations, dialogue: shape.dialogue,
    scenes: shape.scenes, props: shape.props, beats: shape.beats,
    storyboard: shape.storyboard.extend({ shots: z.array(shape.storyboard.shape.shots.element.omit({ source_asset_sha256: true }).strict()).min(1) }).strict(),
    unknowns: shape.unknowns,
  }).strict(),
  preparation: z.object({ declared_minutes: z.number().finite().nonnegative().nullable(), notes: z.string().trim().min(1).max(10000) }).strict(),
}).strict();
export type AssistedSourceManifest = z.infer<typeof AssistedSourceManifestSchema>;
export type VideoProbe = { format: string; width: number; height: number; codec: string; duration_ms: number; frame_count: number | null; avg_frame_rate: string; r_frame_rate: string; audio_streams: number };
export type IngestedAsset = { id: string; uri: string; sha256: string; bytes: number; media_kind: "video" | "script" | "subtitles"; probe: VideoProbe | null; subtitles: (ParsedSrt & { video_asset_id: string }) | null };
export type AssistedIngestReceipt = {
  ingest_manifest_version: typeof ASSISTED_INGEST_VERSION; status: "complete"; mode: "assisted";
  created_at: string; elapsed_ms: number; source_package_sha256: string; manifest_sha256: string;
  assets: IngestedAsset[]; preparation: AssistedSourceManifest["preparation"];
  offset_unit: "utf16_code_units"; recognition: "not_run"; semantic_quality: "unverified";
  warnings: string[];
};
const execute = promisify(execFile);
function ensure(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const inside = (base: string, value: string) => { const rel = relative(base, value); return rel !== "" && !rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel); };

async function checkedPath(root: string, input: string): Promise<string> {
  ensure(!isAbsolute(input) && !input.includes("\\") && !input.includes("\0") && !/^[a-z][a-z\d+.-]*:/i.test(input), "Asset path must be a local workspace-relative path");
  ensure(input.split("/").every(p => p && p !== "." && p !== ".."), "Asset path contains an invalid path segment");
  let path = root;
  for (const component of input.split("/")) {
    path = join(path, component);
    ensure(!(await lstat(path)).isSymbolicLink(), "Symlink asset paths are not accepted");
  }
  const canonical = await realpath(path);
  ensure(inside(root, canonical), "Asset escapes configured workspace");
  return canonical;
}
async function copySnapshot(root: string, input: string, destination: string, limit: number, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const source = await checkedPath(root, input);
  const beforePath = await stat(source, { bigint: true });
  const handle = await open(source, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const before = await handle.stat({ bigint: true });
    ensure(before.isFile() && before.dev === beforePath.dev && before.ino === beforePath.ino, "Source identity changed or is not a regular file");
    ensure(await checkedPath(root, input) === source, "Source path changed during open");
    ensure(before.size > 0n && before.size <= BigInt(limit), "Source file size exceeds import limit or is empty");
    const output = await open(destination, "wx", 0o600);
    const hash = createHash("sha256"), buffer = Buffer.alloc(64 * 1024);
    let bytes = 0;
    try {
      while (true) {
        signal?.throwIfAborted();
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
        if (!bytesRead) break;
        bytes += bytesRead;
        ensure(bytes <= limit, "Source grew beyond import limit");
        const chunk = buffer.subarray(0, bytesRead); hash.update(chunk);
        let written = 0;
        while (written < chunk.length) written += (await output.write(chunk, written, chunk.length - written, null)).bytesWritten;
      }
      await output.sync();
    } finally { await output.close(); }
    const after = await handle.stat({ bigint: true }), afterPath = await stat(source, { bigint: true });
    ensure(before.size === BigInt(bytes) && before.size === after.size && before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs && afterPath.ino === before.ino && afterPath.dev === before.dev && await checkedPath(root, input) === source, "Source changed while taking snapshot");
    return { bytes, sha256: hash.digest("hex") };
  } finally { await handle.close(); }
}
async function probeVideo(path: string, executable: string, signal?: AbortSignal): Promise<VideoProbe> {
  signal?.throwIfAborted();
  // MOV demuxer and disabled data references prevent playlist / external stream input.
  const { stdout, stderr } = await execute(executable, ["-v", "error", "-protocol_whitelist", "file", "-f", "mov", "-enable_drefs", "0", "-use_absolute_path", "0", "-count_frames", "-show_entries", "format=format_name:stream=codec_type,codec_name,width,height,avg_frame_rate,r_frame_rate,duration,nb_read_frames", "-of", "json", path], { encoding: "utf8", shell: false, timeout: 120000, maxBuffer: 1024 * 1024, ...(signal ? { signal } : {}) });
  ensure(!stderr.trim(), `Video probe reported media errors: ${stderr.slice(0, 500)}`);
  const result = JSON.parse(stdout) as { format?: { format_name?: unknown }; streams?: Record<string, unknown>[] };
  ensure(Array.isArray(result.streams), "No video streams found");
  const videos = result.streams.filter(s => s.codec_type === "video");
  ensure(videos.length === 1, "Import requires exactly one video stream");
  const video = videos[0]!;
  const durationMs = Math.floor(Number(video.duration) * 1000 + 1e-6), frames = Number(video.nb_read_frames);
  ensure(Number.isSafeInteger(durationMs) && durationMs > 0, "Video duration unavailable");
  ensure(Number.isSafeInteger(video.width) && Number(video.width) > 0 && Number.isSafeInteger(video.height) && Number(video.height) > 0, "Video dimensions unavailable");
  ensure(typeof video.codec_name === "string" && typeof result.format?.format_name === "string", "Video format unavailable");
  const rate = (value: unknown) => typeof value === "string" && /^\d+\/\d+$/.test(value) ? value : "unknown";
  return { format: result.format.format_name, width: Number(video.width), height: Number(video.height), codec: video.codec_name, duration_ms: durationMs, frame_count: Number.isSafeInteger(frames) && frames > 0 ? frames : null, avg_frame_rate: rate(video.avg_frame_rate), r_frame_rate: rate(video.r_frame_rate), audio_streams: result.streams.filter(s => s.codec_type === "audio").length };
}
function textBoundary(text: string, offset: number) { return !(offset > 0 && offset < text.length && /[\uD800-\uDBFF]/.test(text[offset - 1]!) && /[\uDC00-\uDFFF]/.test(text[offset]!)); }

/** Offline, assisted file import. Annotations remain human assertions, not machine video understanding. */
export async function importAssistedSource(input: { manifest: unknown; workspaceRoot: string; outputDir: string; tools?: { ffprobe?: string }; signal?: AbortSignal }) {
  const started = performance.now(), signal = input.signal;
  signal?.throwIfAborted();
  // Require lossless JSON before schema parsing; callers cannot hide executable accessors in a manifest.
  const manifestHash = workflowHash(input.manifest);
  ensure(Buffer.byteLength(JSON.stringify(input.manifest)) <= INGEST_LIMITS.manifest_bytes, "Manifest exceeds import limit");
  const manifest = AssistedSourceManifestSchema.parse(input.manifest);
  ensure(new Set(manifest.assets.map(a => a.id)).size === manifest.assets.length, "Duplicate asset identity");
  ensure(manifest.assets.some(a => a.media_kind === "video"), "At least one source video is required");
  for (const a of manifest.assets) if (a.media_kind === "subtitles") ensure(manifest.assets.some(v => v.id === a.video_asset_id && v.media_kind === "video"), "Subtitle binding requires a video asset");
  const root = await realpath(input.workspaceRoot);
  ensure((await stat(root)).isDirectory(), "Workspace must be a directory");
  const outputDir = resolve(input.outputDir);
  await mkdir(dirname(outputDir), { recursive: true });
  await mkdir(outputDir); // Atomic reservation: existing output is never reused or overwritten.
  try {
    await writeFile(join(outputDir, ".incomplete"), "Import in progress; not a valid source snapshot.\n", { flag: "wx", mode: 0o600 });
    await mkdir(join(outputDir, "assets"));
    const assets: SourceAssetPackage["assets"] = [], records: IngestedAsset[] = [], texts = new Map<string, string>();
    let totalBytes = 0;
    for (const [index, asset] of manifest.assets.entries()) {
      signal?.throwIfAborted();
      const extension = extname(asset.path).toLowerCase();
      ensure(asset.media_kind !== "video" || [".mp4", ".mov"].includes(extension), "Video input must be MP4 or MOV");
      ensure(asset.media_kind !== "subtitles" || extension === ".srt", "Subtitle input must be SRT");
      const uri = `assets/${String(index).padStart(3, "0")}${asset.media_kind === "video" ? extension : asset.media_kind === "subtitles" ? ".srt" : ".txt"}`;
      const destination = join(outputDir, uri);
      const copied = await copySnapshot(root, asset.path, destination, asset.media_kind === "video" ? INGEST_LIMITS.media_bytes : INGEST_LIMITS.text_bytes, signal);
      totalBytes += copied.bytes; ensure(totalBytes <= INGEST_LIMITS.total_bytes, "Combined asset size exceeds import limit");
      const probe = asset.media_kind === "video" ? await probeVideo(destination, input.tools?.ffprobe ?? process.env.DRAMAPILOT_FFPROBE ?? "ffprobe", signal) : null;
      let text: string | null = null;
      if (asset.media_kind !== "video") {
        const bytes = await readFile(destination, { ...(signal ? { signal } : {}) });
        text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
        ensure(text.length > 0 && !text.includes("\0"), "Text input must contain valid nonempty UTF-8 text without NUL");
        texts.set(asset.id, text);
      }
      assets.push({ kind: "source_asset", id: asset.id, revision: asset.revision, media_kind: asset.media_kind, uri, sha256: copied.sha256, duration_ms: probe?.duration_ms ?? null, frame_count: probe?.frame_count ?? null, char_count: text?.length ?? null, evidence: asset.evidence });
      records.push({ id: asset.id, uri, ...copied, media_kind: asset.media_kind, probe, subtitles: null });
      await chmod(destination, 0o444);
    }
    for (const asset of manifest.assets) if (asset.media_kind === "subtitles") {
      const video = assets.find(v => v.id === asset.video_asset_id)!;
      records.find(r => r.id === asset.id)!.subtitles = { ...parseSrt(texts.get(asset.id)!, video.duration_ms!), video_asset_id: video.id };
    }
    const bindHash = (id: string) => { const asset = assets.find(a => a.id === id); ensure(asset, `Unknown source asset: ${id}`); return asset.sha256; };
    for (const evidence of manifest.annotations.evidence) {
      const asset = assets.find(a => a.id === evidence.source_asset_id);
      ensure(asset, "Evidence references missing asset");
      ensure(asset.evidence === evidence.evidence, "Evidence provenance must match imported asset");
      if (evidence.locator.kind === "text") {
        const text = texts.get(asset.id);
        ensure(text !== undefined && textBoundary(text, evidence.locator.start_char) && textBoundary(text, evidence.locator.end_char_exclusive), "Text evidence splits a UTF-16 surrogate pair");
      }
    }
    const sourcePackage = validateSourceAssetPackage({ kind: "source_package", contract_version: WORKFLOW_DRAFT_VERSION, ...manifest.source_package, ...manifest.annotations, assets,
      evidence: manifest.annotations.evidence.map(e => ({ ...e, source_asset_sha256: bindHash(e.source_asset_id) })),
      storyboard: { ...manifest.annotations.storyboard, shots: manifest.annotations.storyboard.shots.map(s => ({ ...s, source_asset_sha256: bindHash(s.source_asset_id) })) },
    });
    const warnings = ["人工标注与原始字幕尚未经过语义核验；文件 hash 和 probe 不代表视频理解。", ...records.flatMap(r => r.subtitles?.overlaps.length ? [`字幕 ${r.id} 包含 ${r.subtitles.overlaps.length} 组重叠时间；说话人保持未知。`] : [])];
    const receipt: AssistedIngestReceipt = { ingest_manifest_version: ASSISTED_INGEST_VERSION, status: "complete", mode: "assisted", created_at: new Date().toISOString(), elapsed_ms: Math.round(performance.now() - started), source_package_sha256: workflowHash(sourcePackage), manifest_sha256: manifestHash, assets: records, preparation: manifest.preparation, offset_unit: "utf16_code_units", recognition: "not_run", semantic_quality: "unverified", warnings };
    const report = renderSourceReport(sourcePackage, receipt, texts);
    signal?.throwIfAborted();
    const packagePath = join(outputDir, "source-package.json"), reportPath = join(outputDir, "review.html"), receiptPath = join(outputDir, "receipt.json");
    await writeFile(packagePath, JSON.stringify(sourcePackage, null, 2) + "\n", { flag: "wx", mode: 0o444 });
    signal?.throwIfAborted();
    await writeFile(reportPath, report, { flag: "wx", mode: 0o444 });
    // The receipt is the final commit marker. Failed/aborted imports are removed below.
    signal?.throwIfAborted();
    await writeFile(receiptPath, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx", mode: 0o444 });
    signal?.throwIfAborted();
    await rm(join(outputDir, ".incomplete"));
    return { outputDir, packagePath, reportPath, receiptPath, sourcePackage, receipt };
  } catch (error) { await rm(outputDir, { recursive: true, force: true }); throw error; }
}
