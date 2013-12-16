
easy = angular.module('easypiechart', []);


easy.directive('easypie', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        require: 'ngModel',

        compile: function (tElm, tAttrs) {
            return function(scope, element, attrs, ngModel) {

                var that = this;
                //Update
                ngModel.$render = function(){
                    $(element).easyPieChart({
                        barColor: function(value){
                            return attrs.piecolor;
                        },
                        trackColor: '#ccc',
                        scaleColor:	"#f75",
                        easing:'easeOutBounce',
                        size: 80,
                        animate: 1000,
                        lineWidth: 4
                    }).data('easyPieChart').update(Math.abs(ngModel.$viewValue));
                }

                //Observe the ng-model changes
                scope.$watch(attrs.ngModel, function(){
                    ngModel.$render();
                }, true);

            }
        }

    };

}]);

