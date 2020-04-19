const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

const em = document.querySelector("em");
const xAndO = document.querySelectorAll(".box");
const currentTheme = localStorage.getItem("theme");
const gameMode = document.querySelector(".game_status");
const gameWinnerElement = document.querySelector(".game_winner");
const reset = document.querySelector(".reset");

document.documentElement.setAttribute("data-theme", currentTheme);
currentTheme === "dark"
  ? (toggleSwitch.checked = true)
  : (toggleSwitch.checked = false);

const switchTheme = e => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    em.innerHTML = "Enable Light Mode!";
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    em.innerHTML = "Enable Dark Mode!";
    localStorage.setItem("theme", "light");
  }
};

const winningMatch = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let gameActive = true;

const gameElement = (position, shape) =>
  `<div class=${shape} id=~${position}></div>`;

let gameStatus = ["", "", "", "", "", "", "", "", ""];

const handleResultValidation = () => {
  let roundWon = false;
  let winner;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningMatch[i];
    let a = gameStatus[winCondition[0]];
    let b = gameStatus[winCondition[1]];
    let c = gameStatus[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }

    if (a === b && b === c) {
      roundWon = true;
      gameActive = false;
      winner = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    gameWinnerElement.innerHTML = `${winner[0]} won the game`;
    gameMode.innerHTML = "Game Ended";
    gameActive = false;
    return;
  }

  let roundDraw = !gameStatus.includes("");
  if (roundDraw) {
    gameWinnerElement.innerHTML = "Draw";
    gameMode.innerHTML = "Game Ended";
    gameActive = false;
    return;
  }
};

const addGameItem = e => {
  const { id } = e.target;
  const checkEmpty = gameStatus.filter(empty => empty == "");
  if (gameActive) {
    if (gameStatus[id] === "") {
      gameMode.innerHTML = "Game started";
      updateBox(id, "O");
    }
    if (checkEmpty.length !== 1) {
      const computerId = computerPlay(id);
      updateBox(computerId, "X");
    }
  }
  handleResultValidation();
};

const random = position => {
  const roll = Math.round(Math.random() * (9 - 1) + 1);
  return roll == position ? random(position) : roll;
};

const computerPlay = position => {
  const randomNumber = random(position);
  if (gameStatus[randomNumber] !== "") {
    return computerPlay(position);
  }
  return randomNumber;
};

const updateBox = (id, shape) => {
  const findElement = document.getElementById(id);
  gameStatus[id] = shape;
  findElement.innerHTML = gameElement(id, shape);
  findElement.setAttribute("data-status", `${shape}`);
  console.log(gameStatus, "gameStatus");
};

const resetGame = e => {
  gameActive = true;
  gameStatus = ["", "", "", "", "", "", "", "", ""];
  xAndO.forEach(innerBox => {
    innerBox.innerHTML = "";
    innerBox.setAttribute("data-status", "");
  });
  gameMode.innerHTML = "";
  gameWinnerElement.innerHTML = "";
};



toggleSwitch.addEventListener("change", switchTheme, false);
reset.addEventListener("click", resetGame);
xAndO.forEach(box => box.addEventListener("click", addGameItem));
