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
        $('.modulo').text('Informe Evento');

        $scope.rrpps = [];
        $scope.ticketsUP = [];


        var impresionesRQ = $firebaseArray(firebase.database().ref("impresiones/").child($scope.event.$id));
        console.log($scope.event.$id);
        impresionesRQ.$loaded().then(function(){
            $scope.todasLasImpresiones = impresionesRQ;
          //  console.log( $scope.todasLasImpresiones);
        });

            var ref2 = firebase.database().ref('/rrpps');
            var rrppsRequest = $firebaseArray(ref2);
            rrppsRequest.$loaded().then(function(){
                var adminRrpps = Object.keys(window.adminData.rrpps);
                angular.forEach(rrppsRequest, function(d){
                    if (adminRrpps.indexOf(d.uid) >= 0){


                        angular.forEach(impresionesRQ, function(j){
                            console.log("entro aca por lo menos");
                            if (d.$id == (j.$id)){
                                d.openLink = j.openLink;
                               // console.log(d.openLink);
                                $scope.rrpps.push(d);
                                //console.log(d);

                            }
                        });

                    }
                });

            });


        var buscarTicketsEvent = firebase.database().ref('/tickets/' + $scope.event.$id);
        var buscarTicketsEventRQ = $firebaseArray(buscarTicketsEvent);
        buscarTicketsEventRQ.$loaded().then(function () {

            $scope.todosLosTickets = buscarTicketsEventRQ;
            $scope.usertickets = $scope.todosLosTickets;

            buscarTicketsEvent.once("value").then(function (snapshot) {
                $scope.usertickets.forEach(function (data) {
                    var c = snapshot.child(data.$id).exists(); // true
                    console.log(data.$id);
                    if (c === true) {
                        var buscarTicketsUsuario = firebase.database().ref('/tickets/' + $scope.event.$id+'/').child(data.$id);
                        var buscarTicketsUsuarioRQ = $firebaseArray(buscarTicketsUsuario);
                        buscarTicketsUsuarioRQ.$loaded().then(function () {
                            angular.forEach(buscarTicketsUsuarioRQ, function(x){
                                console.log("llegue a hacer push");
                             $scope.ticketsUP.push(x);
                             console.log( $scope.ticketsUP);
                            });


                        });
                    }

                });
            });

        });


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
        var options = {'title':'Asistencia por sexo'};
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
        var options = {'title':'Asistencia por si es primera vez'};

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
        var options = {'title':'Asistencia por los que entraron en horario gratis'};
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
