var stage = document.getElementById("stage"), ctx = stage.getContext("2d");

/*
    Keep stage size proportional to window size
*/

const PERCENT_WINDOW_WIDTH = 0.25, PERCENT_WINDOW_HEIGHT = 0.70, MIN_STAGE_WIDTH = 800, MIN_STAGE_HEIGHT = 480;

function resizeStage()
{
    let winWidth = window.innerWidth - 16;
    let winHeight = window.innerHeight - 16;

    stage.width = Math.max(winWidth * PERCENT_WINDOW_WIDTH, MIN_STAGE_WIDTH);
    stage.height = Math.max(winHeight * PERCENT_WINDOW_HEIGHT, MIN_STAGE_HEIGHT);

    stage.style.left = (winWidth / 2 - stage.width / 2) + "px";
    stage.style.top = (winHeight / 2 - stage.height / 2) + "px";
}

// addEventListener("resize", resizeStage);

resizeStage();

/*
    Keep track of keyboard inputs
*/

var keys = {}, listeners = {};

function keyPress(e)
{
    let key = e.key == " " ? "space" : e.key.toLowerCase();

    if(e.type == "keydown")
    {
        keys[key] = true;

        if(listeners[key])
            listeners[key]();
    }
    else
        delete keys[key];

    e.preventDefault();
}

function bindKey(key, callback)
{
    listeners[key] = callback;
}

function unbindKey(key)
{
    delete listeners[key];
}

addEventListener("keydown", keyPress);
addEventListener("keyup", keyPress);

/*
    Keep track of game states
*/

var states = {}, currentState;

function addState(name, options)
{
    states[name] = {name: name, ...options};
}

function enterState(name)
{
    let newState = states[name];
    let oldState = currentState;

    if(!newState || newState == oldState)
        return;

    exitState(name);

    let bound = newState.bindKeys;
    if(bound)
    {
        for(var i in bound)
        {
            bindKey(i, bound[i]);
        }
    }

    if(newState.enter)
        newState.enter(oldState ? oldState.name : null);

    currentState = newState;
}

function exitState(newState)
{
    if(!currentState)
        return;

    let bound = currentState.bindKeys;
    if(bound)
    {
        for(var i in bound)
        {
            unbindKey(i, bound[i]);
        }
    }

    if(currentState.exit)
        currentState.exit(newState);

    currentState = null;
}

function isInState(name)
{
    return name && states[name] == currentState;
}

/*
    Create game clock
*/

var running = false, tick;

function start()
{
    if(running)
        return;

    running = true;

    loop();
}

function stop()
{
    if(!running)
        return;

    running = false;

    cancelAnimationFrame(tick);
}

function loop()
{
    tick = requestAnimationFrame(loop);

    if(!currentState)
        return;

    if(currentState.update)
        currentState.update();

    if(currentState.draw)
        currentState.draw();
}

/*
    Create math utilities
*/

// Random number between min (inclusive) and max (exclusive)

function randNum(min, max)
{
    return Math.random() * (max - min) + min;
}

function randInt(min, max)
{
    return Math.floor(randNum(min, max));
}

function randItem(array)
{
    return array[Math.floor(Math.random() * array.length)]
}

function bound(min, max, val)
{
    return Math.max(Math.min(max, val), min);
}

function overlap(a, b)
{
    return a.x <= b.x + b.w && a.x + a.w >= b.x && a.y <= b.y + b.h && a.y + a.h >= b.y;
}

// Finds distance ^ 2 (doesn't use Math.sqrt() for performance reasons and is also unnecessary in this implementation)
function distance(a,b)
{
    return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
}

/*
    Set up Game constants and framework
*/

// Color constants
const BACKGROUND_COLOR = "green", SECONDARY_COLOR = "white";

// Game object and graphics constants
const PI = Math.PI, COURT_RADIUS = 50, BALL_SPEED = 5, MAX_BALL_SPEED_STEP = 3, BALL_SPEED_STEP = 0.25, BALL_RADIUS = 4.5, PADDLE_WIDTH = 10, PADDLE_HEIGHT = 100, PADDLE_CURVE = 0.75, PLAYER_SPEED = 15;

