import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import {
  ArrowLeft,
  Backpack,
  BookOpen,
  Rocket,
  Crown,
  Lock,
  Trophy,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import bgImg from '../assets/bg-img.png';
import CertificateModal from './CertificateModal';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'EASY',
    desc: 'Build Strong Basics And Boost Your Confidence.',
    IconComponent: Backpack,
    hasSparkles: false,
  },
  {
    id: 'medium',
    label: 'MEDIUM',
    desc: 'Perfect For Little Learners To Start Their Journey.',
    IconComponent: BookOpen,
    hasSparkles: true,
  },
  {
    id: 'hard',
    label: 'HARD',
    desc: 'For Players Ready For Intense And Exciting Challenges.',
    IconComponent: Rocket,
    hasSparkles: false,
  },
  {
    id: 'expert',
    label: 'EXPERT',
    desc: 'Master Mind-Bending Puzzles & Ultimate Brain Teasers.',
    IconComponent: Crown,
    hasSparkles: true,
  },
];

const Level = ({
  userName = 'Player',
  progress = {},
  selectedDifficulty = 'easy',
  onSelectDifficulty,
  onSelectLevel,
  onBackToHome,
  onResetProgress,
  isMuted = false,
  onToggleMute,
}) => {
  const [activeTab, setActiveTab] = useState(selectedDifficulty);
  const [showExpertMode, setShowExpertMode] = useState(selectedDifficulty === 'expert');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const currentDiffProgress = progress[activeTab] || {
    unlockedLevels: 1,
    completedLevels: {},
  };

  const handleTabChange = (diffId) => {
    soundFx.playClick();
    setActiveTab(diffId);
    if (onSelectDifficulty) {
      onSelectDifficulty(diffId);
    }
  };

  const handleLevelClick = (levelNum) => {
    const isUnlocked = levelNum <= currentDiffProgress.unlockedLevels;
    if (isUnlocked) {
      soundFx.playClick();
      onSelectLevel(activeTab, levelNum);
    } else {
      soundFx.playWrong();
    }
  };

  const totalScore = progress.totalScore || 0;

  // Filter difficulties based on mode
  const displayedDifficulties = showExpertMode
    ? DIFFICULTIES
    : DIFFICULTIES.filter((d) => d.id !== 'expert');

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-3 sm:px-6 py-3 sm:py-5 overflow-x-hidden select-none font-['Outfit',sans-serif]">
      {/* ================= BACKGROUND IMAGE LAYER ================= */}
      <img
        src={bgImg}
        alt="Cinema Background"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none z-0"
      />
      {/* Subtle Cinema Vignette Overlay */}
      <div className="absolute inset-0 bg-black/35 sm:bg-black/30 pointer-events-none z-0" />

      {/* ================= TOP HEADER: NEBULOID BRANDING & CONTROLS ================= */}
      <header className="w-full max-w-6xl flex justify-between items-center z-30 px-1 sm:px-3 py-1.5 sm:py-2">
        {/* Left: Back Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white hover:text-orange-400 hover:border-orange-400/60 active:scale-95 transition-all cursor-pointer shadow-lg"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Home</span>
        </button>

        {/* Center: Nebuloid Tech Studio LLP Branding Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/45 backdrop-blur-md border border-white/20 shadow-lg hover:border-orange-400/60 transition-all duration-300">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Logo"
            className="h-6 sm:h-8 w-auto brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.24em] text-white uppercase font-['Plus_Jakarta_Sans',sans-serif]">
              NEBULOID TECH STUDIO LLP
            </span>
          </div>
        </div>

        {/* Right: Player Profile, Total Score & Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* User Name Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-lg">
            <User className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-extrabold uppercase max-w-[70px] sm:max-w-none truncate">
              {userName}
            </span>
          </div>

          {/* Total Score Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-lg">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-extrabold tracking-wider">{totalScore}</span>
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              if (onToggleMute) onToggleMute();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white/90 hover:text-orange-400 hover:border-orange-400/60 active:scale-95 transition-all cursor-pointer shadow-lg"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-orange-400" />
            )}
          </button>
        </div>
      </header>

      {/* ================= MAIN FROSTED GLASS CONTAINER ================= */}
      <main className="relative w-full max-w-5xl xl:max-w-6xl rounded-3xl sm:rounded-[2.5rem] bg-black/40 backdrop-blur-md sm:backdrop-blur-lg border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.25)] px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col justify-between items-center z-20 my-auto transition-all">
        
        {/* Top: CHOOSE DIFFICULTY Title */}
        <div className="text-center w-full mb-4 sm:mb-6 select-none">
          <h1 className="font-[serif] font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-wider sm:tracking-widest uppercase text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] leading-tight">
            CHOOSE DIFFICULTY
          </h1>
        </div>

        {/* Center: Difficulty Cards (3 Cards from image, or 4 if Expert enabled) */}
        <div
          className={`w-full grid gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 items-stretch ${
            displayedDifficulties.length === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-3'
          }`}
        >
          {displayedDifficulties.map((diff) => {
            const isSelected = activeTab === diff.id;

            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => handleTabChange(diff.id)}
                onMouseEnter={() => soundFx.playHover()}
                className={`group relative w-full min-h-[260px] sm:min-h-[290px] md:min-h-[310px] rounded-3xl sm:rounded-[32px] p-5 sm:p-6 flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#e08a34] via-[#be6318] to-[#8d3e0b] border-2 border-white ring-4 ring-amber-400/90 shadow-[0_0_35px_rgba(251,191,36,0.65),0_15px_35px_rgba(0,0,0,0.6)] scale-[1.03] z-10'
                    : 'bg-gradient-to-b from-[#d97d28]/95 via-[#b65d14]/95 to-[#853808]/95 border-2 border-amber-300/40 hover:border-amber-200 hover:scale-[1.01] hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)] opacity-95'
                }`}
              >
                {/* Top Circular Icon with Thin Light Golden Border */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-200/60 bg-amber-400/20 flex items-center justify-center mb-3 sm:mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] transition-transform group-hover:scale-105">
                  {diff.hasSparkles ? (
                    <div className="relative flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-200 absolute -top-2 drop-shadow-sm" />
                      <diff.IconComponent
                        className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200 drop-shadow-sm"
                        strokeWidth={2.2}
                      />
                    </div>
                  ) : (
                    <diff.IconComponent
                      className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200 drop-shadow-sm"
                      strokeWidth={2.2}
                    />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-sans italic font-black text-2xl sm:text-3xl tracking-wider text-white uppercase drop-shadow-md mb-2">
                  {diff.label}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-amber-100/95 text-xs sm:text-sm font-medium leading-relaxed px-2 line-clamp-3">
                  {diff.desc}
                </p>

                {/* Selected Status Indicator */}
                <div
                  className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                    isSelected
                      ? 'bg-black/40 border border-amber-300/70 text-amber-300 shadow-inner'
                      : 'opacity-0'
                  }`}
                >
                  SELECTED ★
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom: 5 Level Buttons (L - 1, L - 2, L - 3, L - 4, L - 5) */}
        <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5].map((levelNum) => {
            const isUnlocked = levelNum <= currentDiffProgress.unlockedLevels;
            const completedData = currentDiffProgress.completedLevels[levelNum];
            const isCompleted = !!completedData;
            const stars = completedData?.stars || 0;

            return (
              <button
                key={levelNum}
                type="button"
                onClick={() => handleLevelClick(levelNum)}
                onMouseEnter={() => isUnlocked && soundFx.playHover()}
                disabled={!isUnlocked}
                className={`group relative rounded-2xl sm:rounded-3xl py-3 px-3 sm:py-3.5 sm:px-4 flex flex-col items-center justify-center transition-all duration-200 ${
                  !isUnlocked
                    ? 'bg-gradient-to-b from-[#944810]/45 via-[#6e3006]/45 to-[#4d1f02]/45 border-2 border-amber-300/20 opacity-60 cursor-not-allowed'
                    : 'bg-gradient-to-b from-[#e08a34] via-[#be6318] to-[#8d3e0b] border-2 border-amber-300/60 hover:border-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_28px_rgba(249,115,22,0.6)] hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                {/* Level Title: L - X */}
                <div className="font-['Playfair_Display',serif] italic font-black text-xl sm:text-2xl text-white tracking-wider drop-shadow-sm">
                  L - {levelNum}
                </div>

                {/* Stars / Best Score Info */}
                <div className="mt-1 flex items-center justify-center gap-1">
                  {!isUnlocked ? (
                    <div className="text-[11px] sm:text-xs font-bold text-amber-200/50 flex items-center gap-1 tracking-wider">
                      <span>Best</span>
                      <span className="text-amber-200/40 text-sm tracking-tighter">☆☆☆</span>
                      <Lock className="w-2.5 h-2.5 text-amber-200/50 ml-0.5" />
                    </div>
                  ) : isCompleted ? (
                    <div className="text-[11px] sm:text-xs font-bold text-amber-100 flex items-center gap-1 tracking-wider">
                      <span>Best</span>
                      <span className="text-amber-300 text-sm tracking-tighter">
                        {stars >= 1 ? '★' : '☆'}
                        {stars >= 2 ? '★' : '☆'}
                        {stars >= 3 ? '★' : '☆'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] sm:text-xs font-bold text-amber-100 flex items-center gap-1 tracking-wider">
                      <span>Play</span>
                      <span className="text-amber-300 text-xs">▶</span>
                      <span className="text-amber-200/70 text-sm tracking-tighter">☆☆☆</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls Row: Expert Mode Toggle & Reset Progress */}
        <div className="w-full max-w-4xl flex flex-wrap justify-center items-center gap-3 pt-5 mt-3 border-t border-white/10 text-xs">
          {/* Mode Switcher */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              const nextMode = !showExpertMode;
              setShowExpertMode(nextMode);
              if (!nextMode && activeTab === 'expert') {
                setActiveTab('easy');
                if (onSelectDifficulty) onSelectDifficulty('easy');
              } else if (nextMode) {
                setActiveTab('expert');
                if (onSelectDifficulty) onSelectDifficulty('expert');
              }
            }}
            className="px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-amber-300/40 text-amber-300 font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{showExpertMode ? 'Show Standard (3 Modes)' : 'Unlock Expert Mode 👑'}</span>
          </button>
        </div>
      </main>

      {/* ================= FOOTER: BRANDING & COPYRIGHT ================= */}
      <footer className="w-full text-center z-20 py-1.5">
        <p className="text-[10px] sm:text-xs tracking-wider text-white/60 font-medium flex items-center justify-center gap-2">
          <span>Nebuloid Tech Studio LLP</span>
          <span className="text-orange-400">•</span>
          <span>Guess • Solve • Achieve</span>
        </p>
      </footer>

      {/* ================= RESET CONFIRMATION MODAL ================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl text-white">
            <h4 className="text-base font-black uppercase tracking-wider text-white mb-1.5">
              Reset All Progress?
            </h4>
            <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
              This will reset all unlocked levels, stars, and your accumulated score.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowResetConfirm(false);
                  if (onResetProgress) onResetProgress();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        userName={userName}
        difficulty={activeTab}
        levelNumber={currentDiffProgress.unlockedLevels}
        score={totalScore}
        stars={3}
      />
    </div>
  );
};

export default Level;