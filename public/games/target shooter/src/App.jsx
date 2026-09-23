import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOTAL_LEVELS = 3;

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const LEVELS = [
  // Easy uses the original Level 1 gameplay settings.
  { name: "Easy", subtitle: "Classic precision", time: 25, target: "bullseye", size: 84, need: 8, points: 10, spawn: 1250, accent: "red" },

  // Medium — challenging, but with a comfortable target size and reaction window.
  { name: "Medium", subtitle: "No time to hesitate", time: 30, target: "speed", size: 70, need: 16, points: 22, spawn: 1050, accent: "amber" },

  // Hard — faster than Medium, but still large enough to aim at consistently.
  { name: "Hard", subtitle: "The final test", time: 40, target: "master", size: 60, need: 25, points: 40, spawn: 850, accent: "red" }
];

function pos() {
  return { x: 7 + Math.random() * 86, y: 8 + Math.random() * 82 };
}

function makeTarget(level) {
  const p = pos();
  return { id: makeId(), ...p, size: level.size };
}

function BrandLogo({ compact = false }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <div className={`${compact ? "h-10 w-10 text-lg" : "h-11 w-11 text-xl"} flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 shadow-sm`}>
        <img src="/nebuloid-tech-logo.png" alt="Nebuloid Tech" className="h-8 w-8 object-contain" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900">Nebuloid Tech</div>
        {!compact && <div className="text-lg font-black tracking-tight text-slate-950">Target Shooter</div>}
      </div>
    </div>
  );
}

function Header({ levelIndex, onSettings }) {
  return (
    <header className="relative z-20 mx-auto mb-6 flex w-full max-w-6xl items-center justify-between px-1 sm:px-2">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-[23px] shadow-sm">
          🎯
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-red-600">
            Nebuloid Tech
          </div>
          <div className="text-lg font-black tracking-tight text-slate-950">
            Target Shooter
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {levelIndex !== undefined && (
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm">
            Level {levelIndex + 1} / {TOTAL_LEVELS}
          </div>
        )}

        {onSettings && (
          <button
            type="button"
            onClick={onSettings}
            aria-label="Open settings"
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            ⚙
          </button>
        )}
      </div>
    </header>
  );
}

