// Game State Variables
let currentDifficulty = "";
let currentScore = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let timeLeft = 60;
let gameTimer = null;
let currentQuestion = null;
let isEquationMode = false;

// Load saved stats from localStorage
let bestScore = parseInt(localStorage.getItem("mathGameBestScore")) || 0;
let gamesPlayed = parseInt(localStorage.getItem("mathGameGamesPlayed")) || 0;

// Initialize the game
document.addEventListener("DOMContentLoaded", function () {
  updateStats();
  showMainMenu();
});

// Start the game with selected difficulty
function startGame(difficulty) {
  currentDifficulty = difficulty;
  currentScore = 0;
  totalQuestions = 0;
  correctAnswers = 0;
  timeLeft = 60;
  isEquationMode = difficulty === "equation";

  // Update UI
  document.getElementById("main-menu").classList.add("hidden");

  if (isEquationMode) {
    document.getElementById("equation-section").classList.remove("hidden");
    document.getElementById("game-section").classList.add("hidden");
    document.getElementById("game-over").classList.add("hidden");

    // Start equation timer
    startEquationTimer();

    // Generate first equation
    generateEquation();

    // Focus on equation input
    document.getElementById("equation-answer-input").focus();
  } else {
    document.getElementById("game-section").classList.remove("hidden");
    document.getElementById("equation-section").classList.add("hidden");
    document.getElementById("game-over").classList.add("hidden");

    // Start regular timer
    startTimer();

    // Generate first question
    generateQuestion();

    // Focus on input
    document.getElementById("answer-input").focus();
  }
}

// Generate a new math question based on difficulty
function generateQuestion() {
  let question, answer;

  switch (currentDifficulty) {
    case "easy":
      [question, answer] = generateEasyQuestion();
      break;
    case "medium":
      [question, answer] = generateMediumQuestion();
      break;
    case "hard":
      [question, answer] = generateHardQuestion();
      break;
    case "super-hard":
      [question, answer] = generateSuperHardQuestion();
      break;
  }

  currentQuestion = { question, answer };
  document.getElementById("question-text").textContent = question;
  document.getElementById("answer-input").value = "";
  document.getElementById("feedback").classList.add("hidden");

  // Update progress bar
  updateProgressBar();
}

// Generate equation questions
function generateEquation() {
  const equationTypes = ["simple", "addition", "subtraction", "multiplication"];
  const type = equationTypes[Math.floor(Math.random() * equationTypes.length)];

  let equation, answer;

  switch (type) {
    case "simple":
      // Simple equations like x = 5
      answer = Math.floor(Math.random() * 20) + 1;
      equation = `x = ${answer}`;
      break;

    case "addition":
      // Equations like x + 3 = 8
      const addend = Math.floor(Math.random() * 10) + 1;
      const sum = Math.floor(Math.random() * 20) + addend + 1;
      answer = sum - addend;
      equation = `x + ${addend} = ${sum}`;
      break;

    case "subtraction":
      // Equations like x - 2 = 7
      const subtrahend = Math.floor(Math.random() * 10) + 1;
      const difference = Math.floor(Math.random() * 15) + 1;
      answer = difference + subtrahend;
      equation = `x - ${subtrahend} = ${difference}`;
      break;

    case "multiplication":
      // Equations like 3x = 15
      const multiplier = Math.floor(Math.random() * 8) + 2;
      const product = multiplier * (Math.floor(Math.random() * 10) + 1);
      answer = product / multiplier;
      equation = `${multiplier}x = ${product}`;
      break;
  }

  currentQuestion = { question: equation, answer: answer };
  document.getElementById("equation-text").textContent = equation;
  document.getElementById("equation-answer-input").value = "";
  document.getElementById("equation-feedback").classList.add("hidden");

  // Update equation progress bar
  updateEquationProgressBar();
}

