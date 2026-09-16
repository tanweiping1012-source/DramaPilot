import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]),sha=process.argv[4];assert.match(sha??'',/^[a-f0-9]{40}$/);await mkdir(out,{recursive:false});
const load=p=>import(pathToFileURL(resolve(root,'dist',p)).href);
const {familyFixture}=await load('src/contracts/fixture.js');
const {validateEpisode}=await load('src/contracts/validate.js');
const {saveAdaptation,readAdaptation,invalidatedArtifacts}=await load('src/adaptation/service.js');
const {JobStore}=await load('src/orchestration/store.js');
const ref=(kind,id,revision)=>({kind,id,revision});
const references=p=>[ref('source',p.project.project_id,p.project.revision),ref('adaptation',p.project.project_id,p.revision),ref('locale',p.locale.locale,p.locale.revision),...p.characters.map(c=>ref('character',c.character_id,c.revision)),...p.lines.map(l=>ref('line',l.line_id,l.revision)),...p.plans.map(s=>ref('shot',s.shot_id,s.revision))];
function complete(p){return {revision:p.revision,input_revisions:references(p),shot_assets:p.plans.map(s=>({artifact_id:`qa-${s.shot_id}`,kind:'video',uri:'fixture://metadata-only',sha256:'0'.repeat(64),evidence:'fixture',input_revisions:[ref('source',p.project.project_id,p.project.revision),ref('adaptation',p.project.project_id,p.revision),ref('shot',s.shot_id,s.revision),s.setting_revision,...s.target_character_revisions,...s.line_revisions],operation_id:null,media_type:'video/mp4',duration_ms:2000,probe:{fps_num:30,fps_den:1,frame_count:60,width:640,height:360},expires_at:null})),dialogue_stems:[],me_stems:[],subtitles:[],resolved_timeline:{fps_num:30,fps_den:1,segments:p.plans.map((s,i)=>({shot_id:s.shot_id,artifact_id:`qa-${s.shot_id}`,in_frame:i*60,out_frame:(i+1)*60}))},qa_report:{evidence:'fixture',technical:'unverified',visual:'unverified',language:'unverified',culture:'unverified',issues:[]}};}
const base=()=>structuredClone(familyFixture);const results=[];
function test(id,fn){try{fn();results.push({id,status:'pass'});}catch(e){results.push({id,status:'fail',error:e.message});}}
const reject=fn=>assert.throws(fn,undefined,'Invalid input accepted');
test('complete three-shot positive',()=>{const p=base();assert.equal(validateEpisode(complete(p),p).resolved_timeline.segments.length,3);});
test('C-001 missing character and dialogue rejected',()=>{const p=base(),e=complete(p);e.shot_assets[0].input_revisions=e.shot_assets[0].input_revisions.filter(r=>!['character','line'].includes(r.kind));reject(()=>validateEpisode(e,p));});
test('C-002 empty episode rejected',()=>{const p=base(),e=complete(p);e.shot_assets=[];e.resolved_timeline.segments=[];reject(()=>validateEpisode(e,p));});
test('C-003 fixture green QA rejected',()=>{const p=base(),e=complete(p);for(const k of ['visual','language','culture'])e.qa_report[k]='pass';reject(()=>validateEpisode(e,p));});
test('missing planned shot rejected',()=>{const p=base(),e=complete(p);e.shot_assets.pop();e.resolved_timeline.segments.pop();reject(()=>validateEpisode(e,p));});
function revised(){const p=base();p.revision=2;p.approval.revision=2;p.changes.forEach(c=>c.approval.revision=2);const l=p.lines.find(l=>l.line_id==='l2');l.revision=2;l.target_text='C changed fixture line';const s=p.plans.find(s=>s.shot_id==='s2');s.revision=2;s.line_revisions.find(r=>r.id==='l2').revision=2;return p;}
test('unrelated s1/s3 retain old adaptation provenance',()=>{const p=revised(),e=complete(p),old=complete(base());e.shot_assets=e.shot_assets.map(a=>a.artifact_id==='qa-s2'?a:old.shot_assets.find(o=>o.artifact_id===a.artifact_id));const checked=validateEpisode(e,p);for(const a of checked.shot_assets.filter(a=>a.artifact_id!=='qa-s2'))assert.equal(a.input_revisions.find(r=>r.kind==='adaptation').revision,1);});
test('changed s2 cannot reuse stale concrete dependency',()=>{const p=revised(),e=complete(p);e.shot_assets[1]=complete(base()).shot_assets[1];reject(()=>validateEpisode(e,p));});
for(const [label,mutate] of [['line',p=>p.lines[0].target_text='Changed without revision'],['character',p=>p.characters[0].wardrobe='Changed without revision'],['locale',p=>p.locale.setting='Changed without revision'],['shot',p=>p.plans[0].constraints.push('Changed without revision')]])test(`save ${label} same revision rejected`,()=>{const store=new JobStore(resolve(out,`immutable-${label}.sqlite`),{currency:'USD',amount_micros:10,basis:'mock'});try{saveAdaptation(store,base());const p=base();p.revision=2;p.approval.revision=2;p.changes.forEach(c=>c.approval.revision=2);mutate(p);reject(()=>saveAdaptation(store,p));assert.equal(readAdaptation(store).revision,1);}finally{store.close();}});
test('same global revision content mutation rejected',()=>{const store=new JobStore(resolve(out,'immutable-global.sqlite'),{currency:'USD',amount_micros:10,basis:'mock'});try{saveAdaptation(store,base());const p=base();p.lines[0].target_text='Changed';reject(()=>saveAdaptation(store,p));}finally{store.close();}});
test('valid incremented revisions save',()=>{const store=new JobStore(resolve(out,'valid-revision.sqlite'),{currency:'USD',amount_micros:10,basis:'mock'});try{saveAdaptation(store,base());assert.equal(saveAdaptation(store,revised()).revision,2);}finally{store.close();}});
test('native audio-driven video invalidates for changed line',()=>assert.deepEqual(invalidatedArtifacts(complete(base()).shot_assets,ref('line','l2',2),'native'),['qa-s2']));
test('character change affects both referenced shots',()=>assert.deepEqual(invalidatedArtifacts(complete(base()).shot_assets,ref('character','elder',2),'separate'),['qa-s1','qa-s3']));
await writeFile(resolve(out,'results.json'),JSON.stringify({implementationCommit:sha,mode:'metadata_contract_and_persistence',results},null,2)+'\n');console.log(JSON.stringify(results,null,2));process.exitCode=results.some(r=>r.status==='fail')?1:0;
