var mongoose = require('./db');
// forms Schema
var FormSchema = new mongoose.Schema({
    name : { type : String },
    fields : [mongoose.Schema.Types.Mixed]
}, { strict: false });


// Create a model for forms
var FormsModel = mongoose.model('forms', FormSchema);



exports.getForms = function (req, res, next) {
    var query = FormsModel.find(null);
    query.limit(100);

    query.exec(function (err, forms) {
        req.forms = forms;
        next();
    });


};

exports.addForm = function (req, res, next) {
    var form = req.body;

    FormsModel.findOne({"name": form.name}, function(e,r){

        if(r!=null){
            //Remove the ID
            var id = form._id;
            delete form._id;
            FormsModel.update({"_id": id}, form,function(error){
                next();
            });

        }else{
            var theForm = new FormsModel(form);
            theForm.save(function(){
                next();
            })
        }
    });

};

exports.removeForm = function (req, res, next) {
    var id = req.params.id;
    var query = FormsModel.remove({ "_id": id });
    query.exec(function(){
        next();
    });

};