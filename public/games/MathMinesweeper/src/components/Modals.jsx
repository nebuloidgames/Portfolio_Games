import React, { useState } from 'react';
import { playClick, playPop } from '../utils/audio';

// Base Modal wrapper with smooth overlay backdrop and pop-in animation
const ModalWrapper = ({ title, icon, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-4 border-slate-800 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            <h2 className="font-game text-2xl font-black tracking-wide text-slate-800 uppercase">
              {title}
            </h2>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 font-bold flex items-center justify-center transition-colors border border-slate-200"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export const LevelsModal = ({ onClose, onSelectLevel }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [operations, setOperations] = useState(['+', '−', '×']);

  const difficulties = [
    { name: 'Easy', grid: '8 × 8', mines: 10, color: 'text-emerald-600', bg: 'hover:border-emerald-500' },
    { name: 'Medium', grid: '12 × 12', mines: 25, color: 'text-blue-600', bg: 'hover:border-blue-500' },
    { name: 'Hard', grid: '16 × 16', mines: 40, color: 'text-orange-600', bg: 'hover:border-orange-500' },
    { name: 'Master', grid: '20 × 20', mines: 75, color: 'text-rose-600', bg: 'hover:border-rose-500' },
  ];

  const toggleOp = (op) => {
    playClick();
    if (operations.includes(op)) {
      if (operations.length > 1) setOperations(operations.filter((o) => o !== op));
    } else {
      setOperations([...operations, op]);
    }
  };

  return (
    <ModalWrapper title="Select Level & Math Mode" icon="📊" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block font-ui">
            Grid Difficulty
          </label>
          <div className="grid grid-cols-2 gap-3">
            {difficulties.map((diff) => {
              const isSelected = selectedDifficulty === diff.name;
              return (
                <button
                  key={diff.name}
                  onClick={() => {
                    playPop();
                    setSelectedDifficulty(diff.name);
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-amber-50/50 shadow-[0_4px_0_#0f172a]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-game text-lg font-bold ${diff.color}`}>{diff.name}</span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {diff.mines} 💣
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-1">Grid: {diff.grid}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block font-ui">
            Math Operations Included
          </label>
          <div className="flex gap-2">
            {['+', '−', '×', '÷'].map((op) => {
              const active = operations.includes(op);
              return (
                <button
                  key={op}
                  onClick={() => toggleOp(op)}
                  className={`flex-1 py-2.5 rounded-xl font-game text-xl font-bold border-2 transition-all ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-[0_3px_0_#475569]'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {op}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            playClick();
            if (onSelectLevel) onSelectLevel({ difficulty: selectedDifficulty, operations });
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl btn-3d-red text-white font-game text-xl font-bold tracking-wider uppercase mt-4 flex items-center justify-center gap-2"
        >
          <span>Start Challenge</span>
          <span>→</span>
        </button>
      </div>
    </ModalWrapper>
  );
};

export const LeaderboardModal = ({ onClose }) => {
  const topScores = [
    { rank: 1, name: 'Arya Stark', score: 9850, time: '1m 14s', difficulty: 'Hard', avatar: '🦁' },
    { rank: 2, name: 'CyberEinstein', score: 9420, time: '1m 28s', difficulty: 'Master', avatar: '⚡' },
    { rank: 3, name: 'MathNinja_07', score: 8900, time: '1m 45s', difficulty: 'Hard', avatar: '🥷' },
    { rank: 4, name: 'QuantumBoy', score: 8150, time: '2m 02s', difficulty: 'Medium', avatar: '🚀' },
    { rank: 5, name: 'PixelHero', score: 7600, time: '2m 19s', difficulty: 'Medium', avatar: '👾' },
  ];

  return (
    <ModalWrapper title="Global Leaderboard" icon="🏆" onClose={onClose}>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
          <span>Rank & Player</span>
          <span>Score / Time</span>
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {topScores.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                player.rank === 1
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : player.rank === 2
                  ? 'bg-slate-50 border-slate-300'
                  : player.rank === 3
                  ? 'bg-orange-50/50 border-orange-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-game font-bold text-sm ${
                    player.rank === 1
                      ? 'bg-amber-400 text-slate-900'
                      : player.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : player.rank === 3
                      ? 'bg-orange-300 text-slate-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {player.rank}
                </span>
                <span className="text-lg">{player.avatar}</span>
                <div>
                  <div className="font-game font-bold text-slate-800 text-sm tracking-wide">
                    {player.name}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Mode: {player.difficulty}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-game font-black text-slate-800 text-sm">
                  {player.score.toLocaleString()} pts
                </div>
                <div className="text-[11px] text-slate-400 font-mono">{player.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

export const HowToPlayModal = ({ onClose }) => {
  return (
    <ModalWrapper title="How to Play" icon="📖" onClose={onClose}>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-200">
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-game font-bold flex items-center justify-center shrink-0 shadow-sm">
            1
          </div>
          <div>
            <h4 className="font-game font-bold text-blue-900 text-base">Solve the Equations</h4>
            <p className="text-xs text-blue-700 leading-relaxed mt-0.5">
              Each unopened tile contains a quick arithmetic equation (e.g. <span className="font-bold">3 + 2</span> or <span className="font-bold">8 ÷ 4</span>). Solve it to deduce the clue!
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-game font-bold flex items-center justify-center shrink-0 shadow-sm">
            2
          </div>
          <div>
            <h4 className="font-game font-bold text-emerald-900 text-base">Numbers Reveal Clues</h4>
            <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">
              Revealed numbers show exactly how many deadly naval mines are hiding in the adjacent 8 surrounding tiles.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-rose-50/60 rounded-2xl border border-rose-200">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-game font-bold flex items-center justify-center shrink-0 shadow-sm">
            3
          </div>
          <div>
            <h4 className="font-game font-bold text-rose-900 text-base">Flag Mines & Stay Safe</h4>
            <p className="text-xs text-rose-700 leading-relaxed mt-0.5">
              Right-click (or hold on touchscreens) to place a 🚩 flag on suspected mines. Clear all non-mine safe tiles to achieve victory!
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const SettingsModal = ({ soundOn, onToggleSound, onClose }) => {
  return (
    <ModalWrapper title="Settings" icon="⚙️" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <div className="font-game font-bold text-slate-800 text-base">Sound Effects (SFX)</div>
            <div className="text-xs text-slate-400">Tactile clicks, pops, and chimes</div>
          </div>
          <button
            onClick={onToggleSound}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              soundOn ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                soundOn ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <div className="font-game font-bold text-slate-800 text-base">Haptic Feedback</div>
            <div className="text-xs text-slate-400">Vibrate on mine explosions & flags</div>
          </div>
          <div className="w-14 h-8 rounded-full bg-emerald-500 p-1">
            <div className="w-6 h-6 rounded-full bg-white shadow-md translate-x-6" />
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-slate-400">
          Math Minesweeper by{' '}
          <span className="font-bold text-slate-600">Nebuloid Tech Studio LLP</span>
        </div>
      </div>
    </ModalWrapper>
  );
};