function Target({ target, level, onHit }) {
  const common = {
    left: `${target.x}%`,
    top: `${target.y}%`,
    width: `${level.size}px`,
    height: `${level.size}px`,
    transform: "translate(-50%, -50%)"
  };

  const targetColor =
    level.name === "Easy"
      ? {
          outer: "border-emerald-300",
          ring: "border-emerald-200",
          inner: "border-emerald-300",
          center: "bg-emerald-400",
          glow: "rgba(16,185,129,.55)"
        }
      : level.name === "Medium"
        ? {
            outer: "border-amber-300",
            ring: "border-amber-200",
            inner: "border-amber-300",
            center: "bg-amber-400",
            glow: "rgba(245,158,11,.55)"
          }
        : {
            outer: "border-red-300",
            ring: "border-red-200",
            inner: "border-red-300",
            center: "bg-red-500",
            glow: "rgba(239,68,68,.55)"
          };

  return (
    <button
      type="button"
      aria-label="Shoot target"
      onClick={(e) => {
        e.stopPropagation();
        onHit(target.id);
      }}
      className={`${level.target === "moving" ? "target-pulse" : ""} target-pop absolute rounded-full border-[3px] bg-slate-950/90 p-[5px]`}
      style={{
        ...common,
        boxShadow: `0 0 0 4px rgba(2,8,23,.85), 0 0 22px ${targetColor.glow}`
      }}
    >
      <span className={`flex h-full w-full items-center justify-center rounded-full border-[5px] ${targetColor.outer} bg-white`}>
        <span className="flex h-[76%] w-[76%] items-center justify-center rounded-full border-[5px] border-slate-950 bg-slate-900">
          <span className={`flex h-[62%] w-[62%] items-center justify-center rounded-full border-[5px] ${targetColor.ring} bg-white`}>
            <span className={`flex h-[58%] w-[58%] items-center justify-center rounded-full border-[4px] border-slate-950 bg-slate-900`}>
              <span className={`h-[42%] w-[42%] rounded-full ${targetColor.center} shadow-[0_0_14px_currentColor]`} />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
function Stat({ label, value, danger }) {
  return <div className="min-w-[88px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-center shadow-sm">
    <div className="text-[9px] font-black uppercase tracking-[.18em] text-slate-400">{label}</div>
    <div className={`mt-1 text-lg font-black ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</div>
  </div>;
}

function SettingsPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-950">Game Settings</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl font-bold hover:bg-slate-50">×</button>
        </div>
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Controls</div>
            <div className="mt-2 font-bold text-slate-700">Click the target to shoot.</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Challenge</div>
            <div className="mt-2 font-bold text-slate-700">3 difficulties · 3 certificates</div>
          </div>
        </div>
        <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-800">Done</button>
      </div>
    </div>
  );
}

function Certificate({ name, levelIndex, score, accuracy, certificateId, onNext, onBack, onSettings, final }) {
  const level = LEVELS[levelIndex] || LEVELS[0];

  const downloadCertificate = () => {
    const printWindow = window.open("", "_blank", "width=1280,height=900");
    if (!printWindow) return;

    const safeName = escapeHtml(name || "Player");
    const safeLevel = escapeHtml(level.name);
    const safeSubtitle = escapeHtml(level.subtitle);
    const safeScore = escapeHtml(String(score || 0));
    const safeAccuracy = escapeHtml(String(accuracy || 0));

    printWindow.document.write(`<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Target Shooter Certificate - ${safeName}</title>
<style>
@page{size:A4 landscape;margin:0}
*{box-sizing:border-box}
html,body{width:100%;height:100%;margin:0}
body{
  background:#020c17;
  color:#fff;
  font-family:Arial,Helvetica,sans-serif;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
.certificate{
  position:relative;
  width:100vw;
  height:100vh;
  min-height:720px;
  padding:26px;
  overflow:hidden;
  background:
    radial-gradient(circle at 50% 8%,rgba(0,205,255,.20),transparent 34%),
    radial-gradient(circle at 50% 85%,rgba(0,105,180,.14),transparent 45%),
    linear-gradient(180deg,#061e34 0%,#031323 52%,#020a12 100%);
}
.grid{
  position:absolute;inset:0;opacity:.18;pointer-events:none;
  background-image:
    linear-gradient(90deg,rgba(37,185,255,.18) 1px,transparent 1px),
    linear-gradient(rgba(37,185,255,.07) 1px,transparent 1px);
  background-size:8.33% 100%,100% 72px;
}
.outer{
  position:relative;width:100%;height:100%;
  padding:10px;border:3px solid #13c8ff;
  box-shadow:0 0 32px rgba(0,190,255,.28),inset 0 0 45px rgba(0,120,190,.10);
}
.inner{
  position:relative;width:100%;height:100%;
  padding:42px 68px;
  overflow:hidden;text-align:center;
  border:1px solid rgba(19,200,255,.65);
  background:rgba(4,22,37,.88);
}
.corner{position:absolute;width:78px;height:78px;border-color:#67e8f9;border-style:solid}
.tl{left:-1px;top:-1px;border-width:7px 0 0 7px}.tr{right:-1px;top:-1px;border-width:7px 7px 0 0}
.bl{left:-1px;bottom:-1px;border-width:0 0 7px 7px}.br{right:-1px;bottom:-1px;border-width:0 7px 7px 0}
.red{position:absolute;width:36px;height:36px;border-color:#ef4444;border-style:solid}
.rtl{left:-1px;top:-1px;border-width:6px 0 0 6px}.rtr{right:-1px;top:-1px;border-width:6px 6px 0 0}
.rbl{left:-1px;bottom:-1px;border-width:0 0 6px 6px}.rbr{right:-1px;bottom:-1px;border-width:0 6px 6px 0}
.content{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
.brand{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.brand-logo{width:54px;height:54px;object-fit:contain}
.brand-name{text-align:left}
.brand-name strong{display:block;font-size:15px;letter-spacing:3px;text-transform:uppercase}
.brand-name span{display:block;margin-top:4px;font-size:8px;letter-spacing:3px;color:#7dd3fc;text-transform:uppercase}
.eyebrow{margin-top:4px;color:#22d3ee;font-size:12px;font-weight:900;letter-spacing:6px;text-transform:uppercase}
.title{margin:6px 0 0;font-size:58px;line-height:1;font-weight:950;letter-spacing:3px;text-transform:uppercase}
.title .accent{color:#22d3ee}
.sub{margin-top:8px;color:#b7d8e8;font-size:14px;letter-spacing:5px;text-transform:uppercase;font-weight:800}
.rule{display:flex;align-items:center;gap:12px;width:500px;max-width:70%;margin:14px auto 10px}
.rule i{height:2px;flex:1;background:#13c8ff}.rule b{color:#ef4444;font-size:18px}
.present{margin-top:4px;color:#a9d6eb;font-size:15px}
.player{margin-top:5px;color:#fff;font-size:44px;font-weight:950;letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 18px rgba(34,211,238,.28)}
.player-line{width:560px;max-width:75%;height:2px;margin-top:8px;background:linear-gradient(90deg,transparent,#22d3ee,transparent)}
.desc{margin-top:10px;color:#c2dbe8;font-size:14px}
.desc b{color:#22d3ee}
.stats{display:grid;grid-template-columns:repeat(3,1fr);width:760px;max-width:82%;margin-top:18px;border:1px solid rgba(19,200,255,.55);background:rgba(3,18,31,.86)}
.stat{padding:12px 20px;border-right:1px solid rgba(19,200,255,.35)}
.stat:last-child{border-right:0}
.value{font-size:26px;font-weight:950;color:#fff}
.label{margin-top:3px;color:#67e8f9;font-size:9px;font-weight:900;letter-spacing:3px;text-transform:uppercase}
.bottom{display:flex;justify-content:space-between;width:760px;max-width:82%;margin-top:16px;padding-top:10px;border-top:1px solid rgba(19,200,255,.30);color:#9fc5d8;font-size:11px;text-align:left}
.bottom b{color:#22d3ee}
.seal{
  position:absolute;right:38px;top:34px;width:94px;height:94px;
  border:3px solid #fbbf24;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle,#ffe59a 0%,#e7a927 58%,#8b5b09 100%);
  box-shadow:0 0 24px rgba(255,190,50,.30);
  transform:rotate(-5deg);
}
.seal-inner{width:72px;height:72px;border:2px solid #6b4305;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#08131c}
.target{font-size:30px;line-height:30px}
.seal-text{font-size:7px;font-weight:950;letter-spacing:1px}
@media print{
  .certificate{width:297mm;height:210mm;min-height:0;padding:8mm}
  .title{font-size:52px}
  .player{font-size:40px}
}
</style>
</head>
<body>
<div class="certificate">
  <div class="grid"></div>
  <div class="outer">
    <div class="inner">
      <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
      <div class="red rtl"></div><div class="red rtr"></div><div class="red rbl"></div><div class="red rbr"></div>

      <div class="seal">
        <div class="seal-inner"><div class="target">🎯</div><div class="seal-text">TARGET<br>MASTER</div></div>
      </div>

      <div class="content">
        <div class="brand">
          <img class="brand-logo" src="/nebuloid-tech-logo.png" alt="Nebuloid Tech">
          <div class="brand-name">
            <strong>NEBULOID TECH</strong>
            <span>IDEAS • WIRED TO REALITY</span>
          </div>
        </div>

        <div class="eyebrow">LEVEL COMPLETED</div>
        <div class="title">CERTIFICATE <span class="accent">OF ACHIEVEMENT</span></div>
        <div class="sub">Target Shooter • Precision • Speed • Accuracy</div>

        <div class="rule"><i></i><b>◆</b><i></i></div>

        <div class="present">This certificate is proudly presented to</div>
        <div class="player">${safeName}</div>
        <div class="player-line"></div>
        <div class="desc">for successfully completing <b>${safeLevel}</b> in the Target Shooter challenge.</div>

        <div class="stats">
          <div class="stat"><div class="value">${safeScore}</div><div class="label">Score</div></div>
          <div class="stat"><div class="value">${safeAccuracy}%</div><div class="label">Accuracy</div></div>
          <div class="stat"><div class="value">${safeLevel}</div><div class="label">Difficulty</div></div>
        </div>

        <div class="bottom">
          <div><b>ACHIEVEMENT</b> — ${safeSubtitle}</div>
          <div><b>ISSUED BY</b> — Nebuloid Tech</div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},250)}</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <section className="fixed inset-0 z-40 min-h-screen w-screen overflow-hidden bg-[#020c17] text-white">
      {/* Cinematic shooting-range background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(0,145,230,.32),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(0,88,150,.18),transparent_42%),linear-gradient(180deg,#061e34_0%,#031323_48%,#020a12_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.58))]" />
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(90deg,rgba(37,185,255,.12) 1px,transparent 1px),linear-gradient(rgba(37,185,255,.045) 1px,transparent 1px)", backgroundSize: "8.33% 100%,100% 78px" }} />

      {/* Neon corner frame */}
      <div className="pointer-events-none absolute inset-4 border border-cyan-400/10 sm:inset-6" />
      <div className="pointer-events-none absolute left-5 top-5 h-20 w-20 border-l-[4px] border-t-[4px] border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,.45)] sm:left-6 sm:top-6" />
      <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 border-r-[4px] border-t-[4px] border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,.45)] sm:right-6 sm:top-6" />
      <div className="pointer-events-none absolute bottom-5 left-5 h-20 w-20 border-b-[4px] border-l-[4px] border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,.45)] sm:bottom-6 sm:left-6" />
      <div className="pointer-events-none absolute bottom-5 right-5 h-20 w-20 border-b-[4px] border-r-[4px] border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,.45)] sm:bottom-6 sm:right-6" />

      {/* Side shooting-range targets */}
      <div className="pointer-events-none absolute left-0 top-[30%] hidden w-44 opacity-45 lg:block">
        <div className="mx-auto h-36 w-36 rounded-full border-[6px] border-sky-700/70 p-5"><div className="flex h-full w-full items-center justify-center rounded-full border-4 border-sky-800"><div className="h-9 w-9 rounded-full bg-sky-800" /></div></div>
        <div className="mt-2 text-center text-sm font-black uppercase leading-6 tracking-wider text-sky-300/70">AIM<br/>PRACTICE<br/>IMPROVE<br/>REPEAT</div>
        <div className="mx-auto mt-2 h-1 w-16 bg-red-500/80" />
      </div>
      <div className="pointer-events-none absolute right-0 top-[30%] hidden w-44 opacity-45 lg:block">
        <div className="mx-auto h-36 w-36 rounded-full border-[6px] border-sky-700/70 p-5"><div className="flex h-full w-full items-center justify-center rounded-full border-4 border-sky-800"><div className="h-9 w-9 rounded-full bg-sky-800" /></div></div>
        <div className="mt-2 text-center text-sm font-black uppercase leading-6 tracking-wider text-sky-300/70">SMALL MOVES<br/>BIG WINS</div>
        <div className="mx-auto mt-2 h-1 w-16 bg-red-500/80" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-7 py-5 sm:px-10 sm:py-7 lg:px-14">
        {/* Top bar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-cyan-400 bg-[#031b2d]/90 shadow-[0_0_24px_rgba(0,200,255,.22)]">
              <img src="/nebuloid-tech-logo.png" alt="Nebuloid Tech" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">Nebuloid Tech</div>
              <div className="text-2xl font-black tracking-tight text-white">Target Shooter</div>
            </div>
          </div>
          <button type="button" onClick={onSettings} aria-label="Open settings" className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-cyan-400 bg-[#031b2d]/90 text-2xl shadow-[0_0_24px_rgba(0,200,255,.18)] transition hover:bg-cyan-400/10 active:scale-95">⚙</button>
        </div>

        {/* Completed banner */}
        <div className="mt-2 flex justify-center">
          <div className="relative flex items-center gap-3 rounded-[20px] border-2 border-cyan-400 bg-[#03182a]/90 px-8 py-2 text-lg font-black uppercase tracking-[.12em] text-white shadow-[0_0_25px_rgba(0,200,255,.22)] sm:text-2xl">
            <span className="text-cyan-300">‹‹</span><span className="text-cyan-400">‹</span>
            <span>Level Completed</span>
            <span className="text-cyan-400">›</span><span className="text-cyan-300">››</span>
          </div>
        </div>

        {/* Certificate board */}
        <div className="relative mx-auto mt-3 h-[min(62vh,590px)] w-full max-w-[1120px] shrink-0 pb-0">
          <div className="absolute inset-0 rounded-[28px] border-[3px] border-cyan-400 bg-[#061b2d]/95 shadow-[0_0_38px_rgba(0,183,255,.24),inset_0_0_35px_rgba(0,110,180,.10)]" />
          <div className="relative m-[8px] flex h-[calc(100%-16px)] flex-col overflow-hidden rounded-[20px] border border-cyan-700/60 bg-[radial-gradient(circle_at_50%_5%,rgba(0,158,230,.18),transparent_36%),linear-gradient(135deg,#081f35,#061524_55%,#071d31)] px-5 py-5 sm:px-9 sm:py-6">
            {/* Corner accents */}
            <div className="pointer-events-none absolute left-0 top-0 h-12 w-28 border-l-[7px] border-t-[7px] border-cyan-300" />
            <div className="pointer-events-none absolute right-0 top-0 h-12 w-28 border-r-[7px] border-t-[7px] border-cyan-300" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-28 border-b-[7px] border-l-[7px] border-cyan-300" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-28 border-b-[7px] border-r-[7px] border-cyan-300" />
            <div className="pointer-events-none absolute left-0 top-0 h-9 w-9 border-l-[8px] border-t-[8px] border-red-500" />
            <div className="pointer-events-none absolute right-0 top-0 h-9 w-9 border-r-[8px] border-t-[8px] border-red-500" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 border-b-[8px] border-l-[8px] border-red-500" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-9 w-9 border-b-[8px] border-r-[8px] border-red-500" />

            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center text-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/60 bg-slate-950/60">
                  <img src="/nebuloid-tech-logo.png" alt="Nebuloid Tech" className="h-8 w-8 object-contain" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black uppercase tracking-[.18em] text-white">Nebuloid Tech</div>
                  <div className="text-[8px] font-bold uppercase tracking-[.25em] text-cyan-200/60">Play · Practice · Improve</div>
                </div>
              </div>

              <div className="mt-1 text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,.16)] sm:text-5xl">Certificate</div>
              <div className="mt-0 flex items-center gap-3 text-xs font-black uppercase tracking-[.5em] text-slate-300 sm:text-base"><span className="h-[2px] w-12 bg-red-500 sm:w-16" />Of Achievement<span className="h-[2px] w-12 bg-red-500 sm:w-16" /></div>

              {/* Medal */}
              <div className="pointer-events-none absolute right-1 top-1 hidden h-28 w-28 sm:block sm:h-32 sm:w-32">
                <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rotate-[-4deg] rounded-full border-4 border-yellow-200 bg-[radial-gradient(circle,#ffe59a_0%,#e7a927_65%,#a86c08_100%)] shadow-[0_0_20px_rgba(255,190,50,.38)]">
                  <div className="flex h-full flex-col items-center justify-center text-slate-950"><div className="text-3xl">🎯</div><div className="text-[9px] font-black leading-3">WELL<br/>DONE</div></div>
                </div>
                <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1"><div className="h-11 w-6 rotate-[12deg] bg-red-600" style={{ clipPath: "polygon(0 0,100% 0,72% 100%,35% 78%,0 100%)" }} /><div className="h-11 w-6 -rotate-[12deg] bg-red-500" style={{ clipPath: "polygon(0 0,100% 0,100% 100%,65% 78%,28% 100%)" }} /></div>
              </div>

              <div className="mt-3 text-sm text-cyan-100/75 sm:text-base">This certificate is proudly presented to</div>
              <div className="mt-1 text-4xl font-black uppercase tracking-tight text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,.28)] sm:text-5xl">{name || "Player"}</div>
              <div className="mt-1 flex w-full max-w-xl items-center justify-center gap-2"><span className="h-[1px] flex-1 bg-cyan-300/70" /><span className="text-red-500">⊙</span><span className="h-[1px] flex-1 bg-cyan-300/70" /></div>
              <p className="mt-3 max-w-3xl text-sm text-slate-200/90 sm:text-base">for successfully completing <b className="text-cyan-300">{level.name}</b> in the Target Shooter challenge.</p>

              <div className="mt-3 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[14px] border-2 border-cyan-400 bg-[#041a2d]/90 px-4 py-3 shadow-[inset_0_0_20px_rgba(0,130,200,.10)]">
                  <div className="flex items-center justify-center gap-3"><span className="text-3xl text-cyan-300">🏆</span><div className="text-left"><div className="text-2xl font-black text-white">{score || 0}</div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Score</div></div></div>
                </div>
                <div className="rounded-[14px] border-2 border-cyan-400 bg-[#041a2d]/90 px-4 py-3 shadow-[inset_0_0_20px_rgba(0,130,200,.10)]">
                  <div className="flex items-center justify-center gap-3"><span className="text-3xl text-red-500">🎯</span><div className="text-left"><div className="text-2xl font-black text-white">{accuracy || 0}%</div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Accuracy</div></div></div>
                </div>
                <div className="rounded-[14px] border-2 border-cyan-400 bg-[#041a2d]/90 px-4 py-3 shadow-[inset_0_0_20px_rgba(0,130,200,.10)]">
                  <div className="flex items-center justify-center gap-3"><span className="text-3xl text-emerald-300">▥</span><div className="text-left"><div className="text-2xl font-black text-white">{level.name}</div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Difficulty</div></div></div>
                </div>
              </div>

              <div className="mt-3 flex w-full max-w-3xl flex-col justify-between gap-2 border-t border-cyan-800/80 pt-3 text-left text-xs sm:flex-row sm:text-sm">
                <div><span className="font-black text-cyan-300">Achievement:</span> <span className="text-slate-300">{level.subtitle}</span></div>
                <div><span className="font-black text-cyan-300">Issued by:</span> <span className="text-slate-300">Nebuloid Tech</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mx-auto grid w-full max-w-[1120px] shrink-0 grid-cols-1 gap-3 pb-1 sm:grid-cols-3">
          <button type="button" onClick={onBack} className="h-14 rounded-2xl border-2 border-cyan-400 bg-[#031a2c]/90 px-6 text-base font-black text-white shadow-[0_0_16px_rgba(0,200,255,.12)] transition hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,200,255,.24)]">← Back</button>
          <button type="button" onClick={onNext} className="h-14 rounded-2xl border-2 border-red-400 bg-red-600 px-6 text-base font-black text-white shadow-[0_0_24px_rgba(239,68,68,.38)] transition hover:bg-red-500 hover:shadow-[0_0_32px_rgba(239,68,68,.5)]">{final ? "Finish & View Result" : `Start ${LEVELS[levelIndex + 1]?.name || ""} →`}</button>
          <button type="button" onClick={downloadCertificate} className="h-14 rounded-2xl border-2 border-cyan-400 bg-[#031a2c]/90 px-6 text-base font-black text-white shadow-[0_0_16px_rgba(0,200,255,.12)] transition hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,200,255,.24)]">↓ Download Certificate</button>
        </div>
      </div>
    </section>
  );
}


function FloatingKeyboard({ value, onChange, onEnter, onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

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
    else onChange((value + key).slice(0, 24));
  };

  const startDrag = (e) => {
    if (e.target.closest("button")) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: position.x,
      baseY: position.y
    };
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", stopDrag);
  };

  const moveDrag = (e) => {
    if (!dragRef.current) return;
    setPosition({
      x: dragRef.current.baseX + e.clientX - dragRef.current.startX,
      y: dragRef.current.baseY + e.clientY - dragRef.current.startY
    });
  };

  const stopDrag = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", stopDrag);
  };

  return (
    <div
      className="relative left-auto top-auto z-[9999] mt-5 w-full max-w-[650px] rounded-2xl border border-slate-600 bg-[#101722]/98 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,.55)] backdrop-blur-xl"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div
        onPointerDown={startDrag}
        className="flex h-7 items-center justify-between px-1 pb-1 text-[9px] font-black tracking-[.16em] text-slate-400"
      >
        <span>ON-SCREEN KEYBOARD</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
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
        <button type="button" onClick={() => press("BACKSPACE")} className="h-9 flex-[1.2] rounded-md border border-slate-600 bg-[#1a2531] text-xs font-extrabold text-white shadow-[0_2px_0_#060a0f]">⌫</button>
        <button type="button" onClick={() => press("SPACE")} className="h-9 flex-[2] rounded-md border border-slate-600 bg-[#1a2531] text-[11px] font-extrabold text-white shadow-[0_2px_0_#060a0f]">SPACE</button>
        <button type="button" onClick={() => press("ENTER")} className="h-9 flex-[1.4] rounded-md border border-cyan-400 bg-cyan-600 text-[11px] font-extrabold text-white shadow-[0_2px_0_#075985]">ENTER ↵</button>
      </div>
    </div>
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


export default function App() {
  const [screen, setScreen] = useState("start");
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [name, setName] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [pendingLevelIndex, setPendingLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [levelHits, setLevelHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [levelMisses, setLevelMisses] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25);
  const [combo, setCombo] = useState(0);
  const [target, setTarget] = useState(() => makeTarget(LEVELS[0]));
  const [best, setBest] = useState(0);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [certificateId, setCertificateId] = useState("");
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const noticeRef = useRef(null);

  const level = LEVELS[levelIndex];
  const accuracy = useMemo(() => {
    const total = levelHits + levelMisses;
    return total ? Math.round((levelHits / total) * 100) : 0;
  }, [levelHits, levelMisses]);

  const showNotice = useCallback((text) => {
    setNotice(text);
    clearTimeout(noticeRef.current);
    noticeRef.current = setTimeout(() => setNotice(""), 450);
  }, []);

  const startLevel = useCallback((idx, resetAll = false) => {
    const cfg = LEVELS[idx];
    if (resetAll) {
      setScore(0); setHits(0); setMisses(0); setBest(0);
    }
    setLevelIndex(idx);
    setCertificateId("");
    setLevelScore(0);
    setLevelHits(0);
    setLevelMisses(0);
    setLives(5);
    setCombo(0);
    setTimeLeft(cfg.time);
    setTarget(makeTarget(cfg));
    setNotice("");
    setScreen("game");
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(spawnRef.current); setCertificateId(`${Date.now().toString(36)}-${makeId().slice(0, 8)}`); setScreen("certificate"); return 0; }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => setTarget(makeTarget(level)), level.spawn);
    return () => { clearInterval(timerRef.current); clearInterval(spawnRef.current); };
  }, [screen, level]);

  useEffect(() => {
    if (screen === "game" && lives <= 0) {
      clearInterval(timerRef.current); clearInterval(spawnRef.current);
      setCertificateId(`${Date.now().toString(36)}-${makeId().slice(0, 8)}`);
      setScreen("certificate");
    }
  }, [lives, screen]);

  const hitTarget = (id) => {
    if (id !== target.id || screen !== "game") return;
    const newCombo = combo + 1;
    const pts = level.points + Math.min(30, Math.max(0, newCombo - 1) * 2);
    setScore(s => s + pts);
    setLevelScore(s => s + pts);
    setHits(h => h + 1);
    setLevelHits(h => {
      const next = h + 1;
      if (next >= level.need) {
        clearInterval(timerRef.current); clearInterval(spawnRef.current);
        setCertificateId(`${Date.now().toString(36)}-${makeId().slice(0, 8)}`);
        setTimeout(() => setScreen("certificate"), 180);
      }
      return next;
    });
    setCombo(newCombo);
    showNotice(`+${pts} HIT`);
    setTarget(makeTarget(level));
  };

  const missShot = () => {
    if (screen !== "game") return;
    setMisses(m => m + 1);
    setLevelMisses(m => m + 1);
    setLives(l => Math.max(0, l - 1));
    setCombo(0);
    showNotice("MISS");
  };

  const nextFromCertificate = () => {
    if (levelIndex >= TOTAL_LEVELS - 1) setScreen("final");
    else startLevel(levelIndex + 1);
  };

  const openNameScreen = (idx = 0) => {
    // A new game must always start with a blank name field.
    setName("");
    setKeyboardOpen(false);
    setPendingLevelIndex(idx);
    setScreen("name");
  };

  const openLevels = () => {
    setScreen("levels");
  };

  const beginSelectedLevel = () => {
    const playerName = name.trim();
    if (!playerName) {
      setScreen("name");
      return;
    }
    setName(playerName.slice(0, 24));
    setScreen("levels");
  };

  const selectLevel = (idx) => {
    if (name.trim()) {
      startLevel(idx, idx === 0);
    } else {
      setPendingLevelIndex(idx);
      setScreen("name");
    }
  };

  const exitGame = () => {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    try {
      window.close();
    } catch {}
    setScreen("exit");
  };

  const finalAccuracy = hits + misses ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-4 py-6 text-slate-950 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-10 -top-10 h-72 w-72 rotate-45 opacity-90">
        <div className="absolute left-0 top-20 h-[2px] w-72 bg-slate-950" />
        <div className="absolute left-0 top-28 h-[2px] w-56 bg-slate-950" />
        <div className="absolute left-0 top-36 h-[2px] w-40 bg-slate-950" />
        <div className="absolute left-20 top-0 h-72 w-[2px] bg-slate-950" />
      </div>
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 -rotate-45 opacity-90">
        <div className="absolute right-0 bottom-20 h-[2px] w-72 bg-slate-950" />
        <div className="absolute right-0 bottom-28 h-[2px] w-56 bg-slate-950" />
        <div className="absolute right-0 bottom-36 h-[2px] w-40 bg-slate-950" />
        <div className="absolute right-20 bottom-0 h-72 w-[2px] bg-slate-950" />
      </div>
      <div className="pointer-events-none absolute right-8 top-8 grid grid-cols-5 gap-3">
        {Array.from({ length: 25 }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-slate-950" />)}
      </div>
      <div className="pointer-events-none absolute bottom-8 left-8 grid grid-cols-5 gap-3">
        {Array.from({ length: 25 }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-slate-950" />)}
      </div>
      <div className="mx-auto max-w-6xl">
        {screen === "start" && (
          <section className="fixed inset-0 z-50 min-h-screen w-screen overflow-hidden bg-[#031522] text-white">

            {/* Deep navy background + subtle vertical panels */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(9,102,150,.30),transparent_34%),linear-gradient(180deg,#061c2b_0%,#031522_55%,#020c15_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,rgba(45,196,255,.12) 1px,transparent 1px),linear-gradient(rgba(45,196,255,.035) 1px,transparent 1px)",
                backgroundSize: "12.5% 100%, 100% 120px"
              }}
            />

            {/* Outer HUD frame */}
            <div className="pointer-events-none absolute inset-3 border border-cyan-400/10 sm:inset-5" />
            <div className="pointer-events-none absolute left-5 top-5 h-24 w-24 border-l-[4px] border-t-[4px] border-cyan-300 sm:left-6 sm:top-6" />
            <div className="pointer-events-none absolute right-5 top-5 h-24 w-24 border-r-[4px] border-t-[4px] border-cyan-300 sm:right-6 sm:top-6" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-24 w-24 border-b-[4px] border-l-[4px] border-cyan-300 sm:bottom-6 sm:left-6" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-24 w-24 border-b-[4px] border-r-[4px] border-cyan-300 sm:bottom-6 sm:right-6" />

            {/* Side chevrons */}
            <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 space-y-2 opacity-30 sm:block">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 w-12 -skew-x-[28deg] border-l-[5px] border-b-[5px] border-cyan-500" />
              ))}
            </div>
            <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 space-y-2 opacity-30 sm:block">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="ml-auto h-3 w-12 skew-x-[28deg] border-r-[5px] border-b-[5px] border-cyan-500" />
              ))}
            </div>

            {/* Target Shooter side HUD copy */}
            <div className="pointer-events-none absolute left-10 top-[42%] hidden w-[210px] text-left lg:block">
              <div className="text-[11px] font-black uppercase tracking-[.35em] text-cyan-400">AIM / REACT / HIT</div>
              <div className="mt-3 text-3xl font-black italic uppercase leading-[.9] text-white">
                LOCK<br/>ON<br/>TARGET
              </div>
              <div className="mt-4 text-xs font-bold uppercase leading-5 tracking-[.16em] text-cyan-100/55">
                TEST YOUR AIM<br/>
                SHARPEN YOUR REFLEX<br/>
                MASTER EVERY SHOT
              </div>
            </div>

            <div className="pointer-events-none absolute right-10 top-[42%] hidden w-[210px] text-right lg:block">
              <div className="text-[11px] font-black uppercase tracking-[.35em] text-cyan-400">PRECISION MODE</div>
              <div className="mt-3 text-3xl font-black italic uppercase leading-[.9] text-white">
                FIND<br/>THE<br/>BULLSEYE
              </div>
              <div className="mt-4 text-xs font-bold uppercase leading-5 tracking-[.16em] text-cyan-100/55">
                MOVE FAST<br/>
                AIM SMART<br/>
                SHOOT CLEAN
              </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pt-7 pb-8 text-center sm:px-10 sm:pt-6">

              {/* Brand */}
              <div className="flex flex-col items-center">
                <img
                  src="/nebuloid-tech-logo.png"
                  alt="Nebuloid Tech"
                  className="h-20 w-auto object-contain drop-shadow-[0_0_22px_rgba(80,210,255,.35)] sm:h-24"
                />
                <div className="mt-2 flex items-center gap-3">
                  <span className="h-px w-20 bg-slate-200/80" />
                  <span className="h-2 w-2 rotate-45 bg-slate-200" />
                  <span className="h-px w-20 bg-slate-200/80" />
                </div>
              </div>

              {/* Title */}
              <div className="mt-10 sm:mt-12">
                <div className="text-[18px] font-medium tracking-[0.52em] text-slate-200 sm:text-[21px]">
                  READY • AIM • FIRE
                </div>
                <h1 className="mt-2 whitespace-nowrap text-[46px] font-black italic leading-none tracking-[-0.045em] text-white drop-shadow-[0_0_18px_rgba(155,225,255,.38)] sm:text-[76px] lg:text-[88px]">
                  TARGET SHOOTER
                </h1>

                <div className="mt-4 text-[11px] font-black uppercase tracking-[.38em] text-cyan-200/65 sm:text-[12px]">
                  PRECISION • SPEED • ACCURACY
                </div>

                <div className="mx-auto mt-5 flex items-center justify-center gap-4">
                  <span className="h-[3px] w-36 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)] sm:w-48" />
                  <span className="h-3 w-3 rotate-45 bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)]" />
                  <span className="h-[3px] w-36 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)] sm:w-48" />
                </div>
              </div>

              {/* Start button */}
              <button
                type="button"
                onClick={() => openNameScreen(0)}
                className="group relative mt-12 flex h-[285px] w-[285px] items-center justify-center sm:mt-10 sm:h-[330px] sm:w-[330px]"
              >
                <span className="absolute inset-0 rounded-full border-[7px] border-cyan-400/20 shadow-[0_0_30px_rgba(0,200,255,.22)]" />
                <span className="absolute inset-2 rounded-full border-[3px] border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,.75)]" />
                <span className="absolute inset-0 rounded-full border-[13px] border-transparent border-l-cyan-400 border-b-cyan-400 rotate-[-35deg] transition-transform duration-700 group-hover:rotate-[25deg]" />
                <span className="absolute inset-7 rounded-full bg-[radial-gradient(circle,#07527a_0%,#06283d_38%,#031522_72%)] shadow-[inset_0_0_35px_rgba(0,200,255,.28),0_0_35px_rgba(0,180,255,.22)] transition-all duration-300 group-hover:shadow-[inset_0_0_45px_rgba(0,220,255,.42),0_0_55px_rgba(0,180,255,.42)]" />

                <span className="relative text-[52px] font-medium tracking-[0.03em] text-cyan-50 drop-shadow-[0_0_13px_rgba(103,232,249,.95)] sm:text-[58px]">
                  START
                </span>
              </button>

              <div className="mt-3 text-[10px] font-black uppercase tracking-[.32em] text-slate-400 sm:text-[11px]">
                HIT THE TARGET • BUILD YOUR SCORE • CLEAR EVERY LEVEL
              </div>

              {/* How To Play */}
              <button
                type="button"
                onClick={() => setShowHowToPlay(true)}
                className="mt-7 flex items-center gap-5 rounded-full border-2 border-cyan-400 bg-[#031522]/60 px-10 py-3 text-[18px] font-medium text-slate-100 shadow-[0_0_18px_rgba(0,200,255,.16)] transition hover:bg-cyan-400/10 hover:shadow-[0_0_28px_rgba(0,200,255,.28)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 text-xl font-bold">?</span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="font-black uppercase tracking-[.12em]">How To Play</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-200/70">AIM • CLICK • HIT</span>
                </span>
              </button>
            </div>
          </section>
        )}

        {showHowToPlay && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020b12]/80 px-5 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-[28px] border border-cyan-400/60 bg-[#061a27] p-7 text-left text-white shadow-[0_0_60px_rgba(0,210,255,.25)] sm:p-9">
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/50 text-2xl leading-none text-white hover:bg-cyan-400/15"
                aria-label="Close How To Play"
              >
                ×
              </button>

              <div className="text-[11px] font-black uppercase tracking-[.35em] text-cyan-400">TARGET SHOOTER</div>
              <h2 className="mt-2 text-3xl font-black italic uppercase sm:text-4xl">HOW TO PLAY</h2>
              <p className="mt-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-200/70">AIM • CLICK • HIT</p>

              <div className="mt-7 grid gap-4">
                <div className="flex gap-4 rounded-2xl border border-cyan-400/15 bg-white/[.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-[#031522]">1</div>
                  <div>
                    <div className="font-black uppercase tracking-[.08em]">Enter your name</div>
                    <div className="mt-1 text-sm leading-5 text-slate-300">Click START, enter your name, and begin the Target Shooter challenge.</div>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-cyan-400/15 bg-white/[.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-[#031522]">2</div>
                  <div>
                    <div className="font-black uppercase tracking-[.08em]">Find the target</div>
                    <div className="mt-1 text-sm leading-5 text-slate-300">A target will appear on the game area. Move your cursor and aim at it carefully.</div>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-cyan-400/15 bg-white/[.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-[#031522]">3</div>
                  <div>
                    <div className="font-black uppercase tracking-[.08em]">Click to shoot</div>
                    <div className="mt-1 text-sm leading-5 text-slate-300">Click the target as quickly and accurately as possible to score points.</div>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-cyan-400/15 bg-white/[.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-[#031522]">4</div>
                  <div>
                    <div className="font-black uppercase tracking-[.08em]">Clear every level</div>
                    <div className="mt-1 text-sm leading-5 text-slate-300">Hit the required number of targets before time runs out and improve your accuracy.</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-400/25 bg-cyan-400/5 px-5 py-4 text-center text-xs font-black uppercase tracking-[.18em] text-cyan-100">
                SPEED • PRECISION • ACCURACY
              </div>
            </div>
          </div>
        )}

        {screen === "name" && (
          <section className="fixed inset-0 z-50 min-h-screen w-screen overflow-hidden bg-[#031522] text-white">

            {/* Cinematic navy background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(7,92,137,.30),transparent_35%),linear-gradient(180deg,#061c2b_0%,#031522_55%,#020c15_100%)]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,rgba(45,196,255,.11) 1px,transparent 1px),linear-gradient(rgba(45,196,255,.035) 1px,transparent 1px)",
                backgroundSize: "12.5% 100%, 100% 120px"
              }}
            />

            {/* HUD frame */}
            <div className="pointer-events-none absolute inset-3 border border-cyan-400/10 sm:inset-5" />
            <div className="pointer-events-none absolute left-5 top-5 h-24 w-24 border-l-[4px] border-t-[4px] border-cyan-300 sm:left-6 sm:top-6" />
            <div className="pointer-events-none absolute right-5 top-5 h-24 w-24 border-r-[4px] border-t-[4px] border-cyan-300 sm:right-6 sm:top-6" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-24 w-24 border-b-[4px] border-l-[4px] border-cyan-300 sm:bottom-6 sm:left-6" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-24 w-24 border-b-[4px] border-r-[4px] border-cyan-300 sm:right-6 sm:bottom-6" />

            {/* Side HUD accents */}
            <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 space-y-2 opacity-25 sm:block">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 w-12 -skew-x-[28deg] border-l-[5px] border-b-[5px] border-cyan-500" />
              ))}
            </div>
            <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 space-y-2 opacity-25 sm:block">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="ml-auto h-3 w-12 skew-x-[28deg] border-r-[5px] border-b-[5px] border-cyan-500" />
              ))}
            </div>

            {/* Target Shooter side copy — matching the front page */}
            <div className="pointer-events-none absolute left-10 top-[42%] hidden w-[210px] text-left lg:block">
              <div className="text-[11px] font-black uppercase tracking-[.35em] text-cyan-400">AIM / REACT / HIT</div>
              <div className="mt-3 text-3xl font-black italic uppercase leading-[.9] text-white">
                LOCK<br/>ON<br/>TARGET
              </div>
              <div className="mt-4 text-xs font-bold uppercase leading-5 tracking-[.16em] text-cyan-100/55">
                TEST YOUR AIM<br/>
                SHARPEN YOUR REFLEX<br/>
                MASTER EVERY SHOT
              </div>
            </div>

            <div className="pointer-events-none absolute right-10 top-[42%] hidden w-[210px] text-right lg:block">
              <div className="text-[11px] font-black uppercase tracking-[.35em] text-cyan-400">PRECISION MODE</div>
              <div className="mt-3 text-3xl font-black italic uppercase leading-[.9] text-white">
                FIND<br/>THE<br/>BULLSEYE
              </div>
              <div className="mt-4 text-xs font-bold uppercase leading-5 tracking-[.16em] text-cyan-100/55">
                MOVE FAST<br/>
                AIM SMART<br/>
                SHOOT CLEAN
              </div>
            </div>

            <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pt-6 pb-8 text-center">

              {/* Brand */}
              <div className="flex flex-col items-center">
                <img
                  src="/nebuloid-tech-logo.png"
                  alt="Nebuloid Tech"
                  className="h-20 w-auto object-contain drop-shadow-[0_0_22px_rgba(80,210,255,.35)] sm:h-24"
                />
                <div className="mt-1 flex items-center gap-3">
                  <span className="h-px w-20 bg-slate-200/80" />
                  <span className="h-2 w-2 rotate-45 bg-slate-200" />
                  <span className="h-px w-20 bg-slate-200/80" />
                </div>
              </div>

              {/* Heading */}
              <div className="mt-8 sm:mt-9">
                <div className="text-[17px] font-medium tracking-[0.5em] text-slate-200 sm:text-[20px]">
                  READY • AIM • FIRE
                </div>
                <h1 className="mt-2 whitespace-nowrap text-[43px] font-black italic leading-none tracking-[-0.045em] text-white drop-shadow-[0_0_18px_rgba(155,225,255,.38)] sm:text-[70px] lg:text-[82px]">
                  TARGET SHOOTER
                </h1>

                <div className="mt-4 text-[11px] font-black uppercase tracking-[.38em] text-cyan-200/65 sm:text-[12px]">
                  PRECISION • SPEED • ACCURACY
                </div>

                <div className="mx-auto mt-4 flex items-center justify-center gap-4">
                  <span className="h-[3px] w-28 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)] sm:w-40" />
                  <span className="h-3 w-3 rotate-45 bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)]" />
                  <span className="h-[3px] w-28 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)] sm:w-40" />
                </div>
              </div>

              {/* Name form */}
              <div className="relative mt-8 w-full max-w-[650px] sm:mt-7">
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Enter Your Name
                </h2>
                <p className="mt-2 text-sm text-cyan-100/70 sm:text-base">
                  Your name will appear on every certificate you earn.
                </p>
                <div className="mt-3 text-[10px] font-black uppercase tracking-[.28em] text-slate-400 sm:text-[11px]">
                  HIT THE TARGET • BUILD YOUR SCORE • CLEAR EVERY LEVEL
                </div>

                <div className="mt-6">
                  <label htmlFor="player-name" className="sr-only">
                    Player name
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-cyan-300">
                      ♙
                    </span>
                    <input
                      id="player-name"
                      onFocus={() => setKeyboardOpen(true)}
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 24))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && name.trim()) { setKeyboardOpen(false); beginSelectedLevel(); }
                      }}
                      placeholder="Enter your name..."
                      className="h-[66px] w-full rounded-2xl border-2 border-cyan-400 bg-[#031522]/75 pl-14 pr-5 text-lg font-semibold text-white outline-none shadow-[0_0_22px_rgba(0,200,255,.18)] placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-[0_0_30px_rgba(0,220,255,.32)]"
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => { setKeyboardOpen(false); setScreen("start"); }}
                    className="h-[60px] rounded-2xl border-2 border-cyan-300/80 bg-[#031522]/65 px-7 text-lg font-black text-cyan-50 transition hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,200,255,.22)]"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={() => { setKeyboardOpen(false); beginSelectedLevel(); }}
                    disabled={!name.trim()}
                    className="h-[60px] rounded-2xl border-2 border-cyan-400 bg-cyan-500/10 px-7 text-lg font-black text-white shadow-[0_0_22px_rgba(0,200,255,.20)] transition hover:bg-cyan-400/20 hover:shadow-[0_0_32px_rgba(0,220,255,.35)] disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-800/40 disabled:text-slate-500 disabled:shadow-none"
                  >
                    Continue →
                  </button>
                </div>

                {/* Floating keyboard opens after the input is tapped and stays below the buttons */}
                {keyboardOpen && (
                  <div className="w-full">
                    <FloatingKeyboard
                      value={name}
                      onChange={setName}
                      onEnter={() => {
                        if (name.trim()) {
                          setKeyboardOpen(false);
                          beginSelectedLevel();
                        }
                      }}
                      onClose={() => setKeyboardOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {screen === "levels" && (
          <section className="fixed inset-0 z-50 min-h-screen w-screen overflow-hidden bg-[#021321] text-white">

            {/* Deep shooting-range background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,122,190,.28),transparent_38%),linear-gradient(180deg,#05233a_0%,#031827_48%,#020b13_100%)]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,rgba(58,198,255,.10) 1px,transparent 1px),linear-gradient(rgba(58,198,255,.035) 1px,transparent 1px)",
                backgroundSize: "8.33% 100%, 100% 90px"
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.42))]" />

            {/* Outer HUD frame */}
            <div className="pointer-events-none absolute inset-4 border border-cyan-400/10 sm:inset-6" />
            <div className="pointer-events-none absolute left-5 top-5 h-20 w-20 border-l-[4px] border-t-[4px] border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.35)] sm:left-6 sm:top-6" />
            <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 border-r-[4px] border-t-[4px] border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.35)] sm:right-6 sm:top-6" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-20 w-20 border-b-[4px] border-l-[4px] border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.35)] sm:bottom-6 sm:left-6" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-20 w-20 border-b-[4px] border-r-[4px] border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.35)] sm:right-6 sm:bottom-6" />

            {/* Side targets for the shooting-range feel */}
            <div className="pointer-events-none absolute left-5 top-[38%] hidden h-48 w-32 opacity-55 lg:block">
              <div className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-cyan-200/50" />
              <div className="absolute left-1/2 top-10 h-36 w-28 -translate-x-1/2 rounded-[45%] border-4 border-slate-500/80 bg-slate-800/80" />
              <div className="absolute left-1/2 top-14 h-28 w-20 -translate-x-1/2 rounded-[45%] border-4 border-slate-950" />
              <div className="absolute left-1/2 top-20 h-16 w-12 -translate-x-1/2 rounded-full border-4 border-cyan-500/80" />
              <div className="absolute left-1/2 top-[92px] h-7 w-7 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,.65)]" />
            </div>
            <div className="pointer-events-none absolute right-5 top-[38%] hidden h-48 w-32 opacity-55 lg:block">
              <div className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-cyan-200/50" />
              <div className="absolute left-1/2 top-10 h-36 w-28 -translate-x-1/2 rounded-[45%] border-4 border-slate-500/80 bg-slate-800/80" />
              <div className="absolute left-1/2 top-14 h-28 w-20 -translate-x-1/2 rounded-[45%] border-4 border-slate-950" />
              <div className="absolute left-1/2 top-20 h-16 w-12 -translate-x-1/2 rounded-full border-4 border-cyan-500/80" />
              <div className="absolute left-1/2 top-[92px] h-7 w-7 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,.65)]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-7 py-7 sm:px-10 sm:py-8 lg:px-14">

              {/* Top navigation */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-cyan-400 bg-[#031b2d]/90 shadow-[0_0_24px_rgba(0,200,255,.22)]">
                    <img
                      src="/nebuloid-tech-logo.png"
                      alt="Nebuloid Tech"
                      className="h-11 w-11 object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-200">
                      Nebuloid Tech
                    </div>
                    <div className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                      Target Shooter
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  aria-label="Open settings"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-cyan-400 bg-[#031b2d]/90 text-2xl text-white shadow-[0_0_20px_rgba(0,200,255,.20)] transition hover:bg-cyan-400/10 hover:shadow-[0_0_28px_rgba(0,220,255,.35)] active:scale-95"
                >
                  ⚙
                </button>
              </div>

              {/* Heading */}
              <div className="mt-9 text-center sm:mt-10">
                <div className="flex items-center justify-center gap-5 text-[13px] font-medium uppercase tracking-[0.48em] text-slate-300 sm:text-[16px]">
                  <span className="h-px w-20 bg-cyan-400/80" />
                  AIM <span className="text-cyan-400">•</span> SHOOT <span className="text-cyan-400">•</span> IMPROVE
                  <span className="h-px w-20 bg-cyan-400/80" />
                </div>

                <h1 className="mt-5 text-[42px] font-black italic leading-none tracking-[-0.045em] text-white drop-shadow-[0_0_20px_rgba(100,220,255,.35)] sm:text-[64px] lg:text-[76px]">
                  <span className="text-white">CHOOSE </span>
                  <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,.55)]">DIFFICULTY</span>
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-sm font-medium tracking-[0.18em] text-slate-300 sm:text-base">
                  Choose Easy, Medium or Hard and test your accuracy, speed and reaction time.
                </p>
              </div>

              {/* Difficulty cards */}
              <div className="mx-auto mt-8 grid w-full max-w-[1160px] grid-cols-1 gap-5 md:grid-cols-3 lg:mt-9 lg:gap-5">
                {LEVELS.map((item, idx) => {
                  const cardAccent =
                    idx === 0
                      ? {
                          ring: "border-emerald-400",
                          glow: "shadow-[0_0_30px_rgba(16,185,129,.15)]",
                          icon: "text-emerald-400",
                          button: "border-emerald-400 text-white hover:bg-emerald-400/10",
                          dot: "bg-emerald-400"
                        }
                      : idx === 1
                        ? {
                            ring: "border-amber-400",
                            glow: "shadow-[0_0_30px_rgba(245,158,11,.14)]",
                            icon: "text-amber-400",
                            button: "border-amber-400 text-white hover:bg-amber-400/10",
                            dot: "bg-amber-400"
                          }
                        : {
                            ring: "border-red-500",
                            glow: "shadow-[0_0_30px_rgba(239,68,68,.16)]",
                            icon: "text-red-500",
                            button: "border-red-500 text-white hover:bg-red-500/10",
                            dot: "bg-red-500"
                          };

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => selectLevel(idx)}
                      className={`group relative min-h-[385px] p-6 text-center transition duration-200 hover:-translate-y-1 active:scale-[0.99] ${cardAccent.icon}`}
                    >

                      {/* Target icon */}
                      <div className={`mx-auto mt-1 flex h-24 w-24 items-center justify-center rounded-full border-2 ${cardAccent.ring} shadow-[0_0_20px_currentColor]`}>
                        <div className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border-[6px] ${cardAccent.ring}`}>
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 ${cardAccent.ring}`}>
                            <div className={`h-5 w-5 rounded-full ${idx === 2 ? "bg-red-500" : "bg-current"} ${cardAccent.icon}`} />
                          </div>
                        </div>
                      </div>

                      <h2 className="mt-5 text-3xl font-black uppercase tracking-tight text-white">
                        {item.name}
                      </h2>
                      <p className="mt-2 text-base font-medium text-slate-300">
                        {item.subtitle}
                      </p>

                      <div className="mx-auto mt-5 grid max-w-[330px] grid-cols-3 border-y border-cyan-500/35 bg-transparent">
                        <div className="px-2 py-3">
                          <div className="text-2xl font-black text-white">{item.need}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Hits</div>
                        </div>
                        <div className="border-x border-cyan-500/20 px-2 py-3">
                          <div className="text-2xl font-black text-white">{item.time}s</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Time</div>
                        </div>
                        <div className="px-2 py-3">
                          <div className="text-2xl font-black text-white">{item.points}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Points</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-left">
                        <span className={`h-3 w-3 rounded-full ${cardAccent.dot} shadow-[0_0_10px_currentColor]`} />
                        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                          Certificate included
                        </span>
                      </div>

                      <div className={`mt-5 flex h-14 items-center justify-center rounded-2xl border-2 bg-[#031522]/70 text-lg font-black transition ${cardAccent.button}`}>
                        Start →
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Main menu */}
              <div className="mt-7 flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => setScreen("start")}
                  className="rounded-2xl border-2 border-slate-300 bg-[#031522]/70 px-10 py-3 text-lg font-semibold text-white shadow-[0_0_18px_rgba(150,210,240,.10)] transition hover:border-cyan-300 hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,200,255,.20)]"
                >
                  ← Main Menu
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === "exit" && (
          <>
            <Header />
            <section className="relative z-10 mx-auto mt-16 max-w-xl text-center sm:mt-24">
              <div className="rounded-[30px] border border-slate-200 bg-white px-7 py-12 shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:px-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-black text-white">×</div>
                <div className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-red-600">Game Exited</div>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">See you next time</h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  The game session has been closed. You can safely close this browser tab.
                </p>
                <button
                  type="button"
                  onClick={() => setScreen("start")}
                  className="mt-7 rounded-2xl bg-slate-950 px-8 py-4 font-black text-white shadow-lg transition hover:bg-slate-800"
                >
                  Return to Main Menu
                </button>
              </div>
            </section>
          </>
        )}

        {screen === "game" && (
          <section className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-[#03101f] text-white">

            {/* Futuristic blue shooting arena */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,129,255,.18),transparent_38%),linear-gradient(180deg,#061b36_0%,#04152a_52%,#020a15_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,rgba(20,154,255,.20) 1px,transparent 1px),linear-gradient(rgba(20,154,255,.12) 1px,transparent 1px)",
                backgroundSize: "10% 100%, 100% 86px"
              }}
            />

            {/* Neon corner architecture */}
            <div className="pointer-events-none absolute left-0 top-0 h-[18%] w-[18%] border-r-[5px] border-b-[5px] border-cyan-500/50 [clip-path:polygon(0_0,100%_0,100%_34%,35%_34%,35%_100%,0_100%)]" />
            <div className="pointer-events-none absolute right-0 top-0 h-[18%] w-[18%] border-l-[5px] border-b-[5px] border-cyan-500/50 [clip-path:polygon(0_0,100%_0,100%_100%,65%_100%,65%_34%,0_34%)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[18%] w-[18%] border-r-[5px] border-t-[5px] border-cyan-500/50 [clip-path:polygon(0_0,35%_0,35%_66%,100%_66%,100%_100%,0_100%)]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-[18%] w-[18%] border-l-[5px] border-t-[5px] border-cyan-500/50 [clip-path:polygon(65%_0,100%_0,100%_100%,0_100%,0_66%,65%_66%)]" />

            {/* Side reticles */}
            <div className="pointer-events-none absolute left-[-2%] top-[42%] hidden h-36 w-36 rounded-full border-4 border-cyan-500/20 lg:block">
              <div className="absolute left-1/2 top-[-20px] h-48 w-1 -translate-x-1/2 bg-cyan-500/20" />
              <div className="absolute left-[-20px] top-1/2 h-1 w-48 -translate-y-1/2 bg-cyan-500/20" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15" />
            </div>
            <div className="pointer-events-none absolute right-[-2%] top-[44%] hidden h-36 w-36 rounded-full border-4 border-cyan-500/20 lg:block">
              <div className="absolute left-1/2 top-[-20px] h-48 w-1 -translate-x-1/2 bg-cyan-500/20" />
              <div className="absolute left-[-20px] top-1/2 h-1 w-48 -translate-y-1/2 bg-cyan-500/20" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15" />
            </div>

            {/* Side slogans */}
            <div className="pointer-events-none absolute left-[3%] top-[27%] hidden font-black uppercase leading-tight text-cyan-400/35 lg:block">
              <div className="text-2xl">AIM</div><div className="text-2xl">PRACTICE</div><div className="text-2xl">IMPROVE</div>
              <div className="mt-4 h-2 w-20 skew-x-[-18deg] bg-cyan-500/70" />
            </div>
            <div className="pointer-events-none absolute right-[3%] top-[30%] hidden text-right font-black uppercase leading-tight text-cyan-400/35 lg:block">
              <div className="text-2xl">SMALL MOVES</div><div className="text-2xl">BIG WINS</div>
              <div className="mt-4 ml-auto h-2 w-20 skew-x-[-18deg] bg-cyan-500/70" />
            </div>

            {/* Header */}
            <div className="relative z-40 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7 lg:px-[14%]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/80 bg-[#061426] text-3xl shadow-[0_0_24px_rgba(0,174,255,.22)]">🎯</div>
                  <div>
                    <div className="text-xs font-black tracking-[.24em] text-cyan-400">NEBULOID TECH</div>
                    <div className="mt-1 text-xl font-black sm:text-2xl">Target Shooter</div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-sm font-black tracking-[.2em] text-cyan-400">LEVEL {levelIndex + 1}</div>
                  <div className="mt-1 text-3xl font-black leading-none sm:text-4xl">{level.name}</div>
                  <div className="mt-1 text-sm text-slate-300">{level.subtitle} · Hit {level.need} targets</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="rounded-full border-2 border-cyan-500/70 bg-[#061426]/90 px-7 py-3 text-lg font-black shadow-[0_0_25px_rgba(0,174,255,.14)]">
                  Level {levelIndex + 1} / {TOTAL_LEVELS}
                </div>
                <button type="button" onClick={() => setSettingsOpen(true)} aria-label="Settings"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-cyan-500/80 bg-[#061426]/95 text-3xl shadow-[0_0_22px_rgba(0,174,255,.15)] transition hover:bg-[#0a213c] active:scale-95">
                  ⚙
                </button>
              </div>
            </div>

            {/* HUD */}
            <div className="relative z-40 mx-auto mt-[-78px] grid w-[min(720px,92vw)] grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ["SCORE", score, "◉"],
                ["HITS", `${hits} / ${level.need}`, "⌾"],
                ["COMBO", `x${combo || 0}`, "ϟ"],
                ["TIME", `${Math.max(0, timeLeft)}s`, "◷"],
                ["LIVES", `${lives}`, "♥"]
              ].map(([label, value, icon], i) => (
                <div key={label} className="rounded-2xl border-2 border-cyan-600/60 bg-[#06172a]/95 px-3 py-3 shadow-[0_0_24px_rgba(0,125,255,.12)]">
                  <div className="flex items-center justify-center gap-2 text-cyan-300">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-[11px] font-black tracking-[.16em]">{label}</span>
                  </div>
                  <div className={`mt-1 text-center text-2xl font-black ${i === 4 ? "text-red-400" : "text-white"}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* Main shooting field */}
            <div
              className="absolute left-[13.5%] right-[13.5%] top-[23%] bottom-[17%] z-20 overflow-hidden rounded-[30px] border-2 border-cyan-400/90 bg-[#031a30]/80 shadow-[0_0_0_7px_rgba(0,87,155,.22),0_0_55px_rgba(0,153,255,.28),inset_0_0_55px_rgba(0,125,255,.12)]"
              onClick={missShot}
            >
              <span className="pointer-events-none absolute left-0 top-0 h-12 w-12 rounded-tl-[28px] border-l-4 border-t-4 border-cyan-300" />
              <span className="pointer-events-none absolute right-0 top-0 h-12 w-12 rounded-tr-[28px] border-r-4 border-t-4 border-cyan-300" />
              <span className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 rounded-bl-[28px] border-b-4 border-l-4 border-cyan-300" />
              <span className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 rounded-br-[28px] border-b-4 border-r-4 border-cyan-300" />

              <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full border-2 border-cyan-500 bg-[#03152a]/95 px-7 py-2 text-xs font-black tracking-[.14em] text-cyan-300 sm:text-sm">
                {level.name.toUpperCase()} · CLICK TARGET
              </div>

              {target && <Target target={target} level={level} onHit={hitTarget} />}

              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border-2 border-cyan-500/70 bg-[#03172b]/95 px-6 py-2 text-sm font-black">
                <span className="text-red-400">{hits}</span> / {level.need} targets
              </div>

              {/* HIT / MISS feedback — preserves the original game concept */}
              {notice && (
                <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                  <div className={`rounded-2xl border-2 px-10 py-4 text-4xl font-black uppercase tracking-[.12em] shadow-[0_0_45px_rgba(0,0,0,.45)] animate-pulse ${
                    notice.includes("MISS")
                      ? "border-red-500 bg-red-950/85 text-red-400 shadow-[0_0_45px_rgba(239,68,68,.35)]"
                      : "border-cyan-400 bg-cyan-950/85 text-cyan-300 shadow-[0_0_45px_rgba(34,211,238,.35)]"
                  }`}>
                    {notice}
                  </div>
                </div>
              )}
            </div>

            {/* Floor */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[17%] bg-[linear-gradient(180deg,rgba(0,108,180,.10),rgba(1,8,16,.96))]" />
            <div className="pointer-events-none absolute bottom-[5%] left-1/2 h-20 w-[48%] -translate-x-1/2 skew-x-[-18deg] border-x-8 border-cyan-500/25 bg-cyan-500/[.03]" />

            {/* Instruction */}
            <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border-2 border-cyan-500/70 bg-[#06182b]/95 px-7 py-3 shadow-[0_0_28px_rgba(0,153,255,.16)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cyan-400 text-xl text-cyan-300">◉</span>
              <span className="whitespace-nowrap text-sm font-black sm:text-base">Hit the target on screen to get points</span>
            </div>
          </section>
        )}

{screen === "certificate" && (
          <Certificate name={name} levelIndex={levelIndex} score={levelScore} accuracy={accuracy} certificateId={certificateId}
            onNext={nextFromCertificate} onBack={() => setScreen("levels")} onSettings={() => setSettingsOpen(true)} final={levelIndex === TOTAL_LEVELS - 1} />
        )}

        {screen === "final" && (
          <section className="mx-auto max-w-3xl text-center">
            <Header />
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
              <div className="text-xs font-black uppercase tracking-[.35em] text-red-600">Challenge Complete</div>
              <h1 className="mt-3 text-5xl font-black">Master Shooter</h1>
              <p className="mt-3 text-slate-500">{name || "Player"} completed Easy, Medium and Hard.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <Stat label="Total Score" value={score} />
                <Stat label="Total Hits" value={hits} />
                <Stat label="Accuracy" value={`${finalAccuracy}%`} />
              </div>
              <div className="mt-8 rounded-2xl bg-slate-950 p-7 text-white">
                <div className="text-xs font-black uppercase tracking-[.25em] text-red-400">Nebuloid Tech</div>
                <div className="mt-2 text-2xl font-black">3 / 3 Difficulties Completed</div>
                <p className="mt-2 text-sm text-slate-400">Three difficulty certificates earned.</p>
              </div>
              <button type="button" onClick={() => { setName(""); setScreen("start"); }}
                className="mt-7 rounded-xl bg-red-600 px-8 py-4 font-black text-white hover:bg-red-500">
                Play Again
              </button>
            </div>
          </section>
        )}
      </div>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </main>
  );
}