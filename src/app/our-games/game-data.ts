import {
  isUnlocked as checkUnlocked,
  GAME_ORDER,
  GAME_URLS,
  type GameItem,
  type User,
} from "../components/hero-data";

export interface GameCard extends GameItem {
  category: string;
  color: string;
  /** The longer "about this game" copy shown in the info panel. */
  about: GameAbout;
}

export interface GameAbout {
  eyebrow: string;
  headline: string;
  description: string;
  features: { title: string; description: string }[];
}


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

const ABOUT: Record<string, GameAbout> = {
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
        description: "Look carefully at every part of the challenge.",
      },
      {
        title: "DECIDE",
        description: "Choose the correct action before the timer runs out.",
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
        description: "Keep your attention on the target appearing on screen.",
      },
      {
        title: "REACT",
        description: "React quickly when the correct brand appears.",
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
        description: "Identify the correct color combination.",
      },
      {
        title: "REACT",
        description: "Make quick decisions before the timer runs out.",
      },
      {
        title: "MASTER",
        description: "Complete every level with speed and accuracy.",
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
        description: "Look carefully at every emoji combination.",
      },
      {
        title: "THINK",
        description: "Connect the clues and discover the hidden answer.",
      },
      {
        title: "SOLVE",
        description: "Complete the puzzle and unlock the next challenge.",
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
        description: "Keep your character flying at the right height.",
      },
      {
        title: "DODGE",
        description: "Avoid every obstacle standing in your way.",
      },
      {
        title: "SURVIVE",
        description: "Stay alive as long as possible and beat your score.",
      },
    ],
  },

  "logo-quiz": {
    eyebrow: "QUIZ GAME",
    headline: "Can You Recognize The Logo?",
    description: "Test your knowledge by identifying brands from their logos.",
    features: [
      {
        title: "LOOK",
        description: "Study the logo shown on the screen.",
      },
      {
        title: "GUESS",
        description: "Use your brand knowledge to find the correct answer.",
      },
      {
        title: "COMPLETE",
        description: "Answer correctly and progress through the quiz.",
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
        description: "Use your mathematical skills to solve each challenge.",
      },
      {
        title: "PLAN",
        description: "Choose your moves carefully before revealing the board.",
      },
      {
        title: "WIN",
        description: "Clear the challenge and progress to harder levels.",
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
        description: "Pay close attention to the sequence shown to you.",
      },
      {
        title: "REMEMBER",
        description: "Store the sequence in your memory.",
      },
      {
        title: "REPEAT",
        description: "Reproduce the sequence accurately to continue.",
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
        description: "Explore the board to find hidden pairs.",
      },
      {
        title: "REMEMBER",
        description: "Remember where each item was placed.",
      },
      {
        title: "MATCH",
        description: "Match every pair to complete the level.",
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
        description: "Understand the number pattern before making a move.",
      },
      {
        title: "SOLVE",
        description: "Use logic to find the correct solution.",
      },
      {
        title: "PROGRESS",
        description: "Complete every challenge and move to the next level.",
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
        description: "Keep your eyes on the screen at all times.",
      },
      {
        title: "REACT",
        description: "Respond immediately when the target appears.",
      },
      {
        title: "RUSH",
        description: "Improve your reaction time through every level.",
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
        description: "Type the displayed text as quickly as possible.",
      },
      {
        title: "ACCURACY",
        description: "Avoid mistakes while maintaining your speed.",
      },
      {
        title: "BATTLE",
        description: "Improve your typing performance and beat every level.",
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
        description: "Position each block carefully before dropping it.",
      },
      {
        title: "STACK",
        description: "Build your tower while keeping it balanced.",
      },
      {
        title: "MASTER",
        description: "Reach higher levels with perfect timing.",
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
        description: "Focus carefully on every target.",
      },
      {
        title: "SHOOT",
        description: "Hit the target with speed and precision.",
      },
      {
        title: "SCORE",
        description: "Keep improving your accuracy and reach higher scores.",
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
        description: "Use speed and accuracy to win the tug of war.",
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
        description: "Study the colors and available containers.",
      },
      {
        title: "SORT",
        description: "Move colors strategically into the correct tubes.",
      },
      {
        title: "COMPLETE",
        description: "Sort every color to finish the level.",
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
        description: "Scan the board carefully for hidden words.",
      },
      {
        title: "FIND",
        description: "Connect letters and discover the correct words.",
      },
      {
        title: "COMPLETE",
        description: "Find all required words and finish the level.",
      },
    ],
  },
};

export const GAMES: GameCard[] = GAME_ORDER.map((slug) => ({
  id: slug,
  slug,
  title: TITLES[slug] ?? slug,
  description: DESCRIPTIONS[slug] ?? null,
  thumbnailUrl: GAME_IMAGES[slug] ?? null,
  gameUrl: GAME_URLS[slug] ?? "",
  category: CATEGORIES[slug] ?? "Arcade",
  color: COLORS[slug] ?? "#7c4dff",
  about: ABOUT[slug] ?? {
    eyebrow: "NEBULOID GAME",
    headline: TITLES[slug] ?? slug,
    description:
      DESCRIPTIONS[slug] ??
      "A fun and challenging game from the Nebuloid Games collection.",
    features: [],
  },
}));

export const isUnlocked = (game: GameCard, user: User | null) =>
  checkUnlocked(game, user);

export type { User };
