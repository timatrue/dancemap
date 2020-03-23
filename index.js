//win32 is development
const isWin = process.platform === 'win32';
//Server
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');

/**/
const Telegraf = require('telegraf')
const bot = new Telegraf("1054222010:AAFXOJVR2jgqF-ddaM7gEWuPhwP0EtEeOws")
bot.command('server_ping', (ctx) => ctx.reply('Hello'))
bot.launch()
//Mongo cloud
//const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dancemap:Yy4UqOE9bihpePZc@cluster0-kkgwk.gcp.mongodb.net/dancemap?retryWrites=true&w=majority";
const Studio = require('./models/studio');
const studioTemplate = require('./models/studioTemplate');
const Supercluster = require('supercluster');

const mongoose = require('mongoose');
//Ports
const portHTTP = 8080;
const portHTTPS = 8443;
const port = isWin ? portHTTP : portHTTPS;


app.use(express.json({ extended: false }));
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
app.use('/api', require('./routes/api'));

//Mongo connect
/*const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

//Mongoose connect
;(async () => {
  const connector = mongoose.connect(uri);
})();



app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ));
app.get('/', function (req, res) {
   //res.send('dancemap here');
   console.log('get /');
   res.sendFile('static/index.html', {root: __dirname })
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

let index = {};
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

index.bachata = new Supercluster({
    radius: 40,
    maxZoom: 17
});

getData().catch(error => console.log('getData',error.stack));

async function getData() {

  await Studio.find({}).then(function(studios) { 
    index.all.load(studios);
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
  await Studio.find({'properties.classes.bachata': true}).then(function(studios) { 
    index.bachata.load(studios);
    console.log('index_bachata', index.bachata);
  });
}



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


  socket.on('set_all_documents', function (msg) {
    
    console.log ('set_all_documents', msg);
    //let path = msg.path;
    let value = '';

/*    const agg = [
  {
    '$addFields': {
      'properties.vk': ''
    }
  }
];*/
    /*firstly you have to define new property in studio.js */
    Studio.updateMany({}, {$set: { 'properties.speciality': ["Хастл"] }} ).then(function(result) {
		console.log('set_all_documents', result);
	});
  
  });


  socket.on('post_studio', function (msg) {

  	let studio = studioTemplate.getStudioTemplate();
    
    studio.geometry.coordinates.push(msg.lon);
    studio.geometry.coordinates.push(msg.lat);
    
    studio.properties.name = msg.name;
    studio.properties.address = msg.address;
    studio.properties.city = msg.city;
    studio.properties.vk = msg.vk;
    if(msg.zouk) studio.properties.classes.zouk = true;
    if(msg.hustle) studio.properties.classes.hustle = true;
    if(msg.bachata) studio.properties.classes.bachata = true;
    if(msg.salsa) studio.properties.classes.salsa = true;
    if(msg.wcs) studio.properties.classes.wcs = true;
    studio.properties.speciality = msg.speciality.split(',');
    
    studio["type"] = "Feature";
    
    Studio.create(studio).then(function(result) {
    	reload();
		console.log('post_studio', result);
	})
  });

  socket.on('get_clusters', (box) => {

    console.log('get_clusters', box);
    const type = box.class;

    

      if (box.getClusterExpansionZoom) {
        try {
          let data = {
            expansionZoom: index[type].getClusterExpansionZoom(box.getClusterExpansionZoom),
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
          if(index.hasOwnProperty(type)) {
            socket.emit('get_clusters', index[type].getClusters(box.bounds, box.zoom));
          }
        } catch (e) {
          console.error(e, 'socket.on_get_clusters  if(index.hasOwnProperty(type)');
        }
      }


  });

  
  /*Utility socket functions*/
  socket.on('get_children', (clusterId) => {

  	let children = index.all.getChildren(clusterId);
  	socket.emit('get_children', children);
  });

  socket.on('get_leaves', (clusterId) => {
    
    let leaves = index.all.getLeaves(clusterId, limit = 10, offset = 0);
    socket.emit('get_leaves', leaves);
  });

  socket.on('reload', (secret) => {
    if(isObject(secret) && secret) {
      if(secret.secret === 'covid19') {
        reload();
        socket.emit('reload', {reload: true});
      }
    }
    
  });

  console.log('a user connected');
});

function reload() {
  getData().catch(error => console.log('getData', error.stack));
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
