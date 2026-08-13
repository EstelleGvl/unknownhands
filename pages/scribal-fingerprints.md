---
layout: page
permalink: /scribal-fingerprints/
title: "Scribal Fingerprints"
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '400px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

This module uses manuscript image regions and ALTO HTR exports to isolate recurring letterforms associated with identified hands. The goal is not to replace paleographical judgment, but to create a structured visual dossier for comparing how named or inferred scribes form selected graphemes across one or more manuscripts.

The current public profiles are generated only for scribes whose Heurist records, IIIF manifests, and ALTO transcriptions can be linked reliably enough to produce reviewable grapheme crops. Manuscripts are included when they have one production unit and either one scribal unit, or multiple scribal units with precise folio ranges that can be matched to IIIF canvas labels. Multi-scribe manuscripts are processed by scribal unit so samples from different hands are not mixed.

The profile list below is therefore intentionally conservative. Collaborative manuscripts without mappable folio ranges are excluded for now, because their crops could mix the work of different scribes. Generic low-attribution records labelled as unidentified hands, unidentified women, unidentified nuns, or similar placeholders are also excluded from the public fingerprint pages. The module keeps named women and curated inferred identities, including scholarly labels such as institutional scriptrix groups or numbered nuns identified in secondary scholarship. Use the [quality audit]({{ '/scribal-fingerprints/audit/' | relative_url }}) to review sample counts, missing graphemes, and profiles that need closer checking.

