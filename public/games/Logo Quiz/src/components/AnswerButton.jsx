import React from 'react';

/**
 * Multiple Choice Option Tile matching reference mockup:
 * Vertical rounded tile with large letter (A, B, C, D) on top and brand name below
 */
export default function AnswerButton({
  letter,
  label,
  onClick,
  status = 'idle', // 'idle' | 'selected' | 'correct' | 'wrong' | 'eliminated'
  disabled = false,
  index = 0,
}) {
  let tileStyle =
    'bg-white hover:bg-amber-50/50 text-[#4A1513] border-[3px] border-[#4A1513] shadow-[0_4px_10px_rgba(74,21,19,0.12)] hover:shadow-md hover:scale-[1.02]';
  let letterStyle = 'text-[#4A1513]';
  let labelStyle = 'text-[#4A1513]';

  if (status === 'correct') {
    tileStyle =
      'bg-emerald-600 border-[3px] border-[#15803d] text-white shadow-lg ring-4 ring-emerald-500/20 animate-pop scale-[1.03]';
    letterStyle = 'text-white';
    labelStyle = 'text-white';
  } else if (status === 'wrong') {
    tileStyle =
      'bg-rose-600 border-[3px] border-[#b91c1c] text-white shadow-lg ring-4 ring-rose-500/20 animate-shake';
    letterStyle = 'text-white';
    labelStyle = 'text-white';
  } else if (status === 'eliminated') {
    tileStyle =
      'bg-slate-100 border-[2px] border-slate-300 text-slate-400 line-through opacity-35 cursor-not-allowed';
    letterStyle = 'text-slate-400';
    labelStyle = 'text-slate-400';
  } else if (status === 'selected') {
    tileStyle =
      'bg-[#4A1513] border-[3px] border-[#4A1513] text-white shadow-md scale-[1.02]';
    letterStyle = 'text-white';
    labelStyle = 'text-white';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || status === 'eliminated'}
      type="button"
      className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 md:p-3.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 select-none w-full min-h-[76px] sm:min-h-[88px] md:min-h-[96px] ${tileStyle} ${
        disabled && status === 'idle' ? 'opacity-80 cursor-default' : ''
      }`}
      aria-label={`Option ${letter}: ${label}`}
    >
      {/* Large Letter on Top */}
      <span className={`text-2xl sm:text-3xl font-black font-sans leading-none mb-1 transition-colors ${letterStyle}`}>
        {letter}
      </span>

      {/* Brand Option Name Below */}
      <span className={`text-xs sm:text-sm font-black tracking-wide uppercase truncate w-full text-center px-1 leading-tight transition-colors ${labelStyle}`}>
        {label}
      </span>
    </button>
  );
}

