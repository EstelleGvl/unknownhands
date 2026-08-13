---
layout: page
permalink: /explore-database/
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

<link rel="stylesheet" href="{{ '/assets/css/explore.css' | relative_url }}?v={{ site.time | date: '%s' }}">

<script>
// Detect embed mode and add class (CSS is in explore.css)
(function() {
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get('embed') === 'true';
  const inIframe = window.self !== window.top;
  
  if (isEmbed || inIframe) {
    document.documentElement.classList.add('embed-mode');
    
    // Force layout recalculation for delayed network renders
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 800);
    });
  }
})();
</script>

<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

{% include explore/explore-database-markup.html %}
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<!-- Libraries for high-quality image export -->
<script src="https://cdn.jsdelivr.net/npm/svg-crowbar@0.6.1/svg-crowbar.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

<script>

window.ExploreHeadConfig = {
  SU_ENDPOINT: "{{ site.heurist.su_json | default: '/data/heurist/scribal_units.json' | relative_url }}",
  MS_ENDPOINT: "{{ site.heurist.ms_json | default: '/data/heurist/manuscripts.json' | relative_url }}",
  PU_ENDPOINT: "{{ site.heurist.pu_json | default: '/data/heurist/production_units.json' | relative_url }}",
  HI_ENDPOINT: "{{ site.heurist.holding_json | default: '/data/heurist/holding_institutions.json' | relative_url }}",
  MI_ENDPOINT: "{{ site.heurist.monastic_json | default: '/data/heurist/monastic_institutions.json' | relative_url }}",
  HP_ENDPOINT: "{{ site.heurist.people_json | default: '/data/heurist/historical_people.json' | relative_url }}",
  TX_ENDPOINT: "{{ site.heurist.texts_json | default: '/data/heurist/texts.json' | relative_url }}",
  REL_ENDPOINT: "{{ site.heurist.relations_json | default: '/data/heurist/relationships.json' | relative_url }}",
  BASE: "{{ site.baseurl | default: '' }}"
};
</script>
<!-- Core utilities (used by all modules) -->
<script src="{{ '/assets/js/explore/config.js' | relative_url }}"></script>

<!-- Core utilities -->
<script src="{{ '/assets/js/explore/modules/utils.js' | relative_url }}"></script>

<!-- Submodules -->
<script src="{{ '/assets/js/explore/modules/map.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/timeline.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/network.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/analytics.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/codicology.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/hierarchical-tree.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/multilingualism.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/scribes.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/colophon-analysis.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/text-genres.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/export.js' | relative_url }}"></script>
<script src="{{ '/assets/js/explore/modules/path-finding.js' | relative_url }}"></script>

<!-- Engine Orchestrator -->
<script src="{{ '/assets/js/explore/app.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
