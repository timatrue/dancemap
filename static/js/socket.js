//59.921104 | Longitude: 30.359772


this.dancemap.socket = (function(){
const socket = io();


function getStudios(fn) {

      socket.emit('get_studio', {});
      socket.on('studio_list', function (studios) {
        console.log(studios);
        fn(studios);
        
      });
}


function postStudio(studio) {
  console.log('postStudio', studio);
  socket.emit('post_studio', studio);

}

  return {
    getStudios: getStudios,
    postStudio: postStudio
  }

})();




