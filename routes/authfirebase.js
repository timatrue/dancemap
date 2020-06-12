const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Event = require('../models/event');
const User = require('../models/user');
const path = require('path');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const formidable = require('formidable');
const fs = require('fs');

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


router.post('/upload', uploadImgRoute)

async function getUserFID(idToken) {
// idToken comes from the client app
  return await admin
    .auth()
    .verifyIdToken(idToken)
    .then(function(decodedToken) {
      let uid = decodedToken.uid;
      console.log('getUserFID', uid)
      // ...
      return uid;
    })
    .catch(function(error) {
      // Firebase tokens expires in 1 hour
      console.log('getUserFID', error)     
    });
}

function createTempDir(uid) {
  const dir = './static/uploads/temp/' + uid;
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, function(err) {
      if(err) {
        if(err.code == 'EEXIST') {
          resolve(dir);
        } else {
          reject(err);
        }
      } else {
        resolve(dir);
      }
    });
  })
}


async function uploadImgRoute (req, res) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000 // 30 days
    /** add other headers as per requirement */
  }
  const token = req.cookies.token || "";
  if(token) {
    let isDir;
    getUserFID(token)
      .then(uid => {
        return createTempDir(uid)
      })
      .then(dir => {
        console.log('Directory ready', dir);
        // parse a file upload
        var form = new formidable.IncomingForm()
        form.uploadDir = dir; 
        form.keepExtensions = true

        form.parse(req, function (err, fields, files) {
          if (err) {
            console.log('uploadImgRoute error', err)
            res.writeHead(200, headers)
            res.write(JSON.stringify(err))
            return res.end()
          }
    
          var file = files['files[]']
          console.log('uploadImgRoute saved file to', file.path)
          console.log('uploadImgRoute original name', file.name)
          console.log('uploadImgRoute type', file.type)
          console.log('uploadImgRoute size', file.size)
          res.writeHead(200, headers)
          res.write(JSON.stringify({ fields, files }))
          return res.end()
        }) 
      })
      .catch(err => {
        console.log('err', err);
      });
  } else {
    res.redirect('/login')
  }

}

module.exports = router;