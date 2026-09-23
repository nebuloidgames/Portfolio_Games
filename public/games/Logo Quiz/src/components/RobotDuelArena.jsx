import React from "react";
import LogoCard from "./LogoCard";
import Timer from "./Timer";
import { Bot, User, Zap, CheckCircle, XCircle, Clock, Cpu } from "lucide-react";

/**
 * Robot Duel Arena: Window 1 (User) + Window 2 (Robot AI) with 5s countdown (Monochrome Theme)
 */
export default function RobotDuelArena({
  question,
  userScore = 0,
  robotScore = 0,
  robotCountdown = 5,
  playerName = "You",
  robotName = "Robo AI",
  firstResponder = null, // null | 'user' | 'robot'
  userSelected = null,
  robotAnswer = null,
  robotCorrect = false,
  isAnswered = false,
  onUserSelectAnswer,
  timeRemaining = 15,
  maxTime = 15,
  isWarning = false,
}) {
  if (!question) return null;

  const userShortcuts = ["1", "2", "3", "4"];

  const isUserFirst = firstResponder === "user";
  const isRobotFirst = firstResponder === "robot";

  const isUserCorrect =
    userSelected && userSelected.toLowerCase() === question.brand.toLowerCase();

  const progressPercent = Math.max(
    0,
    Math.min(100, ((5 - robotCountdown) / 5) * 100),
  );

  return (
    <div className="w-full max-w-5xl mx-auto my-2 animate-pop relative z-10">
      {/* Real-time Duel Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 mb-3 rounded-2xl bg-white border-2 border-black text-black shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
          <span className="text-xs font-black tracking-wider uppercase">
            {playerName}: <strong className="font-mono text-sm">{userScore}</strong> / 10
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
            {robotName}: <strong className="font-mono text-sm">{robotScore}</strong> /
            10
          </span>
          <span className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
        </div>
      </div>

      {/* Side-by-Side 2 Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ================= WINDOW 1: USER QUESTION WINDOW ================= */}
        <div
          className={`p-4 sm:p-5 rounded-3xl bg-white border-2 border-black transition-all duration-300 shadow-md flex flex-col justify-between ${
            isUserFirst
              ? isUserCorrect
                ? "ring-4 ring-emerald-500/30"
                : "ring-4 ring-rose-500/30"
              : isRobotFirst
                ? "opacity-75"
                : ""
          }`}
        >
          <div>
            {/* User Header */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center text-xs font-black border border-black shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black truncate max-w-[170px]">
                    {playerName} (Your Window)
                  </h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Answer before Robot scans!
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              {isUserFirst ? (
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 text-white border border-black shadow-xs ${
                    isUserCorrect ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                >
                  {isUserCorrect ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {isUserCorrect ? "Faster! +1 Pt" : "First (Missed)"}
                </span>
              ) : isRobotFirst ? (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-slate-100 text-slate-500 border border-black">
                  {robotName} was faster!
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-black text-white border border-black animate-pulse">
                  ⚡ Click or 1-4
                </span>
              )}
            </div>

            {/* Question Logo Box */}
            <div className="my-2">
              <LogoCard
                question={question}
                isAnswered={isAnswered}
                isCorrect={isUserCorrect || (isRobotFirst && robotCorrect)}
                hintActive={false}
              />
            </div>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {question.options.map((option, idx) => {
              const isSelected = userSelected === option;
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
                  key={`user-${option}`}
                  disabled={isAnswered}
                  onClick={() => onUserSelectAnswer(option)}
                  type="button"
                  className={`p-3 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-between shadow-xs ${btnStyle} ${
                    !isAnswered
                      ? "active:scale-95 cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  <span className="truncate mr-1">{option}</span>
                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-black/10 font-mono font-black">
                    {userShortcuts[idx]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= WINDOW 2: ROBOT MODE WINDOW ================= */}
        <div
          className={`p-4 sm:p-5 rounded-3xl bg-white border-2 border-black transition-all duration-300 shadow-md flex flex-col justify-between ${
            isRobotFirst
              ? robotCorrect
                ? "ring-4 ring-purple-500/30"
                : "ring-4 ring-rose-500/30"
              : isUserFirst
                ? "opacity-75"
                : ""
          }`}
        >
          <div>
            {/* Robot Header */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black border border-black shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black">
                    Robot Mode Window
                  </h3>
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
                    RoboAI Decision Engine
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              {isRobotFirst ? (
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 text-white border border-black shadow-xs ${
                    robotCorrect ? "bg-purple-600" : "bg-rose-600"
                  }`}
                >
                  {robotCorrect ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {robotCorrect ? "Robot First! +1 Pt" : "Robot First (Missed)"}
                </span>
              ) : isUserFirst ? (
                <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-slate-100 text-slate-500 border border-black">
                  {playerName} was faster!
                </span>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-black text-white font-mono font-black text-xs border border-black">
                  <Clock className={`w-3 h-3 text-amber-400 ${timeRemaining <= 6 ? 'animate-spin' : ''}`} />
                  <span>{timeRemaining > 6 ? 'Idle' : `${robotCountdown}s`}</span>
                </div>
              )}
            </div>

            {/* Robot AI Visual State Box */}
            <div className="my-2 p-4 rounded-2xl bg-slate-900 text-white border-2 border-black flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[175px]">
              {!isAnswered ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-400 mb-2 relative">
                    <Cpu className="w-7 h-7 animate-pulse" />
                    <span className="absolute inset-0 rounded-2xl border-2 border-purple-400 animate-ping opacity-25" />
                  </div>

                  <h4 className="text-xs font-black tracking-wide text-purple-300 uppercase">
                    {timeRemaining > 6
                      ? "Robot is Idle... Waiting"
                      : "Robot is Analyzing Logo..."}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {robotCountdown > 0 ? (
                      <>
                        Robot scanning... answers in{" "}
                        <strong className="text-white font-mono">
                          {robotCountdown}s
                        </strong>
                      </>
                    ) : timeRemaining > 6 ? (
                      <>
                        Robot idle — starts scanning at{" "}
                        <strong className="text-white font-mono">10s</strong>
                      </>
                    ) : (
                      <>
                        Waiting for timer...
                      </>
                    )}
                  </p>

                  {/* 5s Countdown Progress bar */}
                  <div className="w-full max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700 mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-200 ease-linear rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </>
              ) : isRobotFirst ? (
                <>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg border border-white/20 ${
                      robotCorrect ? "bg-purple-600" : "bg-rose-600"
                    }`}
                  >
                    <Bot className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-white">
                    Robot Answered First!
                  </h4>
                  <p className="text-xs font-bold text-purple-300 mt-1">
                    Robot chose:{" "}
                    <strong className="underline text-white">
                      {robotAnswer}
                    </strong>
                  </p>
                  <span
                    className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      robotCorrect
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {robotCorrect
                      ? "+1 Point Awarded to Robot"
                      : "0 Points (Incorrect Answer)"}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
                    <Bot className="w-7 h-7 opacity-50" />
                  </div>
                  <h4 className="text-xs font-black tracking-wide text-slate-400 uppercase">
                    User Answered Faster!
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Robot analysis was interrupted by user.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Robot Options Preview List */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {question.options.map((option) => {
              const isRobotPick = robotAnswer === option && isRobotFirst;
              const isCorrectBrand =
                option.toLowerCase() === question.brand.toLowerCase();

              let pillStyle = "bg-white border-2 border-black text-black";

              if (isAnswered) {
                if (isCorrectBrand) {
                  pillStyle =
                    "bg-emerald-600 text-white border-2 border-black font-black";
                } else if (isRobotPick) {
                  pillStyle =
                    "bg-rose-600 text-white border-2 border-black font-black";
                } else {
                  pillStyle =
                    "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-60";
                }
              }

              return (
                <div
                  key={`robot-${option}`}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-between shadow-xs ${pillStyle}`}
                >
                  <span className="truncate mr-1">{option}</span>
                  {isRobotPick && (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-black text-white font-mono font-black flex items-center gap-0.5">
                      <Bot className="w-2.5 h-2.5" /> Bot
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
