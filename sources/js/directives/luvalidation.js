
luvalidationeasy = angular.module('luvalidationmodule', []);

luvalidationeasy.directive('luvalidation', ['$timeout', function ($timeout) {

    return {
        require: 'ngModel',
        restrict: 'A',
        scope: true,
        compile: function (tElm, tAttrs) {
            return function(scope, element, attrs, ngModel) {



				$.ketchup.defaults.validateElements = ["input", "textarea", "select", 'div']

            	 attrs.$observe('luvalidation', function() {

            	 		var expression = "userdata."+scope.field.name;
                     
        		        //Ketchup validation        
				        jQuery.ketchup
			              .validation('obligatoire', 'La réponse à cette question est nécessaire.', function(form, el, value) {
			                  var fieldName = $(el).attr('data-val');

			                  var fieldValue = scope.getModelValue(fieldName);

			                  var condition = (fieldValue !== undefined);

                        console.log('fieldValue', fieldValue, 'condition', condition);

                              var currentField ;

                              if(!fieldValue){
                                    _.find(scope.slides, function(slide){

                                       var foundSlide = _.find(slide, function(field){
                                            currentField = field;
                                            return field.name === fieldName
                                        });

                                       return foundSlide;
                                    })
                                
                                }

                                if(condition){

                                }else{
                                  if(currentField){
                                      var expression = currentField.condition;
                                      var evaluated = scope.$eval( expression );
                                      console.log('evaluated', evaluated) 
                                      condition = !evaluated;
                                  } 
                                }
                               
			                  return condition;                      
			              })

                         .validation('nombre', 'La réponse doit être un nombre.', function(form, el, value) {
                              var fieldName = $(el).attr('data-val');
                              var fieldValue = scope.getModelValue(fieldName);

                              var reg = /^-?\d+\.?\d*$/
                              var condition = (fieldValue !== undefined && reg.test(fieldValue) );

                              var currentField ;

                              if(!fieldValue){
                                    _.find(scope.slides, function(slide){

                                       var foundSlide = _.find(slide, function(field){
                                            currentField = field;
                                            return field.name === fieldName
                                        });

                                       return foundSlide;
                                    })
                                
                                }

                                if(condition){

                                }else{
                                    if(currentField){
                                        var expression =  currentField.condition;
                                        var evaluated = scope.$eval( expression );
                                        console.log('evaluated', evaluated) 
                                        condition = !evaluated;
                                    }
                                }
                               
                              return condition;                      
                          })
                        

                        scope.$watch(expression, function(newval, oldval) {
                        		if(newval !== undefined && scope.glide){     
                                	var  currentIndex = scope.glide.current();
                                	var form = $('#slide-form-'+currentIndex);
                        			$('.ketchup-error').hide();
						            form.submit();
			                    }

                        });
                });
               
               	

  
            }
        }

    };

}]);


