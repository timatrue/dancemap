this.dancemap.nav = (function(){
  let self = this;
  
  
  function setCategoryListener(input) {
    input.addEventListener('change', function (event) {
      dancemap.ui.category = this.value;
      dancemap.mapcontrol.getMap().closePopup();
      dancemap.mapcontrol.moveEnd();
      console.log('setCategoryListener', this.value);
    }, false);
  }

  function setTypeListener(input) {
    input.addEventListener('change', function (event) {
      dancemap.ui.eventType = this.value;
      dancemap.mapcontrol.getMap().closePopup();
      dancemap.mapcontrol.moveEnd();
      console.log('setCategoryListener', this.value);
    }, false);
  }


  function setInputDate(input) {
    if(input) {
      //input.value = new Date().toISOString().split('T')[0];
      let date = new Date();
      date.setMonth(date.getMonth() + 6);
      input.valueAsDate = dancemap.ui.date = date;
      dancemap.ui.date = date;
    }
  }

  function setInputDateListener(date) {
    const query = dancemap.ui.inputs.search;
    date.addEventListener('change',(e) => { 
      let date = new Date(e.target.value);
      dancemap.ui.date = date;
      dancemap.mapcontrol.getMap().closePopup();
      dancemap.socket.findMarker(query.value);
      console.log('datepicker', date);
    })
  }

  function downDay(settings) {
    settings.down.addEventListener('click', (e)=> {
      let date = new Date(settings.datepicker.value);
      date.setDate(date.getDate() - 1);
      settings.datepicker.valueAsDate = date;
      console.log('downDay', settings.datepicker.value);
    }) 
  }

  function upDay(settings) {
    settings.up.addEventListener('click', (e)=> {
      let date = new Date(settings.datepicker.value);
      date.setDate(date.getDate() + 1);
      settings.datepicker.valueAsDate = date;
      console.log('upDay',settings.datepicker.value);
    }) 
  }

  function openSidenav() {
    document.getElementById("sidenav").style.width = "250px";
  } 

  function closeSidenav() {
    document.getElementById("sidenav").style.width = "0";
  }

  function openSideContent(template) {
    let sidebar = dancemap.ui.sidebars.content;
    let content = "<div class='sidecontent-child' id='sidecontent-child'>" + template + "</div>";
    if(template && sidebar.children.length == 1) {
      sidebar.insertAdjacentHTML('beforeend', content); 
    }
    sidebar.style.width = "300px";
  } 

  function updateSideContent(template) {
    let sidebar = dancemap.ui.sidebars.content;
    let closeBtn = sidebar.firstElementChild;
    let content = "<div class='sidecontent-child' id='sidecontent-child'>" + template + "</div>";
    
    let child = sidebar.querySelector('.sidecontent-child');
    let throwawayNode = sidebar.removeChild(child);
    sidebar.insertAdjacentHTML('beforeend', content);
    
    return false;
  } 


  function closeSideContent(e) {
    
    let sidebar = dancemap.ui.sidebars.content;
    let closeBtn = sidebar.firstElementChild;
    sidebar.style.width = "0";
    
    let child = sidebar.querySelector('.sidecontent-child');
    let throwawayNode = sidebar.removeChild(child);

    return false;
  }

  function openModalMobile() {
    let modal = document.getElementById("modal-mobile");
    modal.style.display = "block";
  }

  function navSetup(settings) {
    dancemap.ui.inputs = {};
    dancemap.ui.inputs.search = settings.search;
    dancemap.ui.inputs.category = settings.category;

    dancemap.ui.sidebars = {};
    dancemap.ui.sidebars.content = settings.sidecontent;
    
    if(settings.event) {
      dancemap.ui.inputs.datepicker = settings.datepicker;
      dancemap.ui.inputs.type = settings.type;
      setInputDate(settings.datepicker);
      setInputDateListener(settings.datepicker);
      setTypeListener(settings.type);
      //upDay(settings);
      //downDay(settings);
    }
    setCategoryListener(settings.category);
    setURLID();
    onSearch();
    onClear();
  }
  
  function onSearch() {
    const input = dancemap.ui.inputs.search;
    input.addEventListener('search', (e) => {
      //dancemap.socket.findMarker(input.value);
      console.log("The term searched for was " + input.value);
    })

    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        dancemap.socket.findMarker(input.value);
        input.blur();
        console.log("The term searched for was " + input.value);
      }
    });
  }

  function onClear() {
    const btnClear = document.querySelector('#btn-clear');
    const input = dancemap.ui.inputs.search;

    btnClear.addEventListener('click', (e) => {
      input.value = '';
      
      if(dancemap.ui.type == 'event') {
        dancemap.socket.findMarker(input.value)
      }
      if(dancemap.ui.type == 'studio') {
        dancemap.socket.getClusters()
      }

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
    return path;
    /*if(path[1] == "studios" ) return path[1];
    if(path[1] == "events" ) return path[1];
    if(path[1] == "" ) return path[1]; */
  }

  function changeLocalURL(params) {
    document.title = params.title;
    let path = getMainCatURL();
    let url = path[1] ? path[1] + params.url : params.url;
   
    if(path[2]) history.pushState({}, params.title , '/' + url);
    if(!path[2]) history.pushState({}, params.title , url);
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
    openSidenav : openSidenav,
    closeSidenav : closeSidenav,
    openSideContent : openSideContent,
    closeSideContent : closeSideContent,
    updateSideContent : updateSideContent,
    navSetup: navSetup,
    togglePrompt: togglePrompt,
    setURLID: setURLID,
    changeLocalURL: changeLocalURL,
    addLatLngToURL: addLatLngToURL,
    getLatLngURL: getLatLngURL,
    copyPopupURL: copyPopupURL,
    openModalMobile: openModalMobile
  }

})();




