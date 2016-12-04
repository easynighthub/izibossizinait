'use strict';

angular.module('myApp.eventos', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/eventos', {
    templateUrl: 'eventos/eventos.html',
    controller: 'eventosCtrl'
  });
}])

.controller('eventosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
	function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {

	$scope.filterDateInput = new Date();
	$scope.isFuture = true;

	if (!window.adminData) {
	  var ref = firebase.database().ref('/admins/').child(window.currenUser.uid);
		  var adminData = $firebaseObject(ref);
		  adminData.$loaded().then(function(){
		    window.adminData = adminData;
		    $rootScope.adminData = adminData;
			  $('.user-header .text.user').text(window.adminData.name);
	  });
	}else {
		$('.user-header .text.user').text(window.adminData.name);
	}

	var ref1 = firebase.database().ref('/events').orderByChild('admin').equalTo(window.currenUser.uid);
	var eventsRequest = $firebaseArray(ref1);
	eventsRequest.$loaded().then(function(){
		$scope.Allvents = eventsRequest;
		$scope.events = $scope.Allvents;
	});

	$scope.filterEventsByText = function() {
		$scope.events = $filter('filter')($scope.Allvents, {name: $scope.filterNameInput});
	}

	var comparatorDate = function (value, index, array) {
		var seletedDateInMs = $scope.filterDateInput.getTime().toString();
		var seletedDate = $filter('date')(seletedDateInMs, 'shortDate');
		var eventDate = $filter('date')(value.date, 'shortDate')
    if (eventDate == seletedDate)
      return true;
    else
      return false;
	};

	$scope.seeAllEvents = function() {
		$scope.events = $scope.Allvents;	
	}

	$scope.filterEventsByDate = function() {
		if ($scope.filterDateInput) {
			$scope.events = $filter('filter')($scope.Allvents, comparatorDate);
		}
	}

	$scope.duplicateEvent = function(index) {
		$rootScope.eventToRepet = $scope.events[index];
		document.location.href = '#!/crear-eventos';
	}
	
	$scope.redirectToEvent = function(index ) {
		$rootScope.selectedEvent = $scope.events[index];
		document.location.href = '#!/evento';
	}

}]);
