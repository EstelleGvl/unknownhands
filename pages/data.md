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

These interactive views provide an overview of the current *Unknown Hands* data export. Unknown and TBC values are excluded. When a production place or date is uncertain between several named values, the record contributes once to each named country or century.

<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

---

## Production by Country

<p>Counts represent production units with a known production country. Ambiguous locations are included under every country named in the record.</p>
<p id="production-status" role="status" aria-live="polite">Loading production data…</p>
<div id="byCountry"></div>

<script>
(() => {
  const DATA_URL = "{{ '/data/heurist/production_units.json' | relative_url }}";
  const status = document.getElementById('production-status');
  const isKnown = value => {
    const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
    return normalized !== '' && !/^(?:unknown|tbc|not known|to be (?:confirmed|completed))$/i.test(normalized);
  };
  const detailValues = (record, fieldName) => (record.details || [])
    .filter(detail => detail.fieldName === fieldName)
    .map(detail => detail.termLabel)
    .filter(value => typeof value === 'string' || typeof value === 'number')
    .map(String)
    .filter(isKnown);
  const addCount = (counts, key) => counts.set(key, (counts.get(key) || 0) + 1);
  const centuriesFor = value => {
    const normalized = value.replace(/(?:st|nd|rd|th)/gi, '').replace(/[–—]/g, '-').trim();
    const range = normalized.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (Number.isInteger(start) && Number.isInteger(end) && start <= end) {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
      }
    }
    const century = Number(normalized);
    return Number.isInteger(century) ? [century] : [];
  };
  const ordinal = value => {
    const mod100 = value % 100;
    const suffix = mod100 >= 11 && mod100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] || 'th');
    return `${value}${suffix}`;
  };
  const plotConfig = {
    responsive: true,
    displaylogo: false,
    toImageButtonOptions: { format: 'png', scale: 2 }
  };

  fetch(DATA_URL, { credentials: 'omit' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(json => {
      const productionUnits = (json?.heurist?.records || []).filter(record =>
        String(record.rec_RecTypeID) === '116' &&
        String(record.rec_NonOwnerVisibility || '').toLowerCase() !== 'private'
      );
      const countryCounts = new Map();
      const centuryCounts = new Map();

      productionUnits.forEach(record => {
        const countries = new Set(detailValues(record, 'PU country'));
        countries.forEach(country => addCount(countryCounts, country));

        const centuries = new Set(detailValues(record, 'Normalized century of production').flatMap(centuriesFor));
        centuries.forEach(century => addCount(centuryCounts, century));
      });

      const countries = [...countryCounts.entries()].sort((a, b) => a[1] - b[1]);
      Plotly.newPlot('byCountry', [{
        x: countries.map(([, count]) => count),
        y: countries.map(([country]) => country),
        type: 'bar',
        orientation: 'h',
        text: countries.map(([, count]) => String(count)),
        textposition: 'auto',
        marker: { color: '#d4af37' },
        hovertemplate: '%{y}: %{x} production units<extra></extra>'
      }], {
        title: 'Production Units by Country',
        xaxis: { title: 'Production units', rangemode: 'tozero' },
        margin: { l: 180, r: 30, t: 60, b: 60 },
        height: Math.max(420, countries.length * 34),
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
      }, plotConfig);

      const centuries = [...centuryCounts.entries()].sort((a, b) => a[0] - b[0]);
      Plotly.newPlot('byCentury', [{
        x: centuries.map(([century]) => ordinal(century)),
        y: centuries.map(([, count]) => count),
        type: 'bar',
        text: centuries.map(([, count]) => String(count)),
        textposition: 'auto',
        marker: { color: '#d4af37' },
        hovertemplate: '%{x} century: %{y} production units<extra></extra>'
      }], {
        title: 'Production Units by Century',
        xaxis: { title: 'Century', type: 'category' },
        yaxis: { title: 'Production units', rangemode: 'tozero' },
        margin: { l: 80, r: 30, t: 60, b: 60 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
      }, plotConfig);

      status.textContent = `${productionUnits.length.toLocaleString()} production units in the current export; charts include only records with known values.`;
    })
    .catch(error => {
      console.error('Unable to load production data:', error);
      status.textContent = 'Production data could not be loaded. Please try again later.';
    });
})();
</script>

---

## Production by Century

<p>Counts represent production units with a known normalized century. A range contributes once to each century covered by that range.</p>
<div id="byCentury"></div>

---

## Current Repositories

<div class="full-bleed">
  <div id="repoMap" style="height:520px; border-radius:8px; margin:1.5rem 0;"></div>
</div>

<!-- MarkerCluster -->
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>

<!-- Leaflet Search -->
<link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder@3.1.0/dist/Control.Geocoder.css"/>
<script src="https://unpkg.com/leaflet-control-geocoder@3.1.0/dist/Control.Geocoder.js"></script>

<script>
(() => {
  const CSV_URL = "{{ '/data/heurist/repositories.csv' | relative_url }}";
  const isKnown = value => {
    const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
    return normalized !== '' && !/^(?:unknown|tbc|not known|to be (?:confirmed|completed))$/i.test(normalized);
  };

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

            if (!isKnown(name) || !Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(cnt) || cnt <= 0) return;

            const marker = L.circleMarker([lat, lon], {
              radius: Math.max(6, Math.sqrt(Number.isFinite(cnt) ? cnt : 1)),
              color: '#333',
              weight: 1,
              fillColor: getColor(cnt),
              fillOpacity: 0.85
            }).bindPopup(
              `<strong>${name}</strong><br>Manuscripts: ${cnt}`
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
