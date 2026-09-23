import React, { useState, useEffect } from 'react';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import wordData from '../data/word.js';
import './Level.css';

const DIFFICULTY_CONFIG = [
  {
    id: 'easy',
    label: 'EASY',
    description: 'Build Strong Basics And Boost Your Confidence.',
    // Backpack Icon
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" />
        <rect x="4" y="10" width="16" height="11" rx="3" />
        <path d="M9 14h6" />
        <rect x="7" y="14" width="10" height="5" rx="1.5" />
      </svg>
    )
  },
  {
    id: 'medium',
    label: 'MEDIUM',
    description: 'Perfect For Little Learners To Start Their Journey.',
    // Open Book with Sparkles Icon
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M10 6l.5 1.5L12 8l-1.5.5L10 10l-.5-1.5L8 8l1.5-.5z" fill="currentColor" />
        <path d="M15 11l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'hard',
    label: 'HARD',
    description: 'For Players Ready For Intense And Exciting Challenges.',
    // Rocket Icon
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
        <path d="M15 15v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
      </svg>
    )
  }
];

const Level = ({ onBack, onPlayLevel, onLeaderboard }) => {
  const [activeDifficulty, setActiveDifficulty] = useState('easy');
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('word_hunt_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    return {
      easy: { cleared: 0, levels: { 1: { stars: 1, bestTime: '00.00s' } } },
      medium: { cleared: 0, levels: {} },
      hard: { cleared: 0, levels: {} }
    };
  });

  useEffect(() => {
    localStorage.setItem('word_hunt_progress', JSON.stringify(progress));
  }, [progress]);

  // Extract levels for current difficulty from word.js
  const currentDiffData = wordData.find(item => item[activeDifficulty]);
  const levels = currentDiffData ? currentDiffData[activeDifficulty] : [];
  // Ensure we show at least 4 levels (matching L-1, L-2, L-3, L-4 in reference image)
  const displayLevels = levels.length > 0 ? levels.slice(0, 4) : [
    { id: 1, word: [] },
    { id: 2, word: [] },
    { id: 3, word: [] },
    { id: 4, word: [] }
  ];

  const handlePlayCard = (level) => {
    if (onPlayLevel) {
      onPlayLevel({
        difficulty: activeDifficulty,
        levelId: level.id,
        words: level.word
      });
    }
  };

  // Helper to render stars
  const renderStars = (levelId) => {
    const levelStats = progress[activeDifficulty]?.levels?.[levelId];
    const starCount = levelStats?.stars || 0;
    return (
      <span className="star-rating-text">
        {starCount >= 1 ? '★' : '☆'}
        {starCount >= 2 ? '★' : '☆'}
        {starCount >= 3 ? '★' : '☆'}
      </span>
    );
  };

  return (
    <div 
      className="level-screen-wrapper"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* ==========================================================================
          Top Bar: Back Button + Rounded & Transparent Nebuloid Logo
          ========================================================================== */}
      <header className="level-top-header">
        {/* Back Button to Start Screen */}
        <button 
          className="level-back-btn" 
          onClick={onBack}
          title="Back to Start Screen"
          aria-label="Back to Start Screen"
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

        {/* Balance spacer on top right */}
        <div style={{ width: 44 }} />
      </header>

      {/* ==========================================================================
          Main Glassmorphic Center Card
          ========================================================================== */}
      <main className="level-modal-card">
        {/* Header: "CHOOSE DIFFICULTY" in Serif Italic */}
        <div className="level-card-header">
          <h1 className="choose-difficulty-title">CHOOSE DIFFICULTY</h1>
        </div>

        {/* Center: 3 Difficulty Cards (EASY, MEDIUM, HARD) */}
        <div className="difficulty-cards-container">
          {DIFFICULTY_CONFIG.map((config) => {
            const isSelected = activeDifficulty === config.id;
            return (
              <div 
                key={config.id}
                className={`difficulty-card ${isSelected ? 'active-diff-card' : ''}`}
                onClick={() => setActiveDifficulty(config.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                {/* Circular Icon Ring */}
                <div className="diff-icon-circle">
                  {config.icon}
                </div>

                {/* Difficulty Label */}
                <h2 className="diff-title">{config.label}</h2>

                {/* Description */}
                <p className="diff-description">{config.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom: Level Selection Pills (L-1, L-2, L-3, L-4) */}
        <div className="level-pills-container">
          {displayLevels.map((lvl) => (
            <button
              key={lvl.id}
              className="level-pill-btn"
              onClick={() => handlePlayCard(lvl)}
              aria-label={`Play Level ${lvl.id}`}
            >
              <span className="level-pill-title">L - {lvl.id}</span>
              <span className="level-pill-best">
                Best {renderStars(lvl.id)}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Level;