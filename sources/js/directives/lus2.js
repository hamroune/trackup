
easy = angular.module('lus2module', []);


easy.directive('lus2', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        compile: function (tElm, tAttrs) {
            return function(scope, element, attrs, ngModel) {
                var that = this;
                //Update
                $(element).select2({ width: '100%'});
            }
        }
    };

}]);


easy.directive('lucondition', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',

        compile: function (tElm, tAttrs) {
            return function(scope, element, attrs, ngModel) {

                attrs.$observe('lucondition', function() {
                        var expression = attrs['lucondition'].toLowerCase();
                        var evaluated = scope.$eval( expression );
                    
                        if(expression !== 'true'){
                            
                            if(evaluated){
                                element.show();
                            }else{
                                element.hide();
                            }
                            scope.$watch(expression, function(newval, oldval) {
                                if(newval){
                                    element.show();
                                }else{
                                    element.hide();
                                }
                            });        
                        }
                });
            }
        }

    };

}]);
