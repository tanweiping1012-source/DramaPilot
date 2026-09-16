/** C-owned process boundary driver. Draft binding; run only against Owner's fixed SHA. */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFile,appendFile,mkdir} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
const config=JSON.parse(await readFile(process.argv[2],'utf8'));
const load=p=>import(pathToFileURL(resolve(config.root,'dist',p)).href);
const [{familyFixture},{OfflineAuthorization},{JobStore},{JobOrchestrator},{MockGenerationProvider}]=await Promise.all([
 load('src/contracts/fixture.js'),load('src/orchestration/authorization.js'),load('src/orchestration/store.js'),load('src/orchestration/jobs.js'),load('src/providers/mock.js')]);
const plan=structuredClone(familyFixture);
const shot=plan.plans.find(s=>s.shot_id===(config.shot??'s1'));
const ref=(kind,id,revision)=>({kind,id,revision});
const request={operation_id:config.operation??'c-op',project_id:plan.project.project_id,shot_id:shot.shot_id,task:'video',model_version:shot.provider_capabilities.model_version,evidence:'mock',input_artifacts:[],input_revisions:[ref('source',plan.project.project_id,plan.project.revision),ref('adaptation',plan.project.project_id,plan.revision),ref('shot',shot.shot_id,shot.revision),shot.setting_revision,...shot.target_character_revisions,...shot.line_revisions],plan:shot,parameters:{prompt:'C independent offline recovery fixture',seed:null,audio_mode:'separate',driving_audio_artifact_id:null,dialogue:shot.line_revisions.map(r=>{const l=plan.lines.find(x=>x.line_id===r.id);const c=plan.characters.find(x=>x.character_id===l.speaker_character_id);return {line_ref:r,speaker_ref:ref('character',c.character_id,c.revision),target_text:l.target_text,voice_ref:c.voice_ref,emotion:l.emotion,pronunciation:l.pronunciation,duration_budget_ms:l.duration_budget_ms};})}};
await mkdir(config.directory,{recursive:true});
const storePath=resolve(config.directory,'operations.sqlite');
const observations=resolve(config.directory,'before-submit.jsonl');
const provider=new MockGenerationProvider({storeDir:resolve(config.directory,'remote'),scenario:config.scenario??'success',quoteMicros:config.quote??7,pollTimeouts:1,onSubmit:async r=>{
 // A separate read-only connection proves persistence visibility before external submit.
 const db=new DatabaseSync(storePath,{readOnly:true});
 try {const rows=db.prepare('SELECT operation_id,data FROM jobs').all();await appendFile(observations,JSON.stringify({pid:process.pid,operation:r.operation_id,rows:rows.map(x=>({operation:x.operation_id,data:JSON.parse(x.data)}))})+'\n');} finally{db.close();}
}});
if(config.killAfterRemoteAccept){const original=provider.submit.bind(provider);provider.submit=async(...args)=>{await original(...args);process.kill(process.pid,'SIGKILL');await new Promise(()=>{});};}
const auth=new OfflineAuthorization([provider]);auth.approveFixture(plan);
const store=new JobStore(storePath,{currency:'USD',amount_micros:config.budget??10,basis:'mock'});
const jobs=new JobOrchestrator(store,provider,auth);
if(process.send){process.send({ready:true,pid:process.pid});await new Promise(resolve=>process.once('message',resolve));}
try{
 const signal=new AbortController().signal;
 const action=config.action??'submit';
 const value=action==='submit'?await jobs.submit(request,plan,signal):action==='poll'?await jobs.poll(request.operation_id,signal):action==='cancel'?await jobs.cancel(request.operation_id,signal):store.get(request.operation_id);
 console.log(JSON.stringify({pid:process.pid,status:'returned',action,value}));
}catch(e){console.log(JSON.stringify({pid:process.pid,status:'error',error:e.message}));process.exitCode=2;}
finally{store.close();process.disconnect?.();}
