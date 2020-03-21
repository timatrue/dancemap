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

function getClusters(e) {
  let map = dancemap.initMap.getMap();
  let bounds = map.getBounds();
  let zoom = map.getZoom();
  // ([westLng, southLat, eastLng, northLat])
  let box = {
    bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    zoom: zoom,
    class: self.dancemap.ui.class
  } 
  socket.emit('get_clusters', box);
}

function getZoomedClusters(box) {
  box.class = self.dancemap.ui.class;

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

socket.on('get_leaves', function (clusters) {
  console.log('get_leaves_server', clusters);
});

socket.on('get_clusters', function (clusters) {

  //testCluster.getClusterExpansionZoom(e.data.getClusterExpansionZoom)
  
  if (clusters.expansionZoom) {
    dancemap.initMap.flyToClusters(clusters);
  } else {

    dancemap.initMap.addClusters(clusters);
    console.log('clusters_server', clusters); 
  }
});

socket.on('reload', (res) => console.log(res));


function postStudio(studio) {
  console.log('postStudio', studio);
  socket.emit('post_studio', studio);
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
    getClusters: getClusters,
    setAllDocuments: setAllDocuments,
    getZoomedClusters: getZoomedClusters,
    getClusterChildren: getClusterChildren,
    getClusterLeaves: getClusterLeaves,
    reload: reload

  }

})();




