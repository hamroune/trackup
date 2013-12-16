var factories = angular.module('lucetteFactories', [
	'restangular',
	'ngCookies']);


factories.factory('UserService', function (Restangular, $cookies, $q) {

  var cache = {};
  var userDataCache = {};

  //Init Cache for speedUp
  var cookies = $cookies['x-lucette-user'];
  
  if(cookies){
	Restangular.one('user').get().then(function(currentUser){
   		cache[cookies] = currentUser;
		Restangular.one('userdata').get().then(function(userdata){
	   		//If no user Data
    			if(!userdata){
    				userdata = {};
    			}
    		    
    		    userDataCache[cookies] = userdata;
	  	});
  	});
  }

  return {
    getUser: function(){
    	var deferred = $q.defer();

    	var cookies = $cookies['x-lucette-user'];
    	
    	if(!cache[cookies]){
    		Restangular.one('user').get().then(function(currentUser){
    			if(currentUser){
    				currentUser.show = (currentUser._id != '' && currentUser._id !== undefined);	        
		    		cache[cookies] = currentUser;
		    		deferred.resolve(currentUser);
    			}else{
    				deferred.reject({});
    			}
	    	});
    	}else{
    		deferred.resolve(cache[cookies]);
    	}
    	
    	return deferred.promise;
    },

    getUserData: function(){
    	var deferred = $q.defer();

    	var cookies = $cookies['x-lucette-user'];
    	
    	if(!userDataCache[cookies]){
    		Restangular.one('userdata').get().then(function(userdata){
    			//If no user Data
    			if(!userdata){
    				userdata = {};
    			}
    		    
    		    userDataCache[cookies] = userdata;
	    		deferred.resolve(userdata);
	    	});
    	}else{
    		deferred.resolve(userDataCache[cookies]);
    	}
    	
    	return deferred.promise;
    },

    saveUserData: function(ud){
    	ud.post();
    },

    isAuthenticated: function(){
    	var cookies = $cookies['x-lucette-user'];
       
    	if(cookies){
    		return true;
    	}
    	return false;
    }

    
  };
});


factories.factory('DefaultOptionsService', function (Restangular, $cookies, $q) {

  return {

    getDefaultOptions: function(){
        var deferred = $q.defer();

         Restangular.all('defaultoptions').getList().then(function(data){
             deferred.resolve(data);
        });

        return deferred.promise;
    }
  }

});
