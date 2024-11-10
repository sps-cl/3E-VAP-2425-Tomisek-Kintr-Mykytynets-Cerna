const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameState = Array(9).fill(null);
let currentPlayer = 'X';

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.emit('gameState', { gameState, currentPlayer });

  socket.on('makeMove', (index) => {
    if (gameState[index] === null) {
      gameState[index] = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      io.emit('gameState', { gameState, currentPlayer });
      checkGameStatus();
    }
  });

  socket.on('resetGame', () => {
    gameState.fill(null);
    currentPlayer = 'X';
    io.emit('gameState', { gameState, currentPlayer });
  });
});

function checkGameStatus() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      io.emit('gameOver', { winner: gameState[a] });
      return;
    }
  }

  if (!gameState.includes(null)) {
    io.emit('gameOver', { winner: 'Draw' });
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
