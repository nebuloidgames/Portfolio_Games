import React, { useState } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import Level from './components/Level';
import GameMode from './components/GameMode';
import TeamSetup from './components/TeamSetup';
import Game from './components/Game';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [gameConfig, setGameConfig] = useState({
    difficulty: 'easy',
    levelId: 1,
    words: []
  });
  const [gameMode, setGameMode] = useState('self');
  const [playerNames, setPlayerNames] = useState({
    player1: 'Player 1',
    player2: 'Team Bravo'
  });

  // 1. Start Screen handlers
  const handleStartGame = () => {
    setCurrentScreen('level');
  };

  // 2. Level Screen handlers
  const handleBackToStart = () => {
    setCurrentScreen('start');
  };

  const handlePlayLevel = ({ difficulty, levelId, words }) => {
    setGameConfig({ difficulty, levelId, words });
    setCurrentScreen('mode'); // Navigate to Game Mode Screen
  };

  // 3. Game Mode Screen handlers
  const handleBackToLevel = () => {
    setCurrentScreen('level');
  };

  const handleSelectMode = (selectedMode) => {
    setGameMode(selectedMode);
    setCurrentScreen('teamSetup'); // Navigate to Team Setup Screen
  };

  // 4. Team Setup Screen handlers
  const handleBackToMode = () => {
    setCurrentScreen('mode');
  };

  const handleStartMatch = ({ mode, player1, player2 }) => {
    setGameMode(mode);
    setPlayerNames({ player1, player2 });
    setCurrentScreen('game'); // Launch Game
  };

  // 5. Game Screen handlers
  const handleExitGame = () => {
    setCurrentScreen('mode');
  };

  const handleCompleteLevel = ({ difficulty, levelId, stars, time }) => {
    // Update saved progress in localStorage
    try {
      const saved = localStorage.getItem('word_hunt_progress');
      const progress = saved ? JSON.parse(saved) : {};
      if (!progress[difficulty]) {
        progress[difficulty] = { cleared: 0, levels: {} };
      }
      if (!progress[difficulty].levels) {
        progress[difficulty].levels = {};
      }
      const existing = progress[difficulty].levels[levelId] || {};
      progress[difficulty].levels[levelId] = {
        stars: Math.max(stars, existing.stars || 0),
        bestTime: existing.bestTime && existing.bestTime !== '--:--' ? existing.bestTime : time
      };
      progress[difficulty].cleared = Object.keys(progress[difficulty].levels).length;
      localStorage.setItem('word_hunt_progress', JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to update progress', e);
    }
  };

  return (
    <>
      {currentScreen === 'start' && (
        <StartScreen 
          onStartGame={handleStartGame}
          onLeaderboard={() => alert('Leaderboard: Feature coming soon!')}
          onHowToPlay={() => alert('How To Play: Find all the hidden words on the board by clicking adjacent letters!')}
          onExit={() => alert('Exit: Thanks for playing Word Hunt!')}
        />
      )}

      {currentScreen === 'level' && (
        <Level 
          onBack={handleBackToStart}
          onPlayLevel={handlePlayLevel}
          onLeaderboard={() => alert('Leaderboard: Feature coming soon!')}
        />
      )}

      {currentScreen === 'mode' && (
        <GameMode 
          difficulty={gameConfig.difficulty}
          levelId={gameConfig.levelId}
          onBack={handleBackToLevel}
          onSelectMode={handleSelectMode}
        />
      )}

      {currentScreen === 'teamSetup' && (
        <TeamSetup
          mode={gameMode}
          difficulty={gameConfig.difficulty}
          levelId={gameConfig.levelId}
          onBack={handleBackToMode}
          onStartMatch={handleStartMatch}
        />
      )}

      {currentScreen === 'game' && (
        <Game
          difficulty={gameConfig.difficulty}
          levelId={gameConfig.levelId}
          levelWords={gameConfig.words}
          mode={gameMode}
          player1={playerNames.player1}
          player2={playerNames.player2}
          onExit={handleExitGame}
          onCompleteLevel={handleCompleteLevel}
        />
      )}
    </>
  );
}

export default App;
