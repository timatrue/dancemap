//59.921104 | Longitude: 30.359772


this.dancemap.socket = (function(){
const socket = io();


function getStudios(fn) {

  socket.on('studio_list', function (studios) {
    console.log(studios);
    fn(studios);  
  });

  socket.emit('get_studio', {});
}

function getClusters() {
  let map = dancemap.initMap.getMap();
  let bounds = map.getBounds();
  let zoom = map.getZoom();
  // ([westLng, southLat, eastLng, northLat])
  let box = {
    bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    zoom: zoom
  } 
  socket.emit('get_clusters', box);
}


socket.on('get_clusters', function (clusters) {

  //testCluster.getClusterExpansionZoom(e.data.getClusterExpansionZoom)
  dancemap.initMap.addClusters(clusters);
  console.log('clusters_server', clusters); 
});

function postStudio(studio) {
  console.log('postStudio', studio);
  socket.emit('post_studio', studio);

}

  return {
    getStudios: getStudios,
    postStudio: postStudio,
    getClusters: getClusters
  }

})();




