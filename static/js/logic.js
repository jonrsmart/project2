var employed = L.geoJson(salary_data);

function getColor(d) {
  return parseFloat(d) > 125000 ? '#800026' :
  parseFloat(d) > 105000  ? '#BD0026' :
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

function states(feature) {
  return {
      fillColor: getColor(feature.properties.AVE_POSTED_SAL),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

// employed = L.geoJson(salary_data, {style: style});



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

var state_data = L.geoJson(states_data, {  
  style: states,
  onEachFeature: state_feature

});
function resetState(e) {
  state_data.resetStyle(e.target);
}
function state_feature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetState,
      click: zoomToFeature
  });
  layer.bindPopup("<h1>State: <a href='/states/"+feature.properties.STATE+"'>" + feature.properties.NAME + "</a></h1><hr><h1>Average Est Salary: " +
        "$" + feature.properties.AVE_POSTED_SAL + "</h1><hr>Cost of Living Index: "
         + feature.properties.COST_OF_LIVING + "<hr> <h1>Total Data Analyst Job Postings: " + feature.properties.JOB_POSTINGS + "</h1>");
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
  "Salary Info": employed,
  "Parks": NPMap,
  "State": state_data
};

L.control.layers(baseMaps, overlayMaps).addTo(myMap);

var legend1 = L.control({position: 'bottomright'});

legend1.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 30000, 45000, 60000, 75000, 90000, 105000, 125000],
        labels = ['0-30K','30K-45K','45K-60K','60K-75K','75k-90k','90k-105k','105k-125k','125k+'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            labels[i] + '<br>' + '<br>';
            // grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend1.addTo(myMap);

myMap.on('overlayadd', function(eventLayer) {
  if (eventLayer.name === 'Employed' || eventLayer.name === 'State') {
    legend1.addTo(this);
  }

  else {
    this.removeControl(legend1)
  }
});

myMap.on('overlayremove', function(eventLayer) {
  if (eventLayer.name === 'Employed' || eventLayer.name === 'State') {
    this.removeControl(legend1);
  }
});