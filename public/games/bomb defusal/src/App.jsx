import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Brain,
  Bomb,
  BatteryWarning,
  Check,
  ChevronRight,
  Clock3,
  Download,
  Flame,
  LockKeyhole,
  Layers3,
  HelpCircle,
  House,
  UserRound,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

const LEVELS = [
  {
    id: 1,
    kind: "wire",
    title: "Wire Sequence",
    subtitle: "Identify the only safe wire.",
    time: 35,
    brief:
      "The manual says to cut the wire whose number is greater than 4, even, and not divisible by 3.",
    clue: "Greater than 4 • Even • Not divisible by 3",
    options: ["2", "6", "8", "9"],
    answer: "8",
    solution: "Check each option: 2 is not greater than 4; 6 is even but divisible by 3; 8 is greater than 4, even, and not divisible by 3; 9 is odd. Therefore, the safe wire is 8.",
  },
  {
    id: 2,
    kind: "code",
    title: "Code Lock",
    subtitle: "Find the three-digit disarm code.",
    time: 40,
    brief:
      "The code has three digits. The first digit is 2 more than the second. The third digit is twice the second. Their total is 14.",
    clue: "A = B + 2 • C = 2B • A + B + C = 14",
    options: ["648", "452", "365", "524"],
    answer: "648",
    solution: "Let the second digit be B. Then A = B + 2 and C = 2B. The total is 14, so 3B + 2 = 14, giving B = 4. Therefore A = 6 and C = 8. The correct code is 648.",
  },
  {
    id: 3,
    kind: "switch",
    title: "Switch Logic",
    subtitle: "Set the switches to the safe state.",
    time: 40,
    brief:
      "Switch A must be ON. Switch B must be opposite to A. Switch C must be OFF.",
    clue: "A = ON • B ≠ A • C = OFF",
    options: [
      "A ON / B OFF / C OFF",
      "A OFF / B ON / C OFF",
      "A ON / B ON / C OFF",
      "A ON / B OFF / C ON",
    ],
    answer: "A ON / B OFF / C OFF",
    solution: "A must be ON. B must be the opposite of A, so B is OFF. C must be OFF. The only option matching all three conditions is A ON / B OFF / C OFF.",
  },
  {
    id: 4,
    kind: "symbol",
    title: "Symbol Decoder",
    subtitle: "Decode the mathematical symbol lock.",
    time: 40,
    brief:
      "Triangle equals 2, circle equals 4, and square equals 6. What is triangle + circle × square?",
    clue: "Multiplication is performed before addition.",
    options: ["26", "50", "14", "30"],
    answer: "26",
    solution: "Triangle = 2, circle = 4, square = 6. Multiplication comes first, so 4 × 6 = 24, then 24 + 2 = 26.",
  },
  {
    id: 5,
    kind: "sequence",
    title: "Fuse Order",
    subtitle: "Activate the fuses in the safe order.",
    time: 40,
    brief:
      "Fuse C must be activated first. Fuse A must be activated immediately before Fuse B.",
    clue: "C is first • A immediately precedes B",
    options: ["C → A → B", "A → C → B", "B → A → C", "C → B → A"],
    answer: "C → A → B",
    solution: "C has to be first. A must immediately precede B, so after C the only valid pair is A → B. Therefore the safe order is C → A → B.",
  },
  {
    id: 6,
    kind: "valve",
    title: "Pressure Chamber",
    subtitle: "Choose the valve that reaches safe pressure.",
    time: 40,
    brief:
      "Current pressure is 9. Valve 1 lowers pressure by 2. Valve 2 raises it by 5. Valve 3 lowers it by 6. Safe pressure is exactly 7.",
    clue: "9 must become exactly 7.",
    options: ["Valve 1", "Valve 2", "Valve 3", "Do nothing"],
    answer: "Valve 1",
    solution: "The current pressure is 9 and the target is 7. Valve 1 lowers pressure by 2, giving 9 − 2 = 7. Valve 2 gives 14 and Valve 3 gives 3. Therefore choose Valve 1.",
  },
  {
    id: 7,
    kind: "circuit",
    title: "Circuit Path",
    subtitle: "Route the signal around the dead node.",
    time: 45,
    brief:
      "The signal must travel from START to END. Node B is dead. Select the safe path.",
    clue: "Never enter node B.",
    options: [
      "START → A → C → END",
      "START → B → C → END",
      "START → A → B → END",
      "START → B → A → END",
    ],
    answer: "START → A → C → END",
    solution: "Node B is forbidden. The route START → A → C → END reaches the destination without entering B, so it is the only safe path.",
  },
  {
    id: 8,
    kind: "binary",
    title: "Binary Lock",
    subtitle: "Convert the binary instruction.",
    time: 40,
    brief: "The bomb display reads 1011. Enter its decimal value.",
    clue: "1011₂ = 8 + 2 + 1",
    options: ["9", "10", "11", "12"],
    answer: "11",
    solution: "For 1011₂, the place values are 8, 4, 2, and 1. The 1-bits are 8 + 2 + 1 = 11. Therefore the decimal value is 11.",
  },
  {
    id: 9,
    kind: "master",
    title: "Master Code",
    subtitle: "Combine all three clues.",
    time: 45,
    brief:
      "The master code is even, greater than 20, less than 30, and its digits add up to 8.",
    clue: "20 < code < 30 • Even • Digit sum = 8",
    options: ["22", "24", "26", "28"],
    answer: "26",
    solution: "The number must be between 20 and 30, even, and have a digit sum of 8. 22 sums to 4, 24 sums to 6, 26 sums to 8, and 28 sums to 10. Therefore the answer is 26.",
  },
  {
    id: 10,
    kind: "final",
    title: "Final Bomb",
    subtitle: "One last deduction. Defuse it.",
    time: 55,
    brief:
      "Four numbers are shown: 1, 3, 6, 10. The manual says to enter the next number in the pattern.",
    clue: "The gaps are +2, +3, +4, so the next gap is +5.",
    options: ["12", "14", "15", "16"],
    answer: "15",
    solution: "The differences are +2, +3, and +4. The next difference is +5, so 10 + 5 = 15.",
  },
];

const shuffleArray = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createMission = () =>
  shuffleArray(LEVELS).map((item) => ({ ...item, options: shuffleArray(item.options) }));

