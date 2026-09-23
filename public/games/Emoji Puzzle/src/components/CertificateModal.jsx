import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import { soundFx } from "../utils/audio";
import {
  Download,
  X,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Trophy,
  Loader2,
  Check,
} from "lucide-react";
import nebuloidLogo from "../assets/nebuloid-logo.png";

// High-Res Direct Canvas 2D PDF Generator (100% reliable, zero CSS/stylesheet errors)
export const generateCertificatePDF = async ({
  userName = "Candidate",
  difficulty = "EASY",
  levelNumber = 1,
  score = 200,
  stars = 3,
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  certificateId = `NT-EP-${Math.floor(100000 + Math.random() * 900000)}`,
  logoSrc = nebuloidLogo,
}) => {
  // High-Resolution 300 DPI Canvas (2100 x 1485, exact A4 1.414 ratio)
  const width = 2100;
  const height = 1485;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas 2D context");

  // 1. Clean White Canvas Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Subtle Dot Matrix Pattern Background
  ctx.fillStyle = "#eef0f3";
  for (let x = 60; x < width - 60; x += 45) {
    for (let y = 60; y < height - 60; y += 45) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Outer Solid Black Border Frame
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 32;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 3. Inner Fine Border
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 70, width - 140, height - 140);

  // 4. Inner Dashed Border
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.strokeRect(95, 95, width - 190, height - 190);
  ctx.setLineDash([]); // Reset line dash

  // Corner Diamond Accents
  const drawDiamond = (cx, cy, size = 16) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
    ctx.fill();
  };

  drawDiamond(125, 125);
  drawDiamond(width - 125, 125);
  drawDiamond(125, height - 125);
  drawDiamond(width - 125, height - 125);

  // 5. Draw Nebuloid Logo
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = logoSrc;
    });

    if (img.complete && img.naturalWidth > 0) {
      const logoW = 160;
      const logoH = (img.naturalHeight / img.naturalWidth) * logoW;
      ctx.drawImage(img, (width - logoW) / 2, 135, logoW, logoH);
    }
  } catch (e) {
    console.warn("Could not render logo to canvas", e);
  }

  // 6. Brand Name & Header
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "900 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NEBULOID TECH STUDIO LLP", width / 2, 345);

  // Diamond Divider
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 375);
  ctx.lineTo(width / 2 - 25, 375);
  ctx.moveTo(width / 2 + 25, 375);
  ctx.lineTo(width / 2 + 200, 375);
  ctx.stroke();
  drawDiamond(width / 2, 375, 8);

  // Subtitle
  ctx.fillStyle = "#52525b";
  ctx.font = "800 22px sans-serif";
  ctx.fillText("OFFICIAL CERTIFICATE OF EXCELLENCE", width / 2, 435);

  // Presentation text
  ctx.fillStyle = "#52525b";
  ctx.font = "italic 500 28px sans-serif";
  ctx.fillText("This certificate is proudly awarded to", width / 2, 520);

  // Candidate Name
  const formattedName = (userName || "Candidate").toUpperCase();
  ctx.fillStyle = "#000000";
  ctx.font = "900 60px sans-serif";
  ctx.fillText(formattedName, width / 2, 620);

  // Underline below Name
  const nameMetrics = ctx.measureText(formattedName);
  const nameWidth = Math.min(
    width - 400,
    Math.max(500, nameMetrics.width + 80),
  );
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo((width - nameWidth) / 2, 645);
  ctx.lineTo((width + nameWidth) / 2, 645);
  ctx.stroke();

  // Achievement Description
  ctx.fillStyle = "#3f3f46";
  ctx.font = "500 26px sans-serif";
  ctx.fillText(
    "for demonstrating exceptional cognitive deduction, emoji decoding speed,",
    width / 2,
    715,
  );
  ctx.fillText(
    "and analytical puzzle-solving mastery in completing",
    width / 2,
    760,
  );

  // Achievement Pill
  const pillW = 860;
  const pillH = 72;
  const pillX = (width - pillW) / 2;
  const pillY = 805;

  ctx.fillStyle = "#09090b";
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(pillX, pillY, pillW, pillH, 18);
  } else {
    ctx.rect(pillX, pillY, pillW, pillH);
  }
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 26px sans-serif";
  ctx.fillText(
    `🏆 ${difficulty.toUpperCase()} MODE • LEVEL ${levelNumber} (2/2 STAGES CLEARED)`,
    width / 2,
    pillY + 46,
  );

  // 7. Stats Box
  const boxW = width - 400;
  const boxH = 130;
  const boxX = 200;
  const boxY = 920;

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(boxX, boxY, boxW, boxH, 16);
  } else {
    ctx.rect(boxX, boxY, boxW, boxH);
  }
  ctx.fill();

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Column 1: Total Score
  ctx.fillStyle = "#64748b";
  ctx.font = "800 20px sans-serif";
  ctx.fillText("TOTAL SCORE", boxX + boxW / 6, boxY + 45);

  ctx.fillStyle = "#09090b";
  ctx.font = "900 34px sans-serif";
  ctx.fillText(`+${score} PTS`, boxX + boxW / 6, boxY + 95);

  // Divider 1
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(boxX + boxW / 3, boxY + 20);
  ctx.lineTo(boxX + boxW / 3, boxY + boxH - 20);
  ctx.stroke();

  // Column 2: Star Rating
  ctx.fillStyle = "#64748b";
  ctx.font = "800 20px sans-serif";
  ctx.fillText("STAR RATING", boxX + boxW / 2, boxY + 45);

  ctx.fillStyle = "#f59e0b";
  ctx.font = "900 36px sans-serif";
  ctx.fillText(
    "★".repeat(stars) + "☆".repeat(Math.max(0, 3 - stars)),
    boxX + boxW / 2,
    boxY + 95,
  );

  // Divider 2
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(boxX + (boxW * 2) / 3, boxY + 20);
  ctx.lineTo(boxX + (boxW * 2) / 3, boxY + boxH - 20);
  ctx.stroke();

  // Column 3: Verification
  ctx.fillStyle = "#64748b";
  ctx.font = "800 20px sans-serif";
  ctx.fillText("VERIFICATION", boxX + (boxW * 5) / 6, boxY + 45);

  ctx.fillStyle = "#059669";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("✓ 100% AUTHENTIC", boxX + (boxW * 5) / 6, boxY + 92);

  // Bottom Line Divider
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 1120);
  ctx.lineTo(width - 140, 1120);
  ctx.stroke();

  // Bottom Left: Date & ID
  ctx.textAlign = "left";
  ctx.fillStyle = "#334155";
  ctx.font = "700 24px sans-serif";
  ctx.fillText(`DATE: ${date}`, 160, 1210);

  ctx.fillStyle = "#64748b";
  ctx.font = "600 20px monospace";
  ctx.fillText(`CERTIFICATE ID: ${certificateId}`, 160, 1260);

  // Bottom Center: Official Seal Badge
  const sealX = width / 2;
  const sealY = 1240;
  const sealR = 75;

  ctx.strokeStyle = "#09090b";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "center";
  ctx.fillStyle = "#09090b";
  ctx.font = "900 16px sans-serif";
  ctx.fillText("NEBULOID TECH STUDIO LLP", sealX, sealY - 25);

  ctx.fillStyle = "#09090b";
  ctx.font = "900 22px sans-serif";
  ctx.fillText("★ SEAL ★", sealX, sealY + 8);

  ctx.fillStyle = "#64748b";
  ctx.font = "700 13px sans-serif";
  ctx.fillText("OFFICIAL VERIFIED", sealX, sealY + 35);

  // Bottom Right: Signature
  ctx.textAlign = "right";
  ctx.fillStyle = "#09090b";
  ctx.font = "italic 700 36px serif, cursive";
  ctx.fillText("Nebuloid Gaming Director", width - 160, 1220);

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - 480, 1235);
  ctx.lineTo(width - 160, 1235);
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "800 17px sans-serif";
  ctx.fillText("AUTHORIZED EXECUTIVE SIGNATURE", width - 160, 1265);

  // Generate and save jsPDF (A4 Landscape 297mm x 210mm)
  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  const safeName = (userName || "Player").replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `Nebuloid_Certificate_${safeName}_${difficulty.toUpperCase()}_L${levelNumber}.pdf`;
  pdf.save(filename);
};

