import { useState } from "react";
import MemoryMatchGame from "./components/MemoryMatchGame";
import PreGameLobby from "./components/PreGameLobby";
import bgImg from "./assets/bg-img.png";
import startImg from "./assets/start.png";
import nebuloidLogo from "./assets/nebuloid-logo.png";
import "./StartScreen.css";

function App({ onExitGame }) {
  const [appState, setAppState] = useState("home"); // "home", "how", "lobby", "game"
  const [gameConfig, setGameConfig] = useState(null);

  const handleStartLobby = () => {
    setAppState("lobby");
  };

  const handleStartGame = (config) => {
    setGameConfig(config);
    setAppState("game");
  };

  const handleGoHome = () => {
    setAppState("home");
    setGameConfig(null);
  };

  const handleQuitToHome = () => {
    if (onExitGame) {
      onExitGame();
    } else {
      // Default fallback if running standalone
      handleGoHome();
    }
  };

  return (
    <div className="app-container mm-start-app w-full h-full font-sans flex-1 flex flex-col">
      {appState === "home" && (
        <main
          className="mm-screen mm-welcome-screen"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          {/* Top Header */}
          <header className="mm-welcome-header">
            {/* Nebuloid Tech Studio Branding */}
            <div className="mm-branding" title="Nebuloid Tech Studio">
              <img
                src={nebuloidLogo}
                alt="Nebuloid Tech Studio"
                className="mm-branding-logo"
              />
            </div>
            <span className="mm-welcome-subtitle">W E L C O M E &nbsp; T O</span>
            <h1 className="mm-main-title">MATH MEMORY MATCH</h1>
          </header>

          {/* Center Start Action */}
          <div className="mm-center-action">
            <button
              className="mm-start-btn"
              onClick={handleStartLobby}
              aria-label="Start Game"
            >
              <img src={startImg} alt="Start Game" className="mm-start-img" />
            </button>
          </div>

          {/* Bottom Bar */}
          <footer className="mm-bottom-bar">
            <button
              className="mm-pill-btn"
              onClick={() => setAppState("how")}
            >
              <span className="mm-pill-qm">?</span>
              <span>How To Play</span>
            </button>
          </footer>
        </main>
      )}

      {appState === "how" && (
        <main
          className="mm-screen mm-subpage"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="mm-panel wide">
            <div className="mm-eyebrow">GUIDE</div>
            <h1>HOW TO PLAY</h1>
            <div className="mm-steps">
              <div>
                <b>01</b>
                <div>
                  <strong>Pick a difficulty</strong>
                  <span>From Nursery basics to Gamer-level challenge.</span>
                </div>
              </div>
              <div>
                <b>02</b>
                <div>
                  <strong>Choose your mode</strong>
                  <span>Team vs Team on one screen, or practice against a robot.</span>
                </div>
              </div>
              <div>
                <b>03</b>
                <div>
                  <strong>Flip and match</strong>
                  <span>Turn two cards at a time and find matching pairs.</span>
                </div>
              </div>
              <div>
                <b>04</b>
                <div>
                  <strong>Race the clock</strong>
                  <span>Every match scores a point — first to the target wins.</span>
                </div>
              </div>
            </div>
            <div className="mm-actions">
              <button
                className="mm-pill-btn"
                onClick={() => setAppState("home")}
              >
                ← Back to Main Menu
              </button>
            </div>
          </div>
        </main>
      )}

      {appState === "lobby" && (
        <PreGameLobby onCancel={handleGoHome} onStart={handleStartGame} />
      )}

      {appState === "game" && (
        <MemoryMatchGame config={gameConfig} onGoHome={handleGoHome} />
      )}
    </div>
  );
}

export default App;
