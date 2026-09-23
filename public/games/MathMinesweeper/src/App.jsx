import { useState } from 'react';
import StartScreen from './components/StartScreen';
import PlayerSetup from './components/PlayerSetup';
import Level from './components/Level';
import Game from './components/Game';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'playerSetup' | 'levels' | 'game'
  const [gameConfig, setGameConfig] = useState(null);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('math_minesweeper_player_name') || '';
  });

  const handleSavePlayerName = (name) => {
    const clean = (name || '').trim();
    setPlayerName(clean);
    if (clean) {
      localStorage.setItem('math_minesweeper_player_name', clean);
    }
  };

  const handleStartGame = (config, name) => {
    if (name !== undefined) handleSavePlayerName(name);
    setGameConfig(config);
    setCurrentScreen('game');
  };

  return (
    <div className="w-full min-h-screen">
      {currentScreen === 'start' && (
        <StartScreen 
          playerName={playerName}
          onSavePlayerName={handleSavePlayerName}
          onOpenPlayerSetup={(name) => {
            if (name !== undefined) handleSavePlayerName(name);
            setCurrentScreen('playerSetup');
          }}
          onOpenLevels={(name) => {
            if (name !== undefined) handleSavePlayerName(name);
            setCurrentScreen('playerSetup');
          }}
          onStartGame={handleStartGame} 
        />
      )}
      {currentScreen === 'playerSetup' && (
        <PlayerSetup 
          playerName={playerName}
          onSavePlayerName={handleSavePlayerName}
          onBegin={(name) => {
            if (name) handleSavePlayerName(name);
            setCurrentScreen('levels');
          }}
          onBack={() => setCurrentScreen('start')}
        />
      )}
      {currentScreen === 'levels' && (
        <Level 
          playerName={playerName}
          onBack={() => setCurrentScreen('playerSetup')}
          onSelectLevel={(level) => {
            handleStartGame(level);
          }}
        />
      )}
      {currentScreen === 'game' && (
        <Game 
          levelConfig={gameConfig}
          playerName={playerName}
          onBack={() => setCurrentScreen('levels')}
        />
      )}
    </div>
  );
}

export default App;