const CPU = {
    1: {
        MAX_SPEED: 12,
        EASE: 16
    },

    2: {
        MAX_SPEED: 15,
        EASE: 13
    },

    3: {
        MAX_SPEED: 18,
        EASE: 10
    },

    DANCE_INTERVAL: 60,
    DANCE_MAGNITUDE: 100
};

const LEFT = 0, RIGHT = 1;

const ONE_PLAYER = 1, TWO_PLAYER = 2;

const EASY = 1, NORMAL = 2, HARD = 3;

const SCORE_CAP = {
    1: 20,
    2: 30,
    3: 40
};

// player scores and paddle objects

var mode = 0;
var difficulty = 0;

var player1Score = 0, player2Score = 0, victor;

var player1 = {
    x: 20,
    y: 0,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    w: PADDLE_WIDTH,
    h: PADDLE_HEIGHT,

    side: LEFT
};

var player2 = {
    x: 0,
    y: 0,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    w: PADDLE_WIDTH,
    h: PADDLE_HEIGHT,

    target: null,

    side: RIGHT
};


// Set CPU as an alias for the second player for organizational and readability purposes
var cpu = player2;

var balls = [];

// Background

function drawBackground()
{
    ctx.fillStyle = BACKGROUND_COLOR;

    ctx.fillRect(0, 0, stage.width, stage.height);
}

function drawCourt()
{
    let mx = stage.width / 2, my = stage.height / 2;

    ctx.strokeStyle = SECONDARY_COLOR;
    ctx.lineWidth = 5;

    ctx.beginPath();
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, my - COURT_RADIUS);
    ctx.closePath();

    ctx.stroke();

    ctx.beginPath();
        ctx.arc(mx, my, COURT_RADIUS, 0, 2 * PI);
        ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
        ctx.moveTo(mx, my + COURT_RADIUS);
        ctx.lineTo(mx, stage.height);
    ctx.closePath();

    ctx.stroke();
}

// Draw the one player/two player selector for the start screen

function drawTitle(text, fontSize, y)
{
    ctx.save();
        ctx.font = fontSize + "px 'Poppins'";
        ctx.textBaseline = "bottom";

        let lineHeight = ctx.measureText("M").width * 1.25;

        let textWidth = ctx.measureText(text).width;
        let halfText = textWidth / 2, halfStage = stage.width / 2;

        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(halfStage - halfText, y - lineHeight, textWidth, lineHeight);

        ctx.fillStyle = SECONDARY_COLOR;
        ctx.fillText(text, halfStage - halfText, y);
    ctx.restore();
}


function drawScore()
{
    let state = currentState;

    ctx.font = "60px 'Poppins'";

    let scoreWidth = ctx.measureText(player1Score).width;

    if(victor && victor.side == LEFT)
        ctx.fillStyle = state.time % 60 >= 30 ? SECONDARY_COLOR : BACKGROUND_COLOR;
    else
        ctx.fillStyle = SECONDARY_COLOR;

    ctx.fillText(player1Score, stage.width / 2 - scoreWidth - 10, 60);

    if(victor && victor.side == RIGHT)
        ctx.fillStyle = state.time % 60 >= 30 ? SECONDARY_COLOR : BACKGROUND_COLOR;
    else
        ctx.fillStyle = SECONDARY_COLOR;
    ctx.fillText(player2Score, stage.width / 2 + 10, 60);
}

// One and two player initiation

function initOnePlayer()
{
    mode = ONE_PLAYER;

    enterState("difficultySelectScreen");
}

function selectDifficulty(diff)
{
    difficulty = diff;

    enterState("countdownScreen");
}

function initTwoPlayer()
{
    mode = TWO_PLAYER;

    enterState("difficultySelectScreen");
}

function resetScore()
{
    victor = null;

    player1Score = 0;
    player2Score = 0;
}

function resetBalls()
{
    progress = 0;
    balls.length = 0;
}

function resetGame()
{
    mode = 0;
    difficulty = 0;

    resetScore();
    resetBalls();
    resetPaddlePositions();
}

function restartGame()
{
    resetScore();
    resetBalls();
    resetPaddlePositions();

    enterState("countdownScreen");
}

// Ball functionality and graphics

