
var fs = require('fs')
var db = require('./db');
var Sugar = require('sugar');
var appPath = __dirname;

var bcrypt = require('bcrypt');


//Load Models
var models_path = appPath + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
    console.log('models_path', models_path+'/'+file);
});

//Define UserDataModel;
var UserModel = db.model('UserModel');
var UserDataModel = db.model('UserDataModel');

module.exports.getUserData = function(req, res, next){
    var currentUser = req.user;

    //console.log('currentUser', currentUser);

    if(currentUser && currentUser._id){
        var q =
            UserDataModel
                .find({
                    userId: currentUser._id
                })
                .sort({created_at: -1})
                .limit(1)

        q.exec(function(err, docs){
            if(docs.length>0){
                req.body = docs[0];
            }else{
                var ud = {};
                req.body =ud;
            }
            next();
        });

    }else{
        var ud = {};
        req.body =ud;
        next();
    }
}

module.exports.saveUserData = function(req, res){
    var ud = req.body;

    delete ud._id;

    var today = Date.create().format('{yyyy}-{MM}-{dd}');


    ud.created_at = today;
    ud.userId = req.user._id;

    //Save userdata
    UserDataModel.findOne({
        created_at: today,
        userId: ud.userId
    }, function(err, found){
        if(!found){
            UserDataModel.create(ud);
        }else{
            //ud._id = found._id;

            var toUpdate = new UserDataModel(ud);
            UserDataModel.update({
                "_id": found._id
            }, ud, function(err, data){
            
            });
        }
        res.end(JSON.stringify(ud));
    })

}

module.exports.createUser = function(req, res, next){


    var data = req.body;

    var cle = data.email || data.name;
    data.key = bcrypt.hashSync(cle, 12);

    var salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    var User = new UserModel(data);

    UserModel.findOne({'email': data.email}, function(e, currentUser){
            console.log('currentUser', currentUser);
            
            if(currentUser){
                req.user = currentUser;
                next();
            }else{
                User.save(function(err,user) {
                        if (err) throw "cannot get user from DB";
                        console.log('saved a user', user, 'input user', data);
                        req.user = user;
                        next();
                });
            }
    })
}

module.exports.authenticate = function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;


    UserModel.findOne({'email': email}, function(e, currentUser){
        if(!currentUser){
            req.isAuthenticated = false;
        }else{
            var passwordHash = currentUser.password;
            req.isAuthenticated = bcrypt.compareSync(password,passwordHash);
            req.user = currentUser;
        }
        next();
    });

}