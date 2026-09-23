import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import StartScreen from './screens/StartScreen';
import PlayerSetupScreen from './screens/PlayerSetupScreen';
import LevelScreen from './screens/LevelScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import { generateQuestion } from './utils/generateQuestion';
import {
  getStreakBonus,
  getStoredBestScore,
  saveStoredBestScore,
  getStoredBestStreak,
  saveStoredBestStreak
} from './utils/gameUtils';
import {
  STAGE_CONFIG,
  STAGES_PER_LEVEL,
  getStoredProgression,
  recordStageCompletion
} from './data/stageConfig';
import { sounds } from './utils/soundEffects';
import './App.css';

export default function App() {
  // Navigation & Game State
  const [gameStatus, setGameStatus] = useState('start'); // 'start' | 'setup' | 'levels' | 'playing' | 'gameover'
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem('colorClash_playerName') || '';
    } catch (e) {
      return '';
    }
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY');
  const [selectedStage, setSelectedStage] = useState(1);
  const [progression, setProgression] = useState(getStoredProgression());

  // In-game dynamic state
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(59);
  const [question, setQuestion] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isNewBestScore, setIsNewBestScore] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // References for reliable interval & handler access
  const gameStatusRef = useRef(gameStatus);
  gameStatusRef.current = gameStatus;

  const questionRef = useRef(question);
  questionRef.current = question;

  const isLockedRef = useRef(isLocked);
  isLockedRef.current = isLocked;

  const scoreRef = useRef(score);
  scoreRef.current = score;

  const streakRef = useRef(streak);
  streakRef.current = streak;

  const bestStreakRef = useRef(bestStreak);
  bestStreakRef.current = bestStreak;

  const correctAnswersRef = useRef(correctAnswers);
  correctAnswersRef.current = correctAnswers;

  const wrongAnswersRef = useRef(wrongAnswers);
  wrongAnswersRef.current = wrongAnswers;

  const selectedDifficultyRef = useRef(selectedDifficulty);
  selectedDifficultyRef.current = selectedDifficulty;

  const selectedStageRef = useRef(selectedStage);
  selectedStageRef.current = selectedStage;

  const feedbackTimeoutRef = useRef(null);

  // Load high scores and stage progression on mount
  useEffect(() => {
    setBestScore(getStoredBestScore());
    setBestStreak(getStoredBestStreak());
    setProgression(getStoredProgression());
  }, []);

  // Get current active stage configuration
  const currentStageConfig =
    STAGE_CONFIG[selectedDifficulty]?.[selectedStage - 1] ||
    STAGE_CONFIG.EASY[0];

  // End stage / trigger Game Over or Victory
  const triggerEndStage = useCallback((won = false) => {
    setGameStatus('gameover');
    setIsLocked(false);
    setFeedback(null);
    setIsVictory(won);

    const finalScore = scoreRef.current;
    const finalBestStreak = bestStreakRef.current;
    const diff = selectedDifficultyRef.current;
    const stageNum = selectedStageRef.current;

    // Check & save high score
    const isNewRecord = saveStoredBestScore(finalScore);
    saveStoredBestStreak(finalBestStreak);

    if (isNewRecord && finalScore > 0) {
      setIsNewBestScore(true);
      setBestScore(finalScore);
    } else {
      setIsNewBestScore(false);
    }

    if (won) {
      // Calculate stars (1-3 based on mistakes)
      const mistakes = wrongAnswersRef.current;
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      const updatedProg = recordStageCompletion(diff, stageNum, finalScore, stars);
      setProgression(updatedProg);
      sounds.playCorrect();
    } else {
      sounds.playGameOver();
    }
  }, []);

  // Start a specific Level & Stage
  const startStage = useCallback((difficulty, stageNum) => {
    sounds.init();
    sounds.playStart();

    const diff = difficulty || selectedDifficultyRef.current;
    const sNum = stageNum || 1;
    const stageConf = STAGE_CONFIG[diff]?.[sNum - 1] || STAGE_CONFIG.EASY[0];
    const initialQuestion = generateQuestion(diff, null);

    setSelectedDifficulty(diff);
    setSelectedStage(sNum);
    setScore(0);
    setRound(1);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(stageConf.timeLimit || 59);
    setQuestion(initialQuestion);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setIsVictory(false);
    setIsNewBestScore(false);
    setFeedback(null);
    setIsLocked(false);
    setGameStatus('playing');
  }, []);

  // Navigation handlers
  const goToSetup = useCallback(() => {
    sounds.playClick();
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setGameStatus('setup');
    setFeedback(null);
    setIsLocked(false);
  }, []);

  const goToLevels = useCallback(() => {
    sounds.playClick();
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setGameStatus('levels');
    setFeedback(null);
    setIsLocked(false);
  }, []);

  const goToStart = useCallback(() => {
    sounds.playClick();
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setGameStatus('start');
    setFeedback(null);
    setIsLocked(false);
  }, []);

  // Toggle Sound FX
  const handleToggleMute = useCallback(() => {
    const nextMute = sounds.toggleMute();
    setIsMuted(nextMute);
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          triggerEndStage(false);
          return 0;
        }

        const nextTime = prevTime - 1;
        if (nextTime <= 5 && nextTime > 0) {
          sounds.playTick();
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameStatus, triggerEndStage]);

  // Answer validation logic
  const handleAnswer = useCallback(
    (selectedColorName) => {
      if (isLockedRef.current || gameStatusRef.current !== 'playing') return;

      const currentQ = questionRef.current;
      if (!currentQ) return;

      setIsLocked(true);
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }

      const isCorrect = selectedColorName === currentQ.correctAnswer;
      const stageConf =
        STAGE_CONFIG[selectedDifficultyRef.current]?.[selectedStageRef.current - 1] ||
        STAGE_CONFIG.EASY[0];

      if (isCorrect) {
        const nextStreak = streakRef.current + 1;
        const bonus = getStreakBonus(nextStreak);
        const baseScore = Math.round((10 + bonus) * (stageConf.scoreMultiplier || 1.0));
        const nextCorrect = correctAnswersRef.current + 1;

        setStreak(nextStreak);
        setBestStreak((prevBest) => Math.max(prevBest, nextStreak));
        setScore((prev) => prev + baseScore);
        setCorrectAnswers(nextCorrect);

        if (bonus > 0) {
          sounds.playStreakBonus();
          setFeedback({
            type: 'correct',
            message: '✓ CORRECT!',
            subtext: `+${baseScore} PTS (+${bonus} STREAK BONUS 🔥)`
          });
        } else {
          sounds.playCorrect();
          setFeedback({
            type: 'correct',
            message: '✓ CORRECT!',
            subtext: `+${baseScore} PTS`
          });
        }

        // Check if Stage target is accomplished!
        if (nextCorrect >= stageConf.targetQuestions) {
          feedbackTimeoutRef.current = setTimeout(() => {
            triggerEndStage(true);
          }, 350);
          return;
        }

        // Advance question
        feedbackTimeoutRef.current = setTimeout(() => {
          setRound((prev) => prev + 1);
          setQuestion((prevQ) => generateQuestion(selectedDifficultyRef.current, prevQ));
          setFeedback(null);
          setIsLocked(false);
        }, 420);
      } else {
        const nextWrong = wrongAnswersRef.current + 1;
        setStreak(0);
        setScore((prev) => Math.max(0, prev - 5));
        setWrongAnswers(nextWrong);

        sounds.playWrong();
        setFeedback({
          type: 'wrong',
          message: '✕ WRONG!',
          subtext: '-5 PTS'
        });

        feedbackTimeoutRef.current = setTimeout(() => {
          setRound((prev) => prev + 1);
          setQuestion((prevQ) => generateQuestion(selectedDifficultyRef.current, prevQ));
          setFeedback(null);
          setIsLocked(false);
        }, 450);
      }
    },
    [triggerEndStage]
  );

  // Keyboard accessibility listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space / Enter shortcuts
      if (e.code === 'Space' || e.key === 'Enter') {
        if (gameStatusRef.current === 'start') {
          e.preventDefault();
          goToSetup();
          return;
        }
        if (gameStatusRef.current === 'gameover') {
          e.preventDefault();
          startStage(selectedDifficultyRef.current, selectedStageRef.current);
          return;
        }
      }

      // Escape shortcut
      if (e.key === 'Escape') {
        if (gameStatusRef.current === 'playing' || gameStatusRef.current === 'gameover') {
          e.preventDefault();
          goToLevels();
          return;
        }
        if (gameStatusRef.current === 'levels') {
          e.preventDefault();
          goToSetup();
          return;
        }
        if (gameStatusRef.current === 'setup') {
          e.preventDefault();
          goToStart();
          return;
        }
      }

      // Number keys 1-6 for answering
      if (gameStatusRef.current === 'playing' && questionRef.current) {
        const keyNum = parseInt(e.key, 10);
        const options = questionRef.current.options || [];
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= options.length) {
          e.preventDefault();
          const targetOption = options[keyNum - 1];
          if (targetOption) {
            handleAnswer(targetOption.name);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToSetup, goToLevels, goToStart, startStage, handleAnswer]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8] text-black relative overflow-hidden transition-colors duration-200">
      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col items-center justify-center w-full p-0">
        {gameStatus === 'start' && (
          <StartScreen
            onStartGame={goToSetup}
            onOpenLevels={goToSetup}
            bestScore={bestScore}
            bestStreak={bestStreak}
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {gameStatus === 'setup' && (
          <PlayerSetupScreen
            initialName={playerName}
            onContinue={(name) => {
              setPlayerName(name);
              try {
                localStorage.setItem('colorClash_playerName', name);
              } catch (e) {}
              goToLevels();
            }}
            onBack={goToStart}
          />
        )}

        {gameStatus === 'levels' && (
          <LevelScreen
            progression={progression}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            onSelectStage={(diff, stageNum) => startStage(diff, stageNum)}
            onBackToMenu={goToSetup}
          />
        )}

        {gameStatus === 'playing' && (
          <GameScreen
            score={score}
            round={round}
            difficulty={selectedDifficulty}
            stageNumber={selectedStage}
            targetQuestions={currentStageConfig.targetQuestions}
            correctAnswers={correctAnswers}
            timeLeft={timeLeft}
            maxTime={currentStageConfig.timeLimit || 59}
            streak={streak}
            question={question}
            onSelectAnswer={handleAnswer}
            feedback={feedback}
            isLocked={isLocked}
            onQuitToLevels={goToLevels}
          />
        )}

        {gameStatus === 'gameover' && (
          <GameOverScreen
            playerName={playerName}
            isVictory={isVictory}
            stageNumber={selectedStage}
            difficulty={selectedDifficulty}
            targetQuestions={currentStageConfig.targetQuestions}
            score={score}
            correctAnswers={correctAnswers}
            wrongAnswers={wrongAnswers}
            bestStreak={bestStreak}
            isNewBestScore={isNewBestScore}
            bestScore={bestScore}
            nextStageAvailable={selectedStage < STAGES_PER_LEVEL}
            onPlayNextStage={() => startStage(selectedDifficulty, selectedStage + 1)}
            onPlayAgain={() => startStage(selectedDifficulty, selectedStage)}
            onBackToLevels={goToLevels}
            onBackToHome={goToStart}
          />
        )}
      </main>
    </div>
  );
}
