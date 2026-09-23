import React, { useState, useEffect, useRef } from 'react';
import bgImg from '../assets/bg-img.png';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import FloatingKeyboard from './FloatingKeyboard';
import { playClick, playPop, playChime, toggleSound, isSoundEnabled } from '../utils/audio';

const PlayerSetup = ({ playerName = '', onSavePlayerName, onBegin, onBack }) => {
  const [name, setName] = useState(playerName || '');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setName(playerName || '');
  }, [playerName]);

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

  const handleBegin = () => {
    playChime();
    const finalName = name.trim() || 'Player 1';
    if (onSavePlayerName) onSavePlayerName(finalName);
    if (onBegin) {
      onBegin(finalName);
    }
  };

  const handleBack = () => {
    playPop();
    if (onBack) onBack();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 select-none">
      
      {/* ========================================================================= */}
      {/* 1. SCENIC BACKGROUND (bg-img.png with subtle blur & cinematic overlay)     */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-[1.02] filter blur-[3px]"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-slate-900/35 pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 2. TOP BAR: CENTERED NEBULOID LOGO & CONTROLS                             */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full flex items-center justify-center pointer-events-none">
        {/* Centered Nebuloid Logo */}
        <div className="pointer-events-auto flex items-center">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Tech"
            className="h-15 w-auto object-contain"
          />
        </div>

        {/* Top-Right: Sound & Fullscreen */}
        <div className="pointer-events-auto absolute right-0 flex items-center gap-2.5">
          <button
            onClick={handleToggleSound}
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
            aria-label="Sound Toggle"
          >
            {soundOn ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Fullscreen Toggle"
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTER REGISTRATION CARD (MATCHING REFERENCE IMAGE)                    */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-xl mx-auto flex flex-col items-center text-center my-auto px-4">

        {/* Enter Your Name */}
        <h1 className="font-ui font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] mb-3">
          Enter <span className="text-[#a3e635]">Your</span> Name
        </h1>

        {/* Subtitle: Your Name Will Appear On The Certificate. */}
        <p className="font-ui font-medium text-sm sm:text-base md:text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-8 sm:mb-10 max-w-md">
          Your Name Will Appear On The Certificate.
        </p>

        {/* Green Rounded Input Box */}
        <div 
          onClick={() => {
            setIsKeyboardOpen(true);
            inputRef.current?.focus();
          }}
          className="w-full max-w-md sm:max-w-lg bg-[#38b935] hover:bg-[#3ec33b] border-2 border-white rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.3)] flex items-center gap-3.5 transition-all cursor-pointer mb-8 focus-within:ring-4 focus-within:ring-lime-300/60"
        >
          {/* User Icon */}
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7 text-white flex-shrink-0" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsKeyboardOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleBegin();
            }}
            maxLength={22}
            placeholder="Enter Your Name"
            className="w-full bg-transparent text-white font-ui font-bold text-base sm:text-lg placeholder:text-white/80 outline-none select-text cursor-text"
          />

          {/* Keyboard Toggle Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsKeyboardOpen((prev) => !prev);
            }}
            className="text-white/85 hover:text-white text-lg transition-transform hover:scale-110 cursor-pointer p-1"
            title="Toggle On-Screen Keyboard"
          >
            ⌨️
          </button>
        </div>

        {/* Action Button: BEGIN DEFUSAL */}
        <button
          onClick={handleBegin}
          className="w-full max-w-xs sm:max-w-sm py-3 sm:py-3.5 px-8 rounded-full bg-[#3e8a15] hover:bg-[#4ea71b] border-2 border-[#82d64c]/80 text-white font-ui font-black tracking-widest text-sm sm:text-base uppercase shadow-[0_6px_20px_rgba(0,0,0,0.35)] active:scale-95 transition-all cursor-pointer mb-5"
        >
          CONTINUE
        </button>

        {/* Link: BACK TO MAIN MENU */}
        <button
          onClick={handleBack}
          className="font-ui font-black text-xs sm:text-sm tracking-wider uppercase text-slate-900 hover:text-slate-950 transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] py-1.5 px-3 rounded hover:bg-white/10"
        >
          BACK TO MAIN MENU
        </button>

      </main>

      {/* Floating Keyboard Component (Compact & Draggable) */}
      <FloatingKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        value={name}
        onChange={(val) => setName(val)}
        onEnter={handleBegin}
      />

      {/* Subtle bottom footer spacer */}
      <div className="h-4 relative z-10" />

    </div>
  );
};

export default PlayerSetup;