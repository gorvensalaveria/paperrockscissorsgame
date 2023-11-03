const winningRules = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  spock: ["scissors", "rock"],
  lizard: ["spock", "paper"],
};

let panel = document.querySelector("#panel");
let playAgain = document.querySelector("#playAgain");
let gameMode = document.querySelector(".game-mode");
let playerUser = document.querySelector(".player--user");
let playerHouse = document.querySelector(".player--house");
let rules = document.querySelector("#rules");
let closeRulesTop = document.querySelector("#closeRulesTop");
let closeRulesBottom = document.querySelector("#closeRulesBottom");
let gameModeToggle = document.querySelector("#toggle");
let modal = document.querySelector(".modal");

let currentScore = 0;

window.addEventListener("load", startGame);
rules.addEventListener("click", toggleModal);
closeRulesTop.addEventListener("click", closeModal);
closeRulesBottom.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.remove("modal--visible");
}

function toggleModal() {
  modal.classList.toggle("modal--visible");
}

function toggleGameMode() {
  if (gameModeToggle.querySelector("input").checked) {
    switchToGameMode("bonus");
    addOptions(3, 5, 1000, 1000, 1200);
  } else {
    switchToGameMode("original");
    let options = playerUser.getElementsByClassName("option");
    while (options.length > 3) {
      playerUser.removeChild(options[options.length - 1]);
    }
  }
}

function switchToGameMode(mode) {
  if (mode == "original") {
    document.body.classList.add("mode-original");
    document.body.classList.remove("mode-bonus");
  } else if (mode == "bonus") {
    document.body.classList.add("mode-bonus");
    document.body.classList.remove("mode-original");
  }
}

function addOptions(
  firstOption,
  lastOption,
  delayOptionsCreated,
  delayPanelChoosing,
  delayOptionsReady
) {
  setTimeout(() => {
    for (let i = firstOption; i < lastOption; i++) {
      let newOption = document.createElement("div");
      let newOptionLogo = document.createElement("div");
      newOptionLogo.classList.add("option__logo");
      newOption.appendChild(newOptionLogo);
      let newOptionName = Object.getOwnPropertyNames(winningRules)[i];
      newOption.id = newOptionName;
      newOption.classList.add(
        "option",
        "option--not-ready",
        "option--" + newOptionName
      );
      playerUser.appendChild(newOption);
    }
  }, delayOptionsCreated);

  setTimeout(() => {
    panel.classList.add("panel--user-choosing");
  }, delayPanelChoosing);

  setTimeout(() => {
    let options = playerUser.querySelectorAll(".option");
    for (let i = 0; i < options.length; i++) {
      options[i].classList.remove("option--not-ready");
      options[i].addEventListener("click", selectOption);
    }
  }, delayOptionsReady);
}

function startGame() {
  gameMode.classList.remove("game-mode--hidden");
  gameModeToggle.addEventListener("change", toggleGameMode);
  let optionsToAdd = 0;
  if (gameModeToggle.querySelector("input").checked) {
    optionsToAdd = 5;
    switchToGameMode("bonus");
  } else {
    optionsToAdd = 3;
    switchToGameMode("original");
  }
  addOptions(0, optionsToAdd, 0, 1000, 2000);
}

function selectOption(e) {
  panel.classList.remove("panel--user-choosing");
  panel.classList.add("panel--user-chosen");
  gameModeToggle.removeEventListener("change", toggleGameMode);
  gameMode.classList.add("game-mode--hidden");
  let userOption = e.currentTarget;
  let options = playerUser.querySelectorAll(".option");

  for (let i = 0; i < options.length; i++) {
    options[i].removeEventListener("click", selectOption);
    if (options[i] == userOption) {
    } else {
      options[i].classList.add("option--hidden");
      playerHouse.appendChild(options[i]);
    }
  }
  setTimeout(() => {
    panel.classList.remove("panel--user-chosen");
    panel.classList.add("panel--house-choosing");
  }, 1500);
  setTimeout(() => {
    houseChooses();
  }, 3000);
}

function houseChooses() {
  let optionsForHouse = playerHouse.getElementsByClassName("option");
  let random = Math.floor(Math.random() * optionsForHouse.length) + 20; // Increase by 20 just to increase time for choosing animation
  let iterations = 0;

  // House decides by taking its first option to the bottom of the list 'random' times and then deleting all options except the one at the bottom
  let interval = setInterval(() => {
    optionsForHouse[0].classList.remove("option--hidden");
    playerHouse.appendChild(optionsForHouse[0]);
    iterations++;
    if (iterations >= random) {
      while (optionsForHouse.length > 1) {
        playerHouse.removeChild(optionsForHouse[0]);
      }
      clearInterval(interval);
      decideWinner();
    }
  }, 100);
}

function decideWinner() {
  let resultMessage = document.querySelector("#result");
  let userChosenOption = playerUser.querySelector(".option");
  let houseChosenOption = playerHouse.querySelector(".option");
  let doesUserWin = winningRules[userChosenOption.id].includes(
    houseChosenOption.id
  );
  setTimeout(() => {
    panel.classList.remove("panel--house-choosing");
    panel.classList.add("panel--game-ended");
    if (doesUserWin) {
      resultMessage.innerHTML = "You win";
      playerUser.classList.add("player--winning");
    } else {
      resultMessage.innerHTML = "You lose";
      playerHouse.classList.add("player--winning");
    }
    playAgain.addEventListener("click", restartGame);
  }, 500);

  setTimeout(() => {
    updateScore(doesUserWin);
  }, 2500);
}

function updateScore(hasUserWon) {
  let oldScore = document.querySelector(".score__value");
  let classToFlash = "";
  let classForOldScore = "";
  let classForNewScore = "";

  if (hasUserWon) {
    currentScore++;
    classToFlash = "score--user-wins";
    classForOldScore = "score__value--less";
    classForNewScore = "score__value--more";
  } else {
    currentScore--;
    classToFlash = "score--user-loses";
    classForOldScore = "score__value--more";
    classForNewScore = "score__value--less";
  }

  let newScore = oldScore.cloneNode(true);
  newScore.classList.add(`${classForNewScore}`);
  newScore.innerHTML = currentScore;
  oldScore.parentElement.appendChild(newScore);
  oldScore.parentElement.parentElement.classList.add(classToFlash);

  setTimeout(() => {
    oldScore.parentElement.parentElement.classList.remove(classToFlash);
    oldScore.classList.add(classForOldScore);
    newScore.classList.remove(classForNewScore);
  }, 100);

  setTimeout(() => {
    oldScore.remove();
  }, 1200);
}

function finishGame() {
  playAgain.removeEventListener("click", startGame);

  let optionsRemaining = document.querySelectorAll(".option");
  for (let i = 0; i < optionsRemaining.length; i++) {
    optionsRemaining[i].remove();
  }
  panel.classList.remove(
    "panel--user-choosing",
    "panel--user-chosen",
    "panel--house-choosing",
    "panel--game-ended"
  );
  playerUser.classList.remove("player--winning");
  playerHouse.classList.remove("player--winning");
}

function restartGame() {
  finishGame();
  setTimeout(() => {
    startGame();
  }, 1000);
}
