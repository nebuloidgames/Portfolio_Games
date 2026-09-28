export interface GameItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  gameUrl: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: string;
}

export const GAME_ORDER = [
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

export const GAME_IMAGES: Record<string, string> = {
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

export const FALLBACK_GAMES: GameItem[] = GAME_ORDER.map((slug) => ({
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

/* ---- Nebula palette (shared by the desktop and mobile hero) ---- */
export const VIOLET = "#7c4dff";
export const MAGENTA = "#ff4fd8";
export const CYAN = "#36e0ff";

export const pad = (n: number) => (n < 10 ? "0" : "") + n;

export const orderGames = (games: GameItem[]): GameItem[] => {
  const bySlug = new Map(games.map((game) => [game.slug, game]));

  const ordered = GAME_ORDER.map((slug) => bySlug.get(slug)).filter(
    Boolean,
  ) as GameItem[];

  const remaining = games.filter((game) => !GAME_ORDER.includes(game.slug));

  return [...ordered, ...remaining];
};

export const isUnlocked = (game: GameItem, user: User | null) =>
  user !== null ||
  game.slug === "catch-the-brand" ||
  game.slug === "target-shooter";
