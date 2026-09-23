import React, { useState, useEffect, useCallback, useRef } from "react";
import StartScreen from "./components/StartScreen";
import DifficultyScreen from "./components/DifficultyScreen";
import ModeScreen from "./components/ModeScreen";
import GameHeader from "./components/GameHeader";
import ProgressBar from "./components/ProgressBar";
import LogoCard from "./components/LogoCard";
import AnswerGrid from "./components/AnswerGrid";
import Timer from "./components/Timer";
import HintButton from "./components/HintButton";
import FeedbackMessage from "./components/FeedbackMessage";
import DualTeamArena from "./components/DualTeamArena";
import RobotDuelArena from "./components/RobotDuelArena";
import ResultScreen from "./components/ResultScreen";
import PlayerSetupScreen from "./components/PlayerSetupScreen";
import TopLogoBanner from "./components/TopLogoBanner";
import startBottomImg from "./assets/start-bottom.png";

import { LOGO_QUESTIONS } from "./data/logos";
import { getRandomQuestions } from "./utils/shuffle";
import { calculateScore } from "./utils/scoring";
import { sound } from "./utils/sound";
import { storage } from "./utils/storage";
import { useTimer } from "./hooks/useTimer";

export default function App() {
  // Game Machine States: 'start' | 'difficulty' | 'mode' | 'player-setup' | 'playing' | 'result'
  const [gameStatus, setGameStatus] = useState("start");
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [gameMode, setGameMode] = useState("self"); // 'self' | 'team' | 'robot'
  const [playerNames, setPlayerNames] = useState({
    team1: "Team 1",
    team2: "Team 2",
    player: "Player 1",
    robot: "Robo AI",
  });

  // Stored Records
  const [bestScore, setBestScore] = useState(() => storage.getBestScore());
  const [gamesPlayed, setGamesPlayed] = useState(() =>
    storage.getGamesPlayed(),
  );
  const [soundEnabled, setSoundEnabled] = useState(() =>
    storage.getSoundEnabled(),
  );

  // Active Quiz Questions Pool
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Common Round States
  const [score, setScore] = useState(0);
  const [scoreDelta, setScoreDelta] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [scoreResult, setScoreResult] = useState({
    total: 0,
    base: 0,
    timeBonus: 0,
    penalty: 0,
  });
  const [usedHint, setUsedHint] = useState(false);
  const [remainingHints, setRemainingHints] = useState(3);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);

  // Session Statistics
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  // Real-time Duel States
  const [firstResponder, setFirstResponder] = useState(null); // null | 'team1' | 'team2' | 'user' | 'robot'
  const [teamScores, setTeamScores] = useState({ team1: 0, team2: 0 });
  const [team1Selected, setTeam1Selected] = useState(null);
  const [team2Selected, setTeam2Selected] = useState(null);

  // vs Robot Real-Time States
  const [userDuelScore, setUserDuelScore] = useState(0);
  const [robotDuelScore, setRobotDuelScore] = useState(0);
  const [userSelected, setUserSelected] = useState(null);
  const [robotAnswer, setRobotAnswer] = useState(null);
  const [robotCorrect, setRobotCorrect] = useState(false);
  const [robotCountdown, setRobotCountdown] = useState(5);



  // Sync sound engine
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Clean up robot question ref on unmount
  useEffect(() => {
    return () => {
      robotQuestionRef.current = null;
    };
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      storage.setSoundEnabled(next);
      sound.setEnabled(next);
      if (next) sound.playClick();
      return next;
    });
  }, []);

  const currentQuestion = quizQuestions[currentIndex] || null;

  // Store current robot question ref for tick-based robot answer
  const robotQuestionRef = useRef(null);

  const startLiveRobotCountdown = useCallback(
    (question) => {
      robotQuestionRef.current = question;
      setRobotCountdown(9); // Robot will answer after 5s of scanning (at timeRemaining=5)
    },
    [],
  );

  // Timeout handler for countdown
  const handleTimeout = useCallback(() => {
    if (isAnswered || !currentQuestion) return;

    robotQuestionRef.current = null;

    setIsAnswered(true);
    setIsTimeout(true);
    setIsCorrect(false);
    setSelectedAnswer(null);
    setWrongCount((prev) => prev + 1);
    setScoreResult({ total: 0, base: 0, timeBonus: 0, penalty: 0 });
    sound.playWrong();
  }, [isAnswered, currentQuestion]);

  // Tick handler for sound alert on low time + Robot answer trigger
  const handleTick = useCallback((secondsLeft) => {
    if (secondsLeft <= 5 && secondsLeft > 0) {
      sound.playTick();
    }

    // Robot mode: scanning phase (6s → 5s remaining), answer at 5s (10 sec elapsed)
    if (gameMode === "robot" && !isAnswered && robotQuestionRef.current) {
      if (secondsLeft <= 6 && secondsLeft > 2) {
        // Robot is scanning — update countdown display
        setRobotCountdown(secondsLeft - 2);
        sound.playRobotScan();
      }

      // Robot answers at exactly 5s remaining (10 sec after start)
      if (secondsLeft === 2) {
        const question = robotQuestionRef.current;
        setRobotCountdown(0);

        // Robot AI answer logic: 75% accuracy
        const isRobotCorrect = Math.random() < 0.75;
        let chosenOption = question.brand;

        if (!isRobotCorrect) {
          const wrongOptions = question.options.filter(
            (opt) => opt.toLowerCase() !== question.brand.toLowerCase(),
          );
          chosenOption =
            wrongOptions[Math.floor(Math.random() * wrongOptions.length)] ||
            question.brand;
        }

        setIsAnswered(true);
        setFirstResponder("robot");
        setRobotAnswer(chosenOption);
        setRobotCorrect(isRobotCorrect);
        setIsCorrect(isRobotCorrect);

        if (isRobotCorrect) {
          setRobotDuelScore((prev) => prev + 1);
          sound.playCorrect();
        } else {
          sound.playWrong();
        }

        sound.playRobotBeep();
        robotQuestionRef.current = null;
      }
    }
  }, [gameMode, isAnswered]);

  // Timer custom hook
  const {
    timeRemaining,
    isWarning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useTimer({
    initialSeconds: 15,
    onTimeout: handleTimeout,
    onTick: handleTick,
  });

  // Step 1 -> Step 2 (Start -> Difficulty)
  const handleProceedToDifficulty = useCallback(() => {
    sound.playClick();
    setGameStatus("difficulty");
  }, []);

  // Step 2 -> Step 3 (Difficulty -> Mode Selection)
  const handleSelectDifficulty = useCallback((diff) => {
    sound.playClick();
    setCurrentDifficulty(diff);
    setGameStatus("mode");
  }, []);

  // Step 3 -> Player Setup (for Team vs Team & vs Robot) or direct start
  const handleSelectMode = useCallback(
    (mode) => {
      sound.playClick();
      setGameMode(mode);
      if (mode === "team" || mode === "robot") {
        setGameStatus("player-setup");
      } else {
        handleStartQuiz(currentDifficulty, mode);
      }
    },
    [currentDifficulty],
  );

  // Gameplay Start
  const handleStartQuiz = useCallback(
    (difficulty = currentDifficulty, mode = gameMode, customNames = null) => {
      sound.playClick();
      setCurrentDifficulty(difficulty);
      setGameMode(mode);
      if (customNames) {
        setPlayerNames(customNames);
      }

      // In Self mode: 10 questions. In Team / Robot mode: 36 questions pool (race to 10 points)
      const questionCount = mode === "self" ? 10 : 36;
      const questions = getRandomQuestions(
        LOGO_QUESTIONS,
        questionCount,
        difficulty,
      );

      setQuizQuestions(questions);
      setCurrentIndex(0);
      setScore(0);
      setScoreDelta(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setIsTimeout(false);
      setUsedHint(false);
      setRemainingHints(3);
      setEliminatedOptions([]);
      setCorrectCount(0);
      setWrongCount(0);
      setTotalHintsUsed(0);
      setIsNewBest(false);

      // Reset Team vs Team
      setTeamScores({ team1: 0, team2: 0 });
      setTeam1Selected(null);
      setTeam2Selected(null);
      setFirstResponder(null);

      // Reset vs Robot
      setUserDuelScore(0);
      setRobotDuelScore(0);
      setUserSelected(null);
      setRobotAnswer(null);
      setRobotCorrect(false);
      setRobotCountdown(5);
      robotQuestionRef.current = null;

      setGameStatus("playing");
      resetTimer(15);
      startTimer();

      // If robot mode, store question ref for tick-based answer
      if (mode === "robot" && questions[0]) {
        startLiveRobotCountdown(questions[0]);
      }
    },
    [
      currentDifficulty,
      gameMode,
      resetTimer,
      startTimer,
      startLiveRobotCountdown,
    ],
  );

  // Self Mode: Select Answer Handler
  const handleSelectAnswer = useCallback(
    (option) => {
      if (isAnswered || !currentQuestion) return;

      pauseTimer();
      setSelectedAnswer(option);
      setIsAnswered(true);
      setIsTimeout(false);

      const correct =
        option.toLowerCase() === currentQuestion.brand.toLowerCase();
      setIsCorrect(correct);

      if (correct) {
        sound.playCorrect();
        const res = calculateScore({
          difficulty: currentQuestion.difficulty,
          remainingTime: timeRemaining,
          isCorrect: true,
          usedHint,
        });
        setScoreResult(res);
        setScore((prev) => prev + res.total);
        setScoreDelta(res.total);
        setCorrectCount((prev) => prev + 1);
      } else {
        sound.playWrong();
        setScoreResult({ total: 0, base: 0, timeBonus: 0, penalty: 0 });
        setScoreDelta(0);
        setWrongCount((prev) => prev + 1);
      }
    },
    [isAnswered, currentQuestion, pauseTimer, timeRemaining, usedHint],
  );

  // Team vs Team: Real-time Selection Handler (Who answers first scores!)
  const handleTeamSelectAnswer = useCallback(
    (teamKey, option) => {
      if (isAnswered || !currentQuestion) return;

      pauseTimer();
      setIsAnswered(true);
      setFirstResponder(teamKey);

      if (teamKey === "team1") {
        setTeam1Selected(option);
      } else {
        setTeam2Selected(option);
      }

      const correct =
        option.toLowerCase() === currentQuestion.brand.toLowerCase();
      setIsCorrect(correct);

      if (correct) {
        sound.playCorrect();
        setTeamScores((prev) => ({
          ...prev,
          [teamKey]: prev[teamKey] + 1,
        }));
      } else {
        sound.playWrong();
      }
    },
    [isAnswered, currentQuestion, pauseTimer],
  );

  // vs Robot: User Select Answer Handler (User answers before 5s robot timer!)
  const handleUserSelectAnswer = useCallback(
    (option) => {
      if (isAnswered || !currentQuestion) return;

      // Stop Robot's scanning because user was faster!
      robotQuestionRef.current = null;

      pauseTimer();
      setIsAnswered(true);
      setFirstResponder("user");
      setUserSelected(option);

      const correct =
        option.toLowerCase() === currentQuestion.brand.toLowerCase();
      setIsCorrect(correct);

      if (correct) {
        sound.playCorrect();
        setUserDuelScore((prev) => prev + 1);
      } else {
        sound.playWrong();
      }
    },
    [isAnswered, currentQuestion, pauseTimer],
  );

  // Use Hint Handler (Self mode)
  const handleUseHint = useCallback(() => {
    if (isAnswered || usedHint || remainingHints <= 0 || !currentQuestion)
      return;

    sound.playHint();
    setUsedHint(true);
    setRemainingHints((prev) => prev - 1);
    setTotalHintsUsed((prev) => prev + 1);

    // Eliminate 1 wrong answer
    const wrongAnswers = currentQuestion.options.filter(
      (opt) => opt.toLowerCase() !== currentQuestion.brand.toLowerCase(),
    );
    if (wrongAnswers.length > 0) {
      const toEliminate =
        wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      setEliminatedOptions([toEliminate]);
    }
  }, [isAnswered, usedHint, remainingHints, currentQuestion]);

  // Next Question or Finish Quiz
  const handleNextQuestion = useCallback(() => {
    sound.playClick();

    // Check Win Condition for Team vs Team and vs Robot
    const isTeamOver =
      gameMode === "team" && (teamScores.team1 >= 10 || teamScores.team2 >= 10);
    const isRobotDuelOver =
      gameMode === "robot" && (userDuelScore >= 10 || robotDuelScore >= 10);
    const isSelfOver =
      gameMode === "self" && currentIndex >= quizQuestions.length - 1;

    if (
      isTeamOver ||
      isRobotDuelOver ||
      isSelfOver ||
      currentIndex >= quizQuestions.length - 1
    ) {
      // Match Complete!
      pauseTimer();
      robotQuestionRef.current = null;

      const updatedGames = storage.incrementGamesPlayed();
      setGamesPlayed(updatedGames);

      if (gameMode === "self") {
        const isHigh = storage.setBestScore(score);
        if (isHigh) {
          setIsNewBest(true);
          setBestScore(score);
        }
      }

      setGameStatus("result");
      sound.playFanfare();
      return;
    }

    // Reset round states
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsTimeout(false);
    setUsedHint(false);
    setEliminatedOptions([]);
    setScoreDelta(0);

    // Reset Team duel states
    setFirstResponder(null);
    setTeam1Selected(null);
    setTeam2Selected(null);

    // Reset Robot duel states
    setUserSelected(null);
    setRobotAnswer(null);
    setRobotCorrect(false);
    setRobotCountdown(5);

    resetTimer(15);
    startTimer();

    // If vs Robot mode, store question ref for tick-based answer
    if (gameMode === "robot" && quizQuestions[nextIdx]) {
      startLiveRobotCountdown(quizQuestions[nextIdx]);
    }
  }, [
    gameMode,
    teamScores,
    userDuelScore,
    robotDuelScore,
    currentIndex,
    quizQuestions,
    pauseTimer,
    score,
    resetTimer,
    startTimer,
    startLiveRobotCountdown,
  ]);

  // Return to Home
  const handleQuitToHome = useCallback(() => {
    sound.playClick();
    pauseTimer();
    robotQuestionRef.current = null;
    setGameStatus("start");
  }, [pauseTimer]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Mute with 'M'
      if (e.key === "m" || e.key === "M") {
        toggleSound();
        return;
      }

      if (gameStatus === "start") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleProceedToDifficulty();
        }
      } else if (gameStatus === "difficulty") {
        if (e.key === "1") handleSelectDifficulty("easy");
        if (e.key === "2") handleSelectDifficulty("medium");
        if (e.key === "3") handleSelectDifficulty("hard");
        if (e.key === "Escape") setGameStatus("start");
      } else if (gameStatus === "mode") {
        if (e.key === "1") handleStartQuiz(currentDifficulty, "self");
        if (e.key === "2") handleStartQuiz(currentDifficulty, "team");
        if (e.key === "3") handleStartQuiz(currentDifficulty, "robot");
        if (e.key === "Escape") setGameStatus("difficulty");
      } else if (gameStatus === "playing") {
        if (!isAnswered && currentQuestion) {
          // SELF MODE: Keys 1-4 or A-D
          if (gameMode === "self") {
            if (["1", "2", "3", "4"].includes(e.key)) {
              const idx = parseInt(e.key, 10) - 1;
              if (currentQuestion.options[idx])
                handleSelectAnswer(currentQuestion.options[idx]);
            }
            const keyUpper = e.key.toUpperCase();
            if (["A", "B", "C", "D"].includes(keyUpper)) {
              const idx = keyUpper.charCodeAt(0) - 65;
              if (currentQuestion.options[idx])
                handleSelectAnswer(currentQuestion.options[idx]);
            }
            if (e.key === "h" || e.key === "H") handleUseHint();
          }

          // TEAM VS TEAM MODE: Simultaneous keys
          if (gameMode === "team") {
            // Team 1: Keys 1, 2, 3, 4
            if (["1", "2", "3", "4"].includes(e.key)) {
              const idx = parseInt(e.key, 10) - 1;
              if (currentQuestion.options[idx])
                handleTeamSelectAnswer("team1", currentQuestion.options[idx]);
            }
            // Team 2: Keys 7, 8, 9, 0
            if (["7", "8", "9", "0"].includes(e.key)) {
              const map = { 7: 0, 8: 1, 9: 2, 0: 3 };
              const idx = map[e.key];
              if (currentQuestion.options[idx])
                handleTeamSelectAnswer("team2", currentQuestion.options[idx]);
            }
          }

          // VS ROBOT MODE (USER): Keys 1-4 or A-D
          if (gameMode === "robot") {
            if (["1", "2", "3", "4"].includes(e.key)) {
              const idx = parseInt(e.key, 10) - 1;
              if (currentQuestion.options[idx])
                handleUserSelectAnswer(currentQuestion.options[idx]);
            }
            const keyUpper = e.key.toUpperCase();
            if (["A", "B", "C", "D"].includes(keyUpper)) {
              const idx = keyUpper.charCodeAt(0) - 65;
              if (currentQuestion.options[idx])
                handleUserSelectAnswer(currentQuestion.options[idx]);
            }
          }
        } else if (isAnswered) {
          // Next question with Space or Enter
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleNextQuestion();
          }
        }
      } else if (gameStatus === "result") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleStartQuiz(currentDifficulty, gameMode);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameStatus,
    isAnswered,
    currentQuestion,
    currentDifficulty,
    gameMode,
    handleProceedToDifficulty,
    handleSelectDifficulty,
    handleStartQuiz,
    handleSelectAnswer,
    handleTeamSelectAnswer,
    handleUserSelectAnswer,
    handleUseHint,
    handleNextQuestion,
    toggleSound,
  ]);

  // Is game over based on 10 points threshold
  const isMatchOver =
    (gameMode === "team" &&
      (teamScores.team1 >= 10 || teamScores.team2 >= 10)) ||
    (gameMode === "robot" && (userDuelScore >= 10 || robotDuelScore >= 10)) ||
    (gameMode === "self" && currentIndex === quizQuestions.length - 1);

  return (
    <div className="relative min-h-screen bg-[#FEF5E6] text-black flex flex-col justify-between select-none overflow-hidden">
      {/* ================= GEOMETRIC CORNER ACCENTS (ONLY FOR RESULT SCREEN) ================= */}
      {gameStatus === "result" && (
        <>
          {/* Top-Left: Black Corner Triangle with White Diagonal Stripes */}
          <div className="absolute top-0 left-0 pointer-events-none z-0">
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="0,0 120,0 0,120" fill="#000000" />
              <line
                x1="22"
                y1="0"
                x2="0"
                y2="22"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
              <line
                x1="44"
                y1="0"
                x2="0"
                y2="44"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
              <line
                x1="66"
                y1="0"
                x2="0"
                y2="66"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
              <line
                x1="88"
                y1="0"
                x2="0"
                y2="88"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
            </svg>
          </div>

          {/* Top-Right: 4x4 Dot Grid Pattern */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 pointer-events-none z-0">
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={`tr-game-dot-${i}`}
                  className="w-1.5 h-1.5 rounded-full bg-black/80"
                />
              ))}
            </div>
          </div>

          {/* Bottom-Left: 4x4 Dot Grid Pattern */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 pointer-events-none z-0">
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={`bl-game-dot-${i}`}
                  className="w-1.5 h-1.5 rounded-full bg-black/80"
                />
              ))}
            </div>
          </div>

          {/* Bottom-Right: Black Corner Triangle with White Diagonal Stripes */}
          <div className="absolute bottom-0 right-0 pointer-events-none z-0">
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rotate-180"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="0,0 120,0 0,120" fill="#000000" />
              <line
                x1="22"
                y1="0"
                x2="0"
                y2="22"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
              <line
                x1="44"
                y1="0"
                x2="0"
                y2="44"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
              <line
                x1="66"
                y1="0"
                x2="0"
                y2="66"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
              <line
                x1="88"
                y1="0"
                x2="0"
                y2="88"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="square"
              />
            </svg>
          </div>
        </>
      )}

      {/* 1. START SCREEN */}
      {gameStatus === "start" && (
        <StartScreen
          onProceedToDifficulty={handleProceedToDifficulty}
          bestScore={bestScore}
          gamesPlayed={gamesPlayed}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      {/* 2. DIFFICULTY SELECTION SCREEN */}
      {gameStatus === "difficulty" && (
        <DifficultyScreen
          onSelectDifficulty={handleSelectDifficulty}
          onBack={() => setGameStatus("start")}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      {/* 3. MODE SELECTION SCREEN */}
      {gameStatus === "mode" && (
        <ModeScreen
          difficulty={currentDifficulty}
          onSelectMode={handleSelectMode}
          onBack={() => setGameStatus("difficulty")}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      {/* 3.5 PLAYER SETUP SCREEN (After Team vs Team and vs Robot) */}
      {gameStatus === "player-setup" && (
        <PlayerSetupScreen
          difficulty={currentDifficulty}
          gameMode={gameMode}
          playerNames={playerNames}
          onUpdatePlayerNames={setPlayerNames}
          onStartQuiz={(diff, mode, names) => {
            if (names) setPlayerNames(names);
            handleStartQuiz(diff, mode, names);
          }}
          onBack={() => setGameStatus("mode")}
        />
      )}

      {/* ================= TOP LOGO BANNER (FOR PLAYING SCREEN) ================= */}
      {gameStatus === "playing" && <TopLogoBanner />}

      {/* 4. GAMEPLAY SCREEN */}
      {gameStatus === "playing" && currentQuestion && (
        <div className="w-full max-w-5xl mx-auto px-4 py-1 sm:py-2 flex flex-col items-center flex-1 justify-between relative z-20">
          {/* Top HUD */}
          <GameHeader
            currentQuestion={currentIndex + 1}
            totalQuestions={quizQuestions.length}
            score={score}
            scoreDelta={scoreDelta}
            difficulty={currentDifficulty}
            gameMode={gameMode}
            teamScores={teamScores}
            userScore={userDuelScore}
            robotScore={robotDuelScore}
            playerNames={playerNames}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onQuitToHome={handleQuitToHome}
          />

          {/* ================= MODE 1: SELF PRACTICE VIEW ================= */}
          {gameMode === "self" && (
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-1 py-1">
              <ProgressBar
                current={currentIndex + 1}
                total={quizQuestions.length}
              />

              {/* Center Row: Timer (Left) + LogoCard (Center) + UseHint (Right) */}
              <div className="w-full flex items-center justify-center gap-3 sm:gap-6 md:gap-8 my-2 sm:my-3">
                <Timer
                  timeRemaining={timeRemaining}
                  maxTime={15}
                  isWarning={isWarning}
                />

                <LogoCard
                  question={currentQuestion}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  hintActive={usedHint}
                />

                <HintButton
                  onClick={handleUseHint}
                  used={usedHint}
                  disabled={isAnswered}
                  remainingHints={remainingHints}
                />
              </div>

              {/* Answer Grid: 4 Horizontal Columns (A, B, C, D) */}
              <div className="w-full max-w-xl mx-auto my-1.5 sm:my-2">
                <AnswerGrid
                  options={currentQuestion.options}
                  correctAnswer={currentQuestion.brand}
                  selectedAnswer={selectedAnswer}
                  isAnswered={isAnswered}
                  eliminatedOptions={eliminatedOptions}
                  onSelectOption={handleSelectAnswer}
                />
              </div>

              {/* Next Question Pill Button matching Reference Mockup */}
              <button
                onClick={handleNextQuestion}
                type="button"
                className="mt-2 sm:mt-3 px-6 sm:px-8 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-amber-50/60 active:scale-95 text-[#4A1513] border-[2.5px] border-[#4A1513] shadow-[0_3px_8px_rgba(74,21,19,0.12)] font-bold text-sm sm:text-base flex items-center gap-3 transition-all cursor-pointer select-none"
              >
                <span>{isMatchOver ? "View Results" : "Next Question"}</span>
                <span className="text-base sm:text-lg leading-none font-bold">⟶</span>
              </button>
            </div>
          )}

          {/* ================= MODE 2: TEAM VS TEAM (TWO QUESTION WINDOWS) ================= */}
          {gameMode === "team" && (
            <DualTeamArena
              question={currentQuestion}
              teamScores={teamScores}
              firstResponder={firstResponder}
              team1Selected={team1Selected}
              team2Selected={team2Selected}
              team1Name={playerNames.team1}
              team2Name={playerNames.team2}
              isAnswered={isAnswered}
              onTeamSelectAnswer={handleTeamSelectAnswer}
              timeRemaining={timeRemaining}
              maxTime={15}
              isWarning={isWarning}
            />
          )}

          {/* ================= MODE 3: VS ROBOT (USER WINDOW + ROBOT WINDOW) ================= */}
          {gameMode === "robot" && (
            <RobotDuelArena
              question={currentQuestion}
              userScore={userDuelScore}
              robotScore={robotDuelScore}
              robotCountdown={robotCountdown}
              playerName={playerNames.player}
              robotName={playerNames.robot}
              firstResponder={firstResponder}
              userSelected={userSelected}
              robotAnswer={robotAnswer}
              robotCorrect={robotCorrect}
              isAnswered={isAnswered}
              onUserSelectAnswer={handleUserSelectAnswer}
              timeRemaining={timeRemaining}
              maxTime={15}
              isWarning={isWarning}
            />
          )}

          {/* Feedback & Next Button Banner (for Team & Robot Modes) */}
          {isAnswered && gameMode !== "self" && (
            <div className="w-full max-w-xl mx-auto">
              <FeedbackMessage
                isCorrect={isCorrect}
                isTimeout={isTimeout}
                correctBrand={currentQuestion.brand}
                scoreResult={scoreResult}
                gameMode={gameMode}
                activeTeam={firstResponder === "team2" ? 2 : 1}
                playerNames={playerNames}
                firstResponder={firstResponder}
                userSelected={userSelected}
                robotAnswer={robotAnswer}
                robotCorrect={robotCorrect}
                nextDisabled={false}
                onNext={handleNextQuestion}
                isLastQuestion={isMatchOver}
              />
            </div>
          )}
        </div>
      )}

      {/* ================= BOTTOM LOGO BANNER (FOR PLAYING SCREEN) ================= */}
      {gameStatus === "playing" && (
        <div className="w-full pointer-events-none z-10 overflow-hidden leading-none shrink-0">
          <img
            src={startBottomImg}
            alt="Logo Banner Bottom"
            className="w-full h-12 sm:h-16 md:h-20 lg:h-24 object-cover object-top select-none block"
          />
        </div>
      )}

      {/* 5. RESULT SCREEN DASHBOARD */}
      {gameStatus === "result" && (
        <>
          <TopLogoBanner />
          <ResultScreen
            score={score}
            correctCount={correctCount}
            wrongCount={wrongCount}
            totalQuestions={
              gameMode === "self" ? quizQuestions.length : currentIndex + 1
            }
            hintsUsedCount={totalHintsUsed}
            bestScore={bestScore}
            isNewBest={isNewBest}
            difficulty={currentDifficulty}
            gameMode={gameMode}
            teamScores={teamScores}
            userScore={userDuelScore}
            robotScore={robotDuelScore}
            playerNames={playerNames}
            onPlayAgain={() => handleStartQuiz(currentDifficulty, gameMode)}
            onChangeMode={() => setGameStatus("mode")}
            onChangeDifficulty={() => setGameStatus("difficulty")}
            onBackToHome={handleQuitToHome}
          />
        </>
      )}
    </div>
  );
}
