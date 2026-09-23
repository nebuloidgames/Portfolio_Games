import React, { useEffect, useState } from 'react';

/**
 * Score Display pill matching reference mockup:
 * Dark maroon rounded pill with small uppercase SCORE label, bold score number, and green delta
 */
export default function ScoreDisplay({ score = 0, delta = 0 }) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    let start = displayScore;
    const end = score;
    if (start === end) return;

    const diff = end - start;
    const step = Math.ceil(diff / 12) || 1;

    const interval = setInterval(() => {
      start += step;
      if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
        setDisplayScore(end);
        clearInterval(interval);
      } else {
        setDisplayScore(start);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="flex items-center gap-2.5 px-4 py-1 rounded-full bg-[#4A1513] text-white shadow-xs">
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">
          SCORE
        </span>
        <span className="text-sm sm:text-base font-black text-white font-mono leading-none">
          {displayScore}
        </span>
      </div>
      {delta > 0 && (
        <span className="text-xs sm:text-sm font-black text-[#22C55E] animate-pop pl-0.5">
          +{delta}
        </span>
      )}
    </div>
  );
}

