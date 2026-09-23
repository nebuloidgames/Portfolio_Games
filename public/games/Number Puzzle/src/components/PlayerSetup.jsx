import React, { useState, useEffect, useRef } from "react";
import { soundManager } from "../utils/audio";
import bgImg from "../assets/bg-img.png";
import nebuloidLogo from "../assets/logo_black_horizental.png";

export const PlayerSetup = ({ onBack, onContinue, initialName = "" }) => {
  const [playerName, setPlayerName] = useState(() => {
    return initialName || localStorage.getItem("player_name") || "";
  });
  const inputRef = useRef(null);

  // Auto focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    soundManager.playClick();
    const trimmed = playerName.trim() || "Player 1";
    localStorage.setItem("player_name", trimmed);
    onContinue(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFormSubmit(e);
    }
  };

  return (
    <div
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center select-none bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FROSTED GLASS MODAL CARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-[92%] sm:w-[84%] md:w-[70%] max-w-2xl rounded-[28px] sm:rounded-[36px] glass-start-card py-10 sm:py-12 md:py-14 px-6 sm:px-12 text-center animate-fadeIn shadow-2xl">
        {/* Nebuloid Branding Logo */}
        <div className="relative flex items-center justify-center">
          <img
            src={nebuloidLogo}
            alt="Nebuloid"
            className="h-20 object-contain"
          />
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-center"
        >
          {/* Eyebrow / Subtitle */}
          <div className="text-gray-900 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1">
            REGISTRATION
          </div>

          {/* Main Heading */}
          <h1 className="text-white font-extrabold text-3xl sm:text-5xl md:text-[52px] tracking-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)] mb-1">
            Enter Your Name
          </h1>

          {/* Helper Subtitle */}
          <p className="text-gray-900 text-xs sm:text-sm font-semibold tracking-wide mb-8">
            Your Name Will Appear On The Certificate.
          </p>

          {/* Vibrant Green Input Box with Profile Icon */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="flex items-center w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#3fb226] border border-white/30 shadow-inner focus-within:ring-2 focus-within:ring-white/60 transition-all">
              {/* User Silhouette Icon */}
              <svg
                className="w-5 h-5 text-white/95 shrink-0 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>

              <input
                ref={inputRef}
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Your Name"
                maxLength={20}
                className="w-full bg-transparent text-white font-semibold text-base sm:text-lg placeholder:text-white/80 focus:outline-none"
              />
            </div>
          </div>

          {/* Primary Action Button: BEGIN DEFUSAL */}
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="w-full max-w-md mx-auto py-3 sm:py-3.5 rounded-full bg-[#226e17] hover:bg-[#2b881d] active:scale-98 text-white font-bold text-xs sm:text-sm tracking-[0.18em] uppercase border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer mb-4"
          >
            CONTINUE
          </button>

          {/* Secondary Action Link: BACK TO MAIN MENU */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="text-gray-900 hover:text-black font-extrabold text-xs sm:text-sm tracking-[0.15em] uppercase transition-colors cursor-pointer pt-1"
          >
            BACK TO MAIN MENU
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetup;
