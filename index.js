/*Сервер завелся после удаления nginx*/
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const fs = require('fs');

//const hostname = '127.0.0.1';
//const hostname = 'localhost';
//win32 is development
const isWin = process.platform === 'win32';
const portHTTP = 80;
const portHTTPS = 443;

app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))


/*Certificate
/etc/letsencrypt/live/example.com/privkey.pem
/etc/letsencrypt/live/example.com/chain.pem
/etc/letsencrypt/live/example.com/fullchain.pem
/etc/letsencrypt/live/example.com/cert.pem
*/



app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

app.use((req, res, next) => {
    //res.send('dancemap here');
    if(req.secure) {
      // OK, continue
      return next();
   };
   // handle port numbers if you need non defaults
   // res.redirect('https://' + req.host + req.url); // express 3.x
   res.redirect('https://' + req.hostname + req.url); // express 4.x
})

app.get('/', function (req, res) {
   //res.send('dancemap here');
   res.sendFile('static/index.html', {root: __dirname })
})


// Starting both http & https servers
const httpServer = http.createServer(app);
httpServer.listen(portHTTP, () => {
  console.log('HTTP Server running on port 80');
});


if(!isWin) {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/dancemap.online/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/dancemap.online/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/dancemap.online/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  const httpsServer = https.createServer(credentials, app);


  httpsServer.listen(portHTTPS, () => {
    console.log('HTTPS Server running on port 443');
  });
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
*/