// Generate easy questions (addition and subtraction)
function generateEasyQuestion() {
  const num1 = Math.floor(Math.random() * 50) + 1;
  const num2 = Math.floor(Math.random() * 50) + 1;
  const operations = ["+", "-"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let question, answer;

  if (operation === "+") {
    question = `${num1} + ${num2} = ?`;
    answer = num1 + num2;
  } else {
    // Ensure positive result for subtraction
    if (num1 < num2) {
      question = `${num2} - ${num1} = ?`;
      answer = num2 - num1;
    } else {
      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
    }
  }

  return [question, answer];
}

// Generate medium questions (multiplication and division)
function generateMediumQuestion() {
  const operations = ["×", "÷"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let question, answer;

  if (operation === "×") {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    question = `${num1} × ${num2} = ?`;
    answer = num1 * num2;
  } else {
    // Generate division with whole number result
    const num2 = Math.floor(Math.random() * 12) + 1;
    const result = Math.floor(Math.random() * 12) + 1;
    const num1 = num2 * result;
    question = `${num1} ÷ ${num2} = ?`;
    answer = result;
  }

  return [question, answer];
}

// Generate hard questions (mixed operations)
function generateHardQuestion() {
  const operations = ["+", "-", "×", "÷"];
  const operation1 = operations[Math.floor(Math.random() * operations.length)];
  const operation2 = operations[Math.floor(Math.random() * operations.length)];

  let question, answer;

  // Generate two-step problems
  if (operation1 === "×" || operation1 === "÷") {
    const num1 = Math.floor(Math.random() * 15) + 1;
    const num2 = Math.floor(Math.random() * 15) + 1;
    const num3 = Math.floor(Math.random() * 20) + 1;

    if (operation1 === "×") {
      const tempResult = num1 * num2;
      if (operation2 === "+") {
        question = `${num1} × ${num2} + ${num3} = ?`;
        answer = tempResult + num3;
      } else if (operation2 === "-") {
        question = `${num1} × ${num2} - ${num3} = ?`;
        answer = tempResult - num3;
      }
    } else {
      const tempResult = Math.floor(num1 / num2);
      if (operation2 === "+") {
        question = `${num1} ÷ ${num2} + ${num3} = ?`;
        answer = tempResult + num3;
      } else if (operation2 === "-") {
        question = `${num1} ÷ ${num2} - ${num3} = ?`;
        answer = tempResult - num3;
      }
    }
  } else {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const num3 = Math.floor(Math.random() * 50) + 1;

    if (operation1 === "+") {
      const tempResult = num1 + num2;
      if (operation2 === "+") {
        question = `${num1} + ${num2} + ${num3} = ?`;
        answer = tempResult + num3;
      } else if (operation2 === "-") {
        question = `${num1} + ${num2} - ${num3} = ?`;
        answer = tempResult - num3;
      }
    } else {
      const tempResult = num1 - num2;
      if (operation2 === "+") {
        question = `${num1} - ${num2} + ${num3} = ?`;
        answer = tempResult + num3;
      } else if (operation2 === "-") {
        question = `${num1} - ${num2} - ${num3} = ?`;
        answer = tempResult - num3;
      }
    }
  }

  return [question, answer];
}

// Generate super hard questions (power and root operations)
function generateSuperHardQuestion() {
  const operations = ["power", "root"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let question, answer;

  if (operation === "power") {
    // Generate power questions (e.g., 2^3, 5^2)
    const base = Math.floor(Math.random() * 10) + 1; // Base number 1-10
    const exponent = Math.floor(Math.random() * 4) + 2; // Exponent 2-5
    question = `${base}^${exponent} = ?`;
    answer = Math.pow(base, exponent);
  } else {
    // Generate root questions (e.g., √16, √25)
    const perfectSquares = [
      4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324,
      361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961,
    ];
    const squareRoot =
      perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
    question = `√${squareRoot} = ?`;
    answer = Math.sqrt(squareRoot);
  }

  return [question, answer];
}

// Check the user's answer
function checkAnswer() {
  const userAnswer = parseInt(document.getElementById("answer-input").value);
  const feedback = document.getElementById("feedback");
  const feedbackText = document.getElementById("feedback-text");

  if (isNaN(userAnswer)) {
    alert("لطفا جواب خود را وارد کنید");
    return;
  }

  totalQuestions++;

  if (userAnswer === currentQuestion.answer) {
    correctAnswers++;
    currentScore += calculatePoints();
    feedbackText.textContent = `عالی! پاسخ درست است. +${calculatePoints()} امتیاز`;
    feedbackText.style.color = "#28a745";
  } else {
    feedbackText.textContent = `اشتباه! پاسخ درست ${currentQuestion.answer} است`;
    feedbackText.style.color = "#dc3545";
  }

  // Update score display
  document.getElementById("current-score").textContent = currentScore;

  // Show feedback
  feedback.classList.remove("hidden");

  // Disable input and submit button temporarily
  document.getElementById("answer-input").disabled = true;
  document.getElementById("submit-btn").disabled = true;
}

// Check equation answer
function checkEquationAnswer() {
  const userAnswer = parseInt(
    document.getElementById("equation-answer-input").value
  );
  const feedback = document.getElementById("equation-feedback");
  const feedbackText = document.getElementById("equation-feedback-text");

  if (isNaN(userAnswer)) {
    alert("لطفا جواب خود را وارد کنید");
    return;
  }

  totalQuestions++;

  if (userAnswer === currentQuestion.answer) {
    correctAnswers++;
    currentScore += calculateEquationPoints();
    feedbackText.textContent = `عالی! پاسخ درست است. +${calculateEquationPoints()} امتیاز`;
    feedbackText.style.color = "#28a745";
  } else {
    feedbackText.textContent = `اشتباه! پاسخ درست ${currentQuestion.answer} است`;
    feedbackText.style.color = "#dc3545";
  }

  // Update score display
  document.getElementById("equation-score").textContent = currentScore;

  // Show feedback
  feedback.classList.remove("hidden");

  // Disable input and submit button temporarily
  document.getElementById("equation-answer-input").disabled = true;
  document.getElementById("equation-submit-btn").disabled = true;
}

// Calculate points based on difficulty and time
function calculatePoints() {
  let basePoints = 10;

  switch (currentDifficulty) {
    case "easy":
      basePoints = 10;
      break;
    case "medium":
      basePoints = 15;
      break;
    case "hard":
      basePoints = 20;
      break;
    case "super-hard":
      basePoints = 25;
      break;
  }

  // Bonus points for quick answers
  if (timeLeft > 45) basePoints += 5;
  else if (timeLeft > 30) basePoints += 3;
  else if (timeLeft > 15) basePoints += 1;

  return basePoints;
}

// Calculate points for equations
function calculateEquationPoints() {
  let basePoints = 30; // Higher points for equations as they're more challenging

  // Bonus points for quick answers
  if (timeLeft > 45) basePoints += 10;
  else if (timeLeft > 30) basePoints += 6;
  else if (timeLeft > 15) basePoints += 3;

  return basePoints;
}

// Move to next question
function nextQuestion() {
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("answer-input").disabled = false;
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("answer-input").focus();

  generateQuestion();
}

// Move to next equation
function nextEquation() {
  document.getElementById("equation-feedback").classList.add("hidden");
  document.getElementById("equation-answer-input").disabled = false;
  document.getElementById("equation-submit-btn").disabled = false;
  document.getElementById("equation-answer-input").focus();

  generateEquation();
}

// Start the game timer
function startTimer() {
  gameTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Start equation timer
function startEquationTimer() {
  gameTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("equation-time").textContent = timeLeft;

    if (timeLeft <= 0) {
      endEquationGame();
    }
  }, 1000);
}

// End the game
function endGame() {
  clearInterval(gameTimer);

  // Update stats
  gamesPlayed++;
  if (currentScore > bestScore) {
    bestScore = currentScore;
    localStorage.setItem("mathGameBestScore", bestScore);
  }
  localStorage.setItem("mathGameGamesPlayed", gamesPlayed);

  // Show game over screen
  document.getElementById("game-section").classList.add("hidden");
  document.getElementById("game-over").classList.remove("hidden");

  // Update final score and accuracy
  document.getElementById("final-score").textContent = currentScore;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
  document.getElementById("accuracy").textContent = `${accuracy}%`;

  updateStats();
}

// End equation game
function endEquationGame() {
  clearInterval(gameTimer);

  // Update stats
  gamesPlayed++;
  if (currentScore > bestScore) {
    bestScore = currentScore;
    localStorage.setItem("mathGameBestScore", bestScore);
  }
  localStorage.setItem("mathGameGamesPlayed", gamesPlayed);

  // Show game over screen
  document.getElementById("equation-section").classList.add("hidden");
  document.getElementById("game-over").classList.remove("hidden");

  // Update final score and accuracy
  document.getElementById("final-score").textContent = currentScore;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
  document.getElementById("accuracy").textContent = `${accuracy}%`;

  updateStats();
}

// Play again with same difficulty
function playAgain() {
  startGame(currentDifficulty);
}

// Show main menu
function showMainMenu() {
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("game-section").classList.add("hidden");
  document.getElementById("equation-section").classList.add("hidden");
  document.getElementById("game-over").classList.add("hidden");

  if (gameTimer) {
    clearInterval(gameTimer);
  }
}

// Update statistics display
function updateStats() {
  document.getElementById("best-score").textContent = bestScore;
  document.getElementById("games-played").textContent = gamesPlayed;
}

// Update progress bar
function updateProgressBar() {
  const progress = (totalQuestions / 10) * 100; // Assuming 10 questions per game
  document.getElementById("progress-fill").style.width = `${Math.min(
    progress,
    100
  )}%`;
}

// Update equation progress bar
function updateEquationProgressBar() {
  const progress = (totalQuestions / 10) * 100; // Assuming 10 questions per game
  document.getElementById("equation-progress-fill").style.width = `${Math.min(
    progress,
    100
  )}%`;
}

// Handle Enter key in answer input
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (!document.getElementById("answer-input").disabled && !isEquationMode) {
      checkAnswer();
    } else if (
      !document.getElementById("equation-answer-input").disabled &&
      isEquationMode
    ) {
      checkEquationAnswer();
    }
  }
});

// Add some fun animations
function addAnimation(element, animationClass) {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, 500);
}

// Add click sound effect (optional)
function playClickSound() {
  // You can add actual sound files here
  console.log("Click!");
}

// Add hover effects to buttons
document.addEventListener("mouseover", function (e) {
  if (e.target.tagName === "BUTTON") {
    e.target.style.transform = "scale(1.05)";
  }
});

document.addEventListener("mouseout", function (e) {
  if (e.target.tagName === "BUTTON") {
    e.target.style.transform = "scale(1)";
  }
});
