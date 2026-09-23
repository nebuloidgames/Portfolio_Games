import React, { useState, useEffect, useRef } from 'react';
import bgImg from '../assets/bg-img.png';
import logoBlackVertical from '../assets/nebuloid-logo.png';

export default function PlayerSetupScreen({
  initialName = '',
  onContinue,
  onBack
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isCaps, setIsCaps] = useState(true);

  // Draggable keyboard position state
  const [keyboardPos, setKeyboardPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Draggable logic
  const handleDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: keyboardPos.x,
      initialY: keyboardPos.y
    };
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      setKeyboardPos({
        x: dragStartRef.current.initialX + deltaX,
        y: dragStartRef.current.initialY + deltaY
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue');
      return;
    }
    setError('');
    onContinue(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Virtual keyboard key click handlers
  const handleKeyClick = (char) => {
    if (name.length >= 25) return;
    const addedChar = isCaps ? char.toUpperCase() : char.toLowerCase();
    setName((prev) => prev + addedChar);
    if (error) setError('');
  };

  const handleBackspace = () => {
    setName((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    if (name.length >= 25) return;
    setName((prev) => prev + ' ');
  };

  const handleClear = () => {
    setName('');
  };

  const resetKeyboardPos = () => {
    setKeyboardPos({ x: 0, y: 0 });
  };

  // Keyboard Rows
  const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 select-none overflow-hidden font-sans">
      {/* ================= TRUE BLURRED BACKGROUND LAYER ================= */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none filter blur-lg scale-105 transition-all duration-300"
        style={{
          backgroundImage: `url(${bgImg})`
        }}
      />
      {/* Darkening & Soft Ambient Tint Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ================= TOP BRANDING: NEBULOID LOGO AT TOP ================= */}
      <div className="relative w-full max-w-4xl flex items-center justify-center z-20 pt-1 pb-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5">
          <img
            src={logoBlackVertical}
            alt="Nebuloid"
            className="h-15 w-auto object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* ================= MAIN SETUP CONTAINER ================= */}
      <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] border border-white/70 shadow-[0_25px_60px_rgba(0,0,0,0.35)] px-5 py-6 sm:px-10 sm:py-8 flex flex-col items-center text-center z-10 animate-fade-in my-auto">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] sm:tracking-[0.25em] text-black uppercase mb-1.5">
          PLAYER SETUP
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-600 text-xs sm:text-sm font-semibold tracking-wide mb-6 sm:mb-8">
          Enter the name that will appear on the certificate.
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* Input Box with User Icon & Keyboard Toggle */}
          <div className="w-full relative flex items-center mb-5 sm:mb-6">
            {/* User Icon */}
            <div className="absolute left-4 sm:left-5 text-neutral-800 pointer-events-none">
              <svg
                className="w-6 h-6 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={name}
              onFocus={() => setShowKeyboard(true)}
              onClick={() => setShowKeyboard(true)}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              maxLength={25}
              placeholder="Type player name..."
              className="w-full bg-white text-black text-base sm:text-lg font-bold pl-14 sm:pl-16 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-black/85 shadow-inner focus:outline-none focus:border-black focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-neutral-400"
            />

            {/* Floating Keyboard Toggle Button */}
            <button
              type="button"
              onClick={() => setShowKeyboard((prev) => !prev)}
              className={`absolute right-3 p-2 rounded-xl text-sm transition-all cursor-pointer ${
                showKeyboard
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
              title={showKeyboard ? 'Hide Virtual Keyboard' : 'Open Draggable Keyboard'}
              aria-label="Toggle Virtual Keyboard"
            >
              ⌨️
            </button>
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="w-full text-left -mt-3 mb-3 text-xs font-bold text-rose-600 animate-fade-in pl-2">
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 px-4 rounded-xl sm:rounded-2xl border-2 border-black/85 bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm tracking-wider uppercase shadow-sm transition-all duration-150 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span>BACK</span>
            </button>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl sm:rounded-2xl border-2 border-black bg-black hover:bg-neutral-800 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-150 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>→</span>
              <span>CONTINUE</span>
            </button>
          </div>
        </form>

        {/* Footer Shortcut Hint */}
        <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500 font-semibold select-none">
          <kbd className="px-2 py-0.5 bg-neutral-200 border border-neutral-300 rounded font-mono text-[11px] font-bold text-neutral-700">
            ENTER
          </kbd>
          <span>Press <b className="text-black">ENTER</b> to continue</span>
        </div>
      </div>

      {/* ================= DRAGGABLE & DROPPABLE FLOATING KEYBOARD ================= */}
      {showKeyboard && (
        <div
          className={`fixed z-50 w-[92%] max-w-[420px] bg-slate-950/95 backdrop-blur-2xl border-2 border-blue-400/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 sm:p-2.5 text-white select-none transition-shadow ${
            isDragging ? 'shadow-[0_25px_60px_rgba(59,130,246,0.5)] ring-2 ring-blue-400' : ''
          }`}
          style={{
            left: '50%',
            bottom: '16px',
            transform: `translate(calc(-50% + ${keyboardPos.x}px), ${keyboardPos.y}px)`,
            touchAction: 'none'
          }}
          onMouseDown={(e) => {
            // Prevent text input from losing focus
            e.preventDefault();
          }}
        >
          {/* Draggable Drag-Bar Header */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/15 px-1.5 cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-lg transition-colors"
            title="Click and drag to move keyboard anywhere"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-200">
              <span className="text-blue-400 text-xs">⋮⋮</span>
              <span>Floating Keyboard</span>
              <span className="text-[9px] text-cyan-300 font-bold bg-blue-600/30 border border-blue-400/30 px-1.5 py-0.5 rounded-full">
                Drag ✥
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {(keyboardPos.x !== 0 || keyboardPos.y !== 0) && (
                <button
                  type="button"
                  onClick={resetKeyboardPos}
                  className="text-[9px] font-bold text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title="Reset Position"
                >
                  Reset Pos
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="text-[9px] font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowKeyboard(false)}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] flex items-center justify-center cursor-pointer transition-colors"
                title="Hide Keyboard"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Row 1: Numbers */}
          <div className="grid grid-cols-10 gap-1 mb-1">
            {numberRow.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="h-7 sm:h-8 rounded-md bg-white/10 hover:bg-white/25 active:bg-blue-600 active:scale-95 text-white font-black text-xs transition-all flex items-center justify-center border border-white/10 cursor-pointer shadow-xs"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Row 2: Q - P */}
          <div className="grid grid-cols-10 gap-1 mb-1">
            {row1.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleKeyClick(char)}
                className="h-7 sm:h-8 rounded-md bg-white/10 hover:bg-white/25 active:bg-blue-600 active:scale-95 text-white font-black text-xs transition-all flex items-center justify-center border border-white/10 cursor-pointer shadow-xs"
              >
                {isCaps ? char : char.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Row 3: A - L */}
          <div className="grid grid-cols-9 gap-1 mb-1 px-2.5 sm:px-3">
            {row2.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleKeyClick(char)}
                className="h-7 sm:h-8 rounded-md bg-white/10 hover:bg-white/25 active:bg-blue-600 active:scale-95 text-white font-black text-xs transition-all flex items-center justify-center border border-white/10 cursor-pointer shadow-xs"
              >
                {isCaps ? char : char.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Row 4: CAPS | Z - M | BACKSPACE */}
          <div className="flex gap-1 mb-1">
            {/* Caps Lock Toggle */}
            <button
              type="button"
              onClick={() => setIsCaps((prev) => !prev)}
              className={`w-11 sm:w-12 h-7 sm:h-8 rounded-md font-black text-[9px] sm:text-[10px] transition-all flex items-center justify-center border cursor-pointer active:scale-95 ${
                isCaps
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
              }`}
            >
              CAPS ⇪
            </button>

            {/* Z - M */}
            <div className="grid grid-cols-7 gap-1 flex-1">
              {row3.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className="h-7 sm:h-8 rounded-md bg-white/10 hover:bg-white/25 active:bg-blue-600 active:scale-95 text-white font-black text-xs transition-all flex items-center justify-center border border-white/10 cursor-pointer shadow-xs"
                >
                  {isCaps ? char : char.toLowerCase()}
                </button>
              ))}
            </div>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              className="w-11 sm:w-12 h-7 sm:h-8 rounded-md bg-rose-600/80 hover:bg-rose-500 text-white font-black text-xs transition-all flex items-center justify-center border border-rose-400/40 cursor-pointer active:scale-95 shadow-sm"
              title="Backspace"
            >
              ⌫
            </button>
          </div>

          {/* Row 5: SPACE & SUBMIT */}
          <div className="flex gap-1 pt-0.5">
            {/* Space Bar */}
            <button
              type="button"
              onClick={handleSpace}
              className="flex-1 h-7 sm:h-8 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/30 text-slate-300 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center border border-white/10 cursor-pointer active:scale-98 shadow-xs"
            >
              SPACE
            </button>

            {/* Done / Enter Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3.5 sm:px-4 h-7 sm:h-8 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-md shadow-blue-600/30"
            >
              <span>OK</span>
              <span>↵</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      {!showKeyboard && (
        <div className="relative z-10 pt-2 pb-1 text-center">
          <span className="text-[11px] font-bold text-white/90 tracking-wider uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Nebuloid Tech • Color Clash Player Profile
          </span>
        </div>
      )}
    </div>
  );
}
