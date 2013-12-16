
var mongoose = require('mongoose');
var conf = require('./conf');
var url = conf.mongoUrl;//"mongodb://lucette:lucette@hanso.mongohq.com:10024/app18820246";


// Thematiques Schema
var ThematiqueSchema = new mongoose.Schema({
    name : { type : String },
    label: {type: String}
}, { strict: false });


// Create a model for Thematiques
var ThematiquesModel = mongoose.model('thematiques', ThematiqueSchema);


mongoose.connect(url, function(err){

});

exports.saveThematique = function(req, res, next){
	var Thematique = req.body;

    if(Thematique._id){
            ThematiquesModel.findOne({"_id": Thematique._id}, function(e,r){

                if(e ==null){
                    //Remove the ID
                    var id = Thematique._id;
                    delete Thematique._id;

                    ThematiquesModel.update({'_id': id}, Thematique, function(error, data){
                        req.body = data;
                        next();
                    });

                }
            });

    }else{
            var theThematique = new ThematiquesModel(Thematique);
            theThematique.save(function(){
                req.body = theThematique;
                next();
            })

    }

}

exports.getThematiques = function(req, res, next){

    var query = ThematiquesModel.find({});
    query.exec(function(err, data){
        req.body = data;
        next();
    });
}

exports.removeThematique = function(req, res, next){

    var id = req.params.id;

    ThematiquesModel.remove({'_id':id}, function(err, data){
        req.body = data;
        next();
    })

}