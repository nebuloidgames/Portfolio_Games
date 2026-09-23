import React, { useRef } from "react";
import nebuloid_logo from "../assets/nebuloid-logo-cropped-Photoroom.png";
import NebuloidTopLogo from "./NebuloidTopLogo";

const Certificate = ({
  certificateData = null,
  onBack,
  onHome,
}) => {
  const printRef = useRef(null);

  // Fallback / default certificate data
  const data = certificateData || {
    playerName: "Speed Racer",
    level: "EASY",
    stage: 1,
    score: 12450,
    avgReactionTime: 238,
    accuracy: 94,
    stars: 3,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    certId: "RR-" + Math.floor(100000 + Math.random() * 900000) + "-NT",
  };

  const handlePrint = () => {
    window.print();
  };

  // Reflex Rank title
  const getReflexTitle = (ms) => {
    if (!ms || ms === 0) return "CERTIFIED RACER";
    if (ms < 220) return "GODLIKE REFLEX MASTER";
    if (ms < 280) return "CYBER PRO RACER";
    if (ms < 360) return "SUPERIOR SPEED RACER";
    if (ms < 480) return "AGILE REFLEX SPECIALIST";
    return "CERTIFIED REACTION RACER";
  };

  return (
    <div className="min-h-screen w-full bg-[#eef0f5] flex flex-col items-center justify-between p-3 sm:p-6 select-none font-sans relative">
      {/* Self-contained CSS for Certificate typography and Print formatting */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Outfit:wght@400;500;600;700;800;900&family=Great+Vibes&display=swap');

        .font-cert-title {
          font-family: 'Cinzel', serif;
        }
        .font-cert-name {
          font-family: 'sans-serif';
        }
        .font-racing {
          font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
        }
        .font-branding {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* TOP NEBULOID LOGO (no-print) */}
      <NebuloidTopLogo />

      {/* =========================================================================
          TOP ACTION TOOLBAR (Back, Download/Print, Main Menu) - Hidden in Print
         ========================================================================= */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-2 sm:gap-4 mb-4 no-print z-20">
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="h-10 px-4 rounded-xl bg-white border border-neutral-300 shadow-sm hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all active:scale-95 font-branding font-black text-xs uppercase tracking-wider text-neutral-800"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>BACK TO LEVELS</span>
        </button>

        {/* Center: Download / Print Certificate Action */}
        <button
          type="button"
          onClick={handlePrint}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer font-branding font-black text-xs sm:text-sm uppercase tracking-widest border border-neutral-700 group"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#e51b24] group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>DOWNLOAD / PRINT CERTIFICATE</span>
        </button>

        {/* Right: Main Menu Home Button */}
        <button
          type="button"
          onClick={onHome}
          className="h-10 px-4 rounded-xl bg-white border border-neutral-300 shadow-sm hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all active:scale-95 font-branding font-black text-xs uppercase tracking-wider text-neutral-800"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>MAIN MENU</span>
        </button>
      </div>

      {/* =========================================================================
          OFFICIAL CERTIFICATE OF ACHIEVEMENT (Printable A4 Landscape Container)
         ========================================================================= */}
      <div
        id="printable-certificate"
        ref={printRef}
        className="w-full max-w-5xl bg-[#ffffff] rounded-2xl border-[3px] border-neutral-900 shadow-2xl relative p-6 sm:p-10 my-auto overflow-hidden text-neutral-900"
      >
        {/* Ornate Inner Border Line */}
        <div className="absolute inset-3 sm:inset-4 border border-neutral-300 pointer-events-none rounded-xl" />
        <div className="absolute inset-4 sm:inset-5 border-[1.5px] border-[#e51b24] pointer-events-none rounded-lg opacity-85" />

        {/* Corner Diagonal Tech Stripes */}
        {/* Top-Left */}
        <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <polygon points="0,0 45,0 0,45" fill="#0b0c10" />
            <line x1="0" y1="52" x2="52" y2="0" stroke="#e51b24" strokeWidth="3" />
            <line x1="0" y1="62" x2="62" y2="0" stroke="#0b0c10" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Top-Right */}
        <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <polygon points="100,0 55,0 100,45" fill="#0b0c10" />
            <line x1="100" y1="52" x2="48" y2="0" stroke="#e51b24" strokeWidth="3" />
            <line x1="100" y1="62" x2="38" y2="0" stroke="#0b0c10" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Bottom-Left */}
        <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <polygon points="0,100 45,100 0,55" fill="#0b0c10" />
            <line x1="0" y1="48" x2="52" y2="100" stroke="#e51b24" strokeWidth="3" />
            <line x1="0" y1="38" x2="62" y2="100" stroke="#0b0c10" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Bottom-Right */}
        <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <polygon points="100,100 55,100 100,55" fill="#0b0c10" />
            <line x1="100" y1="48" x2="48" y2="100" stroke="#e51b24" strokeWidth="3" />
            <line x1="100" y1="38" x2="38" y2="100" stroke="#0b0c10" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Subtle Background Watermark Logo & Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <svg width="480" height="480" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" stroke="#000" strokeWidth="3" />
            <circle cx="200" cy="200" r="120" stroke="#000" strokeWidth="2" />
            <circle cx="200" cy="200" r="60" stroke="#000" strokeWidth="2" />
            <line x1="200" y1="10" x2="200" y2="390" stroke="#000" strokeWidth="2" />
            <line x1="10" y1="200" x2="390" y2="200" stroke="#000" strokeWidth="2" />
          </svg>
        </div>

        {/* =====================================================================
            CERTIFICATE CONTENT
           ===================================================================== */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-12 py-2">
          {/* Header Logo */}
          <div className="flex flex-col items-center mb-2">
            <img
              src={nebuloid_logo}
              alt="Nebuloid Logo"
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs"
            />
            <span className="font-branding text-[10px] sm:text-[11px] font-black tracking-[0.35em] text-neutral-800 uppercase mt-1">
              NEBULOID REFLEX & HUMAN PERFORMANCE LABS
            </span>
          </div>

          {/* Certificate Main Heading */}
          <div className="my-2">
            <h1 className="font-cert-title text-2xl sm:text-4xl md:text-[40px] font-black text-neutral-900 tracking-wider uppercase leading-none">
              CERTIFICATE OF ACHIEVEMENT
            </h1>
            <div className="flex items-center justify-center gap-3 my-2 opacity-80">
              <span className="w-10 sm:w-20 h-[1.5px] bg-[#e51b24]" />
              <span className="font-branding text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-[#e51b24] uppercase">
                SPEED & REACTION MASTERY
              </span>
              <span className="w-10 sm:w-20 h-[1.5px] bg-[#e51b24]" />
            </div>
          </div>

          {/* Recipient Introduction */}
          <p className="font-branding text-xs sm:text-sm text-neutral-500 font-medium tracking-wide mt-1">
            THIS ACCREDITATION IS PROUDLY CONFERRED UPON
          </p>

          {/* Recipient Name */}
          <div className="my-2 sm:my-3 border-b-2 border-neutral-900 px-6 sm:px-12 pb-1 inline-block min-w-[280px] sm:min-w-[420px]">
            <span className="font-cert-name text-4xl sm:text-5xl md:text-6xl text-[#0b0c10] font-bold capitalize">
              {data.playerName || "Champion Racer"}
            </span>
          </div>

          {/* Accompanying Statement */}
          <p className="max-w-2xl text-[11px] sm:text-[13px] text-neutral-600 font-branding leading-relaxed my-2">
            For demonstrating exceptional hand-eye agility, instinctual reflexes, and sustained tactical focus during the{" "}
            <span className="font-black text-neutral-900 uppercase">
              {data.level} Mode (Stage L-{data.stage})
            </span>{" "}
            30-Second Championship Race.
          </p>

          {/* Verified Telemetry Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-2xl my-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2 sm:p-2.5 text-center">
              <span className="text-[9px] font-branding font-bold text-neutral-400 uppercase tracking-wider block">
                AVG REACTION
              </span>
              <span className="font-racing text-base sm:text-lg font-black text-neutral-900">
                {data.avgReactionTime} ms
              </span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2 sm:p-2.5 text-center">
              <span className="text-[9px] font-branding font-bold text-neutral-400 uppercase tracking-wider block">
                ACCURACY
              </span>
              <span className="font-racing text-base sm:text-lg font-black text-emerald-600">
                {data.accuracy}%
              </span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2 sm:p-2.5 text-center">
              <span className="text-[9px] font-branding font-bold text-neutral-400 uppercase tracking-wider block">
                TOTAL SCORE
              </span>
              <span className="font-racing text-base sm:text-lg font-black text-[#e51b24]">
                {Number(data.score).toLocaleString()} PTS
              </span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2 sm:p-2.5 text-center">
              <span className="text-[9px] font-branding font-bold text-neutral-400 uppercase tracking-wider block">
                STARS EARNED
              </span>
              <span className="font-racing text-base sm:text-lg font-black text-amber-500">
                {"★".repeat(Math.min(3, Math.max(1, data.stars || 3)))}
              </span>
            </div>
          </div>

          {/* =====================================================================
              FOOTER: Date, Gold Ribbon Seal, Signature
             ===================================================================== */}
          <div className="w-full flex items-end justify-between pt-4 sm:pt-6 border-t border-neutral-200 mt-2 px-2 sm:px-6">
            {/* Left: Date & Certificate ID */}
            <div className="flex flex-col text-left leading-tight">
              <span className="font-branding text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                DATE OF CONFERRAL
              </span>
              <span className="font-branding font-extrabold text-xs text-neutral-800">
                {data.date}
              </span>
              <span className="font-mono text-[9px] text-neutral-400 mt-1">
                REF ID: {data.certId}
              </span>
            </div>

            {/* Center: Official Embossed Hologram Seal */}
            <div className="relative flex flex-col items-center">
              {/* Outer Golden / Red Medal */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-amber-500 bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 flex items-center justify-center shadow-lg relative">
                {/* Inner Ring */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-600 flex flex-col items-center justify-center p-1 text-center bg-white/40 backdrop-blur-xs">
                  <span className="font-branding text-[7px] font-black uppercase text-amber-950 tracking-tighter leading-none">
                    NEBULOID
                  </span>
                  <span className="text-[#e51b24] text-xs sm:text-sm font-black my-0.5">★</span>
                  <span className="font-branding text-[6px] font-black uppercase text-amber-950 tracking-tighter leading-none">
                    VERIFIED
                  </span>
                </div>

                {/* Red Ribbon Tails */}
                <div className="absolute -bottom-4 flex gap-1 z-0 pointer-events-none">
                  <div className="w-3.5 h-6 bg-[#e51b24] -rotate-12 transform origin-top shadow-xs" />
                  <div className="w-3.5 h-6 bg-[#e51b24] rotate-12 transform origin-top shadow-xs" />
                </div>
              </div>
            </div>

            {/* Right: Authorized Signature */}
            <div className="flex flex-col text-right leading-tight">
              <div className="h-8 sm:h-9 flex items-center justify-end">
                {/* Stylized Digital Signature */}
                <span className="font-cert-name text-2xl sm:text-3xl text-neutral-800 -rotate-3">
                  Nebuloid
                </span>
              </div>
              <div className="w-28 sm:w-36 h-[1.5px] bg-neutral-800 ml-auto my-0.5" />
              <span className="font-branding text-[9px] font-black text-neutral-800 uppercase tracking-wider">
                CHIEF RACING DIRECTOR
              </span>
              <span className="font-branding text-[8px] text-neutral-400 font-bold uppercase">
                NEBULOID GAMING LABS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Slogan (Screen only) */}
      <div className="no-print mt-4 text-center">
        <span className="font-branding text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
          OFFICIAL REACTION RUSH PERFORMANCE ACCREDITATION // NEBULOID TECH
        </span>
      </div>
    </div>
  );
};

export default Certificate;