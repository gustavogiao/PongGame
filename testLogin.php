<?php
    session_start();
    // print_r($_REQUEST);
    if(isset($_POST['submit']) && !empty($_POST['nick']) && !empty($_POST['password']))
    {
        // Acessa
        include_once('config.php');
        $nick = $_POST['nick'];
        $password = $_POST['password'];

        // print_r('Email: ' . $email);
        // print_r('<br>');
        // print_r('Senha: ' . $senha);

        $sql = "SELECT * FROM users WHERE nick = '$nick' and password = '$password'";
        $result = $conexao->query($sql);

        // print_r($sql);
        // print_r($result);

        if(mysqli_num_rows($result) < 1)
        {
            unset($_SESSION['nick']);
            unset($_SESSION['password']);
            header('Location: login.php');
        }
        else
        {
            $_SESSION['nick'] = $nick;
            $_SESSION['password'] = $password;
            header('Location: home.php');
        }
    }
    else
    {
        // Não acessa
        header('Location: login.php');
    }
?>
