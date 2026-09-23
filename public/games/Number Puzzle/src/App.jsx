import React, { useState, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import PlayerSetup from "./components/PlayerSetup";
import Level from "./components/Level";
import { GameBoard } from "./components/GameBoard";
import { soundManager } from "./utils/audio";
import nebuloidLogo from "./assets/nebuloid-vertical.png";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home"); // 'home' | 'player-setup' | 'level' | 'game'
  const [level, setLevel] = useState("medium");
  const [levelMoves, setLevelMoves] = useState(50);
  const [startNum, setStartNum] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("player_name") || "Player 1";
  });

  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  };

  // Player clicks Play Now on Home -> goes to Player Setup
  const handlePlayNow = () => {
    setCurrentScreen("player-setup");
  };

  // Player enters name and continues -> goes to Level selection
  const handlePlayerSetupContinue = (name) => {
    setPlayerName(name);
    setCurrentScreen("level");
  };

  // Player selects level (Easy, Medium, Hard) -> starts game with custom number range
  const handleLevelSelect = (lvlId, moves, startNumber = 1) => {
    setLevel(lvlId);
    setLevelMoves(moves);
    setStartNum(startNumber);
    setCurrentScreen("game");
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-gray-900 selection:bg-red-500 selection:text-white font-sans">

      {currentScreen === "home" && (
        <HomeScreen
          onPlayNow={handlePlayNow}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {currentScreen === "player-setup" && (
        <PlayerSetup
          onBack={() => setCurrentScreen("home")}
          onContinue={handlePlayerSetupContinue}
          initialName={playerName}
        />
      )}

      {currentScreen === "level" && (
        <Level
          onBack={() => setCurrentScreen("player-setup")}
          onSelectLevel={handleLevelSelect}
        />
      )}

      {currentScreen === "game" && (
        <GameBoard
          onBackToMenu={() => setCurrentScreen("home")}
          level={level}
          levelMoves={levelMoves}
          startNum={startNum}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          playerName={playerName}
        />
      )}
    </div>
  );
}

export default App;
