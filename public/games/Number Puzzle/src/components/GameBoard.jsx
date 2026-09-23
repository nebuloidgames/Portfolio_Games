import React, { useState, useEffect, useCallback, useRef } from "react";
import { soundManager } from "../utils/audio";
import {
  canMoveTile,
  moveTile,
  isSolved,
  generateSolvableBoard,
  getNextHintTile,
} from "../utils/puzzleLogic";
import bgImg from "../assets/bg-img.png";
import nebuloidLogo from "../assets/nebuloid-vertical.png";

export const GameBoard = ({
  onBackToMenu,
  level = "easy",
  levelMoves = 20,
  startNum = 1,
  isMuted,
  onToggleMute,
  playerName = "Player 1",
}) => {
  const [board, setBoard] = useState(() =>
    generateSolvableBoard(levelMoves, startNum),
  );
  const [moves, setMoves] = useState(0);
  const [elapsedTenths, setElapsedTenths] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [hintTile, setHintTile] = useState(null);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("puzzle_streak");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(`best_moves_${level}_${startNum}`);
    return saved ? parseInt(saved, 10) : null;
  });

  const timerRef = useRef(null);

  // Level label
  const getLevelLabel = () => {
    if (level === "easy") return "LEVEL 1 - EASY";
    if (level === "medium") return "LEVEL 2 - MEDIUM";
    if (level === "hard") return "LEVEL 3 - HARD";
    return `LEVEL - ${level.toUpperCase()}`;
  };

  // Initialize new game
  const initGame = useCallback(
    (scrambleSteps = levelMoves) => {
      const newBoard = generateSolvableBoard(scrambleSteps, startNum);
      setBoard(newBoard);
      setMoves(0);
      setElapsedTenths(0);
      setIsRunning(true);
      setHasWon(false);
      setHintTile(null);
      setHistory([]);
    },
    [levelMoves, startNum],
  );

  // Timer effect (updates every 100ms for authentic tenths-of-second display)
  useEffect(() => {
    if (isRunning && !hasWon) {
      timerRef.current = setInterval(() => {
        setElapsedTenths((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, hasWon]);

  // Handle tile click
  const handleTileClick = useCallback(
    (index) => {
      if (hasWon) return;

      if (!canMoveTile(index, board)) {
        soundManager.playInvalid();
        return;
      }

      soundManager.playSlide();
      setHistory((prev) => [...prev, board]);
      const nextBoard = moveTile(index, board);
      setBoard(nextBoard);
      const newMoves = moves + 1;
      setMoves(newMoves);
      setHintTile(null);

      // Check win condition
      if (isSolved(nextBoard, startNum)) {
        setIsRunning(false);
        setHasWon(true);
        soundManager.playWin();

        // Calculate score & streak
        const totalSeconds = elapsedTenths / 10;
        const calculatedScore = Math.max(
          150,
          Math.round(1000 - newMoves * 12 - totalSeconds * 4),
        );
        setScore(calculatedScore);

        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("puzzle_streak", newStreak.toString());

        // Update best moves
        const currentBest = localStorage.getItem(
          `best_moves_${level}_${startNum}`,
        );
        if (!currentBest || newMoves < parseInt(currentBest, 10)) {
          localStorage.setItem(
            `best_moves_${level}_${startNum}`,
            newMoves.toString(),
          );
          setBestScore(newMoves);
        }
      }
    },
    [board, hasWon, moves, level, startNum, elapsedTenths, streak],
  );

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0 || hasWon) return;
    soundManager.playSlide();
    const prevBoard = history[history.length - 1];
    setBoard(prevBoard);
    setHistory((prev) => prev.slice(0, -1));
    setMoves((prev) => Math.max(0, prev - 1));
    setHintTile(null);
  }, [history, hasWon]);

  // Hint button
  const handleHint = useCallback(() => {
    if (hasWon) return;
    soundManager.playClick();
    const nextBest = getNextHintTile(board, startNum);
    if (nextBest !== null) {
      setHintTile(nextBest);
      setTimeout(() => {
        setHintTile(null);
      }, 3500);
    }
  }, [board, hasWon, startNum]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasWon) return;
      const emptyIdx = board.indexOf(null);
      const emptyRow = Math.floor(emptyIdx / 3);
      const emptyCol = emptyIdx % 3;
      let targetIdx = -1;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (emptyRow < 2) targetIdx = (emptyRow + 1) * 3 + emptyCol;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (emptyRow > 0) targetIdx = (emptyRow - 1) * 3 + emptyCol;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (emptyCol < 2) targetIdx = emptyRow * 3 + (emptyCol + 1);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (emptyCol > 0) targetIdx = emptyRow * 3 + (emptyCol - 1);
          break;
        default:
          return;
      }

      if (targetIdx !== -1) {
        e.preventDefault();
        handleTileClick(targetIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, hasWon, handleTileClick]);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center select-none bg-cover bg-center p-3 sm:p-6"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Subtle darkening overlay for lush contrast */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none z-0" />

      <div className="absolute top-6 left-6 z-30">
        <img src={nebuloidLogo} alt="" className="h-30" />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FROSTED GLASS CENTER MODAL / GAME FRAME */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-[96%] sm:w-[92%] md:w-[88%] max-w-5xl h-[92vh] max-h-[820px] min-h-[580px] rounded-[28px] sm:rounded-[36px] glass-game-frame flex flex-col justify-between items-center py-5 sm:py-7 px-4 sm:px-8 shadow-2xl animate-fadeIn">
        {/* TOP NAVIGATION BAR (Matching screenshot pills) */}
        <header className="w-full flex items-center justify-between gap-2 sm:gap-4 shrink-0">
          {/* Left Pill: Level indicator */}
          <div className="pill-green-border rounded-full px-4 sm:px-6 py-2 sm:py-2.5 font-sans font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center shrink-0">
            {getLevelLabel()}
          </div>

          {/* Center Long Pill: Menu, Timer, Score */}
          <div className="pill-green-border rounded-full px-4 sm:px-8 py-2 sm:py-2.5 font-sans font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-between gap-3 sm:gap-8 md:gap-12 flex-1 max-w-xl mx-1 sm:mx-3">
            {/* Menu Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onBackToMenu();
              }}
              className="flex items-center space-x-1.5 hover:opacity-85 transition-opacity cursor-pointer text-white"
            >
              <span>←</span>
              <span>MENU</span>
            </button>

            {/* Live Clock Timer */}
            <div className="flex items-center space-x-1.5 font-black text-white">
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{(elapsedTenths / 10).toFixed(1)}S</span>
            </div>

            {/* Score */}
            <div className="font-black tracking-wider text-white">
              SCORE {score}
            </div>
          </div>

          {/* Right Group: Streak Pill + Audio Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="pill-green-border rounded-full px-4 sm:px-6 py-2 sm:py-2.5 font-sans font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center">
              STREAK: {streak}x
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleMute();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full pill-green-border flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {!isMuted ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* CENTER PUZZLE PLAY AREA */}
        {/* ───────────────────────────────────────────────────────────── */}
        <main className="my-auto flex flex-col items-center justify-center">
          {/* Hint Banner if Active */}
          {hintTile !== null && (
            <div className="mb-3 px-4 py-1.5 rounded-full pill-green-border font-sans text-xs font-black tracking-widest animate-bounce shadow-md">
              💡 TAP NUMBER {board[hintTile]} TO ADVANCE
            </div>
          )}

          {/* 3x3 Puzzle Board Container */}
          <div className="puzzle-frame-green rounded-[22px] sm:rounded-[28px] p-2.5 sm:p-3.5 w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] md:w-[390px] md:h-[390px] shadow-2xl flex items-center justify-center">
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full h-full">
              {board.map((value, idx) => {
                const isHint = hintTile === idx;
                const isEmpty = value === null;
                const canMove = !isEmpty && canMoveTile(idx, board);

                if (isEmpty) {
                  return (
                    <div
                      key="empty"
                      className="tile-taupe-empty flex items-center justify-center relative w-full h-full"
                    >
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#fdf8f0] opacity-90 shadow-xs" />
                    </div>
                  );
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleTileClick(idx)}
                    disabled={hasWon}
                    className={`tile-cream-3d relative flex items-center justify-center cursor-pointer select-none w-full h-full font-sans font-black ${
                      startNum >= 10
                        ? "text-3xl sm:text-4xl md:text-5xl"
                        : "text-4xl sm:text-5xl md:text-6xl"
                    } text-[#0a0a0a] ${
                      isHint ? "hint-highlight ring-4 ring-[#00b84c]" : ""
                    } ${
                      canMove ? "cursor-pointer" : "cursor-default opacity-95"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar: HINT | UNDO | RESET */}
          <div className="puzzle-frame-green rounded-[18px] sm:rounded-[20px] p-1.5 sm:p-2 w-[290px] sm:w-[350px] md:w-[390px] mt-3 sm:mt-4 shadow-lg">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* Hint */}
              <button
                onClick={handleHint}
                disabled={hasWon}
                className="action-btn-cream py-2.5 sm:py-3 font-sans font-black text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
              >
                HINT
              </button>

              {/* Undo (Taupe when no history/disabled, Cream when available) */}
              <button
                onClick={handleUndo}
                disabled={history.length === 0 || hasWon}
                className={`py-2.5 sm:py-3 font-sans font-black text-xs sm:text-sm tracking-wider uppercase transition-all ${
                  history.length === 0 || hasWon
                    ? "action-btn-taupe cursor-not-allowed opacity-80"
                    : "action-btn-cream cursor-pointer"
                }`}
              >
                UNDO
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  initGame();
                }}
                className="action-btn-cream py-2.5 sm:py-3 font-sans font-black text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
              >
                RESET
              </button>
            </div>
          </div>
        </main>

        {/* Bottom subtle hint info */}
        <div className="text-white/80 font-sans font-semibold text-xs tracking-wider uppercase pb-1 drop-shadow-sm">
          Slide the tiles into sequential order
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VICTORY CELEBRATION MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {hasWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-[32px] glass-start-card p-6 sm:p-8 shadow-2xl border-2 border-white/50 text-center overflow-hidden">
            {/* Trophy Icon */}
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-emerald-500/20 border border-emerald-300 flex items-center justify-center text-4xl shadow-inner animate-bounce">
              🏆
            </div>

            <h2 className="font-title-serif italic font-extrabold text-3xl sm:text-4xl tracking-wide text-white mb-1 drop-shadow-md">
              PUZZLE SOLVED!
            </h2>
            <p className="text-xs font-sans font-bold text-emerald-200 uppercase tracking-widest mb-4">
              NEBULOID NUMBER PATH COMPLETE
            </p>

            {/* Certificate of Completion Banner */}
            <div className="mb-5 p-3 rounded-2xl bg-white/90 border border-white text-center shadow-md">
              <span className="block text-[10px] font-sans font-bold text-emerald-700 tracking-[0.2em] uppercase">
                CERTIFICATE OF COMPLETION
              </span>
              <span className="text-lg font-sans font-black text-gray-900 mt-0.5 block">
                {playerName}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-white/85 border border-white/60">
                <span className="block text-[10px] font-sans font-bold text-gray-500 tracking-wider">
                  MOVES
                </span>
                <span className="text-2xl font-sans font-black text-gray-900">
                  {moves}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/85 border border-white/60">
                <span className="block text-[10px] font-sans font-bold text-gray-500 tracking-wider">
                  TIME
                </span>
                <span className="text-2xl font-sans font-black text-emerald-700">
                  {(elapsedTenths / 10).toFixed(1)}s
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/85 border border-white/60">
                <span className="block text-[10px] font-sans font-bold text-gray-500 tracking-wider">
                  SCORE
                </span>
                <span className="text-2xl font-sans font-black text-amber-600">
                  {score}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  initGame();
                }}
                className="w-full py-3.5 rounded-full pill-green-border font-sans font-black text-sm tracking-wider uppercase shadow-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                PLAY AGAIN
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onBackToMenu();
                }}
                className="w-full py-3 rounded-full bg-white/90 hover:bg-white text-emerald-900 border border-white font-sans font-black text-xs sm:text-sm tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
              >
                BACK TO MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
