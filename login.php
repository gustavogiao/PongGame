<?php include 'header.html'; ?>
<html>
<head>
	<title>Login</title>
	<link rel="stylesheet" type="text/css" href="img/style.css">
	<link href="https://fonts.googleapis.com/css?family=Poppins:600&display=swap" rel="stylesheet">
	<script src="https://kit.fontawesome.com/a81368914c.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
	<img class="wave" src="img/wave.png">
	<div class="container">
		<div class="img">
			
		</div>
		<div class="login-content">
			<form action="testLogin.php" method="POST">
				<img src="img/avatar.svg">
				<h2 class="title">Bem-Vindo</h2><h3 style="font-size: 30px;">Login</h3>
           		<div class="input-div one">
           		   <div class="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div class="div">
           		   		<h5>Nick</h5>
           		   		<input type="text" name="nick" class="input">
           		   </div>
           		</div>
           		<div class="input-div pass">
           		   <div class="i">
           		    	<i class="fas fa-lock"></i>
           		   </div>
           		   <div class="div">
           		    	<h5>Password</h5>
           		    	<input type="password" name="password" class="input">
            	   </div>
            	</div>

            	<input type="submit" name="submit" class="btn" value="Login">
            </form>
        </div>
    </div>
    <script type="text/javascript" src="img/main.js"></script>
</body>
</html>