function App() {
  const [screen, setScreen] = useState("landing");
  const [name, setName] = useState("");

  useEffect(() => {
    if (screen === "name") {
      setName("");
    }
  }, [screen]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].time);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [completedLevel, setCompletedLevel] = useState(0);
  const [missionLevels, setMissionLevels] = useState(() => createMission());
  const [failureReason, setFailureReason] = useState("wrong");

  const level = missionLevels[levelIndex] || LEVELS[0];

  useEffect(() => {
    if (screen !== "game") return;

    if (timeLeft <= 0) {
      setFailureReason("timeout");
      setScreen("gameover");
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, timeLeft]);

  const progress = ((levelIndex + 1) / LEVELS.length) * 100;
  const timerProgress = Math.max(0, Math.min(100, (timeLeft / level.time) * 100));
  const danger = timeLeft <= 10;

  const startMission = () => {
    if (!name.trim()) return;
    const mission = createMission();
    setMissionLevels(mission);
    setLevelIndex(0);
    setSelected("");
    setScore(0);
    setCompletedLevel(0);
    setFailureReason("wrong");
    setTimeLeft(mission[0].time);
    setScreen("game");
  };

  const submit = () => {
    if (!selected) return;

    if (selected !== level.answer) {
      setFailureReason("wrong");
      setScreen("gameover");
      return;
    }

    const earned = 100 + timeLeft * 5;
    setScore((value) => value + earned);
    setCompletedLevel(levelIndex + 1);
    setScreen("complete");
  };

  const nextLevel = () => {
    if (levelIndex === LEVELS.length - 1) {
      setScreen("final");
      return;
    }

    const nextIndex = levelIndex + 1;
    setLevelIndex(nextIndex);
    setSelected("");
    setFailureReason("wrong");
    setTimeLeft(missionLevels[nextIndex].time);
    setScreen("game");
  };

  const retry = () => {
    // A new mission starts with a fresh operative registration.
    const mission = createMission();
    setName("");
    setMissionLevels(mission);
    setLevelIndex(0);
    setSelected("");
    setScore(0);
    setCompletedLevel(0);
    setFailureReason("wrong");
    setTimeLeft(mission[0].time);
    setScreen("name");
  };

  const playAgain = () => {
    setName("");
    setLevelIndex(0);
    setSelected("");
    setScore(0);
    setCompletedLevel(0);
    setTimeLeft(LEVELS[0].time);
    setScreen("name");
  };

  const downloadCertificate = async (finalCertificate = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 1250;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#030406");
    bg.addColorStop(0.5, "#0b0b10");
    bg.addColorStop(1, "#030406");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle red industrial glow.
    const glow = ctx.createRadialGradient(1000, 590, 40, 1000, 590, 900);
    glow.addColorStop(0, "rgba(220,38,38,.15)");
    glow.addColorStop(.5, "rgba(220,38,38,.045)");
    glow.addColorStop(1, "rgba(220,38,38,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Technical grid.
    ctx.strokeStyle = "rgba(255,255,255,.022)";
    ctx.lineWidth = 1;
    for (let x = 70; x < 1930; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 70);
      ctx.lineTo(x, 1180);
      ctx.stroke();
    }
    for (let y = 70; y < 1180; y += 48) {
      ctx.beginPath();
      ctx.moveTo(70, y);
      ctx.lineTo(1930, y);
      ctx.stroke();
    }

    // ===== SIDE BOMB ILLUSTRATIONS =====
    // Drawn completely in canvas so the downloaded PNG contains the bombs.
    const drawBomb = (cx, cy, scale, mirror = false) => {
      ctx.save();
      ctx.translate(cx, cy);
      if (mirror) ctx.scale(-1, 1);
      ctx.rotate(-0.08);

      // Glow behind bomb.
      const bombGlow = ctx.createRadialGradient(0, 15, 5, 0, 15, 250 * scale);
      bombGlow.addColorStop(0, "rgba(255,45,35,.25)");
      bombGlow.addColorStop(1, "rgba(255,45,35,0)");
      ctx.fillStyle = bombGlow;
      ctx.fillRect(-260 * scale, -170 * scale, 520 * scale, 340 * scale);

      // Main explosive cylinder.
      const bodyW = 330 * scale;
      const bodyH = 145 * scale;
      const bx = -bodyW / 2;
      const by = -bodyH / 2 + 35 * scale;

      const body = ctx.createLinearGradient(0, by, 0, by + bodyH);
      body.addColorStop(0, "#b63a31");
      body.addColorStop(.35, "#72201e");
      body.addColorStop(1, "#120709");
      ctx.fillStyle = body;
      ctx.strokeStyle = "#050607";
      ctx.lineWidth = 12 * scale;
      ctx.beginPath();
      ctx.roundRect(bx, by, bodyW, bodyH, 28 * scale);
      ctx.fill();
      ctx.stroke();

      // Highlight on top edge.
      ctx.strokeStyle = "rgba(255,130,110,.32)";
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.moveTo(bx + 28 * scale, by + 12 * scale);
      ctx.lineTo(bx + bodyW - 35 * scale, by + 12 * scale);
      ctx.stroke();

      // Metal bands.
      [0.16, 0.50, 0.84].forEach((p) => {
        const x = bx + bodyW * p;
        const band = ctx.createLinearGradient(x - 14 * scale, 0, x + 14 * scale, 0);
        band.addColorStop(0, "#121619");
        band.addColorStop(.35, "#aeb6ba");
        band.addColorStop(.55, "#4b5358");
        band.addColorStop(1, "#090b0d");
        ctx.fillStyle = band;
        ctx.strokeStyle = "#020304";
        ctx.lineWidth = 5 * scale;
        ctx.beginPath();
        ctx.roundRect(x - 15 * scale, by - 9 * scale, 30 * scale, bodyH + 18 * scale, 12 * scale);
        ctx.fill();
        ctx.stroke();
      });

      // End cap.
      const capX = bx + bodyW + 5 * scale;
      const capGrad = ctx.createLinearGradient(capX, by, capX + 48 * scale, by);
      capGrad.addColorStop(0, "#818a90");
      capGrad.addColorStop(.45, "#3a4247");
      capGrad.addColorStop(1, "#080a0c");
      ctx.fillStyle = capGrad;
      ctx.strokeStyle = "#030405";
      ctx.lineWidth = 8 * scale;
      ctx.beginPath();
      ctx.roundRect(capX, by + 20 * scale, 50 * scale, bodyH - 40 * scale, 22 * scale);
      ctx.fill();
      ctx.stroke();

      // Digital timer housing.
      const tx = bx + bodyW * .27;
      const ty = by + bodyH * .47;
      const tw = 205 * scale;
      const th = 75 * scale;
      ctx.fillStyle = "#151a1e";
      ctx.strokeStyle = "#030405";
      ctx.lineWidth = 8 * scale;
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, th, 12 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#050202";
      ctx.strokeStyle = "#8d1517";
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.roundRect(tx + 9 * scale, ty + 9 * scale, tw - 18 * scale, th - 18 * scale, 6 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = "rgba(255,25,20,.9)";
      ctx.shadowBlur = 13 * scale;
      ctx.fillStyle = "#ff4b45";
      ctx.font = `900 ${34 * scale}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("00:30", tx + tw / 2, ty + th / 2 + 1 * scale);
      ctx.shadowBlur = 0;

      // Three wires coming out of the top.
      const wireColors = ["#ef3832", "#f2b51d", "#3186e8"];
      const wireAngles = [-0.35, -0.08, 0.22];
      wireColors.forEach((color, i) => {
        const wx = bx + bodyW * (.28 + i * .20);
        const wy = by + 2 * scale;
        const len = 115 * scale;
        ctx.strokeStyle = "#050607";
        ctx.lineWidth = 14 * scale;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + Math.sin(wireAngles[i]) * len, wy - Math.cos(wireAngles[i]) * len);
        ctx.stroke();

        ctx.strokeStyle = color;
        ctx.lineWidth = 8 * scale;
        ctx.shadowColor = color;
        ctx.shadowBlur = 7 * scale;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + Math.sin(wireAngles[i]) * len, wy - Math.cos(wireAngles[i]) * len);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Small warning LED.
      ctx.fillStyle = "#ff5148";
      ctx.shadowColor = "#ff2218";
      ctx.shadowBlur = 15 * scale;
      ctx.beginPath();
      ctx.arc(bx + 32 * scale, by + bodyH / 2, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    };

    // Put them partly off-canvas, framing the certificate without covering it.
    drawBomb(110, 735, 1.08, false);
    drawBomb(1890, 735, 1.08, true);

    // Main double frame.
    ctx.strokeStyle = "#ef3038";
    ctx.lineWidth = 8;
    ctx.strokeRect(48, 48, 1904, 1154);
    ctx.strokeStyle = "rgba(148,163,184,.62)";
    ctx.lineWidth = 2;
    ctx.strokeRect(75, 75, 1850, 1100);
    ctx.strokeStyle = "rgba(239,48,56,.32)";
    ctx.strokeRect(96, 96, 1808, 1058);

    // Corner brackets.
    ctx.strokeStyle = "#ff3038";
    ctx.lineWidth = 7;
    const corner = 62;
    [
      [118, 118, 1, 1], [1882, 118, -1, 1],
      [118, 1132, 1, -1], [1882, 1132, -1, -1],
    ].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + sy * corner);
      ctx.lineTo(x, y);
      ctx.lineTo(x + sx * corner, y);
      ctx.stroke();
    });

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Logo.
    try {
      const logo = new Image();
      logo.src = "/logo.png";
      await new Promise((resolve) => {
        logo.onload = resolve;
        logo.onerror = resolve;
      });
      if (logo.complete && logo.naturalWidth) {
        const maxW = 300, maxH = 105;
        const ratio = Math.min(maxW / logo.naturalWidth, maxH / logo.naturalHeight);
        const w = logo.naturalWidth * ratio, h = logo.naturalHeight * ratio;
        ctx.drawImage(logo, 1000 - w / 2, 145 - h / 2, w, h);
      }
    } catch (_) {}

    ctx.fillStyle = "#ff4047";
    ctx.font = "900 30px Arial, sans-serif";
    ctx.fillText("BOMB DEFUSAL COMMAND", 1000, 245);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 78px Arial, sans-serif";
    ctx.fillText(
      finalCertificate ? "MASTER DEFUSAL CERTIFICATE" : "DEFUSAL CERTIFICATE",
      1000, 335
    );

    ctx.fillStyle = "#ef3038";
    ctx.fillRect(675, 390, 650, 4);
    ctx.beginPath();
    ctx.arc(1000, 392, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a8b1bf";
    ctx.font = "800 25px Arial, sans-serif";
    ctx.fillText("THIS CERTIFICATE IS PROUDLY PRESENTED TO", 1000, 450);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 68px Arial, sans-serif";
    ctx.fillText(String(name || "OPERATIVE").slice(0, 30), 1000, 525);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "600 25px Arial, sans-serif";
    ctx.fillText(
      finalCertificate
        ? "for successfully completing all ten bomb-defusal training missions."
        : `for successfully defusing Bomb ${completedLevel}.`,
      1000, 580
    );

    // Result panel.
    const panelX = 535, panelY = 635, panelW = 930, panelH = 145;
    ctx.fillStyle = "rgba(15,23,42,.94)";
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = "rgba(239,48,56,.72)";
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    ctx.strokeStyle = "rgba(255,255,255,.10)";
    ctx.beginPath();
    ctx.moveTo(1000, panelY + 20);
    ctx.lineTo(1000, panelY + panelH - 20);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "900 17px Arial, sans-serif";
    ctx.fillText("MISSION", 770, 675);
    ctx.fillText("RESULT", 1000, 675);
    ctx.fillText("SCORE", 1230, 675);

    ctx.fillStyle = "#ff4047";
    ctx.font = "900 31px Arial, sans-serif";
    ctx.fillText(finalCertificate ? "10 / 10" : `LEVEL ${completedLevel}`, 770, 725);

    ctx.fillStyle = "#22c55e";
    ctx.fillText("DEFUSED", 1000, 725);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(String(score), 1230, 725);

    // Seal.
    ctx.strokeStyle = "#ef3038";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1000, 870, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1000, 870, 39, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ff4047";
    ctx.font = "900 22px Arial, sans-serif";
    ctx.fillText(finalCertificate ? "BD" : "✓", 1000, 870);

    // Signatures.
    ctx.strokeStyle = "rgba(203,213,225,.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(485, 975); ctx.lineTo(800, 975);
    ctx.moveTo(1200, 975); ctx.lineTo(1515, 975);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "900 15px Arial, sans-serif";
    ctx.fillText("AUTHORIZED OPERATIVE", 642, 1008);
    ctx.fillText("TRAINING DIVISION", 1358, 1008);

    ctx.fillStyle = "rgba(239,48,56,.5)";
    ctx.fillRect(475, 1060, 1050, 2);

    ctx.fillStyle = "#d1d5db";
    ctx.font = "900 19px Arial, sans-serif";
    ctx.fillText("BOMB DEFUSAL TRAINING DIVISION", 1000, 1095);

    ctx.fillStyle = "#64748b";
    ctx.font = "600 14px Arial, sans-serif";
    ctx.fillText("AUTHORIZED OPERATIVE RECORD  •  NEBULOID TECH STUDIO LLP", 1000, 1125);

    const link = document.createElement("a");
    link.download = finalCertificate
      ? "Bomb-Defusal-Master-Certificate.png"
      : `Bomb-Defusal-Level-${completedLevel}-Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <Background />

      {screen === "landing" && (
        <Landing
          onStart={() => setScreen("name")}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "name" && (
        <NameEntry
          name={name}
          setName={setName}
          onStart={startMission}
          onBack={() => setScreen("landing")}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "game" && (
        <Game
          level={level}
          levelIndex={levelIndex}
          progress={progress}
          timerProgress={timerProgress}
          timeLeft={timeLeft}
          danger={danger}
          selected={selected}
          setSelected={setSelected}
          submit={submit}
          score={score}
          name={name}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "complete" && (
        <LevelComplete
          level={completedLevel}
          score={score}
          name={name}
          onDownload={() => downloadCertificate(false)}
          onNext={nextLevel}
        />
      )}

      {screen === "gameover" && (
        <GameOver
          level={level}
          selected={selected}
          reason={failureReason}
          onRetry={retry}
          onHome={() => { setName(""); setScreen("landing"); }}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "final" && (
        <FinalCertificate
          name={name}
          score={score}
          onDownload={() => downloadCertificate(true)}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/[0.035] blur-[130px]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
    </div>
  );
}

function Header({ soundOn, setSoundOn, showSound = true }) {
  return (
    <header className="relative border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Bomb Defusal"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
        </div>

        {showSound && (
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        )}
      </div>
    </header>
  );
}

function Shell({ children, ...headerProps }) {
  return (
    <div className="relative min-h-screen">
      <Header {...headerProps} />
      <main className="relative px-5 py-9 md:px-8 md:py-14">{children}</main>
    </div>
  );
}

function Landing({ onStart, soundOn, setSoundOn }) {
  return (
    <div className="relative h-screen min-h-[620px] overflow-hidden bg-[#070303] text-white">
      {/* Red industrial bomb-room backdrop — CSS only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* cinematic red/black atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,30,20,.30),transparent_28%),radial-gradient(circle_at_12%_60%,rgba(255,35,20,.18),transparent_28%),radial-gradient(circle_at_88%_55%,rgba(255,35,20,.20),transparent_30%),linear-gradient(180deg,#170202_0%,#090303_48%,#030202_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,.72)_100%)]" />

        {/* ceiling beams */}
        <div className="absolute -left-[7%] top-[7%] h-8 w-[46%] rotate-[18deg] rounded-full border-[7px] border-[#16090a] bg-gradient-to-b from-[#4a3030] via-[#1e1112] to-[#090607] shadow-[0_0_22px_rgba(255,25,20,.18)] md:h-12 md:border-[10px]" />
        <div className="absolute -right-[8%] top-[8%] h-8 w-[45%] rotate-[-20deg] rounded-full border-[7px] border-[#16090a] bg-gradient-to-b from-[#4a3030] via-[#1e1112] to-[#090607] shadow-[0_0_22px_rgba(255,25,20,.18)] md:h-12 md:border-[10px]" />

        {/* glowing ceiling lights */}
        {[
          "left-[18%] top-[8%] rotate-[52deg]",
          "right-[17%] top-[10%] rotate-[-52deg]",
          "left-[47%] top-[-1%] rotate-[90deg]",
          "right-[4%] top-[28%] rotate-[90deg]",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} h-20 w-3 rounded-full bg-red-500 shadow-[0_0_18px_7px_rgba(239,68,68,.62)] md:h-28 md:w-4`}
          />
        ))}

        {/* rear wall panels */}
        <div className="absolute left-[17%] top-[22%] h-[45%] w-[66%] border-x border-red-900/40 bg-black/20" />
        <div className="absolute left-[28%] top-[20%] h-[47%] w-px bg-red-800/25" />
        <div className="absolute left-[50%] top-[19%] h-[48%] w-px bg-red-800/25" />
        <div className="absolute left-[71%] top-[21%] h-[46%] w-px bg-red-800/25" />

        {/* back red lights */}
        <div className="absolute left-[35%] top-[48%] h-2 w-[13%] rounded-full bg-red-400 shadow-[0_0_20px_6px_rgba(239,68,68,.42)]" />
        <div className="absolute right-[18%] top-[48%] h-2 w-[14%] rounded-full bg-red-400 shadow-[0_0_20px_6px_rgba(239,68,68,.42)]" />

        {/* left warning crate */}
        <div className="absolute bottom-[21%] left-[-3%] h-[42%] w-[20%] rounded-xl border-[8px] border-[#180b0b] bg-gradient-to-br from-[#392020] via-[#170d0e] to-[#080505] shadow-[0_20px_40px_rgba(0,0,0,.75)] md:border-[11px]">
          <div className="absolute inset-3 rounded-lg border border-red-900/40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] text-[55px] font-black text-orange-600/80 md:text-[80px]">
            !
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-red-200/55 md:text-xs">
            WARNING
          </div>
        </div>

        {/* right warning crate */}
        <div className="absolute bottom-[17%] right-[-3%] h-[39%] w-[22%] rotate-[-3deg] rounded-xl border-[8px] border-[#180b0b] bg-gradient-to-br from-[#3b2020] via-[#160b0c] to-[#070404] shadow-[0_20px_45px_rgba(0,0,0,.8)] md:border-[11px]">
          <div className="absolute inset-3 rounded-lg border border-red-900/40" />
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 text-center text-[19px] font-black uppercase leading-tight tracking-[0.08em] text-white/55 md:text-[29px]">
            DEFUSE<br />BEFORE<br />IT'S TOO LATE
          </div>
        </div>

        {/* left bomb cylinders */}
        <div className="absolute bottom-[5%] left-[-7%] h-[25%] w-[34%] rotate-[3deg] md:h-[28%] md:w-[35%]">
          <div className="absolute left-0 top-[18%] h-[28%] w-full rounded-full border-[8px] border-[#12090a] bg-gradient-to-b from-[#a42b22] via-[#401312] to-[#110708] shadow-[inset_0_4px_7px_rgba(255,130,100,.25),0_18px_30px_rgba(0,0,0,.8)] md:border-[11px]" />
          <div className="absolute left-[4%] top-[49%] h-[28%] w-[84%] rounded-full border-[8px] border-[#12090a] bg-gradient-to-b from-[#92231d] via-[#3a1111] to-[#100607] shadow-[0_18px_30px_rgba(0,0,0,.8)] md:border-[11px]" />
          <div className="absolute left-[14%] top-0 h-full w-5 rounded-full bg-[#090707] shadow-[0_0_0_5px_#2a1616] md:w-7" />
          <div className="absolute left-[48%] top-0 h-full w-5 rounded-full bg-[#090707] shadow-[0_0_0_5px_#2a1616] md:w-7" />
          <div className="absolute right-[2%] top-[3%] h-12 w-[28%] rotate-[30deg] rounded-full border-4 border-[#1a0b0b] bg-[#5a241d] md:h-16" />
          <div className="absolute right-[14%] top-[8%] h-10 w-3 rotate-[38deg] rounded-full bg-[#b46a27] md:h-14" />
        </div>

        {/* timer attached to left bomb */}
        <div className="absolute bottom-[22%] left-[10%] z-10 flex h-[74px] w-[170px] -rotate-[3deg] items-center justify-center rounded-xl border-[6px] border-[#171010] bg-[#211416] shadow-[0_12px_30px_rgba(0,0,0,.8),inset_0_0_15px_rgba(0,0,0,.9)] sm:h-[88px] sm:w-[205px] md:h-[105px] md:w-[245px] md:border-[8px]">
          <div className="flex h-[78%] w-[86%] items-center justify-center rounded-md border-2 border-red-950 bg-[#070304] shadow-[inset_0_0_18px_rgba(255,0,0,.18)]">
            <span className="font-mono text-[31px] font-black tracking-tight text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,.9)] sm:text-[38px] md:text-[49px]">
              00:30
            </span>
          </div>
        </div>

        {/* foreground cable */}
        <div className="absolute bottom-[2%] left-[2%] h-4 w-[35%] rotate-[13deg] rounded-full bg-gradient-to-r from-black via-[#4a1714] to-black shadow-[0_8px_15px_rgba(0,0,0,.9)] md:h-7" />
        <div className="absolute bottom-[2%] right-[-2%] h-5 w-[27%] rotate-[-19deg] rounded-full bg-gradient-to-r from-black via-[#5a1b15] to-black shadow-[0_8px_15px_rgba(0,0,0,.9)] md:h-8" />

        {/* floor */}
        <div className="absolute inset-x-0 bottom-0 h-[27%] bg-[linear-gradient(180deg,rgba(18,7,7,.05),rgba(3,2,2,.92)),repeating-linear-gradient(90deg,rgba(255,70,50,.10)_0_1px,transparent_1px_95px)]" />
        <div className="absolute bottom-0 left-1/2 h-[34%] w-[75%] -translate-x-1/2 rounded-full bg-red-700/20 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[16%] h-px w-[68%] bg-red-400/20 shadow-[0_20px_0_rgba(255,50,40,.10),0_40px_0_rgba(255,50,40,.07)]" />

        {/* smoke */}
        <div className="absolute bottom-[26%] left-[30%] h-[26%] w-[28%] rounded-full bg-red-200/[0.035] blur-[35px]" />
        <div className="absolute bottom-[30%] right-[28%] h-[24%] w-[22%] rounded-full bg-red-100/[0.035] blur-[35px]" />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,.28)_58%,rgba(0,0,0,.86)_100%)]" />
      </div>

      {/* top-corner bombs — decorative only */}
      <div className="pointer-events-none absolute left-[1.5%] top-[4.5%] z-10 h-[105px] w-[215px] sm:h-[125px] sm:w-[255px] md:h-[145px] md:w-[300px]">
        <div className="absolute left-[17%] top-[30%] h-[58px] w-[67%] rotate-[-7deg] rounded-[18px] border-[5px] border-[#10090a] bg-gradient-to-b from-[#6b2420] via-[#351011] to-[#0d0607] shadow-[0_0_22px_rgba(255,25,20,.35),inset_0_5px_8px_rgba(255,120,90,.18)] sm:h-[70px] md:h-[82px]">
          <div className="absolute left-[7%] top-1/2 h-[30px] w-[24px] -translate-y-1/2 rounded-md border-2 border-[#171010] bg-[#151112] shadow-[inset_0_0_8px_rgba(255,0,0,.25)] sm:h-[38px] sm:w-[30px] md:h-[44px] md:w-[35px]">
            <span className="absolute inset-[5px] rounded-sm border border-red-700/70 bg-[#070304] shadow-[0_0_8px_rgba(255,0,0,.35)]" />
          </div>
          <div className="absolute right-[6%] top-1/2 h-[31px] w-[31px] -translate-y-1/2 rounded-full border-4 border-[#160b0b] bg-gradient-to-br from-[#a83a2d] to-[#2a0b0b] sm:h-[38px] sm:w-[38px] md:h-[44px] md:w-[44px]" />
          <div className="absolute left-[44%] top-[-7px] h-[12px] w-[28px] rounded-full border-2 border-[#11090a] bg-[#b43a2f] sm:w-[34px] md:w-[40px]" />
        </div>
        <div className="absolute left-[22%] top-[11%] h-[52px] w-[7px] rotate-[-25deg] rounded-full bg-[#e43b32] shadow-[0_0_12px_4px_rgba(239,68,68,.55)] sm:h-[62px] md:h-[72px]" />
        <div className="absolute left-[31%] top-[1%] h-[58px] w-[6px] rotate-[18deg] rounded-full bg-[#d79b2d] shadow-[0_0_10px_3px_rgba(234,179,8,.35)] sm:h-[68px] md:h-[78px]" />
        <div className="absolute left-[41%] top-[-2%] h-[57px] w-[6px] rotate-[34deg] rounded-full bg-[#1976d2] shadow-[0_0_10px_3px_rgba(59,130,246,.3)] sm:h-[68px] md:h-[78px]" />
      </div>

      <div className="pointer-events-none absolute right-[1.5%] top-[4.5%] z-10 h-[105px] w-[215px] scale-x-[-1] sm:h-[125px] sm:w-[255px] md:h-[145px] md:w-[300px]">
        <div className="absolute left-[17%] top-[30%] h-[58px] w-[67%] rotate-[-7deg] rounded-[18px] border-[5px] border-[#10090a] bg-gradient-to-b from-[#6b2420] via-[#351011] to-[#0d0607] shadow-[0_0_22px_rgba(255,25,20,.35),inset_0_5px_8px_rgba(255,120,90,.18)] sm:h-[70px] md:h-[82px]">
          <div className="absolute left-[7%] top-1/2 h-[30px] w-[24px] -translate-y-1/2 rounded-md border-2 border-[#171010] bg-[#151112] shadow-[inset_0_0_8px_rgba(255,0,0,.25)] sm:h-[38px] sm:w-[30px] md:h-[44px] md:w-[35px]">
            <span className="absolute inset-[5px] rounded-sm border border-red-700/70 bg-[#070304] shadow-[0_0_8px_rgba(255,0,0,.35)]" />
          </div>
          <div className="absolute right-[6%] top-1/2 h-[31px] w-[31px] -translate-y-1/2 rounded-full border-4 border-[#160b0b] bg-gradient-to-br from-[#a83a2d] to-[#2a0b0b] sm:h-[38px] sm:w-[38px] md:h-[44px] md:w-[44px]" />
          <div className="absolute left-[44%] top-[-7px] h-[12px] w-[28px] rounded-full border-2 border-[#11090a] bg-[#b43a2f] sm:w-[34px] md:w-[40px]" />
        </div>
        <div className="absolute left-[22%] top-[11%] h-[52px] w-[7px] rotate-[-25deg] rounded-full bg-[#e43b32] shadow-[0_0_12px_4px_rgba(239,68,68,.55)] sm:h-[62px] md:h-[72px]" />
        <div className="absolute left-[31%] top-[1%] h-[58px] w-[6px] rotate-[18deg] rounded-full bg-[#d79b2d] shadow-[0_0_10px_3px_rgba(234,179,8,.35)] sm:h-[68px] md:h-[78px]" />
        <div className="absolute left-[41%] top-[-2%] h-[57px] w-[6px] rotate-[34deg] rounded-full bg-[#1976d2] shadow-[0_0_10px_3px_rgba(59,130,246,.3)] sm:h-[68px] md:h-[78px]" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col px-6 py-5 sm:px-9 md:px-14 md:py-7">
        {/* logo — fixed to the top-center without affecting the page layout */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 sm:top-0 md:top-0">
          <img
            src="/logo.png"
            alt="Nebuloid Tech"
            className="h-auto w-[300px] max-w-none object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,.8)] sm:w-[360px] md:w-[420px]"
          />
        </div>

        {/* title + start */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <div className="mb-2 flex w-full max-w-[760px] items-center justify-center gap-4 text-[13px] font-semibold uppercase tracking-[0.46em] text-white/90 sm:text-base md:text-[19px]">
            <span className="h-[2px] flex-1 bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,.65)]" />
            <span>Welcome To</span>
            <span className="h-[2px] flex-1 bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,.65)]" />
          </div>

          <h1
            className="font-serif text-[48px] font-black uppercase italic leading-[0.88] tracking-[-0.02em] text-white sm:text-[68px] md:text-[92px] lg:text-[112px]"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,.55)",
              textShadow:
                "0 4px 0 #640000, 0 8px 0 #2b0000, 0 0 18px rgba(255,0,0,.75), 0 12px 32px rgba(0,0,0,.8)",
            }}
          >
            <span className="text-white">Bomb</span>{" "}
            <span className="bg-gradient-to-b from-[#ff6961] via-[#f21b14] to-[#850000] bg-clip-text text-transparent">
              Defusal
            </span>
          </h1>

          <button
            onClick={onStart}
            aria-label="Start Bomb Defusal"
            className="group relative mt-7 flex h-[176px] w-[176px] items-center justify-center rounded-full border-[5px] border-red-300 bg-[radial-gradient(circle_at_45%_38%,#ff3b31_0%,#e3130e_30%,#7a0000_62%,#170000_100%)] text-white shadow-[0_0_0_7px_rgba(45,0,0,.95),0_0_28px_rgba(255,0,0,.9),0_0_65px_rgba(255,0,0,.34),inset_0_0_35px_rgba(255,90,70,.55)] transition duration-300 hover:scale-[1.035] hover:shadow-[0_0_0_8px_rgba(75,0,0,.98),0_0_45px_rgba(255,0,0,1),0_0_90px_rgba(255,0,0,.42),inset_0_0_45px_rgba(255,100,70,.7)] active:scale-95 sm:h-[210px] sm:w-[210px] md:mt-8 md:h-[255px] md:w-[255px] lg:h-[280px] lg:w-[280px]"
          >
            <span className="absolute inset-[8px] rounded-full border-2 border-red-100/80" />
            <span className="absolute inset-[-12px] rounded-full border-[3px] border-red-500/55" />
            <span className="absolute inset-[-21px] rounded-full border-[7px] border-red-600/25 border-t-red-300 border-r-transparent rotate-[-30deg] transition-transform duration-700 group-hover:rotate-[20deg]" />
            <span className="absolute inset-[-30px] rounded-full border border-red-500/20" />
            <span className="relative z-10 font-sans text-[38px] font-black uppercase tracking-[0.02em] drop-shadow-[0_3px_4px_rgba(0,0,0,.8)] sm:text-[45px] md:text-[54px] lg:text-[60px]">
              Start
            </span>
          </button>
        </div>

        {/* bottom status strip */}
        <div className="flex justify-center pb-1 md:pb-2">
          <div className="flex items-center gap-3 rounded-full border border-red-500/35 bg-black/45 px-5 py-2 text-[9px] font-black uppercase tracking-[0.28em] text-red-100/70 backdrop-blur-md sm:text-[10px]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_3px_rgba(239,68,68,.65)]" />
            DEFUSAL SYSTEM ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}


function FloatingKeyboard({ value, onChange, onEnter, onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = React.useRef(null);

  const rows = [
    ["1","2","3","4","5","6","7","8","9","0"],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
  ];

  const press = (key) => {
    if (key === "BACKSPACE") onChange(value.slice(0, -1));
    else if (key === "SPACE") onChange(value + " ");
    else if (key === "ENTER") onEnter();
    else onChange(value + key);
  };

  const startDrag = (event) => {
    if (event.target.closest("button")) return;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: position.x,
      baseY: position.y,
    };
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", stopDrag);
  };

  const moveDrag = (event) => {
    if (!dragRef.current) return;
    setPosition({
      x: dragRef.current.baseX + event.clientX - dragRef.current.startX,
      y: dragRef.current.baseY + event.clientY - dragRef.current.startY,
    });
  };

  const stopDrag = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", stopDrag);
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[9999] w-[min(720px,calc(100vw-24px))] -translate-x-1/2 rounded-2xl border border-slate-600 bg-[#101722]/98 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,.55)] backdrop-blur-xl"
      style={{ transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)` }}
    >
      <div
        onPointerDown={startDrag}
        className="flex h-7 items-center justify-between px-1 pb-1 text-[9px] font-black tracking-[.16em] text-slate-400"
      >
        <span>ON-SCREEN KEYBOARD</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-base leading-none text-white"
        >
          ×
        </button>
      </div>

      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="mt-1 flex gap-1">
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              className="h-9 min-w-0 flex-1 rounded-md border border-slate-600 bg-[#1a2531] text-[11px] font-extrabold text-white shadow-[0_2px_0_#060a0f] transition active:translate-y-0.5 active:shadow-none hover:bg-[#263545]"
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      <div className="mt-1 flex gap-1">
        <button
          type="button"
          onClick={() => press("BACKSPACE")}
          className="h-9 flex-[1.2] rounded-md border border-slate-600 bg-[#1a2531] text-xs font-extrabold text-white shadow-[0_2px_0_#060a0f]"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => press("SPACE")}
          className="h-9 flex-[2] rounded-md border border-slate-600 bg-[#1a2531] text-[11px] font-extrabold text-white shadow-[0_2px_0_#060a0f]"
        >
          SPACE
        </button>
        <button
          type="button"
          onClick={() => press("ENTER")}
          className="h-9 flex-[1.4] rounded-md border border-red-400 bg-red-600 text-[11px] font-extrabold text-white shadow-[0_2px_0_#7f0505]"
        >
          ENTER ↵
        </button>
      </div>
    </div>
  );
}

function NameEntry({ name, setName, onStart, onBack, soundOn, setSoundOn }) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* Industrial bomb-room background — CSS only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(90,10,12,.48),transparent_34%),linear-gradient(180deg,#05070b_0%,#0b0d12_52%,#07080b_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.72)_100%)]" />

        {/* rear industrial wall */}
        <div className="absolute inset-x-[15%] top-0 h-[78%] border-x border-white/[0.035] bg-[#090c11]/70" />
        <div className="absolute left-[22%] top-0 h-[72%] w-px bg-red-500/[0.08]" />
        <div className="absolute left-1/2 top-0 h-[72%] w-px bg-red-500/[0.08]" />
        <div className="absolute right-[22%] top-0 h-[72%] w-px bg-red-500/[0.08]" />

        {/* ceiling beams */}
        <div className="absolute -left-[8%] top-[7%] h-7 w-[43%] rotate-[18deg] rounded-full border-[7px] border-[#090a0e] bg-gradient-to-b from-[#34363d] via-[#17191f] to-[#08090c] shadow-[0_0_24px_rgba(255,0,0,.15)] md:h-10 md:border-[9px]" />
        <div className="absolute -right-[8%] top-[7%] h-7 w-[43%] rotate-[-18deg] rounded-full border-[7px] border-[#090a0e] bg-gradient-to-b from-[#34363d] via-[#17191f] to-[#08090c] shadow-[0_0_24px_rgba(255,0,0,.15)] md:h-10 md:border-[9px]" />

        {/* red ceiling lights */}
        <div className="absolute left-[23%] top-[17%] h-3 w-24 rotate-[-2deg] rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,.45)] md:w-32" />
        <div className="absolute right-[17%] top-[17%] h-3 w-20 rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,.45)] md:w-28" />
        <div className="absolute left-[48%] top-[13%] h-2 w-20 rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,.38)]" />

        {/* hanging lamp */}
        <div className="absolute right-[11%] top-0 h-[14%] w-1 bg-black/80" />
        <div className="absolute right-[9.2%] top-[10%] h-20 w-10 rounded-[14px] border-4 border-[#1d2026] bg-red-500/70 shadow-[0_0_28px_10px_rgba(239,68,68,.32)] md:h-24 md:w-12" />
        <div className="absolute right-[9.2%] top-[10%] h-20 w-10 rounded-[14px] border border-red-200/40 md:h-24 md:w-12" />

        {/* left wall monitor */}
        <div className="absolute -left-[2%] top-[31%] h-[23%] w-[17%] rotate-[2deg] rounded-xl border-[7px] border-[#191c22] bg-[#07090d] shadow-[0_20px_35px_rgba(0,0,0,.8)] md:border-[9px]">
          <div className="absolute inset-3 rounded-md border border-red-500/20 bg-[linear-gradient(135deg,rgba(255,0,0,.13),transparent_45%),#080a0e]" />
          <div className="absolute left-[12%] top-[23%] h-1 w-[48%] bg-red-500/45" />
          <div className="absolute left-[12%] top-[34%] h-1 w-[34%] bg-slate-400/20" />
          <div className="absolute left-[12%] top-[45%] h-1 w-[55%] bg-slate-400/15" />
        </div>

        {/* left warning crate */}
        <div className="absolute bottom-[17%] left-[-4%] h-[30%] w-[27%] rounded-xl border-[8px] border-[#15171b] bg-gradient-to-br from-[#2b3036] via-[#121519] to-[#07080a] shadow-[0_25px_45px_rgba(0,0,0,.9)] md:border-[11px]">
          <div className="absolute inset-3 rounded-lg border border-white/[0.08]" />
          <div className="absolute left-[12%] top-[12%] text-[26px] font-black text-white/10 md:text-[42px]">NT</div>
          <div className="absolute bottom-[13%] left-[12%] text-[10px] font-black uppercase tracking-[0.12em] text-white/25 md:text-sm">NEBULOID TECH</div>
        </div>

        {/* right large warning crate */}
        <div className="absolute bottom-[20%] right-[-4%] h-[43%] w-[20%] rotate-[-2deg] rounded-xl border-[8px] border-[#15171b] bg-gradient-to-br from-[#34383e] via-[#17191e] to-[#08090b] shadow-[0_25px_50px_rgba(0,0,0,.9)] md:border-[11px]">
          <div className="absolute inset-3 rounded-lg border border-red-500/[0.12]" />
          <div className="absolute left-1/2 top-[16%] -translate-x-1/2 text-[54px] font-black text-red-600/45 md:text-[72px]">△</div>
          <div className="absolute left-1/2 top-[43%] -translate-x-1/2 text-center text-[15px] font-black uppercase leading-tight tracking-[0.08em] text-white/45 md:text-[25px]">
            DEFUSE<br />BEFORE<br />IT'S TOO<br />LATE
          </div>
        </div>

        {/* left laptop / timer */}
        <div className="absolute bottom-[35%] left-[-2%] z-10 w-[25%] min-w-[230px] max-w-[390px]">
          <div className="relative h-[145px] rounded-t-xl border-[7px] border-[#15171c] bg-[#080a0d] shadow-[0_18px_35px_rgba(0,0,0,.85)] md:h-[185px] md:border-[9px]">
            <div className="absolute inset-2 rounded bg-[#090b0f] p-3">
              <div className="flex h-full flex-col items-center justify-center border border-red-500/25 bg-[linear-gradient(180deg,rgba(255,0,0,.10),transparent),#07080b]">
                <span className="font-mono text-[30px] font-black text-red-500 drop-shadow-[0_0_9px_rgba(255,0,0,.9)] md:text-[43px]">00:30</span>
                <span className="mt-1 text-[10px] font-black uppercase text-red-500 md:text-sm">Defuse Before It's Too Late</span>
              </div>
            </div>
          </div>
          <div className="h-5 -skew-x-12 rounded-b-lg bg-gradient-to-b from-[#45484e] to-[#17191d] shadow-[0_14px_20px_rgba(0,0,0,.85)] md:h-7" />
        </div>

        {/* foreground bomb cylinders */}
        <div className="absolute bottom-[-4%] right-[-4%] h-[32%] w-[30%] rotate-[-5deg]">
          <div className="absolute left-0 top-[26%] h-[37%] w-full rounded-full border-[8px] border-[#171012] bg-gradient-to-b from-[#b52d25] via-[#52120f] to-[#180708] shadow-[inset_0_4px_8px_rgba(255,120,100,.25),0_20px_35px_rgba(0,0,0,.9)] md:border-[11px]" />
          <div className="absolute left-[8%] top-[54%] h-[37%] w-[82%] rounded-full border-[8px] border-[#171012] bg-gradient-to-b from-[#a22620] via-[#43100e] to-[#130607] shadow-[0_20px_35px_rgba(0,0,0,.9)] md:border-[11px]" />
          <div className="absolute left-[15%] top-0 h-full w-5 rounded-full bg-[#09090b] shadow-[0_0_0_4px_#291719] md:w-7" />
          <div className="absolute left-[54%] top-0 h-full w-5 rounded-full bg-[#09090b] shadow-[0_0_0_4px_#291719] md:w-7" />
          <div className="absolute right-[17%] top-[34%] h-14 w-[34%] rounded-lg border-4 border-[#191013] bg-[#090a0d] md:h-20" />
          <div className="absolute right-[20%] top-[42%] font-mono text-[21px] font-black text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,.8)] md:text-[31px]">00:30</div>
        </div>

        {/* floor */}
        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-[linear-gradient(180deg,rgba(20,20,24,.1),rgba(3,4,6,.94)),repeating-linear-gradient(90deg,rgba(255,255,255,.045)_0_1px,transparent_1px_90px)]" />
        <div className="absolute bottom-[9%] left-1/2 h-px w-[72%] -translate-x-1/2 bg-red-500/20 shadow-[0_22px_0_rgba(255,50,40,.10),0_44px_0_rgba(255,50,40,.06)]" />

        {/* smoke */}
        <div className="absolute bottom-[32%] left-[54%] h-[30%] w-[20%] rounded-full bg-white/[0.035] blur-[45px]" />
        <div className="absolute bottom-[30%] right-[28%] h-[28%] w-[18%] rounded-full bg-red-100/[0.035] blur-[40px]" />

        {/* red edge glow */}
        <div className="absolute inset-0 border-x-[2px] border-red-500/20" />
        <div className="absolute left-5 top-5 h-11 w-11 border-l-[6px] border-t-[6px] border-red-600 md:left-6 md:top-6" />
        <div className="absolute right-5 top-5 h-11 w-11 border-r-[6px] border-t-[6px] border-red-600 md:right-6 md:top-6" />
        <div className="absolute bottom-5 left-5 h-11 w-11 border-b-[6px] border-l-[6px] border-red-600 md:left-6 md:bottom-6" />
        <div className="absolute bottom-5 right-5 h-11 w-11 border-b-[6px] border-r-[6px] border-red-600 md:right-6 md:bottom-6" />
      </div>

      <div className="relative z-20 flex min-h-screen flex-col px-5 py-5 md:px-7 md:py-6">
        {/* top controls + centered branding */}
        <div className="grid grid-cols-3 items-start">
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex w-[96px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/25 bg-[#090b10]/75 px-3 py-4 text-white shadow-[0_12px_30px_rgba(0,0,0,.45)] backdrop-blur-md transition hover:border-red-500/70 hover:bg-[#0d0f14]/90"
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 size={30} strokeWidth={2.6} className="text-red-500" /> : <VolumeX size={30} strokeWidth={2.6} className="text-red-500" />}
            <span className="text-[11px] font-black uppercase tracking-wide text-white">Sound</span>
          </button>

          <div className="justify-self-center -mt-1 text-center sm:mt-0">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-auto w-[235px] max-w-none object-contain drop-shadow-[0_5px_18px_rgba(255,255,255,.18)] sm:w-[290px] md:w-[350px]"
            />
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="justify-self-end flex w-[112px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/25 bg-[#090b10]/75 px-3 py-4 text-white shadow-[0_12px_30px_rgba(0,0,0,.45)] backdrop-blur-md transition hover:border-red-500/70 hover:bg-[#0d0f14]/90"
          >
            <HelpCircle size={30} strokeWidth={2.6} className="text-red-500" />
            <span className="text-[11px] font-black uppercase tracking-wide text-white">How To Play</span>
          </button>
        </div>

        {/* registration content */}
        <div className="flex flex-1 items-center justify-center pb-5 pt-8 md:pb-7 md:pt-10">
          <div className="w-full max-w-[700px] text-center">
            <div className="mb-4 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.38em] text-white/90 sm:text-sm md:mb-5 md:text-base">
              <span className="h-px w-12 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,.8)] sm:w-16 md:w-20" />
              <span>Operative Registration</span>
              <span className="h-px w-12 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,.8)] sm:w-16 md:w-20" />
            </div>

            <h2 className="text-[42px] font-black leading-none tracking-[-0.045em] text-white drop-shadow-[0_5px_12px_rgba(0,0,0,.75)] sm:text-[55px] md:text-[72px]">
              Enter <span className="text-red-500">Your</span> Name
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-7 text-slate-200/80 sm:text-lg md:text-xl">
              Your name will appear on the<br className="hidden sm:block" /> defusal certificate.
            </p>

            <div className="relative mx-auto mt-7 max-w-[590px]">
              <UserRound size={29} strokeWidth={2.2} className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                onFocus={() => setKeyboardOpen(true)}
                value={name}
                maxLength={30}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onStart();
                }}
                placeholder="Enter your name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="h-[76px] w-full rounded-2xl border-[2px] border-red-500 bg-[#0b0c11]/85 px-16 text-lg font-semibold text-white outline-none shadow-[0_0_22px_rgba(239,68,68,.16),inset_0_0_22px_rgba(0,0,0,.35)] backdrop-blur-md transition placeholder:text-slate-300/75 focus:border-red-400 focus:ring-4 focus:ring-red-500/15 md:text-xl"
              />
            </div>

            {keyboardOpen && (
              <FloatingKeyboard
                value={name}
                onChange={setName}
                onEnter={onStart}
                onClose={() => setKeyboardOpen(false)}
              />
            )}

            <button
              onClick={() => {
                setKeyboardOpen(false);
                onStart();
              }}
              disabled={!name.trim()}
              className="group mx-auto mt-5 flex h-[76px] w-full max-w-[590px] items-center justify-center gap-6 rounded-xl border border-red-300/80 bg-gradient-to-r from-[#f32620] via-[#d20c0c] to-[#a50000] px-7 text-lg font-black uppercase tracking-[0.04em] text-white shadow-[0_0_28px_rgba(239,68,68,.32),inset_0_1px_0_rgba(255,255,255,.2)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(239,68,68,.48)] disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none md:text-xl"
            >
              <span className="text-3xl leading-none">◎</span>
              Begin Defusal
              <ArrowRight size={29} strokeWidth={2.7} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => { setKeyboardOpen(false); onBack(); }}
              className="mx-auto mt-7 flex items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:text-white"
            >
              <span className="h-px w-14 bg-white/40" />
              Back To Main Menu
              <span className="h-px w-14 bg-white/40" />
            </button>
          </div>
        </div>
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0b0d12] p-7 text-left text-white shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">Mission Guide</p>
                <h2 className="mt-2 text-2xl font-black">How To Play</h2>
              </div>
              <button onClick={() => setShowHowToPlay(false)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-black text-white/60 transition hover:border-red-500/50 hover:text-white">CLOSE</button>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Enter your operative name to begin.",
                "Read every mission clue carefully.",
                "Choose the correct answer before the timer reaches zero.",
                "Complete all 10 levels to earn the master certificate.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">{index + 1}</span>
                  <p className="text-sm font-semibold leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Game({
  level,
  levelIndex,
  progress,
  timerProgress,
  timeLeft,
  danger,
  selected,
  setSelected,
  submit,
  score,
  name,
  soundOn,
  setSoundOn,
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [bombMode, setBombMode] = useState("ARMED");
  const [activeWire, setActiveWire] = useState(null);

  useEffect(() => {
    if (!soundOn || timeLeft <= 0) return;
    let audioContext;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioContext = new AudioContext();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(danger ? 1050 : 820, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(danger ? 0.055 : 0.035, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
    return () => {
      if (audioContext && audioContext.state !== "closed") audioContext.close().catch(() => {});
    };
  }, [timeLeft, soundOn, danger]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#030508] text-white">
      {/* full-screen background — content sits directly on it, no cards */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_52%,rgba(239,68,68,.11),transparent_30%),linear-gradient(180deg,#05080d_0%,#070a0f_52%,#020306_100%)]" />
        <div className="absolute inset-0 opacity-[0.045]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
        <div className="absolute inset-x-[18%] top-0 h-[78%] border-x border-white/[0.035]" />
        <div className="absolute left-1/2 top-0 h-[78%] w-px bg-red-500/[0.055]" />
        <div className="absolute -left-[8%] top-[5%] h-8 w-[45%] rotate-[17deg] rounded-full border-[7px] border-black/90 bg-gradient-to-b from-[#3b4048] via-[#1a1e24] to-[#08090c] shadow-[0_0_25px_rgba(0,0,0,.9)] md:h-12 md:border-[10px]" />
        <div className="absolute -right-[8%] top-[6%] h-8 w-[45%] rotate-[-17deg] rounded-full border-[7px] border-black/90 bg-gradient-to-b from-[#3b4048] via-[#1a1e24] to-[#08090c] shadow-[0_0_25px_rgba(0,0,0,.9)] md:h-12 md:border-[10px]" />
        <div className="absolute left-[18%] top-[21%] h-2 w-24 rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,.35)]" />
        <div className="absolute right-[16%] top-[20%] h-2 w-28 rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,.35)]" />
        <div className="absolute right-[7%] top-[11%] h-20 w-9 rounded-xl border-4 border-[#252a31] bg-red-500/60 shadow-[0_0_26px_8px_rgba(239,68,68,.25)]" />
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,transparent,rgba(1,2,4,.9)),repeating-linear-gradient(90deg,rgba(255,255,255,.04)_0_1px,transparent_1px_92px)]" />
        <div className="absolute bottom-[8%] left-1/2 h-px w-[72%] -translate-x-1/2 bg-red-500/25 shadow-[0_24px_0_rgba(255,50,40,.08)]" />
        <div className="absolute bottom-[1%] left-[-4%] h-5 w-[31%] rotate-[8deg] rounded-full bg-gradient-to-r from-black via-[#511714] to-black" />
        <div className="absolute bottom-[1%] right-[-4%] h-5 w-[34%] rotate-[-13deg] rounded-full bg-gradient-to-r from-black via-[#5a1a16] to-black" />
      </div>

      {/* single viewport content */}
      <div className="relative z-10 mx-auto h-full w-full max-w-[1700px] overflow-hidden px-6 py-4 md:px-10 md:py-5">
        {/* TOP BAR */}
        <div className="relative flex h-[82px] items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-[58px] w-auto max-w-[250px] object-contain drop-shadow-[0_5px_18px_rgba(255,255,255,.18)] md:h-[70px] md:max-w-[300px]"
            />
            <button
              onClick={() => setSoundOn((value) => !value)}
              className="hidden h-[62px] w-[78px] flex-col items-center justify-center gap-1 border border-white/20 bg-black/30 text-white sm:flex md:h-[68px] md:w-[88px]"
            >
              {soundOn ? <Volume2 size={25} className="text-red-500" /> : <VolumeX size={25} className="text-red-500" />}
              <span className="text-[9px] font-black uppercase tracking-wide">Sound</span>
            </button>
          </div>

          <div className="absolute left-1/2 top-[-3px] -translate-x-1/2">
            <div className={`w-[300px] border-2 bg-[#07090d]/95 px-7 py-3.5 text-center backdrop-blur-md md:w-[350px] md:px-9 md:py-4 ${
              danger
                ? "border-red-300 shadow-[0_0_32px_rgba(239,68,68,.55)]"
                : "border-red-500/80 shadow-[0_0_24px_rgba(239,68,68,.28)]"
            }`}>
              <div className="text-[9px] font-black uppercase tracking-[0.32em] text-red-400 md:text-[10px]">
                DETONATION COUNTDOWN
              </div>
              <div className={`mt-1 font-mono text-[52px] font-black leading-none tabular-nums tracking-[0.04em] md:text-[64px] ${
                danger ? "animate-flicker text-red-300" : "text-red-500"
              }`} style={{ textShadow: "0 0 14px rgba(239,68,68,.95)" }}>
                00:{String(timeLeft).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[8px] font-black uppercase tracking-[0.34em] text-white/50">
                SECONDS REMAINING
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 md:gap-3">
            <div className="min-w-[145px] md:min-w-[165px]"><MiniStat label="Operative" value={name} /></div>
            <div className="min-w-[110px] md:min-w-[125px]"><MiniStat label="Score" value={score} /></div>
            <button
              onClick={() => setShowHowToPlay(true)}
              className="flex h-[62px] w-[88px] flex-col items-center justify-center gap-1 border border-white/20 bg-black/30 text-white transition hover:border-red-500/70 md:h-[68px] md:w-[104px]"
            >
              <HelpCircle size={24} className="text-red-500" />
              <span className="text-[9px] font-black uppercase tracking-wide">How To Play</span>
            </button>
          </div>
        </div>

        {/* MISSION HEADER */}
        <div className="mt-1 flex items-end justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.32em] text-red-500">Active Mission</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <h1 className="text-[50px] font-black leading-none tracking-[-0.055em] md:text-[64px]">LEVEL {levelIndex + 1}</h1>
              <span className="text-2xl font-bold text-white/40 md:text-3xl">/ 10</span>
            </div>
          </div>
          <div className="w-[42%] max-w-[650px] pb-1">
            <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              <span>Mission Progress</span><span>{levelIndex + 1} / 10</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.7)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* MAIN: no cards, direct background */}
        <div className="grid h-[calc(100%-135px)] grid-cols-[minmax(420px,.78fr)_minmax(600px,1.22fr)] items-center gap-10 xl:gap-16">
          {/* LEFT / BOMB */}
          <section className="relative flex h-full min-w-0 flex-col justify-center">
            <div className="absolute left-0 top-[17%] hidden w-[150px] border-l border-red-500/35 pl-4 lg:block">
              <p className="text-[17px] font-black uppercase leading-[1.25] text-red-500">
                MISSION<br />FOCUS<br />DISCIPLINE<br />SUCCESS
              </p>
              <div className="mt-5 h-px w-20 bg-white/15" />
              <p className="mt-4 text-[11px] font-bold uppercase leading-5 tracking-[0.12em] text-white/40">
                STAY CALM.<br />DEFUSE SMART.<br />YOU CAN DO IT.
              </p>
            </div>

            <BombVisual
              danger={danger}
              timeLeft={timeLeft}
              bombMode={bombMode}
              activeWire={activeWire}
              onModeChange={setBombMode}
              onWireChange={setActiveWire}
            />

            <div className="mx-auto mt-1 w-full max-w-[500px]">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full ${danger ? "bg-red-400 animate-flicker" : "bg-red-500"}`} style={{ width: `${timerProgress}%` }} />
              </div>
              <div className="mt-2 flex justify-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Device Armed • Game Device
              </div>
            </div>
          </section>

          {/* RIGHT / PUZZLE */}
          <section className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-red-500">
              <Zap size={15} /> {level.kind}
            </div>

            <h2 className="text-[46px] font-black leading-[.94] tracking-[-0.045em] md:text-[64px]">
              {level.title.split(" ").map((word, index) => (
                <React.Fragment key={`${word}-${index}`}>
                  {index === level.title.split(" ").length - 1 ? <span className="text-red-500"> {word}</span> : `${word} `}
                </React.Fragment>
              ))}
            </h2>
            <p className="mt-2 text-[18px] font-medium text-white/65 md:text-[21px]">{level.subtitle}</p>

            <div className="mt-4 border-y border-white/10 py-3">
              <div className="mb-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-500">
                <ShieldAlert size={15} /> Mission Brief
              </div>
              <p className="text-[18px] font-semibold leading-7 text-white/80 md:text-[20px] md:leading-8">{level.brief}</p>
            </div>

            <div className="border-b border-white/10 py-3">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-500">
                <Sparkles size={14} /> Clue
              </div>
              <p className="text-[17px] font-semibold leading-6 text-white/65 md:text-[19px]">{level.clue}</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {level.options.map((option, index) => {
                const active = selected === option;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setActiveWire(String.fromCharCode(65 + index));
                    }}
                    className={`group flex h-[58px] items-center gap-3 border px-3.5 text-left transition md:h-[64px] ${
                      active
                        ? "border-red-400 bg-red-500/12 text-white shadow-[0_0_18px_rgba(239,68,68,.12)]"
                        : "border-red-500/55 bg-black/10 text-white/85 hover:border-red-300 hover:bg-red-500/[0.06]"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center border text-sm font-black ${active ? "border-red-400 bg-red-500 text-white" : "border-red-500/70 text-red-400"}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-[19px] font-bold md:text-[22px]">{option}</span>
                    {active && <Check size={19} className="ml-auto text-red-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={submit}
              disabled={!selected}
              className="group mt-3 flex h-[60px] w-full items-center justify-center gap-3 border border-red-300/70 bg-gradient-to-r from-[#f32620] via-[#d20c0c] to-[#9d0000] text-base font-black uppercase tracking-[0.15em] text-white shadow-[0_0_25px_rgba(239,68,68,.22)] transition hover:shadow-[0_0_34px_rgba(239,68,68,.35)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 md:h-[66px] md:text-lg"
            >
              Defuse Bomb <ShieldCheck size={20} />
            </button>
          </section>
        </div>
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-md">
          <div className="w-full max-w-md border border-red-500/30 bg-[#080b10] p-7 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">Mission Guide</p>
                <h2 className="mt-2 text-2xl font-black">How To Play</h2>
              </div>
              <button onClick={() => setShowHowToPlay(false)} className="border border-white/15 px-3 py-2 text-xs font-black text-white/60 hover:border-red-500/50 hover:text-white">CLOSE</button>
            </div>
            <div className="mt-5 space-y-2.5">
              {[
                "Read the mission brief and clue carefully.",
                "Choose the correct answer before the countdown reaches zero.",
                "A wrong answer immediately ends the mission.",
                "Defuse all 10 levels to unlock the master certificate.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 border border-white/10 bg-white/[0.035] p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black">{index + 1}</span>
                  <p className="text-sm font-semibold leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BombVisual({
  danger,
  compact = false,
  bombMode = "ARMED",
  activeWire = null,
  onModeChange,
  onWireChange,
}) {
  const wires = ["A", "B", "C", "D"];

  const wireClass = (wire) => ({
    A: "from-red-950 via-red-500 to-red-950",
    B: "from-blue-950 via-blue-500 to-blue-950",
    C: "from-amber-950 via-amber-400 to-amber-950",
    D: "from-emerald-950 via-emerald-500 to-emerald-950",
  }[wire]);

  return (
    <div className={`relative mx-auto w-full ${compact ? "h-[270px] max-w-[440px]" : "h-[470px] max-w-[560px] md:h-[520px]"}`}>
      {/* four thick wires physically coming out of the top */}
      <div className="absolute left-[14%] top-0 z-40 h-[205px] w-[72%]">
        {wires.map((wire, i) => (
          <button
            key={wire}
            type="button"
            onClick={() => onWireChange?.(wire)}
            className={`absolute bottom-0 h-[205px] w-[54px] -translate-x-1/2 transition-transform ${
              activeWire === wire ? "scale-110" : "hover:scale-105"
            }`}
            style={{ left: `${8 + i * 28}%` }}
          >
            <span
              className={`absolute bottom-[24px] left-1/2 h-[184px] w-[14px] -translate-x-1/2 rounded-full bg-gradient-to-r ${wireClass(wire)} shadow-[0_0_0_2px_#050505,2px_0_3px_rgba(255,255,255,.18),0_0_13px_rgba(255,50,40,.3)]`}
              style={{
                transform: `translateX(-50%) rotate(${[-9, -3, 3, 9][i]}deg)`,
                transformOrigin: "bottom center",
              }}
            />
            <span className="absolute bottom-0 left-1/2 h-[34px] w-[42px] -translate-x-1/2 rounded-lg border-[5px] border-black bg-gradient-to-b from-[#aeb5b9] via-[#4b5257] to-[#101316] shadow-[0_5px_12px_rgba(0,0,0,.95),inset_0_2px_2px_rgba(255,255,255,.35)]" />
            <span className="absolute bottom-[6px] left-1/2 h-[9px] w-[22px] -translate-x-1/2 rounded-full bg-black" />
            <span className={`absolute bottom-[-18px] left-1/2 -translate-x-1/2 rounded border px-2 py-0.5 text-[9px] font-black ${
              activeWire === wire ? "border-red-400 bg-red-600 text-white" : "border-white/20 bg-black text-white/60"
            }`}>{wire}</span>
          </button>
        ))}
      </div>

      {/* unmistakable heavy steel bomb casing */}
      <div className={`absolute bottom-[5%] left-1/2 z-20 -translate-x-1/2 rounded-[44px] border-[9px] border-[#050607] bg-gradient-to-br from-[#687078] via-[#343a3f] to-[#080a0c] shadow-[0_35px_70px_rgba(0,0,0,.98),inset_12px_10px_18px_rgba(255,255,255,.13),inset_-18px_-22px_35px_rgba(0,0,0,.8)] ${compact ? "h-[205px] w-[88%]" : "h-[340px] w-[88%] max-w-[500px] md:h-[365px]"}`}>

        {/* curved top steel collar */}
        <div className="absolute -top-[15px] left-[8%] h-[34px] w-[84%] rounded-full border-[7px] border-[#070809] bg-gradient-to-b from-[#aeb5ba] via-[#555d63] to-[#15191c] shadow-[0_5px_12px_rgba(0,0,0,.9)]" />

        {/* left/right armor ribs */}
        <div className="absolute left-[-18px] top-[12%] h-[76%] w-[27px] rounded-full border-[4px] border-[#050607] bg-gradient-to-r from-[#91999f] via-[#3c444a] to-[#101316]" />
        <div className="absolute right-[-18px] top-[12%] h-[76%] w-[27px] rounded-full border-[4px] border-[#050607] bg-gradient-to-r from-[#101316] via-[#3c444a] to-[#91999f]" />

        {/* front face */}
        <div className="absolute left-[7%] top-[7%] h-[86%] w-[86%] rounded-[30px] border-[6px] border-[#0b0e10] bg-gradient-to-b from-[#22282d] via-[#0c1013] to-[#030405] shadow-[inset_0_0_35px_#000]">

          {/* bolts */}
          {["left-3 top-3","right-3 top-3","left-3 bottom-3","right-3 bottom-3"].map((p) => (
            <span key={p} className={`absolute ${p} h-5 w-5 rounded-full border-[3px] border-[#747d83] bg-gradient-to-br from-[#c0c5c8] via-[#454d52] to-[#101316] shadow-[0_2px_5px_#000]`} />
          ))}

          {/* large red digital display */}
          <div className="absolute left-[13%] top-[10%] w-[74%] rounded-lg border-[5px] border-[#15191b] bg-black p-2 shadow-[inset_0_0_16px_#000,0_3px_8px_#000]">
            <div className={`rounded bg-[#130303] py-2 text-center font-mono text-[18px] font-black tracking-[.3em] ${danger ? "text-red-300 shadow-[0_0_15px_rgba(255,0,0,.8)]" : "text-red-500"}`}>
              {bombMode === "ARMED" ? "00:30" : "TEST"}
            </div>
          </div>

          {/* warning strip */}
          <div className="absolute left-[13%] top-[29%] w-[74%] overflow-hidden rounded border border-red-900/80 bg-gradient-to-r from-red-950 via-[#170506] to-red-950 py-1 text-center">
            <span className="text-[8px] font-black tracking-[.28em] text-red-400">⚠ DANGER // ARMED DEVICE ⚠</span>
          </div>

          {/* mechanical control panel */}
          <div className="absolute left-[13%] top-[40%] w-[74%] rounded-xl border-[3px] border-[#343b40] bg-[#080b0d] p-3 shadow-[inset_0_0_18px_#000]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[8px] font-black tracking-[.2em] text-white/40">DEFUSAL CONTROL</span>
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_9px_3px_rgba(255,0,0,.7)]" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["A","B","C","D"].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onWireChange?.(w)}
                  className={`h-9 rounded border-2 font-mono text-sm font-black transition ${
                    activeWire === w
                      ? "border-red-400 bg-red-600 text-white shadow-[0_0_12px_rgba(255,0,0,.6)]"
                      : "border-[#41484d] bg-gradient-to-b from-[#343b40] to-[#101316] text-white/65 hover:border-red-500/70"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* lower physical switches */}
          <div className="absolute bottom-[9%] left-[13%] flex w-[74%] items-end justify-between">
            <div className="flex gap-2">
              {[0,1,2].map((i) => (
                <span key={i} className={`h-3 w-3 rounded-full border-2 border-black ${i === 0 || danger ? "bg-red-500 shadow-[0_0_8px_3px_rgba(255,0,0,.65)]" : "bg-white/15"}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => onModeChange?.(bombMode === "ARMED" ? "DIAGNOSTIC" : "ARMED")}
              className="rounded border-2 border-[#444b50] bg-gradient-to-b from-[#596168] to-[#171b1e] px-3 py-1 text-[7px] font-black tracking-widest text-white/70 shadow-[0_3px_6px_#000]"
            >
              TEST
            </button>
          </div>
        </div>

        {/* bottom feet */}
        <span className="absolute bottom-[-16px] left-[13%] h-[22px] w-[58px] rounded-b-xl border-x-4 border-b-4 border-black bg-[#252b30]" />
        <span className="absolute bottom-[-16px] right-[13%] h-[22px] w-[58px] rounded-b-xl border-x-4 border-b-4 border-black bg-[#252b30]" />
      </div>

      <div className="absolute bottom-[2%] left-1/2 h-7 w-[82%] -translate-x-1/2 rounded-full bg-red-600/25 blur-2xl" />
    </div>
  );
}
function LevelComplete({ level, score, name, onDownload, onNext }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [scan, setScan] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse((value) => !value), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050607] text-white">
      {/* cinematic industrial background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(239,68,68,.18),transparent_38%),linear-gradient(180deg,#020304_0%,#090b0e_52%,#030405_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(90deg,transparent,rgba(239,68,68,.08),transparent)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[18%] border-r border-red-950/60 bg-black/25" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[18%] border-l border-red-950/60 bg-black/25" />

      {/* LARGE SIDE BOMBS — certificate/defused page decoration */}
      <div className="pointer-events-none absolute left-[-85px] top-[46%] z-[4] h-[300px] w-[480px] rotate-[-8deg] md:left-[-55px] md:h-[340px] md:w-[540px]">
        <div className="absolute left-[4%] top-[38%] h-[130px] w-[88%] rounded-[30px] border-[10px] border-[#050607] bg-gradient-to-b from-[#a9362d] via-[#501518] to-[#080506] shadow-[0_25px_50px_rgba(0,0,0,.95),0_0_42px_rgba(255,35,20,.65),inset_0_8px_15px_rgba(255,170,130,.22)] md:h-[150px]">
          <div className="absolute left-[8%] top-[-8%] h-[116%] w-[30px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb7bc] via-[#4a5258] to-[#0b0e10]" />
          <div className="absolute left-[43%] top-[-8%] h-[116%] w-[30px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb7bc] via-[#4a5258] to-[#0b0e10]" />
          <div className="absolute right-[8%] top-[-8%] h-[116%] w-[30px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb7bc] via-[#4a5258] to-[#0b0e10]" />
          <div className="absolute right-[-30px] top-[14%] h-[72%] w-[60px] rounded-full border-[8px] border-black bg-gradient-to-br from-[#9ca5aa] via-[#41494f] to-[#090b0d] shadow-[8px_0_20px_rgba(0,0,0,.95)]" />
          <div className="absolute left-[13%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-red-200 shadow-[0_0_16px_7px_rgba(255,25,10,.98)] animate-pulse" />
          <div className="absolute left-[20%] top-[20%] h-2 w-[48%] rounded-full bg-red-300/30 blur-[1px]" />
        </div>

        <div className="absolute left-[24%] top-[48%] z-10 h-[76px] w-[210px] rounded-xl border-[7px] border-black bg-gradient-to-b from-[#535c62] via-[#20262b] to-[#080a0c] p-2 shadow-[0_16px_28px_rgba(0,0,0,.95)] md:h-[88px] md:w-[235px]">
          <div className="flex h-full items-center justify-center rounded-md border-2 border-red-800 bg-[#030202] shadow-[inset_0_0_20px_rgba(255,0,0,.5)]">
            <span className="font-mono text-[31px] font-black tracking-[-.06em] text-red-400 drop-shadow-[0_0_13px_rgba(255,20,10,1)] md:text-[37px]">00:30</span>
          </div>
        </div>

        <div className="absolute left-[13%] top-[1%] h-[105px] w-[145px]">
          <span className="absolute bottom-0 left-[25%] h-[94px] w-[12px] rotate-[-20deg] rounded-full bg-gradient-to-r from-red-950 via-red-400 to-red-950 shadow-[0_0_15px_4px_rgba(255,40,20,.65)]" />
          <span className="absolute bottom-0 left-[48%] h-[105px] w-[12px] rotate-[4deg] rounded-full bg-gradient-to-r from-amber-950 via-amber-300 to-amber-950 shadow-[0_0_14px_4px_rgba(255,170,20,.5)]" />
          <span className="absolute bottom-0 left-[71%] h-[98px] w-[12px] rotate-[23deg] rounded-full bg-gradient-to-r from-blue-950 via-blue-400 to-blue-950 shadow-[0_0_14px_4px_rgba(40,130,255,.42)]" />
        </div>
      </div>

      <div className="pointer-events-none absolute right-[-85px] top-[46%] z-[4] h-[300px] w-[480px] -scale-x-100 rotate-[-8deg] md:right-[-55px] md:h-[340px] md:w-[540px]">
        <div className="absolute left-[4%] top-[38%] h-[130px] w-[88%] rounded-[30px] border-[10px] border-[#050607] bg-gradient-to-b from-[#a9362d] via-[#501518] to-[#080506] shadow-[0_25px_50px_rgba(0,0,0,.95),0_0_42px_rgba(255,35,20,.65),inset_0_8px_15px_rgba(255,170,130,.22)] md:h-[150px]">
          <div className="absolute left-[8%] top-[-8%] h-[116%] w-[30px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb7bc] via-[#4a5258] to-[#0b0e10]" />
          <div className="absolute left-[43%] top-[-8%] h-[116%] w-[30px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb7bc] via-[#4a5258] to-[#0b0e10]" />
          <div className="absolute right-[8%] top-[-8%] h-[116%] w-[30px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb7bc] via-[#4a5258] to-[#0b0e10]" />
          <div className="absolute right-[-30px] top-[14%] h-[72%] w-[60px] rounded-full border-[8px] border-black bg-gradient-to-br from-[#9ca5aa] via-[#41494f] to-[#090b0d] shadow-[8px_0_20px_rgba(0,0,0,.95)]" />
          <div className="absolute left-[13%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-red-200 shadow-[0_0_16px_7px_rgba(255,25,10,.98)] animate-pulse" />
        </div>
        <div className="absolute left-[24%] top-[48%] z-10 h-[76px] w-[210px] rounded-xl border-[7px] border-black bg-gradient-to-b from-[#535c62] via-[#20262b] to-[#080a0c] p-2 shadow-[0_16px_28px_rgba(0,0,0,.95)] md:h-[88px] md:w-[235px]">
          <div className="flex h-full items-center justify-center rounded-md border-2 border-red-800 bg-[#030202] shadow-[inset_0_0_20px_rgba(255,0,0,.5)]">
            <span className="font-mono text-[31px] font-black tracking-[-.06em] text-red-400 drop-shadow-[0_0_13px_rgba(255,20,10,1)] md:text-[37px]">00:30</span>
          </div>
        </div>
        <div className="absolute left-[13%] top-[1%] h-[105px] w-[145px]">
          <span className="absolute bottom-0 left-[25%] h-[94px] w-[12px] rotate-[-20deg] rounded-full bg-gradient-to-r from-red-950 via-red-400 to-red-950" />
          <span className="absolute bottom-0 left-[48%] h-[105px] w-[12px] rotate-[4deg] rounded-full bg-gradient-to-r from-amber-950 via-amber-300 to-amber-950" />
          <span className="absolute bottom-0 left-[71%] h-[98px] w-[12px] rotate-[23deg] rounded-full bg-gradient-to-r from-blue-950 via-blue-400 to-blue-950" />
        </div>
      </div>

      {/* side industrial light bars */}
      <div className="pointer-events-none absolute left-[4%] top-[18%] h-2 w-28 rotate-[-10deg] rounded-full bg-red-500/70 shadow-[0_0_25px_rgba(239,68,68,.8)]" />
      <div className="pointer-events-none absolute right-[4%] top-[18%] h-2 w-28 rotate-[10deg] rounded-full bg-red-500/70 shadow-[0_0_25px_rgba(239,68,68,.8)]" />
      <div className="pointer-events-none absolute left-[3%] top-[48%] h-24 w-2 rounded-full bg-red-600/60 shadow-[0_0_22px_rgba(239,68,68,.7)]" />
      <div className="pointer-events-none absolute right-[3%] top-[48%] h-24 w-2 rounded-full bg-red-600/60 shadow-[0_0_22px_rgba(239,68,68,.7)]" />

      {/* corner brackets */}
      <div className="pointer-events-none absolute left-5 top-5 h-12 w-12 border-l-[5px] border-t-[5px] border-red-600 md:left-6 md:top-6" />
      <div className="pointer-events-none absolute right-5 top-5 h-12 w-12 border-r-[5px] border-t-[5px] border-red-600 md:right-6 md:top-6" />
      <div className="pointer-events-none absolute bottom-5 left-5 h-12 w-12 border-b-[5px] border-l-[5px] border-red-600 md:left-6 md:bottom-6" />
      <div className="pointer-events-none absolute bottom-5 right-5 h-12 w-12 border-b-[5px] border-r-[5px] border-red-600 md:right-6 md:bottom-6" />

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        <div className="relative mx-auto w-full max-w-[1500px]">
          <button
            onClick={() => setScan((value) => !value)}
            className="absolute left-0 top-0 z-20 flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-black/55 px-3 py-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-red-500/70"
            aria-label="Toggle bomb scan"
          >
            <span className={`text-[24px] leading-none ${scan ? "animate-pulse text-emerald-400" : "text-red-500"}`}>⌁</span>
            <span className="text-[10px] font-black uppercase tracking-wide text-white">Scan</span>
          </button>

          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-[72px] w-auto max-w-[250px] object-contain md:h-[86px] md:max-w-[300px]"
            />
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="absolute right-0 top-0 z-20 flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-black/55 px-3 py-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-red-500/70"
          >
            <HelpCircle size={29} strokeWidth={2.5} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-wide text-white">How To Play</span>
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[1050px] flex-1 flex-col items-center pb-7 pt-5 md:pt-7">
          <div className="text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.3em] text-emerald-400">
              <Check size={18} strokeWidth={3} />
              Device Disarmed
            </div>
            <h1 className="text-[42px] font-black uppercase leading-none tracking-[-0.045em] text-white drop-shadow-[0_0_18px_rgba(239,68,68,.18)] md:text-[58px]">
              Bomb <span className="text-red-500">Defused</span>
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-300 md:text-[17px]">
              Great job! You successfully defused the bomb.<br className="hidden md:block" />
              Move to the next challenge.
            </p>
          </div>

          {/* interactive bomb */}
          <button
            type="button"
            onClick={() => setScan((value) => !value)}
            className={`group relative mt-5 w-full max-w-[620px] cursor-pointer rounded-[28px] border-2 border-slate-600/80 bg-[linear-gradient(145deg,#242a2e,#080a0c)] p-4 text-left shadow-[0_25px_80px_rgba(0,0,0,.75),0_0_45px_rgba(239,68,68,.12)] transition duration-300 hover:scale-[1.01] hover:border-red-500/70 ${scan ? "ring-2 ring-emerald-400/70 shadow-[0_0_55px_rgba(34,197,94,.18)]" : ""}`}
            aria-label="Interact with defused bomb"
          >
            <div className="absolute -top-4 left-[18%] h-12 w-5 rounded-full bg-gradient-to-b from-slate-300 to-slate-700 shadow-lg" />
            <div className="absolute -top-4 left-[32%] h-12 w-5 rounded-full bg-gradient-to-b from-slate-300 to-slate-700 shadow-lg" />
            <div className="absolute -top-4 right-[32%] h-12 w-5 rounded-full bg-gradient-to-b from-slate-300 to-slate-700 shadow-lg" />
            <div className="absolute -top-4 right-[18%] h-12 w-5 rounded-full bg-gradient-to-b from-slate-300 to-slate-700 shadow-lg" />

            <div className="absolute -top-8 left-[20%] h-16 w-1 rotate-[-30deg] bg-red-600 shadow-[0_0_12px_rgba(239,68,68,.7)]" />
            <div className="absolute -top-8 left-[34%] h-16 w-1 rotate-[18deg] bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,.6)]" />
            <div className="absolute -top-8 right-[34%] h-16 w-1 rotate-[-18deg] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,.6)]" />
            <div className="absolute -top-8 right-[20%] h-16 w-1 rotate-[30deg] bg-red-600 shadow-[0_0_12px_rgba(239,68,68,.7)]" />

            <div className="relative rounded-[20px] border border-slate-500/70 bg-[#111518] p-4 shadow-inner md:p-5">
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">DEFUSAL UNIT</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${pulse ? "text-emerald-300" : "text-emerald-500"}`}>● SAFE</span>
              </div>

              <div className="mx-auto mt-4 max-w-[430px] rounded-2xl border border-emerald-500/50 bg-black p-5 text-center shadow-[inset_0_0_35px_rgba(34,197,94,.12)]">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">SYSTEM STATUS</div>
                <div className="mt-2 text-[34px] font-black uppercase tracking-[0.04em] text-emerald-400 drop-shadow-[0_0_12px_rgba(34,197,94,.7)] md:text-[44px]">
                  DISARMED ✓
                </div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-700">Detonation disabled</div>
              </div>

              <div className="mt-4 grid grid-cols-3 items-center gap-3 text-center">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Level</div>
                  <div className="mt-1 text-2xl font-black text-red-500">{level}/10</div>
                </div>
                <div className="h-10 w-px justify-self-center bg-slate-600" />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Score</div>
                  <div className="mt-1 text-2xl font-black text-white">{score}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-[9px] font-black uppercase tracking-[0.28em] text-slate-500 transition group-hover:text-red-400">
              {scan ? "Diagnostic scan active · tap to close" : "Tap bomb to run diagnostic scan"}
            </div>
          </button>

          <div className="mt-5 w-full max-w-[810px] text-center">
            <div className="flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.35em] text-slate-400">
              <span className="h-px w-16 bg-red-700/60" />
              Bomb Defusal Training Division
              <span className="h-px w-16 bg-red-700/60" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-500">Operative: <span className="text-white">{name}</span></div>
          </div>

          <div className="mt-5 grid w-full max-w-[810px] gap-3 sm:grid-cols-2">
            <button
              onClick={onDownload}
              className="group flex h-[70px] items-center justify-center gap-3 rounded-xl border border-white/25 bg-black/50 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-950/30 md:text-base"
            >
              <Download size={22} strokeWidth={2.4} className="text-red-500 transition group-hover:scale-110" />
              Download Certificate
            </button>

            <button
              onClick={onNext}
              className="group flex h-[70px] items-center justify-center gap-3 rounded-xl border border-red-400 bg-red-600 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_0_28px_rgba(239,68,68,.28)] transition hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_0_42px_rgba(239,68,68,.45)] md:text-base"
            >
              Next Level
              <ArrowRight size={23} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}

function FinalCertificate({ name, score, onDownload, onPlayAgain }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <CertificateBackground />

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        <CertificateTopBar
          soundOn={true}
          setSoundOn={() => {}}
          onHowToPlay={() => setShowHowToPlay(true)}
        />

        <div className="mx-auto w-full max-w-[860px] flex-1 pb-8 pt-6 md:pt-7">
          <div className="mb-5 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.25em] text-emerald-500">
              <Sparkles size={17} strokeWidth={2.8} />
              Mission Accomplished
            </div>

            <h1 className="text-[39px] font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[48px]">
              Master <span className="text-red-600">Complete</span>
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500 md:text-[16px]">
              All 10 bombs have been successfully defused.
            </p>
          </div>

          <CertificateCard name={name} level={10} score={score} final />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              onClick={onDownload}
              className="group flex h-[66px] items-center justify-center gap-3 rounded-xl border-[1.5px] border-red-200 bg-white text-sm font-black uppercase tracking-[0.08em] text-slate-900 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-600 md:text-base"
            >
              <Download size={22} strokeWidth={2.4} className="text-red-600" />
              Download Certificate
            </button>

            <button
              onClick={onPlayAgain}
              className="group flex h-[66px] items-center justify-center gap-3 rounded-xl bg-red-600 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_25px_rgba(239,68,68,0.25)] transition hover:-translate-y-0.5 hover:bg-red-500 md:text-base"
            >
              <RotateCcw size={22} strokeWidth={2.5} />
              Play Again
            </button>
          </div>
        </div>
      </div>

      {showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}

function GameOver({ level, selected, reason, onRetry, onHome, soundOn, setSoundOn }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Play the supplied bomb.mp3 when the Game Over screen appears.
  useEffect(() => {
    if (!soundOn) return;

    const bombAudio = new Audio("/bomb.mp3");
    bombAudio.preload = "auto";
    bombAudio.volume = 1;

    bombAudio.play().catch(() => {
      // Browser autoplay restrictions are safe to ignore.
    });

    return () => {
      bombAudio.pause();
      bombAudio.currentTime = 0;
    };
  }, [soundOn]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070303] text-white">
      {/* Cinematic industrial blast-room background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,69,0,.9)_0%,rgba(120,10,0,.62)_20%,rgba(25,3,2,.9)_50%,#020203_88%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.38),transparent_32%,rgba(0,0,0,.2)_65%,rgba(0,0,0,.82))]" />

        {/* explosion core */}
        <div className="absolute left-1/2 top-[44%] h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/45 blur-[80px] animate-pulse" />
        <div className="absolute left-1/2 top-[44%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200/80 blur-[28px]" />
        <div className="absolute left-1/2 top-[44%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-orange-400/70 shadow-[0_0_80px_30px_rgba(255,70,0,.5)] animate-ping" />

        {/* industrial side structures */}
        <div className="absolute -left-8 top-[28%] h-[55%] w-[18%] rotate-[-2deg] rounded-r-2xl border-[7px] border-black/80 bg-gradient-to-b from-[#3a1710] via-[#171112] to-[#09090a] shadow-[25px_30px_60px_rgba(0,0,0,.9)]" />
        <div className="absolute -right-8 top-[25%] h-[58%] w-[18%] rotate-[2deg] rounded-l-2xl border-[7px] border-black/80 bg-gradient-to-b from-[#35120e] via-[#171112] to-[#09090a] shadow-[-25px_30px_60px_rgba(0,0,0,.9)]" />

        <div className="absolute left-0 bottom-[12%] h-4 w-[25%] rotate-[-8deg] bg-[#3a1712] shadow-[0_0_18px_rgba(255,50,20,.35)]" />
        <div className="absolute right-0 bottom-[14%] h-5 w-[26%] rotate-[7deg] bg-[#3a1712] shadow-[0_0_18px_rgba(255,50,20,.35)]" />

        {/* LARGE SIDE BOMB PROPS — clearly visible on Bomb Blast page */}
        <div className="pointer-events-none absolute left-[-55px] top-[47%] z-[8] h-[250px] w-[390px] rotate-[-7deg] md:left-[-35px] md:h-[290px] md:w-[450px]">
          <div className="absolute left-[4%] top-[37%] h-[112px] w-[88%] rounded-[28px] border-[9px] border-[#050607] bg-gradient-to-b from-[#a83a30] via-[#511719] to-[#090607] shadow-[0_25px_45px_rgba(0,0,0,.95),0_0_35px_rgba(255,45,20,.5),inset_0_8px_12px_rgba(255,160,120,.2)] md:h-[132px]">
            <div className="absolute left-[9%] top-[-8%] h-[116%] w-[27px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb6ba] via-[#50585e] to-[#111417]" />
            <div className="absolute left-[43%] top-[-8%] h-[116%] w-[27px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb6ba] via-[#50585e] to-[#111417]" />
            <div className="absolute right-[9%] top-[-8%] h-[116%] w-[27px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb6ba] via-[#50585e] to-[#111417]" />
            <div className="absolute right-[-27px] top-[15%] h-[70%] w-[55px] rounded-full border-[8px] border-black bg-gradient-to-br from-[#9ca5aa] via-[#41494f] to-[#0a0c0e] shadow-[8px_0_18px_rgba(0,0,0,.9)]" />
            <div className="absolute left-[15%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-red-300 shadow-[0_0_14px_6px_rgba(255,30,20,.95)] animate-pulse" />
          </div>

          <div className="absolute left-[25%] top-[48%] z-10 h-[68px] w-[190px] rounded-xl border-[7px] border-[#050607] bg-gradient-to-b from-[#505960] via-[#20262b] to-[#080a0c] p-2 shadow-[0_15px_25px_rgba(0,0,0,.95)] md:h-[78px] md:w-[215px]">
            <div className="flex h-full items-center justify-center rounded-md border-2 border-red-800 bg-[#050202] shadow-[inset_0_0_18px_rgba(255,0,0,.5)]">
              <span className="font-mono text-[29px] font-black tracking-[-.05em] text-red-400 drop-shadow-[0_0_12px_rgba(255,20,10,1)] md:text-[34px]">00:30</span>
            </div>
          </div>

          <div className="absolute left-[14%] top-[2%] h-[100px] w-[135px]">
            <span className="absolute bottom-0 left-[26%] h-[88px] w-[11px] rotate-[-20deg] rounded-full bg-gradient-to-r from-red-950 via-red-400 to-red-950 shadow-[0_0_14px_4px_rgba(255,40,20,.6)]" />
            <span className="absolute bottom-0 left-[48%] h-[100px] w-[11px] rotate-[4deg] rounded-full bg-gradient-to-r from-amber-950 via-amber-300 to-amber-950 shadow-[0_0_13px_4px_rgba(255,170,20,.45)]" />
            <span className="absolute bottom-0 left-[70%] h-[94px] w-[11px] rotate-[23deg] rounded-full bg-gradient-to-r from-blue-950 via-blue-400 to-blue-950 shadow-[0_0_13px_4px_rgba(40,130,255,.4)]" />
          </div>
        </div>

        <div className="pointer-events-none absolute right-[-55px] top-[47%] z-[8] h-[250px] w-[390px] -scale-x-100 rotate-[-7deg] md:right-[-35px] md:h-[290px] md:w-[450px]">
          <div className="absolute left-[4%] top-[37%] h-[112px] w-[88%] rounded-[28px] border-[9px] border-[#050607] bg-gradient-to-b from-[#a83a30] via-[#511719] to-[#090607] shadow-[0_25px_45px_rgba(0,0,0,.95),0_0_35px_rgba(255,45,20,.5),inset_0_8px_12px_rgba(255,160,120,.2)] md:h-[132px]">
            <div className="absolute left-[9%] top-[-8%] h-[116%] w-[27px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb6ba] via-[#50585e] to-[#111417]" />
            <div className="absolute left-[43%] top-[-8%] h-[116%] w-[27px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb6ba] via-[#50585e] to-[#111417]" />
            <div className="absolute right-[9%] top-[-8%] h-[116%] w-[27px] rounded-full border-[5px] border-black bg-gradient-to-r from-[#aeb6ba] via-[#50585e] to-[#111417]" />
            <div className="absolute right-[-27px] top-[15%] h-[70%] w-[55px] rounded-full border-[8px] border-black bg-gradient-to-br from-[#9ca5aa] via-[#41494f] to-[#0a0c0e] shadow-[8px_0_18px_rgba(0,0,0,.9)]" />
            <div className="absolute left-[15%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-red-300 shadow-[0_0_14px_6px_rgba(255,30,20,.95)] animate-pulse" />
          </div>
          <div className="absolute left-[25%] top-[48%] z-10 h-[68px] w-[190px] rounded-xl border-[7px] border-[#050607] bg-gradient-to-b from-[#505960] via-[#20262b] to-[#080a0c] p-2 shadow-[0_15px_25px_rgba(0,0,0,.95)] md:h-[78px] md:w-[215px]">
            <div className="flex h-full items-center justify-center rounded-md border-2 border-red-800 bg-[#050202] shadow-[inset_0_0_18px_rgba(255,0,0,.5)]">
              <span className="font-mono text-[29px] font-black tracking-[-.05em] text-red-400 drop-shadow-[0_0_12px_rgba(255,20,10,1)] md:text-[34px]">00:30</span>
            </div>
          </div>
          <div className="absolute left-[14%] top-[2%] h-[100px] w-[135px]">
            <span className="absolute bottom-0 left-[26%] h-[88px] w-[11px] rotate-[-20deg] rounded-full bg-gradient-to-r from-red-950 via-red-400 to-red-950" />
            <span className="absolute bottom-0 left-[48%] h-[100px] w-[11px] rotate-[4deg] rounded-full bg-gradient-to-r from-amber-950 via-amber-300 to-amber-950" />
            <span className="absolute bottom-0 left-[70%] h-[94px] w-[11px] rotate-[23deg] rounded-full bg-gradient-to-r from-blue-950 via-blue-400 to-blue-950" />
          </div>
        </div>

        {/* flying debris */}
        {[
          ["left-[25%]","top-[20%]","rotate-[18deg]","h-12","w-9"],
          ["left-[31%]","top-[30%]","rotate-[-28deg]","h-8","w-12"],
          ["left-[18%]","top-[48%]","rotate-[42deg]","h-10","w-7"],
          ["left-[70%]","top-[22%]","rotate-[-22deg]","h-11","w-8"],
          ["left-[77%]","top-[37%]","rotate-[35deg]","h-8","w-11"],
          ["left-[83%]","top-[52%]","rotate-[-12deg]","h-10","w-7"],
          ["left-[37%]","top-[15%]","rotate-[70deg]","h-7","w-5"],
          ["left-[63%]","top-[17%]","rotate-[-55deg]","h-8","w-6"],
        ].map(([x,y,r,h,w], i) => (
          <span
            key={i}
            className={`absolute ${x} ${y} ${r} ${h} ${w} rounded-md bg-gradient-to-br from-[#202124] via-[#090909] to-[#542015] shadow-[0_0_12px_rgba(255,75,15,.35)]`}
          />
        ))}

        {/* sparks */}
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={`spark-${i}`}
            className="absolute h-1.5 w-10 rounded-full bg-orange-300/80 shadow-[0_0_12px_4px_rgba(255,90,20,.7)]"
            style={{
              left: `${8 + ((i * 37) % 84)}%`,
              top: `${14 + ((i * 23) % 64)}%`,
              transform: `rotate(${(i * 29) % 170 - 85}deg)`,
              opacity: 0.35 + (i % 4) * 0.15,
            }}
          />
        ))}

        {/* floor reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-[31%] bg-[linear-gradient(180deg,transparent,rgba(255,55,15,.16),rgba(0,0,0,.78))]" />
        <div className="absolute bottom-[5%] left-1/2 h-1 w-[75%] -translate-x-1/2 bg-orange-500/30 blur-sm" />

        {/* frame corners */}
        <div className="absolute left-5 top-5 h-12 w-12 border-l-[6px] border-t-[6px] border-red-500 md:left-6 md:top-6" />
        <div className="absolute right-5 top-5 h-12 w-12 border-r-[6px] border-t-[6px] border-red-500 md:right-6 md:top-6" />
        <div className="absolute bottom-5 left-5 h-12 w-12 border-b-[6px] border-l-[6px] border-red-500 md:left-6 md:bottom-6" />
        <div className="absolute bottom-5 right-5 h-12 w-12 border-b-[6px] border-r-[6px] border-red-500 md:right-6 md:bottom-6" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        {/* top controls + centered logo */}
        <div className="grid grid-cols-3 items-start">
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/30 bg-black/55 px-3 py-4 shadow-[0_10px_35px_rgba(0,0,0,.5)] backdrop-blur-sm transition hover:-translate-y-0.5"
            aria-label="Toggle sound"
          >
            {soundOn ? (
              <Volume2 size={30} strokeWidth={2.5} className="text-red-500" />
            ) : (
              <VolumeX size={30} strokeWidth={2.5} className="text-red-500" />
            )}
            <span className="text-[11px] font-black uppercase tracking-wide text-white">Sound</span>
          </button>

          <div className="justify-self-center">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-[72px] w-auto max-w-[280px] object-contain drop-shadow-[0_4px_18px_rgba(255,255,255,.18)] md:h-[92px] md:max-w-[340px]"
            />
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="justify-self-end flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/30 bg-black/55 px-3 py-4 shadow-[0_10px_35px_rgba(0,0,0,.5)] backdrop-blur-sm transition hover:-translate-y-0.5"
          >
            <HelpCircle size={30} strokeWidth={2.5} className="text-red-500" />
            <span className="text-[11px] font-black uppercase tracking-wide text-white">How To Play</span>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center pb-4 pt-3 md:pb-8">
          <div className="w-full max-w-[1120px] text-center">
            <div className="mx-auto mb-4 flex items-center justify-center gap-5">
              <span className="h-px w-16 bg-red-500/80 md:w-24" />
              <span className="text-[12px] font-black uppercase tracking-[0.38em] text-red-200 drop-shadow-[0_0_8px_rgba(255,70,40,.65)] md:text-[14px]">
                Mission Terminated
              </span>
              <span className="h-px w-16 bg-red-500/80 md:w-24" />
            </div>

            <div className="relative mx-auto max-w-[980px]">
              <div className="absolute inset-x-[10%] top-1/2 h-[150px] -translate-y-1/2 rounded-full bg-orange-500/30 blur-[65px]" />
              <h1 className="relative text-[62px] font-black uppercase leading-[0.86] tracking-[-0.065em] text-white drop-shadow-[0_6px_0_rgba(0,0,0,.95),0_0_28px_rgba(255,55,10,.85)] sm:text-[82px] md:text-[118px]">
                <span className="text-white">BOMB</span>{" "}
                <span className="text-red-500 drop-shadow-[0_0_22px_rgba(255,40,0,.9)]">BLAST</span>
              </h1>
            </div>

            <div className="relative z-20 mx-auto mt-5 max-w-[820px] rounded-xl border-2 border-orange-400/60 bg-[#090403]/95 px-6 py-5 shadow-[0_18px_55px_rgba(0,0,0,.82),0_0_25px_rgba(255,70,10,.16)] shadow-[0_15px_45px_rgba(0,0,0,.55)] backdrop-blur-sm">
              <p className="text-lg font-extrabold leading-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,.95)] md:text-[22px] md:leading-9">
                {reason === "timeout" ? "The countdown reached zero." : `You selected ${selected || "an unsafe answer"}.`}
                <br />
                The bomb was not defused.
              </p>
              <div className="mt-5 border-t border-orange-500/20 pt-4 text-left">
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-300 drop-shadow-[0_0_6px_rgba(255,120,20,.55)]">Correct Answer</div>
                <div className="mt-1 text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.95)] md:text-3xl">{level.answer}</div>
                <div className="mt-4 text-[11px] font-black uppercase tracking-[0.25em] text-orange-300 drop-shadow-[0_0_6px_rgba(255,120,20,.55)]">Solution</div>
                <p className="mt-1 text-base font-semibold leading-7 text-white md:text-lg md:leading-8">{level.solution}</p>
              </div>
            </div>

            <div className="mx-auto mt-6 grid w-full max-w-[720px] gap-4 md:grid-cols-2">
              <button
                onClick={onRetry}
                className="group flex h-[72px] items-center justify-center gap-4 rounded-xl border border-red-400/70 bg-gradient-to-r from-red-700 to-red-500 px-6 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_35px_rgba(255,30,0,.35)] transition hover:-translate-y-0.5 hover:brightness-110 md:text-lg"
              >
                <RotateCcw size={29} strokeWidth={2.4} className="transition-transform duration-300 group-hover:-rotate-45" />
                Retry Mission
              </button>

              <button
                onClick={onHome}
                className="group flex h-[72px] items-center justify-center gap-4 rounded-xl border border-white/25 bg-black/70 px-6 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_10px_30px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-300 md:text-lg"
              >
                <House size={28} strokeWidth={2.3} />
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>

      {showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}

function CertificateBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[42%] h-[680px] w-[1050px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/20 blur-[110px]" />

      {/* corner brackets */}
      <div className="absolute left-5 top-5 h-10 w-10 border-l-[6px] border-t-[6px] border-red-600 md:left-6 md:top-6" />
      <div className="absolute right-5 top-5 h-10 w-10 border-r-[6px] border-t-[6px] border-red-600 md:right-6 md:top-6" />
      <div className="absolute bottom-5 left-5 h-10 w-10 border-b-[6px] border-l-[6px] border-red-600 md:left-6 md:bottom-6" />
      <div className="absolute bottom-5 right-5 h-10 w-10 border-b-[6px] border-r-[6px] border-red-600 md:right-6 md:bottom-6" />

      {/* circuit lines */}
      <div className="absolute left-0 top-[43%] h-px w-[18%] bg-red-200/70" />
      <div className="absolute left-[8%] top-[43%] h-8 w-24 border-b border-r border-red-200/70" />
      <div className="absolute left-0 top-[49%] h-px w-[17%] bg-red-200/60" />
      <div className="absolute left-[7%] top-[49%] h-9 w-28 border-b border-r border-red-200/60" />
      <div className="absolute left-0 top-[55%] h-px w-[18%] bg-red-200/60" />
      <div className="absolute left-[9%] top-[55%] h-9 w-24 border-b border-r border-red-200/60" />

      <div className="absolute right-0 top-[43%] h-px w-[18%] bg-red-200/70" />
      <div className="absolute right-[8%] top-[43%] h-8 w-24 border-b border-l border-red-200/70" />
      <div className="absolute right-0 top-[49%] h-px w-[17%] bg-red-200/60" />
      <div className="absolute right-[7%] top-[49%] h-9 w-28 border-b border-l border-red-200/60" />
      <div className="absolute right-0 top-[55%] h-px w-[18%] bg-red-200/60" />
      <div className="absolute right-[9%] top-[55%] h-9 w-24 border-b border-l border-red-200/60" />

      {[
        "left-[17.5%] top-[43%]",
        "left-[17.5%] top-[49%]",
        "left-[17.5%] top-[55%]",
        "right-[17.5%] top-[43%]",
        "right-[17.5%] top-[49%]",
        "right-[17.5%] top-[55%]",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} h-3 w-3 rounded-full border-2 border-red-200 bg-white`}
        />
      ))}

      {/* dot clusters */}
      <div className="absolute left-10 top-[27%] grid grid-cols-3 gap-2 opacity-60">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
        ))}
      </div>
      <div className="absolute right-10 top-[27%] grid grid-cols-3 gap-2 opacity-60">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
        ))}
      </div>

      {/* halftone corners */}
      <div
        className="absolute -bottom-16 -left-10 h-72 w-80 rotate-[-18deg] opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        className="absolute -bottom-16 -right-10 h-72 w-80 rotate-[18deg] opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
          backgroundSize: "16px 16px",
        }}
      />

      <span className="absolute left-[18%] top-[22%] text-3xl font-black text-red-300/75">+</span>
      <span className="absolute right-[20%] top-[21%] text-3xl font-black text-red-300/75">+</span>
      <span className="absolute left-[18%] bottom-[22%] text-2xl font-black text-red-300/70">+</span>
      <span className="absolute right-[19%] bottom-[21%] text-2xl font-black text-red-300/70">+</span>
    </div>
  );
}

function CertificateTopBar({ soundOn, setSoundOn, onHowToPlay }) {
  return (
    <div className="relative mx-auto w-full max-w-[1500px]">
      <button
        onClick={() => setSoundOn((value) => !value)}
        className="absolute left-0 top-0 flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        {soundOn ? (
          <Volume2 size={29} strokeWidth={2.5} className="text-red-600" />
        ) : (
          <VolumeX size={29} strokeWidth={2.5} className="text-red-600" />
        )}
        <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">
          Sound
        </span>
      </button>

      <div className="flex justify-center">
        <img
          src="/logo.png"
          alt="Nebuloid Tech Studio"
          className="h-[76px] w-auto max-w-[220px] object-contain md:h-[92px] md:max-w-[250px]"
        />
      </div>

      <button
        onClick={onHowToPlay}
        className="absolute right-0 top-0 flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <HelpCircle size={29} strokeWidth={2.5} className="text-red-600" />
        <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">
          How To Play
        </span>
      </button>
    </div>
  );
}

function HowToPlayOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
              Mission Guide
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">How To Play</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-500 transition hover:border-red-200 hover:text-red-600"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {[
            "Read the mission brief and clue carefully.",
            "Choose the correct answer before the countdown reaches zero.",
            "A wrong answer immediately ends the mission.",
            "Defuse all 10 levels to unlock the master certificate.",
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                {index + 1}
              </span>
              <p className="text-sm font-semibold leading-6 text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ name, level, score, final }) {
  return (
    <div className="rounded-[12px] border-[1.5px] border-red-500 bg-white p-2 shadow-[0_14px_35px_rgba(239,68,68,0.10)]">
      <div className="relative overflow-hidden rounded-[6px] border border-red-200 bg-white px-6 py-6 text-center md:px-12 md:py-7">
        {/* subtle certificate rays */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 50% 50%, rgba(239,68,68,.08) 0deg, rgba(239,68,68,.08) 1deg, transparent 1deg, transparent 8deg)",
          }}
        />

        {/* inner corner brackets */}
        <div className="absolute left-2 top-2 h-8 w-8 border-l-[5px] border-t-[5px] border-red-600" />
        <div className="absolute right-2 top-2 h-8 w-8 border-r-[5px] border-t-[5px] border-red-600" />
        <div className="absolute bottom-2 left-2 h-8 w-8 border-b-[5px] border-l-[5px] border-red-600" />
        <div className="absolute bottom-2 right-2 h-8 w-8 border-b-[5px] border-r-[5px] border-red-600" />

        <div className="relative z-10">
          <img
            src="/logo.png"
            alt="Nebuloid Tech Studio"
            className="mx-auto h-[58px] w-auto max-w-[180px] object-contain md:h-[66px]"
          />

          <div className="mx-auto mt-3 flex max-w-[300px] items-center justify-center gap-4">
            <span className="h-px w-14 bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            <span className="h-px w-14 bg-red-300" />
          </div>

          <p className="mt-4 text-[9px] font-black uppercase tracking-[0.32em] text-slate-500 md:text-[10px]">
            This Certifies That
          </p>

          <div className="mx-auto mt-1 flex max-w-[700px] items-center justify-center gap-4">
            <span className="hidden h-5 w-8 border-t-[3px] border-red-600 sm:block" />
            <h2 className="max-w-full break-words text-[35px] font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[48px]">
              {name}
            </h2>
            <span className="hidden h-5 w-8 border-t-[3px] border-red-600 sm:block" />
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-500 md:text-sm">
            has successfully{" "}
            {final ? "completed all 10 logical bomb-defusal missions" : `defused Bomb ${level}`}.
          </p>

          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-red-300" />
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span className="h-px w-10 bg-red-300" />
          </div>

          {/* shield / bomb seal */}
          <div className="mx-auto mt-4 flex h-[62px] w-[62px] items-center justify-center rounded-full border border-red-200 bg-red-50/60">
            {final ? (
              <Award size={31} strokeWidth={2.2} className="text-red-600" />
            ) : (
              <ShieldCheck size={31} strokeWidth={2.2} className="text-red-600" />
            )}
          </div>

          <p className="mt-2 text-[8px] font-black uppercase tracking-[0.3em] text-red-600">
            Bomb Defusal Command
          </p>

          <div className="mx-auto mt-3 h-px max-w-[480px] bg-slate-200" />

          <div className="mx-auto mt-3 flex max-w-[420px] items-center justify-center divide-x divide-slate-300">
            <div className="px-8">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                Level
              </p>
              <p className="mt-0.5 text-[24px] font-black leading-none text-red-600">
                {level}/10
              </p>
            </div>

            <div className="px-8">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                Score
              </p>
              <p className="mt-0.5 text-[24px] font-black leading-none text-slate-950">
                {score}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-3 h-px max-w-[480px] bg-slate-200" />

          <div className="mt-2 flex items-center justify-center gap-5 text-[8px] font-black uppercase tracking-[0.28em] text-slate-500">
            <span className="text-red-600">≋</span>
            Bomb Defusal Training Division
            <span className="text-red-600">≋</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-sm md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 px-4 py-4">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="min-w-[145px] rounded-xl border-2 border-red-500 bg-[#0a0d12]/95 px-5 py-4 shadow-[0_0_18px_rgba(239,68,68,.22)] backdrop-blur-md md:min-w-[165px]">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-400">
        {label}
      </p>
      <p className="mt-1 max-w-40 truncate text-lg font-black text-white md:text-xl">
        {value}
      </p>
    </div>
  );
}

export default App;
