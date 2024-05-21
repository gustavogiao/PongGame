<!DOCTYPE html>
<?php include 'header.html'; ?>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="pong1.css">
  </head>
  <body>

    <canvas></canvas>
    <div class="panel reveal">
        <div class="stat"></div>
        <h1>Dificuldades</h1>
        <br>
        <span><div class="tooltip"></div></span>
        <input type="text" hidden>
        <ul class="gameMode">
            <li class="mode baby" data-number=".05">Bebé</li>
            <li class="mode easy" data-number=".08">Fácil</li>
            <li class="mode normal" data-number=".1">Normal</li>
            <li class="mode hard" data-number=".2">Díficil</li>
            <li class="mode insane" data-number=".3">Insano</li>
        </ul>
        <br>
        <button class="play">Jogar!</button>
    </div>
  </body>
</html>
<script src="javapong1.js"></script>
