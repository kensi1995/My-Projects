var gameDisplay = document.getElementById("game-display");
var gameFields = document.getElementsByClassName("field");
var currentPlayer = "X";
var gameState = ["", "", "", "", "", "", "", "", ""];
var gameActive = true;
var gameRules = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

gameDisplay.innerHTML = playerTurn();

for (var i = 0; i < gameFields.length; i++) {
  const element = gameFields[i];
  element.setAttribute("data-index", i);
  element.addEventListener("click", gameFieldClicked);
}
function gameFieldClicked(event) {
  var selectedField = event.target;
  var selectedIndex = parseInt(selectedField.getAttribute("data-index"));

  if (gameState[selectedIndex] !== "" || !gameActive) {
    return;
  }

  upadateGameState(selectedField, selectedIndex);
  checkGameRules();
}

function upadateGameState(selectedField, index) {
  gameState[index] = currentPlayer;
  selectedField.innerHTML = currentPlayer;
}
function checkGameRules() {
  //Logika za provjeru

  for (let i = 0; i < gameRules.length; i++) {
    const rule = gameRules[i];
    var a = gameState[rule[0]];
    var b = gameState[rule[1]];
    var c = gameState[rule[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }

    if (a === b && b === c) {
      gameDisplay.innerHTML = winMessage();
      gameActive = false;
      return;
    }
  }

  var isDraw = !gameState.includes("");
  if (isDraw) {
    gameDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  changePlayer();
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameDisplay.innerHTML = playerTurn();
}

function playerTurn() {
  return `Player ${currentPlayer} je na potezu...`;
}
function winMessage() {
  return `Player ${currentPlayer} je pobjednik !`;
}

function drawMessage() {
  return `Nerijeseno je, igra je gotova...`;
}
function restartGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  gameDisplay.innerHTML = playerTurn();
  for (var i = 0; i < gameFields.length; i++) {
    const element = gameFields[i];
    element.innerHTML = "";
  }
}
