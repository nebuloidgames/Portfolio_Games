import React from 'react';

/**
 * Timer Component matching reference design:
 * White rounded box with thick dark maroon border and '05:00 Sec' display
 */
export default function Timer({ timeRemaining = 15, maxTime = 15, isWarning = false }) {
  const formattedSec = String(Math.max(0, timeRemaining)).padStart(2, '0');

  let textColor = 'text-[#4A1513]';
  if (timeRemaining <= 5) {
    textColor = 'text-rose-600 animate-pulse';
  } else if (timeRemaining <= 8) {
    textColor = 'text-amber-700';
  }

  return (
    <div
      className={`relative flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white border-[3px] border-[#4A1513] shadow-[0_3px_10px_rgba(74,21,19,0.12)] select-none shrink-0 ${
        isWarning ? 'animate-shake' : ''
      }`}
    >
      <span className={`text-base sm:text-lg md:text-xl font-black font-sans tracking-tight ${textColor} whitespace-nowrap`}>
        {formattedSec}:00 Sec
      </span>
    </div>
  );
}

