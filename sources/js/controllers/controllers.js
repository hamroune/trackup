var lucetteApp = angular.module('lucetteApp', [
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

lucetteApp.config(['$routeProvider', 'RestangularProvider', '$locationProvider',
    function($routeProvider, RestangularProvider, $locationProvider ) {

        $locationProvider.html5Mode(false);
        RestangularProvider.setBaseUrl('/api');

        $routeProvider.
            when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
                            }).
            when('/wizard', {
                templateUrl: 'partials/wizard.html',
                controller: 'WizardCtrl'
                            }).
            when('/w/:id', {
                templateUrl: 'partials/form.html',
                controller: 'FormCtrl'
                            }).
            when('/sign', {
                templateUrl: 'partials/sign.html',
                controller: 'SignCtrl'
                            }).

            when('/general', {
                templateUrl: 'partials/form.html',
                controller: 'GeneralCtrl'
                            }).

            when('/conseils', {
                templateUrl: 'partials/conseils.html',
                controller: 'ConseilsCtrl'
                            }).

            when('/attente', {
                templateUrl: 'partials/attente.html',
                controller: 'AttenteCtrl'
                            }).


            when('/conseil/:id', {
                templateUrl: 'partials/conseil.html',
                controller: 'ConseilCtrl'
            }).

            when('/sousthematique/:name', {
                templateUrl: 'partials/conseilsbysousthematique.html',
                controller: 'ConseilBySousThematiqueCtrl'
            }).


            when('/concept', {
                templateUrl: 'partials/concept.html',
                 controller: 'ConceptCtrl'
            }).


            when('/lucette', {
                templateUrl: 'partials/lucette.html',
                controller: "LucetteCtrl"
            }).


            when('/compte', {
                templateUrl: 'partials/compte.html'
            }).


            otherwise({
                redirectTo: '/'
                            });


    }]);


lucetteApp
    .controller('HeaderCtrl', function ($scope, Restangular, $routeParams, $timeout, UserService) {
        
        $scope.getUser = function(){
            UserService.getUser().then(function(currentUser){
                $scope.user = currentUser;
            });
        }

        $scope.getUser();


        $scope.$on('user_update', function(){
           $scope.getUser();
        });
  
});

lucetteApp
    .controller('SignCtrl', function ($scope, Restangular, $routeParams, $timeout, UserService) {
        $('.lu-wizard').css('background', "#3498DB");



        $scope.error="Error !";
        $scope.user = {};

        $scope.create = function(){
            console.log('$scope.user', $scope.user);
            Restangular.all('compte').post($scope.user);
        }

        $scope.auth = function(){
            Restangular.all('auth/login').post($scope.authuser).then(function(){
                $scope.error="";
                window.location.href="#/wizard";
            },function(){
                $scope.error="Ooops ! l'email ou le mot de passe est erroné"
            });   
        }
        var isAuthenticated = UserService.isAuthenticated();
     
        if(isAuthenticated){
            window.location.href= "#/wizard";
        }

        $scope.signin = function(){
            $('.lu-signin').show();
            $('.lu-signup').hide();
        }

        $scope.signup = function(){
            $('.lu-signin').hide();
            $('.lu-signup').show();
        }

        $('.lu-signup').show();
        $('.lu-signin').hide();
    })

