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
        "speciality" : [],
        "seoimage" : {},
        "start" : "",
        "end" : "",
        "startH" : "",
        "endH" : "",
        "nestedgroup" : []
      }
    }
    return event;
}

module.exports = {getEventTemplate}