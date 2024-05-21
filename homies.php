<!DOCTYPE html>
<?php include 'header.html';

?>
<?php
session_start();
include_once('config.php');
if((!isset($_SESSION['id']) == true) and (!isset($_SESSION['nick']) == true) and (!isset($_SESSION['password']) == true))
{
    unset($_SESSION['nick']);
    unset($_SESSION['password']);
    header('Location: login.php');
}




?>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
      <link rel="stylesheet" href="homies.css">
  </head>
  <body>
<body>
	<div class="bubbler"></div>
	<div class="container">
        <div class="profileImg"></div>
            <div class="nameContainer">
            <h2 class="name"><?php echo $_SESSION['nick']; ?></h2>
            <p class="work">Gamer</p>
            <div class="social">
				<svg class="icon youtube"><use xlink:href="#icon-youtube"></use></svg>
                <svg class="icon facebook"><use xlink:href="#icon-facebook2"></use></svg>
                <svg class="icon twitter"><use xlink:href="#icon-twitter"></use></svg>
                <svg class="icon earth"><use xlink:href="#icon-earth"></use></svg>
                <a href="sair.php"><button2> Sair </button2></a>

            </div>
        </div>
        <p class="info">
        <a href="minhaconta.php"><button type="button" name="button"><span class="span1"></span>Editar Conta</button></a>
        <a href="deleteUser.php"><button type="button" name="button"><span class="span1"></span>Eliminar Conta</button></a>
        <a href="pontuacao.php"><button type="button" name="button"><span class="span1"></span>Rank</button></a>
        </p>
        <div class="projects">
        <div class="arrow arrowLeft"></div>
        <div class="arrow arrowRight"></div>
        <div class="ProImage"></div>
        <div class="ProImage"></div>
        <div class="ProImage"></div>
        <div class="ProImage"></div>
        </div>
    </div>
</body>

</html>
<script src="homies.js"></script>