lucetteApp
    .controller('GeneralCtrl', function ($scope, Restangular, $routeParams, $timeout, UserService, DefaultOptionsService) {

        $scope.defauloptions = DefaultOptionsService.getDefaultOptions();

        if(!UserService.isAuthenticated()){
            window.location.href= "#/sign";
        }

        $scope.userdata = {};

        UserService.getUserData().then(function(ud){
            console.log('userdata from server :', ud);
            $scope.userdata = ud;
        });


        $('#slider').hide();
        $('#loading').show();
        $('.breadcrumbs').html('');
        $('.breadcrumbs').hide();


        var i = 0;
        $('.lu-form').css('background', pallettte[i]);


        $scope.currentIndex = 1;

        $scope.getModelValue = function(fieldName){
            return $scope.userdata[fieldName];
        }

        

        Restangular.all('form').getList().then(function(forms){
            
            var currentForm = _.find(forms, function(f, index){
                return f.name === "general";
            });

            var slidesObj = _.groupBy(currentForm.fields, function(field){
                return field.slide;
            });

            var slides = _.map(slidesObj, function(fields, key){
                _.each(fields, function(field){
                    if(field){        
                        field.model = 'userdata.'+field.name;
                    }
                })
                return fields;
            })

            $scope.slides = slides;

            $scope.slides.push({})
           
             //Init Slider
            $timeout(function() {

                $scope.glide = $('#slider').glide({
                    arrowRightText: '→',
                    arrowLeftText: '←',
                    autoplay: false
                }).data('api_glide');

                
                $('.slider-arrow--right').on('click', function(){
                    $scope.goNext();
                })
                            
                $('.slider-arrow--left').on('click', function(){
                    $scope.goPrev();
                })

            }, 10);


            $timeout(function() {
                _.each($scope.slides, function(s,index){
                    var i = index+1;
                    $('#slide-form-'+i).ketchup();
                });
                
                $(document).on('keyup', function(k){
                       // Next
                        if (k.keyCode === 39) {
                            $scope.goNext();
                        }
                        // Prev
                        if (k.keyCode === 37) {
                            $scope.goPrev();
                        }
                });

                $('#slider').show();
                $('#loading').hide();
        
            }, 50);
        });


        $scope.getColor = function(){
            var color = ($scope.slideVal >= 0) ? '#2C3E50' : "#f74"
            return  color;
        }


        $scope.goNext = function(){

            var keys = _.keys($scope.userdata);
            var  next = $scope.glide.current();

            //Next
            var currentIndex = next - 1;
            var form = $('#slide-form-'+currentIndex);

           if(form.length>0){
                $('#slide-form-'+currentIndex).ketchup();
                var valid = $('#slide-form-'+currentIndex).ketchup('isValid'); 
                if(!valid ){
                    $scope.glide.jump(currentIndex);
                    $('#slide-form-'+currentIndex).submit();
                }else{
                    $scope.currentIndex = next;

                    //Save UserData
                    UserService.saveUserData($scope.userdata);

                    if(next == $scope.slides.length){
                        window.location.href="#/wizard";
                    }else{
                        $scope.glide.jump(next);                                           
                    }                     
                }    
            }/**/
              
        }

        $scope.goPrev = function(){
            var  next = $scope.glide.current();
            
            if(next>$scope.currentIndex){
                $scope.glide.jump($scope.currentIndex);
            }
        }
    })

lucetteApp
    .controller('HomeCtrl', function ($scope, Restangular, $routeParams, $timeout) {        
        
        $('.ketchup-error').hide();
        
        $timeout(function(){            
             window.setInterval(function(){
                $('.js-join-us').animo( { animation: ['tada'], duration: 0.5 } );
            }, 3000);
        }, 1000);

         window.setInterval(function(){
            $('.connect').animo( { animation: ['bounce'], duration: 0.5 } );
        }, 3000);
    });



var pallettte = ["#FF644E"];
var size = pallettte.length;
lucetteApp
    .controller('WizardCtrl', function ($scope, Restangular, $routeParams, $timeout, $location, UserService, DefaultOptionsService, $rootScope) {

        $scope.defauloptions = DefaultOptionsService.getDefaultOptions();

        if(!UserService.isAuthenticated()){
            window.location.href= "#/sign";
        }

        $('.ketchup-error').hide();

        
        $scope.wizardForm = function(form){
            $location.path('w/'+form._id).replace();
        }

        Restangular.all('form').getList().then(function(forms){
            _.each(forms, function(f, index){
                var i = index%size;
                f.color = pallettte[i];
            })
            $scope.forms=forms;
        });


       $rootScope.$broadcast('user_update');

    });