const CertificateModal = ({
  isOpen,
  onClose,
  userName = "Player",
  difficulty = "easy",
  levelNumber = 1,
  score = 200,
  stars = 3,
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  certificateId = `NT-EP-${Math.floor(100000 + Math.random() * 900000)}`,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      soundFx.playClick();

      await generateCertificatePDF({
        userName,
        difficulty,
        levelNumber,
        score,
        stars,
        date,
        certificateId,
        logoSrc: nebuloidLogo,
      });

      soundFx.playLevelComplete();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Error generating PDF certificate:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border-2 border-neutral-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-neutral-900" />
            <h3 className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-neutral-900">
              Verified Nebuloid Certificate
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Preview Area */}
        <div className="p-3 sm:p-6 bg-neutral-100 flex justify-center overflow-x-auto">
          <div
            className="w-[720px] h-[510px] bg-white border-8 border-neutral-950 p-6 sm:p-7 flex flex-col justify-between relative shadow-xl font-['Outfit',sans-serif] shrink-0 select-none text-neutral-900"
            style={{
              backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {/* Ornate Inner Double Border */}
            <div className="absolute inset-2.5 border-2 border-neutral-900 pointer-events-none" />
            <div className="absolute inset-3.5 border border-dashed border-neutral-400 pointer-events-none" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 left-4 text-xs font-black text-neutral-900">
              ◆
            </div>
            <div className="absolute top-4 right-4 text-xs font-black text-neutral-900">
              ◆
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-black text-neutral-900">
              ◆
            </div>
            <div className="absolute bottom-4 right-4 text-xs font-black text-neutral-900">
              ◆
            </div>

            {/* 1. Certificate Top Header & Branding */}
            <div className="flex flex-col items-center text-center z-10 pt-1">
              <div className="flex items-center gap-3">
                <img
                  src={nebuloidLogo}
                  alt="Nebuloid Logo"
                  className="h-11 w-auto object-contain filter drop-shadow-xs"
                />
              </div>
              <h2 className="text-xs font-extrabold tracking-[0.35em] text-black uppercase mt-1">
                NEBULOID TECH STUDIO LLP
              </h2>
              <div className="flex items-center justify-center gap-3 w-56 mt-1 opacity-75">
                <div className="h-[1px] bg-neutral-400 flex-1" />
                <div className="w-1.5 h-1.5 rotate-45 border border-neutral-700 bg-neutral-900" />
                <div className="h-[1px] bg-neutral-400 flex-1" />
              </div>

              <div className="text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase mt-1.5">
                OFFICIAL CERTIFICATE OF EXCELLENCE
              </div>
            </div>

            {/* 2. Certificate Body Content */}
            <div className="text-center my-auto z-10 px-6">
              <p className="text-[11px] font-medium text-neutral-600 italic">
                This certificate is proudly awarded to
              </p>

              {/* Player Name */}
              <div className="my-1.5 border-b-2 border-neutral-900 inline-block px-8 pb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-wide uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                  {userName || "Candidate"}
                </h1>
              </div>

              <p className="text-xs text-neutral-700 max-w-lg mx-auto leading-relaxed mt-0.5">
                for demonstrating exceptional cognitive deduction, emoji
                decoding speed, and analytical puzzle-solving mastery in
                completing
              </p>

              {/* Achievement Badge Banner */}
              <div className="mt-2.5 inline-flex items-center gap-2.5 bg-neutral-950 text-white px-5 py-1.5 rounded-xl shadow-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black tracking-[0.2em] uppercase">
                  {difficulty.toUpperCase()} MODE • LEVEL {levelNumber} (2/2
                  STAGES CLEARED)
                </span>
              </div>
            </div>

            {/* 3. Certificate Stats & Verification Grid */}
            <div className="grid grid-cols-3 gap-3 bg-neutral-50 border border-neutral-300 rounded-xl p-2 mx-4 text-center z-10">
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-500">
                  TOTAL SCORE
                </div>
                <div className="text-sm font-black text-neutral-950">
                  +{score} PTS
                </div>
              </div>
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-500">
                  STAR RATING
                </div>
                <div className="text-xs font-black text-amber-500">
                  {"★".repeat(stars)}
                  {"☆".repeat(Math.max(0, 3 - stars))}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-500">
                  VERIFICATION
                </div>
                <div className="text-xs font-black text-emerald-600 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% AUTHENTIC</span>
                </div>
              </div>
            </div>

            {/* 4. Certificate Bottom Footer & Signature */}
            <div className="flex justify-between items-end px-4 pt-2 border-t border-neutral-300 z-10">
              {/* Date & Cert ID */}
              <div className="text-left">
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
                  <Calendar className="w-3 h-3" />
                  <span>DATE: {date}</span>
                </div>
                <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
                  ID: {certificateId}
                </div>
              </div>

              {/* Official Seal / Stamp */}
              <div className="w-13 h-13 rounded-full border-2 border-neutral-900 border-dashed flex flex-col items-center justify-center text-center p-1 bg-white shadow-2xs">
                <span className="text-[7px] font-black tracking-widest text-neutral-900 uppercase">
                  NEBULOID
                </span>
                <span className="text-[9px] font-bold text-neutral-800">
                  ★ SEAL ★
                </span>
                <span className="text-[6px] font-semibold text-neutral-500">
                  OFFICIAL
                </span>
              </div>

              {/* Signature Line */}
              <div className="text-right">
                <div className="font-serif italic font-bold text-sm text-neutral-900 pr-2 pb-0.5 border-b border-neutral-400">
                  Nebuloid Executive
                </div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-neutral-500 mt-0.5">
                  DIRECTOR OF GAMING
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-white border-t border-neutral-200 gap-3">
          <div className="text-xs text-neutral-500 font-medium">
            {downloadSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Certificate downloaded
                successfully!
              </span>
            ) : (
              "Click below to generate and download your high-resolution PDF certificate."
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer border-2 border-black shadow-md disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF Certificate</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="border-2 border-neutral-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
