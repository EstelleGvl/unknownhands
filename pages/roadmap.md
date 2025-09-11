---
layout: page
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
permalink: /roadmap/
---
 
Unknown Hands is under active development. This roadmap shares our current progress in data collection and database structuring, and outlines the milestones ahead. Dates are approximate and may evolve as the project grows.


# Current Progress

| Category              | Total found | % Catalogued | % in Heurist | Notes                          |
|-----------------------|-------------|--------------|--------------|--------------------------------|
| Scribal Units      | 1,537       | 65.2%        | 100%           | Data entry ongoing             |
| Production Units      | TBD       | TBD        | ~5%           | Data entry ongoing             |
| Manuscripts           | 1,142       | 100%         | 100%         | Completed                      |
| Monastic Institutions | 3,663       | ~50%         | 100%         | Ongoing cataloguing            |
| Cultural Institutions | 177         | 100%         | 100%         | Completed                      |
| People                | 1,022       | ~20%         | 97.5%        | Biographical data in progress  |
| Texts                 | ~1,100      | 100%         | 100%         | Completed         |

<div id="progress"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
  const categories = [
    "Scribal Units",
    "Manuscripts",
    "Monastic Institutions",
    "Cultural Institutions",
    "People",
    "Texts"
  ];
  const completion = [65.2, 100, 50, 100, 20, 100];
  Plotly.newPlot("progress", [{
    x: completion,
    y: categories,
    type: "bar",
    orientation: "h",
    text: completion.map(p => p + "%"),
    textposition: "auto",
    marker: {color: "#444"}
  }], {
    title: "Cataloguing Progress by Category",
    xaxis: { title: "% Completed", range: [0,100] },
    margin: {l:200}
  });
</script>


# Milestones
## Fall 2025 (Now – Dec 2025)
  - Continue data entry for Scribal Units, Production Units, People, and Monastic Institutions.  
  - Finalize relationships in the Heurist database.  
  - Complete planned research trips (Belgium, Netherlands, France).  
  - **Goal:** core dataset entry completed by December 2025.

## First Trimester 2026
  - Release first public dataset snapshot online.
  - Launch a beta browse page with sample records and visualizations.
  - Integrate IIIF manifests for selected manuscripts (via Mirador).


## Second Trimester 2026
  - Release full searchable interface linked to the Heurist database.
  - Publish advanced visualizations (maps, timelines, network graphs).
  - Organize workshop/panels on digital approaches to female scribes.
  - Long-term sustainability: depositing the database and code in trusted repositories (Huma-Num, Zenodo, etc.) to ensure preservation and accessibility.
  - Develop teaching resources and pedagogical tools for students and the wider public.


## Future Developments
  - Additional research on Western Europe and integration of manuscripts whose attribution to a female scribe is considered “low probability.”  
  - Expansion of linguistic and cultural coverage: integration of additional European vernaculars as well as extra-European traditions (Arabic, Hebrew, Syriac, Coptic, etc.).  
  - Development of the international scholarly network to foster collaboration, data sharing, and cross-corpus comparison.  
  - Integration of new research axes: illuminations and artistic description, stylistic and iconographic analysis, materials and techniques.  
  - Increased interoperability: implementing APIs or standardized exports (IIIF, TEI, Linked Open Data) to connect Unknown Hands with other international databases.  
  - Institutional partnerships: establishing agreements with libraries and museums to enrich the database through official deposits or collaborative cataloging.  
  - Advanced quantitative analysis: developing statistical and AI models to estimate unidentified scribes or to compare networks of female and male production.
