var express = require('express');
var appPath = "./server";
http = require('http')
path = require('path')
fs = require('fs')
bcrypt = require('bcrypt');
//Auth
everyauth = require('everyauth');
conf = require('./server/conf');

console.log('conf', conf)
var hour = 3600000;
var twoweeks = 14 * 24 * hour;


//var app = express.createapp();
// express.createapp()  is deprecated. 
var app = express(); // better instead
var mainPath = __dirname +"/sources";

var express = require('express');
var app = express();

app
.use(express.static(mainPath)) // Indique que le dossier /public contient des fichiers statiques

.use(function(req, res){ // Répond enfin
    res.send('Hello');
});

var port = process.env.PORT || 3000;

console.log('Server ready @', port);
app.listen(port);


