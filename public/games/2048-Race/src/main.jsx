import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { jsPDF } from "jspdf";
import "./styles.css";

const TARGETS = [64, 128, 256, 512, 1024, 2048];
let tapAudioCtx = null;

const MODES = [
  { id: "classic", title: "CLASSIC", desc: "Standard 2048 race", icon: "▦" },
  { id: "sprint", title: "SPRINT", desc: "Fast target challenge", icon: "⚡" },
  { id: "survival", title: "SURVIVAL", desc: "Keep the board alive", icon: "◇" }
];

const blankBoard = () => Array.from({ length: 4 }, () => Array(4).fill(0));

function addRandom(board) {
  const empty = [];
  board.forEach((row, r) => row.forEach((v, c) => v === 0 && empty.push([r, c])));
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map(row => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function newBoard() {
  return addRandom(addRandom(blankBoard()));
}

function slideLine(line) {
  const values = line.filter(Boolean);
  const out = [];
  let gained = 0;
  let merged = false;
  for (let i = 0; i < values.length; i++) {
    if (values[i] === values[i + 1]) {
      const mergedValue = values[i] * 2;
      out.push(mergedValue);
      gained += mergedValue;
      merged = true;
      i++;
    } else {
      out.push(values[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return { line: out, gained, merged };
}

function moveBoard(board, dir) {
  const work = board.map(row => [...row]);
  let gained = 0;
  let merged = false;

  if (dir === "left" || dir === "right") {
    for (let r = 0; r < 4; r++) {
      let line = [...work[r]];
      if (dir === "right") line.reverse();
      const result = slideLine(line);
      line = result.line;
      if (dir === "right") line.reverse();
      work[r] = line;
      gained += result.gained;
      merged = merged || result.merged;
    }
  } else {
    for (let c = 0; c < 4; c++) {
      let line = [0,1,2,3].map(r => work[r][c]);
      if (dir === "down") line.reverse();
      const result = slideLine(line);
      line = result.line;
      if (dir === "down") line.reverse();
      for (let r = 0; r < 4; r++) work[r][c] = line[r];
      gained += result.gained;
      merged = merged || result.merged;
    }
  }

  const changed = JSON.stringify(board) !== JSON.stringify(work);
  return { board: changed ? addRandom(work) : board, gained, changed, merged };
}

function hasMoves(board) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!board[r][c]) return true;
    if (c < 3 && board[r][c] === board[r][c + 1]) return true;
    if (r < 3 && board[r][c] === board[r + 1][c]) return true;
  }
  return false;
}

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function CornerDecor() {
  return <>
    <div className="corner corner-tl"><i/><i/><i/><i/></div>
    <div className="corner corner-br"><i/><i/><i/><i/></div>
    <div className="dots dots-tr">{Array.from({length:20},(_,i)=><b key={i}/>)}</div>
    <div className="dots dots-bl">{Array.from({length:16},(_,i)=><b key={i}/>)}</div>
  </>;
}

function Brand({ home = false }) {
  if (home) {
    return (
      <div className="brand home-brand">
        <img src="/logo.png" alt="Nebuloid Tech" />
      </div>
    );
  }
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <span className="n-mark">N</span><span className="t-mark">T</span>
      </div>
      <div className="brand-name">NEBULOID TECH</div>
      <div className="brand-rule"><span/><em>◇</em><span/></div>
    </div>
  );
}

function Button({children, primary=false, onClick, icon}) {
  return <button className={`menu-btn ${primary ? "primary":""}`} onClick={onClick}>
    <span className="btn-icon">{icon}</span><span>{children}</span>
  </button>;
}


function FloatingKeyboard({ value, onChange, onEnter, onClose }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = React.useRef(null);

  const rows = [
    ["1","2","3","4","5","6","7","8","9","0"],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"]
  ];

  const press = (key) => {
    if (key === "BACKSPACE") onChange(value.slice(0, -1));
    else if (key === "SPACE") onChange(value + " ");
    else if (key === "ENTER") onEnter();
    else onChange(value + key);
  };

  const startDrag = (e) => {
    drag.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y };
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", stopDrag);
  };

  const moveDrag = (e) => {
    if (!drag.current) return;
    setPos({
      x: drag.current.px + e.clientX - drag.current.sx,
      y: drag.current.py + e.clientY - drag.current.sy
    });
  };

  const stopDrag = () => {
    drag.current = null;
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", stopDrag);
  };

  return (
    <div
      className="floating-name-keyboard"
      style={{ transform: `translate(calc(-50% + ${pos.x}px), ${pos.y}px)` }}
    >
      <div className="floating-name-keyboard-head" onPointerDown={startDrag}>
        <span>ON-SCREEN KEYBOARD</span>
        <button type="button" onPointerDown={e=>e.stopPropagation()} onClick={onClose}>×</button>
      </div>

      {rows.map((row, i) => (
        <div className="floating-name-keyboard-row" key={i}>
          {row.map(key => (
            <button type="button" key={key} onClick={() => press(key)}>{key}</button>
          ))}
        </div>
      ))}

      <div className="floating-name-keyboard-row floating-name-keyboard-bottom">
        <button type="button" className="wide" onClick={() => press("BACKSPACE")}>⌫</button>
        <button type="button" className="space" onClick={() => press("SPACE")}>SPACE</button>
        <button type="button" className="enter" onClick={() => press("ENTER")}>ENTER ↵</button>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("welcome");
  const [name, setName] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [target, setTarget] = useState(64);
  const [mode, setMode] = useState("classic");
  const [board, setBoard] = useState(newBoard);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState(null);
  const [viewingCertificate, setViewingCertificate] = useState(null);
  const [certs, setCerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("2048-race-certs") || "{}"); } catch { return {}; }
  });

  const highest = useMemo(() => Math.max(...board.flat()), [board]);

  const resetGame = useCallback(() => {
    setBoard(newBoard());
    setScore(0);
    setSeconds(0);
    setPaused(false);
    setRunning(true);
    setResult(null);
  }, []);

  useEffect(() => {
    if (page !== "game" || !running || paused || result) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [page, running, paused, result]);

  const finish = useCallback((won, finalScore=score, finalTime=seconds) => {
    setRunning(false);
    const item = { won, target, score: finalScore, time: finalTime, name: name.trim() || "Player", mode, date: new Date().toISOString() };
    setResult(item);
    if (won) {
      const next = { ...certs, [`${name.trim() || "Player"}-${target}`]: item };
      setCerts(next);
      localStorage.setItem("2048-race-certs", JSON.stringify(next));
    }
    setPage("result");
  }, [certs, mode, name, score, seconds, target]);

  const doMove = useCallback((dir) => {
    if (page !== "game" || paused || !running || result) return;
    const res = moveBoard(board, dir);
    if (!res.changed) {
      if (!hasMoves(board)) finish(false);
      return;
    }
    const nextScore = score + res.gained;
    if (res.merged) playMergeSound();
    setBoard(res.board);
    setScore(nextScore);
    if (res.board.flat().some(v => v >= target)) {
      finish(true, nextScore, seconds);
    } else if (!hasMoves(res.board)) {
      finish(false, nextScore, seconds);
    }
  }, [board, finish, page, paused, result, running, score, seconds, target]);

  useEffect(() => {
    const onKey = e => {
      const key = String(e.key || "").toLowerCase();
      const code = String(e.code || "");

      // Game controls: support both keyboard key names and physical WASD keys.
      const map = {
        arrowleft: "left", arrowright: "right", arrowup: "up", arrowdown: "down",
        a: "left", d: "right", w: "up", s: "down"
      };
      const codeMap = { KeyA: "left", KeyD: "right", KeyW: "up", KeyS: "down" };
      const direction = map[key] || codeMap[code];

      if (page === "game" && direction) {
        e.preventDefault();
        e.stopPropagation();
        doMove(direction);
        return;
      }

      if (page === "game" && key === "escape") {
        e.preventDefault();
        setPaused(p => !p);
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [doMove, page]);

  function playStartSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const play = () => {
        // Short futuristic "screen opening / panel opening" sound.
        // A soft rising whoosh followed by a bright confirmation chime.
        const master = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.24, now + 0.055);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(5200, now + 0.34);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.62);
        master.connect(filter);
        filter.connect(ctx.destination);

        const whoosh = ctx.createOscillator();
        const whooshGain = ctx.createGain();
        whoosh.type = "sine";
        whoosh.frequency.setValueAtTime(120, now);
        whoosh.frequency.exponentialRampToValueAtTime(760, now + 0.38);
        whoosh.frequency.exponentialRampToValueAtTime(360, now + 0.58);
        whooshGain.gain.setValueAtTime(0.0001, now);
        whooshGain.gain.exponentialRampToValueAtTime(0.34, now + 0.08);
        whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
        whoosh.connect(whooshGain);
        whooshGain.connect(master);

        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = "triangle";
        chime.frequency.setValueAtTime(660, now + 0.27);
        chime.frequency.exponentialRampToValueAtTime(990, now + 0.43);
        chimeGain.gain.setValueAtTime(0.0001, now + 0.27);
        chimeGain.gain.exponentialRampToValueAtTime(0.20, now + 0.31);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.60);
        chime.connect(chimeGain);
        chimeGain.connect(master);

        whoosh.start(now);
        whoosh.stop(now + 0.60);
        chime.start(now + 0.27);
        chime.stop(now + 0.60);

        chime.onended = () => ctx.close();
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(play).catch(() => ctx.close());
      } else {
        play();
      }
    } catch (error) {
      console.warn("Start sound could not be played:", error);
    }
  }

  function playTapSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!tapAudioCtx || tapAudioCtx.state === "closed") {
        tapAudioCtx = new AudioCtx();
      }

      const ctx = tapAudioCtx;
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(1, now);
      master.connect(ctx.destination);

      // Futuristic UI opening/tap sound at full output level.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.18);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.85, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(master);

      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "triangle";
      chime.frequency.setValueAtTime(760, now + 0.035);
      chime.frequency.exponentialRampToValueAtTime(1180, now + 0.13);
      chimeGain.gain.setValueAtTime(0.0001, now + 0.035);
      chimeGain.gain.exponentialRampToValueAtTime(0.65, now + 0.055);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      chime.connect(chimeGain);
      chimeGain.connect(master);

      const start = () => {
        osc.start(now);
        osc.stop(now + 0.23);
        chime.start(now + 0.035);
        chime.stop(now + 0.25);
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(start).catch(() => {});
      } else {
        start();
      }
    } catch (error) {
      console.warn("Tap sound could not be played:", error);
    }
  }

  useEffect(() => {
    const handleTap = () => playTapSound();
    document.addEventListener("pointerdown", handleTap, true);
    return () => document.removeEventListener("pointerdown", handleTap, true);
  }, []);

  function playMergeSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!tapAudioCtx || tapAudioCtx.state === "closed") {
        tapAudioCtx = new AudioCtx();
      }

      const ctx = tapAudioCtx;
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.32, now + 0.025);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
      master.connect(ctx.destination);

      // Smooth 2048 merge: a soft rising tone with a short higher chime.
      const tone = ctx.createOscillator();
      const toneGain = ctx.createGain();
      tone.type = "sine";
      tone.frequency.setValueAtTime(330, now);
      tone.frequency.exponentialRampToValueAtTime(660, now + 0.16);
      tone.frequency.exponentialRampToValueAtTime(520, now + 0.30);
      toneGain.gain.setValueAtTime(0.0001, now);
      toneGain.gain.exponentialRampToValueAtTime(0.62, now + 0.025);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      tone.connect(toneGain);
      toneGain.connect(master);

      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "triangle";
      chime.frequency.setValueAtTime(660, now + 0.045);
      chime.frequency.exponentialRampToValueAtTime(990, now + 0.17);
      chimeGain.gain.setValueAtTime(0.0001, now + 0.045);
      chimeGain.gain.exponentialRampToValueAtTime(0.34, now + 0.065);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);
      chime.connect(chimeGain);
      chimeGain.connect(master);

      const start = () => {
        tone.start(now);
        tone.stop(now + 0.33);
        chime.start(now + 0.045);
        chime.stop(now + 0.30);
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(start).catch(() => {});
      } else {
        start();
      }
    } catch (error) {
      console.warn("Merge sound could not be played:", error);
    }
  }

  function startFlow() {
    setPage("player");
  }

  function startGame() {
    if (!name.trim()) return;
    setPage("game");
    resetGame();
  }

  function viewCertificate(item) {
    setViewingCertificate(item);
    setPage("certificate");
  }

  function downloadCertificate(item) {
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = 297, H = 210, cx = W / 2;
      const red = [232, 25, 39], dark = [12, 18, 25], gray = [105, 112, 120];

      // Base
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      // Subtle 2048 watermark
      doc.setFont("helvetica", "bold");
      doc.setFontSize(104);
      doc.setTextColor(244, 246, 248);
      doc.text("2048", cx, 132, { align: "center" });

      // Borders
      doc.setDrawColor(...dark);
      doc.setLineWidth(0.7);
      doc.rect(6, 6, W - 12, H - 12);
      doc.setDrawColor(205, 209, 214);
      doc.setLineWidth(0.3);
      doc.rect(9, 9, W - 18, H - 18);
      doc.setDrawColor(...red);
      doc.setLineWidth(0.9);
      doc.line(10, 10, 58, 10);
      doc.line(W - 58, H - 10, W - 10, H - 10);
      doc.line(10, H - 10, 10, H - 58);
      doc.line(W - 10, 10, W - 10, 58);

      // Corner accents — lines only for maximum jsPDF compatibility
      doc.setFillColor(...dark);
      doc.rect(0, 0, 28, 4, "F");
      doc.rect(0, 0, 4, 28, "F");
      doc.setFillColor(...red);
      doc.rect(4, 0, 34, 7, "F");
      doc.rect(0, 4, 7, 34, "F");
      doc.setFillColor(...dark);
      doc.rect(W - 28, H - 4, 28, 4, "F");
      doc.rect(W - 4, H - 28, 4, 28, "F");
      doc.setFillColor(...red);
      doc.rect(W - 38, H - 7, 34, 7, "F");
      doc.rect(W - 7, H - 38, 7, 34, "F");

      // Top-right note
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...gray);
      doc.text("N U M B E R S", W - 14, 21, { align: "right" });
      doc.text("B U I L D", W - 14, 27, { align: "right" });
      doc.text("L E G E N D S", W - 14, 33, { align: "right" });
      doc.setDrawColor(...red);
      doc.setLineWidth(0.8);
      doc.line(W - 10, 18, W - 10, 35);

      // Logo-style wordmark
      doc.setFont("helvetica", "bold");
      doc.setFontSize(25);
      doc.setTextColor(...dark);
      doc.text("NT", 105, 31);
      doc.setFillColor(...red);
      doc.rect(103, 22, 5, 5, "F");
      doc.setFontSize(16);
      doc.setTextColor(...dark);
      doc.text("NEBULOID TECH", 120, 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.8);
      doc.text("DEFUSE  •  THINK  •  SURVIVE", 120, 37);

      // Main title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(42);
      doc.setTextColor(...dark);
      doc.text("2048", 126, 58, { align: "right" });
      doc.setTextColor(...red);
      doc.text("RACE", 130, 58);

      doc.setDrawColor(190, 194, 198);
      doc.setLineWidth(0.35);
      doc.line(62, 65, 235, 65);

      // Certificate heading
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.setTextColor(...dark);
      doc.text("CERTIFICATE OF ACHIEVEMENT", cx, 78, { align: "center" });
      doc.setFillColor(...red);
      doc.rect(67, 74.5, 2.5, 2.5, "F");
      doc.rect(227.5, 74.5, 2.5, 2.5, "F");

      // Recipient
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...gray);
      doc.text("PROUDLY PRESENTED TO", cx, 91, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(25);
      doc.setTextColor(...dark);
      doc.text(String(item.name || "PLAYER"), cx, 103, { align: "center" });

      doc.setDrawColor(...red);
      doc.setLineWidth(0.45);
      doc.line(98, 107, 136, 107);
      doc.line(161, 107, 199, 107);
      doc.setFillColor(...red);
      doc.rect(cx - 2.2, 104.8, 4.4, 4.4, "F");

      // Achievement sentence
      const target = String(item.target);
      const time = fmtTime(item.time);
      const score = String(item.score);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(30, 35, 40);
      doc.text(`reached Target ${target} in ${time} with a score of ${score}.`, cx, 119, { align: "center" });

      // Medal
      const mx = cx, my = 151;
      doc.setFillColor(246, 194, 57);
      doc.circle(mx, my, 20, "F");
      doc.setFillColor(188, 132, 18);
      doc.circle(mx, my, 17.5, "F");
      doc.setFillColor(22, 25, 28);
      doc.circle(mx, my, 15.2, "F");
      doc.setDrawColor(246, 194, 57);
      doc.setLineWidth(0.7);
      doc.circle(mx, my, 15.2);

      // Crown / target text
      doc.setFillColor(246, 194, 57);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("♛", mx, my - 4, { align: "center" });
      doc.setFontSize(6.5);
      doc.text("TARGET", mx, my + 6, { align: "center" });
      doc.setFontSize(12);
      doc.text(target, mx, my + 14, { align: "center" });

      // Laurel branches
      doc.setDrawColor(190, 130, 15);
      doc.setLineWidth(1.1);
      doc.line(mx - 18, my + 13, mx - 27, my - 14);
      doc.line(mx + 18, my + 13, mx + 27, my - 14);
      for (let i = 0; i < 7; i++) {
        const y = my - 12 + i * 4;
        const x = mx - 20 - Math.sin(i / 6 * Math.PI) * 4;
        doc.ellipse(x, y, 1.6, 3, -25, "F");
        doc.ellipse(W - x, y, 1.6, 3, 25, "F");
      }

      // Ribbons
      doc.setFillColor(...red);
      doc.rect(mx - 10, my + 17, 7, 18, "F");
      doc.rect(mx + 3, my + 17, 7, 18, "F");
      doc.setFillColor(255, 255, 255);
      doc.triangle(mx - 10, my + 35, mx - 3, my + 35, mx - 6.5, my + 31, "F");
      doc.triangle(mx + 3, my + 35, mx + 10, my + 35, mx + 6.5, my + 31, "F");

      // Date / authorized by
      const dateText = new Date(item.date).toLocaleDateString();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...dark);
      doc.text(dateText, 67, 170, { align: "center" });
      doc.setDrawColor(...dark);
      doc.setLineWidth(0.45);
      doc.line(45, 175, 89, 175);
      doc.setFontSize(6.5);
      doc.setTextColor(...gray);
      doc.text("D A T E", 67, 181, { align: "center" });

      doc.setFont("times", "italic");
      doc.setFontSize(14);
      doc.setTextColor(...dark);
      doc.text("Nebuloid Tech", 230, 170, { align: "center" });
      doc.setDrawColor(...dark);
      doc.line(208, 175, 252, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...gray);
      doc.text("A U T H O R I Z E D  B Y", 230, 181, { align: "center" });

      // Footer
      doc.setDrawColor(...red);
      doc.setLineWidth(0.45);
      doc.line(82, 193, 116, 193);
      doc.line(181, 193, 215, 193);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...dark);
      doc.text("SMALL MOVES", 130, 195, { align: "center" });
      doc.setTextColor(...red);
      doc.text("BIG WINS", 169, 195, { align: "center" });

      const safeName = String(item.name || "PLAYER").replace(/[^a-z0-9]/gi, "_");
      doc.save(`2048-Race-${safeName}-Target-${item.target}.pdf`);
    } catch (error) {
      console.error("Certificate PDF generation failed:", error);
      alert("Certificate PDF generate nahi ho paaya. Please try again.");
    }
  }

  const certItems = Object.values(certs);

  return (
    <>
      <style>{`
        .race-welcome{position:relative!important;overflow:hidden!important;background:#020b13!important;color:#fff!important;isolation:isolate}
        .race-welcome-bg{position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(circle at 50% 48%,rgba(11,55,82,.55),transparent 42%),linear-gradient(180deg,#06111b 0%,#020911 58%,#030b12 100%)}
        .race-grid{position:absolute;left:-8%;right:-8%;bottom:-16%;height:42%;transform:perspective(500px) rotateX(62deg);transform-origin:bottom;background-image:linear-gradient(rgba(60,133,178,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(60,133,178,.22) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent)}
        .race-glow{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}.race-glow-one{width:440px;height:440px;left:25%;top:22%;background:rgba(0,101,160,.28)}.race-glow-two{width:420px;height:420px;right:10%;bottom:2%;background:rgba(237,44,48,.16)}
        .race-float-tile{position:absolute;z-index:1;width:150px;height:150px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:58px;letter-spacing:-3px;background:rgba(10,22,38,.82);box-shadow:inset 0 0 0 3px rgba(255,255,255,.08),0 0 18px rgba(0,0,0,.7);text-shadow:0 0 18px currentColor;animation:raceFloat 5s ease-in-out infinite}.race-float-tile.small{width:105px;height:105px;font-size:42px}.race-float-tile.large{width:185px;height:185px;font-size:72px}
        .tile-pink{color:#ffb7dc;border:3px solid #d62f72;box-shadow:inset 0 0 25px rgba(214,47,114,.2),0 0 25px rgba(214,47,114,.45)}.tile-orange{color:#ffd0a0;border:3px solid #ff7a28;box-shadow:inset 0 0 25px rgba(255,122,40,.18),0 0 25px rgba(255,122,40,.4)}.tile-blue,.tile-cyan{color:#b9e4ff;border:3px solid #169dff;box-shadow:inset 0 0 25px rgba(22,157,255,.2),0 0 25px rgba(22,157,255,.45)}.tile-white{color:#dce8ff;border:3px solid #8798b3;box-shadow:inset 0 0 25px rgba(135,152,179,.18),0 0 25px rgba(135,152,179,.35)}
        .race-zero{position:absolute;z-index:1;color:#0d75b0;font-size:92px;font-weight:900;opacity:.18;filter:blur(1px);animation:raceDrift 7s ease-in-out infinite}.zero-one{left:68%;top:6%}.zero-two{left:33%;top:17%;font-size:55px}.zero-three{left:47%;top:67%;font-size:72px}.zero-four{right:25%;top:62%;font-size:44px}
        .race-line{position:absolute;height:5px;border-radius:10px;background:#ed2f3b;box-shadow:0 0 15px #ed2f3b;opacity:.65;transform:rotate(-22deg)}.line-one{left:7%;top:19%;width:110px}.line-two{right:8%;top:67%;width:120px}.line-three{left:72%;top:43%;width:70px;transform:rotate(-38deg)}
        .race-brand-top{position:absolute;z-index:5;top:4.2%;left:50%;transform:translateX(-50%);width:min(390px,34vw);display:flex;justify-content:center}.race-brand-top img{width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 5px 15px rgba(0,0,0,.8))}
        .race-hero{position:absolute;z-index:4;top:18%;left:50%;transform:translateX(-50%);width:min(760px,78vw);text-align:center}.race-welcome-label{display:flex;align-items:center;justify-content:center;gap:30px;color:#e8edf2;font-size:21px;letter-spacing:9px;font-weight:500;margin-bottom:10px}.race-welcome-label span{width:68px;height:2px;background:#f02e3c;box-shadow:0 0 10px rgba(240,46,60,.8)}.race-hero h1{margin:0;font-size:clamp(115px,13vw,205px);line-height:.86;letter-spacing:-8px;font-weight:1000;font-style:italic;background:linear-gradient(180deg,#fff 0%,#dfe4ea 48%,#9aa5b3 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 7px 0 rgba(0,0,0,.55)) drop-shadow(0 0 16px rgba(255,255,255,.12))}.race-hero h1 span::after{content:"";display:inline-block;width:clamp(70px,7vw,105px);height:clamp(70px,7vw,105px);margin-left:4px;border-radius:18px;background:linear-gradient(145deg,#ff5c60,#d81023);vertical-align:middle;box-shadow:inset 0 3px 8px rgba(255,255,255,.45),0 0 28px rgba(238,35,52,.35);opacity:.9;display:none}.race-subtitle{display:flex;align-items:center;justify-content:center;gap:28px;color:#dfeaff;font-size:40px;letter-spacing:16px;font-weight:700;margin-top:8px;text-shadow:0 0 14px rgba(79,165,255,.5)}.race-subtitle i{display:block;width:105px;height:5px;background:linear-gradient(90deg,#e72c39,#ff424b);box-shadow:0 0 12px rgba(231,44,57,.7)}
        .race-start{position:absolute;z-index:6;left:50%;top:52%;transform:translate(-50%,-50%);width:285px;height:285px;border-radius:50%;border:2px solid rgba(255,55,69,.9);background:radial-gradient(circle,#111a2b 0 56%,#090f1a 57% 65%,transparent 66%);box-shadow:0 0 0 8px rgba(255,44,58,.1),0 0 0 14px rgba(255,44,58,.16),0 0 38px rgba(255,38,54,.55),inset 0 0 30px rgba(255,30,45,.22);cursor:pointer;color:white;transition:transform .2s ease,box-shadow .2s ease}.race-start::before,.race-start::after{content:"";position:absolute;inset:15px;border-radius:50%;border:3px solid transparent;border-top-color:#ff3d4a;border-right-color:#ff3d4a;transform:rotate(-35deg);filter:drop-shadow(0 0 7px #ff3342);animation:raceStartSpin 6s linear infinite}.race-start::after{inset:28px;border-width:2px;border-top-color:#ff8b92;border-right-color:transparent;transform:rotate(145deg);animation:raceStartSpinReverse 8s linear infinite}.race-start span{font-size:37px;font-weight:600;letter-spacing:1px;text-shadow:0 2px 8px #000}.race-start:hover{transform:translate(-50%,-50%) scale(1.045);box-shadow:0 0 0 9px rgba(255,44,58,.12),0 0 0 17px rgba(255,44,58,.18),0 0 55px rgba(255,38,54,.72),inset 0 0 38px rgba(255,30,45,.3)}.race-start:active{transform:translate(-50%,-50%) scale(.98)}
        .race-menu-corner{position:absolute;z-index:7;right:3%;top:4%;display:flex;gap:10px}.race-menu-corner button{border:1px solid rgba(255,255,255,.3);background:rgba(4,10,17,.68);color:#fff;border-radius:12px;padding:12px 15px;font-size:11px;font-weight:800;letter-spacing:1px;cursor:pointer;backdrop-filter:blur(8px)}.race-menu-corner button:hover{border-color:#ff3a47;box-shadow:0 0 16px rgba(255,45,60,.25)}
        .race-bottom-note{position:absolute;z-index:4;bottom:5%;left:50%;transform:translateX(-50%);margin:0;color:#9aa7b7;font-size:12px;letter-spacing:5px;font-weight:700}.race-welcome .corner{z-index:8}
        @keyframes raceFloat{0%,100%{margin-top:0}50%{margin-top:-13px}}@keyframes raceDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-10px)}}@keyframes raceStartSpin{from{transform:rotate(-35deg)}to{transform:rotate(325deg)}}@keyframes raceStartSpinReverse{from{transform:rotate(145deg)}to{transform:rotate(-215deg)}}
        @media(max-width:800px){.race-brand-top{width:230px;top:6%}.race-hero{top:22%}.race-welcome-label{font-size:13px;letter-spacing:5px;gap:12px}.race-welcome-label span{width:35px}.race-subtitle{font-size:25px;letter-spacing:9px;gap:12px}.race-subtitle i{width:55px;height:3px}.race-start{width:220px;height:220px;top:57%}.race-start span{font-size:29px}.race-float-tile{width:95px;height:95px;font-size:38px}.race-float-tile.large{width:120px;height:120px;font-size:48px}.race-menu-corner{top:auto;bottom:11%;right:50%;transform:translateX(50%);white-space:nowrap}.race-bottom-note{display:none}}

        /* Player setup visual only — keeps all other screens unchanged. */
        .race-player{position:relative!important;overflow:hidden!important;background:#020912!important;color:#fff!important;isolation:isolate}
        .race-player-bg{position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(circle at 50% 50%,rgba(13,63,92,.48),transparent 42%),linear-gradient(180deg,#06121d 0%,#020a12 58%,#020810 100%)}
        .race-player-grid{position:absolute;left:-8%;right:-8%;bottom:-17%;height:43%;transform:perspective(520px) rotateX(62deg);transform-origin:bottom;background-image:linear-gradient(rgba(64,140,186,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(64,140,186,.2) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent)}
        .race-player-glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.5}.race-player-glow-one{width:520px;height:520px;left:22%;top:27%;background:rgba(0,104,165,.25)}.race-player-glow-two{width:500px;height:500px;right:3%;bottom:-5%;background:rgba(238,37,53,.13)}
        .race-player .race-float-tile{z-index:1;pointer-events:none}.race-player .race-zero,.race-player .race-line{z-index:1;pointer-events:none}
        .player-brand{z-index:6!important;position:absolute!important;top:3.2%!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:min(410px,34vw)!important;display:flex!important;justify-content:center!important}
        .player-brand img{width:100%!important;height:auto!important;object-fit:contain!important;filter:drop-shadow(0 5px 15px rgba(0,0,0,.8))!important}
        .race-player .player-content{position:relative!important;z-index:5!important;width:min(720px,76vw)!important;margin:0 auto!important;padding-top:18.5vh!important;text-align:center!important}
        .race-player .player-heading{display:flex!important;flex-direction:column!important;align-items:center!important}
        .race-player-welcome{display:flex;align-items:center;justify-content:center;gap:28px;color:#e8edf2;font-size:20px;letter-spacing:9px;font-weight:500;margin-bottom:8px;text-shadow:0 0 10px rgba(255,255,255,.12)}
        .race-player-welcome span{width:68px;height:2px;background:#f02e3c;box-shadow:0 0 10px rgba(240,46,60,.8)}
        .race-player-title{margin:0!important;font-size:clamp(100px,11vw,170px)!important;line-height:.84!important;letter-spacing:-7px!important;font-weight:1000!important;font-style:italic!important;background:linear-gradient(180deg,#fff 0%,#dfe4ea 48%,#9aa5b3 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;filter:drop-shadow(0 7px 0 rgba(0,0,0,.55)) drop-shadow(0 0 16px rgba(255,255,255,.12))!important}
        .race-player-subtitle{display:flex;align-items:center;justify-content:center;gap:28px;color:#dfeaff;font-size:34px;letter-spacing:14px;font-weight:700;margin-top:7px;text-shadow:0 0 14px rgba(79,165,255,.5)}
        .race-player-subtitle i{display:block;width:105px;height:5px;background:linear-gradient(90deg,#e72c39,#ff424b);box-shadow:0 0 12px rgba(231,44,57,.7)}
        .race-player .player-heading h2{margin:27px 0 0!important;color:#fff!important;font-size:38px!important;letter-spacing:7px!important;font-weight:800!important;text-transform:uppercase!important}
        .race-player .player-heading p{margin:11px 0 0!important;color:#b9c4d0!important;font-size:18px!important;line-height:1.5!important}
        .race-player .player-form{width:100%!important;margin:30px auto 0!important}
        .race-player .player-input-wrap{height:80px!important;border:2px solid #ff3a47!important;border-radius:17px!important;background:rgba(4,10,18,.72)!important;box-shadow:0 0 22px rgba(255,40,55,.34),inset 0 0 25px rgba(255,30,45,.08)!important;padding:0 22px!important;backdrop-filter:blur(7px)!important}
        .race-player .player-input-wrap:focus-within{box-shadow:0 0 30px rgba(255,40,55,.52),inset 0 0 25px rgba(255,30,45,.1)!important}
        .race-player .player-user-icon{margin-right:15px!important;transform:scale(1.08)!important;transform-origin:center!important;flex:0 0 42px!important}
        .race-player .player-input-wrap input{font-size:21px!important;color:#eaf0f6!important}
        .race-player .player-input-wrap input::placeholder{color:#8793a3!important}
        .race-player .player-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:24px!important;margin-top:28px!important}
        .race-player .player-actions .menu-btn{height:76px!important;border-radius:14px!important;font-size:20px!important;letter-spacing:1px!important}
        .race-player .player-actions .menu-btn.primary{background:linear-gradient(180deg,#ff313b,#d90d1c)!important;box-shadow:0 0 24px rgba(255,38,53,.45)!important}
        .race-player .player-enter-hint{margin-top:27px!important;color:#aeb8c5!important;font-size:16px!important}
        .race-player .enter-key{min-width:57px!important;height:31px!important;margin-right:8px!important}
        .player-zero-one{left:69%;top:10%}.player-zero-two{left:34%;top:23%;font-size:56px}.player-zero-three{right:23%;top:70%;font-size:48px}
        .player-line-one{left:5%;top:19%;width:115px}.player-line-two{right:7%;top:70%;width:125px}.player-line-three{left:74%;top:42%;width:75px;transform:rotate(-38deg)}
        @media(max-width:800px){
          .player-brand{width:260px!important;top:5%!important}
          .race-player .player-content{width:calc(100% - 34px)!important;padding-top:23vh!important}
          .race-player-welcome{font-size:13px;letter-spacing:5px;gap:12px}.race-player-welcome span{width:35px}
          .race-player-title{font-size:88px!important;letter-spacing:-4px!important}.race-player-subtitle{font-size:25px;letter-spacing:9px;gap:12px}.race-player-subtitle i{width:55px;height:3px}
          .race-player .player-heading h2{font-size:25px!important;letter-spacing:5px!important;margin-top:22px!important}.race-player .player-heading p{font-size:14px!important}
          .race-player .player-form{margin-top:25px!important}.race-player .player-input-wrap{height:68px!important}.race-player .player-input-wrap input{font-size:18px!important}
          .race-player .player-actions{gap:12px!important}.race-player .player-actions .menu-btn{height:62px!important;font-size:16px!important}.race-player .player-enter-hint{font-size:13px!important}
        }
        /* Target selection visual only — keeps target selection logic and every other screen unchanged. */
        .target-race{position:relative!important;overflow:hidden!important;background:#020811!important;color:#fff!important;isolation:isolate}
        .target-race-bg{position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(circle at 50% 45%,rgba(9,66,105,.34),transparent 38%),radial-gradient(circle at 76% 72%,rgba(198,28,45,.14),transparent 28%),linear-gradient(180deg,#030b14 0%,#020711 60%,#030912 100%)}
        .target-race-bg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 25%,transparent 75%,rgba(0,0,0,.35));pointer-events:none}
        .target-grid-floor{position:absolute;left:-8%;right:-8%;bottom:-18%;height:48%;transform:perspective(520px) rotateX(63deg);transform-origin:bottom;background-image:linear-gradient(rgba(67,145,193,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(67,145,193,.22) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent)}
        .target-glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}.target-glow.one{width:520px;height:520px;left:19%;top:20%;background:rgba(0,112,181,.22)}.target-glow.two{width:500px;height:500px;right:4%;bottom:-8%;background:rgba(232,30,52,.13)}
        .target-float{position:absolute;z-index:1;width:145px;height:145px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:58px;letter-spacing:-3px;background:rgba(7,19,33,.8);text-shadow:0 0 18px currentColor;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08),0 0 22px rgba(0,0,0,.7);animation:targetFloat 5.5s ease-in-out infinite;pointer-events:none}
        .target-float.small{width:100px;height:100px;font-size:42px}.target-float.large{width:180px;height:180px;font-size:70px}
        .target-float.pink{color:#ffb7dc;border:3px solid #d92f76;box-shadow:inset 0 0 25px rgba(217,47,118,.2),0 0 25px rgba(217,47,118,.42)}
        .target-float.orange{color:#ffd09e;border:3px solid #ff7c27;box-shadow:inset 0 0 25px rgba(255,124,39,.18),0 0 25px rgba(255,124,39,.4)}
        .target-float.blue{color:#b9e4ff;border:3px solid #169dff;box-shadow:inset 0 0 25px rgba(22,157,255,.2),0 0 25px rgba(22,157,255,.45)}
        .target-float.purple{color:#d4b5ff;border:3px solid #8e45ff;box-shadow:inset 0 0 25px rgba(142,69,255,.2),0 0 25px rgba(142,69,255,.42)}
        .target-float.gold{color:#ffe8a8;border:3px solid #ffc52d;box-shadow:inset 0 0 25px rgba(255,197,45,.2),0 0 25px rgba(255,197,45,.42)}
        .target-float.white{color:#dce8ff;border:3px solid #8b9bb5;box-shadow:inset 0 0 25px rgba(139,155,181,.18),0 0 25px rgba(139,155,181,.35)}
        .target-zero{position:absolute;z-index:1;color:#0872ad;font-size:80px;font-weight:900;opacity:.14;filter:blur(1px);animation:targetDrift 7s ease-in-out infinite}
        .target-zero.z1{left:68%;top:8%}.target-zero.z2{left:34%;top:24%;font-size:52px}.target-zero.z3{left:46%;top:72%;font-size:68px}.target-zero.z4{right:24%;top:57%;font-size:43px}
        .target-race .corner{z-index:8}
        .target-brand{position:absolute;z-index:7;top:3.2%;left:50%;transform:translateX(-50%);width:min(390px,32vw);display:flex;justify-content:center}
        .target-brand img{width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 5px 15px rgba(0,0,0,.85))}
        .target-hero{position:absolute;z-index:5;top:14.5%;left:50%;transform:translateX(-50%);width:min(1000px,86vw);text-align:center}
        .target-race-title{margin:0;font-size:clamp(68px,7vw,112px);line-height:.9;font-weight:1000;font-style:italic;letter-spacing:-4px;background:linear-gradient(180deg,#fff 0%,#dce3eb 52%,#96a2b2 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 5px 0 rgba(0,0,0,.45);filter:drop-shadow(0 0 12px rgba(255,255,255,.1))}
        .target-race-title .red{color:#ff3443;-webkit-text-fill-color:#ff3443;background:none}
        .target-select-label{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:8px;color:#f3f5f7;font-size:27px;letter-spacing:10px;font-weight:800;font-style:italic}
        .target-select-label .red{color:#ff3040}.target-select-label i{display:block;width:75px;height:3px;background:#f02f3e;box-shadow:0 0 12px rgba(240,47,62,.8)}
        .target-description{margin:14px 0 0;color:#c3ccd7;font-size:18px;line-height:1.45}
        .target-panel{position:absolute;z-index:5;top:31.5%;left:50%;transform:translateX(-50%);width:min(940px,76vw);padding:42px 38px 34px;border:1px solid rgba(194,211,226,.42);background:linear-gradient(180deg,rgba(5,13,22,.9),rgba(3,9,16,.82));box-shadow:0 20px 60px rgba(0,0,0,.55),inset 0 0 35px rgba(31,101,148,.08);clip-path:polygon(3% 0,97% 0,100% 8%,100% 92%,97% 100%,3% 100%,0 92%,0 8%)}
        .target-panel:before,.target-panel:after{content:"";position:absolute;top:8px;width:78px;height:4px;background:#ef2e3d;box-shadow:0 0 12px rgba(239,46,61,.75)}.target-panel:before{left:20px}.target-panel:after{right:20px}
        .target-grid-new{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .target-card-new{position:relative;height:135px;border-radius:17px;border:1px solid rgba(255,255,255,.2);background:linear-gradient(145deg,rgba(10,20,34,.92),rgba(3,10,18,.92));color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;overflow:hidden}
        .target-card-new:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 38%,rgba(255,255,255,.02));pointer-events:none}
        .target-card-new strong{font-size:43px;line-height:1;font-weight:900;letter-spacing:-1px;text-shadow:0 0 15px currentColor;position:relative}.target-card-new span{font-size:12px;letter-spacing:5px;font-weight:800;color:#dce6ef;position:relative}
        .target-card-new:hover{transform:translateY(-5px) scale(1.015);border-color:rgba(255,255,255,.6);box-shadow:0 10px 30px rgba(0,0,0,.4),0 0 24px rgba(255,255,255,.1)}
        .target-card-new.selected{transform:translateY(-3px);border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.16),0 0 28px currentColor,inset 0 0 35px rgba(255,255,255,.06)}
        .target-card-new.c64{color:#ffd19b;border-color:#ff812a}.target-card-new.c128{color:#aee0ff;border-color:#159eff}.target-card-new.c256{color:#ffb0b9;border-color:#ff3547}.target-card-new.c512{color:#d2b0ff;border-color:#954dff}.target-card-new.c1024{color:#8effc5;border-color:#13c86c}.target-card-new.c2048{color:#ffe59a;border-color:#ffc52c}
        .target-card-new.c64.selected{box-shadow:0 0 0 2px rgba(255,209,155,.2),0 0 30px rgba(255,129,42,.65),inset 0 0 35px rgba(255,129,42,.12)}
        .target-card-new.c128.selected{box-shadow:0 0 0 2px rgba(174,224,255,.2),0 0 30px rgba(21,158,255,.65),inset 0 0 35px rgba(21,158,255,.12)}
        .target-card-new.c256.selected{box-shadow:0 0 0 2px rgba(255,176,185,.2),0 0 30px rgba(255,53,71,.65),inset 0 0 35px rgba(255,53,71,.12)}
        .target-card-new.c512.selected{box-shadow:0 0 0 2px rgba(210,176,255,.2),0 0 30px rgba(149,77,255,.65),inset 0 0 35px rgba(149,77,255,.12)}
        .target-card-new.c1024.selected{box-shadow:0 0 0 2px rgba(142,255,197,.2),0 0 30px rgba(19,200,108,.65),inset 0 0 35px rgba(19,200,108,.12)}
        .target-card-new.c2048.selected{box-shadow:0 0 0 2px rgba(255,229,154,.2),0 0 30px rgba(255,197,44,.65),inset 0 0 35px rgba(255,197,44,.12)}
        .target-actions{display:grid;grid-template-columns:1fr 1fr;gap:24px;width:min(700px,100%);margin:26px auto 0}
        .target-actions .menu-btn{height:68px;border-radius:13px;font-size:18px;letter-spacing:1px}
        .target-actions .menu-btn.primary{background:linear-gradient(180deg,#ff303c,#d70d1c);box-shadow:0 0 25px rgba(255,43,58,.38)}
        @keyframes targetFloat{0%,100%{margin-top:0}50%{margin-top:-12px}}@keyframes targetDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(13px,-9px)}}
        @media(max-width:800px){
          .target-brand{width:245px;top:4%}.target-hero{top:15%;width:94vw}.target-race-title{font-size:60px}.target-select-label{font-size:19px;letter-spacing:6px;gap:12px}.target-select-label i{width:35px}.target-description{font-size:14px}
          .target-panel{top:30%;width:calc(100% - 24px);padding:30px 18px 22px}.target-grid-new{grid-template-columns:repeat(2,1fr);gap:12px}.target-card-new{height:105px}.target-card-new strong{font-size:31px}.target-card-new span{font-size:9px;letter-spacing:3px}.target-actions{gap:12px}.target-actions .menu-btn{height:58px;font-size:14px}
          .target-float{width:90px;height:90px;font-size:36px}.target-float.large{width:125px;height:125px;font-size:49px}
        }


        /* Race confirmation visual only — keeps confirmation logic and every other screen unchanged. */
        .confirm-race{position:relative!important;overflow:hidden!important;background:#020812!important;color:#fff!important;isolation:isolate}
        .confirm-race-bg{position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(circle at 50% 43%,rgba(8,60,100,.38),transparent 39%),radial-gradient(circle at 50% 75%,rgba(8,54,84,.22),transparent 36%),linear-gradient(180deg,#020812 0%,#020811 55%,#030a12 100%)}
        .confirm-race-bg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.4),transparent 24%,transparent 76%,rgba(0,0,0,.4));pointer-events:none}
        .confirm-grid-floor{position:absolute;left:-10%;right:-10%;bottom:-17%;height:47%;transform:perspective(520px) rotateX(64deg);transform-origin:bottom;background-image:linear-gradient(rgba(59,139,190,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(59,139,190,.2) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent)}
        .confirm-glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}.confirm-glow.one{width:560px;height:560px;left:18%;top:25%;background:rgba(0,107,177,.2)}.confirm-glow.two{width:520px;height:520px;right:4%;bottom:-5%;background:rgba(235,30,52,.14)}
        .confirm-float{position:absolute;z-index:1;width:145px;height:145px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:58px;letter-spacing:-3px;background:rgba(6,18,32,.78);text-shadow:0 0 18px currentColor;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08),0 0 22px rgba(0,0,0,.7);animation:confirmFloat 5.5s ease-in-out infinite;pointer-events:none}.confirm-float.small{width:100px;height:100px;font-size:42px}
        .confirm-float.pink{color:#ffb7dc;border:3px solid #d92f76;box-shadow:inset 0 0 25px rgba(217,47,118,.2),0 0 25px rgba(217,47,118,.42)}.confirm-float.orange{color:#ffd09e;border:3px solid #ff7c27;box-shadow:inset 0 0 25px rgba(255,124,39,.18),0 0 25px rgba(255,124,39,.4)}.confirm-float.blue{color:#b9e4ff;border:3px solid #169dff;box-shadow:inset 0 0 25px rgba(22,157,255,.2),0 0 25px rgba(22,157,255,.45)}.confirm-float.purple{color:#d4b5ff;border:3px solid #8e45ff;box-shadow:inset 0 0 25px rgba(142,69,255,.2),0 0 25px rgba(142,69,255,.42)}.confirm-float.green{color:#9bffd0;border:3px solid #13c86c;box-shadow:inset 0 0 25px rgba(19,200,108,.2),0 0 25px rgba(19,200,108,.42)}.confirm-float.white{color:#dce8ff;border:3px solid #8b9bb5;box-shadow:inset 0 0 25px rgba(139,155,181,.18),0 0 25px rgba(139,155,181,.35)}
        .confirm-zero{position:absolute;z-index:1;color:#0872ad;font-size:78px;font-weight:900;opacity:.13;filter:blur(1px);animation:confirmDrift 7s ease-in-out infinite}.confirm-zero.cz1{left:69%;top:10%}.confirm-zero.cz2{left:32%;top:22%;font-size:52px}.confirm-zero.cz3{left:47%;top:70%;font-size:65px}
        .confirm-line{position:absolute;z-index:1;height:5px;border-radius:10px;background:#ed2f3b;box-shadow:0 0 15px #ed2f3b;opacity:.72;transform:rotate(-24deg)}.confirm-line.cl1{left:1%;top:44%;width:105px}.confirm-line.cl2{right:5%;top:66%;width:125px}.confirm-line.cl3{left:77%;top:31%;width:76px;transform:rotate(-38deg)}
        .confirm-brand{position:absolute;z-index:7;top:5.1%;left:50%;transform:translateX(-50%);width:min(390px,32vw);display:flex;justify-content:center}.confirm-brand img{width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 5px 15px rgba(0,0,0,.85))}
        .confirm-hero{position:absolute;z-index:5;top:20.5%;left:50%;transform:translateX(-50%);width:min(1050px,88vw);text-align:center}.confirm-final{display:flex;align-items:center;justify-content:center;gap:28px;color:#e8edf2;font-size:23px;letter-spacing:9px;font-weight:600}.confirm-final i{display:block;width:90px;height:3px;background:#f02f3e;box-shadow:0 0 12px rgba(240,47,62,.8)}
        .confirm-hero h1{margin:13px 0 0;font-size:clamp(58px,6vw,96px);line-height:.95;letter-spacing:-3px;font-weight:1000;font-style:italic;text-shadow:0 5px 0 rgba(0,0,0,.5);filter:drop-shadow(0 0 14px rgba(255,255,255,.1))}.confirm-hero h1 span{color:#f4f6f8;background:linear-gradient(180deg,#fff,#bfc9d4);-webkit-background-clip:text;background-clip:text;color:transparent}.confirm-hero h1 b{color:#ff3545;text-shadow:0 0 22px rgba(255,45,60,.35)}
        .confirm-checker{height:22px;width:420px;margin:17px auto 0;display:flex;justify-content:center;gap:4px;transform:skewX(-22deg)}.confirm-checker span{width:30px;background:rgba(151,178,201,.16);border-top:1px solid rgba(190,215,234,.12)}.confirm-checker span:nth-child(2),.confirm-checker span:nth-child(4),.confirm-checker span:nth-child(6){background:rgba(210,226,238,.25)}.confirm-checker em{width:32px;background:#ef3040;box-shadow:0 0 13px rgba(239,48,64,.5)}
        .confirm-ready{margin-top:15px;color:#d6e0ea;font-size:17px;letter-spacing:7px;font-weight:600}
        .confirm-content{position:absolute;z-index:5;top:61%;left:50%;transform:translate(-50%,-50%);width:min(760px,78vw);text-align:center}.confirm-summary{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);align-items:center;column-gap:34px;width:100%}.confirm-summary:before{display:none}.confirm-summary>div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-width:0}.confirm-summary .confirm-divider{width:1px;height:63px;padding:0;background:#ed3040;box-shadow:0 0 8px rgba(237,48,64,.4);display:block}.confirm-summary small{color:#aebfd2;font-size:13px;letter-spacing:4px;font-weight:600;white-space:nowrap}.confirm-summary strong{font-size:31px;line-height:1.1;font-weight:900;color:#f5f7f9;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.confirm-summary .target-value{color:#ff3546;text-shadow:0 0 16px rgba(255,53,70,.4)}
        .confirm-content>p{margin:34px 0 0;color:#b8c8da;font-size:18px;line-height:1.45}.confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:28px;width:100%;margin:34px auto 0}.confirm-actions .menu-btn{height:76px;border-radius:13px;font-size:20px;letter-spacing:1px}.confirm-actions .menu-btn.primary{background:linear-gradient(180deg,#ff303c,#d70d1c);box-shadow:0 0 27px rgba(255,43,58,.48)}
        @keyframes confirmFloat{0%,100%{margin-top:0}50%{margin-top:-12px}}@keyframes confirmDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(13px,-9px)}}
        @media(max-width:800px){.confirm-brand{width:245px;top:5%}.confirm-hero{top:19%;width:94vw}.confirm-final{font-size:14px;letter-spacing:5px;gap:10px}.confirm-final i{width:35px;height:2px}.confirm-hero h1{font-size:48px}.confirm-checker{width:270px;height:16px;margin-top:12px}.confirm-checker span{width:19px}.confirm-ready{font-size:12px;letter-spacing:4px}.confirm-content{top:58%;width:calc(100% - 28px)}.confirm-summary{column-gap:10px}.confirm-summary .confirm-divider{height:48px}.confirm-summary small{font-size:9px;letter-spacing:2px}.confirm-summary strong{font-size:22px}.confirm-content>p{font-size:13px;margin-top:24px}.confirm-actions{gap:12px;margin-top:28px}.confirm-actions .menu-btn{height:60px;font-size:15px}.confirm-float{width:88px;height:88px;font-size:35px}.confirm-float.small{width:70px;height:70px;font-size:30px}}

        /* Select mode visual only — keeps mode selection logic unchanged. */
        .mode-race{position:relative!important;overflow:hidden!important;background:#020811!important;color:#fff!important;isolation:isolate}
        .mode-race-bg{position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(circle at 50% 43%,rgba(10,62,101,.34),transparent 40%),radial-gradient(circle at 78% 78%,rgba(226,28,48,.16),transparent 30%),linear-gradient(180deg,#020812 0%,#020811 55%,#040a12 100%)}
        .mode-race-bg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.3),transparent 25%,transparent 75%,rgba(0,0,0,.3));pointer-events:none}
        .mode-grid-floor{position:absolute;left:-8%;right:-8%;bottom:-18%;height:45%;transform:perspective(520px) rotateX(63deg);transform-origin:bottom;background-image:linear-gradient(rgba(57,139,190,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(57,139,190,.22) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent)}
        .mode-glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}.mode-glow.one{width:560px;height:560px;left:17%;top:22%;background:rgba(0,112,181,.22)}.mode-glow.two{width:520px;height:520px;right:2%;bottom:-10%;background:rgba(235,30,52,.15)}
        .mode-float{position:absolute;z-index:1;width:145px;height:145px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:58px;letter-spacing:-3px;background:rgba(7,18,32,.8);text-shadow:0 0 18px currentColor;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08),0 0 22px rgba(0,0,0,.7);animation:modeFloat 5.5s ease-in-out infinite;pointer-events:none}
        .mode-float.small{width:100px;height:100px;font-size:42px}.mode-float.large{width:180px;height:180px;font-size:70px}
        .mode-float.pink{color:#ffb7dc;border:3px solid #d92f76;box-shadow:inset 0 0 25px rgba(217,47,118,.2),0 0 25px rgba(217,47,118,.42)}
        .mode-float.orange{color:#ffd09e;border:3px solid #ff7c27;box-shadow:inset 0 0 25px rgba(255,124,39,.18),0 0 25px rgba(255,124,39,.4)}
        .mode-float.blue{color:#b9e4ff;border:3px solid #169dff;box-shadow:inset 0 0 25px rgba(22,157,255,.2),0 0 25px rgba(22,157,255,.45)}
        .mode-float.purple{color:#d4b5ff;border:3px solid #8e45ff;box-shadow:inset 0 0 25px rgba(142,69,255,.2),0 0 25px rgba(142,69,255,.42)}
        .mode-float.green{color:#9bffd0;border:3px solid #13c86c;box-shadow:inset 0 0 25px rgba(19,200,108,.2),0 0 25px rgba(19,200,108,.42)}
        .mode-zero{position:absolute;z-index:1;color:#0872ad;font-size:80px;font-weight:900;opacity:.14;filter:blur(1px);animation:modeDrift 7s ease-in-out infinite}
        .mode-zero.z1{left:69%;top:7%}.mode-zero.z2{left:31%;top:19%;font-size:50px}.mode-zero.z3{left:48%;top:67%;font-size:68px}.mode-zero.z4{right:22%;top:57%;font-size:43px}
        .mode-line{position:absolute;z-index:1;height:5px;border-radius:10px;background:#ed2f3b;box-shadow:0 0 15px #ed2f3b;opacity:.75;transform:rotate(-24deg)}.mode-line.l1{left:3%;top:47%;width:105px}.mode-line.l2{right:7%;top:69%;width:125px}.mode-line.l3{left:78%;top:31%;width:78px;transform:rotate(-38deg)}.mode-line.l4{left:14%;top:76%;width:92px;transform:rotate(8deg)}
        .mode-brand{position:absolute;z-index:7;top:3.3%;left:50%;transform:translateX(-50%);width:min(390px,32vw);display:flex;justify-content:center}.mode-brand img{width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 5px 15px rgba(0,0,0,.85))}
        .mode-hero{position:absolute;z-index:5;top:14.5%;left:50%;transform:translateX(-50%);width:min(1000px,88vw);text-align:center}
        .mode-title{margin:0;font-size:clamp(76px,7.4vw,120px);line-height:.86;font-weight:1000;font-style:italic;letter-spacing:-5px;background:linear-gradient(180deg,#fff 0%,#dce3eb 50%,#96a2b2 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 rgba(0,0,0,.48)) drop-shadow(0 0 14px rgba(255,255,255,.1))}
        .mode-title .red{color:#ff3443;-webkit-text-fill-color:#ff3443;background:none}
        .mode-select-label{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:10px;color:#f3f5f7;font-size:28px;letter-spacing:11px;font-weight:800;font-style:italic}.mode-select-label .red{color:#ff3040}.mode-select-label i{display:block;width:75px;height:3px;background:#f02f3e;box-shadow:0 0 12px rgba(240,47,62,.8)}
        .mode-description{margin:13px 0 0;color:#c7d0da;font-size:18px;line-height:1.45}
        .mode-content{position:absolute;z-index:5;top:38.5%;left:50%;transform:translateX(-50%);width:min(1000px,82vw)}
        .mode-grid-new{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
        .mode-card-new{position:relative;height:285px;border-radius:16px;border:2px solid rgba(255,255,255,.2);background:linear-gradient(145deg,rgba(8,18,31,.94),rgba(3,10,18,.92));color:#fff;cursor:pointer;text-align:left;padding:30px 34px;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;overflow:hidden}
        .mode-card-new:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 42%,rgba(255,255,255,.015));pointer-events:none}
        .mode-card-new:after{content:"";position:absolute;right:-20px;bottom:-35px;width:145px;height:110px;transform:skewX(-25deg);background:rgba(255,255,255,.05);border-top:1px solid rgba(255,255,255,.08);pointer-events:none}
        .mode-card-new .mode-icon{position:relative;z-index:1;width:62px;height:62px;display:flex;align-items:center;justify-content:center;font-size:49px;line-height:1;font-weight:900;margin-bottom:16px;text-shadow:0 0 18px currentColor}
        .mode-card-new strong{position:relative;z-index:1;font-size:30px;line-height:1.1;font-weight:900;margin-bottom:9px}.mode-card-new small{position:relative;z-index:1;font-size:17px;line-height:1.4;color:#c8d1dc}
        .mode-card-new.selected{transform:translateY(-3px);border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.12),0 0 30px currentColor,inset 0 0 35px rgba(255,255,255,.06)}
        .mode-card-new:hover{transform:translateY(-5px);border-color:rgba(255,255,255,.72)}
        .mode-card-new.classic{color:#ff5964;border-color:#ff3b49;background:linear-gradient(145deg,rgba(45,4,13,.86),rgba(13,4,12,.92))}
        .mode-card-new.sprint{color:#159dff;border-color:#169dff;background:linear-gradient(145deg,rgba(3,28,55,.86),rgba(3,13,27,.92))}
        .mode-card-new.survival{color:#18d879;border-color:#13c86c;background:linear-gradient(145deg,rgba(2,45,30,.86),rgba(2,18,14,.92))}
        .mode-card-new.classic .mode-icon{color:#ff7b83}.mode-card-new.sprint .mode-icon{color:#ffc02e}.mode-card-new.survival .mode-icon{color:#16e47e}
        .mode-card-new.classic.selected{box-shadow:0 0 0 2px rgba(255,255,255,.14),0 0 30px rgba(255,48,62,.65),inset 0 0 35px rgba(255,30,45,.12)}
        .mode-card-new.sprint.selected{box-shadow:0 0 0 2px rgba(174,224,255,.14),0 0 30px rgba(21,158,255,.65),inset 0 0 35px rgba(21,158,255,.12)}
        .mode-card-new.survival.selected{box-shadow:0 0 0 2px rgba(142,255,197,.14),0 0 30px rgba(19,200,108,.65),inset 0 0 35px rgba(19,200,108,.12)}
        .mode-card-new .corner-check{position:absolute;right:20px;bottom:20px;z-index:1;font-size:62px;line-height:.8;opacity:.32;font-weight:900}
        .mode-actions{display:grid;grid-template-columns:1fr 1fr;gap:24px;width:min(880px,100%);margin:36px auto 0}.mode-actions .menu-btn{height:76px;border-radius:13px;font-size:20px;letter-spacing:1px}.mode-actions .menu-btn.primary{background:linear-gradient(180deg,#ff303c,#d70d1c);box-shadow:0 0 25px rgba(255,43,58,.42)}
        @keyframes modeFloat{0%,100%{margin-top:0}50%{margin-top:-12px}}@keyframes modeDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(13px,-9px)}}
        @media(max-width:800px){
          .mode-brand{width:245px;top:4%}.mode-hero{top:15%;width:94vw}.mode-title{font-size:60px}.mode-select-label{font-size:19px;letter-spacing:6px;gap:12px}.mode-select-label i{width:35px}.mode-description{font-size:14px}
          .mode-content{top:35%;width:calc(100% - 24px)}.mode-grid-new{grid-template-columns:1fr;gap:12px}.mode-card-new{height:150px;padding:20px 24px}.mode-card-new .mode-icon{width:48px;height:48px;font-size:38px;margin-bottom:8px}.mode-card-new strong{font-size:23px}.mode-card-new small{font-size:14px}.mode-card-new .corner-check{font-size:48px}
          .mode-actions{gap:12px;margin-top:18px}.mode-actions .menu-btn{height:58px;font-size:14px}
          .mode-float{width:90px;height:90px;font-size:36px}.mode-float.large{width:125px;height:125px;font-size:49px}
        }

        /* Game screen visual redesign — game logic and controls remain unchanged. */
        .game-screen{position:relative!important;overflow:hidden!important;background:#020912!important;color:#fff!important;isolation:isolate!important;min-height:calc(100vh - 38px)!important}
        .game-screen:before{content:"";position:absolute;inset:0;z-index:0;background:radial-gradient(circle at 50% 48%,rgba(10,57,88,.5),transparent 38%),radial-gradient(circle at 78% 72%,rgba(226,30,47,.16),transparent 30%),linear-gradient(180deg,#030b14 0%,#010810 58%,#02070d 100%);pointer-events:none}
        .game-screen:after{content:"";position:absolute;left:-8%;right:-8%;bottom:-20%;height:46%;z-index:0;transform:perspective(520px) rotateX(63deg);transform-origin:bottom;background-image:linear-gradient(rgba(47,133,187,.23) 1px,transparent 1px),linear-gradient(90deg,rgba(47,133,187,.23) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent);pointer-events:none}
        .game-bg-glow{position:absolute;z-index:0;border-radius:50%;filter:blur(95px);pointer-events:none}.game-bg-glow.one{width:560px;height:560px;left:14%;top:23%;background:rgba(0,108,178,.22)}.game-bg-glow.two{width:520px;height:520px;right:4%;bottom:-7%;background:rgba(235,29,50,.15)}
        .game-float{position:absolute;z-index:1;width:145px;height:145px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:58px;letter-spacing:-3px;background:rgba(7,18,32,.8);text-shadow:0 0 18px currentColor;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08),0 0 22px rgba(0,0,0,.7);pointer-events:none;animation:gameFloat 5.5s ease-in-out infinite}.game-float.small{width:100px;height:100px;font-size:42px}.game-float.large{width:180px;height:180px;font-size:70px}
        .game-float.pink{color:#ffb7dc;border:3px solid #d92f76;box-shadow:inset 0 0 25px rgba(217,47,118,.2),0 0 25px rgba(217,47,118,.42)}.game-float.orange{color:#ffd09e;border:3px solid #ff7c27;box-shadow:inset 0 0 25px rgba(255,124,39,.18),0 0 25px rgba(255,124,39,.4)}.game-float.blue{color:#b9e4ff;border:3px solid #169dff;box-shadow:inset 0 0 25px rgba(22,157,255,.2),0 0 25px rgba(22,157,255,.45)}.game-float.purple{color:#d4b5ff;border:3px solid #8e45ff;box-shadow:inset 0 0 25px rgba(142,69,255,.2),0 0 25px rgba(142,69,255,.42)}.game-float.green{color:#9bffd0;border:3px solid #13c86c;box-shadow:inset 0 0 25px rgba(19,200,108,.2),0 0 25px rgba(19,200,108,.42)}.game-float.white{color:#dce8ff;border:3px solid #8b9bb5;box-shadow:inset 0 0 25px rgba(139,155,181,.18),0 0 25px rgba(139,155,181,.35)}
        .game-zero{position:absolute;z-index:1;color:#0872ad;font-size:78px;font-weight:900;opacity:.14;filter:blur(1px);pointer-events:none;animation:gameDrift 7s ease-in-out infinite}.game-zero.z1{left:70%;top:11%}.game-zero.z2{left:27%;top:22%;font-size:48px}.game-zero.z3{left:47%;top:70%;font-size:62px}.game-zero.z4{right:23%;top:54%;font-size:42px}
        .game-line{position:absolute;z-index:1;height:5px;border-radius:10px;background:#ed2f3b;box-shadow:0 0 15px #ed2f3b;opacity:.75;pointer-events:none;transform:rotate(-24deg)}.game-line.l1{left:1%;top:49%;width:105px}.game-line.l2{right:7%;top:70%;width:125px}.game-line.l3{left:82%;top:38%;width:78px;transform:rotate(-38deg)}.game-line.l4{left:16%;top:77%;width:92px;transform:rotate(8deg)}
        .game-top{position:absolute!important;z-index:8!important;top:28px!important;left:50%!important;transform:translateX(-50%)!important;width:min(1160px,92vw)!important;height:72px!important;display:grid!important;grid-template-columns:140px 145px 300px 145px 145px 150px!important;align-items:center!important;gap:18px!important;background:transparent!important;padding:0!important}.game-top>button:first-child{grid-column:1}.game-top>div:nth-of-type(1){grid-column:2}.game-top>div:nth-of-type(2){grid-column:4}.game-top>div:nth-of-type(3){grid-column:5}.game-top>button:last-child{grid-column:6}
        .game-top:before{content:"";position:absolute;z-index:-1;left:50%;top:-5px;transform:translateX(-50%);width:310px;height:68px;background:radial-gradient(ellipse,rgba(4,24,39,.8),transparent 72%);pointer-events:none}
        .game-top>div{height:72px;border:1px solid rgba(72,137,181,.42);border-radius:13px;background:rgba(3,12,21,.72);box-shadow:inset 0 0 20px rgba(22,103,157,.08),0 10px 25px rgba(0,0,0,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;backdrop-filter:blur(7px)}
        .game-top>div:nth-of-type(1) strong{color:#ff2638}.game-top>div:nth-of-type(2) strong{color:#66d9ff}.game-top>div:nth-of-type(3) strong{color:#ffc02e}
        .stat-label{font-size:14px!important;letter-spacing:2px!important;color:#a8b7c7!important;font-weight:800!important}.game-top>div strong{font-size:34px!important;line-height:1!important;font-weight:900!important;text-shadow:0 0 12px currentColor!important}
        .game-top .small-btn{height:58px!important;border:2px solid #ff3545!important;border-radius:10px!important;background:rgba(8,10,17,.8)!important;color:#fff!important;font-size:16px!important;font-weight:900!important;letter-spacing:1px!important;box-shadow:0 0 16px rgba(255,40,55,.34)!important;cursor:pointer!important}.game-top .small-btn:hover{box-shadow:0 0 25px rgba(255,40,55,.55)!important;transform:translateY(-1px)}
        .game-top .small-btn:first-child:before{content:"Ⅱ";color:#ff3344;margin-right:12px;font-size:18px}.game-top .small-btn:last-child:before{content:"⟳";color:#ff3344;margin-right:10px;font-size:19px}
        .game-top .small-btn:first-child{font-size:16px!important}.game-top .small-btn:first-child:after{content:none}.game-top .small-btn:last-child{font-size:16px}
        .game-content{position:relative!important;z-index:5!important;width:100%!important;height:100%!important;display:flex!important;flex-direction:column!important;align-items:center!important;padding-top:104px!important;box-sizing:border-box!important}
        .game-title{display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;margin:0!important}.game-title>span{font-size:58px!important;line-height:.9!important;font-weight:1000!important;font-style:italic!important;letter-spacing:-3px!important;background:linear-gradient(180deg,#fff 0%,#dce4ed 50%,#8f9cab 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;filter:drop-shadow(0 5px 0 rgba(0,0,0,.5))!important}.game-title>h1{display:none!important}.game-title>p{margin:12px 0 0!important;font-size:21px!important;color:#e7edf5!important}.game-title>p b{color:#ff3343!important}
        .game-board-frame{position:relative!important;margin-top:18px!important;padding:20px!important;border:1px solid rgba(75,145,194,.5)!important;background:rgba(4,14,24,.72)!important;box-shadow:0 18px 55px rgba(0,0,0,.6),inset 0 0 30px rgba(35,117,170,.08)!important;border-radius:12px!important}
        .game-board-frame:before,.game-board-frame:after{content:"";position:absolute;width:38px;height:38px;pointer-events:none}.game-board-frame:before{left:-6px;top:-6px;border-left:4px solid #ff3344;border-top:4px solid #ff3344;border-radius:7px 0 0 0;filter:drop-shadow(0 0 7px #ff3344)}.game-board-frame:after{right:-6px;bottom:-6px;border-right:4px solid #ff3344;border-bottom:4px solid #ff3344;border-radius:0 0 7px 0;filter:drop-shadow(0 0 7px #ff3344)}
        .game-screen .board-wrap{position:relative!important;margin:0!important;width:auto!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}.game-screen .board{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:11px!important;width:545px!important;height:545px!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}
        .game-screen .tile{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;border-radius:9px!important;border:1px solid rgba(120,151,183,.48)!important;background:linear-gradient(145deg,rgba(27,42,58,.9),rgba(11,24,38,.92))!important;color:#eaf1f8!important;font-size:52px!important;font-weight:900!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:inset 0 0 20px rgba(82,129,168,.08),0 0 10px rgba(0,0,0,.22)!important;text-shadow:0 2px 6px rgba(0,0,0,.5)!important}
        .game-screen .tile.tile-2{background:linear-gradient(145deg,#f7f9fc,#dbe4ee)!important;color:#18283b!important;box-shadow:0 0 15px rgba(215,232,248,.28)!important}.game-screen .tile.tile-4{background:linear-gradient(145deg,#fff0df,#ffd3ae)!important;color:#2a1d17!important;box-shadow:0 0 15px rgba(255,185,120,.25)!important}.game-screen .tile.tile-8{background:linear-gradient(145deg,#ffb04f,#ed5d20)!important;color:#fff!important;box-shadow:0 0 20px rgba(255,108,39,.35)!important}.game-screen .tile.tile-16{background:linear-gradient(145deg,#168fff,#0757a8)!important;color:#fff!important;box-shadow:0 0 20px rgba(22,143,255,.35)!important}.game-screen .tile.tile-32{background:linear-gradient(145deg,#169dff,#0757a8)!important;color:#fff!important;box-shadow:0 0 20px rgba(22,157,255,.38)!important}.game-screen .tile.tile-64{background:linear-gradient(145deg,#18e58a,#079a58)!important;color:#fff!important;box-shadow:0 0 22px rgba(19,200,108,.4)!important}.game-screen .tile.tile-128{background:linear-gradient(145deg,#a447ff,#5c1aa8)!important;color:#fff!important;box-shadow:0 0 22px rgba(142,69,255,.38)!important}.game-screen .tile.tile-256{background:linear-gradient(145deg,#ff4053,#b80f22)!important;color:#fff!important;box-shadow:0 0 22px rgba(255,53,71,.42)!important}.game-screen .tile.tile-512,.game-screen .tile.tile-1024,.game-screen .tile.tile-2048{background:linear-gradient(145deg,#ffd52f,#d88900)!important;color:#fff!important;box-shadow:0 0 24px rgba(255,197,44,.42)!important}
        .game-screen .pause-overlay{position:absolute!important;inset:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;background:rgba(1,7,13,.82)!important;backdrop-filter:blur(6px)!important;border-radius:10px!important;color:#fff!important;z-index:10!important}.game-screen .pause-overlay strong{font-size:42px!important;color:#ff3a49!important;text-shadow:0 0 18px rgba(255,40,55,.5)!important}.game-screen .pause-overlay span{margin-top:8px!important;color:#c1ccd8!important}
        .game-help{position:relative!important;margin-top:18px!important;padding:13px 22px!important;border:1px solid rgba(69,139,185,.55)!important;border-radius:10px!important;background:rgba(3,12,21,.72)!important;color:#cbd5df!important;font-size:16px!important;box-shadow:0 0 18px rgba(0,0,0,.35)!important;z-index:7!important}.game-help b{color:#fff!important;letter-spacing:1px!important}
        .game-logo{position:absolute;z-index:9;top:7px;left:50%;transform:translateX(-50%);width:min(250px,22vw);display:flex;justify-content:center;pointer-events:none}.game-logo img{width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 5px 14px rgba(0,0,0,.8))}
        @keyframes gameFloat{0%,100%{margin-top:0}50%{margin-top:-12px}}@keyframes gameDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(13px,-9px)}}
        @media(max-width:800px){.game-top{top:12px!important;width:calc(100% - 20px)!important;grid-template-columns:1fr 1fr 1fr!important;gap:8px!important;height:auto!important}.game-top .small-btn{height:48px!important;font-size:12px!important}.game-top>div{height:58px!important}.game-top>div strong{font-size:24px!important}.stat-label{font-size:10px!important}.game-top .small-btn:first-child,.game-top .small-btn:last-child{position:absolute!important;top:66px!important;width:110px!important}.game-top .small-btn:first-child{left:0}.game-top .small-btn:last-child{right:0}.game-logo{top:82px;width:210px}.game-content{padding-top:145px!important}.game-title>span{font-size:42px!important}.game-title>p{font-size:16px!important}.game-board-frame{margin-top:14px!important;padding:12px!important}.game-screen .board{width:min(82vw,390px)!important;height:min(82vw,390px)!important;gap:7px!important}.game-screen .tile{font-size:clamp(28px,7vw,44px)!important}.game-help{font-size:12px!important;padding:10px 14px!important;margin-top:12px!important}.game-float{width:85px;height:85px;font-size:34px}.game-float.large{width:120px;height:120px;font-size:46px}}


        /* Result screen visual redesign only — game logic and all other screens unchanged. */
        .result-screen{
          position:relative!important;overflow:hidden!important;min-height:calc(100vh - 38px)!important;
          background:radial-gradient(circle at 50% 45%,rgba(9,54,88,.42),transparent 39%),radial-gradient(circle at 20% 78%,rgba(255,88,24,.13),transparent 25%),radial-gradient(circle at 82% 78%,rgba(0,112,255,.13),transparent 25%),linear-gradient(180deg,#020912 0%,#020711 58%,#040914 100%)!important;
          color:#fff!important;isolation:isolate!important;
        }
        .result-screen:before{
          content:"";position:absolute;inset:0;z-index:0;pointer-events:none;
          background:linear-gradient(90deg,rgba(0,0,0,.42),transparent 22%,transparent 78%,rgba(0,0,0,.42)),linear-gradient(180deg,transparent 65%,rgba(3,8,14,.25) 100%);
        }
        .result-screen:after{
          content:"";position:absolute;left:-8%;right:-8%;bottom:-22%;height:45%;z-index:0;
          transform:perspective(520px) rotateX(63deg);transform-origin:bottom;pointer-events:none;
          background-image:linear-gradient(rgba(57,139,190,.20) 1px,transparent 1px),linear-gradient(90deg,rgba(57,139,190,.20) 1px,transparent 1px);
          background-size:72px 72px;mask-image:linear-gradient(to top,black,transparent);
        }
        .result-screen .corner{z-index:8}
        .result-card{
          position:relative!important;z-index:5!important;width:min(780px,86vw)!important;
          min-height:calc(100vh - 38px)!important;margin:0 auto!important;padding:30px 0 20px!important;
          display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;
          background:transparent!important;border:0!important;box-shadow:none!important;
        }
        .result-brand{width:min(390px,32vw);display:flex;justify-content:center;margin:0 auto 48px}
        .result-brand img{width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 5px 15px rgba(0,0,0,.85))}
        .result-card .trophy{
          width:92px!important;height:55px!important;margin:0 auto -5px!important;display:flex!important;align-items:center!important;justify-content:center!important;
          font-size:58px!important;line-height:1!important;color:#ffd36a!important;text-shadow:0 0 16px rgba(255,184,55,.65)!important;background:none!important;
        }
        .result-status{
          margin:0!important;text-align:center!important;font-size:clamp(54px,5.5vw,88px)!important;line-height:.95!important;
          font-weight:1000!important;font-style:italic!important;letter-spacing:-3px!important;color:#f7f9fc!important;
          text-shadow:0 5px 0 rgba(0,0,0,.45),0 0 16px rgba(255,255,255,.10)!important;
        }
        .result-subtitle{margin:17px 0 0!important;color:#d7e1ec!important;text-align:center!important;font-size:18px!important;letter-spacing:11px!important;font-weight:600!important}
        .result-target{
          position:relative!important;width:245px!important;height:108px!important;margin:22px auto 0!important;display:flex!important;align-items:center!important;justify-content:center!important;
          border:3px solid #ff3349!important;border-radius:19px!important;background:linear-gradient(180deg,rgba(30,8,18,.72),rgba(9,8,17,.78))!important;
          color:#fff!important;font-size:62px!important;font-weight:1000!important;line-height:1!important;text-shadow:0 0 18px rgba(255,53,70,.65)!important;
          box-shadow:0 0 0 1px rgba(255,65,80,.18),0 0 28px rgba(255,37,55,.45),inset 0 0 28px rgba(255,35,52,.12)!important;
        }
        .result-grid{
          width:min(660px,82vw)!important;
          margin:38px auto 0!important;
          display:grid!important;
          grid-template-columns:repeat(3,minmax(0,1fr))!important;
          align-items:center!important;
          column-gap:0!important;
        }
        .result-grid>div{
          min-width:0!important;
          min-height:62px!important;
          display:flex!important;
          flex-direction:column!important;
          align-items:center!important;
          justify-content:center!important;
          gap:8px!important;
          box-sizing:border-box!important;
        }
        .result-grid>div+div{
          border-left:1px solid rgba(239,48,66,.75)!important;
          box-shadow:-1px 0 8px rgba(239,48,66,.12)!important;
        }
        .result-grid small{
          color:#aebfd2!important;
          font-size:13px!important;
          line-height:1!important;
          letter-spacing:3px!important;
          font-weight:700!important;
          white-space:nowrap!important;
        }
        .result-grid strong{
          color:#f3f6fa!important;
          font-size:30px!important;
          line-height:1.05!important;
          font-weight:900!important;
          text-align:center!important;
          white-space:nowrap!important;
          max-width:100%!important;
          overflow:hidden!important;
          text-overflow:ellipsis!important;
          text-shadow:0 0 10px rgba(255,255,255,.08)!important;
        }
        .result-grid>div:nth-child(3) strong{
          color:#ffd06c!important;
          text-shadow:0 0 13px rgba(255,190,58,.35)!important;
        }
        .result-actions{
          width:min(700px,90vw)!important;margin:39px auto 0!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:16px!important;
        }
        .result-actions .menu-btn{
          height:76px!important;border-radius:13px!important;font-size:19px!important;letter-spacing:1px!important;
          border:2px solid rgba(126,158,194,.72)!important;background:rgba(4,12,21,.78)!important;box-shadow:0 0 16px rgba(0,0,0,.3)!important;
        }
        .result-actions .menu-btn:first-child{
          grid-column:1 / -1!important;background:linear-gradient(180deg,#ff3042,#d70d1d)!important;border-color:#ff4050!important;
          box-shadow:0 0 28px rgba(255,37,56,.50)!important;
        }
        .result-actions .menu-btn:nth-child(2){grid-column:1}.result-actions .menu-btn:nth-child(3){grid-column:2}
        .result-actions .menu-btn:hover{transform:translateY(-2px)!important}
        .result-footer{
          margin-top:auto!important;padding-top:24px!important;text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:10px!important;color:#aebbd0!important;
        }
        .result-footer span{display:flex;align-items:center;gap:24px;font-size:16px;letter-spacing:9px;font-weight:700}
        .result-footer span:before,.result-footer span:after{content:"";display:block;width:72px;height:2px;background:#ed3040;box-shadow:0 0 9px rgba(237,48,64,.65)}
        .result-footer small{font-size:10px;letter-spacing:5px;color:#8494a8;font-weight:700}
        @media(max-width:800px){
          .result-card{width:calc(100% - 24px)!important;padding-top:18px!important}
          .result-brand{width:245px;height:52px!important;margin-bottom:22px!important}.result-card .trophy{font-size:42px!important;height:40px!important}
          .result-status{font-size:44px!important;letter-spacing:-2px!important}.result-subtitle{font-size:11px!important;letter-spacing:5px!important;margin-top:9px!important}
          .result-target{width:180px!important;height:76px!important;font-size:45px!important;margin-top:14px!important}
          .result-grid{width:100%!important;margin-top:25px!important}.result-grid small{font-size:8px!important;letter-spacing:1.5px!important}.result-grid strong{font-size:20px!important}
          .result-grid>div:nth-child(2),.result-grid>div:nth-child(4){height:40px!important}
          .result-actions{width:100%!important;margin-top:23px!important;gap:9px!important}.result-actions .menu-btn{height:56px!important;font-size:13px!important}
          .result-footer{padding-bottom:4px!important}.result-footer span{font-size:11px!important;letter-spacing:5px!important;gap:10px}.result-footer span:before,.result-footer span:after{width:28px}.result-footer small{font-size:7px!important;letter-spacing:2.5px!important}
        }

        /* Result page polish: fixed viewport, no sliding/hover movement, and guaranteed button text visibility. */
        .result-screen{
          height:calc(100vh - 38px)!important;
          min-height:0!important;
          max-height:calc(100vh - 38px)!important;
          overflow:hidden!important;
        }
        .result-card{
          width:min(780px,86vw)!important;
          height:100%!important;
          min-height:0!important;
          max-height:100%!important;
          box-sizing:border-box!important;
          padding:24px 0 12px!important;
          overflow:hidden!important;
        }
        .result-brand{
          width:min(390px,32vw)!important;
          height:62px!important;
          margin:0 auto 25px!important;
          flex:0 0 62px!important;
          align-items:center!important;
        }
        .result-brand img{
          width:100%!important;
          height:62px!important;
          object-fit:contain!important;
        }
        .result-card .trophy{
          height:45px!important;
          font-size:48px!important;
          margin-bottom:-2px!important;
          flex:0 0 45px!important;
        }
        .result-status{font-size:clamp(48px,5vw,76px)!important}
        .result-subtitle{margin-top:11px!important;font-size:16px!important;letter-spacing:9px!important}
        .result-target{width:225px!important;height:96px!important;margin-top:17px!important;font-size:57px!important;flex:0 0 96px!important}
        .result-grid{width:min(660px,82vw)!important;margin-top:38px!important;flex:0 0 auto!important}
        .result-grid strong{font-size:28px!important}
        .result-actions{width:min(700px,82vw)!important;margin-top:27px!important;gap:12px!important;flex:0 0 auto!important}
        .result-actions .menu-btn{
          height:68px!important;
          min-width:0!important;
          padding:0 18px!important;
          transform:none!important;
          transition:none!important;
          color:#fff!important;
          opacity:1!important;
          overflow:visible!important;
        }
        .result-actions .menu-btn:hover,.result-actions .menu-btn:focus,.result-actions .menu-btn:active{
          transform:none!important;
        }
        .result-actions .menu-btn span{
          color:#fff!important;
          opacity:1!important;
          visibility:visible!important;
          display:inline-flex!important;
          align-items:center!important;
        }
        .result-actions .menu-btn .btn-icon{
          color:#fff!important;
          opacity:1!important;
          visibility:visible!important;
          flex:0 0 auto!important;
          margin-right:12px!important;
        }
        .result-footer{margin-top:auto!important;padding-top:16px!important;padding-bottom:0!important;flex:0 0 auto!important}


        /* Certificate preview — view only; PDF download remains unchanged. */
        .certificate-view{position:relative!important;overflow:auto!important;background:#e9ecef!important;color:#0c1219!important;isolation:isolate;padding:24px!important;box-sizing:border-box!important}
        .certificate-sheet{position:relative;width:min(1180px,94vw);aspect-ratio:297/210;margin:0 auto;background:#fff;overflow:hidden;box-shadow:0 18px 55px rgba(0,0,0,.28);border:1px solid #c9cdd1;box-sizing:border-box;padding:4.7% 7.5% 4.2%;display:flex;flex-direction:column;align-items:center;text-align:center}
        .certificate-sheet:before{content:"";position:absolute;inset:1.7%;border:1px solid #111820;pointer-events:none}
        .certificate-sheet:after{content:"2048";position:absolute;left:4%;right:4%;top:36%;font-size:clamp(130px,18vw,250px);font-weight:900;letter-spacing:-10px;color:#f2f4f6;line-height:1;z-index:0;pointer-events:none}
        .cert-corner{position:absolute;z-index:4;width:150px;height:150px;pointer-events:none}
        .cert-corner.tl{left:0;top:0;background:linear-gradient(135deg,#111820 0 35%,#e91929 35% 56%,transparent 56%)}
        .cert-corner.br{right:0;bottom:0;background:linear-gradient(315deg,#111820 0 35%,#e91929 35% 56%,transparent 56%)}
        .cert-brand{position:relative;z-index:3;margin-top:0;width:min(340px,30vw);display:flex;justify-content:center;align-items:center}
        .cert-brand img{display:block;width:100%;height:auto;max-height:72px;object-fit:contain}
        .cert-side-note{position:absolute;z-index:3;right:4.5%;top:9%;font-size:clamp(7px,.7vw,11px);line-height:1.7;letter-spacing:4px;color:#20262d;text-align:right}
        .cert-title{position:relative;z-index:3;margin-top:4%;font-size:clamp(48px,6vw,82px);line-height:.9;font-weight:1000;font-style:italic;letter-spacing:-4px;color:#10161d}
        .cert-title .red{color:#e71929}
        .cert-title-lines{position:relative;z-index:3;width:72%;height:2px;background:#d7dadd;margin-top:2.2%}
        .cert-heading{position:relative;z-index:3;margin-top:1.2%;font-size:clamp(16px,1.65vw,25px);font-weight:700;letter-spacing:7px;color:#111820}.cert-heading:before,.cert-heading:after{content:"";display:inline-block;width:10px;height:10px;background:#e71929;margin:0 20px 2px}
        .cert-present{position:relative;z-index:3;margin-top:2.8%;font-size:clamp(9px,1vw,14px);letter-spacing:5px;color:#6d747b}
        .cert-name{position:relative;z-index:3;margin-top:1.1%;font-size:clamp(34px,4.2vw,58px);font-weight:900;font-style:italic;letter-spacing:-1px;color:#10161d}.cert-name-line{position:relative;z-index:3;width:38%;height:2px;background:#e71929;margin-top:1%}
        .cert-description{position:relative;z-index:3;margin-top:1.8%;font-size:clamp(13px,1.45vw,20px);color:#161c23;line-height:1.45}.cert-description b{color:#e71929}
        .cert-medal{position:relative;z-index:3;margin-top:1.5%;width:clamp(110px,12vw,160px);height:clamp(110px,12vw,160px);border-radius:50%;background:radial-gradient(circle,#17191b 0 57%,#d89b18 58% 63%,#ffd96b 64% 68%,#a96c00 69%);box-shadow:0 5px 18px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#f8c33f;font-weight:900}.cert-medal:before,.cert-medal:after{content:"";position:absolute;top:12%;width:18px;height:70%;border-left:6px solid #bd7d0b;border-right:6px solid #d59a21;transform:rotate(28deg);z-index:-1}.cert-medal:before{left:-20px}.cert-medal:after{right:-20px;transform:rotate(-28deg)}
        .cert-medal .cup{font-size:clamp(27px,3vw,43px);line-height:1}.cert-medal .mt{font-size:clamp(9px,1vw,14px);letter-spacing:1px;margin-top:5px}.cert-medal .mv{font-size:clamp(22px,2.4vw,34px);line-height:1;margin-top:2px}
        .cert-meta{position:absolute;z-index:3;bottom:10%;left:9%;right:9%;display:flex;justify-content:space-between;align-items:flex-end}.cert-meta .meta-block{width:27%;text-align:center}.cert-meta .meta-main{font-size:clamp(14px,1.5vw,22px);color:#121820;border-bottom:1px solid #1b2229;padding-bottom:7px}.cert-meta small{display:block;margin-top:6px;font-size:clamp(7px,.75vw,11px);letter-spacing:4px;color:#697077}.cert-sign{font-family:cursive;font-style:italic;font-size:clamp(18px,2vw,29px);margin-bottom:3px}.cert-footer{position:absolute;z-index:3;bottom:3.7%;left:50%;transform:translateX(-50%);font-size:clamp(8px,.85vw,12px);letter-spacing:5px;font-weight:800;white-space:nowrap}.cert-footer b{color:#e71929}
        .cert-view-actions{position:fixed;z-index:30;right:22px;bottom:20px;display:flex;gap:10px}.cert-view-actions button{border:1px solid #111820;background:#111820;color:#fff;padding:12px 18px;border-radius:8px;font-weight:800;cursor:pointer}.cert-view-actions button.primary{background:#e71929;border-color:#e71929}.cert-view-actions button:hover{filter:brightness(1.08)}
        @media(max-width:800px){.certificate-view{padding:10px!important}.certificate-sheet{width:96vw;min-width:720px;margin-left:50%;transform:translateX(-50%)}.cert-view-actions{right:10px;bottom:10px}.cert-view-actions button{padding:10px 13px;font-size:12px}}
      `}</style>
    <div className="app">
      <header className="window-bar"><span className="window-icon">▦</span><span>2048 Race</span><div className="window-controls"><span>—</span><span>□</span><span>×</span></div></header>

      {page === "welcome" && <main className="screen welcome race-welcome">
        <CornerDecor/>
        <div className="race-welcome-bg" aria-hidden="true">
          <div className="race-glow race-glow-one"/><div className="race-glow race-glow-two"/>
          <div className="race-grid"/>
          {[
            ["256","tile-pink","7%","2%","-12deg"],["8","tile-orange","84%","3%","-14deg"],
            ["32","tile-blue","5%","26%","-20deg"],["128","tile-cyan","82%","30%","-18deg"],
            ["4","tile-orange small","0%","49%","16deg"],["16","tile-orange","73%","55%","-9deg"],
            ["64","tile-pink large","6%","76%","-18deg"],["2","tile-white","23%","42%","18deg"]
          ].map(([value, cls, left, top, rot], i) => (
            <div key={i} className={`race-float-tile ${cls}`} style={{left, top, transform:`rotate(${rot})`}}>{value}</div>
          ))}
          <div className="race-zero zero-one">0</div><div className="race-zero zero-two">0</div>
          <div className="race-zero zero-three">0</div><div className="race-zero zero-four">0</div>
          <div className="race-line line-one"/><div className="race-line line-two"/><div className="race-line line-three"/>
        </div>

        <div className="race-brand-top">
          <img src="/logo.png" alt="Nebuloid Tech" />
        </div>

        <section className="race-hero">
          <div className="race-welcome-label"><span/>WELCOME TO<span/></div>
          <h1><span>2048</span></h1>
          <div className="race-subtitle"><i/>R A C E<i/></div>
        </section>

        <button className="race-start" style={{transform:"translate(-50%, calc(-50% + 110px))"}} onClick={startFlow} aria-label="Start 2048 Race">
          <span>START</span>
        </button>

        <div className="race-menu-corner">
          <button onClick={()=>setPage("how")}>HOW TO PLAY</button>
        </div>
        <p className="race-bottom-note">REACH • RACE • ACHIEVE</p>
      </main>}

      {page === "player" && <main className="screen player-page race-player">
<style>{`
.floating-name-keyboard{
  position:fixed;
  left:50%;
  bottom:18px;
  z-index:9999;
  width:min(720px,calc(100vw - 28px));
  padding:10px;
  border:1px solid rgba(255,255,255,.18);
  border-radius:14px;
  background:rgba(8,14,23,.97);
  box-shadow:0 18px 55px rgba(0,0,0,.45);
  user-select:none;
}
.floating-name-keyboard-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  height:28px;
  padding:0 4px 6px;
  color:#aeb8c5;
  font-size:9px;
  font-weight:900;
  letter-spacing:1.5px;
  cursor:grab;
}
.floating-name-keyboard-head:active{cursor:grabbing}
.floating-name-keyboard-head button{
  width:25px;
  height:25px;
  border:1px solid #3a4654;
  border-radius:5px;
  background:#18222d;
  color:#fff;
  font-size:18px;
  line-height:1;
}
.floating-name-keyboard-row{
  display:flex;
  gap:5px;
  margin-top:5px;
}
.floating-name-keyboard-row button{
  flex:1;
  min-width:0;
  height:38px;
  border:1px solid #45515f;
  border-radius:6px;
  background:#17222d;
  color:#edf2f7;
  font-size:12px;
  font-weight:800;
  box-shadow:0 2px 0 #070c11;
}
.floating-name-keyboard-row button:active{
  transform:translateY(2px);
  background:#263544;
  box-shadow:none;
}
.floating-name-keyboard-bottom .wide{flex:1.25}
.floating-name-keyboard-bottom .space{flex:2}
.floating-name-keyboard-bottom .enter{
  flex:1.4;
  background:#e71929;
  border-color:#ff3a47;
  color:#fff;
}
@media(max-width:700px){
  .floating-name-keyboard{
    bottom:8px;
    width:calc(100vw - 12px);
    padding:7px;
  }
  .floating-name-keyboard-row{gap:3px;margin-top:3px}
  .floating-name-keyboard-row button{height:34px;font-size:10px}
}
`}</style>

        <CornerDecor/>

        <div className="race-player-bg" aria-hidden="true">
          <div className="race-player-glow race-player-glow-one"/>
          <div className="race-player-glow race-player-glow-two"/>
          <div className="race-player-grid"/>
          {[
            ["256","tile-pink","14%","0%","-12deg"], ["8","tile-orange","82%","0%","-14deg"],
            ["32","tile-blue","3%","23%","-20deg"], ["128","tile-cyan","82%","27%","-18deg"],
            ["4","tile-orange small","1%","50%","16deg"], ["16","tile-orange","74%","55%","-9deg"],
            ["64","tile-pink large","84%","73%","18deg"], ["2","tile-white","17%","45%","18deg"]
          ].map(([value, cls, left, top, rot], i) => (
            <div key={i} className={`race-float-tile ${cls}`} style={{left, top, transform:`rotate(${rot})`}}>{value}</div>
          ))}
          <div className="race-zero player-zero-one">0</div>
          <div className="race-zero player-zero-two">0</div>
          <div className="race-zero player-zero-three">0</div>
          <div className="race-line player-line-one"/>
          <div className="race-line player-line-two"/>
          <div className="race-line player-line-three"/>
        </div>

        <div className="player-brand">
          <img src="/logo.png" alt="Nebuloid Tech" />
        </div>

        <div className="player-content">
          <div className="player-heading">
            <div className="race-player-welcome"><span/>WELCOME TO<span/></div>
            <h1 className="race-player-title">2048</h1>
            <div className="race-player-subtitle"><i/>R A C E<i/></div>
            <h2>PLAYER SETUP</h2>
            <p>Enter the name that will appear on the certificate.</p>
          </div>

          <div className="player-form">
            <div className="player-input-wrap">
              <span className="player-user-icon" aria-hidden="true">
                <i></i><b></b>
              </span>
              <input
                onFocus={()=>setKeyboardOpen(true)}
                value={name}
                onChange={e=>setName(e.target.value)}
                placeholder="Type player name..."
                maxLength={30}
                onKeyDown={e=>e.key==="Enter"&&name.trim()&&setPage("target")}
              />
            </div>

            <div className="player-actions">
              <Button onClick={()=>{setKeyboardOpen(false);setPage("welcome")}} icon="←">BACK</Button>
              <Button primary onClick={()=>{if(name.trim()){setKeyboardOpen(false);setPage("target")}}} icon="→">CONTINUE</Button>
            </div>

            <div className="player-enter-hint">
              <span className="enter-key">ENTER</span>
              <span>Press <b>ENTER</b> to continue</span>
            </div>

            {keyboardOpen && (
              <FloatingKeyboard
                value={name}
                onChange={setName}
                onEnter={()=>{if(name.trim()){setKeyboardOpen(false);setPage("target")}}}
                onClose={()=>setKeyboardOpen(false)}
              />
            )}
          </div>
        </div>
      </main>}

      {page === "target" && <main className="screen subpage target-race">
        <CornerDecor/>
        <div className="target-race-bg" aria-hidden="true">
          <div className="target-glow one"/><div className="target-glow two"/><div className="target-grid-floor"/>
          {[
            ["256","pink","10%","0%","-12deg"],["2048","gold","82%","0%","-14deg"],
            ["32","blue","2%","23%","-20deg"],["128","blue","86%","27%","-18deg"],
            ["4","orange small","1%","67%","16deg"],["16","blue","76%","61%","-9deg"],
            ["64","pink large","5%","72%","-18deg"],["2","white","19%","43%","18deg"]
          ].map(([value, cls, left, top, rot], i) => (
            <div key={i} className={`target-float ${cls}`} style={{left, top, transform:`rotate(${rot})`}}>{value}</div>
          ))}
          <div className="target-zero z1">0</div><div className="target-zero z2">0</div>
          <div className="target-zero z3">0</div><div className="target-zero z4">0</div>
        </div>

        <div className="target-brand"><img src="/logo.png" alt="Nebuloid Tech" /></div>

        <section className="target-hero">
          <h1 className="target-race-title">2048 <span className="red">RACE</span></h1>
          <div className="target-select-label"><i/><span>SELECT <b className="red">TARGET</b></span><i/></div>
          <p className="target-description">Choose the number you must reach to finish the race.</p>
        </section>

        <div className="target-panel">
          <div className="target-grid-new">
            {TARGETS.map(t => (
              <button key={t} className={`target-card-new c${t} ${target===t?"selected":""}`} onClick={()=>setTarget(t)}>
                <strong>{t}</strong><span>TARGET</span>
              </button>
            ))}
          </div>
          <div className="target-actions">
            <Button onClick={()=>setPage("player")} icon="←">BACK</Button>
            <Button primary onClick={()=>setPage("mode")} icon="→">CONTINUE</Button>
          </div>
        </div>
      </main>}

      {page === "mode" && <main className="screen subpage mode-race">
        <CornerDecor/>
        <div className="mode-race-bg" aria-hidden="true">
          <div className="mode-glow one"/><div className="mode-glow two"/><div className="mode-grid-floor"/>
          {[
            ["256","pink","10%","0%","-12deg"],["8","orange","83%","0%","-14deg"],
            ["32","blue","0%","21%","-20deg"],["128","purple","88%","25%","-18deg"],
            ["4","orange small","1%","52%","16deg"],["64","green","86%","56%","-18deg"],
            ["16","blue","78%","69%","-9deg"],["2","white","17%","45%","18deg"]
          ].map(([value, cls, left, top, rot], i) => (
            <div key={i} className={`mode-float ${cls}`} style={{left, top, transform:`rotate(${rot})`}}>{value}</div>
          ))}
          <div className="mode-zero z1">0</div><div className="mode-zero z2">0</div>
          <div className="mode-zero z3">0</div><div className="mode-zero z4">0</div>
          <div className="mode-line l1"/><div className="mode-line l2"/><div className="mode-line l3"/><div className="mode-line l4"/>
        </div>

        <div className="mode-brand"><img src="/logo.png" alt="Nebuloid Tech" /></div>

        <section className="mode-hero">
          <h1 className="mode-title">2048 <span className="red">RACE</span></h1>
          <div className="mode-select-label"><i/><span>SELECT <b className="red">MODE</b></span><i/></div>
          <p className="mode-description">Choose how you want to race.</p>
        </section>

        <div className="mode-content">
          <div className="mode-grid-new">
            {MODES.map(m => (
              <button key={m.id} className={`mode-card-new ${m.id} ${mode===m.id?"selected":""}`} onClick={()=>setMode(m.id)}>
                <span className="mode-icon">
                  {m.id==="classic" ? "▦" : m.id==="sprint" ? "⚡" : "♢"}
                </span>
                <strong>{m.title}</strong>
                <small>{m.desc}</small>
                <span className="corner-check">{m.id==="classic" ? "▦" : m.id==="sprint" ? "◴" : "∞"}</span>
              </button>
            ))}
          </div>
          <div className="mode-actions">
            <Button primary onClick={()=>setPage("confirm")} icon="→">CONTINUE</Button>
            <Button onClick={()=>setPage("target")} icon="←">BACK</Button>
          </div>
        </div>
      </main>}

      {page === "confirm" && <main className="screen confirm-race">
        <CornerDecor/>
        <div className="confirm-race-bg" aria-hidden="true">
          <div className="confirm-glow one"/><div className="confirm-glow two"/><div className="confirm-grid-floor"/>
          {[
            ["256","pink","9%","0%","-12deg"],["8","orange","82%","0%","-14deg"],
            ["32","blue","1%","24%","-20deg"],["128","purple","85%","27%","-18deg"],
            ["4","orange small","2%","62%","16deg"],["16","blue","77%","65%","-9deg"],
            ["64","green","80%","54%","18deg"],["2","white","14%","43%","18deg"]
          ].map(([value, cls, left, top, rot], i) => (
            <div key={i} className={`confirm-float ${cls}`} style={{left, top, transform:`rotate(${rot})`}}>{value}</div>
          ))}
          <div className="confirm-zero cz1">0</div><div className="confirm-zero cz2">0</div><div className="confirm-zero cz3">0</div>
          <div className="confirm-line cl1"/><div className="confirm-line cl2"/><div className="confirm-line cl3"/>
        </div>
        <div className="confirm-brand"><img src="/logo.png" alt="Nebuloid Tech" /></div>
        <section className="confirm-hero">
          <div className="confirm-final"><i/><span>F I N A L &nbsp; C H E C K</span><i/></div>
          <h1><span>RACE</span> <b>CONFIRMATION</b></h1>
          <div className="confirm-checker"><span/><span/><span/><span/><span/><span/><em/></div>
          <div className="confirm-ready">ARE YOU READY?</div>
        </section>
        <section className="confirm-content">
          <div className="confirm-summary">
            <div><small>PLAYER</small><strong>{name}</strong></div>
            <div className="confirm-divider" aria-hidden="true"/>
            <div><small>TARGET</small><strong className="target-value">{target}</strong></div>
            <div className="confirm-divider" aria-hidden="true"/>
            <div><small>MODE</small><strong>{mode.toUpperCase()}</strong></div>
          </div>
          <p>Reach the target as fast as possible.<br/>A genuine completion unlocks your personalized certificate.</p>
          <div className="confirm-actions">
            <Button primary onClick={startGame} icon="▶">START RACE</Button>
            <Button onClick={()=>setPage("mode")} icon="←">BACK</Button>
          </div>
        </section>
      </main>}

      {page === "game" && <main className="screen game-screen">
        <div className="game-bg-glow one"/><div className="game-bg-glow two"/>
        {[['256','pink','5%','8%','-16deg'],['8','orange','86%','8%','-14deg'],['32','blue','0%','32%','-20deg'],['128','purple','91%','38%','-18deg'],['4','orange small','1%','70%','16deg'],['64','green','79%','65%','-10deg'],['2','white','12%','50%','18deg']].map(([value,cls,left,top,rot],i)=><div key={i} className={`game-float ${cls}`} style={{left,top,transform:`rotate(${rot})`}}>{value}</div>)}
        <div className="game-zero z1">0</div><div className="game-zero z2">0</div><div className="game-zero z3">0</div><div className="game-zero z4">0</div>
        <div className="game-line l1"/><div className="game-line l2"/><div className="game-line l3"/><div className="game-line l4"/>
        <div className="game-logo"><img src="/logo.png" alt="Nebuloid Tech" /></div>
        <div className="game-top">
          <button className="small-btn" data-label={paused?"RESUME":"PAUSE"} onClick={()=>setPaused(p=>!p)}>{paused?"RESUME":"PAUSE"}</button>
          <div><span className="stat-label">TARGET</span><strong>{target}</strong></div>
          <div><span className="stat-label">TIME</span><strong>{fmtTime(seconds)}</strong></div>
          <div><span className="stat-label">SCORE</span><strong>{score}</strong></div>
          <button className="small-btn" onClick={resetGame}>RESTART</button>
        </div>
        <div className="game-content">
          <div className="game-title"><span>2048 RACE</span><h1>{name}</h1><p>Reach <b>{target}</b> · {mode.toUpperCase()}</p></div>
          <div className="game-board-frame"><div className="board-wrap"><div className="board">{board.map((row,r)=>row.map((v,c)=><div key={`${r}-${c}`} className={`tile tile-${v}`}>{v||""}</div>))}</div>{paused&&<div className="pause-overlay"><strong>PAUSED</strong><span>Press ESC or RESUME</span></div>}</div></div>
          <div className="game-help">⌨ &nbsp; Use <b>W A S D</b> or <b>Arrow Keys</b> to move</div>
        </div>
      </main>}

      {page === "result" && result && <main className="screen result-screen">
        <CornerDecor/>
        <div className="result-card">
          <div className="result-brand"><img src="/logo.png" alt="Nebuloid Tech" /></div>
          
          <div className="result-status">{result.won ? "TARGET REACHED!" : "RACE OVER"}</div>
          <div className="result-subtitle">{result.won ? "W E L L  P L A Y E D" : "T R Y  A G A I N"}</div>
          <div className="result-target">{result.target}</div>
          <div className="result-grid"><div><small>PLAYER</small><strong>{result.name}</strong></div><div><small>TIME</small><strong>{fmtTime(result.time)}</strong></div><div><small>SCORE</small><strong>{result.score}</strong></div></div>
          <div className="result-actions">{result.won && <Button primary onClick={()=>viewCertificate(result)} icon="▣">VIEW CERTIFICATE</Button>}<Button onClick={()=>{const next=TARGETS[TARGETS.indexOf(target)+1]; if(next){setTarget(next);setPage("confirm")}else setPage("welcome")}} icon="→">{TARGETS.indexOf(target)<TARGETS.length-1?"NEXT TARGET":"MAIN MENU"}</Button><Button onClick={()=>setPage("welcome")} icon="⌂">MAIN MENU</Button></div>
          <div className="result-footer"><span>2048 RACE</span><small>SMALL MOVES&nbsp;&nbsp; BIG WINS</small></div>
        </div>
      </main>}

      {page === "certificate" && viewingCertificate && <main className="screen certificate-view">
        <div className="certificate-sheet">
          <div className="cert-corner tl"/><div className="cert-corner br"/>
          <div className="cert-side-note">NUMBERS<br/>BUILD<br/>LEGENDS</div>
          <div className="cert-brand"><img src="/logo2.png" alt="Nebuloid Tech" /></div>
          <div className="cert-title">2048 <span className="red">RACE</span></div>
          <div className="cert-title-lines"/>
          <div className="cert-heading">CERTIFICATE OF ACHIEVEMENT</div>
          <div className="cert-present">PROUDLY PRESENTED TO</div>
          <div className="cert-name">{viewingCertificate.name}</div>
          <div className="cert-name-line"/>
          <div className="cert-description">reached Target <b>{viewingCertificate.target}</b> in <b>{fmtTime(viewingCertificate.time)}</b> with a score of <b>{viewingCertificate.score}</b>.</div>
          <div className="cert-medal"><div className="cup">♛</div><div className="mt">TARGET</div><div className="mv">{viewingCertificate.target}</div></div>
          <div className="cert-meta">
            <div className="meta-block"><div className="meta-main">{new Date(viewingCertificate.date).toLocaleDateString()}</div><small>DATE</small></div>
            <div className="meta-block"><div className="cert-sign">Nebuloid Tech</div><div className="meta-main"/><small>AUTHORIZED BY</small></div>
          </div>
          <div className="cert-footer">SMALL MOVES&nbsp;&nbsp; <b>BIG WINS</b></div>
        </div>
        <div className="cert-view-actions">
          <button onClick={()=>{setViewingCertificate(null);setPage("result")}}>BACK</button>
        </div>
      </main>}

      {page === "certificates" && <main className="screen subpage"><CornerDecor/><div className="panel wide"><div className="eyebrow">ACHIEVEMENTS</div><h1>CERTIFICATES</h1><p>Every genuine target completion is stored here.</p>
        {certItems.length===0 ? <div className="empty">No certificates yet. Win a race to unlock your first one.</div> :
          <div className="cert-list">{certItems.map((c,i)=><div className="cert-row" key={i}><div><strong>{c.name}</strong><span>Target {c.target} · {fmtTime(c.time)} · Score {c.score}</span></div><button onClick={()=>downloadCertificate(c)}>DOWNLOAD</button></div>)}</div>}
        <div className="actions"><Button onClick={()=>setPage("welcome")} icon="←">MAIN MENU</Button></div>
      </div></main>}

      {page === "how" && <main className="screen subpage"><CornerDecor/><div className="panel wide how"><div className="eyebrow">GUIDE</div><h1>HOW TO PLAY</h1><div className="steps"><div><b>01</b><strong>Choose your player</strong><span>Your name is printed on the certificate.</span></div><div><b>02</b><strong>Select a target</strong><span>Targets range from 64 to 2048.</span></div><div><b>03</b><strong>Combine matching tiles</strong><span>Move the board with WASD or Arrow Keys.</span></div><div><b>04</b><strong>Reach it fast</strong><span>Finish the target to unlock your certificate.</span></div></div><div className="actions"><Button onClick={()=>setPage("welcome")} icon="←">MAIN MENU</Button></div></div></main>}
    </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
