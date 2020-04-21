this.dancemap.initMap = (function(){
  let self = this; 


  /**/
  this.dancemap.ui = {};
  this.dancemap.ui.class = 'all';
  this.dancemap.ui.radius = 5000;
  this.dancemap.ui.queryType = 'geoWithin';

  let classSelector = document.getElementById('class-selector');
  classSelector.addEventListener('change', function (event) {

    self.dancemap.ui.class = this.value;
    self.dancemap.initMap.getMap().closePopup();
    //self.dancemap.socket.getClusters();
    moveEnd();
    console.log(this.value);

  }, false);
  /**/


  let map = L.map('map-box', {
    	geoLocationHandler: true,
      })
      .setView([55.746181, 37.625372], 12);

      
    
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
  this.dancemap.icons.marker = "<div class='container-icon'><svg  height='16' width='12' viewBox='0 0 384 512'><path class='icon--grey' d='M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z'></path></svg></div>";
  this.dancemap.icons.vk = "<div class='container-icon'><svg  height='20' width='20' viewBox='0 0 576 512'><path class='vk--blue' d='M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z'></path></svg></div>";



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
      var options = {
        enableHighAccuracy: true,
        //timeout: 5000,
        maximumAge: 0
       };


     //map.locate({setView: true})
     /*const id = navigator.geolocation.watchPosition(pos => {
       console.log(pos)
     })*/

      navigator.geolocation.getCurrentPosition(pos => {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;

        let marker = L.marker([lat, lng]).bindTooltip( (layer) => 'Ты здесь!', {permanent: false, opacity: 0.75});

        map.flyTo([lat, lng], map.getZoom())
        map.addLayer(marker);
        
        console.log(pos.coords)
      }, (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`)
       }, options);
    }
  });

  map.addHandler('geoLocationHandler', L.GeoLocationHandler);
  map.on('moveend', moveEnd);
  map.on("zoomstart", function (e) { classSelector.disabled = true; });
  map.on("zoomend", function (e) { classSelector.disabled = false; });
  map.on("popupopen", function(e) {
    let marker = e.popup._source.feature
    let url = marker._id
    let title = marker.properties.name
    dancemap.nav.changeLocalURL({url, title})

    console.log("popupopen", e);
  })
  map.on("popupclose", function (e) {
    console.log("popupclose")
  })
  map.on("autopanstart", function(e) {
    console.log("autopanstart")
  })

  /*map.locate({watch: true}) 
      .on('locationfound', function(e){
          var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
          var circle = L.circle([e.latitude, e.longitude], e.accuracy/4, {
              weight: 1,
              color: 'blue',
              fillColor: '#cacaca',
              fillOpacity: 0.2
          });
          map.addLayer(marker);
          map.addLayer(circle);
      })
     .on('locationerror', function(e){
          console.log(e);
          alert("Location access denied.");
      });  */

  self.dancemap.geojson = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  }).addTo(map)

  function moveEnd() {
    const input = document.querySelector('input[type="search"]');
    input.value ? dancemap.socket.findStudio(input.value) : self.dancemap.socket.getClusters();
    dancemap.nav.addLatLngToURL(map.getCenter());
  }
  
  function openByURL() {
    let studio = parseEncodedStudio();
    if(studio) {
      addStudioToMap(studio);  
    } else {
      let ll = dancemap.nav.getLatLngURL();
      if(ll) map.setView([ll[0],ll[1]]);
    }
  }

  function parseEncodedStudio() {
    const dataContainer = document.getElementById("search-prompt");
    let json, studio;
    if(dataContainer.dataset.res) {
      json = decodeURIComponent(dataContainer.dataset.res);
      studio = JSON.parse(json);
    } 
    return studio ? studio : null;
  } 
  
  function addStudioToMap(studio) {
    let id, ll;
    id = studio.properties._id;
    ll = studio.geometry.coordinates;
    self.dancemap.geojson.addData(addPopupContent([studio]));
    map.setView([ll[1],ll[0]]);
    openPopupByID(id);  
  }

  function openPopupByID(id) {
    self.dancemap.geojson.eachLayer(function(layer){
       if(id === layer.feature.properties._id) {
        layer.openPopup();
        return;
      }
    });
  }

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
  
  
  self.dancemap.geojson.on('click', (e) => {
    e.layer.closeTooltip();
    if (e.layer.feature.properties.cluster_id) {

      let clusterData = {
          getClusterExpansionZoom: e.layer.feature.properties.cluster_id,
          center: e.latlng,
          class: self.dancemap.ui.class
      }
        
      self.dancemap.socket.getZoomedClusters(clusterData);
      console.log('click cluster', clusterData);
    }
    console.log('geojson.on click -> e.layer.feature.properties ', e.layer.feature.properties)
  }); 

  


  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
      layer
        .bindPopup(feature.properties.popupContent)
        .bindTooltip( (layer) => layer.feature.properties.name, {permanent: false, opacity: 0.75});
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
        className: `marker-cluster marker-cluster-${size}`,
        iconSize: L.point(0, 0)
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

  function flyToClusters(data) {
    map.flyTo(data.center, data.expansionZoom);
  }

  function addClusters(data) {
    
    self.dancemap.nav.togglePrompt(data);
    self.dancemap.cluster = data;
    self.dancemap.geojson.eachLayer((layer) => {
      if(!layer.isPopupOpen()) {
        self.dancemap.geojson.removeLayer(layer);
      }
    })
    self.dancemap.geojson.addData(addPopupContent(data));
  }
  
  function isMarkerInSearch(marker) {
    
    return;
  }

  function checkClass(layer) {
    let currentClass = this.dancemap.ui.class;
    let speciality = layer.feature.properties.speciality;
    return speciality.includes(currentClass);
  }



  function getMap() {
    return map;
  }

  function addPopupContent(studios) {

    studios.forEach((studio) => {
      if(!studio.properties.cluster) {
        studio.properties.popupContent =
        `
          ${studio.properties.name ?  `<div class='studio-title'> ${studio.properties.name} </div>` : ''} 
          <hr>

          <div class='container-info__speciality'>
            <span>Направления: </span>${studio.properties.speciality ?  `${studio.properties.speciality.join(', ')}` : ''}
          </div>
        
          <div class='container-info__address'>
            ${self.dancemap.icons.marker} ${studio.properties.address ? `<div> ${studio.properties.city}, ${studio.properties.address} </div>` : ''} 
          </div>
          
          ${studio.properties.vk ? `<div class=''><a href='${studio.properties.vk}' target="_blank"> ${self.dancemap.icons.vk} </a></div>` : ''} 
          <div class="container-info__url"><button onclick="dancemap.nav.copyPopupURL()">копировать ссылку </button></div>
        `

      }
    })
    return studios;
  }

  return {
    plotStudios : plotStudios,
    getMap: getMap,
    addClusters: addClusters,
    flyToClusters: flyToClusters,
    openByURL: openByURL
  }

})();




