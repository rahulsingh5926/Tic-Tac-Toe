import React from "react";
import "./App.css";
//props passed from App.js
const ScoreBoard = ({ xWins, oWins, totalGames, onReset }) => {
  return (
    <div className="score-board">
      <p className="score">⭕ Wins: {oWins}</p>
      <p className="score">❌ Wins: {xWins}</p>
      <p className="score">Total Games: {totalGames}</p>
      <button className="reset-button" onClick={onReset}>
        Reset Scores
      </button>
    </div>
  );
};

export default ScoreBoard;
