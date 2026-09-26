// src/app/our-games/components/Game.tsx
"use client";

import Image from "next/image";
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

const TITLES: Record<string, string> = {
  "math-tug-of-war": "Math Tug of War",
  "reaction-rush": "Reaction Rush",
  "memory-match": "Memory Match",
  "speed-typing-battle": "Speed Typing Battle",
  "color-clash": "Color Clash",
  "catch-the-brand": "Catch the Brand",
  "emoji-puzzle": "Emoji Puzzle",
  "logo-quiz": "Logo Quiz",
  "2048-race": "2048 Race",
  "bomb-defusal": "Bomb Defusal",
  "memory-sequence": "Memory Sequence",
  "target-shooter": "Target Shooter",
  "number-puzzle": "Number Puzzle",
  "water-color-sort": "Water Color Sort",
  "flappy-bird": "Flappy Bird",
  "math-minesweeper": "Math Minesweeper",
  "word-hunt": "Word Puzzle",
  "stack-master": "Stack Master",
};

const DESCRIPTIONS: Record<string, string> = {
  "math-tug-of-war": "Solve quick equations and pull your way to victory.",
  "reaction-rush": "React fast, hit the right targets, and beat the clock.",
  "memory-match": "Flip, remember, and match every pair before time runs out.",
  "speed-typing-battle": "Type accurately and quickly to beat the clock.",
  "color-clash": "Ignore the word and choose the correct color as fast as you can.",
  "catch-the-brand": "Spot the correct brand and catch it before it disappears.",
  "emoji-puzzle": "Decode emoji combinations and solve the puzzle quickly.",
  "logo-quiz": "Identify familiar logos and prove your brand knowledge.",
  "2048-race": "Merge tiles, build your score, and race your way to 2048.",
  "bomb-defusal": "Read the clues, find the sequence, and beat the timer.",
  "memory-sequence": "Watch the pattern, remember the sequence, and repeat it.",
  "target-shooter": "Aim fast, stay focused, and hit the moving targets.",
  "number-puzzle": "Use logic and numbers to solve each challenge.",
  "water-color-sort": "Sort the colors into the correct tubes with smart moves.",
  "flappy-bird": "Navigate through the gaps and keep your run alive.",
  "math-minesweeper": "Use mathematical clues to clear the board safely.",
  "word-hunt": "Find the hidden words, crack the clues, and beat the clock.",
  "stack-master": "Align every block, build higher, and reach the top.",
};

const GAME_IMAGES: Record<string, string> = {
  "math-tug-of-war": "/tug of war.png",
  "reaction-rush": "/reaction rush.png",
  "memory-match": "/math memory match.png",
  "speed-typing-battle": "/speed typing battle.jpeg",
  "color-clash": "/color.png",
  "catch-the-brand": "/catch the brand.jpeg",
  "emoji-puzzle": "/emoji puzzle.png",
  "logo-quiz": "/logo quiz.png",
  "2048-race": "/2048 race.jpeg",
  "bomb-defusal": "/bomb defusal.jpeg",
  "memory-sequence": "/memory sequence.png",
  "target-shooter": "/target shooter.jpeg",
  "number-puzzle": "/number puzzle.png",
  "water-color-sort": "/water color sort.jpeg",
  "flappy-bird": "/flappy bird.jpeg",
  "math-minesweeper": "/math minesweeper.png",
  "word-hunt": "/word hunt.png",
  "stack-master": "/stack master.jpeg",
};

const GAME_URLS: Record<string, string> = {
  "math-tug-of-war": "/games/TugOfWar/index.html",
  "reaction-rush": "/games/Reaction%20Rush/index.html",
  "memory-match": "/games/MemoryMatch/index.html",
  "speed-typing-battle": "/games/speed%20typing%20battle/index.html",
  "color-clash": "/games/Color%20Clash/index.html",
  "catch-the-brand": "/games/catch%20the%20brand/index.html",
  "emoji-puzzle": "/games/Emoji%20Puzzle/index.html",
  "logo-quiz": "/games/Logo%20Quiz/index.html",
  "2048-race": "/games/2048-Race/index.html",
  "bomb-defusal": "/games/bomb%20defusal/index.html",
  "memory-sequence": "/games/Memory%20Sequence/index.html",
  "target-shooter": "/games/target%20shooter/index.html",
  "number-puzzle": "/games/Number%20Puzzle/index.html",
  "water-color-sort": "/games/water%20color%20sort/index.html",
  "flappy-bird": "/games/flappy%20bird/index.html",
  "math-minesweeper": "/games/MathMinesweeper/index.html",
  "word-hunt": "/games/Word%20Hunt/index.html",
  "stack-master": "/games/Stack%20Master/index.html",
};

const FALLBACK_GAMES: GameItem[] = GAME_ORDER.map((slug) => ({
  id: slug,
  title: TITLES[slug] || slug,
  slug,
  description: DESCRIPTIONS[slug] || null,
  thumbnailUrl: GAME_IMAGES[slug] || null,
  gameUrl: GAME_URLS[slug] || "",
}));

