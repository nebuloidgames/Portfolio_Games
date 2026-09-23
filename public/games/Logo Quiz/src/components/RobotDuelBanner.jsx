import React from 'react';
import { Bot, CheckCircle, XCircle, Zap, Cpu, Sparkles, Clock } from 'lucide-react';

/**
 * Robot Duel Status & 5s Countdown Banner (Light Modern Theme)
 */
export default function RobotDuelBanner({
  robotState = {
    status: 'idle', // 'idle' | 'thinking' | 'answered'
    countdown: 5,
    robotAnswer: null,
    robotCorrect: false,
    userScore: 0,
    robotScore: 0,
  },
  userAnswered = false,
  correctBrand = '',
}) {
  const { status, countdown, robotAnswer, robotCorrect, userScore, robotScore } = robotState;

  // Percentage for the 5-second countdown progress bar
  // countdown goes 5 -> 0
  const progressPercent = Math.max(0, Math.min(100, ((5 - countdown) / 5) * 100));

  return (
    <div className="w-full max-w-xl mx-auto my-2 animate-pop">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-purple-200 shadow-md relative overflow-hidden">
        {/* Subtle purple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-indigo-50/30 to-purple-50/50 pointer-events-none" />

        <div className="relative z-10">
          {/* Header Row: User vs Robot Score Comparison */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                You: <strong className="text-indigo-600 font-mono text-sm">{userScore}</strong> / 10
              </span>
            </div>

            <div className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider border border-purple-200">
              Target 10 Points
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Robot: <strong className="text-purple-600 font-mono text-sm">{robotScore}</strong> / 10
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            </div>
          </div>

          {/* Body State */}
          {status === 'idle' && (
            <div className="flex items-center justify-between gap-3 text-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">
                  {userAnswered ? 'Robot is preparing...' : 'Your turn: Select your answer first!'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium font-mono">
                Robot answers in 5s
              </span>
            </div>
          )}

          {status === 'thinking' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center animate-bounce shadow-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>Robot is analyzing the logo...</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                    </h4>
                    <p className="text-[11px] font-semibold text-purple-700">
                      Processing visual brand signatures
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 border border-purple-300 text-purple-900 font-mono font-black text-xs shrink-0">
                  <Clock className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                  <span>{countdown}s</span>
                </div>
              </div>

              {/* 5s Countdown Progress bar */}
              <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden border border-purple-200">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {status === 'answered' && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                    robotCorrect ? 'bg-emerald-600' : 'bg-rose-500'
                  }`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      Robot chose: <strong className="underline decoration-purple-400">{robotAnswer}</strong>
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-black text-white ${
                        robotCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {robotCorrect ? '+1 Pt (Correct)' : 'Wrong'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {robotCorrect
                      ? '🤖 Robot identified the brand accurately!'
                      : `🤖 Robot missed it! Brand was ${correctBrand}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
