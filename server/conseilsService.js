var mongoose = require('mongoose');
var color = require('bash-color');
var redis = require('redis');
var urlParser = require('url');
var _ = require('underscore');
var Vow = require('vow');
var Async = require('async');
var esprima = require('esprima');
var conf = require('./conf');
var FUNCTIONS = require('./functions');
var REXSTER = require('./rexster');
var ConseilSchema = new mongoose.Schema({
    name : { type : String },
    text : { type : String },
    link : { type : String },
    source : { type : String },
    sousthematique : { type : String },
    thematique : { type : String },
    category : { type : String },
    rules : [mongoose.Schema.Types.Mixed]
}, { strict: false });


// Create a model for forms
var ConseilModel = mongoose.model('conseils', ConseilSchema);


var url = conf.neoUrl;
var neo4j = require('node-neo4j');
var n4j = require('neo4j');
var db = new neo4j(url);
var db1 = new n4j.GraphDatabase(url);

var ROOT = 1;

var RELATION_TYPE = "CONSEIL";



// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
    var key, child;

    if (visitor.call(null, object) === false) {
        return;
    }
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}


accentsTidy = function(s){
            var r=s;
            try{
                r = r.replace(new RegExp(/\s/g),"_");
                r = r.replace(new RegExp(/[àáâãäå]/g),"a");
                r = r.replace(new RegExp(/æ/g),"ae");
                r = r.replace(new RegExp(/ç/g),"c");
                r = r.replace(new RegExp(/[èéêë]/g),"e");
                r = r.replace(new RegExp(/[ìíîï]/g),"i");
                r = r.replace(new RegExp(/ñ/g),"n");                
                r = r.replace(new RegExp(/[òóôõö]/g),"o");
                r = r.replace(new RegExp(/œ/g),"oe");
                r = r.replace(new RegExp(/[ùúûü]/g),"u");
                r = r.replace(new RegExp(/[ýÿ]/g),"y");
                r = r.replace(new RegExp(/\W/g),"");
                
            }catch (e){

            }finally{
                return r;    
            }
            
        };


exports.getConseils = function(req, res, next){
    var ud = req.body;


    var nodes = ['root'];


    var userData = ud.toJSON();

    delete userData._id;
    delete userData.__v;
    delete userData.userId;
    delete userData.created_at;

    _.each(userData, function(val, key){
        var k = accentsTidy(key);
        var v = accentsTidy(val);

        if(_.isArray(val)){
            _.each(val, function(op){
                nodes.push(k+':'+accentsTidy(op.value));
            })
        }else{
            nodes.push(k+":"+v);    
        }            
    })

   var lucette = nodes;//

    var filter = "[";
    _.each(lucette, function(name, index){

        var isLast = (index == lucette.length-1);

        var suffix = (isLast)? "']" : "',";

        //console.log('name ==>', name);

        filter += ("'"+name+ suffix );

    });

    //console.log('filter', filter);

    REXSTER.getConseils(filter,function(err, conseils){

        //console.log('conseils', conseils);

        if(err) throw err;

        var promises = _.map(conseils, function(c){
            var regex = new RegExp('z', 'g');
            var id = c.conseilId.replace(regex, '0');            
            return getConseilById(id);
        });

        Vow.all(promises).done(function(conseils){

            Async.filter(conseils, 
                function(conseil, callback){
                    var isOk = true;

                    if(conseil){

                    _.each(conseil.rules, function(rule){
                        var filters = rule.filters;
                        _.each(filters, function(f){
                            var filter = f.value;
                            var syntax = esprima.parse(filter, { tolerant: true, loc: true });
                            traverse(syntax, function (node) {
                                var left = node.left;
                                if(left){
                    
                                    var currentValue = userData[left.name];

                  
                                    //Special case with FN
                                    if(left.type === "CallExpression"){
                                        var functionName = left.callee.name;
                                        var argument = left.arguments[0].name;
                                        var value = userData[argument];
                                        currentValue =  FUNCTIONS[functionName](value);
                                    }
                                    


                                    var right = node.right.value;
                  
                                    if(node.operator == "=="){

                                        isOk = isOk && (currentValue === right)
                                    }

                                    if(node.operator == "<="){

                                        isOk = isOk && (currentValue <= right)
                                    }



                                    if(node.operator == ">="){

                                        isOk = isOk && (currentValue >= right)
                                    }


                                    if(node.operator == ">"){

                                        isOk = isOk && (currentValue > right)
                                    }


                                    if(node.operator == "<"){

                                        isOk = isOk && (currentValue < right)
                                    }

                                }


                            });
                        });

                    });   
                    }
        
                  
                    if(isOk && conseil){
                        callback(conseil);
                    }else{
                        callback(null);
                    }
                }
                ,function(data){
                    req.body = data;
                    next();
            })
        });

    });
}

var getConseilById = function(conseilId){
    var mainpromise = Vow.promise();

    ConseilModel.findById(conseilId, function(err, data){
        mainpromise.fulfill(data);
    });

    return mainpromise;    
}

exports.getConseilById = function(req, res, next){
    getConseilById(req.params.id).done(function(conseil){
        req.body = conseil;
        next();

    })
}