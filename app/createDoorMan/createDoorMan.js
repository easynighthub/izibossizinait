'use strict';

angular.module('myApp.createDoorMan', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create-doorman', {
    templateUrl: 'createDoorMan/createDoorMan.html',
    controller: 'CreateDoorManCtrl'
  });
}])

.controller('CreateDoorManCtrl', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$filter',
  function($scope, $rootScope, $firebaseObject, $firebaseArray, $filter) {

	function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
	}

  var userId = window.currenUser.uid || firebase.auth().currentUser.uid;

    $('.modulo').text('Crear Doorman');

  var addDoormanToAdmin = function(doormanId, added) {
    firebase.database().ref('admins/'+ userId + '/doormans/' + doormanId).set(true).then(
      function(s){
        if (added)
        alert('Este doorman ya existe, se agregara a su lista de doormans');
        document.location.href = '#!/doorman';
      }, function(e) {
        alert('Error, intente de nuevo');
        console.log('se guardo mal ', e);
      }
    );
  }

  var saveToFIrebase = function(doorman) {
    firebase.database().ref('doormans/'+ doorman.uid).set(doorman).then(
      function(s){
        addDoormanToAdmin(doorman.uid);
      }, function(e) {
        alert('Error, intente de nuevo');
        console.log('se guardo mal ', e);
      }
    );
  };

	$scope.saveDoorman = function() {

    $scope.clientEmail = document.getElementById('clientEmail').value;
    $scope.name = document.getElementById('name').value;
    $scope.password = document.getElementById('password').value;

    if (!validateEmail($scope.clientEmail)) {
      alert('Debe ingresar un email valido');
      return;
    }
    if (!$scope.name) {
      alert('Debe ingresar un nombre');
      return;
    }
    if (!$scope.password) {
      alert('Debe ingresar una contraseña');
      return;
    }
    if ($scope.password.length < 6) {
      alert('Debe ingresar una contraseña de 6 caracteres minimos');
      return;
    }

    var doormansRequest = $firebaseArray(firebase.database().ref('/doormans'));
    doormansRequest.$loaded().then(function(){
      var doormaExist = $filter('filter')(doormansRequest, {email: $scope.clientEmail});
      console.log(doormaExist);
      if (doormaExist.length > 0) {
        addDoormanToAdmin(doormaExist[0].uid, true);
      } else {
        firebase.auth().createUserWithEmailAndPassword($scope.clientEmail, $scope.password).then(
          function(s) {
            var doorman = {
              anonimous: false,
              email: $scope.clientEmail,
              emailVerified: false,
              providerId: 'firebase',
              uid: s.uid,
              name: $scope.name
            };
            saveToFIrebase(doorman);
          }, function(e) {
            console.log(e);
          }
        );
      }
    });

	}


}]);
