var employed = L.geoJson(salary_data);

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

employed = L.geoJson(salary_data, {style: style});

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
  employed.resetStyle(e.target);
}

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
}

function salary_feature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
  layer.bindPopup("<h1>Area: " + feature.properties.NAME + "</h1><hr><h2>Average Annual Salary: " +
        "$" + feature.properties.a_mean + "</h2><hr>Average Hourly Wage: " +
        "$" + feature.properties.h_mean + "<hr> Total Employed Data Analysts: " + feature.properties.tot_emp);
}

function park_feature(feature, layer) {
  layer.bindPopup("<h1>Park Name: " + feature.properties.Name + "</h1>");
  layer.on({
    click: zoomToFeature
      });
  
}


L.MakiMarkers.accessToken = API_KEY;
var icon = L.MakiMarkers.icon({icon: "park", color: "#5f9120", size: "s"});

var NPMap = L.geoJSON(parks, {
  onEachFeature: park_feature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: icon })
    }
});
employed = L.geoJson(salary_data, {
  style: style,
  onEachFeature: salary_feature 
});



var mapboxAccessToken = API_KEY;

var mapboxAttribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"

var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {id: 'mapbox/light-v10', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution}),
    outdoors   = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {id: 'mapbox/outdoors-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

var myMap = L.map('map2', {
  center: [37.8, -96],
  zoom: 4,
  layers: [grayscale, employed]
});

var baseMaps = {
  "Light": grayscale,
  "Outdoor": outdoors
};

var overlayMaps = {
  "Employed": employed,
  "Parks": NPMap
};

L.control.layers(baseMaps, overlayMaps).addTo(myMap);