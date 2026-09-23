import React from 'react';

export default function AnswerOptions({
  options = [],
  onSelectOption,
  disabled = false
}) {
  return (
    <div className="w-full max-w-xl mx-auto z-10">
      {/* Answer Buttons Grid */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          options.length <= 4
            ? 'grid-cols-2'
            : options.length === 5
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        {options.map((option, index) => {
          const hotkeyNumber = index + 1;
          const colorObj = option;

          return (
            <button
              key={`${colorObj.name}-${index}`}
              onClick={() => onSelectOption(colorObj.name)}
              disabled={disabled}
              className={`group relative overflow-hidden flex items-center justify-center py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl sm:rounded-3xl border-2 border-white/95 bg-gradient-to-r from-[#173a87] via-[#15347d] to-[#122e6b] hover:from-[#1e48a5] hover:via-[#194098] hover:to-[#17387e] text-white transition-all duration-150 transform select-none shadow-lg shadow-blue-950/45 ${
                disabled
                  ? 'opacity-60 cursor-not-allowed scale-[0.99]'
                  : 'hover:scale-105 active:scale-95 hover:shadow-cyan-400/30 cursor-pointer'
              } ${
                options.length === 5 && index === 4
                  ? 'col-span-2 sm:col-span-1'
                  : ''
              }`}
              aria-label={`Select color ${colorObj.name} (Key ${hotkeyNumber})`}
            >
              {/* Color Name */}
              <span className="text-base sm:text-xl md:text-2xl font-black tracking-widest uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                {colorObj.name}
              </span>

              {/* Hotkey Indicator */}
              <span className="absolute top-2 right-2 sm:top-2.5 sm:right-3 px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-white/15 text-white/80 border border-white/20 group-hover:bg-white group-hover:text-blue-950 transition-colors">
                {hotkeyNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
