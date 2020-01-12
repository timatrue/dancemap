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