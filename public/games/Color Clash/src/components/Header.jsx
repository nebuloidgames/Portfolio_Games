import React from 'react';
import AudioToggle from './AudioToggle';

export default function Header({
  bestScore = 0,
  isMuted,
  onToggleMute,
  gameStatus,
  onQuitToHome
}) {
  return (
    <header className="w-full flex items-center justify-between py-4 px-4 sm:px-8 border-b border-white/10 backdrop-blur-md bg-black/30 z-20">
      <div className="flex items-center gap-3">
        <div
          onClick={onQuitToHome}
          className="cursor-pointer flex items-center gap-2.5 group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm tracking-tighter">CC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 to-blue-400 drop-shadow-sm">
            COLOR CLASH
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {bestScore > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <span>🏆</span>
            <span>BEST: {bestScore}</span>
          </div>
        )}

        <AudioToggle isMuted={isMuted} onToggle={onToggleMute} />

        {gameStatus === 'playing' && (
          <button
            onClick={onQuitToHome}
            className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            title="Quit game to menu"
          >
            Quit
          </button>
        )}
      </div>
    </header>
  );
}
