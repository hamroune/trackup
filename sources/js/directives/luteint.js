teinteasy = angular.module('luteintmodule', []);

teinteasy.directive('luteint', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/teinttpl.html",
        compile: function (tElm, tAttrs) {
            var palette = [
                "#E4DBD4",
                "#DFD6CD",
                "#E6D7D0",
                "#E4D4C8",
                "#E7D5C7",
                "#E3D2C7",
                "#E6D4C6",
                "#E7D2C3",
                "#EBD5C6",
                "#E9CFBA",
                "#EACFBD",
                "#EACBB6",
                "#EED0BA",
                "#EFCEBB",
                "#F0CCB4",
                "#EFCBB5",
                "#F0C9B2",
                "#F1C8AF",
                "#F3C7A4",
                "#F1B993"
            ]


            var values = [
                {value: 'teint_terne', label: 'Teint terne'},
                {value: 'teint_plutoto_terne', label: 'Teint plutôt terne'},
                {value: 'teint_plutoto_terne', label: 'Teint plutôt terne'},
                {value: 'teint_plutot_lumineux', label: 'Teint plutôt lumineux'},
                {value: 'teint_lumineux', label: 'Teint lumineux'}
            ]
            return function(scope, element, attrs, ngModel) {
                scope.opacityImage = 0;

                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);

                ngModel.$render = function(){
                    if(ngModel.$modelValue){
                        var foundIndex;
                        var found = _.find(values, function(vl, vlIndex){

                            var fnd = (vl.value === ngModel.$modelValue);
                            foundIndex = vlIndex;
                            return fnd;
                        });


                        if(found){
                            scope.imageIndex = foundIndex*20;
                            scope.positionImage = foundIndex;
                            scope.valueImage = foundIndex;
                            scope.value = foundIndex;
                            scope.teintLabel = found.label;
                        }
                    }
                }
                scope.$watch('imageIndex', function(newval, oldval){
                    scope.opacityImage = 1;//Math.abs(Math.cos(newval));
                    scope.positionImage = Math.floor(parseInt(scope.imageIndex)/5);
                    scope.valueImage = Math.floor(parseInt(scope.imageIndex)/20);

                    var val = values[0].value;
                    var label = values[0].label;

                    if(scope.valueImage){
                        label =  (values[scope.valueImage])? values[scope.valueImage].label : label;
                        val =  (values[scope.valueImage])? values[scope.valueImage].value : val;
                    }

                    scope.teintLabel = label;
                    ngModel.$setViewValue(val);

                    $('#sliderteint .ui-widget-header').css('background', palette[scope.positionImage])
                    $('#sliderteint .ui-state-default,#sliderteint .ui-widget-content .ui-state-default,#sliderteint .ui-widget-header .ui-state-default').css('background', palette[scope.positionImage])
                })
            }
        }

    };

}]);

