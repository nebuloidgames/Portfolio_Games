import React, { useState, useEffect } from 'react';
import bgImg from '../assets/bg-img.png';
import startBtnImg from '../assets/start.png';
import nebuloidMark from '../assets/nebuloid-logo.png';
import CertificateModal from './CertificateModal';
import { HowToPlayModal, SettingsModal, LevelsModal, LeaderboardModal } from './Modals';
import { playClick, playPop, playChime, toggleSound, isSoundEnabled } from '../utils/audio';

const StartScreen = ({ onStartGame, onOpenLevels, onOpenPlayerSetup, playerName = '', onSavePlayerName }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'certificate' | 'howToPlay' | 'levels' | 'leaderboard' | 'settings' | null
  const [nameInput, setNameInput] = useState(playerName);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setNameInput(playerName);
  }, [playerName]);

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

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

  const openModal = (modalName) => {
    playPop();
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handlePlayGame = () => {
    playChime();
    const finalName = nameInput.trim() || 'Player 1';
    if (onSavePlayerName) onSavePlayerName(finalName);

    if (onOpenPlayerSetup) {
      onOpenPlayerSetup(finalName);
    } else if (onOpenLevels) {
      onOpenLevels(finalName);
    } else if (onStartGame) {
      onStartGame(null, finalName);
    } else {
      setActiveModal('levels');
    }
  };

  const handleQuitHome = () => {
    playPop();
    triggerToast('🏠 You are already on the Home Screen!');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-3 sm:p-6 md:p-8 select-none">
      
      {/* ========================================================================= */}
      {/* 1. SCENIC MINECRAFT BACKGROUND (bg-img.png)                              */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-[1.01]"
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      {/* Ambient soft tint */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 2. TOP UTILITIES: BRAND LOGO (LEFT) & SOUND / FULLSCREEN (RIGHT)          */}
      {/* ========================================================================= */}
      
      {/* Top-Left: Nebuloid Tech Logo Badge */}
        <div className="absolute top-0 px-2 py-1.5">
          <img
            src={nebuloidMark}
            alt="Nebuloid Tech"
            className="h-16 w-auto object-contain group-hover:scale-110 transition-transform"
          />
        </div>

      <header className="absolute top-0 right-0 z-30 px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between pointer-events-none">

        {/* Top-Right: Sound & Fullscreen Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
          {/* Sound Toggle */}
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

          {/* Fullscreen Toggle */}
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
      {/* 3. CENTRAL FROSTED GLASS CARD CONTAINER (MATCHING GIVEN UI)                */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full max-w-4xl sm:max-w-5xl rounded-[28px] sm:rounded-[36px] glass-card-start px-4 sm:px-10 md:px-14 py-8 sm:py-10 md:py-12 flex flex-col items-center justify-between text-center mx-auto my-auto">
        
        {/* --- HEADER: "WELCOME TO" & "MATH MINESWEEPER" --- */}
        <div className="flex flex-col items-center w-full">
          <p className="font-ui text-white/95 text-xs sm:text-sm md:text-base font-bold tracking-[0.45em] sm:tracking-[0.55em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] mb-1 sm:mb-2">
            W E L C O M E &nbsp; T O
          </p>
          
          <h1 className="font-ui font-black text-6xl sm:text-7xl text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] leading-tight select-none">
            MATH MINESWEEPER
          </h1>
        </div>

        {/* --- CENTER: START BUTTON (Using start.png) --- */}
        <div className="my-6 sm:my-8 md:my-10 flex items-center justify-center">
          <button
            onClick={handlePlayGame}
            className="group relative cursor-pointer focus:outline-none transform transition-transform duration-200 active:scale-95"
            aria-label="Start Game"
          >
            <img
              src={startBtnImg}
              alt="START"
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-72 lg:h-72 object-contain animate-start-glow transition-all duration-300"
            />
          </button>
        </div>

        {/* --- BOTTOM: 3 GREEN CAPSULE BUTTONS --- */}
        <div className="w-full flex items-center justify-center gap-3 sm:gap-6 flex-wrap">

          {/* Button 2: How To Play */}
          <button
            onClick={() => openModal('howToPlay')}
            className="btn-pill-green flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-ui font-bold tracking-wide cursor-pointer select-none"
          >
            {/* Question Mark Icon */}
            <span className="font-game font-black text-sm sm:text-base text-white">?</span>
            <span>How To Play</span>
          </button>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. TOAST NOTIFICATION                                                     */}
      {/* ========================================================================= */}
      {showToast && (
        <div className="fixed bottom-6 z-50 bg-black/80 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/20 shadow-xl text-sm font-medium animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE MODALS                                                     */}
      {/* ========================================================================= */}
      
      {/* Certificate Modal */}
      {activeModal === 'certificate' && (
        <CertificateModal
          playerName={nameInput.trim() || 'Player 1'}
          levelTitle="Math Miner"
          levelSubtitle="Official Achievement"
          score={1250}
          timeFormatted="01:15"
          totalMines={10}
          onClose={closeModal}
        />
      )}

      {/* How To Play Modal */}
      {activeModal === 'howToPlay' && (
        <HowToPlayModal onClose={closeModal} />
      )}

      {/* Levels Modal (if opened via fallback) */}
      {activeModal === 'levels' && (
        <LevelsModal
          onClose={closeModal}
          onSelectLevel={(config) => {
            closeModal();
            if (onStartGame) onStartGame(config);
          }}
        />
      )}

      {/* Leaderboard Modal */}
      {activeModal === 'leaderboard' && (
        <LeaderboardModal onClose={closeModal} />
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <SettingsModal
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onClose={closeModal}
        />
      )}

    </div>
  );
};

export default StartScreen;