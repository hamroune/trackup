
_= require('underscore');

var conf = {
    fb: {
        appId: '530681640356142'
      , appSecret: '7f6439ad7c7bd52b58c3832435635824'
    },
    
    cookie:{
        secret: "lucette"
    },

    mongoUrl: "mongodb://lucette:lucette@hanso.mongohq.com:10024/app18820246",
    neoUrl: "http://54.209.112.166:7474" //"http://05a85057c:aae89a008@4dbd4423d.hosted.neo4j.org:7480"
  
};


var conf_dev ={
     fb: {
        appId: '392151987554134'
      , appSecret: 'a1120e138a35d4f6483b383603cec6e1'
    }
}

var conf_prod ={
     fb: {
        appId: '671498222883850'
      , appSecret: 'c1a11375e44007b66c2d4d6f97136583'
    },
}


var getConf = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            _.extend(conf, conf_dev);
            return conf;
           

        case 'production':
           _.extend(conf, conf_prod);
            return conf;
        default:
            return conf;
    }
}


module.exports = getConf();