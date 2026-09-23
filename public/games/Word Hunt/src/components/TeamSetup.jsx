import React, { useState } from 'react';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import FloatingKeyboard from './FloatingKeyboard';
import './TeamSetup.css';

const TeamSetup = ({ 
  mode = 'self', 
  difficulty = 'easy', 
  levelId = 1, 
  onBack, 
  onStartMatch 
}) => {
  // Input states
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [team1Name, setTeam1Name] = useState('Team Alpha');
  const [team2Name, setTeam2Name] = useState('Team Bravo');

  // Active input field for the Floating Keyboard ('player1' | 'team1' | 'team2' | null)
  const [activeField, setActiveField] = useState(null);

  const getTitle = () => {
    if (mode === 'self') return 'PLAYER SETUP';
    if (mode === 'team') return 'TEAM SETUP';
    return 'PLAYER VS ROBOT';
  };

  const getSubtitle = () => {
    if (mode === 'self') return 'ENTER YOUR PLAYER NAME';
    if (mode === 'team') return 'NAME YOUR TEAMS FOR BATTLE';
    return 'PREPARE TO CHALLENGE AI';
  };

  const handleStart = () => {
    const p1 = mode === 'team' ? (team1Name.trim() || 'Team 1') : (player1Name.trim() || 'Player 1');
    const p2 = mode === 'team' ? (team2Name.trim() || 'Team 2') : (mode === 'robot' ? 'RoboBot' : '');

    onStartMatch({
      mode,
      player1: p1,
      player2: p2,
    });
  };

  // Keyboard value handler
  const getActiveValue = () => {
    if (activeField === 'player1') return player1Name;
    if (activeField === 'team1') return team1Name;
    if (activeField === 'team2') return team2Name;
    return '';
  };

  const handleKeyboardChange = (val) => {
    if (activeField === 'player1') setPlayer1Name(val);
    if (activeField === 'team1') setTeam1Name(val);
    if (activeField === 'team2') setTeam2Name(val);
  };

  const getTargetLabel = () => {
    if (activeField === 'player1') return mode === 'robot' ? 'Your Name' : 'Player Name';
    if (activeField === 'team1') return 'Team 1 Name';
    if (activeField === 'team2') return 'Team 2 Name';
    return 'Name';
  };

  return (
    <div 
      className="team-setup-wrapper"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* ==========================================================================
          Top Bar: Back Button + Rounded & Transparent Nebuloid Logo
          ========================================================================== */}
      <header className="team-setup-header">
        <button 
          className="setup-back-btn" 
          onClick={onBack}
          title="Back to Mode Selection"
          aria-label="Back to Mode Selection"
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
        <div className="setup-mode-tag">
          {difficulty.toUpperCase()} • L-{levelId}
        </div>
      </header>

      {/* ==========================================================================
          Main Glassmorphic Center Card
          ========================================================================== */}
      <main className="team-setup-card">
        {/* Header */}
        <div className="setup-card-header">
          <h2 className="setup-card-subtitle">{getSubtitle()}</h2>
          <h1 className="setup-card-title">{getTitle()}</h1>
        </div>

        {/* Dynamic Inputs Area based on Mode */}
        <div className="setup-inputs-container">
          {/* 1. SELF MODE: Single Input Box */}
          {mode === 'self' && (
            <div className="single-player-card">
              <div className="input-avatar-badge">👤</div>
              <label className="field-label">PLAYER NAME</label>
              <div className="input-wrapper">
                <input 
                  type="text"
                  className="setup-text-input"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  onFocus={() => setActiveField('player1')}
                  onClick={() => setActiveField('player1')}
                  placeholder="Enter your name..."
                  maxLength={18}
                />
                <button 
                  type="button"
                  className="keyboard-trigger-btn"
                  onClick={() => setActiveField('player1')}
                  title="Open On-Screen Keyboard"
                >
                  ⌨️
                </button>
              </div>
              <p className="input-hint">Click input to open floating keyboard</p>
            </div>
          )}

          {/* 2. TEAM VS TEAM: Double Input Boxes */}
          {mode === 'team' && (
            <div className="double-team-cards-row">
              {/* Team 1 Input */}
              <div className="team-input-card team-1-card">
                <div className="team-card-badge">TEAM 1</div>
                <div className="team-avatar-icon">🏴‍☠️</div>
                <label className="field-label">TEAM 1 NAME</label>
                <div className="input-wrapper">
                  <input 
                    type="text"
                    className="setup-text-input"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    onFocus={() => setActiveField('team1')}
                    onClick={() => setActiveField('team1')}
                    placeholder="Team 1 name..."
                    maxLength={16}
                  />
                  <button 
                    type="button"
                    className="keyboard-trigger-btn"
                    onClick={() => setActiveField('team1')}
                    title="Open On-Screen Keyboard"
                  >
                    ⌨️
                  </button>
                </div>
              </div>

              {/* VS Badge */}
              <div className="vs-circle-divider">
                <span>VS</span>
              </div>

              {/* Team 2 Input */}
              <div className="team-input-card team-2-card">
                <div className="team-card-badge badge-green">TEAM 2</div>
                <div className="team-avatar-icon">⚓</div>
                <label className="field-label">TEAM 2 NAME</label>
                <div className="input-wrapper">
                  <input 
                    type="text"
                    className="setup-text-input"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    onFocus={() => setActiveField('team2')}
                    onClick={() => setActiveField('team2')}
                    placeholder="Team 2 name..."
                    maxLength={16}
                  />
                  <button 
                    type="button"
                    className="keyboard-trigger-btn"
                    onClick={() => setActiveField('team2')}
                    title="Open On-Screen Keyboard"
                  >
                    ⌨️
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. VS ROBOT: Single Input Box + Robot Display */}
          {mode === 'robot' && (
            <div className="double-team-cards-row">
              {/* Player 1 Input */}
              <div className="team-input-card player-vs-robot-card">
                <div className="team-card-badge">CHALLENGER</div>
                <div className="team-avatar-icon">👤</div>
                <label className="field-label">YOUR NAME</label>
                <div className="input-wrapper">
                  <input 
                    type="text"
                    className="setup-text-input"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    onFocus={() => setActiveField('player1')}
                    onClick={() => setActiveField('player1')}
                    placeholder="Enter your name..."
                    maxLength={16}
                  />
                  <button 
                    type="button"
                    className="keyboard-trigger-btn"
                    onClick={() => setActiveField('player1')}
                    title="Open On-Screen Keyboard"
                  >
                    ⌨️
                  </button>
                </div>
              </div>

              {/* VS Badge */}
              <div className="vs-circle-divider">
                <span>VS</span>
              </div>

              {/* Robot Card (Readonly) */}
              <div className="team-input-card robot-preview-card">
                <div className="team-card-badge badge-robot">AI BOT</div>
                <div className="team-avatar-icon">🤖</div>
                <label className="field-label">OPPONENT</label>
                <div className="robot-fixed-box">
                  <span className="robot-name-text">RoboBot AI</span>
                  <span className="robot-status-pill">FAST • SHARP</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Game Button */}
        <div className="setup-footer-action">
          <button 
            className="start-match-btn"
            onClick={handleStart}
          >
            <span>START HUNT</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </button>
        </div>
      </main>

      {/* ==========================================================================
          Compact Draggable Floating Keyboard
          ========================================================================== */}
      <FloatingKeyboard 
        isOpen={Boolean(activeField)}
        onClose={() => setActiveField(null)}
        value={getActiveValue()}
        onChange={handleKeyboardChange}
        onEnter={() => setActiveField(null)}
        targetLabel={getTargetLabel()}
      />
    </div>
  );
};

export default TeamSetup;
