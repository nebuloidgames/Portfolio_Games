"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Background from "./background";

interface GameItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  gameUrl: string;
}

interface User {
  id: string;
  fullName: string;
  username: string;
  role: string;
}

const GAME_ORDER = [
  "math-tug-of-war",
  "reaction-rush",
  "memory-match",
  "speed-typing-battle",
  "color-clash",
  "catch-the-brand",
  "emoji-puzzle",
  "logo-quiz",
  "2048-race",
  "bomb-defusal",
  "memory-sequence",
  "target-shooter",
  "number-puzzle",
  "water-color-sort",
  "flappy-bird",
  "math-minesweeper",
  "word-hunt",
  "stack-master",
];

const GAME_IMAGES: Record<string, string> = {
  "math-tug-of-war": "/tug%20of%20war.png",
  "reaction-rush": "/reaction%20rush.png",
  "memory-match": "/math%20memory%20match.png",
  "speed-typing-battle": "/speed%20typing%20battle.jpeg",
  "color-clash": "/color.png",
  "catch-the-brand": "/catch%20the%20brand.jpeg",
  "emoji-puzzle": "/emoji%20puzzle.png",
  "logo-quiz": "/logo%20quiz.png",
  "2048-race": "/2048%20race.jpeg",
  "bomb-defusal": "/bomb%20defusal.jpeg",
  "memory-sequence": "/memory%20sequence.png",
  "target-shooter": "/target%20shooter.jpeg",
  "number-puzzle": "/number%20puzzle.png",
  "water-color-sort": "/water%20color%20sort.jpeg",
  "flappy-bird": "/flappy%20bird.jpeg",
  "math-minesweeper": "/math%20minesweeper.png",
  "word-hunt": "/word%20hunt.png",
  "stack-master": "/stack%20master.jpeg",
};

const FALLBACK_GAMES: GameItem[] = GAME_ORDER.map((slug) => ({
  id: slug,
  title: slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  slug,
  description: null,
  thumbnailUrl: GAME_IMAGES[slug] || null,
  gameUrl: `/our-games/all_games/${slug}`,
}));

// How much bigger + how far forward the centered card pops, as a
// multiple of the card's own responsive width. Same ratio on every
// screen size since --w itself is now container-relative.
const ACTIVE_SCALE = 1.5;
const ACTIVE_POP_RATIO = 0.3;

// Hover bump applied to WHICHEVER card the pointer is over, on top of
// whatever the ring/active-pop is already doing to that card. 1.08 = 8%,
// inside the requested 5-10% range.
const HOVER_SCALE = 1.08;

