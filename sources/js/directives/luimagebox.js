imageboxeasy = angular.module('luimageboxmodule', []);

imageboxeasy.directive('luimagebox', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/imageboxtpl.html",
        compile: function (tElm, tAttrs) {
            return function(scope, element, attrs, ngModel) {
               
               scope.onSelectedImage = function(option){
                    _.each(scope.field.options, function(op){
                        op.isSelected = false;
                    });

                    //Mark As Selected
                    option.isSelected = true;

                    //console.log('clicked !!!', option)
                    //Update the model
                    ngModel.$setViewValue(option.value);
               }


                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);

                 ngModel.$render = function(){
                    if(ngModel.$modelValue){

                        var foundOption = _.find(scope.field.options, function(op){
                            return op.value == ngModel.$modelValue
                        })
                        if(foundOption){
                            foundOption.isSelected = true;
                        }
                    }
                }
            }
        }

    };

}]);


imageboxeasy.directive('luimageboxmultiple', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/imageboxtpl.html",
        compile: function (tElm, tAttrs) {
            return function(scope, element, attrs, ngModel) {
               
               scope.onSelectedImage = function(option){

                    //Mark As Selected
                    option.isSelected = !option.isSelected;


                    var options = _.filter(scope.field.options, function(op){
                        return op.isSelected == true;
                    });


                    //console.log('clicked !!!', option)
                    //Update the model
                    ngModel.$setViewValue(options);
               }
            }
        }

    };

}]);