import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const tiles = [
  { id: 0, name: "Lavender", f: 261.63, b: "#e9e0ff", a: "#a98de5", db: "#65428f", da: "#452d67", c: "#6947a8" },
  { id: 1, name: "Sky", f: 329.63, b: "#deefff", a: "#78b5e9", db: "#3574a5", da: "#235273", c: "#3972a8" },
  { id: 2, name: "Mint", f: 392, b: "#def7eb", a: "#72c99f", db: "#277f5c", da: "#18553e", c: "#287b59" },
  { id: 3, name: "Peach", f: 440, b: "#ffe5da", a: "#e99a7d", db: "#aa5037", da: "#793622", c: "#a75b42" },
  { id: 4, name: "Butter", f: 523.25, b: "#fff3cc", a: "#e2c34f", db: "#a57c00", da: "#735600", c: "#96751e" },
  { id: 5, name: "Rose", f: 659.25, b: "#f9dfeb", a: "#db83ae", db: "#a33e6e", da: "#72284e", c: "#984d73" },
  { id: 6, name: "Aqua", f: 783.99, b: "#dcf4f5", a: "#69c5cc", db: "#2b8d94", da: "#1c6268", c: "#32777d" },
  { id: 7, name: "Lilac", f: 880, b: "#e9e5fa", a: "#9d91d1", db: "#6d5ba5", da: "#4b3f76", c: "#675b9c" },
  { id: 8, name: "Powder", f: 1046.5, b: "#e8ebf1", a: "#9ea8bb", db: "#69778f", da: "#4b5669", c: "#59616f" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


function FloatingKeyboard({ value, onChange, onEnter, onClose }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

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
    if (e.button !== 0) return;
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
    <div className="memory-floating-keyboard" style={{ transform: `translate(calc(-50% + ${pos.x}px), ${pos.y}px)` }}>
      <div className="memory-floating-keyboard-head" onPointerDown={startDrag}>
        <span>ON-SCREEN KEYBOARD</span>
        <button type="button" onPointerDown={(e)=>e.stopPropagation()} onClick={onClose}>×</button>
      </div>
      {rows.map((row, i) => (
        <div className="memory-floating-keyboard-row" key={i}>
          {row.map(key => <button type="button" key={key} onClick={()=>press(key)}>{key}</button>)}
        </div>
      ))}
      <div className="memory-floating-keyboard-row">
        <button type="button" className="wide" onClick={()=>press("BACKSPACE")}>⌫</button>
        <button type="button" className="space" onClick={()=>press("SPACE")}>SPACE</button>
        <button type="button" className="enter" onClick={()=>press("ENTER")}>ENTER ↵</button>
      </div>
    </div>
  );
}

function App() {
  const [audio, setAudio] = useState(true);
  const [page, setPage] = useState("home");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() =>
    Number(sessionStorage.getItem("msbest") || 0)
  );
  const [seq, setSeq] = useState([]);
  const [ans, setAns] = useState([]);
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [status, setStatus] = useState("READY");
  const [showHowTo, setShowHowTo] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const ctx = useRef(null);
  const run = useRef(0);

  function audioCtx() {
    if (!audio) return null;

    const C =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!C) return null;

    if (!ctx.current) {
      ctx.current = new C();
    }

    if (ctx.current.state === "suspended") {
      ctx.current.resume();
    }

    return ctx.current;
  }

  function play(id, duration = 190) {
    const c = audioCtx();
    if (!c) return;

    const o = c.createOscillator();
    const g = c.createGain();

    o.type = "sine";
    o.frequency.value = tiles[id].f;

    // Strong, clear audio without intentionally clipping.
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(
      0.62,
      c.currentTime + 0.01
    );
    g.gain.exponentialRampToValueAtTime(
      0.0001,
      c.currentTime + duration / 1000
    );

    o.connect(g);
    g.connect(c.destination);

    o.start();
    o.stop(c.currentTime + duration / 1000 + 0.02);
  }

  function make(length, count) {
    return Array.from(
      { length },
      () => Math.floor(Math.random() * count)
    );
  }

  async function playSeq(sequence, currentLevel, token) {
    setPhase("watch");
    setStatus("WATCH + LISTEN");
    setAns([]);

    // Level 1 starts deliberately slow; every level gets a small speed increase.
    const gap = Math.max(300, 760 - (currentLevel - 1) * 35);

    for (const id of sequence) {
      if (run.current !== token) return;

      setActive(id);
      play(id, Math.min(300, gap - 30));

      await sleep(gap * 0.72);

      setActive(null);

      await sleep(gap * 0.28);
    }

    if (run.current !== token) return;

    setPhase("input");
    setStatus("YOUR TURN");
  }

  async function levelStart(currentLevel) {
    run.current++;

    const token = run.current;
    const count = Math.min(
      9,
      6 + Math.floor((currentLevel - 1) / 3)
    );
    const length = Math.min(14, currentLevel + 2);
    const sequence = make(length, count);

    setLevel(currentLevel);
    setSeq(sequence);
    setAns([]);
    setPhase("watch");
    setStatus("WATCH + LISTEN");

    await sleep(400);

    playSeq(sequence, currentLevel, token);
  }

  function start() {
    audioCtx();
    setScore(0);
    // Always open a fresh name field so the previous player's name
    // is not automatically reused on the next game.
    setNameInput("");
    setPage("name");
  }

  function beginWithName(event) {
    event.preventDefault();
    const cleanName = nameInput.trim().replace(/\s+/g, " ");
    if (!cleanName) return;
    setPlayerName(cleanName);
    setKeyboardOpen(false);
    setScore(0);
    setPage("game");
    levelStart(1);
  }

  function makeCertificateId(levelNumber) {
    const d = new Date();
    const date = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("");
    return `NT-MS-${String(levelNumber).padStart(2, "0")}-${date}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  }

  function continueNextLevel() {
    setCertificate(null);
    setPage("game");
    levelStart(level + 1);
  }

  function fail() {
    run.current++;

    setPhase("failed");
    setStatus("SEQUENCE BROKEN");
    setActive(null);

    const newBest = Math.max(best, level);

    setBest(newBest);
    sessionStorage.setItem("msbest", String(newBest));

    play(seq[ans.length] ?? 0, 300);

    setTimeout(() => {
      setPage("over");
    }, 650);
  }

  function tap(id) {
    if (phase !== "input") return;

    play(id, 155);

    setActive(id);

    setTimeout(() => {
      setActive(null);
    }, 150);

    const index = ans.length;

    if (seq[index] !== id) {
      fail();
      return;
    }

    const nextAnswers = [...ans, id];

    setAns(nextAnswers);

    if (nextAnswers.length === seq.length) {
      const earned = level * 120 + 50;
      const finalScore = score + earned;

      setScore(finalScore);
      setPhase("success");
      setStatus("PERFECT");

      setCertificate({
        name: playerName,
        level,
        score: finalScore,
        length: seq.length,
        difficulty: level < 4 ? "EASY" : level < 8 ? "MEDIUM" : "HIGH",
        date: new Date(),
        id: makeCertificateId(level)
      });

      setTimeout(() => setPage("certificate"), 550);
    }
  }

  function home() {
    run.current++;
    setPage("home");
    setPhase("idle");
    setActive(null);
    setShowHowTo(false);
  }

  const count = Math.min(
    9,
    6 + Math.floor((level - 1) / 3)
  );

  const progress = seq.length
    ? (ans.length / seq.length) * 100
    : 0;

  if (page === "home") {
    return (
      <main className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden bg-[#f6e1c1] text-[#4a2412]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.72),transparent_48%),linear-gradient(135deg,#f8e8ce_0%,#f2d9b5_50%,#f8e6c7_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:radial-gradient(#9c6436_1px,transparent_1px)] [background-size:17px_17px]" />

        {/* Top-left foliage */}
        <div className="pointer-events-none absolute -left-10 -top-12 z-20 h-[230px] w-[285px]">
          <span className="absolute left-0 top-0 h-28 w-16 -rotate-[34deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#76d62e] via-[#42a91f] to-[#176416] shadow-[inset_5px_4px_8px_rgba(255,255,255,.25),4px_8px_10px_rgba(35,75,12,.25)]" />
          <span className="absolute left-12 -top-2 h-32 w-16 -rotate-[10deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#83e23a] via-[#49b021] to-[#196916] shadow-md" />
          <span className="absolute left-28 top-1 h-32 w-16 rotate-[18deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8ae83e] via-[#4caf22] to-[#1b6e17] shadow-md" />
          <span className="absolute left-7 top-14 h-28 w-14 -rotate-[55deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#6ed12e] via-[#3fa51f] to-[#1a6418] shadow-md" />
          <span className="absolute left-24 top-22 h-28 w-14 -rotate-[22deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7fe238] via-[#49ae21] to-[#176717] shadow-md" />
          <span className="absolute left-43 top-30 h-28 w-14 rotate-[13deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7cdd35] via-[#45aa20] to-[#176416] shadow-md" />
          <span className="absolute left-2 top-82 h-24 w-12 -rotate-[35deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#72d72f] to-[#257d1b] shadow-md" />
        </div>

        {/* Top-right foliage + book */}
        <div className="pointer-events-none absolute -right-9 -top-12 z-20 h-[250px] w-[320px]">
          <span className="absolute right-0 top-0 h-32 w-16 rotate-[35deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#79d832] via-[#45aa20] to-[#176516] shadow-md" />
          <span className="absolute right-12 -top-2 h-32 w-16 rotate-[10deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#87e83e] via-[#4bb321] to-[#196916] shadow-md" />
          <span className="absolute right-28 top-0 h-32 w-16 -rotate-[18deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82e23a] via-[#49af21] to-[#1b6d17] shadow-md" />
          <span className="absolute right-5 top-15 h-28 w-14 rotate-[55deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#6fd32e] via-[#3fa31e] to-[#1a6417] shadow-md" />
          <span className="absolute right-25 top-22 h-28 w-14 rotate-[22deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7fe239] via-[#48ae21] to-[#176716] shadow-md" />
          <div className="absolute -right-20 top-16 h-28 w-48 rotate-[38deg] rounded-[18px] border-[7px] border-[#cf171e] bg-gradient-to-br from-[#ff4d45] to-[#dc171d] shadow-[0_10px_13px_rgba(67,23,8,.3)]">
            <span className="absolute right-8 top-7 text-5xl font-black text-[#ffe0a0]">★</span>
            <span className="absolute -bottom-3 left-2 h-5 w-44 rounded-full bg-[#0d4fa9]" />
          </div>
        </div>

        {/* Loose leaves */}
        <span className="pointer-events-none absolute left-[4%] top-[30%] z-10 h-16 w-9 -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
        <span className="pointer-events-none absolute right-[6%] top-[28%] z-10 h-16 w-9 rotate-[40deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
        <span className="pointer-events-none absolute left-[22%] bottom-[14%] z-10 h-14 w-8 -rotate-[42deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />

        {/* Wooden corners */}
        <div className="pointer-events-none absolute -bottom-44 -left-48 z-10 h-[610px] w-[610px] rotate-[-18deg] rounded-[48%] bg-[repeating-linear-gradient(8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_-28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />
        <div className="pointer-events-none absolute -bottom-44 -right-48 z-10 h-[610px] w-[610px] rotate-[18deg] rounded-[48%] bg-[repeating-linear-gradient(-8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />

        {/* Bottom-left colored blocks */}
        <div className="pointer-events-none absolute bottom-[-18px] left-[1%] z-20 h-64 w-[300px]">
          <span className="absolute bottom-[92px] left-0 h-[125px] w-[125px] -rotate-[18deg] rounded-[18px] border-4 border-[#1455b5] bg-gradient-to-br from-[#418bff] to-[#1764d7] shadow-[inset_5px_5px_8px_rgba(255,255,255,.35),8px_12px_12px_rgba(55,25,8,.3)]" />
          <span className="absolute bottom-[30px] left-[62px] h-[125px] w-[125px] -rotate-[8deg] rounded-[18px] border-4 border-[#d38b0b] bg-gradient-to-br from-[#ffc437] to-[#f29b08] shadow-[inset_5px_5px_8px_rgba(255,255,255,.35),8px_12px_12px_rgba(55,25,8,.3)]" />
          <span className="absolute bottom-[-2px] left-[160px] h-[125px] w-[125px] rotate-[22deg] rounded-[18px] border-4 border-[#18802d] bg-gradient-to-br from-[#4ed35a] to-[#21a53b] shadow-[inset_5px_5px_8px_rgba(255,255,255,.35),8px_12px_12px_rgba(55,25,8,.3)]" />
          <span className="absolute bottom-[-68px] left-[52px] h-[125px] w-[125px] rotate-[17deg] rounded-[18px] border-4 border-[#d52e2f] bg-gradient-to-br from-[#ff5a55] to-[#ed3435] shadow-[inset_5px_5px_8px_rgba(255,255,255,.35),8px_12px_12px_rgba(55,25,8,.3)]" />
        </div>

        {/* Clock */}
        <div className="pointer-events-none absolute bottom-[-50px] right-[2%] z-20 h-[250px] w-[250px] rounded-full border-[15px] border-[#f39a0d] bg-[#fff0ca] shadow-[0_13px_18px_rgba(76,35,8,.36),inset_0_0_0_4px_#a14f08]">
          <span className="absolute left-1/2 top-[13px] -translate-x-1/2 text-[16px] font-black">12</span>
          <span className="absolute bottom-[13px] left-1/2 -translate-x-1/2 text-[16px] font-black">6</span>
          <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[16px] font-black">9</span>
          <span className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[16px] font-black">3</span>
          <div className="absolute left-1/2 top-1/2 h-[83px] w-[7px] -translate-x-1/2 -translate-y-[92%] rotate-[28deg] rounded-full bg-[#4a2a1c] origin-bottom" />
          <div className="absolute left-1/2 top-1/2 h-[68px] w-[7px] -translate-y-1/2 rotate-[54deg] rounded-full bg-[#e33131] origin-bottom" />
          <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#583022] shadow-md" />
        </div>

        {/* Game-specific side copy */}
        <div className="pointer-events-none absolute left-[5%] top-[34%] z-50 hidden w-[230px] text-left md:block">
          <div className="font-black text-[16px] tracking-[.38em] text-[#7b421f]">REMEMBER</div>
          <div className="mt-1 font-black text-[42px] leading-[.9] tracking-[-.02em] text-[#d36b08] drop-shadow-[0_2px_0_rgba(255,255,255,.55)]">FOCUS</div>
          <div className="mt-2 font-black text-[16px] tracking-[.38em] text-[#7b421f]">REPEAT</div>
          <div className="mt-5 h-[4px] w-20 rounded-full bg-[#d36b08]" />
          <div className="mt-4 text-[11px] font-black leading-[1.8] tracking-[.17em] text-[#936847]">
            WATCH THE PATTERN<br />
            REMEMBER THE ORDER<br />
            PLAY IT BACK
          </div>
        </div>

        <div className="pointer-events-none absolute right-[5%] top-[34%] z-50 hidden w-[230px] text-right md:block">
          <div className="font-black text-[16px] tracking-[.38em] text-[#7b421f]">MEMORIZE</div>
          <div className="mt-1 font-black text-[42px] leading-[.9] tracking-[-.02em] text-[#d36b08] drop-shadow-[0_2px_0_rgba(255,255,255,.55)]">RECALL</div>
          <div className="mt-2 font-black text-[16px] tracking-[.38em] text-[#7b421f]">MATCH</div>
          <div className="mt-5 ml-auto h-[4px] w-20 rounded-full bg-[#d36b08]" />
          <div className="mt-4 text-[11px] font-black leading-[1.8] tracking-[.17em] text-[#936847]">
            LISTEN CAREFULLY<br />
            REPEAT THE SEQUENCE<br />
            BEAT YOUR BEST
          </div>
        </div>

        {/* Main composition */}
        <section className="relative z-30 mx-auto flex h-full w-full max-w-[1450px] flex-col items-center px-5 pt-[2vh] text-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/logo2.png" alt="Nebuloid Tech" className="h-[105px] w-[330px] object-contain sm:h-[125px] sm:w-[390px]" />
          </div>

          <div className="mt-[5vh] flex w-[min(690px,70vw)] items-center gap-5 text-[#d36b08]">
            <span className="h-[3px] flex-1 rounded-full bg-[#d36b08]" />
            <span className="whitespace-nowrap text-[20px] font-black tracking-[.45em] sm:text-[26px]">WELCOME TO</span>
            <span className="h-[3px] flex-1 rounded-full bg-[#d36b08]" />
          </div>

          <h1 className="mt-[1.2vh] whitespace-nowrap text-[clamp(46px,7.4vw,108px)] font-black leading-none tracking-[-.025em] text-[#54230e] [font-family:Georgia,'Times New Roman',serif] drop-shadow-[0_5px_1px_rgba(255,236,201,.8)]">
            MEMORY SEQUENCE
          </h1>

          <button
            type="button"
            onClick={start}
            aria-label="Start Memory Sequence"
            className="group relative mt-[4vh] grid h-[clamp(250px,28vw,400px)] w-[clamp(250px,28vw,400px)] shrink-0 place-items-center rounded-full border-[10px] border-[#ffbd26] bg-[radial-gradient(circle_at_36%_20%,#ffd64b_0%,#ffb00f_30%,#f8790a_62%,#ed4d05_100%)] shadow-[0_0_0_5px_#ffdf69,0_0_0_10px_#8a3b05,0_23px_32px_rgba(92,42,9,.28)] transition duration-200 hover:scale-[1.015] active:scale-[.985]"
          >
            <span className="pointer-events-none absolute left-[21%] top-[9%] h-11 w-24 rotate-[-25deg] rounded-full bg-white/90 blur-[1px]" />
            <span className="absolute top-[20%] grid h-[clamp(75px,8vw,112px)] w-[clamp(75px,8vw,112px)] place-items-center rounded-[20px] bg-gradient-to-br from-white to-[#f8eee2] shadow-[0_9px_10px_rgba(77,31,7,.32)]">
              <span className="ml-2 h-0 w-0 border-y-[28px] border-y-transparent border-l-[42px] border-l-[#f58a13] sm:border-y-[34px] sm:border-l-[51px]" />
            </span>
            <span className="absolute bottom-[16%] text-[clamp(50px,5.3vw,78px)] font-black tracking-wide text-white drop-shadow-[0_6px_2px_rgba(100,35,6,.65)]">START</span>

            <span className="pointer-events-none absolute -left-[82px] top-[32%] h-5 w-14 rotate-[12deg] rounded-full bg-[#f58a0c]" />
            <span className="pointer-events-none absolute -left-[88px] top-[48%] h-5 w-16 rounded-full bg-[#f58a0c]" />
            <span className="pointer-events-none absolute -left-[72px] top-[64%] h-5 w-14 rotate-[-48deg] rounded-full bg-[#f58a0c]" />
            <span className="pointer-events-none absolute -right-[82px] top-[32%] h-5 w-14 rotate-[-12deg] rounded-full bg-[#f58a0c]" />
            <span className="pointer-events-none absolute -right-[88px] top-[48%] h-5 w-16 rounded-full bg-[#f58a0c]" />
            <span className="pointer-events-none absolute -right-[72px] top-[64%] h-5 w-14 rotate-[48deg] rounded-full bg-[#f58a0c]" />
          </button>
        </section>
      </main>
    );
  }

  if (page === "name") {
    return (
      <main className="relative h-[100dvh] overflow-hidden bg-[#f7ead6] text-[#54230e]">
        <style>{`\n.memory-floating-keyboard{position:fixed;left:50%;bottom:18px;z-index:9999;width:min(720px,calc(100vw - 28px));padding:10px;border:1px solid #c99a68;border-radius:14px;background:rgba(255,250,240,.98);box-shadow:0 18px 55px rgba(83,43,13,.28);user-select:none}\n.memory-floating-keyboard-head{display:flex;align-items:center;justify-content:space-between;height:30px;padding:0 4px 6px;color:#7b4b2d;font-size:9px;font-weight:900;letter-spacing:1.5px;cursor:grab}.memory-floating-keyboard-head:active{cursor:grabbing}\n.memory-floating-keyboard-head button{width:25px;height:25px;border:1px solid #d4b18a;border-radius:5px;background:#f6ead9;color:#5b2a16;font-size:18px;line-height:1}\n.memory-floating-keyboard-row{display:flex;gap:5px;margin-top:5px}.memory-floating-keyboard-row button{flex:1;min-width:0;height:38px;border:1px solid #d4b18a;border-radius:6px;background:#fff;color:#54230e;font-size:12px;font-weight:800;box-shadow:0 2px 0 #c8a47e}.memory-floating-keyboard-row button:active{transform:translateY(2px);box-shadow:none;background:#f6ead9}.memory-floating-keyboard-row .wide{flex:1.25}.memory-floating-keyboard-row .space{flex:2}.memory-floating-keyboard-row .enter{flex:1.4;background:#ed7b19;border-color:#d5670e;color:#fff}\n@media(max-width:700px){.memory-floating-keyboard{bottom:8px;width:calc(100vw - 12px);padding:7px}.memory-floating-keyboard-row{gap:3px;margin-top:3px}.memory-floating-keyboard-row button{height:34px;font-size:10px}}\n`}</style>
        {/* Warm paper background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.9),transparent_43%),linear-gradient(135deg,#f7e6cd_0%,#f5ddc0_48%,#f9ead4_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[.06] [background-image:radial-gradient(#9c6436_1px,transparent_1px)] [background-size:17px_17px]" />

        {/* Top-left leaves */}
        <div className="pointer-events-none absolute -left-8 -top-8 z-10 h-[190px] w-[250px]">
          <span className="absolute left-0 top-0 h-28 w-16 -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7ddd35] via-[#45ad20] to-[#176516] shadow-lg" />
          <span className="absolute left-12 -top-3 h-32 w-16 -rotate-[10deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8be63f] via-[#4db321] to-[#196916] shadow-lg" />
          <span className="absolute left-28 top-0 h-32 w-16 rotate-[18deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] via-[#49ad20] to-[#1b6d17] shadow-lg" />
          <span className="absolute left-6 top-16 h-24 w-12 -rotate-[55deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#70d52f] to-[#267f1b] shadow-md" />
        </div>

        {/* Top-right leaves + red book */}
        <div className="pointer-events-none absolute -right-8 -top-7 z-10 h-[200px] w-[290px]">
          <span className="absolute right-0 top-0 h-32 w-16 rotate-[36deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7ddd35] via-[#45ad20] to-[#176516] shadow-lg" />
          <span className="absolute right-12 -top-2 h-32 w-16 rotate-[10deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8be63f] via-[#4db321] to-[#196916] shadow-lg" />
          <span className="absolute right-28 top-1 h-32 w-16 -rotate-[18deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] via-[#49ad20] to-[#1b6d17] shadow-lg" />
          <div className="absolute -right-16 top-16 h-24 w-40 rotate-[35deg] rounded-[16px] border-[6px] border-[#cf171e] bg-gradient-to-br from-[#ff4c45] to-[#d9161c] shadow-[0_10px_14px_rgba(67,23,8,.28)]">
            <span className="absolute right-6 top-4 text-4xl font-black text-[#ffe0a0]">★</span>
            <span className="absolute -bottom-3 left-1 h-4 w-36 rounded-full bg-[#0d4fa9]" />
          </div>
        </div>

        {/* Decorative memory/lightbulb circles */}
        <div className="pointer-events-none absolute left-[2%] top-[26%] hidden h-64 w-64 rounded-full border-[10px] border-[#f1d9b8]/55 lg:block">
          <div className="absolute inset-7 rounded-full border-[3px] border-[#f1d9b8]/65" />
          <div className="absolute inset-0 grid place-items-center text-[76px] opacity-25">🧠</div>
        </div>
        <div className="pointer-events-none absolute right-[3%] top-[27%] hidden h-64 w-64 rounded-full border-[10px] border-[#f1d9b8]/55 lg:block">
          <div className="absolute inset-7 rounded-full border-[3px] border-[#f1d9b8]/65" />
          <div className="absolute inset-0 grid place-items-center text-[72px] opacity-25">💡</div>
        </div>

        {/* Loose leaves */}
        <span className="pointer-events-none absolute left-[14%] top-[29%] z-10 h-14 w-8 -rotate-[42deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
        <span className="pointer-events-none absolute right-[10%] top-[33%] z-10 h-16 w-9 rotate-[40deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
        <span className="pointer-events-none absolute left-[13%] bottom-[31%] z-10 h-14 w-8 -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
        <span className="pointer-events-none absolute right-[19%] bottom-[25%] z-10 h-14 w-8 rotate-[40deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />

        {/* Wooden lower corners */}
        <div className="pointer-events-none absolute -bottom-56 -left-52 z-10 h-[600px] w-[600px] rotate-[-18deg] rounded-[48%] bg-[repeating-linear-gradient(8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_-28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />
        <div className="pointer-events-none absolute -bottom-56 -right-52 z-10 h-[600px] w-[600px] rotate-[18deg] rounded-[48%] bg-[repeating-linear-gradient(-8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />

        {/* Notebook */}
        <div className="pointer-events-none absolute -bottom-2 left-[-18px] z-20 hidden w-[190px] rotate-[-12deg] rounded-[18px] border border-[#dfc9a5] bg-[#fff8e8] px-5 py-7 shadow-[0_14px_18px_rgba(71,35,9,.25)] lg:block">
          <div className="absolute -top-4 left-8 text-4xl">📒</div>
          <div className="mt-4 text-center font-serif text-xl font-bold leading-8 text-[#9a613d]">
            Observe<br />Remember<br />Repeat<br />Grow!
          </div>
          <div className="mt-2 text-center text-2xl text-[#9a613d]">⌣</div>
        </div>

        {/* Clock */}
        <div className="pointer-events-none absolute -bottom-20 right-[1%] z-20 h-[245px] w-[245px] rounded-full border-[15px] border-[#f39a0d] bg-[#fff0ca] shadow-[0_13px_18px_rgba(76,35,8,.36),inset_0_0_0_4px_#a14f08]">
          <span className="absolute left-1/2 top-[12px] -translate-x-1/2 text-[15px] font-black">12</span>
          <span className="absolute bottom-[12px] left-1/2 -translate-x-1/2 text-[15px] font-black">6</span>
          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[15px] font-black">9</span>
          <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[15px] font-black">3</span>
          <div className="absolute left-1/2 top-1/2 h-[82px] w-[7px] -translate-x-1/2 -translate-y-[92%] rotate-[28deg] rounded-full bg-[#4a2a1c] origin-bottom" />
          <div className="absolute left-1/2 top-1/2 h-[68px] w-[7px] -translate-y-1/2 rotate-[54deg] rounded-full bg-[#e33131] origin-bottom" />
          <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#583022] shadow-md" />
        </div>

        {/* Game-specific side copy — name page */}
        <div className="pointer-events-none absolute left-[5%] top-[42%] z-50 hidden w-[220px] text-left md:block">
          <div className="font-black text-[16px] tracking-[.36em] text-[#7b421f]">REMEMBER</div>
          <div className="mt-1 font-black text-[38px] leading-[.9] tracking-[-.02em] text-[#d36b08]">FOCUS</div>
          <div className="mt-2 font-black text-[16px] tracking-[.36em] text-[#7b421f]">REPEAT</div>
          <div className="mt-5 h-[4px] w-20 rounded-full bg-[#d36b08]" />
          <div className="mt-4 text-[10px] font-black leading-[1.8] tracking-[.17em] text-[#936847]">
            WATCH THE PATTERN<br />
            REMEMBER THE ORDER<br />
            PLAY IT BACK
          </div>
        </div>

        <div className="pointer-events-none absolute right-[5%] top-[42%] z-50 hidden w-[220px] text-right md:block">
          <div className="font-black text-[16px] tracking-[.36em] text-[#7b421f]">MEMORIZE</div>
          <div className="mt-1 font-black text-[38px] leading-[.9] tracking-[-.02em] text-[#d36b08]">RECALL</div>
          <div className="mt-2 font-black text-[16px] tracking-[.36em] text-[#7b421f]">MATCH</div>
          <div className="mt-5 ml-auto h-[4px] w-20 rounded-full bg-[#d36b08]" />
          <div className="mt-4 text-[10px] font-black leading-[1.8] tracking-[.17em] text-[#936847]">
            LISTEN CAREFULLY<br />
            REPEAT THE SEQUENCE<br />
            BEAT YOUR BEST
          </div>
        </div>

        <section className="relative z-30 mx-auto flex min-h-[100dvh] w-full max-w-[1450px] flex-col items-center px-5 pb-10 pt-5 text-center">
          {/* Brand */}
          <img
            src="/logo2.png"
            alt="Nebuloid Tech"
            className="h-[82px] w-[330px] object-contain sm:h-[98px] sm:w-[390px]"
          />

          {/* Game title */}
          <div className="mt-5 flex items-center gap-5 text-[#d36b08]">
            <span className="h-[3px] w-16 rounded-full bg-[#d36b08] sm:w-24" />
            <span className="whitespace-nowrap text-[18px] font-black tracking-[.38em] sm:text-[24px]">WELCOME TO</span>
            <span className="h-[3px] w-16 rounded-full bg-[#d36b08] sm:w-24" />
          </div>

          <h1 className="mt-2 max-w-[1100px] text-[clamp(48px,6.2vw,96px)] font-black leading-[.95] tracking-[-.035em] text-[#5b210b] [font-family:Georgia,'Times New Roman',serif] drop-shadow-[0_5px_1px_rgba(255,236,201,.8)]">
            MEMORY SEQUENCE
          </h1>

          <p className="mt-4 text-[clamp(12px,1.4vw,20px)] font-black tracking-[.3em] text-[#77716b]">
            TRAIN YOUR MEMORY <span className="mx-2">•</span> HAVE FUN <span className="mx-2">•</span> GET BETTER
          </p>

          {/* Name entry — direct on the page, no card */}
          <div className="mt-7 w-full max-w-[760px]">
            <h2 className="text-[clamp(24px,2.5vw,34px)] font-black tracking-tight text-[#5b2a16]">
              ENTER YOUR NAME
            </h2>

            <form onSubmit={beginWithName} className="mt-5">
              <div className="relative">
                <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[38px] leading-none text-[#6b3016]">♙</span>
                <input
                  id="player-name"
                  onFocus={()=>setKeyboardOpen(true)}
                  value={nameInput}
                  onChange={(event)=>setNameInput(event.target.value)}
                  maxLength={40}
                  placeholder="Enter your full name"
                  className="h-20 w-full rounded-full border-[3px] border-[#f1a24b] bg-[#fffdf9] px-8 pl-20 text-xl font-semibold text-[#54230e] outline-none shadow-[inset_0_2px_5px_rgba(89,45,12,.08)] transition placeholder:text-[#c9c5c0] focus:border-[#ed7b19] focus:ring-4 focus:ring-[#f5bd79]/35 sm:h-[84px] sm:text-2xl"
                />
              </div>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="group relative mt-6 h-[76px] w-full rounded-full border-[5px] border-[#f8b23a] bg-[linear-gradient(180deg,#ff9c22_0%,#f26a08_55%,#e95005_100%)] text-[clamp(22px,2.4vw,32px)] font-black text-white shadow-[0_7px_0_#9b3c08,0_14px_20px_rgba(92,42,9,.28),inset_0_2px_0_rgba(255,255,255,.45)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                CONTINUE TO GAME <span className="ml-3 text-[1.15em]">→</span>
              </button>
            </form>
          </div>

          {keyboardOpen && (
            <FloatingKeyboard
              value={nameInput}
              onChange={setNameInput}
              onEnter={()=>{ if(nameInput.trim()) { setKeyboardOpen(false); document.getElementById("player-name")?.form?.requestSubmit(); } }}
              onClose={()=>setKeyboardOpen(false)}
            />
          )}
        </section>
      </main>
    );
  }

  if (page === "certificate" && certificate) {
    const completedDate = certificate.date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    return (
      <main className="relative h-[100dvh] overflow-hidden bg-[#f8dfbd] px-3 py-2 sm:px-6">
        <style>{`@media print{@page{size:A4 landscape;margin:0}html,body{width:100%;height:100%;background:#f8dfbd!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}#memory-certificate{width:100%!important;height:100%!important;max-width:none!important;border-radius:0!important;box-shadow:none!important}.certificate-actions,.certificate-menu,.certificate-decor,.certificate-brand{display:none!important}}`}</style>

        {/* Reference-style illustrated background */}
        <div className="certificate-decor pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#87501f] shadow-[inset_-12px_-10px_0_#b76b27]" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#87501f] shadow-[inset_12px_-10px_0_#b76b27]" />

          <div className="absolute -bottom-44 -left-28 h-96 w-[560px] rotate-[-10deg] rounded-[50%] bg-[repeating-linear-gradient(165deg,#8b4216_0_9px,#c86b23_10px_15px,#71340f_16px_21px)] shadow-[inset_-20px_0_30px_rgba(67,29,5,.28)]" />
          <div className="absolute -bottom-44 -right-28 h-96 w-[560px] rotate-[10deg] rounded-[50%] bg-[repeating-linear-gradient(195deg,#8b4216_0_9px,#c86b23_10px_15px,#71340f_16px_21px)] shadow-[inset_20px_0_30px_rgba(67,29,5,.28)]" />

          {/* lush corner leaves */}
          <div className="absolute -left-1 top-0 h-28 w-20 -rotate-[8deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8de34c] via-[#3eb322] to-[#176416] shadow-lg sm:left-5 sm:h-32 sm:w-24" />
          <div className="absolute left-9 top-1 h-28 w-16 rotate-[25deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#9aeb5b] to-[#278b1b]" />
          <div className="absolute left-14 top-16 h-24 w-14 -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#74d63d] to-[#247d18]" />
          <div className="absolute -right-1 top-0 h-28 w-20 rotate-[8deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8de34c] via-[#3eb322] to-[#176416] shadow-lg sm:right-5 sm:h-32 sm:w-24" />
          <div className="absolute right-9 top-1 h-28 w-16 -rotate-[25deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#9aeb5b] to-[#278b1b]" />
          <div className="absolute right-14 top-16 h-24 w-14 rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#74d63d] to-[#247d18]" />

          <span className="absolute left-[10%] top-[25%] h-16 w-9 -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#70d33d] to-[#2c8e1f] shadow-md" />
          <span className="absolute right-[9%] top-[31%] h-16 w-9 rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#70d33d] to-[#2c8e1f] shadow-md" />

          {/* notebook */}
          <div className="absolute bottom-0 left-[-4px] hidden rotate-[-8deg] sm:block">
            <div className="h-48 w-36 rounded-[9px_9px_18px_18px] border-2 border-[#c99d67] bg-[#fff8e9] p-4 shadow-[0_12px_18px_rgba(71,35,9,.25)]">
              <div className="mb-2 text-center text-2xl text-[#6f3c20]">•••</div>
              <div className="text-center font-serif text-[17px] italic leading-7 text-[#6f3c20]">Observe<br/>Remember<br/>Repeat<br/>Grow!</div>
            </div>
          </div>

          {/* clock */}
          <div className="absolute bottom-[-26px] right-[-12px] hidden h-44 w-44 rounded-full border-[12px] border-[#f4a51c] bg-[#fff8eb] shadow-[0_8px_0_#9a571d,0_10px_18px_rgba(74,35,8,.25)] sm:block">
            <div className="absolute inset-3 rounded-full border-2 border-[#d6a97a]" />
            <div className="absolute left-1/2 top-1/2 h-16 w-2 -translate-x-1/2 -translate-y-full rotate-[18deg] rounded-full bg-[#5b3220] origin-bottom" />
            <div className="absolute left-1/2 top-1/2 h-12 w-2 -translate-x-1/2 -translate-y-full rotate-[58deg] rounded-full bg-[#e33131] origin-bottom" />
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b3220]" />
          </div>
        </div>

        <button
          type="button"
          onClick={home}
          className="certificate-menu fixed bottom-7 left-7 z-50 flex h-[58px] items-center gap-2 rounded-[18px] border-[3px] border-[#f3a04b] bg-[linear-gradient(180deg,#d97b2d,#a94f14)] px-6 text-[18px] font-black text-white shadow-[0_5px_0_#71350f,0_10px_18px_rgba(80,40,10,.24),inset_0_2px_0_rgba(255,255,255,.25)] sm:px-7 sm:text-[20px]"
        >
          <span className="text-[30px] leading-none">←</span> MAIN MENU
        </button>

        {/* Certificate page — game-specific side copy */}
        <div className="pointer-events-none absolute left-[3.5%] top-[42%] z-20 hidden w-[190px] text-left lg:block">
          <div className="text-[12px] font-black tracking-[.28em] text-[#9a4a19]">MEMORY COMPLETE</div>
          <div className="mt-1 text-[29px] font-black leading-none text-[#d46b0c]">LEVEL UP</div>
          <div className="mt-3 h-[3px] w-16 bg-[#df8b39]" />
          <p className="mt-4 text-[9px] font-black uppercase leading-[1.85] tracking-[.16em] text-[#8d5b3e]">
            REMEMBER THE PATTERN<br/>
            REPEAT THE SEQUENCE<br/>
            MASTER YOUR MEMORY
          </p>
        </div>

        <div className="pointer-events-none absolute right-[3.5%] top-[42%] z-20 hidden w-[190px] text-right lg:block">
          <div className="text-[12px] font-black tracking-[.28em] text-[#9a4a19]">GREAT WORK</div>
          <div className="mt-1 text-[29px] font-black leading-none text-[#d46b0c]">KEEP PLAYING</div>
          <div className="ml-auto mt-3 h-[3px] w-16 bg-[#df8b39]" />
          <p className="mt-4 text-[9px] font-black uppercase leading-[1.85] tracking-[.16em] text-[#8d5b3e]">
            COMPLETE EACH LEVEL<br/>
            IMPROVE YOUR SCORE<br/>
            BEAT YOUR BEST
          </p>
        </div>

        <div className="relative z-30 mx-auto flex h-full w-full max-w-[1280px] flex-col items-center">
          {/* Brand — actual public/logo.png */}
          <div className="certificate-brand flex h-[82px] shrink-0 items-center justify-center sm:h-[96px]">
            <img
              src="/logo2.png"
              alt="Nebuloid Tech Studio"
              className="h-[64px] w-auto object-contain sm:h-[76px]"
            />
          </div>

          {/* Certificate sheet */}
          <div id="memory-certificate" className="relative h-[min(655px,calc(100dvh-145px))] w-full max-w-[1110px] shrink-0 rounded-[28px] border-[3px] border-[#d7a263] bg-[#fffaf0] p-3 shadow-[0_14px_34px_rgba(104,59,24,.24)] sm:p-4">
            <div className="relative h-full overflow-hidden rounded-[20px] border-[2px] border-[#e8c799] bg-[radial-gradient(circle_at_50%_12%,#fffdf6,#fffaf0_55%,#fff7e8)] px-5 py-3 sm:px-8 sm:py-4 lg:px-10">
              {/* clean certificate frame — keep only the main border */}
              <div className="pointer-events-none absolute bottom-7 left-7 right-7 h-px bg-[#e8c89e]" />

              {/* medal */}
              <div className="relative z-20 mx-auto -mt-1 flex h-[82px] w-[112px] items-start justify-center sm:h-[92px] sm:w-[125px]">
                <div className="absolute left-[25px] top-[51px] h-11 w-7 rotate-[8deg] bg-[#e62922] [clip-path:polygon(0_0,100%_0,75%_100%,45%_72%,15%_100%)] sm:left-[28px] sm:top-[58px]" />
                <div className="absolute right-[25px] top-[51px] h-11 w-7 -rotate-[8deg] bg-[#e62922] [clip-path:polygon(0_0,100%_0,85%_100%,55%_72%,25%_100%)] sm:right-[28px] sm:top-[58px]" />
                <div className="relative z-10 grid h-[74px] w-[74px] place-items-center rounded-full border-[5px] border-[#f5b519] bg-[radial-gradient(circle_at_35%_30%,#ffe46d,#f4a300_72%)] text-[37px] shadow-[0_4px_0_#c9790a,0_7px_13px_rgba(120,70,10,.22)] sm:h-[84px] sm:w-[84px] sm:text-[42px]">⭐</div>
              </div>

              <div className="relative z-10 mx-auto flex h-[calc(100%-82px)] max-w-[1010px] flex-col items-center text-center sm:h-[calc(100%-92px)]">
                {/* formal title */}
                <div className="flex w-full shrink-0 items-center justify-center gap-3 text-[#d7a96e] sm:gap-5">
                  <span className="h-[2px] w-16 bg-[#d7a96e] sm:w-28" />
                  <span className="whitespace-nowrap font-serif text-[22px] font-bold tracking-[.075em] text-[#5b321d] sm:text-[30px]">CERTIFICATE OF ACHIEVEMENT</span>
                  <span className="h-[2px] w-16 bg-[#d7a96e] sm:w-28" />
                </div>

                <p className="mt-2 shrink-0 font-serif text-[11px] font-bold tracking-[.30em] text-[#a17955] sm:mt-3 sm:text-[14px]">PROUDLY PRESENTED TO</p>

                <div className="mx-auto mt-2 w-full max-w-[650px] shrink-0 rounded-full bg-[#f9e6ca] px-6 py-1.5 shadow-[inset_0_2px_4px_rgba(120,70,25,.06)] sm:mt-3 sm:py-2">
                  <div className="break-words font-serif text-[38px] font-bold leading-tight text-[#a7440e] sm:text-[50px]">{certificate.name}</div>
                </div>

                <p className="mt-2 shrink-0 font-serif text-[15px] font-semibold text-[#5f341e] sm:mt-3 sm:text-[18px]">for successfully completing</p>

                <div className="mx-auto mt-2 shrink-0 rounded-full bg-[#ffd99d] px-12 py-1.5 font-serif text-[25px] font-black text-[#4c2915] shadow-[inset_0_1px_0_rgba(255,255,255,.55)] sm:mt-2 sm:px-16 sm:py-2 sm:text-[31px]">LEVEL {certificate.level}</div>

                <p className="mt-1.5 shrink-0 font-serif text-[13px] font-semibold text-[#653a22] sm:text-[16px]">in the Memory Sequence Game</p>

                {/* certificate details */}
                <div className="mx-auto mt-5 grid w-full shrink-0 grid-cols-4 overflow-hidden rounded-[18px] border-[2px] border-[#e8cfaa] bg-[#fff7e9] sm:mt-6">
                  <CertStat icon="🏆" label="SCORE" value={certificate.score.toLocaleString()} />
                  <CertStat icon="▦" label="SEQUENCE" value={certificate.length} />
                  <CertStat icon="▮▮▮" label="DIFFICULTY" value={certificate.difficulty} />
                  <CertStat icon="▣" label="COMPLETED ON" value={completedDate} />
                </div>

                {/* footer sits at the bottom of the sheet */}
                <div className="mt-auto flex w-full shrink-0 items-end justify-between px-4 pt-5 sm:px-6 sm:pt-6">
                  <div className="text-left">
                    <div className="font-serif text-[20px] font-bold italic text-[#653720] sm:text-[24px]">Nebuloid Tech Studio</div>
                    <div className="mt-1 text-[8px] font-black tracking-[.30em] text-[#a8754f] sm:text-[10px]">GAME DEVELOPER</div>
                  </div>
                  <div className="text-right font-serif text-[18px] italic leading-6 text-[#653720] sm:text-[23px]">Keep Playing!<br/>Keep Improving!</div>
                </div>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="certificate-actions flex h-[70px] shrink-0 items-center justify-center gap-4 sm:h-[76px] sm:gap-5">
            <button type="button" onClick={() => window.print()} className="h-[56px] min-w-[260px] rounded-[18px] border-[3px] border-[#ff8d28] bg-[linear-gradient(180deg,#ff7220,#eb4e09)] px-7 text-[16px] font-black text-white shadow-[0_5px_0_#a73808,0_9px_16px_rgba(100,45,8,.22)] transition hover:-translate-y-0.5 sm:min-w-[285px] sm:text-[18px]">
              🖨 PRINT CERTIFICATE
            </button>
            <button type="button" onClick={continueNextLevel} className="h-[56px] min-w-[350px] rounded-[18px] border-[3px] border-[#3c9d25] bg-[linear-gradient(180deg,#51bd2e,#19830f)] px-7 text-[16px] font-black text-white shadow-[0_5px_0_#12610a,0_9px_16px_rgba(30,90,10,.22)] transition hover:-translate-y-0.5 sm:min-w-[390px] sm:text-[18px]">
              CONTINUE TO LEVEL {level + 1} <span className="ml-2 text-[22px]">→</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

if (page === "over") {
    return (
      <main className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden bg-[#f6e1c1] text-[#4a2412]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,.76),transparent_48%),linear-gradient(135deg,#f8e8ce_0%,#f2d9b5_50%,#f8e6c7_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:radial-gradient(#9c6436_1px,transparent_1px)] [background-size:17px_17px]" />

        {/* Decorative wooden corners */}
        <div className="pointer-events-none absolute -bottom-48 -left-44 z-10 h-[610px] w-[610px] rotate-[-18deg] rounded-[48%] bg-[repeating-linear-gradient(8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_-28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />
        <div className="pointer-events-none absolute -bottom-48 -right-44 z-10 h-[610px] w-[610px] rotate-[18deg] rounded-[48%] bg-[repeating-linear-gradient(-8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />

        {/* Leaves / books */}
        <div className="pointer-events-none absolute -left-8 -top-7 z-20 h-36 w-44 rotate-[-10deg]">
          <span className="absolute left-4 top-8 h-20 w-11 rotate-[-28deg] rounded-[70%_15%] bg-[#42a92c] shadow-[inset_6px_2px_8px_rgba(255,255,255,.22)]" />
          <span className="absolute left-16 top-2 h-24 w-12 rotate-[5deg] rounded-[70%_15%] bg-[#55b936]" />
          <span className="absolute left-28 top-12 h-20 w-11 rotate-[35deg] rounded-[70%_15%] bg-[#39a526]" />
        </div>
        <div className="pointer-events-none absolute -right-6 -top-8 z-20 h-36 w-44 rotate-[10deg]">
          <span className="absolute right-4 top-8 h-20 w-11 rotate-[28deg] rounded-[15%_70%] bg-[#42a92c]" />
          <span className="absolute right-16 top-2 h-24 w-12 rotate-[-5deg] rounded-[15%_70%] bg-[#55b936]" />
          <span className="absolute right-28 top-12 h-20 w-11 rotate-[-35deg] rounded-[15%_70%] bg-[#39a526]" />
        </div>

        <button type="button" onClick={home} className="fixed bottom-7 left-7 z-50 rounded-[20px] border-[3px] border-[#f6a044] bg-gradient-to-b from-[#d87820] to-[#a74f13] px-7 py-3 text-lg font-black text-white shadow-[0_5px_0_#7c350e,0_9px_18px_rgba(85,38,8,.28)] transition hover:-translate-y-0.5">
          ← &nbsp; MAIN MENU
        </button>

        {/* Game-over side copy */}
        <div className="pointer-events-none absolute left-[4%] top-[30%] z-20 w-[210px] text-left">
          <div className="text-sm font-black tracking-[.32em] text-[#9a4a19]">MISS THE SEQUENCE</div>
          <div className="mt-1 text-[32px] font-black leading-none text-[#d46b0c]">TRY AGAIN</div>
          <div className="mt-3 h-[3px] w-16 bg-[#df8b39]" />
          <p className="mt-4 text-[10px] font-black uppercase leading-[1.8] tracking-[.18em] text-[#8d5b3e]">
            WATCH THE TILES<br/>
            REMEMBER THE ORDER<br/>
            REPEAT WITH FOCUS
          </p>
        </div>

        <div className="pointer-events-none absolute right-[4%] top-[30%] z-20 w-[210px] text-right">
          <div className="text-sm font-black tracking-[.32em] text-[#9a4a19]">KEEP YOUR FOCUS</div>
          <div className="mt-1 text-[32px] font-black leading-none text-[#d46b0c]">BUILD MEMORY</div>
          <div className="ml-auto mt-3 h-[3px] w-16 bg-[#df8b39]" />
          <p className="mt-4 text-[10px] font-black uppercase leading-[1.8] tracking-[.18em] text-[#8d5b3e]">
            STUDY THE PATTERN<br/>
            RECALL EACH TILE<br/>
            BEAT YOUR BEST
          </p>
        </div>

        <div className="relative z-30 mx-auto flex h-full w-full max-w-[1200px] flex-col items-center px-5 pt-7 text-center">
          <img
            src="/logo2.png"
            alt="Nebuloid Tech"
            className="h-[88px] w-[360px] object-contain sm:h-[105px] sm:w-[420px]"
          />

          <div className="mt-10 grid h-28 w-28 place-items-center rounded-[28px] bg-[#ffd0d0] shadow-[0_7px_15px_rgba(120,55,20,.12),inset_0_3px_8px_rgba(255,255,255,.55)]">
            <div className="relative text-[76px] font-black leading-none text-[#e91e4d]">
              ×
              <span className="absolute -left-9 top-5 text-4xl font-black text-[#ff9567]">╱</span>
              <span className="absolute -right-9 top-5 text-4xl font-black text-[#ff9567]">╲</span>
            </div>
          </div>

          <p className="mt-5 text-lg font-black tracking-[0.48em] text-[#d14b1b]">YOU FORGOT!!!!</p>
          <h1 className="mt-1 text-[64px] font-black leading-[.95] tracking-tight text-[#fffaf0] drop-shadow-[0_5px_0_#6d2b12,0_8px_10px_rgba(70,30,8,.35)] [-webkit-text-stroke:3px_#54220e] sm:text-[78px]">
            YOU FORGOT!!!!
          </h1>
          <div className="mt-4 flex items-center gap-4 text-lg font-bold text-[#7d4a2f]">
            <span className="h-[3px] w-16 bg-[#d98b59]" />
            <span>You reached level {level}.</span>
            <span className="h-[3px] w-16 bg-[#d98b59]" />
          </div>

          <div className="mt-8 grid w-full max-w-[740px] grid-cols-2 gap-6">
            <div className="rounded-[25px] border-2 border-white/80 bg-[#fff7e8]/90 px-7 py-6 shadow-[0_8px_18px_rgba(91,43,13,.14)]">
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-[#ffebbd] text-4xl">🏆</div>
              <div className="text-sm font-black tracking-[.14em] text-[#8c624a]">FINAL SCORE</div>
              <div className="mt-1 text-4xl font-black text-[#4e2513]">{score.toLocaleString()}</div>
            </div>
            <div className="rounded-[25px] border-2 border-white/80 bg-[#fff7e8]/90 px-7 py-6 shadow-[0_8px_18px_rgba(91,43,13,.14)]">
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-[#e9e9f7] text-4xl">📊</div>
              <div className="text-sm font-black tracking-[.14em] text-[#8c624a]">BEST LEVEL</div>
              <div className="mt-1 text-4xl font-black text-[#4e2513]">{best}</div>
            </div>
          </div>

          <div className="mt-7 flex gap-5">
            <button type="button" onClick={start} className="min-w-[270px] rounded-full border-[3px] border-[#ff8a38] bg-gradient-to-b from-[#ff7a20] to-[#ed4f08] px-8 py-4 text-xl font-black text-white shadow-[0_5px_0_#bd3d08,0_9px_16px_rgba(100,40,8,.25)] transition hover:-translate-y-0.5">↻ &nbsp; PLAY AGAIN</button>
            <button type="button" onClick={home} className="min-w-[270px] rounded-full border-[3px] border-[#e3c39d] bg-[#fffaf0] px-8 py-4 text-xl font-black text-[#5b301c] shadow-[0_5px_0_#d8b98f,0_9px_16px_rgba(100,40,8,.18)] transition hover:-translate-y-0.5">⌂ &nbsp; MAIN MENU</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#f7ead6] text-[#54230e]">
      {/* Warm paper background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,.88),transparent_44%),linear-gradient(135deg,#f8e7cf_0%,#f5ddc0_50%,#f9ead4_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[.045] [background-image:radial-gradient(#9c6436_1px,transparent_1px)] [background-size:17px_17px]" />

      {/* Top-left foliage */}
      <div className="pointer-events-none absolute -left-10 -top-10 z-20 h-[190px] w-[250px]">
        <span className="absolute left-0 top-0 h-28 w-16 -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7ddd35] via-[#45ad20] to-[#176516] shadow-lg" />
        <span className="absolute left-12 -top-3 h-32 w-16 -rotate-[10deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8be63f] via-[#4db321] to-[#196916] shadow-lg" />
        <span className="absolute left-28 top-0 h-32 w-16 rotate-[18deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] via-[#49ad20] to-[#1b6d17] shadow-lg" />
        <span className="absolute left-5 top-16 h-24 w-12 -rotate-[55deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#70d52f] to-[#267f1b] shadow-md" />
      </div>

      {/* Top-right foliage + book */}
      <div className="pointer-events-none absolute -right-8 -top-8 z-20 h-[210px] w-[300px]">
        <span className="absolute right-0 top-0 h-32 w-16 rotate-[36deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#7ddd35] via-[#45ad20] to-[#176516] shadow-lg" />
        <span className="absolute right-12 -top-2 h-32 w-16 rotate-[10deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8be63f] via-[#4db321] to-[#196916] shadow-lg" />
        <span className="absolute right-28 top-1 h-32 w-16 -rotate-[18deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] via-[#49ad20] to-[#1b6d17] shadow-lg" />
        <div className="absolute -right-14 top-16 h-24 w-40 rotate-[35deg] rounded-[16px] border-[6px] border-[#cf171e] bg-gradient-to-br from-[#ff4c45] to-[#d9161c] shadow-[0_10px_14px_rgba(67,23,8,.28)]">
          <span className="absolute right-6 top-4 text-4xl font-black text-[#ffe0a0]">★</span>
          <span className="absolute -bottom-3 left-1 h-4 w-36 rounded-full bg-[#0d4fa9]" />
        </div>
      </div>

      {/* Loose leaves */}
      <span className="pointer-events-none absolute left-[3%] top-[17%] z-10 h-16 w-9 -rotate-[40deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
      <span className="pointer-events-none absolute right-[5%] top-[22%] z-10 h-16 w-9 rotate-[40deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />
      <span className="pointer-events-none absolute right-[15%] bottom-[34%] z-10 h-14 w-8 rotate-[40deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82df38] to-[#2b8b1d] shadow-md" />

      {/* Soft memory decorations */}
      <div className="pointer-events-none absolute left-[1%] top-[31%] hidden h-16 w-16 rounded-full border-[9px] border-[#f2c984]/45 lg:block" />
      <div className="pointer-events-none absolute left-[12%] top-[39%] hidden h-7 w-12 rotate-[42deg] rounded-full bg-[#f2c984]/40 lg:block" />
      <div className="pointer-events-none absolute left-[10%] top-[43%] hidden h-7 w-14 rounded-full bg-[#f2c984]/40 lg:block" />
      <div className="pointer-events-none absolute left-[11%] top-[47%] hidden h-7 w-12 -rotate-[42deg] rounded-full bg-[#f2c984]/40 lg:block" />
      <div className="pointer-events-none absolute right-[1%] top-[45%] hidden h-16 w-16 rounded-full border-[9px] border-[#f2c984]/40 lg:block" />

      {/* Wooden lower corners */}
      <div className="pointer-events-none absolute -bottom-52 -left-48 z-10 h-[590px] w-[590px] rotate-[-18deg] rounded-[48%] bg-[repeating-linear-gradient(8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_-28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />
      <div className="pointer-events-none absolute -bottom-52 -right-48 z-10 h-[590px] w-[590px] rotate-[18deg] rounded-[48%] bg-[repeating-linear-gradient(-8deg,#8e4319_0,#b85e24_10px,#7f3b17_17px,#d2782d_29px)] shadow-[inset_28px_0_45px_rgba(65,28,5,.28),0_-8px_24px_rgba(82,37,7,.22)]" />

      {/* Notebook */}
      <div className="pointer-events-none absolute -bottom-2 left-[-10px] z-20 hidden w-[185px] rotate-[-12deg] rounded-[18px] border border-[#dfc9a5] bg-[#fff8e8] px-5 py-7 shadow-[0_14px_18px_rgba(71,35,9,.25)] lg:block">
        <div className="absolute -top-4 left-8 text-4xl">📒</div>
        <div className="mt-4 text-center font-serif text-xl font-bold leading-8 text-[#9a613d]">
          Observe<br />Remember<br />Repeat<br />Grow!
        </div>
        <div className="mt-2 text-center text-2xl text-[#9a613d]">⌣</div>
      </div>

      {/* Clock */}
      <div className="pointer-events-none absolute -bottom-20 right-[1%] z-20 h-[245px] w-[245px] rounded-full border-[15px] border-[#f39a0d] bg-[#fff0ca] shadow-[0_13px_18px_rgba(76,35,8,.36),inset_0_0_0_4px_#a14f08]">
        <span className="absolute left-1/2 top-[12px] -translate-x-1/2 text-[15px] font-black">12</span>
        <span className="absolute bottom-[12px] left-1/2 -translate-x-1/2 text-[15px] font-black">6</span>
        <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[15px] font-black">9</span>
        <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[15px] font-black">3</span>
        <div className="absolute left-1/2 top-1/2 h-[82px] w-[7px] -translate-x-1/2 -translate-y-[92%] rotate-[28deg] rounded-full bg-[#4a2a1c] origin-bottom" />
        <div className="absolute left-1/2 top-1/2 h-[68px] w-[7px] -translate-y-1/2 rotate-[54deg] rounded-full bg-[#e33131] origin-bottom" />
        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#583022] shadow-md" />
      </div>

      {/* Game-specific side copy */}
      <div className="pointer-events-none absolute left-[3.8%] top-[31%] z-40 hidden w-[205px] text-left lg:block">
        <div className="font-black text-[15px] tracking-[.34em] text-[#7b421f]">WATCH</div>
        <div className="mt-1 font-black text-[36px] leading-[.9] tracking-[-.02em] text-[#d36b08]">REMEMBER</div>
        <div className="mt-2 font-black text-[15px] tracking-[.34em] text-[#7b421f]">REPEAT</div>
        <div className="mt-5 h-[4px] w-20 rounded-full bg-[#d36b08]" />
        <div className="mt-4 text-[10px] font-black leading-[1.8] tracking-[.16em] text-[#936847]">
          STUDY THE SEQUENCE<br />
          REMEMBER EVERY TILE<br />
          REPEAT IT IN ORDER
        </div>
      </div>

      <div className="pointer-events-none absolute right-[3.8%] top-[31%] z-40 hidden w-[205px] text-right lg:block">
        <div className="font-black text-[15px] tracking-[.34em] text-[#7b421f]">LISTEN</div>
        <div className="mt-1 font-black text-[36px] leading-[.9] tracking-[-.02em] text-[#d36b08]">RECALL</div>
        <div className="mt-2 font-black text-[15px] tracking-[.34em] text-[#7b421f]">MATCH</div>
        <div className="mt-5 ml-auto h-[4px] w-20 rounded-full bg-[#d36b08]" />
        <div className="mt-4 text-[10px] font-black leading-[1.8] tracking-[.16em] text-[#936847]">
          FOLLOW THE PATTERN<br />
          USE MEMORY AND SOUND<br />
          BEAT YOUR SCORE
        </div>
      </div>

      <div className="relative z-30 mx-auto flex h-full w-full max-w-[1450px] flex-col px-5 pb-3 pt-2 sm:px-8">
        {/* Header */}
        <header className="relative mx-auto flex w-full max-w-[1240px] shrink-0 items-start justify-between gap-4">
          <button
            type="button"
            onClick={home}
            className="fixed bottom-7 left-7 z-50 flex min-h-[58px] items-center gap-3 rounded-full border-[3px] border-[#9d4e19] bg-[linear-gradient(180deg,#bd7134,#914414)] px-7 text-[21px] font-black text-white shadow-[0_5px_0_#6e300d,0_10px_14px_rgba(83,38,8,.25),inset_0_2px_0_rgba(255,255,255,.3)] transition hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <span className="text-[34px] leading-none">←</span>
            EXIT
          </button>

          <div className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center text-center select-none">
            <img
              src="/logo2.png"
              alt="Nebuloid Tech"
              className="h-[76px] w-[300px] object-contain sm:h-[86px] sm:w-[340px]"
            />
            <div className="mt-1 flex items-center gap-4 text-[#6a3218]">
              <span className="h-[3px] w-10 rounded-full bg-[#d36b08]" />
              <span className="whitespace-nowrap text-[clamp(27px,3vw,46px)] font-black tracking-[-.025em] [font-family:Georgia,'Times New Roman',serif]">
                MEMORY SEQUENCE
              </span>
              <span className="h-[3px] w-10 rounded-full bg-[#d36b08]" />
            </div>
            <div className="mt-2 rounded-full bg-gradient-to-r from-[#e96b16] to-[#d95a0c] px-9 py-2 text-[20px] font-black text-white shadow-[0_4px_0_#a33d08]">
              LEVEL {level}
            </div>
          </div>

          <div className="mt-1 flex min-w-[165px] items-center gap-3 rounded-[24px] border-[2px] border-[#ebcfaa] bg-[#fff7e8]/90 px-5 py-3 shadow-[0_5px_12px_rgba(91,48,15,.10)]">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ffe9ae] text-[27px] shadow-inner">♛</div>
            <div className="text-left">
              <div className="text-[14px] font-black tracking-wide text-[#6a3218]">SCORE</div>
              <div className="text-[25px] font-black leading-none text-[#54230e]">{score.toLocaleString()}</div>
            </div>
          </div>
        </header>

        {/* Status panel */}
        <section className="mx-auto mt-20 w-full max-w-[930px] shrink-0 rounded-[28px] border-[3px] border-[#e5c79f] bg-[#fffaf0]/85 px-6 py-3 shadow-[0_10px_18px_rgba(87,45,12,.13)] backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#ffe6bf] text-[31px] shadow-inner">
              ⌛
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[20px] font-black text-[#54230e] sm:text-[24px]">{status}</div>
                  <div className="mt-0.5 text-[14px] font-semibold text-[#895a3a] sm:text-[16px]">
                    {phase === "input" ? "Repeat every tile in order." : "Pay attention to both light and sound."}
                  </div>
                </div>
                <div className="shrink-0 text-[20px] font-black text-[#54230e] sm:text-[24px]">
                  {ans.length}/{seq.length}
                </div>
              </div>

              <div className="mt-3 h-5 overflow-hidden rounded-full bg-[#efdcc1]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f5bd62] to-[#e98a2b] transition-all duration-200"
                  style={{ width: `${phase === "watch" ? 0 : progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tile grid */}
        <div className={`relative mx-auto mt-6 grid w-full grid-cols-3 transition-all duration-200 ${count <= 6 ? "max-w-[620px] gap-4 sm:gap-5" : count <= 8 ? "max-w-[430px] gap-3 sm:gap-3.5" : "max-w-[380px] gap-2.5 sm:gap-3"}`}>
          {/* Decorative rays */}
          <div className="pointer-events-none absolute -left-[92px] top-1/2 hidden -translate-y-1/2 lg:block">
            <span className="mb-5 block h-5 w-14 rotate-[48deg] rounded-full bg-[#f2c984]/65" />
            <span className="mb-5 block h-5 w-16 rounded-full bg-[#f2c984]/65" />
            <span className="block h-5 w-14 -rotate-[48deg] rounded-full bg-[#f2c984]/65" />
          </div>
          <div className="pointer-events-none absolute -right-[92px] top-1/2 hidden -translate-y-1/2 lg:block">
            <span className="mb-5 block h-5 w-14 -rotate-[48deg] rounded-full bg-[#f2c984]/65" />
            <span className="mb-5 block h-5 w-16 rounded-full bg-[#f2c984]/65" />
            <span className="block h-5 w-14 rotate-[48deg] rounded-full bg-[#f2c984]/65" />
          </div>

          {tiles.slice(0, count).map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={phase !== "input"}
              onClick={() => tap(tile.id)}
              aria-label={`Tile ${tile.name}`}
              style={{
                background: active === tile.id
                  ? `linear-gradient(145deg, ${tile.db}, ${tile.da})`
                  : `linear-gradient(145deg, ${tile.b}, ${tile.a})`,
                color: active === tile.id ? "rgba(255,255,255,.9)" : tile.c,
                boxShadow: active === tile.id
                  ? "0 12px 20px rgba(73,39,12,.30), inset 0 3px 7px rgba(255,255,255,.10), inset 0 -7px 12px rgba(0,0,0,.18)"
                  : "0 9px 14px rgba(73,39,12,.16), inset 0 2px 5px rgba(255,255,255,.45)"
              }}
              className={[
                `aspect-square ${count >= 7 ? "rounded-[22px]" : "rounded-[28px]"} border-[3px] border-white shadow-[0_9px_14px_rgba(73,39,12,.16),inset_0_2px_5px_rgba(255,255,255,.45)] transition-all duration-100`,
                phase === "input"
                  ? "cursor-pointer active:scale-[.97]"
                  : "cursor-default",
                active === tile.id
                  ? `${count >= 7 ? "scale-[1.015]" : "scale-[1.035]"} shadow-[0_13px_20px_rgba(73,39,12,.30)]`
                  : ""
              ].join(" ")}
            >
              <span className="text-4xl font-black opacity-20 sm:text-5xl">
                {active === tile.id ? "●" : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="mx-auto mt-3 flex w-full max-w-[690px] shrink-0 items-center justify-between gap-4">
          <div className="rounded-full bg-[#f6e4c8]/90 px-6 py-3 text-[14px] font-black text-[#6d3b20] shadow-sm">
            🔊 <span className="ml-2">Unique sound per tile</span>
          </div>

          <button
            type="button"
            onClick={() => setAudio((value) => !value)}
            className="rounded-full bg-[#f6e4c8]/90 px-7 py-3 text-[16px] font-black text-[#6d3b20] shadow-sm transition hover:bg-[#f2d9b5]"
          >
            🔊 {audio ? "Sound ON" : "Sound OFF"}
          </button>
        </div>
      </div>
    </main>
  );

}

function Brand() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative h-[58px] w-[58px] shrink-0 sm:h-[66px] sm:w-[66px]">
        <div className="absolute left-[9px] top-0 h-full w-[18px] -skew-y-[12deg] rounded-[7px] bg-gradient-to-b from-[#27b9ee] to-[#126bd0] shadow-[inset_3px_0_4px_rgba(255,255,255,.35)]" />
        <div className="absolute left-[27px] top-[5px] h-[46px] w-[18px] skew-y-[12deg] rounded-[7px] bg-gradient-to-b from-[#126bd0] to-[#25b8ee] shadow-[inset_-3px_0_4px_rgba(255,255,255,.25)]" />
        <div className="absolute left-[17px] top-[18px] h-[15px] w-[28px] rotate-[30deg] rounded-[6px] bg-[#1988dc]" />
      </div>
      <div className="text-left">
        <div className="text-[25px] font-black leading-none tracking-tight text-[#173d70] sm:text-[31px]">
          NEBULOID TECH
        </div>
        <div className="mt-1 text-[9px] font-extrabold tracking-[0.16em] text-[#173d70] sm:text-[11px]">
          PLAY • PRACTICE • IMPROVE
        </div>
      </div>
    </div>
  );
}

function Info({ t, v, icon, tone }) {
  const tones = {
    violet: "bg-violet-100 text-violet-500",
    blue: "bg-blue-100 text-blue-500",
    green: "bg-green-100 text-green-500"
  };

  return (
    <div className="rounded-2xl border border-white bg-white px-4 py-4 shadow-lg shadow-slate-200/50 sm:px-5">
      <div className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl text-xl ${tones[tone] || tones.violet}`}>
        {icon}
      </div>
      <p className="mt-3 text-[11px] font-black tracking-wide text-slate-400">
        {t}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-900">{v}</p>
    </div>
  );
}

function Big({ t, v }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white py-6 shadow-sm">
      <p className="text-[9px] font-black tracking-[0.2em] text-slate-400">
        {t}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-900">
        {v}
      </p>
    </div>
  );
}

function CertStat({ icon, label, value }) {
  return (
    <div className="relative flex min-h-[72px] min-w-0 items-center justify-center px-2 py-2.5 last:[&>span]:hidden sm:min-h-[82px] sm:px-4 sm:py-3">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="shrink-0 text-[20px] leading-none text-[#f0a51a] sm:text-[25px]">{icon}</div>
        <div className="min-w-0 text-left">
          <div className="text-[8px] font-black tracking-[.16em] text-[#9a7352] sm:text-[10px] sm:tracking-[.18em]">{label}</div>
          <div className="mt-1 break-words text-[15px] font-black leading-none text-[#4d2b19] sm:text-[18px]">{value}</div>
        </div>
      </div>
      <span className="absolute right-0 top-1/2 h-10 w-px -translate-y-1/2 bg-[#e4c69d] last:hidden" />
    </div>
  );
}

function HowTo({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/25 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white p-7 text-left shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-violet-500">
              HOW TO PLAY
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Watch. Listen. Repeat.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl text-slate-500"
          >
            ×
          </button>
        </div>

        <ol className="mt-6 space-y-4 text-sm leading-6 text-slate-500">
          <li>
            <b className="text-slate-900">01.</b>{" "}
            Watch which tiles light up.
          </li>
          <li>
            <b className="text-slate-900">02.</b>{" "}
            Listen carefully — every tile has its own tone.
          </li>
          <li>
            <b className="text-slate-900">03.</b>{" "}
            Tap the same tiles in exactly the same order.
          </li>
          <li>
            <b className="text-slate-900">04.</b>{" "}
            Each level gets longer and faster.
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 min-h-12 w-full rounded-xl bg-slate-950 font-black text-white"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);