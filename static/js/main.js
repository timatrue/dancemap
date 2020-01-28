this.dancemap.initMap = (function(){
  let self = this; 


  let map = L.map('map-box', {
    	geoLocationHandler: true,
      })
      .setView([55.806961, 37.588401], 12);
    
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
  map.on('moveend', self.dancemap.socket.getClusters);
  
  function plotStudios(studios) {

    self.dancemap.studios = {
      "type": "FeatureCollection",
      "features": []
    };

    self.dancemap.studios.features = addPopupContent(studios);

    addMarkersMap(self.dancemap.studios.features); 
    console.log('plotStudios', self.dancemap.studios);
  }
   
  function addMarkersMap(studios) {
    self.dancemap.geojson = L.geoJSON(studios, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    })
    //use addTo(map) without clusterMarkers();
    .addTo(map); 
    //clusterMarkers(); 
  }

  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }
    
  function pointToLayer(feature, latlng) {
    //return L.marker(latlng, {icon: fontAwesomeIcon});


    if (!feature.properties.cluster) return L.marker(latlng, {icon: fontAwesomeIcon});

    const count = feature.properties.point_count;
    const size =
        count < 100 ? 'small' :
        count < 1000 ? 'medium' : 'large';
    const icon = L.divIcon({
        html: `<div><span>${  feature.properties.point_count_abbreviated  }</span></div>`,
        className: `marker-cluster marker-cluster-${  size}`,
        iconSize: L.point(40, 40)
    });

    return L.marker(latlng, {icon});
      /*return L.circleMarker(latlng, {
        radius: 8,
        fillColor: "#F20732",
        color: "#707070",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });*/
  }

  function clusterMarkers() {
    //https://github.com/Leaflet/Leaflet.markercluster/blob/master/example/marker-clustering-geojson.html
    let markers = L.markerClusterGroup();
    markers.addLayer(self.dancemap.geojson);
    map.addLayer(markers);
  }

  function addClusters(data) {
    self.dancemap.cluster = data;
    self.dancemap.geojson.clearLayers();
    self.dancemap.geojson.addData(addPopupContent(data));
  }
 
  function getMap() {
    return map;
  }

  function addPopupContent(studios) {

    studios.forEach((studio) => {
      if(!studio.properties.cluster) {
        studio.properties.popupContent = "<div>" + studio.properties.name + "</div>" + "<div class='address-container'>" + self.dancemap.icons.marker + "<div>" + studio.properties.address + "</div></div>";
      }
    })
    return studios;
  }




  return {
    plotStudios : plotStudios,
    getMap: getMap,
    addClusters: addClusters
  }

})();




