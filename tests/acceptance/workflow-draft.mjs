import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdir, readFile, writeFile, realpath} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Independent public-boundary checks. No production implementation is patched.
const root = resolve(process.argv[2] ?? '.');
const out = resolve(process.argv[3] ?? '.runtime/n1-acceptance');
const implementationCommit = process.argv[4];
assert.match(implementationCommit ?? '', /^[a-f0-9]{40}$/, 'Pass the fixed implementation commit');
execFileSync('git', ['cat-file', '-e', `${implementationCommit}^{commit}`], {cwd: root});
const productionPaths = ['src', 'package.json', 'package-lock.json', 'tsconfig.json', 'fixtures'];
const difference = execFileSync('git', ['diff', '--name-only', implementationCommit, '--', ...productionPaths], {cwd: root, encoding: 'utf8'}).trim();
assert.equal(difference, '', 'Production files differ from the fixed commit');
await mkdir(dirname(out), {recursive: true});
await mkdir(out, {recursive: false});
const load = p => import(pathToFileURL(resolve(root, 'dist', p)).href);
const api = await load('src/contracts/workflow-draft.js');
const {makeWorkflowDraftFixture} = await load('src/contracts/workflow-fixture.js');
const old = await load('src/contracts/index.js');
const {familyFixture} = await load('src/contracts/fixture.js');
const {validateAdaptation, validateEpisode} = await load('src/contracts/validate.js');
const {saveAdaptation, readAdaptation} = await load('src/adaptation/service.js');
const {JobStore} = await load('src/orchestration/store.js');
const clone = value => structuredClone(value);
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const ref = value => ({kind: value.kind, id: value.id, revision: value.revision, sha256: hash(value)});
const results = [];
const test = (id, label, fn) => {try {fn(); results.push({id, label, status: 'pass'});} catch (error) {results.push({id, label, status: 'fail', error: error.stack ?? String(error)});}};
const reject = fn => assert.throws(fn, undefined, 'Invalid input was accepted');
const base = () => makeWorkflowDraftFixture();
const planned = b => b.previs.find(p => p.domain === 'target' && p.status === 'planned');
const context = b => ({source: b.source, target: b.target, previs: b.previs});
const sourceCase = (id, label, mutation) => test(id, label, () => {const b=base(); api.validateSourceAssetPackage(b.source); mutation(b.source); reject(() => api.validateSourceAssetPackage(b.source));});
const targetCase = (id, label, mutation) => test(id, label, () => {const b=base(); api.validateTargetStoryboard(b.target,b.source); mutation(b.target,b.source); reject(() => api.validateTargetStoryboard(b.target,b.source));});
const previsCase = (id, label, mutation) => test(id, label, () => {const b=base(), p=planned(b); api.validatePrevisArtifact(p,context(b)); mutation(p,b); reject(() => api.validatePrevisArtifact(p,context(b)));});
const productionCase = (id,label,mutation) => test(id,label,()=>{const b=base(); api.validateProductionPackage(b.production,context(b)); mutation(b); reject(()=>api.validateProductionPackage(b.production,context(b)));});
const deepFreeze = value => {if (value && typeof value==='object') {Object.values(value).forEach(deepFreeze); Object.freeze(value);} return value;};

// A complete legacy package is the positive control for all compatibility checks.
test('N1-001a','legacy version and complete JSON round trip',()=>{assert.equal(old.CONTRACT_VERSION,'0.2.1'); assert.deepEqual(validateAdaptation(JSON.parse(JSON.stringify(familyFixture))),familyFixture);});
test('N1-001b','legacy save/read preserves every field',()=>{const store=new JobStore(resolve(out,'legacy.sqlite'),{currency:'USD',amount_micros:0,basis:'mock'});try{saveAdaptation(store,clone(familyFixture));assert.deepEqual(readAdaptation(store),familyFixture);}finally{store.close();}});
for (const [label, mutate] of [['root', p=>p.target_storyboard={}],['shot',p=>p.shots[0].source_shot_ids=['s1']],['artifact',p=>p.project.assets=[{kind:'previs_video'}]]]) test(`N1-002-${label}`,'old strict contract rejects new draft fields',()=>{const p=clone(familyFixture);mutate(p);reject(()=>validateAdaptation(p));});

