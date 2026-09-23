import React, { useState, useEffect, useRef } from 'react';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/logo_white_vertical.png';
import NavalMine from './NavalMine';
import { FlagIcon } from './IsometricBoard';
import { SettingsModal, LeaderboardModal } from './Modals';
import CertificateModal from './CertificateModal';
import { playClick, playPop, playChime, playExplosion, playVictory, toggleSound, isSoundEnabled } from '../utils/audio';

// Custom SVG Icons for authentic Minecraft feel
const GrassBlockIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0 drop-shadow-sm">
    <path d="M16 3 L29 9.5 L16 16 L3 9.5 Z" fill="#5cb82a" stroke="#3b7d18" strokeWidth="1.5" />
    <path d="M3 9.5 L16 16 L16 29 L3 22.5 Z" fill="#86532d" stroke="#54331a" strokeWidth="1.5" />
    <path d="M29 9.5 L16 16 L16 29 L29 22.5 Z" fill="#714424" stroke="#482b15" strokeWidth="1.5" />
    <path d="M3 9.5 L16 16 L16 19 L13 17.5 L11 19 L8 17 L5 18.5 L3 14 Z" fill="#4d9e1f" />
    <path d="M29 9.5 L16 16 L16 19 L19 17.5 L21 19 L24 17 L27 18.5 L29 14 Z" fill="#438d1a" />
  </svg>
);

const TntBlockIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 drop-shadow-sm">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
    <rect x="2" y="8" width="20" height="8" fill="#f8fafc" />
    <text x="12" y="14" fill="#0f172a" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="system-ui">TNT</text>
  </svg>
);

const MineSpikeIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 drop-shadow-sm">
    <circle cx="12" cy="12" r="7" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4.9" y1="4.9" x2="7" y2="7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="17" x2="19.1" y2="19.1" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <line x1="19.1" y1="4.9" x2="17" y2="7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="17" x2="4.9" y2="19.1" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="10" r="1.5" fill="#f8fafc" opacity="0.6" />
  </svg>
);

const ClockBlueIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="10" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="8" fill="#f0f9ff" />
    <polyline points="12 7 12 12 15 14" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RedFlagIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <line x1="6" y1="2" x2="6" y2="22" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M6 3 L19 8 L6 13 Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
  </svg>
);

const TrophyGoldIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M6 4h12v5a6 6 0 0 1-12 0V4z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
    <path d="M6 6H3a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h2" stroke="#d97706" strokeWidth="1.5" />
    <path d="M18 6h3a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-2" stroke="#d97706" strokeWidth="1.5" />
    <path d="M12 15v4" stroke="#d97706" strokeWidth="2.5" />
    <rect x="7" y="19" width="10" height="3" rx="1.5" fill="#d97706" />
  </svg>
);

