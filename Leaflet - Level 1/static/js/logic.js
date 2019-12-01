// Store our API endpoint
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

// Add legend info
const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = [];

    div.innerHTML+='Magnitude<br><hr>'

    for (var i = 0; i < grades.length; i++)
    {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
  return div;
};

// Create function to set color based on earthquake magnitudes
function getColor(c)
{
  x = Math.ceil(c);
  switch (Math.ceil(x)) {
    case 1:
      return "#ccff33";
    case 2:
      return "#1a9850";
    case 3:
      return "#0000ff";
    case 4:
      return "#91cf60";
    case 5:
      return "#ff9933";
    default:
      return "#d73027";
  }
}

// Create function to create circular features
function createFeatures(earthquakeData) {
  const earthquakes = L.geoJson(earthquakeData,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8})
        .bindPopup("<h3>" + "Location: " + feature.properties.place +
          "</h3><hr><p>" + "Date/Time: " + new Date (feature.properties.time) + "<br>" +
          "Magnitude: " + feature.properties.mag + "</p>");
  }
});

  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define base layer
  const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })
  // Dark Map Layer from MapBox
  const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  })

  const baseMaps = {
    "Light": lightmap,
    "Dark": darkmap
  };

  const overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  const myMap = L.map("map", {
    center: [40.75, -111.87],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });
    console.log(myMap);

//   Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
   }).addTo(myMap);

  legend.addTo(myMap);
}