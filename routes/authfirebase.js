const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Event = require('../models/event');
const User = require('../models/user');
const path = require('path');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dancemap-b12c5.firebaseio.com"
});

//https://www.youtube.com/watch?v=2jqok-WgelI
//https://www.youtube.com/watch?v=kX8by4eCyG4

router.post('/register', async (req, res) => {

});

router.get('/login', async (req, res) => {

  res.render('../static/views/login');

});

router.get('/signup', async (req, res) => {

  res.render('../static/views/signup');

});

router.get('/profile', function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render('../static/views/profile');
    })
    .catch((error) => {
      res.redirect('/login');
    });
});

router.post('/sessionLogin', (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("token", idToken);
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

router.get('/sessionLogout', (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

module.exports = router;