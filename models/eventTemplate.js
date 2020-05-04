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
        "classes" : {},
        "speciality" : [],
        "seoimage" : {},
        "start" : "",
        "end" : "",
        "nestedgroup" : []
      }
    }
    return event;
}

module.exports = {getEventTemplate}