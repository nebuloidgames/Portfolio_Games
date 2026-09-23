export const DIFFICULTY_POINTS = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export function calculateScore({ difficulty = 'easy', isCorrect = false }) {
  if (!isCorrect) {
    return {
      total: 0,
      base: 0,
    };
  }

  const basePoints = DIFFICULTY_POINTS[difficulty.toLowerCase()] || 10;

  return {
    total: basePoints,
    base: basePoints,
  };
}

/**
 * Returns the maximum possible score for a round of the given difficulty
 */
export function getMaxPossibleScore(difficulty = 'easy', totalQuestions = 10) {
  const pts = DIFFICULTY_POINTS[difficulty.toLowerCase()] || 10;
  return totalQuestions * pts;
}

/**
 * Calculates accuracy percentage
 */
export function calculateAccuracy(correctCount, totalCount) {
  if (!totalCount || totalCount <= 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
}

/**
 * Returns rank tier and description based on accuracy percentage
 */
export function getRankTier(accuracy) {
  if (accuracy >= 90) {
    return {
      title: 'Logo Master!',
      subtitle: 'Legendary brand recognition & razor-sharp instincts.',
      icon: '🏆',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-400/40',
    };
  }
  if (accuracy >= 70) {
    return {
      title: 'Brand Expert!',
      subtitle: 'Impressive intuition and brand awareness.',
      icon: '⭐',
      color: 'text-purple-400',
      badgeBg: 'bg-purple-500/20 border-purple-400/40',
    };
  }
  if (accuracy >= 50) {
    return {
      title: 'Nice Try!',
      subtitle: 'Good effort! A few tricky logos got away.',
      icon: '🎯',
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 border-cyan-400/40',
    };
  }
  return {
    title: 'Keep Practicing!',
    subtitle: 'Every quiz sharpens your visual memory. Try again!',
    icon: '💡',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 border-rose-400/40',
  };
}

