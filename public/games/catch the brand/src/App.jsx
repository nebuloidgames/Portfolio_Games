import React, { useCallback, useEffect, useRef, useState } from "react";

const LEVELS = [
  { level: 1, speed: 0.9, spawn: 1400, goal: 8 },
  { level: 2, speed: 1.1, spawn: 1350, goal: 10 },
  { level: 3, speed: 1.3, spawn: 1300, goal: 12 },
  { level: 4, speed: 1.5, spawn: 1250, goal: 14 },
  { level: 5, speed: 1.7, spawn: 1200, goal: 16 },
  { level: 6, speed: 1.9, spawn: 1150, goal: 18 },
  { level: 7, speed: 2.1, spawn: 1100, goal: 20 },
  { level: 8, speed: 2.3, spawn: 1050, goal: 22 },
  { level: 9, speed: 2.5, spawn: 1000, goal: 24 },
  { level: 10, speed: 2.7, spawn: 950, goal: 26 },
];

const WRONG_BRANDS = [
  { name: "Pepsi", emoji: "🥤" },
  { name: "Adidas", emoji: "👟" },
  { name: "Samsung", emoji: "📱" },
  { name: "Burger King", emoji: "🍔" },
  { name: "Google", emoji: "🔎" },
  { name: "Netflix", emoji: "🎬" },
];

function randomX() {
  return Math.random() * 84 + 8;
}

function playCatchSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.09);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    osc.addEventListener("ended", () => {
      ctx.close().catch(() => {});
    });
  } catch {
    // Sound is optional; never let audio errors break the game.
  }
}

function createObject() {
  const correct = Math.random() < 0.43;

  if (correct) {
    return {
      id: `${Date.now()}-${Math.random()}`,
      name: "Nebuloid Tech",
      correct: true,
      x: randomX(),
      y: -12,
      rotation: Math.random() * 16 - 8,
    };
  }

  const wrong = WRONG_BRANDS[Math.floor(Math.random() * WRONG_BRANDS.length)];

  return {
    id: `${Date.now()}-${Math.random()}`,
    name: wrong.name,
    emoji: wrong.emoji,
    correct: false,
    x: randomX(),
    y: -12,
    rotation: Math.random() * 24 - 12,
  };
}