// Minecraft Frame Container with mossy green corners
const MinecraftFrame = ({ children, className = '' }) => (
  <div className={`relative rounded-3xl p-2.5 sm:p-3 bg-[#4a4e56] border-4 border-[#2d3035] shadow-[0_20px_45px_rgba(0,0,0,0.5)] ${className}`}>
    {/* 4 Corner Green Mossy Blocks */}
    <div className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-md bg-gradient-to-br from-[#68be32] to-[#3a8518] border-2 border-[#204a0e] shadow-md z-10 flex items-center justify-center pointer-events-none">
      <div className="w-2.5 h-2.5 bg-[#295c12] opacity-40 rounded-xs" />
    </div>
    <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-md bg-gradient-to-br from-[#68be32] to-[#3a8518] border-2 border-[#204a0e] shadow-md z-10 flex items-center justify-center pointer-events-none">
      <div className="w-2.5 h-2.5 bg-[#295c12] opacity-40 rounded-xs" />
    </div>
    <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-md bg-gradient-to-br from-[#68be32] to-[#3a8518] border-2 border-[#204a0e] shadow-md z-10 flex items-center justify-center pointer-events-none">
      <div className="w-2.5 h-2.5 bg-[#295c12] opacity-40 rounded-xs" />
    </div>
    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-md bg-gradient-to-br from-[#68be32] to-[#3a8518] border-2 border-[#204a0e] shadow-md z-10 flex items-center justify-center pointer-events-none">
      <div className="w-2.5 h-2.5 bg-[#295c12] opacity-40 rounded-xs" />
    </div>

    {/* Inner Parchment Card */}
    <div className="relative z-0 w-full h-full bg-[#fbf7ee] rounded-2xl border border-[#d6cfc0] p-4 sm:p-5 flex flex-col justify-between shadow-inner">
      {children}
    </div>
  </div>
);

// Math generator helper according to range
const generateMathProblem = (maxRange = 20) => {
  const ops = ['+', '−', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * (maxRange - 3)) + 2;
    b = Math.floor(Math.random() * (maxRange - a - 1)) + 1;
    answer = a + b;
  } else if (op === '−') {
    a = Math.floor(Math.random() * (maxRange - 3)) + 4;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else {
    // Multiplication within small factors
    a = Math.floor(Math.random() * 8) + 2;
    b = Math.floor(Math.random() * 6) + 2;
    answer = a * b;
  }

  return { a, b, op, answer, text: `${a} ${op} ${b}` };
};

// Create initial minesweeper grid
const createBoard = (rows, cols, minesCount, maxMathRange = 20, safeR = -1, safeC = -1) => {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        r,
        c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isExploded: false,
        question: generateMathProblem(maxMathRange),
      });
    }
    grid.push(row);
  }

  // Plant mines randomly
  let planted = 0;
  while (planted < minesCount) {
    const rr = Math.floor(Math.random() * rows);
    const cc = Math.floor(Math.random() * cols);

    if (safeR !== -1 && Math.abs(rr - safeR) <= 1 && Math.abs(cc - safeC) <= 1) {
      continue;
    }

    if (!grid[rr][cc].isMine) {
      grid[rr][cc].isMine = true;
      planted++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
            count++;
          }
        }
      }
      grid[r][c].neighborMines = count;
    }
  }

  return grid;
};

// Map number of neighbor mines to reference font colors
const getNumberColor = (num) => {
  switch (num) {
    case 1: return 'text-[#2563EB]';
    case 2: return 'text-[#16A34A]';
    case 3: return 'text-[#DC2626]';
    case 4: return 'text-[#7C3AED]';
    case 5: return 'text-[#D97706]';
    case 6: return 'text-[#0D9488]';
    case 7: return 'text-[#4338CA]';
    case 8: return 'text-[#9F1239]';
    default: return 'text-slate-800';
  }
};

