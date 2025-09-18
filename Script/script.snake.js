const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("tabindex", "0");
canvas.focus();

const box = 20;
let snake = [];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food;
let score = 0;
let snakeHighscore = localStorage.getItem("snakeHighscore") || 0;
let game;

const scoreDisplay = document.getElementById("snake-score");
const highscoreDisplay = document.getElementById("snake-highscore");
highscoreDisplay.textContent = "Highscore: " + snakeHighscore;

// Tangentstyrning (desktop)
document.addEventListener("keydown", changeDirection);

// Starta eller starta om spelet
document.getElementById("start-snake").addEventListener("click", () => {
  clearInterval(game);
  resetGame();
  game = setInterval(draw, 150);
  document.getElementById("start-snake").textContent = "Spela igen";
});

// Återställ spelet
function resetGame() {
  snake = [{ x: 7 * box, y: 7 * box }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  score = 0;
  generateFood();
  updateScore();
  canvas.style.backgroundColor = "#f6efe7"; // återställ färg
}

// Rita spelplanen varje frame
function draw() {
  direction = nextDirection;

  ctx.fillStyle = "#f6efe7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#1b3b2f";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#5c4033" : "#3e5c4b";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#e9dcc9";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#d21919ff";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
  ctx.fill();

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  let newHead = { x: headX, y: headY };

  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    collision(newHead, snake.slice(1))
  ) {
    clearInterval(game);
    blinkCanvas();
    setTimeout(() => {
      alert("Game Over! Din poäng: " + score);
    }, 200);
    return;
  }

  if (headX === food.x && headY === food.y) {
    generateFood();
    score++;
    updateScore();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

// Blinkning vid krock
function blinkCanvas() {
  canvas.style.backgroundColor = "#ff4d4d"; // röd blink
  setTimeout(() => {
    canvas.style.backgroundColor = "#f6efe7"; // tillbaka till normal
  }, 150);
}

// Tangentstyrning med scrollskydd
function changeDirection(event) {
  const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
  if (keys.includes(event.key)) {
    event.preventDefault();
    if (event.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  }
}

// Touchstyrning (mobilknappar)
function setDirection(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
  if (dir === "UP" && direction !== "DOWN") nextDirection = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") nextDirection = "DOWN";
}

// Generera ny mat
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// Kollision med kroppen
function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}

// Uppdatera poäng och highscore
function updateScore() {
  scoreDisplay.textContent = "Poäng: " + score;

  if (score > snakeHighscore) {
    snakeHighscore = score;
    localStorage.setItem("snakeHighscore", snakeHighscore);
    highscoreDisplay.textContent = "Highscore: " + snakeHighscore;
  }
}

// Direkt touchrespons utan fördröjning
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#touch-controls button");
  buttons.forEach(button => {
    button.addEventListener("touchstart", (event) => {
      event.preventDefault();
      const dir = button.textContent.includes("⬆️") ? "UP" :
                  button.textContent.includes("⬇️") ? "DOWN" :
                  button.textContent.includes("⬅️") ? "LEFT" : "RIGHT";
      if (typeof setDirection === "function") {
        setDirection(dir);
      }
    });
  });
});