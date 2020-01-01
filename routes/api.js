const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');

router.get('/studios', function(req, res) {
	Studio.find({}).then(function(studio) { 
	  console.log('GET',studio);
      res.send(studio);
	});

    Studio.countDocuments({}).then(function(err, count) {
      console.log('GET', count);
    });
})

router.post('/studios', function(req, res) {
	/*var studio = new Studio(req.body);
	studio.save();*/
	Studio.create(req.body).then(function(studio) {
		console.log(studio);
		res.send(studio);
	})

	res.send({type:'POST'});
});

router.put('/studios/:id', function(req, res) {
	res.send({type:'PUT'});
});

router.delete('/studios/:id', function(req, res) {
	res.send({type:'DELETE'});
});

module.exports = router;