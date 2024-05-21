<?php
        session_start();
        include_once('config.php');

        $nick = $_SESSION['nick'];
        $password = $_SESSION['password'];


        $sqlDelete = "DELETE FROM users WHERE nick='$nick'";
        $resultDelete = $conexao->query($sqlDelete);


        header('Location: home.php');
        session_destroy()
?>
