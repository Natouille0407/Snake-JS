let i = 0;
let snakeDirection = "right";
let gameInterval;
let snakeSegments = []; // tableau pour stocker les segments du corps du serpent

function moveUp(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    let newPosition = currentPosition - 20;
    if (newPosition >= 0) {
        snakeHead.style.top = newPosition + "px";
    }
}

function moveDown(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    let newPosition = currentPosition + 20;
    let gameAreaHeight = parseFloat(getComputedStyle(document.querySelector(".gameArea")).height);
    let snakeHeight = parseFloat(getComputedStyle(snakeHead).height);
    if (newPosition + snakeHeight <= gameAreaHeight) {
        snakeHead.style.top = newPosition + "px";
    }
}

function moveLeft(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    let newPosition = currentPosition - 20;
    if (newPosition >= 0) {
        snakeHead.style.left = newPosition + "px";
    }
}

function moveRight(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    let newPosition = currentPosition + 20;
    let gameAreaWidth = parseFloat(getComputedStyle(document.querySelector(".gameArea")).width);
    let snakeWidth = parseFloat(getComputedStyle(snakeHead).width);
    if (newPosition + snakeWidth <= gameAreaWidth) {
        snakeHead.style.left = newPosition + "px";
    }
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

    // Déplacer les segments du corps du serpent
    for (let i = snakeSegments.length - 1; i > 0; i--) {
        let currentSegment = snakeSegments[i];
        let previousSegment = snakeSegments[i - 1];
        currentSegment.style.top = previousSegment.offsetTop + "px";
        currentSegment.style.left = previousSegment.offsetLeft + "px";
    }

    // Déplacer le premier segment juste derrière la tête du serpent
    if (snakeSegments.length > 0) {
        let firstSegment = snakeSegments[0];
        firstSegment.style.top = snakeHead.offsetTop + "px";
        firstSegment.style.left = snakeHead.offsetLeft + "px";
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

function addSnakeBody() {
    let snakeHead = document.querySelector(".snake-head");
    let newBodySegment = document.createElement("div");
    newBodySegment.classList.add("snake-body");
    snakeSegments.push(newBodySegment); // Ajouter le nouveau segment à la liste des segments

    // Positionner le nouveau segment juste derrière la tête du serpent en fonction de sa direction actuelle
    let snakeDirectionVector = getSnakeDirectionVector();
    let lastSegment = snakeSegments.length > 1 ? snakeSegments[snakeSegments.length - 2] : snakeHead;

    let newSegmentPosition = {
        top: lastSegment.offsetTop + snakeDirectionVector.y * 20,
        left: lastSegment.offsetLeft + snakeDirectionVector.x * 20
    };

    newBodySegment.style.top = newSegmentPosition.top + "px";
    newBodySegment.style.left = newSegmentPosition.left + "px";

    document.querySelector(".gameArea").appendChild(newBodySegment); // Ajouter le nouveau segment au DOM
}

function getSnakeDirectionVector() {
    switch (snakeDirection) {
        case "right":
            return { x: 1, y: 0 };
        case "left":
            return { x: -1, y: 0 };
        case "up":
            return { x: 0, y: -1 };
        case "down":
            return { x: 0, y: 1 };
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
        // Le serpent a mangé la pomme
        appleRandomSpawn();
        scoreIncrement();
        addSnakeBody(); // Ajouter un nouveau segment de corps
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

function clearSnakeBody() {
    // Supprimer tous les segments du corps du serpent du DOM
    for (let segment of snakeSegments) {
        segment.remove();
    }

    // Vider le tableau des segments du corps du serpent
    snakeSegments = [];
}

function stopGame() {
    clearInterval(gameInterval);
    clearSnakeBody()
    document.querySelector('.snake-head').style.left = '385px';
    document.querySelector('.snake-head').style.top = '385px';
}

document.addEventListener("keydown", handleDirectionChange);

document.getElementById('launch').addEventListener("click", function () {
    startGame();
});

document.getElementById('stop').addEventListener("click", function () {
    stopGame();
});

document.addEventListener("DOMContentLoaded", appleRandomSpawn());