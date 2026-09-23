import React from 'react';
import bgImg from '../assets/bg-img.png';
import logoBlackVertical from '../assets/nebuloid-logo.png';
import ColorWord from '../components/ColorWord';
import AnswerOptions from '../components/AnswerOptions';
import Feedback from '../components/Feedback';

export default function GameScreen({
  score = 0,
  round = 1,
  difficulty = 'EASY',
  stageNumber = 1,
  targetQuestions = 5,
  correctAnswers = 0,
  timeLeft,
  maxTime = 59,
  streak = 0,
  question,
  onSelectAnswer,
  feedback,
  isLocked = false,
  onQuitToLevels
}) {
  const progressPercent = Math.min(100, Math.round((correctAnswers / targetQuestions) * 100));

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 select-none overflow-x-hidden font-sans"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Darkening tint for high contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Visual Instant Feedback Alert */}
      <Feedback feedback={feedback} />

      {/* ================= TOP HEADER BRANDING: NEBULOID LOGO AT THE TOP ================= */}
      <div className="relative w-full max-w-5xl flex items-center justify-center z-20 pt-1 pb-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5">
          <img
            src={logoBlackVertical}
            alt="Nebuloid"
            className="h-15 w-auto object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* ================= MAIN GLASS CONTAINER ================= */}
      <div className="relative w-full max-w-5xl bg-white/20 backdrop-blur-md sm:backdrop-blur-lg rounded-3xl sm:rounded-[36px] border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-4 py-5 sm:px-8 sm:py-7 md:px-10 md:py-8 flex flex-col items-center justify-between z-10 animate-fade-in my-auto min-h-[520px]">
        
        {/* ================= TOP HUD ROW ================= */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4">
          
          {/* Left Pill: Level & Difficulty */}
          <div className="px-5 py-2 rounded-full border-2 border-white/90 bg-gradient-to-r from-[#173a87] via-[#15347d] to-[#122e6b] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-blue-950/40 shrink-0">
            LEVEL {stageNumber} - {difficulty}
          </div>

          {/* Center Wide Pill: Menu Button | Timer | Score */}
          <div className="flex-1 max-w-xl w-full flex items-center justify-between px-5 sm:px-7 py-2 rounded-full border-2 border-white/90 bg-gradient-to-r from-[#173a87] via-[#15347d] to-[#122e6b] text-white shadow-md shadow-blue-950/40">
            {/* Menu Button */}
            <button
              onClick={onQuitToLevels}
              className="flex items-center gap-1.5 font-black text-xs sm:text-sm tracking-wider uppercase hover:text-cyan-300 transition-colors cursor-pointer group"
              title="Return to stage select"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              <span>MENU</span>
            </button>

            {/* Prominent Timer */}
            <div className="flex items-center gap-1.5 font-mono font-black text-sm sm:text-base tracking-wider text-white">
              <span>⏱</span>
              <span className={timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}>
                {timeLeft}S
              </span>
            </div>

            {/* Score */}
            <div className="font-black text-xs sm:text-sm tracking-wider uppercase text-white">
              SCORE <span className="text-amber-300 font-mono text-sm sm:text-base">{score}</span>
            </div>
          </div>

          {/* Right Pill: Streak Counter */}
          <div className="px-5 py-2 rounded-full border-2 border-white/90 bg-gradient-to-r from-[#173a87] via-[#15347d] to-[#122e6b] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-blue-950/40 shrink-0">
            STREAK: <span className="text-cyan-300 font-mono">{streak}x</span>
          </div>
        </div>

        {/* ================= SUB-HUD: REACTION & HITS PROGRESS ================= */}
        <div className="w-full max-w-3xl flex flex-col gap-1.5 mb-2 px-1">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black uppercase tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
            <span>REACTION: <span className="text-cyan-300 font-mono">--</span></span>
            <span>HITS <span className="text-amber-300 font-mono">{correctAnswers}/{targetQuestions}</span></span>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-full h-3 sm:h-3.5 bg-white/20 border-2 border-white/80 rounded-full p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ================= MAIN QUESTION & OPTIONS AREA ================= */}
        <div className="w-full flex flex-col items-center justify-center my-auto py-2">
          {/* Stroop Word Hero Box with Warning Banner */}
          <ColorWord question={question} />

          {/* Color Answer Buttons */}
          <div className="w-full mt-3 sm:mt-5">
            <AnswerOptions
              options={question?.options || []}
              onSelectOption={onSelectAnswer}
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* Bottom hint / instruction footer */}
      <div className="relative z-10 pt-2 pb-1 text-center">
        <span className="text-[11px] font-bold text-white/85 tracking-wider uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
          Hit {targetQuestions} correct answers before time runs out!
        </span>
      </div>
    </div>
  );
}
