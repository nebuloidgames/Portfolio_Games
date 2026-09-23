import React, { useEffect, useState } from 'react';

export default function Streak({ streak = 0 }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (streak > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const hasStreak = streak >= 2;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all duration-200 select-none shadow-sm ${
        hasStreak
          ? 'bg-black text-white border-black'
          : 'bg-white text-neutral-400 border-black/40'
      }`}
    >
      <span
        className={`text-sm transition-transform duration-200 ${
          hasStreak ? 'scale-110 animate-bounce' : 'opacity-40 grayscale'
        }`}
      >
        🔥
      </span>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className={`text-[9px] uppercase font-black tracking-wider ${hasStreak ? 'text-amber-400' : 'text-neutral-500'}`}>
            Streak
          </span>
          {streak >= 3 && (
            <span className="text-[8px] px-1 bg-amber-400 text-black rounded font-black">
              +{streak >= 10 ? 20 : streak >= 5 ? 10 : 5}
            </span>
          )}
        </div>
        <span
          className={`text-xs sm:text-sm font-black tracking-tight ${
            hasStreak ? 'text-white' : 'text-neutral-600'
          } ${animate ? 'scale-110 text-amber-300' : 'scale-100'} transition-all`}
        >
          x{streak}
        </span>
      </div>
    </div>
  );
}