test('N1-003','complete source, split/merge/new target, previs, production and confirmations',()=>{
  const b=base(), before=JSON.stringify(b);
  assert.equal(api.WORKFLOW_DRAFT_VERSION,'0.3.0-draft.1');
  assert.equal(b.source.storyboard.shots.length,3);assert.equal(b.source.characters.length,2);
  assert.deepEqual(b.target.shots.map(s=>s.source_shot_ids),[['s1'],['s1'],['s2','s3'],[]]);
  assert.equal(new Set(b.target.shots.map(s=>s.id)).size,4);
  assert.deepEqual(api.validateSourceAssetPackage(b.source),b.source);
  assert.deepEqual(api.validateTargetStoryboard(b.target,b.source),b.target);
  b.previs.forEach(p=>assert.deepEqual(api.validatePrevisArtifact(p,context(b)),p));
  assert.deepEqual(api.validateProductionPackage(b.production,context(b)),b.production);
  for(const c of [api.validateUntrustedConfirmation(b.stageConfirmation,{stagePlan:b.stagePlan}),api.validateUntrustedConfirmation(b.productionConfirmation,{productionPackage:b.production})]){
    assert.equal(c.authority,'untrusted_record');assert.equal(c.execution_authorized,undefined);
  }
  assert.equal(JSON.stringify(b),before,'Validation mutated caller input');
});
sourceCase('N1-004a','source evidence time exceeds asset',(s)=>s.evidence[0].locator.end_ms=s.assets[0].duration_ms+1);
sourceCase('N1-004b','source evidence empty time interval',(s)=>s.evidence[0].locator.end_ms=0);
sourceCase('N1-004c','text evidence exceeds stated text length',(s)=>s.evidence[1].locator.end_char_exclusive=s.assets[1].char_count+1);
sourceCase('N1-004d','text evidence cannot point into video',(s)=>s.evidence[0].locator={kind:'text',start_char:0,end_char_exclusive:1});
sourceCase('N1-004e','frame evidence cannot exceed frame count',(s)=>s.evidence[0].locator={kind:'frames',start_frame:0,end_frame_exclusive:s.assets[0].frame_count+1});
sourceCase('N1-005a','source shot exceeds video duration',(s)=>s.storyboard.shots[2].source_out_ms=s.assets[0].duration_ms+1);
sourceCase('N1-005b','source shot overlap',(s)=>s.storyboard.shots[1].source_in_ms=s.storyboard.shots[0].source_out_ms-1);
sourceCase('N1-005c','source shot references non-video asset',(s)=>{s.storyboard.shots[0].source_asset_id=s.assets[1].id;s.storyboard.shots[0].source_asset_sha256=s.assets[1].sha256;});
sourceCase('N1-006a','source evidence missing asset',(s)=>s.evidence[0].source_asset_id='missing');
sourceCase('N1-006b','source evidence wrong media hash',(s)=>s.evidence[0].source_asset_sha256='f'.repeat(64));
for(const key of ['characters','relations','dialogue','scenes','props','beats']) sourceCase(`N1-007-${key}`,`missing evidence for ${key}`,(s)=>s[key][0].evidence_ids=['missing']);
sourceCase('N1-007-shot','source shot missing evidence',(s)=>s.storyboard.shots[0].evidence_ids=['missing']);
sourceCase('N1-007-relation-character','relation missing character',(s)=>s.relations[0].from_character_id='missing');
sourceCase('N1-007-source-speaker','source dialogue missing speaker',(s)=>s.dialogue[0].speaker_character_id='missing');
for(const field of ['character_ids','dialogue_ids','prop_ids']) sourceCase(`N1-007-shot-${field}`,'source shot missing dependency',(s)=>s.storyboard.shots[0][field]=['missing']);
sourceCase('N1-007-shot-scene','source shot missing scene',(s)=>s.storyboard.shots[0].scene_id='missing');
sourceCase('N1-007-beat-shot','beat missing source shot',(s)=>s.beats[0].source_shot_ids=['missing']);
test('N1-008','inferred fixture remains inferred, with uncertainty',()=>{const b=base();b.source.evidence[0].epistemic_status='inferred';b.source.evidence[0].uncertainties=['Cannot infer relationship with certainty'];const checked=api.validateSourceAssetPackage(b.source);assert.equal(checked.evidence[0].epistemic_status,'inferred');assert.equal(checked.evidence[0].evidence,'fixture');});
sourceCase('N1-009a','inference without uncertainty',(s)=>{s.evidence[0].epistemic_status='inferred';s.evidence[0].uncertainties=[];});
sourceCase('N1-009b','approximate reconstruction marked as observed',(s)=>s.evidence[0].method='approximate_reconstruction');
sourceCase('N1-009c','fixture observation relabeled live',(s)=>s.evidence[0].evidence='live');

