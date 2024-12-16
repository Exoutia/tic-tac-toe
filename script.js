const Gameboard = (() => {
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push("");
  }
  const getBoard = () => board;
  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    return board.fill("");
  };
  return { getBoard, setMark, resetBoard };
})();

const DisplayController = (() => {
  const boardContainer = document.querySelector(".board");
  const statusDisplay = document.querySelector(".status");

  const renderBoard = () => {
    boardContainer.innerHTML = "";
    Gameboard.getBoard().forEach((mark, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = mark;
      cell.addEventListener("click", () => Game.playTurn(index));
      boardContainer.appendChild(cell);
    });
  };

  const updateStatus = (message) => {
    statusDisplay.textContent = message;
  };

  return { renderBoard, updateStatus };
})();

const Player = (name, mark) => {
  return { name, mark };
};

const Game = (() => {
  let players = [];
  let currPlayerIndex = 0;
  let isGameOver = false;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startGame = (playerName, player2name) => {
    players = [Player(playerName, "X"), Player(player2name, "0")];
    currPlayerIndex = 0;
    isGameOver = false;
    Gameboard.resetBoard();
    DisplayController.renderBoard();
    DisplayController.updateStatus(`${players[currPlayerIndex].name}'s turn`);
  };

  const playTurn = (index) => {
    if (isGameOver) return;
    const currPlayer = players[currPlayerIndex];
    if (Gameboard.setMark(index, currPlayer.mark)) {
      DisplayController.renderBoard();
      if (checkWinner(currPlayer.mark)) {
        DisplayController.updateStatus(`${currPlayer.name} wins!`);
        isGameOver = true;
        return;
      }
      if (checkTie()) {
        DisplayController.updateStatus(`It's a tie!`);
        isGameOver = true;
        return;
      }
      currPlayerIndex = 1 - currPlayerIndex; // Switch player
      DisplayController.updateStatus(`${players[currPlayerIndex].name}'s turn`);
    }
  };

  const checkWinner = (mark) => {
    return winningCombinations.some((combination) =>
      combination.every((index) => Gameboard.getBoard()[index] === mark),
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  return { startGame, playTurn };
})();

document.getElementById("startBtn").addEventListener("click", () => {
  const player1 = document.getElementById("player1").value || "Player 1";
  const player2 = document.getElementById("player2").value || "Player 2";
  Game.startGame(player1, player2);
});
