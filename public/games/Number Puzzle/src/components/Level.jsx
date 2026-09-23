import React from "react";
import { soundManager } from "../utils/audio";
import bgImg from "../assets/bg-img.png";
import nebuloidLogo from "../assets/logo_black_horizental.png";

const Level = ({ onBack, onSelectLevel }) => {
  const levels = [
    {
      id: "easy",
      name: "EASY",
      moves: 20,
      startNum: 1,
      rangeLabel: "1 to 8",
      subtitle: "Gentle & Relaxed",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      textColor: "text-emerald-700",
      tileEmptyColor: "bg-emerald-600",
      btnBg: "bg-[#226e17] hover:bg-[#2b881d]",
      stars: "⭐",
      bullets: ["Numbers 1 through 8", "20 moves limit", "Ideal for beginners"],
    },
    {
      id: "medium",
      name: "MEDIUM",
      moves: 50,
      startNum: 11,
      rangeLabel: "11 to 18",
      subtitle: "Balanced Challenge",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      textColor: "text-amber-700",
      tileEmptyColor: "bg-amber-500",
      btnBg: "bg-[#1e6116] hover:bg-[#267b1c]",
      stars: "⭐⭐",
      bullets: [
        "Numbers 11 through 18",
        "50 moves limit",
        "Tests logic & foresight",
      ],
    },
    {
      id: "hard",
      name: "HARD",
      moves: 95,
      startNum: 21,
      rangeLabel: "21 to 28",
      subtitle: "Master Level",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      textColor: "text-rose-700",
      tileEmptyColor: "bg-rose-600",
      btnBg: "bg-[#185312] hover:bg-[#206918]",
      stars: "⭐⭐⭐",
      bullets: [
        "Numbers 21 through 28",
        "95 moves limit",
        "Complex slide patterns",
      ],
    },
  ];

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center select-none bg-cover bg-center py-6 px-3 sm:px-6"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FROSTED GLASS CENTER MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-[96%] sm:w-[92%] md:w-[88%] max-w-5xl rounded-[28px] sm:rounded-[36px] glass-start-card py-6 sm:py-9 px-4 sm:px-8 text-center animate-fadeIn shadow-2xl flex flex-col justify-between">
        {/* Nebuloid Branding Logo */}
        <div className="relative top-0 flex items-center justify-center">
          <img
            src={nebuloidLogo}
            alt="Nebuloid"
            className="h-18 object-contain"
          />
        </div>
        {/* Header Section */}
        <div className="mb-5 sm:mb-6">
          <div className="text-gray-900 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1">
            CHALLENGE SELECTION
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-wider uppercase drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)] mb-1">
            Select Difficulty
          </h1>
          <p className="text-gray-900 text-xs sm:text-sm font-semibold tracking-wide">
            Choose your challenge and start sliding the path.
          </p>
        </div>

        {/* 3 Difficulty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 my-auto px-1 sm:px-2">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className="bg-white/85 hover:bg-white/95 backdrop-blur-md border border-white/70 rounded-3xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between text-center"
            >
              <div>
                {/* Level Title & Star Rating */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-sans text-2xl font-black tracking-wider uppercase ${lvl.textColor}`}
                  >
                    {lvl.name}
                  </span>
                  <span className="text-sm">{lvl.stars}</span>
                </div>

                <p className="text-xs text-gray-500 font-sans text-left mb-3">
                  {lvl.subtitle}
                </p>

                {/* Range & Moves Badges */}
                <div className="flex items-center space-x-2 mb-4">
                  <span
                    className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${lvl.badgeColor}`}
                  >
                    Range: {lvl.rangeLabel}
                  </span>
                  <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                    {lvl.moves} MOVES
                  </span>
                </div>

                {/* Mini 3x3 Visual Preview */}
                <div className="flex justify-center mb-4">
                  <div className="p-1 rounded-xl bg-gray-100 border border-gray-200 grid grid-cols-3 gap-1 w-24 h-24 shadow-inner">
                    {[...Array(8)]
                      .map((_, i) => lvl.startNum + i)
                      .concat(null)
                      .map((n, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-center rounded-md font-sans font-black text-xs ${
                            n === null
                              ? `${lvl.tileEmptyColor} text-white shadow-xs`
                              : "bg-white text-gray-900 border border-gray-200 shadow-2xs"
                          }`}
                        >
                          {n !== null ? n : "●"}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-1.5 text-left mb-5">
                  {lvl.bullets.map((txt, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 text-xs text-gray-600 font-sans"
                    >
                      <span className={`${lvl.textColor} font-bold`}>✓</span>
                      <span>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Play Level Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectLevel(lvl.id, lvl.moves, lvl.startNum);
                }}
                className={`w-full py-3 rounded-full ${lvl.btnBg} text-white font-sans font-bold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2`}
              >
                <span>PLAY {lvl.name}</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Back Button */}
        <div className="pt-5 sm:pt-6">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="text-gray-900 hover:text-black font-extrabold text-xs sm:text-sm tracking-[0.15em] uppercase transition-colors cursor-pointer inline-flex items-center space-x-2"
          >
            <span>←</span>
            <span>BACK TO SETUP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level;
