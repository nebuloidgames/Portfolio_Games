/**
 * generate_word.js
 * Word Search Grid Generator for Word Hunt
 * Generates a 7x7 letter grid containing target words placed horizontally, vertically, or diagonally.
 */

const DIRECTIONS = [
  { r: 0, c: 1 }, // Horizontal right
  { r: 1, c: 0 }, // Vertical down
  { r: 1, c: 1 }, // Diagonal down-right
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Checks if two cells are adjacent (including diagonals)
 */
export function isAdjacent(c1, c2) {
  if (!c1 || !c2) return false;
  const dr = Math.abs(c1.r - c2.r);
  const dc = Math.abs(c1.c - c2.c);
  return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
}

/**
 * Generates a word search board for a given set of words
 * @param {string[]} wordsList - List of words available for the level
 * @param {number} numWordsToPlace - Number of words to put in this board (default 3)
 * @param {number} gridSize - Grid dimensions (default 7x7)
 * @returns {Object} { grid: Array(7x7), targetWords: string[], placedWords: Array }
 */
export function generateBoard(
  wordsList = [],
  numWordsToPlace = 3,
  gridSize = 7,
) {
  // Filter words that can fit in the grid (length <= gridSize)
  let validWords = wordsList
    .map((w) => w.toUpperCase().trim())
    .filter((w) => w.length > 1 && w.length <= gridSize);

  if (validWords.length === 0) {
    validWords = ["CAT", "DOG", "BAT", "RAT", "MAT"];
  }

  // Pick target words
  const shuffledWords = [...validWords].sort(() => 0.5 - Math.random());
  const selectedTargets = shuffledWords.slice(
    0,
    Math.min(numWordsToPlace, shuffledWords.length),
  );

  // Initialize empty grid
  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  let placedWords = [];

  // Sort longest words first for better placement packing
  const wordsToTry = [...selectedTargets].sort((a, b) => b.length - a.length);

  for (const word of wordsToTry) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 150;

    const shuffledDirs = [...DIRECTIONS].sort(() => 0.5 - Math.random());

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const dir = shuffledDirs[attempts % shuffledDirs.length];

      const minR = dir.r < 0 ? word.length - 1 : 0;
      const maxR = dir.r > 0 ? gridSize - word.length : gridSize - 1;
      const minC = dir.c < 0 ? word.length - 1 : 0;
      const maxC = dir.c > 0 ? gridSize - word.length : gridSize - 1;

      if (minR > maxR || minC > maxC) continue;

      const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
      const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

      let fits = true;
      const coords = [];

      for (let i = 0; i < word.length; i++) {
        const currR = startR + i * dir.r;
        const currC = startC + i * dir.c;
        const cell = grid[currR][currC];

        if (cell !== null && cell !== word[i]) {
          fits = false;
          break;
        }
        coords.push({ r: currR, c: currC });
      }

      if (fits) {
        coords.forEach(({ r, c }, idx) => {
          grid[r][c] = word[idx];
        });

        placedWords.push({
          word,
          coords,
        });
        placed = true;
      }
    }
  }

  const actualTargets = placedWords.map((p) => p.word);

  // Fill remaining empty cells with random letters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return {
    grid,
    targetWords: actualTargets,
    placedWords,
  };
}

/**
 * Splits level words between Team A and Team B and generates their respective boards
 * @param {string[]} levelWords - Available words for the level from word.js
 * @param {number} wordsPerTeam - Words assigned to each team (default 3)
 * @param {number} gridSize - Board size (default 7)
 */
export function generateTeamGame(
  levelWords = [],
  wordsPerTeam = 3,
  gridSize = 7,
) {
  if (!levelWords || levelWords.length === 0) {
    levelWords = [
      "ONE",
      "TWO",
      "THREE",
      "FOUR",
      "FIVE",
      "SIX",
      "SEVEN",
      "EIGHT",
      "NINE",
      "TEN",
    ];
  }

  // Filter words that fit in the grid
  const fittingWords = levelWords.filter((w) => w.length <= gridSize);
  const pool =
    fittingWords.length >= wordsPerTeam * 2 ? fittingWords : levelWords;

  const shuffled = [...pool].sort(() => 0.5 - Math.random());

  // Assign distinct sets of words to Team A and Team B
  const half = Math.ceil(shuffled.length / 2);
  const wordsA = shuffled.slice(0, half);
  const wordsB =
    shuffled.slice(half).length >= wordsPerTeam
      ? shuffled.slice(half)
      : shuffled;

  const teamABoard = generateBoard(wordsA, wordsPerTeam, gridSize);
  const teamBBoard = generateBoard(wordsB, wordsPerTeam, gridSize);

  return {
    teamA: teamABoard,
    teamB: teamBBoard,
  };
}

/**
 * Evaluates the player's current selection
 * - Returns { type: 'MATCH', word } if matches a target word
 * - Returns { type: 'WRONG', word } if length reaches target word length and is incorrect
 * - Returns { type: 'CONTINUE', word } if still typing/prefix
 */
export function evaluateSelection(
  selectedCoords,
  grid,
  targetWords,
  alreadyFound = new Set(),
) {
  if (!selectedCoords || selectedCoords.length === 0) {
    return { type: "CONTINUE", word: "" };
  }

  const forwardStr = selectedCoords.map(({ r, c }) => grid[r][c]).join("");
  const backwardStr = [...forwardStr].reverse().join("");

  const remainingTargets = targetWords.filter((w) => !alreadyFound.has(w));
  if (remainingTargets.length === 0) {
    return { type: "CONTINUE", word: forwardStr };
  }

  // 1. Check if forward or backward matches any remaining target word
  for (const target of remainingTargets) {
    if (forwardStr === target || backwardStr === target) {
      return { type: "MATCH", word: target, targetMatched: target };
    }
  }

  // 2. Length checking
  const targetLengths = remainingTargets.map((w) => w.length);
  const minLen = Math.min(...targetLengths);
  const maxLen = Math.max(...targetLengths);

  // If clicked letters count reached target word length:
  if (selectedCoords.length >= minLen) {
    // Check if it can be a prefix of any longer target word
    const couldBeLongerWord = remainingTargets.some(
      (target) =>
        target.length > selectedCoords.length &&
        (target.startsWith(forwardStr) || target.startsWith(backwardStr)),
    );

    if (!couldBeLongerWord || selectedCoords.length >= maxLen) {
      return { type: "WRONG", word: forwardStr };
    }
  }

  return { type: "CONTINUE", word: forwardStr };
}

export default {
  isAdjacent,
  generateBoard,
  generateTeamGame,
  evaluateSelection,
};
