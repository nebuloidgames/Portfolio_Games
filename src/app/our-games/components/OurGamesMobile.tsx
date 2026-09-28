"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";
import type { User } from "../../components/hero-data";
import { isUnlocked as checkUnlocked, type GameCard } from "../game-data";

interface OurGamesMobileProps {
  games: GameCard[];
  user: User | null;
}

/** Only a swipe starting in the outer 5% of the screen on either edge
 * changes the game — taps and scrolls anywhere else are left alone. */
const EDGE_PERCENT = 5;
const EDGE_SWIPE_THRESHOLD = 40;

const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/**
 * Lightweight mobile dashboard: ONE plain background image (no cross-fade
 * stack, no filters, no backdrop-blur), a native scroll-snap tile row, and
 * solid (non-blurred) info cards — everything the desktop version does more
 * heavily, done the cheap way here.
 */
const OurGamesMobile = ({ games, user }: OurGamesMobileProps) => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const N = games.length;
  const current = games[active];
  const unlocked = checkUnlocked(current, user);

  const select = (i: number) => {
    setActive(i);
    tileRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  /*
   * Edge swipe: starting a drag within the outer 5% of the screen width and
   * moving it past the threshold steps to the next/previous game — one step
   * per gesture. Everything else on the page (tiles, buttons, the tile row's
   * own scroll) is untouched since this never calls preventDefault.
   */
  const edgeDrag = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    active: false,
    fired: false,
  });

  const onEdgePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    const pct = (e.clientX / window.innerWidth) * 100;
    if (pct > EDGE_PERCENT && pct < 100 - EDGE_PERCENT) return;
    edgeDrag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      active: true,
      fired: false,
    };
  };

  const onEdgePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = edgeDrag.current;
    if (!d.active || d.fired || e.pointerId !== d.id) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) < EDGE_SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy))
      return;

    d.fired = true;
    select((active + (dx < 0 ? 1 : -1) + N) % N);
  };

  const onEdgePointerEnd = (e: ReactPointerEvent<HTMLElement>) => {
    if (edgeDrag.current.id === e.pointerId) edgeDrag.current.active = false;
  };

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <section
      className="ogm-page fixed inset-0 z-0 flex flex-col overflow-x-hidden overflow-y-auto"
      onPointerDown={onEdgePointerDown}
      onPointerMove={onEdgePointerMove}
      onPointerUp={onEdgePointerEnd}
      onPointerCancel={onEdgePointerEnd}
    >
      {/* ART ZONE */}
      <div className="ogm-art-zone">
        <Image
          key={current.slug}
          src={current.thumbnailUrl || "/hero-img.png"}
          alt=""
          fill
          sizes="100vw"
          quality={70}
          priority
          className="ogm-art-img"
        />
        <div className="ogm-art-fade" aria-hidden="true" />
        <div className="ogm-grain" aria-hidden="true" />

        {/* HEADER */}
        <header className="ogm-topbar">
          <div className="ogm-brand">
            <Link href="/" aria-label="Nebuloid home" className="ogm-logo">
              <Image
                src="/logo3.png"
                alt="Nebuloid Gaming Logo"
                width={140}
                height={140}
                priority
                className="h-[90px] w-auto object-contain sm:h-[110px]"
              />
            </Link>
            <span className="ogm-brand-name">Games</span>
          </div>
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="ogm-logout"
            >
              {loggingOut ? "…" : "Logout"}
            </button>
          ) : (
            <Link href="/login" className="ogm-logout">
              Login
            </Link>
          )}
        </header>

        {/* TILE ROW — native scroll-snap */}
        <div className="ogm-row" role="toolbar" aria-label="Games">
          {games.map((game, i) => {
            const isActive = i === active;
            return (
              <button
                key={game.slug}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                type="button"
                className="ogm-tile"
                aria-label={game.title}
                aria-pressed={isActive}
                onClick={() => select(i)}
                style={{
                  width: isActive ? 96 : 72,
                  height: isActive ? 96 : 72,
                  boxShadow: isActive
                    ? "0 0 0 3px #fff"
                    : "0 0 0 1px rgba(255,255,255,.18)",
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                <Image
                  src={game.thumbnailUrl || "/hero-img.png"}
                  alt=""
                  fill
                  sizes="96px"
                  quality={55}
                  loading="lazy"
                  className="ogm-tile-img"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="ogm-content">
        <div className="ogm-details">
          <span
            className="ogm-chip"
            style={{ background: rgba(current.color, 0.9) }}
          >
            {current.category}
          </span>
          <h1 className="ogm-title">{current.title}</h1>
          <p className="ogm-desc">{current.description}</p>
          <div className="ogm-actions">
            <a
              href={unlocked ? current.gameUrl : "/login"}
              target={unlocked ? "_blank" : undefined}
              rel={unlocked ? "noopener noreferrer" : undefined}
              className="ogm-play"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
              {unlocked ? "Play" : "Login to Play"}
            </a>
            <Link
              href={current.detailUrl}
              aria-label={`More about ${current.title}`}
              className="ogm-more"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .ogm-page {
          background: #04020e;
          color: #f1eeff;
          font-family: var(--font-exo), system-ui, sans-serif;
          -webkit-tap-highlight-color: transparent;
          /* on a very short screen, scroll rather than cut the Play button off */
          overscroll-behavior: contain;
        }

        /* ---------- art zone ---------- */
        .ogm-art-zone {
          position: relative;
          /* the artwork takes whatever height the details below don't need */
          flex: 1 1 auto;
          min-height: 300px;
          display: flex;
          flex-direction: column;
        }
        .ogm-art-img { object-fit: cover; }
        .ogm-art-fade {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(4,2,14,.6) 0%, rgba(4,2,14,.05) 30%, rgba(4,2,14,.5) 65%, #04020e 100%);
        }
        .ogm-grain {
          position: absolute; inset: 0; opacity: .3;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
          background-size: 64px 64px;
        }

        /* ---------- header ---------- */
        .ogm-topbar {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          /* tall enough to hold the full-size logo, in normal flow so the
           * tile row below never collides with it */
          min-height: 100px;
          padding: 10px 16px 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ogm-brand { display: flex; align-items: center; gap: 12px; }
        .ogm-logo { display: flex; align-items: center; text-decoration: none; }
        .ogm-brand-name { font-weight: 800; font-size: 17px; color: #fff; }
        .ogm-logout {
          display: flex; align-items: center; height: 40px; padding: 0 16px;
          border-radius: 999px; border: 0;
          background: linear-gradient(90deg, #7c4dff, #ff4fd8);
          color: #fff; text-decoration: none; font-weight: 800;
          font-size: 12px; letter-spacing: 1.5px; cursor: pointer;
          font-family: inherit;
        }
        .ogm-logo:focus-visible, .ogm-logout:focus-visible, .ogm-more:focus-visible {
          outline: 3px solid #fff; outline-offset: 3px;
        }

        /* ---------- tile row ---------- */
        .ogm-row {
          position: relative;
          z-index: 1;
          margin-top: auto;
          flex-shrink: 0;
          display: flex; align-items: center; gap: 10px;
          overflow-x: auto; overflow-y: hidden;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          /* top padding keeps the selected tile's white outline inside the
           * scroll box, which would otherwise clip it */
          padding: 6px 16px 14px;
          scroll-padding-inline: 16px;
        }
        .ogm-row::-webkit-scrollbar { display: none; }
        .ogm-tile {
          position: relative; flex-shrink: 0; scroll-snap-align: start;
          padding: 0; border: 0; border-radius: 14px; overflow: hidden;
          cursor: pointer; background: #120a2c;
        }
        .ogm-tile-img { object-fit: cover; }
        .ogm-tile:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

        /* ---------- content ---------- */
        .ogm-content {
          flex: 0 0 auto;
          display: flex; flex-direction: column;
          padding: 14px 16px calc(20px + env(safe-area-inset-bottom, 0px));
        }
        .ogm-details {
          display: flex; flex-direction: column; gap: 10px;
        }
        .ogm-chip {
          align-self: flex-start; padding: 4px 12px; border-radius: 999px;
          font-weight: 800; font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: #fff;
        }
        .ogm-title {
          margin: 0; font-family: var(--font-russo), sans-serif; font-weight: 400;
          font-size: clamp(1.7rem, 8vw, 2.4rem); line-height: 1.05; color: #fff;
        }
        .ogm-desc {
          margin: 0; font-weight: 500; font-size: 14px; line-height: 1.45;
          color: rgba(241,238,255,.88);
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ogm-actions { display: flex; gap: 10px; margin-top: 4px; }
        .ogm-play {
          flex-grow: 1; display: flex; align-items: center; justify-content: center;
          gap: 8px; height: 50px; border-radius: 999px;
          background: #fff; color: #0b0620; text-decoration: none;
          font-weight: 800; font-size: 15px;
        }
        .ogm-play:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .ogm-more {
          width: 50px; height: 50px; flex-shrink: 0; border-radius: 50%;
          background: rgba(255,255,255,.14); color: #fff;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
        }
      `}</style>
    </section>
  );
};

export default OurGamesMobile;
