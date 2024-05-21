<?php
    session_start();
    unset($_SESSION['nick']);
    unset($_SESSION['password']);
    header("Location: login.php");
?>
