/**
 * Created by Andro Ostoic on 03-12-2016.
 */






var ingresarAdmin = document.getElementById('signIn');

ingresarAdmin.addEventListener('click', function() {

    var email = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(
        function(s){
            window.location.href = 'app';
        },
        function(e) {

        });



});



