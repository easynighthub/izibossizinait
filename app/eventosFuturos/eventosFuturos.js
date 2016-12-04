'use strict';

angular.module('myApp.eventosFuturos', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/eventos-futuros', {
    templateUrl: 'eventosFuturos/eventosFuturos.html',
    controller: 'eventosFuturosCtrl'
  });
}])

.controller('eventosFuturosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
	function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {


		$('.modulo').text("Eventos "+ "Futuros");
		
	var getFuturesEvents = function(value, index, array) {
		var currentDay = new Date().getTime();
			if (currentDay < value.date)
				return true;
			else
				return false;
	}

	var ref1 = firebase.database().ref().child('events').orderByChild('admin').equalTo(window.currenUser.uid);
	$scope.eventsRequest = $firebaseArray(ref1);
	$scope.eventsRequest.$loaded().then(function(){
		$scope.Allvents = $scope.eventsRequest;
		$scope.events = $filter('filter')($scope.Allvents, getFuturesEvents);
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
