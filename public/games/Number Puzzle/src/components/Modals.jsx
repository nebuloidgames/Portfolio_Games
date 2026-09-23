import React from 'react';
import { soundManager } from '../utils/audio';

export const LevelsModal = ({ isOpen, onClose, onSelectLevel, currentLevel }) => {
  if (!isOpen) return null;

  const levels = [
    { id: 'beginner', name: 'BEGINNER', moves: 15, desc: 'Ideal for quick practice & warm-up', color: 'from-emerald-500 to-teal-600', badge: '15 MOVES' },
    { id: 'easy', name: 'EASY', moves: 30, desc: 'Casual puzzle with gentle complexity', color: 'from-blue-500 to-indigo-600', badge: '30 MOVES' },
    { id: 'medium', name: 'NORMAL', moves: 50, desc: 'Standard challenge for sharp minds', color: 'from-amber-500 to-orange-600', badge: '50 MOVES' },
    { id: 'hard', name: 'HARD', moves: 90, desc: 'Advanced scrambling with intricate paths', color: 'from-red-500 to-rose-600', badge: '90 MOVES' },
    { id: 'master', name: 'MASTER', moves: 140, desc: 'Maximum disorder, true test of intellect', color: 'from-purple-600 to-pink-600', badge: '140 MOVES' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-chakra text-lg font-bold tracking-wider text-gray-900">SELECT DIFFICULTY</h3>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Levels List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {levels.map((lvl) => {
            const isSelected = currentLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectLevel(lvl.id, lvl.moves);
                  onClose();
                }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-red-600 bg-red-50/40 shadow-md scale-[1.01]'
                    : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-chakra font-bold text-gray-900 tracking-wide text-base">{lvl.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 tracking-wider">
                      {lvl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-inter">{lvl.desc}</p>
                </div>
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-inter">All generated levels are 100% mathematically solvable.</p>
        </div>
      </div>
    </div>
  );
};

export const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center font-bold text-red-600 text-xs">
              i
            </div>
            <h3 className="font-chakra text-lg font-bold tracking-wider text-gray-900">HOW TO PLAY</h3>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 font-inter text-gray-700 text-sm max-h-[60vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="w-6 h-6 rounded-md bg-black text-white font-chakra font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="font-bold text-gray-900 mb-0.5">The Objective</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                The board has <strong className="text-black">9 slots</strong> containing <strong className="text-black">8 serial numbers (1 to 8)</strong> and <strong className="text-red-600">1 blank space</strong>. Arrange numbers 1 through 8 in sequential order from left to right, top to bottom.
              </p>
            </div>
          </div>

          {/* Target Board Preview */}
          <div className="flex justify-center my-2">
            <div className="bg-gray-100 p-2 rounded-xl border border-gray-200 shadow-inner inline-grid grid-cols-3 gap-1.5 w-36 h-36">
              {[1, 2, 3, 4, 5, 6, 7, 8, null].map((val, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center rounded-lg font-bold text-sm select-none ${
                    val === null
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  }`}
                >
                  {val !== null ? val : '●'}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="w-6 h-6 rounded-md bg-black text-white font-chakra font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="font-bold text-gray-900 mb-0.5">Sliding Tiles</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Click or tap any tile adjacent to the empty spot to slide it into that spot. You can also use <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[11px] font-mono">Arrow Keys</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[11px] font-mono">W A S D</kbd>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="w-6 h-6 rounded-md bg-black text-white font-chakra font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="font-bold text-gray-900 mb-0.5">Move Smarter</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Track your moves and time. Use the <strong className="text-red-600 font-semibold">HINT</strong> button if you get stuck to see the next optimal move calculated by the AI engine!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-chakra font-bold text-sm tracking-wider transition-colors"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsModal = ({ isOpen, onClose, isMuted, onToggleMute, onResetStats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-chakra text-lg font-bold tracking-wider text-gray-900">SETTINGS</h3>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4 font-inter">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <span className="font-semibold text-gray-900 block text-sm">Sound Effects</span>
              <span className="text-xs text-gray-500">Audio feedback when sliding tiles</span>
            </div>
            <button
              onClick={() => {
                onToggleMute();
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                !isMuted ? 'bg-red-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Reset Stats */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <span className="font-semibold text-gray-900 block text-sm">Reset Best Scores</span>
              <span className="text-xs text-gray-500">Clear saved moves and best times</span>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                if (window.confirm('Reset all high scores and records?')) {
                  onResetStats();
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* About Game */}
          <div className="pt-2 text-center text-xs text-gray-400">
            <p className="font-semibold text-gray-600">NUMBER PUZZLE • NEBULOID TECH</p>
            <p className="mt-0.5">Version 1.0.0</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-chakra font-bold text-sm tracking-wider transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const CertificatesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const playerName = localStorage.getItem('player_name') || 'Player 1';
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400/80 overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 px-6 py-4 text-white flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎖️</span>
            <div>
              <h3 className="font-chakra font-black tracking-wider text-base sm:text-lg uppercase text-amber-300">
                Player Certificates
              </h3>
              <p className="text-[11px] text-emerald-100 font-inter">Official Nebuloid Puzzle Achievement</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Certificate Card Body */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
          <div className="border-2 border-dashed border-amber-400/70 rounded-2xl p-6 text-center relative overflow-hidden bg-white/80 shadow-inner">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-9xl font-black font-serif">NP</span>
            </div>

            {/* Certificate Header */}
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
              Certificate of Excellence
            </div>

            <h2 className="font-serif italic font-extrabold text-2xl sm:text-3xl text-gray-900 mb-1">
              Number Puzzle Master
            </h2>
            <p className="text-xs text-gray-500 font-inter uppercase tracking-widest mb-4">
              This Certificate is proudly awarded to
            </p>

            {/* Recipient Name */}
            <div className="my-3 pb-2 border-b-2 border-amber-400/60 max-w-xs mx-auto">
              <span className="font-chakra text-2xl sm:text-3xl font-black text-emerald-800 tracking-wide">
                {playerName}
              </span>
            </div>

            <p className="text-xs text-gray-600 font-inter max-w-md mx-auto leading-relaxed mt-3">
              For demonstrating exceptional logical thinking, spatial problem-solving, and spatial pattern mastery in the Nebuloid Sliding Number Puzzle.
            </p>

            {/* Badges & Date Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-100">
              <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200">
                <span className="text-base block">⭐</span>
                <span className="text-[10px] font-chakra font-bold text-emerald-800 uppercase block">Easy Rank</span>
                <span className="text-[9px] text-emerald-600 font-semibold">Mastered</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                <span className="text-base block">🌟</span>
                <span className="text-[10px] font-chakra font-bold text-amber-800 uppercase block">Medium Rank</span>
                <span className="text-[9px] text-amber-600 font-semibold">Qualified</span>
              </div>
              <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-200">
                <span className="text-base block">🏆</span>
                <span className="text-[10px] font-chakra font-bold text-rose-800 uppercase block">Hard Rank</span>
                <span className="text-[9px] text-rose-600 font-semibold">Master</span>
              </div>
            </div>

            {/* Footer with Seal & Date */}
            <div className="flex items-center justify-between mt-6 pt-2 text-left">
              <div>
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Date Issued</span>
                <span className="text-xs font-semibold text-gray-700">{currentDate}</span>
              </div>

              <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-100 flex items-center justify-center shadow-md">
                <div className="text-center">
                  <span className="text-[8px] font-black text-amber-800 block uppercase leading-none">SEAL OF</span>
                  <span className="text-[9px] font-black text-amber-900 block leading-tight">NEBULOID</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Status</span>
                <span className="text-xs font-bold text-emerald-600">✓ Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => {
              soundManager.playClick();
              window.print();
            }}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-chakra font-bold text-xs tracking-wider transition-colors flex items-center space-x-1.5"
          >
            <span>🖨️</span>
            <span>PRINT / SAVE</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-chakra font-bold text-xs tracking-wider transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const QuitConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden text-center p-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
          🏠
        </div>
        <h3 className="font-chakra font-black text-xl text-gray-900 mb-1">
          Quit To Home?
        </h3>
        <p className="text-xs text-gray-500 font-inter mb-6">
          You are currently at the home screen. Do you want to reload or restart your session?
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 font-chakra font-bold text-xs tracking-wider hover:bg-gray-100 transition-colors"
          >
            STAY HERE
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onConfirm?.();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-full bg-emerald-700 text-white font-chakra font-bold text-xs tracking-wider hover:bg-emerald-800 transition-colors shadow-md"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