test('N1-010a','split merge and new shots cannot migrate to legacy silently',()=>{const b=base();reject(()=>api.assertLegacyShotMappingCompatible(b.target,b.source));});
test('N1-010b','explicit one-to-one mapping can be checked for legacy',()=>{const b=base();b.target.shots=b.target.shots.slice(0,3);b.target.shots.forEach((s,i)=>s.source_shot_ids=[b.source.storyboard.shots[i].id]);api.validateTargetStoryboard(b.target,b.source);api.assertLegacyShotMappingCompatible(b.target,b.source);});
targetCase('N1-011a','new shot cannot invent source timestamp',(t)=>t.shots[3].source_in_ms=0);
targetCase('N1-011b','new shot cannot reference nonexistent source',(t)=>t.shots[3].source_shot_ids=['invented']);
targetCase('N1-011c','new shot requires creative rationale',(t)=>t.shots[3].creative_rationale='');
targetCase('N1-012a','edit route without source mapping',(t)=>t.shots[3].route='edit');
targetCase('N1-012b','reuse route with multiple source shots',(t)=>t.shots[2].route='reuse');
targetCase('N1-012c','duplicate mapping',(t)=>t.shots[0].source_shot_ids=['s1','s1']);
targetCase('N1-012d','duplicate target identity',(t)=>t.shots[1].id=t.shots[0].id);
for(const [label,mutate] of [
  ['character',t=>t.shots[0].character_refs[0].id='missing'],
  ['scene',t=>t.shots[0].scene_ref.id='missing'],
  ['prop',t=>t.shots[0].prop_refs[0].id='missing'],
  ['line',t=>t.shots[0].line_refs[0].id='missing'],
  ['source character',t=>t.characters[0].source_character_ids=['missing']],
  ['source scene',t=>t.scenes[0].source_scene_ids=['missing']],
  ['source prop',t=>t.props[0].source_prop_ids=['missing']],
  ['source dialogue',t=>t.lines[0].source_dialogue_ids=['missing']],
  ['line speaker',t=>t.lines[0].speaker_character_id='missing'],
]) targetCase(`N1-013-${label}`,`target missing ${label}`,mutate);
targetCase('N1-014a','shot omits its speaking character',(t)=>t.shots[0].character_refs=t.shots[0].character_refs.filter(r=>r.id!==t.lines[0].speaker_character_id));
targetCase('N1-014b','silent shot contains dialogue',(t)=>t.shots[0].audio_mode='silent');
test('N1-015a','required beat omitted from all target shots',()=>{const b=base();const extra=clone(b.source.beats[0]);extra.id='secondary';extra.description='A second required beat';b.source.beats.push(extra);b.target.source_ref=ref(b.source);b.target.shots[0].preserved_beat_ids.push('secondary');api.validateTargetStoryboard(b.target,b.source);b.target.shots[0].preserved_beat_ids=b.target.shots[0].preserved_beat_ids.filter(id=>id!=='secondary');reject(()=>api.validateTargetStoryboard(b.target,b.source));});
targetCase('N1-015b','required beat cannot be omitted by decision',(t)=>t.omitted_beat_decisions=[{source_beat_id:'exclusion',rationale:'Drop central conflict'}]);
test('N1-016','target rewrite does not mutate source',()=>{const b=base(),sourceText=JSON.stringify(b.source),sourceHash=hash(b.source);b.target.lines[0].text='A distinct target-only rewrite.';b.target.shots[0].line_refs=[ref(b.target.lines[0])];api.validateTargetStoryboard(b.target,b.source);assert.equal(JSON.stringify(b.source),sourceText);assert.equal(hash(b.source),sourceHash);});

