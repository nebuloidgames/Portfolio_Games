import React, { useState, useEffect, useCallback, useRef } from "react";
import bgImg from "../assets/bg-img.png";
import nebuloid from "../assets/nebuloid_logo_vertical.png";
import {
  generateBoard,
  generateTeamGame,
  evaluateSelection,
  isAdjacent,
} from "../data/generate_word.js";
import "./Game.css";

const Game = ({
  difficulty = "easy",
  levelId = 1,
  levelWords = [],
  mode = "self",
  player1 = "Player 1",
  player2 = "Team 2",
  onExit,
  onCompleteLevel,
}) => {
  const displayPlayer1 = player1 || (mode === "self" ? "Player 1" : "Team A");
  const displayPlayer2 = mode === "robot" ? "RoboBot 🤖" : player2 || "Team B";

  // Game boards state (6x6 grid matching reference design)
  // For Self Mode: single board
  // For Team vs Team & vs Robot: dual boards
  const [gameState, setGameState] = useState(() => {
    if (mode === "self") {
      const singleBoard = generateBoard(levelWords, 3, 6);
      return {
        teamA: singleBoard,
        teamB: { grid: [], targetWords: [], placedWords: [] },
      };
    } else {
      return generateTeamGame(levelWords, 3, 6);
    }
  });

  // Target words and found words sets
  const [foundWordsA, setFoundWordsA] = useState(new Set());
  const [foundWordsB, setFoundWordsB] = useState(new Set());

  // Coordinates of permanently found cells (Set of "r,c")
  const [foundCellsA, setFoundCellsA] = useState(new Set());
  const [foundCellsB, setFoundCellsB] = useState(new Set());

  // Currently selected cells by players
  const [selectedCellsA, setSelectedCellsA] = useState([]);
  const [selectedCellsB, setSelectedCellsB] = useState([]);

  // Robot active animated cells (for vs Robot mode)
  const [robotActiveCells, setRobotActiveCells] = useState([]);
  const [robotCountdown, setRobotCountdown] = useState(10);

  // Scores & Streak
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [streak, setStreak] = useState(0);

  // Timer: Elapsed seconds count-up (e.g. 8.7s as in reference image)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Wrong Word Toast / Feedback State
  const [wrongFeedbackA, setWrongFeedbackA] = useState(false);
  const [wrongFeedbackB, setWrongFeedbackB] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const timerRef = useRef(null);

  // Synchronization refs to prevent interval tear-downs on every re-render
  const elapsedRef = useRef(0);
  const isGameOverRef = useRef(false);
  const foundWordsARef = useRef(foundWordsA);
  const foundWordsBRef = useRef(foundWordsB);
  const gameStateRef = useRef(gameState);
  const displayPlayer1Ref = useRef(displayPlayer1);
  const displayPlayer2Ref = useRef(displayPlayer2);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);
  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);
  useEffect(() => {
    foundWordsARef.current = foundWordsA;
  }, [foundWordsA]);
  useEffect(() => {
    foundWordsBRef.current = foundWordsB;
  }, [foundWordsB]);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    displayPlayer1Ref.current = displayPlayer1;
  }, [displayPlayer1]);
  useEffect(() => {
    displayPlayer2Ref.current = displayPlayer2;
  }, [displayPlayer2]);

  // Elapsed timer count-up (every 100ms for smooth decimal seconds e.g. 8.7S)
  useEffect(() => {
    if (isGameOver) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [isGameOver]);

  // Reset entire game match when level, difficulty, or mode changes
  const handleResetGame = useCallback(() => {
    if (mode === "self") {
      const singleBoard = generateBoard(levelWords, 3, 6);
      setGameState({
        teamA: singleBoard,
        teamB: { grid: [], targetWords: [], placedWords: [] },
      });
    } else {
      const teamGame = generateTeamGame(levelWords, 3, 6);
      setGameState(teamGame);
    }
    setFoundWordsA(new Set());
    setFoundWordsB(new Set());
    setFoundCellsA(new Set());
    setFoundCellsB(new Set());
    setSelectedCellsA([]);
    setSelectedCellsB([]);
    setRobotActiveCells([]);
    setRobotCountdown(10);
    setScoreA(0);
    setScoreB(0);
    setStreak(0);
    setElapsedSeconds(0);
    setIsGameOver(false);
    setWinner(null);
  }, [levelWords, mode]);

  useEffect(() => {
    handleResetGame();
  }, [levelId, difficulty, mode, handleResetGame]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // ==========================================================================
  // Check Win Condition (Decoupled from elapsedSeconds to keep references stable)
  // ==========================================================================
  const checkWin = useCallback(
    (foundSetA, foundSetB) => {
      if (isGameOverRef.current) return;

      const totalA = gameStateRef.current.teamA?.targetWords?.length || 0;
      const totalB = gameStateRef.current.teamB?.targetWords?.length || 0;

      if (mode === "self") {
        if (totalA > 0 && foundSetA.size >= totalA) {
          setIsGameOver(true);
          setWinner(displayPlayer1Ref.current);
          if (onCompleteLevel) {
            onCompleteLevel({
              difficulty,
              levelId,
              stars: 3,
              time: `${elapsedRef.current.toFixed(1)}s`,
            });
          }
        }
      } else {
        // Team vs Team or vs Robot: First to find all target words wins!
        if (totalA > 0 && foundSetA.size >= totalA) {
          setIsGameOver(true);
          setWinner(displayPlayer1Ref.current);
          if (onCompleteLevel) {
            onCompleteLevel({
              difficulty,
              levelId,
              stars: 3,
              time: `${elapsedRef.current.toFixed(1)}s`,
            });
          }
        } else if (totalB > 0 && foundSetB.size >= totalB) {
          setIsGameOver(true);
          setWinner(displayPlayer2Ref.current);
        }
      }
    },
    [mode, onCompleteLevel, difficulty, levelId],
  );

  // ==========================================================================
  // Robot AI Autonomous Hunting (for vs Robot Mode)
  // Robot searches, highlights, and answers after every 10 seconds
  // ==========================================================================
  const executeRobotTurn = useCallback(() => {
    if (isGameOverRef.current) return;
    const currentGameState = gameStateRef.current;
    if (!currentGameState?.teamB?.placedWords) return;

    const currentFoundB = foundWordsBRef.current;
    const unfoundWords = currentGameState.teamB.placedWords.filter(
      (p) => !currentFoundB.has(p.word),
    );

    if (unfoundWords.length > 0) {
      const targetToFind = unfoundWords[0];

      // Step 1: Robot highlights cells briefly on board (visual preview)
      setRobotActiveCells(targetToFind.coords);

      setTimeout(() => {
        setRobotActiveCells([]);

        setFoundWordsB((prev) => {
          const nextSet = new Set(prev);
          nextSet.add(targetToFind.word);

          // Permanently mark cells
          setFoundCellsB((cellPrev) => {
            const nextCells = new Set(cellPrev);
            targetToFind.coords.forEach(({ r, c }) =>
              nextCells.add(`${r},${c}`),
            );
            return nextCells;
          });

          // Increment Robot score
          setScoreB((s) => s + 100);
          showToast(`🤖 RoboBot found "${targetToFind.word}"!`);

          // Check win condition
          checkWin(foundWordsARef.current, nextSet);
          return nextSet;
        });
      }, 700);
    }
  }, [checkWin]);

  useEffect(() => {
    if (mode !== "robot" || isGameOver) return;

    // Initialize 10s countdown
    setRobotCountdown(10);

    const robotInterval = setInterval(() => {
      if (isGameOverRef.current) return;

      setRobotCountdown((prev) => {
        if (prev <= 1) {
          // Exactly 10 seconds reached! Robot takes its turn
          executeRobotTurn();
          return 10; // Reset to 10s for next word
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(robotInterval);
  }, [mode, isGameOver, executeRobotTurn]);

  // ==========================================================================
  // Cell Click Handler: Board A (Player 1)
  // ==========================================================================
  const handleCellClickA = (r, c) => {
    if (isGameOver) return;

    // Undo if clicked last cell
    const isAlreadyLast =
      selectedCellsA.length > 0 &&
      selectedCellsA[selectedCellsA.length - 1].r === r &&
      selectedCellsA[selectedCellsA.length - 1].c === c;

    if (isAlreadyLast) {
      setSelectedCellsA((prev) => prev.slice(0, -1));
      return;
    }

    // Truncate to existing index if clicked inside chain
    const existingIdx = selectedCellsA.findIndex(
      (cell) => cell.r === r && cell.c === c,
    );
    if (existingIdx !== -1) {
      setSelectedCellsA(selectedCellsA.slice(0, existingIdx + 1));
      return;
    }

    let newSelection;
    if (selectedCellsA.length > 0) {
      const lastCell = selectedCellsA[selectedCellsA.length - 1];
      if (isAdjacent(lastCell, { r, c })) {
        newSelection = [...selectedCellsA, { r, c }];
      } else {
        newSelection = [{ r, c }];
      }
    } else {
      newSelection = [{ r, c }];
    }

    setSelectedCellsA(newSelection);

    // Evaluate selection
    const evalResult = evaluateSelection(
      newSelection,
      gameState.teamA.grid,
      gameState.teamA.targetWords,
      foundWordsA,
    );

    if (evalResult.type === "MATCH") {
      const word = evalResult.word;
      const nextFoundWords = new Set(foundWordsA);
      nextFoundWords.add(word);
      setFoundWordsA(nextFoundWords);

      // Permanently save cells
      const nextCells = new Set(foundCellsA);
      newSelection.forEach((cell) => nextCells.add(`${cell.r},${cell.c}`));
      setFoundCellsA(nextCells);

      // Calculate score & streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 100 * newStreak;
      setScoreA((prev) => prev + points);

      setSelectedCellsA([]);
      showToast(`🎯 +${points} pts! Found "${word}"!`);

      // Check win
      checkWin(nextFoundWords, foundWordsB);
    } else if (evalResult.type === "WRONG") {
      setWrongFeedbackA(true);
      setStreak(0);
      setTimeout(() => {
        setWrongFeedbackA(false);
        setSelectedCellsA([]);
      }, 550);
    }
  };

  // ==========================================================================
  // Cell Click Handler: Board B (Team 2 in Team vs Team)
  // ==========================================================================
  const handleCellClickB = (r, c) => {
    if (isGameOver || mode === "robot" || mode === "self") return;

    // Undo if clicked last cell
    const isAlreadyLast =
      selectedCellsB.length > 0 &&
      selectedCellsB[selectedCellsB.length - 1].r === r &&
      selectedCellsB[selectedCellsB.length - 1].c === c;

    if (isAlreadyLast) {
      setSelectedCellsB((prev) => prev.slice(0, -1));
      return;
    }

    const existingIdx = selectedCellsB.findIndex(
      (cell) => cell.r === r && cell.c === c,
    );
    if (existingIdx !== -1) {
      setSelectedCellsB(selectedCellsB.slice(0, existingIdx + 1));
      return;
    }

    let newSelection;
    if (selectedCellsB.length > 0) {
      const lastCell = selectedCellsB[selectedCellsB.length - 1];
      if (isAdjacent(lastCell, { r, c })) {
        newSelection = [...selectedCellsB, { r, c }];
      } else {
        newSelection = [{ r, c }];
      }
    } else {
      newSelection = [{ r, c }];
    }

    setSelectedCellsB(newSelection);

    // Evaluate selection for Team B
    const evalResult = evaluateSelection(
      newSelection,
      gameState.teamB.grid,
      gameState.teamB.targetWords,
      foundWordsB,
    );

    if (evalResult.type === "MATCH") {
      const word = evalResult.word;
      const nextFoundWords = new Set(foundWordsB);
      nextFoundWords.add(word);
      setFoundWordsB(nextFoundWords);

      const nextCells = new Set(foundCellsB);
      newSelection.forEach((cell) => nextCells.add(`${cell.r},${cell.c}`));
      setFoundCellsB(nextCells);

      setScoreB((prev) => prev + 100);
      setSelectedCellsB([]);
      showToast(`🎯 Team B found "${word}"!`);

      checkWin(foundWordsA, nextFoundWords);
    } else if (evalResult.type === "WRONG") {
      setWrongFeedbackB(true);
      setTimeout(() => {
        setWrongFeedbackB(false);
        setSelectedCellsB([]);
      }, 550);
    }
  };

  const wordsLeftA = gameState.teamA.targetWords.length - foundWordsA.size;
  const wordsLeftB = gameState.teamB.targetWords.length - foundWordsB.size;

  // Words to display on center "FIND ALL WORDS" scroll:
  // In Self mode: Team A target words
  // In Team / Robot: Combine or show Team A words (and B words if different)
  const targetWordsToDisplay =
    mode === "self"
      ? gameState.teamA.targetWords
      : Array.from(
          new Set([
            ...gameState.teamA.targetWords,
            ...gameState.teamB.targetWords,
          ]),
        );

  return (
    <div
      className="game-arena-wrapper"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Toast Notification */}
      {toastMessage && <div className="game-toast-banner">{toastMessage}</div>}

      <div className="absolute top-15 left-7">
        <img src={nebuloid} alt="nebuloid" className="h-40" />
      </div>

      {/* ==========================================================================
          Top Navigation Bar (Pixel-perfect matching reference design)
          ========================================================================== */}
      <header className="game-top-navbar">
        {/* Left Pill: LEVEL - DIFFICULTY */}
        <div className="game-top-pill top-pill-level">
          LEVEL {levelId} - {difficulty.toUpperCase()}
        </div>

        {/* Center Stadium Pill: MENU | TIMER | SCORE */}
        <div className="game-top-pill top-pill-center">
          <button
            className="menu-nav-btn"
            onClick={onExit}
            title="Return to Menu"
          >
            ← MENU
          </button>

          <div className="timer-nav-display">
            <span className="timer-icon">⏱</span>
            <span className="timer-text">{elapsedSeconds.toFixed(1)}S</span>
          </div>

          <div className="score-nav-display">
            {mode === "self" ? (
              <span>SCORE {scoreA}</span>
            ) : (
              <span>
                SCORE {scoreA} : {scoreB}
              </span>
            )}
          </div>
        </div>

        {/* Right Pill: STREAK */}
        <div className="game-top-pill top-pill-streak">STREAK: {streak}x</div>
      </header>

      {/* ==========================================================================
          Main Game Arena: Parchment Boards & Find All Words Scroll
          ========================================================================== */}
      <main
        className={`game-boards-container ${mode === "self" ? "mode-self-layout" : "mode-dual-layout"}`}
      >
        {/* ----------------------------------------------------------------------
            Board A / Player 1 (Yellow Header)
            ---------------------------------------------------------------------- */}
        <div
          className={`parchment-board-card board-team-a ${wrongFeedbackA ? "shake-board" : ""}`}
        >
          {/* Corner Stitch Accents */}
          <div className="stitch-corner stitch-tl" />
          <div className="stitch-corner stitch-tr" />
          <div className="stitch-corner stitch-bl" />
          <div className="stitch-corner stitch-br" />

          {/* Yellow Banner Header */}
          <div className="parchment-board-header header-yellow">
            <h2 className="board-title-text">{displayPlayer1.toUpperCase()}</h2>
            <div className="words-left-pill">{wordsLeftA} WORDS LEFT</div>
          </div>

          {/* 6x6 Letter Grid */}
          <div className="parchment-letter-grid">
            {gameState.teamA.grid.map((row, rIdx) => (
              <div key={`row-a-${rIdx}`} className="grid-row">
                {row.map((letter, cIdx) => {
                  const isSelected = selectedCellsA.some(
                    (cell) => cell.r === rIdx && cell.c === cIdx,
                  );
                  const isFound = foundCellsA.has(`${rIdx},${cIdx}`);

                  let cellClass = "grid-letter-tile";
                  if (isSelected) cellClass += " tile-selected-a";
                  else if (isFound) cellClass += " tile-found-a";

                  return (
                    <button
                      key={`cell-a-${rIdx}-${cIdx}`}
                      className={cellClass}
                      onClick={() => handleCellClickA(rIdx, cIdx)}
                      aria-label={`Letter ${letter} at row ${rIdx + 1}, column ${cIdx + 1}`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------------------------
            Center Column: "FIND ALL WORDS" Parchment Scroll
            ---------------------------------------------------------------------- */}
        <div className="parchment-scroll-card">
          <div className="stitch-corner stitch-tl" />
          <div className="stitch-corner stitch-tr" />
          <div className="stitch-corner stitch-bl" />
          <div className="stitch-corner stitch-br" />

          {/* Magnifying Glass Icon Circle */}
          <div className="magnifier-icon-badge">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#231f1b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Title with Hand-drawn Underline */}
          <div className="scroll-title-wrap">
            <h3 className="scroll-title-text">FIND ALL WORDS</h3>
            <div className="scroll-brush-underline" />
          </div>

          {/* Target Words Chips List */}
          <div className="scroll-words-list">
            {targetWordsToDisplay.map((w) => {
              const isFoundByA = foundWordsA.has(w);
              const isFoundByB = foundWordsB.has(w);
              const isFound = isFoundByA || isFoundByB;

              return (
                <div
                  key={w}
                  className={`scroll-word-item ${isFound ? "word-found-complete" : ""}`}
                >
                  <span className="word-text-label">{w}</span>
                  {isFound && <span className="word-check-icon">✓</span>}
                </div>
              );
            })}
          </div>

          {/* Mode Info Badge */}
          <div className="scroll-bottom-meta">
            {mode === "self" && <span>SOLO RUN</span>}
            {mode === "team" && <span>RACE TO FINISH</span>}
            {mode === "robot" && <span>BEAT ROBOBOT</span>}
          </div>
        </div>

        {/* ----------------------------------------------------------------------
            Board B / Team 2 / Robot (Green Header)
            Shown ONLY in 'team' and 'robot' modes!
            ---------------------------------------------------------------------- */}
        {mode !== "self" && (
          <div
            className={`parchment-board-card board-team-b ${wrongFeedbackB ? "shake-board" : ""}`}
          >
            <div className="stitch-corner stitch-tl" />
            <div className="stitch-corner stitch-tr" />
            <div className="stitch-corner stitch-bl" />
            <div className="stitch-corner stitch-br" />

            {/* Green Banner Header */}
            <div className="parchment-board-header header-green">
              <h2 className="board-title-text">
                {displayPlayer2.toUpperCase()}
              </h2>
              <div className="words-left-pill">
                {mode === "robot"
                  ? `🤖 ${wordsLeftB} LEFT • ${robotCountdown}s`
                  : `${wordsLeftB} WORDS LEFT`}
              </div>
            </div>

            {/* 6x6 Letter Grid for Team B / Robot */}
            <div className="parchment-letter-grid">
              {gameState.teamB.grid.map((row, rIdx) => (
                <div key={`row-b-${rIdx}`} className="grid-row">
                  {row.map((letter, cIdx) => {
                    const isSelected = selectedCellsB.some(
                      (cell) => cell.r === rIdx && cell.c === cIdx,
                    );
                    const isFound = foundCellsB.has(`${rIdx},${cIdx}`);
                    const isRobotActive = robotActiveCells.some(
                      (cell) => cell.r === rIdx && cell.c === cIdx,
                    );

                    let cellClass = "grid-letter-tile";
                    if (isRobotActive) cellClass += " tile-robot-hunting";
                    else if (isSelected) cellClass += " tile-selected-b";
                    else if (isFound) cellClass += " tile-found-b";

                    return (
                      <button
                        key={`cell-b-${rIdx}-${cIdx}`}
                        className={cellClass}
                        onClick={() => handleCellClickB(rIdx, cIdx)}
                        aria-label={`Letter ${letter} at row ${rIdx + 1}, column ${cIdx + 1}`}
                        disabled={mode === "robot"}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ==========================================================================
          Victory / Game Over Modal Popup
          ========================================================================== */}
      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal-box">
            <div className="game-over-ribbon">
              {mode === "self" ? "LEVEL COMPLETED!" : "MATCH FINISHED!"}
            </div>

            <div className="winner-trophy-icon">🏆</div>

            <h2 className="winner-announcement-title">
              {mode === "self"
                ? "EXCELLENT HUNTING!"
                : `${winner?.toUpperCase()} WINS!`}
            </h2>

            <p className="winner-details-text">
              {mode === "self"
                ? `You found all words in ${elapsedSeconds.toFixed(1)}s with a high score of ${scoreA} pts!`
                : winner === "RoboBot 🤖"
                  ? "RoboBot solved its board first! Train your vocabulary and challenge again!"
                  : `${winner} out-searched their opponent and claimed victory!`}
            </p>

            {/* Stats Pills in modal */}
            <div className="game-over-stats-row">
              <div className="modal-stat-pill">
                <span className="stat-label">TIME</span>
                <span className="stat-val">{elapsedSeconds.toFixed(1)}s</span>
              </div>
              <div className="modal-stat-pill">
                <span className="stat-label">FINAL SCORE</span>
                <span className="stat-val">
                  {mode === "self" ? scoreA : `${scoreA} - ${scoreB}`}
                </span>
              </div>
              <div className="modal-stat-pill">
                <span className="stat-label">STREAK</span>
                <span className="stat-val">{streak}x</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="game-over-buttons-row">
              <button
                className="modal-action-btn btn-replay"
                onClick={handleResetGame}
              >
                PLAY AGAIN
              </button>
              <button className="modal-action-btn btn-next" onClick={onExit}>
                BACK TO MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
