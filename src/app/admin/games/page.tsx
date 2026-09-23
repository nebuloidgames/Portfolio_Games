// src/app/our-games/all_games/[slug]/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface GameItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  gameUrl: string;
}

const FALLBACK: Record<string, Partial<GameItem> & {
  eyebrow: string;
  headline: string;
  features: [string, string, string];
  mechanics: [string, string, string, string];
}> = {
  "math-tug-of-war": {
    eyebrow: "SOLVE YOUR GAME",
    headline: "ONE ROPE. TWO TEAMS. INFINITE CHALLENGES.",
    features: ["TEST YOUR SPEED", "CHALLENGE YOUR LOGIC", "COMPETE GLOBALLY"],
    mechanics: ["SPEED MATH", "STRATEGIC THINKING", "TACTICAL AIM", "RACE THE CLOCK"],
  },
  "reaction-rush": {
    eyebrow: "TEST YOUR REFLEX",
    headline: "SEE IT. REACT FAST. BEAT THE CLOCK.",
    features: ["TEST YOUR SPEED", "CHALLENGE YOUR LOOK", "COMPETE GLOBALLY"],
    mechanics: ["SPEED MATTERS", "PRECISION FIRST", "FOCUS MODE", "RACE THE CLOCK"],
  },
  "memory-match": {
    eyebrow: "MEMORY CHALLENGE",
    headline: "FLIP. REMEMBER. MATCH TO WIN.",
    features: ["TEST YOUR MEMORY", "CHALLENGE YOUR LOGIC", "COMPETE GLOBALLY"],
    mechanics: ["FLIP & REVEAL", "REMEMBER THE PATTERN", "CLEAR THE BOARD", "RACE THE CLOCK"],
  },
  "speed-typing-battle": {
    eyebrow: "TYPE WITH SPEED",
    headline: "TYPE FAST. STAY SHARP. BEAT THE CLOCK.",
    features: ["TEST YOUR SPEED", "CHALLENGE YOUR ACCURACY", "COMPETE GLOBALLY"],
    mechanics: ["TYPE IT RIGHT", "BUILD YOUR SPEED", "PERFECT YOUR ACCURACY", "RACE THE CLOCK"],
  },
  "color-clash": {
    eyebrow: "TEST YOUR FOCUS",
    headline: "SEE THE COLOR. IGNORE THE WORD. MAKE YOUR MOVE.",
    features: ["TEST YOUR FOCUS", "CHALLENGE YOUR REACTION", "COMPETE GLOBALLY"],
    mechanics: ["SPOT THE COLOR", "IGNORE THE DISTRACTION", "MAKE THE RIGHT MOVE", "RACE THE CLOCK"],
  },
  "catch-the-brand": {
    eyebrow: "TEST YOUR BRAND IQ",
    headline: "SPOT IT. CATCH IT. KNOW THE BRAND.",
    features: ["TEST YOUR BRAND IQ", "CHALLENGE YOUR REACTION", "COMPETE GLOBALLY"],
    mechanics: ["SPOT THE BRAND", "TRACK & CATCH", "AVOID THE WRONG ONE", "RACE THE CLOCK"],
  },
  "emoji-puzzle": {
    eyebrow: "PUZZLE YOUR BRAIN",
    headline: "LOOK CLOSE. THINK FAST. SOLVE THE EMOJI.",
    features: ["TEST YOUR THINKING", "CHALLENGE YOUR LOGIC", "COMPETE GLOBALLY"],
    mechanics: ["READ THE CLUES", "CONNECT THE MEANING", "SOLVE THE PUZZLE", "BEAT THE CLOCK"],
  },
  "logo-quiz": {
    eyebrow: "TEST YOUR BRAND KNOWLEDGE",
    headline: "SEE THE LOGO. KNOW THE BRAND. PROVE YOUR IQ.",
    features: ["TEST YOUR BRAND KNOWLEDGE", "CHALLENGE YOUR MEMORY", "COMPETE GLOBALLY"],
    mechanics: ["SPOT THE LOGO", "TEST YOUR MEMORY", "CHOOSE CORRECTLY", "BEAT THE CLOCK"],
  },
  "2048-race": {
    eyebrow: "RACE YOUR WAY TO 2048",
    headline: "MERGE. THINK FAST. REACH 2048.",
    features: ["TEST YOUR STRATEGY", "CHALLENGE YOUR SPEED", "RACE TO THE TOP"],
    mechanics: ["MERGE THE TILES", "PLAN YOUR MOVES", "BUILD THE SCORE", "RACE THE CLOCK"],
  },
  "bomb-defusal": {
    eyebrow: "THINK FAST. STAY SHARP.",
    headline: "READ THE CLUES. MAKE THE MOVE. BEAT THE TIMER.",
    features: ["TEST YOUR LOGIC", "CHALLENGE YOUR FOCUS", "BEAT THE CLOCK"],
    mechanics: ["READ THE CLUES", "FIND THE SEQUENCE", "MAKE YOUR MOVE", "BEAT THE TIMER"],
  },
  "memory-sequence": {
    eyebrow: "TEST YOUR MEMORY",
    headline: "WATCH. REMEMBER. REPEAT THE SEQUENCE.",
    features: ["TEST YOUR MEMORY", "CHALLENGE YOUR FOCUS", "BUILD YOUR HIGH SCORE"],
    mechanics: ["WATCH THE PATTERN", "REPEAT THE SEQUENCE", "MASTER THE PATTERN", "PUSH YOUR LIMITS"],
  },
  "target-shooter": {
    eyebrow: "AIM. FOCUS. HIT.",
    headline: "LOCK ON. AIM FAST. HIT THE TARGET.",
    features: ["TEST YOUR AIM", "CHALLENGE YOUR REFLEXES", "CHASE THE HIGH SCORE"],
    mechanics: ["SPOT THE TARGET", "AIM & HIT", "IMPROVE YOUR ACCURACY", "BEAT THE CLOCK"],
  },
  "number-puzzle": {
    eyebrow: "THINK. CALCULATE. SOLVE.",
    headline: "MOVE THE NUMBERS. SOLVE THE PUZZLE. BEAT YOUR SCORE.",
    features: ["TEST YOUR LOGIC", "CHALLENGE YOUR STRATEGY", "MASTER EVERY LEVEL"],
    mechanics: ["FIND THE PATTERN", "PLAN YOUR MOVES", "MAKE THE RIGHT MOVE", "BEAT YOUR RECORD"],
  },
  "water-color-sort": {
    eyebrow: "THINK FAST. STAY SHARP.",
    headline: "POUR. MATCH THE COLORS. CLEAR THE TUBES.",
    features: ["TEST YOUR STRATEGY", "CHALLENGE YOUR LOGIC", "MASTER EVERY LEVEL"],
    mechanics: ["PICK THE COLOR", "POUR & MATCH", "USE SPACE WISELY", "CLEAR THE TUBES"],
  },
  "flappy-bird": {
    eyebrow: "FLY. DODGE. SURVIVE.",
    headline: "TAP. FLY THROUGH. BEAT YOUR SCORE.",
    features: ["TEST YOUR REFLEXES", "CHALLENGE YOUR TIMING", "CHASE THE HIGH SCORE"],
    mechanics: ["CONTROL YOUR FLIGHT", "DODGE THE OBSTACLES", "MASTER YOUR TIMING", "FLY AS FAR AS YOU CAN"],
  },
  "math-minesweeper": {
    eyebrow: "THINK. CALCULATE. SURVIVE.",
    headline: "SOLVE THE MATH. FIND THE MINES. CLEAR THE GRID.",
    features: ["TEST YOUR MATH SKILLS", "CHALLENGE YOUR LOGIC", "CLEAR THE GRID"],
    mechanics: ["READ THE CLUES", "FIND THE SAFE TILES", "AVOID THE MINES", "CLEAR THE GRID"],
  },
  "word-hunt": {
    eyebrow: "THINK. FIND. SOLVE.",
    headline: "FIND THE WORD. CRACK THE CLUES. BEAT THE CLOCK.",
    features: ["TEST YOUR VOCABULARY", "CHALLENGE YOUR THINKING", "MASTER EVERY PUZZLE"],
    mechanics: ["READ THE CLUES", "FIND THE LETTERS", "SOLVE THE PUZZLE", "BEAT THE CLOCK"],
  },
  "stack-master": {
    eyebrow: "BUILD. BALANCE. MASTER.",
    headline: "STACK IT. KEEP IT STEADY. REACH THE TOP.",
    features: ["TEST YOUR TIMING", "CHALLENGE YOUR PRECISION", "REACH THE TOP"],
    mechanics: ["WATCH THE BLOCK", "ALIGN & STACK", "BUILD HIGHER", "BEAT YOUR RECORD"],
  },
};

