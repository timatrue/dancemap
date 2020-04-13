const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');

router.get('/mongo', function(req, res) {
	Studio.find({}).then(function(studio) { 
	  console.log('GET /mongo',studio);
      
      res.sendFile('/mongo.html', {root: __dirname })
      //res.send(studio);
	});

    Studio.countDocuments({}).then(function(err, count) {
      console.log('GET', count);
    });


})

router.get('/studios/:id', function(req, res) {
    console.log('GET /studio', req.params);  
    if(req.params.id) {
      const id = req.params.id
	  Studio.find({"_id": id}).then(function(studio) { 
	    console.log('GET /studio',studio);      
        //res.sendFile('/mongo.html', {root: __dirname })
        res.send(studio);
	  });

    }
})

router.post('/mongo', function(req, res) {
	/*var studio = new Studio(req.body);
	studio.save();*/
	Studio.create(req.body).then(function(studio) {
		console.log(studio);
		res.send(studio);
	})

	res.send({type:'POST'});
});

router.put('/mongo/:id', function(req, res) {
	res.send({type:'PUT'});
});

router.delete('/mongo/:id', function(req, res) {
	res.send({type:'DELETE'});
});

module.exports = router;