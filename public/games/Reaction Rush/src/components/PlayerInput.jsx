import React, { useState } from "react";
import backgroundImg from "../assets/background.png";
import FloatingKeyboard from "./FloatingKeyboard";
import NebuloidTopLogo from "./NebuloidTopLogo";

const PlayerInput = ({
  initialName = "",
  onContinue,
  onBack,
}) => {
  const [name, setName] = useState(initialName || "");
  const [errorMsg, setErrorMsg] = useState("");

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg("Please enter your name to proceed!");
      return;
    }
    setErrorMsg("");
    if (onContinue) {
      onContinue(trimmed);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none flex flex-col items-center justify-between font-sans">
      {/* Self-contained styling matching StartScreen & Level */}
      <style>{`
        .font-game-sans {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-style: normal;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255, 255, 255, 0.42);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.45);
        }

        .pill-btn-orange {
          background: linear-gradient(180deg, #f88626 0%, #eb6813 100%);
          box-shadow: 0 6px 14px rgba(185, 70, 10, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.35);
        }
      `}</style>

      {/* =========================================================================
          BACKGROUND LAYER: Full screen farm landscape
         ========================================================================= */}
      <img
        src={backgroundImg}
        alt="Reaction Rush Farm Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* TOP NEBULOID LOGO PILL */}
      <NebuloidTopLogo />

      {/* =========================================================================
          CENTER FROSTED GLASS CONTAINER (Matches StartScreen & Level design flow)
         ========================================================================= */}
      <div className="relative z-10 w-[92%] max-w-[1020px] h-[82vh] max-h-[590px] min-h-[440px] rounded-[30px] sm:rounded-[38px] md:rounded-[46px] glass-card flex flex-col justify-between items-center py-5 sm:py-7 px-4 sm:px-8 text-white my-auto">
        
        {/* BACK BUTTON (Top-Left navigation back to Start Screen) */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Start Screen"
            className="absolute top-4 sm:top-6 left-4 sm:left-6 w-10 h-10 rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer shadow-md group z-20"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current transition-transform duration-150 group-hover:-translate-x-0.5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* TOP HEADER: RACER REGISTRATION & ENTER YOUR NAME */}
        <div className="flex flex-col items-center text-center mt-1 sm:mt-2">
          <span className="font-game-sans font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.38em] uppercase text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            RACER REGISTRATION
          </span>
          <h1 className="font-game-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[62px] tracking-[0.06em] leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] mt-1 sm:mt-1.5 uppercase">
            ENTER YOUR NAME
          </h1>
        </div>

        {/* CENTER SECTION: BADGE + NAME INPUT + QUICK PRESETS */}
        <div className="w-full max-w-lg my-auto flex flex-col items-center gap-3 sm:gap-4 px-2">

          {/* Input field with floating keyboard */}
          <div className="w-full relative">
            <FloatingKeyboard
              value={name}
              onChange={(val) => {
                setName(val);
                if (errorMsg) setErrorMsg("");
              }}
              onEnter={handleContinue}
              autoOpen={true}
              placeholder="Type your name..."
            />

            {/* Clear button */}
            {name && (
              <button
                type="button"
                onClick={() => setName("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                title="Clear text"
              >
                ✕
              </button>
            )}
          </div>

          {/* Validation error message if any */}
          {errorMsg && (
            <div className="text-amber-200 text-xs sm:text-sm font-semibold tracking-wide bg-red-500/30 border border-red-400/50 px-4 py-1.5 rounded-full animate-bounce">
              {errorMsg}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: CONTINUE BUTTON (Orange pill matching StartScreen & Level) */}
        <div className="flex items-center justify-center w-full mb-1 sm:mb-2">
          <button
            type="button"
            onClick={handleContinue}
            className="pill-btn-orange font-game-sans font-semibold text-white px-8 sm:px-12 py-3 rounded-full flex items-center gap-2.5 text-sm sm:text-base cursor-pointer hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xl tracking-wider uppercase"
          >
            <span>CONTINUE TO RACE</span>
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlayerInput;
