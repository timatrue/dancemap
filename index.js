//win32 is development
const isWin = process.platform === 'win32';
//Server
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
//Mongo cloud
//const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dancemap:Yy4UqOE9bihpePZc@cluster0-kkgwk.gcp.mongodb.net/dancemap?retryWrites=true&w=majority";


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
  const connnector = mongoose.connect(uri);
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


/*SOCKET*/
const io = require('socket.io')(server);
io.on('connection', function(socket) {

  socket.emit('server_ping', { server: 'ping' });

  console.log('a user connected');
});

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
