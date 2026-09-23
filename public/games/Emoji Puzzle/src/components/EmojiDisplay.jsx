import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import puzzles from '../data/puzzles';
import { soundFx } from '../utils/audio';
import {
  ArrowLeft,
  Lightbulb,
  Delete,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  ChevronRight,
  Award,
  Volume2,
  VolumeX,
  User,
  X,
  RefreshCw,
  Home
} from 'lucide-react';
import CertificateModal from './CertificateModal';
import { saveCertificateToHistory } from '../utils/storage';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';

// Helper to generate a scrambled letter pool with decoys
const generateLetterBank = (answer) => {
  const cleanAnswer = answer.toUpperCase().replace(/[^A-Z]/g, '');
  const answerLetters = cleanAnswer.split('');

  // Add 4-6 random decoy letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const decoys = [];
  const decoyCount = Math.max(4, 14 - answerLetters.length);

  for (let i = 0; i < decoyCount; i++) {
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    decoys.push(randomChar);
  }

  const combined = [...answerLetters, ...decoys];
  // Shuffle array
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.map((letter, index) => ({
    id: `${letter}-${index}-${Math.random()}`,
    letter,
    used: false,
  }));
};

const EmojiDisplay = ({
  difficulty = 'easy',
  levelNumber = 1,
  userName = 'Player',
  onBackToLevels,
  onBackToHome,
  onLevelComplete,
  onGoToNextLevel,
  isMuted = false,
  onToggleMute,
}) => {
  const [randomSeed, setRandomSeed] = useState(() => Math.random());

  // Get 2 randomized puzzles for this difficulty
  const levelPuzzles = useMemo(() => {
    const diffPuzzles = puzzles.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    const shuffled = [...diffPuzzles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [difficulty, levelNumber, randomSeed]);

  const [currentStage, setCurrentStage] = useState(0); // 0 (1/2) or 1 (2/2)
  const currentPuzzle = levelPuzzles[currentStage] || levelPuzzles[0];

  // Game Play States
  const [letterBank, setLetterBank] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]); // array of { bankId, letter }
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [isShaking, setIsShaking] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60.0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [reactionTime, setReactionTime] = useState(null);
  const stageStartTimeRef = useRef(Date.now());

  const [stageCleared, setStageCleared] = useState(false);
  const [levelCompletedModal, setLevelCompletedModal] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [candidateName, setCandidateName] = useState(userName || '');
  const [nameError, setNameError] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // 5-Second Win Auto-Certificate States
  const [certCountdown, setCertCountdown] = useState(5);
  const [certGenerated, setCertGenerated] = useState(false);
  const [levelStars, setLevelStars] = useState(3);
  const autoCertTimerRef = useRef(null);

  // Split answer into words and structure
  const rawAnswer = currentPuzzle ? currentPuzzle.answer.toUpperCase() : '';
  const answerWords = useMemo(() => {
    return rawAnswer.split(' ').map((word) => word.split(''));
  }, [rawAnswer]);

  const totalLettersRequired = useMemo(() => {
    return rawAnswer.replace(/[^A-Z]/g, '').length;
  }, [rawAnswer]);

  // Trigger Certificate Generation (Manual or Automatic after 5s)
  const triggerCertificateGeneration = useCallback((overrideName) => {
    if (autoCertTimerRef.current) {
      clearInterval(autoCertTimerRef.current);
      autoCertTimerRef.current = null;
    }
    const finalName = (overrideName || candidateName || userName || 'Player').trim() || 'Player';

    saveCertificateToHistory({
      userName: finalName,
      difficulty,
      levelNumber,
      score,
      stars: levelStars,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      certificateId: `NT-EP-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    setCertGenerated(true);
    soundFx.playLevelComplete();
    setShowNamePopup(false);
    setShowCertificateModal(true);
  }, [candidateName, userName, levelStars, difficulty, levelNumber, score]);

  // 5-Second countdown timer after level win
  useEffect(() => {
    if (levelCompletedModal && !certGenerated) {
      setCertCountdown(5);
      const interval = setInterval(() => {
        setCertCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            autoCertTimerRef.current = null;
            triggerCertificateGeneration();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      autoCertTimerRef.current = interval;

      return () => {
        clearInterval(interval);
        autoCertTimerRef.current = null;
      };
    } else {
      if (autoCertTimerRef.current) {
        clearInterval(autoCertTimerRef.current);
        autoCertTimerRef.current = null;
      }
    }
  }, [levelCompletedModal, certGenerated, triggerCertificateGeneration]);

  // Initialize or reset stage
  const initStage = useCallback((puzzle) => {
    if (!puzzle) return;
    if (autoCertTimerRef.current) {
      clearInterval(autoCertTimerRef.current);
      autoCertTimerRef.current = null;
    }
    setLetterBank(generateLetterBank(puzzle.answer));
    setSelectedLetters([]);
    setFeedback(null);
    setStageCleared(false);
    setLevelCompletedModal(false);
    setCertGenerated(false);
    setCertCountdown(5);
    setIsGameOver(false);
    setTimeLeft(60.0);
    setHintsUsed(0);
    stageStartTimeRef.current = Date.now();
  }, []);

  // When stage or puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      initStage(currentPuzzle);
    }
  }, [currentPuzzle, initStage]);

  // Timer countdown with Game Over trigger (decrements smoothly)
  useEffect(() => {
    if (stageCleared || levelCompletedModal || isGameOver || feedback === 'correct') return;

    const interval = 100; // update every 100ms for smooth .1s display
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundFx.playGameOver();
          return 0;
        }
        return Math.max(0, parseFloat((prev - 0.1).toFixed(1)));
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stageCleared, levelCompletedModal, isGameOver, feedback]);

  // Check Answer Handler
  const validateAnswer = useCallback(
    (currentSelections) => {
      const currentString = currentSelections.map((s) => s.letter).join('');
      const targetString = rawAnswer.replace(/[^A-Z]/g, '');

      if (currentString.length === targetString.length) {
        if (currentString === targetString) {
          // CORRECT ANSWER!
          soundFx.playCorrect();
          setFeedback('correct');

          const elapsedSecs = ((Date.now() - stageStartTimeRef.current) / 1000).toFixed(1);
          setReactionTime(elapsedSecs);

          const speedBonus = Math.max(10, Math.floor(timeLeft * 2));
          const hintPenalty = hintsUsed * 20;
          const stageScore = Math.max(50, 100 + speedBonus - hintPenalty);
          setScore((prev) => prev + stageScore);
          setStreak((prev) => prev + 1);

          setTimeout(() => {
            if (currentStage === 0 && levelPuzzles.length > 1) {
              // Move to Stage 2
              setStageCleared(true);
            } else {
              // Level Completed! (WIN)
              soundFx.playLevelComplete();
              const stars = hintsUsed === 0 && timeLeft > 20 ? 3 : hintsUsed <= 1 ? 2 : 1;
              setLevelStars(stars);
              setLevelCompletedModal(true);
              if (onLevelComplete) {
                onLevelComplete(difficulty, levelNumber, stars, score + stageScore);
              }
            }
          }, 900);
        } else {
          // WRONG ANSWER
          soundFx.playWrong();
          setFeedback('wrong');
          setIsShaking(true);
          setStreak(0);
          setTimeout(() => {
            setIsShaking(false);
            setFeedback(null);
          }, 1000);
        }
      }
    },
    [rawAnswer, timeLeft, hintsUsed, currentStage, levelPuzzles.length, onLevelComplete, difficulty, levelNumber, score]
  );

  // Handle letter bank selection
  const handleSelectLetter = useCallback(
    (bankItem) => {
      if (bankItem.used || feedback === 'correct' || stageCleared || isGameOver) return;
      if (selectedLetters.length >= totalLettersRequired) return;

      soundFx.playClick();

      // Mark letter as used in bank
      setLetterBank((prev) =>
        prev.map((item) => (item.id === bankItem.id ? { ...item, used: true } : item))
      );

      const nextSelections = [...selectedLetters, { bankId: bankItem.id, letter: bankItem.letter }];
      setSelectedLetters(nextSelections);

      if (nextSelections.length === totalLettersRequired) {
        validateAnswer(nextSelections);
      }
    },
    [feedback, stageCleared, isGameOver, selectedLetters, totalLettersRequired, validateAnswer]
  );

  // Handle removing a letter from slots
  const handleRemoveLetter = useCallback(
    (index) => {
      if (feedback === 'correct' || stageCleared || isGameOver) return;
      soundFx.playClick();

      const itemToRemove = selectedLetters[index];
      if (!itemToRemove) return;

      // Free up letter in bank
      setLetterBank((prev) =>
        prev.map((item) => (item.id === itemToRemove.bankId ? { ...item, used: false } : item))
      );

      const updated = selectedLetters.filter((_, i) => i !== index);
      setSelectedLetters(updated);
      setFeedback(null);
    },
    [feedback, stageCleared, isGameOver, selectedLetters]
  );

  // Handle Backspace (Delete last)
  const handleDeleteLast = useCallback(() => {
    if (selectedLetters.length === 0 || feedback === 'correct' || isGameOver) return;
    handleRemoveLetter(selectedLetters.length - 1);
  }, [selectedLetters, feedback, isGameOver, handleRemoveLetter]);

  // Handle Clear All
  const handleClearAll = useCallback(() => {
    if (selectedLetters.length === 0 || feedback === 'correct' || isGameOver) return;
    soundFx.playClick();
    setLetterBank((prev) => prev.map((item) => ({ ...item, used: false })));
    setSelectedLetters([]);
    setFeedback(null);
  }, [selectedLetters, feedback, isGameOver]);

  // Handle Hint (fills next empty correct letter - Max 3 characters)
  const handleHint = useCallback(() => {
    if (feedback === 'correct' || stageCleared || isGameOver || hintsUsed >= 3) return;
    const cleanAnswer = rawAnswer.replace(/[^A-Z]/g, '');
    const currentLength = selectedLetters.length;

    if (currentLength >= cleanAnswer.length) return;

    const nextCorrectLetter = cleanAnswer[currentLength];
    // Find available bank item matching nextCorrectLetter
    const availableBankItem = letterBank.find(
      (item) => !item.used && item.letter === nextCorrectLetter
    );

    if (availableBankItem) {
      soundFx.playHover();
      setHintsUsed((prev) => prev + 1);
      handleSelectLetter(availableBankItem);
    }
  }, [feedback, stageCleared, isGameOver, hintsUsed, rawAnswer, selectedLetters.length, letterBank, handleSelectLetter]);

  // Keyboard input listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stageCleared || levelCompletedModal || isGameOver || showExitDialog) return;

      if (e.key === 'Backspace') {
        handleDeleteLast();
      } else if (e.key === 'Escape') {
        setShowExitDialog(true);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const char = e.key.toUpperCase();
        const available = letterBank.find((item) => !item.used && item.letter === char);
        if (available) {
          handleSelectLetter(available);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [letterBank, selectedLetters, stageCleared, levelCompletedModal, isGameOver, showExitDialog, handleDeleteLast, handleSelectLetter]);

  // Next Stage Transition (from Stage 1 to Stage 2)
  const handleNextStage = () => {
    soundFx.playClick();
    setCurrentStage(1);
    setStageCleared(false);
  };

  // Play Again after Game Over
  const handlePlayAgain = () => {
    soundFx.playClick();
    setIsGameOver(false);
    setCurrentStage(0);
    setScore(0);
    setHintsUsed(0);
    setStreak(1);
    setReactionTime(null);
    setRandomSeed(Math.random());
  };

  // Letter cursor for slot mapping
  let letterCursor = 0;

  // Progress Bar Percentage
  const progressPercent = totalLettersRequired > 0
    ? Math.min(100, Math.round(((currentStage * totalLettersRequired + selectedLetters.length) / (2 * totalLettersRequired)) * 100))
    : 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-2 sm:px-4 md:px-6 py-3 sm:py-5 select-none font-['Outfit',sans-serif] overflow-x-hidden">
      {/* ================= BACKGROUND IMAGE LAYER ================= */}
      <img
        src={bgImg}
        alt="Cinema Background"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none z-0"
      />
      {/* Subtle Cinema Vignette Overlay */}
      <div className="absolute inset-0 bg-black/35 sm:bg-black/30 pointer-events-none z-0" />

      {/* ================= TOP HEADER BRANDING BADGE ================= */}
      <div className="relative w-full max-w-5xl flex items-center justify-between z-20 pt-1 pb-2 px-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 shadow-md">
          <img
            src={nebuloidLogo}
            alt="Nebuloid"
            className="h-5 sm:h-6 w-auto brightness-0 invert drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
          />
          <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-white uppercase font-['Plus_Jakarta_Sans',sans-serif]">
            NEBULOID TECH STUDIO LLP
          </span>
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            if (onToggleMute) onToggleMute();
          }}
          className="p-2 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white/90 hover:text-orange-400 hover:border-orange-400/60 active:scale-95 transition-all cursor-pointer shadow-md"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
        </button>
      </div>

      {/* ================= MAIN FROSTED GLASS CONTAINER (MATCHING IMAGE) ================= */}
      <main className="relative w-full max-w-5xl rounded-3xl sm:rounded-[2.5rem] bg-black/40 backdrop-blur-md sm:backdrop-blur-lg border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.25)] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between z-10 my-auto transition-all">
        
        {/* ================= 1. TOP BAR: 3 PILLS ROW ================= */}
        <div className="w-full flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
          {/* Left Pill: LEVEL X - DIFFICULTY */}
          <div className="bg-[#f97316] border-2 border-white rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center shrink-0">
            <span className="text-black font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase whitespace-nowrap">
              LEVEL {levelNumber} - {difficulty.toUpperCase()}
            </span>
          </div>

          {/* Center Wide Pill: MENU | TIMER | SCORE */}
          <div className="flex-1 bg-[#f97316] border-2 border-white rounded-full px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 flex items-center justify-between shadow-md text-black font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase">
            {/* Left: MENU Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowExitDialog(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Return to Menu"
            >
              <span className="text-base sm:text-lg leading-none">←</span>
              <span>MENU</span>
            </button>

            {/* Center: Countdown Timer with Clock Icon */}
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              <span>{timeLeft.toFixed(1)}S</span>
            </div>

            {/* Right: Score */}
            <div className="flex items-center gap-1">
              <span>SCORE</span>
              <span className="font-mono">{score}</span>
            </div>
          </div>

          {/* Right Pill: STREAK */}
          <div className="bg-[#f97316] border-2 border-white rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center shrink-0">
            <span className="text-black font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase whitespace-nowrap">
              STREAK: {streak}x
            </span>
          </div>
        </div>

        {/* ================= 2. SUB-HEADER: REACTION STATS & PROGRESS BAR ================= */}
        <div className="w-full mb-3 sm:mb-4 px-1">
          <div className="flex justify-between items-center text-white font-extrabold text-[11px] sm:text-xs tracking-widest uppercase mb-1.5">
            <span>REACTION: {reactionTime ? `${reactionTime}S` : '--'}</span>
            <span>HITS {currentStage + (feedback === 'correct' ? 1 : 0)}/2</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2 sm:h-2.5 rounded-full bg-white/20 overflow-hidden p-0.5 border border-white/20 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 transition-all duration-300 shadow-sm"
              style={{
                width: `${Math.max(5, progressPercent)}%`
              }}
            />
          </div>
        </div>

        {/* ================= 3. CENTER: ORANGE EMOJI DISPLAY BOX ================= */}
        <div className="w-full max-w-xl bg-[#e67523] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-white/25 flex items-center justify-center gap-4 sm:gap-8 my-2 sm:my-3">
          {currentPuzzle?.emojis.map((emoji, index) => (
            <React.Fragment key={index}>
              {/* White Tile Card */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-center p-2.5 sm:p-3 border border-neutral-100 transition-transform hover:scale-105 duration-200">
                {/* Inner Orange Square with Emoji */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-7xl shadow-inner select-none">
                  <span className="filter drop-shadow-sm">{emoji}</span>
                </div>
              </div>

              {/* Plus Sign between Emojis */}
              {index < currentPuzzle.emojis.length - 1 && (
                <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-md select-none">
                  +
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ================= 4. ANSWER LETTER SLOTS (GROUPED BY WORDS) ================= */}
        <div className={`w-full flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 gap-y-2 my-2 sm:my-3 ${isShaking ? 'animate-shake' : ''}`}>
          {answerWords.map((word, wordIndex) => (
            <div key={wordIndex} className="flex items-center gap-1 sm:gap-1.5">
              {word.map((char, charIndex) => {
                const isSpecialChar = !/^[A-Z]$/.test(char);
                if (isSpecialChar) {
                  return (
                    <span key={charIndex} className="text-lg sm:text-xl font-black text-white px-1">
                      {char}
                    </span>
                  );
                }

                const currentIndex = letterCursor;
                letterCursor++;
                const filledItem = selectedLetters[currentIndex];

                return (
                  <button
                    key={charIndex}
                    type="button"
                    onClick={() => filledItem && handleRemoveLetter(currentIndex)}
                    className={`w-9 h-10 sm:w-11 sm:h-12 md:w-12 md:h-13 rounded-xl sm:rounded-2xl border-2 font-black text-base sm:text-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      filledItem
                        ? feedback === 'correct'
                          ? 'bg-emerald-500 border-emerald-400 text-white scale-105'
                          : feedback === 'wrong'
                          ? 'bg-rose-500 border-rose-400 text-white'
                          : 'bg-white border-white text-black hover:bg-neutral-100 active:scale-95'
                        : 'bg-white border-white/80 text-transparent shadow-inner'
                    }`}
                    title={filledItem ? 'Click to remove letter' : ''}
                  >
                    {filledItem ? filledItem.letter : ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Status Feedback Notification */}
        <div className="h-5 sm:h-6 flex items-center justify-center">
          {feedback === 'correct' && (
            <div className="text-xs font-black tracking-wider uppercase text-emerald-300 flex items-center gap-1 animate-bounce drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> Correct Answer!
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="text-xs font-black tracking-wider uppercase text-rose-300 flex items-center gap-1 animate-pulse drop-shadow-sm">
              <AlertCircle className="w-4 h-4" /> Not quite, try again!
            </div>
          )}
        </div>

        {/* ================= 5. LETTER BANK (ORANGE KEYBOARD CONTAINER) ================= */}
        <div className="w-full max-w-xl bg-[#e67523] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20 flex flex-col items-center my-2 sm:my-3">
          {/* Header Subtitle */}
          <div className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase mb-2 sm:mb-3 drop-shadow-xs">
            TAP LETTERS OR TYPE ON KEYBOARD
          </div>

          {/* Grid of White Letter Tiles */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-md">
            {letterBank.map((bankItem) => (
              <button
                key={bankItem.id}
                type="button"
                onClick={() => handleSelectLetter(bankItem)}
                disabled={bankItem.used || feedback === 'correct' || isGameOver}
                className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-lg sm:rounded-xl shadow-md font-black text-black text-xs sm:text-sm uppercase flex items-center justify-center transition-all ${
                  bankItem.used
                    ? 'opacity-0 pointer-events-none scale-75'
                    : 'hover:bg-neutral-100 hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                {bankItem.letter}
              </button>
            ))}
          </div>
        </div>

        {/* ================= 6. BOTTOM ACTION CONTROLS: HINT, DELETE, CLEAR ================= */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mt-1 sm:mt-2">
          {/* Hint Button */}
          <button
            type="button"
            onClick={handleHint}
            disabled={hintsUsed >= 3 || feedback === 'correct' || isGameOver}
            className={`bg-[#ea580c] border border-white/70 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md flex items-center gap-1.5 transition-all ${
              hintsUsed >= 3 || feedback === 'correct' || isGameOver
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95 cursor-pointer hover:bg-orange-500'
            }`}
            title={hintsUsed >= 3 ? 'Max 3 hints used' : `Use hint (${3 - hintsUsed} left)`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
            <span>HINT ({3 - hintsUsed}/3)</span>
          </button>

          {/* Delete Last Button */}
          <button
            type="button"
            onClick={handleDeleteLast}
            disabled={selectedLetters.length === 0 || feedback === 'correct' || isGameOver}
            className="bg-white/25 hover:bg-white/35 backdrop-blur-sm border border-white/40 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>DELETE</span>
          </button>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={handleClearAll}
            disabled={selectedLetters.length === 0 || feedback === 'correct' || isGameOver}
            className="bg-white/25 hover:bg-white/35 backdrop-blur-sm border border-white/40 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        </div>
      </main>

      {/* ================= FOOTER: BRANDING ================= */}
      <footer className="w-full text-center z-20 py-1">
        <p className="text-[10px] sm:text-xs tracking-wider text-white/60 font-medium flex items-center justify-center gap-2">
          <span>Nebuloid Tech Studio LLP</span>
          <span className="text-orange-400">•</span>
          <span>Guess • Solve • Achieve</span>
        </p>
      </footer>

      {/* ================= MODAL 1: STAGE 1/2 CLEARED BANNER ================= */}
      {stageCleared && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl text-white">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-[10px] font-black tracking-[0.25em] text-neutral-400 uppercase">
              STAGE 1 COMPLETED
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              Awesome Solve!
            </h3>
            <p className="text-xs text-neutral-300 mt-2 mb-5">
              1 out of 2 puzzles cleared for <span className="font-bold text-orange-400">{difficulty.toUpperCase()} Level {levelNumber}</span>. Ready for Stage 2?
            </p>

            <button
              onClick={handleNextStage}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <span>Play Stage 2 (2/2)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: LEVEL COMPLETED CELEBRATION ================= */}
      {levelCompletedModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-md p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden text-white">
            {/* Top Trophy */}
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl border-2 border-amber-400 shadow-md">
                🏆
              </div>
            </div>

            <div className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase mt-2">
              {difficulty.toUpperCase()} DIFFICULTY
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              Level {levelNumber} Cleared!
            </h3>

            {/* Star Rating Display */}
            <div className="flex justify-center gap-2 my-4">
              <Star className="w-8 h-8 fill-amber-400 text-amber-400 drop-shadow-sm" />
              <Star className="w-8 h-8 fill-amber-400 text-amber-400 drop-shadow-sm" />
              <Star className={`w-8 h-8 ${hintsUsed === 0 ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}`} />
            </div>

            {/* Score & Solver Details */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 mb-3.5 text-left">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-400 font-bold">SOLVER:</span>
                <span className="font-extrabold text-white uppercase">{userName}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-400 font-bold">PUZZLES SOLVED:</span>
                <span className="font-extrabold text-emerald-400">2 / 2 (100%)</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-white/10">
                <span className="text-neutral-300 font-black">TOTAL LEVEL SCORE:</span>
                <span className="font-black text-base text-amber-400">+{score} PTS</span>
              </div>
            </div>

            {/* 5-Second Auto Certificate Generation Countdown Card */}
            <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 border border-blue-400/40 rounded-xl p-3.5 mb-3.5 text-center relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Official Certificate</span>
                </div>
                {!certGenerated ? (
                  <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-amber-400/30">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>Auto-generating in {certCountdown}s</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Generated</span>
                  </div>
                )}
              </div>

              {/* Countdown Progress Bar */}
              {!certGenerated && (
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-2.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(certCountdown / 5) * 100}%` }}
                  />
                </div>
              )}

              {/* Recipient Name Input */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 mb-2.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">Recipient:</span>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Player Name"
                  maxLength={26}
                  className="bg-transparent text-white text-xs font-extrabold uppercase focus:outline-none flex-1"
                />
              </div>

              {/* Generate / View Certificate Button */}
              <button
                onClick={() => triggerCertificateGeneration(candidateName)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>{certGenerated ? "View / Download Certificate 🎓" : "Generate Certificate Now ⚡"}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {levelNumber < 5 ? (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    if (autoCertTimerRef.current) {
                      clearInterval(autoCertTimerRef.current);
                      autoCertTimerRef.current = null;
                    }
                    if (onGoToNextLevel) {
                      onGoToNextLevel(levelNumber + 1);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <span>Play Level {levelNumber + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs font-bold text-amber-300 text-center mb-1">
                  🎉 Congratulations! You have mastered all 5 levels in {difficulty}!
                </div>
              )}

              <button
                onClick={() => {
                  soundFx.playClick();
                  if (autoCertTimerRef.current) {
                    clearInterval(autoCertTimerRef.current);
                    autoCertTimerRef.current = null;
                  }
                  onBackToLevels();
                }}
                className="w-full border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
              >
                Back To Level Select
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: GAME OVER POPUP (Timer Over) ================= */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-md p-6 sm:p-8 text-center shadow-2xl text-white">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto mb-3 text-rose-500 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase">
              TIME EXPIRED
            </div>

            <h3 className="text-3xl font-black text-rose-500 uppercase tracking-tight mt-1">
              GAME OVER
            </h3>

            <p className="text-xs text-neutral-300 mt-2 mb-4">
              Time ran out on <span className="font-bold text-orange-400">{difficulty.toUpperCase()} Level {levelNumber} (Stage {currentStage + 1}/2)</span>.
            </p>

            {/* Answer Reveal Box */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Correct Answer Was:
              </div>
              <div className="text-xl font-black text-amber-400 tracking-widest uppercase">
                {rawAnswer}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onBackToLevels();
                }}
                className="w-full border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
              >
                Back To Levels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: EXIT CONFIRMATION DIALOG ================= */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl text-white">
            <h4 className="text-base font-black uppercase tracking-wider text-white mb-1.5">
              Leave Current Level?
            </h4>
            <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
              Your current puzzle progress in this level will be reset.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowExitDialog(false);
                  onBackToLevels();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-md"
              >
                Exit Game
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowExitDialog(false);
                }}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: ENTER NAME FOR CERTIFICATE ================= */}
      {showNamePopup && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative text-white">
            <button
              onClick={() => setShowNamePopup(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Award className="w-7 h-7" />
            </div>

            <div className="text-[10px] font-black tracking-[0.25em] text-neutral-400 uppercase">
              CERTIFICATE RECIPIENT
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              Enter Your Name
            </h3>
            <p className="text-xs text-neutral-300 mt-1 mb-4">
              Enter the recipient name to appear on your official Nebuloid Certificate.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = candidateName.trim();
                if (!trimmed) {
                  setNameError('Please enter your name');
                  soundFx.playWrong();
                  return;
                }
                soundFx.playLevelComplete();
                const earnedStars = hintsUsed === 0 && timeLeft > 20 ? 3 : hintsUsed <= 1 ? 2 : 1;

                saveCertificateToHistory({
                  userName: trimmed,
                  difficulty,
                  levelNumber,
                  score,
                  stars: earnedStars,
                  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                  certificateId: `NT-EP-${Math.floor(100000 + Math.random() * 900000)}`,
                });

                setShowNamePopup(false);
                setShowCertificateModal(true);
              }}
              className="flex flex-col gap-3 text-left"
            >
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-300 mb-1">
                  Recipient Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Mausam"
                    autoFocus
                    maxLength={26}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-800 border-2 border-neutral-700 focus:border-amber-400 text-white rounded-xl text-sm font-bold uppercase outline-none transition-colors placeholder:text-neutral-500"
                  />
                </div>
                {nameError && (
                  <p className="text-[11px] font-bold text-rose-400 mt-1">
                    {nameError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Save & Generate
                </button>
                <button
                  type="button"
                  onClick={() => setShowNamePopup(false)}
                  className="px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        userName={candidateName || userName || 'Candidate'}
        difficulty={difficulty}
        levelNumber={levelNumber}
        score={score}
        stars={levelStars}
      />
    </div>
  );
};

export default EmojiDisplay;