teinteasy.directive('lucouleurteinthiver', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/couleurteinthivertpl.html",
        compile: function (tElm, tAttrs) {
            var palette = [
                "#F0DEDE",
                "#DCBAB1",
                "#E5B091",
                '#EABA89',
                "#AE684A",
                "#582D1D"
            ]


            var values = [
                {value: 'blanc_tres_pale', label: 'Blanc très pale'},
                {value: 'blanc', label: 'Blanc'},
                {value: 'jaune', label: 'Jaune'},
                {value: 'mat', label: 'Mat'},
                {value: 'fonce', label: 'foncé'},
                {value: 'noir', label: 'Noir'},
            ]
            return function(scope, element, attrs, ngModel) {
                scope.opacityImage = 0;

                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){
                    console.log('ngModel', ngModel.$modelValue);

                    if(ngModel.$modelValue){
                        var foundIndex;
                        var found = _.find(values, function(vl, vlIndex){

                            var fnd = (vl.value === ngModel.$modelValue);
                            foundIndex = vlIndex;
                            return fnd;
                        });


                        if(found){
                            scope.imageIndex = foundIndex*20;
                            scope.positionImage = foundIndex;
                            scope.valueImage = foundIndex;
                            scope.value = foundIndex;
                            scope.teintLabel = found.label;
                        }
                    }
                }

                scope.$watch('imageIndex', function(newval, oldval){
                    scope.opacityImage = 1;//Math.abs(Math.cos(newval));
                    scope.positionImage = Math.floor(parseInt(scope.imageIndex)/20);
                    scope.valueImage = scope.positionImage;//Math.floor(parseInt(scope.imageIndex)/6);

                    var val = values[0].value;
                    var label = values[0].label;

                    if(scope.valueImage){
                        label =  (values[scope.valueImage])? values[scope.valueImage].label : label;
                        val =  (values[scope.valueImage])? values[scope.valueImage].value : val;
                    }

                    scope.teintLabel = label;
                    ngModel.$setViewValue(val);

                    $('#slidercouleurteinthiver .ui-widget-header').css('background', palette[scope.valueImage])
                    $('#slidercouleurteinthiver .ui-state-default,#slidercouleurteinthiver .ui-widget-content .ui-state-default,#slidercouleurteinthiver .ui-widget-header .ui-state-default')
                        .css('background', palette[scope.valueImage])
                })
            }
        }

    };

}]);


teinteasy.directive('lutypepeau', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/lutypepeautpl.html",
        compile: function (tElm, tAttrs) {

            var values = [
                {value: 'peau_grasse', label: 'Peau grasse'},
                {value: 'peau_grasse', label: 'Peau grasse'},
                {value: 'peau_grasse', label: 'Peau grasse'},
                {value: 'peau_mixte', label: 'Peau mixte'},
                {value: 'peau_mixte', label: 'Peau mixte'},
                {value: 'peau_mixte', label: 'Peau mixte'},
                {value: 'peau_plutot_seche', label: 'Peau plutôt sèche'},
                {value: 'peau_plutot_seche', label: 'Peau plutôt sèche'},
                {value: 'peau_plutot_seche', label: 'Peau plutôt sèche'},
                {value: 'peau_seche', label: 'Peau sèche'},
                {value: 'peau_seche', label: 'Peau sèche'},

            ]
            return function(scope, element, attrs, ngModel) {
                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){
                    console.log('ngModel', ngModel.$modelValue);

                    if(ngModel.$modelValue){
                        var foundIndex;
                        var found = _.find(values, function(vl, vlIndex){

                            var fnd = (vl.value === ngModel.$modelValue);
                            foundIndex = vlIndex;
                            return fnd;
                        });


                        if(found){
                            scope.imageIndex = foundIndex*10;
                            scope.positionImage = foundIndex;
                            scope.valueImage = foundIndex;
                            scope.value = foundIndex;
                            scope.teintLabel = found.label;
                        }
                    }
                }

                scope.$watch('imageIndex', function(newval, oldval){
                    scope.opacityImage = 1;//Math.abs(Math.cos(newval));
                    scope.positionImage = Math.floor(parseInt(scope.imageIndex)/10);
                    scope.valueImage = scope.positionImage;//Math.floor(parseInt(scope.imageIndex)/6);

                    var val = values[0].value;
                    var label = values[0].label;

                    if(scope.valueImage){
                        label =  (values[scope.valueImage])? values[scope.valueImage].label : label;
                        val =  (values[scope.valueImage])? values[scope.valueImage].value : val;
                    }

                    scope.teintLabel = label;
                    ngModel.$setViewValue(val);

                })
            }
        }

    };

}]);