const Game = ({ onBack, levelConfig, playerName = '' }) => {
  // Parse config or fallback to Level 1 Easy
  const rows = levelConfig?.gridSize ? parseInt(levelConfig.gridSize.split('×')[0].trim(), 10) || 6 : 6;
  const cols = levelConfig?.gridSize ? parseInt(levelConfig.gridSize.split('×')[1]?.trim() || '6', 10) || 6 : 6;
  const totalMines = levelConfig?.mines || 6;
  const mathRange = levelConfig?.mathRange ? parseInt(levelConfig.mathRange.split('−')[1]?.trim() || '10', 10) || 10 : 10;
  const levelTitle = levelConfig?.title ? levelConfig.title : 'EASY';
  const levelSubtitle = levelConfig?.subtitle || 'GET STARTED';

  const [board, setBoard] = useState(() => createBoard(rows, cols, totalMines, mathRange, 0, 0));
  const [hasStarted, setHasStarted] = useState(false);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'lost' | 'won'
  const [isShaking, setIsShaking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(totalMines);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Math Question Popup Modal state
  const [activeQuestionCell, setActiveQuestionCell] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    a: 7,
    b: 5,
    op: '+',
    answer: 12,
    text: '7 + 5',
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [popupError, setPopupError] = useState('');
  const inputRef = useRef(null);

  // Settings and Audio
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Re-initialize board when levelConfig changes
  useEffect(() => {
    setBoard(createBoard(rows, cols, totalMines, mathRange));
    setFlagsLeft(totalMines);
    setGameState('playing');
    setHasStarted(false);
    setSeconds(0);
    setScore(0);
    setStreak(0);
    setActiveQuestionCell(null);
    setShowCertificateModal(false);
  }, [levelConfig]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Focus input whenever question popup opens
  useEffect(() => {
    if (activeQuestionCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeQuestionCell]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleToggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Click on unrevealed tile ➔ If mine: BLAST! If safe: Open Question Popup
  const handleTileClick = (r, c) => {
    if (gameState !== 'playing') return;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    // Direct Mine Click
    if (cell.isMine) {
      triggerExplosionBreak(r, c, 'mine');
      return;
    }

    // Safe Tile ➔ Open Question Popup Modal
    playPop();
    setActiveQuestionCell({ r, c });
    setCurrentQuestion(cell.question || generateMathProblem(mathRange));
    setUserAnswer('');
    setPopupError('');
  };

  // Right-click ➔ Flag or Unflag
  const handleTileContextMenu = (e, r, c) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    const cell = board[r][c];
    if (cell.isRevealed) return;

    playClick();
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => row.map((item) => ({ ...item })));
      const target = newBoard[r][c];
      if (target.isFlagged) {
        target.isFlagged = false;
        setFlagsLeft((f) => f + 1);
      } else {
        if (flagsLeft > 0) {
          target.isFlagged = true;
          setFlagsLeft((f) => f - 1);
        }
      }
      return newBoard;
    });
  };

  // Recursive flood-fill for zero cells
  const floodFillZero = (b, r, c) => {
    const queue = [[r, c]];
    b[r][c].isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift();
      const currCell = b[currR][currC];

      if (currCell.neighborMines === 0 && !currCell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const neighbor = b[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }
  };

  // Trigger Minesweeper Explosion Break
  const [blastOrigin, setBlastOrigin] = useState(null);
  const [isBlasting, setIsBlasting] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [explosionReason, setExplosionReason] = useState('mine');

  const triggerExplosionBreak = (explodedRow, explodedCol, reason = 'mine') => {
    setExplosionReason(reason);
    playExplosion();
    setIsShaking(true);
    setIsBlasting(true);
    setBlastOrigin({ r: explodedRow, c: explodedCol });
    setActiveQuestionCell(null);
    setStreak(0);

    setTimeout(() => setIsShaking(false), 800);

    setBoard((prevBoard) => {
      return prevBoard.map((row) =>
        row.map((cell) => {
          if (cell.isMine || (cell.r === explodedRow && cell.c === explodedCol)) {
            return {
              ...cell,
              isRevealed: true,
              isExploded: true,
            };
          }
          return cell;
        })
      );
    });

    setGameState('lost');

    setTimeout(() => {
      setIsBlasting(false);
      setShowGameOverModal(true);
    }, 1400);
  };

  // Submit answer
  const handleAnswerSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || gameState !== 'playing') return;

    const parsed = parseInt(userAnswer.trim(), 10);
    const target = activeQuestionCell || { r: 0, c: 0 };

    // WRONG INPUT
    if (parsed !== currentQuestion.answer) {
      triggerExplosionBreak(target.r, target.c, 'calculation');
      return;
    }

    // CORRECT INPUT
    playChime();
    setScore((prev) => prev + 25);
    setStreak((prev) => prev + 1);
    setActiveQuestionCell(null);

    setBoard((prevBoard) => {
      let workingBoard = prevBoard.map((row) => row.map((cell) => ({ ...cell })));

      if (!hasStarted) {
        setHasStarted(true);
      }

      const clicked = workingBoard[target.r][target.c];

      if (clicked.isMine) {
        triggerExplosionBreak(target.r, target.c, 'mine');
        return workingBoard;
      }

      clicked.isRevealed = true;

      // Auto reveal surrounding zero tiles
      if (clicked.neighborMines === 0) {
        floodFillZero(workingBoard, target.r, target.c);
      }

      // Check for win
      let safeRemaining = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!workingBoard[r][c].isMine && !workingBoard[r][c].isRevealed) {
            safeRemaining++;
          }
        }
      }

      if (safeRemaining === 0) {
        playVictory();
        setGameState('won');
        // Auto flag all mines
        workingBoard = workingBoard.map((row) =>
          row.map((cell) => (cell.isMine ? { ...cell, isFlagged: true } : cell))
        );
      }

      return workingBoard;
    });
  };

  const handleReset = () => {
    playClick();
    setBoard(createBoard(rows, cols, totalMines, mathRange));
    setFlagsLeft(totalMines);
    setGameState('playing');
    setHasStarted(false);
    setSeconds(0);
    setScore(0);
    setStreak(0);
    setActiveQuestionCell(null);
    setShowGameOverModal(false);
    setShowCertificateModal(false);
  };

  // Safe tiles calculation
  const totalSafeTiles = rows * cols - totalMines;
  const revealedCount = board.flat().filter((c) => c.isRevealed && !c.isMine).length;
  const progressPercent = Math.min(100, Math.round((revealedCount / (totalSafeTiles || 1)) * 100));

  return (
    <div className={`relative min-h-screen w-full overflow-hidden flex flex-col justify-between items-center p-3 sm:p-5 select-none ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* ========================================================================= */}
      {/* 1. SCENIC MINECRAFT BACKGROUND (bg-img.png)                              */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-[1.01]"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      {/* Subtle ambient darkening for high contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

      {/* Centered Nebuloid Tech Logo */}
      <div className="absolute top-2 left-2">
        <div className="pointer-events-auto flex items-center">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Tech"
            className="h-40 w-auto object-contain"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP FLOATING TRANSLUCENT PILL CONTAINERS                               */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full max-w-5xl flex items-center justify-between gap-2 sm:gap-4 mt-1 px-1">
        
        {/* Left Pill: LEVEL 1 - EASY */}
        <div 
          className="px-5 sm:px-6 py-2 rounded-full text-white font-ui font-black text-xs sm:text-sm tracking-wider shadow-lg flex items-center justify-center whitespace-nowrap"
          style={{
            background: 'rgba(122, 106, 85, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '2px solid #ffffff',
          }}
        >
          <span>LEVEL 1 - {levelTitle.toUpperCase()}</span>
        </div>

        {/* Center Wide Pill: ← MENU | ⏱ 8.7S | SCORE 0 */}
        <div 
          className="flex-1 max-w-md sm:max-w-lg px-4 sm:px-8 py-2 rounded-full text-white font-ui font-black text-xs sm:text-sm tracking-wider shadow-lg flex items-center justify-between gap-4"
          style={{
            background: 'rgba(122, 106, 85, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '2px solid #ffffff',
          }}
        >
          {/* ← MENU Button */}
          <button
            onClick={() => {
              playPop();
              onBack();
            }}
            className="flex items-center gap-1 hover:text-amber-200 active:scale-95 transition-all cursor-pointer select-none"
          >
            <span>←</span>
            <span>MENU</span>
          </button>

          {/* Timer Display */}
          <div className="flex items-center gap-1 font-mono tracking-widest text-white/95">
            <span>⏱</span>
            <span>{seconds}.0S</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/85">SCORE</span>
            <span className="text-amber-200">{score}</span>
          </div>
        </div>

        {/* Right Pill: STREAK: 0x & Audio Toggle */}
        <div className="flex items-center gap-2">
          <div 
            className="px-5 sm:px-6 py-2 rounded-full text-white font-ui font-black text-xs sm:text-sm tracking-wider shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            style={{
              background: 'rgba(122, 106, 85, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '2px solid #ffffff',
            }}
          >
            <span>STREAK:</span>
            <span className="text-amber-300">{streak}x</span>
          </div>

          {/* Quick Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
            style={{
              background: 'rgba(122, 106, 85, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '2px solid #ffffff',
            }}
            title={soundOn ? 'Mute' : 'Unmute'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT: TWO MINECRAFT-BORDERED PANELS (SIDE-BY-SIDE)             */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-5xl flex-1 flex items-center justify-center my-auto py-2">
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 sm:gap-6 w-full">
          
          {/* PANEL 1: LEFT INFO & SPECS PANEL */}
          <div className="w-full lg:w-[360px] shrink-0">
            <MinecraftFrame className="h-full">
              
              {/* Purple Header Banner with Grass Block Icon */}
              <div 
                className="w-full rounded-2xl p-3 sm:p-3.5 text-white flex items-center gap-3 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #4f22e2 0%, #682cf5 50%, #7c3aed 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                {/* Grass Block Cube */}
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                  <GrassBlockIcon size={30} />
                </div>

                {/* Level Title & Player Info */}
                <div className="text-left overflow-hidden">
                  <h3 className="font-ui font-black text-lg sm:text-xl tracking-wide leading-tight uppercase text-white drop-shadow">
                    Level: {levelTitle}
                  </h3>
                  <span className="font-ui text-[11px] font-extrabold text-purple-200 tracking-wider uppercase block">
                    {levelSubtitle}
                  </span>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-purple-100 font-ui truncate">
                    <span>👤</span>
                    <span>{playerName || 'Moderate Number -'}</span>
                  </div>
                </div>
              </div>

              {/* Specs List */}
              <div className="mt-4 space-y-2.5 divide-y divide-[#e5decb] text-xs sm:text-sm font-ui">
                {/* Grid Size */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-md bg-[#0284c7] flex items-center justify-center text-white text-[10px] font-black">
                      #
                    </div>
                    <span>Grid Size</span>
                  </div>
                  <span className="font-ui font-black text-slate-900 text-sm">
                    {rows} x {cols}
                  </span>
                </div>

                {/* Math Range */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <TntBlockIcon size={22} />
                    <span>Math Range</span>
                  </div>
                  <span className="font-ui font-black text-slate-900 text-sm">
                    1 - {mathRange}
                  </span>
                </div>

                {/* Mines */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <MineSpikeIcon size={22} />
                    <span>Mines</span>
                  </div>
                  <span className="font-ui font-black text-slate-900 text-sm">
                    {totalMines}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-[#e5decb]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5 font-ui">
                  <span className="font-black">Progress</span>
                  <span className="font-black text-slate-900">
                    {revealedCount} / {totalSafeTiles}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-[#cbd5e1] rounded-full overflow-hidden p-0.5 border border-[#94a3b8]/40 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Tip Box 1 (Blue) */}
              <div className="mt-3.5 bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-2.5 flex items-center gap-2.5 text-left shadow-xs">
                <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-black text-xs shrink-0">
                  i
                </span>
                <p className="font-ui text-xs text-[#0369a1] font-semibold leading-tight">
                  "Use the numbers to find safe tiles!"
                </p>
              </div>

              {/* Tip Box 2 (Pink/Red) */}
              <div className="mt-2.5 bg-[#ffe4e6] border border-[#fecdd3] rounded-xl p-2.5 flex items-center gap-2.5 text-left shadow-xs">
                <MineSpikeIcon size={20} />
                <p className="font-ui text-[11px] text-[#9f1239] font-semibold leading-tight">
                  Light-colored tiles highlight hidden mines. Right-click to flag them!
                </p>
              </div>

              {/* Bottom: Reset Level + Restart Button */}
              <div className="mt-4 pt-3 border-t border-[#e5decb] flex items-center justify-between font-ui">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-bold text-xs cursor-pointer transition-colors"
                >
                  <span className="text-sm">🔄</span>
                  <span>Reset Level</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 rounded-xl font-ui font-black text-xs text-white uppercase tracking-wider shadow-[0_3px_0_#15803d] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  style={{
                    background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                    border: '1.5px solid #15803d',
                  }}
                >
                  Restart
                </button>
              </div>

            </MinecraftFrame>
          </div>

          {/* PANEL 2: RIGHT MINESWEEPER BOARD PANEL */}
          <div className="flex-1 max-w-xl">
            <MinecraftFrame className="h-full">
              
              {/* Top Stats Row: TIME | FLAGS LEFT | SCORE */}
              <div className="w-full grid grid-cols-3 gap-2 pb-3.5 mb-3 border-b border-[#e5decb] text-center font-ui">
                
                {/* Time */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <ClockBlueIcon size={28} />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-500 block uppercase tracking-wider">
                      TIME
                    </span>
                    <span className="font-mono font-black text-base sm:text-lg text-slate-900">
                      {formatTime(seconds)}
                    </span>
                  </div>
                </div>

                {/* Flags Left */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 border-x border-[#e5decb]">
                  <RedFlagIcon size={24} />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-500 block uppercase tracking-wider">
                      FLAGS LEFT:
                    </span>
                    <span className="font-ui font-black text-base sm:text-lg text-slate-900">
                      {flagsLeft} / {totalMines}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <TrophyGoldIcon size={26} />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-500 block uppercase tracking-wider">
                      SCORE
                    </span>
                    <span className="font-ui font-black text-base sm:text-lg text-slate-900">
                      {score}
                    </span>
                  </div>
                </div>

              </div>

              {/* Minesweeper Grid Center Container */}
              <div className="relative bg-[#ede6d8] p-2.5 sm:p-4 rounded-2xl border border-[#d6cfc0] shadow-inner flex items-center justify-center min-h-[300px] overflow-hidden my-auto">
                
                {/* 💥 EXPLOSIVE BLAST OVERLAY */}
                {isBlasting && blastOrigin && (
                  <div
                    className="absolute z-30 pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: `${((blastOrigin.r + 0.5) / rows) * 100}%`,
                      left: `${((blastOrigin.c + 0.5) / cols) * 100}%`,
                    }}
                  >
                    <div className="absolute w-28 h-28 rounded-full border-4 border-amber-400 animate-shockwave" />
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 animate-blast shadow-[0_0_50px_#ef4444]" />
                    <div className="font-game text-4xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(220,38,38,1)] animate-bounce select-none z-40 whitespace-nowrap">
                      💥 BOOM!
                    </div>
                  </div>
                )}

                {/* The Tiles Grid */}
                <div
                  className="grid gap-1 sm:gap-1.5 relative z-10"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                >
                  {board.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isRevealed = cell.isRevealed;
                      const isFlagged = cell.isFlagged;
                      const isMine = cell.isMine;
                      const isSelected = activeQuestionCell && activeQuestionCell.r === rIdx && activeQuestionCell.c === cIdx;

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => handleTileClick(rIdx, cIdx)}
                          onContextMenu={(e) => handleTileContextMenu(e, rIdx, cIdx)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-ui font-black text-lg sm:text-xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                            cell.isExploded
                              ? 'bg-[#1c1917] border-2 border-red-600 shadow-[inset_0_0_10px_#ef4444,0_0_12px_rgba(239,68,68,0.7)] text-white animate-pulse'
                              : isRevealed
                              ? isMine
                                ? 'bg-[#fecdd3] border border-[#f43f5e]'
                                : 'bg-[#f8fafc] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-slate-200'
                              : isFlagged
                              ? 'bg-[#505763] border-t border-l border-white/20 border-b-2 border-r-2 border-black/40 shadow-sm'
                              : isSelected
                              ? 'bg-amber-200 border-2 border-amber-500 ring-2 ring-amber-300 shadow-md scale-105'
                              : isMine
                              ? 'bg-[#fecdd3] hover:bg-[#fda4af] border border-[#f43f5e]/60 shadow-[0_2px_0_#f43f5e] rounded-lg'
                              : 'bg-[#505763] hover:bg-[#5e6675] text-white border-t border-l border-white/20 border-b-2 border-r-2 border-black/40 rounded-lg shadow-sm active:scale-95'
                          }`}
                        >
                          {cell.isExploded ? (
                            <div className="relative flex items-center justify-center">
                              <MineSpikeIcon size={26} />
                              <span className="absolute -top-1.5 -right-1.5 text-[10px] animate-ping">🔥</span>
                            </div>
                          ) : (isRevealed && isMine) ? (
                            <MineSpikeIcon size={26} />
                          ) : isFlagged ? (
                            <RedFlagIcon size={22} />
                          ) : isRevealed ? (
                            cell.neighborMines > 0 ? (
                              <span className={getNumberColor(cell.neighborMines)}>
                                {cell.neighborMines}
                              </span>
                            ) : null
                          ) : isMine ? (
                            <MineSpikeIcon size={22} />
                          ) : null}
                        </button>
                      );
                    })
                  )}
                </div>

              </div>

            </MinecraftFrame>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM WOODEN PLAQUE: — SAME LOGIC. NEW CHALLENGE. —                    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full flex items-center justify-center mt-2 mb-1">
        <div 
          className="px-6 py-2 rounded-lg flex items-center gap-2.5 text-white font-ui font-black text-xs sm:text-sm tracking-wider shadow-xl select-none"
          style={{
            background: 'linear-gradient(180deg, #8a4819 0%, #68340f 100%)',
            border: '2.5px solid #4a2107',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          }}
        >
          <GrassBlockIcon size={22} />
          <span className="drop-shadow-sm uppercase tracking-widest text-[#fde047]">
            — SAME LOGIC. NEW CHALLENGE. —
          </span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. MATH QUESTION POPUP MODAL                                              */}
      {/* ========================================================================= */}
      {activeQuestionCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#fbf7ee] rounded-3xl p-5 shadow-2xl border-4 border-[#505763] text-center">
            
            <div className="w-12 h-12 mx-auto -mt-10 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-2xl">🧮</span>
            </div>

            <h3 className="font-ui font-black text-lg text-slate-800 tracking-wide uppercase mt-2">
              Solve to Clear Safe Tile
            </h3>
            <p className="font-ui text-xs text-slate-500 font-medium mb-4">
              Enter correct answer to reveal the tile safely.
            </p>

            {/* Equation Box */}
            <div className="bg-white rounded-2xl p-4 border border-[#d6cfc0] shadow-inner mb-4">
              <div className="font-ui font-black text-3xl sm:text-4xl text-slate-900 tracking-wider">
                {currentQuestion.text} = ?
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleAnswerSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your Answer"
                className="w-full text-center font-ui font-black text-2xl py-2 px-4 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white shadow-inner"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveQuestionCell(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-ui font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] border border-[#15803d] font-ui font-black text-xs text-white uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Submit Answer ↵
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. GAME OVER / EXPLOSION MODAL                                            */}
      {/* ========================================================================= */}
      {showGameOverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#fbf7ee] rounded-3xl p-6 shadow-2xl border-4 border-red-500 text-center">
            
            <div className="w-16 h-16 mx-auto -mt-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
              <span className="text-3xl">💥</span>
            </div>

            <h2 className="font-ui font-black text-2xl text-red-600 tracking-wide uppercase mt-2">
              Detonation! Game Over!
            </h2>
            <p className="font-ui text-xs text-slate-600 font-medium mt-1">
              {explosionReason === 'calculation' 
                ? 'Incorrect math equation triggered the mine blast!'
                : 'You triggered a hidden naval mine!'}
            </p>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 my-4 text-center">
              <span className="text-xs font-bold text-red-700 block uppercase font-ui">Final Score</span>
              <span className="font-ui font-black text-2xl text-red-900">{score} pts</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] font-ui font-black text-sm text-white uppercase tracking-wider shadow-md cursor-pointer"
              >
                Try Again 🔄
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl border border-slate-300 font-ui font-bold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ← Back to Menu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. VICTORY MODAL                                                          */}
      {/* ========================================================================= */}
      {gameState === 'won' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#fbf7ee] rounded-3xl p-6 shadow-2xl border-4 border-emerald-500 text-center">
            
            <div className="w-16 h-16 mx-auto -mt-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
              <span className="text-3xl">🏆</span>
            </div>

            <h2 className="font-ui font-black text-2xl text-emerald-600 tracking-wide uppercase mt-2">
              Victory! Grid Cleared!
            </h2>
            <p className="font-ui text-xs text-slate-600 font-medium mt-1">
              All math equations solved and all hidden mines safely detected!
            </p>

            {playerName && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-ui font-black text-xs px-3 py-1 rounded-full">
                <span>👤</span>
                <span>Awarded to: {playerName}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 my-4 text-left">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-600 block font-ui uppercase">Clear Time</span>
                <span className="font-ui font-black text-lg text-emerald-900">{formatTime(seconds)}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-600 block font-ui uppercase">Final Score</span>
                <span className="font-ui font-black text-lg text-amber-900">{score} pts</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  playPop();
                  setShowCertificateModal(true);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-ui font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📜</span>
                <span>Claim Official Certificate</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-ui font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                Play Again 🔄
              </button>

              <button
                onClick={onBack}
                className="w-full py-2 rounded-xl border border-slate-300 font-ui font-bold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ← Choose Next Level
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <SettingsModal
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Leaderboard Modal */}
      {activeModal === 'leaderboard' && (
        <LeaderboardModal onClose={() => setActiveModal(null)} />
      )}

      {/* Win Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          playerName={playerName || 'Cadet Player'}
          levelTitle={levelTitle}
          levelSubtitle={levelSubtitle}
          score={score}
          timeFormatted={formatTime(seconds)}
          totalMines={totalMines}
          onClose={() => setShowCertificateModal(false)}
          onPlayNext={onBack}
        />
      )}

    </div>
  );
};

export default Game;