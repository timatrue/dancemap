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
    input.addEventListener('search', () => {
      dancemap.socket.findStudio(input.value);
      console.log("The term searched for was " + input.value);
    })
  }

  function onClear() {
    const btnClear = document.querySelector('#btn-clear');
    const input = document.querySelector('input[type="search"]');

    btnClear.addEventListener('click', () => {
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


  return {
    openNav : openNav,
    closeNav : closeNav,
    searchSetup: searchSetup,
    togglePrompt: togglePrompt,
    setURLID: setURLID
  }

})();




