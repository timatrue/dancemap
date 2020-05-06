//59.921104 | Longitude: 30.359772


this.dancemap.socket = (function(){
let self = this;
const socket = io();


function getStudios(fn) {

  socket.on('studio_list', function (studios) {
    console.log(studios);
    fn(studios);  
  });

  socket.emit('get_studio', {});
}

function getClusters() {


    let map = dancemap.mapcontrol.getMap();
    let bounds = map.getBounds();
    let zoom = map.getZoom();
    // ([westLng, southLat, eastLng, northLat])
    let box = {
      bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom: zoom,
      category: dancemap.ui.category,
      type: dancemap.ui.type
    } 
    console.log('getClusters', box)
    socket.emit('get_clusters', box);

}

function getZoomedClusters(box) {
  box.category = dancemap.ui.category;
  box.type = dancemap.ui.type;

  socket.emit('get_clusters', box);
}


function getClusterChildren(clusterId) {

  socket.emit('get_children', clusterId);
}

socket.on('get_children', function (clusters) {
  console.log('get_children_server', clusters);
});


function getClusterLeaves(clusterId) {

  socket.emit('get_leaves', clusterId);
}

function getMemoryUsage() {

  socket.emit('get_memory_usage', {});
}

function findMarker(studio) {
  let map = dancemap.mapcontrol.getMap();
  let type = dancemap.ui.type;
  let category = dancemap.ui.category
  let radius = dancemap.ui.radius;
  let queryType = dancemap.ui.queryType;
  let center = map.getCenter();
  let sw = map.getBounds().getSouthWest();
  let ne = map.getBounds().getNorthEast();
  let box = [[sw.lng,sw.lat], [ne.lng,ne.lat]];

  let query = {studio, category, center, radius, queryType, box, type};
  socket.emit('find_marker', query);
}

function isStudioIdValid(studio) {
  socket.emit('check_id', id);
}

function getSupercluster(studio) {
  socket.emit('get_supercluster', {});
}

socket.on('find_studio', function (validity) {
  console.log('check_id', validity);
});

socket.on('find_studio', function (studio) {
  console.log('find_studio', studio);
});

socket.on('get_leaves', function (clusters) {
  console.log('get_leaves_server', clusters);
});

socket.on('get_clusters', function (clusters) {

  //testCluster.getClusterExpansionZoom(e.data.getClusterExpansionZoom)
  if (clusters.expansionZoom) {
    dancemap.mapcontrol.flyToClusters(clusters);
  } else {

    dancemap.mapcontrol.addClusters(clusters);
    console.log('clusters_server', clusters); 
  }
});

socket.on('get_supercluster', function (supercluster) {
  dancemap.supercluster =  supercluster;
  console.log('get_supercluster', supercluster); 
});


socket.on('reload', (res) => console.log(res));


function postStudio(studio) {
  console.log('postStudio', studio);
  socket.emit('post_studio', studio);
}

function postEvent(event) {
  console.log('postEvent', event);
  socket.emit('post_event', event);
}

function setAllDocuments(propUpdate) {
  socket.emit('set_all_documents', propUpdate);
}

function reload(secret) {

  socket.emit('reload', secret);
}

  return {
    getStudios: getStudios,
    postStudio: postStudio,
    postEvent: postEvent,
    getClusters: getClusters,
    setAllDocuments: setAllDocuments,
    getZoomedClusters: getZoomedClusters,
    getClusterChildren: getClusterChildren,
    getClusterLeaves: getClusterLeaves,
    findMarker: findMarker,
    isStudioIdValid,
    reload: reload,
    getMemoryUsage: getMemoryUsage,
    getSupercluster: getSupercluster

  }

})();




