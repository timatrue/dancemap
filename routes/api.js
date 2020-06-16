const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Event = require('../models/event');
const path = require('path')
const { buildSitemaps } = require('express-sitemap-xml')
const fs = require('fs')
const verify = require('./verifyFirebase')
const admin = require("firebase-admin");
const csrf = require("csurf")

let csrfProtection = csrf({ cookie: true })

router.get('/addmarker', verify.checkAuth, csrfProtection, function(req, res) {
  const sessionCookie = req.cookies.session || "";
  
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render('../static/views/addmarker', { csrfToken: req.csrfToken() })
    })
    .catch((error) => {
      console.error(error)
      res.redirect('/login');
    });

})


router.get('/generatesitemap', function(req, res) {
  Promise.all([getStudioList(), getEventsList()])
    .then((values) => {
      const rootUrls = getRootList();
      const studioUrls = values[0];
      const eventUrls = values[1];
      let urls = [...rootUrls,...studioUrls, ...eventUrls];
      console.log('generatesitemapall', urls);
      const sitemaps = buildSitemaps(urls,'https://dancemap.online')
      return sitemaps;
    })
    .then((sitemaps) => {
        const sitemap = sitemaps["/sitemap.xml"]
        fs.writeFileSync(path.join(__dirname, '../static/sitemap.xml'), sitemap.toString())
        console.log('sitemap', sitemap)
        res.send(sitemap)
    });

})

getStudioList = () => {
  return Studio.distinct("_id", {})
    .then(studios => {
      const urls = studios.map(studio => { 
        return {url:`/studios/${studio}`, changeFreq: 'monthly', lastMod: new Date('2020-01-01')}
      })
      return urls;
    })
}

getEventsList = () => {
  return Event.distinct("_id", {})
    .then(events => {
      const urls = events.map(event => { 
        return {url:`/events/${event}`, changeFreq: 'monthly', lastMod: new Date('2020-01-01')}
      })
      return urls;
    })
}

getRootList = () => {
  let urls = []; 
  urls.push({url:'/studios', changeFreq: 'monthly', lastMod: new Date('2020-01-01')})
  urls.push({url:'/events', changeFreq: 'monthly', lastMod: new Date('2020-01-01')})
  return urls;
}




module.exports = router;