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

  return {
    isObjEmpty : isObjEmpty,
    isObjPropNotEmpty : isObjPropNotEmpty

  }

})();




