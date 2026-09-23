import React, { useEffect, useState } from 'react';
import { DIFFICULTY_CONFIG } from '../data/colors';

export default function ScoreBoard({ score, round, difficulty }) {
  const [bump, setBump] = useState(false);
  const diffConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.EASY;

  useEffect(() => {
    if (score > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <div className="w-full flex items-center justify-between gap-2 px-2 py-1">
      {/* Score */}
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
          Score
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight text-white transition-transform duration-200 ${
              bump ? 'scale-125 text-emerald-400' : 'scale-100'
            }`}
          >
            {score}
          </span>
          <span className="text-xs text-emerald-400/80 font-bold">PTS</span>
        </div>
      </div>

      {/* Round & Difficulty */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex flex-col items-center px-3 py-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Round
          </span>
          <span className="text-sm sm:text-base font-extrabold text-cyan-300">
            #{round}
          </span>
        </div>

        <div
          className="flex flex-col items-center px-3 py-1 rounded-xl border backdrop-blur-sm"
          style={{
            borderColor: `${diffConfig.badgeColor}50`,
            backgroundColor: `${diffConfig.badgeColor}15`
          }}
        >
          <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">
            Mode
          </span>
          <span
            className="text-xs sm:text-sm font-black tracking-wider"
            style={{ color: diffConfig.badgeColor }}
          >
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