const titles: Record<string, string> = {
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

const defaultDescription =
  "A fast-paced challenge where every move matters. Stay focused, react quickly, and complete the challenge with accuracy.";

export default function GameDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);
  const [game, setGame] = useState<GameItem | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/games", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data?.success || !Array.isArray(data.games)) return;
        const found = (data.games as GameItem[]).find((item) => item.slug === slug);
        if (found) setGame(found);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [slug]);

  const title = game?.title || titles[slug] || slug.replaceAll("-", " ");
  const content = FALLBACK[slug] || {
    eyebrow: "TEST YOUR SKILLS",
    headline: `PLAY ${title.toUpperCase()}.`,
    features: ["TEST YOUR SKILLS", "CHALLENGE YOURSELF", "BEAT YOUR SCORE"],
    mechanics: ["GET STARTED", "GET READY", "TEST SKILLS", "PLAY NOW"],
  };

  const image = game?.thumbnailUrl || "/hero-img.png";
  const description = game?.description || defaultDescription;
  const gameUrl = game?.gameUrl || `/our-games/all_games/${slug}`;

  const featureText = useMemo(
    () => [
      "Fast challenges designed to test your skills and keep every move engaging.",
      "Stay focused, make quick decisions, and improve with every attempt.",
      "Complete the challenge, sharpen your skills, and chase a higher score.",
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-[#F4F0E7] text-[#111111]">
      <section className="mx-auto w-full max-w-[1320px] px-6 pb-16 pt-12 sm:px-10 lg:px-14">
        <div className="grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            <span className="inline-flex border-2 border-black bg-[#FFD83D] px-3 py-1 font-sans text-[8px] font-black uppercase tracking-[0.08em] shadow-[2px_2px_0_#111]">
              {content.eyebrow}
            </span>

            <h1 className="mt-5 max-w-[500px] font-sans text-[40px] font-black uppercase leading-[0.94] tracking-[-0.055em] sm:text-[50px] lg:text-[54px]">
              {content.headline}
            </h1>

            <div className="mt-5 inline-block border-2 border-black bg-black px-4 py-2">
              <span className="font-sans text-[24px] font-black uppercase leading-none text-[#22F0FF] sm:text-[28px]">
                {title}
              </span>
            </div>

            <p className="mt-5 max-w-[480px] text-[12px] leading-[1.6] text-[#4B4945] sm:text-[13px]">
              {description}
            </p>

            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex border-2 border-black bg-[#FFD83D] px-5 py-2.5 font-sans text-[10px] font-black uppercase tracking-[0.06em] shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Get Access
            </a>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden border-2 border-black bg-[#111] shadow-[5px_5px_0_#111]">
            <Image
              src={image}
              alt={title}
              fill
              unoptimized={image.startsWith("http")}
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-sans text-[8px] font-black uppercase tracking-[0.12em] text-[#7B6D2B]">
              — ABOUT THE GAME —
            </p>
            <h2 className="mt-3 font-serif text-2xl font-black">{title}</h2>
            <p className="mt-3 max-w-[560px] text-[11px] leading-[1.7] text-[#5B5751]">
              {description} The game is designed to reward focus, quick
              decisions and consistent improvement while keeping every round
              easy to understand and fun to replay.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {content.features.map((feature, index) => (
              <div key={feature}>
                <div className="font-sans text-[45px] font-light leading-none text-black/15 sm:text-[58px]">
                  0{index + 1}
                </div>
                <h3 className="mt-2 font-sans text-[8px] font-black uppercase">
                  {feature}
                </h3>
                <p className="mt-2 text-[9px] leading-[1.45] text-[#66615B]">
                  {featureText[index]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="text-center">
            <h2 className="font-sans text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
              Game Mechanics
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-[9px] text-[#6A665F]">
              Sharp focus, quick decisions, and precise timing are the keys to a high score.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.mechanics.map((mechanic, index) => (
              <article
                key={mechanic}
                className="flex min-h-[155px] flex-col border-2 border-black bg-white shadow-[3px_3px_0_#111]"
              >
                <div className="flex h-[76px] items-center justify-center bg-[#080711]">
                  <div className="flex h-8 w-8 items-center justify-center border border-[#22F0FF] text-sm text-[#22F0FF]">
                    {["↯", "↕", "△", "◷"][index]}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[7px] font-black uppercase tracking-[0.1em] text-[#77716A]">
                    {index === 0 ? "FIRST THE BASICS" : index === 1 ? "THEN THE SKILL" : index === 2 ? "BUILD YOUR EDGE" : "BEAT THE TIMER"}
                  </p>
                  <h3 className="mt-1 font-sans text-[10px] font-black uppercase">
                    {mechanic}
                  </h3>
                  <button
                    type="button"
                    onClick={() => window.open(gameUrl, "_blank", "noopener,noreferrer")}
                    className="mt-auto self-start border border-black bg-[#FFD83D] px-4 py-1.5 text-[8px] font-black uppercase shadow-[1px_1px_0_#111]"
                  >
                    {index === 0 ? "Get Started" : index === 1 ? "Get Ready" : index === 2 ? "Test Skills" : "Play Now"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
