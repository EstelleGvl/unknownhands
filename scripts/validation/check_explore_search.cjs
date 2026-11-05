const fs = require('node:fs');
const assert = require('node:assert/strict');
require('../../assets/js/explore/components/relationship-paths.js');
const d = (fieldName, value, termLabel) => ({fieldName, value, termLabel});
const pointer = (id, type) => ({id, type});
const rec = (id, details = []) => ({rec_ID:id, details});
const relation = (id, source, target, label, extra = []) => rec(id, [d('Source record',source), d('Target record',target), d('Relationship type',label,label), ...extra]);
const typeMap = {118:'ms',116:'pu',119:'su',107:'tx',114:'hp',113:'hi',115:'mi',1:'rel'};
const data = {
  ms:[rec('good'),rec('split-pu'),rec('split-text'),rec('scribe-only')],
  pu:[rec('p1',[d('Manuscript',pointer('good',118)),d('catchwords','Yes')]),
      rec('p2',[d('Manuscript',pointer('split-pu',118)),d('catchwords','No')]),
      rec('p3',[d('Manuscript',pointer('split-pu',118)),d('catchwords','Yes')]),
      rec('p4',[d('Manuscript',pointer('split-text',118)),d('catchwords','Yes')]),
      rec('p5',[d('Manuscript',pointer('scribe-only',118)),d('catchwords','Yes')])],
  tx:[rec('t1',[d('Genre','Devotional')]),rec('t2',[d('Genre','Devotional')]),
      rec('t3',[d('Genre','Devotional')]),rec('t4',[d('Genre','History')]),rec('t5',[d('Genre','Devotional')])],
  hp:[rec('f',[d('Gender','Female')]),rec('m',[d('Gender','Male')])],
  rel:[relation('r1',pointer('p1',116),pointer('t1',107),'contains'),
       relation('r2',pointer('p2',116),pointer('t1',107),'contains'),
       relation('r3',pointer('p4',116),pointer('t3',107),'contains'),
       relation('r4',pointer('p4',116),pointer('t4',107),'contains'),
       relation('r5',pointer('p5',116),pointer('t5',107),'contains'),
       relation('a1',pointer('t1',107),pointer('f',114),'author of',[d('Certainty','Certain')]),
       relation('a2',pointer('t3',107),pointer('m',114),'author of'),
       relation('a3',pointer('t4',107),pointer('f',114),'author of'),
       relation('a4',pointer('t5',107),pointer('f',114),'scribe of')]
};
const engine = ExplorePaths.create(data,typeMap);
function edge(engine, from, entity, label, direction='out', kind='relationship') {
  const option = engine.options(from).find(([,s])=>s.entity===entity && s.label===label && s.direction===direction && s.kind===kind);
  assert(option, `${from} → ${entity}: ${label} (${direction})`);
  return option[0];
}
let id=0;
const node = (entity, edge='', conditions=[], children=[], mode='all') => ({id:String(++id),entity,edge,conditions,children,mode});
const eq = (field,value) => ({field,operator:'equals',value});
const matches = (rec,c) => rec.details.some(d=>d.fieldName===c.field && String(d.termLabel || d.value).toLowerCase()===c.value.toLowerCase());
const author = node('hp',edge(engine,'tx','hp','author of'),[eq('Gender','Female')]);
const text = node('tx',edge(engine,'pu','tx','contains'),[eq('Genre','Devotional')],[author]);
const pu = node('pu',edge(engine,'ms','pu','Manuscript','in','pointer'),[eq('catchwords','Yes')],[text]);
const query = node('ms','',[],[pu]);
assert.deepEqual(data.ms.filter(r=>engine.matches('ms',r,query,matches)).map(r=>r.rec_ID),['good']);
// Follow the relationship record itself to constrain its attribution metadata.
const relStep = node('rel',edge(engine,'tx','rel','Source record','in','pointer'),[eq('Relationship type','author of'),eq('Certainty','Certain')],
  [node('hp',edge(engine,'rel','hp','Target record','out','pointer'),[eq('Gender','Female')])]);
assert(engine.matches('tx',data.tx[0],node('tx','',[],[relStep]),matches));
// Reverse authorship and repeated entity types are explicit and supported.
assert(engine.matches('hp',data.hp[0],node('hp','',[],[node('tx',edge(engine,'hp','tx','author of','in'),[eq('Genre','Devotional')])]),matches));
// No fixed three-hop limit; revisiting a record at a later step is valid.
let deep = node('ms');
for (let i=0;i<100;i++) deep = node('ms','',[],[node('pu',edge(engine,'ms','pu','Manuscript','in','pointer'),[],[
  {...deep,edge:edge(engine,'pu','ms','Manuscript','out','pointer')}
])]);
assert(engine.matches('ms',data.ms[0],deep,matches));
// Branches remain attached to the same PU.
pu.children.push(node('tx',edge(engine,'pu','tx','contains'),[eq('Genre','History')]));
assert(!engine.matches('ms',data.ms[0],query,matches));
console.log('PASS: same PU/text/author binding, role and direction, relationship metadata, branches, 200-step cyclic path.');

