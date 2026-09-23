import { useRef } from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";

export default function CertificateModal({
  winnerName,
  difficulty = "Primary",
  mode = "team",
  scores = [10, 0],
  onPlayAgain,
  onNewTimer,
  onClose,
}) {
  const certRef = useRef(null);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Direct canvas download without external dependencies
  const handleDownloadImage = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Dark Luxurious Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      bgGrad.addColorStop(0, "#050b18");
      bgGrad.addColorStop(0.5, "#0b162e");
      bgGrad.addColorStop(1, "#040915");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // 2. Radial Ambient Glow behind winner name
      const radialGlow = ctx.createRadialGradient(600, 420, 20, 600, 420, 400);
      radialGlow.addColorStop(0, "rgba(56, 189, 248, 0.18)");
      radialGlow.addColorStop(0.5, "rgba(217, 119, 6, 0.12)");
      radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, 1200, 800);

      // 3. Double Golden / Cyan Border
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, 1128, 728);

      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, 1104, 704);

      // Corner Corner Accents
      const drawCorner = (x, y, dx, dy) => {
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(x, y, dx * 24, dy * 4);
        ctx.fillRect(x, y, dx * 4, dy * 24);
      };
      drawCorner(42, 42, 1, 1);
      drawCorner(1158, 42, -1, 1);
      drawCorner(42, 758, 1, -1);
      drawCorner(1158, 758, -1, -1);

      // 4. Logo / Sub-header
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px 'Poppins', 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "6px";
      ctx.fillText("NEBULOID GAMES  •  ARENA OF CHAMPIONS", 600, 105);

      // 5. Certificate Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 44px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("CERTIFICATE OF VICTORY", 600, 175);

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(420, 200);
      ctx.lineTo(780, 200);
      ctx.stroke();

      // 6. Presentation text
      ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
      ctx.font = "600 16px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("THIS CERTIFICATE IS PROUDLY PRESENTED TO", 600, 260);

      // 7. WINNER NAME
      const nameGrad = ctx.createLinearGradient(400, 310, 800, 370);
      nameGrad.addColorStop(0, "#38bdf8");
      nameGrad.addColorStop(0.5, "#ffffff");
      nameGrad.addColorStop(1, "#fbbf24");
      ctx.fillStyle = nameGrad;
      ctx.font = "900 58px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText(winnerName || "Champion", 600, 360);

      // Underline under winner name
      ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(320, 385);
      ctx.lineTo(880, 385);
      ctx.stroke();

      // 8. Description Text
      ctx.fillStyle = "rgba(203, 213, 225, 0.9)";
      ctx.font = "500 18px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "0.5px";
      ctx.fillText(
        `For outstanding mental math speed, precision, and championship victory in`,
        600,
        440
      );
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px 'Poppins', 'Inter', sans-serif";
      ctx.fillText(
        `MATH TUG OF WAR  —  ${difficulty.toUpperCase()} DIVISION`,
        600,
        475
      );

      // 9. Details Badges Box
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(200, 520, 800, 90);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(200, 520, 800, 90);

      // Date column
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 13px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("DATE AWARDED", 350, 552);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px 'Poppins', 'Inter', sans-serif";
      ctx.fillText(formattedDate, 350, 582);

      // Division / Mode
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 13px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("MODE & LEVEL", 600, 552);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px 'Poppins', 'Inter', sans-serif";
      ctx.fillText(
        `${mode === "robot" ? "Solo vs Robot" : "Team vs Team"} • ${difficulty}`,
        600,
        582
      );

      // Final Score
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 13px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("FINAL SCORE", 850, 552);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px 'Poppins', 'Inter', sans-serif";
      ctx.fillText(`${scores[0]} – ${scores[1]}`, 850, 582);

      // 10. Footer Signatures & Official Seal
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText("Nebuloid Tech Studio LLP", 340, 685);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(220, 665);
      ctx.lineTo(460, 665);
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px 'Poppins', 'Inter', sans-serif";
      ctx.fillText("Authorized Game Director", 340, 706);

      // Seal on the right
      ctx.fillStyle = "#fbbf24";
      ctx.font = "900 16px 'Poppins', 'Inter', sans-serif";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("★ OFFICIAL CHAMPION ★", 860, 685);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(740, 665);
      ctx.lineTo(980, 665);
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px 'Poppins', 'Inter', sans-serif";
      ctx.fillText("Verified Math Tug of War", 860, 706);

      // Trigger Download
      const link = document.createElement("a");
      link.download = `Certificate_${(winnerName || "Champion").replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate certificate image:", err);
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tow-cert-backdrop" role="dialog" aria-modal="true">
      <div className="tow-cert-modal-wrap">
        {/* CERTIFICATE CARD */}
        <div ref={certRef} className="tow-cert-frame">
          {/* Inner Golden Border */}
          <div className="tow-cert-inner-border">
            {/* Top Logo and Header */}
            <div className="tow-cert-header">
              <img
                src={nebuloidLogo}
                alt="Nebuloid Tech Studio"
                className="tow-cert-logo"
              />
              <div className="tow-cert-eyebrow">
                NEBULOID GAMES &bull; OFFICIAL TOURNAMENT
              </div>
              <h2 className="tow-cert-title">CERTIFICATE OF VICTORY</h2>
              <div className="tow-cert-title-divider" />
            </div>

            {/* Presentation & Winner */}
            <div className="tow-cert-body">
              <p className="tow-cert-presented-text">
                THIS CERTIFICATE IS PROUDLY PRESENTED TO
              </p>
              <h1 className="tow-cert-winner-name">{winnerName}</h1>
              <p className="tow-cert-citation">
                For demonstrating exceptional mental math speed, tactical accuracy,
                and achieving glorious victory in
              </p>
              <div className="tow-cert-tournament-tag">
                MATH TUG OF WAR &bull; {difficulty.toUpperCase()} DIVISION
              </div>
            </div>

            {/* Badges / Meta Info */}
            <div className="tow-cert-meta-row">
              <div className="tow-cert-meta-item">
                <span className="tow-cert-meta-label">DATE</span>
                <span className="tow-cert-meta-val">{formattedDate}</span>
              </div>
              <div className="tow-cert-meta-item">
                <span className="tow-cert-meta-label">DIVISION</span>
                <span className="tow-cert-meta-val">{difficulty} Level</span>
              </div>
              <div className="tow-cert-meta-item">
                <span className="tow-cert-meta-label">SCORE</span>
                <span className="tow-cert-meta-val highlight">
                  {scores[0]} – {scores[1]}
                </span>
              </div>
            </div>

            {/* Footer / Seal */}
            <div className="tow-cert-footer">
              <div className="tow-cert-sign-col">
                <div className="tow-cert-sign-line">Nebuloid Tech Studio</div>
                <div className="tow-cert-sign-caption">
                  Authorized Game Director
                </div>
              </div>

              {/* Rosette Seal */}
              <div className="tow-cert-seal">
                <div className="tow-cert-seal-star">★</div>
                <div className="tow-cert-seal-text">OFFICIAL CHAMPION</div>
              </div>

              <div className="tow-cert-sign-col">
                <div className="tow-cert-sign-line">Math Tug of War</div>
                <div className="tow-cert-sign-caption">Official Arena Record</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS & ACTIONS BAR */}
        <div className="tow-cert-actions-bar">
          <button
            type="button"
            className="tow-cert-btn tow-cert-btn--download"
            onClick={handleDownloadImage}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download Certificate</span>
          </button>

          <button
            type="button"
            className="tow-cert-btn tow-cert-btn--print"
            onClick={handlePrint}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>Print / PDF</span>
          </button>

          {onPlayAgain && (
            <button
              type="button"
              className="tow-cert-btn tow-cert-btn--play"
              onClick={onPlayAgain}
            >
              ▶ Play Again
            </button>
          )}

          {onNewTimer && (
            <button
              type="button"
              className="tow-cert-btn tow-cert-btn--level"
              onClick={onNewTimer}
            >
              Choose Level
            </button>
          )}

          <button
            type="button"
            className="tow-cert-btn tow-cert-btn--close"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}
