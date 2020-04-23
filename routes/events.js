const express = require('express')
const router = express.Router()
const Studio = require('../models/studio')
const path = require('path')
const { buildSitemaps } = require('express-sitemap-xml')
const fs = require('fs')




router.get('/:id', function(req, res) {
    console.log('GET /events', req.params);  
    if(req.params.id) {
      const id = req.params.id
	  Studio.find({"_id": id})
	    .then(function(studio) { 
	      console.log('GET /studio', studio); 
          res.render('../static/views/indextestmenu',{
        	title: studio[0].properties.name,
        	classes: studio[0].properties.speciality.join(', '),
        	marker: studio[0],
        	studio: encodeURIComponent(JSON.stringify(studio[0]))
        });

        //res.sendFile(path.join(__dirname, '../static', 'index.html'));
        //res.send(studio);
	  });

    }
})

module.exports = router;