function addBall()
{
    let leftSide = -BALL_RADIUS, rightSide = stage.width + BALL_RADIUS;

    balls.push(new Ball(leftSide, randInt(BALL_RADIUS + PADDLE_HEIGHT,stage.height - BALL_RADIUS - PADDLE_HEIGHT), BALL_SPEED, 0));

    if(balls.length < BASE_BALL_QUANTITY + difficulty * DIFFICULTY_SCALING)
        balls.push(new Ball(rightSide, randInt(BALL_RADIUS + PADDLE_HEIGHT,stage.height - BALL_RADIUS - PADDLE_HEIGHT) , -BALL_SPEED, 0));
}

function removeBall(ball)
{
    balls.splice(balls.indexOf(ball), 1);
}

function ballExists(ball)
{
    return balls.includes(ball);
}

function updateBall(ball)
{
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Side collision detection (the additional velocity checks prevent the ball from ever becoming stuck in the sides if the ball overlaps too far)

    if(ball.vy < 0 && ball.y - ball.r <= 0 || ball.vy > 0 && ball.y + ball.r >= stage.height)
    {
        ball.vy = -ball.vy;
    }

    // Determine which paddle the ball is moving towards

    let dir = ball.getHoriz(), target;

    if(dir == "l")
    {
        target = player1;
    }
    else if(dir == "r")
    {
        target = cpu;
    }

    if(overlap(ball.getRect(), target))
    {
        let halfHeight = PADDLE_HEIGHT / 2, diff = ball.y - (target.y + halfHeight);

        let curve = diff / halfHeight * PADDLE_CURVE;

        ball.speedStep = Math.min(ball.speedStep + BALL_SPEED_STEP, MAX_BALL_SPEED_STEP);

        ball.vx = ball.vx > 0 ? -(ball.vx + ball.speedStep) : -(ball.vx - ball.speedStep);
        ball.vy = curve * (BALL_SPEED + ball.speedStep);

        if(target == cpu && cpu.target == ball)
            cpu.target = null;
    }

    if(ball.vx < 0 && ball.x - ball.r <= 0)
    {
        player2Score++;

        removeBall(ball);
    }
    else if(ball.vx > 0 && ball.x + ball.r >= stage.width)
    {
        player1Score++;

        removeBall(ball);
    }
}

function updateBalls()
{
    generateBalls();

    let current = [...balls];

    let score_cap = SCORE_CAP[difficulty]

    for(var i = 0, l = current.length; i < l; i++)
    {
        updateBall(current[i]);

        if(player1Score >= score_cap)
        {
            victor = player1;
            enterState("victoryScreen");

            break;
        }
        else if(player2Score >= score_cap)
        {
            victor = player2;
            enterState("victoryScreen");

            break;
        }
    }
}

function drawBall(ball)
{
    ctx.beginPath();
        ctx.fillStyle = cpu.target == ball ? "red" : SECONDARY_COLOR;

        ctx.arc(ball.x, ball.y, ball.r, 0, 2 * PI);
        ctx.fill();
    ctx.closePath();
}

function drawBalls()
{
    for(var i = 0, l = balls.length; i < l; i++)
    {
        drawBall(balls[i]);
    }
}

// Paddle functionality and graphics

function resetPaddlePositions()
{
    player1.y = stage.height / 2 - PADDLE_HEIGHT / 2;

    player2.x = stage.width - PADDLE_WIDTH - 20;
    player2.y = stage.height / 2 - PADDLE_HEIGHT / 2;
}

function updatePlayer1()
{
    if(keys.w)
    {
        if(player1.vy > 0)
            player1.vy = 0;

        player1.vy = Math.max(player1.vy - PLAYER_SPEED/4, -PLAYER_SPEED);
    }
    else if(keys.s)
    {
        if(player1.vy < 0)
            player1.vy = 0;

        player1.vy = Math.min(player1.vy + PLAYER_SPEED/4, PLAYER_SPEED);
    }
    else
        player1.vy = 0;

    player1.y = bound(0, stage.height - PADDLE_HEIGHT, player1.y + player1.vy);
}

function updateAlternatePlayer()
{
    if(mode == ONE_PLAYER)
        updateCPU();
    else if(mode == TWO_PLAYER)
        updatePlayer2();
}

function updatePlayer2()
{
    if(keys.arrowup)
    {
        player2.y -= PLAYER_SPEED;
    }

    if(keys.arrowdown)
    {
        player2.y += PLAYER_SPEED;
    }

    player2.y = bound(0, stage.height - PADDLE_HEIGHT, player2.y);
}

