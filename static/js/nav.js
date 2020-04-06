//59.921104 | Longitude: 30.359772


this.dancemap.nav = (function(){

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  } 

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  function searchSetup() {
    onSearch();
    onClear();
  }
  
  function onSearch() {
    const input = document.querySelector('input[type="search"]');
    input.addEventListener('search', () => {
      console.log("The term searched for was " + input.value);
    })
  }

  function onClear() {
    const btnClear = document.querySelector('#btn-close');
    const input = document.querySelector('input[type="search"]');

    btnClear.addEventListener('click', () => {
      input.value = '';
      console.log("The input cleared: " + input.value);
    })
  }


  return {
    openNav : openNav,
    closeNav : closeNav,
    searchSetup: searchSetup,
  }

})();




