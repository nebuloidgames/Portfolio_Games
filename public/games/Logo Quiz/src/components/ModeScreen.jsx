import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Backpack, BookOpen, Rocket, Sparkles } from 'lucide-react';
import startBottomImg from '../assets/start-bottom.png';
import TopLogoBanner from './TopLogoBanner';

/**
 * ModeScreen matching the reference image:
 * - Top logo banner: TopLogoBanner with nebuloid-logo.png and background over start-bottom.png
 * - Bottom logo banner: start-bottom.png anchored to bottom edge
 * - Cream background (#FEF5E6)
 * - 3 Cards side-by-side: SELF MODE, TEAM VS TEAM, VS ROBOT
 */
export default function ModeScreen({
  difficulty = 'easy',
  onSelectMode,
  onBack,
  soundEnabled = true,
  onToggleSound,
}) {
  const modes = [
    {
      id: 'self',
      titleLine1: 'SELF',
      titleLine2: 'MODE',
      description: 'Build Strong Basics And Boost Your Confidence.',
      icon: (
        <Backpack className="w-8 h-8 sm:w-9 sm:h-9 text-[#FBD62D] drop-shadow-sm" />
      ),
    },
    {
      id: 'team',
      titleLine1: 'TEAM VS',
      titleLine2: 'TEAM',
      description: 'Perfect For Little Learners To Start Their Journey.',
      icon: (
        <div className="relative flex items-center justify-center">
          <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 text-[#FBD62D] drop-shadow-sm" />
          <Sparkles className="w-3.5 h-3.5 text-[#FBD62D] absolute -top-1.5 -right-1" />
        </div>
      ),
    },
    {
      id: 'robot',
      titleLine1: 'VS',
      titleLine2: 'ROBOT',
      description: 'For Players Ready For Intense And Exciting Challenges.',
      icon: (
        <Rocket className="w-8 h-8 sm:w-9 sm:h-9 text-[#FBD62D] drop-shadow-sm rotate-45" />
      ),
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#FEF5E6] text-black flex flex-col justify-between items-center overflow-hidden select-none">
      
      {/* ================= TOP LOGO BANNER WITH NEBULOID LOGO ================= */}
      <TopLogoBanner />

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-2 z-20 relative my-auto">
        
        {/* Navigation Bar (Back, Level & Sound Buttons) */}
        <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-2 sm:mb-4">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-2 py-2 px-5 rounded-full bg-[#501010] hover:bg-[#681818] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-xs font-bold px-4 py-2 rounded-full bg-[#501010]/15 text-[#501010] border border-[#501010]/30 uppercase tracking-wider">
              LEVEL: <strong className="ml-1 uppercase">{difficulty}</strong>
            </span>

            <button
              onClick={onToggleSound}
              type="button"
              className="flex items-center gap-2 py-2 px-5 rounded-full bg-[#501010] hover:bg-[#681818] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>
          </div>
        </div>

        {/* Title Header */}
        <h1 className="font-logo-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#4A1513] title-3d-shadow tracking-tight text-center leading-none mt-1 mb-6 sm:mb-8 md:mb-10">
          CHOOSE MODE
        </h1>

        {/* 3 Mode Option Cards */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 md:gap-6 max-w-4xl px-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              type="button"
              className="group relative w-full sm:w-56 md:w-64 h-[240px] sm:h-[280px] md:h-[300px] rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-xl hover:shadow-2xl text-center focus:outline-none"
              style={{
                background: 'linear-gradient(180deg, #BA7228 0%, #9C5220 38%, #682615 75%, #4A150D 100%)',
                border: '2px solid rgba(255, 235, 200, 0.45)',
                boxShadow: '0 12px 28px rgba(78, 17, 18, 0.35), 0 4px 10px rgba(78, 17, 18, 0.2)',
              }}
            >
              {/* Circular Icon Badge */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#FBD62D]/70 bg-radial from-[#FBD62D]/25 to-black/20 backdrop-blur-xs flex items-center justify-center mt-1 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {mode.icon}
              </div>

              {/* Middle Section: 2-line Title & Subtitle */}
              <div className="flex flex-col items-center justify-center my-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide uppercase transition-transform group-hover:scale-105 duration-200 leading-tight">
                  <span>{mode.titleLine1}</span>
                  <br />
                  <span>{mode.titleLine2}</span>
                </h2>

                <p className="text-xs sm:text-[13px] text-white/95 font-medium leading-relaxed max-w-[190px] mx-auto mt-2 text-center">
                  {mode.description}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>

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
