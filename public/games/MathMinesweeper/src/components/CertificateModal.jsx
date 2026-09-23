import React, { useRef, useState } from 'react';
import nebuloidMark from '../assets/nebuloid-nt-mark.png';
import { playClick, playChime } from '../utils/audio';

const CertificateModal = ({
  playerName = 'Player 1',
  levelTitle = 'Level 2',
  levelSubtitle = 'Medium',
  score = 500,
  timeFormatted = '01:25',
  totalMines = 12,
  onClose,
  onPlayNext,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Generate and download certificate as High-Resolution PNG (1600 x 1120)
  const handleDownloadImage = () => {
    playClick();
    setIsDownloading(true);

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1120;
      const ctx = canvas.getContext('2d');

      // 1. Parchment Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1120);
      bgGrad.addColorStop(0, '#FFFDF8');
      bgGrad.addColorStop(0.5, '#FAF5E9');
      bgGrad.addColorStop(1, '#F3EAD3');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1120);

      // Subtle vintage texture lines
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 0; y < 1120; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1600, y);
        ctx.stroke();
      }

      // 2. Outer Ornate Golden Border
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 10;
      ctx.strokeRect(36, 36, 1528, 1048);

      // Inner Delicate Border
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(52, 52, 1496, 1016);

      // Second Inner Fine Frame
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1;
      ctx.strokeRect(58, 58, 1484, 1004);

      // Corner Accents (Diamonds and Crosses)
      const drawCorner = (cx, cy) => {
        ctx.fillStyle = '#B45309';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy);
        ctx.lineTo(cx + 18, cy);
        ctx.moveTo(cx, cy - 18);
        ctx.lineTo(cx, cy + 18);
        ctx.stroke();
      };
      drawCorner(58, 58);
      drawCorner(1542, 58);
      drawCorner(58, 1062);
      drawCorner(1542, 1062);

      // 3. Header Text: Studio & Organization
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 24px "Outfit", sans-serif';
      ctx.fillText('NEBULOID TECH STUDIO LLP', 800, 140);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 15px "Outfit", sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('DEPARTMENT OF MATHEMATICAL ADVENTURES & LOGIC', 800, 170);

      // Decorative Divider Line
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(450, 195);
      ctx.lineTo(1150, 195);
      ctx.stroke();

      ctx.fillStyle = '#D97706';
      ctx.font = '16px serif';
      ctx.fillText('♦ ─── ❖ ─── ♦', 800, 201);

      // 4. Certificate Main Title
      ctx.fillStyle = '#B45309';
      ctx.font = '900 48px "Fredoka", sans-serif';
      ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 800, 275);

      ctx.fillStyle = '#475569';
      ctx.font = 'italic 500 22px "Outfit", serif';
      ctx.fillText('This official certificate of mathematical excellence is proudly presented to', 800, 325);

      // 5. Recipient Name
      const cleanName = playerName.trim() || 'Cadet Player';
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 58px "Fredoka", sans-serif';
      ctx.fillText(cleanName, 800, 420);

      // Golden Ribbon Underline for Name
      const nameWidth = Math.max(480, ctx.measureText(cleanName).width + 60);
      const nameStart = 800 - nameWidth / 2;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(nameStart, 440);
      ctx.lineTo(nameStart + nameWidth, 440);
      ctx.stroke();

      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.arc(nameStart, 440, 4, 0, Math.PI * 2);
      ctx.arc(nameStart + nameWidth, 440, 4, 0, Math.PI * 2);
      ctx.fill();

      // 6. Commendation Description
      ctx.fillStyle = '#334155';
      ctx.font = '500 22px "Outfit", sans-serif';
      ctx.fillText(
        `For successfully defusing all ${totalMines} naval mines with strategic logic, speed, and arithmetic precision in`,
        800,
        500
      );

      ctx.fillStyle = '#1E3A8A';
      ctx.font = '900 28px "Fredoka", sans-serif';
      ctx.fillText(`Math Minesweeper — ${levelTitle.toUpperCase()} (${levelSubtitle.toUpperCase()})`, 800, 545);

      // 7. Stats Box on Certificate
      const statsY = 605;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(300, statsY, 1000, 110, 16);
      } else {
        ctx.rect(300, statsY, 1000, 110);
      }
      ctx.fill();
      ctx.stroke();

      // Stat Columns
      const stats = [
        { label: 'TIME TAKEN', val: timeFormatted, icon: '⏱' },
        { label: 'FINAL SCORE', val: `${score} PTS`, icon: '🏆' },
        { label: 'MINES DEFUSED', val: `${totalMines} MINES`, icon: '💣' },
        { label: 'ACCURACY', val: '100% CLEAR', icon: '🎯' },
      ];

      stats.forEach((st, i) => {
        const sx = 300 + 125 + i * 250;
        ctx.fillStyle = '#64748B';
        ctx.font = '800 13px "Outfit", sans-serif';
        ctx.fillText(st.label, sx, statsY + 40);

        ctx.fillStyle = '#0F172A';
        ctx.font = '900 26px "Fredoka", sans-serif';
        ctx.fillText(`${st.icon} ${st.val}`, sx, statsY + 80);
      });

      // 8. Signatures & Golden Official Seal
      // Left: Date
      const footY = 880;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 20px "Outfit", sans-serif';
      ctx.fillText(currentDate, 440, footY);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(320, footY + 12);
      ctx.lineTo(560, footY + 12);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '700 13px "Outfit", sans-serif';
      ctx.fillText('DATE OF CONQUEST', 440, footY + 34);

      // Center: Official Gold Seal
      const sealX = 800;
      const sealY = footY - 10;
      // Ribbon tails
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(sealX - 25, sealY + 25);
      ctx.lineTo(sealX - 45, sealY + 95);
      ctx.lineTo(sealX - 25, sealY + 80);
      ctx.lineTo(sealX - 5, sealY + 95);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sealX + 25, sealY + 25);
      ctx.lineTo(sealX + 5, sealY + 95);
      ctx.lineTo(sealX + 25, sealY + 80);
      ctx.lineTo(sealX + 45, sealY + 95);
      ctx.closePath();
      ctx.fill();

      // Gold Seal Disc
      const sealGrad = ctx.createRadialGradient(sealX - 15, sealY - 15, 5, sealX, sealY, 55);
      sealGrad.addColorStop(0, '#FDE68A');
      sealGrad.addColorStop(0.5, '#F59E0B');
      sealGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Star & Seal Text
      ctx.fillStyle = '#FFF';
      ctx.font = '900 28px sans-serif';
      ctx.fillText('★', sealX, sealY + 8);
      ctx.font = '900 9px "Outfit", sans-serif';
      ctx.fillText('OFFICIAL SEAL', sealX, sealY + 24);
      ctx.fillText('NEBULOID TECH', sealX, sealY - 18);

      // Right: Director Signature
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 32px "Patrick Hand", cursive';
      ctx.fillText('Nebuloid Studio', 1160, footY - 5);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1040, footY + 12);
      ctx.lineTo(1280, footY + 12);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '700 13px "Outfit", sans-serif';
      ctx.fillText('NEBULOID TECH STUDIO LLP', 1160, footY + 34);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `Math_Minesweeper_Certificate_${cleanName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      playChime();
    } catch (err) {
      console.error('Certificate generation error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden Canvas for High-DPI Image Generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-500 my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg border-2 border-white z-30 cursor-pointer"
          title="Close"
        >
          ✕
        </button>

        {/* ========================================================================= */}
        {/* PRINTABLE / VISIBLE CERTIFICATE DIPLOMA                                   */}
        {/* ========================================================================= */}
        <div
          id="printable-certificate"
          className="relative bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] rounded-2xl p-6 sm:p-10 border-4 border-[#B45309] shadow-[inset_0_0_20px_rgba(180,83,9,0.08)] overflow-hidden text-center"
        >
          {/* Inner Decorative Double Border */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-[#D97706]/70 rounded-xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-[#F59E0B]/50 rounded-lg pointer-events-none" />

          {/* Corner Flourish Dots */}
          <div className="absolute top-4 left-4 text-[#B45309] text-xs select-none">❖</div>
          <div className="absolute top-4 right-4 text-[#B45309] text-xs select-none">❖</div>
          <div className="absolute bottom-4 left-4 text-[#B45309] text-xs select-none">❖</div>
          <div className="absolute bottom-4 right-4 text-[#B45309] text-xs select-none">❖</div>

          {/* Watermark Logo Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-5 pointer-events-none select-none">
            <img src={nebuloidMark} alt="Watermark" className="w-full h-full object-contain" />
          </div>

          {/* Header Branding */}
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={nebuloidMark}
              alt="Nebuloid"
              className="w-12 sm:w-14 h-auto drop-shadow-sm mb-1 object-contain"
            />
            <h4 className="font-ui font-black text-xs sm:text-sm tracking-[0.28em] text-[#0F172A] uppercase">
              Nebuloid Tech Studio LLP
            </h4>
            <span className="font-ui text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-0.5">
              Department of Mathematical Logic & Exploration
            </span>

            {/* Diamond Bar */}
            <div className="flex items-center gap-2 mt-2 opacity-80">
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#B45309]" />
              <span className="text-xs text-[#B45309]">♦ ❖ ♦</span>
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#B45309]" />
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="relative z-10 mt-5 sm:mt-6">
            <h1 className="font-game text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#B45309] uppercase drop-shadow-xs">
              Certificate of Achievement
            </h1>
            <p className="font-serif italic text-xs sm:text-sm text-slate-600 mt-1">
              This official certificate of mathematical excellence is proudly presented to
            </p>
          </div>

          {/* Recipient Name */}
          <div className="relative z-10 my-4 sm:my-5">
            <div className="inline-block relative">
              <span className="font-game text-3xl sm:text-5xl font-black text-[#0F172A] tracking-wide px-6 py-1">
                {playerName.trim() || 'Cadet Player'}
              </span>
              <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent rounded-full mt-1" />
            </div>
          </div>

          {/* Commendation Details */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="font-ui text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              For successfully calculating and defusing all <span className="font-bold text-slate-900">{totalMines} naval mines</span> with arithmetic precision, sharp deduction, and nerves of steel in
            </p>
            <div className="mt-1 inline-block bg-amber-100/70 border border-amber-300 rounded-xl px-4 py-1">
              <span className="font-game font-black text-sm sm:text-base text-amber-900 tracking-wide">
                Math Minesweeper — {levelTitle} ({levelSubtitle})
              </span>
            </div>
          </div>

          {/* Stats Badges Grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto my-5 sm:my-6">
            <div className="bg-white/90 border border-slate-200/90 rounded-xl p-2.5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block font-ui uppercase">
                ⏱ Clear Time
              </span>
              <span className="font-game font-black text-base sm:text-lg text-slate-900">
                {timeFormatted}
              </span>
            </div>
            <div className="bg-white/90 border border-slate-200/90 rounded-xl p-2.5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block font-ui uppercase">
                🏆 Score
              </span>
              <span className="font-game font-black text-base sm:text-lg text-amber-700">
                {score} pts
              </span>
            </div>
            <div className="bg-white/90 border border-slate-200/90 rounded-xl p-2.5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block font-ui uppercase">
                💣 Defused
              </span>
              <span className="font-game font-black text-base sm:text-lg text-red-600">
                {totalMines} Mines
              </span>
            </div>
            <div className="bg-white/90 border border-slate-200/90 rounded-xl p-2.5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block font-ui uppercase">
                🎯 Accuracy
              </span>
              <span className="font-game font-black text-base sm:text-lg text-emerald-600">
                100% Cleared
              </span>
            </div>
          </div>

          {/* Certificate Footer: Date, Seal & Signature */}
          <div className="relative z-10 flex items-end justify-between pt-3 sm:pt-4 border-t border-slate-200/80 mt-2 px-2 sm:px-6">
            
            {/* Left: Date */}
            <div className="text-left">
              <span className="font-ui font-bold text-xs sm:text-sm text-slate-900 block">
                {currentDate}
              </span>
              <div className="w-28 sm:w-36 h-[1.5px] bg-slate-400 my-1" />
              <span className="font-ui text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Date Issued
              </span>
            </div>

            {/* Center: Golden Wax Seal */}
            <div className="relative -mb-1 flex flex-col items-center">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-md border-2 border-amber-800 flex items-center justify-center text-white">
                <span className="text-lg sm:text-xl">★</span>
                <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/70" />
              </div>
              <span className="font-ui text-[8px] sm:text-[9px] font-black tracking-widest text-amber-800 uppercase mt-1">
                Official Seal
              </span>
            </div>

            {/* Right: Signature */}
            <div className="text-right">
              <span className="font-hand font-bold text-lg sm:text-2xl text-slate-800 block -rotate-2">
                Nebuloid Studio
              </span>
              <div className="w-28 sm:w-36 h-[1.5px] bg-slate-400 my-1 ml-auto" />
              <span className="font-ui text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Chief Game Director
              </span>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODAL ACTION BUTTONS                                                      */}
        {/* ========================================================================= */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="btn-3d-green px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-game font-black text-sm sm:text-base tracking-wider uppercase text-white cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>{isDownloading ? '⏳' : '📥'}</span>
              <span>{isDownloading ? 'Generating...' : 'Download Certificate (PNG)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-3d-white px-4 py-2.5 sm:py-3 rounded-2xl font-ui font-black text-xs sm:text-sm tracking-wider uppercase text-slate-700 cursor-pointer flex items-center gap-2 border border-slate-300 shadow-sm"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {onPlayNext && (
              <button
                onClick={() => {
                  playClick();
                  onPlayNext();
                }}
                className="btn-3d-blue px-5 py-2.5 sm:py-3 rounded-2xl font-game font-black text-xs sm:text-sm tracking-wider uppercase text-white cursor-pointer shadow-md"
              >
                🎮 Next Level
              </button>
            )}

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-300 text-slate-700 font-ui font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateModal;
