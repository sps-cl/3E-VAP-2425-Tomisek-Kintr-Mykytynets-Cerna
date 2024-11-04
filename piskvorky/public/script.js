const board = Array(9).fill(null);
let currentPlayer = 'X';

const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');

function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => handleCellClick(index));
        gameBoard.appendChild(cellDiv);
    });
}

function handleCellClick(index) {
    if (!board[index]) {
        board[index] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        renderBoard();
        checkWinner();
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert(`Hráč ${board[a]} vyhrál!`);
            resetGame();
            return;
        }
    }
    
    if (!board.includes(null)) {
        alert("Remíza!");
        resetGame();
    }
}

function resetGame() {
    board.fill(null);
    currentPlayer = 'X';
    renderBoard();
}

resetButton.addEventListener('click', resetGame);

renderBoard();