lucetteApp
    .controller('FormCtrl', function($scope, Restangular, $routeParams, $timeout, UserService, DefaultOptionsService){

        var pallettte = ["#FF644E","#FF644E", "#333", "#F2F2F2"];
        $scope.defauloptions = DefaultOptionsService.getDefaultOptions();

        $('#slider').hide();
        $('#loading').show();

        var i = 0;
        $('.lu-form').css('background', pallettte[i]);


        var id = $routeParams.id;

        $scope.currentIndex = 1;

        $scope.getModelValue = function(fieldName){
            return $scope.userdata[fieldName];
        }

        Restangular.all('form').getList().then(function(forms){
            
            var currentForm = _.find(forms, function(f, index){
                return f._id === id;
            });

            if(currentForm){
                var slidesObj = _.groupBy(currentForm.fields, function(field, index){
                    var slideNum =  field.slide || index;
                    field.slide = slideNum;
                    return parseInt(slideNum);
                });

                var slides = _.map(slidesObj, function(fields, key){
                    _.each(fields, function(field){
                        if(field){        
                            field.model = 'userdata.'+field.name;
                        }
                    })
                    return fields;
                })

                $scope.slides = slides;
                   
            }

            
             //Init Slider
            $timeout(function() {

                $scope.glide = $('#slider').glide({
                    arrowRightText: 'suivant →',
                    arrowLeftText: '← précédent',
                    autoplay: false
                }).data('api_glide');

                
                $('.slider-arrow--right').on('click', function(){
                    $scope.goNext();
                })
                            
                $('.slider-arrow--left').on('click', function(){
                    $scope.goPrev();
                })

            }, 10);


            $timeout(function() {
                _.each($scope.slides, function(s,index){
                    var i = index+1;
                    $('#slide-form-'+i).ketchup();
                });
                
                $(document).on('keyup', function(k){
                       // Next
                        if (k.keyCode === 39) {
                            $scope.goNext();
                        }
                        // Prev
                        if (k.keyCode === 37) {
                            $scope.goPrev();
                        }
                });

                $('#slider').show();
                $('#loading').hide();
        
            }, 50);
        });
       
        $scope.userdata = {};

        UserService.getUserData().then(function(ud){
            $scope.userdata = ud;
        });

        $scope.getColor = function(){
            var color = ($scope.slideVal >= 0) ? '#2C3E50' : "#f74"
            return  color;
        }

        $scope.goNext = function(){

            var keys = _.keys($scope.userdata);
            //Next
            var  next = $scope.glide.current();
            var currentIndex = next - 1;
            var form = $('#slide-form-'+currentIndex);

            console.log('$scope.allFormFinished', $scope.allFormFinished)
            if($scope.allFormFinished){
                        window.location.href="#/attente";
            }

           if(form.length>0){
                $('#slide-form-'+currentIndex).ketchup();
                var valid = $('#slide-form-'+currentIndex).ketchup('isValid'); 
                if(!valid ){
                    var i = currentIndex%size;
                    $('.lu-form').css('background', pallettte[i]);

                    $scope.glide.jump(currentIndex);
                    $('#slide-form-'+currentIndex).submit();
                }else{
                    $scope.currentIndex = next;

                    var i = next%size;
                    $('.lu-form').css('background', pallettte[i]);

                    //Save UserData
                    UserService.saveUserData($scope.userdata);


                    console.log('next', next, $scope.slides.length);
                    $scope.allFormFinished = (next == $scope.slides.length);

                    
                    $scope.glide.jump(next);                                           

                }    
            }              
        }

        $scope.goPrev = function(){
            $('.ketchup-error').hide();
            var  next = $scope.glide.current();
            var i = next%size;
            $('.lu-form').css('background', pallettte[i]);
            if(next>$scope.currentIndex){                 
                $scope.glide.jump($scope.currentIndex);
            }
        }
        
});
 

 lucetteApp
    .controller('ConseilsCtrl', function($scope, Restangular, $routeParams, $timeout, UserService){

        $scope.goToConseil = function(conseilId){
            console.log('called go goToConseil')
            window.location.href="#/conseil/"+conseilId;
        }

        $scope.gotoSousThematique = function(thname){
            window.location.href = "#/sousthematique/"+thname
        }


         Restangular.all('conseils').getList().then(function(data){
            $scope.conseils = data;    

            Restangular.all('thematiques').getList().then(function(data){
                $scope.thematiques = data;
               
                var groupedConseils = _.groupBy($scope.conseils, function(conseil){
                    return conseil.sousthematique;
                });

                var mappedConseils = _.map(groupedConseils, function(gconseils, key){
                    var sousthematique =  "";
                    var thematique =  "";

                    _.find($scope.thematiques, function(th){
                        thematique = th;
                        var ssThematiques = th.sousthematiques;
                        return _.find(ssThematiques, function(ssth){
                            sousthematique = ssth;
                            return ssth.name === key;
                        });

                    });

                    return {
                        thematique: thematique,
                        sousthematique: sousthematique,
                        conseils: gconseils,
                        size: gconseils.length
                    }
                });

                var conseilsByThematique = _.groupBy(mappedConseils, function(c){
                    return c.thematique.label
                });

                $scope.conseilsByThematique = [];

                _.each(conseilsByThematique, function(obj, key){
                    $scope.conseilsByThematique.push({
                        key: key,
                        data: obj
                    })
                });


                $scope.conseilsByThematique = _.sortBy($scope.conseilsByThematique, function(obj, key){
                    var max = 1;
                    var conseils = _.map(obj.data, function(d){
                        return d.conseils.length;
                    });
                    max = _.max(conseils);
                    return -(obj.data.length*10+max);
                });


                $timeout(function() {
                    $('.loader-conseils').hide();
                }, 10);
            });
        });




    });

    

 lucetteApp
    .controller('ConseilCtrl', function($scope, Restangular, $routeParams, $timeout, UserService){

         
        Restangular.one('conseil', $routeParams.id).get().then(function(c){
            $scope.conseil = c;
        })

        $scope.getVideoUrl = function(){
            var url = ($scope.conseil && $scope.conseil.videourl)? $scope.conseil.videourl.replace("watch?v=", "embed/"): "";
            return url;
        }

        $scope.getClassImage = function(){
            console.log('getClass called');

            return $scope.conseil && $scope.conseil.imageurl? "show" : "hide";
        }


        $scope.getClassVideo = function(){
            console.log('getClass called');

            return $scope.conseil && $scope.conseil.videourl? "show" : "hide";
        }


        $scope.getClassImageOrVideo = function(){
            console.log('getClass called');

            return ($scope.conseil && ($scope.conseil.imageurl || $scope.conseil.videourl) )? "show" : "hide";
        }

        $scope.getText = function(){
            if($scope.conseil){
                console.log('getText called', $scope.conseil.text)
            }
            return ($scope.conseil )? $scope.conseil.text: "";
        }
    });

