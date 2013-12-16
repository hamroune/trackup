
var mongoose = require('mongoose');
var color = require('bash-color');
var redis = require('redis');
var urlParser = require('url');
var _ = require('underscore');
var conf = require('./conf');


var url = conf.mongoUrl;//"mongodb://lucette:lucette@hanso.mongohq.com:10024/app18820246";
var redisurl = "redis://pub-redis-19071.us-east-1-1.1.ec2.garantiadata.com:19071";

var redis = require('redis');

var redisURL = urlParser.parse(redisurl);

var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  	client.auth("BGVfxrmztbm0IrFw");


client.on("error", function(err) {
    console.log(color.red('Cannot init Cache :') + err);
});

client.on("connect", function() {
    console.log('Redis Connection Initialized...', color.green('Success'));
});

mongoose.getRedis = function(){
    return  client;
}


mongoose.connect(url, function(err){

})



module.exports = mongoose;