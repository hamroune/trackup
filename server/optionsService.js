/**
 * Created with IntelliJ IDEA.
 * User: hamroune
 * Date: 11/27/13
 * Time: 1:57 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var color = require('bash-color');
var redis = require('redis');
var urlParser = require('url');
var _ = require('underscore');
var Vow = require('vow');


var DefaultOpionsSchema = new mongoose.Schema({

}, { strict: false });


// Create a model for forms
var OptionsModel = mongoose.model('defaultoptions', DefaultOpionsSchema);

exports.getDefaultOptions = function(req, res, next){

    OptionsModel.find({}, function(err, data){
        req.body = data[0];
        next();
    })

}
