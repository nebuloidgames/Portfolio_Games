import React, { useState } from 'react';
import bgImg from '../assets/bg-img.png';
import logoBlackVertical from '../assets/nebuloid-logo.png';
import { STAGE_CONFIG, STAGES_PER_LEVEL } from '../data/stageConfig';

export default function LevelScreen({
  progression,
  selectedDifficulty = 'EASY',
  onSelectDifficulty,
  onSelectStage,
  onBackToMenu
}) {
  const [activeTab, setActiveTab] = useState(selectedDifficulty || 'EASY');

  const diffProgression = progression[activeTab] || {
    unlockedStage: 1,
    completedStages: {},
    highScores: {}
  };

  const stages = STAGE_CONFIG[activeTab] || STAGE_CONFIG.EASY;

  const handleTabChange = (diffKey) => {
    setActiveTab(diffKey);
    if (onSelectDifficulty) {
      onSelectDifficulty(diffKey);
    }
  };

  // Helper for star display
  const getStarRating = (stageNum) => {
    const starsEarned = diffProgression.completedStages[stageNum] || 0;
    // Map completed stage score to up to 4 stars representation
    const totalStars = 4;
    const filled = Math.min(totalStars, Math.max(0, starsEarned > 0 ? (starsEarned >= 3 ? 3 : starsEarned >= 2 ? 2 : 1) : 0));
    let starStr = '';
    for (let i = 0; i < totalStars; i++) {
      starStr += i < filled ? '★' : '☆';
    }
    return starStr;
  };

  const difficultyCards = [
    {
      id: 'EASY',
      title: 'EASY',
      description: 'Build Strong Basics And Boost Your Confidence.',
      icon: (
        // Backpack / School Bag Icon
        <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9z" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <rect x="9" y="15" width="6" height="4" rx="1" />
        </svg>
      )
    },
    {
      id: 'MEDIUM',
      title: 'MEDIUM',
      description: 'Perfect For Little Learners To Start Their Journey.',
      icon: (
        // Open Book with sparkles Icon
        <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
          <path d="M12 2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'HARD',
      title: 'HARD',
      description: 'For Players Ready For Intense And Exciting Challenges.',
      icon: (
        // Rocket Ship Icon
        <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-4.05 11a22.7 22.7 0 0 1-3.95 2z" />
          <path d="M9 12l2 2" />
        </svg>
      )
    }
  ];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 select-none overflow-x-hidden font-sans"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Darkening tint for readability */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* ================= TOP BAR: BRANDING & NAVIGATION ================= */}
      <div className="relative w-full max-w-5xl flex items-center justify-between z-20 pt-1 pb-2 sm:pb-4">
        {/* Back Button */}
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-white/60 text-slate-900 font-extrabold text-xs tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
            aria-label="Back to Menu"
          >
            <span className="text-sm font-black">←</span>
            <span>BACK</span>
          </button>
        )}

        {/* Nebuloid Logo & Branding in Top Center */}
        <div className="flex items-center gap-2.5 px-4 py-1.5">
          <img
            src={logoBlackVertical}
            alt="Nebuloid"
            className="h-15 w-auto object-contain pointer-events-none"
          />
        </div>

        {/* Empty spacer / status to keep top bar symmetrically balanced */}
        <div className="w-16 sm:w-24 text-right">
          <span className="text-[11px] font-black uppercase text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] tracking-wider">
            {activeTab}
          </span>
        </div>
      </div>

      {/* ================= MAIN GLASS CONTAINER ================= */}
      <div className="relative w-full max-w-5xl bg-white/20 backdrop-blur-md sm:backdrop-blur-lg rounded-3xl sm:rounded-[36px] border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-4 py-6 sm:px-8 sm:py-9 md:px-12 md:py-10 flex flex-col items-center justify-between z-10 animate-fade-in my-auto">
        
        {/* Header Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-center mb-6 sm:mb-8">
          CHOOSE DIFFICULTY
        </h1>

        {/* 3 Difficulty Cards (EASY, MEDIUM, HARD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mb-6 sm:mb-8">
          {difficultyCards.map((card) => {
            const isSelected = activeTab === card.id;
            return (
              <div
                key={card.id}
                onClick={() => handleTabChange(card.id)}
                className={`relative flex flex-col items-center justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#32b5f8] via-[#1a7de6] to-[#0d4eb8] ring-4 ring-white shadow-[0_0_35px_rgba(56,189,248,0.7)] scale-[1.03] z-10'
                    : 'bg-gradient-to-b from-[#259fe2]/90 via-[#166ecc]/90 to-[#0c439f]/90 hover:from-[#32b5f8] hover:via-[#1a7de6] hover:to-[#0d4eb8] opacity-90 hover:opacity-100 border border-white/40 hover:scale-[1.01] shadow-lg'
                }`}
              >
                {/* Circular Icon Badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/95 flex items-center justify-center mx-auto mb-3 bg-white/15 backdrop-blur-sm text-white shadow-inner">
                  {card.icon}
                </div>

                {/* Difficulty Title */}
                <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-white uppercase my-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-white/95 text-xs sm:text-[13px] font-medium leading-snug text-center px-1 my-2 min-h-[38px] flex items-center justify-center">
                  {card.description}
                </p>

                {/* Selected Indicator Pill */}
                <div className="mt-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                      isSelected
                        ? 'bg-white text-blue-900 shadow-sm'
                        : 'bg-black/20 text-white/80 border border-white/20'
                    }`}
                  >
                    {isSelected ? 'SELECTED ✓' : 'TAP TO SELECT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM STAGE BUTTONS (L - 1 to L - 5) ================= */}
        <div className="w-full max-w-4xl pt-2 sm:pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full">
            {stages.map((stageObj) => {
              const isUnlocked = stageObj.stage <= diffProgression.unlockedStage;
              const starsText = getStarRating(stageObj.stage);
              const isCompleted = (diffProgression.completedStages[stageObj.stage] || 0) > 0;

              return (
                <button
                  key={stageObj.id}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectStage(activeTab, stageObj.stage);
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`group relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-3 rounded-2xl sm:rounded-full border-2 border-white/95 transition-all duration-150 shadow-lg ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-[#2eaaf2] via-[#1a7de6] to-[#0f4eb8] hover:from-[#38bdf8] hover:via-[#2563eb] hover:to-[#1d4ed8] text-white hover:scale-105 active:scale-95 cursor-pointer shadow-blue-950/40 hover:shadow-cyan-400/40'
                      : 'bg-gradient-to-r from-[#1e5a8f]/70 to-[#0e3366]/70 border-white/40 text-white/50 cursor-not-allowed opacity-60'
                  }`}
                  aria-label={`Stage ${stageObj.stage}`}
                >
                  {/* Stage Label (L - 1, L - 2, etc.) */}
                  <span className="text-lg sm:text-xl font-black tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    L - {stageObj.stage}
                  </span>

                  {/* Subtext: Best Stars or Locked indicator */}
                  <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide text-white/95 mt-0.5 flex items-center gap-1">
                    {isUnlocked ? (
                      <>
                        <span>Best</span>
                        <span className={`tracking-tight ${isCompleted ? 'text-amber-300' : 'text-white/80'}`}>
                          {starsText}
                        </span>
                      </>
                    ) : (
                      <span>🔒 Locked</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle bottom footer info */}
      <div className="relative z-10 pt-2 pb-1 text-center">
        <span className="text-[11px] font-bold text-white/85 tracking-wider uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
          Select Difficulty & Stage to Start Your Race
        </span>
      </div>
    </div>
  );
}
