//59.921104 | Longitude: 30.359772


this.dancemap.nav = (function(){

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  } 

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  return {
    openNav : openNav,
    closeNav : closeNav

  }

})();




