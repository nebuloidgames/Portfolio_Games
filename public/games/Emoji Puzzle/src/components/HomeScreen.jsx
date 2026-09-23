import React, { useState, useEffect } from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";
import bgImg from "../assets/bg-img.png";
import startImg from "../assets/start.png";
import { soundFx } from "../utils/audio";
import { getCertificatesHistory } from "../utils/storage";
import CertificateHistoryModal from "./CertificateHistoryModal";
import CertificateModal from "./CertificateModal";
import {
  FileBadge2,
  HelpCircle,
  Home,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const HomeScreen = ({ onStartGame, onExit, isMuted = false, onToggleMute }) => {
  const [activeModal, setActiveModal] = useState(null); // 'certificates' | 'howToPlay' | 'exit' | null
  const [certificatesHistory, setCertificatesHistory] = useState([]);
  const [selectedPreviewCert, setSelectedPreviewCert] = useState(null);
  const [testDemoAnswer, setTestDemoAnswer] = useState("");
  const [testDemoSuccess, setTestDemoSuccess] = useState(null);

  // Load certificate history on modal open or mount
  useEffect(() => {
    setCertificatesHistory(getCertificatesHistory());
  }, [activeModal]);

  // When user clicks START button -> directly open level select
  const handleStartPuzzleClick = () => {
    soundFx.playClick();
    onStartGame();
  };

  const handleButtonClick = (modalType) => {
    soundFx.playClick();
    if (modalType === "certificates") {
      setCertificatesHistory(getCertificatesHistory());
    }
    setActiveModal(modalType);
  };

  const handleDemoCheck = (e) => {
    e.preventDefault();
    if (testDemoAnswer.trim().toLowerCase() === "popcorn") {
      setTestDemoSuccess(true);
      soundFx.playCorrect();
    } else {
      setTestDemoSuccess(false);
      soundFx.playWrong();
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-4 sm:py-6 overflow-hidden select-none font-['Outfit',sans-serif]">
      {/* Background Image Layer */}
      <img
        src={bgImg}
        alt="Cinema Background"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none z-0"
      />

      {/* Subtle Dark Vignette & Cinema Ambiance Overlay */}
      <div className="absolute inset-0 bg-black/20 sm:bg-black/25 z-0 pointer-events-none" />

      {/* ========================================================== */}
      {/* TOP HEADER: NEBULOID TECH BRANDING & AUDIO TOGGLE */}
      {/* ========================================================== */}
      <header className="w-full max-w-6xl flex justify-between items-center z-30 px-2 sm:px-4 py-1 sm:py-2">
        {/* Nebuloid Studio Branding Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/45 backdrop-blur-md border border-white/20 shadow-lg hover:border-orange-400/60 transition-all duration-300">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Logo"
            className="h-6 sm:h-8 w-auto brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.24em] text-white uppercase font-['Plus_Jakarta_Sans',sans-serif]">
              NEBULOID TECH STUDIO LLP
            </span>
          </div>
        </div>

        {/* Sound Mute / Unmute Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            if (onToggleMute) onToggleMute();
          }}
          className="p-2.5 sm:p-3 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white/90 hover:text-orange-400 hover:border-orange-400/60 hover:bg-black/65 active:scale-95 transition-all cursor-pointer shadow-lg"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          )}
        </button>
      </header>

      {/* ========================================================== */}
      {/* MAIN CENTER: FROSTED GLASS CONTAINER (MATCHING IMAGE) */}
      {/* ========================================================== */}
      <div className="relative w-full max-w-4xl lg:max-w-6xl rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-black/35 backdrop-blur-md sm:backdrop-blur-lg border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.25)] p-6 sm:p-8 md:p-10 flex flex-col items-center justify-between z-20 my-auto transition-all">
        {/* 1. Header: WELCOME TO EMOJI PUZZLE */}
        <div className="text-center select-none pt-1 sm:pt-2">
          <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.45em] sm:tracking-[0.6em] text-white/90 uppercase font-['Outfit',sans-serif] drop-shadow-sm">
            W E L C O M E &nbsp; T O
          </p>
          <h1 className="font-[serif] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wider uppercase mt-1 sm:mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] leading-tight">
            EMOJI PUZZLE
          </h1>
        </div>

        {/* 2. Center: Circular Glowing START Button */}
        <div className="my-5 sm:my-7 md:my-9 flex items-center justify-center">
          <button
            onClick={handleStartPuzzleClick}
            onMouseEnter={() => soundFx.playHover()}
            className="group relative transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none rounded-full"
            aria-label="Start Game"
          >
            {/* Ambient Radial Orange Glow */}
            <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl group-hover:bg-orange-500/50 group-hover:blur-3xl transition-all duration-300 pointer-events-none" />

            {/* The Start Image Button */}
            <img
              src={startImg}
              alt="START"
              className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain filter drop-shadow-[0_0_25px_rgba(249,115,22,0.65)] group-hover:drop-shadow-[0_0_45px_rgba(249,115,22,0.95)] transition-all duration-300"
            />
          </button>
        </div>

        {/* 3. Bottom: Three Orange Pill Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 pb-1">
          {/* Button 1: How To Play */}
          <button
            onClick={() => handleButtonClick("howToPlay")}
            onMouseEnter={() => soundFx.playHover()}
            className="group flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316] hover:from-[#fb923c] hover:via-[#f97316] hover:to-[#ea580c] border border-amber-300/40 text-white font-bold text-xs sm:text-sm md:text-base tracking-wide shadow-[0_4px_15px_rgba(234,88,12,0.45)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.75)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/95 transition-transform group-hover:scale-110" />
            <span>How To Play</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* FOOTER: SUBTLE BRANDING & COPYRIGHT */}
      {/* ========================================================== */}
      <footer className="w-full text-center z-20 py-2">
        <p className="text-[10px] sm:text-xs tracking-wider text-white/60 font-medium flex items-center justify-center gap-2">
          <span>Nebuloid Tech Studio LLP</span>
          <span className="text-orange-400">•</span>
          <span>Guess • Solve • Achieve</span>
        </p>
      </footer>

      {/* ========================================================== */}
      {/* MODAL 2: HOW TO PLAY */}
      {/* ========================================================== */}
      {activeModal === "howToPlay" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900/95 border border-white/20 rounded-2xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 relative text-white">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-700/80 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-base tracking-wider uppercase text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  How To Play
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 p-2.5 bg-black/40 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white uppercase tracking-wide">
                    Select Difficulty & Level
                  </h5>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Choose from Easy, Medium, Hard, or Expert. Each difficulty
                    has 5 levels.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-black/40 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white uppercase tracking-wide">
                    Solve 2 Puzzles Per Level
                  </h5>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Combine the emoji hints to guess the movie, food, or phrase.
                    Complete both stages to clear the level!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-black/40 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white uppercase tracking-wide">
                    Earn Stars & Verified Certificate
                  </h5>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Upon completing a level, receive an official Nebuloid
                    Certificate of Completion with instant PDF download!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Interactive Mini-Demo */}
            <div className="p-3.5 bg-black/50 rounded-xl border border-orange-500/30 shadow-inner">
              <div className="text-[10px] font-bold tracking-widest text-orange-400 uppercase mb-1.5 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>TRY A QUICK EXAMPLE</span>
                <Sparkles className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-center gap-2 text-2xl my-2 font-bold select-none">
                <span>🍿</span>
                <span>+</span>
                <span>🌽</span>
                <span>=</span>
                <span className="text-base font-black text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded-lg border border-orange-500/40">
                  ?
                </span>
              </div>
              <form onSubmit={handleDemoCheck} className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={testDemoAnswer}
                  onChange={(e) => setTestDemoAnswer(e.target.value)}
                  placeholder="Type answer (e.g. popcorn)..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Test
                </button>
              </form>
              {testDemoSuccess === true && (
                <div className="text-[11px] font-bold text-emerald-400 mt-2 text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct! You are
                  ready to play.
                </div>
              )}
              {testDemoSuccess === false && (
                <div className="text-[11px] font-bold text-rose-400 mt-2 text-center">
                  Try typing "popcorn"!
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal(null);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-lg hover:shadow-orange-500/40 cursor-pointer transition-all active:scale-98"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomeScreen;