<style>
  .fingerprint-tools{
    display:grid;
    grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(140px, 200px));
    gap:.75rem;
    margin:1.5rem 0;
    align-items:end;
  }
  .fingerprint-tools label{ display:block; font-weight:600; font-size:.9rem; margin-bottom:.25rem; }
  .fingerprint-tools input,
  .fingerprint-tools select{
    width:100%;
    border:1px solid #d8d8d8;
    border-radius:.35rem;
    padding:.45rem .55rem;
  }
  .fingerprint-card{ border:1px solid #e5e5e5; border-radius:.5rem; padding:1rem; height:100%; }
  .fingerprint-meta{ color:#666; font-size:.92rem; margin-bottom:.75rem; }
  .fingerprint-tags{ display:flex; flex-wrap:wrap; gap:.35rem; margin:.5rem 0 .75rem; }
.fingerprint-tags span{ border:1px solid #e2e2e2; border-radius:999px; padding:.15rem .45rem; font-size:.82rem; color:#555; }
  .fingerprint-resource-links{ display:flex; flex-wrap:wrap; gap:.5rem; margin:1rem 0 1.5rem; }
  .method-grid{ display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:1rem; margin-top:1rem; }
  .method-block{ border-left:4px solid #d4af37; padding:.75rem 1rem; background:#faf9f5; }
  @media (max-width: 900px){
    .fingerprint-tools{ grid-template-columns:1fr; }
    .method-grid{ grid-template-columns:1fr; }
  }
</style>

## Identified Hands in the Corpus

<div class="fingerprint-resource-links">
  <a class="btn btn-outline-primary btn-sm" href="{{ '/scribal-fingerprints/graphemes/' | relative_url }}">Browse by Grapheme</a>
  <a class="btn btn-outline-primary btn-sm" href="{{ '/scribal-fingerprints/compare/' | relative_url }}">Compare Profiles</a>
  <a class="btn btn-outline-secondary btn-sm" href="{{ '/assets/data/scribal-fingerprint-crops.csv' | relative_url }}">Download Crop CSV</a>
  <a class="btn btn-outline-secondary btn-sm" href="{{ '/assets/data/scribal-fingerprint-crops.json' | relative_url }}">Download Crop JSON</a>
  <a class="btn btn-outline-secondary btn-sm" href="{{ '/scribal-fingerprints/audit/' | relative_url }}">Quality Audit</a>
</div>

<div class="fingerprint-tools" aria-label="Filter scribal fingerprint profiles">
  <div>
    <label for="fingerprint-search">Search</label>
    <input id="fingerprint-search" type="search" placeholder="Search scribe, manuscript, place, script...">
  </div>
  <div>
    <label for="fingerprint-place">Place</label>
    <select id="fingerprint-place">
      <option value="">All places</option>
      {% assign places = site.scribes | map: "metadata" | map: "place" | compact | uniq | sort %}
      {% for place in places %}
      <option value="{{ place | escape }}">{{ place }}</option>
      {% endfor %}
    </select>
  </div>
  <div>
    <label for="fingerprint-century">Century</label>
    <select id="fingerprint-century">
      <option value="">All centuries</option>
      {% assign centuries = site.scribes | map: "metadata" | map: "century" | compact | uniq | sort %}
      {% for century in centuries %}
      {% if century and century != "" %}<option value="{{ century | escape }}">{{ century }}</option>{% endif %}
      {% endfor %}
    </select>
  </div>
  <div>
    <label for="fingerprint-script">Script</label>
    <select id="fingerprint-script">
      <option value="">All scripts</option>
      {% capture script_tokens %}{% for scribe in site.scribes %}{% if scribe.metadata.scripts and scribe.metadata.scripts.size > 0 %}{% for script in scribe.metadata.scripts %}|{{ script }}{% endfor %}{% elsif scribe.metadata.script and scribe.metadata.script != "" %}|{{ scribe.metadata.script }}{% endif %}{% endfor %}{% endcapture %}
      {% assign scripts = script_tokens | remove_first: "|" | split: "|" | uniq | sort %}
      {% for script in scripts %}
      {% if script and script != "" %}<option value="{{ script | escape }}">{{ script }}</option>{% endif %}
      {% endfor %}
    </select>
  </div>
</div>

<p id="fingerprint-count" class="text-muted"></p>

<div class="row" id="fingerprint-results">
  {% for scribe in site.scribes %}
  {% assign manuscript_titles = scribe.manuscripts | map: "title" | join: " " %}
  {% assign scribe_scripts = scribe.metadata.scripts | default: empty %}
  {% if scribe_scripts == empty and scribe.metadata.script and scribe.metadata.script != "" %}
    {% assign scribe_scripts = scribe.metadata.script | split: ";" %}
  {% endif %}
  {% capture search_text %}
    {{ scribe.title }} {{ manuscript_titles }} {{ scribe.metadata.place }} {{ scribe.metadata.script }} {{ scribe.metadata.century }}
    {% for inst in scribe.metadata.affiliations %} {{ inst.name }} {{ inst.title }} {% endfor %}
  {% endcapture %}
  <div class="col-md-6 mb-4 fingerprint-result"
       data-title="{{ scribe.title | escape }}"
       data-place="{{ scribe.metadata.place | escape }}"
       data-century="{{ scribe.metadata.century | escape }}"
       data-script="{{ scribe_scripts | join: '|' | escape }}"
       data-search="{{ search_text | downcase | escape }}">
    <div class="fingerprint-card">
      <h5>{{ scribe.title }}</h5>
      <div class="fingerprint-meta">
        {{ scribe.manuscripts.size | default: 0 }} linked manuscript{% unless scribe.manuscripts.size == 1 %}s{% endunless %}
        {% if scribe.metadata.place and scribe.metadata.place != "" %} · {{ scribe.metadata.place }}{% endif %}
        {% if scribe.metadata.date and scribe.metadata.date != "" %} · {{ scribe.metadata.date }}{% endif %}
      </div>
      <div class="fingerprint-tags">
        {% if scribe.metadata.religious_or_lay_status and scribe.metadata.religious_or_lay_status != "" %}<span>{{ scribe.metadata.religious_or_lay_status }}</span>{% endif %}
        {% if scribe.metadata.century and scribe.metadata.century != "" %}<span>Century {{ scribe.metadata.century }}</span>{% endif %}
        {% if scribe.metadata.script and scribe.metadata.script != "" %}<span>{{ scribe.metadata.script }}</span>{% endif %}
        <span>{{ scribe.features.size | default: 0 }} graphemes</span>
      </div>
      <p>
        {% for manuscript in scribe.manuscripts limit: 2 %}
        {{ manuscript.title }}{% unless forloop.last %}; {% endunless %}
        {% endfor %}
        {% if scribe.manuscripts.size > 2 %} and {{ scribe.manuscripts.size | minus: 2 }} more{% endif %}
      </p>
      <a href="{{ scribe.url | relative_url }}" class="btn btn-outline-primary btn-sm">View Scribal Profile &rarr;</a>
    </div>
  </div>
  {% endfor %}
</div>

## Method

<div class="method-grid">
  <div class="method-block">
    <h4>Source Data</h4>
    <p>Profiles are generated from manuscripts that have IIIF manifests, ALTO exports, and Heurist records linking manuscripts, scribal units, production units, and historical people. During the June 2026 refresh, 127 ALTO and IIIF annotation manuscript folders were available for fingerprint extraction, 131 manuscript search chunks were generated from all searchable ALTO transcriptions, and 73 conservative public scribal fingerprint profiles were produced after excluding generic unidentified hands. Profiles from multi-scribe manuscripts display the folio range used for extraction.</p>
  </div>
  <div class="method-block">
    <h4>Image Selection</h4>
    <p>The extractor skips a percentage of the opening and closing pages, filters to the central text area, rejects suspiciously small, large, or distorted crop boxes, and samples across each manuscript so the displayed crops are not all taken from the same page.</p>
  </div>
  <div class="method-block">
    <h4>Grapheme Extraction</h4>
    <p>ALTO glyph coordinates are used first. ALTO word coordinates are used only when glyph coordinates are absent. Each profile displays up to 10 examples per grapheme per manuscript, grouped by source manuscript.</p>
  </div>
  <div class="method-block">
    <h4>Interpretation</h4>
    <p>The crops are candidates for paleographical comparison. They should be read as a reviewable visual dossier, not as final proof of scribal identity. Profile pages include optional crop metadata so weak or misplaced samples can be identified during visual quality control.</p>
  </div>
  <div class="method-block">
    <h4>Community Review</h4>
    <p>Individual crops can be flagged for review from each scribe profile. Public submissions are stored for moderation through a Netlify Function; exports of submitted flags require the private <code>FINGERPRINT_FLAGS_ADMIN_TOKEN</code> environment variable.</p>
  </div>
  <div class="method-block">
    <h4>Data Reuse</h4>
    <p>The crop index is available as CSV and JSON. These files include IIIF crop URLs and metadata rather than bundled image files, so users can inspect or download images directly from the holding institutions' IIIF services.</p>
  </div>
</div>

<script>
(function(){
  const cards = Array.from(document.querySelectorAll('.fingerprint-result'));
  const search = document.getElementById('fingerprint-search');
  const place = document.getElementById('fingerprint-place');
  const century = document.getElementById('fingerprint-century');
  const script = document.getElementById('fingerprint-script');
  const count = document.getElementById('fingerprint-count');

  function norm(value){ return String(value || '').toLowerCase().trim(); }

  function applyFilters(){
    const q = norm(search && search.value);
    const p = norm(place && place.value);
    const c = norm(century && century.value);
    const s = norm(script && script.value);
    let shown = 0;

    cards.forEach(card => {
      const haystack = norm(card.dataset.search);
      const matches =
        (!q || haystack.includes(q)) &&
        (!p || norm(card.dataset.place) === p) &&
        (!c || norm(card.dataset.century) === c) &&
        (!s || norm(card.dataset.script).split('|').map(value => value.trim()).includes(s));
      card.style.display = matches ? '' : 'none';
      if (matches) shown += 1;
    });

    if (count) {
      count.textContent = `${shown} profile${shown === 1 ? '' : 's'} shown`;
    }
  }

  [search, place, century, script].forEach(el => {
    if (el) el.addEventListener('input', applyFilters);
    if (el) el.addEventListener('change', applyFilters);
  });
  applyFilters();
})();
</script>
