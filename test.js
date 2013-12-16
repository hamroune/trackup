var mongoose = require('mongoose');
var color = require('bash-color');
var redis = require('redis');
var urlParser = require('url');
var _ = require('underscore');
var conf = require('./server/conf');

var url =  conf.neoUrl;
var neo4j = require('node-neo4j');
var n4j = require('neo4j');
var db = new neo4j(url);
var db1 = new n4j.GraphDatabase(url);
var request = require('request');

var conseilService = require('./server/conseilsService')


var script = "root = g.addVertex([name:'root']);"+
"a = g.addVertex([name:'A']);"+
"b = g.addVertex([name:'B']);"+
"c = g.addVertex([name:'C']);"+
"d = g.addVertex([name:'D']);"+
"g.addEdge(root,a,'conseil',[cid:1, length:1]);"+
"g.addEdge(root,b,'conseil',[cid:2, length:1]);"+
"g.addEdge(root,b,'conseil',[cid:3, length:1]);"+

"g.addEdge(root,b,'conseil',[cid:1, length:2]);"+
"g.addEdge(b,d,'conseil',[cid:1, length:2]);"+

"g.addEdge(root,a,'conseil',[cid:4, length:3]);"+
"g.addEdge(a,d,'conseil',[cid:4, length:3]);"+
"g.addEdge(d,b,'conseil',[cid:4, length:3]);"

var script = "g.v(21).as('x').outE.inV.loop('x'){it.loops < 4}{true}.path{it.name}{it.length}.filter{ ((it.size()+1)/2)-1 == it[1]}.dedup"



REXSTER = require('./server/rexster');

/*
REXSTER.createNode({name:"complexe", persons:[{nom: "zahir"}]}, function(err, node){
   console.log('node created', node); 
});
*/

/*
REXSTER.readNodesByKey('name', 'root', function(err, nodes){
   console.log('get nodes :', nodes); 
});
*/

/*
REXSTER.removeNode(34, function(err, node){
   console.log('removeVertex nodes :', node); 
});
*/
/*
REXSTER.readNode(7, function(err, node){
   console.log('created ==>', node); 
});
*/


REXSTER.createNode({name:"root"}, function(err, node){
   
    console.log('node created', node); 
    
    REXSTER.readNodesByKey('name', "root", function(err, nodes){
       console.log('A nodes :', nodes); 
    });

});
/**/

/*
REXSTER.addRelation(35,36,'conseil', {conseilId:12284511, length:1}, function(err, nodes){
    console.log('created relation :', nodes); 
});
*/

/*
REXSTER.readRelation(37,function(err, nodes){
    console.log('relation 35 :', nodes); 
});
*/

/*
REXSTER.readRelationsByKey("conseilId", "12284511",function(err, nodes){
    console.log('relations by key :', nodes); 
});

REXSTER.removeRelation(37,function(err, nodes){
    console.log('Deleted relation :', nodes); 
});
*/

/*
REXSTER.getConseils("['tonicite:plutot_detendue','menopause:oui']", function(err, conseils){
	console.log('conseils', conseils);
});
*/