function sourcePlanned(b){const skip=b.previs.find(p=>p.domain==='source'),s=b.source.storyboard.shots[0];return {...clone(skip),status:'planned',output:null,dimension:'2D',method:'fixture',evidence:'fixture',coordinate_system:'normalized_screen',duration_ms:s.source_out_ms-s.source_in_ms,fps_num:25,fps_den:1,frame_count:100,entity_tracks:[...b.source.characters,...b.source.props].map(entity=>({entity_ref:ref(entity),keyframes:[{at_ms:0,x:.5,y:.5,action:'Authored initial position'}]})),camera_keyframes:[{at_ms:0,framing:'wide',movement:'static'}],dialogue_timing:[],overlapping_dialogue:'forbidden',capabilities:{motion:'present',camera:'present',depth:'unknown'}};}
test('N1-017','source planned previs and target planned previs are separate',()=>{const b=base(),p=sourcePlanned(b);delete p.reason;assert.equal(api.validatePrevisArtifact(p,context(b)).domain,'source');assert.equal(api.validatePrevisArtifact(planned(b),context(b)).domain,'target');});
previsCase('N1-018a','target previs cannot use source shot',(p,b)=>p.shot_refs=[ref(b.source.storyboard.shots[0])]);
previsCase('N1-018b','target previs stale shot revision',(p)=>p.shot_refs[0].revision++);
previsCase('N1-018c','target previs forged input hash',(p)=>p.input_refs[0].sha256='0'.repeat(64));
for(const kind of ['target_shot','target_character','target_scene','target_prop','target_line']) previsCase(`N1-018-missing-${kind}`,'previs omits concrete dependency',(p)=>p.input_refs=p.input_refs.filter(r=>r.kind!==kind));
previsCase('N1-019a','2D draft cannot claim 3D',(p)=>p.dimension='3D');
previsCase('N1-019b','2D draft cannot claim depth',(p)=>p.capabilities.depth='present');
previsCase('N1-019c','fixture previs cannot claim live',(p)=>p.evidence='live');
previsCase('N1-019d','reconstruction needs uncertainty',(p)=>{p.method='reconstructed';p.uncertainties=[];});
previsCase('N1-020a','frame/duration mismatch',(p)=>p.frame_count++);
previsCase('N1-020b','keyframe outside duration',(p)=>p.entity_tracks[0].keyframes[1].at_ms=p.duration_ms+1);
previsCase('N1-020c','entity missing initial state',(p)=>p.entity_tracks[0].keyframes[0].at_ms=1);
previsCase('N1-020d','dialogue overflow cannot claim fits',(p)=>p.dialogue_timing[0].read_duration_ms=p.duration_ms+1);
previsCase('N1-020e','unmeasured timing cannot claim fits',(p)=>{p.dialogue_timing[0].method='unknown';p.dialogue_timing[0].read_duration_ms=null;});
previsCase('N1-020f','missing required target dialogue timing',(p)=>p.dialogue_timing=[]);
previsCase('N1-020g','missing character/prop track',(p)=>p.entity_tracks.pop());
test('N1-020h','overflow is preserved as blocker metadata',()=>{const b=base(),p=planned(b);p.dialogue_timing[0].read_duration_ms=p.duration_ms+1;p.dialogue_timing[0].assessment='overflow';assert.equal(api.validatePrevisArtifact(p,context(b)).dialogue_timing[0].assessment,'overflow');});
test('N1-021a','skip requires reason',()=>{const b=base(),p=b.previs.find(p=>p.domain==='target'&&p.status==='skipped');api.validatePrevisArtifact(p,context(b));p.reason='';reject(()=>api.validatePrevisArtifact(p,context(b)));});
productionCase('N1-021b','every target shot has a previs decision',(b)=>b.production.previs_refs=b.production.previs_refs.filter(r=>r.id!=='previs-t2'));
previsCase('N1-022a','previs output cannot be tagged final video',(p)=>{p.status='rendered';p.output={kind:'video',uri:'fixture://not-final',sha256:'a'.repeat(64),evidence:'fixture'};});
productionCase('N1-022b','unrendered previs cannot enter production candidate',(b)=>b.production.purpose='production_candidate');
test('N1-022c','rendered fixture previs remains rehearsal-only',()=>{const b=base(),p=planned(b);p.status='rendered';p.output={kind:'previs_video',uri:'fixture://not-final',sha256:'a'.repeat(64),evidence:'fixture'};api.validatePrevisArtifact(p,context(b));b.production.previs_refs=b.previs.map(ref);api.validateProductionPackage(b.production,context(b));b.production.purpose='production_candidate';reject(()=>api.validateProductionPackage(b.production,context(b)));});
productionCase('N1-023a','production target hash mismatch',(b)=>b.production.target_ref.sha256='0'.repeat(64));
productionCase('N1-023b','production previs hash mismatch',(b)=>b.production.previs_refs[0].sha256='0'.repeat(64));
productionCase('N1-023c','production missing audio line',(b)=>b.production.audio=[{line_ref:{kind:'target_line',id:'missing',revision:1,sha256:'a'.repeat(64)},sha256:'b'.repeat(64),duration_ms:3200,evidence:'fixture'}]);

