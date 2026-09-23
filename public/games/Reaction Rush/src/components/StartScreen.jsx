import React, { useState } from "react";
import backgroundImg from "../assets/background.png";
import startBtnImg from "../assets/start.png";
import NebuloidTopLogo from "./NebuloidTopLogo";

const StartScreen = ({
  onStartRace,
  onCertificates,
  onHowToPlay,
  onExit,
}) => {
  const [activeModal, setActiveModal] = useState(null);

  const handleStartRace = () => {
    if (onStartRace) {
      onStartRace();
    } else {
      console.log("Start Race clicked");
    }
  };

  const handleCertificates = () => {
    if (onCertificates) {
      onCertificates();
    } else {
      setActiveModal("certificates");
    }
  };

  const handleHowToPlay = () => {
    if (onHowToPlay) {
      onHowToPlay();
    } else {
      setActiveModal("howToPlay");
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      setActiveModal("exit");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none flex flex-col items-center justify-between font-sans">
      {/* Self-contained styling for fonts, custom glassmorphism and subtle animations */}
      <style>{`
        .font-game-serif {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-style: normal;
        }
        .font-game-sans {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-style: normal;
        }

        @keyframes subtleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.015);
          }
        }

        .start-btn-pulse {
          animation: subtleFloat 3.2s ease-in-out infinite;
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
          BACKGROUND LAYER: Full screen farm scenery matching reference
         ========================================================================= */}
      <img
        src={backgroundImg}
        alt="Reaction Rush Farm Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* TOP NEBULOID LOGO PILL (relative, rounded, transparent background) */}
      <NebuloidTopLogo />

      {/* =========================================================================
          CENTER FROSTED GLASS CONTAINER
         ========================================================================= */}
      <div className="relative z-10 w-[92%] max-w-[1020px] h-[82vh] max-h-[590px] min-h-[440px] rounded-[30px] sm:rounded-[38px] md:rounded-[46px] glass-card flex flex-col justify-between items-center py-5 sm:py-7 px-4 sm:px-8 text-white my-auto">
        
        {/* TOP HEADER: WELCOME TO & REACTION RUSH */}
        <div className="flex flex-col items-center text-center mt-1 sm:mt-2">
          {/* WELCOME TO */}
          <span className="font-game-sans font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.38em] uppercase text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            WELCOME TO
          </span>

          {/* REACTION RUSH */}
          <h1 className="font-game-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[72px] tracking-[0.06em] leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] mt-1 sm:mt-1.5">
            REACTION RUSH
          </h1>
        </div>

        {/* CENTER: CIRCULAR START BUTTON FROM ASSETS */}
        <div className="my-auto flex items-center justify-center">
          <button
            type="button"
            onClick={handleStartRace}
            aria-label="Start Reaction Rush"
            className="start-btn-pulse group relative cursor-pointer outline-none transition-all duration-300 hover:scale-106 active:scale-95 hover:drop-shadow-[0_0_35px_rgba(245,158,11,0.65)]"
          >
            <img
              src={startBtnImg}
              alt="Start Button"
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-[285px] lg:h-[285px] object-contain drop-shadow-[0_10px_25px_rgba(234,108,23,0.45)] transition-transform duration-300"
            />
          </button>
        </div>

        {/* BOTTOM NAVIGATION: 3 ORANGE PILL BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-8 w-full mb-1 sm:mb-2">

          {/* 2. How To Play Button */}
          <button
            type="button"
            onClick={handleHowToPlay}
            className="pill-btn-orange font-game-sans font-medium text-white px-5 sm:px-7 py-2.5 rounded-full flex items-center gap-2 text-sm sm:text-[15px] cursor-pointer hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
          >
            <span className="text-base sm:text-lg font-black leading-none flex items-center justify-center font-sans">
              ?
            </span>
            <span>How To Play</span>
          </button>

        </div>
      </div>

      {/* =========================================================================
          POPUP MODALS (Interactive overlays)
         ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1f1915]/95 border-2 border-[#ea6b14]/70 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white">
            {/* Close Cross */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer font-bold text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Modal: How To Play */}
            {activeModal === "howToPlay" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f88626]/20 border border-[#f88626]/40 flex items-center justify-center mb-3">
                  <span className="font-black text-2xl text-[#f88626]">?</span>
                </div>
                <h3 className="font-game-sans font-bold text-2xl tracking-wide text-white mb-3">
                  How To Play
                </h3>
                <ul className="text-left text-neutral-200 text-sm space-y-2.5 mb-6 list-disc pl-5 font-game-sans leading-relaxed">
                  <li>
                    <span className="text-[#f88626] font-semibold">Watch Closely:</span> Keep your eyes locked on the targets appearing on the field.
                  </li>
                  <li>
                    <span className="text-[#f88626] font-semibold">React Rapidly:</span> Tap or click as fast as possible the moment the cue signals.
                  </li>
                  <li>
                    <span className="text-[#f88626] font-semibold">Accuracy Matters:</span> Avoid miss-clicks to achieve 3 stars on every stage.
                  </li>
                  <li>
                    <span className="text-[#f88626] font-semibold">Earn Certificates:</span> Conquer levels from Easy to Insane and unlock your official certificate!
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-full pill-btn-orange text-white font-game-sans font-semibold tracking-wider text-sm uppercase cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                >
                  Got It!
                </button>
              </div>
            )}

            {/* Modal: Exit / Quit */}
            {activeModal === "exit" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f88626]/20 border border-[#f88626]/40 flex items-center justify-center mb-3">
                  <span className="text-2xl">🏡</span>
                </div>
                <h3 className="font-game-sans font-bold text-2xl tracking-wide text-white mb-2">
                  Quit To Home?
                </h3>
                <p className="text-neutral-300 text-sm mb-6 font-game-sans">
                  Are you sure you want to quit Reaction Rush and return to home?
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-full border border-white/30 text-white font-game-sans font-semibold text-sm cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      if (window.history.length > 1) {
                        window.history.back();
                      } else {
                        window.location.reload();
                      }
                    }}
                    className="flex-1 py-2.5 rounded-full pill-btn-orange text-white font-game-sans font-semibold text-sm cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                  >
                    Confirm Quit
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Fallback Certificates */}
            {activeModal === "certificates" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f88626]/20 border border-[#f88626]/40 flex items-center justify-center mb-3">
                  <span className="text-2xl">📜</span>
                </div>
                <h3 className="font-game-sans font-bold text-2xl tracking-wide text-white mb-2">
                  Certificates
                </h3>
                <p className="text-neutral-300 text-sm mb-6 font-game-sans">
                  Complete reaction speed stages to unlock and download your official performance certificates!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-full pill-btn-orange text-white font-game-sans font-semibold text-sm cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartScreen;
