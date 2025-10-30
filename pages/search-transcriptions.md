---
layout: page
permalink: /search-transcriptions/
title: Search Transcriptions
show_title: false
---

<div class="explore-fullwidth">
  <h1 class="mb-3" style="text-align:center;">Search Transcriptions</h1>

  <div class="db-shell" style="grid-template-columns: 280px minmax(0,1fr);">
    <aside class="db-facets" aria-label="Filters">
      <div class="facet">
        <div class="facet-title">Manuscript</div>
        <select id="ms-filter" style="width:100%"></select>
      </div>
      <div class="facet">
        <div class="facet-title">Fuzzy distance</div>
        <input id="edits" type="number" min="0" max="2" value="1" style="width:100%">
        <small class="muted">0 = exact, 1 or 2 = tolerant</small>
      </div>
    </aside>

    <section class="db-main">
      <div class="db-controls">
        <input id="q" type="search" placeholder="Search words, phrases…" />
        <button id="go" class="chip">Search</button>
      </div>
      <div id="status" class="db-status"></div>
      <div id="hits" class="db-grid" style="grid-template-columns:repeat(auto-fill,minmax(420px,1fr))"></div>
    </section>
  </div>
</div>

<link rel="stylesheet" href="https://unpkg.com/lunr/lunr.css"><!-- harmless -->
<script src="https://unpkg.com/lunr/lunr.js"></script>
<script>
(async function(){
  const corpus = await (await fetch('{{ "/assets/search/transcriptions.json" | relative_url }}')).json();
  const docs = corpus.docs || [];
  const byId = new Map(docs.map(d => [d.id, d]));

  // Manuscript filter
  const $ms = document.getElementById('ms-filter');
  const $q  = document.getElementById('q');
  const $go = document.getElementById('go');
  const $ed = document.getElementById('edits');
  const $hits = document.getElementById('hits');
  const $status = document.getElementById('status');

  // populate ms filter
  const none = document.createElement('option'); none.value=''; none.textContent='All manuscripts';
  $ms.appendChild(none);
  (corpus.manuscripts||[]).forEach(m=>{
    const opt = document.createElement('option'); opt.value=m.slug; opt.textContent=m.title||m.slug; $ms.appendChild(opt);
  });

  // build lunr index (on normalized text)
  const idx = lunr(function(){
    this.ref('id');
    this.field('text_norm');
    this.metadataWhitelist = ['position'];
    docs.forEach(d => this.add(d));
  });

  function esc(s){ return String(s||'').replace(/[&<>"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c])); }

  function run(){
    const q = ($q.value||'').trim();
    const ms = $ms.value||'';
    const edits = Math.max(0, Math.min(2, parseInt($ed.value||'1',10)));

    if (!q){ $status.textContent='Type a query and hit Search.'; $hits.innerHTML=''; return; }

    // Build a Lunr query with fuzziness term~edits for each token
    const terms = q.split(/\s+/).filter(Boolean);
    const query = terms.map(t => `${t}~${edits}`).join(' ');

    let results = idx.search(query).slice(0, 500); // keep it sane
    let rows = [];
    for (const r of results){
      const d = byId.get(r.ref);
      if (!d) continue;
      if (ms && d.slug !== ms) continue;
      rows.push(d);
    }

    $status.textContent = `${rows.length} match${rows.length===1?'':'es'}`;
    $hits.innerHTML = rows.slice(0, 200).map(d=>{
      // build viewer link: /viewer/{slug}/?canvas=...&line=...
      const href = `{{ site.baseurl | default: "" }}/viewer/${d.slug}/?canvas=${encodeURIComponent(d.canvas)}&line=${encodeURIComponent(d.line_id)}`;
      return `
        <article class="db-card">
          <div class="db-body">
            <div class="db-title"><a href="${href}">${esc(d.title||d.slug)}</a></div>
            <div class="db-meta">${esc(d.text)}</div>
            <div><a class="chip" href="${href}">Open in viewer</a></div>
          </div>
        </article>`;
    }).join('');
  }

  $go.addEventListener('click', run);
  $q.addEventListener('keydown', e=>{ if (e.key==='Enter') run(); });
})();
</script>