'use strict';

angular.module('myApp.evento', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/evento', {
    templateUrl: 'evento/evento.html',
    controller: 'EventoCtrl'
  });
}])

.controller('EventoCtrl', ['$scope','$rootScope', '$firebaseArray', '$firebaseObject',
	function($scope, $rootScope, $firebaseArray, $firebaseObject) {

	if (!$rootScope.selectedEvent) {
		document.location.href = '#!/eventos';
	}
	
	$scope.event = $rootScope.selectedEvent;
	var man = 0;
	var woman = 0;
	var sex = 0;
	var ifFirstTime = 0;
	var isNotFirstTime = 0;
	var descActive = 0;
	var descNotActive = 0;

	var loadCharts = function() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Hombres', man],
          ['Mujeres', woman],
          ['No definido', sex]
        ]);
        var options = {'title':'Asistencia por sexo',
                       'width':400,
                       'height':300};
        var chart = new google.visualization.PieChart(document.getElementById('bySex'));
        chart.draw(data, options);
      }


      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart2);
      function drawChart2() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Es primera vez', ifFirstTime],
          ['No es primera vez', isNotFirstTime]
        ]);
        var options = {'title':'Asistencia por si es primera vez',
                       'width':400,
                       'height':300};
        var chart = new google.visualization.PieChart(document.getElementById('byfirstTime'));
        chart.draw(data, options);
      }


      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart1);
      function drawChart1() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Gratis', descActive],
          ['Con descuento', descNotActive]
        ]);
        var options = {'title':'Asistencia por los que entraron en horario gratis',
                       'width':400,
                       'height':300};
        var chart = new google.visualization.PieChart(document.getElementById('byDesc'));
        chart.draw(data, options);
      }
	}
	
	var ref1 = firebase.database().ref('/history/' + $scope.event.id);
	var historyRequest = $firebaseObject(ref1);
	historyRequest.$loaded().then(function(){
		var doorman = Object.keys(historyRequest)[3];
		$scope.eventUsers = historyRequest[doorman];
    if (historyRequest[doorman]) {
      var users = Object.keys(historyRequest[doorman]);
      angular.forEach(users, function(user){
        if (historyRequest[doorman][user].gender == 'male')
          man++;
        else if (historyRequest[doorman][user].gender == 'female')
          woman++;
        else
          sex++;

        if (historyRequest[doorman][user].isFirstTime)
          ifFirstTime++;
        else
          isNotFirstTime++;

        if (historyRequest[doorman][user].descActive)
          descActive++;
        else
          descNotActive++;
      });
      loadCharts();
    }
	});



}]);
