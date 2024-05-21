let gameCore;
let puck;
let leftPaddle;
let rightPaddle;
let gameKeysHeld = {};

const GameDirection = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

window.onload = function () {
  GameInit();
};

function GameInit() {
  gameCore = new GameCore();
  puck = new Puck();
  leftPaddle = new Paddle(false);
  rightPaddle = new Paddle(true);
  gameCore.update();
  gameCore.drawSplashScreen();
}

class GameCore {
  constructor() {
    this.splashScreenIsVisible = true;
    this.canvas = document.getElementById("pong-gameboard");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = 700;
    this.canvas.width = 1000;
    this.ctx.height = this.canvas.height;
    this.ctx.width = this.canvas.width;
    this.randomPuckOffsetForComputer = 0;
  }

  update() {
    requestAnimFrame(this.update.bind(gameCore));
    this.trackControls();

    if (this.splashScreenIsVisible) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    puck.update();
    leftPaddle.update();
    rightPaddle.update();
    this.checkPaddles(puck, leftPaddle, rightPaddle);
  }

  trackControls() {
    if (gameKeysHeld["w"]) {
        leftPaddle.move(GameDirection.UP);
    }

    if (gameKeysHeld["s"]) {
        leftPaddle.move(GameDirection.DOWN);
    }

    if(gameKeysHeld["ArrowUp"]) {
        rightPaddle.move(GameDirection.UP);
    }

    if (gameKeysHeld["ArrowDown"]) {
        rightPaddle.move(GameDirection.DOWN);
    }

    if (this.splashScreenIsVisible) {
      if (gameKeysHeld[" "]) {
        this.splashScreenIsVisible = false;
        puck.serve();
      }
    }
  }

  drawSplashScreen(paddle) {
    this.splashScreenIsVisible = true;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#CCC";
    this.ctx.font = "45px Orbitron";

    if (paddle != null) {
      const victoryString = !paddle.isRightPaddle
        ? "Jogador 1 Ganhou!"
        : "Jogador 2 Ganhou";
      this.ctx.fillText(victoryString, 300, 300);
    }

    this.ctx.fillText("Pressionar espaço para jogar", 120, 450);
    this.ctx.save();

    leftPaddle.score = 0;
    rightPaddle.score = 0;
  }

  drawBoard() {
    this.ctx.beginPath();
    this.ctx.setLineDash([25, 20]);
    this.ctx.moveTo(this.ctx.width / 2, 0);
    this.ctx.lineTo(this.ctx.width / 2, this.ctx.height);
    this.ctx.strokeStyle = "#CCC";
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    this.ctx.fillStyle = "#CCC";
    this.ctx.font = "45px Orbitron";
    this.ctx.fillText(leftPaddle.score, this.ctx.width / 2 / 2, 75);
    this.ctx.fillText(rightPaddle.score, (this.ctx.width / 2) * 1.5, 75);
  }

  checkPaddles(puck, leftPaddle, rightPaddle) {
    if (
      puck.yPos > rightPaddle.yPos &&
      puck.yPos < rightPaddle.yPos + rightPaddle.height
    ) {
      if (
        puck.xPos > rightPaddle.xPos - rightPaddle.width &&
        puck.xPos < rightPaddle.xPos + rightPaddle.width
      ) {
        const intersectionNormalization = this.normaliseIntersection(
          puck,
          rightPaddle
        );
        this.invertPuckVelocity(
          puck,
          intersectionNormalization,
          GameDirection.RIGHT
        );
        this.updateRandomComputerPuckoffset(puck);
      }
    } else if (puck.xPos > gameCore.ctx.width + puck.size * 2) {
      puck.serve(GameDirection.LEFT);
      this.IncrementScore(leftPaddle);
    }

    if (
      puck.yPos > leftPaddle.yPos &&
      puck.yPos < leftPaddle.yPos + leftPaddle.height
    ) {
      if (
        puck.xPos < leftPaddle.xPos + leftPaddle.width &&
        puck.xPos > leftPaddle.xPos - leftPaddle.width
      ) {
        const intersectionNormalization =
          this.normaliseIntersection(puck, leftPaddle) * -1;
        this.invertPuckVelocity(
          puck,
          intersectionNormalization,
          GameDirection.LEFT
        );
        this.updateRandomComputerPuckoffset(puck);
      }
    } else if (puck.xPos < 0 - puck.size * 2) {
      puck.serve(GameDirection.RIGHT);
      this.IncrementScore(rightPaddle);
    }
  }

