/** Draft C black-box recovery runner; execute after Owner provides a frozen integration SHA. */
import {fork} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(process.argv[2]), directory=resolve(process.argv[3]), implementationCommit=process.argv[4];
assert.match(implementationCommit??'',/^[a-f0-9]{40}$/,'Exact Owner SHA required');
await mkdir(directory,{recursive:false});
const worker=resolve(dirname(fileURLToPath(import.meta.url)),'recovery-worker.mjs');
let serial=0;const executions=[],results=[];
async function prepare(config){
 const file=resolve(directory,`config-${serial++}.json`);await writeFile(file,JSON.stringify({root,...config}));
 return new Promise((ready,reject)=>{
  const child=fork(worker,[file],{silent:true});let stdout='',stderr='',isReady=false;
  const timer=setTimeout(()=>{child.kill('SIGKILL');reject(new Error('Worker timed out'));},20000);
  child.stdout.on('data',x=>stdout+=x);child.stderr.on('data',x=>stderr+=x);
  const done=new Promise(done=>child.once('exit',(code,signal)=>{clearTimeout(timer);const item={config:JSON.parse(JSON.stringify(config)),code,signal,stdout,stderr};executions.push(item);if(!isReady)reject(new Error(`Worker exited before ready: ${stderr}`));done(item);}));
  child.once('error',reject);child.once('message',()=>{isReady=true;ready({go:()=>child.send('go'),done});});
 });
}
async function run(config){const w=await prepare(config);w.go();return w.done;}
const response=x=>JSON.parse(x.stdout.trim());
const remote=async d=>JSON.parse(await readFile(resolve(d,'remote/remote.json'),'utf8'));
const submits=r=>r.events.filter(e=>e.method==='submit');
async function check(id,fn){try{await fn();results.push({id,status:'pass'});}catch(e){results.push({id,status:'fail',error:e.message});}}
await check('ASY-01/02/09 lost receipt reservation and restart',async()=>{
 const d=resolve(directory,'lost'),base={directory:d,scenario:'lost_receipt',budget:10,quote:7,operation:'lost'};
 const first=response(await run(base));assert.equal(first.value.status,'submission_unknown');
 assert.equal(first.value.reserved.amount_micros,7);assert.notEqual(first.value.billing_state,'settled');
 const snapshot=JSON.parse((await readFile(resolve(d,'before-submit.jsonl'),'utf8')).trim());
 assert.equal(snapshot.rows[0].data.status,'submitting');assert.equal(snapshot.rows[0].data.reserved.amount_micros,7);
 await run(base);await run({...base,action:'poll'});await run({...base,operation:'new-id-same-request'});
 assert.equal(submits(await remote(d)).length,1);
 const blocked=response(await run({...base,operation:'different-shot',shot:'s2',quote:4}));assert.equal(blocked.status,'error');assert.match(blocked.error,/budget/i);assert.equal(submits(await remote(d)).length,1);
});
await check('ASY-03 accepted then process SIGKILL before receipt persistence',async()=>{
 const d=resolve(directory,'killed'),base={directory:d,operation:'killed'};
 const killed=await run({...base,killAfterRemoteAccept:true});assert.equal(killed.signal,'SIGKILL');
 await run({...base,action:'poll'});const recovered=response(await run(base));assert.equal(recovered.value.status,'submission_unknown');assert.equal(submits(await remote(d)).length,1);
});
await check('ASY-04 poll timeout restart uses original job',async()=>{
 const d=resolve(directory,'poll'),base={directory:d,scenario:'poll_timeout',operation:'poll'};
 const submitted=response(await run(base));const timeout=response(await run({...base,action:'poll'}));assert.equal(timeout.status,'error');
 let final;for(let i=0;i<3;i++)final=response(await run({...base,action:'poll'}));
 assert.equal(final.value.status,'succeeded');const r=await remote(d);assert.equal(submits(r).length,1);assert.ok(r.events.filter(x=>x.method==='poll').every(x=>x.jobId===submitted.value.job_id));
});
await check('ASY-05 concurrent same operation sends once',async()=>{
 const d=resolve(directory,'duplicate'),base={directory:d,operation:'duplicate'};
 // Initialize schema without submitting, then synchronize two independent child processes.
 await run({...base,action:'get'});
 const workers=await Promise.all([prepare(base),prepare(base)]);workers.forEach(w=>w.go());await Promise.all(workers.map(w=>w.done));assert.equal(submits(await remote(d)).length,1);
});
await check('ASY-09 concurrent distinct 6-unit jobs under 10-unit budget',async()=>{
 const d=resolve(directory,'budget'),base={directory:d,quote:6,budget:10};await run({...base,action:'get'});
 const workers=await Promise.all([prepare({...base,operation:'one',shot:'s1'}),prepare({...base,operation:'two',shot:'s2'})]);workers.forEach(w=>w.go());const out=await Promise.all(workers.map(w=>w.done));assert.equal(out.map(response).filter(x=>x.status==='error'&&/budget/i.test(x.error)).length,1);assert.equal(submits(await remote(d)).length,1);
});
await check('ASY-06 unsupported cancellation preserves reservation',async()=>{
 const d=resolve(directory,'cancel'),base={directory:d,scenario:'cancel_unsupported',operation:'cancel'};await run(base);await run({...base,action:'cancel'});const state=response(await run({...base,action:'get'}));assert.notEqual(state.value.status,'cancelled');assert.notEqual(state.value.billing_state,'settled');assert.equal(state.value.reserved.amount_micros,7);assert.equal(submits(await remote(d)).length,1);
});
await writeFile(resolve(directory,'evidence.json'),JSON.stringify({implementationCommit,mode:'offline_mock_separate_processes',results,executions},null,2)+'\n');
console.log(JSON.stringify({results,evidence:resolve(directory,'evidence.json')},null,2));process.exitCode=results.some(r=>r.status==='fail')?1:0;
