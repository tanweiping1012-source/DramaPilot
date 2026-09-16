import { z } from "zod";
import { resolve } from "node:path";
import { CONTRACT_VERSION } from "../contracts/index.js";
import { validateEpisode } from "../contracts/validate.js";
import { createRuntime } from "../orchestration/runtime.js";
import { readAdaptation, saveAdaptation } from "../adaptation/service.js";
import { buildRequest } from "../adaptation/request.js";
import { inspectLocalSource } from "../ingest/local.js";
export const name = "dramapilot";
export const inject = ["tools"];
export const DSH_BASELINE = {
  version: "0.1.5-rc.2",
  commit: "fb2c4b9e698e30edb738bca4cf0618587db7d203",
};
type Context = {
  tools: { register: (tool: unknown) => unknown };
  effect?: (fn: () => () => void) => unknown;
};
const id = z.string().min(1);
const jobArgs = z.object({ operation_id: id }).strict();
const empty = z.object({}).strict();
export async function apply(
  ctx: Context,
  config: {
    runtimeDir?: string;
    fixtureDir?: string;
    workspaceRoot?: string;
  } = {},
) {
  const runtime = await createRuntime({
    runtimeDir: config.runtimeDir ?? resolve(".runtime/dramapilot"),
    ...(config.fixtureDir ? { fixtureDir: config.fixtureDir } : {}),
  });
  ctx.effect?.(() => () => runtime.close());
  function tool<T>(
    name: string,
    description: string,
    properties: Record<string, unknown>,
    schema: z.ZodType<T>,
    execute: (args: T, signal: AbortSignal) => Promise<unknown>,
    required = Object.keys(properties),
  ) {
    ctx.tools.register({
      name,
      description,
      parameters: {
        type: "object",
        properties,
        required,
        additionalProperties: false,
      },
      output: {
        schema: { type: "object", additionalProperties: true },
        render: (_args: unknown, value: unknown) => [
          { type: "text", text: JSON.stringify(value) },
        ],
      },
      execute: async (args: unknown, exec: { signal: AbortSignal }) => {
        exec.signal.throwIfAborted();
        return execute(schema.parse(args), exec.signal);
      },
    });
  }
  const idProp = { operation_id: { type: "string" } };
  tool(
    "drama_contract_info",
    "Report the pinned offline contract and scope.",
    {},
    empty,
    async () => ({
      contract_version: CONTRACT_VERSION,
      evidence: "offline_protocol_only",
      paid_execution: "disabled",
      dsh: DSH_BASELINE,
    }),
  );
  tool(
    "drama_inspect_source",
    "Hash a local file within the configured workspace; assisted ingest only.",
    { path: { type: "string" } },
    z.object({ path: id }).strict(),
    async (a, s) =>
      inspectLocalSource(a.path, config.workspaceRoot ?? process.cwd(), s),
  );
  tool(
    "drama_save_adaptation",
    "Validate and persist an immutable adaptation revision. Model approval fields do not grant execution.",
    { adaptation: { type: "object", additionalProperties: true } },
    z.object({ adaptation: z.unknown() }).strict(),
    async (a) => ({
      adaptation: saveAdaptation(runtime.store, a.adaptation),
      execution_approval: "host_fixture_hash_only",
    }),
  );
  tool(
    "drama_quote_jobs",
    "Quote an offline shot. Unknown or real charges cannot execute.",
    { ...idProp, shot_id: { type: "string" } },
    z.object({ operation_id: id, shot_id: id }).strict(),
    async (a, s) =>
      runtime.jobs.quote(
        buildRequest(readAdaptation(runtime.store), a.operation_id, a.shot_id),
        readAdaptation(runtime.store),
        s,
      ),
  );
  tool(
    "drama_submit_job",
    "Submit a validated host-approved offline request once; persist reservation first.",
    { request: { type: "object", additionalProperties: true } },
    z.object({ request: z.unknown() }).strict(),
    async (a, s) =>
      runtime.jobs.submit(a.request, readAdaptation(runtime.store), s),
  );
  tool(
    "drama_get_job",
    "Poll the existing job; never re-submit after restart or unknown receipt.",
    idProp,
    jobArgs,
    async (a, s) => runtime.jobs.poll(a.operation_id, s),
  );
  tool(
    "drama_cancel_job",
    "Request supported remote cancellation; request acceptance is not cancellation or refund.",
    idProp,
    jobArgs,
    async (a, s) => runtime.jobs.cancel(a.operation_id, s),
  );
  tool(
    "drama_collect_job",
    "Collect and hash local mock/fixture output after remote success; quality remains unverified.",
    idProp,
    jobArgs,
    async (a, s) => runtime.jobs.collect(a.operation_id, s),
  );
  tool(
    "drama_assemble_episode",
    "Assemble collected current-revision fixture clips and decode the output; no real localization claim.",
    {},
    empty,
    async (_a, s) => runtime.assemble(s),
  );
  tool(
    "drama_validate_episode",
    "Check complete dependencies and frame bounds; synthetic evidence cannot pass language/visual/culture quality.",
    { episode: { type: "object", additionalProperties: true } },
    z.object({ episode: z.unknown() }).strict(),
    async (a) => ({
      episode: validateEpisode(a.episode, readAdaptation(runtime.store)),
      quality: "unverified",
    }),
  );
  tool(
    "drama_export_review",
    "Export local source/target comparison and mock cost review with explicit evidence limits.",
    {},
    empty,
    async () => runtime.review(),
  );
}
