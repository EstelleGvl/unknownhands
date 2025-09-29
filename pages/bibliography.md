---
layout: page
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
permalink: /bibliography/
---

# Select Bibliography - Female Scribes and Women's Literacy

<ul class="bib">
{% for ref in site.data.bibliography %}

  {%- comment -%} ===== Names (authors; fallback to editors) ===== {%- endcomment -%}
  {% assign authors = ref.author %}
  {% assign editors = ref.editor %}
  {% assign names_list = "" %}

  {% if authors %}
    {% for p in authors %}
      {% assign nm = "" %}
      {% if p.literal %}
        {% assign nm = p.literal %}
      {% elsif p.family or p.given %}
        {% if p.family and p.given %}
          {% assign nm = p.family | append: ", " | append: p.given %}
        {% elsif p.family %}
          {% assign nm = p.family %}
        {% else %}
          {% assign nm = p.given %}
        {% endif %}
      {% endif %}
      {% if nm != "" %}
        {% if names_list == "" %}
          {% assign names_list = nm %}
        {% elsif forloop.last %}
          {% assign names_list = names_list | append: " and " | append: nm %}
        {% else %}
          {% assign names_list = names_list | append: ", " | append: nm %}
        {% endif %}
      {% endif %}
    {% endfor %}
  {% endif %}

  {% assign editors_str = "" %}
  {% if editors %}
    {% for e in editors %}
      {% assign e_nm = "" %}
      {% if e.literal %}
        {% assign e_nm = e.literal %}
      {% elsif e.family or e.given %}
        {% if e.family and e.given %}
          {% assign e_nm = e.family | append: ", " | append: e.given %}
        {% elsif e.family %}
          {% assign e_nm = e.family %}
        {% else %}
          {% assign e_nm = e.given %}
        {% endif %}
      {% endif %}
      {% if e_nm != "" %}
        {% if editors_str == "" %}
          {% assign editors_str = e_nm %}
        {% elsif forloop.last %}
          {% assign editors_str = editors_str | append: " and " | append: e_nm %}
        {% else %}
          {% assign editors_str = editors_str | append: ", " | append: e_nm %}
        {% endif %}
      {% endif %}
    {% endfor %}
  {% endif %}

  {% assign year = nil %}
  {% if ref.issued and ref.issued["date-parts"] and ref.issued["date-parts"][0][0] %}
    {% assign year = ref.issued["date-parts"][0][0] %}
  {% endif %}

  {%- comment -%} Build sort key: author/editor or title + year {%- endcomment -%}
  {% assign primary = "" %}
  {% if ref.author and ref.author[0] %}
    {% assign p0 = ref.author[0] %}
  {% elsif ref.editor and ref.editor[0] %}
    {% assign p0 = ref.editor[0] %}
  {% endif %}
  {% if p0 %}
    {% if p0.literal %}
      {% assign primary = p0.literal %}
    {% elsif p0.family %}
      {% assign primary = p0.family %}
    {% elsif p0.given %}
      {% assign primary = p0.given %}
    {% endif %}
  {% endif %}
  {% if primary == "" %}
    {% assign primary = ref.title | default: "" %}
  {% endif %}
  {% assign sortkey = primary | downcase | slugify: 'latin' | append: '|' | append: year | append: '|' | append: (ref.title | downcase | slugify: 'latin') %}

  <li class="bib-item" data-sortkey="{{ sortkey }}">

    {%- if names_list != "" -%}
      {{ names_list }}.
    {%- elsif editors_str != "" -%}
      {{ editors_str }}{% if editors and editors.size > 1 %}, eds.{% else %}, ed.{% endif %}
    {%- endif -%}

    {%- case ref.type -%}

      {%- when "article-journal" -%}
        “{{ ref.title }}.” <em>{{ ref["container-title"] }}</em>
        {%- if ref.volume %} {{ ref.volume }}{% endif -%}
        {%- if ref.issue %}, no. {{ ref.issue }}{% endif -%}
        {%- if year %} ({{ year }}){% endif -%}
        {%- if ref.page %}: {{ ref.page }}{% endif -%}.
        {%- if ref.DOI -%}
          <a href="https://doi.org/{{ ref.DOI }}" target="_blank">https://doi.org/{{ ref.DOI }}</a>.
        {%- elsif ref.URL -%}
          <a href="{{ ref.URL }}" target="_blank">{{ ref.URL }}</a>
        {%- endif %}

      {%- when "chapter" -%}
        “{{ ref.title }}.” In <em>{{ ref["container-title"] }}</em>
        {%- if editors_str != "" %}, edited by {{ editors_str }}{% endif -%}
        {%- if ref.page %}, {{ ref.page }}{% endif -%}.
        {%- if ref["publisher-place"] or ref.publisher %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {%- elsif year %} {{ year }}.{% endif -%}
        {%- if ref.DOI -%}
          <a href="https://doi.org/{{ ref.DOI }}" target="_blank">https://doi.org/{{ ref.DOI }}</a>.
        {%- elsif ref.URL -%}
          <a href="{{ ref.URL }}" target="_blank">{{ ref.URL }}</a>
        {%- endif %}

      {%- when "book" -%}
        <em>{{ ref.title }}</em>.
        {%- if ref["publisher-place"] or ref.publisher %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {%- elsif year %} {{ year }}.{% endif -%}
        {%- if ref.DOI -%}
          <a href="https://doi.org/{{ ref.DOI }}" target="_blank">https://doi.org/{{ ref.DOI }}</a>.
        {%- elsif ref.URL -%}
          <a href="{{ ref.URL }}" target="_blank">{{ ref.URL }}</a>
        {%- endif %}

      {%- else -%}
        {% if ref.title %}<em>{{ ref.title }}</em>.{% endif %}
        {% if ref.publisher or ref["publisher-place"] %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {% elsif year %} {{ year }}.{% endif %}
        {%- if ref.DOI -%}
          <a href="https://doi.org/{{ ref.DOI }}" target="_blank">https://doi.org/{{ ref.DOI }}</a>.
        {%- elsif ref.URL -%}
          <a href="{{ ref.URL }}" target="_blank">{{ ref.URL }}</a>
        {%- endif %}
    {%- endcase -%}
  </li>

{% endfor %}
</ul>

<script>
document.addEventListener('DOMContentLoaded', function () {
  const list = document.querySelector('.bib');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li.bib-item'));
  items.sort((a, b) => a.dataset.sortkey.localeCompare(b.dataset.sortkey, undefined, { sensitivity: 'base' }));
  items.forEach(li => list.appendChild(li));
});
</script>