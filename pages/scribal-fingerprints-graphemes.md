---
layout: page
permalink: /scribal-fingerprints/graphemes/
show_title: false
banner:
  image: "BnFfrançais603_81v.jpg"
  y: "50%"
  clickable: yes
  height: '400px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

# Browse Graphemes

Compare candidate letterforms across scribes and manuscripts. These crops are reviewable candidates generated from ALTO coordinates; they should be checked visually before being used as firm paleographical evidence.

<style>
  .grapheme-tools{ display:grid; grid-template-columns:repeat(5, minmax(140px, 1fr)); gap:.75rem; align-items:end; margin:1.25rem 0; }
  .grapheme-tools label{ display:block; font-weight:600; font-size:.9rem; margin-bottom:.25rem; }
  .grapheme-tools select,
  .grapheme-tools input{ width:100%; border:1px solid #d8d8d8; border-radius:.35rem; padding:.45rem .55rem; }
  .grapheme-group{ border:1px solid #e2e2e2; border-radius:.5rem; padding:1rem; margin:1rem 0; }
  .grapheme-crops{ display:flex; flex-wrap:wrap; gap:.5rem; }
  .grapheme-crop{ width:96px; border:1px solid #ddd; padding:2px; background:#fff; }
  .grapheme-crop img{ width:100%; height:88px; object-fit:contain; background:#f5f5f5; display:block; }
  .grapheme-crop a{ font-size:.78rem; display:block; margin-top:.15rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  @media (max-width: 900px){ .grapheme-tools{ grid-template-columns:1fr; } }
</style>

<p>
  <a class="btn btn-outline-secondary btn-sm" href="{{ '/assets/data/scribal-fingerprint-crops.csv' | relative_url }}">Download CSV</a>
  <a class="btn btn-outline-secondary btn-sm" href="{{ '/assets/data/scribal-fingerprint-crops.json' | relative_url }}">Download JSON</a>
</p>

<div class="grapheme-tools">
  <div>
    <label for="grapheme-select">Grapheme</label>
    <select id="grapheme-select"></select>
  </div>
  <div>
    <label for="grapheme-scribe">Scribe</label>
    <select id="grapheme-scribe"><option value="">All scribes</option></select>
  </div>
  <div>
    <label for="grapheme-manuscript">Manuscript</label>
    <select id="grapheme-manuscript"><option value="">All manuscripts</option></select>
  </div>
  <div>
    <label for="grapheme-script">Script Type</label>
    <select id="grapheme-script"><option value="">All scripts</option></select>
  </div>
  <div>
    <label for="grapheme-search">Search</label>
    <input id="grapheme-search" type="search" placeholder="Search place, script, manuscript...">
  </div>
</div>

<p id="grapheme-count" class="text-muted"></p>
<div id="grapheme-results"></div>

<script>
(function(){
  const dataUrl = '{{ "/assets/data/scribal-fingerprint-crops.json" | relative_url }}';
  const vocabularyUrl = '{{ "/vocabulary.json" | relative_url }}';
  const SCRIPT_VOCAB_FIELD = 'Normalised script(s)';
  const graphemeSelect = document.getElementById('grapheme-select');
  const scribeSelect = document.getElementById('grapheme-scribe');
  const manuscriptSelect = document.getElementById('grapheme-manuscript');
  const scriptSelect = document.getElementById('grapheme-script');
  const searchInput = document.getElementById('grapheme-search');
  const count = document.getElementById('grapheme-count');
  const results = document.getElementById('grapheme-results');
  let rows = [];

  function norm(value){ return String(value || '').toLowerCase().trim(); }
  function unique(values){ return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b)); }
  function option(value){ const el = document.createElement('option'); el.value = value; el.textContent = value; return el; }
  function rowScripts(row){
    if (Array.isArray(row.scripts)) return row.scripts.map(value => String(value).trim()).filter(Boolean);
    return String(row.scripts || row.script || '')
      .split(/[;,]/)
      .map(value => value.trim())
      .filter(Boolean);
  }

  function fillSelect(select, values, firstLabel){
    select.innerHTML = '';
    select.appendChild(option(''));
    select.options[0].textContent = firstLabel;
    values.forEach(value => select.appendChild(option(value)));
  }

  function render(){
    const grapheme = graphemeSelect.value;
    const scribe = scribeSelect.value;
    const manuscript = manuscriptSelect.value;
    const script = scriptSelect.value;
    const q = norm(searchInput.value);
    const filtered = rows.filter(row => {
      const haystack = norm([row.scribe_title, row.manuscript_title, row.place, row.script, row.date].join(' '));
      return (!grapheme || row.grapheme === grapheme) &&
        (!scribe || row.scribe_title === scribe) &&
        (!manuscript || row.manuscript_title === manuscript) &&
        (!script || rowScripts(row).includes(script)) &&
        (!q || haystack.includes(q));
    });

    const groups = new Map();
    filtered.forEach(row => {
      const key = row.scribe_title + '||' + row.manuscript_title;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });

    count.textContent = `${filtered.length} crop${filtered.length === 1 ? '' : 's'} in ${groups.size} group${groups.size === 1 ? '' : 's'}`;
    results.innerHTML = '';
    groups.forEach((items) => {
      const first = items[0];
      const section = document.createElement('section');
      section.className = 'grapheme-group';
      section.innerHTML = `<h3>${first.scribe_title}</h3><p class="text-muted">${first.manuscript_title} · ${first.script || 'script unknown'} · ${first.date || 'date unknown'}</p>`;
      const cropGrid = document.createElement('div');
      cropGrid.className = 'grapheme-crops';
      items.slice(0, 80).forEach(row => {
        const crop = document.createElement('div');
        crop.className = 'grapheme-crop';
        crop.innerHTML = `<a href="${row.image}" target="_blank" rel="noopener"><img src="${row.image}" alt="${row.grapheme} crop from ${row.scribe_title}" loading="lazy"></a><a href="${row.scribe_url}">${row.grapheme}</a>`;
        cropGrid.appendChild(crop);
      });
      section.appendChild(cropGrid);
      results.appendChild(section);
    });
  }

  Promise.all([
    fetch(dataUrl).then(response => response.json()),
    fetch(vocabularyUrl).then(response => response.json())
  ]).then(([payload, vocabulary]) => {
    rows = payload.rows || [];
    const scriptVocabulary = vocabulary.field_vocabularies?.[SCRIPT_VOCAB_FIELD] || {};
    const scriptValues = unique(Object.values(scriptVocabulary).map(value => String(value)));
    fillSelect(graphemeSelect, unique(rows.map(row => row.grapheme)), 'All graphemes');
    fillSelect(scribeSelect, unique(rows.map(row => row.scribe_title)), 'All scribes');
    fillSelect(manuscriptSelect, unique(rows.map(row => row.manuscript_title)), 'All manuscripts');
    fillSelect(scriptSelect, scriptValues, 'All scripts');
    graphemeSelect.value = rows.some(row => row.grapheme === 'long s') ? 'long s' : (graphemeSelect.options[1] && graphemeSelect.options[1].value) || '';
    render();
  });

  [graphemeSelect, scribeSelect, manuscriptSelect, scriptSelect, searchInput].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
})();
</script>
