const express = require('express');
const router = express.Router();

router.get('/studios', function(req, res) {
	res.send({type:'GET'});
});

router.post('/studios', function(req, res) {
	res.send({type:'POST'});
});

router.put('/studios/:id', function(req, res) {
	res.send({type:'PUT'});
});

router.delete('/studios/:id', function(req, res) {
	res.send({type:'DELETE'});
});

module.exports = router;