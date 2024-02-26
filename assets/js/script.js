let snakeDirection = "right";
let i = 0;
let gameInterval;
let snakeSegments = [];
let gamearea = document.querySelector(".gameArea");
let speed = 20;

function moveUp(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    snakeHead.style.top = currentPosition - speed + "px";
    snakeHead.style.rotate = 0 + "deg";
}

function moveDown(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).top);
    snakeHead.style.top = currentPosition + speed + "px";
    snakeHead.style.rotate = 180 + "deg";
}

function moveLeft(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    snakeHead.style.left = currentPosition - speed + "px";
    snakeHead.style.rotate = -90 + "deg";
}

function moveRight(snakeHead) {
    let currentPosition = parseFloat(getComputedStyle(snakeHead).left);
    snakeHead.style.left = currentPosition + speed + "px";
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
    detectWallCollision();

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

function detectWallCollision() {
    let snakeHead = document.querySelector(".snake-head").getBoundingClientRect();
    let walls = document.querySelectorAll('.wall');

    for (let i = 0; i < walls.length; i++) {
        let wallRect = walls[i].getBoundingClientRect();

        if (
            snakeHead.left < wallRect.right &&
            snakeHead.right > wallRect.left &&
            snakeHead.top < wallRect.bottom &&
            snakeHead.bottom > wallRect.top
        ) {
            handleDeath();
            break;
        }
    }
}


function checkBoundaries() {
    let snakeHead = document.querySelector(".snake-head");
    let gameArea = document.querySelector(".gameArea");

    let headRect = snakeHead.getBoundingClientRect();
    let areaRect = gameArea.getBoundingClientRect();

    if (headRect.left < areaRect.left - 3) {
        snakeHead.style.left = areaRect.left - 480 + "px";
        handleDeath();
    }

    if (headRect.right > areaRect.right) {
        snakeHead.style.left = (areaRect.right - snakeHead.offsetWidth - 495) + "px";
        handleDeath();
    }

    if (headRect.top < areaRect.top) {
        snakeHead.style.top = areaRect.top + "px";
        handleDeath();
    }

    if (headRect.bottom > areaRect.bottom) {
        snakeHead.style.top = (areaRect.bottom - snakeHead.offsetHeight - 20) + "px";
        handleDeath();
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

    if (checkAppleWallCollision()) {
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
        falseAppleSpawn()
        appleRandomSpawn();
        scoreIncrement();
        wallRandomSpawn();
        return true;
    } else {
        return false;
    }
}

function falseAppleSpawn() {
    let = randomNumber = Math.floor(Math.random() * 3) + 1;

    if (randomNumber === 1) {
        let fApplePosY = Math.floor(Math.random() * (760 + 1));
        let fApplePosX = Math.floor(Math.random() * (760 + 1));
        let fApple = document.createElement('div');
        gamearea.appendChild(fApple);
        fApple.classList.add('fapple');

        fApple.style.top = fApplePosY + "px";
        fApple.style.left = fApplePosX + "px";

        console.log("fapple");
    }
}

function detectFappleCollision() {
    let snakeHead = document.querySelector(".snake-head").getBoundingClientRect();
    let fapples = document.querySelectorAll('.fapple');

    for (let i = 0; i < fapples.length; i++) {
        let fappleRect = fapples[i].getBoundingClientRect();

        if (
            snakeHead.left < fappleRect.right &&
            snakeHead.right > fappleRect.left &&
            snakeHead.top < fappleRect.bottom &&
            snakeHead.bottom > fappleRect.top
        ) {
            handleFappleCollision(fapples[i]);
            return true;
        }
    }

    return false;
}

function handleFappleCollision(fapple) {
    fapple.remove();
    randomEffect()
}

function fappleremove() {
    let fapples = document.querySelectorAll(".fapple");
    for (let i = 0; i < fapples.length; i++) {
        fapples[i].remove();
    }
}

function randomEffect() {
    let randomEffect = Math.floor(Math.random() * 3) + 1;

    if (randomEffect === 1) {
        console.log("5 Walls spawn");

        wallRandomSpawn()
        wallRandomSpawn()
        wallRandomSpawn()
        wallRandomSpawn()
        wallRandomSpawn()
    }

    else if (randomEffect === 2) {
        console.log("apple random tp");

        let intervalId;
        function startSpawn() {
            intervalId = setInterval(appleRandomSpawn, 500);
        }
        function stopSpawn() {
            clearInterval(intervalId);
        }
        startSpawn();
        setTimeout(stopSpawn, 10000);
    }

    else if (randomEffect === 3) {
        console.log("add speed");

        function addspeed() {
            speed + 20;
        }
    }
}

function handleDeath() {
    let gameoverElements = document.querySelectorAll('.gameover');
    gameoverElements.forEach(function (element) {
        element.style.display = 'block';
    });
    stopGame();
}

function startGame() {
    let gameoverElements = document.querySelectorAll('.gameover');
    gameoverElements.forEach(function (element) {
        element.style.display = 'none';
    });
    gameInterval = setInterval(function () {
        moveSnake();
        detectFappleCollision()
        if (detectCollision()) {
            console.log("Collision détectée !");
        }
    }, 100);
}

function stopGame() {
    wallremove()
    fappleremove()
    clearInterval(gameInterval);
    document.querySelector('.snake-head').style.left = '385px';
    document.querySelector('.snake-head').style.top = '385px';
    document.querySelector('#score').textContent = 0;
    i = 0;
}

document.addEventListener("keydown", handleDirectionChange);

document.getElementById('launch').addEventListener("click", function () {
    startGame();
});

document.getElementById('stop').addEventListener("click", function () {
    stopGame();
});

document.addEventListener("DOMContentLoaded", appleRandomSpawn());
