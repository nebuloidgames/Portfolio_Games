"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CYAN,
  isUnlocked as checkUnlocked,
  GAME_IMAGES,
  type GameItem,
  MAGENTA,
  pad,
  type User,
  VIOLET,
} from "./hero-data";

/* ---- Coverflow geometry (design pixels; the whole stage is scaled) ---- */
const STAGE_W = 1500;
const STAGE_H = 400;
const SPACING = 235;
const SIDE_GAP = 60;
const CASE_HALF_W = 120;
const AUTOPLAY_MS = 1800;
/** Horizontal drag needed to move the coverflow by one game. */
const SWIPE_STEP_PX = 60;
/** Per game jumped in one drag move, so a fast flick glides instead of scattering. */
const DRAG_STEP_MS = 260;
const DRAG_MS_MIN = 220;
const DRAG_MS_MAX = 900;
/** Hovering the coverflow speeds it up instead of pausing it. */
const HOVER_AUTOPLAY_MS = 800;
/** Cases are drawn 28.7% larger than the fitted stage (10%, then another 17%). */
const CARD_SIZE_BOOST = 1.1 * 1.17;
/** Visual height of a centred case (300px x 1.12), plus its glow. */
const CASE_VISUAL_H = 340;

interface Layout {
  /** How many boxes are visible on each side of the centre. */
  range: number;
  scale: number;
}

interface HeroDesktopProps {
  games: GameItem[];
  user: User | null;
  reducedMotion: boolean;
}

/**
 * The full 3D game-case coverflow. Desktop/pointer-fine only — Hero.tsx
 * dynamically imports this so its code and CSS never ship to phones, which
 * get the lighter HeroMobile stacked-card deck instead.
 */
