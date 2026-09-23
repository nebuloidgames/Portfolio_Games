import React, { useState } from 'react';
import bgImg from '../assets/bg-img.png';
import startBtnImg from '../assets/start.png';
import logoBlackVertical from '../assets/nebuloid-logo.png';
import { DIFFICULTY_CONFIG } from '../data/colors';
import { getStoredCertificates, downloadCertificatePNG } from '../utils/gameUtils';

export default function StartScreen({
  onStartGame,
  onOpenLevels,
  bestScore = 0,
  bestStreak = 0,
  selectedDifficulty = 'EASY',
  onChangeDifficulty,
  isMuted = false,
  onToggleMute
}) {
  const [activeModal, setActiveModal] = useState(null); // 'certificates' | 'howToPlay' | 'exit' | null
  const [certTab, setCertTab] = useState('earned'); // 'earned' | 'milestones'
  const savedCertificates = getStoredCertificates();

  const handleStart = () => {
    if (onOpenLevels) {
      onOpenLevels();
    } else if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 select-none overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle Darkening Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* ================= TOP-LEFT: NEBULOID BRANDING ================= */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2.5 px-3.5 py-1.5">
        <img
          src={logoBlackVertical}
          alt="Nebuloid"
          className="h-15 w-auto object-contain pointer-events-none"
        />
      </div>

      {/* ================= TOP-RIGHT: SOUND TOGGLE ================= */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-3.5 py-2 rounded-full border border-white/60 bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
          <span className="hidden sm:inline text-[11px] font-extrabold uppercase text-slate-800">
            {isMuted ? 'Muted' : 'Sound'}
          </span>
        </button>
      )}

      {/* ================= MAIN GLASS CONTAINER ================= */}
      <div className="relative w-full max-w-4xl bg-white/20 backdrop-blur-md sm:backdrop-blur-lg rounded-3xl sm:rounded-[36px] border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-4 py-8 sm:px-10 sm:py-10 md:py-12 flex flex-col items-center justify-between min-h-[520px] sm:min-h-[580px] md:min-h-[600px] z-10 animate-fade-in my-auto">
        
        {/* Top Header inside the glass card */}
        <div className="flex flex-col items-center justify-center text-center mt-1 sm:mt-2">
          <span className="text-white text-xs sm:text-sm md:text-base font-bold tracking-[0.35em] sm:tracking-[0.45em] md:tracking-[0.55em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] pl-[0.35em]">
            W E L C O M E &nbsp; T O
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wide text-[#d4eeff] mt-1 sm:mt-2 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            COLOR CLASH
          </h1>
        </div>

        {/* Center Circular START Button using start.png */}
        <div className="my-6 sm:my-8 flex items-center justify-center">
          <button
            onClick={handleStart}
            className="group relative cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label="Start Game"
          >
            {/* Outer subtle glow on hover */}
            <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-400/30 blur-2xl transition-all duration-300 pointer-events-none" />
            <img
              src={startBtnImg}
              alt="START"
              className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_0_35px_rgba(59,130,246,0.85)] transition-all duration-300"
            />
          </button>
        </div>

        {/* Bottom 3 Pill Action Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-2 sm:mt-4">
          {/* Button 1: Certificates */}

          {/* Button 2: How To Play */}
          <button
            onClick={() => setActiveModal('howToPlay')}
            className="flex items-center gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#173a87] via-[#15347d] to-[#122e6b] hover:from-[#1e48a5] hover:to-[#17387e] border border-blue-400/40 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-950/40 hover:shadow-blue-500/25 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Question mark icon */}
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border-1.5 border-white flex items-center justify-center text-xs sm:text-sm font-black leading-none">
              ?
            </span>
            <span>How To Play</span>
          </button>

        </div>
      </div>

      {/* ================= MODAL: CERTIFICATES & TARGETS ================= */}
      {activeModal === 'certificates' && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900/95 border border-blue-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase">
                    Certificates & Targets
                  </h3>
                  <span className="text-[10px] text-cyan-300 font-bold block">
                    Official Nebuloid Player Honours
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl mb-4">
              <button
                onClick={() => setCertTab('earned')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  certTab === 'earned'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎓 My Certificates</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                  {savedCertificates.length}
                </span>
              </button>
              <button
                onClick={() => setCertTab('milestones')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  certTab === 'milestones'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎯 Milestones</span>
              </button>
            </div>

            {/* TAB 1: EARNED CERTIFICATES VAULT */}
            {certTab === 'earned' && (
              <div className="space-y-2.5 mb-5 max-h-64 overflow-y-auto pr-1">
                {savedCertificates.length === 0 ? (
                  <div className="py-8 px-4 text-center bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-3xl block mb-2">📜</span>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
                      No Certificates Earned Yet
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mb-3">
                      Win any stage in Easy, Medium, or Hard to automatically generate and unlock your official merit certificate!
                    </p>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        handleStart();
                      }}
                      className="py-2 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      PLAY NOW ▶
                    </button>
                  </div>
                ) : (
                  savedCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3 hover:border-cyan-400/40 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-black text-white truncate">
                            {cert.playerName || 'Champion'}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black uppercase shrink-0">
                            Stage 0{cert.stageNumber} ({cert.difficulty})
                          </span>
                        </div>
                        <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wide">
                          ★ {cert.honorTitle || 'COLOR CLASH CONQUEROR'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>Score: <b className="text-white">{cert.score}</b></span>
                          <span>•</span>
                          <span>Accuracy: <b className="text-emerald-400">{cert.accuracy}%</b></span>
                          <span>•</span>
                          <span>{cert.issueDate}</span>
                        </div>
                      </div>

                      {/* Download PNG Button */}
                      <button
                        onClick={() => downloadCertificatePNG(cert)}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0 flex items-center gap-1"
                        title="Download Certificate PNG"
                      >
                        <span>📥</span>
                        <span>PNG</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: MILESTONES */}
            {certTab === 'milestones' && (
              <>
                {/* Current Stats Summary */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Best Score
                    </span>
                    <span className="text-xl font-black text-amber-400">{bestScore} <span className="text-xs font-semibold text-slate-400">PTS</span></span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Best Streak
                    </span>
                    <span className="text-xl font-black text-emerald-400">🔥 {bestStreak}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-5 max-h-52 overflow-y-auto pr-1">
                  {[
                    { title: 'Bronze Speedster', target: 50, desc: 'Score 50+ points in a single race' },
                    { title: 'Silver Mastermind', target: 150, desc: 'Score 150+ points in a single race' },
                    { title: 'Gold Champion', target: 300, desc: 'Score 300+ points in a single race' },
                    { title: 'Diamond Legend', target: 500, desc: 'Score 500+ points with 95%+ accuracy' },
                  ].map((cert) => {
                    const isUnlocked = bestScore >= cert.target;
                    return (
                      <div
                        key={cert.title}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          isUnlocked
                            ? 'border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-transparent text-white'
                            : 'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs tracking-wide text-white">
                              {cert.title}
                            </span>
                            {isUnlocked && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase">
                                UNLOCKED ✓
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] mt-0.5 ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                            {cert.desc}
                          </p>
                        </div>
                        <span className={`text-xs font-black shrink-0 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                          {cert.target} PTS
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Difficulty Selector in Modal */}
            {onChangeDifficulty && (
              <div className="mb-6 pt-4 border-t border-white/10">
                <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase block mb-2.5">
                  Select Difficulty
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(DIFFICULTY_CONFIG).map((diffKey) => {
                    const config = DIFFICULTY_CONFIG[diffKey];
                    const isSelected = selectedDifficulty === diffKey;
                    return (
                      <button
                        key={diffKey}
                        onClick={() => onChangeDifficulty(diffKey)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-400 bg-blue-600/30 text-blue-200 shadow-md shadow-blue-900/50'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-black block tracking-wider">{config.label}</span>
                        <span className="text-[10px] opacity-80">{config.optionsCount} Choices</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  handleStart();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-lg shadow-blue-600/30 active:scale-98"
              >
                Select Stage & Race ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HOW TO PLAY ================= */}
      {activeModal === 'howToPlay' && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900/95 border border-blue-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📖</span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-wider uppercase">
                  How To Play
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Demo Box */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Stroop Effect Example
              </span>
              <div className="text-3xl font-black text-blue-400 my-1 drop-shadow">
                RED
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Word spells <b className="text-red-400">RED</b>, but color is <b className="text-blue-400">BLUE</b> → Click <b className="text-blue-400">BLUE</b>!
              </div>
            </div>

            <ol className="space-y-3.5 text-xs sm:text-sm text-slate-200 font-semibold mb-6">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <b>Look at the ink color</b> of the word, ignore what the text actually spells.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <b>Pick the matching color button</b> or use keyboard numbers <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded font-mono text-[11px] text-white">1</kbd> - <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded font-mono text-[11px] text-white">6</kbd>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <b>Maintain speed & accuracy</b> to unlock high scores and race certificates!
                </span>
              </li>
            </ol>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-lg shadow-blue-600/30"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXIT / QUIT TO HOME ================= */}
      {activeModal === 'exit' && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-slate-900/95 border border-blue-500/30 text-white rounded-3xl p-6 shadow-2xl text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl mx-auto mb-3">
              🏠
            </div>
            <h3 className="text-lg font-black text-white tracking-wider uppercase mb-1">
              Quit To Home
            </h3>
            <p className="text-xs text-slate-300 mb-5">
              Ready to take a break or reset session? You can close this tab or restart anytime!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 font-extrabold text-xs tracking-wider uppercase cursor-pointer transition-colors"
              >
                Stay Here
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  window.location.reload();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase cursor-pointer shadow-md shadow-blue-600/30 transition-all"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
