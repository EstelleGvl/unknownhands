---
layout: page
permalink: /scribal-fingerprints/audit/
show_title: false
banner:
  image: "BnFfrançais603_81v.jpg"
  y: "50%"
  clickable: yes
  height: '400px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

# Scribal Fingerprint Quality Audit

This page summarizes the automatically generated fingerprint profiles and highlights profiles that may need closer visual review. It does not validate every IIIF image request in advance; instead, it checks the structure of each profile, the number of candidate crops, missing graphemes, and whether a profile depends on folio-range extraction.

{% assign target_graphemes = "a|b|c|d|e|g|h|l|o|p|q|r|s|t|long s|rotund r|insular d" | split: "|" %}

<style>
  .audit-tools{
    display:grid;
    grid-template-columns:minmax(220px, 1fr) minmax(150px, 220px);
    gap:.75rem;
    align-items:end;
    margin:1.5rem 0;
  }
  .audit-tools label{ display:block; font-weight:600; font-size:.9rem; margin-bottom:.25rem; }
  .audit-tools input,
  .audit-tools select{ width:100%; border:1px solid #d8d8d8; border-radius:.35rem; padding:.45rem .55rem; }
  .audit-table{ width:100%; border-collapse:collapse; font-size:.92rem; }
  .audit-table th,
  .audit-table td{ border-top:1px solid #e5e5e5; padding:.55rem .45rem; vertical-align:top; }
  .audit-table th{ text-align:left; background:#fafafa; }
  .audit-warnings span{ display:inline-block; border:1px solid #e1c46b; background:#fff8dd; border-radius:999px; padding:.1rem .45rem; margin:.1rem .15rem .1rem 0; font-size:.82rem; }
  .audit-ok{ color:#497a39; font-weight:600; }
  .audit-muted{ color:#777; }
  @media (max-width: 900px){
    .audit-tools{ grid-template-columns:1fr; }
    .audit-table{ display:block; overflow-x:auto; white-space:nowrap; }
  }
</style>

<div class="audit-tools" aria-label="Filter fingerprint audit rows">
  <div>
    <label for="audit-search">Search</label>
    <input id="audit-search" type="search" placeholder="Search scribe, manuscript, place, script...">
  </div>
  <div>
    <label for="audit-warning">Warnings</label>
    <select id="audit-warning">
      <option value="">All profiles</option>
      <option value="warning">With warnings</option>
      <option value="ok">No warnings</option>
    </select>
  </div>
</div>

<p id="audit-count" class="text-muted"></p>

<table class="audit-table">
  <thead>
    <tr>
      <th>Profile</th>
      <th>Manuscripts</th>
      <th>Extraction Scope</th>
      <th>Graphemes</th>
      <th>Samples</th>
      <th>Missing Graphemes</th>
      <th>Warnings</th>
    </tr>
  </thead>
  <tbody>
    {% for scribe in site.scribes %}
    {% assign sample_total = 0 %}
    {% assign range_based = false %}
    {% assign legacy_max = false %}
    {% assign missing_count = 0 %}
    {% capture available_letters %}{% for feature in scribe.features %}|{{ feature.letter }}|{% endfor %}{% endcapture %}
    {% capture missing_tokens %}{% for grapheme in target_graphemes %}{% assign token = grapheme | prepend: "|" | append: "|" %}{% unless available_letters contains token %}{% assign missing_count = missing_count | plus: 1 %}|{{ grapheme }}{% endunless %}{% endfor %}{% endcapture %}
    {% for manuscript in scribe.manuscripts %}
      {% if manuscript.source_range and manuscript.source_range != "" and manuscript.source_range != "Full manuscript" %}
        {% assign range_based = true %}
      {% endif %}
    {% endfor %}
    {% for feature in scribe.features %}
      {% for ms in feature.manuscripts %}
        {% if ms.samples and ms.samples.size > 0 %}
          {% assign sample_total = sample_total | plus: ms.samples.size %}
          {% for sample in ms.samples %}
            {% if sample.image contains "/max/0/default.jpg" %}
              {% assign legacy_max = true %}
            {% endif %}
          {% endfor %}
        {% else %}
          {% assign sample_total = sample_total | plus: ms.images.size %}
          {% for image in ms.images %}
            {% if image contains "/max/0/default.jpg" %}
              {% assign legacy_max = true %}
            {% endif %}
          {% endfor %}
        {% endif %}
      {% endfor %}
    {% endfor %}
    {% assign warning_count = 0 %}
    {% if scribe.features.size < target_graphemes.size %}{% assign warning_count = warning_count | plus: 1 %}{% endif %}
    {% if sample_total < 50 %}{% assign warning_count = warning_count | plus: 1 %}{% endif %}
    {% if legacy_max %}{% assign warning_count = warning_count | plus: 1 %}{% endif %}
    {% capture search_text %}{{ scribe.title }} {{ scribe.metadata.place }} {{ scribe.metadata.script }} {% for manuscript in scribe.manuscripts %} {{ manuscript.title }} {{ manuscript.source_range }} {% endfor %}{% endcapture %}
    <tr class="audit-row"
        data-search="{{ search_text | downcase | escape }}"
        data-warning="{% if warning_count > 0 %}warning{% else %}ok{% endif %}">
      <td><a href="{{ scribe.url | relative_url }}">{{ scribe.title }}</a></td>
      <td>{{ scribe.manuscripts.size }}</td>
      <td>{% if range_based %}Mapped folio range{% else %}Full manuscript{% endif %}</td>
      <td>{{ scribe.features.size }} / {{ target_graphemes.size }}</td>
      <td>{{ sample_total }}</td>
      <td>{% assign clean_missing = missing_tokens | remove_first: "|" | replace: "|", ", " | strip %}{% if clean_missing != "" %}{{ clean_missing }}{% else %}<span class="audit-ok">None</span>{% endif %}</td>
      <td class="audit-warnings">
        {% if scribe.features.size < target_graphemes.size %}<span>missing graphemes</span>{% endif %}
        {% if sample_total < 50 %}<span>low sample count</span>{% endif %}
        {% if legacy_max %}<span>legacy IIIF max URL</span>{% endif %}
        {% if warning_count == 0 %}<span class="audit-ok">OK</span>{% endif %}
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>

<script>
(function(){
  const rows = Array.from(document.querySelectorAll('.audit-row'));
  const search = document.getElementById('audit-search');
  const warning = document.getElementById('audit-warning');
  const count = document.getElementById('audit-count');

  function norm(value){ return String(value || '').toLowerCase().trim(); }

  function applyFilters(){
    const q = norm(search && search.value);
    const w = norm(warning && warning.value);
    let shown = 0;

    rows.forEach(row => {
      const matches = (!q || norm(row.dataset.search).includes(q)) && (!w || norm(row.dataset.warning) === w);
      row.style.display = matches ? '' : 'none';
      if (matches) shown += 1;
    });

    if (count) count.textContent = `${shown} profile${shown === 1 ? '' : 's'} shown`;
  }

  [search, warning].forEach(el => {
    if (el) el.addEventListener('input', applyFilters);
    if (el) el.addEventListener('change', applyFilters);
  });
  applyFilters();
})();
</script>
