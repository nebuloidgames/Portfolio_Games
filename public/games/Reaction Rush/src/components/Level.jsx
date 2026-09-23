import React, { useState, useEffect } from "react";
import backgroundImg from "../assets/background.png";
import { initialLevels } from "../data/levelData";
import NebuloidTopLogo from "./NebuloidTopLogo";

const Level = ({
  levelData: externalLevelData,
  initialTab = "easy",
  onBack,
  onSelectStage,
  onResetProgress,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [levelData, setLevelData] = useState(() => {
    if (externalLevelData) return externalLevelData;
    const saved = localStorage.getItem("reaction_rush_levels");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((lvl) => ({
          ...lvl,
          stages: lvl.stages.map((st) => ({ ...st, locked: false })),
        }));
      } catch {
        // fallback
      }
    }
    return initialLevels.map((lvl) => ({
      ...lvl,
      stages: lvl.stages.map((st) => ({ ...st, locked: false })),
    }));
  });

  // Sync with externalLevelData if updated outside
  useEffect(() => {
    if (externalLevelData) {
      setLevelData(externalLevelData);
    }
  }, [externalLevelData]);

  // Sync initial tab when returning from game
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const effectiveLevels = externalLevelData || levelData;
  const currentLevel =
    effectiveLevels.find((l) => l.id === activeTab) || effectiveLevels[0];

  const handlePlayStage = (stage) => {
    if (onSelectStage) {
      onSelectStage({ level: currentLevel.id, stage: stage.id });
    } else {
      console.log(`Starting ${currentLevel.name} - ${stage.name}`);
    }
  };

  const difficultyCards = [
    {
      id: "easy",
      name: "EASY",
      desc: "Build Strong Basics And Boost Your Confidence.",
      icon: "backpack",
    },
    {
      id: "medium",
      name: "MEDIUM",
      desc: "Perfect For Little Learners To Start Their Journey.",
      icon: "book",
    },
    {
      id: "hard",
      name: "HARD",
      desc: "For Players Ready For Intense And Exciting Challenges.",
      icon: "rocket",
    },
  ];

  // Render the four stages matching the reference image L-1, L-2, L-3, L-4
  const displayStages = (currentLevel?.stages || []).slice(0, 4);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none flex flex-col items-center justify-between font-sans">
      {/* Self-contained styling for fonts and custom glassmorphism */}
      <style>{`
        .font-game-serif {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-style: normal;
        }
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

        .diff-card {
          background: linear-gradient(180deg, #ba6c2d 0%, #9c531d 100%);
          box-shadow: 0 12px 28px rgba(120, 55, 10, 0.4);
        }

        .diff-card.active {
          box-shadow: 0 16px 36px rgba(245, 158, 11, 0.55), 0 0 25px rgba(245, 158, 11, 0.45);
          border-color: #ffffff;
          transform: scale(1.03);
        }

        .stage-pill {
          background: linear-gradient(180deg, #ba6d2f 0%, #9c541f 100%);
          box-shadow: 0 8px 18px rgba(130, 55, 10, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.35);
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
          CENTER FROSTED GLASS CONTAINER
         ========================================================================= */}
      <div className="relative z-10 w-[92%] max-w-[1020px] h-[82vh] max-h-[590px] min-h-[440px] rounded-[30px] sm:rounded-[38px] md:rounded-[46px] glass-card flex flex-col justify-between items-center py-5 sm:py-7 px-4 sm:px-8 text-white my-auto">
        
        {/* BACK BUTTON (Top-Left navigation back to Start Screen) */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Start Screen"
            className="absolute top-4 sm:top-6 left-4 sm:left-6 w-10 h-10 rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer shadow-md group"
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

        {/* TOP HEADER: CHOOSE DIFICULTY */}
        <div className="flex flex-col items-center text-center mt-1">
          <h1 className="font-game-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[62px] tracking-[0.08em] leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] uppercase">
            CHOOSE DIFICULTY
          </h1>
        </div>

        {/* CENTER SECTION: 3 DIFFICULTY CARDS (EASY, MEDIUM, HARD) */}
        <div className="flex flex-row items-stretch justify-center gap-3 sm:gap-5 md:gap-8 w-full max-w-[880px] my-auto px-1 sm:px-2">
          {difficultyCards.map((diff) => {
            const isSelected = activeTab === diff.id;
            return (
              <div
                key={diff.id}
                onClick={() => setActiveTab(diff.id)}
                className={`diff-card flex-1 max-w-[260px] rounded-[24px] sm:rounded-[30px] md:rounded-[34px] border-2 border-white/50 py-5 sm:py-7 px-3 sm:px-4 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 hover:brightness-105 active:scale-98 ${
                  isSelected ? "active" : "opacity-90 hover:opacity-100"
                }`}
              >
                {/* Top Circular Badge with Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-[#3b2310]/85 border-[2px] border-white/80 flex items-center justify-center shadow-inner mb-2 sm:mb-3">
                  {diff.icon === "backpack" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 sm:w-9 sm:h-9 text-[#facc15] fill-none stroke-current"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      <rect x="5" y="6" width="14" height="15" rx="3" />
                      <rect
                        x="7"
                        y="12"
                        width="10"
                        height="7"
                        rx="2"
                        fill="currentColor"
                        fillOpacity="0.18"
                      />
                      <line x1="12" y1="12" x2="12" y2="15" strokeWidth="2" />
                    </svg>
                  )}

                  {diff.icon === "book" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 sm:w-9 sm:h-9 text-[#facc15] fill-none stroke-current"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h5.5A2.5 2.5 0 0 1 12.5 6.5V19a2 2 0 0 0-2-2h-6A2.5 2.5 0 0 0 2 19.5Z" />
                      <path d="M22 6.5A2.5 2.5 0 0 0 19.5 4h-5.5A2.5 2.5 0 0 0 11.5 6.5V19a2 2 0 0 1 2-2h6A2.5 2.5 0 0 1 22 19.5Z" />
                      <polygon
                        points="12 1 12.6 2.4 14 2.6 13 3.6 13.2 5 12 4.3 10.8 5 11 3.6 10 2.6 11.4 2.4"
                        fill="currentColor"
                        stroke="none"
                      />
                      <circle
                        cx="7.5"
                        cy="2"
                        r="0.8"
                        fill="currentColor"
                        stroke="none"
                      />
                      <circle
                        cx="16.5"
                        cy="2"
                        r="0.8"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  )}

                  {diff.icon === "rocket" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 sm:w-9 sm:h-9 text-[#facc15] fill-none stroke-current"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
                      <path d="M15 18v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
                      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
                    </svg>
                  )}
                </div>

                {/* Card Title */}
                <h2 className="font-game-sans font-black text-lg sm:text-2xl tracking-wider text-white uppercase drop-shadow-sm">
                  {diff.name}
                </h2>

                {/* Card Description */}
                <p className="font-game-sans text-[11px] sm:text-[13px] text-white/95 leading-snug sm:leading-relaxed mt-1.5 sm:mt-2 line-clamp-3">
                  {diff.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* BOTTOM SECTION: 4 STAGE BUTTONS (L-1, L-2, L-3, L-4) */}
        <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 md:gap-6 w-full max-w-[880px] mb-1">
          {displayStages.map((stage) => {
            const starsCount = stage.stars || 0;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handlePlayStage(stage)}
                className="stage-pill flex-1 max-w-[190px] py-2 sm:py-2.5 px-2 sm:px-4 rounded-[18px] sm:rounded-[22px] border-2 border-white/50 flex flex-col items-center justify-center cursor-pointer hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-md"
              >
                {/* Stage Name: L - 1 */}
                <span className="font-game-sans font-black text-base sm:text-xl md:text-2xl text-white tracking-wider leading-none">
                  {stage.name.replace("-", " - ")}
                </span>

                {/* Best & Stars */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/90 mt-1">
                  <span className="font-game-sans font-medium">Best</span>
                  <div className="flex items-center tracking-widest text-xs">
                    {[1, 2, 3].map((starIdx) => (
                      <span
                        key={starIdx}
                        className={
                          starIdx <= starsCount
                            ? "text-yellow-300 font-bold"
                            : "text-white/40"
                        }
                      >
                        {starIdx <= starsCount ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Level;
