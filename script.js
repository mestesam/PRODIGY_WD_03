
// Classes pour les joueurs
const X_CLASS = 'x';
const O_CLASS = 'o';

// Combinaisons gagnantes
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Première ligne
  [3, 4, 5], // Deuxième ligne
  [6, 7, 8], // Troisième ligne
  [0, 3, 6], // Première colonne
  [1, 4, 7], // Deuxième colonne
  [2, 5, 8], // Troisième colonne
  [0, 4, 8], // Diagonale principale
  [2, 4, 6]  // Diagonale secondaire
];

// Sélection des éléments DOM
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const winningMessageElement = document.querySelector('.message');
const winningMessageTextElement = document.querySelector('.winning-message-text');
const restartButton = document.getElementById('restartButton');
const playerVsPlayerButton = document.getElementById('playerVsPlayer');
const playerVsAIButton = document.getElementById('playerVsAI');

// Détermine si c'est le tour du joueur O
let oTurn;
let aiMode = false;

// Initialiser le jeu
playerVsPlayerButton.addEventListener('click', () => startGame(false));
playerVsAIButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', () => startGame(aiMode));

function startGame(isAiMode) {
  aiMode = isAiMode;
  oTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.style.display = 'none';
}

// Gérer le clic sur une case
function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    if (aiMode && oTurn) {
      setTimeout(aiMove, 500); // L'IA joue après 500ms
    }
    setBoardHoverClass();
  }
}

// Fin du jeu
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'No Result !';
  } else {
    winningMessageTextElement.innerText = `${oTurn ? "O Player" : "X Player"}  Won !`;
  }
  winningMessageElement.style.display = 'flex';
}

// Vérifier s'il y a match nul
function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

// Placer le marqueur sur la case
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

// Changer de joueur
function swapTurns() {
  oTurn = !oTurn;
}

// Définir la classe de survol du tableau
function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

// Vérifier s'il y a un gagnant
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

// Mouvement de l'IA utilisant l'algorithme Minimax
function aiMove() {
  const bestMove = minimax([...cellElements], O_CLASS).index;
  const cell = cellElements[bestMove];
  placeMark(cell, O_CLASS);

  if (checkWin(O_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

// Fonction Minimax
function minimax(newBoard, player) {
  const availSpots = newBoard.filter(cell => {
    return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
  });

  if (checkWin(X_CLASS)) {
    return { score: -10 };
  } else if (checkWin(O_CLASS)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard.indexOf(availSpots[i]);
    newBoard[move.index].classList.add(player);

    if (player === O_CLASS) {
      const result = minimax(newBoard, X_CLASS);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, O_CLASS);
      move.score = result.score;
    }

    newBoard[move.index].classList.remove(player);
    moves.push(move);
  }

  let bestMove;
  if (player === O_CLASS) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
