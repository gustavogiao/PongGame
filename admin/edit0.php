<?php
    include_once('config.php');

    if(!empty($_GET['id']))
    {
        $id = $_GET['id'];
        $sqlSelect = "SELECT * FROM admin WHERE id=$id";
        $result = $conexao->query($sqlSelect);
        if($result->num_rows > 0)
        {
            while($user_data = mysqli_fetch_assoc($result))
            {
                $nick = $user_data['nick'];
                $password = $user_data['password'];
            }
        }
        else
        {
            header('Location: sistema2.php');
        }
    }
    else
    {
        header('Location: sistema2.php');
    }
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
    <h1>Editar</h1>
    <br>
    <form action="saveEdit0.php" method="POST">
        <input type="text" name="nick" id="nick" class="inputUser" value=<?php echo $nick;?>>
        <br><br>
        <input type="text" name="password" id="password" class="inputUser" value=<?php echo $password;?>>
        <br><br>
        <input type="hidden" name="id" value=<?php echo $id;?>>
        <input class="inputSubmit" type="submit" name="update" id="submit">
    </form>
</div>
</body>
</html>
