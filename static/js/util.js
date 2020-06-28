//59.921104 | Longitude: 30.359772


this.dancemap.util = (function(){

  function isObjEmpty(obj) {
    const isEmpty = Object.keys(obj).length === 0;
    console.log('isObjEmpty', isEmpty);
    return isEmpty;
  }

  function isObjPropNotEmpty(obj) {
    const isEmpty = Object.values(obj).some(x => (x !== null && x !== ''));
    console.log('isObjPropNotEmpty', isEmpty);
    return isEmpty;
  }

  function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
  }

  function getFormattedDate(dateString, hms) {
    var date = new Date(dateString);
    if(hms) {
      date.setHours(hms.h, hms.m, hms.s);
    } else {
      date.setHours(0, 0, 0); 
    }
    // Set hours, minutes and seconds
    return date.toISOString();
  }
  
  function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }

  function inactivityTime() {
    //https://stackoverflow.com/questions/667555/how-to-detect-idle-time-in-javascript-elegantly
    let time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    function logout() {
        //alert("You are now logged out.")
        location.href = 'addmarker'
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 1000*60)
        // 1000 milliseconds = 1 second
    }
  };
  
  return {
    isObjEmpty : isObjEmpty,
    isObjPropNotEmpty : isObjPropNotEmpty,
    htmlToElements : htmlToElements,
    getFormattedDate : getFormattedDate,
    removeElement : removeElement,
    inactivityTime : inactivityTime

  }

})();




