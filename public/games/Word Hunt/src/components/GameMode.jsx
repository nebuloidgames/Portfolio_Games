import React from 'react';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import './GameMode.css';

const MODES = [
  {
    id: 'self',
    title: 'SELF MODE',
    badge: 'SOLO PLAY',
    description: 'Play solo, sharpen your mind, and set your personal best word record.',
    icon: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    id: 'team',
    title: 'TEAM VS TEAM',
    badge: '2 PLAYERS',
    description: 'Compete head-to-head with a friend in an intense, real-time word battle.',
    icon: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    id: 'robot',
    title: 'VS ROBOT',
    badge: 'AI CHALLENGE',
    description: 'Test your vocabulary against our fast and intelligent RoboBot opponent.',
    icon: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
        <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
        <path d="M9 19h6" />
      </svg>
    )
  }
];

const GameMode = ({ onBack, onSelectMode, difficulty = 'easy', levelId = 1 }) => {
  return (
    <div 
      className="game-mode-wrapper"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* ==========================================================================
          Top Bar: Back Button + Rounded & Transparent Nebuloid Logo
          ========================================================================== */}
      <header className="game-mode-header">
        <button 
          className="mode-back-btn" 
          onClick={onBack}
          title="Back to Levels"
          aria-label="Back to Levels"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Center Rounded & Transparent Logo Badge */}
        <div className="top-logo-badge" title="Nebuloid Tech Studio">
          <img 
            src={nebuloidLogo} 
            alt="Nebuloid Tech" 
            className="nebuloid-logo-img" 
          />
          <div className="logo-badge-shimmer" />
        </div>

        {/* Level Indicator Pill */}
        <div className="mode-level-tag">
          {difficulty.toUpperCase()} • L-{levelId}
        </div>
      </header>

      {/* ==========================================================================
          Main Glassmorphic Center Card
          ========================================================================== */}
      <main className="game-mode-card">
        {/* Header */}
        <div className="mode-card-header">
          <h2 className="mode-card-subtitle">CHOOSE YOUR CHALLENGE</h2>
          <h1 className="mode-card-title">GAME MODE</h1>
        </div>

        {/* 3 Mode Cards */}
        <div className="mode-cards-grid">
          {MODES.map((m) => (
            <div 
              key={m.id}
              className="mode-card-item"
              onClick={() => onSelectMode(m.id)}
              role="button"
              tabIndex={0}
            >
              <div className="mode-badge-tag">{m.badge}</div>

              <div className="mode-icon-circle">
                {m.icon}
              </div>

              <h3 className="mode-item-title">{m.title}</h3>
              <p className="mode-item-desc">{m.description}</p>

              <button className="mode-select-btn" tabIndex={-1}>
                SELECT
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GameMode;
