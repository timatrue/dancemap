function getStudioTemplate() {
  let studio = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {
        "name": "",
        "address":""
      }
    }
    return studio;
}

module.exports = {getStudioTemplate}