test('N1-024a','stage plan and input exact binding',()=>{const b=base(),c=api.validateUntrustedConfirmation(b.stageConfirmation,{stagePlan:b.stagePlan});assert.equal(c.stage_input_sha256,hash(b.stagePlan.input_refs));assert.equal(c.stage_plan_ref.sha256,hash(b.stagePlan));assert.equal(c.authority,'untrusted_record');});
for(const [label,mutate] of [
 ['input hash',c=>c.stage_input_sha256='0'.repeat(64)],['plan revision',c=>c.stage_plan_ref.revision++],['provider',c=>c.provider='other'],['upload scope',c=>c.external_upload=true],['budget',c=>c.budget.max_amount_micros++],['source hash',c=>c.source_asset_hashes[0]='0'.repeat(64)],['stage',c=>c.stage='reference_images'],
]) test(`N1-024-${label}`,'stage confirmation mismatch rejected',()=>{const b=base();mutate(b.stageConfirmation);reject(()=>api.validateUntrustedConfirmation(b.stageConfirmation,{stagePlan:b.stagePlan}));});
test('N1-025a','preproduction record cannot bind production only',()=>{const b=base();reject(()=>api.validateUntrustedConfirmation(b.stageConfirmation,{productionPackage:b.production}));});
for(const [label,mutate] of [['authority',c=>c.authority='trusted_host'],['execution flag',c=>c.execution_authorized=true],['approved flag',c=>c.approved=true]])test(`N1-025-${label}`,'model cannot add execution credentials',()=>{const b=base();mutate(b.productionConfirmation);reject(()=>api.validateUntrustedConfirmation(b.productionConfirmation,{productionPackage:b.production}));});
test('N1-025b','stale production confirmation after content edit',()=>{const b=base();b.production.delivery.aspect_ratio='16:9';reject(()=>api.validateUntrustedConfirmation(b.productionConfirmation,{productionPackage:b.production}));});
for(const [label,get,mutate] of [
 ['source',b=>b.source,x=>x.unknowns.push('content changed')],['target line',b=>b.target.lines[0],x=>x.text='changed'],['target scene',b=>b.target.scenes[0],x=>x.design='changed'],['target shot',b=>b.target.shots[0],x=>x.action='changed'],['previs',b=>planned(b),x=>x.uncertainties.push('changed')],['production',b=>b.production,x=>x.delivery.aspect_ratio='16:9'],
])test(`N1-026-${label}`,'same typed identity/revision cannot change content',()=>{const before=clone(get(base())),after=clone(before);api.assertImmutableRevision(before,after);mutate(after);reject(()=>api.assertImmutableRevision(before,after));});
test('N1-026a','workflow hash matches independent canonical JSON',()=>{const b=base();assert.equal(api.workflowHash(b.source),hash(b.source));assert.equal(api.workflowHash({z:1,a:[2,3]}),hash({a:[2,3],z:1}));});
for(const [label,value] of [['undefined',{a:undefined}],['NaN',{a:NaN}],['sparse',new Array(1)],['date',new Date(0)],['function',{a:()=>1}],['symbol property',Object.assign({a:1},{[Symbol('s')]:2})]])test(`N1-026-json-${label}`,'lossy JSON is not accepted as stable content',()=>reject(()=>api.workflowHash(value)));
test('N1-027','unrelated target shot change preserves t1 previs',()=>{const b=base(),p=clone(planned(b));b.target.revision++;b.target.shots[3].revision++;b.target.shots[3].action='An unrelated reaction shot action';api.validateTargetStoryboard(b.target,b.source);assert.deepEqual(api.validatePrevisArtifact(p,context(b)),p);});


