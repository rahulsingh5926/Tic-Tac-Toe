import { useState, useEffect, useRef } from "react";
import "./App.css";

import ScoreBoard from "./ScoreBoard";

const TicTacToe = () => {
  const [size, setSize] = useState(3);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [arr, setArr] = useState([]);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [theme, setTheme] = useState("light");

  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  const playWinSound = () => {
    new Audio(process.env.PUBLIC_URL + "sound/winning_sound.wav").play();
  };

  const playDrawSound = () => {
    new Audio(process.env.PUBLIC_URL + "sound/draw_sound.mp3").play();
  };

  const buttonClickSound = () => {
    new Audio(process.env.PUBLIC_URL + "sound/pop_sound.mp3").play();
  };
  const resetScores = () => {
    setXWins(0);
    setOWins(0);
    setTotalGames(0);
  };

  useEffect(() => {
    if (started) resetBoard();
  }, [size, started]);

  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#222" : "#fff";
    document.body.style.color = theme === "dark" ? "#eee" : "#000";
  }, [theme]);

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

  const startGame = () => {
    resetBoard();
    setStarted(true);
  };

  const buttonClick = (i, j) => {
    if (arr[i][j] || winner) return;
    buttonClickSound();

    const newArr = arr.map((row) => [...row]);
    newArr[i][j] = count % 2 === 0 ? "⭕" : "❌";

    setArr(newArr);
    setCount((prev) => prev + 1);
    checkForWin(newArr);
  };

  const checkForWin = (board) => {
    const lines = [];

    for (let i = 0; i < size; i++) {
      lines.push(board[i].map((_, j) => [i, j])); // Rows
      lines.push(board.map((_, j) => [j, i])); // Columns
    }
    lines.push(board.map((_, i) => [i, i])); // Main Diagonal
    lines.push(board.map((_, i) => [i, size - 1 - i])); // Anti Diagonal

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

    if (board.flat().every((cell) => cell)) {
      setWinner("Draw");
      playDrawSound();
      setTotalGames((g) => g + 1);
    }
  };

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
