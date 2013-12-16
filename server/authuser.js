var http = require('http')
var path = require('path')
var fs = require('fs')
var bcrypt = require('bcrypt');
//Auth
var everyauth = require('everyauth');
var conf = require('./conf');
var db = require('./db');
var utils = require("express/node_modules/connect/lib/utils");
cookie = require('cookie');
var appPath = __dirname;

var models_path = appPath + '/models';
fs.readdirSync(models_path).forEach(function (file) {
        require(models_path+'/'+file);
        console.log('models_path', models_path+'/'+file);
    });
    
var UserModel = db.model('UserModel');



module.exports.middleware = function(req, res, next){
    if (req.cookies) return next();
    var cookies = req.headers.cookie;
    var secret = conf.cookie.secret;

    if(cookies){
		var parsed = cookie.parse(cookies, {});
		req.signedCookies = utils.parseSignedCookies(parsed, secret) || parsed;
		var userKey = req.signedCookies['x-lucette-user'] || parsed['x-lucette-user'];

		UserModel.findOne({'key': userKey}, function(e, currentUser){
            if(currentUser){
                var json = currentUser.toJSON();
                delete json.password;
                delete json.key;
                var withoutpwd =  json;
                currentUser = new UserModel(withoutpwd);
            }

			req.user = currentUser;
			next();
		})

    }else{
    	next();
    }
    
}

