import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import Level from './components/Level';
import EmojiDisplay from './components/EmojiDisplay';
import {
  getProgress,
  completeSubLevel,
  resetProgress as resetStorageProgress,
} from './utils/storage';
import { soundFx } from './utils/audio';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'setup' | 'levels' | 'game'
  const [userName, setUserNameState] = useState(() => {
    try {
      return localStorage.getItem('emoji_playerName') || '';
    } catch {
      return '';
    }
  });
  const [progress, setProgress] = useState(getProgress());
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedLevelNum, setSelectedLevelNum] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Handle Mute Toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
  };

  // Save User Name in React state & localStorage
  const handleSaveUserName = (name) => {
    setUserNameState(name);
    try {
      localStorage.setItem('emoji_playerName', name);
    } catch (e) {}
  };

  // Navigate to Player Setup Screen after Home Screen
  const handleStartGameFlow = () => {
    setCurrentScreen('setup');
  };

  // Continue from Player Setup to Level Selection Screen
  const handleContinueFromSetup = (name) => {
    handleSaveUserName(name);
    setCurrentScreen('levels');
  };

  // Navigate back to Home Screen from Setup
  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  // Navigate to Play a specific Level
  const handleSelectLevel = (difficulty, levelNumber) => {
    setSelectedDifficulty(difficulty);
    setSelectedLevelNum(levelNumber);
    setCurrentScreen('game');
  };

  // Handle Level Completion (clears 2 puzzles)
  const handleLevelComplete = (difficulty, levelNum, stars, scoreEarned) => {
    const updated = completeSubLevel(difficulty, levelNum, stars, scoreEarned);
    setProgress(updated);
  };

  // Move directly to next level
  const handleGoToNextLevel = (nextLevelNumber) => {
    setSelectedLevelNum(nextLevelNumber);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const reset = resetStorageProgress();
    setProgress(reset);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handleStartGameFlow}
          onExit={() => alert('👋 Thanks for playing Nebuloid Emoji Puzzle! Have a great day!')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {currentScreen === 'setup' && (
        <PlayerSetupScreen
          initialName={userName}
          onContinue={handleContinueFromSetup}
          onBack={handleBackToHome}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {currentScreen === 'levels' && (
        <Level
          userName={userName || 'Player'}
          progress={progress}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={(diff) => setSelectedDifficulty(diff)}
          onSelectLevel={handleSelectLevel}
          onBackToHome={() => setCurrentScreen('home')}
          onResetProgress={handleResetProgress}
          onOpenCertificates={() => setCurrentScreen('home')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {currentScreen === 'game' && (
        <EmojiDisplay
          key={`${selectedDifficulty}-${selectedLevelNum}`}
          difficulty={selectedDifficulty}
          levelNumber={selectedLevelNum}
          userName={userName || 'Player'}
          onBackToLevels={() => setCurrentScreen('levels')}
          onBackToHome={() => setCurrentScreen('home')}
          onLevelComplete={handleLevelComplete}
          onGoToNextLevel={handleGoToNextLevel}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  );
}

export default App;
