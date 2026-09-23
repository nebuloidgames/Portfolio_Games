import React, { useState, useEffect, useRef, useCallback } from "react";
import playSoundEffect from "../utils/sound";
import backgroundImg from "../assets/background.png";
import caveImg from "../assets/cave.png";
import caveFrontImg from "../assets/cave-front.png";
import mouseImg from "../assets/mouse.png";
import hammerImg from "../assets/hammer.png";
import NebuloidTopLogo from "./NebuloidTopLogo";
import nebuloidLogo from "../assets/nebuloid_logo_vertical.png"

const Game = ({
  level = "easy",
  stage = 1,
  playerName = "",
  onBack,
  onNextStage,
  onStageComplete,
  onGenerateCertificate,
}) => {
  // =========================================================================
  // DIFFICULTY CONFIG
  // =========================================================================
  const getLevelConfig = (lvl, stg) => {
    const baseConfigs = {
      easy: {
        name: "EASY",
        totalTime: 30,
        minHitsToPass: 6,
        mouseVisibleMin: 1400,
        mouseVisibleMax: 2000,
        maxSimultaneous: 2,
        spawnInterval: 1200,
        speedBonus: 1.0,
      },
      medium: {
        name: "MEDIUM",
        totalTime: 35,
        minHitsToPass: 8,
        mouseVisibleMin: 900,
        mouseVisibleMax: 1500,
        maxSimultaneous: 3,
        spawnInterval: 900,
        speedBonus: 1.25,
      },
      hard: {
        name: "HARD",
        totalTime: 40,
        minHitsToPass: 10,
        mouseVisibleMin: 550,
        mouseVisibleMax: 1000,
        maxSimultaneous: 4,
        spawnInterval: 700,
        speedBonus: 1.5,
      },
      expert: {
        name: "EXPERT",
        totalTime: 45,
        minHitsToPass: 12,
        mouseVisibleMin: 400,
        mouseVisibleMax: 800,
        maxSimultaneous: 5,
        spawnInterval: 550,
        speedBonus: 2.0,
      },
    };
    return baseConfigs[lvl] || baseConfigs.easy;
  };

  const config = getLevelConfig(level, stage);
  const TOTAL_HOLES = 9;
  const TOTAL_HITS_TARGET = config.minHitsToPass + 4;

  // =========================================================================
  // GAME STATE
  // =========================================================================
  const [gameState, setGameState] = useState("countdown"); // countdown | playing | paused | gameover
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.totalTime);

  // Mole/Mouse State: which holes have a visible mouse
  // Each entry: { holeIndex, appearedAt, visibleDuration, isHit }
  const [activeMice, setActiveMice] = useState([]);

  // Scoring
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lastReactionTime, setLastReactionTime] = useState(null);

  // Hammer cursor
  const [hammerPos, setHammerPos] = useState({ x: 0, y: 0 });
  const [isSmashing, setIsSmashing] = useState(false);

  // Floating feedback texts
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Certificate modal
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPlayerName, setCertPlayerName] = useState(playerName || "");

  useEffect(() => {
    if (playerName) {
      setCertPlayerName(playerName);
    }
  }, [playerName]);

  // Refs
  const spawnTimerRef = useRef(null);
  const gameFieldRef = useRef(null);
  const activeMiceRef = useRef([]);

  // Keep activeMiceRef in sync
  useEffect(() => {
    activeMiceRef.current = activeMice;
  }, [activeMice]);

  const sound = useCallback(
    (type) => {
      playSoundEffect(type, isMuted);
    },
    [isMuted],
  );

  // =========================================================================
  // HAMMER CURSOR TRACKING
  // =========================================================================
  useEffect(() => {
    const handleMouseMove = (e) => {
      setHammerPos({ x: e.clientX, y: e.clientY });
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        setHammerPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // =========================================================================
  // COUNTDOWN (3...2...1...GO!)
  // =========================================================================
  useEffect(() => {
    if (gameState === "countdown") {
      sound("countdown");
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            sound("rush");
            setGameState("playing");
            return 0;
          }
          sound("countdown");
          return prev - 1;
        });
      }, 850);
      return () => clearInterval(interval);
    }
  }, [gameState, sound]);

  // =========================================================================
  // GAME TIMER
  // =========================================================================
  useEffect(() => {
    let timerInterval = null;
    if (gameState === "playing") {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timerInterval);
            handleGameOver();
            return 0;
          }
          if (prev <= 5.1 && Math.floor(prev) !== Math.floor(prev - 0.1)) {
            sound("tickWarning");
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameState, sound]);

  // =========================================================================
  // MOUSE SPAWNING LOGIC
  // =========================================================================
  const spawnMouse = useCallback(() => {
    if (gameState !== "playing") return;

    setActiveMice((prev) => {
      // Don't exceed max simultaneous mice
      const currentActive = prev.filter((m) => !m.isHit);
      if (currentActive.length >= config.maxSimultaneous) return prev;

      // Pick a random hole that doesn't already have a mouse
      const occupiedHoles = new Set(prev.map((m) => m.holeIndex));
      const availableHoles = [];
      for (let i = 0; i < TOTAL_HOLES; i++) {
        if (!occupiedHoles.has(i)) availableHoles.push(i);
      }
      if (availableHoles.length === 0) return prev;

      const randomHole =
        availableHoles[Math.floor(Math.random() * availableHoles.length)];
      const visibleDuration =
        config.mouseVisibleMin +
        Math.random() * (config.mouseVisibleMax - config.mouseVisibleMin);

      const newMouse = {
        id: Date.now() + Math.random(),
        holeIndex: randomHole,
        appearedAt: Date.now(),
        visibleDuration,
        isHit: false,
      };

      return [...prev, newMouse];
    });
  }, [gameState, config]);

  // Spawn mice on interval
  useEffect(() => {
    if (gameState === "playing") {
      // Initial spawn
      spawnMouse();

      spawnTimerRef.current = setInterval(() => {
        spawnMouse();
      }, config.spawnInterval);
    }

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [gameState, spawnMouse, config.spawnInterval]);

  // Remove expired mice (those whose visible duration has passed and aren't hit)
  useEffect(() => {
    if (gameState !== "playing") return;

    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setActiveMice((prev) =>
        prev
          .map((mouse) => {
            if (mouse.isHit) return mouse;
            if (
              !mouse.isRetreating &&
              now - mouse.appearedAt >= mouse.visibleDuration - 220
            ) {
              return { ...mouse, isRetreating: true };
            }
            return mouse;
          })
          .filter((mouse) => {
            if (mouse.isHit) {
              return now - mouse.hitAt < 300;
            }
            return now - mouse.appearedAt < mouse.visibleDuration;
          }),
      );
    }, 50);

    return () => clearInterval(cleanupInterval);
  }, [gameState]);

  // =========================================================================
  // HIT / MISS DETECTION
  // =========================================================================
  const triggerFloatingFeedback = (text, color, x, y) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, color, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  const handleHammerSmash = () => {
    setIsSmashing(true);
    setTimeout(() => setIsSmashing(false), 150);
  };

  const handleHoleClick = (holeIndex, e) => {
    if (gameState !== "playing") return;

    handleHammerSmash();
    setTotalAttempts((prev) => prev + 1);

    // Check if there's an active (non-hit) mouse at this hole
    const mouseAtHole = activeMiceRef.current.find(
      (m) => m.holeIndex === holeIndex && !m.isHit,
    );

    // Get click position for floating text
    const rect = e.currentTarget.getBoundingClientRect();
    const feedbackX = rect.left + rect.width / 2;
    const feedbackY = rect.top;

    if (mouseAtHole) {
      // HIT!
      const reactionMs = Math.max(
        50,
        Math.round(Date.now() - mouseAtHole.appearedAt),
      );
      setReactionTimes((prev) => [...prev, reactionMs]);
      setLastReactionTime(reactionMs);

      const newHits = hits + 1;
      setHits(newHits);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Score based on reaction speed
      let basePts = 100;
      let rating = "GOOD!";
      if (reactionMs < 400) {
        basePts = 500;
        rating = "GODLIKE! ⚡";
      } else if (reactionMs < 700) {
        basePts = 350;
        rating = "FAST! 🚀";
      } else if (reactionMs < 1200) {
        basePts = 200;
        rating = "NICE! 👍";
      }

      const streakMultiplier = 1 + (newStreak - 1) * 0.2;
      const addedScore = Math.round(
        basePts * streakMultiplier * config.speedBonus,
      );
      setScore((prev) => prev + addedScore);

      if (newStreak >= 3) {
        sound("streak");
      } else {
        sound("hit");
      }

      // Mark mouse as hit
      setActiveMice((prev) =>
        prev.map((m) =>
          m.id === mouseAtHole.id ? { ...m, isHit: true, hitAt: Date.now() } : m,
        ),
      );

      triggerFloatingFeedback(
        `+${addedScore} ${rating}${newStreak >= 2 ? ` 🔥x${newStreak}` : ""}`,
        "#22c55e",
        feedbackX,
        feedbackY,
      );
    } else {
      // MISS
      setMisses((prev) => prev + 1);
      setStreak(0);
      sound("miss");
      setScore((prev) => Math.max(0, prev - 30));
      triggerFloatingFeedback("MISS!", "#ef4444", feedbackX, feedbackY);
    }
  };

  // =========================================================================
  // GAME OVER
  // =========================================================================
  const handleGameOver = () => {
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
    sound("finish");
    setGameState("gameover");
    setActiveMice([]);

    const avgTime =
      reactionTimes.length > 0
        ? Math.round(
            reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
          )
        : 0;

    const acc =
      totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 100;
    const passed = hits >= config.minHitsToPass;

    let earnedStars = 0;
    if (passed) {
      earnedStars = 1;
      if (hits >= config.minHitsToPass + 4 && acc >= 85) earnedStars = 3;
      else if (hits >= config.minHitsToPass && acc >= 70) earnedStars = 2;
    }

    // Save to localStorage
    try {
      const saved = localStorage.getItem("reaction_rush_levels");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((lvl) => {
          if (lvl.id !== level) return lvl;
          const newStages = lvl.stages.map((st) => {
            if (st.id === stage) {
              const timeFormatted =
                avgTime > 0 ? (avgTime / 1000).toFixed(2) + "s" : "00.00s";
              return {
                ...st,
                stars: Math.max(st.stars || 0, earnedStars),
                best: timeFormatted,
              };
            }
            if (st.id === stage + 1 && passed) {
              return { ...st, locked: false };
            }
            return st;
          });
          const clearedCount = newStages.filter((s) => s.stars > 0).length;
          return { ...lvl, cleared: clearedCount, stages: newStages };
        });
        localStorage.setItem("reaction_rush_levels", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Storage update error:", err);
    }

    if (onStageComplete) {
      onStageComplete({
        level,
        stage,
        score,
        hits,
        reactionTimes,
        avgReactionTime: avgTime,
        accuracy: acc,
        starsEarned: earnedStars,
        isPassed: passed,
      });
    }
  };

  // =========================================================================
  // RESTART
  // =========================================================================
  const handleRestart = () => {
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
    setTimeLeft(config.totalTime);
    setHits(0);
    setMisses(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalAttempts(0);
    setReactionTimes([]);
    setLastReactionTime(null);
    setActiveMice([]);
    setFloatingTexts([]);
    setCountdown(3);
    setGameState("countdown");
  };

  // =========================================================================
  // COMPUTED VALUES
  // =========================================================================
  const avgReactionTime =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
        )
      : 0;

  const accuracy =
    totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 100;

  const isPassed = hits >= config.minHitsToPass;

  const calculateStars = () => {
    if (!isPassed) return 0;
    if (hits >= config.minHitsToPass + 4 && accuracy >= 85) return 3;
    if (hits >= config.minHitsToPass && accuracy >= 70) return 2;
    return 1;
  };
  const starsEarned = calculateStars();

  const hitsProgress = Math.min(1, hits / TOTAL_HITS_TARGET);

  // Certificate handler
  const handleCertificateSubmit = (e) => {
    e.preventDefault();
    if (!certPlayerName.trim()) return;
    if (onGenerateCertificate) {
      onGenerateCertificate({
        playerName: certPlayerName.trim(),
        level: config.name,
        stage,
        score,
        avgReactionTime,
        accuracy,
        stars: starsEarned,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        certId:
          "WHACK-" + Math.floor(100000 + Math.random() * 900000) + "-RR",
      });
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div
      className="w-full h-screen max-h-screen flex flex-col items-center overflow-hidden select-none relative"
      style={{ cursor: "none" }}
    >
      {/* Fonts & Animations */}
      <style>{`
        .font-game-serif {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-style: normal;
        }
        .font-game-sans {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-style: normal;
        }

        .hud-pill {
          background: linear-gradient(180deg, #f88626 0%, #eb6813 100%);
          box-shadow: 0 4px 10px rgba(185, 70, 10, 0.35), inset 0 1px 1px rgba(255,255,255,0.3);
        }

        .progress-track {
          background: rgba(255,255,255,0.85);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.12);
        }

        .progress-fill {
          background: linear-gradient(90deg, #f88626, #eb6813);
          box-shadow: 0 0 8px rgba(245,130,20,0.5);
          transition: width 0.3s ease;
        }

        @keyframes mousePopUp {
          0% {
            transform: translateY(105%);
            opacity: 0.85;
          }
          65% {
            transform: translateY(-8%);
            opacity: 1;
          }
          85% {
            transform: translateY(2%);
            opacity: 1;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        @keyframes mousePopDown {
          0% {
            transform: translateY(0%) scale(1);
            filter: brightness(1);
          }
          25% {
            transform: translateY(-4%) scale(0.95, 0.8) rotate(-6deg);
            filter: brightness(1.35);
          }
          45% {
            transform: translateY(12%) scale(0.9, 0.7) rotate(6deg);
          }
          100% {
            transform: translateY(105%) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes mouseRetreat {
          0% {
            transform: translateY(0%);
            opacity: 1;
          }
          100% {
            transform: translateY(105%);
            opacity: 1;
          }
        }

        .mouse-up {
          animation: mousePopUp 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards;
        }

        .mouse-hit {
          animation: mousePopDown 0.25s ease-in forwards;
        }

        .mouse-retreat {
          animation: mouseRetreat 0.22s ease-in forwards;
        }

        @keyframes hammerSmash {
          0% { transform: rotate(-15deg); }
          50% { transform: rotate(20deg) scale(1.08); }
          100% { transform: rotate(-15deg); }
        }

        .hammer-smashing {
          animation: hammerSmash 0.15s ease-in-out;
        }

        @keyframes floatUp {
          0% { transform: translateX(-50%) translateY(0) scale(0.85); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-50px) scale(1.15); opacity: 0; }
        }
        .floating-pts {
          animation: floatUp 0.9s ease-out forwards;
        }

        @keyframes countdownPulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .countdown-num {
          animation: countdownPulse 0.7s ease-out;
        }

        .cave-hole {
          position: relative;
          user-select: none;
          cursor: none;
        }

        .mouse-hole-wrapper {
          position: absolute;
          width: 58%;
          height: 86%;
          bottom: 27%;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          pointer-events: none;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .game-over-glass {
          background: rgba(30, 20, 10, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 2px solid rgba(248, 134, 38, 0.5);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* ============================
          BACKGROUND
         ============================ */}
      <img
        src={backgroundImg}
        alt="Game Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* TOP NEBULOID LOGO PILL */}
      <div className="absolute top-6 left-6">
        <img src={nebuloidLogo} alt="nebuloid-logo" className="h-[100px]" />
      </div>

      {/* ============================
          TOP HUD BAR
         ============================ */}
      {gameState !== "countdown" && (
        <div className="relative z-20 w-full max-w-[1050px] flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 pt-3 sm:pt-4">
          {/* Level pill */}
          <div className="hud-pill text-white font-game-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-full tracking-wider uppercase">
            LEVEL {stage} - {config.name}
          </div>

          {/* Menu / Back pill */}
          <button
            type="button"
            onClick={onBack}
            className="hud-pill text-white font-game-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-full tracking-wider flex items-center gap-2 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
            style={{ cursor: "none" }}
          >
            <span>←</span>
            <span>MENU</span>
          </button>

          {/* Timer pill */}
          <div
            className={`hud-pill text-white font-game-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-full tracking-wider flex items-center gap-1.5 ${
              timeLeft <= 5 ? "animate-pulse" : ""
            }`}
          >
            <span>⏱</span>
            <span>{timeLeft.toFixed(1)}S</span>
          </div>

          {/* Score pill */}
          <div className="hud-pill text-white font-game-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-full tracking-wider">
            SCORE {score}
          </div>

          {/* Streak pill */}
          <div className="hud-pill text-white font-game-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-full tracking-wider">
            STREAK: {streak}x
          </div>
        </div>
      )}

      {/* ============================
          PROGRESS BAR SECTION
         ============================ */}
      {gameState !== "countdown" && (
        <div className="relative z-20 w-full max-w-[1050px] px-3 sm:px-5 mt-2">
          <div className="flex items-center justify-between text-white font-game-sans font-bold text-xs sm:text-sm mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            <span>
              REACTION:{" "}
              {lastReactionTime ? `${lastReactionTime}ms` : "--"}
            </span>
            <span>
              HITS {hits}/{TOTAL_HITS_TARGET}
            </span>
          </div>
          <div className="progress-track w-full h-4 sm:h-5 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full rounded-full"
              style={{ width: `${hitsProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================
          GAME FIELD: 3x3 CAVE GRID
         ============================ */}
      {gameState !== "countdown" && (
        <div
          ref={gameFieldRef}
          className="relative z-10 flex-1 w-full max-w-[900px] grid grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-0 place-items-center px-4 sm:px-8 py-2 sm:py-4 mt-1"
          style={{ cursor: "none" }}
        >
          {Array.from({ length: TOTAL_HOLES }).map((_, idx) => {
            const mouseHere = activeMice.find(
              (m) => m.holeIndex === idx,
            );
            const isMouseHit = mouseHere && mouseHere.isHit;
            const isRetreating =
              mouseHere && mouseHere.isRetreating && !mouseHere.isHit;

            return (
              <div
                key={idx}
                className="cave-hole relative w-full max-w-[210px] sm:max-w-[230px] aspect-[229/127] flex items-end justify-center select-none cursor-none"
                onClick={(e) => handleHoleClick(idx, e)}
                style={{ cursor: "none" }}
              >
                {/* Layer 1: Base Cave (Back rim + Dark cave hole + Mound) */}
                <img
                  src={caveImg}
                  alt="Cave Hole"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ zIndex: 1 }}
                  draggable={false}
                />

                {/* Layer 2: Mouse (Emerged from inside the cave hole!) */}
                {mouseHere && (
                  <div className="mouse-hole-wrapper" style={{ zIndex: 2 }}>
                    <img
                      src={mouseImg}
                      alt="Mouse"
                      className={`w-full object-contain ${
                        isMouseHit
                          ? "mouse-hit"
                          : isRetreating
                          ? "mouse-retreat"
                          : "mouse-up"
                      }`}
                      draggable={false}
                    />
                  </div>
                )}

                {/* Layer 3: Cave Front Rim (Seamless overlay in front of mouse so mouse comes out from inside the cave) */}
                <img
                  src={caveFrontImg}
                  alt="Cave Front Rim"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ zIndex: 3 }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ============================
          FLOATING FEEDBACK TEXTS
         ============================ */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="floating-pts fixed font-game-sans font-black text-sm sm:text-base pointer-events-none z-50 whitespace-nowrap"
          style={{
            left: ft.x,
            top: ft.y,
            color: ft.color,
            textShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* ============================
          HAMMER CURSOR
         ============================ */}
      <img
        src={hammerImg}
        alt="Hammer Cursor"
        className={`fixed pointer-events-none z-[60] w-20 h-20 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] ${
          isSmashing ? "hammer-smashing" : ""
        }`}
        style={{
          left: hammerPos.x,
          top: hammerPos.y,
          transform: `translate(-30%, -70%) rotate(-15deg)`,
        }}
        draggable={false}
      />

      {/* ============================
          COUNTDOWN OVERLAY
         ============================ */}
      {gameState === "countdown" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div
              key={countdown}
              className="countdown-num font-game-sans font-extrabold text-[120px] sm:text-[160px] text-white drop-shadow-[0_6px_20px_rgba(248,134,38,0.6)]"
            >
              {countdown > 0 ? countdown : "GO!"}
            </div>
            <span className="font-game-sans font-bold text-lg sm:text-xl text-white/80 mt-2 tracking-widest uppercase">
              Get Ready...
            </span>
          </div>
        </div>
      )}

      {/* ============================
          GAME OVER OVERLAY
         ============================ */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="game-over-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white flex flex-col items-center">
            {/* Title */}
            <h2 className="font-game-sans font-extrabold text-3xl sm:text-4xl tracking-wide text-white mb-1">
              {isPassed ? "STAGE CLEAR!" : "TIME'S UP!"}
            </h2>
            <p className="font-game-sans text-sm text-white/70 mb-4">
              {isPassed
                ? "Great job! You passed this stage!"
                : `You needed ${config.minHitsToPass} hits to pass.`}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-5">
              {[1, 2, 3].map((starIdx) => (
                <span
                  key={starIdx}
                  className={`text-3xl sm:text-4xl transition-all duration-300 ${
                    starIdx <= starsEarned
                      ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] scale-110"
                      : "text-white/25"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="font-game-sans text-[11px] text-white/60 uppercase tracking-wider">
                  Score
                </div>
                <div className="font-game-sans font-black text-xl text-white">
                  {score}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="font-game-sans text-[11px] text-white/60 uppercase tracking-wider">
                  Hits
                </div>
                <div className="font-game-sans font-black text-xl text-white">
                  {hits}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="font-game-sans text-[11px] text-white/60 uppercase tracking-wider">
                  Avg Reaction
                </div>
                <div className="font-game-sans font-black text-xl text-white">
                  {avgReactionTime > 0
                    ? `${(avgReactionTime / 1000).toFixed(2)}s`
                    : "--"}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="font-game-sans text-[11px] text-white/60 uppercase tracking-wider">
                  Best Streak
                </div>
                <div className="font-game-sans font-black text-xl text-white">
                  {maxStreak}x
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="font-game-sans text-[11px] text-white/60 uppercase tracking-wider">
                  Accuracy
                </div>
                <div className="font-game-sans font-black text-xl text-white">
                  {accuracy}%
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="font-game-sans text-[11px] text-white/60 uppercase tracking-wider">
                  Misses
                </div>
                <div className="font-game-sans font-black text-xl text-white">
                  {misses}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={handleRestart}
                className="flex-1 py-2.5 rounded-full border border-white/30 text-white font-game-sans font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all active:scale-95"
                style={{ cursor: "pointer" }}
              >
                🔄 Retry
              </button>

              {isPassed && (
                <button
                  type="button"
                  onClick={() => {
                    if (onNextStage) {
                      onNextStage({ level, stage: stage + 1 });
                    }
                    handleRestart();
                  }}
                  className="flex-1 py-2.5 rounded-full font-game-sans font-semibold text-sm cursor-pointer hover:brightness-110 transition-all active:scale-95 text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, #f88626, #eb6813)",
                    boxShadow:
                      "0 6px 14px rgba(185,70,10,0.4), inset 0 1px 1px rgba(255,255,255,0.35)",
                    cursor: "pointer",
                  }}
                >
                  ▶ Next Stage
                </button>
              )}

              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2.5 rounded-full border border-white/30 text-white font-game-sans font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all active:scale-95"
                style={{ cursor: "pointer" }}
              >
                📋 Menu
              </button>
            </div>

            {/* Certificate Row */}
            {isPassed && starsEarned >= 2 && (
              <div className="mt-4 w-full">
                {!showCertModal ? (
                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="w-full py-2.5 rounded-full border border-yellow-500/50 text-yellow-400 font-game-sans font-semibold text-sm cursor-pointer hover:bg-yellow-500/10 transition-all"
                    style={{ cursor: "pointer" }}
                  >
                    🏆 Get Certificate
                  </button>
                ) : (
                  <form
                    onSubmit={handleCertificateSubmit}
                    className="flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      value={certPlayerName}
                      onChange={(e) => setCertPlayerName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/30 text-white font-game-sans placeholder:text-white/40 outline-none focus:border-[#f88626] transition-colors text-sm"
                      autoFocus
                      style={{ cursor: "text" }}
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full font-game-sans font-semibold text-sm cursor-pointer hover:brightness-110 transition-all text-white"
                      style={{
                        background:
                          "linear-gradient(180deg, #f88626, #eb6813)",
                        cursor: "pointer",
                      }}
                    >
                      Generate Certificate
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
