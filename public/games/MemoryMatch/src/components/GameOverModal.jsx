import React from "react";

const GameOverModal = ({ moves, time, bestScore, onPlayAgain, isNewBest }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="modal-overlay" onClick={onPlayAgain}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Celebration emoji */}
        <div className="modal__celebration">🎉</div>

        <h2 className="modal__title">Congratulations!</h2>
        <p className="modal__subtitle">You matched all the cards!</p>

        {isNewBest && (
          <div className="modal__new-best">
            <span>🏆</span> New Best Score!
          </div>
        )}

        {/* Current game stats */}
        <div className="modal__stats">
          <div className="modal__stat">
            <span className="modal__stat-label">Moves</span>
            <span className="modal__stat-value">{moves}</span>
          </div>
          <div className="modal__stat">
            <span className="modal__stat-label">Time</span>
            <span className="modal__stat-value">{formatTime(time)}</span>
          </div>
        </div>

        {/* Best score (if exists) */}
        {bestScore && !isNewBest && (
          <div className="modal__best">
            <span className="modal__best-label">🏆 Best Score</span>
            <span className="modal__best-value">
              {bestScore.moves} moves · {formatTime(bestScore.time)}
            </span>
          </div>
        )}

        <button
          className="modal__btn"
          onClick={onPlayAgain}
          type="button"
          autoFocus
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default React.memo(GameOverModal);
