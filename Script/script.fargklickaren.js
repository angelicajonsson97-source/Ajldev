document.addEventListener("DOMContentLoaded", () => {
  const baseColors = ["röd", "grön", "blå", "gul"];
  const extraColors = ["lila", "orange", "rosa", "brun"];
  const colorMap = {
    "röd": "red",
    "grön": "green",
    "blå": "blue",
    "gul": "yellow",
    "lila": "purple",
    "orange": "orange",
    "rosa": "pink",
    "brun": "brown"
  };

  let currentColors = [...baseColors];
  let currentColor = "";
  let score = 0;
  let highscore = localStorage.getItem("colorHighscore") || 0;
  let timeLimit = 3;
  let countdownTimer;
  let startTime;

  const targetColor = document.getElementById("target-color");
  const feedback = document.getElementById("color-feedback");
  const scoreDisplay = document.getElementById("color-score");
  const startBtn = document.getElementById("start-color-game");
  const buttonContainer = document.getElementById("color-buttons");

  const countdownDisplay = document.createElement("p");
  countdownDisplay.id = "color-timer";
  countdownDisplay.textContent = `Tid kvar: ${timeLimit} sek`;
  startBtn.insertAdjacentElement("beforebegin", countdownDisplay);

  const highscoreDisplay = document.createElement("p");
  highscoreDisplay.id = "color-highscore";
  highscoreDisplay.textContent = `Highscore: ${highscore}`;
  scoreDisplay.insertAdjacentElement("afterend", highscoreDisplay);

  startBtn.addEventListener("click", startGame);

  function startGame() {
    score = 0;
    timeLimit = 3;
    currentColors = [...baseColors];
    scoreDisplay.textContent = "Poäng: 0";
    feedback.textContent = "Tryck på rätt färg!";
    countdownDisplay.textContent = `Tid kvar: ${timeLimit} sek`;
    nextRound();
  }

  function updateDifficulty() {
    if (score >= 10) {
      timeLimit = 1.5;
      currentColors = [...baseColors, ...extraColors];
      feedback.textContent = "Expertläge! Fler färger och bara 1,5 sekunder!";
    } else if (score >= 5) {
      timeLimit = 2;
      feedback.textContent = "Snabbare nu! Du har 2 sekunder!";
    } else {
      timeLimit = 3;
      currentColors = [...baseColors];
    }
  }

  function nextRound() {
    clearInterval(countdownTimer);
    updateDifficulty();
    shuffleButtons();
    currentColor = currentColors[Math.floor(Math.random() * currentColors.length)];
    targetColor.textContent = currentColor;
    startCountdown();
  }

  function shuffleButtons() {
    buttonContainer.innerHTML = "";
    const shuffled = [...currentColors].sort(() => Math.random() - 0.5);

    shuffled.forEach(color => {
      const btn = document.createElement("button");
      btn.className = "color-btn";
      btn.setAttribute("data-color", color);
      btn.style.backgroundColor = colorMap[color];
      btn.addEventListener("click", () => handleClick(color));
      buttonContainer.appendChild(btn);
    });
  }

  function startCountdown() {
    let timeLeft = timeLimit;
    startTime = Date.now();
    countdownDisplay.textContent = `Tid kvar: ${timeLeft} sek`;

    countdownTimer = setInterval(() => {
      timeLeft--;
      countdownDisplay.textContent = `Tid kvar: ${timeLeft} sek`;

      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        endGame("Tiden tog slut!");
      }
    }, 1000);
  }

  function handleClick(clickedColor) {
    if (!currentColor) return;
    clearInterval(countdownTimer);

    const reactionTime = (Date.now() - startTime) / 1000;
    let bonus = 0;
    if (reactionTime < 0.5) bonus = 3;
    else if (reactionTime < 1) bonus = 2;
    else if (reactionTime < 2) bonus = 1;

    if (clickedColor === currentColor) {
      score += 1 + bonus;
      feedback.textContent = `Rätt! +${1 + bonus} poäng`;
      scoreDisplay.textContent = `Poäng: ${score}`;
      updateHighscore();
      showBonusAnimation(bonus, clickedColor);
      nextRound();
    } else {
      endGame("Fel färg!");
    }
  }

  function showBonusAnimation(bonus, clickedColor) {
    if (bonus === 0) return;

    const btn = [...document.querySelectorAll(".color-btn")]
      .find(b => b.getAttribute("data-color") === clickedColor);

    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const containerRect = buttonContainer.getBoundingClientRect();

    const anim = document.createElement("div");
    anim.className = "bonus-animation";
    anim.textContent = `+${bonus}`;

    anim.style.left = `${rect.left - containerRect.left + rect.width / 2 - 10}px`;
    anim.style.top = `${rect.top - containerRect.top - 10}px`;

    buttonContainer.appendChild(anim);

    setTimeout(() => {
      anim.remove();
    }, 800);
  }

  function endGame(message) {
    feedback.textContent = `${message} Spelet över.`;
    countdownDisplay.textContent = "";
    currentColor = "";
    buttonContainer.innerHTML = "";
  }

  function updateHighscore() {
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("colorHighscore", highscore);
      highscoreDisplay.textContent = `Highscore: ${highscore}`;
    }
  }
});