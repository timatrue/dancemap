const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const path = require('path')
const { buildSitemaps } = require('express-sitemap-xml')
const fs = require('fs')

const dayjs = require('dayjs')
require('dayjs/locale/ru')
dayjs.locale('ru')




router.get('/:id', function(req, res) {
    console.log('GET /events', req.params);  
    if(req.params.id) {
      const id = req.params.id
	    Event.find({"_id": id})
	    .then(function(event) { 
	      console.log('GET /event', event); 
          res.render('../static/views/events',{
        	marker: event[0],
          page: null,
          dayjs: dayjs,
          markerEncoded: encodeURIComponent(JSON.stringify(event[0]))
        });

        //res.sendFile(path.join(__dirname, '../static', 'index.html'));
        //res.send(studio);
	  });

    }
})

module.exports = router;