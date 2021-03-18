// Creating map object
var myMap = L.map("map2").setView([37.8, -96], 4);
mapboxAccessToken = API_KEY;
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(myMap)
// Adding tile layer


// Load in geojson data
// var geoData = "../../static/data/metro-salary.geojson";

// for (i=0; i<salary_data.features.length; i++){
//   if (isNaN(salary_data.features[i].properties.a_mean)){
//     salary_data.features[i].properties.a_mean = 0;
    
//   }
//   else {
//     salary_data.features[i].properties.a_mean = parseFloat(salary_data.features[i].properties.a_mean);
//   }
//   console.log(salary_data.features[i].properties.a_mean);
// }

var geojson = L.geoJson(salary_data).addTo(myMap);

function getColor(d) {
  return parseFloat(d) > 125000 ? '#800026' :
  parseFloat(d) > 100000  ? '#BD0026' :
  parseFloat(d) > 90000  ? '#E31A1C' :
  parseFloat(d) > 75000  ? '#FC4E2A' :
  parseFloat(d) > 60000   ? '#FD8D3C' :
  parseFloat(d) > 45000  ? '#FEB24C' :
  parseFloat(d) > 30000   ? '#FED976' :
                    '#FFFFFF';
}
function style(feature) {
  return {
      fillColor: getColor(feature.properties.a_mean),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

L.geoJson(salary_data, {style: style}).addTo(myMap);

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
  layer.bindPopup("<h1>Area: " + feature.properties.NAME + "</h1><hr><h2>Average Annual Salary: " +
        "$" + feature.properties.a_mean + "</h2><hr>Average Hourly Wage: " +
        "$" + feature.properties.h_mean + "<hr> Total Employed Data Analysts: " + feature.properties.tot_emp);
}

geojson = L.geoJson(salary_data, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(myMap);