teinteasy.directive('lubrillancepeau', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/lubrillancepeautpl.html",
        compile: function (tElm, tAttrs) {


            var values = [
                {value: 'peau_brillante', label: 'Peau brillante'},
                {value: 'peau_brillante', label: 'Peau brillante'},
                {value: 'peau_brillante', label: 'Peau brillante'},
                {value: 'peau_plutot_brillante', label: 'Peau plutôt brillante'},
                {value: 'peau_plutot_brillante', label: 'Peau plutôt brillante'},
                {value: 'peau_plutot_brillante', label: 'Peau plutôt brillante'},
                {value: 'peau_plutot_mate', label: 'Peau plutôt mate'},
                {value: 'peau_plutot_mate', label: 'Peau plutôt mate'},
                {value: 'peau_plutot_mate', label: 'Peau plutôt mate'},
                {value: 'peau_mate', label: 'Peau mate'},
                {value: 'peau_mate', label: 'Peau mate'},

            ]
            return function(scope, element, attrs, ngModel) {
                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){
                    console.log('ngModel', ngModel.$modelValue);

                    if(ngModel.$modelValue){
                        var foundIndex;
                        var found = _.find(values, function(vl, vlIndex){

                            var fnd = (vl.value === ngModel.$modelValue);
                            foundIndex = vlIndex;
                            return fnd;
                        });


                        if(found){
                            scope.imageIndex = foundIndex*10;
                            scope.positionImage = foundIndex;
                            scope.valueImage = foundIndex;
                            scope.value = foundIndex;
                            scope.teintLabel = found.label;
                        }
                    }
                }
                scope.$watch('imageIndex', function(newval, oldval){
                    scope.opacityImage = 1;//Math.abs(Math.cos(newval));
                    scope.positionImage = Math.floor(parseInt(scope.imageIndex)/10);
                    scope.valueImage = scope.positionImage;//Math.floor(parseInt(scope.imageIndex)/6);

                    var val = values[0].value;
                    var label = values[0].label;

                    if(scope.valueImage){
                        label =  (values[scope.valueImage])? values[scope.valueImage].label : label;
                        val =  (values[scope.valueImage])? values[scope.valueImage].value : val;
                    }

                    scope.teintLabel = label;
                    ngModel.$setViewValue(val);

                })
            }
        }

    };

}]);


teinteasy.directive('lucouleuryeux', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/lucouleuryeuxtpl.html",
        compile: function (tElm, tAttrs) {

            var values = [
                {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_vert', label: 'vert'},
                {value: 'yeux_vert', label: 'vert'},
                {value: 'yeux_vert', label: 'vert'},
                {value: 'yeux_vert', label: 'vert'},
                {value: 'yeux_noisette', label: 'noisette'},
                {value: 'yeux_noisette', label: 'noisette'},
                {value: 'yeux_noisette', label: 'noisette'},
                {value: 'yeux_noir', label: 'noir'},
                {value: 'yeux_noir', label: 'noir'},
                {value: 'yeux_noir', label: 'noir'}, ]

            return function(scope, element, attrs, ngModel) {


                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){
                    console.log('ngModel', ngModel.$modelValue);

                    if(ngModel.$modelValue){
                        var foundIndex;
                        var found = _.find(values, function(vl, vlIndex){

                            var fnd = (vl.value === ngModel.$modelValue);
                            foundIndex = vlIndex;
                            return fnd;
                        });


                        if(found){
                            scope.imageIndex = foundIndex*10;
                            scope.positionImage = foundIndex;
                            scope.valueImage = foundIndex;
                            scope.value = foundIndex;
                            scope.teintLabel = found.label;
                        }
                    }
                }

                scope.$watch('imageIndex', function(newval, oldval){
                    scope.opacityImage = 1;//Math.abs(Math.cos(newval));
                    scope.positionImage = Math.floor(parseInt(scope.imageIndex)/10);
                    scope.valueImage = scope.positionImage;//Math.floor(parseInt(scope.imageIndex)/6);

                    var val = values[0].value;
                    var label = values[0].label;

                    if(scope.valueImage){
                        label =  (values[scope.valueImage])? values[scope.valueImage].label : label;
                        val =  (values[scope.valueImage])? values[scope.valueImage].value : val;
                    }

                    scope.teintLabel = label;
                    ngModel.$setViewValue(val);
                })

            }
        }

    };

}]);


