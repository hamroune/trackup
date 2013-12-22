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

var db = require('./server/db');
var auth = require('./server/auth');
var authuser = require('./server/authuser');

var UserService = require('./server/userService');
var ConseilsService = require('./server/conseilsService');
var FormsService = require('./server/formsService.js');
var OptionsService = require('./server/optionsService.js');
var ThematiqueSerive = require('./server/thematiqueService.js');
var GeneralService = require('./server/generalService.js');


//var app = express.createapp();
// express.createapp()  is deprecated. 
var app = express(); // better instead
var mainPath = __dirname +"/sources";

var express = require('express');
var app = express();


/*
 app.use(express.bodyParser());
 app.use(express.methodOverride());
 app.use(express.static(mainPath));
 */


app.configure('development', function(){
    //app.use(express.errorHandler());
});

//Configuration
app.configure(function(){
    app.use(express.favicon());
   // app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(authuser.middleware);
    app.use(express.static(mainPath));
});



//RUNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN

//Serve CSS
app.get('/css/*', function(req, res){
    console.log('Req.url', req.url);
    app.render(mainPath+req.url);
});


//Serve JS
app.get('/js/*', function(req, res){
    console.log('JS file Req.url', req.url);
    app.render(mainPath+req.url);
});


//Serve IMG
app.get('/img/*', function(req, res){
    console.log('IMG file Req.url', req.url);
    app.render(mainPath+req.url);
});


//RESTful
app.get('/api/form', FormsService.getForms, function(req, res){
    var forms = req.forms;
    if(!forms){
        forms = [];
    }

    // callback has the signature, function (err, user) {...}
    res.end(JSON.stringify(forms));

});


app.post('/api/form',FormsService.addForm, function(req, res){
    var form = req.body;
    res.end(JSON.stringify(form));
});


app.delete('/api/form/:id',FormsService.removeForm, function(req, res){
    console.log('after Remove Form')
    var id = req.params.id;
    res.end("removed");
});

app.get('/api/user', function(req, res){
    var currentUser = req.user;
    res.end(JSON.stringify(currentUser));
});


app.get('/api/conseils',UserService.getUserData, ConseilsService.getConseils, function(req, res){
    res.end(JSON.stringify(req.body));
});

app.get('/api/conseil/:id', ConseilsService.getConseilById, function(req, res){
    res.end(JSON.stringify(req.body));
});


app.get('/api/userdata', UserService.getUserData, function(req, res){
    res.end(JSON.stringify(req.body));
})

app.post('/api/userdata', UserService.saveUserData)

app.get('/api/defaultoptions',OptionsService.getDefaultOptions, function(req, res, next){
    res.end(JSON.stringify(req.body));
})

app.get('/api/thematiques', ThematiqueSerive.getThematiques, function(req, res, next){
   res.end(JSON.stringify(req.body));
})

app.get('/api/concepts', GeneralService.getConcepts, function(req, res){
   res.end(JSON.stringify(req.body));
})

app.get('/api/lucette', GeneralService.getLucette, function(req, res){
   res.end(JSON.stringify(req.body));
});


app.post('/api/compte', UserService.createUser ,  function(req, res){

    if(req.user){
        res.cookie('x-lucette-user',req.user.key,{ expires: new Date(Date.now() + twoweeks)});
    }

    //res.redirectPath('/#/wizard');
    res.end();
})


app.post('/api/auth/login' ,UserService.authenticate,  function(req, res){

    if(req.user && req.isAuthenticated){
        res.cookie('x-lucette-user',req.user.key,{ expires: new Date(Date.now() + twoweeks)});
        res.end();
    }else{
        res.statusCode = 401;
        res.end();
    }

    
});


//CAll Auth Service
auth(app, express);

var port = process.env.PORT || 3000;

console.log('Server ready @', port);
app.listen(port);


