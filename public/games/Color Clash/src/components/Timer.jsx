import React from 'react';

export default function Timer({ timeLeft, maxTime = 59 }) {
  const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 15 && !isUrgent;

  let ringColor = "#000000";
  if (isUrgent) {
    ringColor = "#EF4444";
  } else if (isWarning) {
    ringColor = "#EAB308";
  }

  // Circular progress math
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5 bg-white border-2 border-black px-4 py-1.5 rounded-xl shadow-sm select-none">
      {/* Mini SVG Progress Ring */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke="#e5e5e5"
            strokeWidth="3.5"
            className="fill-transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke={ringColor}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-transparent transition-all duration-200 ease-linear"
          />
        </svg>

        <span className={`absolute text-[10px] ${isUrgent ? 'animate-bounce' : ''}`}>
          ⏱️
        </span>
      </div>

      {/* Timer Text */}
      <div className="flex flex-col text-left">
        <span className="text-[9px] uppercase font-black tracking-wider text-neutral-500">
          Time Left
        </span>
        <span
          className={`text-sm sm:text-base font-black font-mono tracking-tight ${
            isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-black'
          }`}
        >
          {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
        </span>
      </div>
    </div>
  );
}


