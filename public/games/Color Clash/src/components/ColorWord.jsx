import React, { useEffect, useState } from 'react';

export default function ColorWord({ question }) {
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (question) {
      setAnimateKey((prev) => prev + 1);
    }
  }, [question?.timestamp, question?.word, question?.displayColor]);

  if (!question) return null;

  const { word, displayColor } = question;

  return (
    <div className="w-full flex flex-col items-center justify-center relative z-10">
      {/* Warning / Instruction Banner */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase mb-2 sm:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none">
        <span className="text-[#22c55e]">MATCH:</span>
        <span className="text-[#38bdf8]">INK COLOR</span>
        <span className="text-white/80">|</span>
        <span className="text-[#ef4444]">IGNORE WORD</span>
      </div>

      {/* Main Stroop Display Card - White Box with Thick Dark Border */}
      <div
        key={animateKey}
        className="w-full max-w-xl py-8 sm:py-12 px-6 rounded-3xl sm:rounded-[36px] bg-white border-4 border-black/85 shadow-[0_16px_35px_rgba(0,0,0,0.45),inset_0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-150 pop-in"
      >
        {/* Subtle ambient tint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundColor: displayColor.value }}
        />

        {/* Hero Stroop Word */}
        <span
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider uppercase select-none transition-all duration-150 z-10"
          style={{
            color: displayColor.value,
            textShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {word}
        </span>
      </div>
    </div>
  );
}
