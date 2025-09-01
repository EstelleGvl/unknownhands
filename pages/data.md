---
layout: page
show_title: false
permalink: /data/
---

These interactive charts provide an overview of current findings from *Unknown Hands*. They will grow as the dataset expands. Notes on scope and uncertainty are included beneath each visualization.

---

## Production by Country

<div id="byCountry"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
  // Raw data
  const countryData = {
    "Austria":72, "Belgium":92, "Crete":3, "England":19, "France":98,
    "France or Germany":3, "Germany":660, "Germany or Switzerland":1,
    "Italy":165, "Netherlands":106, "Portugal":26, "Spain":9, "Sweden":15,
    "Switzerland":65, "Unknown":8
  };

  // Initialize counters
  const countries = ["Austria","Belgium","Crete","England","France","Germany","Italy",
    "Netherlands","Portugal","Spain","Sweden","Switzerland","Unknown"];
  const counts = {};
  countries.forEach(c => counts[c] = 0);

  // Process entries
  for (const [label, value] of Object.entries(countryData)) {
    if (label.includes(" or ")) {
      // Split into multiple countries
      label.split(" or ").forEach(c => {
        if (counts[c] !== undefined) counts[c] += value;
      });
    } else if (counts[label] !== undefined) {
      counts[label] += value;
    }
  }

  // Convert to arrays
  const x = Object.values(counts);
  const y = Object.keys(counts);

  Plotly.newPlot("byCountry", [{
    x: x,
    y: y,
    type: "bar",
    orientation: "h",
    text: x.map(v => v.toString()),
    textposition: "auto",
    marker: {color: "#444"}
  }], {
    title: "Production Location of Manuscripts (by country)",
    xaxis: { title: "Number of Manuscripts" },
    margin: { l: 180 }
  });
</script>

---

## Production by Century

<div id="repoMap" style="height: 520px; border-radius: 8px; margin: 1.5rem 0;"></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

<script>
  // Create map
  const map = L.map('repoMap', {scrollWheelZoom: false}).setView([48.5, 10], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load CSV
  Papa.parse("/assets/data/repositories.csv", {
    download: true,
    header: true,
    complete: function(results) {
      const bounds = [];
      results.data.forEach(r => {
        if (!r.lat || !r.lon) return; // skip rows without coordinates
        const size = Math.max(6, Math.sqrt(r.count || 1));
        const marker = L.circleMarker([parseFloat(r.lat), parseFloat(r.lon)], {
          radius: size,
          color: "#222",
          weight: 1,
          fillColor: "#444",
          fillOpacity: 0.75
        }).addTo(map);

        marker.bindPopup(`
          <strong>${r.name}</strong><br/>
          ${r.city ? r.city + ', ' : ''}${r.country || ''}<br/>
          Manuscripts: ${r.count}
        `);

        bounds.push([parseFloat(r.lat), parseFloat(r.lon)]);
      });
      if (bounds.length) map.fitBounds(bounds, {padding: [30,30]});
    }
  });
</script>