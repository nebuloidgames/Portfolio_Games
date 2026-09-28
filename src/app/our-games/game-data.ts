import {
  isUnlocked as checkUnlocked,
  type GameItem,
  type User,
} from "../components/hero-data";

export interface GameCard extends GameItem {
  category: string;
  color: string;
  /** The existing info/story page for this game (the round "..." button). */
  detailUrl: string;
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
  "color-clash":
    "Ignore the word and choose the correct color as fast as you can.",
  "catch-the-brand":
    "Spot the correct brand and catch it before it disappears.",
  "emoji-puzzle": "Decode emoji combinations and solve the puzzle quickly.",
  "logo-quiz": "Identify familiar logos and prove your brand knowledge.",
  "2048-race": "Merge tiles, build your score, and race your way to 2048.",
  "bomb-defusal": "Read the clues, find the sequence, and beat the timer.",
  "memory-sequence": "Watch the pattern, remember the sequence, and repeat it.",
  "target-shooter": "Aim fast, stay focused, and hit the moving targets.",
  "number-puzzle": "Use logic and numbers to solve each challenge.",
  "water-color-sort":
    "Sort the colors into the correct tubes with smart moves.",
  "flappy-bird": "Navigate through the gaps and keep your run alive.",
  "math-minesweeper": "Use mathematical clues to clear the board safely.",
  "word-hunt": "Find the hidden words, crack the clues, and beat the clock.",
  "stack-master": "Align every block, build higher, and reach the top.",
};

const CATEGORIES: Record<string, string> = {
  "math-tug-of-war": "Math",
  "reaction-rush": "Reflex",
  "memory-match": "Memory",
  "speed-typing-battle": "Typing",
  "color-clash": "Reflex",
  "catch-the-brand": "Reflex",
  "emoji-puzzle": "Puzzle",
  "logo-quiz": "Quiz",
  "2048-race": "Puzzle",
  "bomb-defusal": "Speed",
  "memory-sequence": "Memory",
  "target-shooter": "Reflex",
  "number-puzzle": "Logic",
  "water-color-sort": "Puzzle",
  "flappy-bird": "Arcade",
  "math-minesweeper": "Logic",
  "word-hunt": "Words",
  "stack-master": "Arcade",
};

const COLORS: Record<string, string> = {
  "math-tug-of-war": "#3a6bff",
  "reaction-rush": "#ff9a2e",
  "memory-match": "#e8b43a",
  "speed-typing-battle": "#ff5a5a",
  "color-clash": "#2fd3c9",
  "catch-the-brand": "#ffb23a",
  "emoji-puzzle": "#ff8ad1",
  "logo-quiz": "#6ee0ff",
  "2048-race": "#ffd23a",
  "bomb-defusal": "#ff4d6d",
  "memory-sequence": "#a6e35d",
  "target-shooter": "#5a74ff",
  "number-puzzle": "#2fd39a",
  "water-color-sort": "#ff5fc8",
  "flappy-bird": "#3ad6a0",
  "math-minesweeper": "#8a6bff",
  "word-hunt": "#3aa8ff",
  "stack-master": "#b69cff",
};

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

/** The real, directly-playable static game — what the Play button opens. */
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

export const GAMES: GameCard[] = GAME_ORDER.map((slug) => ({
  id: slug,
  slug,
  title: TITLES[slug] ?? slug,
  description: DESCRIPTIONS[slug] ?? null,
  thumbnailUrl: GAME_IMAGES[slug] ?? null,
  gameUrl: GAME_URLS[slug] ?? "",
  detailUrl: `/our-games/all_games/${slug}`,
  category: CATEGORIES[slug] ?? "Arcade",
  color: COLORS[slug] ?? "#7c4dff",
}));

export const isUnlocked = (game: GameCard, user: User | null) =>
  checkUnlocked(game, user);

export type { User };