teinteasy.directive('lucouleurcheveux', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/lucouleurcheveuxtpl.html",
        compile: function (tElm, tAttrs) {


            var values = [
                {value: 'cheveux_gris', label: 'Gris'},
                {value: 'cheveux_gris', label: 'Gris'},
                {value: 'cheveux_gris', label: 'Gris'},
                {value: 'cheveux_gris', label: 'Gris'},
                {value: 'cheveux_gris', label: 'Gris'},

                {value: 'cheveux_blond', label: 'Blonds'},
                {value: 'cheveux_blond', label: 'Blonds'},
                {value: 'cheveux_blond', label: 'Blonds'},

                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_roux', label: 'Roux'},

                {value: 'cheveux_brun', label: 'Bruns'},
                {value: 'cheveux_brun', label: 'Bruns'},
                {value: 'cheveux_brun', label: 'Bruns'},
                {value: 'cheveux_brun', label: 'Bruns'},
                {value: 'cheveux_brun', label: 'Bruns'},
                {value: 'cheveux_brun', label: 'Bruns'},

                {value: 'cheveux_noir', label: 'noir'},
                {value: 'cheveux_noir', label: 'noir'},
                {value: 'cheveux_noir', label: 'noir'},
                {value: 'cheveux_noir', label: 'noir'},
                {value: 'cheveux_noir', label: 'noir'},
                {value: 'cheveux_noir', label: 'noir'},

            ]
            return function(scope, element, attrs, ngModel) {
                scope.opacityImage = 0;

                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){

                    if(ngModel.$modelValue){
                        var foundIndex;
                        var found = _.find(values, function(vl, vlIndex){

                            var fnd = (vl.value === ngModel.$modelValue);
                            foundIndex = vlIndex;
                            return fnd;
                        });


                        if(found){
                            scope.imageIndex = foundIndex*10;
                            scope.positionImage = foundIndex;
                            scope.valueImage = foundIndex;
                            scope.value = foundIndex;
                            scope.teintLabel = found.label;
                        }
                    }
                }

                scope.$watch('imageIndex', function(newval, oldval){
                    scope.opacityImage = 1;//Math.abs(Math.cos(newval));
                    scope.positionImage = Math.floor(parseInt(scope.imageIndex)/10);
                    scope.valueImage = scope.positionImage;//Math.floor(parseInt(scope.imageIndex)/6);

                    var val = values[0].value;
                    var label = values[0].label;

                    if(scope.valueImage){
                        label =  (values[scope.valueImage])? values[scope.valueImage].label : label;
                        val =  (values[scope.valueImage])? values[scope.valueImage].value : val;
                    }

                    scope.teintLabel = label;
                    ngModel.$setViewValue(val);
                })
            }
        }

    };

}]);


