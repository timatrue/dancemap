function getEventTemplate() {
  let event = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {
        "type" : "",
        "name" : "",
        "altername" : "",
        "address" : "",
        "city":"",
        "country":"",
        "classes" : {},
        "activities" : {},
        "speciality" : [],
        "seoimage" : {},
        "start" : "",
        "end" : "",
        "startH" : "",
        "endH" : "",
        "nestedgroup" : [],
        "offers": []
      }
    }
    return event;
}

module.exports = {getEventTemplate}