'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'firebase',
  'ngMaterial',
  'ngMaterialDatePicker',
  'myApp.view1',
  'myApp.view2',
  'myApp.login',
  'myApp.clientes',
  'myApp.doorman',
  'myApp.createDoorMan',
  'myApp.facturacion',
  'myApp.eventos',
  'myApp.evento',
  'myApp.crearEventos',
  'myApp.eventosFuturos',
  'myApp.eventosPasados',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');


  var validateUser = function() {
    var data;
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
      var str = localStorage.key(i);
      var patt = new RegExp('firebase:authUser:');
      if(patt.test(str)){
        window.currenUser = JSON.parse(localStorage.getItem(str));
        return true;
      }
    }
    return false;
  }

  if(validateUser()) {
    $routeProvider.otherwise({redirectTo: '/eventos'});
  } else {
    window.location.href = '/angularjsproyectiziboss';
  }



  var signOutButton = document.getElementById('sign-out-button');
   var signOutButton2 = document.getElementById('sign-out-button2');

     signOutButton2.addEventListener('click', function() {
      firebase.auth().signOut();

       window.location.href = '/';
     });
    signOutButton.addEventListener('click', function() {
       firebase.auth().signOut();

     window.location.href = '/';
     });

}]);
