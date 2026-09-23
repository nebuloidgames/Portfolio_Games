import React, { useState, useRef, useEffect } from 'react';
import bgImg from '../assets/bg-img.png';
import logoBlackVertical from '../assets/nebuloid-logo.png';
import { calculateAccuracy, saveCertificate, getHonorTitle, downloadCertificatePNG } from '../utils/gameUtils';
import { sounds } from '../utils/soundEffects';

export default function GameOverScreen({
  playerName = 'Champion',
  isVictory = false,
  stageNumber = 1,
  difficulty = 'EASY',
  targetQuestions = 5,
  score = 0,
  correctAnswers = 0,
  wrongAnswers = 0,
  bestStreak = 0,
  isNewBestScore = false,
  bestScore = 0,
  nextStageAvailable = false,
  onPlayNextStage,
  onPlayAgain,
  onBackToLevels,
  onBackToHome
}) {
  const accuracy = calculateAccuracy(correctAnswers, wrongAnswers);

  // Certificate State - Auto-opens on Victory!
  const [showCertificate, setShowCertificate] = useState(isVictory);
  const [customName, setCustomName] = useState(playerName || 'Champion');
  const [theme, setTheme] = useState('royal'); // 'royal' | 'cyber' | 'emerald'
  const [honorTitle, setHonorTitle] = useState(() => getHonorTitle(accuracy, score));
  const [copiedToast, setCopiedToast] = useState(false);

  // Unique Certificate Serial Number
  const [certSerial] = useState(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `NEB-CC-S0${stageNumber}-${timestamp}-${rand}`;
  });

  const confettiCanvasRef = useRef(null);
  const certificateFrameRef = useRef(null);

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate stars earned (1-3)
  const starsEarned = wrongAnswers === 0 ? 3 : wrongAnswers <= 2 ? 2 : 1;

  // On mount: play fanfare & auto-save certificate if victory
  useEffect(() => {
    if (isVictory) {
      sounds.playFanfare();

      // Persist certificate to local storage
      saveCertificate({
        id: certSerial,
        playerName: customName,
        difficulty,
        stageNumber,
        score,
        accuracy,
        bestStreak,
        stars: starsEarned,
        honorTitle,
        theme,
        issueDate,
        timestamp: Date.now()
      });
    }
  }, [isVictory]);

  // Update saved certificate when customName, honorTitle, or theme changes
  useEffect(() => {
    if (isVictory) {
      saveCertificate({
        id: certSerial,
        playerName: customName,
        difficulty,
        stageNumber,
        score,
        accuracy,
        bestStreak,
        stars: starsEarned,
        honorTitle,
        theme,
        issueDate,
        timestamp: Date.now()
      });
    }
  }, [customName, honorTitle, theme, isVictory]);

  // Procedural Confetti Effect when Certificate is visible
  useEffect(() => {
    if (!isVictory || !showCertificate) return;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate confetti particles
    const confettiColors = [
      '#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6',
      '#06b6d4', '#eab308', '#ef4444', '#14b8a6', '#ffffff'
    ];
    const particles = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * 100,
      size: Math.random() * 8 + 5,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedX: (Math.random() - 0.5) * 4,
      speedY: Math.random() * 3.5 + 2.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1
    }));

    let startTime = Date.now();

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Fade after 3.5 seconds
        if (elapsed > 3500) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (elapsed < 6000 && particles.some((p) => p.opacity > 0.01)) {
        animId = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVictory, showCertificate]);

  // ================= HIGH-RESOLUTION CANVAS EXPORT (1200x800 PNG) =================
  const handleDownloadCertificate = () => {
    sounds.playClick();
    downloadCertificatePNG({
      playerName: customName,
      difficulty,
      stageNumber,
      score,
      accuracy,
      bestStreak,
      stars: starsEarned,
      honorTitle,
      theme,
      id: certSerial,
      issueDate
    });
  };

  // ================= SOCIAL SHARE & COPY ACHIEVEMENT =================
  const handleShare = async () => {
    sounds.playClick();
    const shareText = `🏆 Color Clash Certificate of Achievement!\n\nPlayer: ${customName}\nRank: ${honorTitle}\nLevel: Stage 0${stageNumber} (${difficulty})\nScore: ${score} PTS | Accuracy: ${accuracy}%\nCertificate ID: ${certSerial}\n\nCan you beat my speed?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Color Clash Winner Certificate',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        // User cancelled or fallback
      }
    }

    // Fallback: Copy to Clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      alert('Certificate details ready! You can take a screenshot or download PNG.');
    }
  };

  // Print Certificate Directly
  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  // Theme-based CSS classes for the Preview Card
  const themeCardStyles = {
    royal: {
      outer: 'bg-gradient-to-b from-amber-50/95 via-white to-amber-50/70 border-4 border-blue-900 shadow-2xl',
      inner: 'border-2 border-amber-400/80',
      title: 'text-blue-950',
      name: 'text-blue-900',
      badge: 'bg-amber-400 text-slate-950 border border-amber-500',
      statsBox: 'bg-white border border-neutral-300 text-neutral-800 shadow-xs'
    },
    cyber: {
      outer: 'bg-gradient-to-b from-slate-950 via-[#0a1128] to-slate-900 border-4 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.35)]',
      inner: 'border-2 border-cyan-500/40',
      title: 'text-cyan-300',
      name: 'text-cyan-400',
      badge: 'bg-cyan-500 text-slate-950 border border-cyan-300',
      statsBox: 'bg-slate-900/90 border border-cyan-500/30 text-slate-100 shadow-inner'
    },
    emerald: {
      outer: 'bg-gradient-to-b from-emerald-50/95 via-white to-teal-50/80 border-4 border-emerald-800 shadow-2xl',
      inner: 'border-2 border-emerald-600/50',
      title: 'text-emerald-950',
      name: 'text-emerald-800',
      badge: 'bg-emerald-600 text-white border border-emerald-700',
      statsBox: 'bg-white border border-emerald-200 text-neutral-800 shadow-xs'
    }
  };

  const currentStyle = themeCardStyles[theme] || themeCardStyles.royal;

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 select-none overflow-x-hidden font-sans"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Darkening tint */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Confetti Overlay Canvas */}
      {isVictory && showCertificate && (
        <canvas
          ref={confettiCanvasRef}
          className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        />
      )}

      {/* Print Specific CSS to isolate Certificate Card */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ================= TOP BRANDING: NEBULOID LOGO AT TOP ================= */}
      <div className="relative w-full max-w-5xl flex items-center justify-center z-20 pt-1 pb-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5">
          <img
            src={logoBlackVertical}
            alt="Nebuloid"
            className="h-15 w-auto object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* ================= MAIN RESULT CARD ================= */}
      <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-xl sm:backdrop-blur-2xl rounded-3xl sm:rounded-[36px] border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-5 py-6 sm:px-10 sm:py-8 flex flex-col items-center text-center z-10 animate-fade-in my-auto">
        {/* Status Badge */}
        {isVictory ? (
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white text-xs sm:text-sm font-black tracking-widest uppercase mb-3 shadow-lg animate-bounce">
            <span>🏆</span>
            <span>STAGE 0{stageNumber} CLEARED!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black tracking-widest uppercase mb-3 shadow-md">
            <span>✕</span>
            <span>STAGE 0{stageNumber} FAILED</span>
          </div>
        )}

        {/* Player Name Greeting */}
        <div className="text-xs font-extrabold tracking-wider uppercase text-neutral-500 mb-1">
          Player: <span className="text-black font-black">{customName}</span>
        </div>

        {/* Score Callout */}
        <h2 className="text-5xl sm:text-6xl font-black text-black tracking-tight mb-1">
          {score}
          <span className="text-base sm:text-lg text-neutral-500 font-extrabold ml-1.5">PTS</span>
        </h2>

        {/* Message */}
        <p className="text-xs text-neutral-600 font-bold uppercase tracking-wider mb-5">
          {isVictory ? (
            nextStageAvailable ? (
              <span className="text-emerald-700 font-black">
                🎉 Next stage unlocked: Stage 0{stageNumber + 1}!
              </span>
            ) : (
              <span className="text-blue-900 font-black">
                👑 All stages cleared in {difficulty} level!
              </span>
            )
          ) : (
            <span>Target was {targetQuestions} questions • Try again!</span>
          )}
        </p>

        {/* Stats Grid */}
        <div className="w-full bg-neutral-50/90 border-2 border-black/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            {/* Correct Answers */}
            <div className="flex flex-col items-center p-2.5 bg-white rounded-xl border border-neutral-300 shadow-xs">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Correct
              </span>
              <span className="text-xl font-black text-emerald-600 mt-0.5">
                ✓ {correctAnswers}
              </span>
            </div>

            {/* Mistakes */}
            <div className="flex flex-col items-center p-2.5 bg-white rounded-xl border border-neutral-300 shadow-xs">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Mistakes
              </span>
              <span className="text-xl font-black text-rose-600 mt-0.5">
                ✕ {wrongAnswers}
              </span>
            </div>

            {/* Best Streak */}
            <div className="flex flex-col items-center p-2.5 bg-white rounded-xl border border-neutral-300 shadow-xs">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Best Streak
              </span>
              <span className="text-xl font-black text-amber-600 mt-0.5">
                🔥 {bestStreak}
              </span>
            </div>

            {/* Accuracy */}
            <div className="flex flex-col items-center p-2.5 bg-white rounded-xl border border-neutral-300 shadow-xs">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Accuracy
              </span>
              <span className="text-xl font-black text-black mt-0.5">
                {accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* ================= CERTIFICATE CLAIM BUTTON (ON VICTORY) ================= */}
        {isVictory && (
          <button
            onClick={() => {
              sounds.playClick();
              setShowCertificate(true);
            }}
            className="w-full relative flex items-center justify-center py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-150 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-2 border-amber-300 mb-3"
          >
            <span>🏆 VIEW & CUSTOMIZE CERTIFICATE</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Next Stage Button */}
          {isVictory && nextStageAvailable && (
            <button
              onClick={onPlayNextStage}
              className="w-full relative flex items-center justify-center py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              <span>NEXT STAGE (S-{stageNumber + 1}) ▶</span>
            </button>
          )}

          {/* Replay Button */}
          <button
            onClick={onPlayAgain}
            className={`w-full relative flex items-center justify-center py-3 px-6 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 cursor-pointer ${
              !isVictory || !nextStageAvailable
                ? 'bg-black hover:bg-neutral-800 text-white shadow-md'
                : 'bg-white hover:bg-neutral-100 text-black border-2 border-black/80'
            }`}
          >
            <span>🔄 REPLAY STAGE</span>
          </button>

          {/* Level Select Button */}
          <button
            onClick={onBackToLevels}
            className="w-full relative flex items-center justify-center py-3 px-6 rounded-xl bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 border-2 border-black/80 shadow-xs cursor-pointer"
          >
            <span>☰ LEVEL SELECT</span>
          </button>

          {/* Home Button */}
          <button
            onClick={onBackToHome}
            className="w-full relative flex items-center justify-center py-2 px-6 rounded-xl text-neutral-600 hover:text-black font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            <span>Main Menu</span>
          </button>
        </div>
      </div>

      {/* ================= CERTIFICATE GENERATOR MODAL ================= */}
      {showCertificate && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fade-in overflow-y-auto"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 text-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-4 sm:p-6 md:p-7 border border-white/20 overflow-hidden my-auto max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0 no-print">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                    WINNER CERTIFICATE GENERATOR
                  </h3>
                  <span className="text-[10px] font-bold text-cyan-300 block">
                    Certified • Verified • High-Resolution PNG & Print Ready
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCertificate(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                title="Close to view stage stats"
              >
                ✕
              </button>
            </div>

            {/* Customization Controls: Name, Honor Title & Themes */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 mb-4 shrink-0 no-print">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Name Input */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Player Name (Editable)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    maxLength={25}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter Certificate Name"
                    className="w-full bg-black/50 border border-white/20 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* 2. Honor Title Selector */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Honor Title Badge
                  </label>
                  <select
                    value={honorTitle}
                    onChange={(e) => setHonorTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="GRANDMASTER VIRTUOSO">★ Grandmaster Virtuoso</option>
                    <option value="PERFECT STROOP MASTER">★ Perfect Stroop Master</option>
                    <option value="MASTER OF FOCUS & SPEED">★ Master of Focus & Speed</option>
                    <option value="AGILE COLOR STRATEGIST">★ Agile Color Strategist</option>
                    <option value="HIGH-OCTANE CHAMPION">★ High-Octane Champion</option>
                    <option value="COLOR CLASH CONQUEROR">★ Color Clash Conqueror</option>
                  </select>
                </div>

                {/* 3. Theme Selector */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Certificate Theme
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'royal', label: '👑 Royal Gold', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                      { id: 'cyber', label: '🌌 Cyber Neon', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
                      { id: 'emerald', label: '🌿 Emerald', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          sounds.playClick();
                          setTheme(t.id);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          theme === t.id
                            ? `${t.bg} ring-2 ring-white/50 font-black`
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= LIVE CERTIFICATE PREVIEW CARD ================= */}
            <div className="overflow-y-auto flex-1 pr-1 pb-2">
              <div
                id="printable-certificate"
                ref={certificateFrameRef}
                className={`relative w-full rounded-2xl p-4 sm:p-8 text-center transition-all ${currentStyle.outer}`}
              >
                {/* Decorative Inner Border */}
                <div className={`rounded-xl p-4 sm:p-6 ${currentStyle.inner}`}>
                  
                  {/* Top Header Crest */}
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <span className="text-xl">🎖️</span>
                    <span className="text-[10px] sm:text-[11px] font-black tracking-[0.3em] uppercase text-neutral-500">
                      NEBULOID GAMES OFFICIAL MERIT RECOGNITION
                    </span>
                    <span className="text-xl">🎖️</span>
                  </div>

                  {/* Main Title */}
                  <h3 className={`text-xl sm:text-3xl font-black tracking-wide uppercase mt-1 mb-1.5 ${currentStyle.title}`}>
                    Certificate of Achievement
                  </h3>

                  {/* Honor Title Pill */}
                  <div className="inline-block my-1.5">
                    <span className={`text-[10px] sm:text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-xs ${currentStyle.badge}`}>
                      ★ {honorTitle} ★
                    </span>
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mt-2 mb-1">
                    This prestigious honor is proudly presented to
                  </p>

                  {/* Player Name */}
                  <h2 className={`text-2xl sm:text-4xl font-black tracking-wider uppercase my-2 drop-shadow-xs ${currentStyle.name}`}>
                    {customName || 'CHAMPION'}
                  </h2>

                  <div className="w-48 h-0.5 bg-neutral-300 mx-auto mb-3" />

                  {/* Achievement Text */}
                  <p className="text-xs sm:text-sm text-neutral-700 font-medium max-w-lg mx-auto leading-relaxed my-2">
                    For demonstrating exceptional cognitive focus, reaction speed, and accuracy in conquering{' '}
                    <b className="font-bold">Color Clash — {difficulty} Mode (Stage 0{stageNumber})</b>.
                  </p>

                  {/* Performance Stats Pill Grid */}
                  <div className="grid grid-cols-4 gap-2 my-4 max-w-md mx-auto">
                    <div className={`p-2 rounded-xl text-center ${currentStyle.statsBox}`}>
                      <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">Score</span>
                      <span className="text-sm sm:text-base font-black text-black">{score} <span className="text-[9px]">PTS</span></span>
                    </div>
                    <div className={`p-2 rounded-xl text-center ${currentStyle.statsBox}`}>
                      <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">Accuracy</span>
                      <span className="text-sm sm:text-base font-black text-emerald-600">{accuracy}%</span>
                    </div>
                    <div className={`p-2 rounded-xl text-center ${currentStyle.statsBox}`}>
                      <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">Streak</span>
                      <span className="text-sm sm:text-base font-black text-amber-600">{bestStreak}x</span>
                    </div>
                    <div className={`p-2 rounded-xl text-center ${currentStyle.statsBox}`}>
                      <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">Stars</span>
                      <span className="text-sm sm:text-base font-black text-amber-500">
                        {'★'.repeat(starsEarned)}{'☆'.repeat(3 - starsEarned)}
                      </span>
                    </div>
                  </div>

                  {/* Date, Serial & Seal */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 mt-4 text-left text-[11px]">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">
                        Issue Date: <b className="text-neutral-700 font-bold">{issueDate}</b>
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 block mt-0.5">
                        ID: {certSerial}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 block">
                        Official Verification Seal
                      </span>
                      <span className="text-[11px] font-black text-blue-950 flex items-center justify-end gap-1">
                        <span>✓</span> VERIFIED BY NEBULOID
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= ACTION TOOLBAR ================= */}
            <div className="pt-3 border-t border-white/10 mt-2 flex flex-col sm:flex-row items-center gap-2.5 shrink-0 no-print">
              {/* Download PNG */}
              <button
                onClick={handleDownloadCertificate}
                className="flex-1 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>📥</span>
                <span>DOWNLOAD PNG (1200x800)</span>
              </button>

              {/* Print / PDF */}
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🖨️</span>
                <span>PRINT / PDF</span>
              </button>

              {/* Share / Copy */}
              <button
                onClick={handleShare}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔗</span>
                <span>SHARE</span>
              </button>

              {/* Close / Next Stage */}
              {nextStageAvailable ? (
                <button
                  onClick={() => {
                    setShowCertificate(false);
                    onPlayNextStage();
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>NEXT ▶</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowCertificate(false)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer"
                >
                  <span>DONE</span>
                </button>
              )}
            </div>

            {/* Copied Toast Alert */}
            {copiedToast && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-fade-in flex items-center gap-2 z-50">
                <span>✓</span>
                <span>Achievement summary copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 pt-2 pb-1 text-center">
        <span className="text-[11px] font-bold text-white/85 tracking-wider uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Nebuloid Tech • Color Clash Stroop Challenge
        </span>
      </div>
    </div>
  );
}
