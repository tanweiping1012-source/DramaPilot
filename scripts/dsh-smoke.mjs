// Run only after installing the pinned CLI in an isolated location. No model API is used.
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd(),
  run = resolve(".runtime/dsh-smoke");
await mkdir(run, { recursive: true });
const bin =
  process.env.DSH_BIN ?? resolve(".runtime/dsh-install/node_modules/.bin/dsh");
const env = {
  ...process.env,
  DSH_HOME: resolve(".runtime/dsh-home"),
  PATH: `${dirname(bin)}:${process.env.PATH}`,
};
function invoke(args) {
  const r = spawnSync(bin, args, {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: 60000,
  });
  if (r.error || r.status !== 0)
    throw new Error(
      JSON.stringify({
        args,
        status: r.status,
        error: r.error?.message,
        stdout: r.stdout,
        stderr: r.stderr,
      }),
    );
  return r.stdout;
}
const version = invoke(["--version"]).trim();
if (version !== "0.1.5-rc.2") throw new Error(`Wrong DSH version ${version}`);
const install = invoke([
  "plugin",
  "--profile",
  "dramapilot-smoke",
  "add",
  root,
]);
await writeFile(resolve(run, "install.txt"), install);
await writeFile(
  resolve(run, "config.yml"),
  invoke(["--profile", "dramapilot-smoke", "--dump-config"]),
);
const output = resolve(run, "result.json");
await writeFile(
  resolve(run, "runner.mjs"),
  `import {writeFile} from 'node:fs/promises';
import {familyFixture} from ${JSON.stringify(resolve(root, "dist/src/contracts/fixture.js"))};
import {buildRequest} from ${JSON.stringify(resolve(root, "dist/src/adaptation/request.js"))};
export const inject=['tools'];
export async function apply(ctx){
 for(let i=0;i<100&&!ctx.tools.schemas().some(t=>t.name==='drama_contract_info');i++)await new Promise(r=>setTimeout(r,20));
 const signal=new AbortController();
 const result=await ctx.tools.execute({name:'drama_contract_info',arguments:{},callId:'dp-smoke-1',signal:signal.signal});
 const call=async(name,args)=>{const r=await ctx.tools.execute({name,arguments:args,callId:'dp-'+name,signal:signal.signal});if(r.isError)throw new Error(JSON.stringify(r));return r.value;};
 const saved=await call('drama_save_adaptation',{adaptation:familyFixture});
 const quote=await call('drama_quote_jobs',{operation_id:'dsh-protocol-s1',shot_id:'s1'});
 let job=await call('drama_submit_job',{request:buildRequest(familyFixture,'dsh-protocol-s1','s1')});
 for(let i=0;i<5&&!['succeeded','needs_review'].includes(job.status);i++)job=await call('drama_get_job',{operation_id:job.operation_id});
 if(job.status==='succeeded')job=await call('drama_collect_job',{operation_id:job.operation_id});
 const review=await call('drama_export_review',{});
 signal.abort();
 const cancelled=await ctx.tools.execute({name:'drama_contract_info',arguments:{},callId:'dp-smoke-cancel',signal:signal.signal});
 await writeFile(${JSON.stringify(output)},JSON.stringify({version:${JSON.stringify(version)},job,quote,review,tools:ctx.tools.schemas().filter(t=>t.name.startsWith('drama_')),result,cancelled},null,2));
 process.exit(result.isError||!cancelled.isError?1:0);
}`,
);
await writeFile(
  resolve(run, "runner.patch.yml"),
  `- insert:\n    - id: dramapilot-smoke-runner\n      name: ${resolve(run, "runner.mjs")}\n`,
);
invoke([
  "--profile",
  "dramapilot-smoke",
  "--patch",
  resolve(run, "runner.patch.yml"),
]);
const evidence = JSON.parse(await readFile(output, "utf8"));
if (
  evidence.result.value?.contract_version !== "0.2.1" ||
  evidence.cancelled.error?.info?.code !== "ABORTED_BEFORE_DISPATCH"
)
  throw new Error("Unexpected canonical/cancel output");
console.log(
  JSON.stringify({
    evidence: output,
    version,
    tool_count: evidence.tools.length,
    canonical: true,
    cancellation: true,
    model_inference: "not_run",
    persisted_job: evidence.job.status,
  }),
);
