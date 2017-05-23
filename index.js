var ingresarAdmin = document.getElementById('signIn');

ingresarAdmin.addEventListener('click', function() {


    document.getElementById('BarraCargando').style.display = 'block';
    document.getElementById('signIn').style.display = 'none';

    var email = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(
        function(s){
        	console.log(s);
        	firebase.database().ref('/admins/' + s.uid).once('value').then(function(snapshot) {
        		if (snapshot.val() != null) 
        			window.location.href = 'app';
        		else {
        			alert('Este usuario no es Admin');
        			firebase.auth().signOut();
                    document.getElementById('BarraCargando').style.display = 'none';
                    document.getElementById('signIn').style.display = 'block';
        		}
			});
        },
        function(e) {
    		console.log(e);
			alert('ESTE USUARIO NO EXISTE EN NUESTRA BASE DE DATOS, PONGA SE ENCONTACTO CON IZINAIT');
            document.getElementById('BarraCargando').style.display = 'none';
            document.getElementById('signIn').style.display = 'block';
        }
    );
});
