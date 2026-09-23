import React from 'react';
import { Lightbulb } from 'lucide-react';

/**
 * Hint Button matching reference design:
 * White rounded box with thick dark maroon border, Lightbulb icon, "Use Hint" text, and hints counter badge
 */
export default function HintButton({ onClick, used = false, disabled = false, remainingHints = 3 }) {
  const isInactive = disabled || used || remainingHints <= 0;

  return (
    <button
      onClick={onClick}
      disabled={isInactive}
      type="button"
      className={`relative group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border-[3px] border-[#4A1513] bg-white text-[#4A1513] shadow-[0_3px_10px_rgba(74,21,19,0.12)] transition-all select-none shrink-0 ${
        isInactive
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-amber-50/50 hover:shadow-md active:scale-95 cursor-pointer'
      }`}
      aria-label="Use Hint"
    >
      <Lightbulb className={`w-4 h-4 text-[#4A1513] ${used ? 'fill-[#4A1513]' : ''}`} />
      <span className="text-sm sm:text-base font-bold tracking-tight whitespace-nowrap">
        Use Hint
      </span>
      
      <span className="px-2 py-0.5 rounded-md bg-[#4A1513] text-white text-xs font-mono font-black shrink-0">
        {remainingHints}
      </span>
    </button>
  );
}

