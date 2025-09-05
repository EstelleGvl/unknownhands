---
layout: page
show_title: false
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

<!-- Map container -->
<div id="repoMap" style="height: 520px; border-radius: 8px; margin: 1.5rem 0;"></div>

<!-- 1) Load Leaflet + PapaParse (if not already included site-wide) -->
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

<!-- 2) Map script (NO RAW tag so Liquid resolves the CSV path) -->
<script>
(() => {
  if (!window.L || !window.Papa) { console.warn("Leaflet or PapaParse missing"); return; }

  const CSV_URL = "{{ '/assets/data/repositories.csv' | relative_url }}";

  // Init map
  const map = L.map('repoMap', { scrollWheelZoom: false }).setView([48.5, 10], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Helpers
  const toNum = v => {
    if (v == null) return NaN;
    if (typeof v !== 'string') return Number(v);
    return Number(v.replace(/\s+/g,'').replace(',', '.'));
  };

  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    delimiter: "\t",                         // <-- TSV
    transformHeader: h => (h || '').toString().replace(/^\uFEFF/, '').trim().toLowerCase(),
    complete: ({ data, meta, errors }) => {
      if (errors && errors.length) console.warn("[CSV] parse warnings:", errors.slice(0,3));
      console.log("[CSV] fields:", meta.fields, "rows:", data?.length ?? 0);

      const rows = Array.isArray(data) ? data : [];
      const bounds = [];
      let plotted = 0;

      rows.forEach((r) => {
        const name = (r['institution'] ?? '').toString().trim();
        const lat  = toNum(r['latitude']);
        const lon  = toNum(r['longitude']);
        const cnt  = toNum(r['count']);

        // Skip rows without coordinates (e.g., "Unknown")
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

        L.circleMarker([lat, lon], {
          radius: Math.max(6, Math.sqrt(Number.isFinite(cnt) ? cnt : 1)),
          color: '#222',
          weight: 1,
          fillColor: '#444',
          fillOpacity: 0.75
        })
        .addTo(map)
        .bindPopup(`<strong>${name || 'Unknown'}</strong><br>Manuscripts: ${Number.isFinite(cnt) ? cnt : 0}`);

        bounds.push([lat, lon]);
        plotted++;
      });

      console.log("[Map] markers plotted:", plotted);
      if (plotted) {
        map.fitBounds(bounds, { padding: [30, 30] });
      } else {
        console.warn("CSV loaded but no valid points. Check:", CSV_URL);
      }
    },
    error: err => console.error("[CSV] load error:", err)
  });
})();
</script>