export default function Game() {
  const [games, setGames] = useState<GameItem[]>(FALLBACK_GAMES);

  useEffect(() => {
    let mounted = true;

    fetch("/api/games", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted) return;

        if (
          data?.success &&
          Array.isArray(data.games) &&
          data.games.length
        ) {
          const apiGames = data.games as GameItem[];
          const source = new Map(
            apiGames.map((game) => [game.slug, game]),
          );

          const mergedGames = GAME_ORDER.map((slug) => {
            const apiGame = source.get(slug);

            return {
              id: slug,
              title: TITLES[slug] || apiGame?.title || slug,
              slug,
              description:
                DESCRIPTIONS[slug] ||
                apiGame?.description ||
                "Challenge yourself with this interactive Nebuloid game.",
              thumbnailUrl:
                GAME_IMAGES[slug] ||
                apiGame?.thumbnailUrl ||
                "/hero-img.png",
              gameUrl:
                GAME_URLS[slug] ||
                apiGame?.gameUrl ||
                "",
            };
          });

          setGames(mergedGames);
        }
      })
      .catch(() => {
        // Keep the local 18-game catalogue if API is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const orderedGames = useMemo(() => {
    const source = new Map(
      games.map((game) => [game.slug, game]),
    );

    return GAME_ORDER.map((slug) => {
      const game = source.get(slug);

      return {
        id: slug,
        title: TITLES[slug] || game?.title || slug,
        slug,
        description:
          DESCRIPTIONS[slug] ||
          game?.description ||
          "Challenge yourself with this interactive Nebuloid game.",
        thumbnailUrl:
          GAME_IMAGES[slug] ||
          game?.thumbnailUrl ||
          "/hero-img.png",
        gameUrl:
          GAME_URLS[slug] ||
          game?.gameUrl ||
          "",
      };
    });
  }, [games]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent text-white">
      <section className="mx-auto w-full max-w-[1650px] px-3 pb-20 pt-10 sm:px-4 lg:px-5">
        {/* HEADER */}
        <div className="mx-auto max-w-[1050px] text-center">
          <p className="font-[family-name:var(--font-russo)] text-[12px] font-bold uppercase tracking-[0.28em] text-white/70 sm:text-[14px]">
            Choose Your Game
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-russo)] text-[48px] font-black uppercase leading-none tracking-[-0.045em] text-white sm:text-[58px] lg:text-[64px]">
            Our Games
          </h1>

          <p className="mx-auto mt-4 max-w-[850px] text-[14px] leading-6 text-white/70 sm:text-[16px]">
            Each game is uniquely crafted to test your logic, speed, memory
            and strategy.
          </p>

          <div className="mx-auto mt-5 inline-flex border-2 border-white/20 bg-[#080711] px-7 py-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(124,77,255,0.4)]">
            Play · Learn · Have Fun
          </div>
        </div>

        {/* GAME GRID */}
        <div className="mx-auto mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orderedGames.map((game) => {
            const image =
              GAME_IMAGES[game.slug] ||
              game.thumbnailUrl ||
              "/hero-img.png";

            const description =
              DESCRIPTIONS[game.slug] ||
              game.description ||
              "Challenge yourself with this interactive Nebuloid game.";

            return (
              <article
                key={game.id}
                className="group flex flex-col overflow-hidden rounded-[6px] border-2 border-white/20 bg-[#0c0820]/80 backdrop-blur-md shadow-[0_0_24px_rgba(124,77,255,0.4)] transition-all duration-200 hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-white/20 bg-[#222]">
                  <Image
                    src={image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex min-h-[166px] flex-col px-4 pb-4 pt-4">
                  <h2 className="font-sans text-[18px] font-extrabold leading-tight text-white">
                    {game.title}
                  </h2>

                  <p className="mt-2.5 line-clamp-2 min-h-[40px] text-[12px] leading-[1.55] text-white/70">
                    {description}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                    <Link
                      href="/login"
                      className="flex h-[42px] items-center justify-center border-2 border-white/20 bg-white/[0.07] px-2 text-center font-sans text-[10px] font-black uppercase tracking-[0.04em] text-white shadow-[0_0_24px_rgba(124,77,255,0.4)] transition hover:bg-white/15 sm:text-[11px]"
                    >
                      Get Access
                    </Link>

                    <Link
                      href={`/our-games/all_games/${game.slug}`}
                      className="flex h-[42px] items-center justify-center border-2 border-white/20 bg-gradient-to-r from-[#7C4DFF] to-[#FF4FD8] text-white px-2 text-center font-sans text-[10px] font-black uppercase tracking-[0.04em] text-white shadow-[0_0_24px_rgba(124,77,255,0.4)] transition hover:-translate-y-0.5 hover:brightness-110"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* FOOTER */}
        <footer className="mt-16 border-t-2 border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div>
              <p className="font-sans text-sm font-extrabold uppercase tracking-[0.08em]">
                Nebuloid Tech
              </p>

              <p className="mt-1 text-[10px] text-white/70">
                Play • Learn • Grow
              </p>
            </div>

            <p className="text-[10px] text-white/70">
              Games for a Smarter &amp; Brighter Tomorrow
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
