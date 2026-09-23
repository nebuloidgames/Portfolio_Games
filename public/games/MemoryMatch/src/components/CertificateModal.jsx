import React, { useRef } from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";

export default function CertificateModal({
  isOpen,
  onClose,
  winnerName,
  difficulty = "Primary",
  mode = "team",
  score = 10,
}) {
  const certRef = useRef(null);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certId = `NTS-MM-${Math.floor(100000 + Math.random() * 900000)}`;
  const modeLabel = mode === "robot" ? "Solo vs AI Robot" : "Team vs Team Match";
  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  // High-res Canvas Certificate Downloader
  const downloadCertificate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");

    // 1. Parchment / Ivory Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1920, 1350);
    bgGrad.addColorStop(0, "#fdfaf3");
    bgGrad.addColorStop(0.5, "#faeed7");
    bgGrad.addColorStop(1, "#f8e6c4");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1920, 1350);

    // Subtle decorative grid or pattern
    ctx.strokeStyle = "rgba(190, 140, 70, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 60; x < 1920; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 60);
      ctx.lineTo(x, 1290);
      ctx.stroke();
    }
    for (let y = 60; y < 1350; y += 50) {
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(1860, y);
      ctx.stroke();
    }

    // 2. Borders
    // Outer border
    ctx.strokeStyle = "#9d651d";
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, 1820, 1250);

    // Inner gold border
    ctx.strokeStyle = "#d4973b";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(66, 66, 1788, 1218);

    // Thin inner line
    ctx.strokeStyle = "rgba(157, 101, 29, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(76, 76, 1768, 1198);

    // Corner Ornaments
    const drawCorner = (cx, cy) => {
      ctx.fillStyle = "#9d651d";
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#d4973b";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 18, cy - 18, 36, 36);
    };
    drawCorner(66, 66);
    drawCorner(1854, 66);
    drawCorner(66, 1284);
    drawCorner(1854, 1284);

    // 3. Load Logo & Render Content
    const logoImg = new Image();
    logoImg.src = nebuloidLogo;
    logoImg.onload = () => {
      // Draw Logo at top
      const logoW = 320;
      const logoH = (320 * 288) / 1080;
      ctx.drawImage(logoImg, 960 - logoW / 2, 110, logoW, logoH);

      // Studio Sub-heading
      ctx.textAlign = "center";
      ctx.fillStyle = "#633811";
      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      if ("letterSpacing" in ctx) {
        try { ctx.letterSpacing = "6px"; } catch (_) {}
      }
      ctx.fillText("NEBULOID TECH STUDIO LLP", 960, 230);

      // Certificate Title
      ctx.fillStyle = "#381804";
      ctx.font = "900 64px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("CERTIFICATE OF VICTORY", 960, 340);

      // Decorative divider below title
      ctx.strokeStyle = "#d4973b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(700, 370);
      ctx.lineTo(1220, 370);
      ctx.stroke();

      ctx.fillStyle = "#9d651d";
      ctx.beginPath();
      ctx.arc(960, 370, 6, 0, Math.PI * 2);
      ctx.fill();

      // "PROUDLY PRESENTED TO"
      ctx.fillStyle = "#704824";
      ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
      if ("letterSpacing" in ctx) {
        try { ctx.letterSpacing = "5px"; } catch (_) {}
      }
      ctx.fillText("THIS CERTIFICATE IS PROUDLY PRESENTED TO", 960, 440);

      // WINNER NAME
      ctx.fillStyle = "#2e1202";
      ctx.font = "900 84px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(winnerName, 960, 565);

      // Underline for winner name
      ctx.strokeStyle = "#c87d25";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(560, 600);
      ctx.lineTo(1360, 600);
      ctx.stroke();

      // Citation / Description
      ctx.fillStyle = "#4a2c16";
      ctx.font = "500 25px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(
        "For exceptional memory skills, rapid cognitive agility, and securing victory",
        960,
        665
      );
      ctx.fillText(
        `in the Memory Match Championship (${diffLabel} Level • ${modeLabel}).`,
        960,
        705
      );

      // Metadata Info Box
      const boxY = 760;
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.strokeStyle = "rgba(190, 130, 50, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(460, boxY, 1000, 110, 16);
      } else {
        ctx.rect(460, boxY, 1000, 110);
      }
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#6e4620";
      ctx.font = "700 16px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("DIFFICULTY LEVEL", 510, boxY + 40);
      ctx.fillText("GAME MODE", 770, boxY + 40);
      ctx.fillText("TARGET SCORE", 1020, boxY + 40);
      ctx.fillText("DATE AWARDED", 1260, boxY + 40);

      ctx.fillStyle = "#2e1202";
      ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(diffLabel, 510, boxY + 75);
      ctx.fillText(mode === "robot" ? "vs Robot" : "Team vs Team", 770, boxY + 75);
      ctx.fillText(`${score} Points`, 1020, boxY + 75);
      ctx.fillText(issueDate, 1260, boxY + 75);

      // Golden Seal (Center bottom)
      const sealX = 960;
      const sealY = 1040;
      const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, 80);
      sealGrad.addColorStop(0, "#ffeab8");
      sealGrad.addColorStop(0.6, "#f6be5c");
      sealGrad.addColorStop(1, "#c07817");
      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 78, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#804500";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.strokeStyle = "#fff2d0";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#381804";
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("★ OFFICIAL WINNER ★", sealX, sealY - 26);
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("🏆", sealX, sealY + 12);
      ctx.font = "800 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("NEBULOID TECH", sealX, sealY + 36);

      // Signatures
      // Left: Verification ID
      ctx.textAlign = "center";
      ctx.fillStyle = "#381804";
      ctx.font = "700 16px 'Plus Jakarta Sans', monospace";
      ctx.fillText(certId, 360, 1070);
      ctx.strokeStyle = "#9d651d";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(220, 1090);
      ctx.lineTo(500, 1090);
      ctx.stroke();
      ctx.fillStyle = "#6e4620";
      ctx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("CERTIFICATE ID", 360, 1115);

      // Right: Authorized Signature
      ctx.fillStyle = "#2e1202";
      ctx.font = "700 24px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("Nebuloid Tech Studio", 1560, 1065);
      ctx.strokeStyle = "#9d651d";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1420, 1090);
      ctx.lineTo(1700, 1090);
      ctx.stroke();
      ctx.fillStyle = "#6e4620";
      ctx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("AUTHORIZED SIGNATORY", 1560, 1115);

      // Trigger Download
      const link = document.createElement("a");
      link.download = `Nebuloid_MemoryMatch_Certificate_${winnerName.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#fffdf9] rounded-2xl shadow-2xl p-6 md:p-10 my-6 border-4 border-[#c78a3b] text-center"
        style={{
          boxShadow: "0 25px 60px rgba(70, 30, 10, 0.35)",
          backgroundImage: "linear-gradient(180deg, #fffdf8 0%, #fdf5e6 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
        ref={certRef}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-[#d9c0a5] text-[#381804] font-black hover:bg-[#f6edd9] transition-colors flex items-center justify-center shadow-sm"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Ornate Inner Border */}
        <div className="border-2 border-[#e5b567] p-6 md:p-8 rounded-xl relative">
          {/* Header Branding */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={nebuloidLogo}
              alt="Nebuloid Tech Studio LLP"
              className="h-10 md:h-14 w-auto object-contain mb-1"
            />
            <span className="text-[11px] md:text-xs font-extrabold tracking-[0.3em] text-[#704824] uppercase">
              Nebuloid Tech Studio LLP
            </span>
          </div>

          {/* Title */}
          <h1 className="font-sans font-black text-2xl md:text-4xl text-[#381804] mb-1 tracking-wide">
            CERTIFICATE OF VICTORY
          </h1>
          <div className="w-36 h-0.5 bg-[#c87d25] mx-auto mb-4 relative">
            <div className="w-2.5 h-2.5 bg-[#9d651d] rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
          </div>

          <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-[#82542a] uppercase mb-3">
            THIS CERTIFICATE IS PROUDLY PRESENTED TO
          </p>

          {/* Winner Name */}
          <div className="my-3">
            <h2 className="font-sans font-black text-3xl md:text-5xl text-[#2e1202] tracking-wide">
              {winnerName}
            </h2>
            <div className="w-64 md:w-96 h-0.5 bg-[#c87d25] mx-auto mt-2"></div>
          </div>

          {/* Description */}
          <p className="max-w-xl mx-auto text-xs md:text-sm text-[#4a2c16] font-medium leading-relaxed my-4">
            For demonstrating extraordinary cognitive agility, memory precision, and triumphant victory
            in the official <strong>Math Memory Match Championship</strong> ({diffLabel} Level • {modeLabel}).
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg mx-auto my-5 bg-white/70 border border-[#ecd5bd] rounded-xl p-3 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-[#82542a]">DIFFICULTY</span>
              <strong className="text-[#2e1202] text-sm">{diffLabel}</strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#82542a]">MODE</span>
              <strong className="text-[#2e1202] text-sm">{mode === "robot" ? "vs Robot" : "Team Match"}</strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#82542a]">TARGET SCORE</span>
              <strong className="text-[#2e1202] text-sm">{score} Pts</strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#82542a]">DATE</span>
              <strong className="text-[#2e1202] text-sm">{issueDate}</strong>
            </div>
          </div>

          {/* Seal and Signatures */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f0dfcc]">
            <div className="text-left">
              <span className="block text-xs font-mono font-bold text-[#381804]">{certId}</span>
              <span className="text-[10px] font-bold text-[#82542a]">CERTIFICATE ID</span>
            </div>

            {/* Seal */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-[#ffeab8] via-[#f6be5c] to-[#c07817] border-2 border-[#804500] shadow-md flex flex-col items-center justify-center p-1 text-center">
              <span className="text-[7px] md:text-[8px] font-black text-[#381804] tracking-wider">OFFICIAL</span>
              <span className="text-sm md:text-lg leading-none">🏆</span>
              <span className="text-[7px] md:text-[8px] font-black text-[#381804] tracking-wider">WINNER</span>
            </div>

            <div className="text-right">
              <span className="font-sans font-bold text-sm md:text-base text-[#2e1202] block">
                Nebuloid Tech Studio
              </span>
              <span className="text-[10px] font-bold text-[#82542a]">AUTHORIZED SIGNATORY</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={downloadCertificate}
            className="mm-pill-btn px-6 py-3 bg-[#f8be68] text-[#2b1404] font-bold hover:scale-105 transition-all shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Certificate (PNG)</span>
          </button>

          <button
            onClick={handlePrint}
            className="mm-pill-btn px-6 py-3 bg-white text-[#381804] border-2 border-[#d9c0a5] font-bold hover:bg-[#faeed7] transition-all shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print</span>
          </button>

          <button
            onClick={onClose}
            className="mm-pill-btn px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
