"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

  // HOME PAGE ONLY: completely disable browser/document scrolling.
  // The carousel itself is CSS-animated, so this does not affect its movement.
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

    // Prevent the browser from changing the document scroll position.
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

              if (!apiGame) return fallbackGame;

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
        // Keep fallback games visible if the API is unavailable.
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

    const remaining = games.filter(
      (game) => !GAME_ORDER.includes(game.slug),
    );

    return [...ordered, ...remaining];
  }, [games]);

  // Two copies = seamless continuous carousel.
  const carouselGames = [...orderedGames, ...orderedGames];

  return (
    <section className="fixed inset-x-0 bottom-0 top-[76px] z-0 box-border min-h-0 w-full overflow-hidden overscroll-none bg-[#F4F0E7] border-x border-b border-black">
      {/* Figma-style diagonal yellow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[39%] top-[-18%] h-[140%] w-[43%] rotate-[17deg] bg-[#FFE5A4]"
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-[clamp(2.2rem,5vh,4rem)] text-center">
        <h1 className="font-serif text-[clamp(2.4rem,5vw,4.8rem)] font-black uppercase leading-none tracking-[-0.045em] text-[#111111]">
          NEBULOID GAMES
        </h1>

        <h2 className="mt-2 font-serif text-[clamp(1.3rem,2.5vw,2.25rem)] font-bold leading-tight text-[#4D4A46]">
          Play. Think. Challenge Yourself.
        </h2>
      </div>

      {/* Continuous carousel */}
      <div
        className="absolute left-0 right-0 top-[clamp(13.5rem,29vh,17.5rem)] z-10 overflow-hidden py-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max items-stretch gap-4 sm:gap-5 lg:gap-6"
          style={{
            animation: `nebuloid-carousel ${Math.max(
              orderedGames.length * 2.6,
              30,
            )}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {carouselGames.map((game, index) => {
            const unlocked =
              user !== null ||
              game.slug === "catch-the-brand" ||
              game.slug === "target-shooter";

            const image = GAME_IMAGES[game.slug] || game.thumbnailUrl || "/hero-img.png";

            const card = (
              <div
                className={`group relative h-[clamp(205px,28vh,280px)] w-[clamp(165px,17vw,230px)] shrink-0 overflow-hidden rounded-[10px] border-2 border-black bg-white shadow-[5px_5px_0_#111] ${
                  unlocked ? "cursor-pointer" : "cursor-pointer opacity-80"
                }`}
              >
                {/* Image stays completely visible for locked games */}
                <div className="absolute inset-0 bottom-[52px] overflow-hidden bg-white">
                  <img
                    src={image}
                    alt={game.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Bottom title strip */}
                <div className="absolute inset-x-0 bottom-0 flex h-[52px] items-center gap-2 bg-[#0B0A10] px-3">
                  <p className="min-w-0 flex-1 truncate font-sans text-[12px] font-extrabold uppercase tracking-[0.04em] text-white sm:text-[13px]">
                    {game.title}
                  </p>

                  {!unlocked && (
                    <span
                      title="Login to unlock"
                      aria-label="Locked — login to unlock"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border border-black bg-[#FFD83D] text-[12px] leading-none shadow-[1px_1px_0_#000]"
                    >
                      🔒
                    </span>
                  )}
                </div>
              </div>
            );

            return unlocked ? (
              <a
                key={`${game.id}-${index}`}
                href={game.gameUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Play ${game.title}`}
                className="block"
              >
                {card}
              </a>
            ) : (
              <Link
                key={`${game.id}-${index}`}
                href="/login"
                aria-label={`Login to unlock ${game.title}`}
                className="block"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Description + Explore button — separated from carousel so nothing overlaps */}
      <div className="absolute left-1/2 top-[clamp(34rem,66vh,40rem)] z-10 w-[min(94%,950px)] -translate-x-1/2 text-center">
        <p className="mx-auto max-w-[850px] text-[clamp(1rem,1.5vw,1.35rem)] font-medium leading-[1.55] text-[#3F3D39]">
          A collection of interactive games designed and crafted by Nebuloid to
          challenge your logic, speed, memory, and creativity.
        </p>

        <Link
          href="/our-games"
          className="mx-auto mt-7 inline-flex min-h-[72px] items-center justify-center border-2 border-black bg-[#FFD83D] px-14 py-5 font-serif text-[clamp(1.1rem,1.4vw,1.3rem)] font-bold uppercase tracking-[0.08em] text-black shadow-[5px_5px_0_#111] transition-transform duration-200 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          EXPLORE NOW <span className="ml-2">→</span>
        </Link>
      </div>

      {/* Fixed footer */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-between px-6 text-[9px] uppercase tracking-[0.08em] text-[#3F3D39] sm:px-10 lg:px-14">
        <span>A collection of fast, fun, interactive games</span>
        <span className="hidden sm:block">Test your skills. Beat your score.</span>
      </div>

           <style>{`
        @keyframes nebuloid-carousel {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nebuloid-carousel-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