// Catalogue smoke check: discover actual edge labels and run an explicit path.
const catalogue = Object.fromEntries(Object.values(typeMap).map(t=>[t,[]]));
const seen = new Set();
for(const file of ['manuscripts','production_units','scribal_units','texts','historical_people','holding_institutions','monastic_institutions','relationships']) {
  for(const r of JSON.parse(fs.readFileSync(`data/heurist/${file}.json`)).heurist.records) {
    const type=typeMap[String(r.rec_RecTypeID)];
    if(type && !seen.has(String(r.rec_ID))) {seen.add(String(r.rec_ID));catalogue[type].push(r);}
  }
}
const live = ExplorePaths.create(catalogue,typeMap);
const femaleAuthor = node('hp',edge(live,'tx','hp','author of'),[eq('Gender','Female')]);
const authored = catalogue.tx.filter(r=>live.matches('tx',r,node('tx','',[],[femaleAuthor]),matches));
assert(authored.length>0);
console.log(`PASS: ${authored.length} catalogue texts have an explicitly linked female author.`);
console.log('PU → text connections:',live.options('pu').filter(([,s])=>s.entity==='tx').map(([,s])=>`${s.label} (${s.direction})`).join(', '));
const actualText = node('tx',edge(live,'pu','tx','Contains'),[eq('Subgenre','Devotional Literature')],[femaleAuthor]);
const actualPU = node('pu',edge(live,'ms','pu','Manuscript','in','pointer'),[eq('catchwords','TRUE')],[actualText]);
const actualQuery = node('ms','',[],[actualPU]);
const results = catalogue.ms.filter(r=>live.matches('ms',r,actualQuery,matches)).map(r=>String(r.rec_ID)).sort();
// Independently join the raw catalogue to verify the complete requested path.
const femaleIds = new Set(catalogue.hp.filter(r=>matches(r,eq('Gender','Female'))).map(r=>String(r.rec_ID)));
const field = (r,name) => r.details.find(d=>d.fieldName===name)?.value;
const authoredTextIds = new Set(catalogue.rel.filter(r=>matches(r,eq('Relationship type','author of')) && femaleIds.has(String(field(r,'Target record')?.id))).map(r=>String(field(r,'Source record')?.id)));
const devotionalIds = new Set(catalogue.tx.filter(r=>authoredTextIds.has(String(r.rec_ID)) && matches(r,eq('Subgenre','Devotional Literature'))).map(r=>String(r.rec_ID)));
const puIds = new Set(catalogue.rel.filter(r=>matches(r,eq('Relationship type','Contains')) && devotionalIds.has(String(field(r,'Target record')?.id))).map(r=>String(field(r,'Source record')?.id)));
const expected = [...new Set(catalogue.pu.filter(r=>puIds.has(String(r.rec_ID)) && matches(r,eq('catchwords','TRUE'))).map(r=>String(field(r,'Manuscript')?.id)))].sort();
assert.deepEqual(results,expected);
console.log(`PASS: full catalogue example matches independent join (${results.length} manuscripts).`);
// Audit discovery across the entire export, not just authorship/containment.
const catalogueIds = new Map(Object.entries(catalogue).map(([type,records])=>[type,new Set(records.map(r=>String(r.rec_ID)))]));
let pointerCount=0, relationshipCount=0;
for (const [type,records] of Object.entries(catalogue)) for (const r of records) {
  for (const detail of r.details || []) {
    const p=detail.value, target=typeMap[String(p?.type)];
    if (!p?.id || !target || !catalogueIds.get(target)?.has(String(p.id))) continue;
    edge(live,type,target,detail.fieldName,'out','pointer');
    edge(live,target,type,detail.fieldName,'in','pointer');
    pointerCount++;
  }
}
for (const r of catalogue.rel) {
  const src=field(r,'Source record'), tgt=field(r,'Target record');
  const from=typeMap[String(src?.type)], to=typeMap[String(tgt?.type)];
  if (!from || !to || !catalogueIds.get(from)?.has(String(src.id)) || !catalogueIds.get(to)?.has(String(tgt.id))) continue;
  const rel=r.details.find(d=>d.fieldName==='Relationship type');
  const label=rel?.termLabel || String(rel?.value || 'Unspecified relationship');
  edge(live,from,to,label,'out');
  edge(live,to,from,label,'in');
  relationshipCount++;
}
console.log(`PASS: discovery covers all ${pointerCount} resolvable pointers and ${relationshipCount} relationships in both directions.`);
