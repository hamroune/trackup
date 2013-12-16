var request = require('request');

var host = "http://54.209.112.166:8182";
var ROOT_ID = 4;

var REXSTER = {
    createNode: function(data, callback){

        var text = JSON.stringify(data)
        var regex = new RegExp('{', 'g');
        var regex1 = new RegExp('}', 'g');
        text = text.replace(regex, '[');
        text = text.replace(regex1, ']');

        var script = "g.addVertex("+text+")";
        console.log('script', script);
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);

            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results[0]);
                }else{
                    callback(null);
                }
            }
        });       
    }

    ,readNode: function(id, callback){

        var script = "g.v("+id+")";
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);

            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results[0]);
                }else{
                    callback(null);
                }
            }            
        });

    }

    ,readNodesByKey: function(key, value, callback){

        var script = "g.V('"+key+"','"+value+"')";
        
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);
            
            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results);
                }else{
                    callback(null);
                }
            }            
        });
    }

   ,removeNode: function(id, callback){

        var script = "g.removeVertex(g.v("+id+"))";
        
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);
            
            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results);
                }else{
                    callback(null);
                }
            }            
        });
    }

    ,createRelation: function(startId, endId, relationName, relationData, callback){
        var text = JSON.stringify(relationData);
        var regex = new RegExp('{', 'g');
        var regex1 = new RegExp('}', 'g');
        text = text.replace(regex, '[');
        text = text.replace(regex1, ']');

        var script = "g.addEdge(g.v("+startId+"), g.v("+endId+"), '"+relationName+"', "+text+")";
        console.log('script', script);
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);

            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results[0]);
                }else{
                    callback(null);
                }
            }
        });
    }

    , readRelation: function(id, callback){
        var script = "g.e("+id+")";
        console.log('script', script);
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);

            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results[0]);
                }else{
                    callback(null);
                }
            }
        });
    }

    ,readRelationsByKey: function(key, value, callback){
        var script = "g.E('"+key+"', "+value+")";
        console.log('script', script);
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);

            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results);
                }else{
                    callback(null);
                }
            }
        });
    }


    ,removeRelation: function(id, callback){

        var script = "g.removeEdge(g.e("+id+"))";
        
        var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

        request.get(url, function(e, res){
            var data = JSON.parse(res.body);
            
            if(callback){
                if(data.results && data.results.length>0){
                    callback(null, data.results);
                }else{
                    callback(null);
                }
            }            
        });
    }
    ,getConseils: function(filter, callback){
       var script = "g.v("+ROOT_ID+").as('x').outE.inV.dedup .loop('x') { it.loops < 50 &&  (it.object.name in "+filter+" )} {true}  .filter{ it.name in "+filter+" }.path.dedup";

       //console.log('script', script);

       var url = host+"/graphs/lucette/tp/gremlin?script="+encodeURIComponent(script);

       request.get(url, function(e, res){
        if(e) callback(null);

        try{
            var data = JSON.parse(res.body);
        }catch (e){

        }
            
        if(callback){
                if(data.results && data.results.length>0){

                    var pathz = _.filter(data.results, function(path){
                         var conseilsOfPath = _.filter(path, function(p, index){
                            return index %2 == 1
                         });

                         var mappedConseils =_.map(conseilsOfPath, function(c){
                            return {'conseilId':c.conseilId, 'length': c.length};
                         });

                         var cs = _.map(mappedConseils, function(c){
                            return c.conseilId;
                         });

                         //the conseilId should be unique
                         return _.uniq(cs).length == 1

                    });

                    var conseils = _.map(pathz, function(p){
                        return p[1]
                    });

                    callback(null, _.uniq(conseils, function(c){return c.conseilId}));
                }else{
                    callback(null);
                }
            }            
        });
    }
}

module.exports = REXSTER;