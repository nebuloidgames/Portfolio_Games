import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import startBottomImg from "../assets/start-bottom.png";
import nebuloidLogo from "../assets/nebuloid-logo-cropped.png";
import TopLogoBanner from "./TopLogoBanner";

/**
 * StartScreen matching the official reference image design:
 * - Top banner: TopLogoBanner with start-bottom.png and nebuloid-logo.png overlay
 * - Bottom banner: start-bottom.png anchored to bottom edge
 * - Cream background (#FEF5E6)
 * - "WELCOME TO" subtitle + "LOGO QUIZ" in bold italic high-contrast serif
 * - Side pill buttons: Certificates, How To Play, Sound On/Off
 * - Hero START button: concentric circular orbital brackets, golden gradient, pale blue stroked text
 */
export default function StartScreen({
  onProceedToDifficulty,
  bestScore = 0,
  gamesPlayed = 0,
  soundEnabled = true,
  onToggleSound,
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-[#FEF5E6] text-black flex flex-col justify-between items-center overflow-hidden select-none">
      {/* ================= TOP LOGO BANNER WITH NEBULOID LOGO ================= */}
      <TopLogoBanner />

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-2 sm:py-4 z-20 relative">
        {/* Title Header */}
        <div className="text-center flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-10">
          <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.42em] sm:tracking-[0.48em] text-[#4A1513] uppercase block pl-1">
            W E L C O M E &nbsp; T O
          </span>

          <h1 className="font-logo-title italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#4A1513] title-3d-shadow tracking-normal leading-none mt-2 sm:mt-3">
            LOGO QUIZ
          </h1>
        </div>

        {/* Action Controls: Left Pills - Center Big Circle - Right Pills */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-4 my-auto">
          {/* Left Action Buttons */}
          <div className="flex flex-col gap-3.5 sm:gap-4 w-44 sm:w-48 md:w-52 shrink-0 items-center md:items-start order-2 md:order-1">
            <button
              onClick={onToggleSound}
              type="button"
              className="w-full py-2.5 sm:py-3 px-6 rounded-full bg-[#501010] hover:bg-[#681818] active:scale-95 text-white font-sans font-semibold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
            >
              {soundEnabled ? "Sound On" : "Sound Off"}
            </button>
          </div>

          {/* Center Big Circular START Button System */}
          <div className="relative flex items-center justify-center shrink-0 order-1 md:order-2 my-2 md:my-0">
            {/* Outer Container with Fixed Aspect Ratio */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
              {/* Outer Orbital Ring & Curved Brackets SVG Overlay */}
              <svg
                viewBox="0 0 340 340"
                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                fill="none"
              >
                {/* Thin Complete Circular Ring */}
                <circle
                  cx="170"
                  cy="170"
                  r="150"
                  stroke="#501010"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.85"
                />

                {/* Top-Left Orbital Curved Bracket (Sweeping ~155° to 248°) */}
                <path
                  d="M 38.0 236.0 A 156 156 0 0 1 125.0 28.0"
                  stroke="#501010"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Bottom-Right Orbital Curved Bracket (Sweeping ~335° to 68°) */}
                <path
                  d="M 302.0 104.0 A 156 156 0 0 1 215.0 312.0"
                  stroke="#501010"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Central START Hero Button */}
              <button
                onClick={onProceedToDifficulty}
                type="button"
                className="group relative w-[78%] h-[78%] rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center z-20 animate-halo-pulse focus:outline-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 48%, #FCC474 0%, #F5AB41 55%, #DF8A18 100%)",
                }}
                aria-label="Start Game"
              >
                {/* Inner Decorative Subtle Ring Highlight */}
                <div className="absolute inset-1.5 rounded-full border border-white/40 pointer-events-none" />

                {/* START Text with light blue fill and dark outline */}
                <span className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] text-[#C2E3F6] start-text-stroke select-none pl-1 transition-transform group-hover:scale-110 duration-200">
                  START
                </span>
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col gap-3.5 sm:gap-4 w-44 sm:w-48 md:w-52 shrink-0 items-center md:items-end order-3">
            <button
              onClick={() => setShowHowToPlay(true)}
              type="button"
              className="w-full py-2.5 sm:py-3 px-6 rounded-full bg-[#501010] hover:bg-[#681818] active:scale-95 text-white font-sans font-semibold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
            >
              How To Play
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM LOGO BANNER ================= */}
      <div className="w-full pointer-events-none z-10 overflow-hidden leading-none shrink-0">
        <img
          src={startBottomImg}
          alt="Logo Banner Bottom"
          className="w-full h-14 sm:h-20 md:h-24 lg:h-28 object-cover object-top select-none block"
        />
      </div>

      {/* ================= MODAL 1: HOW TO PLAY ================= */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-[#FEF5E6] border-2 border-[#501010] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-black">
            <span className="text-[11px] font-black tracking-[0.3em] text-[#501010] uppercase block">
              GUIDE
            </span>

            <h2 className="font-logo-title italic text-3xl sm:text-4xl font-black text-[#501010] tracking-tight mt-1 mb-5">
              HOW TO PLAY
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#501010]/20 bg-white/70 flex items-center gap-4 shadow-xs">
                <span className="text-sm font-black text-[#501010] font-mono shrink-0 w-7 text-center">
                  01
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#501010]">
                    Choose Game Mode
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    Play Solo in Self Mode, duel in Team vs Team (2 Windows), or
                    battle Robot AI.
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#501010]/20 bg-white/70 flex items-center gap-4 shadow-xs">
                <span className="text-sm font-black text-[#501010] font-mono shrink-0 w-7 text-center">
                  02
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#501010]">
                    Select Difficulty
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    Choose from Easy (10 pts), Medium (20 pts), or Hard (30 pts)
                    visual challenges.
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#501010]/20 bg-white/70 flex items-center gap-4 shadow-xs">
                <span className="text-sm font-black text-[#501010] font-mono shrink-0 w-7 text-center">
                  03
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#501010]">
                    Identify The Logo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    Recognize distorted brands using keyboard (1-4 / A-D) or
                    mouse click.
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#501010]/20 bg-white/70 flex items-center gap-4 shadow-xs">
                <span className="text-sm font-black text-[#501010] font-mono shrink-0 w-7 text-center">
                  04
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#501010]">
                    Win and Get Certified
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    Score points fast to win matches and unlock your
                    personalized certificate.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              type="button"
              className="w-full mt-6 py-3 px-6 rounded-full bg-[#501010] hover:bg-[#681818] active:scale-95 text-white transition-all flex items-center justify-between shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-white shrink-0" />
              <span className="font-bold text-xs sm:text-sm tracking-[0.2em] uppercase text-white text-center flex-1">
                CLOSE GUIDE
              </span>
              <div className="w-4 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CERTIFICATES & RECORDS ================= */}
      {showCertificates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-[#FEF5E6] border-2 border-[#501010] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-black">
            <span className="text-[11px] font-black tracking-[0.3em] text-[#501010] uppercase block">
              ACHIEVEMENTS
            </span>

            <h2 className="font-logo-title italic text-3xl sm:text-4xl font-black text-[#501010] tracking-tight mt-1 mb-5">
              CERTIFICATES
            </h2>

            <div className="p-5 rounded-2xl border-2 border-[#501010] bg-white/80 relative overflow-hidden shadow-xs">
              <div className="flex flex-col items-center text-center">
                <img
                  src={nebuloidLogo}
                  alt="Nebuloid Logo"
                  className="h-14 w-auto mx-auto mb-2 object-contain"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#501010]/80">
                  OFFICIAL CERTIFICATE OF MASTERY
                </span>

                <h3 className="font-logo-title italic text-xl sm:text-2xl font-black text-[#501010] mt-0.5 tracking-tight">
                  LOGO QUIZ CHAMPION
                </h3>

                <p className="text-xs text-slate-700 font-medium max-w-md mx-auto mt-1">
                  Awarded for demonstrating visual acuity and rapid brand logo
                  recognition across all difficulty tiers.
                </p>

                <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#501010]/20">
                  <div className="p-2.5 rounded-xl border border-[#501010]/15 bg-white/90 text-center">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      Best Score
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#501010] font-mono mt-0.5 block">
                      {bestScore.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-[#501010]/15 bg-white/90 text-center">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      Rounds
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#501010] font-mono mt-0.5 block">
                      {gamesPlayed}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-[#501010]/15 bg-white/90 text-center">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      Rank
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#501010] mt-1 block truncate">
                      {bestScore >= 200
                        ? "⭐ Master"
                        : bestScore >= 100
                          ? "🎯 Pro"
                          : "💡 Contender"}
                    </span>
                  </div>
                </div>

                <div className="w-full flex items-center justify-center gap-2 mt-3 text-[10px] font-black tracking-widest text-[#501010]/70 uppercase">
                  <span>★ VERIFIED BY NEBULOID STUDIOS ★</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCertificates(false)}
              type="button"
              className="w-full mt-6 py-3 px-6 rounded-full bg-[#501010] hover:bg-[#681818] active:scale-95 text-white transition-all flex items-center justify-between shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-white shrink-0" />
              <span className="font-bold text-xs sm:text-sm tracking-[0.2em] uppercase text-white text-center flex-1">
                CLOSE CERTIFICATES
              </span>
              <div className="w-4 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
