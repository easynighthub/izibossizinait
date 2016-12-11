'use strict';

angular.module('myApp.facturacion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facturacion', {
    templateUrl: 'facturacion/facturacion.html',
    controller: 'facturacionCtrl'
  });
}])

.controller('facturacionCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$rootScope',
	function($scope, $firebaseArray, $firebaseObject, $rootScope) {


	var month = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','obtubre','noviembre','diciembre'];
	var adminData = window.adminData || $rootScope.adminData;
	$scope.facturaDetail = {};
	$scope.facturaDetail.eventos = 0;
	$scope.events = [];
	$scope.isFactura = false;
	$scope.asistencias = 0;
	$scope.image = 'http://placehold.it/350x150';
	$scope.isLoading = true;
	var facturaId = '';
		$('.modulo').text("Facturación");

	if (!adminData) {
		if (window.currenUser) {
			var ref = firebase.database().ref('/admins/').child(window.currenUser.uid);
			adminData = $firebaseObject(ref);
			adminData.$loaded().then(function(){
				window.adminData = adminData;
				$rootScope.adminData = adminData;
				$('.user-header .text.user').text(window.adminData.name);
			});
		} else {
			window.location.href = '/login.html';
		}
	}else {
		$('.user-header .text.user').text(window.adminData.name);
	}

	var getEvents = function(id, users) {
		var ref1 = firebase.database().ref('/events/' + id);
		var event = $firebaseObject(ref1);
		event.$loaded().then(function() {
			event.asistencias = users;
			$scope.asistencias = $scope.asistencias + users;
			$scope.events.push(event);
		});
	};

	$scope.buscar = function() {
		if ($scope.year && $scope.month) { 
			var uid = window.currenUser.uid;
			var ref = firebase.database().ref('admins/' + window.currenUser.uid +'/facturas/'+ $scope.month+$scope.year);
			var facturaRequest = $firebaseObject(ref);
			facturaRequest.$loaded().then(function(){
				if ('$value' in facturaRequest) {
					$scope.isFactura = false;
					$scope.events = [];
					alert('No hay facturas para este mes');
				} else {
					$scope.isFactura = true;
					$scope.facturaDetail.asistencias = facturaRequest.usersDesc + facturaRequest.usersFree;
					$scope.facturaDetail.valor = facturaRequest.usersDesc * adminData.payByUserDesc + facturaRequest.usersFree * adminData.payByUserFree;
					$scope.facturaEstado = facturaRequest.estado || 'No pagada';
					$scope.image = facturaRequest.facturaImageUrl || 'http://placehold.it/350x150';

					var ref1 = firebase.database().ref('/events').orderByChild('admin').equalTo(window.currenUser.uid);
					var facturacionRequest = $firebaseArray(ref1);
					var eventsId = [];
					var monthEvents = [];
					facturacionRequest.$loaded().then(function(){
						angular.forEach(facturacionRequest, function(event){
							eventsId.push(event.id);
						});
						angular.forEach(eventsId, function(id){
							var ref = firebase.database().ref('history/'+id);
							var event = $firebaseObject(ref);
							event.$loaded().then(function(){
								if (!('$value' in event)){
									monthEvents.push(event);
									$scope.facturaDetail.eventos++;
									var users = Object.keys(event[Object.keys(event)[3]]).length;
									getEvents(event.$id, users);
								}
							});
						});
					});
				}
			});
			
		} else {
			alert('Debe elegir el mes y el año');
		}

	}

	$scope.pagar = function() {
		if (!$scope.facturaDetail.isPaid) {

		}
	}

	function readURL(input) {
    if (input.files && input.files[0]) {
	      var reader = new FileReader();
	      reader.onload = function (e) {
	      	$scope.imageInBase64 = e.target.result;
	          $('#blah').attr('src', e.target.result);
	          $('#btnSaveImage').removeClass('hidden');
	      }
	      reader.readAsDataURL(input.files[0]);
	    }
	}

	$("#imgInp").change(function(){
	    readURL(this);
	});

	var startLoading = function() {
		$('body').addClass('loading');
		$('.md-warn.md-hue-3').removeClass('hidden');
		$scope.isLoading = false;
	}

	var stopLoading = function() {
		$('body').removeClass('loading');
		$('.md-warn.md-hue-3').addClass('hidden');
		$scope.isLoading = true;
	}

	$scope.uploadImage = function() {
		startLoading();
		var file = $('#imgInp')[0].files[0];
		var ref = firebase.storage().ref('facturaImages/' + Date.now() + '/' + file.name);
		ref.put(file).then(function(snapshot) {
		  $scope.image = snapshot.a.downloadURLs[0];
		  firebase.database().ref('admins/' + window.currenUser.uid + '/facturas/' + facturaId + '/facturaImageUrl').set($scope.image).then(
				function(s){
					firebase.database().ref('admins/' + window.currenUser.uid + '/facturas/' + facturaId + '/estado').set('Pendiente').then(
						function(s){
							stopLoading();
	          				$('#btnSaveImage').addClass('hidden');
	          				$scope.facturaEstado = 'Pendiente';
						}, function(e) {
							stopLoading();
							alert('Error, intente de nuevo');
							console.log('se guardo mal ', e);
						}
					);
				}, function(e) {
					stopLoading();
					alert('Error, intente de nuevo');
					console.log('se guardo mal ', e);
				}
			);
		}, function(e){
			stopLoading();
			alert('Error, intente de nuevo');
			console.log('se guardo mal ', e);
		});
	};

	$scope.openFileInput = function() {
		if ($scope.image == 'http://placehold.it/350x150')
			$('#imgInp').click();
	}

}]);
