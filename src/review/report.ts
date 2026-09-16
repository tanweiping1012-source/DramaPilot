import type {
  AdaptationPackage,
  GenerationJob,
  ReviewReport,
} from "../contracts/index.js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
export function reviewReport(jobs: GenerationJob[]): ReviewReport {
  return {
    evidence: "mock",
    technical:
      jobs.length > 0 && jobs.every((j) => j.status === "needs_review")
        ? "pass"
        : "unverified",
    visual: "unverified",
    language: "unverified",
    culture: "unverified",
    issues: [
      "Offline fixture/mock only. No source video recognition or real localized performance verified.",
      "Technical status covers collected hashes only; decoding and audience review are separate.",
    ],
  };
}
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export async function exportReview(
  path: string,
  p: AdaptationPackage,
  jobs: GenerationJob[],
): Promise<ReviewReport> {
  const report = reviewReport(jobs);
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>DramaPilot 本地审阅</title><style>body{font:16px system-ui;max-width:1000px;margin:40px auto;padding:24px;background:#f5f4f0;color:#182e31}section{background:white;padding:24px;margin:16px 0;border-radius:12px}h1{font-size:32px}th,td{text-align:left;padding:12px;border-bottom:1px solid #ddd}table{width:100%;border-collapse:collapse}.badge{background:#fff0b4;padding:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><h1>DramaPilot · 美国版审阅</h1><p class="badge">工程 fixture / mock · 非真实本地化成片 · 视觉 / 语言 / 文化未验证</p><section><h2>源事实</h2>${p.story.beats.map((b) => `<p>${escape(b.source_fact)}</p>`).join("")}<h2>目标改编候选</h2>${p.changes.map((c) => `<p>${escape(c.target_change)} — ${escape(c.reason)}</p>`).join("")}</section><section><h2>双角色目标对白</h2>${p.lines.map((l) => `<p><b>${escape(l.speaker_character_id)}</b> ${escape(l.target_text)}</p>`).join("")}</section><section><h2>任务与费用</h2><table><tr><th>Operation</th><th>状态</th><th>费用状态</th><th>预留（mock）</th></tr>${jobs.map((j) => `<tr><td>${escape(j.operation_id)}</td><td>${escape(j.status)}</td><td>${escape(j.billing_state)}</td><td>${j.reserved.amount_micros / 1e6} ${escape(j.reserved.currency)}</td></tr>`).join("")}</table><p>预留不是实收；未知结算继续占用额度。所有金额为模拟值。</p></section><section><h2>审核边界</h2><pre>${escape(JSON.stringify(report, null, 2))}</pre></section></html>`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html);
  return report;
}
