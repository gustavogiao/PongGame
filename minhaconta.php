<?php
include_once('header.html');
session_start();
include_once('config.php');
if((!isset($_SESSION['id']) == true) and (!isset($_SESSION['nick']) == true) and (!isset($_SESSION['password']) == true))
{
    unset($_SESSION['nick']);
    unset($_SESSION['password']);
    header('Location: login.php');
}


$nick = $_SESSION['nick'];
$password = $_SESSION['password'];




?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar</title>
<style>
    body{
        font-family: Arial, Helvetica, sans-serif;
        background: radial-gradient(#f9d349,20%, #d57e12);
        position: relative;
    }
    .editar{
        background-color: rgba(0, 0, 0, 0.8);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding: 80px;
        border-radius: 15px;
        color: #fff;
    }
    input{
        padding: 15px;
        border: none;
        outline: none;
        font-size: 15px;
    }
    .inputSubmit{
        background-color: dodgerblue;
        border: none;
        padding: 15px;
        width: 100%;
        border-radius: 10px;
        color: white;
        font-size: 15px;

    }
    .inputSubmit:hover{
        background-color: deepskyblue;
        cursor: pointer;
    }
</style>
</head>
<body>
<div class="editar">
    <h1>Minha Conta</h1>
    <h2>Editar</h2>
    <br>
    <form action="saveEdit.php" method="POST">
        <h3>Nick:</h3>
        <input type="text" name="nick" id="nick" class="inputUser" value=<?php echo $nick;?>>
        <br><br>
<h3>Password:</h3>
        <input type="text" name="password" id="password" class="inputUser" value=<?php echo $password;?>>
        <br><br>
        <input class="inputSubmit" type="submit" name="update" id="submit">
    </form>
</div>
</body>
</html>