teinteasy.directive('lupointsrougesvisage', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        compile: function (tElm, tAttrs) {

            var canDraw =  false;
            var canBegin =  false;
            var points = [];

            var x0=25,
                x1=58,
                x2=103,
                x3=141;
            var y0=22,
                y1=80,
                y2=113,
                y3=161;


            return function(scope, element, attrs, ngModel) {


                 scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);

                ngModel.$render = function(){

                    if(ngModel.$modelValue){
           
                        window.setTimeout(function(){

                            var pointsGroup = d3.selectAll('#points');
                          
                            pointsGroup.selectAll('ellipse').remove();

                           _.each(ngModel.$modelValue, function(point){
                                
                                var x = point.x;
                                var y = point.y;
                                pointsGroup.append('ellipse')
                                            .attr('cx', x)
                                            .attr('cy', y)
                                            .attr('rx', 5)
                                            .attr('ry', 3)
                                            .style('fill', "#f75");

                               });
                        }, 100)
                        
                    }
                }



                window.setTimeout(function(){

                    $('#delete-'+attrs.id).on('click', function(){
                        scope.points = [];
                        points.length = 0;
                        ngModel.$setViewValue([])

                        d3.select('#points').selectAll('ellipse').remove();
                    })


                    var SVG = d3.select("#"+attrs.id).append('svg')
                        .attr('width', 186)
                        .attr('height', 186)


                    var img =SVG.append('svg:image')
                        .attr('xlink:href', 'img/tete.png')
                        .attr('width', 186)
                        .attr('height', 186);

                    var pointsGroup = SVG.append('g')
                        .attr('id', 'points');



                    SVG
                        .on('click', function(d, i){
                            if(true){

                                x = d3.mouse(this)[0];
                                y = d3.mouse(this)[1];

                                pointsGroup.append('ellipse')
                                    .attr('cx', x)
                                    .attr('cy', y)
                                    .attr('rx', 5)
                                    .attr('ry', 3)
                                    .style('fill', "#f75");

                                if(points === undefined || points.length == 0){
                                    points = [];
                                }


                                var partie = "";

                                if(x>x0 && x<x1){

                                    if(y>y0 && y<y1){
                                        partie = "front_gauche";
                                    }

                                    if(y>y1 && y<y2){
                                        partie = "joue_gauche";
                                    }

                                    if(y>y2 && y<y3){
                                        partie = "menton_gauche";
                                    }
                                }

                                if(x>x1 && x<x2){

                                    if(y>y0 && y<y1){
                                        partie = "front";
                                    }

                                    if(y>y1 && y<y2){
                                        partie = "nez";
                                    }

                                    if(y>y2 && y<y3){
                                        partie = "menton";
                                    }
                                }

                                if(x>x2 && x<x3){

                                    if(y>y0 && y<y1){
                                        partie = "front_droite";
                                    }

                                    if(y>y1 && y<y2){
                                        partie = "joue_droite";
                                    }

                                    if(y>y2 && y<y3){
                                        partie = "menton_droite";
                                    }
                                }

                                if(partie){
                                    points.push({
                                        value: partie,
                                        x:x,
                                        y:y
                                    });
                                }

                                var uniquePoints = _.uniq(points, function(p){return p.value});

                                _.each(uniquePoints, function(p){
                                    ngModel.$modelValue.push(p);
                                })

                                //ngModel.$setViewValue(scope.points)
                            }

                        })


                }, 10)
                // create svg drawing paper
            }
        }

    };

}]);


teinteasy.directive('lumarques', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        //templateUrl: "/partials/elements/templates/lumarquestpl.html",
        compile: function (tElm, tAttrs) {
            var values = [];

            return function(scope, element, attrs, ngModel) {

                $(element).select2();

                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){
                    console.log('ngModel dans les marques', ngModel.$modelValue);

                    scope.defauloptions.then(function(opts){
                        var data = opts['marques'] ;
                        _.each(data, function(op){
                            $(element).append("<option value='"+op.value+"'>"+op.label+"</option>")
                        });
                    });


                    $(element).select2();
                    $(element).off();
                    $(element).on('change', function(){
                        var value = $(element).val();
                        ngModel.$setViewValue(value);
                    });


                    if(ngModel.$modelValue){

                        window.setTimeout(function(){
                            $(element).val(ngModel.$modelValue).select2();
                        }, 100)
                    }
                }
            }
        }

    };

}]);

teinteasy.directive('ludate', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/elements/templates/ludatetpl.html",
        compile: function (tElm, tAttrs) {

            return function(scope, element, attrs, ngModel) {


                scope.$watch(attrs.ngModel, function(){ngModel.$render();}, true);


                ngModel.$render = function(){
                     $(element).find('.date').val(ngModel.$modelValue)
                }


                scope.$watch('theDate', function( newVal, oldVal){
                    
                    if(newVal){
                        ngModel.$setViewValue(newVal);
                    }
                });

            }
        }

    };

}]);