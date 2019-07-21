/*Сервер завелся после удаления nginx*/
const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');

//const hostname = '127.0.0.1';
//const hostname = 'localhost';
const port = 80;
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))



/*const server = http.createServer((req, res) => {
  console.log('income');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});*/

app.get('/', function (req, res) {
   res.send('Hello World');
})

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

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
*/