export default function App() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.width = "100%";
    html.style.maxWidth = "100%";
    html.style.height = "100%";
    html.style.margin = "0";
    html.style.padding = "0";
    html.style.overflowX = "hidden";

    body.style.width = "100%";
    body.style.maxWidth = "100%";
    body.style.minHeight = "100%";
    body.style.margin = "0";
    body.style.padding = "0";
    body.style.overflowX = "hidden";

    return () => {
      html.style.width = "";
      html.style.maxWidth = "";
      html.style.height = "";
      html.style.margin = "";
      html.style.padding = "";
      html.style.overflowX = "";

      body.style.width = "";
      body.style.maxWidth = "";
      body.style.minHeight = "";
      body.style.margin = "";
      body.style.padding = "";
      body.style.overflowX = "";
    };
  }, []);
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caught, setCaught] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [objects, setObjects] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [basketX, setBasketX] = useState(50);
  const [isPaused, setIsPaused] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardPos, setKeyboardPos] = useState(() => ({
    x: Math.max(8, (window.innerWidth - 360) / 2),
    y: Math.max(8, Math.min(window.innerHeight - 225, window.innerHeight * 0.68)),
  }));
  const keyboardDragRef = useRef(null);

  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const spawnRef = useRef(null);
  const objectsRef = useRef([]);
  const basketRef = useRef(50);
  const basketElementRef = useRef(null);

  const level = LEVELS[levelIndex];

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setCaught(0);
    setLevelScore(0);
    setObjects([]);
    objectsRef.current = [];
    basketRef.current = 50;
    setBasketX(50);
    setIsPaused(false);
  }, []);

  const startLevel = useCallback(() => {
    resetGame();
    setScreen("game");
  }, [resetGame]);

  const finishLevel = useCallback(() => {
    setObjects([]);
    objectsRef.current = [];
    setIsPaused(false);
    setCertificate({
      player: playerName,
      level: level.level,
      score: levelScore,
    });
    setScreen("certificate");
  }, [playerName, level.level, levelScore]);

  const handleCatch = useCallback((item) => {
    if (item.correct) {
      if (isSoundOn) playCatchSound();
      setCaught((v) => v + 1);
      setScore((v) => v + 10);
      setLevelScore((v) => v + 10);
    } else {
      setLives((v) => Math.max(0, v - 1));
    }

    objectsRef.current = objectsRef.current.filter((obj) => obj.id !== item.id);
    setObjects([...objectsRef.current]);
  }, [isSoundOn]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;

    const move = (e) => {
      if (e.key === "ArrowLeft") {
        basketRef.current = Math.max(7, basketRef.current - 6);
        setBasketX(basketRef.current);
      }
      if (e.key === "ArrowRight") {
        basketRef.current = Math.min(93, basketRef.current + 6);
        setBasketX(basketRef.current);
      }
    };

    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, [screen, isPaused]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;

    spawnRef.current = setInterval(() => {
      const item = createObject();
      objectsRef.current.push(item);
      setObjects([...objectsRef.current]);
    }, level.spawn);

    return () => clearInterval(spawnRef.current);
  }, [screen, isPaused, level]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;

    let last = performance.now();

    const animate = (now) => {
      const delta = Math.min((now - last) / 16.67, 2);
      last = now;
      const next = [];

      for (const item of objectsRef.current) {
        const newY = item.y + level.speed * delta;

        // Use the actual on-screen geometry of the catcher and falling logo so
        // the logo disappears exactly when its lower edge touches the basket rim.
        const field = gameAreaRef.current;
        const fieldWidth = field?.clientWidth || window.innerWidth;
        const fieldHeight = field?.clientHeight || window.innerHeight;
        const objectSize = window.innerWidth <= 600 ? 64 : window.innerWidth <= 900 ? 76 : 92;
        const catcherWidth = window.innerWidth <= 900 ? 150 : 190;
        const catcherHeight = 72;
        const catcherTopPercent = 100 - 13 - (catcherHeight / fieldHeight) * 100;
        const catcherRimTopPercent = catcherTopPercent + (9 / fieldHeight) * 100;
        const catcherRimBottomPercent = catcherRimTopPercent + (19 / fieldHeight) * 100;
        const objectHalfWidthPercent = (objectSize / 2 / fieldWidth) * 100;
        const catcherHalfWidthPercent = (catcherWidth / 2 / fieldWidth) * 100;

        // The logo is centered on item.x. It has collided once its bottom
        // edge reaches the top of the glowing catcher rim.
        const horizontalHit =
          Math.abs(item.x - basketRef.current) <=
          objectHalfWidthPercent + catcherHalfWidthPercent;
        const objectBottomPercent = newY + (objectSize / fieldHeight) * 100;
        const verticalHit =
          objectBottomPercent >= catcherRimTopPercent &&
          newY <= catcherRimBottomPercent;

        if (horizontalHit && verticalHit) {
          if (item.correct) {
            if (isSoundOn) playCatchSound();
            setCaught((v) => v + 1);
            setScore((v) => v + 10);
            setLevelScore((v) => v + 10);
          } else {
            setLives((v) => Math.max(0, v - 1));
          }
          // Do not add this object to `next` — it disappears immediately.
          continue;
        }

        if (newY > 104) {
          if (item.correct) setLives((v) => Math.max(0, v - 1));
          continue;
        }

        next.push({ ...item, y: newY });
      }

      objectsRef.current = next;
      setObjects(next);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [screen, isPaused, level, handleCatch]);

  useEffect(() => {
    if (screen !== "game") return;
    if (lives <= 0) {
      const timer = setTimeout(() => setScreen("gameover"), 300);
      return () => clearTimeout(timer);
    }
  }, [lives, screen]);

  useEffect(() => {
    if (screen !== "game") return;
    if (caught >= level.goal) {
      const timer = setTimeout(finishLevel, 400);
      return () => clearTimeout(timer);
    }
  }, [caught, level.goal, screen, finishLevel]);

  // Ultra-low-latency mouse control: update the basket DOM directly on every pointer event.
  // React state is intentionally not updated for every mouse movement, avoiding re-renders.
  const handlePointerMove = (e) => {
    if (isPaused || screen !== "game") return;
    const x = Math.max(7, Math.min(93, (e.clientX / window.innerWidth) * 100));
    basketRef.current = x;
    if (basketElementRef.current) {
      basketElementRef.current.style.left = `${x}%`;
    }
  };

  // Keep the catcher locked to the mouse cursor across the whole game screen.
  useEffect(() => {
    if (screen !== "game") return;

    const moveWithMouse = (e) => handlePointerMove(e);
    window.addEventListener("pointermove", moveWithMouse, { passive: true });

    return () => window.removeEventListener("pointermove", moveWithMouse);
  }, [screen, isPaused]);

  const handleNextLevel = () => {
    if (levelIndex >= LEVELS.length - 1) {
      setScreen("finished");
      return;
    }

    setLevelIndex((v) => v + 1);
    setCertificate(null);
    resetGame();
    setScreen("game");
  };

  const restartEverything = () => {
    setLevelIndex(0);
    setCertificate(null);
    resetGame();
    setScreen("start");
  };

  const downloadCertificate = () => {
    if (!certificate) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 1600, 1000);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(0.55, "#fbfdff");
    bg.addColorStop(1, "#eef9ff");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1600, 1000);

    ctx.strokeStyle = "#9bdcff";
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, 1490, 890);
    ctx.strokeStyle = "#14213d";
    ctx.lineWidth = 5;
    ctx.strokeRect(70, 70, 1460, 860);
    ctx.strokeStyle = "#55c9f3";
    ctx.lineWidth = 2;
    ctx.strokeRect(86, 86, 1428, 828);

    ctx.fillStyle = "#14213d";
    ctx.font = "28px Arial";
    ctx.fillText("✦", 105, 125);
    ctx.fillText("✦", 1470, 125);
    ctx.fillText("✦", 105, 900);
    ctx.fillText("✦", 1470, 900);

    const center = 800;
    ctx.textAlign = "center";

    const drawCertificate = () => {
      ctx.fillStyle = "#14213d";
      ctx.font = "700 22px Arial";
      ctx.fillText("N E B U L O I D   T E C H", center, 225);

      ctx.strokeStyle = "#22b9ee";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(730, 250);
      ctx.lineTo(870, 250);
      ctx.stroke();

      ctx.fillStyle = "#14213d";
      ctx.font = "900 72px Arial";
      ctx.fillText("CERTIFICATE", center, 335);

      ctx.font = "700 26px Arial";
      ctx.fillText("OF ACHIEVEMENT", center, 375);

      ctx.fillStyle = "#52627a";
      ctx.font = "24px Arial";
      ctx.fillText("This certificate is proudly presented to", center, 440);

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 48px Arial";
      ctx.fillText(certificate.player || "Player", center, 505);

      ctx.strokeStyle = "#8ecfe9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(610, 525);
      ctx.lineTo(990, 525);
      ctx.stroke();

      ctx.fillStyle = "#52627a";
      ctx.font = "24px Arial";
      ctx.fillText("for successfully completing", center, 570);

      ctx.fillStyle = "#159bd7";
      ctx.font = "900 34px Arial";
      ctx.fillText("CATCH THE BRAND", center, 625);

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#d5e3ef";
      ctx.lineWidth = 2;
      ctx.roundRect(620, 675, 150, 105, 18);
      ctx.fill();
      ctx.stroke();
      ctx.roundRect(830, 675, 150, 105, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#159bd7";
      ctx.font = "700 18px Arial";
      ctx.fillText("LEVEL", 695, 710);
      ctx.fillText("SCORE", 905, 710);

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 34px Arial";
      ctx.fillText(String(certificate.level), 695, 752);
      ctx.fillText(String(certificate.score), 905, 752);

      ctx.fillStyle = "#52627a";
      ctx.font = "700 16px Arial";
      ctx.fillText("KEEP PLAYING • KEEP ACHIEVING", center, 855);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Catch-The-Brand-Certificate-Level-${certificate.level}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    const logo = new Image();
    logo.onload = () => {
      ctx.drawImage(logo, center - 58, 110, 116, 78);
      drawCertificate();
    };
    logo.onerror = drawCertificate;
    logo.src = "/logo.png";
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute -right-40 top-1/2 h-96 w-96 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 h-full w-full max-w-full px-0 py-0 overflow-x-hidden">
        {screen === "start" && (
          <div className="relative h-full w-full overflow-hidden bg-white text-center">
            {/* soft sky glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,1)_0%,rgba(248,252,255,0.98)_42%,rgba(224,241,255,0.95)_100%)]" />
            <div className="pointer-events-none absolute left-[-7%] top-[-18%] h-[38rem] w-[38rem] rounded-full bg-sky-200/55" />
            <div className="pointer-events-none absolute right-[-8%] top-[-16%] h-[34rem] w-[34rem] rounded-full bg-blue-100/80" />

            {/* corner circles */}
            <div className="pointer-events-none absolute left-[-12rem] top-[-12rem] h-[25rem] w-[25rem] rounded-full border-[34px] border-sky-200/55" />
            <div className="pointer-events-none absolute right-[-11rem] top-[-11rem] h-[24rem] w-[24rem] rounded-full border-[34px] border-sky-200/60" />

            {/* side copy */}
            <div className="pointer-events-none absolute left-[6.3%] top-[6%] hidden text-left text-[13px] font-black leading-[1.75] tracking-[0.32em] text-blue-900/65 md:block">
              PLAY<br />SOLVE<br />IMPROVE
              <div className="mt-4 h-1 w-7 rounded-full bg-blue-600" />
            </div>
            <div className="pointer-events-none absolute right-[6.3%] top-[6%] hidden text-left text-[13px] font-black leading-[1.75] tracking-[0.32em] text-blue-900/65 md:block">
              IDEAS<br />BUILD<br />BRANDS
              <div className="mt-4 h-1 w-7 rounded-full bg-blue-600" />
            </div>

            {/* decorative dot grids */}
            <div className="pointer-events-none absolute left-[7.5%] top-[43%] hidden grid grid-cols-5 gap-4 opacity-50 md:grid">
              {Array.from({ length: 25 }).map((_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-400" />)}
            </div>
            <div className="pointer-events-none absolute right-[8%] top-[34%] hidden grid grid-cols-5 gap-4 opacity-50 md:grid">
              {Array.from({ length: 25 }).map((_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-400" />)}
            </div>

            {/* soft city skyline */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[14%] hidden h-[27%] opacity-30 md:block">
              <div className="absolute bottom-0 left-[1%] h-[72%] w-7 bg-sky-200" />
              <div className="absolute bottom-0 left-[5%] h-[45%] w-10 bg-sky-200" />
              <div className="absolute bottom-0 left-[9%] h-[58%] w-8 bg-sky-200" />
              <div className="absolute bottom-0 left-[15%] h-[38%] w-14 bg-sky-200" />
              <div className="absolute bottom-0 left-[22%] h-[75%] w-10 bg-sky-200" />
              <div className="absolute bottom-0 left-[25%] h-[48%] w-16 bg-sky-200" />
              <div className="absolute bottom-0 left-[31%] h-[35%] w-9 bg-sky-200" />
              <div className="absolute bottom-0 left-[38%] h-[62%] w-12 bg-sky-200" />
              <div className="absolute bottom-0 left-[44%] h-[42%] w-10 bg-sky-200" />
              <div className="absolute bottom-0 left-[50%] h-[55%] w-14 bg-sky-200" />
              <div className="absolute bottom-0 left-[57%] h-[39%] w-9 bg-sky-200" />
              <div className="absolute bottom-0 left-[64%] h-[66%] w-12 bg-sky-200" />
              <div className="absolute bottom-0 left-[71%] h-[47%] w-16 bg-sky-200" />
              <div className="absolute bottom-0 left-[78%] h-[58%] w-10 bg-sky-200" />
              <div className="absolute bottom-0 left-[85%] h-[43%] w-14 bg-sky-200" />
              <div className="absolute bottom-0 left-[93%] h-[68%] w-8 bg-sky-200" />
            </div>

            {/* layered wave hills */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[31%] overflow-hidden">
              <div className="absolute -bottom-[34%] left-[-8%] h-[75%] w-[62%] rounded-[50%] bg-blue-100/90" />
              <div className="absolute -bottom-[40%] right-[-7%] h-[80%] w-[60%] rounded-[50%] bg-blue-100/90" />
              <div className="absolute -bottom-[52%] left-[17%] h-[86%] w-[66%] rounded-[50%] bg-sky-200/75" />
              <div className="absolute -bottom-[63%] left-[-4%] h-[100%] w-[70%] rounded-[50%] border-t-2 border-white/80 bg-blue-200/60" />
              <div className="absolute -bottom-[68%] right-[-6%] h-[105%] w-[72%] rounded-[50%] border-t-2 border-white/80 bg-blue-200/60" />
            </div>

            <div className="relative z-10 flex h-full min-h-screen flex-col items-center px-5 pt-[2.2vh] md:px-8">
              {/* brand header */}
              <div className="flex flex-col items-center">
                <img src="/logo.png" alt="Nebuloid Tech" className="h-20 w-28 object-contain md:h-24 md:w-36" />
                <div className="-mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  NEBULOID <span className="text-blue-600">TECH</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-base font-black tracking-[0.48em] text-blue-600 md:text-lg">
                  <span className="h-px w-8 bg-blue-300" />
                  STUDIO
                  <span className="h-px w-8 bg-blue-300" />
                </div>
              </div>

              {/* welcome */}
              <div className="mt-[4.5vh] flex items-center gap-5 text-xl font-black tracking-[0.38em] text-blue-500 md:text-2xl">
                <span className="h-0.5 w-20 bg-blue-300 md:w-28" />
                WELCOME TO
                <span className="h-0.5 w-20 bg-blue-300 md:w-28" />
              </div>

              {/* title */}
              <h1 className="mt-4 font-black leading-[0.84] tracking-[-0.045em] drop-shadow-[0_8px_5px_rgba(29,78,216,0.13)]">
                <span className="block text-[clamp(4rem,8vw,7.2rem)] text-slate-950">CATCH THE</span>
                <span className="block text-[clamp(4.4rem,8.5vw,7.7rem)] text-blue-600">BRAND</span>
              </h1>

              <div className="mt-3 text-base font-black tracking-[0.34em] text-blue-900/65 md:text-xl">
                PLAY <span className="mx-2">•</span> SOLVE <span className="mx-2">•</span> IMPROVE
              </div>

              {/* start */}
              <button
                type="button"
                onClick={() => setScreen("name")}
                className="group relative mt-[2.2vh] flex h-64 w-64 items-center justify-center rounded-full border-[8px] border-blue-300 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 text-white shadow-[0_18px_40px_rgba(37,99,235,0.30),inset_0_5px_0_rgba(255,255,255,0.42)] transition hover:-translate-y-1 md:h-72 md:w-72"
              >
                <span className="absolute inset-3 rounded-full border-[4px] border-blue-200/80" />
                <span className="absolute inset-[-10px] rounded-full border-[5px] border-blue-300/70 border-l-transparent border-b-transparent rotate-[-20deg]" />
                <span className="relative flex flex-col items-center">
                  <span className="text-6xl leading-none drop-shadow-md md:text-7xl">▶</span>
                  <span className="mt-2 text-3xl font-black md:text-4xl">START</span>
                </span>
              </button>

              {/* game-specific bottom side copy */}
              <div className="catch-start-bottom-copy catch-start-bottom-copy-left">
                <span>CATCH RIGHT</span>
                <b>MOVE FAST</b>
                <small>FOLLOW THE FALL<br />CATCH NEBULOID<br />AVOID WRONG BRANDS</small>
              </div>

              <div className="catch-start-bottom-copy catch-start-bottom-copy-right">
                <span>AVOID WRONG</span>
                <b>BRANDS</b>
                <small>WATCH THE LOGOS<br />PROTECT YOUR LIVES<br />REACH THE TARGET</small>
              </div>

              {/* How To Play remains available without disturbing the reference layout */}
              <button
                type="button"
                onClick={() => setShowHowToPlay(true)}
                className="absolute bottom-5 left-5 z-30 rounded-full border border-blue-200 bg-white/85 px-5 py-2.5 text-sm font-black tracking-wide text-blue-900 shadow-lg backdrop-blur transition hover:-translate-y-0.5 md:bottom-7 md:left-8 md:px-6 md:py-3"
              >
                ? &nbsp; HOW TO PLAY
              </button>

              {/* floating decorative line */}
              <div className="pointer-events-none absolute left-[13%] top-[34%] hidden h-px w-28 rotate-[-32deg] bg-blue-300 md:block" />
              <div className="pointer-events-none absolute right-[13%] top-[48%] hidden h-px w-28 rotate-[-38deg] bg-blue-300 md:block" />
            </div>

            {showHowToPlay && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-5 backdrop-blur-sm">
                <div className="relative w-full max-w-2xl rounded-[2rem] border border-blue-200 bg-white p-7 text-left shadow-[0_25px_70px_rgba(15,60,100,0.22)] md:p-9">
                  <button type="button" onClick={() => setShowHowToPlay(false)} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-700">×</button>
                  <div className="pr-12">
                    <div className="text-sm font-black tracking-[0.25em] text-blue-600">CATCH THE BRAND</div>
                    <h2 className="mt-1 text-3xl font-black text-slate-950 md:text-4xl">HOW TO PLAY</h2>
                  </div>
                  <div className="mt-7 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-cyan-50 p-5"><div className="text-2xl">🎯</div><h3 className="mt-2 font-black text-slate-950">Your Goal</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">Catch only the falling <b>Nebuloid Tech</b> logo. Avoid all wrong brands.</p></div>
                    <div className="rounded-2xl bg-blue-50 p-5"><div className="text-2xl">🖱️</div><h3 className="mt-2 font-black text-slate-950">Move & Catch</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">Move your mouse or touch the screen to control the catcher. Arrow keys also work.</p></div>
                    <div className="rounded-2xl bg-emerald-50 p-5"><div className="text-2xl">❤️</div><h3 className="mt-2 font-black text-slate-950">Lives & Score</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">You start with 3 lives. A correct catch gives <b>+10 points</b>. Wrong catches cost a life.</p></div>
                    <div className="rounded-2xl bg-violet-50 p-5"><div className="text-2xl">🏆</div><h3 className="mt-2 font-black text-slate-950">Complete Levels</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">Complete the target in every level to unlock your certificate. There are 10 levels.</p></div>
                  </div>
                  <button type="button" onClick={() => setShowHowToPlay(false)} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-base font-black text-white shadow-[0_8px_20px_rgba(8,145,178,0.22)]">GOT IT — LET'S PLAY</button>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "name" && (
          <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
            {/* soft blue/purple background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1)_0%,rgba(247,251,255,0.98)_45%,rgba(232,246,255,0.9)_100%)]" />
            <div className="pointer-events-none absolute left-[-8%] top-[20%] h-96 w-96 rounded-full bg-cyan-100/45 blur-3xl" />
            <div className="pointer-events-none absolute right-[-8%] bottom-[5%] h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" />
            <div className="pointer-events-none absolute left-[20%] bottom-[-15%] h-72 w-72 rounded-full bg-purple-100/30 blur-3xl" />

            {/* faded background brand cards */}
            {[
              ["👟", "Adidas", "left-[10%] top-[22%] -rotate-12"],
              ["👟", "Nike", "right-[12%] top-[25%] rotate-12"],
              ["🐆", "Puma", "left-[9%] bottom-[15%] rotate-12"],
              ["👟", "Reebok", "right-[10%] bottom-[17%] -rotate-12"],
            ].map(([emoji, name, position]) => (
              <div
                key={name}
                className={`pointer-events-none absolute ${position} hidden h-32 w-32 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/60 text-slate-400 opacity-25 shadow-xl md:flex`}
              >
                <span className="text-5xl">{emoji}</span>
                <span className="mt-1 text-sm font-black">{name}</span>
              </div>
            ))}

            {/* decorative plus signs */}
            {[
              "left-[7%] top-[20%]",
              "left-[25%] top-[28%]",
              "right-[32%] top-[25%]",
              "right-[7%] top-[28%]",
              "left-[23%] bottom-[12%]",
              "right-[28%] bottom-[11%]",
            ].map((position, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute ${position} text-3xl font-light text-cyan-500`}
              >
                +
              </span>
            ))}

            {/* top controls */}
            <button
              type="button"
              className="absolute left-8 top-7 z-20 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)]"
            >
              <span className="text-4xl leading-none">🔊</span>
              <span className="mt-2 text-xs font-black tracking-wide text-cyan-600">
                SOUND
              </span>
            </button>

            <button
              type="button"
              className="absolute right-8 top-7 z-20 flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)]"
            >
              <span className="text-4xl font-black leading-none text-slate-800">?</span>
              <span className="mt-2 text-xs font-black tracking-wide text-cyan-600">
                HOW TO PLAY
              </span>
            </button>

            <div className="relative z-10 flex h-full w-full max-w-4xl flex-col items-center px-6 pt-10 text-center">
              {/* header */}
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/logo.png"
                  alt="Nebuloid Tech"
                  className="h-14 w-16 object-contain md:h-16 md:w-20"
                />
                <div className="text-left">
                  <div className="text-xl font-black leading-none text-slate-950 md:text-2xl">
                    NEBULOID TECH
                  </div>
                  <div className="mt-1 text-sm font-black tracking-[0.3em] text-cyan-600 md:text-base">
                    STUDIO
                  </div>
                </div>
              </div>

              <div className="catch-name-main-content flex flex-col items-center w-full">
              {/* level/game logo */}
              <div className="relative mt-10 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[4px] border-cyan-500" />
                <div className="absolute inset-2 rounded-full border-2 border-slate-900" />
                <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-lg font-black text-slate-900">
                  NTS
                </div>
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                CATCH
                <span className="ml-3 text-cyan-600">THE BRAND</span>
              </h1>

              <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
                Catch the falling Nebuloid Tech logo
                <br />
                and avoid the wrong brands.
              </p>

              {/* stats */}
              <div className="mt-8 flex items-stretch justify-center">
                {[
                  ["🎯", "TARGET", "NEBULOID"],
                  ["❤️", "LIVES", "3"],
                  ["🏆", "LEVELS", "10"],
                ].map(([icon, label, value], i) => (
                  <div
                    key={label}
                    className={`min-w-[150px] px-7 md:min-w-[195px] md:px-10 ${
                      i !== 0 ? "border-l-2 border-cyan-200" : ""
                    }`}
                  >
                    <div className="text-3xl md:text-4xl">{icon}</div>
                    <div className="mt-1 text-sm font-black text-cyan-600">{label}</div>
                    <div className="mt-1 text-xl font-black text-slate-950 md:text-2xl">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* name input */}
              <div className="mt-8 w-full max-w-2xl">
                <div className="relative">
                  <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-4xl text-cyan-600">
                    👤
                  </span>
                  <input
                    id="player-name"
                    type="text"
                    value={playerName}
                    readOnly
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (playerName.trim()) {
                          setShowKeyboard(false);
                          setScreen("game");
                        }
                        return;
                      }

                      if (e.key === "Backspace") {
                        e.preventDefault();
                        setPlayerName((v) => v.slice(0, -1));
                        return;
                      }

                      if (e.key === " ") {
                        e.preventDefault();
                        setPlayerName((v) => (v.length < 26 ? `${v} ` : v));
                        return;
                      }

                      // Keep the custom keyboard active while allowing a
                      // physical/hardware keyboard to type normally.
                      if (e.key.length === 1 && playerName.length < 26) {
                        e.preventDefault();
                        setPlayerName((v) => `${v}${e.key}`);
                      }
                    }}
                    placeholder="Enter your name"
                    autoComplete="off"
                    onFocus={() => setShowKeyboard(true)}
                    onClick={() => setShowKeyboard(true)}
                    className="h-20 w-full rounded-2xl border-2 border-cyan-500 bg-white px-20 text-xl font-medium text-slate-800 shadow-[0_5px_20px_rgba(8,145,178,0.10)] outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <button
                id="catch-continue-button"
                type="button"
                disabled={!playerName.trim()}
                onClick={() => {
                  setShowKeyboard(false);
                  setScreen("game");
                }}
                className="mt-7 flex h-16 w-full max-w-md items-center justify-center gap-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-xl font-black text-white shadow-[0_10px_25px_rgba(8,145,178,0.28)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="text-3xl">›</span>
                CONTINUE
              </button>
              </div>
            </div>

            {showKeyboard && (
              <FloatingKeyboard
                value={playerName}
                setValue={setPlayerName}
                position={keyboardPos}
                setPosition={setKeyboardPos}
                dragRef={keyboardDragRef}
                onClose={() => setShowKeyboard(false)}
              />
            )}

            {/* game-specific bottom side copy */}
            <div className="catch-name-bottom-copy catch-name-bottom-copy-left">
              <span>CATCH RIGHT</span>
              <b>MOVE FAST</b>
              <small>FOLLOW THE FALL<br />CATCH NEBULOID<br />AVOID WRONG BRANDS</small>
            </div>

            <div className="catch-name-bottom-copy catch-name-bottom-copy-right">
              <span>AVOID WRONG</span>
              <b>BRANDS</b>
              <small>WATCH THE LOGOS<br />PROTECT YOUR LIVES<br />REACH THE TARGET</small>
            </div>

            {/* bottom corner accents */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-52 overflow-hidden">
              <div className="absolute -left-5 bottom-8 h-1 w-64 rotate-45 bg-cyan-300" />
              <div className="absolute -left-5 bottom-4 h-1 w-64 rotate-45 bg-cyan-400" />
              <div className="absolute -left-5 bottom-0 h-1 w-64 rotate-45 bg-cyan-200" />
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-52 overflow-hidden">
              <div className="absolute -right-5 bottom-8 h-1 w-64 -rotate-45 bg-cyan-300" />
              <div className="absolute -right-5 bottom-4 h-1 w-64 -rotate-45 bg-cyan-400" />
              <div className="absolute -right-5 bottom-0 h-1 w-64 -rotate-45 bg-cyan-200" />
            </div>
          </div>
        )}

        {screen === "game" && (
          <div className="relative h-full min-h-screen w-full overflow-hidden game-screen">
            {/* cinematic futuristic background */}
            <div className="game-bg" />
            <div className="game-bg__glow game-bg__glow--left" />
            <div className="game-bg__glow game-bg__glow--right" />
            <div className="game-bg__beam game-bg__beam--one" />
            <div className="game-bg__beam game-bg__beam--two" />
            <div className="game-city game-city--back" />
            <div className="game-city game-city--front" />
            <div className="game-floor" />
            <div className="game-horizon" />

            {/* decorative floating cubes */}
            <div className="game-cube game-cube--a">N</div>
            <div className="game-cube game-cube--b">N</div>
            <div className="game-cube game-cube--c">◆</div>
            <div className="game-cube game-cube--d">◆</div>
            <div className="game-cube game-cube--e">◆</div>

            {/* top controls */}
            <button
              type="button"
              onClick={() => setIsSoundOn((v) => !v)}
              className={`game-top-button game-top-button--sound ${!isSoundOn ? "is-off" : ""}`}
            >
              <span className="game-top-icon">{isSoundOn ? "🔊" : "🔇"}</span>
              <span>SOUND</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHowToPlay(true)}
              className="game-top-button game-top-button--help"
            >
              <span className="game-help-icon">?</span>
              <span>HOW TO PLAY</span>
            </button>

            {/* studio branding */}
            <div className="game-studio-brand">
              <img src="/logo.png" alt="Nebuloid Tech" draggable="false" />
              <div>
                <div className="game-studio-brand__name">NEBULOID TECH</div>
                <div className="game-studio-brand__sub">STUDIO</div>
              </div>
            </div>

            {/* main title */}
            <div className="game-title-block">
              <div className="game-title-kicker">CATCH THE</div>
              <div className="game-title-row">
                <span className="game-title-line" />
                <h1>BRAND</h1>
                <span className="game-title-line" />
              </div>
              <p>MOVE FAST <b>•</b> CLICK ACCURATELY <b>•</b> GET THE HIGHEST SCORE</p>
            </div>

            {/* left level card */}
            <div className="game-level-card">
              <div className="game-level-card__accent">CATCH THE BRAND</div>
              <div className="game-level-card__level">LEVEL {level.level}</div>
              <div className="game-level-card__speed">SPEED {level.speed.toFixed(1)}x</div>
            </div>

            {/* right HUD */}
            <div className="game-hud">
              <div className="game-stat-card">
                <span>SCORE</span>
                <strong>{score}</strong>
              </div>
              <div className="game-stat-card">
                <span>TARGET</span>
                <strong>{caught}/{level.goal}</strong>
              </div>
              <div className="game-stat-card game-stat-card--lives">
                <span>LIVES</span>
                <strong>{"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}</strong>
              </div>
            </div>
            <div className="game-control-hint">MOVE MOUSE / TOUCH</div>

            {/* play field */}
            <div
              ref={gameAreaRef}
              onPointerMove={handlePointerMove}
              className="absolute inset-x-0 top-[160px] bottom-[58px] touch-none select-none overflow-hidden"
            >
              <div className="game-field-grid" />

              {/* pause */}
              <button
                type="button"
                onClick={() => setIsPaused((v) => !v)}
                className="game-pause-button"
              >
                {isPaused ? "▶  RESUME" : "Ⅱ  PAUSE"}
              </button>

              {/* neon motion trails */}
              <div className="game-trail game-trail--left" />
              <div className="game-trail game-trail--right" />

              {/* falling brands */}
              {objects.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handleCatch(item);
                  }}
                  aria-label={`Catch ${item.name}`}
                  className={`game-brand-object ${item.correct ? "game-brand-object--correct" : ""}`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `translateX(-50%) rotate(${item.rotation}deg)`,
                  }}
                >
                  {item.correct ? (
                    <>
                      <div className="game-brand-object__shine" />
                      <img src="/logo.png" alt="Nebuloid Tech" draggable="false" />
                      <span>NTS</span>
                    </>
                  ) : (
                    <>
                      <span className="game-wrong-emoji">{item.emoji}</span>
                      <span>{item.name}</span>
                    </>
                  )}
                </button>
              ))}

              {/* catcher */}
              <div
                ref={basketElementRef}
                className="game-catcher"
                style={{ left: `${basketX}%` }}
              >
                <div className="game-catcher__glow" />
                <div className="game-catcher__rim" />
                <div className="game-catcher__body" />
                <div className="game-catcher__label">CATCHER</div>
              </div>

              {/* pause overlay */}
              {isPaused && (
                <div className="game-pause-overlay">
                  <div className="game-pause-card">
                    <div className="game-pause-card__icon">Ⅱ</div>
                    <h3>GAME PAUSED</h3>
                    <button type="button" onClick={() => setIsPaused(false)}>RESUME</button>
                  </div>
                </div>
              )}
            </div>

            {/* footer instructions */}
            <div className="game-footer-hint">
              <span>←</span> Move left <b>•</b> Move right <span>→</span> <b>•</b> Catch only the Nebuloid Tech logo
            </div>

            {/* how-to-play modal */}
            {showHowToPlay && (
              <div className="game-help-overlay">
                <div className="game-help-card">
                  <button type="button" onClick={() => setShowHowToPlay(false)} className="game-help-close">×</button>
                  <div className="game-help-card__eyebrow">CATCH THE BRAND</div>
                  <h2>HOW TO PLAY</h2>
                  <div className="game-help-card__items">
                    <div><span>🖱️</span><p><b>Move</b><br />Use mouse, touch or arrow keys to move the catcher.</p></div>
                    <div><span>🎯</span><p><b>Catch</b><br />Catch only the glowing Nebuloid Tech logo.</p></div>
                    <div><span>❤️</span><p><b>Stay alive</b><br />Wrong brands cost a life. Get the target before you run out.</p></div>
                  </div>
                  <button type="button" onClick={() => setShowHowToPlay(false)} className="game-help-card__button">GOT IT — LET'S PLAY</button>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "gameover" && (
          <div className="gameover-screen">
            <div className="game-bg" />
            <div className="game-bg__glow game-bg__glow--left" />
            <div className="game-bg__glow game-bg__glow--right" />
            <div className="game-bg__beam game-bg__beam--one" />
            <div className="game-bg__beam game-bg__beam--two" />
            <div className="game-city game-city--back" />
            <div className="game-city game-city--front" />
            <div className="game-floor" />
            <div className="game-horizon" />

            <div className="gameover-cube gameover-cube--left">N</div>
            <div className="gameover-cube gameover-cube--right">N</div>
            <div className="gameover-cube gameover-cube--small">◆</div>

            <div className="gameover-brand-top">
              <img src="/logo.png" alt="Nebuloid Tech" draggable="false" />
              <div>
                <strong>NEBULOID TECH</strong>
                <span>STUDIO</span>
              </div>
            </div>

            <div className="gameover-side-title">
              <span>CATCH</span><span>THE</span><span>BRAND</span><i />
            </div>
            <div className="gameover-side-copy">
              <span>PLAY</span><span>SOLVE</span><span>IMPROVE</span><i />
            </div>

            <div className="gameover-content">
              <div className="gameover-level">
                <span>LEVEL {level.level}</span>
                <strong>{level.level}</strong>
              </div>

              <div className="gameover-kicker">
                <span /> YOU CAUGHT A WRONG LOGO <span />
              </div>

              <h1>
                YOU CAUGHT A
                <b>WRONG LOGO</b>
              </h1>

              <p>
                You ran out of lives. Your score was <b>{score}.</b>
              </p>

              <div className="gameover-actions">
                <button type="button" onClick={startLevel} className="gameover-action gameover-action--primary">
                  <span>↻</span> TRY AGAIN
                </button>
                <button type="button" onClick={restartEverything} className="gameover-action gameover-action--secondary">
                  <span>⌂</span> MAIN MENU
                </button>
              </div>
            </div>

            <div className="gameover-footer">
              <span /> KEEP PLAYING <b>•</b> KEEP IMPROVING <span />
            </div>
          </div>
        )}

        {screen === "certificate" && certificate && (
          <div className="certificate-screen">
            <div className="certificate-bg" />
            <div className="certificate-bg__glow certificate-bg__glow--left" />
            <div className="certificate-bg__glow certificate-bg__glow--right" />
            <div className="certificate-bg__beam certificate-bg__beam--one" />
            <div className="certificate-bg__beam certificate-bg__beam--two" />
            <div className="certificate-city certificate-city--back" />
            <div className="certificate-city certificate-city--front" />
            <div className="certificate-floor" />

            <button
              type="button"
              onClick={() => setScreen("start")}
              className="certificate-back-button"
            >
              <span>←</span> BACK
            </button>

            <div className="certificate-side-copy">
              <span>PLAY</span>
              <span>SOLVE</span>
              <span>IMPROVE</span>
              <i />
            </div>

            <div className="certificate-brand-top">
              <img src="/logo.png" alt="Nebuloid Tech" draggable="false" />
              <div>NEBULOID TECH</div>
              <span>STUDIO</span>
            </div>

            <div className="certificate-side-title">
              <span>CATCH</span>
              <span>THE</span>
              <span>BRAND</span>
              <i />
            </div>

            <div className="certificate-card-wrap">
              <div className="certificate-card">
                <div className="certificate-card__corner certificate-card__corner--tl" />
                <div className="certificate-card__corner certificate-card__corner--br" />

                <div className="certificate-card__eyebrow">
                  <span /> LEVEL COMPLETE <span />
                </div>

                <h2 className="certificate-card__title">
                  YOUR <b>CERTIFICATE</b>
                </h2>

                <div className="certificate-card__logo">
                  <img src="/logo.png" alt="Nebuloid Tech" draggable="false" />
                  <strong>NEBULOID TECH</strong>
                  <span>STUDIO</span>
                </div>

                <div className="certificate-card__main-title">CERTIFICATE</div>
                <div className="certificate-card__subtitle">
                  <span /> OF ACHIEVEMENT <span />
                </div>

                <p className="certificate-card__presented">This certificate is proudly presented to</p>
                <div className="certificate-card__player">{certificate.player || "Player"}</div>
                <p className="certificate-card__presented certificate-card__presented--lower">for successfully completing</p>

                <div className="certificate-card__game-name">
                  <span /> CATCH THE BRAND <span />
                </div>

                <div className="certificate-card__stats">
                  <div>
                    <span className="certificate-card__stat-icon">▥</span>
                    <small>LEVEL</small>
                    <strong>{certificate.level}</strong>
                  </div>
                  <div>
                    <span className="certificate-card__stat-icon">♜</span>
                    <small>SCORE</small>
                    <strong>{certificate.score}</strong>
                  </div>
                </div>

                <div className="certificate-card__footer">
                  <span /> KEEP PLAYING &nbsp; • &nbsp; KEEP ACHIEVING <span />
                </div>
              </div>

              <div className="certificate-actions">
                <button
                  type="button"
                  onClick={downloadCertificate}
                  className="certificate-action certificate-action--primary"
                >
                  <span>⇩</span> DOWNLOAD CERTIFICATE
                </button>
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="certificate-action certificate-action--secondary"
                >
                  {levelIndex === LEVELS.length - 1 ? "FINISH GAME →" : "NEXT LEVEL →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "finished" && (
          <div className="flex min-h-[90vh] items-center justify-center">
            <div className="max-w-2xl text-center">
              <div className="mb-6 text-8xl">🏆</div>
              <div className="text-sm font-black tracking-[0.3em] text-cyan-600">
                ALL LEVELS COMPLETE
              </div>
              <h1 className="mt-3 text-5xl font-black md:text-7xl">CHAMPION!</h1>

              <p className="mt-5 text-lg text-slate-500">
                Congratulations{" "}
                <span className="font-bold text-slate-900">{playerName}</span>.
                You completed all 10 levels of Catch the Brand.
              </p>

              <div className="mt-9 rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                <img
                  src="/logo.png"
                  alt="Nebuloid Tech"
                  className="mx-auto mb-4 h-12 object-contain"
                />
                <div className="text-sm text-slate-500">Achievement unlocked</div>
                <div className="mt-1 text-xl font-black">
                  BRAND CATCHING MASTER
                </div>
              </div>

              <button
                onClick={restartEverything}
                className="mt-8 rounded-2xl bg-cyan-300 px-10 py-4 font-black text-slate-950"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingKeyboard({
  value,
  setValue,
  position,
  setPosition,
  dragRef,
  onClose,
}) {
  const [dragging, setDragging] = useState(false);

  const keys = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
  ];

  const pressKey = (key) => {
    if (key === "BACKSPACE") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (key === "SPACE") {
      setValue((v) => (v.length < 26 ? `${v} ` : v));
      return;
    }
    if (value.length < 26) setValue((v) => `${v}${key}`);
  };

  const startDrag = (e) => {
    e.preventDefault();
    const point = e.touches?.[0] || e;
    const el = e.currentTarget.parentElement;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      dx: point.clientX - rect.left,
      dy: point.clientY - rect.top,
    };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const move = (e) => {
      const point = e.touches?.[0] || e;
      const width = 360;
      const height = 225;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);
      const dx = dragRef.current?.dx ?? 20;
      const dy = dragRef.current?.dy ?? 20;
      setPosition({
        x: Math.max(8, Math.min(maxX, point.clientX - dx)),
        y: Math.max(8, Math.min(maxY, point.clientY - dy)),
      });
    };

    const stop = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", stop);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", stop);
    };
  }, [dragging, dragRef, setPosition]);

  const style = position.x == null
    ? undefined
    : { left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" };

  return (
    <div className="floating-keyboard" style={style}>
      <div
        className="floating-keyboard__bar"
        onPointerDown={startDrag}
        onTouchStart={startDrag}
      >
        <span>⋮⋮ &nbsp; DRAG KEYBOARD</span>
        <button
          type="button"
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close keyboard"
        >
          ×
        </button>
      </div>

      <div className="floating-keyboard__keys">
        {keys.map((row, rowIndex) => (
          <div className="floating-keyboard__row" key={rowIndex}>
            {row.map((key) => (
              <button type="button" key={key} onClick={() => pressKey(key)}>
                {key}
              </button>
            ))}
          </div>
        ))}

        <div className="floating-keyboard__row floating-keyboard__row--bottom">
          <button type="button" className="wide" onClick={() => pressKey("BACKSPACE")}>⌫</button>
          <button type="button" className="space" onClick={() => pressKey("SPACE")}>SPACE</button>
          <button type="button" className="done" onClick={onClose}>DONE</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}
