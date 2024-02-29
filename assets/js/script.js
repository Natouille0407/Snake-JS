// Variables globales
let snakeDirection = "right";
let score = 0;
let gameInterval;
let snakeSegments = [];
let gamearea = document.querySelector(".gameArea");
let speed = 5;

// Fonctions de déplacement du serpent
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

// Fonction de déplacement du serpent principal
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

// Fonction de détection de collision avec les murs
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

// Fonction de suppression du dernier mur
function removeLastWall() {
    let walls = document.querySelectorAll(".wall");
    if (walls.length > 0) {
        let lastWall = walls[walls.length - 1];
        lastWall.remove();
    }
}

// Fonction de vérification des limites de l'aire de jeu
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

// Fonction de changement de direction du serpent
function changeDirection(newDirection) {
    snakeDirection = newDirection;
}

// Gestionnaire d'événement pour le changement de direction avec les touches du clavier
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

// Fonction de génération aléatoire de la pomme
function appleRandomSpawn() {
    let applePosY = Math.floor(Math.random() * (760 + 1));
    let applePosX = Math.floor(Math.random() * (760 + 1));
    document.getElementById('pomme').style.top = applePosY + "px";
    document.getElementById('pomme').style.left = applePosX + "px";

    if (checkAppleWallCollision()) {
        appleRandomSpawn()
    }
}

// Fonction de génération aléatoire d'un mur
function wallRandomSpawn() {
    let wallPosY = Math.floor(Math.random() * (760 + 1));
    let wallPosX = Math.floor(Math.random() * (760 + 1));
    let wall = document.createElement('div');
    gamearea.appendChild(wall);
    wall.classList.add('wall');

    wall.style.top = wallPosY + "px";
    wall.style.left = wallPosX + "px";
    preventWallNearSnake()
    voidWallOverlapWithWall(Wall)
    preventFappleOnWall()
}

// Fonction de suppression de tous les murs
function wallremove() {
    let walls = document.querySelectorAll(".wall");
    for (let i = 0; i < walls.length; i++) {
        walls[i].remove();
    }
}

// Fonction de détection de collision de la pomme avec les murs
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

// Fonction pour enpéché l'aparition de murs sur le snake
function preventWallNearSnake() {
    const snakeHead = document.querySelector(".snake-head");
    const walls = document.querySelectorAll(".wall");

    const snakeHeadRect = snakeHead.getBoundingClientRect();

    walls.forEach(wall => {
        const wallRect = wall.getBoundingClientRect();

        // Calculer la distance entre la tête du serpent et le mur
        const distanceX = Math.abs(wallRect.x - snakeHeadRect.x);
        const distanceY = Math.abs(wallRect.y - snakeHeadRect.y);
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // Si la distance est inférieure à 50px, déplacez le mur
        if (distance < 50) {
            let newX = wallRect.x + 100; // Déplacez le mur de 100px horizontalement
            let newY = wallRect.y + 100; // Déplacez le mur de 100px verticalement

            // Assurez-vous que le mur reste dans la zone de jeu
            newX = Math.max(newX, 0);
            newY = Math.max(newY, 0);

            wall.style.left = newX + "px";
            wall.style.top = newY + "px";
        }
    });
}

// Fonction enpechant l'aparition de murs sur un fruit
function avoidWallOverlapWithFruit() {
    const walls = document.querySelectorAll(".wall");
    const fruits = document.querySelectorAll(".pomme, .fapple");

    walls.forEach(wall => {
        const wallRect = wall.getBoundingClientRect();

        fruits.forEach(fruit => {
            const fruitRect = fruit.getBoundingClientRect();

            // Vérifier s'il y a une collision entre le mur et le fruit
            if (
                wallRect.left < fruitRect.right &&
                wallRect.right > fruitRect.left &&
                wallRect.top < fruitRect.bottom &&
                wallRect.bottom > fruitRect.top
            ) {
                // Déplacer le mur à une nouvelle position aléatoire
                let newX = Math.floor(Math.random() * (760 + 1));
                let newY = Math.floor(Math.random() * (760 + 1));

                wall.style.left = newX + "px";
                wall.style.top = newY + "px";

                // Vérifier à nouveau la collision avec les fruits
                avoidWallOverlapWithFruit();
            }
        });
    });
}

