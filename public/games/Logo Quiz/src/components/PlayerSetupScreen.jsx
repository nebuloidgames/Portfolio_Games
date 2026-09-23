import React, { useState } from "react";
import { ArrowLeft, Users, Bot, User, Sparkles, Play } from "lucide-react";
import startBottomImg from "../assets/start-bottom.png";
import nebuloidLogo from "../assets/nebuloid-logo.png";
import FloatingKeyboard from "./FloatingKeyboard";
import TopLogoBanner from "./TopLogoBanner";

/**
 * PlayerSetupScreen:
 * Triggered after selecting "Team vs Team" or "vs Robot" (and supports Solo)
 * - Lets players enter customized names
 * - Displays a small, sleek FloatingKeyboard on input click/focus
 * - Seamlessly integrates with physical keyboard and on-screen keyboard
 */
export default function PlayerSetupScreen({
  difficulty = "easy",
  gameMode = "team", // 'team' | 'robot' | 'self'
  playerNames = {
    team1: "Team 1",
    team2: "Team 2",
    player: "Player 1",
    robot: "Robo AI",
  },
  onUpdatePlayerNames,
  onStartQuiz,
  onBack,
}) {
  const [names, setNames] = useState({
    team1: playerNames.team1 || "Team 1",
    team2: playerNames.team2 || "Team 2",
    player: playerNames.player || "Player 1",
    robot: playerNames.robot || "Robo AI",
  });

  // Floating Keyboard State
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeInputKey, setActiveInputKey] = useState("team1"); // 'team1' | 'team2' | 'player'

  const handleInputChange = (key, val) => {
    const updated = { ...names, [key]: val };
    setNames(updated);
    if (onUpdatePlayerNames) {
      onUpdatePlayerNames(updated);
    }
  };

  const handleFocusInput = (key) => {
    setActiveInputKey(key);
    setIsKeyboardOpen(true);
  };

  const handleStart = () => {
    setIsKeyboardOpen(false);
    if (onUpdatePlayerNames) {
      onUpdatePlayerNames(names);
    }
    onStartQuiz(difficulty, gameMode, names);
  };

  const getActiveLabel = () => {
    if (activeInputKey === "team1") return "Team 1 Name";
    if (activeInputKey === "team2") return "Team 2 Name";
    if (activeInputKey === "player") return "Player Name";
    return "Keyboard";
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FEF5E6] text-black flex flex-col justify-between items-center overflow-hidden select-none">
      {/* ================= TOP LOGO BANNER WITH NEBULOID LOGO ================= */}
      <TopLogoBanner />

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-2 z-20 relative my-auto">
        {/* Navigation Bar (Back & Difficulty Indicator) */}
        <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-2 sm:mb-4">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-2 py-2 px-5 rounded-full bg-[#501010] hover:bg-[#681818] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-xs font-bold px-4 py-2 rounded-full bg-[#501010]/15 text-[#501010] border border-[#501010]/30 uppercase tracking-wider">
            MODE:{" "}
            <strong className="ml-1 uppercase">
              {gameMode === "team"
                ? "Team vs Team"
                : gameMode === "robot"
                  ? "vs Robot"
                  : "Solo"}
            </strong>
          </span>
        </div>

        {/* Title Header */}
        <div className="text-center mb-6">
          <h1 className="font-logo-title text-3xl sm:text-4xl md:text-5xl font-black text-[#4A1513] title-3d-shadow tracking-tight text-center leading-tight">
            {gameMode === "team"
              ? "ENTER TEAM NAMES"
              : gameMode === "robot"
                ? "ENTER CHALLENGER NAME"
                : "ENTER PLAYER NAME"}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-700 mt-1 max-w-md mx-auto">
            {gameMode === "team"
              ? "Customize names for both competing teams before beginning the duel."
              : "Set your player name to challenge the Robot AI in real-time."}
          </p>
        </div>

        {/* ================= INPUT FORM CARDS ================= */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xs border-2 border-[#501010] rounded-3xl p-5 sm:p-7 shadow-xl">
          {/* TEAM VS TEAM MODE INPUTS */}
          {gameMode === "team" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Team 1 Input */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  activeInputKey === "team1" && isKeyboardOpen
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    T1
                  </div>
                  <label className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Team 1 (Blue)
                  </label>
                </div>

                <input
                  type="text"
                  maxLength={16}
                  value={names.team1}
                  onChange={(e) => handleInputChange("team1", e.target.value)}
                  onFocus={() => handleFocusInput("team1")}
                  placeholder="Enter Team 1 Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm sm:text-base focus:outline-none focus:border-indigo-600"
                />
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                  Keys: 1, 2, 3, 4 to buzz
                </span>
              </div>

              {/* Team 2 Input */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  activeInputKey === "team2" && isKeyboardOpen
                    ? "border-rose-600 bg-rose-50/50 shadow-md ring-2 ring-rose-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    T2
                  </div>
                  <label className="text-xs font-black text-rose-950 uppercase tracking-wider">
                    Team 2 (Red)
                  </label>
                </div>

                <input
                  type="text"
                  maxLength={16}
                  value={names.team2}
                  onChange={(e) => handleInputChange("team2", e.target.value)}
                  onFocus={() => handleFocusInput("team2")}
                  placeholder="Enter Team 2 Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm sm:text-base focus:outline-none focus:border-rose-600"
                />
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                  Keys: 7, 8, 9, 0 to buzz
                </span>
              </div>
            </div>
          )}

          {/* VS ROBOT MODE INPUTS */}
          {gameMode === "robot" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Player Input */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  activeInputKey === "player" && isKeyboardOpen
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <label className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Your Name (Challenger)
                  </label>
                </div>

                <input
                  type="text"
                  maxLength={16}
                  value={names.player}
                  onChange={(e) => handleInputChange("player", e.target.value)}
                  onFocus={() => handleFocusInput("player")}
                  placeholder="Enter Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm sm:text-base focus:outline-none focus:border-indigo-600"
                />
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                  Race to answer before 5s Robot scan
                </span>
              </div>

              {/* Robot Info (Readonly Display) */}
              <div className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <label className="text-xs font-black text-purple-950 uppercase tracking-wider">
                      Opponent AI
                    </label>
                  </div>

                  <div className="px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-900 font-bold text-sm sm:text-base flex items-center justify-between">
                    <span>{names.robot}</span>
                    <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
                      AI BOT
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-purple-700 font-medium mt-1 block">
                  Auto-scans and answers in 5 seconds
                </span>
              </div>
            </div>
          )}

          {/* SOLO MODE INPUT (Fallback) */}
          {gameMode === "self" && (
            <div className="max-w-md mx-auto">
              <div
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  activeInputKey === "player" && isKeyboardOpen
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <label className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Player Name
                  </label>
                </div>

                <input
                  type="text"
                  maxLength={16}
                  value={names.player}
                  onChange={(e) => handleInputChange("player", e.target.value)}
                  onFocus={() => handleFocusInput("player")}
                  placeholder="Enter Player Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm sm:text-base focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {/* Start Battle / Match Button */}
          <div className="mt-6 flex flex-col items-center">
            <button
              onClick={handleStart}
              type="button"
              className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#501010] hover:bg-[#681818] active:scale-95 text-white font-bold text-sm sm:text-base tracking-widest uppercase shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-amber-300/40"
            >
              <span>START MATCH</span>
              <Play className="w-4 h-4 fill-white text-white" />
            </button>
            <span className="text-[11px] text-slate-500 font-medium mt-2 text-center">
              Click input to open floating keyboard or type with physical keyboard
            </span>
          </div>
        </div>
      </div>

      {/* ================= COMPACT FLOATING KEYBOARD ================= */}
      <FloatingKeyboard
        isOpen={isKeyboardOpen}
        targetLabel={getActiveLabel()}
        value={names[activeInputKey] || ""}
        onChange={(newVal) => handleInputChange(activeInputKey, newVal)}
        onClose={() => setIsKeyboardOpen(false)}
        onDone={() => setIsKeyboardOpen(false)}
      />

      {/* ================= BOTTOM LOGO BANNER ================= */}
      <div className="w-full pointer-events-none z-10 overflow-hidden leading-none shrink-0">
        <img
          src={startBottomImg}
          alt="Logo Banner Bottom"
          className="w-full h-14 sm:h-20 md:h-24 lg:h-28 object-cover object-top select-none block"
        />
      </div>
    </div>
  );
}
