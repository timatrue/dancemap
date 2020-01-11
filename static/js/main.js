//59.921104 | Longitude: 30.359772


this.dancemap.initMap = (function(){

  var map = L.map('map-box', {
    	geoLocationHandler: true,
      })
      .setView([59.94116984, 30.30488491], 12);
    
    //var map = L.map('map-box').fitWorld();
    //map.locate({setView: true, maxZoom: 12});
    
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGltYXRydWUiLCJhIjoiY2p4cmQwem8wMDcxdDNtcWpndWhjOTMwbiJ9.SoBmmbCYNBwXFXuZFRcgHw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'})
    .addTo(map);
      
    
    
  const fontAwesomeIcon = L.divIcon({
    iconSize: [20, 20], 
    className: "count-icon",
    html: ""
  });
      
  this.dancemap.icons = {};
  this.dancemap.icons.marker = "<div class='geo-icons'><svg  height='16' width='12' viewBox='0 0 384 512'><path class='marker' d='M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z'></path></svg></div>";
    
    this.dancemap.schools = {
      "type": "FeatureCollection",
      "features": [
      {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [30.359772,59.921104]
        },
        "properties": {
        "name": "Youdance SPb",
        "popupContent": "<div>Youdance SPb</div><div class='address-container'>" + this.dancemap.icons.marker + "<div>улица Черняховского, 65, Санкт-Петербург</div></div>"
        }
      },
      {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [30.295164,59.961922]
        },
        "properties": {
        "name": "Dance Drive",
        "popupContent": "<div>Dance Drive</div><div class='address-container'>" + this.dancemap.icons.marker + "<div>Чкаловский пр., 15, Санкт-Петербург</div></div>"
        }
      },
      {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [30.34178777182774,59.917375]
        },
        "properties": {
        "name": "MMDance",
        "popupContent": "<div>MMDance</div><div class='address-container'>" + this.dancemap.icons.marker + "<div>Звенигородская улица, 9-11, 3 этаж, Санкт-Петербург</div></div>"
        }
      },
      {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [30.3126,59.9358],
        },
        "properties": {
        "name": "MEGAPOLIS SPb",
        "popupContent": "<div>MEGAPOLIS SPb</div><div class='address-container'>" + this.dancemap.icons.marker + "<div>ул. Малая морская, дом 11, Санкт-Петербург</div></div>"
        }
      },
	  {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [30.298680118385278,59.95012965495423],
        },
        "properties": {
        "name": "NON-STOP",
        "popupContent": "<div>NON-STOP</div><div class='address-container'>" + this.dancemap.icons.marker + "<div>Пр. добролюбова 21, Санкт-Петербург</div></div>"
        }
      }
      ]
    };
    
  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }
    
  function pointToLayer(feature, latlng) {
    return L.marker(latlng, {icon: fontAwesomeIcon});
      /*return L.circleMarker(latlng, {
        radius: 8,
        fillColor: "#F20732",
        color: "#707070",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });*/
  }
    
  L.geoJSON(this.dancemap.schools , {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  }).addTo(map);
    


   /*LEAFLET: CUSTOM MAP CONTROL*/

  //Custom leaflet icons
  L.Control.Geolocation = L.Control.extend({
    onAdd: function(map) {
      var div = L.DomUtil.create('div', 'leaflet-control-location leaflet-bar leaflet-control');
      var a = document.createElement('a');
      var span = document.createElement('span');
      div.id ='geo-location-icon';
      span.className = 'icon geolocation';
      a.appendChild(span);
      div.appendChild(a);

      return div;
    },

    onRemove: function(map) {
      // Nothing to do here
    }
  });

  L.control.geolocation = function(opts) {
    return new L.Control.Geolocation(opts);
  }

  L.control.geolocation({ position: 'topleft' }).addTo(map);

  //Custom leaflet handlers
  L.GeoLocationHandler = L.Handler.extend({
    addHooks: function() {
      L.DomEvent.on(document.getElementById('geo-location-icon'), 'click', this._getLocation, this);
    },

    removeHooks: function() {
      L.DomEvent.off(document.getElementById('geo-location-icon'), 'click', this._getLocation, this);
    },

    _getLocation: function(ev) {
       alert('test');
    }
  });

  map.addHandler('geoLocationHandler', L.GeoLocationHandler);
  
  function plotStudios() {
    console.log('draw')
  }
  return {
    plotStudios:plotStudios
  }

})();




