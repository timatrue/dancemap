const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Event = require('../models/event');
const User = require('../models/user');
const path = require('path')


//https://www.youtube.com/watch?v=2jqok-WgelI

router.post('/register', async (req, res) => {

 console.log(req.body.name)
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch(err) {
    res.status(400).send(err);
  }


});



module.exports = router;