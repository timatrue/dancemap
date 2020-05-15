//win32 is development
const isWin = process.platform === 'win32'
//Server
const http = require('http')
const https = require('https')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const bodyParser = require("body-parser")
const fs = require('fs')

/**/
const Telegraf = require('telegraf')
const bot = new Telegraf("1054222010:AAFXOJVR2jgqF-ddaM7gEWuPhwP0EtEeOws")
bot.command('server_ping', (ctx) => ctx.reply('Hello'))
bot.launch()
//Mongo cloud
//const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dancemap:Yy4UqOE9bihpePZc@cluster0-kkgwk.gcp.mongodb.net/dancemap?retryWrites=true&w=majority";
const uri2 = "mongodb+srv://dancemap:Yy4UqOE9bihpePZc@cluster0-kkgwk.gcp.mongodb.net/sample_geospatial?retryWrites=true&w=majority";


const Studio = require('./models/studio')
const Event = require('./models/event')
const studioTemplate = require('./models/studioTemplate')
const eventTemplate = require('./models/eventTemplate')
const Supercluster = require('supercluster')
const clusterdata = require('./supercluster/clusterdata')


const mongoose = require('mongoose')
//Ports
const portHTTP = 8080
const portHTTPS = 8443
const port = isWin ? portHTTP : portHTTPS

app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/static/favicon.ico'))
app.use(express.json({ extended: false }));
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
app.use('/api', require('./routes/api'))
app.use('/studios', require('./routes/studios'))
app.use('/events', require('./routes/events'))

//Mongoose connect
;(async () => {
  const connector = mongoose.connect(uri);
})();


app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ));

app.get('/', function (req, res) {
    //res.send('dancemap here');
    //res.sendFile('static/index.html', {root: __dirname })
    res.render('../static/views/index',{page:'main', marker: null, markerEncoded: null});
    //console.log('get /');
})

app.get('/studios', function (req, res) {
    //res.send('dancemap here');
    //res.sendFile('static/index.html', {root: __dirname })
    res.render('../static/views/studios',{page:'studios', marker: null, markerEncoded: null});
    //console.log('get /');
})

app.get('/events', function (req, res) {
   //res.send('dancemap here');
   console.log('get /events');
   res.render('../static/views/events',{page:'events', marker: null, markerEncoded: null});
})

app.get('/add', function (req, res) {
   //res.send('dancemap here');
   console.log('get /add');
   res.sendFile('static/add.html', {root: __dirname })
})

const server = isWin ? http.createServer(app) : https.createServer(getCrendetialsSSL(), app);
server.listen(port, () => {
  console.log('HTTPS Server running on port ' + port);
});


let cluster;
clusterdata.getData().then(data => cluster = data );

//let index = {};
//clusterdata.getData()
/*memory usage debug
index.all1 = new Supercluster({radius: 40,maxZoom: 17});
index.all2 = new Supercluster({radius: 40,maxZoom: 17});
index.all3 = new Supercluster({radius: 40,maxZoom: 17});
index.all4 = new Supercluster({radius: 40,maxZoom: 17});
index.all5 = new Supercluster({radius: 40,maxZoom: 17});
index.all6 = new Supercluster({radius: 40,maxZoom: 17});
index.all7 = new Supercluster({radius: 40,maxZoom: 17});
index.all8 = new Supercluster({radius: 40,maxZoom: 17});
index.all9 = new Supercluster({radius: 40,maxZoom: 17});
index.all10 = new Supercluster({radius: 40,maxZoom: 17});*/

/*
index.all = new Supercluster({
  radius: 40,
  maxZoom: 17
});

index.hustle = new Supercluster({
  radius: 40,
  maxZoom: 17
});

index.zouk = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.wcs = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.bachata = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.salsa = new Supercluster({
    radius: 40,
    maxZoom: 17
});
*/

