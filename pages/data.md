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

{% raw %}
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

  // Process entries (split ambiguous labels into both countries)
  for (const [label, value] of Object.entries(countryData)) {
    if (label.includes(" or ")) {
      label.split(" or ").forEach(c => {
        if (counts[c] !== undefined) counts[c] += value;
      });
    } else if (counts[label] !== undefined) {
      counts[label] += value;
    }
  }

  // Arrays for Plotly
  const x = Object.values(counts);
  const y = Object.keys(counts);

  Plotly.newPlot("byCountry", [{
    x: x,
    y: y,
    type: "bar",
    orientation: "h",
    text: x.map(v => v.toString()),
    textposition: "auto",
  }], {
    title: "Production Location of Manuscripts (by country)",
    xaxis: { title: "Number of Manuscripts" },
    margin: { l: 180 }
  });
</script>
{% endraw %}

---

## Production by Century

<div id="byCentury"></div>

{% raw %}
<script>
  // Range-distributed data for centuries
  const centuryData = {
    "8": 39, "9": 9, "10": 7, "11": 2, "12": 108,
    "13": 25, "14": 46, "15": 828, "16": 267, "Unknown": 5,
    "9-15": 2, "12-13": 2, "8-9": 23, "13-14": 1, "14-15": 7,
    "15-16": 28, "15-18": 1, "16-18": 1
  };

  const counts = {8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0};

  function add(century, value) {
    if (counts[century] !== undefined) counts[century] += value;
  }

  for (const [label, value] of Object.entries(centuryData)) {
    if (!label.includes("-") && label !== "Unknown") {
      add(parseInt(label), value);
    } else if (label.includes("-")) {
      const [start, end] = label.split("-").map(x => parseInt(x));
      for (let c=start; c<=end; c++) add(c, value);
    }
  }

  const centuries = Object.keys(counts).map(c => c + "th");
  const values = Object.values(counts);

  Plotly.newPlot("byCentury", [{
    x: centuries,
    y: values,
    type: "bar",
    marker: {color: "#444"},
    text: values.map(v => v.toString()),
    textposition: "auto"
  }], {
    title: "Manuscripts by Century of Production",
    xaxis: { title: "Century" },
    yaxis: { title: "Number of Manuscripts" }
  });
</script>
{% endraw %}

---

## Current Repositories (interactive map)

<div id="repoMap" style="height: 520px; border-radius: 8px; margin: 1.5rem 0;"></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

{% raw %}
<script>
  const CSV_URL = "{{ '/assets/data/repositories.csv' | relative_url }}";

  const map = L.map('repoMap', {scrollWheelZoom: false}).setView([48.5, 10], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    complete: function(results) {
      const rows = results.data || [];
      const bounds = [];

      rows.forEach(r => {
        const lat = parseFloat(r.lat);
        const lon = parseFloat(r.lon);
        const count = parseFloat(r.count || "0");

        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          const size = Math.max(6, Math.sqrt(count || 1));
          const marker = L.circleMarker([lat, lon], {
            radius: size,
            color: "#222",
            weight: 1,
            fillColor: "#444",
            fillOpacity: 0.75
          }).addTo(map);

          marker.bindPopup(
            `<strong>${r.name || "Unknown"}</strong><br>` +
            `${r.city ? r.city + ', ' : ''}${r.country || ''}<br>` +
            `Manuscripts: ${count || 0}`
          );

          bounds.push([lat, lon]);
        }
      });

      if (bounds.length) {
        map.fitBounds(bounds, {padding: [30,30]});
      }
    }
  });
</script>
{% endraw %}