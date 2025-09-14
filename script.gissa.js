// 🎯 Variabler för spelet
let secretNumber;
let maxNumber;
let attempts = 0;
let timerInterval;
let seconds = 0;
let gameActive = false;

// 🔎 Hämta element från HTML
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-game");
const gameArea = document.getElementById("game-area");
const feedback = document.getElementById("feedback");
const timerDisplay = document.getElementById("timer");
const guessInput = document.getElementById("guess-input");
const submitGuess = document.getElementById("submit-guess");
const attemptsDisplay = document.getElementById("attempts");
const guessHistory = document.getElementById("guess-history");

// ⌨️ Enter för att gissa
guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitGuess.click();
  }
});

// 🕹️ Starta eller starta om spelet
startButton.addEventListener("click", () => {
  startGame();
});

// 🚀 Funktion för att starta spelet
function startGame() {
  maxNumber = parseInt(difficultySelect.value);
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  seconds = 0;
  gameActive = true;

  // Återställ UI
  guessHistory.innerHTML = "";
  feedback.textContent = "Gissa ett nummer!";
  attemptsDisplay.textContent = "Försök: 0";
  guessInput.value = "";
  guessInput.disabled = false;
  submitGuess.disabled = false;
  startButton.textContent = "Starta spel"; // Återställ knapptext om den ändrats

  // Visa spelområdet
  gameArea.style.display = "block";

  // Starta timer
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Tid: ${seconds} sek`;
  }, 1000);
}

// 🎯 Gissningslogik
submitGuess.addEventListener("click", () => {
  if (!gameActive) return;

  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > maxNumber) {
    feedback.textContent = `Skriv ett tal mellan 1 och ${maxNumber}`;
    return;
  }

  attempts++;
  attemptsDisplay.textContent = `Antal försök: ${attempts}`;

  const listItem = document.createElement("li");
  listItem.textContent = `Du gissade: ${guess}`;
  guessHistory.appendChild(listItem);

  if (guess === secretNumber) {
    feedback.textContent = `Rätt! Du gissade ${secretNumber} på ${attempts} försök och ${seconds} sekunder. 🎉`;
    endGame();
  } else if (guess < secretNumber) {
    feedback.textContent = "För lågt!";
  } else {
    feedback.textContent = "För högt!";
  }

  guessInput.value = "";
  guessInput.focus();
});

// 🛑 Avsluta spelet
function endGame() {
  clearInterval(timerInterval);
  gameActive = false;
  guessInput.disabled = true;
  submitGuess.disabled = true;
  startButton.textContent = "Spela igen";
}
