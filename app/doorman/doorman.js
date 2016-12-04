'use strict';

angular.module('myApp.doorman', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/doorman', {
    templateUrl: 'doorman/doorman.html',
    controller: 'DoormanCtrl'
  });
}])

.controller('DoormanCtrl', ['$scope', '$rootScope', '$firebaseArray', '$firebaseObject',
 function($scope, $rootScope, $firebaseArray, $firebaseObject) {

	$scope.doormans = [];

	 $('.modulo').text('Doormans');

	var mainFunction = function () {
		var ref1 = firebase.database().ref('/doormans');
		var doormansRequest = $firebaseArray(ref1);
		doormansRequest.$loaded().then(function(){
			var adminDoorman = Object.keys(window.adminData.doormans);
			angular.forEach(doormansRequest, function(d){
				if (adminDoorman.indexOf(d.uid) >= 0){
					$scope.doormans.push(d);
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