const Hero = () => {
  const [games, setGames] = useState<GameItem[]>(FALLBACK_GAMES);
  const [user, setUser] = useState<User | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  /*
   * HOME PAGE:
   * Keep the page fixed/non-scrollable.
   */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverflowX: html.style.overflowX,
      htmlOverflowY: html.style.overflowY,
      bodyOverflow: body.style.overflow,
      bodyOverflowX: body.style.overflowX,
      bodyOverflowY: body.style.overflowY,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.setProperty("overflow", "hidden", "important");
    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("overflow-y", "hidden", "important");

    body.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("overflow-x", "hidden", "important");
    body.style.setProperty("overflow-y", "hidden", "important");
    body.style.setProperty("overscroll-behavior", "none", "important");

    const stopPageWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", stopPageWheel, {
      passive: false,
      capture: true,
    });

    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("wheel", stopPageWheel, true);

      html.style.overflow = previous.htmlOverflow;
      html.style.overflowX = previous.htmlOverflowX;
      html.style.overflowY = previous.htmlOverflowY;

      body.style.overflow = previous.bodyOverflow;
      body.style.overflowX = previous.bodyOverflowX;
      body.style.overflowY = previous.bodyOverflowY;
      body.style.overscrollBehavior = previous.bodyOverscroll;
    };
  }, []);

  /*
   * Load games + current user.
   */
  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetch("/api/games").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/auth/me").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([gamesData, userData]) => {
        if (!mounted) return;

        if (gamesData?.success && Array.isArray(gamesData.games)) {
          setGames((currentGames) => {
            const apiGames = gamesData.games as GameItem[];

            const bySlug = new Map(apiGames.map((game) => [game.slug, game]));

            return currentGames.map((fallbackGame) => {
              const apiGame = bySlug.get(fallbackGame.slug);

              if (!apiGame) {
                return fallbackGame;
              }

              return {
                ...fallbackGame,
                ...apiGame,
                thumbnailUrl:
                  GAME_IMAGES[fallbackGame.slug] ||
                  apiGame.thumbnailUrl ||
                  fallbackGame.thumbnailUrl,
                gameUrl: apiGame.gameUrl || fallbackGame.gameUrl,
              };
            });
          });
        }

        if (userData?.success && userData.user) {
          setUser(userData.user);
        }
      })
      .catch(() => {
        // Keep fallback games visible.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const orderedGames = useMemo(() => {
    const bySlug = new Map(games.map((game) => [game.slug, game]));

    const ordered = GAME_ORDER.map((slug) => bySlug.get(slug)).filter(
      Boolean,
    ) as GameItem[];

    const remaining = games.filter((game) => !GAME_ORDER.includes(game.slug));

    return [...ordered, ...remaining];
  }, [games]);

  const N = orderedGames.length;

  /*
   * ROTATION + CENTER-CARD SCALE + PER-CARD STACKING, all driven from JS.
   * Our own angle counter advances every frame, gets written to
   * --ring-angle (a plain CSS rule rotates the ring with it), and since
   * we already know the angle, we directly compute:
   *  - which card is front-facing, to drive --card-scale / --card-pop
   *  - EVERY card's continuous depth, to drive --card-z every frame
   *
   * That second part is what fixes hover dead zones: with preserve-3d,
   * painting order (and therefore which element receives the pointer
   * when two cards' screen boxes overlap) isn't guaranteed to follow
   * DOM order once you rotate things in 3D. Previously every non-active
   * card shared the same --card-z: 1, so ties were broken by DOM order
   * instead of actual on-screen depth — a card that was really behind
   * could still steal hover from one in front of it. Recomputing
   * --card-z from each card's real angle every tick keeps stacking (and
   * therefore hit-testing) matched to what's actually visible.
   */
  useEffect(() => {
    const ringEl = ringRef.current;
    if (!ringEl || N === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const fullRotationSeconds = Math.max(N * 2.6, 30);
    const degPerMs = 360 / (fullRotationSeconds * 1000);

    let angle = 0;
    let lastTs: number | null = null;
    let lastActive = -1;
    let rafId: number;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;

      if (!pausedRef.current && !prefersReducedMotion) {
        angle = (angle + dt * degPerMs) % 360;
      }

      ringEl.style.setProperty("--ring-angle", `${angle}deg`);

      // Queried fresh every frame (cheap for ~18 nodes) rather than
      // cached once, so this can never end up writing to detached
      // nodes if React ever remounts the cards (e.g. a key change).
      const cards = ringEl.querySelectorAll<HTMLElement>(".nebuloid-card");

      const ba = 360 / N;
      let bestIndex = 0;
      let bestDiff = Infinity;

      cards.forEach((card, i) => {
        const total = (((i * ba + angle) % 360) + 360) % 360;
        let diff = Math.abs(total - 180);
        if (diff > 180) diff = 360 - diff;

        if (diff < bestDiff) {
          bestDiff = diff;
          bestIndex = i;
        }

        // Continuous depth-based stacking, updated every frame so it
        // always matches the current rotation — front-most card gets
        // the highest z-index, all the way down to the back-most.
        card.style.setProperty("--card-z", String(Math.round(1800 - diff * 10)));
      });

      if (bestIndex !== lastActive) {
        cards.forEach((card, idx) => {
          const isActive = idx === bestIndex;
          card.style.setProperty(
            "--card-scale",
            isActive ? String(ACTIVE_SCALE) : "1",
          );
          card.style.setProperty(
            "--card-pop",
            isActive ? String(ACTIVE_POP_RATIO) : "0",
          );
        });
        lastActive = bestIndex;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [N]);

  return (
    <section
      className="
        nebuloid-page
        fixed
        inset-x-0
        bottom-0
        top-[76px]
        z-0
        grid
        w-full
        overflow-hidden
        bg-bg
      "
    >
      <Background />
      {/* Diagonal yellow background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[39%]
          top-[-18%]
          h-[140%]
          w-[43%]
          rotate-[17deg]
          bg-bg
        "
      />

      {/* HEADER — auto row */}
      <div
        className="
          relative
          z-20
          flex
          flex-col
          items-center
          justify-center
          gap-1
          px-5
          text-center
        "
      >
        <h1
          className="
            font-roboto
            text-[clamp(2rem,4.5vw,5.4rem)]
            font-black
            uppercase
            leading-none
            tracking-[-0.045em]
            text-[#F7F5EF]
          "
        >
          NEBULOID GAMES
        </h1>

        <h2
          className="
            font-serif
            text-[clamp(1.1rem,2.4vw,2.7rem)]
            font-bold
            leading-tight
            text-[#C9C4B6]
          "
        >
          Play. Think. Challenge Yourself.
        </h2>
      </div>

      {/* 3D CAROUSEL — the only flexible row; grows/shrinks to fill
          whatever space is left after the other rows claim theirs */}
      <div
        className="
          nebuloid-scene
          relative
          z-10
<<<<<<< Updated upstream
          flex
          min-h-0
          w-full
          items-center
          justify-center
=======
          h-[clamp(24rem,51vh,33rem)]
          
>>>>>>> Stashed changes
        "
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={ringRef}
          className="nebuloid-ring"
          style={
            {
              "--n": N,
            } as CSSProperties
          }
        >
          {orderedGames.map((game, i) => {
            const unlocked =
              user !== null ||
              game.slug === "catch-the-brand" ||
              game.slug === "target-shooter";

            const image =
              GAME_IMAGES[game.slug] || game.thumbnailUrl || "/hero-img.png";

            const cardStyle = {
              "--i": i,
            } as CSSProperties;

            const card = (
              <div className="nebuloid-card-inner">
                <div
                  className={`
                    relative
                    h-full
                    w-full
                    overflow-hidden
                    rounded-[10px]
                    border-2
                    border-black
                    bg-white
                    shadow-[5px_5px_0_#111]
                    ${unlocked ? "" : "opacity-100"}
                  `}
                >
                  {/* IMAGE */}
                  <div className="absolute inset-0 bottom-[52px] overflow-hidden bg-white">
                    <img
                      src={image}
                      alt={game.title}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* TITLE */}
                  <div className="absolute inset-x-0 bottom-0 flex h-[52px] items-center gap-2 bg-[#0B0A10] px-3">
                    <p className="min-w-0 flex-1 truncate font-sans text-[24px] font-extrabold uppercase tracking-[0.04em] text-white sm:text-[24px]">
                      {game.title}
                    </p>

                    {!unlocked && (
                      <span
                        title="Login to unlock"
                        aria-label="Locked — login to unlock"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-black bg-[#FFD83D] text-[14px] leading-none shadow-[1px_1px_0_#000]"
                      >
                        🔒
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );

            return unlocked ? (
              <a
                key={game.slug}
                href={game.gameUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Play ${game.title}`}
                className="nebuloid-card"
                style={cardStyle}
              >
                {card}
              </a>
            ) : (
              <Link
                key={game.slug}
                href="/login"
                aria-label={`Login to unlock ${game.title}`}
                className="nebuloid-card"
                style={cardStyle}
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      {/* DESCRIPTION + EXPLORE — auto row, always in flow, always visible */}
      <div
        className="
          relative
          z-20
          flex
          w-full
          flex-col
          items-center
          gap-[clamp(0.75rem,2vh,1.75rem)]
          px-5
          text-center
        "
      >
        <p
          className="
            mx-auto
            max-w-[850px]
            text-[clamp(0.95rem,1.5vw,1.55rem)]
            font-medium
            leading-[1.5]
            text-[#DEDACE]
          "
        >
          A collection of interactive games designed and crafted by Nebuloid to
          challenge your logic, speed, memory, and creativity.
        </p>

        <Link
          href="/login"
          className="
            inline-flex
            min-h-[clamp(48px,7vh,72px)]
            items-center
            justify-center
            border-2
            border-black
            bg-[#FFD83D]
            px-[clamp(1.75rem,4vw,3.5rem)]
            py-[clamp(0.75rem,2vh,1.25rem)]
            font-serif
            text-[clamp(1rem,1.4vw,1.5rem)]
            font-bold
            uppercase
            tracking-[0.08em]
            text-black
            shadow-[5px_5px_0_#111]
            transition-transform
            duration-200
            hover:-translate-y-1
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
          "
        >
          EXPLORE NOW <span className="ml-2">→</span>
        </Link>
      </div>

      {/* FOOTER — auto row */}
      <div
        className="
          relative
          z-20
          flex
          w-full
          flex-wrap
          items-center
          justify-between
          gap-2
          px-6
          py-2
          text-[clamp(0.8rem,1.3vw,1.19rem)]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-[#C9C4B6]
          sm:px-10
          lg:px-14
        "
      >
        <span>A collection of fast, fun, interactive games</span>

        <span className="hidden sm:block">
          Test your skills. Beat your score.
        </span>
      </div>

      <style>{`
        /*
         * PAGE SKELETON:
         * Real grid rows instead of absolute top offsets, so every
         * section (header, carousel, CTA, footer) always fits inside
         * the fixed viewport and never overlaps or gets clipped.
         * The carousel row is the only flexible one (minmax(0,1fr)):
         * it grows on tall/wide screens and shrinks first on short
         * ones, while the CTA + footer always keep their natural size
         * and stay visible.
         */
        .nebuloid-page {
          grid-template-rows: auto minmax(0, 1fr) auto auto;
          row-gap: clamp(0.25rem, 1.5vh, 1rem);
          padding-block: clamp(0.5rem, 2vh, 1.5rem);
        }

        /*
         * CAROUSEL SIZING:
         * container-type: size lets --w below be computed from the
         * *actual* pixel size this row ends up with (cqw/cqh), not
         * the raw viewport — so it's correct no matter how much space
         * the header/CTA/footer rows claimed above and below it.
         */
        .nebuloid-scene {
          container-type: size;
          container-name: carousel;
          perspective: 1000px;
          -webkit-mask: none;
          mask: none;
        }

        .nebuloid-ring {
          --w: clamp(220px, min(26cqw, 190cqh), 360px);

          display: grid;
          place-self: center;
          transform-style: preserve-3d;
          transform: rotateY(var(--ring-angle, 0deg));

          /* The ring itself is an invisible box (no background) sized to
             roughly one card, sitting at the center of the rotation. Left
             at the default, it's still hit-testable even though nothing
             is painted — and because it rotates with the whole scene, its
             on-screen footprint is largest exactly when facing the viewer
             (i.e. right where the front card sits) and smallest edge-on.
             That's the "dead zone that shrinks near 90°" — this invisible
             plane competing with the real card for the pointer. Turning
             it off here and re-enabling only on .nebuloid-card below means
             only the actual cards can ever be hovered/clicked. */
          pointer-events: none;
        }

        .nebuloid-card {
          --ba: calc(1turn / var(--n));

          grid-area: 1 / 1;
          display: block;
          width: var(--w);
          aspect-ratio: 4 / 5;

          transform-origin: center center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;

          cursor: pointer;
          pointer-events: auto;

          /* Outer transform only handles 3D placement + the JS-driven
             center-card pop. Hover never touches this chain, so it can't
             drift relative to the perspective projection. */
          transform:
            rotateY(calc(var(--i) * var(--ba)))
            translateZ(
              calc(
                -1 *
                (0.5 * var(--w) + 10px) /
                tan(0.5 * var(--ba))
              )
            )
            translateZ(calc(var(--w) * var(--card-pop, 0)))
            scale(var(--card-scale, 1));

          transition: transform 0.35s ease;
          /* Set every frame in JS from each card's real depth, so
             paint order (and hit-testing) always matches what's
             visually in front — this is what removes hover dead
             zones on a rotating 3D ring. */
          z-index: var(--card-z, 1);
        }

        /* Inner wrapper: plain flat scale, applied inside the card's own
           already-resolved screen box. This is what grows on hover — purely
           visual, no perspective/Z interaction, so it always scales from
           exactly where the card visually is, centered or not. Works on
           ANY card in the ring, not just the front-facing one. */
        .nebuloid-card-inner {
          height: 100%;
          width: 100%;
          transform: scale(var(--hover-scale, 1));
          transform-origin: center center;
          transition: transform 0.2s ease;
        }

        .nebuloid-card:hover .nebuloid-card-inner {
          --hover-scale: ${HOVER_SCALE};
        }

        .nebuloid-card:hover {
          z-index: 2000 !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;