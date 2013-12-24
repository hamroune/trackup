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


            when('/dashboard', {
                templateUrl: 'partials/dashboard.html',
                controller: 'MainCtrl'
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


trackupApp
    .controller('MainCtrl', function ($scope, Restangular, $routeParams, $timeout, UserService) {



        d3.csv("users.csv", function (data) {
            /* since its a csv file we need to format the data a bit */
            var dateFormat = d3.time.format("%m/%d/%Y");
            var numberFormat = d3.format(".2f");

            var keys  = [];

             data.forEach(function (d, index) {
                if(index < 10){
                    var ks = _.keys(d);
                    _.each(ks, function(k){
                           keys.push(k);
                    });
                }
            });           

            keys = _.uniq(keys);
             
            data.forEach(function (d) {
                d[keys[1]] = +d[keys[1]];
                d[keys[2]] = +d[keys[2]];
            });

            var dashboard = {
                chartType:"pie",
                chartContainer:"#users-action1-chart",
                options:{
                    width: 680,
                    height: 280,
                    radius: 80,
                    innerRadius: 30
                },
                mainDimension: keys[0],
                groupDimension: keys[1],
                init: function(ndx){
                    var userDimension = ndx.dimension(function (d, index) {
                        var user =  d[dashboard.mainDimension];
                        return user;
                    });

                    var userDimensionActionOneGroup = userDimension
                        .group()
                        .reduceSum(function (d) {
                            return d[dashboard.groupDimension];
                    });

                    dashboard.render(userDimension, userDimensionActionOneGroup);
                },
                render: function(dimension, groupDimension){

                    console.log('userDimension.all().length',dimension);
                    window.dim = dimension;
                    chart = dc.barChart(dashboard.chartContainer);
  /*                  chart
                        .width(dashboard.options.width)
                        .height(dashboard.options.height)
                        .radius(dashboard.options.radius)
                        .innerRadius(dashboard.options.innerRadius)
                        .dimension(dimension)
                        .group(groupDimension);
*/
                    chart
                        .width(680)
                        .height(280)
                        .margins({top: 50, left: 50, right: 10, bottom: 20})
                        .group(groupDimension,  dashboard.mainDimension+' By '+dashboard.groupDimension)
                        .dimension(dimension)
                        .x(d3.scale.ordinal())
                        // assign colors to each value in the x scale domain
                        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
                        .xUnits(dc.units.ordinal)
                          .brushOn(false)
                          .legend(dc.legend().x(680-150).y(10))
                          .barPadding(0.1)
                          .outerPadding(0.05)
                          .renderHorizontalGridLines(true)
                          .centerBar(false)
                          
                    dc.renderAll();
                }
            }

            var ndx = crossfilter(data);
            dashboard.init(ndx);
          

            window.setTimeout(function() {
                 $scope.keys = keys;
                 console.log("scope keys", keys);
                 $('#selection').select2();                   
            }, 100);
                
            window.setTimeout(function() {
                    var nodes = [dashboard.mainDimension, dashboard.groupDimension];
                    console.log("nodes", nodes);
                    $('#selection').val(nodes).select2();
            },1000);

            $('#selection').on('change', function(){
                if($('#selection').val().length == 2){
                    var nodes = $('#selection').val();
                    dashboard.mainDimension = nodes[0];
                    dashboard.groupDimension = nodes[1];
                    dashboard.init(ndx);

                }
            })
  
    });

});
