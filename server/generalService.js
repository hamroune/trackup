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


var ConceptsSchema = new mongoose.Schema({}, { strict: false });
var ConceptsModel = mongoose.model('concepts', ConceptsSchema);

var LucetteSchema = new mongoose.Schema({}, { strict: false });
var LucetteModel = mongoose.model('lucette', LucetteSchema);



exports.getConcepts = function(req, res, next){

    ConceptsModel.find({}, function(err, data){
        req.body = data || [];
        next();
    });
}



exports.getLucette = function(req, res, next){

    LucetteModel.find({}, function(err, data){
        req.body = data[0];
        next();
    });
}