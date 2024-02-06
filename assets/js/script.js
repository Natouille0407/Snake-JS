// <div class="snake-body">.</div>

document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
    }
});

function moveUp() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = snakeHead.getBoundingClientRect();
    snakeHead.style.top = currentPosition.bottom + 1 + "px";
}

function moveDown() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = snakeHead.getBoundingClientRect();
    snakeHead.style.top = currentPosition.top + 1 + "px";
}

function moveLeft() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = snakeHead.getBoundingClientRect();
    snakeHead.style.left = currentPosition.right + 1 + "px";
}

function moveRight() {
    let snakeHead = document.querySelector(".snake-head");
    let currentPosition = snakeHead.getBoundingClientRect();
    snakeHead.style.left = currentPosition.left + 1 + "px";
}