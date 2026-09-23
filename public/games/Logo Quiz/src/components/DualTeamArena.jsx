import React from "react";
import LogoCard from "./LogoCard";
import Timer from "./Timer";
import { Zap, CheckCircle, XCircle } from "lucide-react";

export default function DualTeamArena({
  question,
  teamScores = { team1: 0, team2: 0 },
  firstResponder = null, // null | 'team1' | 'team2'
  team1Selected = null,
  team2Selected = null,
  team1Name = "Team 1",
  team2Name = "Team 2",
  isAnswered = false,
  onTeamSelectAnswer,
  timeRemaining = 15,
  maxTime = 15,
  isWarning = false,
}) {
  if (!question) return null;

  const team1Shortcuts = ["1", "2", "3", "4"];
  const team2Shortcuts = ["7", "8", "9", "0"];

  const isTeam1First = firstResponder === "team1";
  const isTeam2First = firstResponder === "team2";

  const isTeam1Correct =
    team1Selected &&
    team1Selected.toLowerCase() === question.brand.toLowerCase();
  const isTeam2Correct =
    team2Selected &&
    team2Selected.toLowerCase() === question.brand.toLowerCase();

  return (
    <div className="w-full max-w-5xl mx-auto my-2 animate-pop relative z-10">
      {/* Real-time Duel Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 mb-3 rounded-2xl bg-white border-2 border-black text-black shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
          <span className="text-xs font-black tracking-wider uppercase">
            {team1Name}:{" "}
            <strong className="font-mono text-sm">{teamScores.team1}</strong> /
            10
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Timer
            timeRemaining={timeRemaining}
            maxTime={maxTime}
            isWarning={isWarning}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-wider uppercase">
            {team2Name}:{" "}
            <strong className="font-mono text-sm">{teamScores.team2}</strong> /
            10
          </span>
          <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
        </div>
      </div>

      {/* Side-by-Side 2 Question Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ================= WINDOW 1: TEAM 1 (BLUE) ================= */}
        <div
          className={`p-4 sm:p-5 rounded-3xl bg-white border-2 border-black transition-all duration-300 shadow-md flex flex-col justify-between ${
            isTeam1First
              ? isTeam1Correct
                ? "ring-4 ring-emerald-500/30"
                : "ring-4 ring-rose-500/30"
              : isTeam2First
                ? "opacity-70"
                : ""
          }`}
        >
          <div>
            {/* Team 1 Header */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black border border-black shadow-xs">
                  T1
                </div>
                <div>
                  <h3 className="text-sm font-black text-black truncate max-w-[170px]">
                    {team1Name} (Blue)
                  </h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Keys: 1, 2, 3, 4
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              {isTeam1First ? (
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 text-white border border-black shadow-xs ${
                    isTeam1Correct ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                >
                  {isTeam1Correct ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {isTeam1Correct ? "First! +1 Pt" : "First (Missed)"}
                </span>
              ) : isTeam2First ? (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-slate-100 text-slate-500 border border-black">
                  {team2Name} was faster
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-black text-white border border-black animate-pulse">
                  ⚡ Ready to Buzz
                </span>
              )}
            </div>

            {/* Question Logo Box */}
            <div className="my-2">
              <LogoCard
                question={question}
                isAnswered={isAnswered}
                isCorrect={isTeam1Correct || (isTeam2First && isTeam2Correct)}
                hintActive={false}
              />
            </div>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {question.options.map((option, idx) => {
              const isSelected = team1Selected === option;
              const isCorrectBrand =
                option.toLowerCase() === question.brand.toLowerCase();

              let btnStyle =
                "bg-white hover:bg-slate-50 text-black border-2 border-black hover:shadow-md";

              if (isAnswered) {
                if (isCorrectBrand) {
                  btnStyle =
                    "bg-emerald-600 text-white border-2 border-black font-black shadow-md";
                } else if (isSelected) {
                  btnStyle =
                    "bg-rose-600 text-white border-2 border-black font-black shadow-md";
                } else {
                  btnStyle =
                    "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-60";
                }
              }

              return (
                <button
                  key={`t1-${option}`}
                  disabled={isAnswered}
                  onClick={() => onTeamSelectAnswer("team1", option)}
                  type="button"
                  className={`p-3 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-between shadow-xs ${btnStyle} ${
                    !isAnswered
                      ? "active:scale-95 cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  <span className="truncate mr-1">{option}</span>
                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-black/10 font-mono font-black">
                    {team1Shortcuts[idx]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= WINDOW 2: TEAM 2 (RED) ================= */}
        <div
          className={`p-4 sm:p-5 rounded-3xl bg-white border-2 border-black transition-all duration-300 shadow-md flex flex-col justify-between ${
            isTeam2First
              ? isTeam2Correct
                ? "ring-4 ring-emerald-500/30"
                : "ring-4 ring-rose-500/30"
              : isTeam1First
                ? "opacity-70"
                : ""
          }`}
        >
          <div>
            {/* Team 2 Header */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs font-black border border-black shadow-xs">
                  T2
                </div>
                <div>
                  <h3 className="text-sm font-black text-black truncate max-w-[170px]">
                    {team2Name} (Red)
                  </h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Keys: 7, 8, 9, 0
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              {isTeam2First ? (
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 text-white border border-black shadow-xs ${
                    isTeam2Correct ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                >
                  {isTeam2Correct ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {isTeam2Correct ? "First! +1 Pt" : "First (Missed)"}
                </span>
              ) : isTeam1First ? (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-slate-100 text-slate-500 border border-black">
                  {team1Name} was faster
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-black text-white border border-black animate-pulse">
                  ⚡ Ready to Buzz
                </span>
              )}
            </div>

            {/* Question Logo Box */}
            <div className="my-2">
              <LogoCard
                question={question}
                isAnswered={isAnswered}
                isCorrect={isTeam2Correct || (isTeam1First && isTeam1Correct)}
                hintActive={false}
              />
            </div>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {question.options.map((option, idx) => {
              const isSelected = team2Selected === option;
              const isCorrectBrand =
                option.toLowerCase() === question.brand.toLowerCase();

              let btnStyle =
                "bg-white hover:bg-slate-50 text-black border-2 border-black hover:shadow-md";

              if (isAnswered) {
                if (isCorrectBrand) {
                  btnStyle =
                    "bg-emerald-600 text-white border-2 border-black font-black shadow-md";
                } else if (isSelected) {
                  btnStyle =
                    "bg-rose-600 text-white border-2 border-black font-black shadow-md";
                } else {
                  btnStyle =
                    "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-60";
                }
              }

              return (
                <button
                  key={`t2-${option}`}
                  disabled={isAnswered}
                  onClick={() => onTeamSelectAnswer("team2", option)}
                  type="button"
                  className={`p-3 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-between shadow-xs ${btnStyle} ${
                    !isAnswered
                      ? "active:scale-95 cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  <span className="truncate mr-1">{option}</span>
                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-black/10 font-mono font-black">
                    {team2Shortcuts[idx]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
