"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  isUnlocked as checkUnlocked,
  GAME_IMAGES,
  type GameItem,
  MAGENTA,
  pad,
  type User,
  VIOLET,
} from "./hero-data";

/** Card behind the front one, each step further back. */
const STEP_X = [0, 30, 52];
const STEP_SCALE = [1, 0.9, 0.82];
const STEP_OVERLAY = [0, 0.35, 0.6];
/** Swipe distance (px) that counts as "change card". */
const SWIPE_THRESHOLD = 40;
/** Auto-advance every 1.8s — matches the card transition, so it never pauses. */
const AUTOPLAY_MS = 1800;

interface HeroMobileProps {
  games: GameItem[];
  user: User | null;
  reducedMotion: boolean;
}

/**
 * Lightweight mobile hero: a stacked card deck (swipe, no 3D transforms, no
 * autoplay timer) instead of the desktop 3D coverflow. Only transform and
 * opacity animate, at most 5 cards are ever in the DOM, and every cover image
 * but the front one is lazy-loaded.
 */
const HeroMobile = ({
  games: orderedGames,
  user,
  reducedMotion,
}: HeroMobileProps) => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    active: false,
    fired: false,
  });
  const suppressClick = useRef(false);

  const N = orderedGames.length;

  const go = useCallback(
    (step: number) => {
      if (N === 0) return;
      setActive((current) => (current + step + N) % N);
    },
    [N],
  );

  /*
   * Auto-advance continuously (no dwell between steps — see the matching
   * transition duration below), paused while a finger is on the deck.
   */
  useEffect(() => {
    if (dragging || reducedMotion || N === 0) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [dragging, reducedMotion, N, go]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true);
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      active: true,
      fired: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id || d.fired) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

    d.fired = true;
    suppressClick.current = true;
    go(dx < 0 ? 1 : -1);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;
    d.active = false;
    setDragging(false);
    if (d.fired) {
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

  const unlockedFor = (game: GameItem) => checkUnlocked(game, user);

  const openGame = (game: GameItem) => {
    if (unlockedFor(game)) {
      window.open(game.gameUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/login");
    }
  };

  const cards = orderedGames
    .map((game, i) => {
      let d = i - active;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      return { game, i, d };
    })
    .filter((c) => Math.abs(c.d) <= 2)
    .sort((a, b) => a.d - b.d);

  return (
    <section className="nbm-page fixed inset-0 z-0 grid w-full overflow-hidden">
      {/* TITLE */}
      <div className="nbm-title-wrap">
        <h1 className="nbm-title">
          <span className="nbm-title-main">NEBULOID</span>
          <span className="nbm-title-sub">GAMES</span>
        </h1>
        <p className="nbm-tagline">Play. Think. Challenge Yourself.</p>
      </div>

      {/* STACKED CARD DECK */}
      <div
        className="nbm-deck"
        data-reduced-motion={reducedMotion}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {cards.map(({ game, i, d }) => {
          const abs = Math.abs(d);
          const dir = Math.sign(d);
          const isActive = d === 0;
          const unlocked = unlockedFor(game);
          const image =
            GAME_IMAGES[game.slug] || game.thumbnailUrl || "/hero-img.png";

          const style = {
            transform: `translateX(${dir * STEP_X[abs]}px) scale(${STEP_SCALE[abs]})`,
            zIndex: 10 - abs,
          } as CSSProperties;

          const label = isActive
            ? unlocked
              ? `Play ${game.title}`
              : `Login to unlock ${game.title}`
            : `Show ${game.title}`;

          return (
            <button
              key={game.slug}
              type="button"
              className="nbm-card"
              style={style}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => (isActive ? openGame(game) : setActive(i))}
            >
              <span className="nbm-cover">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="262px"
                  quality={75}
                  draggable={false}
                  loading={isActive ? "eager" : "lazy"}
                />
              </span>
              <span className="nbm-num">{pad(i + 1)}</span>
              {!unlocked && (
                <span className="nbm-lock" aria-hidden="true">
                  🔒
                </span>
              )}
              <span className="nbm-gradient">
                <span className="nbm-name">{game.title}</span>
                <span className="nbm-tap">Tap to play</span>
              </span>
              <span
                className="nbm-overlay"
                style={{ opacity: STEP_OVERLAY[abs] }}
              />
            </button>
          );
        })}
      </div>

      {/* DOTS */}
      <div className="nbm-dots">
        {orderedGames.map((game, i) => (
          <button
            key={game.slug}
            type="button"
            className="nbm-dot"
            onClick={() => setActive(i)}
            aria-label={`Go to ${game.title}`}
            aria-current={i === active ? "true" : undefined}
          >
            <span
              style={{
                width: i === active ? 22 : 7,
                background: i === active ? "#fff" : "rgba(236,232,255,.35)",
              }}
            />
          </button>
        ))}
      </div>

      {/* COPY + CTA */}
      <div className="nbm-copy">
        <Link href="/our-games" className="nbm-cta">
          EXPLORE NOW
          <svg
            width="18"
            height="18"
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

      <p className="nbm-footer">TEST YOUR SKILLS. BEAT YOUR SCORE.</p>

      <style>{`
        .nbm-page {
          grid-template-rows: auto minmax(0, 1fr) auto auto auto;
          row-gap: clamp(0.6rem, 2vh, 1.1rem);
          /*
           * The home navbar's logo is a fixed h-[90px] (h-[110px] from
           * 640px up) inside a 72px header, so it overflows below the bar
           * by up to 38px. Clear that worst case, not just the bar height.
           */
          padding-top: 120px;
          font-family: var(--font-exo), system-ui, sans-serif;
          color: #ece8ff;
        }

        /* ---------- title ---------- */
        .nbm-title-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem;
          text-align: center;
        }
        .nbm-title {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-family: var(--font-orbitron), sans-serif;
        }
        .nbm-title-main {
          font-weight: 900;
          font-size: clamp(2.2rem, 11vw, 3.2rem);
          line-height: 1;
          letter-spacing: 0.04em;
          background: linear-gradient(180deg, #ffffff 40%, #cbb8ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 24px rgba(255,79,216,.4);
        }
        .nbm-title-sub {
          font-weight: 700;
          font-size: clamp(0.7rem, 3.2vw, 0.95rem);
          letter-spacing: 0.5em;
          margin-right: -0.5em;
          color: #fff;
          text-shadow: 0 0 14px rgba(54,224,255,.6);
        }
        .nbm-tagline {
          margin: 0.4rem 0 0;
          font-weight: 800;
          font-style: italic;
          font-size: clamp(0.72rem, 3.4vw, 0.85rem);
          letter-spacing: 0.1em;
          color: rgba(236,232,255,.85);
        }

        /* ---------- card deck ---------- */
        .nbm-deck {
          position: relative;
          min-height: 0;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
        .nbm-card {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 210px;
          height: 272px;
          margin: -136px 0 0 -105px;
          padding: 0;
          border: 0;
          border-radius: 14px;
          background: #110a2c;
          box-shadow: 0 0 0 1px rgba(255,255,255,.15), 0 18px 40px rgba(0,0,0,.55);
          overflow: hidden;
          cursor: pointer;
          /* Autoplay never pauses between steps: this matches AUTOPLAY_MS
           * exactly, so one step finishes just as the next begins. */
          transition: transform 1.8s linear, opacity 1.8s linear;
        }
        /* a finger on the deck is direct manipulation — snap in quickly */
        .nbm-deck[data-dragging="true"] .nbm-card {
          transition: transform .3s ease, opacity .3s ease;
        }
        .nbm-deck[data-reduced-motion="true"] .nbm-card { transition: none; }
        .nbm-card:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 4px;
        }
        .nbm-cover { position: absolute; inset: 0; }
        .nbm-cover img { object-fit: cover; }
        .nbm-num {
          position: absolute; right: 10px; top: 10px;
          padding: 3px 9px; border-radius: 999px;
          background: rgba(2,1,8,.6); border: 1px solid rgba(255,255,255,.25);
          font-weight: 800; font-size: 12px; color: #fff;
        }
        .nbm-lock {
          position: absolute; left: 10px; top: 10px;
          width: 26px; height: 26px; border-radius: 999px;
          background: rgba(2,1,8,.65); border: 1px solid rgba(255,255,255,.45);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; line-height: 1;
        }
        .nbm-gradient {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 34px 14px 14px;
          background: linear-gradient(180deg, transparent, rgba(2,1,8,.92) 65%);
          display: flex; flex-direction: column; gap: 2px;
        }
        .nbm-name {
          font-family: var(--font-russo), sans-serif;
          font-size: 16px; line-height: 1.15;
          color: #fff; text-transform: uppercase;
        }
        .nbm-tap {
          font-weight: 700; font-size: 10px; letter-spacing: 2px;
          color: rgba(236,232,255,.7); text-transform: uppercase;
        }
        .nbm-overlay {
          position: absolute; inset: 0;
          background: #020108;
          pointer-events: none;
        }

        /* ---------- dots ---------- */
        .nbm-dots {
          display: flex; flex-wrap: wrap; justify-content: center; align-items: center;
          padding: 0 1.5rem;
        }
        .nbm-dot {
          height: 18px; padding: 0 2px; border: 0; background: transparent;
          cursor: pointer; display: flex; align-items: center;
        }
        .nbm-dot > span {
          display: block; height: 5px; border-radius: 3px;
          transition: width .3s, background .3s;
        }
        .nbm-deck[data-reduced-motion="true"] ~ .nbm-dots .nbm-dot > span { transition: none; }

        /* ---------- copy + CTA ---------- */
        .nbm-copy {
          display: flex; justify-content: center; padding: 0 1.5rem;
        }
        .nbm-cta {
          display: flex; align-items: center; gap: 10px;
          height: 50px; padding: 0 1.8rem;
          border-radius: 999px;
          background: linear-gradient(90deg, ${VIOLET}, ${MAGENTA}); color: #fff; text-decoration: none;
          font-family: var(--font-orbitron), sans-serif; font-weight: 700;
          font-size: 0.85rem; letter-spacing: 0.18em;
          box-shadow: 0 0 0 1px rgba(255,255,255,.3) inset, 0 8px 26px rgba(255,79,216,.5);
        }
        .nbm-cta:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }

        .nbm-footer {
          margin: 0 0 12px; text-align: center;
          font-weight: 800; font-size: 10px; letter-spacing: 3px;
          color: rgba(236,232,255,.5);
        }

        @media (prefers-reduced-motion: reduce) {
          .nbm-card, .nbm-dot > span { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default HeroMobile;
