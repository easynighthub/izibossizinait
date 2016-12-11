var ingresarAdmin = document.getElementById('signIn');

ingresarAdmin.addEventListener('click', function() {

    var email = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(
        function(s){
            window.location.href = 'app';
        },
        function(e) {
        	
        }
    );
});