/*getData().catch(error => console.log('getData',error.stack));

async function getData() {

  await Studio.find({}).then(function(studios) { 
    index.all.load(studios);*/
    
    /*memory usage debug
    index.all1.load(studios);
    index.all2.load(studios);
    index.all3.load(studios);
    index.all4.load(studios);
    index.all5.load(studios);
    index.all6.load(studios);
    index.all7.load(studios);
    index.all9.load(studios);
    index.all9.load(studios);
    index.all10.load(studios);*/

/*
    console.log('index_all', index.all);
  });
  await Studio.find({'properties.classes.hustle': true}).then(function(studios) { 
    index.hustle.load(studios);
    console.log('index_hustle', index.hustle);
  });
  await Studio.find({'properties.classes.zouk': true}).then(function(studios) { 
    index.zouk.load(studios);
    console.log('index_zouk', index.zouk);
  });
  await Studio.find({'properties.classes.wcs': true}).then(function(studios) { 
    index.wcs.load(studios);
    console.log('index_wcs', index.wcs);
  });
  await Studio.find({'properties.classes.bachata': true}).then(function(studios) { 
    index.bachata.load(studios);
    console.log('index_bachata', index.bachata);
  });

  await Studio.find({'properties.classes.salsa': true}).then(function(studios) { 
    index.salsa.load(studios);
    console.log('index_salsa', index.salsa);
  });
}*/

