---
layout: page
show_title: false
permalink: /data/
---

These interactive charts provide an overview of current findings from *Unknown Hands*. They will grow as the dataset expands.

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
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

{% raw %}
<script>
  // Enter your counts exactly as you have them (hyphens or en-dashes both ok)
  const rawCenturyData = {
    "8": 39, "9": 9, "10": 7, "11": 2, "12": 108,
    "13": 25, "14": 46, "15": 828, "16": 267, "Unknown": 5,
    "9–15": 2, "12–13": 2, "8–9": 23, "13–14": 1, "14–15": 7,
    "15–16": 28, "15–18": 1, "16–18": 1
  };

  // We’ll plot 8th–16th; values outside this range are safely ignored
  const counts = {8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0};

  function add(century, value){
    const c = Number(century);
    if (Number.isFinite(c) && counts[c] !== undefined) counts[c] += Number(value) || 0;
  }

  for (const [label, value] of Object.entries(rawCenturyData)) {
    if (label.toLowerCase() === "unknown") continue;

    // Normalize: remove "th", replace en/em dash with hyphen, trim
    const norm = label.replace(/th/gi,"").replace(/[–—]/g,"-").trim();

    if (norm.includes("-")) {
      const [startStr, endStr] = norm.split("-");
      const start = Number(startStr), end = Number(endStr);
      if (Number.isFinite(start) && Number.isFinite(end)) {
        for (let c = start; c <= end; c++) add(c, value);
      }
    } else {
      add(norm, value);
    }
  }

  const x = Object.keys(counts).map(c => `${c}th`);
  const y = Object.values(counts);

  Plotly.newPlot("byCentury", [{
    x, y, type: "bar", text: y.map(v=>v.toString()), textposition: "auto"
  }], {
    title: "Manuscripts by Century of Production",
    xaxis: { title: "Century" },
    yaxis: { title: "Number of Manuscripts" }
  });
</script>
{% endraw %}


---

## Current Repositories (interactive map)

{% raw %}
<script>
  const CSV_URL = "{{ '/assets/data/repositories.csv' | relative_url }}";

  const map = L.map('repoMap', {scrollWheelZoom: false}).setView([48.5, 10], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Helper: get a value by trying multiple header names
  function getField(row, names){
    for (const n of names){
      // exact
      if (row[n] != null && row[n] !== "") return row[n];
      // case-insensitive
      const key = Object.keys(row).find(k => k.trim().toLowerCase() === n.toLowerCase());
      if (key && row[key] != null && row[key] !== "") return row[key];
    }
    return null;
  }

  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const rows = results.data || [];
      const bounds = [];
      let plotted = 0;

      rows.forEach(r => {
        const name = getField(r, ["Holding Institution","Institution","Repository","Name"]) || "Unknown";
        const lat  = parseFloat(getField(r, ["Latitude","lat","Lat"]));
        const lon  = parseFloat(getField(r, ["Longitude","lon","Lng","Long","Longitud","Longitudes"]));
        const count= parseFloat(getField(r, ["count","Count","manuscripts","Manuscripts"])) || 0;

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

        const size = Math.max(6, Math.sqrt(count || 1));
        const marker = L.circleMarker([lat, lon], {
          radius: size,
          color: "#222",
          weight: 1,
          fillColor: "#444",
          fillOpacity: 0.75
        }).addTo(map);

        marker.bindPopup(
          `<strong>${name}</strong><br>` +
          `Manuscripts: ${count}`
        );

        bounds.push([lat, lon]);
        plotted++;
      });

      if (bounds.length) {
        map.fitBounds(bounds, {padding: [30,30]});
      } else {
        console.warn("No valid points found. Check CSV headers and values:", CSV_URL);
      }
    },
    error: function(err) {
      console.error("CSV load error:", err);
    }
  });
</script>
{% endraw %}