---
layout: page
title: IIIF Viewer
permalink: /viewer/
---

<div class="wax-inline-container" style="max-width:1200px;">
  <h1 class="page-title" style="text-align:center;">IIIF Viewer</h1>
  <p class="muted" id="mv-help" style="text-align:center;">Loading manifest…</p>
</div>
<div id="mirador-standalone" style="height:80vh; max-width: 95vw; margin: 0 auto;"></div>

<link rel="stylesheet" href="https://unpkg.com/mirador@3/dist/mirador.min.css">
<script src="https://unpkg.com/mirador@3/dist/mirador.min.js"></script>
<script>
(function(){
  const params = new URLSearchParams(location.search);
  const manifest = params.get('manifest');
  if (!manifest){
    document.getElementById('mv-help').textContent = 'Provide a IIIF manifest URL with ?manifest=…';
    return;
  }
  document.getElementById('mv-help').textContent = '';
  Mirador.viewer({
    id: 'mirador-standalone',
    windows: [{ manifestId: manifest }],
    window: { allowClose: false, allowTopMenuButton: true, allowWindowSideBar: true },
    workspaceControlPanel: { enabled: false },
  });
})();
</script>