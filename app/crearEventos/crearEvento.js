angular.module('myApp.crearEventos', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/crear-eventos', {
            templateUrl: 'crearEventos/crearEventos.html',
            controller: 'crearEventosCtrl'
        });
    }])

    .controller('crearEventosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function ($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {

            $scope.newEvent = {};
            $scope.isLoading = true;
            $scope.newEvent.image = '';
            $scope.isDuplicate = false;
            $scope.citiesOne = false;
            $scope.myDoormansOne = false;

            $scope.currentDate = new Date();
            $scope.isStartDateSelected = true;
            $scope.isEndDateSelected = true;
            $scope.activarHoraGratis = false;
            $scope.descOutHours = [];
            var doormanIndex = 0;
            var noRRpps = 0;

            $('.modulo').text("Crear " + "Evento");


            for (var i = 0; i < 100; i++) {
                $scope.descOutHours.push(i);
            }

            $scope.$watch('newEvent.freemiumHour', function () {
                if ($scope.newEvent.freemiumHour > $scope.newEventEnd) {
                    alert('No puede selecionar una fecha anterior a la fecha de inicio del evento');
                    $scope.newEvent.freemiumHour = '';
                }
            });

            $scope.$watch('newEventStart', function () {
                if ($scope.newEventStart) {
                    $scope.isStartDateSelected = false;
                }
            });

            $scope.$watch('newEventEnd', function () {
                $scope.isEndDateSelected = false;
                var date = new Date($scope.newEventEnd);
                $scope.newEventEndPlus1 = date.setDate(date.getDate() + 1);
            });

            var getClubs = function () {
                var clubsER = firebase.database().ref().child('clubs');
                $scope.clubs = [];
                $scope.clubsER = $firebaseArray(clubsER);
                $scope.clubsER.$loaded().then(function () {
                    angular.forEach($scope.clubsER, function (c) {
                        if (Object.keys(window.adminData.clubs).indexOf(c.$id) >= 0) {
                            $scope.clubs.push(c);
                        }
                    });
                });
            }

            var getCities = function () {
                var citiesER = firebase.database().ref().child('city');
                $scope.cities = [];
                $scope.citiesER = $firebaseArray(citiesER);
                $scope.citiesER.$loaded().then(function () {
                    angular.forEach($scope.citiesER, function (city) {
                        if (Object.keys(window.adminData.city).indexOf(city.$id) >= 0) {
                            $scope.cities.push(city);
                        }
                    });
                    if ($scope.cities.length == 1) {
                        $scope.citiesOne = true;
                    }
                });
            }

            var gerDoormans = function () {
                $scope.myDoormans = [];
                var ref1 = firebase.database().ref().child('doormans');
                var doormanER = $firebaseArray(ref1);
                doormanER.$loaded().then(function () {
                    angular.forEach(doormanER, function (d) {
                        if (Object.keys(window.adminData.doormans).indexOf(d.uid) >= 0) {
                            $scope.myDoormans.push(d);
                        }
                    });
                    if ($scope.myDoormans.length == 1) {
                        $scope.myDoormansOne = true;
                        $scope.myDoormans1 = $scope.myDoormans;
                    }
                });
            }

            var getRRPPs = function () {
                $scope.misRRPPs = [];
                var buscarRRPPs = firebase.database().ref().child('rrpps');
                var rrppsER = $firebaseArray(buscarRRPPs);
                rrppsER.$loaded().then(function () {
                    angular.forEach(rrppsER, function (d) {
                        if (Object.keys(window.adminData.rrpps).indexOf(d.uid) >= 0) {
                            $scope.misRRPPs.push(d);
                            console.log(d + "rrpppppppsss");
                            noRRpps = (noRRpps + 1);
                        }else{
                            console.log("no rrpssss!!");
                        }

                    });

                });
            }

            if (!window.adminData) {
                var ref = firebase.database().ref('/admins/').child(window.currenUser.uid);
                var adminData = $firebaseObject(ref);
                adminData.$loaded().then(function () {
                    window.adminData = adminData;
                    $('.user-header .text.user').text(window.adminData.name);

                    getClubs();
                    getCities();
                    gerDoormans();
                    getRRPPs();
                });
            } else {
                getClubs();
                getCities();
                gerDoormans();
                getRRPPs();
            }


            var environmentER = firebase.database().ref().child('environmentEvent');
            $scope.environmentER = $firebaseArray(environmentER);
            $scope.environmentER.$loaded().then(function () {
                $scope.environments = $scope.environmentER;
            });

            var clothingER = firebase.database().ref().child('clothing');
            $scope.clothingER = $firebaseArray(clothingER);
            $scope.clothingER.$loaded().then(function () {
                $scope.clothings = $scope.clothingER;
            });

            var ageRangesER = firebase.database().ref().child('agerange');
            $scope.ageRangesER = $firebaseArray(ageRangesER);
            $scope.ageRangesER.$loaded().then(function () {
                $scope.ageRanges = $scope.ageRangesER;
            });

            var musicsER = firebase.database().ref().child('styleEvent');
            $scope.musicsER = $firebaseArray(musicsER);
            $scope.musicsER.$loaded().then(function () {
                $scope.musics = $scope.musicsER;
            });

            if ($rootScope.eventToRepet) {
                $scope.isDuplicate = true;
                $scope.newEvent = $rootScope.eventToRepet;
                $scope.selectedClub = Object.keys($scope.newEvent.clubs)[0];
                $scope.newEventStart = new Date($scope.newEvent.date);
                $scope.newEventEnd = new Date($scope.newEvent.toHour);
                $scope.newEvent.eventEnvironment = $scope.newEvent.eventEnvironment.split(', ');
                $scope.newEvent.musicGenres = $scope.newEvent.musicGenres.split(', ');
            }

            $scope.openFileInput = function () {
                $('#imgInp').click();
            }


            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.imageInBase64 = e.target.result;
                        $('#blah').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }

            $("#imgInp").change(function () {
                readURL(this);
            });

            var startLoading = function () {
                $('body').addClass('loading');
                $('.md-warn.md-hue-3').removeClass('hidden');
                $scope.isLoading = false;
                var myElements = document.querySelector(".progress-circular.md-hue-3 path");
                myElements.style.stroke = 'rgb(35, 7, 147)';
            }

            var stopLoading = function () {
                $('body').removeClass('loading');
                $('.md-warn.md-hue-3').addClass('hidden');
                $scope.isLoading = true;
            }

            var managerError = function (e) {
                stopLoading();
                console.log('Hubo un Error', e);
                alert('Error interno, intente nuevamente.');
            }

            var getclubId = function (clucb) {
                var clucbA = clucb.split(' ');
                clucbA[0] = clucbA[0].toLowerCase();
                return clucbA.join('');
            }

            $scope.closeModal = function () {
                $scope.newEvent = {};
                $('.custom-modal').addClass('hidden');
                $('body').removeClass('loading');
            }

            var updateRRppEvents = function (eventId) {
                console.log("entro a guardar rrpps");
                $scope.misRRPPs.forEach(function (entry) {
                    firebase.database().ref('rrpps/' + entry.$id + '/events/' + $scope.newEvent.id).set(true).then(
                        function (s) {
                            console.log("============================================");
                            console.log(s);
                            console.log("============================================");
                            console.log("Iniciando Actualizacion de Doorman ");
                            console.log("rrpp Id " + entry.$id);
                            console.log("Doorman Actualizados");
                            console.log("============================================");
                            console.log("evento incertado " + eventId);
                            console.log("============================================");
                        }, managerError
                    );
                });

            };

            var updateDoormanEvents = function (eventId) {
                console.log(eventId);
                $scope.myDoormans.forEach(function (entry) {
                    firebase.database().ref('doormans/' + entry.$id + '/events/' + $scope.newEvent.id).set(true).then(
                        function (s) {
                            console.log("============================================");
                            console.log(s);
                            console.log("============================================");
                            console.log("Iniciando Actualizacion de Doorman ");
                            console.log("Doormand Id " + entry.$id);
                            console.log("Doorman Actualizados");
                            console.log("============================================");
                            console.log("Evento ID " + eventId);
                            console.log("================================================");
                        }, managerError
                    );
                });

                if(noRRpps > 0){
                    updateRRppEvents(eventId);
                    firebase.database().ref('admins/'+window.currenUser.uid+'/events/' + $scope.newEvent.id).set(true);
                }else{
                    console.log("no tiene rrps ");
                }


                stopLoading();
                $scope.shareWithFacebook = 'https://www.facebook.com/share.php?u=' + $scope.newEvent.evenUrl;
                $scope.shareWithTwiter = 'http://twitter.com/share?text=An%20Awesome%20Link&url=' + $scope.newEvent.evenUrl;

                alert('EVENTO CARGADO EXITOSAMENETE , izinait lo aprobara en unos minutos');
                $scope.newEvent = {};
                document.location.href = '#!/eventos';

                /*if ($scope.selectedDoorman1)
                 $scope.selectedDoorman = $scope.selectedDoorman1;

                 if ($scope.selectedDoorman.length > index) {
                 firebase.database().ref('doormans/'+ $scope.selectedDoorman[index] +'/events/' + $scope.newEvent.id).set(true).then(
                 function(s){
                 doormanIndex ++;
                 updateDoormanEvents(doormanIndex);
                 }, managerError
                 );
                 } else {
                 stopLoading();
                 $scope.shareWithFacebook = 'https://www.facebook.com/share.php?u='+$scope.newEvent.evenUrl;
                 $scope.shareWithTwiter = 'http://twitter.com/share?text=An%20Awesome%20Link&url=' + $scope.newEvent.evenUrl;

                 alert('EVENTO CARGADO EXITOSAMENETE , izinait lo aprobara en unos minutos');
                 $scope.newEvent = {};
                 document.location.href = '#!/eventos';
                 }*/
            };

            var uploadImage = function () {
                startLoading();
                var file = $('#imgInp')[0].files[0];
                var ref = firebase.storage().ref('eventImages/' + Date.now() + '/' + file.name);
                ref.put(file).then(function (snapshot) {
                    $scope.newEvent.image = snapshot.a.downloadURLs[0];
                    firebase.database().ref('events/' + $scope.newEvent.id).set($scope.newEvent).then(
                        function (s) {
                            firebase.database().ref('clubs/' + getclubId($scope.selectedClub) + '/events/' + $scope.newEvent.id).set(true).then(
                                function (s) {
                                    updateDoormanEvents($scope.newEvent.id);

                                }, managerError);
                        }, managerError);
                }, managerError);
            };

            var fieldError = function (message, field) {
                alert(message);
            }

            var getLatAndLng = function (name, isLat) {
                var lat = '';
                angular.forEach($scope.clubs, function (club) {
                    if (name == club.$id) {
                        lat = $scope.clubs[$scope.clubs.indexOf(club)][isLat];
                    }
                });
                return lat;
            }

            $scope.allowUpTo2Ambiente = function () {
                var options = $('.ambiente-option');
                if ($scope.eventEnvironment.length >= 2) {
                    angular.forEach(options, function (opt) {
                        var a = $(opt).attr('aria-selected');
                        if (a == 'false') {
                            $(opt).addClass('hidden');
                        }
                    });
                } else {
                    angular.forEach(options, function (opt) {
                        var a = $(opt).attr('aria-selected');
                        if (a == 'false') {
                            $(opt).removeClass('hidden');
                        }
                    });
                }
            }

            $scope.allow3musicaGenres = function () {
                var options = $('.music-options');
                if ($scope.newEvent.musicGenres.length >= 3) {
                    angular.forEach(options, function (opt) {
                        var a = $(opt).attr('aria-selected');
                        if (a == 'false') {
                            $(opt).addClass('hidden');
                        }
                    });
                } else {
                    angular.forEach(options, function (opt) {
                        var a = $(opt).attr('aria-selected');
                        if (a == 'false') {
                            $(opt).removeClass('hidden');
                        }
                    });
                }
            }

            var validateFields = function () {
                if (!$scope.newEvent.name) {
                    fieldError('EL campo nombre debe ser llenado');
                    return false;
                }
                if (!$scope.isDuplicate && $('#imgInp').val() == '') {
                    fieldError('Debe elegir una imagen.');
                    return false;
                }
                if (!$scope.newEventStart) {
                    fieldError('EL campo fecha inicial');
                    return false;
                }
                if ($scope.newEventStart < new Date()) {
                    fieldError('No puede elegir una fecha pasada');
                    return false;
                }
                if (!$scope.newEventEnd) {
                    fieldError('EL campo Fecha final');
                    return false;
                }
                if ($scope.newEventEnd < $scope.newEventStart) {
                    fieldError('La fecha final debe ser mayor que la fecha inicial');
                    return false;
                }
                if (!$scope.newEvent.eventDetails) {
                    fieldError('EL campo Descripcion debe ser llenado.');
                    return false;
                }
                if (!$scope.newEvent.musicGenres) {
                    fieldError('EL campo Genero musical debe ser llenado.');
                    return false;
                }
                if (!$scope.eventEnvironment) {
                    fieldError('EL campo Ambiente debe ser llenado.');
                    return false;
                }
                if ($scope.eventEnvironment.length > 3) {
                    fieldError('seleccione hasta 2 ambientes.');
                    return false;
                }
                if (!$scope.newEvent.clothing) {
                    fieldError('EL campo Codigo de vestimenta debe ser llenado.');
                    return false;
                }
                if (!$scope.newEvent.djs) {
                    fieldError('EL campo Artistico debe ser llenado.');
                    return false;
                }
                /*    if (!$scope.newEvent.freemiumHour) {
                 fieldError('EL campo Termino de horario gratis debe ser llenado.');
                 return false;
                 } */

                if(activarHoraGratis == true){
                    if (!$scope.newEvent.freemiumHour){
                        fieldError('el campo hora gratis debe ser llenado');
                    }
                }else
                {
                    $scope.newEvent.freemiumHour = $scope.newEventStart;
                }

                if (($scope.newEvent.freemiumHour < $scope.newEventStart || $scope.newEvent.freemiumHour > $scope.newEventEnd)) {
                    fieldError('El termino de horario gratis debe ser entre el inicio y el fin delevento.');
                    return false;
                }
                if (!$scope.newEvent.city) {
                    fieldError('EL campo Ciudad debe ser llenado.');
                    return false;
                }
                if (!$scope.selectedClub) {
                    fieldError('EL campo club debe ser llenado.');
                    return false;
                }
                if (!$scope.ageRangeFemale) {
                    fieldError('EL campo Edda minima de mujeres debe ser llenado.');
                    return false;
                }
                if (!$scope.ageRangeMale) {
                    fieldError('EL campo Edad minima de hombres debe ser llenado.');
                    return false;
                }
                if (!$scope.newEvent.entryValue) {
                    fieldError('El campo valor de entrada debe ser llenado');
                    return false;
                }

                return true;
            };

            var cleanObject = function () {
                delete $scope.newEvent.$id;
                delete $scope.newEvent.$$hashKey;
                delete $scope.newEvent.$priority;
            }

            $scope.mostrar = function () {
                console.log($scope.newEvent.name);
            }
            $scope.activarHoraGratisF = function () {

                !$scope.activarHoraGratis;
                console.log( !$scope.activarHoraGratis);

            }



            $scope.saveEvent = function () {
                if (!validateFields())
                    return;

                $scope.newEvent.clubs = {};
                $scope.newEvent.clubs[$scope.selectedClub] = true;
                $scope.newEvent.date = new Date($scope.newEventStart).getTime();

                $scope.newEvent.fromHour = new Date($scope.newEventStart).getTime();
                $scope.newEvent.toHour = new Date($scope.newEventEnd).getTime();
                $scope.newEvent.policiesDoor = 'Hombres ' + $scope.ageRangeMale + ' | Mujeres ' + $scope.ageRangeFemale + ' | Dresscode ' + $scope.newEvent.clothing;

                if($scope.activarHoraGratis = true){
                    $scope.newEvent.freemiumHour = new Date($scope.newEvent.freemiumHour).getTime();
                }else
                {
                    $scope.newEvent.freemiumHour = new Date($scope.newEventStart).getTime();
                }
                $scope.newEvent.lat = getLatAndLng($scope.selectedClub, 'latitude');
                $scope.newEvent.lng = getLatAndLng($scope.selectedClub, 'longitude');
                $scope.newEvent.eventEnvironment = $scope.eventEnvironment ? $scope.eventEnvironment.join(', ') : '';
                $scope.newEvent.musicGenres = $scope.newEvent.musicGenres ? $scope.newEvent.musicGenres.join(', ') : '';
                $scope.newEvent.admin = window.currenUser.uid;
                $scope.newEvent.id = $scope.newEvent.admin + new Date().getTime();
                $scope.newEvent.evenUrl = 'http://izinait.com/user/app/#!/detalleEvento?id=' + $scope.newEvent.id
                $scope.newEvent.ageRange = 'Mujeres: ' + $scope.ageRangeFemale + ' | Hombres: ' + $scope.ageRangeMale;
                $scope.newEvent.ageRangeMale = $scope.ageRangeMale;
                $scope.newEvent.ageRangeFemale = $scope.ageRangeFemale;
                $scope.newEvent.visible = false;

                //ya no utilizado borrar en un futuro
                $scope.newEvent.descOutHour = 0;
                //    $scope.newEvent.entryValue = 0;
                //    $scope.newEvent.freemiumHour =  new Date($scope.newEventStart).getTime();
                $scope.newEvent.premiumHour = $scope.newEvent.freemiumHour;
                $scope.newEvent.premiumCover = 0;
                $scope.newEvent.freeCover = 0;
                $scope.newEvent.isPremiumEvent = false;

                cleanObject();

                if ($scope.isDuplicate) {
                    saveToFIrebase();
                } else {
                    uploadImage();
                }

            };

            $scope.serviciosEvent = [];

            $scope.addNewChoice = function() {
                var newItemNo = $scope.serviciosEvent.length+1;
                $scope.serviciosEvent.push({
                    tipo:$scope.tipoServicio

                }
                    );
            };


            $scope.guardarServicios = function (servicioEvent) {
            console.log("entre a guardar ")

              var tipoServicio = {
                    precio: servicioEvent.precio,
                    cantidad: servicioEvent.cantidad,
                    maxEntradas: servicioEvent.maxEntradas,
                    desc:  servicioEvent.desc
                };

                var newPostKey = firebase.database().ref().child('events/idevento123').push().key; //esto es solo para probar rapido
               var serviceEvent = angular.toJson($scope.serviciosEvent);
                firebase.database().ref('eventServices/idevento123/' + newPostKey + '/').set(tipoServicio).then(
                    function(s){

                        alert('Se Agrego el asdasdasda Correctamente');
                        console.log('se guardo bien ', s);
                    }, function(e) {
                        alert('Error, intente de nuevo');
                        console.log('se guardo mal ', e);
                    }
                );
            }

            $scope.removeChoice = function() {
                var lastItem = $scope.serviciosEvent.length-1;
                $scope.serviciosEvent.splice(lastItem);
            };

        }]);