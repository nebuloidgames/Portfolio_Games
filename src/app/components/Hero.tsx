"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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

const Hero = () => {
  const [games, setGames] = useState<GameItem[]>(FALLBACK_GAMES);
  const [user, setUser] = useState<User | null>(null);
  const [paused, setPaused] = useState(false);

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

            const bySlug = new Map(
              apiGames.map((game) => [game.slug, game]),
            );

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
                gameUrl:
                  apiGame.gameUrl || fallbackGame.gameUrl,
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
    const bySlug = new Map(
      games.map((game) => [game.slug, game]),
    );

    const ordered = GAME_ORDER.map((slug) => bySlug.get(slug)).filter(
      Boolean,
    ) as GameItem[];

    const remaining = games.filter(
      (game) => !GAME_ORDER.includes(game.slug),
    );

    return [...ordered, ...remaining];
  }, [games]);

  const N = orderedGames.length;

  return (
    <section
      className="
        fixed
        inset-x-0
        bottom-0
        top-[76px]
        z-0
        box-border
        min-h-0
        w-full
        overflow-x-clip
        overflow-y-visible
        overscroll-none
        bg-bg
      "
    >
      <Background/>
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

      {/* HEADER */}
      <div
        className="
          relative
          z-20
          flex
          flex-col
          items-center
          px-5
          pt-[clamp(2.2rem,5vh,4rem)]
          text-center
        "
      >
        <h1
          className="
            font-serif
            text-[clamp(2.8rem,5.5vw,5.4rem)]
            font-black
            uppercase
            leading-none
            tracking-[-0.045em]
            text-[#111111]
          "
        >
          NEBULOID GAMES
        </h1>

        <h2
          className="
            mt-3
            font-serif
            text-[clamp(1.6rem,3vw,2.7rem)]
            font-bold
            leading-tight
            text-[#4D4A46]
          "
        >
          Play. Think. Challenge Yourself.
        </h2>
      </div>

      {/* 3D CAROUSEL */}
      <div
        className="
          nebuloid-scene
          absolute
          left-0
          right-0
          top-[clamp(13.5rem,29vh,17.5rem)]
          z-10
          h-[clamp(24rem,51vh,33rem)]
          bg-black
        "
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="nebuloid-ring"
          style={
            {
              "--n": N,
              animationDuration: `${Math.max(N * 2.6, 30)}s`,
              animationPlayState: paused ? "paused" : "running",
            } as CSSProperties
          }
        >
          {orderedGames.map((game, i) => {
            const unlocked =
              user !== null ||
              game.slug === "catch-the-brand" ||
              game.slug === "target-shooter";

            const image =
              GAME_IMAGES[game.slug] ||
              game.thumbnailUrl ||
              "/hero-img.png";

            const cardStyle = {
              "--i": i,
            } as CSSProperties;

            const card = (
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
                  ${unlocked ? "" : "opacity-80"}
                `}
              >
                {/* IMAGE */}
                <div
                  className="
                    absolute
                    inset-0
                    bottom-[52px]
                    overflow-hidden
                    bg-white
                  "
                >
                  <img
                    src={image}
                    alt={game.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* TITLE */}
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    flex
                    h-[52px]
                    items-center
                    gap-2
                    bg-[#0B0A10]
                    px-3
                  "
                >
                  <p
                    className="
                      min-w-0
                      flex-1
                      truncate
                      font-sans
                      text-[15px]
                      font-extrabold
                      uppercase
                      tracking-[0.04em]
                      text-white
                      sm:text-[16px]
                    "
                  >
                    {game.title}
                  </p>

                  {!unlocked && (
                    <span
                      title="Login to unlock"
                      aria-label="Locked — login to unlock"
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-[4px]
                        border
                        border-black
                        bg-[#FFD83D]
                        text-[14px]
                        leading-none
                        shadow-[1px_1px_0_#000]
                      "
                    >
                      🔒
                    </span>
                  )}
                </div>
              </div>
            );

            return unlocked ? (
              <a
                key={game.id}
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
                key={game.id}
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

      {/* DESCRIPTION + EXPLORE */}
      <div
        className="
          absolute
          left-1/2
          top-[clamp(34rem,66vh,40rem)]
          z-20
          w-[min(94%,950px)]
          -translate-x-1/2
          text-center
        "
      >
        <p
          className="
            mx-auto
            max-w-[850px]
            text-[clamp(1.15rem,1.7vw,1.55rem)]
            font-medium
            leading-[1.55]
            text-[#3F3D39]
          "
        >
          A collection of interactive games designed and crafted by Nebuloid
          to challenge your logic, speed, memory, and creativity.
        </p>

        <Link
          href="/login"
          className="
            mx-auto
            mt-7
            inline-flex
            min-h-[72px]
            items-center
            justify-center
            border-2
            border-black
            bg-[#FFD83D]
            px-14
            py-5
            font-serif
            text-[clamp(1.25rem,1.6vw,1.5rem)]
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

      {/* FOOTER */}
      <div
        className="
          absolute
          bottom-4
          left-0
          right-0
          z-20
          flex
          items-center
          justify-between
          px-6
          text-[18px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-[#3F3D39]
          sm:px-10
          sm:text-[19px]
          lg:px-14
        "
      >
        <span>
          A collection of fast, fun, interactive games
        </span>

        <span className="hidden sm:block">
          Test your skills. Beat your score.
        </span>
      </div>

      <style>{`
        .nebuloid-scene,
        .nebuloid-ring {
          display: grid;
        }

        /*
         * CAROUSEL EDGE:
         * No mask.
         * No fade.
         * No visible boundary.
         */
        .nebuloid-scene {
          overflow: visible;
          perspective: 1000px;
          --w: clamp(170px, 17vw, 230px);

          -webkit-mask: none;
          mask: none;
        }

        .nebuloid-ring {
          place-self: center;
          transform-style: preserve-3d;
          animation: nebuloid-ry 40s linear infinite;
        }

        @keyframes nebuloid-ry {
          to {
            transform: rotateY(1turn);
          }
        }

        .nebuloid-card {
          --ba: calc(1turn / var(--n));

          grid-area: 1 / 1;
          display: block;
          width: var(--w);
          aspect-ratio: 4 / 5;

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;

          cursor: pointer;

          transform:
            rotateY(calc(var(--i) * var(--ba)))
            translateZ(
              calc(
                -1 *
                (0.5 * var(--w) + 10px) /
                tan(0.5 * var(--ba))
              )
            );
        }

        @media (prefers-reduced-motion: reduce) {
          .nebuloid-ring {
            animation-duration: 160s !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;