// Fixed-candidate positive controls exercise the repaired boundaries without
// obtaining host authorization or claiming that any referenced media exists.
function candidate(native=true,rendered=false){
 const b=base(),template=clone(planned(b)),shot=b.target.shots[0],line=b.target.lines[0];
 shot.audio_mode=native?'native_audio':'separate_audio';
 b.previs=b.previs.map(p=>{
  if(p.domain==='source')return p;
  const s=b.target.shots.find(s=>s.id===p.shot_refs[0].id);
  return {kind:'previs',id:p.id,revision:p.revision,contract_version:api.WORKFLOW_DRAFT_VERSION,domain:'target',shot_refs:[ref(s)],input_refs:[ref(s),...s.character_refs,s.scene_ref,...s.prop_refs,...s.line_refs],uncertainties:['Metadata control only; no rendered files exist'],status:'skipped',reason:'Simple blocking; independent dialogue timing retained'};
 });
 b.production.purpose='production_candidate';b.production.target_ref=ref(b.target);
 b.production.audio=native?[{line_ref:ref(line),sha256:'1'.repeat(64),duration_ms:3200,evidence:'external_manual'}]:[];
 b.production.dialogue_timing=[{shot_ref:ref(shot),line_ref:ref(line),start_ms:0,read_duration_ms:3200,method:'manual_read',evidence:'external_manual',audio_sha256:native?'1'.repeat(64):null,assessment:'fits'}];
 if(rendered){
  const ix=b.previs.findIndex(p=>p.domain==='target'&&p.shot_refs[0].id===shot.id),binding=b.previs[ix];
  template.shot_refs=binding.shot_refs;template.input_refs=binding.input_refs;
  template.status='rendered';template.method='manual';template.evidence='external_manual';template.output={kind:'previs_video',uri:'external-metadata://not-a-rendered-file',sha256:'2'.repeat(64),evidence:'external_manual'};
  const {shot_ref:unused,...timing}=b.production.dialogue_timing[0];template.dialogue_timing=[timing];b.previs[ix]=template;
 }
 b.production.previs_refs=b.previs.map(ref);
 api.validateProductionPackage(b.production,context(b));
 return b;
}
const candidateCase=(id,label,mutation,{native=true,rendered=false,pattern}={})=>test(id,label,()=>{const b=candidate(native,rendered);mutation(b);assert.throws(()=>api.validateProductionPackage(b.production,context(b)),pattern);});
test('N1-032a','source planned previs validates without any target',()=>{const b=base(),p=sourcePlanned(b);delete p.reason;assert.deepEqual(api.validatePrevisArtifact(p,{source:b.source}),p);});
test('N1-032b','source skip ignores absent or invalid target context',()=>{const b=base(),p=b.previs.find(p=>p.domain==='source');assert.deepEqual(api.validatePrevisArtifact(p,{source:b.source}),p);assert.deepEqual(api.validatePrevisArtifact(p,{source:b.source,target:{invalid:'not yet authored'}}),p);});
test('N1-032c','source previs cannot silently retime even with valid frame count',()=>{const b=base(),p=sourcePlanned(b);delete p.reason;api.validatePrevisArtifact(p,{source:b.source});p.duration_ms=2000;p.frame_count=50;assert.throws(()=>api.validatePrevisArtifact(p,{source:b.source}),/retiming/);});
test('N1-032d','source previs requires exact source media binding',()=>{const b=base(),p=sourcePlanned(b);delete p.reason;api.validatePrevisArtifact(p,{source:b.source});p.input_refs=p.input_refs.filter(r=>r.kind!=='source_asset');assert.throws(()=>api.validatePrevisArtifact(p,{source:b.source}),/concrete input/);});
test('N1-032e','unrelated source shot action preserves first-shot previs',()=>{const b=base(),p=sourcePlanned(b);delete p.reason;api.validatePrevisArtifact(p,{source:b.source});b.source.revision++;b.source.storyboard.revision++;b.source.storyboard.shots[2].revision++;b.source.storyboard.shots[2].action='Unrelated last-shot action';assert.deepEqual(api.validatePrevisArtifact(p,{source:b.source}),p);});
test('N1-033a','fully bound native-audio candidate metadata with skipped previs',()=>{const b=candidate();assert.equal(b.production.audio[0].duration_ms,3200);assert.equal(b.production.dialogue_timing[0].shot_ref.id,'t1');assert.equal(b.production.dialogue_timing[0].audio_sha256,b.production.audio[0].sha256);});
test('N1-033b','separate-audio candidate also binds independent timing',()=>{const b=candidate(false);assert.equal(b.production.audio.length,0);assert.equal(b.production.dialogue_timing.length,1);});
test('N1-033c','rendered native-audio metadata matches shot, audio and timing',()=>{const b=candidate(true,true);assert.equal(b.previs.find(p=>p.status==='rendered').dialogue_timing[0].audio_sha256,b.production.audio[0].sha256);});
candidateCase('N1-034a','skipping visual previs never bypasses native dialogue timing',b=>b.production.dialogue_timing=[],{pattern:/measured fitting timing/});
candidateCase('N1-034b','skipping visual previs never bypasses separate-audio timing',b=>b.production.dialogue_timing=[],{native:false,pattern:/measured fitting timing/});
candidateCase('N1-034c','independent timing cannot have unknown duration',b=>Object.assign(b.production.dialogue_timing[0],{method:'unknown',read_duration_ms:null,assessment:'unknown'}),{pattern:/measured fitting timing/});
candidateCase('N1-034d','independent timing cannot freeze overflowing line',b=>Object.assign(b.production.dialogue_timing[0],{read_duration_ms:5000,assessment:'overflow'}),{pattern:/measured fitting timing/});
candidateCase('N1-034e','independent timing cannot freeze estimates as measured',b=>Object.assign(b.production.dialogue_timing[0],{method:'estimate',assessment:'unknown'}),{pattern:/measured fitting timing/});
candidateCase('N1-034f','independent timing cannot freeze fixture measurement',b=>Object.assign(b.production.dialogue_timing[0],{method:'test_fixture',evidence:'fixture'}),{pattern:/measured fitting timing/});
candidateCase('N1-034g','production timing exact shot ref hash',b=>b.production.dialogue_timing[0].shot_ref.sha256='f'.repeat(64),{pattern:/production timing shot/});
candidateCase('N1-034h','production timing exact line ref hash',b=>b.production.dialogue_timing[0].line_ref.sha256='f'.repeat(64),{pattern:/production timing line/});
candidateCase('N1-034i','production timing cannot refer to another silent shot',b=>b.production.dialogue_timing[0].shot_ref=ref(b.target.shots[1]),{pattern:/outside production shot/});
candidateCase('N1-035a','native audio byte hash differs from measured audio',b=>b.production.audio[0].sha256='3'.repeat(64),{pattern:/Native audio/});
candidateCase('N1-035b','native audio duration differs from measured read',b=>b.production.audio[0].duration_ms=3201,{pattern:/Native audio/});
candidateCase('N1-035c','native audio missing',b=>b.production.audio=[],{pattern:/Native audio/});
candidateCase('N1-035d','native audio cannot substitute synthetic bytes',b=>b.production.audio[0].evidence='fixture',{pattern:/Native audio/});
candidateCase('N1-035e','native audio cannot use stale line reference',b=>b.production.audio[0].line_ref.revision++,{pattern:/production audio line/});
candidateCase('N1-035f','native audio requires hash on fitting measurement',b=>b.production.dialogue_timing[0].audio_sha256=null,{pattern:/Native audio/});
for(const [name,mutate] of [['audio',p=>p.dialogue_timing[0].audio_sha256='4'.repeat(64)],['duration',p=>p.dialogue_timing[0].read_duration_ms=3100],['offset',p=>p.dialogue_timing[0].start_ms=100]])candidateCase(`N1-036-${name}`,'rendered previs and production timing match exactly',b=>{mutate(b.previs.find(p=>p.status==='rendered'));b.production.previs_refs=b.previs.map(ref);},{rendered:true,pattern:/Previs and production timing/});
candidateCase('N1-036-unrendered','complete candidate rejects merely planned previs',b=>{const p=b.previs.find(p=>p.status==='rendered');p.status='planned';p.output=null;b.production.previs_refs=b.previs.map(ref);},{rendered:true,pattern:/unrendered/});
candidateCase('N1-036-synthetic','complete candidate rejects rendered fixture previs',b=>{const p=b.previs.find(p=>p.status==='rendered');p.method='fixture';p.evidence='fixture';p.output.evidence='fixture';b.production.previs_refs=b.previs.map(ref);},{rendered:true,pattern:/Synthetic previs/});
test('N1-037','one line reused in two shots needs per-shot timings',()=>{const b=candidate();const s=b.target.shots[1];s.line_refs=[ref(b.target.lines[0])];s.audio_mode='native_audio';const p=b.previs.find(p=>p.domain==='target'&&p.shot_refs[0].id===s.id);p.shot_refs=[ref(s)];p.input_refs=[ref(s),...s.character_refs,s.scene_ref,...s.prop_refs,...s.line_refs];b.production.target_ref=ref(b.target);b.production.previs_refs=b.previs.map(ref);b.production.dialogue_timing.push({...clone(b.production.dialogue_timing[0]),shot_ref:ref(s)});api.validateProductionPackage(b.production,context(b));b.production.dialogue_timing.pop();assert.throws(()=>api.validateProductionPackage(b.production,context(b)),/measured fitting timing/);});


