function getEventTemplate() {
  let event = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {
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