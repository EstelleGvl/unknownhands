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

**Notes.** Country names are modernized labels for production locales in the historical record.

---

## Century of Production


<div id="byCentury"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
  // Raw data with ranges
  const centuryData = {
    "8": 39, "9": 9, "10": 7, "11": 2, "12": 108,
    "13": 25, "14": 46, "15": 828, "16": 267, "Unknown": 5,
    "9-15": 2, "12-13": 2, "8-9": 23, "13-14": 1, "14-15": 7,
    "15-16": 28, "15-18": 1, "16-18": 1
  };

  // Initialize counters (8th–16th century baseline)
  const counts = {8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0};

  // Helper to add counts to a single century
  function add(century, value) {
    if (counts[century] !== undefined) counts[century] += value;
  }

  // Process entries
  for (const [label, value] of Object.entries(centuryData)) {
    if (!label.includes("-") && label !== "Unknown") {
      // Single century
      add(parseInt(label), value);
    } else if (label.includes("-")) {
      // Range
      const parts = label.split("-");
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);
      for (let c=start; c<=end; c++) add(c, value);
    }
    // Skip Unknown for now
  }

  // Convert to arrays
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


---

## Where are the manuscripts today? (Repository Map — coming soon)

<div id="repoMap" style="height: 420px; border-radius: 8px; overflow: hidden;"></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="" crossorigin="">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="" crossorigin=""></script>
<script>
// Minimal Leaflet setup. Replace demo points with your real data when ready.
const map = L.map('repoMap').setView([48.86, 2.35], 4); // centered roughly on Europe
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// TODO: replace with real data loaded from /assets/data/repositories.json
// Example structure: [{name:"BnF (Paris)", lat:48.833, lon:2.375, count:42}, ...]
const demoRepos = [
  {name:"BnF (Paris)", lat:48.833, lon:2.375, count:42},
  {name:"Bayerische Staatsbibliothek (Munich)", lat:48.150, lon:11.579, count:31},
  {name:"KB (The Hague)", lat:52.080, lon:4.317, count:18}
];

demoRepos.forEach(r => {
  L.circleMarker([r.lat, r.lon], {radius: Math.max(6, Math.sqrt(r.count))})
    .addTo(map)
    .bindPopup(`<strong>${r.name}</strong><br>Manuscripts: ${r.count}`);
});
</script>
