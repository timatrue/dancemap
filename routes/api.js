const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Event = require('../models/event');
const path = require('path')
const { buildSitemaps } = require('express-sitemap-xml')
const fs = require('fs')


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

router.get('/editor', function(req, res) {
  Studio.find({}).then(function(studio) { 
    console.log('GET /mongo',studio);
      
      res.sendFile('/editor.html', {root: __dirname })
      //res.send(studio);
  });

    Studio.countDocuments({}).then(function(err, count) {
      console.log('GET', count);
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