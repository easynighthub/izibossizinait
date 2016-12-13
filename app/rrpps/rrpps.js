/**
 * Created by Andro Ostoic on 11-12-2016.
 */


'use strict';

angular.module('myApp.rrpps', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/rrpps', {
            templateUrl: 'rrpps/rrpps.html',
            controller: 'rrppsCtrl'
        });
    }])

    .controller('rrppsCtrl', ['$scope', '$rootScope', '$firebaseArray', '$firebaseObject',
        function($scope, $rootScope, $firebaseArray, $firebaseObject) {


            $scope.rrpps = [];
            $('.modulo').text("Lista  "+ "RRPPs");



            var mainFunction = function () {
                var ref2 = firebase.database().ref('/rrpps');
                var rrppsRequest = $firebaseArray(ref2);
                rrppsRequest.$loaded().then(function(){
                    var adminRrpps = Object.keys(window.adminData.rrpps);
                    angular.forEach(rrppsRequest, function(d){
                        if (adminRrpps.indexOf(d.uid) >= 0){
                            $scope.rrpps.push(d);

                        }
                    });
                });
            }

            if (window.adminData) {
                mainFunction();
            }else {
                var ref = firebase.database().ref('/admins/').child(window.currenUser.uid);
                var adminData = $firebaseObject(ref);
                adminData.$loaded().then(function(){
                    window.adminData = adminData;
                    $('.user-header .text.user').text(window.adminData.name);
                    mainFunction();
                });
            }
           
        }]);
