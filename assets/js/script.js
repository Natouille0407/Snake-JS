let snakeDirection = "right";
let i = 0;
let gameInterval;
let snakeSegments = [];
let gamearea = document.querySelector(".gameArea");

function moveUp(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    snakeHead.style.top = currentPosition - 20 + "px";
    snakeHead.style.rotate = 0 + "deg";
}

function moveDown(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    snakeHead.style.top = currentPosition + 20 + "px";
    snakeHead.style.rotate = 180 + "deg";
}

function moveLeft(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    snakeHead.style.left = currentPosition - 20 + "px";
    snakeHead.style.rotate = -90 + "deg";
}

function moveRight(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    snakeHead.style.left = currentPosition + 20 + "px";
    snakeHead.style.rotate = 90 + "deg";
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

    checkBoundaries();

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


function checkBoundaries() {
    let snakeHead = document.querySelector(".snake-head");
    let gameArea = document.querySelector(".gameArea");
    
    let headRect = snakeHead.getBoundingClientRect();
    let areaRect = gameArea.getBoundingClientRect();

    if (headRect.left < areaRect.left - 3) {
        snakeHead.style.left = areaRect.left - 300 + "px";
    }

    if (headRect.right > areaRect.right) {
        snakeHead.style.left = (areaRect.right - snakeHead.offsetWidth - 320) + "px";
    }

    if (headRect.top < areaRect.top ) {
        snakeHead.style.top = areaRect.top + "px";
    }

    if (headRect.bottom > areaRect.bottom) {
        snakeHead.style.top = (areaRect.bottom - snakeHead.offsetHeight - 20) + "px";
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
    let applePosY = Math.floor(Math.random() * (760 + 1));
    let applePosX = Math.floor(Math.random() * (760 + 1));
    document.getElementById('pomme').style.top = applePosY + "px";
    document.getElementById('pomme').style.left = applePosX + "px";
    
    if(checkAppleWallCollision()) {
        appleRandomSpawn()
    }
}

function wallRandomSpawn() {
    let wallPosY = Math.floor(Math.random() * (760 + 1));
    let wallPosX = Math.floor(Math.random() * (760 + 1));
    let wall = document.createElement('div');
    gamearea.appendChild(wall);
    wall.classList.add('wall');

    wall.style.top = wallPosY + "px";
    wall.style.left = wallPosX + "px";
}

function wallremove() {
    let walls = document.querySelectorAll(".wall");
    for (let i = 0; i < walls.length; i++) {
        walls[i].remove();
    }
}

function checkAppleWallCollision() {
    let pomme = document.getElementById('pomme');
    let walls = document.querySelectorAll('.wall');

    let pommeRect = pomme.getBoundingClientRect();

    for (let i = 0; i < walls.length; i++) {
        let wallRect = walls[i].getBoundingClientRect();

        if (
            pommeRect.top < wallRect.bottom &&
            pommeRect.bottom > wallRect.top &&
            pommeRect.left < wallRect.right &&
            pommeRect.right > wallRect.left
        ) {
            
            return true;
        }
    }

    return false;
}

function avoidWallOverlap() {
    let collisionDetected = true;
    let wallPosX, wallPosY;

    while (collisionDetected) {

        wallPosX = Math.floor(Math.random() * (760 + 1));
        wallPosY = Math.floor(Math.random() * (365 * 2 + 1)) - 365;

        collisionDetected = checkCollisionWithWalls(wallPosX, wallPosY);
    }

    createWallAtPosition(wallPosX, wallPosY);
}

function checkCollisionWithWalls(posX, posY) {
    let pommeRect = document.getElementById('pomme').getBoundingClientRect();
    let walls = document.querySelectorAll('.wall');
    
    for (let i = 0; i < walls.length; i++) {
        let wallRect = walls[i].getBoundingClientRect();
        
        if (
            posY < wallRect.bottom &&
            posY + 30 > wallRect.top &&
            posX < wallRect.right &&
            posX + 30 > wallRect.left
        ) {
            return true;
        }
    }
    
    return false;
}

function createWallAtPosition(posX, posY) {
    let wall = document.createElement('div');
    wall.classList.add('wall');
    wall.style.left = posX + 'px';
    wall.style.top = posY + 'px';
    gamearea.appendChild(wall);
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
