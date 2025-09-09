---
layout: page
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
permalink: /data/
---

These interactive charts provide an overview of current findings from *Unknown Hands*. They will grow as the dataset expands.

<!-- Load libraries ONCE at the top -->
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

---

## Production by Country

<div id="byCountry"></div>

{% raw %}
<script>
(() => {
  const countryData = {
    "Austria":72, "Belgium":92, "Crete":3, "England":19, "France":98,
    "France or Germany":3, "Germany":660, "Germany or Switzerland":1,
    "Italy":165, "Netherlands":106, "Portugal":26, "Spain":9, "Sweden":15,
    "Switzerland":65, "Unknown":8
  };

  const countries = ["Austria","Belgium","Crete","England","France","Germany","Italy",
    "Netherlands","Portugal","Spain","Sweden","Switzerland","Unknown"];
  const counts = Object.fromEntries(countries.map(c => [c, 0]));

  for (const [label, value] of Object.entries(countryData)) {
    if (label.includes(" or ")) {
      label.split(" or ").forEach(c => { if (counts[c] !== undefined) counts[c] += value; });
    } else if (counts[label] !== undefined) {
      counts[label] += value;
    }
  }

  Plotly.newPlot("byCountry", [{
    x: Object.values(counts),
    y: Object.keys(counts),
    type: "bar",
    orientation: "h",
    text: Object.values(counts).map(String),
    textposition: "auto"
  }], {
    title: "Production Location of Manuscripts (by country)",
    xaxis: { title: "Number of Manuscripts" },
    margin: { l: 180 }
  });
})();
</script>
{% endraw %}

---

## Production by Century

<div id="byCentury"></div>

{% raw %}
<script>
(() => {
  // Raw data (hyphens OR en-dashes are fine)
  const rawCenturyData = {
    "8": 39, "9": 9, "10": 7, "11": 2, "12": 108,
    "13": 25, "14": 46, "15": 828, "16": 267, "Unknown": 5,
    "9–15": 2, "12–13": 2, "8–9": 23, "13–14": 1, "14–15": 7,
    "15–16": 28, "15–18": 1, "16–18": 1
  };

  const counts = {8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0};

  const add = (c, v) => { if (counts[c] !== undefined) counts[c] += Number(v)||0; };

  for (const [label, value] of Object.entries(rawCenturyData)) {
    if (label.toLowerCase() === "unknown") continue;
    const norm = label.replace(/th/gi,"").replace(/[–—]/g,"-").trim();
    if (norm.includes("-")) {
      const [s,e] = norm.split("-").map(Number);
      if (Number.isFinite(s) && Number.isFinite(e)) {
        for (let c=s; c<=e; c++) add(c, value);
      }
    } else {
      add(Number(norm), value);
    }
  }

  const x = Object.keys(counts).map(c => c + "th");
  const y = Object.values(counts);

  Plotly.newPlot("byCentury", [{
    x, y, type: "bar", text: y.map(String), textposition: "auto"
  }], {
    title: "Manuscripts by Century of Production",
    xaxis: { title: "Century" },
    yaxis: { title: "Number of Manuscripts" }
  });
})();
</script>
{% endraw %}

---

## Current Repositories

<div class="full-bleed">
  <div id="repoMap" style="height:520px; border-radius:8px; margin:1.5rem 0;"></div>
</div>

<!-- Leaflet + plugins -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- MarkerCluster -->
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>

<!-- PapaParse -->
<script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

<!-- Leaflet Search -->
<link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css"/>
<script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>

<script>
(() => {
  const CSV_URL = "{{ '/assets/data/repositories.csv' | relative_url }}";

  // Init map
  const map = L.map('repoMap', { scrollWheelZoom: false }).setView([48.5, 10], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Cluster group
  const clusterGroup = L.markerClusterGroup();
  map.addLayer(clusterGroup);

  // ---- Shared bins + colors (exact match for markers & legend) ----
  const BINS   = [1, 5, 10, 20, 50]; // upper bounds of each bin (last bin is >50)
  const COLORS = ['#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

  const getBinIndex = (c) => {
    if (!Number.isFinite(c)) return 0;
    for (let i = 0; i < BINS.length; i++) {
      if (c <= BINS[i]) return i;
    }
    return COLORS.length - 1; // > last bin
  };
  const getColor = (c) => COLORS[getBinIndex(c)];

  // Helper
  const toNum = v => {
    if (v == null) return NaN;
    if (typeof v !== 'string') return Number(v);
    return Number(v.replace(/\s+/g,'').replace(',', '.'));
  };

  // Load data
  fetch(CSV_URL, { cache: "no-store" })
    .then(r => r.text())
    .then(txt => {
      Papa.parse(txt, {
        header: true, skipEmptyLines: true, delimiter: "",
        transformHeader: h => (h || '').toString().replace(/^\uFEFF/, '').trim().toLowerCase(),
        complete: ({ data }) => {
          const bounds = [];
          let plotted = 0;

          data.forEach(r => {
            const name = (r['institution'] ?? '').toString().trim();
            const lat  = toNum(r['latitude']);
            const lon  = toNum(r['longitude']);
            const cnt  = toNum(r['count']);

            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

            const marker = L.circleMarker([lat, lon], {
              radius: Math.max(6, Math.sqrt(Number.isFinite(cnt) ? cnt : 1)),
              color: '#333',
              weight: 1,
              fillColor: getColor(cnt),
              fillOpacity: 0.85
            }).bindPopup(
              `<strong>${name || 'Unknown'}</strong><br>Manuscripts: ${Number.isFinite(cnt) ? cnt : 0}`
            );

            clusterGroup.addLayer(marker);
            bounds.push([lat, lon]);
            plotted++;
          });

          if (plotted) map.fitBounds(bounds, { padding: [30, 30] });
        }
      });
    });

  // Legend (uses the same COLORS and BINS)
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    let html = "<strong>Manuscripts</strong><br>";
    // Build ranges from bins
    const ranges = [
      `0–${BINS[0]}`,
      ...BINS.slice(0, -1).map((b, i) => `${BINS[i] + 1}–${BINS[i + 1]}`),
      `${BINS[BINS.length - 1] + 1}+`
    ];
    ranges.forEach((label, i) => {
      html += `<i style="background:${COLORS[i]}"></i> ${label}<br>`;
    });
    div.innerHTML = html;
    return div;
  };
  legend.addTo(map);

  // Optional: Geocoder search (kept as-is)
  const searchControl = L.Control.geocoder({ defaultMarkGeocode: false })
    .on('markgeocode', function(e) { map.fitBounds(e.geocode.bbox); })
    .addTo(map);
})();
</script>

<style>
.info.legend {
  background: white;
  padding: 8px;
  font: 12px/1.4 "Helvetica Neue", Arial, sans-serif;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  border-radius: 4px;
}
.info.legend i {
  width: 18px; height: 18px;
  float: left; margin-right: 6px;
  opacity: 0.85;
}
</style>