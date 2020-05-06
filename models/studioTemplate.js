function getStudioTemplate() {
  let studio = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {
        "type": "",
        "name": "",
        "altername":"",
        "address":"",
        "city":"",
        "country":"",
        "classes":{},
        "speciality":[],
        "seoimage": {}
      }
    }
    return studio;
}

module.exports = {getStudioTemplate}