function updateCPU()
{
    if(victor == cpu)
    {
//         let my = cpu.y + PADDLE_HEIGHT / 2, halfHeight = stage.height / 2, dist = my - halfHeight;

//         if(Math.abs(dist) > 20)
//         {
//             let props = CPU[difficulty];

//             let speed = Math.min(Math.abs(dist) / props.EASE, props.MAX_SPEED);

//             if(my > halfHeight)
//             {
//                 cpu.y -= speed;
//             }
//             else if(my < halfHeight)
//                 cpu.y += speed;
//         }

        let state = currentState, halfHeight = stage.height / 2;

        cpu.y = halfHeight + Math.sin((state.time % CPU.DANCE_INTERVAL / CPU.DANCE_INTERVAL) * 2 * PI) * CPU.DANCE_MAGNITUDE;

        return;
    }

    let target = cpu.target, acquiredTarget = false;

    if(!target || !ballExists(target))
    {
        let closest, dist, closestDistance = Infinity, ball;

        let mx = cpu.x + PADDLE_WIDTH / 2, my = cpu.y + PADDLE_HEIGHT / 2;

        for(var i = 0, l = balls.length; i < l; i++)
        {
            ball = balls[i];

            // Only target balls moving towards the CPU that are also on its side of the court

            if(ball.vx < 0 || ball.x < stage.width / 2)
                continue;

            dist = distance({
                x: mx,
                y: my
            }, ball);

            if(dist < closestDistance)
            {
                closest = ball;
                closestDistance = dist;
            }
        }

        target = cpu.target = closest;

        acquiredTarget = !!target;
    }

    // Only move if the ball is on CPU's side of the court

    let props = CPU[difficulty];

    let halfHeight = PADDLE_HEIGHT / 2, my = cpu.y + halfHeight;

    target = acquiredTarget || (target && target.vx > 0 && target.x >= stage.width / 2) ? target : {y: stage.height/2};

    let dist = Math.abs(my - target.y), speed = Math.min(dist / props.EASE, props.MAX_SPEED);

    if(target.y < my)
    {
        cpu.y -= speed;
    }
    else if(target.y > my)
    {
        cpu.y += speed;
    }

    cpu.y = bound(0, stage.height - PADDLE_HEIGHT, cpu.y);
}