function avoidWallOverlapWithWall(newWall) {
    const walls = document.querySelectorAll(".wall");

    walls.forEach(wall => {
        // Ignorer le nouveau mur passé en paramètre
        if (wall !== newWall) {
            const wallRect = wall.getBoundingClientRect();
            const newWallRect = newWall.getBoundingClientRect();

            // Vérifier s'il y a une collision entre le nouveau mur et un autre mur existant
            if (
                newWallRect.left < wallRect.right &&
                newWallRect.right > wallRect.left &&
                newWallRect.top < wallRect.bottom &&
                newWallRect.bottom > wallRect.top
            ) {
                // Déplacer le nouveau mur à une nouvelle position aléatoire
                let newX = Math.floor(Math.random() * (760 + 1));
                let newY = Math.floor(Math.random() * (760 + 1));

                newWall.style.left = newX + "px";
                newWall.style.top = newY + "px";

                // Vérifier à nouveau la collision avec les autres murs
                avoidWallOverlapWithWall(newWall);
            }
        }
    });
}

// Fonction de vérification de collision avec les murs
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

// Fonction de création de mur à une position donnée
function createWallAtPosition(posX, posY) {
    let wall = document.createElement('div');
    wall.classList.add('wall');
    wall.style.left = posX + 'px';
    wall.style.top = posY + 'px';
    gamearea.appendChild(wall);
}

// Fonction d'incrémentation du score
function scoreIncrement() {
    score++
    document.querySelector('#score').textContent = score;
    easterEgg()
}

// Fonction de gestion de la reinitialisation du score
function resetScore() {
    score = 0;
    document.querySelector('#score').textContent = score;
}

// Fonction de gestion de l'easter egg
function easterEgg() {
    if (score % 17 === 0) {
        const snakeHeads = document.querySelectorAll('.snake-head');
        snakeHeads.forEach(head => {
            head.style.backgroundImage = "url(assets/image/player-2.png)";
        });
    } else {
        const snakeHeads = document.querySelectorAll('.snake-head');
        snakeHeads.forEach(head => {
            head.style.backgroundImage = "url(assets/image/player.png)";
        });
    }
}

// Fonction de détection de collision
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
    }
    return false
}

// Fonction de génération aléatoire de faux fruits
function falseAppleSpawn() {
    let randomNumber = Math.floor(Math.random() * 3) + 1;

    if (randomNumber === 1) {
        let fApplePosY = Math.floor(Math.random() * (760 + 1));
        let fApplePosX = Math.floor(Math.random() * (760 + 1));
        let fApple = document.createElement('div');
        gamearea.appendChild(fApple);
        fApple.classList.add('fapple');

        fApple.style.top = fApplePosY + "px";
        fApple.style.left = fApplePosX + "px";

        console.log("fapple");
        preventFappleOnWall()
        avoidFappleOverlapWithFapple(fapple)
    }
}

// Fonction enpechant l'apparition d'une fausses pomme sur un murs
function preventFappleOnWall() {
    const walls = document.querySelectorAll(".wall");
    const fapples = document.querySelectorAll(".fapple");

    fapples.forEach(fapple => {
        const fappleRect = fapple.getBoundingClientRect();

        walls.forEach(wall => {
            const wallRect = wall.getBoundingClientRect();

            // Vérifier s'il y a collision entre la fausse pomme et le mur
            if (
                fappleRect.left < wallRect.right &&
                fappleRect.right > wallRect.left &&
                fappleRect.top < wallRect.bottom &&
                fappleRect.bottom > wallRect.top
            ) {
                // Si collision, déplacez la fausse pomme
                let newX = Math.floor(Math.random() * (760 + 1));
                let newY = Math.floor(Math.random() * (760 + 1));

                fapple.style.left = newX + "px";
                fapple.style.top = newY + "px";
            }
        });
    });
}

// Fonction de détection de collision avec les faux fruits
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

// Fonction de gestion de la collision avec les faux fruits
function handleFappleCollision(fapple) {
    fapple.remove();
    randomEffect()
}

// Fonction de suppression de tous les faux fruits
function fappleremove() {
    let fapples = document.querySelectorAll(".fapple");
    for (let i = 0; i < fapples.length; i++) {
        fapples[i].remove();
    }
}

