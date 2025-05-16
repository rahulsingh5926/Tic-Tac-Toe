import { useState, useEffect } from "react";
import "./App.css";
import ScoreBoard from "./ScoreBoard";

const TicTacToe = () => {
  // State variables for game configuration and logic
  const [size, setSize] = useState(3); // Size of the board (3x3, 4x4, 5x5)
  const [started, setStarted] = useState(false); // Tracks whether the game has started
  const [count, setCount] = useState(0); // Keeps track of the number of moves
  const [arr, setArr] = useState([]); // 2D array representing the board
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [theme, setTheme] = useState("light"); // Theme state - "light" or "dark"

  // Scoreboard tracking
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  // Sound effects
  const playWinSound = () => {
    new Audio(process.env.PUBLIC_URL + "sound/winning_sound.wav").play();
  };

  const playDrawSound = () => {
    new Audio(process.env.PUBLIC_URL + "sound/draw_sound.mp3").play();
  };

  const buttonClickSound = () => {
    new Audio(process.env.PUBLIC_URL + "sound/pop_sound.mp3").play();
  };

  // Reset scoreboard values to zero
  const resetScores = () => {
    setXWins(0);
    setOWins(0);
    setTotalGames(0);
  };

  // Whenever game starts or board size changes, reset the board
  useEffect(() => {
    if (started) resetBoard();
  }, [size, started]);

  // Apply theme to the document body
  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#222" : "#fff";
    document.body.style.color = theme === "dark" ? "#eee" : "#000";
  }, [theme]);

  // Reset the board to an empty state
  const resetBoard = () => {
    setArr(
      Array(size)
        .fill()
        .map(() => Array(size).fill(""))
    );
    setCount(0);
    setWinner(null);
    setWinningCells([]);
  };

  // Start a new game
  const startGame = () => {
    resetBoard();
    setStarted(true);
  };

  // Handle cell clicks during the game
  const buttonClick = (i, j) => {
    if (arr[i][j] || winner) return; // Ignore clicks if cell is already filled or game is over

    buttonClickSound();

    const newArr = arr.map((row) => [...row]);
    newArr[i][j] = count % 2 === 0 ? "⭕" : "❌"; // Alternate turns

    setArr(newArr);
    setCount((prev) => prev + 1);
    checkForWin(newArr);
  };

  // Check the board to see if someone has won or if it's a draw
  const checkForWin = (board) => {
    const lines = [];

    // Generate all possible winning lines (rows, columns)
    for (let i = 0; i < size; i++) {
      lines.push(board[i].map((_, j) => [i, j])); // Row
      lines.push(board.map((_, j) => [j, i])); // Column
    }

    // Add diagonal and anti-diagonal
    lines.push(board.map((_, i) => [i, i])); // Main Diagonal
    lines.push(board.map((_, i) => [i, size - 1 - i])); // Anti Diagonal

    // Check all lines for a win
    for (let line of lines) {
      const [firstRow, firstCol] = line[0];
      const firstValue = board[firstRow][firstCol];

      if (firstValue && line.every(([r, c]) => board[r][c] === firstValue)) {
        setWinner(firstValue);
        setWinningCells(line);
        setTotalGames((g) => g + 1);
        playWinSound();
        if (firstValue === "❌") setXWins((w) => w + 1);
        else if (firstValue === "⭕") setOWins((w) => w + 1);
        return;
      }
    }

    // If no empty cells are left and no winner, it's a draw
    if (board.flat().every((cell) => cell)) {
      setWinner("Draw");
      playDrawSound();
      setTotalGames((g) => g + 1);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`container ${theme}`}>
      <h2 className="title">Tic-Tac-Toe</h2>
      <ScoreBoard xWins={xWins} oWins={oWins} totalGames={totalGames} onReset={resetScores} />

      <div className="controls">
        <label className="label">Board Size:</label>
        <select
          onChange={(e) => setSize(Number(e.target.value))}
          className="select"
          style={{ backgroundColor: theme === "dark" ? "#444" : "#e0e0e0" }}
          value={size}
        >
          {[3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} x {n}
            </option>
          ))}
        </select>

        <button onClick={startGame} className="startButton">
          Start
        </button>
        <button onClick={toggleTheme} className="themeButton">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {started && (
        <div style={{ marginTop: 20 }}>
          <h3 className="turnText">
            {winner
              ? winner === "Draw"
                ? "It's a Draw!"
                : `${winner} Wins!`
              : `${count % 2 === 0 ? "⭕" : "❌"}'s Turn`}
          </h3>

          <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 60px)` }}>
            {arr.map((row, i) =>
              row.map((val, j) => {
                const isWinning = winningCells.some(([r, c]) => r === i && c === j);
                return (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => buttonClick(i, j)}
                    className={`cell ${theme} ${isWinning ? "winning" : ""}`}
                  >
                    {val}
                  </button>
                );
              })
            )}
          </div>
          {winner && winner !== "Draw" && <h3 className="winnerText">{winner} Wins!</h3>}
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
