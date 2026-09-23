import React, { useState, useEffect } from 'react';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import { SettingsModal } from './Modals';
import { playClick, playPop, playChime, toggleSound, isSoundEnabled } from '../utils/audio';

const LEVEL_DATA = [
  {
    id: 'easy',
    title: 'EASY',
    description: 'Build Strong Basics And Boost Your Confidence.',
    gridSize: '6 × 6',
    mathRange: '1 − 10',
    mines: 6,
    iconType: 'backpack',
  },
  {
    id: 'medium',
    title: 'MEDIUM',
    description: 'Perfect For Little Learners To Start Their Journey.',
    gridSize: '8 × 8',
    mathRange: '1 − 20',
    mines: 12,
    iconType: 'book',
  },
  {
    id: 'hard',
    title: 'HARD',
    description: 'For Players Ready For Intense And Exciting Challenges.',
    gridSize: '10 × 10',
    mathRange: '1 − 50',
    mines: 20,
    iconType: 'rocket',
  },
];

const Level = ({ onBack, onSelectLevel, playerName = '' }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleToggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleLevelClick = (level) => {
    playChime();
    if (onSelectLevel) {
      onSelectLevel({
        ...level,
        title: level.title,
        subtitle: level.title,
      });
    }
  };

  const handleBack = () => {
    playPop();
    if (onBack) onBack();
  };

  // Render Icon according to design mockup
  const renderCardIcon = (iconType) => {
    if (iconType === 'backpack') {
      return (
        <svg 
          className="w-8 h-8 sm:w-9 sm:h-9 text-white" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Backpack Top Loop / Handle */}
          <path d="M9 6V4a3 3 0 0 1 6 0v2" />
          {/* Main Body */}
          <rect x="4" y="6" width="16" height="15" rx="3.5" />
          {/* Front Pocket */}
          <rect x="7" y="11" width="10" height="7" rx="2" />
          {/* Straps / Details */}
          <line x1="12" y1="11" x2="12" y2="14" />
        </svg>
      );
    }

    if (iconType === 'book') {
      return (
        <svg 
          className="w-8 h-8 sm:w-9 sm:h-9 text-white" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Sparkles on top */}
          <path d="M12 2l.7 1.4 1.4.7-1.4.7-.7 1.4-.7-1.4-1.4-.7 1.4-.7z" fill="currentColor" stroke="none" />
          <path d="M7 4l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="currentColor" stroke="none" />
          <path d="M17 4l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="currentColor" stroke="none" />
          {/* Open Book */}
          <path d="M4 19.5v-10A2.5 2.5 0 0 1 6.5 7H12v13H6.5a2.5 2.5 0 0 0-2.5 2.5z" />
          <path d="M20 19.5v-10A2.5 2.5 0 0 0 17.5 7H12v13h5.5a2.5 2.5 0 0 1 2.5 2.5z" />
        </svg>
      );
    }

    // Rocket Icon
    return (
      <svg 
        className="w-8 h-8 sm:w-9 sm:h-9 text-white transform rotate-45" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.1" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between items-center p-3 sm:p-6 md:p-8 select-none">
      
      {/* ========================================================================= */}
      {/* 1. SCENIC MINECRAFT BACKGROUND (bg-img.png)                              */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-[1.01]"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      {/* Subtle darkening overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 2. TOP BAR: LOGO & BACK BUTTON (LEFT) + AUDIO/FULLSCREEN (RIGHT)          */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full flex items-center justify-between pointer-events-none mb-2 sm:mb-4">
        
        {/* Left: Back Button */}
        <div className="pointer-events-auto flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 bg-black/30 hover:bg-black/55 active:scale-95 backdrop-blur-md border border-white/25 px-3.5 py-1.5 rounded-full text-white text-xs sm:text-sm font-ui font-bold shadow-lg transition-all cursor-pointer"
            title="Back to Previous Screen"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Center: Nebuloid Logo */}
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Tech"
            className="h-15 w-auto object-contain"
          />
        </div>

        {/* Right: Sound & Fullscreen Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={handleToggleSound}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
            aria-label="Sound Toggle"
          >
            {soundOn ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Fullscreen Toggle"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTRAL FROSTED GLASS CARD (MATCHING REFERENCE UI)                     */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-5xl lg:max-w-6xl rounded-[28px] sm:rounded-[36px] glass-card-start px-4 sm:px-8 md:px-12 py-7 sm:py-9 md:py-10 flex flex-col items-center justify-between text-center mx-auto my-auto">
        
        {/* Title: CHOOSE LEVELS in Normal Font */}
        <h1 className="font-ui font-black text-5xl sm:text-6xl text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] leading-tight select-none mb-6 sm:mb-8 md:mb-10">
          CHOOSE LEVELS
        </h1>

        {/* 4 Green Level Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-10">
          {LEVEL_DATA.map((lvl) => (
            <div
              key={lvl.id}
              onClick={() => handleLevelClick(lvl)}
              className="group relative rounded-[26px] sm:rounded-[30px] p-5 sm:p-6 flex flex-col items-center text-center justify-between min-h-[260px] sm:min-h-[300px] md:min-h-[330px] cursor-pointer transition-all duration-300 hover:-translate-y-2.5 active:scale-95 select-none"
              style={{
                background: 'linear-gradient(180deg, #6ec344 0%, #51ab27 50%, #3a8816 100%)',
                border: '2.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 14px 28px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.45), 0 0 25px rgba(110, 220, 60, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)';
              }}
            >
              {/* Top: Circular Icon Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/85 flex items-center justify-center bg-white/10 group-hover:bg-white/20 group-hover:scale-110 transition-all shadow-inner mt-2">
                {renderCardIcon(lvl.iconType)}
              </div>

              {/* Middle: Title */}
              <div className="my-3">
                <h2 className="font-ui font-black text-2xl sm:text-3xl text-white tracking-wider drop-shadow-sm uppercase">
                  {lvl.title}
                </h2>
              </div>

              {/* Bottom: Description */}
              <p className="font-ui font-medium text-xs sm:text-[13px] text-white/95 leading-relaxed drop-shadow-sm px-1 mb-2">
                {lvl.description}
              </p>

              {/* Subtle hover play indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[11px] font-bold tracking-widest uppercase bg-black/25 rounded-full px-3 py-1 mt-1 border border-white/30">
                PLAY ▶
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Footer / Spacer */}
      <footer className="relative z-20 w-full pt-3 flex items-center justify-center pointer-events-none">
        <span className="text-xs text-white/70 font-medium drop-shadow">
          Select a difficulty level to begin the challenge
        </span>
      </footer>

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <SettingsModal
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onClose={() => setActiveModal(null)}
        />
      )}

    </div>
  );
};

export default Level;