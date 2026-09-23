const BEST_SCORE_KEY = 'color_clash_best_score';
const BEST_STREAK_KEY = 'color_clash_best_streak';

/**
 * Calculate streak bonus points awarded for a given consecutive streak count
 * @param {number} streak - Consecutive correct answers before this question
 * @returns {number} Bonus points
 */
export function getStreakBonus(streak) {
  if (streak >= 10) return 20;
  if (streak >= 5) return 10;
  if (streak >= 3) return 5;
  return 0;
}

/**
 * Get streak multiplier label
 * @param {number} streak
 * @returns {string|null}
 */
export function getStreakTier(streak) {
  if (streak >= 10) return "🔥 GODLIKE (x3)";
  if (streak >= 5) return "⚡ ON FIRE (x2)";
  if (streak >= 3) return "✨ WARMING UP";
  return null;
}

/**
 * Retrieve high score from localStorage safely
 */
export function getStoredBestScore() {
  try {
    const val = localStorage.getItem(BEST_SCORE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Save new high score to localStorage
 */
export function saveStoredBestScore(score) {
  try {
    const current = getStoredBestScore();
    if (score > current) {
      localStorage.setItem(BEST_SCORE_KEY, score.toString());
      return true; // Indicates new record!
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Retrieve best streak from localStorage safely
 */
export function getStoredBestStreak() {
  try {
    const val = localStorage.getItem(BEST_STREAK_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Save best streak
 */
export function saveStoredBestStreak(streak) {
  try {
    const current = getStoredBestStreak();
    if (streak > current) {
      localStorage.setItem(BEST_STREAK_KEY, streak.toString());
    }
  } catch {
    // Ignore storage issues
  }
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct, wrong) {
  const total = correct + wrong;
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Derive progressive difficulty from current score
 */
export function getProgressiveDifficulty(score) {
  if (score >= 150) return "HARD";
  if (score >= 60) return "MEDIUM";
  return "EASY";
}

const CERTIFICATES_KEY = 'color_clash_certificates';

/**
 * Retrieve saved certificates from localStorage
 */
export function getStoredCertificates() {
  try {
    const data = localStorage.getItem(CERTIFICATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save newly earned certificate to localStorage (keeps last 30)
 */
export function saveCertificate(cert) {
  try {
    const existing = getStoredCertificates();
    // Prepend new certificate, filter out duplicates by id
    const filtered = existing.filter((c) => c.id !== cert.id);
    const updated = [cert, ...filtered].slice(0, 30);
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Derive prestigious honor title based on accuracy, score, and difficulty
 */
export function getHonorTitle(accuracy, score) {
  if (accuracy === 100 && score >= 120) return "GRANDMASTER VIRTUOSO";
  if (accuracy === 100) return "PERFECT STROOP MASTER";
  if (accuracy >= 90) return "MASTER OF FOCUS & SPEED";
  if (accuracy >= 80) return "AGILE COLOR STRATEGIST";
  if (score >= 200) return "HIGH-OCTANE CHAMPION";
  return "COLOR CLASH CONQUEROR";
}

/**
 * High-resolution (1200x800) Canvas PNG Certificate Generator & Downloader
 */
export function downloadCertificatePNG(cert) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    playerName = 'Champion',
    difficulty = 'EASY',
    stageNumber = 1,
    score = 0,
    accuracy = 100,
    bestStreak = 0,
    stars = 3,
    honorTitle = 'COLOR CLASH CONQUEROR',
    theme = 'royal',
    id = `NEB-CC-S01-${Date.now().toString(36).toUpperCase()}`,
    issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } = cert;

  // Theme styling definitions
  let bgFill = '#ffffff';
  let outerBorder = '#1e3a8a';
  let innerBorder = '#eab308';
  let titleColor = '#0f172a';
  let nameColor = '#1e3a8a';
  let cardBg = '#ffffff';
  let cardBorder = '#cbd5e1';
  let subColor = '#475569';
  let bodyColor = '#334155';
  let badgeBg = '#eab308';
  let badgeText = '#0f172a';

  if (theme === 'cyber') {
    bgFill = '#070b14';
    outerBorder = '#06b6d4';
    innerBorder = '#3b82f6';
    titleColor = '#22d3ee';
    nameColor = '#38bdf8';
    cardBg = '#0f172a';
    cardBorder = '#1e293b';
    subColor = '#94a3b8';
    bodyColor = '#cbd5e1';
    badgeBg = '#06b6d4';
    badgeText = '#030712';
  } else if (theme === 'emerald') {
    bgFill = '#f0fdf4';
    outerBorder = '#065f46';
    innerBorder = '#f59e0b';
    titleColor = '#064e3b';
    nameColor = '#047857';
    cardBg = '#ffffff';
    cardBorder = '#a7f3d0';
    subColor = '#065f46';
    bodyColor = '#1f2937';
    badgeBg = '#059669';
    badgeText = '#ffffff';
  }

  // Background
  ctx.fillStyle = bgFill;
  ctx.fillRect(0, 0, 1200, 800);

  const bgGrad = ctx.createRadialGradient(600, 400, 80, 600, 400, 650);
  if (theme === 'cyber') {
    bgGrad.addColorStop(0, '#0f1b33');
    bgGrad.addColorStop(1, '#050811');
  } else if (theme === 'emerald') {
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#dcfce7');
  } else {
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f1f5f9');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Borders
  ctx.strokeStyle = outerBorder;
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.strokeStyle = innerBorder;
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, 1104, 704);

  // Corner Ornaments
  const drawCornerOrnament = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX, flipY);
    ctx.strokeStyle = innerBorder;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(55, 10);
    ctx.moveTo(10, 10);
    ctx.lineTo(10, 55);
    ctx.stroke();
    ctx.restore();
  };
  drawCornerOrnament(55, 55, 1, 1);
  drawCornerOrnament(1145, 55, -1, 1);
  drawCornerOrnament(55, 745, 1, -1);
  drawCornerOrnament(1145, 745, -1, -1);

  // Header Branding
  ctx.fillStyle = subColor;
  ctx.font = '900 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '5px';
  ctx.fillText('★ NEBULOID GAMES • OFFICIAL MERIT RECOGNITION ★', 600, 105);

  // Main Title
  ctx.fillStyle = titleColor;
  ctx.font = '900 42px sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 168);

  ctx.fillStyle = innerBorder;
  ctx.fillRect(440, 188, 320, 4);

  // Honor Title Badge Pill
  ctx.fillStyle = badgeBg;
  ctx.beginPath();
  ctx.roundRect(400, 205, 400, 34, 17);
  ctx.fill();

  ctx.fillStyle = badgeText;
  ctx.font = '900 15px sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(`★ ${honorTitle.toUpperCase()} ★`, 600, 228);

  // Subtitle
  ctx.fillStyle = subColor;
  ctx.font = 'bold 16px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('THIS PRESTIGIOUS HONOR IS PROUDLY PRESENTED TO', 600, 280);

  // Player Name
  ctx.fillStyle = nameColor;
  ctx.font = '900 52px sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(playerName.toUpperCase(), 600, 350);

  ctx.strokeStyle = innerBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(340, 375);
  ctx.lineTo(860, 375);
  ctx.stroke();

  // Achievement Description
  ctx.fillStyle = bodyColor;
  ctx.font = '500 18px sans-serif';
  ctx.letterSpacing = '0.4px';
  ctx.fillText(
    `For demonstrating superior cognitive agility, lightning speed, and precision in conquering`,
    600,
    420
  );
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = titleColor;
  ctx.fillText(
    `COLOR CLASH — ${difficulty} MODE (STAGE 0${stageNumber})`,
    600,
    450
  );

  // Stats Box
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(240, 480, 720, 110, 16);
  ctx.fill();
  ctx.stroke();

  // Stats text
  ctx.fillStyle = subColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('FINAL SCORE', 340, 515);
  ctx.fillStyle = titleColor;
  ctx.font = '900 28px sans-serif';
  ctx.fillText(`${score} PTS`, 340, 555);

  ctx.fillStyle = subColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('ACCURACY', 540, 515);
  ctx.fillStyle = '#16a34a';
  ctx.font = '900 28px sans-serif';
  ctx.fillText(`${accuracy}%`, 540, 555);

  ctx.fillStyle = subColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('MAX STREAK', 720, 515);
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 28px sans-serif';
  ctx.fillText(`${bestStreak}x`, 720, 555);

  ctx.fillStyle = subColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('MASTERY', 870, 515);
  ctx.fillStyle = '#eab308';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('★'.repeat(stars || 3) + '☆'.repeat(3 - (stars || 3)), 870, 555);

  // Footer & Seal
  ctx.textAlign = 'left';
  ctx.fillStyle = subColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`ISSUE DATE: ${issueDate}`, 110, 655);
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`SERIAL NO: ${id}`, 110, 680);
  ctx.fillText(`PLATFORM: NEBULOID STROOP ENGINE V2.0`, 110, 703);

  // Security QR Matrix Simulation
  ctx.fillStyle = outerBorder;
  ctx.fillRect(890, 645, 44, 44);
  ctx.fillStyle = bgFill;
  ctx.fillRect(894, 649, 36, 36);
  ctx.fillStyle = outerBorder;
  ctx.fillRect(898, 653, 12, 12);
  ctx.fillRect(914, 653, 12, 12);
  ctx.fillRect(898, 669, 12, 12);
  ctx.fillRect(914, 669, 6, 6);

  ctx.textAlign = 'left';
  ctx.fillStyle = outerBorder;
  ctx.font = '900 15px sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('OFFICIALLY VERIFIED MERIT', 945, 665);
  ctx.fillStyle = innerBorder;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('★ NEBULOID TECH CERTIFIED ★', 945, 687);

  const link = document.createElement('a');
  const safeName = (playerName || 'Player').replace(/\s+/g, '_');
  link.download = `ColorClash_Certificate_${safeName}_Stage0${stageNumber}_${theme.toUpperCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
