import React from "react";
import {
  Volume2,
  VolumeX,
  Home,
  Layers,
  Users,
  Bot,
  User,
  Zap,
} from "lucide-react";
import ScoreDisplay from "./ScoreDisplay";

/**
 * Ultra-Modern Minimalist Monochrome GameHeader HUD
 */
export default function GameHeader({
  currentQuestion = 1,
  totalQuestions = 10,
  score = 0,
  scoreDelta = 0,
  difficulty = "easy",
  gameMode = "self", // 'self' | 'team' | 'robot'
  teamScores = { team1: 0, team2: 0 },
  robotScore = 0,
  userScore = 0,
  playerNames = {
    team1: "Team 1",
    team2: "Team 2",
    player: "Player 1",
    robot: "Robo AI",
  },
  soundEnabled = true,
  onToggleSound,
  onQuitToHome,
}) {
  const currentQFormatted =
    currentQuestion < 10 ? `0${currentQuestion}` : `${currentQuestion}`;
  const totalQFormatted =
    totalQuestions < 10 ? `0${totalQuestions}` : `${totalQuestions}`;

  return (
    <header className="w-full max-w-5xl mx-auto flex flex-col gap-2 px-2 pt-1 pb-2 relative z-10">
      {/* Top Main Row */}
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left: Home Button & Question Number */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onQuitToHome}
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#4A1513] hover:bg-[#5E1A17] text-white transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center"
            title="Exit to Home"
            aria-label="Exit to Home"
          >
            <Home className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A1513] text-white shadow-xs">
            <Layers className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-black tracking-wide text-white font-mono">
              <span>{currentQFormatted}</span>
              <span className="text-white/80 mx-1.5">/</span>
              <span className="text-white/80">{totalQFormatted}</span>
            </span>
          </div>
        </div>

        {/* Center: Difficulty Pill Badge */}
        <div className="flex items-center">
          <span className="px-6 py-1.5 rounded-full bg-[#4A1513] text-white text-xs font-black uppercase tracking-wider shadow-xs">
            {difficulty}
          </span>
        </div>

        {/* Right: Score Display & Sound Toggle */}
        <div className="flex items-center gap-2.5">
          {gameMode === "self" && (
            <ScoreDisplay score={score} delta={scoreDelta} />
          )}

          <button
            onClick={onToggleSound}
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#4A1513] hover:bg-[#5E1A17] text-white transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center"
            title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
            aria-label={soundEnabled ? "Mute Sound" : "Unmute Sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-white" />
            ) : (
              <VolumeX className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mode-Specific Sub-Header Badges */}
      {gameMode === "team" && (
        <div className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl bg-white border-2 border-[#4A1513] shadow-xs">
          {/* Team 1 Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
              <span className="text-xs font-black truncate max-w-[130px]">
                {playerNames?.team1 || "Team 1"}
              </span>
            </div>
            <span className="font-mono font-black text-sm text-black shrink-0 ml-1">
              {teamScores.team1}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>

          <div className="text-[10px] font-black text-[#4A1513] uppercase tracking-widest px-1">
            VS
          </div>

          {/* Team 2 Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
              <span className="text-xs font-black truncate max-w-[130px]">
                {playerNames?.team2 || "Team 2"}
              </span>
            </div>
            <span className="font-mono font-black text-sm text-black shrink-0 ml-1">
              {teamScores.team2}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>
      )}

      {gameMode === "robot" && (
        <div className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl bg-white border-2 border-[#4A1513] shadow-xs">
          {/* User Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5 min-w-0">
              <User className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="text-xs font-black truncate max-w-[130px]">
                {playerNames?.player || "You"}
              </span>
            </div>
            <span className="font-mono font-black text-sm text-black shrink-0 ml-1">
              {userScore}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>

          <div className="text-[10px] font-black text-[#4A1513] uppercase tracking-wider px-2 flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 fill-[#4A1513] text-[#4A1513]" />
            Race to 10
          </div>

          {/* Robot Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5 min-w-0">
              <Bot className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span className="text-xs font-black truncate max-w-[130px]">
                {playerNames?.robot || "Robo AI"}
              </span>
            </div>
            <span className="font-mono font-black text-sm text-black shrink-0 ml-1">
              {robotScore}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
