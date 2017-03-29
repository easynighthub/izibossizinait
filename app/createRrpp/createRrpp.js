/**
 * Created by Andro Ostoic on 12-12-2016.
 */
'use strict';

angular.module('myApp.createRrpp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/createRrpp', {
            templateUrl: 'createRrpp/createRrpp.html',
            controller: 'createRrppCtrl'
        });
    }])

    .controller('createRrppCtrl', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$filter',
        function($scope, $rootScope, $firebaseObject, $firebaseArray, $filter) {

            function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            var userId = window.currenUser.uid || firebase.auth().currentUser.uid;

            $('.modulo').text('Crear RRPP');

            var addRrppToAdmin = function(rrppId, added) {
                firebase.database().ref('admins/'+ userId + '/rrpps/' + rrppId).set(true).then(
                    function(s){
                        if (added)
                            alert('se agrego a su lista de rrpp exitosamente');
                        document.location.href = '#!/rrpps';
                    }, function(e) {
                        alert('Error, intente de nuevo');
                        console.log('se guardo mal ', e);
                    }
                );
            }

            var saveToFIrebase = function(rrpp) {
                firebase.database().ref('rrpps/'+ rrpp.uid).set(rrpp).then(
                    function(s){
                        addRrppToAdmin(rrpp.uid);
                    }, function(e) {
                        alert('Error, intente de nuevo');
                        console.log('se guardo mal ', e);
                    }
                );
            };

            $scope.saveRrpp = function() {

                $scope.nombre = document.getElementById('nombre').value;
                $scope.correo = document.getElementById('correo').value;
                $scope.password = "proizinait";



                if (!validateEmail($scope.correo)) {
                    alert('Debe ingresar un email valido');
                    return;
                }
                if (!$scope.nombre) {
                    alert('Debe ingresar un nombre');
                    return;
                }



                var rrppRequest = $firebaseArray(firebase.database().ref('/rrpps'));
                rrppRequest.$loaded().then(function(){
                    var rrppExist = $filter('filter')(rrppRequest, {email: $scope.correo});
                    console.log(rrppExist);
                    if (rrppExist.length > 0) {
                        addRrppToAdmin(rrppExist[0].uid, true);
                    } else {
                        firebase.auth().createUserWithEmailAndPassword($scope.correo, $scope.password).then(
                            function(s) {

                                var rrpp = {
                                    activo: true,
                                    email: $scope.correo,
                                    name: $scope.nombre,
                                    uid: s.uid

                                };
                                saveToFIrebase(rrpp);
                            }, function(e) {
                                console.log(e);
                            }
                        );
                    }
                });

            }


        }]);