function sequentialCandidate(){
 const b=candidate(false),s=b.target.shots[0],second={...clone(b.target.lines[0]),id:'l2',speaker_character_id:'guest',text:'I will not be treated like this.'};
 b.target.lines.push(second);s.line_refs.push(ref(second));
 const p=b.previs.find(p=>p.domain==='target'&&p.shot_refs[0].id===s.id);
 p.shot_refs=[ref(s)];p.input_refs=[ref(s),...s.character_refs,s.scene_ref,...s.prop_refs,...s.line_refs];
 b.production.target_ref=ref(b.target);b.production.previs_refs=b.previs.map(ref);
 b.production.dialogue_timing=b.target.lines.map((l,i)=>({shot_ref:ref(s),line_ref:ref(l),start_ms:i*2000,read_duration_ms:1800,method:'manual_read',evidence:'external_manual',audio_sha256:null,assessment:'fits'}));
 api.validateProductionPackage(b.production,context(b));return b;
}
test('N1-038a','sequential two-speaker timings fit a single skipped-previs shot',()=>{const b=sequentialCandidate();assert.deepEqual(b.production.dialogue_timing.map(t=>t.start_ms),[0,2000]);});
test('N1-038b','skipped previs cannot freeze undeclared overlapping dialogue',()=>{const b=sequentialCandidate();b.production.dialogue_timing[1].start_ms=0;assert.throws(()=>api.validateProductionPackage(b.production,context(b)),/overlap/i);});