/*SOCKET*/
const io = require('socket.io')(server);
io.on('connection', function(socket) {

  socket.emit('server_ping', { server: 'ping' });

  socket.on('get_studio', function (msg) {
    
    console.log ('get_studio', msg);
    
    Studio.find({}).then(function(studios) { 
	  console.log('studio_list', studios);
      socket.emit('studio_list', studios);
	});
  });


  socket.on('set_all_documents', function (secret) {

    if(isObject(secret) && secret) {
      if(secret.secret === 'Covid19!') {
        /*firstly you have to define new property in studio.js */
        Studio.updateMany({}, {$set: { 'properties.country': "Россия"}} ).then(function(result) {
	      console.log('set_all_documents', result);
	    });
	    Event.updateMany({}, {$set: { 'properties.country': "Россия"}} ).then(function(result) {
	      console.log('set_all_documents', result);
	    });
      }
    }
  
  });
  socket.on('get_supercluster', function () {

    socket.emit('get_supercluster', cluster);
  });

  socket.on('post_studio', function (msg) {

  	let studio = studioTemplate.getStudioTemplate();
    
    studio.geometry.coordinates.push(msg.lon);
    studio.geometry.coordinates.push(msg.lat);
    
    studio.properties.type = msg.recordType;
    studio.properties.name = msg.name;
    studio.properties.address = msg.address;
    studio.properties.city = msg.city;
    studio.properties.vk = msg.vk;
    studio.properties.altername = msg.altername;
    if(msg.courses) studio.properties.classes = msg.courses;

    if(msg.img64) {
    	/*console.log(studio.properties)
    	studio.properties.seoimage.data = new Buffer(msg.img64.split(",")[1],"base64"),
    	studio.properties.seoimage.contentType = 'image/png'*/
    }
    
    studio.properties.speciality = msg.speciality.split(',');
    
    //studio["type"] = "Feature";
    
    Studio.create(studio).then(function(result) {
    	reload();
		console.log('post_studio', result);
	})
  });
  
  socket.on('post_event', function (msg) {

  	let event = eventTemplate.getEventTemplate();
    
    event.geometry.coordinates.push(msg.lon);
    event.geometry.coordinates.push(msg.lat);
    
    //event.properties.type = 'event';

    event.properties.type = msg.recordType;
    event.properties.name = msg.name;
    event.properties.address = msg.address;
    event.properties.city = msg.city;
    event.properties.country = msg.country;
    event.properties.vk = msg.vk;
    event.properties.altername = msg.altername;
    event.properties.start = msg.start;
    event.properties.end = msg.end;
    event.properties.offers = msg.offers;
    //event.properties.start = new Date(new Date(msg.start).setHours(18)).toISOString();
    //event.properties.end = new Date(new Date(msg.end).setHours(18)).toISOString();

    if(msg.courses) event.properties.classes = msg.courses;
    if(msg.activities) event.properties.activities = msg.activities;

    if(msg.img64) {
    	/*console.log(event.properties)
    	event.properties.seoimage.data = new Buffer(msg.img64.split(",")[1],"base64"),
    	event.properties.seoimage.contentType = 'image/png'*/
    }
    
    event.properties.speciality = msg.speciality.split(',');
    
    //event["type"] = "Feature";
    
    Event.create(event).then(function(result) {
    	reload();
		console.log('post_event', result);
	})
  });



  socket.on('get_clusters', (box) => {
    let index;
    const category = box.category;
    if(box.type === 'event') index = cluster.events;
    if(box.type === 'studio') index = cluster.studios;
     
    console.log('get_clusters', box);


      if (box.getClusterExpansionZoom) {
        try {
          let data = {
            expansionZoom: index[category].getClusterExpansionZoom(box.getClusterExpansionZoom),
            center: box.center
          };
          console.log('get_zoomed_clusters', data);
          socket.emit('get_clusters', data);
        } catch (e) {
          console.error(e, 'socket.on_get_clusters if (box.getClusterExpansionZoom)');
        }

      } else {
        // ([westLng, southLat, eastLng, northLat])
        // index.all.getClusters(box.bounds, box.zoom);
	    // console.log('get_clusters_index', index.all);

	    /*check if user sent correct property from front*/
	    try {
          if(index.hasOwnProperty(category)) {
            socket.emit('get_clusters', index[category].getClusters(box.bounds, box.zoom));
          }
        } catch (e) {
          console.error(e, 'socket.on_get_clusters  if(index.hasOwnProperty(category)');
        }
      }


  });

  socket.on('find_marker', (query) => {
  	
    let category = query.category === 'all' ? null : 'properties.classes.' + query.category;
    let uiType = query.uiType;
    let eventType = query.eventType;
    let ModelDB;
    if(uiType === 'event') ModelDB = Event;
    if(uiType === 'studio') ModelDB = Studio;
    
    if(!query.queryType) {
      console.log('findMarker all', query, category)
      if(category) {
        Studio.find({ "properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }, [category] : "true"})
          .then((res) => socket.emit('find_marker', res))
      } else {
        Studio.find({ "properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }})
          .then((res) => socket.emit('find_marker', res))
      }
    }

    /*NEAR START*/
    if(query.queryType === "near") {
      console.log('findMarker $near', query, category)
      if(category) {
      	
        Studio.find({ 
        	"properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') },
        	[category] : "true",
        	"geometry" : {
            "$near": {
              "$geometry": {
                 "type": "Point" ,
                 "coordinates": [query.center.lng, query.center.lat]
               },
              "$maxDistance": query.radius,
               //"$minDistance": <distance in meters>
            }} 

        })
        .then((res) => socket.emit('find_marker', res))
      } else {
        Studio.find({
          "properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') },
          "geometry" : {
          "$near": {
            "$geometry": {
               "type": "Point" ,
               "coordinates": [query.center.lng, query.center.lat]
             },
            "$maxDistance": query.radius,
             //"$minDistance": <distance in meters>
          }} 
        })
        .then((res) => socket.emit('find_marker', res))
      }
    }
    /*NEAR END*/

    /*GEOWITHIN START*/
    if(query.queryType === "geoWithin") {
      console.log('findMarker $geoWithin', query, category)

      if(uiType === 'studio') {
      	console.log('findMarker $geoWithin STUDIO')
      	if(category) {
          ModelDB.find({
        	$or: [ {"properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }},
            {"properties.altername" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }}],
        	[category] : "true",
        	"geometry" : {
              "$geoWithin": {
                "$box": query.box
              }
            }
          })
          .then((res) => {
           console.log('FIND STUDIO CATEGORY', res)
          	socket.emit('get_clusters', res)
          })
        
        } else {
          ModelDB.find({
            $or: [{"properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }},
            {"properties.altername" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }}],
            "geometry" : {
              "$geoWithin": {
                "$box": query.box
              }
            } 
          })
          .then((res) => {
          	console.log('FIND STUDIO', res)
          	socket.emit('get_clusters', res)
          })
        }
      }

      if(uiType === 'event') {
      	console.log('findMarker $geoWithin EVENT')
        if (query.date && !category) {
      	  let gte = new Date().toISOString();
          ModelDB.find({
            $or: [{"properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }},
            {"properties.altername" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }}],
            "geometry" : {
              "$geoWithin": {
                "$box": query.box
              }
            },
            "properties.start": {"$gte": gte, "$lte": query.date}
          })
          .then((res) => {
            console.log('FIND BY DATE RANGE all', res)
        	socket.emit('get_clusters', res)
          })
        }
        if (query.date  && category) {
      	  let gte = new Date().toISOString();
          ModelDB.find({
            $or: [{"properties.name" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }},
            {"properties.altername" : { $regex: new RegExp('.*' + query.studio + '.*', 'i') }}],
            "geometry" : {
              "$geoWithin": {
                "$box": query.box
              }
            },
            [category] : "true",
            "properties.start": {"$gte": gte, "$lte": query.date}
          })
          .then((res) => {
            console.log('FIND BY DATE RANGE CATEGORY', res)
        	socket.emit('get_clusters', res)
          })
        }
      }
    }
    /*GEOWITHIN END*/    
  });

  /*Utility socket functions*/
  socket.on('get_children', (clusterId) => {
    let index = cluster.studios;
  	let children = index.all.getChildren(clusterId);
  	socket.emit('get_children', children);
  });

  socket.on('get_leaves', (clusterId) => {
    let index = cluster.studios;
    let leaves = index.all.getLeaves(clusterId, limit = 10, offset = 0);
    socket.emit('get_leaves', leaves);
  });

  socket.on('reload', (secret) => {
    if(isObject(secret) && secret) {
      if(secret.secret === 'Covid19!') {
        reload();
        socket.emit('reload', {reload: true});
      }
    }
    
  });

  socket.on('get_memory_usage', function () {
    getMemoryUsage();
  });
  console.log('a user connected');
});

function reload() {
  clusterdata.getData()
    .then(data => cluster = data )
    .catch(error => console.log('getData error', error.stack));

}

function isObject(val) {
    return (typeof val === 'object');
}

function isUndefined(val) {
    return (typeof x === "undefined");
}

function getCrendetialsSSL() {
  
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/dancemap.online/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/dancemap.online/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/dancemap.online/chain.pem', 'utf8');
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  return credentials;
}

function getMemoryUsage() {
  const used = process.memoryUsage();
    for (let key in used) {
	console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

  /*
	Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/dancemap.online/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/dancemap.online/privkey.pem
   Your cert will expire on 2019-10-19. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
  */


//https://stackoverflow.com/questions/23281895/node-js-eacces-error-when-listening-on-http-80-port-permission-denied
//https://serverfault.com/questions/288729/once-i-set-iptables-to-reroute-a-port-how-do-i-undo-it
/*
http://84.201.159.199/
sudo iptables -t nat -D PREROUTING -i eth0 -p tcp --dport 22 -j REDIRECT --to-port 3000
iptables -t nat -D PREROUTING -p tcp --dport 22 -j REDIRECT --to 3000
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to 3000

sudo iptables -S

sudo iptables -L -n -t nat

https://stackoverflow.com/questions/49237886/nodejs-app-wont-create-server-says-err-connection-timed-out
https://gist.github.com/tomasevich/a2fe588c451c5a192893e6521a813020
https://stackoverflow.com/questions/5009324/node-js-nginx-what-now

https://serverfault.com/questions/665709/allowing-node-js-applications-to-run-on-port-80/840035
https://www.digitalocean.com/community/questions/how-can-i-get-node-js-to-listen-on-port-80

FOREVER
https://stackoverflow.com/questions/12701259/how-to-make-a-node-js-application-run-permanently/12710118
https://flaviocopes.com/express-letsencrypt-ssl/
forever logs index.js -f

*/