lucetteApp
    .controller('ConseilBySousThematiqueCtrl', function($scope, Restangular, $routeParams, $timeout, UserService){

        var currentSousThematique = $routeParams.name;

        $scope.currentSousThematique = currentSousThematique;
         
         Restangular.all('conseils').getList().then(function(data){
            $scope.conseils = _.filter(data, function(c){
                var isOk = c.sousthematique === currentSousThematique;
                console.log('c', c.sousthematique, currentSousThematique, c)
                return isOk
            });    

            Restangular.all('thematiques').getList().then(function(data){
                $scope.thematiques = data;                

                //Init Slider
                $timeout(function() {
                   $('#sliderconseils').glide({
                       arrowRightText: 'conseil suivant →',
                        arrowLeftText: '← conseil précédent',
                        autoplay: false
                    });
                }, 100);
            });

        });


         $scope.getVideoUrl = function(conseil){
            var url = (conseil && conseil.videourl)? conseil.videourl.replace("watch?v=", "embed/"): "";
            return url;
        }

        $scope.getClassImage = function(conseil){
            
            var claz = (conseil && conseil.imageurl && !conseil.videourl)? "show" : "hide";

            console.log(claz,'conseil', conseil.imageurl);

            return claz;
        }


        $scope.getClassVideo = function(conseil){

            return (conseil && conseil.videourl)? "show" : "hide";
        }


        $scope.getClassImageOrVideo = function(conseil){
            return (conseil && (conseil.imageurl || conseil.videourl) )? "show" : "hide";
        }

        $scope.getText = function(conseil){
            return (conseil )? conseil.text: "";
        }
       
    });


lucetteApp
    .controller('ConceptCtrl', function($scope, Restangular, $routeParams, $timeout, UserService){
         Restangular.all('concepts').getList().then(function(data){
            $scope.concepts = data;
               
               //Init Slider
                $timeout(function() {
                   $('#sliderconcept').glide({
                       arrowRightText: '→',
                        arrowLeftText: '←',
                        autoplay: false
                    });
                }, 100);
         });
                
    });


lucetteApp
    .controller('LucetteCtrl', function($scope, Restangular, $routeParams, $timeout, UserService){
         $scope.lucette = Restangular.one('lucette').get();                
    });