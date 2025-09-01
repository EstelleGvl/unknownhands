---
layout: page
show_title: false
permalink: /data/
---

These interactive charts provide an overview of current findings from *Unknown Hands*. They will grow as the dataset expands. Notes on scope and uncertainty are included beneath each visualization.

---

## Production by Country (manuscript place of production)

 
<div id="byCountry"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
  const countries = [
    "Austria","Belgium","Crete","England","France","France or Germany","Germany",
    "Germany or Switzerland","Italy","Netherlands","Portugal","Spain","Sweden","Switzerland","Unknown"
  ];
  const counts = [72,92,3,19,98,3,660,1,165,106,26,9,15,65,8];

  Plotly.newPlot("byCountry", [{
    x: counts,
    y: countries,
    type: "bar",
    orientation: "h",
    text: counts.map(v => v.toString()),
    textposition: "auto",
    marker: {color: "#444"}
  }], {
    title: "Production Location of Manuscripts by Country",
    xaxis: {title: "Number of Manuscripts"},
    margin: {l:180}
  });
</script>

**Notes.** Country names are modernized labels for production locales in the historical record; ambiguous entries (e.g., “France or Germany”) and “Unknown” are shown explicitly.

---

## Century of Production (certain vs. ranges)


<div id="byCentury"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
  // Raw data (century → count)
  const centuryData = {
    "8th": 39, "9th": 9, "10th": 7, "11th": 2, "12th": 108,
    "13th": 25, "14th": 46, "15th": 828, "16th": 267, "Unknown": 5,
    "8–9th": 23, "9–15th": 2, "12–13th": 2, "13–14th": 1, "14–15th": 7,
    "15–16th": 28, "15–18th": 1, "16–18th": 1
  };

  // Separate certain vs. uncertain
  const certainCenturies = Object.entries(centuryData)
    .filter(([c]) => !c.includes("–") && c !== "Unknown");
  const uncertainCenturies = Object.entries(centuryData)
    .filter(([c]) => c.includes("–") || c === "Unknown");

  // Sort centuries numerically where possible
  const orderedCertain = certainCenturies.sort((a,b) => parseInt(a[0]) - parseInt(b[0]));

  Plotly.newPlot("byCentury", [
    {
      x: orderedCertain.map(([c]) => c),
      y: orderedCertain.map(([c,v]) => v),
      type: "bar",
      name: "Certain",
      marker: {color: "#444"}
    },
    {
      x: uncertainCenturies.map(([c]) => c),
      y: uncertainCenturies.map(([c,v]) => v),
      type: "bar",
      name: "Uncertain / Range",
      marker: {color: "#999"}
    }
  ], {
    title: "Manuscripts by Century of Production",
    barmode: "stack",
    xaxis: {title: "Century"},
    yaxis: {title: "Number of Manuscripts"}
  });
</script>


**Notes.** “Certain” counts reflect records assigned to a single century; “Uncertain/Range” includes ranges (e.g., *14–15th*) and unknowns. Later we can proportionally allocate ranges across centuries for analytical charts; here we visualize them transparently as a separate layer.

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

**Notes.** When you’re ready, create `/assets/data/repositories.json` with `{name, lat, lon, count}` entries and swap the `demoRepos` array for a `fetch('/assets/data/repositories.json')` call.
