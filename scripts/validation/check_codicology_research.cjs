const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const window={};vm.runInNewContext(fs.readFileSync('assets/js/explore/modules/codicology-research.js','utf8'),{window,Intl,console});
const create=window.ExploreCodicologyResearch.create;let research;
window.ExploreCodicologyResearch.create=(...args)=>(research=create(...args));
vm.runInNewContext(fs.readFileSync('assets/js/explore/modules/codicology.js','utf8'),{window,Intl,console});
const types={118:'ms',116:'pu',119:'su',107:'tx',114:'hp',113:'hi',115:'mi',1:'rel'};
const DATA=Object.fromEntries(Object.values(types).map(t=>[t,[]]));
const IDX=Object.fromEntries(Object.values(types).map(t=>[t,{}]));
const REL_INDEX={bySource:{},byTarget:{}};
const getRes=(r,f)=>r.details?.find(d=>d.fieldName===f)?.value;
const getVal=(r,f)=>{const d=r.details?.find(d=>d.fieldName===f);return d?.termLabel || d?.value || '';};
const Core={DATA,IDX,REL_INDEX,getRes,getVal,esc:x=>String(x??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),isKnownCategory:x=>!!x,createExportButton:()=>''};
// Match production lifecycle: modules initialize before data arrives.
window.ExploreCodicology.init(Core);
const seen=new Set();
for(const file of ['manuscripts','production_units','scribal_units','texts','historical_people','holding_institutions','monastic_institutions','relationships']){
 for(const r of JSON.parse(fs.readFileSync(`data/heurist/${file}.json`)).heurist.records){
  const t=types[r.rec_RecTypeID];if(!t || seen.has(String(r.rec_ID)))continue;seen.add(String(r.rec_ID));DATA[t].push(r);IDX[t][r.rec_ID]=r;
 }
}
DATA.rel.forEach(r=>{const s=getRes(r,'Source record'),t=getRes(r,'Target record');if(s?.id)(REL_INDEX.bySource[s.id]||=[]).push(r);if(t?.id)(REL_INDEX.byTarget[t.id]||=[]).push(r);});
assert.equal(research.records().length,DATA.pu.length);
assert(research.dims.has('field:catchwords'),'Controlled variables discovered after data loads');
research.state.centuries=[14,15,16];
const direct=DATA.pu.filter(pu=>pu.details.some(d=>d.fieldName==='Normalized century of production' && ['14','15','16'].includes(d.termLabel)));
assert.equal(research.records().length,direct.length);
research.state.dating='single';
assert(research.records().every(pu=>research.memberships(pu,'century',false).length===1));
research.state.centuries=[14];research.state.dating='possible';
assert(research.comparison().rows.every(c=>c==='14'),'Unselected date memberships must not leak into chart rows');
research.state.filters=[{field:'material',value:'Paper'},{field:'field:catchwords',value:'TRUE'}];
assert(research.records().every(pu=>research.memberships(pu,'material').includes('Paper') && research.memberships(pu,'field:catchwords').includes('TRUE')));
research.state.filters=[];research.state.centuries=[];
assert.equal(research.records().length,0);assert(!/NaN|Infinity/.test(research.content()));
research.state.centuries=[14,15,16];research.state.row='material';research.state.column='all';research.state.metric='pageSize';
const result=research.comparison();
assert(result.included>0);
for(const cell of result.cells.values())assert([...cell.values()].every(v=>v>0));
assert(!/NaN|Infinity/.test(research.content()));
const summary=research.summarize([1,2,3,4]);assert.equal(summary.median,2.5);assert.equal(summary.q1,1.75);assert.equal(summary.q3,3.25);
research.state.metric='blank';assert([...research.comparison().cells.values()].every(cell=>[...cell.values()].every(v=>v>=0 && v<=1)));
// Fixture: repeated texts count a PU once, and text filters bind the same text.
const detail=(fieldName,value,termLabel)=>({fieldName,value,termLabel});
const pu={rec_ID:'test-pu',details:[detail('Normalized century of production','15','15'),detail('Material','Paper','Paper')]};
DATA.pu.push(pu);IDX.tx.a={rec_ID:'a',details:[detail('Genre','A','A'),detail('Subgenre','X','X')]};IDX.tx.b={rec_ID:'b',details:[detail('Genre','B','B'),detail('Subgenre','Y','Y')]};
REL_INDEX.bySource['test-pu']=['a','b'].map(id=>({details:[detail('Source record',{id:'test-pu'}),detail('Target record',{id}),detail('Relationship type','Contains','Contains')]}));
research.state.filters=[{field:'genre',value:'A'},{field:'subgenre',value:'Y'}];assert(!research.records().includes(pu));
research.state.filters=[{field:'genre',value:'A'},{field:'subgenre',value:'X'}];assert(research.records().includes(pu));
research.state.row='material';research.state.column='all';research.state.metric='count';assert.equal(research.comparison().included,1);
console.log(`PASS: catalogue filters (${direct.length} PUs in centuries 14–16), late data loading, date policy, same-text binding, deduplication, empty states, quantiles and numerical validity.`);
research.state.filters=[];research.state.row='subgenre';research.state.column='material';research.state.scale='columnUnits';
const multi=research.comparison([pu]);assert.equal(multi.columnUnits.get('Paper').size,1);assert.equal(multi.cells.size,2);
research.state.filters=[{field:'genre',value:'Unknown / unrecorded'}];assert(!research.records().includes(pu));
research.state.filters=[{field:'genre',value:'A'},{field:'genre',value:'B'}];assert(research.records().includes(pu),'Multiple values of one variable use OR');
research.state.filters=[];
for(const metric of ['count',...research.measures.keys()]){
 research.state.metric=metric;
 assert(!/NaN|Infinity|undefined/.test(research.content()),`Valid output for ${metric}`);
}
research.state.metric='count';
fs.writeFileSync('/private/tmp/codicology-research-generated.html',research.content());
console.log('PASS: per-column distinct-PU denominators, missing text categories, OR within a variable, and generated output for all numerical measures.');
const ambiguous={rec_ID:'ambiguous',details:[detail('Manuscript',{id:'m1'}),detail('Manuscript',{id:'m2'})]};
IDX.ms.m1={details:[detail('Codex height',200),detail('Codex width',150)]};IDX.ms.m2={details:[detail('Codex height',500),detail('Codex width',300)]};
assert.equal(research.measures.get('pageSize').value(ambiguous),null,'Do not choose arbitrary dimensions when a PU spans manuscripts');
console.log('PASS: page measurements exclude ambiguous multiple-manuscript links.');
research.state.centuries=[14,15,16];research.state.filters=[];research.state.disclosures={};
research.selectComparison('size');assert.equal(research.state.metric,'pageSize');assert.equal(research.state.row,'material');assert.equal(research.state.centuries.join(','),'14,15,16');
research.selectComparison('region');assert.equal(research.state.row,'country');
research.selectComparison('custom');assert.equal(research.state.preset,'region');
research.state.disclosures={};research.selectComparison('chronology');
assert(!/<details[^>]*\sopen(?:\s|>)/.test(research.content()),'Additional tools start collapsed');
fs.writeFileSync('/private/tmp/codicology-simplified.html',research.toolbar()+research.content());
console.log('PASS: three fixed views preserve the selected sample; unsupported views are ignored; tables start collapsed.');

assert(!/<select\b/.test(research.toolbar()+research.content()),'The simplified interface contains no dropdowns');
assert(!/Customise|More research tools|Filter variable/.test(research.content()));
console.log('PASS: no dropdowns or general comparison builder in the simplified interface.');
