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

function testCluster() {
  let map = dancemap.initMap.getMap();
  let bounds = map.getBounds();
  let zoom = map.getZoom();
  // ([westLng, southLat, eastLng, northLat])
  let box = {
    bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    zoom: zoom
  } 
  socket.emit('testCluster', box);
}


socket.on('testCluster', function (testCluster) {

  //testCluster.getClusterExpansionZoom(e.data.getClusterExpansionZoom)
   dancemap.initMap.serverCluster(testCluster);
    console.log('testCluster_server', testCluster); 
});

function postStudio(studio) {
  console.log('postStudio', studio);
  socket.emit('post_studio', studio);

}

  return {
    getStudios: getStudios,
    postStudio: postStudio,
    testCluster: testCluster
  }

})();




