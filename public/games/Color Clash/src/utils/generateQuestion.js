import { COLORS, DIFFICULTY_CONFIG } from '../data/colors';

/**
 * Fisher-Yates array shuffle helper
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a Stroop-effect color question based on current difficulty level.
 * 
 * @param {string} difficultyLevel - "EASY" | "MEDIUM" | "HARD"
 * @param {object|null} previousQuestion - Optional previous question to avoid identical consecutive questions
 * @returns {object} Question object
 */
export function generateQuestion(difficultyLevel = "EASY", previousQuestion = null) {
  const config = DIFFICULTY_CONFIG[difficultyLevel] || DIFFICULTY_CONFIG.EASY;
  const count = config.optionsCount;

  // 1. Pick a random word color object
  const wordIndex = Math.floor(Math.random() * COLORS.length);
  const wordColor = COLORS[wordIndex];

  // 2. Pick a display color.
  // 90% chance to pick a different color (incongruent Stroop effect)
  // 10% chance to pick the same color (surprise congruent trial)
  let displayColor;
  const isCongruent = Math.random() < 0.10;

  if (isCongruent) {
    displayColor = wordColor;
  } else {
    const candidateColors = COLORS.filter((c) => c.name !== wordColor.name);
    const randomDiffIndex = Math.floor(Math.random() * candidateColors.length);
    displayColor = candidateColors[randomDiffIndex];
  }

  // Avoid generating exact identical question sequentially if possible
  if (
    previousQuestion &&
    previousQuestion.word === wordColor.name &&
    previousQuestion.correctAnswer === displayColor.name
  ) {
    // Pick another display color
    const otherColors = COLORS.filter(
      (c) => c.name !== displayColor.name && c.name !== wordColor.name
    );
    if (otherColors.length > 0) {
      displayColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
  }

  const correctAnswer = displayColor.name;

  // 3. Assemble answer choices:
  // Must include:
  // - Correct Answer (displayColor)
  // - The text word's color (the cognitive distractor, if different)
  // - Fill remaining slots with unique random colors up to 'count'
  const optionsSet = new Set();
  optionsSet.add(displayColor);

  if (wordColor.name !== displayColor.name && optionsSet.size < count) {
    optionsSet.add(wordColor);
  }

  // Fill remaining slots
  const remainingColors = shuffleArray(COLORS.filter((c) => !optionsSet.has(c)));
  for (const c of remainingColors) {
    if (optionsSet.size >= count) break;
    optionsSet.add(c);
  }

  // 4. Shuffle the final options
  const shuffledOptions = shuffleArray(Array.from(optionsSet));

  return {
    word: wordColor.name,
    displayColor: displayColor,
    correctAnswer: correctAnswer,
    options: shuffledOptions,
    difficulty: difficultyLevel,
    timestamp: Date.now()
  };
}
