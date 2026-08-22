---
layout: page
permalink: /scribal-fingerprints/compare/
show_title: false
banner:
  image: "BnFfrançais603_81v.jpg"
  y: "50%"
  clickable: yes
  height: '400px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

# Compare Fingerprints

Use this view to compare two scribes or two manuscripts for the same grapheme.

<style>
  .compare-tools{ display:grid; grid-template-columns:repeat(5, minmax(140px, 1fr)); gap:.75rem; align-items:end; margin:1.25rem 0; }
  .compare-tools label{ display:block; font-weight:600; font-size:.9rem; margin-bottom:.25rem; }
  .compare-tools select{ width:100%; border:1px solid #d8d8d8; border-radius:2px; padding:.45rem .55rem; }
  .compare-grid{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; }
  .compare-panel{ border:1px solid #e2e2e2; border-radius:2px; padding:1rem; min-height:240px; }
  .compare-crops{ display:flex; flex-wrap:wrap; gap:.5rem; }
  .compare-crop{ width:104px; border:1px solid #ddd; padding:2px; background:#fff; }
  .compare-crop img{ width:100%; height:92px; object-fit:contain; background:#f5f5f5; display:block; }
  .compare-crop span{ display:block; font-size:.75rem; color:#666; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  @media (max-width: 1000px){ .compare-tools,.compare-grid{ grid-template-columns:1fr; } }
</style>

<div class="compare-tools">
  <div>
    <label for="compare-grapheme">Grapheme</label>
    <select id="compare-grapheme"></select>
  </div>
  <div>
    <label for="compare-left-type">Left</label>
    <select id="compare-left-type">
      <option value="scribe_title">Scribe</option>
      <option value="manuscript_title">Manuscript</option>
    </select>
  </div>
  <div>
    <label for="compare-left">Left Item</label>
    <select id="compare-left"></select>
  </div>
  <div>
    <label for="compare-right-type">Right</label>
    <select id="compare-right-type">
      <option value="scribe_title">Scribe</option>
      <option value="manuscript_title">Manuscript</option>
    </select>
  </div>
  <div>
    <label for="compare-right">Right Item</label>
    <select id="compare-right"></select>
  </div>
</div>

<div class="compare-grid">
  <section class="compare-panel">
    <h3 id="compare-left-title">Left</h3>
    <p id="compare-left-meta" class="text-muted"></p>
    <div id="compare-left-results" class="compare-crops"></div>
  </section>
  <section class="compare-panel">
    <h3 id="compare-right-title">Right</h3>
    <p id="compare-right-meta" class="text-muted"></p>
    <div id="compare-right-results" class="compare-crops"></div>
  </section>
</div>

<script>
(function(){
  const dataUrl = '{{ "/assets/data/scribal-fingerprint-crops.json" | relative_url }}';
  const grapheme = document.getElementById('compare-grapheme');
  const leftType = document.getElementById('compare-left-type');
  const rightType = document.getElementById('compare-right-type');
  const left = document.getElementById('compare-left');
  const right = document.getElementById('compare-right');
  let rows = [];

  function unique(values){ return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b)); }
  function fill(select, values){
    select.innerHTML = '';
    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function refreshItemSelects(){
    const leftCurrent = left.value;
    const rightCurrent = right.value;
    fill(left, unique(rows.map(row => row[leftType.value])));
    fill(right, unique(rows.map(row => row[rightType.value])));
    if (leftCurrent) left.value = leftCurrent;
    if (rightCurrent) right.value = rightCurrent;
    if (!right.value && right.options.length > 1) right.selectedIndex = 1;
    render();
  }

  function panelRows(type, value){
    return rows.filter(row => row.grapheme === grapheme.value && row[type] === value).slice(0, 120);
  }

  function renderPanel(prefix, type, value){
    const items = panelRows(type, value);
    document.getElementById(prefix + '-title').textContent = value || 'Select an item';
    document.getElementById(prefix + '-meta').textContent = `${items.length} crop${items.length === 1 ? '' : 's'} for ${grapheme.value || 'selected grapheme'}`;
    const target = document.getElementById(prefix + '-results');
    target.innerHTML = '';
    items.forEach(row => {
      const crop = document.createElement('a');
      crop.className = 'compare-crop';
      crop.href = row.image;
      crop.target = '_blank';
      crop.rel = 'noopener';
      crop.innerHTML = `<img src="${row.image}" alt="${row.grapheme} crop" loading="lazy"><span>${row.manuscript_title}</span>`;
      target.appendChild(crop);
    });
  }

  function render(){
    renderPanel('compare-left', leftType.value, left.value);
    renderPanel('compare-right', rightType.value, right.value);
  }

  fetch(dataUrl).then(response => response.json()).then(payload => {
    rows = payload.rows || [];
    fill(grapheme, unique(rows.map(row => row.grapheme)));
    grapheme.value = rows.some(row => row.grapheme === 'long s') ? 'long s' : (grapheme.options[0] && grapheme.options[0].value) || '';
    refreshItemSelects();
  });

  [grapheme, left, right].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  [leftType, rightType].forEach(el => {
    el.addEventListener('change', refreshItemSelects);
  });
})();
</script>
