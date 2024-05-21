<?php include 'header.html'; ?>
<?php

    if(isset($_POST['submit']))
    {

        include_once('../config.php');

        $nick = $_POST['nick'];
        $password = $_POST['password'];

        $result = mysqli_query($conexao, "INSERT INTO admin(nick,password) VALUES ('$nick','$password')");

        header('Location: sistema2.php');
    }

?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar</title>
<style>
    body{
        font-family: Arial, Helvetica, sans-serif;
        background: radial-gradient(#f9d349,20%, #d57e12);
        position: relative;
    }
    .criar{
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
<div class="criar">
    <h1>Criar</h1>
    <br>
    <form method="POST">
        <input type="text" name="nick" placeholder="Nick">
        <br><br>
        <input type="password" name="password" placeholder="Password">
        <br><br>
        <input class="inputSubmit" type="submit" name="submit" value="Criar">
    </form>
</div>
</body>
</html>
