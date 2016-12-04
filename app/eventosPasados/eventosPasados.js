'use strict';

angular.module('myApp.eventosPasados', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/eventos-pasados', {
    templateUrl: 'eventosPasados/eventosPasados.html',
    controller: 'eventosPasadosCtrl'
  });
}])

.controller('eventosPasadosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
	function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {


		$('.modulo').text("Eventos "+ "Pasados");

	var getPasadossEvents = function(value, index, array) {
		var currentDay = new Date().getTime();
			if (currentDay > value.date)
				return true;
			else
				return false;
	}

var ref1 = firebase.database().ref().child('events').orderByChild('admin').equalTo(window.currenUser.uid);
	$scope.eventsRequest = $firebaseArray(ref1);
	$scope.eventsRequest.$loaded().then(function(){
		$scope.Allvents = $scope.eventsRequest;
		$scope.events = $filter('filter')($scope.Allvents, getPasadossEvents);
	});


	$scope.duplicateEvent = function(index) {
		$rootScope.eventToRepet = $scope.events[index];
		document.location.href = '#!/crear-eventos';
	}
	
	$scope.redirectToEvent = function(index ) {
		$rootScope.selectedEvent = $scope.events[index];
		document.location.href = '#!/evento';
	}

}]);