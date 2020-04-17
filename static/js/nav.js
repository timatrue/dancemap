//59.921104 | Longitude: 30.359772


this.dancemap.nav = (function(){
  let self = this;

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  } 

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  function searchSetup() {
    setURLID();
    onSearch();
    onClear();
  }
  
  function onSearch() {
    const input = document.querySelector('input[type="search"]');
    input.addEventListener('search', (e) => {
      //dancemap.socket.findStudio(input.value);
      console.log("The term searched for was " + input.value);
    })

    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        dancemap.socket.findStudio(input.value);
        console.log("The term searched for was " + input.value);
      }
    });
  }

  function onClear() {
    const btnClear = document.querySelector('#btn-clear');
    const input = document.querySelector('input[type="search"]');

    btnClear.addEventListener('click', (e) => {
      input.value = '';
      dancemap.socket.getClusters()
      console.log("The input cleared: " + input.value);
    })
  }

  function togglePrompt(array) {
     const prompt = document.getElementById('search-prompt');
     array.length ?  prompt.style.visibility = 'hidden' : prompt.style.visibility = 'visible'; 
  }

  function setURLID () {
    const path = window.location.pathname.split('/');
    if(path.length) {
      const id = path[path.length - 1]
      dancemap.nav.urlId = id ? id : null;
    }
  }
  
  function getMainCatURL () {
    const path = window.location.pathname.split('/');
    console.log(path);
    return path[1] ? "" : "/studios/"; 
  }

  function changeLocalURL(params) {
    document.title = params.title;
    let mainCat = getMainCatURL();
    let url = mainCat ? mainCat + params.url : params.url;
    history.pushState({}, params.title , url);
  }


  return {
    openNav : openNav,
    closeNav : closeNav,
    searchSetup: searchSetup,
    togglePrompt: togglePrompt,
    setURLID: setURLID,
    changeLocalURL: changeLocalURL
  }

})();




