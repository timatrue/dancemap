function getStudioTemplate() {
  let studio = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {
        "name": "",
        "altername":"",
        "address":"",
        "classes":{},
        "speciality":[]
      }
    }
    return studio;
}

module.exports = {getStudioTemplate}