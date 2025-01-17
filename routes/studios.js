const express = require('express')
const router = express.Router()
const Studio = require('../models/studio')
const path = require('path')

const dayjs = require('dayjs')
require('dayjs/locale/ru')
dayjs.locale('ru')

router.get('/:id', function(req, res) {
    console.log('GET /studio', req.params);  
    if(req.params.id) {
      const id = req.params.id
	  Studio.find({"_id": id})
	    .then(function(studio) { 
	      console.log('GET /studio', studio); 
          res.render('../static/views/studios',{
        	marker: studio[0],
          page: null,
          dayjs: dayjs,
          markerEncoded: encodeURIComponent(JSON.stringify(studio[0]))
        });

        //res.sendFile(path.join(__dirname, '../static', 'index.html'));
        //res.send(studio);
	  });

    }
})

module.exports = router;