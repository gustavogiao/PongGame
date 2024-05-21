<?php
    include_once('../config.php');
    if(isset($_POST['update']))
    {
        $id = $_POST['id'];
        $nick = $_POST['nick'];
        $password = $_POST['password'];
        $pontos = $_POST['pontos'];


        $sqlInsert = "UPDATE users SET pontos='$pontos' WHERE id='$id'";
        $result = $conexao->query($sqlInsert);
        print_r($result);
    }
    header('Location: leaderboard.php');

?>
