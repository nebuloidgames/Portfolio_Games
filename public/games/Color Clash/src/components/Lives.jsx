import React from 'react';

export default function Lives({ lives = 3, maxLives = 3 }) {
  const hearts = Array.from({ length: maxLives }, (_, i) => i < lives);

  return (
    <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5 rounded-xl shadow-sm select-none">
      <div className="flex items-center gap-1">
        {hearts.map((isAlive, index) => (
          <span
            key={index}
            className={`text-base sm:text-lg transition-all duration-200 transform ${
              isAlive
                ? 'scale-100 opacity-100'
                : 'scale-75 opacity-20 grayscale'
            }`}
            role="img"
            aria-label={isAlive ? "Active life" : "Lost life"}
          >
            {isAlive ? "" : ""}
          </span>
        ))}
      </div>
      <div className="hidden sm:flex flex-col ml-1">
        <span className="text-[10px] uppercase font-black tracking-wider text-black">
          Lives
        </span>
      </div>
    </div>
  );
}

