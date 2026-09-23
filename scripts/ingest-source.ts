import {open,realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {constants} from 'node:fs';
import {importAssistedSource,INGEST_LIMITS} from '../src/ingest/assisted.js';
const [manifestFile,workspace,output]=process.argv.slice(2);
if(!manifestFile||!workspace||!output||process.argv.length!==5) throw new Error('Usage: ingest-source <manifest.json> <workspace-root> <new-output-dir>');
const controller=new AbortController();
const cancel=()=>controller.abort(new Error('Import interrupted'));
process.once('SIGINT',cancel);process.once('SIGTERM',cancel);
try {
 const h=await open(await realpath(resolve(manifestFile)),constants.O_RDONLY|constants.O_NONBLOCK|constants.O_NOFOLLOW);
 let manifest:unknown;
 try {const s=await h.stat();if(!s.isFile()||s.size>INGEST_LIMITS.manifest_bytes||s.size===0)throw new Error('Manifest must be a bounded regular JSON file');const b=Buffer.alloc(INGEST_LIMITS.manifest_bytes+1);let n=0;while(n<b.length){const r=await h.read(b,n,b.length-n,null);if(!r.bytesRead)break;n+=r.bytesRead;}if(n>INGEST_LIMITS.manifest_bytes)throw new Error('Manifest exceeds limit');const text=new TextDecoder('utf-8',{fatal:true}).decode(b.subarray(0,n));manifest=JSON.parse(text);} finally {await h.close();}
 const r=await importAssistedSource({manifest,workspaceRoot:resolve(workspace),outputDir:resolve(output),signal:controller.signal});
 console.log(JSON.stringify({outputDir:r.outputDir,packagePath:r.packagePath,reportPath:r.reportPath,receiptPath:r.receiptPath,recognition:r.receipt.recognition,semantic_quality:r.receipt.semantic_quality},null,2));
} finally {process.removeListener('SIGINT',cancel);process.removeListener('SIGTERM',cancel);}
