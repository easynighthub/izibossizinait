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
                            alert('Este rrpp ya existe, se agregara a su lista de rrpp exitosamente');
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

                $scope.clientEmail = document.getElementById('clientEmail').value;
                $scope.name = document.getElementById('name').value;
                $scope.password = document.getElementById('password').value;

                if (!validateEmail($scope.clientEmail)) {
                    alert('Debe ingresar un email valido');
                    return;
                }
                if (!$scope.name) {
                    alert('Debe ingresar un nombre');
                    return;
                }
                if (!$scope.password) {
                    alert('Debe ingresar una contraseña');
                    return;
                }
                if ($scope.password.length < 6) {
                    alert('Debe ingresar una contraseña de 6 caracteres minimos');
                    return;
                }

                var rrppRequest = $firebaseArray(firebase.database().ref('/doormans'));
                rrppRequest.$loaded().then(function(){
                    var rrppExist = $filter('filter')(rrppRequest, {email: $scope.clientEmail});
                    console.log(rrppExist);
                    if (rrppExist.length > 0) {
                        addRrppToAdmin(rrppExist[0].uid, true);
                    } else {
                        firebase.auth().createUserWithEmailAndPassword($scope.clientEmail, $scope.password).then(
                            function(s) {
                                var rrpp = {
                                    anonimous: false,
                                    email: $scope.clientEmail,
                                    emailVerified: false,
                                    providerId: 'firebase',
                                    uid: s.uid,
                                    name: $scope.name
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