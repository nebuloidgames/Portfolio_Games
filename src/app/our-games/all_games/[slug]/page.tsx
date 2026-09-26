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

interface GameContent {
    eyebrow: string;
    headline: string;
    description: string;
    features: {
        title: string;
        description: string;
    }[];
}

const FALLBACK_GAMES: GameItem[] = [
    {
        id: "2048-race",
        title: "2048 Race",
        slug: "2048-race",
        description: "Race your way to the ultimate 2048 tile.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "bomb-defusal",
        title: "Bomb Defusal",
        slug: "bomb-defusal",
        description: "Think fast and defuse the bomb before time runs out.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "catch-the-brand",
        title: "Catch the Brand",
        slug: "catch-the-brand",
        description: "Catch the right brands and test your reflexes.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "color-clash",
        title: "Color Clash",
        slug: "color-clash",
        description: "Match colors, react quickly and beat every level.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "emoji-puzzle",
        title: "Emoji Puzzle",
        slug: "emoji-puzzle",
        description: "Solve clever puzzles using your emoji knowledge.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "flappy-bird",
        title: "Flappy Bird",
        slug: "flappy-bird",
        description: "Navigate through obstacles and beat your high score.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "logo-quiz",
        title: "Logo Quiz",
        slug: "logo-quiz",
        description: "Recognize famous logos and prove your knowledge.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "math-minesweeper",
        title: "Math Minesweeper",
        slug: "math-minesweeper",
        description: "Combine mathematics and strategy in one challenge.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "memory-sequence",
        title: "Memory Sequence",
        slug: "memory-sequence",
        description: "Remember the sequence and reproduce it perfectly.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "memory-match",
        title: "Memory Match",
        slug: "memory-match",
        description: "Find matching pairs and sharpen your memory.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "number-puzzle",
        title: "Number Puzzle",
        slug: "number-puzzle",
        description: "Solve challenging number-based puzzles.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "reaction-rush",
        title: "Reaction Rush",
        slug: "reaction-rush",
        description: "Test your reaction speed with fast challenges.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "speed-typing-battle",
        title: "Speed Typing Battle",
        slug: "speed-typing-battle",
        description: "Type faster, react quicker and dominate the battle.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "stack-master",
        title: "Stack Master",
        slug: "stack-master",
        description: "Build the highest and most accurate stack.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "target-shooter",
        title: "Target Shooter",
        slug: "target-shooter",
        description: "Hit targets with precision and speed.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "math-tug-of-war",
        title: "Tug of War",
        slug: "math-tug-of-war",
        description:
            "Solve mathematical challenges and pull your way to victory.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "water-color-sort",
        title: "Water Color Sort",
        slug: "water-color-sort",
        description: "Sort colorful liquids and solve every level.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
    {
        id: "word-hunt",
        title: "Word Hunt",
        slug: "word-hunt",
        description: "Find hidden words and complete the challenge.",
        thumbnailUrl: null,
        gameUrl: "#",
    },
];

const GAME_URLS: Record<string, string> = {
    "math-tug-of-war": "/games/TugOfWar/index.html",
    "reaction-rush": "/games/Reaction%20Rush/index.html",
    "memory-match": "/games/MemoryMatch/index.html",
    "speed-typing-battle":
        "/games/speed%20typing%20battle/index.html",
    "color-clash": "/games/Color%20Clash/index.html",
    "catch-the-brand":
        "/games/catch%20the%20brand/index.html",
    "emoji-puzzle":
        "/games/Emoji%20Puzzle/index.html",
    "logo-quiz":
        "/games/Logo%20Quiz/index.html",
    "2048-race":
        "/games/2048-Race/index.html",
    "bomb-defusal":
        "/games/bomb%20defusal/index.html",
    "memory-sequence":
        "/games/Memory%20Sequence/index.html",
    "target-shooter":
        "/games/target%20shooter/index.html",
    "number-puzzle":
        "/games/Number%20Puzzle/index.html",
    "water-color-sort":
        "/games/water%20color%20sort/index.html",
    "flappy-bird":
        "/games/flappy%20bird/index.html",
    "math-minesweeper":
        "/games/MathMinesweeper/index.html",
    "word-hunt":
        "/games/Word%20Hunt/index.html",
    "stack-master":
        "/games/Stack%20Master/index.html",
};

/*
|--------------------------------------------------------------------------
| REAL GAME IMAGES FROM /public
|--------------------------------------------------------------------------
*/

const GAME_IMAGES: Record<string, string> = {
    "2048-race": "/2048 race.jpeg",
    "bomb-defusal": "/bomb defusal.jpeg",
    "catch-the-brand": "/catch the brand.jpeg",
    "color-clash": "/color.png",
    "emoji-puzzle": "/emoji puzzle.png",
    "flappy-bird": "/flappy bird.jpeg",
    "logo-quiz": "/logo quiz.png",
    "math-minesweeper": "/math minesweeper.png",
    "memory-sequence": "/memory sequence.png",
    "memory-match": "/math memory match.png",
    "number-puzzle": "/number puzzle.png",
    "reaction-rush": "/reaction rush.png",
    "speed-typing-battle": "/speed typing battle.jpeg",
    "stack-master": "/stack master.jpeg",
    "target-shooter": "/target shooter.jpeg",
    "math-tug-of-war": "/tug of war.png",
    "water-color-sort": "/water color sort.jpeg",
    "word-hunt": "/word hunt.png",
};

const CONTENT: Record<string, GameContent> = {
    "2048-race": {
        eyebrow: "PUZZLE GAME",
        headline: "Race to 2048",
        description:
            "Combine numbers, make smart moves and reach the 2048 tile before the board fills up.",
        features: [
            {
                title: "THINK FAST",
                description:
                    "Plan your next move while keeping the board under control.",
            },
            {
                title: "COMBINE",
                description:
                    "Merge matching numbers to create larger and more powerful tiles.",
            },
            {
                title: "REACH 2048",
                description:
                    "Keep combining tiles until you reach the ultimate target.",
            },
        ],
    },

    "bomb-defusal": {
        eyebrow: "CHALLENGE GAME",
        headline: "Defuse Before Time Runs Out",
        description:
            "Stay calm, inspect the challenge and make the right decisions before the countdown reaches zero.",
        features: [
            {
                title: "OBSERVE",
                description:
                    "Look carefully at every part of the challenge.",
            },
            {
                title: "DECIDE",
                description:
                    "Choose the correct action before the timer runs out.",
            },
            {
                title: "DEFUSE",
                description:
                    "Complete the challenge successfully and move to the next level.",
            },
        ],
    },

    "catch-the-brand": {
        eyebrow: "REFLEX GAME",
        headline: "Catch The Brand",
        description:
            "Test your reaction speed by catching the correct brand while avoiding distractions.",
        features: [
            {
                title: "FOCUS",
                description:
                    "Keep your attention on the target appearing on screen.",
            },
            {
                title: "REACT",
                description:
                    "React quickly when the correct brand appears.",
            },
            {
                title: "SCORE",
                description:
                    "Build your score and progress through increasingly difficult levels.",
            },
        ],
    },

    "color-clash": {
        eyebrow: "COLOR GAME",
        headline: "Master The Color Clash",
        description:
            "Match colors and react quickly as the challenge becomes harder with every level.",
        features: [
            {
                title: "MATCH",
                description:
                    "Identify the correct color combination.",
            },
            {
                title: "REACT",
                description:
                    "Make quick decisions before the timer runs out.",
            },
            {
                title: "MASTER",
                description:
                    "Complete every level with speed and accuracy.",
            },
        ],
    },

    "emoji-puzzle": {
        eyebrow: "PUZZLE GAME",
        headline: "Solve The Emoji Puzzle",
        description:
            "Use your observation and reasoning skills to solve clever emoji-based challenges.",
        features: [
            {
                title: "OBSERVE",
                description:
                    "Look carefully at every emoji combination.",
            },
            {
                title: "THINK",
                description:
                    "Connect the clues and discover the hidden answer.",
            },
            {
                title: "SOLVE",
                description:
                    "Complete the puzzle and unlock the next challenge.",
            },
        ],
    },

    "flappy-bird": {
        eyebrow: "ARCADE GAME",
        headline: "Fly Through The Challenge",
        description:
            "Control your bird, avoid obstacles and see how far you can go.",
        features: [
            {
                title: "CONTROL",
                description:
                    "Keep your character flying at the right height.",
            },
            {
                title: "DODGE",
                description:
                    "Avoid every obstacle standing in your way.",
            },
            {
                title: "SURVIVE",
                description:
                    "Stay alive as long as possible and beat your score.",
            },
        ],
    },

    "logo-quiz": {
        eyebrow: "QUIZ GAME",
        headline: "Can You Recognize The Logo?",
        description:
            "Test your knowledge by identifying brands from their logos.",
        features: [
            {
                title: "LOOK",
                description:
                    "Study the logo shown on the screen.",
            },
            {
                title: "GUESS",
                description:
                    "Use your brand knowledge to find the correct answer.",
            },
            {
                title: "COMPLETE",
                description:
                    "Answer correctly and progress through the quiz.",
            },
        ],
    },

    "math-minesweeper": {
        eyebrow: "MATH GAME",
        headline: "Think. Calculate. Win.",
        description:
            "Combine mathematical thinking with classic puzzle-solving mechanics.",
        features: [
            {
                title: "CALCULATE",
                description:
                    "Use your mathematical skills to solve each challenge.",
            },
            {
                title: "PLAN",
                description:
                    "Choose your moves carefully before revealing the board.",
            },
            {
                title: "WIN",
                description:
                    "Clear the challenge and progress to harder levels.",
            },
        ],
    },

    "memory-sequence": {
        eyebrow: "MEMORY GAME",
        headline: "Remember The Sequence",
        description:
            "Watch carefully, remember the sequence and reproduce it correctly.",
        features: [
            {
                title: "WATCH",
                description:
                    "Pay close attention to the sequence shown to you.",
            },
            {
                title: "REMEMBER",
                description:
                    "Store the sequence in your memory.",
            },
            {
                title: "REPEAT",
                description:
                    "Reproduce the sequence accurately to continue.",
            },
        ],
    },

    "memory-match": {
        eyebrow: "MEMORY GAME",
        headline: "Match Your Memory",
        description:
            "Find matching pairs while improving your memory and concentration.",
        features: [
            {
                title: "SEARCH",
                description:
                    "Explore the board to find hidden pairs.",
            },
            {
                title: "REMEMBER",
                description:
                    "Remember where each item was placed.",
            },
            {
                title: "MATCH",
                description:
                    "Match every pair to complete the level.",
            },
        ],
    },

    "number-puzzle": {
        eyebrow: "PUZZLE GAME",
        headline: "Crack The Number Puzzle",
        description:
            "Use logic and number skills to solve increasingly challenging puzzles.",
        features: [
            {
                title: "ANALYZE",
                description:
                    "Understand the number pattern before making a move.",
            },
            {
                title: "SOLVE",
                description:
                    "Use logic to find the correct solution.",
            },
            {
                title: "PROGRESS",
                description:
                    "Complete every challenge and move to the next level.",
            },
        ],
    },

    "reaction-rush": {
        eyebrow: "REACTION GAME",
        headline: "How Fast Can You React?",
        description:
            "Challenge your reaction time with fast and unpredictable targets.",
        features: [
            {
                title: "WATCH",
                description:
                    "Keep your eyes on the screen at all times.",
            },
            {
                title: "REACT",
                description:
                    "Respond immediately when the target appears.",
            },
            {
                title: "RUSH",
                description:
                    "Improve your reaction time through every level.",
            },
        ],
    },

    "speed-typing-battle": {
        eyebrow: "TYPING GAME",
        headline: "Type Faster. Win Faster.",
        description:
            "Challenge your typing speed and accuracy through an exciting battle.",
        features: [
            {
                title: "TYPE",
                description:
                    "Type the displayed text as quickly as possible.",
            },
            {
                title: "ACCURACY",
                description:
                    "Avoid mistakes while maintaining your speed.",
            },
            {
                title: "BATTLE",
                description:
                    "Improve your typing performance and beat every level.",
            },
        ],
    },

    "stack-master": {
        eyebrow: "ARCADE GAME",
        headline: "Build The Perfect Stack",
        description:
            "Stack blocks with precision and build the highest tower possible.",
        features: [
            {
                title: "AIM",
                description:
                    "Position each block carefully before dropping it.",
            },
            {
                title: "STACK",
                description:
                    "Build your tower while keeping it balanced.",
            },
            {
                title: "MASTER",
                description:
                    "Reach higher levels with perfect timing.",
            },
        ],
    },

    "target-shooter": {
        eyebrow: "ACTION GAME",
        headline: "Hit The Target",
        description:
            "Test your accuracy and reaction speed by hitting targets before time runs out.",
        features: [
            {
                title: "AIM",
                description:
                    "Focus carefully on every target.",
            },
            {
                title: "SHOOT",
                description:
                    "Hit the target with speed and precision.",
            },
            {
                title: "SCORE",
                description:
                    "Keep improving your accuracy and reach higher scores.",
            },
        ],
    },

    "math-tug-of-war": {
        eyebrow: "MATH CHALLENGE",
        headline: "Win The Math Tug Of War",
        description:
            "Solve mathematical questions quickly and pull your way toward victory.",
        features: [
            {
                title: "CALCULATE",
                description:
                    "Solve each mathematical challenge as quickly as possible.",
            },
            {
                title: "REACT",
                description:
                    "Answer correctly before your opponent gains an advantage.",
            },
            {
                title: "WIN",
                description:
                    "Use speed and accuracy to win the tug of war.",
            },
        ],
    },

    "water-color-sort": {
        eyebrow: "PUZZLE GAME",
        headline: "Sort Every Color",
        description:
            "Organize colorful liquids into the correct containers and solve every level.",
        features: [
            {
                title: "OBSERVE",
                description:
                    "Study the colors and available containers.",
            },
            {
                title: "SORT",
                description:
                    "Move colors strategically into the correct tubes.",
            },
            {
                title: "COMPLETE",
                description:
                    "Sort every color to finish the level.",
            },
        ],
    },

    "word-hunt": {
        eyebrow: "WORD GAME",
        headline: "Find Every Hidden Word",
        description:
            "Search the board, discover hidden words and complete the challenge.",
        features: [
            {
                title: "SEARCH",
                description:
                    "Scan the board carefully for hidden words.",
            },
            {
                title: "FIND",
                description:
                    "Connect letters and discover the correct words.",
            },
            {
                title: "COMPLETE",
                description:
                    "Find all required words and finish the level.",
            },
        ],
    },
};

function createFallbackContent(game: GameItem): GameContent {
    return {
        eyebrow: "NEBULOID GAME",
        headline: game.title,
        description:
            game.description ||
            `Experience ${game.title}, a fun and challenging game from the Nebuloid Games collection.`,
        features: [
            {
                title: "PLAY",
                description:
                    "Jump into the challenge and start playing.",
            },
            {
                title: "CHALLENGE",
                description:
                    "Improve your skills as the game becomes harder.",
            },
            {
                title: "MASTER",
                description:
                    "Complete the challenge and master the game.",
            },
        ],
    };
}

export default function GameDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [slug, setSlug] = useState("");
    const [games, setGames] =
        useState<GameItem[]>(FALLBACK_GAMES);

    /*
    |--------------------------------------------------------------------------
    | GET SLUG
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        params.then((value) => {
            setSlug(value.slug);
        });
    }, [params]);

    /*
    |--------------------------------------------------------------------------
    | ALWAYS SCROLL TO TOP WHEN GAME CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!slug) return;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [slug]);

    /*
    |--------------------------------------------------------------------------
    | LOAD GAMES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadGames = async () => {
            try {
                const response = await fetch("/api/games", {
                    cache: "no-store",
                });

                if (!response.ok) return;

                const data = await response.json();

                const apiGames = Array.isArray(data)
                    ? data
                    : Array.isArray(data.games)
                        ? data.games
                        : [];

                if (apiGames.length > 0) {
                    setGames(apiGames);
                }
            } catch {
                // Keep fallback games if API is unavailable.
            }
        };

        loadGames();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | CURRENT GAME
    |--------------------------------------------------------------------------
    */

    const currentGame = useMemo(() => {
        return (
            games.find((game) => game.slug === slug) ||
            FALLBACK_GAMES.find((game) => game.slug === slug)
        );
    }, [games, slug]);

    /*
    |--------------------------------------------------------------------------
    | CONTENT
    |--------------------------------------------------------------------------
    */

    const content = useMemo(() => {
        if (!currentGame) return null;

        return (
            CONTENT[currentGame.slug] ||
            createFallbackContent(currentGame)
        );
    }, [currentGame]);

    /*
    |--------------------------------------------------------------------------
    | GAME URL
    |--------------------------------------------------------------------------
    */

    const playableGameUrl = currentGame
        ? GAME_URLS[currentGame.slug] ||
          currentGame.gameUrl ||
          ""
        : "";

    /*
    |--------------------------------------------------------------------------
    | REAL GAME IMAGE
    |--------------------------------------------------------------------------
    */

    const currentGameImage = currentGame
        ? GAME_IMAGES[currentGame.slug] ||
          currentGame.thumbnailUrl ||
          "/hero-img.png"
        : "/hero-img.png";

    /*
    |--------------------------------------------------------------------------
    | MORE GAMES
    |--------------------------------------------------------------------------
    */

    const moreGames = useMemo(() => {
        if (!currentGame) return [];

        return games
            .filter(
                (game) => game.slug !== currentGame.slug
            )
            .slice(0, 6);
    }, [games, currentGame]);

    /*
    |--------------------------------------------------------------------------
    | GAME NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!currentGame || !content) {
        return (
            <main className="min-h-screen px-6 py-20 text-white">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-4xl font-black uppercase">
                        Game Not Found
                    </h1>

                    <p className="mt-4 text-white/70">
                        The game you are looking for does not exist.
                    </p>

                    <Link
                        href="/our-games"
                        className="mt-8 inline-flex rounded-full bg-black px-7 py-3 text-sm font-bold uppercase tracking-wider text-white"
                    >
                        Back To Games
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-x-hidden text-white">

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/10">

                <div className="mx-auto grid min-h-[520px] max-w-[1180px] items-center gap-10 px-6 py-12 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-10 lg:py-16">

                    {/* LEFT */}
                    <div>

                        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">
                            {content.eyebrow}
                        </p>

                        <h1 className="max-w-[570px] text-[43px] font-black uppercase leading-[0.94] tracking-tight sm:text-[52px] lg:text-[58px]">
                            {content.headline}
                        </h1>

                        <div className="mt-6 inline-block bg-black px-4 py-2.5">
                            <span className="text-[18px] font-black uppercase tracking-wide text-cyan-400 sm:text-[21px]">
                                {currentGame.title}
                            </span>
                        </div>

                        <p className="mt-5 max-w-[500px] text-[13px] leading-[1.7] text-white/70 sm:text-[14px]">
                            {content.description}
                        </p>

                        <a
                            href={
                                playableGameUrl ||
                                "/our-games"
                            }
                            className="mt-7 inline-flex min-w-[140px] items-center justify-center rounded-full bg-yellow-400 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_5px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:bg-yellow-300"
                        >
                            PLAY NOW
                        </a>

                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative">

                        <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-black shadow-[10px_12px_0_rgba(0,0,0,0.12)]">

                            <img
                                src={currentGameImage}
                                alt={currentGame.title}
                                className="h-full w-full object-cover"
                            />

                        </div>

                        {/* YELLOW DECORATION */}
                        <div className="absolute -bottom-4 -left-4 z-10 h-16 w-16 rounded-[14px] bg-yellow-400 sm:h-[70px] sm:w-[70px]" />

                        {/* CYAN DECORATION */}
                        <div className="absolute -right-4 -top-4 z-10 h-14 w-14 rounded-full bg-cyan-400 sm:h-16 sm:w-16" />

                    </div>

                </div>

            </section>

            {/* ABOUT THE GAME */}
            <section className="mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-10 lg:py-20">

                <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">

                    {/* ABOUT TITLE */}
                    <div>

                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
                            ABOUT THE GAME
                        </p>

                        <h2 className="mt-5 text-[40px] font-black uppercase leading-none sm:text-[48px]">
                            PLAY.
                            <br />
                            COMPETE.
                            <br />
                            MASTER.
                        </h2>

                    </div>

                    {/* ABOUT CONTENT */}
                    <div>

                        <p className="max-w-3xl text-[13px] leading-[1.75] text-white/70 sm:text-[14px]">
                            {currentGame.description ||
                                content.description}
                        </p>

                        {/* FEATURES */}
                        <div className="mt-10 grid gap-8 md:grid-cols-3">

                            {content.features.map(
                                (feature, index) => (
                                    <div key={feature.title}>

                                        <div className="text-[46px] font-black leading-none text-cyan-400 sm:text-[50px]">
                                            {String(
                                                index + 1
                                            ).padStart(2, "0")}
                                        </div>

                                        <h3 className="mt-4 text-lg font-black uppercase sm:text-xl">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-white/65">
                                            {feature.description}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </div>

            </section>

            {/* MORE GAMES */}
            <section className="border-t border-white/10 bg-[#05030f]/70 backdrop-blur-sm">

                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>

                            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                                KEEP PLAYING
                            </p>

                            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                                MORE GAMES
                            </h2>

                        </div>

                        <Link
                            href="/our-games"
                            className="text-sm font-black uppercase tracking-wider underline decoration-2 underline-offset-4"
                        >
                            VIEW ALL GAMES
                        </Link>

                    </div>

                    {/* GAME CARDS */}
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {moreGames.map((game) => {

                            const gameImage =
                                GAME_IMAGES[
                                    game.slug
                                ] ||
                                game.thumbnailUrl ||
                                "/hero-img.png";

                            return (
                                <Link
                                    key={
                                        game.id ||
                                        game.slug
                                    }
                                    href={`/our-games/all_games/${game.slug}`}
                                    className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.07] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                >

                                    {/* IMAGE */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-black">

                                        <img
                                            src={gameImage}
                                            alt={game.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <div className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-black uppercase text-white">
                                            PLAY
                                        </div>

                                    </div>

                                    {/* CARD CONTENT */}
                                    <div className="p-6">

                                        <h3 className="text-xl font-black uppercase">
                                            {game.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
                                            {game.description ||
                                                "Explore this exciting Nebuloid game."}
                                        </p>

                                        <div className="mt-5 flex items-center justify-between">

                                            <span className="text-xs font-black uppercase tracking-wider">
                                                DETAILS
                                            </span>

                                            <span className="text-xl font-black transition-transform duration-200 group-hover:translate-x-1">
                                                →
                                            </span>

                                        </div>

                                    </div>

                                </Link>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* FOOTER CTA */}
            <section className="bg-[#05030f]/80 px-6 py-20 text-white backdrop-blur-sm lg:px-10">

                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">

                    <div>

                        <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
                            NEBULOID GAMES
                        </p>

                        <h2 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-none sm:text-5xl">
                            READY TO PLAY?
                        </h2>

                    </div>

                    <Link
                        href="/our-games"
                        className="rounded-full bg-yellow-400 px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-yellow-300"
                    >
                        EXPLORE ALL GAMES
                    </Link>

                </div>

            </section>

        </main>
    );
}