import React, { useState } from "react";
import {
  ChevronDecorLeft,
  ChevronDecorRight,
  GamepadIcon,
  BackArrowIcon,
} from "../App";
import nurseryIcon from "../assets/Nursery.png";
import primaryIcon from "../assets/Primary.png";
import middleIcon from "../assets/Middle.png";
import highIcon from "../assets/High.png";
import gamerIcon from "../assets/Gamer.png";
import newTugBg from "../assets/new-Tug-img.png";
import NebuloidTopLogo from "./NebuloidTopLogo";
import FloatingKeyboard from "./FloatingKeyboard";

const DIFFICULTY_CARDS = [
  {
    id: "Nursery",
    title: "NURSERY",
    desc: "Perfect For Little Learners To Start Their Journey.",
    icon: nurseryIcon,
    borderColor: "#84cc16",
    bgFill: "rgba(6, 26, 17, 0.95)",
    glowColor: "rgba(132, 204, 22, 0.45)",
  },
  {
    id: "Primary",
    title: "PRIMARY",
    desc: "Build Strong Basics And Boost Your Confidence.",
    icon: primaryIcon,
    borderColor: "#eab308",
    bgFill: "rgba(33, 21, 5, 0.95)",
    glowColor: "rgba(234, 179, 8, 0.45)",
  },
  {
    id: "Middle",
    title: "MIDDLE",
    desc: "Perfect For Little Learners To Start Their Journey.",
    icon: middleIcon,
    borderColor: "#c084fc",
    bgFill: "rgba(26, 10, 42, 0.95)",
    glowColor: "rgba(192, 132, 252, 0.45)",
  },
  {
    id: "High",
    title: "HIGH",
    desc: "For Players Ready For Intense And Exciting Challenges.",
    icon: highIcon,
    borderColor: "#ef4444",
    bgFill: "rgba(36, 9, 12, 0.95)",
    glowColor: "rgba(239, 68, 68, 0.45)",
  },
  {
    id: "Gamer",
    title: "GAMER",
    desc: "Extreme Difficulty For True Gaming Champions!",
    icon: gamerIcon,
    borderColor: "#00d2ff",
    bgFill: "rgba(4, 25, 36, 0.95)",
    glowColor: "rgba(0, 210, 255, 0.45)",
  },
];

const MODES = [
  {
    id: "team",
    label: "Team vs Team",
    desc: "2 Groups, 1 Screen",
    icon: "👥",
  },
  {
    id: "robot",
    label: "Robot",
    desc: "Solo Practice",
    icon: "🤖",
  },
];