function drawPaddle(paddle)
{
    ctx.fillStyle = SECONDARY_COLOR;

    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

/*
    Create the Ball class
*/

var Ball = function(x, y, vx, vy)
{
    this.x = x;
    this.y = y;

    this.r = BALL_RADIUS;

    this.vx = vx;
    this.vy = vy;

    this.speedStep = 0;
};

Ball.prototype = {
    getHoriz: function()
    {
        return this.vx > 0 ? "r" : this.vx < 0 ? "l" : "n";
    },

    getVert: function()
    {
        return this.vy > 0 ? "d" : this.vy < 0 ? "u" : "n";
    },

    getRect: function()
    {
        let r = this.r;

        return {
            x: this.x - r,
            y: this.y - r,
            w: r * 2,
            h: r * 2
        };
    }
};

/*
    Create the ball generator
*/

let GENERATION_RATE = 45, BASE_BALL_QUANTITY = 5, DIFFICULTY_SCALING = 1;

let progress = 0;

function generateBalls()
{
    let diffVal = difficulty - 1;

    if(balls.length >= BASE_BALL_QUANTITY + diffVal * DIFFICULTY_SCALING)
        return;

    if(++progress > GENERATION_RATE - diffVal * DIFFICULTY_SCALING)
     {
         addBall();

         progress = 0;
     }
}

/*
    Create the game states
*/

addState("startScreen", {
    bindKeys: {
        1: initOnePlayer,
        2: initTwoPlayer,

        h: () => enterState("helpScreen")
    },

    enter: function()
    {
        resetGame();
    },

    draw: function()
    {
        drawBackground();
        drawCourt();

        drawTitle("Diferenciado", 70, stage.height * 0.25);

        drawTitle("Pressiona 1 - Solo", 40, stage.height * 0.5);
        drawTitle("Pressiona 2 - Local", 40, stage.height * 0.5 + 40);

        drawTitle("Pressiona H para ajuda", 30, stage.height * 0.85);
    }
});

addState("helpScreen", {
    bindKeys: {
        escape: () => enterState("startScreen")
    },

    draw: function()
    {
        drawBackground();
        drawCourt();

        drawTitle("Ajuda", 70, stage.height * 0.25);

        drawTitle("Usa o W e S para controlar Jogador 1", 35, stage.height * 0.5);
        drawTitle("Usa ↑ e ↓ para controlar Jogador 2", 35, stage.height * 0.5 + 40);
        drawTitle("Pressiona P para pausar jogo", 35, stage.height * 0.5 + 80);

        drawTitle("ESC para voltar atrás", 30, stage.height * 0.85);
    }
});

addState("difficultySelectScreen", {
    bindKeys: {
        1: () => selectDifficulty(EASY),
        2: () => selectDifficulty(NORMAL),
        3: () => selectDifficulty(HARD),

        escape: () => enterState("startScreen")
    },

    draw: function()
    {
        drawBackground();
        drawCourt();

        drawTitle("Dificuldade", 70, stage.height * 0.25);

        let pos = stage.height * 0.475;

        drawTitle("Pressiona 1 - Fácil", 40, pos);
        drawTitle("Pressiona 2 - Normal", 40, pos + 40);
        drawTitle("Pressiona 3 - Dificil", 40, pos + 80);

        drawTitle("ESC para voltar atrás", 30, stage.height * 0.85);
    }
});

addState("countdownScreen", {
    count: 3,
    tick: 0,

    enter: function()
    {
        this.count = 3;
        this.tick = 0;
    },

    update: function()
    {
        if(++this.tick > 60)
        {
            if(this.count === 0)
                enterState("gameScreen");
            else
                this.count--;

            this.tick = 0;
        }
    },

    draw: function()
    {
        drawBackground();
        drawCourt();
        drawScore();

        drawPaddle(player1);
        drawPaddle(player2);

        drawTitle(this.count === 0 ? "Começa!!" : this.count, 90, stage.height / 2 + 45);

        drawTitle("Primeiro a chegar " + SCORE_CAP[difficulty], 40, stage.height * 0.85);
    }
});

addState("gameScreen", {
    bindKeys: {
        p: () => enterState("pauseScreen"),
        escape: () => enterState("pauseScreen")
    },

    enter: function(oldState)
    {
        if(oldState == "countdownScreen")
            addBall();
    },

    update: function()
    {
        updatePlayer1();
        updateAlternatePlayer();

        updateBalls();
    },

    draw: function()
    {
        drawBackground();
        drawCourt();
        drawScore();

        drawBalls();

        drawPaddle(player1);
        drawPaddle(player2);
    }
});

addState("victoryScreen", {
    // These variables are only used for the cpu dance and blinking score animations
    time: 0,
    initialY: 0,

    bindKeys: {
        r: restartGame,
        escape: () => enterState("startScreen")
    },

    enter: function()
    {
        this.time = 0;
        this.initialY = cpu.y;
    },

    update: function()
    {
        if(victor.side == LEFT)
            updatePlayer1();
        else
            updateAlternatePlayer();

        this.time++;
    },

    draw: function()
    {
        drawBackground();
        drawCourt();
        drawScore();

        drawPaddle(player1);
        drawPaddle(player2);

        let victoryMessage = "";

        if(mode == ONE_PLAYER)
            victoryMessage = victor == cpu ? "CPU ganhou" : "Tu ganhaste";
        else
            victoryMessage = victor == player2 ? "Jogador 2 ganhou" : "Jogador 1 ganhou";

        drawTitle(victoryMessage, 90, stage.height / 2 + 45);

        drawTitle("Pressiona R para rematch", 40, stage.height * 0.85);
        drawTitle("Pressiona ESC para sair", 40, stage.height * 0.85 + 40);
    }
});

addState("pauseScreen", {
    bindKeys: {
        p: () => enterState("gameScreen"),
        r: restartGame,
        escape: () => enterState("startScreen")
    },

    draw: function()
    {
        drawBackground();
        drawCourt();
        drawScore();

        drawBalls();

        drawPaddle(player1);
        drawPaddle(player2);

        drawTitle("Em pausa", 60, stage.height / 2);
        drawTitle("Pressiona R para resetar jogo", 30, stage.height / 2 + 60);
        drawTitle("ESC para sair", 30, stage.height / 2 + 90);
    }
});

/*
    Initialize game and start it
*/

enterState("startScreen");

start();
