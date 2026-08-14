---
layout: page
show_title: false
banner:
  image: "BnFfrançais603_81v.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
permalink: /roadmap/
---
 
Unknown Hands is under active development. This roadmap separates the current database snapshot from work that is still being prepared for public release. Dates and priorities may evolve as the project grows.


# Current Data Snapshot

The figures below come from the JSON exports currently used by the website and were reviewed in August 2026. They count public records of each entity type; they do not include related records bundled into another export.

<div class="roadmap-table-wrap" role="region" aria-label="Current data snapshot" tabindex="0">
  <table class="roadmap-table">
    <thead>
      <tr>
        <th scope="col">Entity type</th>
        <th scope="col" class="roadmap-count">Records</th>
        <th scope="col">Current status</th>
      </tr>
    </thead>
    <tbody>
      <tr><th scope="row">Scribal Units</th><td class="roadmap-count">1,924</td><td><span class="roadmap-status">Ongoing</span> Data enrichment and quality control</td></tr>
      <tr><th scope="row">Production Units</th><td class="roadmap-count">1,263</td><td><span class="roadmap-status">Ongoing</span> Data enrichment and quality control</td></tr>
      <tr><th scope="row">Manuscripts</th><td class="roadmap-count">1,203</td><td><span class="roadmap-status roadmap-status--established">Established</span> Corrections and additions continue</td></tr>
      <tr><th scope="row">Monastic Institutions</th><td class="roadmap-count">3,647</td><td><span class="roadmap-status">Ongoing</span> Cataloguing and record linkage</td></tr>
      <tr><th scope="row">Holding Institutions</th><td class="roadmap-count">231</td><td><span class="roadmap-status roadmap-status--established">Established</span> Corrections continue</td></tr>
      <tr><th scope="row">Historical People</th><td class="roadmap-count">1,625</td><td><span class="roadmap-status">Ongoing</span> Biographical enrichment and relationship review</td></tr>
      <tr><th scope="row">Texts</th><td class="roadmap-count">1,163</td><td><span class="roadmap-status">Ongoing</span> Classification and relationship review</td></tr>
    </tbody>
  </table>
</div>

Completion percentages have been removed because record presence and scholarly completeness are not equivalent. Future progress reporting will distinguish record creation, metadata enrichment, relationship review, and quality assurance.


# Current Development Phase

- Continue validating the database interface and analytical modules before public release.
- Complete methodological documentation for derived statistics, maps, timelines, and networks.
- Continue accessibility, responsive-design, and data-quality review.
- Prepare versioned deposits of data and code in trusted repositories such as Huma-Num and Zenodo.
- Develop teaching resources and pedagogical tools for students and the wider public.
- Organize workshops and panels on digital approaches to female scribes.


## Future Developments
  - Additional research on Western Europe and integration of manuscripts whose attribution to a female scribe is considered “low probability.”  
  - Expansion of linguistic and cultural coverage: integration of additional European vernaculars as well as extra-European traditions (Arabic, Hebrew, Syriac, Coptic, etc.).  
  - Development of the international scholarly network to foster collaboration, data sharing, and cross-corpus comparison.  
  - Integration of new research axes: illuminations and artistic description, stylistic and iconographic analysis, materials and techniques.  
  - Increased interoperability: implementing APIs or standardized exports (IIIF, TEI, Linked Open Data) to connect Unknown Hands with other international databases.  
  - Institutional partnerships: establishing agreements with libraries and museums to enrich the database through official deposits or collaborative cataloging.  
  - Carefully documented quantitative analysis of unidentified scribes, manuscript production, and historical networks.

<style>
.roadmap-table-wrap {
  margin: 1.5rem 0;
  overflow-x: auto;
  border: 1px solid #e5ddca;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 4px 18px rgba(53, 43, 20, 0.06);
}
.roadmap-table {
  width: 100%;
  min-width: 720px;
  margin: 0;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.roadmap-table thead {
  background: #f7f2e6;
  color: #3d3525;
}
.roadmap-table th,
.roadmap-table td {
  padding: 0.9rem 1rem;
  border: 0;
  border-bottom: 1px solid #eee8da;
  vertical-align: middle;
}
.roadmap-table tbody tr:last-child th,
.roadmap-table tbody tr:last-child td { border-bottom: 0; }
.roadmap-table tbody tr:nth-child(even) { background: #fcfbf8; }
.roadmap-table th { text-align: left; font-weight: 600; }
.roadmap-table .roadmap-count {
  width: 8rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.roadmap-status {
  display: inline-block;
  margin-right: 0.5rem;
  color: inherit;
  font-size: 0.85rem;
  font-weight: 700;
}
.roadmap-status--established {
  color: inherit;
}
</style>