export default function PreGameLobby({ onCancel, onStart, onHowToPlay }) {
  const [step, setStep] = useState(1);
  const [activeKbField, setActiveKbField] = useState(null);
  const [cfg, setCfg] = useState({
    difficulty: "Primary",
    mode: "team",
    teamA: "Team A",
    teamB: "Team B",
    timeLimit: 120,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleStart = () => {
    setErrorMsg("");
    if (cfg.mode === "team") {
      if (!cfg.teamA.trim()) {
        setErrorMsg("Please enter a name for Team A.");
        return;
      }
      if (!cfg.teamB.trim()) {
        setErrorMsg("Please enter a name for Team B.");
        return;
      }
    } else {
      if (!cfg.teamA.trim()) {
        setErrorMsg("Please enter your player name.");
        return;
      }
    }
    onStart({
      ...cfg,
      teamA: cfg.teamA.trim(),
      teamB: cfg.mode === "robot" ? "Robot" : cfg.teamB.trim(),
      timeLimit: 120,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col w-full h-full text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 44, 0.35) 0%, rgba(6, 9, 20, 0.72) 100%), url(${newTugBg})`,
      }}
    >
      {/* ====================================================================
          STEP 1: CHOOSE DIFFICULTY (Matching Reference UI Image)
          ==================================================================== */}
      {step === 1 && (
        <main className="arena-difficulty-screen">
          {/* Ambient center radial glow */}
          <div className="arena-bg-glow" aria-hidden="true" />

          {/* Top Nebuloid Studio Branding */}
          <NebuloidTopLogo />

          {/* Left and Right Chevron Wings */}
          <ChevronDecorLeft />
          <ChevronDecorRight />

          {/* Header Title: CHOOSE DIFFICULTY */}
          <header className="arena-header">
            <h1 className="arena-title">
              <span className="title-game">CHOOSE</span>
              <span className="title-arena">DIFFICULTY</span>
            </h1>
          </header>

          {/* 5 Chamfered Difficulty Cards */}
          <section className="arena-diff-cards-container">
            {DIFFICULTY_CARDS.map((card) => {
              const isSelected = cfg.difficulty === card.id;
              return (
                <div
                  key={card.id}
                  className={`arena-diff-card ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setCfg({ ...cfg, difficulty: card.id });
                    setStep(2);
                  }}
                  style={{ "--card-glow": card.glowColor }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title} difficulty`}
                >
                  {/* Octagonal Chamfered Bevel Card Border & Fill */}
                  <svg
                    className="arena-card-svg"
                    viewBox="0 0 210 360"
                    preserveAspectRatio="none"
                  >
                    <polygon
                      points="24,0 186,0 210,24 210,336 186,360 24,360 0,336 0,24"
                      fill={card.bgFill}
                      stroke={card.borderColor}
                      strokeWidth="2.8"
                      strokeLinejoin="miter"
                    />
                  </svg>

                  <div className="arena-diff-card-content">
                    <div className="arena-diff-icon-wrap">
                      <img
                        src={card.icon}
                        alt={card.title}
                        className="arena-diff-icon-img"
                      />
                    </div>
                    <h3 className="arena-diff-title">{card.title}</h3>
                    <p className="arena-diff-desc">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Bottom Bar: How To Play and Back */}
          <footer className="arena-bottom-bar">
            <button
              className="arena-pill-btn arena-btn-help"
              onClick={onHowToPlay}
              aria-label="How To Play"
            >
              <GamepadIcon />
              <span>How To Play</span>
            </button>

            <button
              className="arena-pill-btn arena-btn-back"
              onClick={onCancel}
              aria-label="Back to Start Screen"
            >
              <BackArrowIcon />
              <span>Back</span>
            </button>
          </footer>
        </main>
      )}

      {/* ====================================================================
          STEP 2: CHOOSE MODE
          ==================================================================== */}
      {step === 2 && (
        <main className="arena-difficulty-screen">
          <div className="arena-bg-glow" aria-hidden="true" />
          <NebuloidTopLogo />
          <ChevronDecorLeft />
          <ChevronDecorRight />

          <header className="arena-header">
            <h1 className="arena-title">
              <span className="title-game">CHOOSE</span>
              <span className="title-arena">MODE</span>
            </h1>
          </header>

          <div className="arena-modal-panel">
            <div className="arena-mode-grid">
              {MODES.map((m) => {
                const isSelected = cfg.mode === m.id;
                return (
                  <button
                    key={m.id}
                    className={`arena-mode-card ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      if (m.id === "team") {
                        setCfg({
                          ...cfg,
                          mode: "team",
                          teamA: cfg.teamA === "Player 1" ? "Team A" : (cfg.teamA || "Team A"),
                          teamB: cfg.teamB === "Robot" ? "Team B" : (cfg.teamB || "Team B"),
                        });
                      } else {
                        setCfg({
                          ...cfg,
                          mode: "robot",
                          teamA: cfg.teamA === "Team A" ? "Player 1" : (cfg.teamA || "Player 1"),
                          teamB: "Robot",
                        });
                      }
                      setStep(3);
                    }}
                  >
                    <div className="arena-mode-icon">{m.icon}</div>
                    <div className="arena-mode-title">{m.label}</div>
                    <div className="arena-mode-desc">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="arena-bottom-bar">
            <button
              className="arena-pill-btn arena-btn-back"
              onClick={() => setStep(1)}
              aria-label="Back to Difficulties"
            >
              <BackArrowIcon />
              <span>Back</span>
            </button>
          </footer>
        </main>
      )}

      {/* ====================================================================
          STEP 3: TEAM / PLAYER SETUP
          ==================================================================== */}
      {step === 3 && (
        <main className="arena-difficulty-screen">
          <div className="arena-bg-glow" aria-hidden="true" />
          <NebuloidTopLogo />
          <ChevronDecorLeft />
          <ChevronDecorRight />

          <header className="arena-header">
            <h1 className="arena-title">
              <span className="title-game">{cfg.mode === "robot" ? "PLAYER" : "TEAM"}</span>
              <span className="title-arena">SETUP</span>
            </h1>
          </header>

          <div className="arena-modal-panel">
            {cfg.mode === "robot" ? (
              <>
                <div className="arena-input-group">
                  <label className="arena-input-label">PLAYER NAME</label>
                  <div className="arena-input-wrap">
                    <input
                      className="arena-input"
                      value={cfg.teamA}
                      onFocus={() => setActiveKbField("teamA")}
                      onClick={() => setActiveKbField("teamA")}
                      onChange={(e) => {
                        setCfg({ ...cfg, teamA: e.target.value });
                        setErrorMsg("");
                      }}
                      placeholder="Enter your name"
                      maxLength={16}
                    />
                    <button
                      type="button"
                      className="arena-input-kb-btn"
                      onClick={() =>
                        setActiveKbField(activeKbField === "teamA" ? null : "teamA")
                      }
                      title="Toggle on-screen keyboard"
                      aria-label="Toggle on-screen keyboard for Player"
                    >
                      ⌨
                    </button>
                  </div>
                </div>

                <div className="arena-solo-opponent-card">
                  <div className="arena-solo-opponent-avatar">🤖</div>
                  <div className="arena-solo-opponent-info">
                    <div className="arena-solo-opponent-name">Smart Math Robot</div>
                    <div className="arena-solo-opponent-meta">
                      Opponent • {cfg.difficulty} Level AI
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="arena-input-group">
                  <label className="arena-input-label">TEAM A NAME</label>
                  <div className="arena-input-wrap">
                    <input
                      className="arena-input"
                      value={cfg.teamA}
                      onFocus={() => setActiveKbField("teamA")}
                      onClick={() => setActiveKbField("teamA")}
                      onChange={(e) => {
                        setCfg({ ...cfg, teamA: e.target.value });
                        setErrorMsg("");
                      }}
                      placeholder="Enter Team A name"
                      maxLength={16}
                    />
                    <button
                      type="button"
                      className="arena-input-kb-btn"
                      onClick={() =>
                        setActiveKbField(activeKbField === "teamA" ? null : "teamA")
                      }
                      title="Toggle on-screen keyboard"
                      aria-label="Toggle on-screen keyboard for Team A"
                    >
                      ⌨
                    </button>
                  </div>
                </div>

                <div className="arena-input-group">
                  <label className="arena-input-label">TEAM B NAME</label>
                  <div className="arena-input-wrap">
                    <input
                      className="arena-input"
                      value={cfg.teamB}
                      onFocus={() => setActiveKbField("teamB")}
                      onClick={() => setActiveKbField("teamB")}
                      onChange={(e) => {
                        setCfg({ ...cfg, teamB: e.target.value });
                        setErrorMsg("");
                      }}
                      placeholder="Enter Team B name"
                      maxLength={16}
                    />
                    <button
                      type="button"
                      className="arena-input-kb-btn"
                      onClick={() =>
                        setActiveKbField(activeKbField === "teamB" ? null : "teamB")
                      }
                      title="Toggle on-screen keyboard"
                      aria-label="Toggle on-screen keyboard for Team B"
                    >
                      ⌨
                    </button>
                  </div>
                </div>
              </>
            )}

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 font-bold text-center text-sm">
                {errorMsg}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                className="arena-pill-btn"
                onClick={() => {
                  setStep(2);
                  setActiveKbField(null);
                  setErrorMsg("");
                }}
              >
                <BackArrowIcon />
                <span>Back</span>
              </button>

              <button className="arena-btn-primary" onClick={handleStart}>
                <span>Start Game</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Small Draggable Floating Keyboard */}
          <FloatingKeyboard
            isOpen={Boolean(activeKbField)}
            targetLabel={
              cfg.mode === "robot"
                ? "Player Name"
                : activeKbField === "teamA"
                  ? "Team A Name"
                  : "Team B Name"
            }
            value={activeKbField === "teamA" ? cfg.teamA : cfg.teamB}
            onChange={(val) => {
              if (!activeKbField) return;
              setCfg((prev) => ({ ...prev, [activeKbField]: val }));
              setErrorMsg("");
            }}
            onClose={() => setActiveKbField(null)}
            onDone={() => {
              if (cfg.mode === "team" && activeKbField === "teamA") {
                setActiveKbField("teamB");
              } else {
                setActiveKbField(null);
              }
            }}
          />

          <footer className="arena-bottom-bar" />
        </main>
      )}
    </div>
  );
}
