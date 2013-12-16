var http = require('http')
var path = require('path')
var fs = require('fs')
var bcrypt = require('bcrypt');
//Auth
var everyauth = require('everyauth');
var conf = require('./conf');
var db = require('./db');
var appPath = __dirname;


var hour = 3600000;
var twoweeks = 14 * 24 * hour;


var auth = function(app, express){

    var RedisStore = require('connect-redis')(express);

    // if you like to see what is going on, set this to true
    everyauth.debug = true;

    var models_path = appPath + '/models';
    fs.readdirSync(models_path).forEach(function (file) {
        require(models_path+'/'+file);
        console.log('models_path', models_path+'/'+file);
    });

    var UserModel = db.model('UserModel');


    everyauth.facebook
        .entryPath('/auth/facebook')
        .appId(conf.fb.appId)
        .appSecret(conf.fb.appSecret)
        .scope('email,user_location,user_photos,publish_actions')
        .handleAuthCallbackError( function (req, res) {
            res.send('Error occured');
        })
        .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {

            var promise = this.Promise();
            UserModel.findOne({facebook_id: fbUserMetadata.id},function(err, user) {
                
                var cle = fbUserMetadata.email || fbUserMetadata.name;
                var hash = bcrypt.hashSync(cle, 12);
               
                if (err) return promise.fulfill([err]);

                if(user) {
                    // user found, life is good
                    promise.fulfill(user);
                } else {
                    // create new user
                    var User = new UserModel({
                        name: fbUserMetadata.name,
                        firstname: fbUserMetadata.first_name,
                        lastname: fbUserMetadata.last_name,
                        email: fbUserMetadata.email,
                        username: fbUserMetadata.username,
                        gender: fbUserMetadata.gender,
                        facebook_id: fbUserMetadata.id,
                        facebook: fbUserMetadata,
                        key:  hash
                    });

                    User.save(function(err,user) {
                        if (err) return promise.fulfill([err]);
                        promise.fulfill(user);
                    });

                }});
            return promise;
        })
        .sendResponse(function(res, data) {

            var date = new Date(Date.now() + twoweeks);
            
            if(data.user){
                res.cookie('x-lucette-user', data.user.key, 
                { expires: date , signed: true });
            }

            // --> Your custom logic here
            this._super();
        })
        .redirectPath('/#/wizard');


    //Configuration
    var redis =  db.getRedis();
    var store = new RedisStore({client: redis});
    everyauth.everymodule.findUserById( function (req, userId, callback) {
        UserModel.findOne({"_id": userId}, function(e,currentUser){
            if(currentUser){
                req.res.cookie('x-lucette-user', currentUser.key, {signed: true});
            }
            callback(e, currentUser);
        })
    });



    var secret = conf.cookie.secret;
    app.use(express.cookieParser(secret));
    app.use(express.session({
        secret: 'p!550ff',
        store: store,
        cookie: { 
            expires: new Date(Date.now() + twoweeks), 
            maxAge: twoweeks
          }
    }));
    app.use(everyauth.middleware(app));

}


module.exports = auth;