const HeroDesktop = ({
  games: orderedGames,
  user,
  reducedMotion,
}: HeroDesktopProps) => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    active: false,
    moved: false,
  });
  const suppressClick = useRef(false);
  const [layout, setLayout] = useState<Layout>({ range: 3, scale: 1 });
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const N = orderedGames.length;

  /*
   * Fit the fixed-size coverflow stage into the row it is given, and show
   * fewer boxes on narrower screens (1 per side on phones, 2 on tablets).
   */
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const range = width < 640 ? 1 : width < 1024 ? 2 : 3;
      const halfWidth = range * SPACING + SIDE_GAP + CASE_HALF_W;
      const fitW = (width / (2 * halfWidth)) * 1.15;
      const fitH = height / STAGE_H;
      // Grow the boxes, but never taller than the row they live in, so they
      // can't ride up over the title or down over the controls.
      const boosted = Math.min(1, fitW, fitH) * CARD_SIZE_BOOST;
      const scale = Math.max(0.3, Math.min(boosted, height / CASE_VISUAL_H));

      setLayout((prev) =>
        prev.range === range && Math.abs(prev.scale - scale) < 0.005
          ? prev
          : { range, scale },
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (step: number) => {
      if (N === 0) return;
      setActive((current) => (current + step + N) % N);
    },
    [N],
  );

  /*
   * Swipe / drag (touch, pen and mouse). Dragging left brings the next game
   * in, right the previous one, one game per SWIPE_STEP_PX. A drag never
   * counts as a click, so it can't open a game by accident.
   */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      active: true,
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;

    if (!d.moved) {
      const totalX = Math.abs(e.clientX - d.startX);
      const totalY = Math.abs(e.clientY - d.startY);
      if (totalX < 10 || totalX < totalY) return; // not a horizontal drag yet
      d.moved = true;
      setDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // pointer already gone; the drag just ends
      }
    }

    const travelled = e.clientX - d.lastX;
    const steps = Math.trunc(travelled / SWIPE_STEP_PX);
    if (steps !== 0) {
      // A fast flick can jump several games at once — give it proportionally
      // more time to glide there instead of cramming a big jump into the
      // same short window (which is what made it look like it "scattered").
      const ms = Math.min(
        DRAG_MS_MAX,
        Math.max(DRAG_MS_MIN, Math.abs(steps) * DRAG_STEP_MS),
      );
      sceneRef.current?.style.setProperty("--nbh-drag-ms", `${ms}ms`);
      go(-steps);
      d.lastX += steps * SWIPE_STEP_PX;
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;
    d.active = false;
    if (d.moved) {
      d.moved = false;
      setDragging(false);
      suppressClick.current = true;
      // the click that follows a drag is swallowed; clear the flag either way
      setTimeout(() => {
        suppressClick.current = false;
      }, 60);
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  /*
   * Auto-advance every 3.8s; faster while a mouse is over the coverflow,
   * and paused while a keyboard user has focus inside it or a swipe is live.
   */
  useEffect(() => {
    if (focused || dragging || reducedMotion || N === 0) return;
    const timer = setInterval(
      () => go(1),
      hovered ? HOVER_AUTOPLAY_MS : AUTOPLAY_MS,
    );
    return () => clearInterval(timer);
  }, [hovered, focused, dragging, reducedMotion, N, go]);

  const unlockedFor = (game: GameItem) => checkUnlocked(game, user);

  const openGame = (game: GameItem) => {
    if (unlockedFor(game)) {
      window.open(game.gameUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/login");
    }
  };

  const activeGame = orderedGames[active];

  return (
    <section className="nbh-page fixed inset-0 z-0 grid w-full overflow-hidden">
      {/* TITLE */}
      <div className="nbh-title-wrap">
        <h1 className="nbh-title">
          <span className="nbh-title-main">NEBULOID</span>
          <span className="nbh-title-sub">GAMES</span>
        </h1>
        <p className="nbh-tagline">Play. Think. Challenge Yourself.</p>
      </div>

      {/* 3D GAME-CASE COVERFLOW */}
      <div
        ref={sceneRef}
        className="nbh-scene"
        data-hovered={hovered}
        data-dragging={dragging}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
      >
        <div
          className="nbh-stage"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `translate(-50%, -50%) translateY(${20 * layout.scale}px) scale(${layout.scale})`,
          }}
        >
          <div className="nbh-3d">
            {orderedGames.map((game, i) => {
              let d = i - active;
              if (d > N / 2) d -= N;
              if (d < -N / 2) d += N;
              const a = Math.abs(d);
              const isActive = a === 0;
              const hidden = a > layout.range;

              const x = d * SPACING + Math.sign(d) * SIDE_GAP;
              const rot = Math.max(-45, Math.min(45, -d * 30));
              const z = -a * 170;
              const scale = isActive ? 1.12 : 0.95;

              const style = {
                transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`,
                zIndex: 100 - a,
                opacity: hidden ? 0 : 1,
                pointerEvents: hidden ? "none" : "auto",
                visibility: hidden ? "hidden" : "visible",
              } as CSSProperties;

              const unlocked = unlockedFor(game);
              const image =
                GAME_IMAGES[game.slug] || game.thumbnailUrl || "/hero-img.png";

              const label = isActive
                ? unlocked
                  ? `Play ${game.title}`
                  : `Login to unlock ${game.title}`
                : `Show ${game.title}`;

              return (
                <button
                  key={game.slug}
                  type="button"
                  className="nbh-case"
                  style={style}
                  aria-label={label}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={hidden ? -1 : 0}
                  onClick={() => (isActive ? openGame(game) : setActive(i))}
                >
                  <span
                    className="nbh-shadow"
                    style={{
                      background: `radial-gradient(closest-side, ${
                        isActive ? "rgba(54,224,255,.5)" : "rgba(0,0,0,.5)"
                      }, transparent)`,
                    }}
                  />

                  {/* back */}
                  <span className="nbh-back" />
                  {/* left spine, with the game name */}
                  <span className="nbh-spine">
                    <span className="nbh-spine-name">{game.title}</span>
                  </span>
                  {/* edges */}
                  <span className="nbh-edge nbh-edge-r" />
                  <span className="nbh-edge nbh-edge-t" />
                  <span className="nbh-edge nbh-edge-b" />

                  {/* front */}
                  <span
                    className="nbh-face"
                    style={{
                      boxShadow: isActive
                        ? "0 0 0 1.5px rgba(255,255,255,.9), 0 0 30px rgba(255,79,216,.6), 0 30px 80px rgba(124,77,255,.5)"
                        : "0 0 0 1px rgba(255,255,255,.12), 0 20px 40px rgba(0,0,0,.6)",
                    }}
                  >
                    <span className="nbh-band">
                      <span className="nbh-band-nt">NT</span>
                      <span className="nbh-band-name">NEBULOID</span>
                    </span>
                    <span className="nbh-art">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 220px, 300px"
                        quality={75}
                        draggable={false}
                        loading={a <= layout.range + 1 ? "eager" : "lazy"}
                      />
                      <span className="nbh-num">{pad(i + 1)}</span>
                      {!unlocked && (
                        <span className="nbh-lock" aria-hidden="true">
                          🔒
                        </span>
                      )}
                      <span className="nbh-strip">
                        <span>{game.title}</span>
                      </span>
                    </span>
                    <span className="nbh-shine" />
                    <span
                      className="nbh-dim"
                      style={{ opacity: Math.min(0.6, a * 0.18) }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="nbh-controls">
        <div className="nbh-status">
          <div className="nbh-now" aria-live="polite">
            <span className="nbh-now-num">{pad(active + 1)}</span>
            <span className="nbh-now-name">{activeGame?.title}</span>
            <span className="nbh-now-total">/ {pad(N)}</span>
          </div>
          <div className="nbh-dots">
            {orderedGames.map((game, i) => (
              <button
                key={game.slug}
                type="button"
                className="nbh-dot"
                onClick={() => setActive(i)}
                aria-label={`Go to ${game.title}`}
                aria-current={i === active ? "true" : undefined}
              >
                <span
                  style={{
                    width: i === active ? 30 : 10,
                    background: i === active ? "#fff" : "rgba(236,232,255,.35)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COPY + CTA — sit on the planet edge */}
      <div className="nbh-copy">
        <Link href="/our-games" className="nbh-cta">
          EXPLORE NOW
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      {/* TICKER */}
      <div className="nbh-ticker" aria-hidden="true">
        <div className="nbh-ticker-track">
          {[0, 1].map((n) => (
            <div key={n} className="nbh-ticker-group">
              <span>A COLLECTION OF FAST, FUN, INTERACTIVE GAMES</span>
              <span className="nbh-star">✦</span>
              <span>TEST YOUR SKILLS. BEAT YOUR SCORE.</span>
              <span className="nbh-star">✦</span>
              <span>{N} GAMES · LOGIC · SPEED · MEMORY</span>
              <span className="nbh-star">✦</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .nbh-page {
          grid-template-rows: auto minmax(0, 1fr) auto auto auto;
          row-gap: clamp(0.25rem, 1.2vh, 0.9rem);
          /* clear the slim, transparent landing-page navbar */
          padding-top: 44px;
          font-family: var(--font-exo), system-ui, sans-serif;
          color: #ece8ff;
        }
        .nbh-page > *:not(.nbg) { position: relative; z-index: 1; }
        .nbh-page > .nbg { position: absolute; z-index: 0; }

        /* ---------- title ---------- */
        .nbh-title-wrap {
          position: relative;
          z-index: 3 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem 0;
          text-align: center;
          animation: nbhTitleIn .9s cubic-bezier(.2,.8,.2,1) both;
        }
        /* soft nebula aura pulsing behind the wordmark */
        .nbh-title-wrap::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(700px, 90vw);
          height: 220px;
          transform: translate(-50%, -50%);
          background: radial-gradient(closest-side, rgba(124,77,255,.45), rgba(255,79,216,.25) 45%, transparent 72%);
          filter: blur(30px);
          animation: nbhAuraPulse 4.5s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }
        .nbh-title {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.15rem, 0.8vh, 0.5rem);
          font-family: var(--font-orbitron), sans-serif;
        }
        .nbh-title-main {
          font-weight: 900;
          font-size: clamp(1.7rem, min(7.4vw, 9.5vh), 6.6rem);
          line-height: 1;
          letter-spacing: 0.06em;
          margin-right: -0.06em;
          /* chrome: bright top, lavender-to-violet belly, gently shimmering */
          background: linear-gradient(100deg, #a98bff 0%, #ffffff 22%, #ffffff 40%, #dccbff 58%, #ff9fe8 72%, #a98bff 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: nbhShimmer 6s linear infinite;
          filter:
            drop-shadow(0 0 22px rgba(255,79,216,.55))
            drop-shadow(0 0 60px rgba(124,77,255,.55))
            drop-shadow(0 3px 0 rgba(2,1,8,.7));
        }
        .nbh-title-sub {
          display: flex;
          align-items: center;
          gap: clamp(0.6rem, 2vw, 1.4rem);
          font-weight: 700;
          font-size: clamp(0.8rem, min(2.1vw, 3vh), 1.7rem);
          line-height: 1;
          letter-spacing: 0.7em;
          margin-right: -0.7em;
          color: #fff;
          text-shadow: 0 0 18px rgba(54,224,255,.7);
          animation: nbhSubGlow 3.2s ease-in-out infinite;
        }
        /* thin glowing rules either side of "GAMES" */
        .nbh-title-sub::before,
        .nbh-title-sub::after {
          content: "";
          width: clamp(28px, 6vw, 90px);
          height: 2px;
          border-radius: 2px;
        }
        .nbh-title-sub::before { background: linear-gradient(90deg, transparent, #36e0ff); }
        .nbh-title-sub::after { background: linear-gradient(90deg, #ff4fd8, transparent); margin-left: -0.7em; }
        .nbh-tagline {
          margin: clamp(0.3rem, 1.2vh, 0.7rem) 0 0;
          font-weight: 800;
          font-style: italic;
          font-size: clamp(0.8rem, min(1.6vw, 2.6vh), 1.25rem);
          letter-spacing: 0.15em;
          color: rgba(236,232,255,.85);
        }

        /* ---------- coverflow ---------- */
        .nbh-scene {
          position: relative;
          min-height: 0;
          width: 100%;
          overflow: visible;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
        .nbh-scene[data-dragging="true"],
        .nbh-scene[data-dragging="true"] .nbh-case { cursor: grabbing; }
        /*
         * The stage and the 3D container are invisible layout boxes. Left
         * hit-testable, the 3D container acts as a solid plane at depth 0 and
         * swallows every click meant for the side cases (which sit behind it),
         * so only the centre case could be tapped. Only the cases take pointer
         * events; empty space falls through to .nbh-scene for swiping.
         */
        .nbh-stage {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: center center;
          pointer-events: none;
        }
        .nbh-3d {
          position: absolute;
          inset: 0;
          perspective: 1800px;
          transform-style: preserve-3d;
          pointer-events: none;
        }
        .nbh-case {
          position: absolute;
          left: 50%;
          top: 30px;
          width: 240px;
          height: 300px;
          margin-left: -120px;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transform-style: preserve-3d;
          /* Autoplay never pauses between steps: the transition length
           * matches the autoplay interval exactly, so one step's slide
           * finishes just as the next begins — one continuous glide. */
          transition: transform 1.8s linear, opacity .5s, visibility .5s;
        }
        .nbh-case > span {
          position: absolute;
          display: block;
          /* Back, spine and edges only ever draw when actually facing us. */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        /* faster continuous glide while hovering (matches HOVER_AUTOPLAY_MS) */
        .nbh-scene[data-hovered="true"] .nbh-case {
          transition: transform .8s linear, opacity .3s, visibility .3s;
        }
        /*
         * Dragging is direct manipulation, not autoplay. --nbh-drag-ms is set
         * per-move from JS, scaled to how many games a flick just jumped, so
         * a big fast jump still reads as one smooth glide, not a scatter.
         */
        .nbh-scene[data-dragging="true"] .nbh-case {
          transition: transform var(--nbh-drag-ms, .45s) cubic-bezier(.2,.8,.2,1), opacity .3s, visibility .3s;
        }
        .nbh-case:focus-visible,
        .nbh-dot:focus-visible,
        .nbh-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 6px;
        }
        .nbh-case:focus-visible { outline-offset: 12px; }

        .nbh-shadow {
          left: 0; right: 0; bottom: -42px; height: 30px;
          border-radius: 50%;
          transform: translateZ(-30px);
        }
        .nbh-back {
          inset: 0; border-radius: 10px; background: #07041a;
          transform: rotateY(180deg) translateZ(8px);
        }
        .nbh-spine {
          top: 0; left: calc(50% - 8px); width: 16px; height: 300px;
          border-radius: 3px;
          background: linear-gradient(to bottom, ${VIOLET} 0 12%, #110a2c 12%);
          transform: rotateY(-90deg) translateZ(120px);
          display: flex; justify-content: center;
          padding-top: 44px; box-sizing: border-box;
        }
        .nbh-spine-name {
          writing-mode: vertical-rl;
          font-family: var(--font-russo), sans-serif;
          font-size: 9px; letter-spacing: 1.5px;
          color: #ece8ff; text-transform: uppercase; white-space: nowrap;
        }
        .nbh-edge-r {
          top: 0; left: calc(50% - 8px); width: 16px; height: 300px;
          background: #1d1446; transform: rotateY(90deg) translateZ(120px);
        }
        .nbh-edge-t {
          left: 0; top: calc(50% - 8px); width: 240px; height: 16px;
          background: #251a55; transform: rotateX(90deg) translateZ(150px);
        }
        .nbh-edge-b {
          left: 0; top: calc(50% - 8px); width: 240px; height: 16px;
          background: #150d38; transform: rotateX(-90deg) translateZ(150px);
        }
        .nbh-face {
          inset: 0; border-radius: 10px; background: #110a2c;
          padding: 7px; box-sizing: border-box;
          display: flex !important; flex-direction: column; overflow: hidden;
          transform: translateZ(8px);
          transition: box-shadow .5s;
        }
        .nbh-face > span { position: relative; }
        .nbh-band {
          height: 32px; flex-shrink: 0; border-radius: 5px 5px 0 0;
          background: linear-gradient(90deg, ${VIOLET}, ${MAGENTA});
          display: flex !important; align-items: center; justify-content: space-between;
          padding: 0 11px;
        }
        .nbh-band-nt { font-family: var(--font-russo), sans-serif; font-size: 15px; color: #fff; }
        .nbh-band-name { font-weight: 800; font-size: 10px; letter-spacing: 3px; color: #fff; }
        .nbh-art {
          flex-grow: 1; border-radius: 0 0 5px 5px; overflow: hidden;
          background: #07041a;
        }
        .nbh-art > span { position: absolute; }
        .nbh-art img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; user-select: none;
        }
        .nbh-num {
          left: 9px; top: 9px; padding: 2px 8px; border-radius: 999px;
          background: rgba(2,1,8,.6); border: 1px solid rgba(255,255,255,.18);
          font-weight: 800; font-size: 11px; color: #fff;
        }
        .nbh-lock {
          right: 9px; top: 8px; width: 26px; height: 26px; border-radius: 999px;
          background: rgba(2,1,8,.65); border: 1px solid rgba(255,255,255,.45);
          display: flex !important; align-items: center; justify-content: center;
          font-size: 13px; line-height: 1;
        }
        .nbh-strip {
          left: 0; right: 0; bottom: 0; height: 28px;
          background: rgba(2,1,8,.7);
          display: flex !important; align-items: center;
          padding: 0 10px; font-family: var(--font-russo), sans-serif; font-size: 11px;
          letter-spacing: 1.5px; color: #ece8ff; text-transform: uppercase;
        }
        .nbh-strip > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nbh-shine {
          position: absolute !important; inset: 0; border-radius: 10px;
          background: linear-gradient(115deg, rgba(255,255,255,.2) 0 14%, transparent 30%);
          pointer-events: none;
        }
        .nbh-dim {
          position: absolute !important; inset: 0; border-radius: 10px;
          background: #020108; transition: opacity .5s; pointer-events: none;
        }

        /* ---------- controls ---------- */
        .nbh-controls {
          display: flex; align-items: center; justify-content: center;
          gap: clamp(0.6rem, 2vw, 1.5rem); padding: 0 0.75rem;
        }
        /* Fixed width, so the layout never shifts when a game name is longer. */
        .nbh-status {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          flex: 0 0 auto;
          width: min(440px, calc(100vw - 150px));
        }
        .nbh-now {
          display: flex; align-items: baseline; justify-content: center; gap: 12px;
          width: 100%; min-width: 0;
        }
        .nbh-now-num { flex-shrink: 0; font-weight: 800; font-size: 14px; color: ${CYAN}; }
        .nbh-now-name {
          font-family: var(--font-russo), sans-serif; font-size: 24px; letter-spacing: 1px;
          text-transform: uppercase; color: #fff;
          min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          text-shadow: 0 0 16px rgba(255,79,216,.45);
        }
        .nbh-now-total { flex-shrink: 0; font-weight: 700; font-size: 14px; color: rgba(236,232,255,.6); white-space: nowrap; }
        .nbh-dots { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; }
        .nbh-dot {
          height: 20px; padding: 0 3px; border: 0; background: transparent;
          cursor: pointer; display: flex; align-items: center;
        }
        .nbh-dot > span {
          display: block; height: 6px; border-radius: 3px;
          transition: width .4s, background .4s;
        }

        /* ---------- copy + CTA ---------- */
        .nbh-copy {
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(0.4rem, 1.3vh, 1rem); padding: 0 1.25rem; text-align: center;
        }
        .nbh-copy p {
          margin: 0; max-width: min(1240px, 100%); font-weight: 500;
          font-size: clamp(0.8rem, min(1.35vw, 2.2vh), 1.15rem); line-height: 1.45;
          color: #f1edff;
          padding: 0.55rem 1.3rem;
          border-radius: 14px;
          background: rgba(2,1,8,.42);
          border: 1px solid rgba(255,255,255,.12);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
          text-shadow: 0 1px 8px rgba(2,1,8,.8);
        }
        .nbh-cta {
          display: flex; align-items: center; gap: 12px;
          height: clamp(46px, 7vh, 58px); padding: 0 clamp(1.5rem, 3vw, 2.5rem);
          border-radius: 999px;
          background: linear-gradient(90deg, ${VIOLET}, ${MAGENTA}); color: #fff; text-decoration: none;
          font-family: var(--font-orbitron), sans-serif; font-weight: 700;
          font-size: clamp(0.85rem, 1.2vw, 1.05rem);
          letter-spacing: 0.22em;
          box-shadow: 0 0 0 1px rgba(255,255,255,.35) inset, 0 10px 40px rgba(255,79,216,.55);
          text-shadow: 0 1px 2px rgba(0,0,0,.4);
          transition: transform .2s, filter .2s;
        }
        .nbh-cta:hover { transform: translateY(-2px); filter: brightness(1.1); color: #fff; }

        /* ---------- ticker ---------- */
        .nbh-ticker {
          height: 36px; overflow: hidden; margin-top: 0.4rem;
          background: rgba(2,1,8,.85); border-top: 1px solid rgba(255,255,255,.1);
          display: flex; align-items: center;
        }
        .nbh-ticker-track { display: flex; width: max-content; animation: nbhTicker 40s linear infinite; }
        .nbh-ticker-group {
          display: flex; gap: 40px; padding-right: 40px; white-space: nowrap;
          font-weight: 800; font-size: 12px; letter-spacing: 4px; color: rgba(236,232,255,.7);
        }
        .nbh-star { color: ${CYAN}; }

        /* very short screens only: give the boxes the room instead */
        @media (max-height: 560px) { .nbh-copy p { display: none; } }
        @media (max-width: 639px) {
          .nbh-now-total { display: none; }
          .nbh-now-name { font-size: 18px; }
        }

        @keyframes nbhTicker { to { transform: translateX(-50%); } }
        @keyframes nbhTitleIn {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nbhAuraPulse {
          0%, 100% { opacity: .6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes nbhShimmer {
          to { background-position: -220% center; }
        }
        @keyframes nbhSubGlow {
          0%, 100% { text-shadow: 0 0 18px rgba(54,224,255,.7); }
          50% { text-shadow: 0 0 28px rgba(54,224,255,1), 0 0 44px rgba(255,79,216,.5); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nbh-ticker-track { animation: none; }
          .nbh-case { transition: none; }
          .nbh-title-wrap, .nbh-title-wrap::before, .nbh-title-main, .nbh-title-sub {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroDesktop;
