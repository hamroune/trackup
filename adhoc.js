var mongoose = require('mongoose');
var color = require('bash-color');
var redis = require('redis');
var urlParser = require('url');
var _ = require('underscore');
var fs = require('fs');
var Sugar = require('sugar');


var db = require('./server/db');


var appPath = __dirname+'/server';


//Load Models
var models_path = appPath + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
    console.log('models_path', models_path+'/'+file);
});


//Define UserDataModel;

var UserDataModel = db.model('UserDataModel');

var q = UserDataModel.find({
        //userId: userId
        //created_at: {$gte: ("2013-09-15T00:00:00Z")}
    })
    .sort({created_at: -1})
    .limit(1)

q.exec(function(err, docs){
    console.log('docs', docs);
});