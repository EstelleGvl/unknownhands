---
layout: page
show_title: false
cfp: true
banner:
  collection: unknownhands
  pid: obj10
  y: 25%
  clickable: yes
  height: '500px'
---

# Welcome to *Unknown Hands*!

*Unknown Hands* is the first large-scale project dedicated to uncovering, cataloguing, and visualizing the work of female scribes in Christian Europe before 1600. For centuries, the contributions of women to manuscript culture remained invisible or underestimated. This project seeks to bring them into focus.

Using archival research, codicology, paleography, and digital humanities methods, Unknown Hands compiles evidence of women’s involvement in book production: from explicitly named scribes to anonymous “hands” identified through palaeography and contextual study. The project introduces new models for studying manuscripts and pays particular attention to uncertainty, multilingualism, and collaborative practices.

Our goals are:
	•	To create the first open, searchable database of manuscripts copied by women.
	•	To map and visualize women’s scribal activity across Europe.
	•	To provide resources for researchers, teachers, and the wider public.

The project is in active development. Explore our [About](/pages/about.md) page to learn more about the methods, see our [Roadmap](/pages/roadmap.md) for upcoming milestones, or visit the [Bibliography](/pages/bibliography.md) for key references on the subject of female scribes.


{% comment %}
Call for Papers box — ICMS 2026 (shows until the deadline)
Paste this block into pages/index.md (or your home layout).
{% endcomment %}

{% assign deadline_str = '2025-09-15 23:59:00 +0000' %}
{% assign deadline_unix = deadline_str | date: '%s' %}
{% assign now_unix = site.time | date: '%s' %}
{% if now_unix < deadline_unix %}
<aside class="cfp-box" role="note" aria-labelledby="cfp-title" style="
  border: 2px solid #222; border-radius: 12px; padding: 1rem 1.25rem;
  background:#fafafa; margin: 2rem 0; box-shadow: 0 1px 3px rgba(0,0,0,.06);">
  <h2 id="cfp-title" style="margin:0 0 .25rem 0;">📣 Call for Papers — ICMS 2026 (Virtual)</h2>
  <p style="margin:.25rem 0 1rem 0;">
    <strong>Session:</strong> <em>Female Scribes in the Pre-modern World</em><br>
    <strong>Conference:</strong> 61st International Congress on Medieval Studies, Kalamazoo<br>
    <strong>Dates:</strong> May 14–16, 2026 &nbsp;•&nbsp; <strong>Format:</strong> Virtual
  </p>

  <p style="margin:.75rem 0;">
    This panel examines the critical yet often unrecognized role of medieval women in manuscript production.
    We welcome multidisciplinary approaches—codicology, palaeography, prosopography, diplomatics, epigraphy,
    archaeology, art history, literary analysis, as well as quantitative and digital methods—across all regions and
    languages of the medieval world (Latin, Arabic, Syriac, Hebrew, and European vernaculars).
    Topics include identification of women scribes, their work and training; contributions highlighting female literacy
    and multilingualism are especially encouraged.
  </p>

  <ul style="margin:.5rem 0 1rem 1.25rem;">
    <li>Abstracts: ≤ 300 words</li>
    <li>Audience: researchers, scholars, librarians, curators, students</li>
    <li>Submission portal: Confex (see button below)</li>
  </ul>

  <p style="margin:.75rem 0 1rem 0;">
    <strong>Deadline:</strong> September 15, 2025
    {% assign days_left = deadline_unix | minus: now_unix | divided_by: 86400 %}
    <span style="opacity:.8;">({{ days_left }} day{% if days_left != 1 %}s{% endif %} left)</span>
  </p>

  <p style="margin:0;">
    <a href="https://icms.confex.com/icms/2026/prelim.cgi/Session/7492"
       style="display:inline-block; padding:.6rem 1rem; border:1px solid #222; border-radius:8px;
              text-decoration:none; font-weight:600;">
      Submit via Confex
    </a>
    &nbsp;&nbsp;
    <a href="/unknownhands/contact" style="text-decoration:underline;">Questions? Contact us</a>
  </p>
</aside>
{% endif %}

