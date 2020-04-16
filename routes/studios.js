const express = require('express')
const router = express.Router()
const Studio = require('../models/studio')
const path = require('path')
const { buildSitemaps } = require('express-sitemap-xml')
const fs = require('fs')




router.get('/:id', function(req, res) {
    console.log('GET /studio', req.params);  
    if(req.params.id) {
      const id = req.params.id
	  Studio.find({"_id": id})
	    .then(function(studio) { 
	      console.log('GET /studio', studio); 
          res.render('../static/views/index',{
        	title: studio[0].properties.name,
        	classes: studio[0].properties.speciality.join(', '),
        	studio: encodeURIComponent(JSON.stringify(studio[0]))
        });

        //res.sendFile(path.join(__dirname, '../static', 'index.html'));
        //res.send(studio);
	  });

    }
})

router.get('/:id/generatesitemap', function(req, res) {
     Studio.distinct("_id", {})
      .then(studios => {
        const urls = studios.map(studio => { 
        	return {url:`/studios/${studio}`, changeFreq: 'monthly', lastMod: new Date('2020-01-01')}
        })
        return urls; })
      .then(urls => {
        const sitemaps = buildSitemaps(urls,'https://dancemap.online')
        return sitemaps
      })
      .then( sitemaps => {
      	const sitemap = sitemaps["/sitemap.xml"]
      	fs.writeFileSync(path.join(__dirname, '../static/sitemap.xml'), sitemap.toString())
      	console.log('sitemap', sitemap)
      	res.send(sitemap)
      })
})
module.exports = router;