var trackupApp = angular.module('trackupApp', [
    'restangular', 
    'ui.slider', 
    'easypiechart', 
    'lus2module', 
    'luimageboxmodule',
    'luvalidationmodule',
    'luteintmodule',
    'ngCookies',
    'lucetteFactories',
    'ngSanitize']);

trackupApp.config(['$routeProvider', 'RestangularProvider', '$locationProvider',
    function($routeProvider, RestangularProvider, $locationProvider ) {

        $locationProvider.html5Mode(false);
        RestangularProvider.setBaseUrl('/api');

        $routeProvider.
            when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
                            }).
          

            otherwise({
                redirectTo: '/'
                            });


    }]);


trackupApp
    .controller('HomeCtrl', function ($scope, Restangular, $routeParams, $timeout, UserService) {
        
        $('.slide').hide();
        window.setTimeout(function(){

                    $('.slider').fractionSlider({
                        'responsive'            : true,
                        'dimensions'            : "3000,1000",
                        'slideTransitionSpeed'  : 800,
                        'delay'                 : 0
                    });

                    $('.slide').show();
        }, 100);
        /**/
  
});