let i = 0;

function moveUp() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    let newPosition = currentPosition - 20;
    if (newPosition >= 0) {
        snakeHead.style.top = newPosition + "px";
    }
}

function moveDown() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    let newPosition = currentPosition + 20;
    let gameAreaHeight = parseFloat(getComputedStyle(document.querySelector(".gameArea")).height);
    let snakeHeight = parseFloat(getComputedStyle(snakeHead).height);
    if (newPosition + snakeHeight <= gameAreaHeight) {
        snakeHead.style.top = newPosition + "px";
    }
}

function moveLeft() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    let newPosition = currentPosition - 20;
    if (newPosition >= 0) {
        snakeHead.style.left = newPosition + "px";
    }
}

function moveRight() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    let newPosition = currentPosition + 20;
    let gameAreaWidth = parseFloat(getComputedStyle(document.querySelector(".gameArea")).width);
    let snakeWidth = parseFloat(getComputedStyle(snakeHead).width);
    if (newPosition + snakeWidth <= gameAreaWidth) {
        snakeHead.style.left = newPosition + "px";
    }
}

let snakeDirection = "right";
let gameInterval;

function startGame() {
    gameInterval = setInterval(moveSnake, 100);
    setInterval(function () {
        if (detectCollision()) {
            console.log("Collision détectée !");
        }
    }, 100);
}


function stopGame() {
    clearInterval(gameInterval);
    document.querySelector('.snake-head').style.left = '385px';
    document.querySelector('.snake-head').style.top = '385px';
}

function moveSnake() {
    switch (snakeDirection) {
        case "right":
            moveRight();
            break;
        case "left":
            moveLeft();
            break;
        case "up":
            moveUp();
            break;
        case "down":
            moveDown();
            break;
    }

    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = snakeHead.getBoundingClientRect();
    let gameArea = document.querySelector(".gameArea").getBoundingClientRect();
 
}


function changeDirection(newDirection) {

    if ((newDirection === "right" && snakeDirection !== "left") ||
        (newDirection === "left" && snakeDirection !== "right") ||
        (newDirection === "up" && snakeDirection !== "down") ||
        (newDirection === "down" && snakeDirection !== "up")) {
        snakeDirection = newDirection;
    }
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

        appleRandomSpawn()
        scoreIncrement()
        return true;

    } else {

        return false;

    }
}

document.addEventListener("keydown", handleDirectionChange);

document.getElementById('launch').addEventListener("click", function () {
    startGame();
});

document.getElementById('stop').addEventListener("click", function () {
    stopGame();
});
