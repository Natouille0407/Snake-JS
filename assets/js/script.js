// <div class="snake-body">.</div>

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
}


function stopGame() {
    clearInterval(gameInterval);
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

document.addEventListener("keydown", handleDirectionChange);

document.addEventListener("DOMContentLoaded", function() {
    startGame();
});