// Fonction enpechant l'aparition d'une fapple sur un autre
function avoidFappleOverlapWithFapple(newFapple) {
    const fapples = document.querySelectorAll(".fapple");

    fapples.forEach(fapple => {
        // Ignorer la nouvelle fapple passée en paramètre
        if (fapple !== newFapple) {
            const fappleRect = fapple.getBoundingClientRect();
            const newFappleRect = newFapple.getBoundingClientRect();

            // Vérifier s'il y a une collision entre la nouvelle fapple et une autre fapple existante
            if (
                newFappleRect.left < fappleRect.right &&
                newFappleRect.right > fappleRect.left &&
                newFappleRect.top < fappleRect.bottom &&
                newFappleRect.bottom > fappleRect.top
            ) {
                // Déplacer la nouvelle fapple à une nouvelle position aléatoire
                let newX = Math.floor(Math.random() * (760 + 1));
                let newY = Math.floor(Math.random() * (760 + 1));

                newFapple.style.left = newX + "px";
                newFapple.style.top = newY + "px";

                // Vérifier à nouveau la collision avec les autres fapples
                avoidFappleOverlapWithFapple(newFapple);
            }
        }
    });
}

// Fonction d'augmentation de la vitesse du serpent
function addspeed() {
    speed = speed + 2.5;
    console.log(speed);
}

// Fonction de réduction de la vitesse du serpent
function reducespeed() {
    speed = speed - 2.5;
    console.log(speed);
}

// Fonction d'effet aléatoire
function randomEffect() {
    let randomEffect = Math.floor(Math.random() * 6) + 1;

    if (randomEffect === 1) {
        console.log("5 Walls spawn");

        wallRandomSpawn()
        wallRandomSpawn()
        wallRandomSpawn()
        wallRandomSpawn()
        wallRandomSpawn()
    } else if (randomEffect === 2) {
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
    } else if (randomEffect === 3) {
        console.log("add speed");
        addspeed()
    } if (randomEffect === 4) {
        console.log("remove 1 wall")
        removeLastWall()
    } else if (randomEffect === 5) {
        console.log("spawn 3 fapple")
        falseAppleDebugSpawn();
        falseAppleDebugSpawn();
        falseAppleDebugSpawn();
    } else if (randomEffect === 6) {
        console.log("reduce speed")
        reducespeed()
    }
}

// Fonction de gestion de la fin de partie
function handleDeath() {
    let gameoverElements = document.querySelectorAll('.gameover');
    gameoverElements.forEach(function (element) {
        element.style.display = 'block';
    });
    stopGame();
}

// Fonction de génération de faux fruits pour le débogage
function debugSpawnFapple() {
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
    falseAppleDebugSpawn();
}

// Fonction de génération de faux fruits pour le débogage
function falseAppleDebugSpawn() {
    let fApplePosY = Math.floor(Math.random() * (760 + 1));
    let fApplePosX = Math.floor(Math.random() * (760 + 1));
    let fApple = document.createElement('div');
    gamearea.appendChild(fApple);
    fApple.classList.add('fapple');

    fApple.style.top = fApplePosY + "px";
    fApple.style.left = fApplePosX + "px";

    console.log("fapple");
}

// Fonction de démarrage du jeu
function startGame() {
    let gameoverElements = document.querySelectorAll('.gameover');
    gameoverElements.forEach(function (element) {
        element.style.display = 'none';
    });
    gameInterval = setInterval(function () {
        moveSnake();
        detectFappleCollision();
        if (detectCollision()) {
            console.log("Collision détectée !");
        }

        if (speed === 0) {
            speed = 1;
        }

    }, 10);
}

// Fonction d'arrêt du jeu
function stopGame() {
    wallremove()
    fappleremove()
    clearInterval(gameInterval);
    speed = 5;
    document.querySelector('.snake-head').style.left = '385px';
    document.querySelector('.snake-head').style.top = '385px';
    document.querySelector('#score').textContent = 0;
    i = 0;
}

// Événement de changement de direction avec les touches du clavier
document.addEventListener("keydown", handleDirectionChange);

// Gestionnaire d'événement pour le démarrage du jeu
document.getElementById('launch').addEventListener("click", function () {
    startGame();
});

// Gestionnaire d'événement pour l'arrêt du jeu
document.getElementById('stop').addEventListener("click", function () {
    stopGame();
});

// Événement de chargement de la page pour la génération initiale de la pomme
document.addEventListener("DOMContentLoaded", appleRandomSpawn());