import { useState, useEffect } from "react";
import TugOfWar from "./components/TugOfWar";
import PreGameLobby from "./components/PreGameLobby";
import NebuloidTopLogo from "./components/NebuloidTopLogo";
import newTugBg from "./assets/new-Tug-img.png";
import "./components/startScreen.css";

/* Left side inward pointing chevron graphics */
export function ChevronDecorLeft() {
  return (
    <div className="arena-chevron-side arena-chevron-left" aria-hidden="true">
      
    </div>
  );
}

/* Right side inward pointing chevron graphics */
export function ChevronDecorRight() {
  return (
    <div className="arena-chevron-side arena-chevron-right" aria-hidden="true">
      
    </div>
  );
}

/* Orbiting segmented rings around the START button */
function StartOrbitRings() {
  return (
    <div className="arena-orbit-rings" aria-hidden="true">
      <svg viewBox="0 0 320 320" className="w-full h-full">
        <defs>
          <filter id="arcGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="arcGlowPurple" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base faint circular guide ring */}
        <circle
          cx="160"
          cy="160"
          r="142"
          stroke="rgba(80, 115, 215, 0.32)"
          strokeWidth="1.6"
          fill="none"
        />

        {/* Top-Left Glowing Cyan/Blue Arc */}
        <path
          d="M 31.3 100.0 A 142 142 0 0 1 288.7 100.0"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.4"
          strokeLinecap="round"
          filter="url(#arcGlowCyan)"
        />

        {/* Bottom-Right Glowing Purple/Blue Arc */}
        <path
          d="M 288.7 220.0 A 142 142 0 0 1 31.3 220.0"
          fill="none"
          stroke="#818cf8"
          strokeWidth="3.4"
          strokeLinecap="round"
          filter="url(#arcGlowPurple)"
        />

        {/* Outer offset accent arc segment on top-left */}
        <path
          d="M 10 160 A 150 150 0 0 1 96.6 24.1"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Outer offset accent arc segment on right */}
        <path
          d="M 304.9 121.2 A 150 150 0 0 1 266.1 266.1"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

export function GamepadIcon() {
  return (
    <svg
      className="arena-btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="6.5" width="19" height="11" rx="5.5" />
      <line x1="6.5" y1="12" x2="10.5" y2="12" />
      <line x1="8.5" y1="10" x2="8.5" y2="14" />
      <circle cx="15" cy="10.5" r="0.9" fill="currentColor" />
      <circle cx="17.5" cy="13" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function BackArrowIcon() {
  return (
    <svg
      className="arena-btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="10 7 5 12 10 17" />
    </svg>
  );
}

function App({ onExitGame }) {
  const [page, setPage] = useState("welcome");
  const [showGame, setShowGame] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    difficulty: "Primary",
    mode: "team",
    teamA: "Team A",
    teamB: "Team B",
    timeLimit: 120,
    timeLeft: 120,
    timesUp: false,
    sessionId: 0,
  });

  useEffect(() => {
    let timer;
    if (showGame && !gameConfig.timesUp && gameConfig.timeLeft > 0) {
      timer = setInterval(() => {
        setGameConfig((prev) => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prev, timeLeft: 0, timesUp: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showGame, gameConfig.timesUp, gameConfig.timeLeft]);

  const handleStartGame = (config) => {
    setGameConfig((prev) => ({
      ...prev,
      ...config,
      timeLeft: config.timeLimit,
      timesUp: false,
      sessionId: prev.sessionId + 1,
    }));
    setShowLobby(false);
    setShowGame(true);
  };

  const handleClose = () => {
    setShowGame(false);
    setShowLobby(false);
    setPage("welcome");
  };

  const handleGameOver = () => {
    // Game over is handled internally by TugOfWar component
  };

  const handlePlayAgain = () => {
    setGameConfig((prev) => ({
      ...prev,
      timeLeft: prev.timeLimit,
      timesUp: false,
      sessionId: prev.sessionId + 1,
    }));
  };

  const handleNewTimer = () => {
    setShowGame(false);
    setShowLobby(true);
  };

  const handleBackClick = () => {
    if (onExitGame) {
      onExitGame();
    } else if (window.history && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <div className="app-container tow-start-app">
      {/* 1. WELCOME SCREEN (GAME ARENA) */}
      {!showGame && !showLobby && page === "welcome" && (
        <main
          className="arena-welcome-screen"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 44, 0.3) 0%, rgba(6, 9, 20, 0.65) 100%), url(${newTugBg})`,
          }}
        >
          {/* Background Ambient Glow */}
          <div className="arena-bg-glow" aria-hidden="true" />

          {/* Top Nebuloid Studio Branding */}
          <NebuloidTopLogo />

          {/* Left and Right Chevron Wings */}
          <ChevronDecorLeft />
          <ChevronDecorRight />

          {/* Top Header */}
          <header className="arena-header">
            <p className="arena-subtitle">W E L C O M E &nbsp; T O</p>
            <h1 className="arena-title">
              {/* <span className="title-game">Math</span> */}
              <span className="title-arena">TUG OF WAR</span>
            </h1>
          </header>

          {/* Center Circular START Button with Tech Orbit Rings */}
          <section className="arena-center-stage">
            <div className="arena-start-container">
              <div className="arena-button-halo" />
              <StartOrbitRings />
              <button
                className="arena-start-btn"
                onClick={() => setShowLobby(true)}
                aria-label="Start Game"
              >
                <div className="arena-btn-inner-ring" />
                <span className="arena-start-text">START</span>
              </button>
            </div>
          </section>

          {/* Bottom Bar: How To Play and Back */}
          <footer className="arena-bottom-bar">
            <button
              className="arena-pill-btn arena-btn-help"
              onClick={() => setPage("how")}
              aria-label="How To Play"
            >
              <GamepadIcon />
              <span>How To Play</span>
            </button>
          </footer>
        </main>
      )}

      {/* 2. HOW TO PLAY SUBPAGE */}
      {!showGame && !showLobby && page === "how" && (
        <main
          className="tow-screen tow-subpage"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 44, 0.35) 0%, rgba(6, 9, 20, 0.75) 100%), url(${newTugBg})`,
          }}
        >
          <NebuloidTopLogo />
          <ChevronDecorLeft />
          <ChevronDecorRight />
          <div className="tow-panel wide">
            <div className="tow-eyebrow">GUIDE</div>
            <h1>HOW TO PLAY</h1>
            <div className="tow-steps">
              <div>
                <b>01</b>
                <div>
                  <strong>Pick a difficulty</strong>
                  <p>From Nursery basics to Gamer-level challenge.</p>
                </div>
              </div>
              <div>
                <b>02</b>
                <div>
                  <strong>Choose your mode</strong>
                  <p>Team vs Team on one screen, or practice against a robot.</p>
                </div>
              </div>
              <div>
                <b>03</b>
                <div>
                  <strong>Solve math questions</strong>
                  <p>Use your numpad to enter answers as fast as you can.</p>
                </div>
              </div>
              <div>
                <b>04</b>
                <div>
                  <strong>Pull the rope</strong>
                  <p>Every correct answer tugs the rope — first to the target wins.</p>
                </div>
              </div>
            </div>
            <div className="tow-actions">
              <button
                className="arena-pill-btn"
                onClick={() => setPage("welcome")}
              >
                <BackArrowIcon />
                <span>Back to Arena</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 3. LOBBY */}
      {showLobby && (
        <PreGameLobby
          onCancel={handleClose}
          onStart={handleStartGame}
          onHowToPlay={() => {
            setShowLobby(false);
            setPage("how");
          }}
        />
      )}

      {/* 4. MAIN GAME */}
      {showGame && (
        <TugOfWar
          key={gameConfig.sessionId}
          config={{
            ...gameConfig,
            onGameOver: handleGameOver,
            onPlayAgain: handlePlayAgain,
            onNewTimer: handleNewTimer,
          }}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;

