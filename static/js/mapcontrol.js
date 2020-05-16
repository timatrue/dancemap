this.dancemap.mapcontrol = (function(){
  let self = this; 

  let map = L.map('map-box', {
    	geoLocationHandler: true,
      })
      .setView([55.746181, 37.625372], 10);
    
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGltYXRydWUiLCJhIjoiY2p4cmQwem8wMDcxdDNtcWpndWhjOTMwbiJ9.SoBmmbCYNBwXFXuZFRcgHw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'})
    .addTo(map);
     

  this.dancemap.icons = {}; 
  this.dancemap.icons.circle = L.divIcon({
    iconSize: [20, 20], 
    className: "count-icon",
    html: ""
  });
  this.dancemap.icons.single = L.divIcon({
    iconSize: [30, 30], 
    className: "map-marker",
    //iconUrl: "../images/chevron-left-solid.svg",
    html: ""
  });
  this.dancemap.icons.marker = "<div class='container-icon'><svg  height='16' width='12' viewBox='0 0 384 512'><path class='icon--grey' d='M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z'></path></svg></div>";
  this.dancemap.icons.vk = "<div class='container-icon'><svg  height='30' width='30' viewBox='0 0 576 512'><path class='vk--blue' d='M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z'></path></svg></div>";

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
  map.on("zoomstart", function (e) { dancemap.ui.inputs.category.disabled = true; });
  map.on("zoomend", function (e) { dancemap.ui.inputs.category.disabled = false; });
  map.on("popupopen", function(e) {

    if (window.matchMedia('screen and (max-width: 480px)').matches) {
      e.target.closePopup();
      showMobilePopup(e.popup._source.feature.properties.popupContent)
    }

    
    let marker = e.popup._source.feature
    let url = "/" + marker._id
    let title = marker.properties.name
    dancemap.nav.changeLocalURL({url, title})

    console.log("popupopen", e);
  })
  map.on("popupclose", function (e) {
    //e.setIcon(dancemap.icons.circle)
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
    const inputSearch = dancemap.ui.inputs.search;
    
    if(dancemap.ui.type == 'event') {
      dancemap.socket.findMarker(inputSearch.value)
    }
    if(dancemap.ui.type == 'studio') {
      inputSearch.value ?
        dancemap.socket.findMarker(inputSearch.value) :
        dancemap.socket.getClusters();
    }
    
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

    //if (!e.layer.feature.properties.cluster_id) e.layer.setIcon(dancemap.icons.single)
    if (e.layer.feature.properties.cluster_id) {

      let clusterData = {
          getClusterExpansionZoom: e.layer.feature.properties.cluster_id,
          center: e.latlng,
          category: self.dancemap.ui.category
      }
        
      self.dancemap.socket.getZoomedClusters(clusterData);
      console.log('click cluster', clusterData);
    }
    console.log('geojson.on click -> e.layer.feature.properties ', e.layer.feature.properties)
  }); 

  
  function showMobilePopup(content) {
    L.control.popupMobile(map, {content: content}).show();
  }
    
  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {

      layer
        .bindPopup(feature.properties.popupContent)
        //.bindPopup(L.mobilePopup().setContent(feature.properties.popupContent))
        .bindTooltip( (layer) => {
          let marker = layer.feature;
          return marker.group ? `Событий - ${marker.group.length}` : marker.properties.name;
          //return layer.feature.properties.name;
        }, {permanent: false, opacity: 0.75});
    }
    
  }
    
  function pointToLayer(feature, latlng) {
    //return L.marker(latlng, {icon: dancemap.icons.circle});

    if (!feature.properties.cluster) return L.marker(latlng, {icon: dancemap.icons.single});

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
    let markers = L.markerClusterGroup();
    markers.addLayer(self.dancemap.geojson);
    map.addLayer(markers);
  }

  function flyToClusters(data) {
    map.flyTo(data.center, data.expansionZoom);
  }

  function addClusters(markers) {
    let nestedMarkers = findNestedMarkers(markers);
    markers = nestedMarkers || markers ;
    
    self.dancemap.nav.togglePrompt(markers);
    self.dancemap.cluster = markers;
    self.dancemap.geojson.eachLayer((layer) => {
      if(!layer.isPopupOpen()) {
        self.dancemap.geojson.removeLayer(layer);
      }
    })

    self.dancemap.geojson.addData(addPopupContent(markers));
  }
  
  function findNestedMarkers(markers) {
    

    //let nested = [];
    let grouped = {};
    let nested = [];
    markers.forEach(marker => {
      /*if(marker.properties.address) {
        let prop = marker.properties.address;
        sorted[prop] = sorted[prop] || [];
        sorted[prop].push(marker);
      }
      if(marker.properties.cluster) {
        let prop = marker.properties.cluster_id;
        sorted[prop] = sorted[prop] || [];
        sorted[prop].push(marker);
      }*/
      let prop = marker.properties.address || marker.properties.cluster_id;
      grouped[prop] = grouped[prop] || [];
      grouped[prop].push(marker);
    })

    Object.values(grouped).forEach(address => {
      /*
      if(address.length > 1) {
        //let mergedMarker = Object.assign({}, ...address);
        let marker = address[0];
        marker.group = address;
        temp.push(marker);
      } else {
        let marker = address[0];
        temp.push(marker)
      }*/

      let marker = address[0];
      if(address.length > 1) marker.group = address;
      nested.push(marker);
    })
  
    /*
    const grouped = groupBy(data, (marker) => marker.properties.address);
    Object.values(grouped)
      .forEach(group => {
        if(group.length > 1) {
          let parent = group[0];
          group[0].nested = group;
          nested.push(parent);
        } else {
          nested.push(...group)
        }
      })*/

    console.log('findNestedMarkers', nested)
    return nested;
  }

  /*function groupBy(data, fn) {
    return data
      .reduce((acc, marker, i, a, k = fn(marker)) => {
        if(acc) return  ((acc[k] || (acc[k] = [])).push(marker), acc)
      }
      , {})
  }*/

  function checkClass(layer) {
    let currentClass = this.dancemap.ui.class;
    let speciality = layer.feature.properties.speciality;
    return speciality.includes(currentClass);
  }

  function getMap() {
    return map;
  }

  function addPopupContent(markers) {

    markers.forEach((marker) => {
      if(!marker.properties.cluster) {
        if(!marker.group) {
          marker.properties.popupContent = getPopupContentDekstop(marker);
        }
        if(marker.group) {
          let template = marker.group.reduce((acc,current) => {
            return getPopupContentDekstop(acc) + `<hr>` +getPopupContentDekstop(current)
          })
          marker.properties.popupContent = template;
          //console.log('template',template);
        }
      }
    })
    return markers;
  }

  function getPopupContentDekstop(marker) {
       template =
        `
          ${marker.properties.name ?
            `<div class='marker-title'> <h1>${marker.properties.name}</h1>
            ${marker.properties.start ? '<h2>' + dayjs(marker.properties.start).format('D MMMM YYYY') + ' -' : ''} 
            
            ${marker.properties.end ? dayjs(marker.properties.end).format('D MMMM YYYY') + '</h2>' : ''} 
            </div>` :
             ''} 
          ${marker.properties.speciality ? 
            `<div class='marker-content'>
            <div class='container-info__speciality'>
              <div class='subtitle'>Танцевальные направления: </div> ${marker.properties.speciality.join(', ')}
            </div>`:
            ''} 

          ${marker.properties.offers ?
            `<div class='container-info__offers'>
               <div class='subtitle'>Стоимость:</div>
             ${marker.properties.offers
               .map(offer => "<div>" + offer.name + ' - ' + offer.price + "</div>")
               .join("")
             }
            </div>` :
          ''}
        
          ${marker.properties.address ?
            `<div class='container-info__address'>
              <div class='subtitle'>Адрес:</div>
              
              <div> ${self.dancemap.icons.marker} ${marker.properties.city}, ${marker.properties.address} </div>  
            </div>` :
          ''}

          ${marker.properties.vk ?  
            `<div class='container-info__social'>
                <a href='${marker.properties.vk}' target="_blank" title='${marker.properties.name}'>
                  ${self.dancemap.icons.vk}
                </a> 
            </div>` :
          ''}

          <div class="container-info__url">
            <button onclick="dancemap.nav.copyPopupURL()">копировать ссылку </button>
          </div>
          
        </div>` 
        return template;
  }

  function searchSetup(settings) {
    dancemap.ui = dancemap.ui || {} ;
    dancemap.ui.type = settings.type;
    if(settings.eventType) dancemap.ui.eventType = settings.eventType;
    dancemap.ui.category = settings.category;
    dancemap.ui.radius = settings.radius;
    dancemap.ui.queryType = settings.queryType;
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  return {
    
    getMap: getMap,
    addClusters: addClusters,
    flyToClusters: flyToClusters,
    openByURL: openByURL,
    searchSetup: searchSetup,
    moveEnd: moveEnd,
    getDistance: getDistance
  }

})();




