let snakeDirection = "right";
let i = 0;
let gameInterval;
let snakeSegments = [];
let gamearea = document.querySelector(".gameArea");

function moveUp(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    snakeHead.style.top = currentPosition - 20 + "px";
}

function moveDown(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    snakeHead.style.top = currentPosition + 20 + "px";
}

function moveLeft(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    snakeHead.style.left = currentPosition - 20 + "px";
}

function moveRight(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    snakeHead.style.left = currentPosition + 20 + "px";
}

function moveSnake() {
    let snakeHead = document.querySelector(".snake-head");
    switch (snakeDirection) {
        case "right":
            moveRight(snakeHead);
            break;
        case "left":
            moveLeft(snakeHead);
            break;
        case "up":
            moveUp(snakeHead);
            break;
        case "down":
            moveDown(snakeHead);
            break;
    }

    for (let i = snakeSegments.length - 1; i > 0; i--) {
        let currentSegment = snakeSegments[i];
        let previousSegment = snakeSegments[i - 1];
        currentSegment.style.top = previousSegment.offsetTop + "px";
        currentSegment.style.left = previousSegment.offsetLeft + "px";
    }

    if (snakeSegments.length > 0) {
        let firstSegment = snakeSegments[0];
        firstSegment.style.top = snakeHead.offsetTop + "px";
        firstSegment.style.left = snakeHead.offsetLeft + "px";
    }
}

function changeDirection(newDirection) {
    snakeDirection = newDirection;
}

function handleDirectionChange(event) {
    switch (event.key) {
        case "ArrowUp":
            changeDirection("up");
            break;
        case "ArrowDown":
            changeDirection("down");
            break;
        case "ArrowLeft":
            changeDirection("left");
            break;
        case "ArrowRight":
            changeDirection("right");
            break;
    }
}

function appleRandomSpawn() {
    let applePosY = Math.floor(Math.random() * (715 - (-35) + 1)) + (-35);
    let applePosX = Math.floor(Math.random() * (750 - 5 + 1)) + 5;
    document.getElementById('pomme').style.top = applePosY + "px";
    document.getElementById('pomme').style.left = applePosX + "px";
}

function wallRandomSpawn() {
    let wallPosY = Math.floor(Math.random() * (715 - (-35) + 1)) + (-35);
    let wallPosX = Math.floor(Math.random() * (750 - 5 + 1)) + 5;
    let wall = document.createElement('div');
    gamearea.appendChild(wall);
    wall.classList.add('wall')
}

function wallremove() {
    let walls = document.querySelectorAll(".wall");
    for (let i = 0; i < walls.length; i++) {
        walls[i].remove();
    }
}

function scoreIncrement() {
    i++
    document.querySelector('#score').textContent = i;
}

function detectCollision() {
    let snakeHead = document.querySelector(".snake-head").getBoundingClientRect();
    let apple = document.getElementById("pomme").getBoundingClientRect();

    if (
        snakeHead.left < apple.right &&
        snakeHead.right > apple.left &&
        snakeHead.top < apple.bottom &&
        snakeHead.bottom > apple.top
    ) {
        appleRandomSpawn();
        scoreIncrement();
        wallRandomSpawn();
        return true;
    } else {
        return false;
    }
}

function startGame() {
    gameInterval = setInterval(function () {
        moveSnake();
        if (detectCollision()) {
            console.log("Collision détectée !");
        }
    }, 100);
}

function stopGame() {
    wallremove()
    clearInterval(gameInterval);
    document.querySelector('.snake-head').style.left = '385px';
    document.querySelector('.snake-head').style.top = '385px';
    document.querySelector('#score').textContent = 0;
}

document.addEventListener("keydown", handleDirectionChange);

document.getElementById('launch').addEventListener("click", function () {
    startGame();
});

document.getElementById('stop').addEventListener("click", function () {
    stopGame();
});

document.addEventListener("DOMContentLoaded", appleRandomSpawn());
