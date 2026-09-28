"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface GameLoaderProps {
  /** When true the loader fades out, then removes itself. */
  done: boolean;
  label?: string;
}

const FADE_MS = 400;

/**
 * Full-screen, game-style loading screen. It covers the page until `done`,
 * so visitors never see a half-ready page (e.g. "Login to Play" flashing
 * before their login is confirmed). Animates only transform/opacity.
 */
export default function GameLoader({
  done,
  label = "Loading games",
}: GameLoaderProps) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), FADE_MS);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <output
      className="gl-root"
      data-done={done}
      aria-live="polite"
      aria-busy={!done}
    >
      <div className="gl-glow" aria-hidden="true" />

      <div className="gl-center">
        <div className="gl-logo">
          <Image
            src="/logo3.png"
            alt=""
            width={140}
            height={140}
            priority
            className="gl-logo-img"
          />
        </div>

        <div className="gl-word" aria-hidden="true">
          <span className="gl-word-main">NEBULOID</span>
          <span className="gl-word-sub">GAMES</span>
        </div>

        <div className="gl-bar" aria-hidden="true">
          <span className="gl-bar-fill" />
        </div>

        <p className="gl-label">
          {label}
          <span className="gl-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>

      <style>{`
        .gl-root {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center;
          background: #04020e;
          color: #f1eeff;
          font-family: var(--font-exo), system-ui, sans-serif;
          opacity: 1;
          transition: opacity ${FADE_MS}ms ease;
        }
        .gl-root[data-done="true"] { opacity: 0; pointer-events: none; }

        .gl-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(40% 35% at 50% 45%, rgba(124,77,255,.28), transparent),
            radial-gradient(30% 25% at 62% 58%, rgba(255,79,216,.16), transparent),
            radial-gradient(35% 30% at 38% 62%, rgba(54,224,255,.10), transparent);
        }

        .gl-center {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(14px, 2.4vh, 22px);
          padding: 0 24px; text-align: center;
        }

        .gl-logo {
          animation: glPulse 1.6s ease-in-out infinite;
        }
        .gl-logo-img {
          width: auto; height: clamp(72px, 14vh, 110px);
          object-fit: contain;
          filter: drop-shadow(0 0 18px rgba(255,79,216,.45));
        }

        .gl-word { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .gl-word-main {
          font-family: var(--font-orbitron), sans-serif; font-weight: 900;
          font-size: clamp(1.4rem, 4.5vw, 2.2rem); letter-spacing: .12em;
          margin-right: -.12em;
          background: linear-gradient(180deg, #ffffff 45%, #cbb8ff 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .gl-word-sub {
          font-family: var(--font-orbitron), sans-serif; font-weight: 700;
          font-size: clamp(.7rem, 1.8vw, .9rem); letter-spacing: .6em;
          margin-right: -.6em; color: #fff;
        }

        .gl-bar {
          position: relative; overflow: hidden;
          width: min(260px, 70vw); height: 6px; border-radius: 999px;
          background: rgba(255,255,255,.1);
          box-shadow: 0 0 0 1px rgba(255,255,255,.08) inset;
        }
        .gl-bar-fill {
          position: absolute; top: 0; bottom: 0; left: 0; width: 40%;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c4dff, #ff4fd8);
          box-shadow: 0 0 12px rgba(255,79,216,.6);
          animation: glSlide 1.1s cubic-bezier(.4,0,.2,1) infinite;
        }

        .gl-label {
          margin: 0; font-weight: 800; font-size: 12px;
          letter-spacing: .3em; text-transform: uppercase;
          color: rgba(241,238,255,.7);
          margin-right: -.3em;
        }
        .gl-dots span { animation: glDot 1.2s infinite; opacity: .2; }
        .gl-dots span:nth-child(2) { animation-delay: .2s; }
        .gl-dots span:nth-child(3) { animation-delay: .4s; }

        @keyframes glPulse {
          0%, 100% { transform: scale(1); opacity: .9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes glSlide {
          from { transform: translateX(-100%); }
          to { transform: translateX(250%); }
        }
        @keyframes glDot {
          0%, 100% { opacity: .2; }
          40% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gl-root { transition: none; }
          .gl-logo, .gl-bar-fill, .gl-dots span { animation: none; }
          .gl-dots span { opacity: 1; }
          .gl-bar-fill { width: 100%; }
        }
      `}</style>
    </output>
  );
}
