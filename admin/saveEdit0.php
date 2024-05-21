<?php
    include_once('../config.php');
    if(isset($_POST['update']))
    {
        $id = $_POST['id'];
        $nick = $_POST['nick'];
        $password = $_POST['password'];

        $sqlInsert = "UPDATE admin SET nick='$nick',password='$password' WHERE id='$id'";
        $result = $conexao->query($sqlInsert);
        print_r($result);
    }
    header('Location: sistema2.php');

?>
