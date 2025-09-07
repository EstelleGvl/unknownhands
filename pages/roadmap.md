---
layout: page
show_title: false
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

## Spring 2026
  - Release first public dataset snapshot (CSV/JSON exports).
  - Launch a beta browse page with sample records.
  - Add visualizations

## Fall 2026
  - Integrate IIIF manifests for selected manuscripts (via Mirador).
  - Release full searchable interface linked to the Heurist database.
  - Publish advanced visualizations (maps, timelines, network graphs).

## 2027
  - Develop teaching resources (assignments, case studies).
  - Organize workshop/panels on digital approaches to female scribes.