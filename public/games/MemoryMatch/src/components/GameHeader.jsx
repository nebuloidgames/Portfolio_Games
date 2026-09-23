import React from "react";

const GameHeader = ({ moves, time }) => {

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="game-header">
      <div className="game-header__stat">
        <span className="game-header__icon">🎯</span>
        <div className="game-header__info">
          <span className="game-header__label">Moves</span>
          <span className="game-header__value">{moves}</span>
        </div>
      </div>

      <h1 className="game-header__title">Math Memory Match</h1>

      <div className="game-header__stat">
        <span className="game-header__icon">⏱️</span>
        <div className="game-header__info">
          <span className="game-header__label">Time</span>
          <span className="game-header__value">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameHeader);
