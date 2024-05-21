<?php
    include 'header.html'; ?>
<?php
    session_start();
    include_once('config.php');
    $nick = $_SESSION['nick'];
    $password = $_SESSION['password'];
    {
        $sql = "SELECT * FROM users ORDER BY pontos DESC";
    }
    $result = $conexao->query($sql);
?>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link  rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all"></script>
    <title></title>
    <style>
        body{
            background: radial-gradient(#f9d349,20%, #d57e12);
            color: white;
            text-align: center;
            margin:0;
            padding:20px;
        }

        .box-search{
            display: flex;
            justify-content: center;
            gap: .1%;
        }
        .table{
          width: 100%;
          border-collapse: collapse;
        }
        .table td,.table th{
          padding:12px 15px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 16px;
        }
        .table th{
          background-color: green;
          color: #ffffff;
        }

        @media(max-width: 500px){
          .table thead{
            display:none;

          }
          .table, .table tbody, .table tr, .table td{
            display:block;
            width:100%;

          }
          .table tr{
            margin-bottom:15px;

          }
          .table td{
            text-align: right;
            padding-left: 50%;
            text-align: right;
            position: relative;
          }
          .table td::before{
            content: attr(data-label);
            position: absolute;
            left:0;
            width: 50%;
            padding-left: 15px;
            font-size: 15px;
            font-weight: bold;

          }
        }

    </style>
</head>
<body>
    <br>
    <br><br><br>
    <?php
        echo "<h1> Minhas Vitórias <u></u></h1>";
    ?>
    <br>

    <br>
    <div class="m-5">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nick</th>
                    <th>Vitórias</th>

                </tr>
            </thead>
            <tbody>
                <?php
                    for($i=1; $i<1; $i++){}

                    while($user_data = mysqli_fetch_assoc($result)) {
                        echo "<tr>";
                        echo "<td>".$i."</td>";
                        $i++;
                        echo "<td>".$user_data['nick']."</td>";
                        echo "<td>".$user_data['pontos']."</td>";
                        echo "</tr>";
                    }
                    ?>

            </tbody>
        </table>
    </div>
</body>

</html>
