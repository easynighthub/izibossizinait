'use strict';

angular.module('myApp.clientes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/clientes', {
    templateUrl: 'clientes/clientes.html',
    controller: 'clientesCtrl'
  });
}])

.controller('clientesCtrl', ['$scope', '$firebaseArray', '$firebaseObject', function($scope, $firebaseArray, $firebaseObject) {

	$scope.clientes = [];

	var getClients = function() {
		angular.forEach(Object.keys(window.adminData.clients), function(client){
			var clientesRequest = $firebaseObject(firebase.database().ref('/users/' + client));
			clientesRequest.$loaded().then(function(){
				$scope.clientes.push(clientesRequest);
			});
		});
	}

	if (window.adminData) {
		getClients();
	} else {
		if (window.currenUser){
			var ref = firebase.database().ref('/admins/').child(window.currenUser.uid);
			var adminData = $firebaseObject(ref);
			adminData.$loaded().then(function(){
				window.adminData = adminData;
				getClients();
			});
		} else {
			//window.location.href = '/login.html';
		}
	}
	
}]);