function refreshShotBindings(b,shot){
 for(const p of b.previs.filter(p=>p.domain==='target'&&p.shot_refs.some(r=>r.id===shot.id))){p.shot_refs=[ref(shot)];p.input_refs=[ref(shot),...shot.character_refs,shot.scene_ref,...shot.prop_refs,...shot.line_refs];}
 for(const t of b.production.dialogue_timing.filter(t=>t.shot_ref.id===shot.id))t.shot_ref=ref(shot);
 b.production.target_ref=ref(b.target);b.production.previs_refs=b.previs.map(ref);
}
test('N1-038c','skipped previs allows explicitly intentional per-shot overlap',()=>{const b=sequentialCandidate(),s=b.target.shots[0];b.production.dialogue_timing[1].start_ms=0;s.overlapping_dialogue='intentional';refreshShotBindings(b,s);const result=api.validateProductionPackage(b.production,context(b));assert.equal(result.execution_authorized,undefined);assert.equal(result.approved,undefined);});
test('N1-038d','target previs cannot override forbidden target overlap policy',()=>{const b=base(),p=planned(b);api.validatePrevisArtifact(p,context(b));p.overlapping_dialogue='intentional';assert.throws(()=>api.validatePrevisArtifact(p,context(b)),/overlap|policy/i);});
test('N1-038e','target previs must preserve intentional target overlap policy',()=>{const b=base(),s=b.target.shots[0],p=planned(b);s.overlapping_dialogue='intentional';p.overlapping_dialogue='intentional';refreshShotBindings(b,s);api.validatePrevisArtifact(p,context(b));p.overlapping_dialogue='forbidden';assert.throws(()=>api.validatePrevisArtifact(p,context(b)),/overlap|policy/i);});
test('N1-038f','missing target overlap policy cannot silently authorize a choice',()=>{const b=sequentialCandidate();delete b.target.shots[0].overlapping_dialogue;assert.throws(()=>api.validateTargetStoryboard(b.target,b.source));});
test('N1-038g','stale production timing reference after overlap policy change',()=>{const b=sequentialCandidate(),s=b.target.shots[0],oldShotRef=clone(b.production.dialogue_timing[0].shot_ref);s.overlapping_dialogue='intentional';refreshShotBindings(b,s);api.validateProductionPackage(b.production,context(b));b.production.dialogue_timing[0].shot_ref=oldShotRef;assert.throws(()=>api.validateProductionPackage(b.production,context(b)),/production timing shot/);});

test('N1-028','migration reports missing information without fabricating package',()=>{const report=api.auditLegacyMigration(familyFixture);assert.equal(report.lossless,false);assert.equal(report.execution_authorized,false);assert.equal(report.ledger_action,'none');assert.equal(report.candidate_shot_mappings.length,3);assert.ok(report.candidate_shot_mappings.every(x=>x.target_identity===null));for(const missing of ['locatable_source_evidence','source_dialogue_text','source_scene_and_prop_entities','independent_target_shot_ids','versioned_previs','production_package_confirmation'])assert.ok(report.missing.includes(missing),missing);assert.equal(report.source,undefined);assert.equal(report.production,undefined);assert.equal(report.legacy_sha256,hash(familyFixture));});
test('N1-029','legacy approved does not grant new execution',()=>{const p=clone(familyFixture);p.approval={status:'approved',revision:p.revision,approver:'qa-record',approved_at:'2026-09-17T00:00:00Z'};validateAdaptation(p);const result=api.auditLegacyMigration(p);assert.equal(result.execution_authorized,false);assert.equal(result.ledger_action,'none');assert.equal(result.approval,undefined);assert.match(result.discarded_authority,/cannot authorize/);});
test('N1-030a','migration is deterministic and does not mutate frozen input',()=>{const p=deepFreeze(clone(familyFixture)),before=JSON.stringify(p);assert.deepEqual(api.auditLegacyMigration(p),api.auditLegacyMigration(p));assert.equal(JSON.stringify(p),before);});
const nodeModules=await realpath(resolve(root,'node_modules'));
test('N1-030b','migration runs with filesystem writes and child processes denied',()=>{
 const code=`import {auditLegacyMigration} from ${JSON.stringify(pathToFileURL(resolve(root,'dist/src/contracts/workflow-draft.js')).href)}; import {familyFixture} from ${JSON.stringify(pathToFileURL(resolve(root,'dist/src/contracts/fixture.js')).href)}; process.stdout.write(JSON.stringify(auditLegacyMigration(familyFixture)));`;
 const child=spawnSync(process.execPath,['--permission',`--allow-fs-read=${root}`,`--allow-fs-read=${nodeModules}`,'--input-type=module','-e',code],{cwd:out,encoding:'utf8'});
 assert.equal(child.status,0,child.stderr);const report=JSON.parse(child.stdout);assert.equal(report.ledger_action,'none');assert.equal(report.execution_authorized,false);
});
results.push({id:'N1-not-run-host',label:'N5 trusted host execution, N6 DSH workflow and N9 release permission',status:'not_run',reason:'Draft validation conveys no runtime authorization; these runtime modules are outside DP-N1.'});
results.push({id:'N1-not-run-media',label:'Actual source analysis, previs rendering, paid generation and real quality',status:'not_run',reason:'No real source material or budget; metadata fixture only.'});
const self=fileURLToPath(import.meta.url);
const report={implementationCommit,acceptanceHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),acceptanceScriptSha256:createHash('sha256').update(await readFile(self)).digest('hex'),fixtureSha256:hash(base()),mode:'independent_offline_draft_contract',network:'not_used',paidCalls:0,counts:Object.fromEntries(['pass','fail','not_run','blocked'].map(s=>[s,results.filter(r=>r.status===s).length])),results};
await writeFile(resolve(out,'results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({implementationCommit,counts:report.counts,failures:results.filter(r=>r.status==='fail')},null,2));
process.exitCode=report.counts.fail?1:0;
