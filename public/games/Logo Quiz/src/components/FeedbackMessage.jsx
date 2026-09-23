import React from "react";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

/**
 * Round Feedback Banner (Monochrome & High-Contrast Theme)
 */
export default function FeedbackMessage({
  isCorrect = false,
  isTimeout = false,
  correctBrand = "",
  scoreResult = { total: 0, base: 0, timeBonus: 0, penalty: 0 },
  gameMode = "self", // 'self' | 'team' | 'robot'
  activeTeam = 1,
  playerNames = {
    team1: "Team 1",
    team2: "Team 2",
    player: "Player 1",
    robot: "Robo AI",
  },
  nextDisabled = false,
  onNext,
  isLastQuestion = false,
}) {
  const teamName =
    activeTeam === 2
      ? playerNames?.team2 || "Team 2"
      : playerNames?.team1 || "Team 1";

  return (
    <div className="w-full max-w-xl mx-auto mt-3 sm:mt-4 animate-pop">
      <div
        className={`p-4 rounded-3xl border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ${
          isCorrect
            ? "bg-emerald-50 text-black ring-4 ring-emerald-500/10"
            : "bg-rose-50 text-black ring-4 ring-rose-500/10"
        }`}
      >
        {/* Left Side: Feedback Status & Points breakdown */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          {isCorrect ? (
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 border-2 border-black flex items-center justify-center shrink-0 text-white shadow-xs">
              <CheckCircle className="w-6 h-6" />
            </div>
          ) : isTimeout ? (
            <div className="w-11 h-11 rounded-2xl bg-amber-500 border-2 border-black flex items-center justify-center shrink-0 text-white shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-rose-600 border-2 border-black flex items-center justify-center shrink-0 text-white shadow-xs">
              <XCircle className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight text-black">
                {gameMode === "team"
                  ? isCorrect
                    ? `${teamName} Scored !`
                    : `Missed!`
                  : isCorrect
                    ? "Correct Answer!"
                    : isTimeout
                      ? "Time's Up!"
                      : "Incorrect!"}
              </h3>
              {/* {isCorrect && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-black text-white text-xs font-black shadow-xs">
                  <Zap className="w-3 h-3 fill-white" />
                  {gameMode === "team" ? "+1 Pt" : `+${scoreResult.total}`}
                </span>
              )} */}
            </div>

            {/* <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {isCorrect ? (
                <span>
                  {gameMode === "team"
                    ? `${teamName} gets 1 point towards 10!`
                    : `+${scoreResult.total} pts added to your score`}
                </span>
              ) : (
                <span>
                  Correct brand was{" "}
                  <strong className="text-black font-black underline">
                    {correctBrand}
                  </strong>
                </span>
              )}
            </p> */}
          </div>
        </div>

        {/* Right Side: Next Question Button */}
        <button
          onClick={onNext}
          disabled={nextDisabled}
          type="button"
          className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 group shrink-0 shadow-md border-2 border-black ${
            nextDisabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300"
              : "bg-black hover:bg-slate-900 text-white hover:shadow-xl active:scale-95 cursor-pointer"
          }`}
        >
          <span>
            {gameMode === "team"
              ? "Next Round"
              : isLastQuestion
                ? "View Results"
                : "Next Question"}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          {!nextDisabled && (
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded font-mono">
              Space
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