  normaliseIntersection(puck, paddle) {
    return (paddle.yPos + paddle.height / 2 - puck.yPos) / (paddle.height / 2);
  }

  invertPuckVelocity(puck, intersectionNormalization, direction) {
    const reboundXVelocity =
      puck.ballSpeedConst * Math.cos(intersectionNormalization);
    const reboundYVelocity =
      puck.ballSpeedConst * Math.sin(intersectionNormalization);

    if (direction === GameDirection.LEFT) {
      puck.xVel = reboundXVelocity * -1;
      puck.yVel = reboundYVelocity * -1;
    } else {
      puck.xVel = reboundXVelocity;
      puck.yVel = reboundYVelocity;
    }

    puck.increaseSpeed();
  }

  IncrementScore(paddle) {
    paddle.score++;
    if (paddle.score == 10) this.drawSplashScreen(paddle);
  }

  updateRandomComputerPuckoffset(puck) {
    this.randomPuckOffsetForComputer = Math.floor(
      Math.random() * (puck.size * 3)
    );
  }
}

window.addEventListener("keydown", function (event) {
  gameKeysHeld[event.key] = true;
});

window.addEventListener("keyup", function (event) {
  gameKeysHeld[event.key] = false;
});

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

class Paddle {
  constructor(right) {
    this.isRightPaddle = right;
    this.width = 10;
    this.height = 100;
    this.score = 0;
    this.xPos = right
      ? gameCore.ctx.width - this.width * 2
      : (this.xPos = 0 + this.width);
    this.yPos = gameCore.ctx.height / 2 - this.height / 2;
  }

  move(movementDirection) {
    if (
      movementDirection == GameDirection.UP &&
      this.yPos > 0 + this.height * 0.3
    ) {
      this.yPos -= 7;
    }

    if (
      movementDirection == GameDirection.DOWN &&
      this.yPos < gameCore.ctx.height - this.height / 0.7
    ) {
      this.yPos += 7;
    }
  }

  draw() {
    gameCore.ctx.beginPath();
    gameCore.ctx.rect(this.xPos, this.yPos, this.width, this.height);
    gameCore.ctx.fillStyle = "white";
    gameCore.ctx.fill();
  }

  update() {
    this.draw();
  }
}

class Puck {
  constructor() {
    this.ballSpeedConst = 10;
    this.size = 20;
    this.xVel = 0;
    this.yVel = 0;
    this.xPos = 0;
    this.yPos = 0;
  }

  draw() {
    gameCore.ctx.beginPath();
    gameCore.ctx.rect(this.xPos, this.yPos, this.size, this.size);
    gameCore.ctx.fillStyle = "#FFF";
    gameCore.ctx.fill();
  }

  checkBoundary() {
    if (this.yPos < 0 || this.yPos > gameCore.ctx.height - this.size) {
      this.yVel = this.yVel * -1;
    }
  }

  serve(direction) {
    this.ballSpeedConst = 3.5;
    this.xPos = gameCore.ctx.width / 2 - this.size / 2;

    if (direction == null)
      direction = this.generateRandomBit()
        ? GameDirection.LEFT
        : GameDirection.RIGHT;

    this.setServeVelocity(direction);
    this.yPos =
      this.generateRandomBit() == 0
        ? this.size
        : gameCore.canvas.height - this.size;
  }

  setServeVelocity(serveDirection) {
    if (serveDirection == GameDirection.RIGHT) {
      this.xVel = this.ballSpeedConst;
    } else if (serveDirection == GameDirection.LEFT) {
      this.xVel = this.ballSpeedConst * -1;
    }

    this.yVel = this.ballSpeedConst;
  }

  update() {
    this.xPos -= this.xVel;
    this.yPos -= this.yVel;
    this.checkBoundary();
    this.draw();
  }

  generateRandomBit() {
    return Math.round(Math.random() * (1 - 0));
  }

  increaseSpeed() {
    this.ballSpeedConst += 0.5;
  }
}
