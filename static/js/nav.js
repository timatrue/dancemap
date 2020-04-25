this.dancemap.nav = (function(){
  let self = this;
  
  function setInputDate(input) {
    if(input) {
      //input.value = new Date().toISOString().split('T')[0];
      input.valueAsDate = new Date();
    }
  }

  function setInputDateListener(input) {
    input.addEventListener('change',(e) => { 
      let date = new Date(e.target.value);
      console.log('datepicker', date);
    })
  }

  function downDay(settings) {
    settings.down.addEventListener('click',(e)=> {
      let date = new Date(settings.datepicker.value);
      date.setDate(date.getDate() - 1);
      settings.datepicker.valueAsDate = date;
      console.log('downDay', settings.datepicker.value);
    }) 
  }

  function upDay(settings) {
    settings.up.addEventListener('click',(e)=> {
      let date = new Date(settings.datepicker.value);
      date.setDate(date.getDate() + 1);
      settings.datepicker.valueAsDate = date;
      console.log('upDay',settings.datepicker.value);
    }) 
  }

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  } 

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  function navSetup(settings) {
    if(settings.event) {
      let input = settings.datepicker;

      setInputDate(input);
      setInputDateListener(input);
      upDay(settings);
      downDay(settings);
    }

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
        input.blur();
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

  function addLatLngToURL(center) {
    let pageUrl = '?ll=' + center.lat + ',' + center.lng;
    window.history.pushState('', '', pageUrl);
  }

  function getLatLngURL () {
    let searchParams = new URLSearchParams(window.location.search);
    let ll;
    if(searchParams.get('ll')) {
      ll = searchParams.get('ll').split(',').map(el => +el);
    }

    console.log('ll', ll);
    return ll;
  }

  function copyPopupURL() {
    let url = window.location.href;
    let dummyInput = document.createElement('input');
    dummyInput.setAttribute('type', 'text');
    dummyInput.value = url;
    document.body.appendChild(dummyInput);
    dummyInput.select();
    document.execCommand("copy");
    document.body.removeChild(dummyInput);
  }

  return {
    setInputDate : setInputDate,
    openNav : openNav,
    closeNav : closeNav,
    navSetup: navSetup,
    togglePrompt: togglePrompt,
    setURLID: setURLID,
    changeLocalURL: changeLocalURL,
    addLatLngToURL: addLatLngToURL,
    getLatLngURL: getLatLngURL,
    copyPopupURL: copyPopupURL
  }

})();




