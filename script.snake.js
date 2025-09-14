const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("tabindex", "0");
canvas.focus();

const box = 20;
let snake = [];
let direction = "RIGHT";
let food;
let score = 0;
let game;

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
  score = 0;
  generateFood();
  updateScore();
}

// Rita spelplanen varje frame
function draw() {
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

  ctx.fillStyle = "#1b3b2f";
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
    alert("Game Over! Din poäng: " + score);
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

// Tangentstyrning med scrollskydd
function changeDirection(event) {
  const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
  if (keys.includes(event.key)) {
    event.preventDefault();
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  }
}

// Touchstyrning (mobilknappar)
function setDirection(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

// Generera ny mat
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

//  Kollision med kroppen
function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}

// Uppdatera poäng
function updateScore() {
  const scoreDisplay = document.getElementById("snake-score");
  if (scoreDisplay) {
    scoreDisplay.textContent = "Poäng: " + score;
  }
}
