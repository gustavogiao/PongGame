<?php
    include 'header.html'; ?>
<?php
    session_start();
    include_once('config.php');
    if(!empty($_GET['search']))
    {
        $data = $_GET['search'];
        $sql = "SELECT * FROM users WHERE id LIKE '%$data%' or nick LIKE '%$data%' ORDER BY id DESC";
    }
    else
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
        echo "<h1>Leaderboard <u></u></h1>";
    ?>
    <br>
    <div class="box-search">
        <input type="search" class="form-control w-25" placeholder="Pesquisar" id="pesquisar">
        <button onclick="searchData()" class="fa fa-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" fill="currentColor" class="bi bi-search" viewBox="0 0 14 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
        </button>
    </div>
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
<script>
    var search = document.getElementById('pesquisar');

    search.addEventListener("keydown", function(event) {
        if (event.key === "Enter")
        {
            searchData();
        }
    });

    function searchData()
    {
        window.location = 'leaderboard.php?search='+search.value;
    }
</script>
</html>
