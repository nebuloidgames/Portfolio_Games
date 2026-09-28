"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User } from "../../components/hero-data";
import { isUnlocked as checkUnlocked, type GameCard } from "../game-data";

interface OurGamesDesktopProps {
  games: GameCard[];
  user: User | null;
}

const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/**
 * PS5-style desktop dashboard: the selected game's screenshot fills the
 * screen (one layer per game, cross-faded via opacity), a tile row selects
 * the game, and its details + four info cards sit along the bottom. No
 * autoplay, arrows or dots — selection only changes from hover/focus/click
 * on a tile or the Left/Right arrow keys on the tile row.
 */
const OurGamesDesktop = ({ games, user }: OurGamesDesktopProps) => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Each side button only exists while there's more row to scroll that way:
  // no left button at the start, no right button at the end.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      setCanLeft(row.scrollLeft > 2);
      setCanRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 2);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    // a tile growing/shrinking changes the row's total width
    row.addEventListener("transitionend", update);
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      row.removeEventListener("transitionend", update);
      observer.disconnect();
    };
  }, []);

  const scrollRow = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * row.clientWidth * 0.7, behavior: "smooth" });
  };

  const N = games.length;
  const current = games[active];
  const unlocked = checkUnlocked(current, user);

  /** When the selection last changed — hover is ignored until the tile's
   * grow/shrink transition (0.3s) has settled. */
  const lastChange = useRef(0);

  const select = (i: number, scroll: boolean) => {
    if (i === active) return;
    lastChange.current = performance.now();
    setActive(i);
    // Only keyboard/click/focus scroll the row, and only as far as needed.
    // Hover never scrolls: moving the row under a still cursor would put a
    // different tile under it and select that one too, in a loop.
    if (scroll) {
      tileRefs.current[i]?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  };

  const onTileHover = (e: ReactPointerEvent<HTMLButtonElement>, i: number) => {
    if (e.pointerType !== "mouse") return;
    // Layout shifts fire synthetic moves with no movement — only a real
    // move of the mouse counts as hovering.
    if (e.movementX === 0 && e.movementY === 0) return;
    if (performance.now() - lastChange.current < 350) return;
    select(i, false);
  };

  const openGame = (game: GameCard) => {
    if (checkUnlocked(game, user)) {
      window.open(game.gameUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/login");
    }
  };

  const onRowKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (active + 1) % N;
      select(next, true);
      tileRefs.current[next]?.focus({ preventScroll: true });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (active - 1 + N) % N;
      select(prev, true);
      tileRefs.current[prev]?.focus({ preventScroll: true });
    } else if (e.key === "Enter") {
      e.preventDefault();
      openGame(current);
    }
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
    <section className="og-page fixed inset-0 z-0 overflow-x-hidden overflow-y-auto">
      {/* SELECTED GAME ARTWORK — full-screen cross-fade stack */}
      <div aria-hidden="true" className="og-bg-stack">
        {games.map((game, i) => (
          <div
            key={game.slug}
            className="og-bg"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={game.thumbnailUrl || "/hero-img.png"}
              alt=""
              fill
              sizes="100vw"
              quality={70}
              priority={i === active}
              loading={i === active ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="og-shade-l" />
        <div className="og-shade-b" />
        <div className="og-shade-t" />
        <div className="og-grain" />
      </div>

      <div className="og-frame">
        {/* TOP BAR */}
        <header className="og-topbar">
          <Link href="/" aria-label="Nebuloid home" className="og-logo">
            <Image
              src="/logo3.png"
              alt="Nebuloid Gaming Logo"
              width={140}
              height={140}
              priority
              className="h-[90px] w-auto object-contain sm:h-[110px]"
            />
          </Link>
          <nav className="og-tabs">
            <span aria-current="page" className="og-tab og-tab-active">
              Games
            </span>
          </nav>
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="og-logout"
            >
              {loggingOut ? "Logging out…" : "Logout"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ) : (
            <Link href="/login" className="og-logout">
              Login
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          )}
        </header>

        {/* TILE ROW */}
        <div className="og-row-wrap">
          {canLeft && (
            <button
              type="button"
              className="og-side og-side-l"
              aria-label="Scroll games left"
              onClick={() => scrollRow(-1)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          )}
          {canRight && (
            <button
              type="button"
              className="og-side og-side-r"
              aria-label="Scroll games right"
              onClick={() => scrollRow(1)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
          <div
            ref={rowRef}
            role="toolbar"
            aria-label="Games"
            className="og-tiles"
            data-fade-l={canLeft}
            data-fade-r={canRight}
            onKeyDown={onRowKeyDown}
          >
            {games.map((game, i) => {
              const isActive = i === active;
              return (
                <div key={game.slug} className="og-tile-group">
                  <button
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                    type="button"
                    className="og-tile"
                    aria-label={game.title}
                    aria-pressed={isActive}
                    onPointerMove={(e) => onTileHover(e, i)}
                    onFocus={() => select(i, true)}
                    onClick={() => select(i, true)}
                    style={
                      {
                        boxShadow: isActive
                          ? `0 0 0 3px #fff, 0 0 30px ${rgba(game.color, 0.7)}`
                          : "0 0 0 1px rgba(255,255,255,.18)",
                        opacity: isActive ? 1 : 0.8,
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      src={game.thumbnailUrl || "/hero-img.png"}
                      alt=""
                      fill
                      sizes="140px"
                      quality={60}
                      loading={Math.abs(i - active) <= 4 ? "eager" : "lazy"}
                      className="og-tile-img"
                    />
                  </button>
                  {isActive && (
                    <div className="og-tile-label">
                      <div className="og-tile-name">{game.title}</div>
                      <div className="og-tile-cat">{game.category}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILS */}
        <div className="og-details-row">
          <div className="og-details">
            <span
              className="og-chip"
              style={{ background: rgba(current.color, 0.9) }}
            >
              {current.category}
            </span>
            <h1 className="og-title">{current.title}</h1>
            <p className="og-desc">{current.description}</p>
            <div className="og-actions">
              <a
                href={unlocked ? current.gameUrl : "/login"}
                target={unlocked ? "_blank" : undefined}
                rel={unlocked ? "noopener noreferrer" : undefined}
                className="og-play"
              >
                <svg
                  width="18"
                  height="18"
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
                className="og-more"
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
      </div>

      <style>{`
        .og-page {
          background: #04020e;
          color: #f1eeff;
          font-family: var(--font-exo), system-ui, sans-serif;
          -webkit-tap-highlight-color: transparent;
          /* tile sizes — shrunk on short screens below */
          --tile: 96px;
          --tile-on: 140px;
          --row-pad: 14px;
        }

        /* ---------- background art ---------- */
        /* fixed, so it stays put if a short screen has to scroll the page */
        .og-bg-stack { position: fixed; inset: 0; pointer-events: none; }
        .og-bg {
          position: absolute; inset: 0;
          transition: opacity .5s ease;
        }
        .og-bg img { object-fit: cover; }
        .og-shade-l {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(4,2,14,.95) 0%, rgba(4,2,14,.7) 32%, rgba(4,2,14,.15) 62%, transparent 80%);
        }
        .og-shade-b {
          position: absolute; inset: 0;
          background: linear-gradient(0deg, #04020e 0%, rgba(4,2,14,.85) 22%, transparent 48%);
        }
        .og-shade-t {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(4,2,14,.8) 0%, transparent 26%);
        }
        .og-grain {
          position: absolute; inset: 0; opacity: .35;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
          background-size: 64px 64px;
        }

        /* ---------- frame ---------- */
        .og-frame {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          /* at least one screen tall; if a short screen can't fit everything
           * the page scrolls instead of cutting the Play button off */
          min-height: 100%;
          padding: clamp(16px, 2vh, 26px) clamp(24px, 4.5vw, 64px) clamp(20px, 3vh, 36px);
          box-sizing: border-box;
        }

        /* ---------- top bar ---------- */
        .og-topbar {
          display: flex; align-items: center; gap: clamp(20px, 3vw, 40px);
          flex-shrink: 0;
          /* tall enough to hold the full-size logo without it overflowing
           * into the tile row below */
          min-height: 110px;
        }
        .og-logo {
          display: flex; align-items: center; flex-shrink: 0;
          text-decoration: none;
        }
        .og-tabs { display: flex; gap: 30px; flex-grow: 1; }
        .og-tab {
          font-weight: 700; font-size: clamp(15px, 1.3vw, 20px);
          color: rgba(241,238,255,.6);
          padding-bottom: 4px; cursor: default;
        }
        .og-tab-active {
          font-weight: 800; color: #fff;
          border-bottom: 2px solid #fff;
        }
        .og-logout {
          display: flex; align-items: center; gap: 8px;
          height: 44px; padding: 0 22px; border-radius: 999px;
          background: linear-gradient(90deg, #7c4dff, #ff4fd8);
          color: #fff; text-decoration: none; border: 0;
          font-weight: 800; font-size: 14px; letter-spacing: 2px;
          cursor: pointer; flex-shrink: 0; font-family: inherit;
        }
        .og-logout:disabled { opacity: .7; cursor: default; }
        .og-logo:focus-visible, .og-logout:focus-visible, .og-more:focus-visible {
          outline: 3px solid #fff; outline-offset: 4px;
        }

        /* ---------- tile row ---------- */
        .og-row-wrap {
          position: relative;
          margin-top: clamp(20px, 3vh, 36px);
          flex-shrink: 0;
        }
        .og-tiles {
          display: flex; align-items: flex-start; gap: 14px;
          overflow-x: auto; overflow-y: hidden;
          scrollbar-width: none;
          /* A scroll box clips everything outside it, which was cutting the
           * top of the selected tile's white outline and glow. Pad the box
           * so they fit inside, and pull it back by the same amount so the
           * tiles don't move. */
          padding: var(--row-pad) 10px 16px;
          margin: calc(-1 * var(--row-pad)) -10px 0;
          /* keep a tile scrolled into view clear of the side arrows */
          scroll-padding-inline: 64px;
        }
        .og-tiles::-webkit-scrollbar { display: none; }
        /* fade only the side(s) that have more to scroll */
        .og-tiles[data-fade-r="true"] {
          -webkit-mask-image: linear-gradient(90deg, black 85%, transparent);
          mask-image: linear-gradient(90deg, black 85%, transparent);
        }
        .og-tiles[data-fade-l="true"] {
          -webkit-mask-image: linear-gradient(90deg, transparent, black 10%);
          mask-image: linear-gradient(90deg, transparent, black 10%);
        }
        .og-tiles[data-fade-l="true"][data-fade-r="true"] {
          -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 85%, transparent);
          mask-image: linear-gradient(90deg, transparent, black 10%, black 85%, transparent);
        }
        .og-side {
          position: absolute; z-index: 2;
          /* centred on the unselected tiles, which sit at the top of the row */
          top: calc(var(--tile) / 2); transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.4);
          background: rgba(4,2,14,.72); color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,.5);
          transition: background .2s, transform .2s;
        }
        .og-side:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .og-side-l { left: -8px; }
        .og-side-r { right: 0; }
        .og-tile-group { display: flex; align-items: flex-start; gap: 18px; flex-shrink: 0; }
        .og-tile {
          position: relative; flex-shrink: 0; padding: 0; border: 0;
          width: var(--tile); height: var(--tile);
          border-radius: 16px; overflow: hidden; cursor: pointer;
          background: #120a2c;
          transition: width .3s ease, height .3s ease, box-shadow .3s ease, opacity .3s;
        }
        .og-tile[aria-pressed="true"] { width: var(--tile-on); height: var(--tile-on); }
        .og-tile-img { object-fit: cover; }
        .og-tile:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }
        .og-tile-label { padding-top: 18px; width: 260px; }
        .og-tile-name {
          font-family: var(--font-russo), sans-serif; font-size: 22px;
          line-height: 1.15; color: #fff;
        }
        .og-tile-cat {
          margin-top: 6px; font-weight: 700; font-size: 13px;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(241,238,255,.7);
        }

        /* ---------- details ---------- */
        .og-details-row {
          flex: 1 1 auto; min-height: 0;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .og-details {
          display: flex; flex-direction: column; gap: 16px;
          max-width: 640px;
        }
        .og-chip {
          align-self: flex-start; padding: 5px 14px; border-radius: 999px;
          font-weight: 800; font-size: 12px; letter-spacing: 2px;
          text-transform: uppercase; color: #fff;
        }
        .og-title {
          margin: 0; font-family: var(--font-russo), sans-serif; font-weight: 400;
          /* scales with the screen's height too, so a short screen still fits */
          font-size: clamp(2rem, min(4.6vw, 8.5vh), 4.75rem); line-height: 1; color: #fff;
          text-shadow: 0 4px 30px rgba(0,0,0,.5);
        }
        .og-desc {
          margin: 0; font-weight: 500; font-size: clamp(0.95rem, 1.1vw, 1.25rem);
          line-height: 1.45; color: rgba(241,238,255,.88);
          max-width: 560px;
        }
        .og-actions { display: flex; align-items: center; gap: 14px; margin-top: 10px; }
        .og-play {
          display: flex; align-items: center; gap: 10px;
          height: 58px; padding: 0 clamp(26px, 3vw, 44px); border-radius: 999px;
          background: #fff; color: #0b0620; text-decoration: none;
          font-weight: 800; font-size: clamp(14px, 1.2vw, 18px); letter-spacing: 1px;
          transition: background .2s;
        }
        .og-play:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }
        .og-more {
          width: 58px; height: 58px; border-radius: 50%; border: 0;
          background: rgba(255,255,255,.12); color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .2s; text-decoration: none;
          flex-shrink: 0;
        }

        /* Hover styles only where there's a real pointer — on a touchscreen
         * they'd stay stuck on after a tap. */
        @media (hover: hover) and (pointer: fine) {
          .og-side:hover { background: rgba(124,77,255,.85); transform: translateY(-50%) scale(1.08); }
          .og-play:hover { background: #e9e4ff; }
          .og-more:hover { background: rgba(255,255,255,.2); }
        }

        /* ---------- short screens (landscape phones, small laptops) ---------- */
        @media (max-height: 700px) {
          .og-page { --tile: 76px; --tile-on: 108px; --row-pad: 12px; }
          .og-topbar { min-height: 80px; }
          .og-logo img { height: 72px !important; }
          .og-row-wrap { margin-top: 14px; }
          .og-tile-label { padding-top: 10px; }
          .og-tile-name { font-size: 18px; }
          .og-details { gap: 10px; }
          .og-play, .og-more { height: 50px; }
          .og-more { width: 50px; }
        }
        @media (max-height: 480px) {
          .og-page { --tile: 60px; --tile-on: 84px; --row-pad: 10px; }
          .og-topbar { min-height: 60px; }
          .og-logo img { height: 54px !important; }
          .og-row-wrap { margin-top: 8px; }
          .og-tile-label { padding-top: 4px; }
          .og-tile-name { font-size: 16px; }
          .og-tile-cat { font-size: 11px; margin-top: 2px; }
          .og-details { gap: 8px; }
          .og-actions { margin-top: 4px; }
          .og-play, .og-more { height: 44px; }
          .og-more { width: 44px; }
          .og-side { width: 40px; height: 40px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .og-bg, .og-tile { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default OurGamesDesktop;
