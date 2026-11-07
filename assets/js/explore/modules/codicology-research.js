/* Research comparisons use Production Units as the observation unit. */
window.ExploreCodicologyResearch = (function() {
  const UNKNOWN = 'Unknown / unrecorded';
  function create(Core, H) {
    const state = {centuries:null, dating:'possible', filters:[], row:'century', column:'material', metric:'count', scale:'row', missing:'exclude', x:'pageSize', y:'blank', facet:'none', filterField:'material', preset:'chronology', disclosures:{}};
    const {controlled, centuries, countries, materials, quireTypes, numeric, resource, esc, known} = H;
    const unique = values => [...new Set(values)];
    const all = () => Core.DATA.pu || [];
    const textCache = new Map();
    function texts(pu) {
      const id = String(pu.rec_ID);
      if (!textCache.has(id)) {
        const found = new Map();
        [...(Core.REL_INDEX.bySource?.[id] || []), ...(Core.REL_INDEX.byTarget?.[id] || [])].forEach(rel => {
          if (!/^contains$/i.test(Core.getVal(rel,'Relationship type'))) return;
          const source = Core.getRes(rel,'Source record'), target = Core.getRes(rel,'Target record');
          const other = String(source?.id) === id ? target : source;
          const text = Core.IDX.tx?.[String(other?.id)];
          if (text) found.set(String(text.rec_ID), text);
        });
        textCache.set(id,[...found.values()]);
      }
      return textCache.get(id);
    }
    const dims = new Map([
      ['all',{label:'All selected units',values:()=>['All selected units']}],
      ['century',{label:'Century',values:pu=>centuries(pu).map(String)}],
      ['material',{label:'Material',values:materials}],
      ['country',{label:'Production country',values:countries}],
      ['quire',{label:'Quire type',values:quireTypes}],
      ['quireSize',{label:'Quire size group',values:pu=>unique(quireTypes(pu).map(v=>v==='Varia'?'Mixed / Varia':/^(Bifolio|Ternion)$/i.test(v)?'Small (under 4 bifolia)':/^Quaternion$/i.test(v)?'Standard (4 bifolia)':/^(Quinion|Sexternion|Septenion|Octonion)$/i.test(v)?'Large (5+ bifolia)':'Other / fragment'))}],
      ['order',{label:'Monastic order',values:pu=>controlled(Core.IDX.mi?.[String(resource(pu,'Monastic Institution')?.id)],'Religious order')}],
      ['genre',{label:'Text genre',values:pu=>unique(texts(pu).flatMap(tx=>controlled(tx,'Genre')))}],
      ['subgenre',{label:'Text subgenre',values:pu=>unique(texts(pu).flatMap(tx=>controlled(tx,'Subgenre')))}],
      ['function',{label:'Text function (devotional / liturgical)',values:pu=>{
        const labels=texts(pu).flatMap(tx=>controlled(tx,'Subgenre'));
        const devotional=labels.some(v=>/devotional/i.test(v)), liturgical=labels.some(v=>/liturgical/i.test(v));
        return devotional && liturgical ? ['Both recorded'] : devotional ? ['Devotional only recorded'] : liturgical ? ['Liturgical only recorded'] : [];
      }}]
    ]);
    function refreshDimensions() {
    const fields = unique(all().flatMap(pu=>(pu.details || []).filter(d=>known(d.termLabel)).map(d=>d.fieldName))).sort();
    fields.forEach(field => {
      if (['Normalized century of production','Material','PU country','Quire types'].includes(field)) return;
      dims.set(`field:${field}`,{label:field,values:pu=>controlled(pu,field)});
    });
    }
    const manuscriptIds = pu => unique((pu.details || []).filter(d=>d.fieldName==='Manuscript' && d.value?.id).map(d=>String(d.value.id)));
    const page = pu => {const ids=manuscriptIds(pu);return ids.length===1?Core.IDX.ms?.[ids[0]]:null;};
    const positive = value => Number.isFinite(value) && value > 0 ? value : null;
    const measures = new Map([
      ['pageSize',{label:'Page height + width (mm)',value:pu=>{const ms=page(pu),h=positive(numeric(ms,'Codex height')),w=positive(numeric(ms,'Codex width'));return h && w ? h+w : null;}}],
      ['pageHeight',{label:'Page height (mm)',value:pu=>positive(numeric(page(pu),'Codex height'))}],
      ['pageWidth',{label:'Page width (mm)',value:pu=>positive(numeric(page(pu),'Codex width'))}],
      ['blank',{label:'Blank-page fraction (1 − writing-area share)',value:pu=>{
        const ms=page(pu),h=positive(numeric(ms,'Codex height')),w=positive(numeric(ms,'Codex width'));
        const th=positive(numeric(pu,'justification : height (mm)')),tw=positive(numeric(pu,'justification : width (mm)'));
        if (!h || !w || !th || !tw || th>h || tw>w) return null;
        return 1-(th*tw)/(h*w);
      }}]
    ]);
    const numericFields = ['Number of Folios','Number of Quires','Number of Columns','min_lines','max_lines','justification : height (mm)','justification : width (mm)'];
    numericFields.forEach(field=>measures.set(`number:${field}`,{label:field,value:pu=>positive(numeric(pu,field))}));
    function memberships(pu,key,selected=true) {
      let values=unique(dims.get(key)?.values(pu) || []);
      if (key==='century' && selected && state.centuries!==null) values=values.filter(v=>state.centuries.includes(Number(v)));
      return values;
    }
    function records() {
      refreshDimensions();
      return all().filter(pu=>{
        const dates=centuries(pu);
        if(state.dating==='single' && dates.length!==1) return false;
        if(state.centuries!==null && !dates.some(c=>state.centuries.includes(c))) return false;
        const grouped=new Map();
        state.filters.forEach(f=>{if(!grouped.has(f.field))grouped.set(f.field,[]);grouped.get(f.field).push(f.value);});
        const textGroups=[...grouped].filter(([field])=>field==='genre' || field==='subgenre');
        const candidates=texts(pu).length?texts(pu):[null];
        if(textGroups.length && !candidates.some(tx=>textGroups.every(([field,wanted])=>wanted.some(value=>
          value===UNKNOWN ? !memberships(pu,field,false).length : controlled(tx,field==='genre'?'Genre':'Subgenre').includes(value)
        ))))return false;
        return [...grouped].filter(([field])=>field!=='genre' && field!=='subgenre').every(([field,wanted])=>{
          const values=memberships(pu,field,false);
          return wanted.some(value=>value===UNKNOWN ? !values.length : values.includes(value));
        });
      });
    }
    const active = () => state.centuries!==null || state.dating!=='possible' || state.filters.length>0;
    function manuscripts() {
      if(!active()) return Core.DATA.ms || [];
      const ids=new Set(records().flatMap(manuscriptIds));
      return (Core.DATA.ms || []).filter(ms=>ids.has(String(ms.rec_ID)));
    }
    const sorted = values => unique(values).sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));
    const options = (entries,value) => entries.map(([key,label])=>`<option value="${esc(key)}"${key===value?' selected':''}>${esc(label)}</option>`).join('');
    const dimOptions = () => [...dims].map(([key,d])=>[key,d.label]);
    const measureOptions = () => [...measures].map(([key,d])=>[key,d.label]);
    const fmt = n => Number.isFinite(n) ? new Intl.NumberFormat('en',{maximumFractionDigits:3}).format(n) : '—';
    const quantile = (values,p) => {
      const v=values.filter(Number.isFinite).slice().sort((a,b)=>a-b);
      if(!v.length) return null;
      const i=(v.length-1)*p,j=Math.floor(i);return v[j]+(v[Math.ceil(i)]-v[j])*(i-j);
    };
    function summarize(values) {
      const v=values.filter(Number.isFinite);return {n:v.length,min:quantile(v,0),q1:quantile(v,.25),median:quantile(v,.5),q3:quantile(v,.75),max:quantile(v,1)};
    }
    function comparison(pus=records()) {
      const rows=new Set(),cols=new Set(),cells=new Map();let included=0;
      pus.forEach(pu=>{
        let rr=memberships(pu,state.row),cc=memberships(pu,state.column);
        if(state.missing==='include'){if(!rr.length)rr=[UNKNOWN];if(!cc.length)cc=[UNKNOWN];}
        const value=state.metric==='count'?1:measures.get(state.metric)?.value(pu);
        if(!rr.length || !cc.length || !Number.isFinite(value)) return;
        included++;
        rr.forEach(r=>cc.forEach(c=>{rows.add(r);cols.add(c);const key=JSON.stringify([r,c]);if(!cells.has(key))cells.set(key,new Map());cells.get(key).set(String(pu.rec_ID),value);}));
      });
      const columnUnits=new Map();
      cells.forEach((values,key)=>{const [,column]=JSON.parse(key);if(!columnUnits.has(column))columnUnits.set(column,new Set());values.forEach((value,id)=>columnUnits.get(column).add(id));});
      return {rows:sorted([...rows]),columns:sorted([...cols]),cells,columnUnits,included,total:pus.length};
    }
    function download(filename,rows) {
      const csv=rows.map(row=>row.map(value=>'"'+String(value??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
      const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    const cohortDescription = () => `${state.centuries===null?'All centuries (including undated)':state.centuries.length?'Centuries '+state.centuries.join(', '):'No centuries selected'}; ${state.dating==='single'?'single-century dating only':'all plausible centuries'}; ${[...new Set(state.filters.map(f=>f.field))].map(field=>`${dims.get(field)?.label} in (${state.filters.filter(f=>f.field===field).map(f=>f.value).join(' or ')})`).join('; ') || 'no additional filters'}`;
    const presets = {
      chronology:{label:'Materials over time',settings:['century','material','count']},
      region:{label:'Materials by country',settings:['country','material','count']},
      size:{label:'Page size by material',settings:['material','all','pageSize']},
      subgenre:{label:'Text subgenres by material',settings:['subgenre','material','count'],scale:'columnUnits'},
      quireTime:{label:'Quires over time',settings:['century','quire','count']},
      quireCountry:{label:'Quires by country',settings:['country','quire','count']},
      quireMaterial:{label:'Quires by material',settings:['quire','material','count']},
      margins:{label:'Margins by material',settings:['material','all','blank']},
      regionalSize:{label:'Page size by country',settings:['country','material','pageSize']},
      catchwordTime:{label:'Catchwords over time',settings:['century','field:catchwords','count']},
      signatureTime:{label:'Signatures over time',settings:['century','field:signatures','count']}

    };
    const disclosure = name => `data-disclosure="${name}"${state.disclosures[name]?' open':''}`;
    function selectComparison(name) {
      if (!presets[name]) return;
      state.preset=name;
      [state.row,state.column,state.metric]=presets[name].settings;
      state.scale=presets[name].scale || 'row';
    }
    function toolbar() {
      const available=sorted(all().flatMap(pu=>centuries(pu).map(String))).map(Number);
      return `<section class="codicology-simple-period" aria-label="Century filter">
        <div class="codicology-research-actions"><strong>Period</strong>
          <button type="button" data-preset="all" aria-pressed="${state.centuries===null}">All centuries</button>
          <button type="button" data-preset="late" aria-pressed="${state.centuries?.join(',')==='14,15,16'}">14th–16th centuries</button>
        <details class="codicology-disclosure codicology-inline-centuries" ${disclosure('centuries')}><summary>Choose individual centuries</summary>
          <div class="codicology-century-options">${available.map(c=>`<label><input type="checkbox" data-century="${c}"${state.centuries===null || state.centuries.includes(c)?' checked':''}> ${c}</label>`).join('')}</div>
        </details>
        <p class="explore-chart-note codicology-period-status" role="status">${state.centuries===null?'All centuries':state.centuries.length?'Centuries '+state.centuries.join(', '):'No centuries selected'} · ${records().length} Production Units</p></div>
      </section>`;
    }
    function table(result) {
      const {rows,columns,cells}=result;
      if(!rows.length) return '<p class="explore-empty-state">No observations match this period. Try another century selection.</p>';
      const counts=(r,c)=>cells.get(JSON.stringify([r,c]))?.size || 0;
      const cell=(r,c)=>{
        const n=counts(r,c);
        if(state.metric!=='count')return `${fmt(summarize([...(cells.get(JSON.stringify([r,c]))?.values() || [])]).median)} (n=${n})`;
        const denom=state.scale==='columnUnits'?result.columnUnits.get(c)?.size || 0:state.scale==='column'?rows.reduce((sum,x)=>sum+counts(x,c),0):state.scale==='total'?[...cells.values()].reduce((sum,x)=>sum+x.size,0):columns.reduce((sum,x)=>sum+counts(r,x),0);
        return state.scale==='count'?String(n):`${n} · ${denom?(n/denom*100).toFixed(1):'0.0'}%`;
      };
      return `<div class="codicology-table-wrap"><table class="codicology-matrix"><caption>${esc(dims.get(state.row).label)} × ${esc(dims.get(state.column).label)} — ${state.metric==='count'?'Production Unit counts':esc(measures.get(state.metric).label)+'; cell median (n)'}</caption><thead><tr><th scope="col">${esc(dims.get(state.row).label)}</th>${columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${esc(r)}</th>${columns.map(c=>`<td>${cell(r,c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    function chart(result) {
      if(!result.rows.length)return '';
      if(state.metric==='count') {
        const colors=H.colors;
        if(state.scale==='columnUnits')return `<div class="codicology-legend">${result.columns.map((c,i)=>`<span><i style="background:${colors[i%colors.length]}"></i>${esc(c)}</span>`).join('')}</div>${result.rows.map(r=>`<div class="codicology-bar-row"><strong>${esc(r)}</strong>${result.columns.map((c,i)=>{const n=result.cells.get(JSON.stringify([r,c]))?.size || 0,denom=result.columnUnits.get(c)?.size || 0,pct=denom?n/denom*100:0;return `<div class="codicology-prevalence-row"><span>${esc(c)}</span><div class="codicology-stack"><span style="width:${pct}%;background:${colors[i%colors.length]}"></span></div><span>${n}/${denom} · ${pct.toFixed(1)}%</span></div>`;}).join('')}</div>`).join('')}<p class="explore-chart-note">Denominators are distinct Production Units in each column with at least one known row category. A unit may have several subgenres; percentages across rows can exceed 100%.</p>`;
        const max=Math.max(1,...result.rows.map(r=>result.columns.reduce((sum,c)=>sum+(result.cells.get(JSON.stringify([r,c]))?.size || 0),0)));
        return `<div class="codicology-legend">${result.columns.map((c,i)=>`<span><i style="background:${colors[i%colors.length]}"></i>${esc(c)}</span>`).join('')}</div>${result.rows.map(r=>{
          const total=result.columns.reduce((sum,c)=>sum+(result.cells.get(JSON.stringify([r,c]))?.size || 0),0);
          return `<div class="codicology-bar-row"><div class="codicology-bar-heading"><strong>${esc(r)}</strong><span>n=${total} memberships</span></div><div class="codicology-stack">${result.columns.map((c,i)=>{
            const n=result.cells.get(JSON.stringify([r,c]))?.size || 0;
            return n?`<span style="width:${n/(state.scale==='count'?max:total)*100}%;background:${colors[i%colors.length]}" title="${esc(c)}: ${n} (${(n/total*100).toFixed(1)}% of row)"></span>`:'';
          }).join('')}</div></div>`;
        }).join('')}<p class="explore-chart-note">Chart shows ${state.scale==='count'?'absolute counts on a shared scale':'within-row composition'}. Table percentages follow the selected denominator.</p>`;
      }
      const groups=[];
      result.rows.forEach(r=>result.columns.forEach(c=>{
        const values=[...(result.cells.get(JSON.stringify([r,c]))?.values() || [])];
        if(values.length) groups.push({label:state.column==='all'?String(r):`${r} / ${c}`,values,...summarize(values)});
      }));
      const lo=Math.min(...groups.map(g=>g.min)),hi=Math.max(...groups.map(g=>g.max)),span=hi-lo || 1;
      const x=v=>240+(v-lo)/span*490;
      return `<div class="codicology-table-wrap"><svg class="codicology-boxplot" viewBox="0 0 800 ${groups.length*45+70}" role="img" aria-label="Box plots of ${esc(measures.get(state.metric).label)} by selected categories; boxes show quartiles and whiskers show the observed minimum and maximum.">
        ${groups.map((g,i)=>{const y=25+i*45;return `<g><title>${esc(g.label)}: n=${g.n}, median ${fmt(g.median)}, Q1 ${fmt(g.q1)}, Q3 ${fmt(g.q3)}, min ${fmt(g.min)}, max ${fmt(g.max)}</title><text x="5" y="${y+4}">${esc(g.label.length>33?g.label.slice(0,30)+'…':g.label)} (n=${g.n})</text><line x1="${x(g.min)}" x2="${x(g.max)}" y1="${y}" y2="${y}" stroke="#334155"/><rect x="${x(g.q1)}" y="${y-10}" width="${Math.max(1,x(g.q3)-x(g.q1))}" height="20" fill="#ccfbf1" stroke="#0f766e"/><line x1="${x(g.median)}" x2="${x(g.median)}" y1="${y-10}" y2="${y+10}" stroke="#0f766e" stroke-width="3"/></g>`;}).join('')}
        ${[0,.25,.5,.75,1].map(t=>`<text x="${240+t*490}" y="${groups.length*45+25}" text-anchor="middle">${fmt(lo+t*span)}</text>`).join('')}<text x="480" y="${groups.length*45+55}" text-anchor="middle">${esc(measures.get(state.metric).label)}</text></svg></div>
        <p class="explore-chart-note">Boxes: 25th–75th percentiles; central line: median; whiskers: observed minimum and maximum. No outliers are silently removed.</p>`;
    }
    function numericTable(result) {
      if(state.metric==='count' || !result.rows.length)return '';
      return `<div class="codicology-table-wrap"><table class="codicology-matrix"><caption>Numerical summary — ${esc(measures.get(state.metric).label)}</caption><thead><tr><th>Group</th><th>n</th><th>Min</th><th>Q1</th><th>Median</th><th>Q3</th><th>Max</th></tr></thead><tbody>${result.rows.flatMap(r=>result.columns.map(c=>{
        const s=summarize([...(result.cells.get(JSON.stringify([r,c]))?.values() || [])]);
        return s.n?`<tr><th scope="row">${esc(r)} / ${esc(c)}</th>${['n','min','q1','median','q3','max'].map(k=>`<td>${fmt(s[k])}</td>`).join('')}</tr>`:'';
      })).join('')}</tbody></table></div>`;
    }
    function content({navigation=true} = {}) {
      refreshDimensions();
      const result=comparison();
      return `${navigation ? `<header class="codicology-intro"><h2>Materials and page size</h2></header>
        <div class="codicology-simple-tabs" aria-label="Comparison">${['chronology','region','size'].map(key=>`<button type="button" data-comparison="${key}" aria-pressed="${state.preset===key}">${esc(presets[key].label)}</button>`).join('')}</div>` : ''}
        <section id="codicology-research-comparison" class="explore-visualization-card">
          <div class="explore-viz-card-header"><h3>${esc(presets[state.preset]?.label || 'Comparison')}</h3>${Core.createExportButton('codicology-research-comparison',`codicology-${state.preset}.png`)}</div>
          <p class="explore-chart-note">${esc(cohortDescription())}</p>
          <p>${result.included} Production Units with the required information${result.total-result.included ? `; ${result.total-result.included} without it` : ''}.</p>
          ${chart(result)}
        </section>
        <details class="codicology-disclosure" ${disclosure('table')}><summary>View data table</summary>
          ${table(result)}${numericTable(result)}
          <div class="codicology-research-actions"><button type="button" data-export-table>Download CSV</button></div>
          <p class="explore-chart-note">Each unit is counted once per cell. Uncertain dates and countries can appear in more than one group. ${state.scale==='columnUnits'?'Percentages use distinct units in each material with at least one recorded subgenre. A unit can have several subgenres, so percentages across subgenres can exceed 100%.':'Percentages show each row’s composition.'} ${state.metric==='blank'?'Blank-page fraction is 1 minus the writing-area share of the page; it estimates area, rather than measuring actual blank space.':state.metric==='pageSize'?'Page size is height + width.':''} ${state.metric!=='count'?'Page measurements require one linked manuscript; its dimensions can recur across several units. Missing or invalid measurements are excluded.':''}</p>
        </details>`;
    }

    function attach(mount,rerender,tab) {
      state.topicViews ||= {};
      const host=document.createElement('div');host.innerHTML=toolbar();mount.prepend(host);
      mount.querySelectorAll('[data-disclosure]').forEach(element=>{element.addEventListener('toggle',()=>{if(element.isConnected)state.disclosures[element.dataset.disclosure]=element.open;});});
      mount.onkeydown=event=>{if(event.key==='Escape'){const picker=mount.querySelector('.codicology-inline-centuries');if(picker?.open){picker.open=false;state.disclosures.centuries=false;picker.querySelector('summary').focus();}}};
      mount.onchange=event=>{
        if(event.target.dataset.century){
          state.disclosures.centuries=true;
          state.centuries=[...host.querySelectorAll('[data-century]:checked')].map(input=>Number(input.dataset.century));
          rerender();
        }
      };
      mount.onclick=event=>{
        const button=event.target.closest('button');if(!button)return;
        if(button.dataset.comparison){selectComparison(button.dataset.comparison);rerender();}
        if(button.dataset.topicView){state.topicViews[tab]=button.dataset.topicView;rerender();}
        if(button.dataset.preset){state.disclosures.centuries=false;state.centuries=button.dataset.preset==='all'?null:[14,15,16];rerender();}
        if(button.hasAttribute('data-export-table')){
          const result=comparison(),rows=[['Sample',cohortDescription()],['Rows',dims.get(state.row).label],['Columns',dims.get(state.column).label],['Measure',state.metric==='count'?'Production Units':measures.get(state.metric).label],['Included distinct PUs',result.included],['Selected PUs',result.total],['Counting','Distinct PU per cell; multiple memberships across cells'],['Row','Column','n','Row %','Column %','All-cell %','Column distinct PUs','Column PU prevalence %','Min','Q1','Median','Q3','Max']];
          const total=[...result.cells.values()].reduce((sum,cell)=>sum+cell.size,0);
          result.rows.forEach(r=>result.columns.forEach(c=>{const s=summarize([...(result.cells.get(JSON.stringify([r,c]))?.values() || [])]);const rowTotal=result.columns.reduce((sum,x)=>sum+(result.cells.get(JSON.stringify([r,x]))?.size || 0),0),colTotal=result.rows.reduce((sum,x)=>sum+(result.cells.get(JSON.stringify([x,c]))?.size || 0),0);rows.push([r,c,s.n,rowTotal?s.n/rowTotal*100:'',colTotal?s.n/colTotal*100:'',total?s.n/total*100:'',result.columnUnits.get(c)?.size || 0,result.columnUnits.get(c)?.size?s.n/result.columnUnits.get(c).size*100:'',...['min','q1','median','q3','max'].map(k=>state.metric==='count'?'':s[k])]);}));download(`codicology-${state.preset}.csv`,rows);
        }

      };
    }
    return {toolbar,selectComparison,describe:cohortDescription,state,records,manuscripts,active,content,attach,comparison,summarize,texts,memberships,measures,dims};
  }
  return {create};
})();
