import React, { useState } from 'react';
import bgImg from '../assets/bg-img.png';
import startBtnImg from '../assets/start.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import './StartScreen.css';

const StartScreen = ({ onStartGame, onLeaderboard, onHowToPlay, onExit }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);

  // Read saved progress from localStorage for Certificates preview
  const getProgressStats = () => {
    try {
      const saved = localStorage.getItem('word_hunt_progress');
      if (!saved) return { totalCleared: 0, totalStars: 0 };
      const data = JSON.parse(saved);
      let totalCleared = 0;
      let totalStars = 0;
      Object.keys(data).forEach((diff) => {
        if (data[diff]?.levels) {
          totalCleared += Object.keys(data[diff].levels).length;
          Object.values(data[diff].levels).forEach((lvl) => {
            totalStars += lvl.stars || 0;
          });
        }
      });
      return { totalCleared, totalStars };
    } catch {
      return { totalCleared: 0, totalStars: 0 };
    }
  };

  const { totalCleared, totalStars } = getProgressStats();

  const handleHowToPlayClick = () => {
    setShowHowToPlayModal(true);
    if (onHowToPlay) onHowToPlay();
  };

  const handleCertificatesClick = () => {
    setShowCertificatesModal(true);
    if (onLeaderboard) onLeaderboard();
  };

  const handleExitClick = () => {
    if (onExit) {
      onExit();
    }
  };

  return (
    <div 
      className="start-screen-wrapper"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* ==========================================================================
          Top Bar: Attractive Rounded & Transparent Nebuloid Logo + Sound Toggle
          ========================================================================== */}
      <header className="start-top-header">
        <div className="top-logo-badge" title="Nebuloid Tech Studio">
          <img 
            src={nebuloidLogo} 
            alt="Nebuloid Tech" 
            className="nebuloid-logo-img" 
          />
          <div className="logo-badge-shimmer" />
        </div>

        {/* Top-right audio control */}
        <button 
          className="top-sound-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          aria-label="Toggle Sound"
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </header>

      {/* ==========================================================================
          Main Glassmorphic Center Card (Pixel-perfect to reference design)
          ========================================================================== */}
      <main className="start-modal-card">
        {/* Top Section: "WELCOME TO" and "WORD PUZZLE" */}
        <div className="card-header-section">
          <h2 className="welcome-subtext">W E L C O M E &nbsp; T O</h2>
          <h1 className="word-puzzle-title">WORD PUZZLE</h1>
        </div>

        {/* Center Section: Big Glowing START Button */}
        <div className="card-start-section">
          <button 
            className="start-circle-btn" 
            onClick={onStartGame}
            aria-label="Start Game"
          >
            <div className="start-btn-glow-ring" />
            <img 
              src={startBtnImg} 
              alt="START" 
              className="start-btn-img" 
            />
          </button>
        </div>

        {/* Bottom Section: Action Pill Buttons */}
        <div className="card-bottom-actions">

          {/* 2. How To Play Button */}
          <button 
            className="pill-action-btn"
            onClick={handleHowToPlayClick}
            aria-label="How To Play"
          >
            <span className="pill-btn-icon">
              {/* Question mark icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span className="pill-btn-label">How To Play</span>
          </button>

        </div>
      </main>

      {/* ==========================================================================
          Modal: How To Play Popup
          ========================================================================== */}
      {showHowToPlayModal && (
        <div className="popup-modal-overlay" onClick={() => setShowHowToPlayModal(false)}>
          <div className="popup-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-title-wrap">
                <span className="modal-icon-badge">?</span>
                <h3 className="modal-title">How To Play Word Puzzle</h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowHowToPlayModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body-content">
              <div className="guide-step-item">
                <div className="step-num">1</div>
                <div className="step-detail">
                  <h4>Find Hidden Words</h4>
                  <p>Inspect the letter grid and search for words from your target list horizontally, vertically, or diagonally.</p>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-num">2</div>
                <div className="step-detail">
                  <h4>Select Letter Paths</h4>
                  <p>Click or drag adjacent letters on the board to form and validate complete words.</p>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-num">3</div>
                <div className="step-detail">
                  <h4>Beat The Timer &amp; Earn Stars</h4>
                  <p>Solve the puzzle quickly with high accuracy to earn up to 3 stars per level and unlock new challenges!</p>
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <button 
                className="modal-primary-btn" 
                onClick={() => {
                  setShowHowToPlayModal(false);
                  onStartGame();
                }}
              >
                PLAY NOW
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StartScreen;
