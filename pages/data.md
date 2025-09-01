---
layout: page
show_title: false
permalink: /data/
---
 
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