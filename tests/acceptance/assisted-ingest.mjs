import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync, spawnSync} from 'node:child_process';
import {chmod, copyFile, mkdir, readFile, readdir, realpath, stat, symlink, writeFile} from 'node:fs/promises';
import {dirname, isAbsolute, join, relative, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

// C-owned checks: import the built public API from one fixed implementation.
// All media is authored locally. No provider/model/network is called.
const root = resolve(process.argv[2] ?? '.');
const out = resolve(process.argv[3] ?? '.runtime/n2-acceptance');
const implementationCommit = process.argv[4];
assert.match(implementationCommit ?? '', /^[a-f0-9]{40}$/, 'Pass a fixed implementation commit');
execFileSync('git', ['cat-file', '-e', `${implementationCommit}^{commit}`], {cwd: root});
const productionPaths = ['src', 'scripts', 'package.json', 'package-lock.json', 'tsconfig.json', 'fixtures'];
assert.equal(execFileSync('git', ['diff', '--name-only', implementationCommit, '--', ...productionPaths], {cwd: root, encoding:'utf8'}).trim(), '', 'Production differs from fixed implementation');
await mkdir(dirname(out), {recursive:true});
await mkdir(out, {recursive:false});
const results = [];
const commands = [];
const clone = value => structuredClone(value);
const fileHash = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const test = async (id, label, fn) => {
  try {await fn(); results.push({id, label, status:'pass'});}
  catch (error) {results.push({id, label, status:'fail', error:error.stack ?? String(error)});}
};
const run = (file,args,options={}) => {
  const result = spawnSync(file,args,{encoding:'utf8',...options});
  commands.push({file,args,status:result.status,signal:result.signal,stdout:result.stdout,stderr:result.stderr,error:result.error?.message});
  assert.equal(result.error, undefined, `${file} could not start`);
  assert.equal(result.status,0,`${file} failed: ${result.stderr}`);
  return result.stdout;
};
const ffmpeg = process.env.FFMPEG_BIN ?? 'ffmpeg';
const ffprobe = process.env.FFPROBE_BIN ?? 'ffprobe';
const input = join(out,'input');
await mkdir(input);
const video = join(input,'source.mp4');
const scriptText = '\uFEFF甲🙂：我还不能进门吗？\r\n乙：这里没有你的座位。\r\n场景：门口，甲被乙阻拦。';
const subtitleText = '\uFEFF1\r\n00:00:00,500 --> 00:00:01,500\r\n甲🙂：我还不能进门吗？\r\n\r\n2\r\n00:00:02,000 --> 00:00:03,000\r\n乙：这里没有你的座位。\r\n';
await writeFile(join(input,'script.txt'), scriptText);
await writeFile(join(input,'dialogue.srt'), subtitleText);
run(ffmpeg,['-nostdin','-v','error','-f','lavfi','-i','color=c=navy:s=160x90:r=25:d=4','-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=4','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-shortest',video]);
const independentProbe = JSON.parse(run(ffprobe,['-v','error','-count_frames','-show_streams','-show_format','-of','json',video]));
const initialInputHashes = Object.fromEntries(await Promise.all(['source.mp4','script.txt','dialogue.srt'].map(async name=>[name,await fileHash(join(input,name))])));
const base = () => ({
  ingest_manifest_version:'0.1.0',source_package:{id:'c-authored-source',revision:1,source_locale:'zh-CN'},
  assets:[
    {id:'video',revision:1,path:'source.mp4',media_kind:'video',evidence:'fixture'},
    {id:'script',revision:1,path:'script.txt',media_kind:'script',evidence:'fixture'},
    {id:'subtitles',revision:1,path:'dialogue.srt',media_kind:'subtitles',evidence:'fixture',video_asset_id:'video'},
  ],
  annotations:{
    evidence:[
      {kind:'source_evidence',id:'ev-video',revision:1,source_asset_id:'video',locator:{kind:'time',start_ms:0,end_ms:4000},statement:'C-authored four-second technical colour and tone fixture; it does not depict actors.',epistemic_status:'observed',evidence:'fixture',method:'authored_fixture',uncertainties:[]},
      {kind:'source_evidence',id:'ev-script',revision:1,source_asset_id:'script',locator:{kind:'text',start_char:1,end_char_exclusive:scriptText.length},statement:'Authored source script specifies two fictional speakers and a doorway exclusion.',epistemic_status:'observed',evidence:'fixture',method:'authored_fixture',uncertainties:[]},
      {kind:'source_evidence',id:'ev-inference',revision:1,source_asset_id:'script',locator:{kind:'text',start_char:scriptText.indexOf('座位'),end_char_exclusive:scriptText.indexOf('座位')+2},statement:'The refusal may express family exclusion; this is an inference, not an observed relationship.',epistemic_status:'inferred',evidence:'fixture',method:'authored_fixture',uncertainties:['The family relationship is not specified in this authored source.']},
    ],
    characters:[{kind:'source_character',id:'c1',revision:1,description:'Fictional adult named 甲🙂 in the authored script',evidence_ids:['ev-script']},{kind:'source_character',id:'c2',revision:1,description:'Fictional adult named 乙 in the authored script',evidence_ids:['ev-script']}],
    relations:[{kind:'source_relation',id:'r1',revision:1,from_character_id:'c1',to_character_id:'c2',description:'Possible family relationship; uncertain',evidence_ids:['ev-inference']}],
    dialogue:[],scenes:[{kind:'source_scene',id:'door',revision:1,description:'Authored doorway; not visible in this colour fixture',evidence_ids:['ev-script']}],props:[],
    beats:[{kind:'source_beat',id:'b1',revision:1,description:'The authored first speaker is excluded',required:true,source_shot_ids:['s1'],evidence_ids:['ev-script']}],
    storyboard:{kind:'source_storyboard',id:'storyboard',revision:1,shots:[{kind:'source_shot',id:'s1',revision:1,source_asset_id:'video',source_in_ms:0,source_out_ms:4000,character_ids:['c1','c2'],dialogue_ids:[],scene_id:'door',prop_ids:[],action:'Authored manual shot assignment; technical media contains only colour and tone.',evidence_ids:['ev-video','ev-script']}]},
    unknowns:['Actual acting, visual identity, language performance, culture and localization quality are not tested.'],
  },preparation:{declared_minutes:null,notes:'C independently authored local test inputs; no external source material or model analysis.'},
});


const {importAssistedSource, ASSISTED_INGEST_VERSION, INGEST_LIMITS} = await import(pathToFileURL(join(root,'dist/src/ingest/assisted.js')).href);
const {workflowHash, validateSourceAssetPackage} = await import(pathToFileURL(join(root,'dist/src/contracts/workflow-draft.js')).href);
const exists = async path => {try {await stat(path); return true;} catch(error) {if(error.code==='ENOENT') return false; throw error;}};
let sequence = 0;
const executeImport = async (manifest=base(), options={}) => {
  const outputDir = options.outputDir ?? join(out,`import-${String(++sequence).padStart(3,'0')}`);
  const result = await importAssistedSource({manifest, workspaceRoot:input, outputDir, tools:{ffprobe}, ...options});
  return result;
};
const rejectManifest = async (id, label, mutate, options={}) => test(id,label,async()=>{
  const manifest=base(); await mutate(manifest);
  const outputDir=join(out,`rejected-${id}`);
  await assert.rejects(()=>executeImport(manifest,{...options,outputDir}));
  assert.equal(await exists(outputDir),false,'Rejected import left an output directory or a misleading completed snapshot');
});
const rejectPath = async (id,label,path) => rejectManifest(id,label,m=>{m.assets[0].path=path;});
const pkgText = JSON.parse(await readFile(join(root,'package.json'),'utf8'));
const versions={node:process.version, ffmpeg:run(ffmpeg,['-version']).split('\n')[0], ffprobe:run(ffprobe,['-version']).split('\n')[0], package:pkgText.version};
await writeFile(join(out,'prepared-inputs.json'),JSON.stringify({implementationCommit,independentProbe,initialInputHashes,manifest:base(),versions},null,2)+'\n');
let accepted;
await test('N2-001a','Complete independently authored MP4/script/SRT/manual annotation imports',async()=>{
  accepted=await executeImport();
  assert.equal(accepted.receipt.status,'complete'); assert.equal(accepted.receipt.mode,'assisted');
  assert.equal(accepted.receipt.recognition,'not_run'); assert.equal(accepted.receipt.semantic_quality,'unverified');
  assert.equal(accepted.sourcePackage.assets.length,3); assert.equal(accepted.sourcePackage.characters.length,2);
  validateSourceAssetPackage(accepted.sourcePackage);
});
if(accepted) {
  const {sourcePackage:p,receipt:r}=accepted;
  const html=await readFile(accepted.reportPath,'utf8');
  await test('N2-001b','Persisted package and receipt exactly match API objects',async()=>{
    assert.deepEqual(JSON.parse(await readFile(accepted.packagePath,'utf8')),p);
    assert.deepEqual(JSON.parse(await readFile(accepted.receiptPath,'utf8')),r);
    assert.equal(await exists(join(accepted.outputDir,'.incomplete')),false);
    assert.deepEqual(p.dialogue,[]); assert.equal(p.target_storyboard,undefined);
  });
  await test('N2-002a','Real byte hash matches source, copied asset, package and receipt',async()=>{
    for(const a of p.assets){
      const inputAsset=base().assets.find(x=>x.id===a.id); const snapshot=join(accepted.outputDir,a.uri);
      const record=r.assets.find(x=>x.id===a.id);
      assert.equal(a.sha256,initialInputHashes[inputAsset.path]); assert.equal(await fileHash(snapshot),a.sha256);
      assert.equal(record.sha256,a.sha256); assert.equal(record.bytes,(await stat(snapshot)).size);
      assert.equal(isAbsolute(a.uri),false); assert.equal(a.uri.includes('..'),false);
      assert.deepEqual(await readFile(snapshot),await readFile(join(input,inputAsset.path)));
    }
  });
  await test('N2-002b','Video metadata matches an independent actual ffprobe process',()=>{
    const independent=independentProbe.streams.find(s=>s.codec_type==='video');
    const a=p.assets.find(x=>x.id==='video'),v=r.assets.find(x=>x.id==='video').probe;
    assert.equal(a.duration_ms,Math.floor(Number(independent.duration)*1000+1e-6));
    assert.equal(a.frame_count,Number(independent.nb_read_frames)); assert.equal(a.frame_count,100);
    assert.equal(v.width,160); assert.equal(v.height,90); assert.equal(v.codec,independent.codec_name);
    assert.equal(v.avg_frame_rate,independent.avg_frame_rate); assert.equal(v.audio_streams,1);
  });
  await test('N2-002c','Evidence and shot bind independently computed actual asset hash',()=>{
    for(const e of p.evidence) assert.equal(e.source_asset_sha256,p.assets.find(a=>a.id===e.source_asset_id).sha256);
    for(const shot of p.storyboard.shots) assert.equal(shot.source_asset_sha256,p.assets.find(a=>a.id===shot.source_asset_id).sha256);
    assert.equal(r.source_package_sha256,workflowHash(p)); assert.equal(r.manifest_sha256,workflowHash(base()));
  });
  await test('N2-006a','SRT carries exact original spans, milliseconds and unknown speakers',()=>{
    const subs=r.assets.find(a=>a.id==='subtitles').subtitles;
    assert.equal(subs.video_asset_id,'video'); assert.equal(subs.offset_unit,'utf16_code_units');
    assert.equal(subs.cues.length,2); assert.deepEqual(subs.cues.map(c=>[c.start_ms,c.end_ms]),[[500,1500],[2000,3000]]);
    for(const cue of subs.cues){assert.equal(cue.text,subtitleText.slice(cue.start_char,cue.end_char_exclusive)); assert.equal(cue.speaker,null);}
    assert.equal(subs.cues[0].text,'甲🙂：我还不能进门吗？'); assert.equal(p.dialogue.length,0);
  });
  await test('N2-008a','BOM, CRLF and emoji UTF-16 offset convention retained',()=>{
    assert.equal(r.offset_unit,'utf16_code_units'); assert.equal(p.assets.find(a=>a.id==='script').char_count,scriptText.length);
    assert.equal(p.assets.find(a=>a.id==='subtitles').char_count,subtitleText.length);
    const ev=p.evidence.find(e=>e.id==='ev-inference'); assert.equal(scriptText.slice(ev.locator.start_char,ev.locator.end_char_exclusive),'座位');
  });
  await test('N2-009a','Inference, method and uncertainty survive package and visible HTML',()=>{
    const ev=p.evidence.find(e=>e.id==='ev-inference'); assert.equal(ev.epistemic_status,'inferred');
    assert.deepEqual(ev.uncertainties,base().annotations.evidence[2].uncertainties);
    assert.ok(html.includes(ev.statement)); assert.ok(html.includes(ev.uncertainties[0]));
    assert.match(html,/inferred|推断/); assert.match(html,/observed|观察/); assert.match(html,/人工|assisted/);
    assert.ok(!html.includes('semantic_quality&quot;: &quot;pass'));
  });
  await test('N2-012a','Report uses only local relative snapshot media links',()=>{
    const refs=[...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map(m=>m[1]);
    assert.ok(refs.some(ref=>ref.includes('assets/000.mp4')));
    for(const ref of refs){assert.ok(!/^(?:https?:|javascript:|file:|data:|\/\/)/i.test(ref)); assert.equal(isAbsolute(ref),false);}
  });
  await test('N2-013a','Existing completed output cannot be overwritten',async()=>{
    const before=await fileHash(accepted.receiptPath);
    await assert.rejects(()=>executeImport(base(),{outputDir:accepted.outputDir}));
    assert.equal(await fileHash(accepted.receiptPath),before);
  });
  await test('N2-016a','No white-model, target assets or permission silently produced',()=>{
    assert.equal(p.previs,undefined); assert.equal(p.target,undefined); assert.equal(p.approved,undefined);
    assert.equal(r.execution_authorized,undefined); assert.equal(r.recognition,'not_run');
    assert.ok(r.warnings.length>0); assert.equal(r.preparation.declared_minutes,null);
  });
} else results.push({id:'N2-POSITIVE-DEPENDENTS',label:'Output-dependent checks blocked by failed full positive control',status:'blocked'});

for(const [field,value] of [['sha256','a'.repeat(64)],['duration_ms',999],['frame_count',999],['char_count',999]])
  await rejectManifest(`N2-002-${field}`,`Caller cannot supply forged ${field}`,m=>{m.assets[0][field]=value;});
await test('N2-003a','Real MOV container imports with independent metadata',async()=>{
  run(ffmpeg,['-nostdin','-v','error','-i',video,'-c','copy',join(input,'source.mov')]);
  const m=base();m.assets[0].path='source.mov';const got=await executeImport(m);
  assert.equal(got.receipt.assets[0].sha256,await fileHash(join(input,'source.mov')));
  assert.equal(got.sourcePackage.assets[0].duration_ms,4000);
});
await writeFile(join(input,'empty.mp4'),''); await writeFile(join(input,'corrupt.mp4'),'not a video'); await mkdir(join(input,'directory.mp4'));
for(const [id,label,path] of [['b','Missing file','missing.mp4'],['c','Empty file','empty.mp4'],['d','Corrupt media','corrupt.mp4'],['e','Directory instead of media','directory.mp4']])
  await rejectPath(`N2-003${id}`,label,path);
for(const [suffix,label,edit] of [
  ['a','Negative source start',m=>m.annotations.storyboard.shots[0].source_in_ms=-1],
  ['b','Zero shot duration',m=>m.annotations.storyboard.shots[0].source_out_ms=0],
  ['c','Shot past actual video duration',m=>m.annotations.storyboard.shots[0].source_out_ms=4001],
  ['d','Overlapping source shots',m=>{const s=clone(m.annotations.storyboard.shots[0]);s.id='s2';s.source_in_ms=3000;m.annotations.storyboard.shots.push(s);}],
  ['e','Out-of-order nonoverlapping shots',m=>{const s=clone(m.annotations.storyboard.shots[0]);s.id='s2';s.source_in_ms=0;s.source_out_ms=2000;m.annotations.storyboard.shots[0].source_in_ms=2000;m.annotations.storyboard.shots.push(s);}],
]) await rejectManifest(`N2-004${suffix}`,label,edit);
for(const [suffix,label,edit] of [
 ['a','Evidence missing asset',m=>m.annotations.evidence[0].source_asset_id='missing'],
 ['b','Character missing evidence',m=>m.annotations.characters[0].evidence_ids=['missing']],
 ['c','Shot missing character',m=>m.annotations.storyboard.shots[0].character_ids=['missing']],
 ['d','Shot missing scene',m=>m.annotations.storyboard.shots[0].scene_id='missing'],
 ['e','Shot missing dialogue',m=>m.annotations.storyboard.shots[0].dialogue_ids=['missing']],
 ['f','Beat missing shot',m=>m.annotations.beats[0].source_shot_ids=['missing']],
 ['g','Duplicate asset id',m=>m.assets[1].id='video'],
 ['h','Duplicate evidence id',m=>m.annotations.evidence[1].id='ev-video'],
 ['i','Duplicate character id',m=>m.annotations.characters[1].id='c1'],
 ['j','Relation missing character',m=>m.annotations.relations[0].to_character_id='missing'],
 ['k','Shot missing asset',m=>m.annotations.storyboard.shots[0].source_asset_id='missing'],
 ['l','Shot missing prop',m=>m.annotations.storyboard.shots[0].prop_ids=['missing']],
 ['m','Subtitles bound to missing video',m=>m.assets[2].video_asset_id='missing'],
 ['n','Subtitles bound to text',m=>m.assets[2].video_asset_id='script'],
]) await rejectManifest(`N2-005${suffix}`,label,edit);
const srtCases=[
 ['b','Nonconsecutive SRT indices',subtitleText.replace('2\r\n00:','3\r\n00:')],
 ['c','Invalid timestamp seconds',subtitleText.replace('00:00:00,500','00:00:60,500')],
 ['d','Reversed SRT interval',subtitleText.replace('00:00:01,500','00:00:00,400')],
 ['e','SRT past actual video end',subtitleText.replace('00:00:03,000','00:00:04,001')],
 ['f','SRT start order reversed',subtitleText.replace('00:00:02,000','00:00:00,200')],
 ['g','Empty SRT cue',subtitleText.replace('乙：这里没有你的座位。','')],
 ['h','Unsupported bare-CR line endings',subtitleText.replaceAll('\r\n','\r')],
];
for(const [suffix,label,content] of srtCases){
 const path=`invalid-${suffix}.srt`; await writeFile(join(input,path),content);
 await rejectManifest(`N2-006${suffix}`,label,m=>{m.assets[2].path=path;});
}
await test('N2-006i','Overlapping subtitles remain explicit warnings and unknown speakers',async()=>{
  await writeFile(join(input,'overlap.srt'),subtitleText.replace('00:00:02,000','00:00:01,000'));
  const m=base();m.assets[2].path='overlap.srt';const got=await executeImport(m);
  assert.deepEqual(got.receipt.assets.find(a=>a.id==='subtitles').subtitles.overlaps,[{first:1,second:2}]);
  assert.ok(got.receipt.warnings.some(w=>/重叠|overlap/.test(w)));
  assert.ok(got.receipt.assets.find(a=>a.id==='subtitles').subtitles.cues.every(c=>c.speaker===null));
});
await test('N2-007a','Explicitly supplied source dialogue retains human speaker/evidence binding',async()=>{
  const m=base();m.annotations.dialogue=[{kind:'source_dialogue',id:'d1',revision:1,speaker_character_id:'c1',text:'我还不能进门吗？',evidence_ids:['ev-script']}];
  m.annotations.storyboard.shots[0].dialogue_ids=['d1'];const got=await executeImport(m);
  assert.deepEqual(got.sourcePackage.dialogue,m.annotations.dialogue);
  assert.equal(got.receipt.assets.find(a=>a.id==='subtitles').subtitles.cues[0].speaker,null);
});
await rejectManifest('N2-007b','Manual source dialogue with nonexistent speaker rejected',m=>{m.annotations.dialogue=[{kind:'source_dialogue',id:'d1',revision:1,speaker_character_id:'missing',text:'x',evidence_ids:['ev-script']}];});
await writeFile(join(input,'bad-utf8.txt'),Buffer.from([0xc3,0x28])); await writeFile(join(input,'nul.txt'),'hello\0world');
await rejectManifest('N2-008b','Malformed UTF-8 rejected rather than replaced',m=>{m.assets[1].path='bad-utf8.txt';});
await rejectManifest('N2-008c','NUL-containing text rejected',m=>{m.assets[1].path='nul.txt';});
const surrogate=scriptText.indexOf('🙂')+1;
await rejectManifest('N2-008d','Text start cannot split surrogate pair',m=>{m.annotations.evidence[1].locator.start_char=surrogate;});
await rejectManifest('N2-008e','Text end cannot split surrogate pair',m=>{m.annotations.evidence[1].locator.end_char_exclusive=surrogate;});
await test('N2-008f','Combining characters preserve exact decoded code-unit offsets',async()=>{
  const content='e\u0301甲🙂';await writeFile(join(input,'combining.txt'),content);const m=base();m.assets[1].path='combining.txt';
  for(const ev of m.annotations.evidence.filter(e=>e.source_asset_id==='script'))ev.locator={kind:'text',start_char:0,end_char_exclusive:content.length};
  const got=await executeImport(m);assert.equal(got.sourcePackage.assets.find(a=>a.id==='script').char_count,content.length);
});
for(const [suffix,label,edit] of [
 ['b','Inference requires uncertainty',m=>m.annotations.evidence[2].uncertainties=[]],
 ['c','Approximate reconstruction cannot be observed',m=>m.annotations.evidence[0].method='approximate_reconstruction'],
 ['d','Fixture cannot claim live source',m=>m.assets[0].evidence='live'],
 ['e','Assisted import cannot claim automatic analysis',m=>m.annotations.evidence[0].method='automatic_analysis'],
 ['f','Evidence provenance must match imported asset',m=>m.annotations.evidence[0].evidence='external_manual'],
]) await rejectManifest(`N2-009${suffix}`,label,edit);
await test('N2-009g','Explicit reconstructed state with uncertainty remains approximate',async()=>{
 const m=base();m.annotations.evidence[2].epistemic_status='reconstructed';m.annotations.evidence[2].method='approximate_reconstruction';
 const got=await executeImport(m);assert.equal(got.sourcePackage.evidence[2].epistemic_status,'reconstructed');
 assert.match(await readFile(got.reportPath,'utf8'),/reconstructed|重建/);
});
await test('N2-009h','Creator-supplied external manual metadata remains unverified',async()=>{
 const m=base();for(const a of m.assets)a.evidence='external_manual';for(const e of m.annotations.evidence){e.evidence='external_manual';e.method='creator_supplied';}
 const got=await executeImport(m);assert.equal(got.receipt.semantic_quality,'unverified');assert.equal(got.receipt.recognition,'not_run');
});
for(const [suffix,label,path] of [
 ['a','Absolute input path',video],['b','Traversal input path','../input/source.mp4'],['c','HTTP path','https://example.invalid/video.mp4'],
 ['d','File URL',pathToFileURL(video).href],['e','Windows path','C:\\video.mp4'],['f','Dot segment','./source.mp4'],['g','Empty segment','dir//source.mp4'],
]) await rejectPath(`N2-010${suffix}`,label,path);
await symlink(video,join(input,'internal-link.mp4')); await symlink(dirname(input),join(input,'escape'));
await rejectPath('N2-010h','Asset symlink rejected even inside workspace','internal-link.mp4');
await rejectPath('N2-010i','Parent symlink escape rejected','escape/input/source.mp4');
await mkdir(join(input,'nested'));await copyFile(video,join(input,'nested','source.mp4'));
await test('N2-010j','Normal nested relative file imports',async()=>{const m=base();m.assets[0].path='nested/source.mp4';await executeImport(m);});
for(const [suffix,label,edit] of [
 ['a','Text span cannot refer to video',m=>m.annotations.evidence[0].locator={kind:'text',start_char:0,end_char_exclusive:1}],
 ['b','Frame span cannot refer to script',m=>m.annotations.evidence[1].locator={kind:'frames',start_frame:0,end_frame_exclusive:1}],
 ['c','Text span past real text length',m=>m.annotations.evidence[1].locator.end_char_exclusive=scriptText.length+1],
 ['d','Frame span past actual probed frames',m=>m.annotations.evidence[0].locator={kind:'frames',start_frame:0,end_frame_exclusive:101}],
 ['e','Time evidence past video end',m=>m.annotations.evidence[0].locator.end_ms=4001],
]) await rejectManifest(`N2-011${suffix}`,label,edit);
await test('N2-011f','Actual video frame evidence remains resolvable',async()=>{const m=base();m.annotations.evidence[0].locator={kind:'frames',start_frame:0,end_frame_exclusive:100};await executeImport(m);});
await test('N2-012b','HTML escapes hostile annotation and source text',async()=>{
 const attack='<img src=x onerror="alert(1)"><script>alert(2)</script>';
 await writeFile(join(input,'hostile.txt'),attack);const m=base();m.assets[1].path='hostile.txt';
 for(const ev of m.annotations.evidence.filter(e=>e.source_asset_id==='script'))ev.locator={kind:'text',start_char:0,end_char_exclusive:attack.length};
 m.annotations.characters[0].description=attack;m.annotations.evidence[1].statement=attack;m.preparation.notes=attack;
 const got=await executeImport(m),html=await readFile(got.reportPath,'utf8');
 assert.ok(!html.includes(attack)); assert.ok(!html.includes('<script>alert(2)</script>'));assert.ok(html.includes('&lt;img'));
 assert.ok(!html.includes('onerror="alert(1)"'));
});
await test('N2-012c','User filename does not become executable report HTML',async()=>{
 const filename='<img onerror=alert(3)>.mp4';await copyFile(video,join(input,filename));const m=base();m.assets[0].path=filename;
 const got=await executeImport(m),html=await readFile(got.reportPath,'utf8');assert.ok(!html.includes('<img onerror=alert(3)>'));assert.equal(got.sourcePackage.assets[0].uri,'assets/000.mp4');
});
await test('N2-013b','Existing unrelated directory and sentinel preserved',async()=>{
 const directory=join(out,'existing-user-data');await mkdir(directory);await writeFile(join(directory,'keep.txt'),'DO NOT CHANGE');
 await assert.rejects(()=>executeImport(base(),{outputDir:directory}));assert.equal(await readFile(join(directory,'keep.txt'),'utf8'),'DO NOT CHANGE');assert.deepEqual(await readdir(directory),['keep.txt']);
});
await test('N2-014a','Pre-abort rejects without creating output',async()=>{
 const controller=new AbortController();controller.abort();const directory=join(out,'pre-aborted');
 await assert.rejects(()=>executeImport(base(),{outputDir:directory,signal:controller.signal}));assert.equal(await exists(directory),false);
});
await test('N2-014b','Abort while real probe starts removes incomplete owned import',async()=>{
 const controller=new AbortController(),directory=join(out,'mid-aborted');
 const promise=executeImport(base(),{outputDir:directory,signal:controller.signal});
 const timer=setInterval(async()=>{if(await exists(join(directory,'assets','000.mp4')))controller.abort();},1);
 try{await assert.rejects(()=>promise);assert.equal(await exists(directory),false);}finally{clearInterval(timer);}
});
await test('N2-016b','Model-approved field cannot authorize import execution',async()=>{
 const m=base();m.approved=true;await assert.rejects(()=>executeImport(m));
});
await test('N2-016c','Source manifest rejects target-only additions',async()=>{
 const m=base();m.annotations.target_storyboard={approved:true};await assert.rejects(()=>executeImport(m));
});
await test('N2-017a','Frozen contracts, runtime, providers, DSH, lockfile remain byte-identical',async()=>{
 const frozenSourceHashes={
  "package-lock.json": "92f1aff81df58c8ebf386936eff6b82f395b30736c55deedb932ca0ae85b5f1b",
  "src/contracts/contracts.test.ts": "cd119b06e12eec062d7c312ea3e7eb193e23b59a5c0f07502cc8204b5b8208d3",
  "src/contracts/episode.test.ts": "dd408f5f38116418032ff84f0f466a283e78d1087ba35fc1ee08fda11b70efad",
  "src/contracts/fixture.ts": "42e5bda985d39560ba3485f8ab7439e9e31ffedfa9dfbf6f778a7eeddb3e5d65",
  "src/contracts/index.ts": "95eb9d0be375b29c4d6f6f89961b8d8cf780a1c1b641840a3296575b890e66b7",
  "src/contracts/validate.ts": "dfe77b73b3c3433a5afbe609de8cf7ec2f504a6568875220b0dc2ca795ba0f43",
  "src/contracts/workflow-draft.test.ts": "f139d169b7e7f88f93f21a11bc811c60200e06f464ffc7bc8f5209b74c4d097a",
  "src/contracts/workflow-draft.ts": "f44648f0b1ab7f0003ec7332878b048fec9d6a128ee53941e3abbb69115d3f59",
  "src/contracts/workflow-fixture.ts": "f0f68a1735db995b45be46453839aab09c8ea00968a82b1f28d60bae56eb1b7e",
  "src/dsh/index.ts": "9d8c6e34b0b31e1f03e090082cfa9c487b62f2cc0834b944ae7d16c7559b6e06",
  "src/media/local.test.ts": "fcc22ace27d8b44928068b3ed1be46b6da4cc9e5414610be53bddecf3912cd52",
  "src/media/local.ts": "2f2b5b18849ea3ea22449aefafb91dc4ff2771eb82a21eb561a7c88b1f6ab95c",
  "src/media/timeline.test.ts": "c2b13f3e7ad3d4b6e43b7ca81fb89a86c9fc525d3a2ede48da375d774dfde295",
  "src/media/timeline.ts": "84533fbe5d971b8f951f7bdd33fc4d018e079b20f9f169451a92e14326f2f5f1",
  "src/orchestration/README.md": "a6af2ad033bbbf35e8e63838f1675caf77d39c20d13348c8ec381431c55c7d29",
  "src/orchestration/authorization.test.ts": "ab1af7633d29f895df4d2aef8e1b8d4608d398757fc0490455e87cdcd13f3722",
  "src/orchestration/authorization.ts": "e08ee843f324bdd6c4db6f1374738a0729ff1470f15ba5322e3c91d02f81a172",
  "src/orchestration/jobs.test.ts": "720b5fa4e4ce95dca2acdb0c80ddba6a49db400547b53bb6c85315f343fe2f0a",
  "src/orchestration/jobs.ts": "e2e5815d4e5018b3f9926a14c4eafc7abe6f40be77caf1784723e712d1a07f7d",
  "src/orchestration/runtime.ts": "bcdaa0e4aa2d25f0809bdf873e74c76edc9b1a7ce61e26d83b19df3026fa0133",
  "src/orchestration/store.ts": "4f83c86ff83fa64ddd6ca62f3269fde002e863505451765a7afb276b3a36f1a0",
  "src/orchestration/test-support.ts": "7350db5119de713314ae1077a0c96dc9d18821a14178f2cc761d96ca2d944ba3",
  "src/orchestration/worker.ts": "932e145f29060ad5cf002dd7c59fc4cb0b3d2b925ae261bf0a6c49da1f577ee5",
  "src/providers/CONSTRAINTS.md": "fa7d23dc504fee2207b0b29abf0120ab1fd3e8967fe59ab5fd6c844a7f5127ba",
  "src/providers/README.md": "e4801526a7f6eb9d6406c5f7951ab2b0431a276fc3dcc1b3434b1b7b5f2d3f9a",
  "src/providers/mock.test.ts": "152e24d0c48d43f6eefe904dc34f42791f50b79ac63ad89ddf94bc7327b9c79c",
  "src/providers/mock.ts": "d30d075e61c716c3bf0e7172ca61d4ce498c977be113cf9a5a4d580998f18cbf",
  "src/providers/smoke.ts": "bfd09b5e0191e9ba48985504f00bfe1c92ed066a428c6c79f51b6b6eb06d51cc"
};
 for(const [path,expected] of Object.entries(frozenSourceHashes))assert.equal(await fileHash(join(root,path)),expected,`Frozen baseline changed: ${path}`);
});
await test('N2-015a','All original inputs remain byte-identical after complete matrix',async()=>{
 for(const [name,hash] of Object.entries(initialInputHashes))assert.equal(await fileHash(join(input,name)),hash);
});
if(accepted)await test('N2-015b','Independent copied snapshot survives later source edits',async()=>{
 const original=await readFile(join(input,'script.txt'));await writeFile(join(input,'script.txt'),'changed after import');
 try{const a=accepted.sourcePackage.assets.find(a=>a.id==='script');assert.equal(await fileHash(join(accepted.outputDir,a.uri)),initialInputHashes['script.txt']);assert.equal(accepted.receipt.assets.find(x=>x.id==='script').sha256,initialInputHashes['script.txt']);}
 finally{await writeFile(join(input,'script.txt'),original);}
});

await test('N2-018a','Public package export resolves assisted-source import',async()=>{
  assert.equal(pkgText.exports['./assisted-ingest'],'./dist/src/ingest/assisted.js');
});
const cli=join(root,'dist/scripts/ingest-source.js');
const manifestPath=join(input,'manifest.json');await writeFile(manifestPath,JSON.stringify(base(),null,2));
await test('N2-018b','Actual compiled CLI imports complete local fixture',async()=>{
  const output=join(out,'cli-success');
  const stdout=run(process.execPath,[cli,manifestPath,input,output],{cwd:root,env:{...process.env,DRAMAPILOT_FFPROBE:ffprobe}});
  const record=JSON.parse(stdout);assert.equal(record.recognition,'not_run');assert.equal(record.semantic_quality,'unverified');
  assert.equal(JSON.parse(await readFile(record.receiptPath,'utf8')).status,'complete');
  assert.equal(await fileHash(join(output,'assets/000.mp4')),initialInputHashes['source.mp4']);
});
const failCli=(args)=>{
 const result=spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8',env:{...process.env,DRAMAPILOT_FFPROBE:ffprobe}});
 commands.push({file:process.execPath,args:[cli,...args],status:result.status,signal:result.signal,stdout:result.stdout,stderr:result.stderr});
 assert.notEqual(result.status,0);assert.equal(result.error,undefined);assert.equal(result.stdout.trim(),'');
};
await test('N2-018c','CLI missing arguments fails without success receipt',()=>failCli([]));
await test('N2-018d','CLI malformed JSON fails without output',async()=>{
 const path=join(input,'bad.json');await writeFile(path,'{broken');const output=join(out,'bad-json');failCli([path,input,output]);assert.equal(await exists(output),false);
});
await test('N2-018e','CLI malformed UTF-8 manifest fails without output',async()=>{
 const path=join(input,'utf8.json');await writeFile(path,Buffer.from([0xc3,0x28]));const output=join(out,'bad-manifest-utf8');failCli([path,input,output]);assert.equal(await exists(output),false);
});
await test('N2-018f','CLI rejects oversized manifest before import',async()=>{
 const path=join(input,'large.json');await writeFile(path,' '.repeat(INGEST_LIMITS.manifest_bytes+1));const output=join(out,'bad-manifest-size');failCli([path,input,output]);assert.equal(await exists(output),false);
});
await test('N2-018g','CLI existing user output preserved',async()=>{
 const output=join(out,'cli-existing');await mkdir(output);await writeFile(join(output,'keep'),'keep');failCli([manifestPath,input,output]);assert.deepEqual(await readdir(output),['keep']);
});
await rejectManifest('N2-019a','Missing configured probe fails and cleans owned snapshot',()=>{}, {tools:{ffprobe:join(out,'nonexistent-probe')}});
await writeFile(join(input,'oversized.txt'),'x'.repeat(INGEST_LIMITS.text_bytes+1));
await rejectManifest('N2-019b','Text file byte limit enforced',m=>{m.assets[1].path='oversized.txt';});
await rejectManifest('N2-019c','Manifest asset-count limit enforced',m=>{for(let n=m.assets.length;n<INGEST_LIMITS.assets+1;n++)m.assets.push({...m.assets[0],id:`video-${n}`});});
await test('N2-019d','Audio-only MP4 rejected as source video',async()=>{
 const path=join(input,'audio-only.mp4');run(ffmpeg,['-nostdin','-v','error','-f','lavfi','-i','sine=frequency=400:duration=4','-c:a','aac',path]);
 const m=base();m.assets[0].path='audio-only.mp4';const output=join(out,'audio-only-rejected');
 await assert.rejects(()=>executeImport(m,{outputDir:output}));assert.equal(await exists(output),false);
});
await test('N2-019e','Multiple video streams rejected explicitly',async()=>{
 const path=join(input,'multi-video.mp4');run(ffmpeg,['-nostdin','-v','error','-i',video,'-map','0:v:0','-map','0:v:0','-c','copy',path]);
 const m=base();m.assets[0].path='multi-video.mp4';const output=join(out,'multi-video-rejected');
 await assert.rejects(()=>executeImport(m,{outputDir:output}));assert.equal(await exists(output),false);
});
for(const [id,label] of [
 ['N2-NR1','Automatic ASR/scene recognition/semantic source analysis are not implemented'],
 ['N2-NR2','Rendered source/target previs, target production, paid generation and real quality are outside N2'],
 ['N2-NR3','New DSH stage tools, trusted production and release grants are later stages'],
])results.push({id,label,status:'not_run'});
const counts=Object.fromEntries(['pass','fail','not_run','blocked'].map(status=>[status,results.filter(r=>r.status===status).length]));
const summary={implementationCommit,acceptanceDriverSha256:await fileHash(fileURLToPath(import.meta.url)),tested_at:new Date().toISOString(),cost_mode:'local_authored_fixture_no_paid_calls',versions,counts,results};
await writeFile(join(out,'commands.json'),JSON.stringify(commands,null,2)+'\n');
await writeFile(join(out,'results.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({out,implementationCommit,counts,failures:results.filter(r=>r.status==='fail')},null,2));
process.exitCode=counts.fail||counts.blocked?1:0;
