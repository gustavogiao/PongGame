<?php
    include_once('config.php');
    if(isset($_POST['update']))
    {

        $nick = $_POST['nick'];
        $password = $_POST['password'];

        $sqlInsert = "UPDATE users SET nick='$nick', password='$password' WHERE nick='$nick'";
        $result = $conexao->query($sqlInsert);
        print_r($result);
    }
    header('Location: home.php');

?>
