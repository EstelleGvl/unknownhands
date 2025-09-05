---
layout: page
show_title: false
permalink: /bibliography/
---

# Presentations

Findings from Unknown Hands have been presented at international conferences and workshops, including:
  - Guéville, Estelle. “Multilingualism and Literacy Among Medieval Female Scribes.” International Congress on Medieval Studies, Western Michigan University. 9 May 2025.
  - Guéville, Estelle.“Unknown Hands: Addressing the Scribal Gender Gap in Manuscript Studies.” Harvard-Yale-Brown Graduate Conference in Book History. 5 May 2025.
  - Guéville, Estelle.“Unknown Hands. The Scribal Gender Gap and Historical Exclusion.” Yale Medieval Lunch Colloquium, Yale University. 18 February 2025.
  - Guéville, Estelle.“Manuscript Collections and Inclusivity: Making Premodern Female Scribes’ Production Accessible.” (Re)imag(in)ing the Past Symposium, Gjøvik, Norway. 4–6 December 2024.
  - Guéville, Estelle.“Unknown Hands: Medieval and Early Modern Manuscripts and their Female Scribes.” International Congress on Medieval Studies, Western Michigan University. May 2024.
  - Guéville, Estelle.“Women in the Scriptorium: Female Manuscript Production in Pre-Modern Europe.” Race, Gender, and Sexuality Studies Colloquium, Yale University. 24 October 2023.
  - Guéville, Estelle.“Unknown Hands: Medieval and Early Modern Manuscripts and their Female Scribes.” Yale Medieval Lunch Colloquium, Yale University. 24 October 2023.


# Scholarship about Female Scribes and Women's Literacy

<ul class="bib">
{% for ref in site.data.bibliography %}

  {%- comment -%} ------ Names (authors; fallback to editors) ------ {%- endcomment -%}
  {% assign authors = ref.author %}
  {% assign editors = ref.editor %}
  {% assign names = "" %}

  {% if authors %}
    {% for a in authors %}
      {% assign part = a.family %}
      {% if a.given %}{% assign part = a.family | append: ", " | append: a.given %}{% endif %}
      {% if forloop.first %}
        {% assign names = part %}
      {% elsif forloop.last %}
        {% assign names = names | append: " and " | append: part %}
      {% else %}
        {% assign names = names | append: ", " | append: part %}
      {% endif %}
    {% endfor %}
  {% endif %}

  {%- comment -%} Editors string (used for chapters/books when needed) {%- endcomment -%}
  {% assign editors_str = "" %}
  {% if editors %}
    {% for e in editors %}
      {% assign epart = e.family %}
      {% if e.given %}{% assign epart = e.family | append: ", " | append: e.given %}{% endif %}
      {% if forloop.first %}
        {% assign editors_str = epart %}
      {% elsif forloop.last %}
        {% assign editors_str = editors_str | append: " and " | append: epart %}
      {% else %}
        {% assign editors_str = editors_str | append: ", " | append: epart %}
      {% endif %}
    {% endfor %}
  {% endif %}

  {%- comment -%} ------ Year ------ {%- endcomment -%}
  {% assign year = nil %}
  {% if ref.issued and ref.issued["date-parts"] and ref.issued["date-parts"][0][0] %}
    {% assign year = ref.issued["date-parts"][0][0] %}
  {% endif %}

  <li class="bib-item">
    {%- if names != "" -%}
      {{ names }}.
    {%- elsif editors_str != "" -%}
      {{ editors_str }}{% if editors.size > 1 %}, eds.{% else %}, ed.{% endif %}
    {%- endif -%}

    {%- case ref.type -%}

      {%- when "article-journal" -%}
        “{{ ref.title }}.” <em>{{ ref["container-title"] }}</em>
        {%- if ref.volume %} {{ ref.volume }}{% endif -%}
        {%- if ref.issue %}, no. {{ ref.issue }}{% endif -%}
        {%- if year %} ({{ year }}){% endif -%}
        {%- if ref.page %}: {{ ref.page }}{% endif -%}.
        {%- if ref.DOI %} https://doi.org/{{ ref.DOI }}.{% elsif ref.URL %} {{ ref.URL }}{% endif %}

      {%- when "chapter" -%}
        “{{ ref.title }}.” In <em>{{ ref["container-title"] }}</em>
        {%- if editors_str != "" %}, edited by {{ editors_str }}{% endif -%}
        {%- if ref.page %}, {{ ref.page }}{% endif -%}.
        {%- if ref["publisher-place"] or ref.publisher %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {%- elsif year %} {{ year }}.{% endif -%}
        {%- if ref.DOI %} https://doi.org/{{ ref.DOI }}.{% elsif ref.URL %} {{ ref.URL }}{% endif %}

      {%- when "paper-conference" -%}
        “{{ ref.title }}.” In <em>{{ ref["container-title"] | default: ref.event }}</em>
        {%- if editors_str != "" %}, edited by {{ editors_str }}{% endif -%}
        {%- if ref.page %}, {{ ref.page }}{% endif -%}.
        {%- if ref["publisher-place"] or ref.publisher %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {%- elsif year %} {{ year }}.{% endif -%}
        {%- if ref.DOI %} https://doi.org/{{ ref.DOI }}.{% elsif ref.URL %} {{ ref.URL }}{% endif %}

      {%- when "book" -%}
        <em>{{ ref.title }}</em>.
        {%- if ref["publisher-place"] or ref.publisher %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {%- elsif year %} {{ year }}.{% endif -%}
        {%- if ref.DOI %} https://doi.org/{{ ref.DOI }}.{% elsif ref.URL %} {{ ref.URL }}{% endif %}

      {%- when "thesis" -%}
        “{{ ref.title }}.”
        {%- if ref.genre %} {{ ref.genre }}{% else %} Thesis{% endif -%},
        {%- if ref.publisher %} {{ ref.publisher }},{% endif -%}
        {%- if ref["publisher-place"] %} {{ ref["publisher-place"] }},{% endif -%}
        {%- if year %} {{ year }}.{% endif -%}
        {%- if ref.URL %} {{ ref.URL }}{% endif %}

      {%- when "webpage" -%}
        “{{ ref.title }}.”
        {%- if ref["container-title"] %} <em>{{ ref["container-title"] }}</em>.{% endif -%}
        {%- if year %} {{ year }}.{% endif -%}
        {%- if ref.URL %} {{ ref.URL }}{% endif %}

      {%- else -%}  {#—fallback—#}
        {% if ref.title %}<em>{{ ref.title }}</em>.{% endif %}
        {% if ref["container-title"] %} <em>{{ ref["container-title"] }}</em>.{% endif %}
        {% if ref.publisher or ref["publisher-place"] %}
          {{ " " }}{% if ref["publisher-place"] %}{{ ref["publisher-place"] }}: {% endif %}{% if ref.publisher %}{{ ref.publisher }}{% endif %}{% if year %}, {{ year }}{% endif %}.
        {% elsif year %} {{ year }}.{% endif %}
        {%- if ref.DOI %} https://doi.org/{{ ref.DOI }}.{% elsif ref.URL %} {{ ref.URL }}{% endif %}
    {%- endcase -%}
  </li>

{% endfor %}
</ul>