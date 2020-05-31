const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Event = require('../models/event');
const User = require('../models/user');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const path = require('path');

//https://www.youtube.com/watch?v=2jqok-WgelI

router.post('/register', async (req, res) => {

  //Data validation
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Checking if the user is already in the DB
  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send('Email already exists');

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user 
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
    
  } catch(err) {
    res.status(400).send(err);
  }


});


module.exports = router;