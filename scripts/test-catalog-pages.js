#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const pages=['ai.html','ai-navody.html','ai-novinky.html','ai-agenti.html','chatgpt-pro-ucitele.html','gemini-notebook.html'];
const read=p=>fs.readFileSync(path.join(root,p));
const digest=b=>require('node:crypto').createHash('sha256').update(b).digest('hex');
const before=Object.fromEntries(pages.map(p=>[p,digest(read(p))]));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/site-articles.js'),'utf8'),context);
const original=context.window.siteArticles;
const agent=original.find(x=>x.topics?.includes('ai-agents'));
if(!Array.isArray(original)||!agent)throw new Error('Expected production catalog and AI-agent entry');
const cases=[
 ['missing required field',data=>{delete data[0].summary;},'missing or invalid summary'],
 ['duplicate href',data=>{data[1].href=data[0].href;},'Duplicate catalog href'],
 ['invalid ISO date',data=>{data[0].date='2026-02-30';},'invalid ISO date'],
 ['duplicate directory order',data=>{const matches=data.filter(x=>x.topics?.includes('ai-agents'));matches[1].directoryOrder=matches[0].directoryOrder;},'Duplicate directoryOrder'],
 ['missing article target',data=>{data[0].href='wave19-missing-target.html';},'Missing or invalid article target'],
 ['invalid AI-agent group',data=>{const x=data.find(x=>x.topics?.includes('ai-agents'));x.directoryGroup='Neznámá skupina';},'invalid or missing directoryGroup']
];
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'catalog-generator-negative-'));
const results=[];
try{
 for(const [name,mutate,expected] of cases){
  const data=JSON.parse(JSON.stringify(original));mutate(data);
  const input=path.join(temp,name.replaceAll(' ','-')+'.js');
  const output=path.join(temp,name.replaceAll(' ','-')+'-out');
  fs.writeFileSync(input,'window.siteArticles = '+JSON.stringify(data)+';');
  const run=spawnSync(process.execPath,[path.join(root,'scripts/build-catalog-pages.js'),'--catalog-file',input,'--output-dir',output],{cwd:root,encoding:'utf8'});
  const message=(run.stderr||'')+(run.stdout||'');
  if(run.status===0||!message.includes(expected))throw new Error(name+' did not fail as expected. status='+run.status+' output='+message);
  results.push({name,status:'passed',expectedError:expected});
 }
 const after=Object.fromEntries(pages.map(p=>[p,digest(read(p))]));
 if(JSON.stringify(before)!==JSON.stringify(after))throw new Error('Negative tests modified committed catalog outputs');
 process.stdout.write(JSON.stringify({status:'passed',productionOutputsUnchanged:true,cases:results},null,2)+'\n');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
