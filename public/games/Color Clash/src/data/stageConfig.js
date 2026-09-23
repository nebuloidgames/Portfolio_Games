/**
 * Color Clash / 2048 Race - Stage Configuration & Progress Persistence
 * 
 * Levels: EASY, MEDIUM, HARD
 * Each level contains 5 Stages: S-1 to S-5 with progressive targets and unlocks.
 */

export const STAGES_PER_LEVEL = 5;

export const STAGE_CONFIG = {
  EASY: [
    {
      stage: 1,
      id: 'S-1',
      title: 'Stage 01',
      targetQuestions: 5,
      timeLimit: 59,
      optionsCount: 4,
      scoreMultiplier: 1.0,
      description: 'Warm up: 5 questions with 4 color options (59s)'
    },
    {
      stage: 2,
      id: 'S-2',
      title: 'Stage 02',
      targetQuestions: 8,
      timeLimit: 59,
      optionsCount: 4,
      scoreMultiplier: 1.0,
      description: 'Pick up the pace: 8 questions (59s)'
    },
    {
      stage: 3,
      id: 'S-3',
      title: 'Stage 03',
      targetQuestions: 10,
      timeLimit: 59,
      optionsCount: 4,
      scoreMultiplier: 1.1,
      description: 'Stay focused: 10 questions (59s)'
    },
    {
      stage: 4,
      id: 'S-4',
      title: 'Stage 04',
      targetQuestions: 12,
      timeLimit: 59,
      optionsCount: 4,
      scoreMultiplier: 1.15,
      description: 'Speed test: 12 questions (59s)'
    },
    {
      stage: 5,
      id: 'S-5',
      title: 'Stage 05',
      targetQuestions: 15,
      timeLimit: 59,
      optionsCount: 4,
      scoreMultiplier: 1.25,
      description: 'Easy Master: 15 questions to conquer Easy mode (59s)'
    }
  ],
  MEDIUM: [
    {
      stage: 1,
      id: 'S-1',
      title: 'Stage 01',
      targetQuestions: 5,
      timeLimit: 59,
      optionsCount: 5,
      scoreMultiplier: 1.25,
      description: 'Medium Entry: 5 questions with 5 color options (59s)'
    },
    {
      stage: 2,
      id: 'S-2',
      title: 'Stage 02',
      targetQuestions: 8,
      timeLimit: 59,
      optionsCount: 5,
      scoreMultiplier: 1.3,
      description: 'Brain sprint: 8 questions (59s)'
    },
    {
      stage: 3,
      id: 'S-3',
      title: 'Stage 03',
      targetQuestions: 10,
      timeLimit: 59,
      optionsCount: 5,
      scoreMultiplier: 1.35,
      description: 'Rapid reflex: 10 questions (59s)'
    },
    {
      stage: 4,
      id: 'S-4',
      title: 'Stage 04',
      targetQuestions: 12,
      timeLimit: 59,
      optionsCount: 5,
      scoreMultiplier: 1.4,
      description: 'High intensity: 12 questions (59s)'
    },
    {
      stage: 5,
      id: 'S-5',
      title: 'Stage 05',
      targetQuestions: 15,
      timeLimit: 59,
      optionsCount: 5,
      scoreMultiplier: 1.5,
      description: 'Medium Champion: 15 questions across 5 colors (59s)'
    }
  ],
  HARD: [
    {
      stage: 1,
      id: 'S-1',
      title: 'Stage 01',
      targetQuestions: 5,
      timeLimit: 59,
      optionsCount: 6,
      scoreMultiplier: 1.5,
      description: 'Hard Entry: 5 questions across all 6 colors (59s)'
    },
    {
      stage: 2,
      id: 'S-2',
      title: 'Stage 02',
      targetQuestions: 8,
      timeLimit: 59,
      optionsCount: 6,
      scoreMultiplier: 1.6,
      description: 'Lightning reflexes: 8 questions (59s)'
    },
    {
      stage: 3,
      id: 'S-3',
      title: 'Stage 03',
      targetQuestions: 10,
      timeLimit: 59,
      optionsCount: 6,
      scoreMultiplier: 1.7,
      description: 'Mastery challenge: 10 questions (59s)'
    },
    {
      stage: 4,
      id: 'S-4',
      title: 'Stage 04',
      targetQuestions: 12,
      timeLimit: 59,
      optionsCount: 6,
      scoreMultiplier: 1.8,
      description: 'Grandmaster test: 12 questions (59s)'
    },
    {
      stage: 5,
      id: 'S-5',
      title: 'Stage 05',
      targetQuestions: 15,
      timeLimit: 59,
      optionsCount: 6,
      scoreMultiplier: 2.0,
      description: 'Supreme Legend: 15 questions with 6 choices (59s)'
    }
  ]
};

const STORAGE_KEY = 'color_clash_stage_progression_v1';

/**
 * Get the initial default progression object.
 * Stage 1 of each difficulty is unlocked by default.
 */
function getDefaultProgression() {
  return {
    EASY: { unlockedStage: 1, completedStages: {}, highScores: {} },
    MEDIUM: { unlockedStage: 1, completedStages: {}, highScores: {} },
    HARD: { unlockedStage: 1, completedStages: {}, highScores: {} }
  };
}

/**
 * Read stage progression from LocalStorage
 */
export function getStoredProgression() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgression();
    const parsed = JSON.parse(raw);
    return {
      EASY: parsed.EASY || { unlockedStage: 1, completedStages: {}, highScores: {} },
      MEDIUM: parsed.MEDIUM || { unlockedStage: 1, completedStages: {}, highScores: {} },
      HARD: parsed.HARD || { unlockedStage: 1, completedStages: {}, highScores: {} }
    };
  } catch {
    return getDefaultProgression();
  }
}

/**
 * Save stage completion & unlock the next stage
 * @param {string} difficulty - 'EASY' | 'MEDIUM' | 'HARD'
 * @param {number} stageNum - Stage number (1..5)
 * @param {number} score - Achieved score
 * @param {number} stars - Stars earned (1..3)
 * @returns {object} Updated progression
 */
export function recordStageCompletion(difficulty, stageNum, score = 0, stars = 3) {
  try {
    const progression = getStoredProgression();
    const diffData = progression[difficulty] || { unlockedStage: 1, completedStages: {}, highScores: {} };

    // Mark current stage completed
    diffData.completedStages[stageNum] = Math.max(diffData.completedStages[stageNum] || 0, stars);
    diffData.highScores[stageNum] = Math.max(diffData.highScores[stageNum] || 0, score);

    // Unlock next stage if currently at max unlocked stage
    if (stageNum >= diffData.unlockedStage && stageNum < STAGES_PER_LEVEL) {
      diffData.unlockedStage = stageNum + 1;
    }

    progression[difficulty] = diffData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progression));
    return progression;
  } catch (e) {
    console.error('Error saving stage progression:', e);
    return getDefaultProgression();
  }
}

/**
 * Reset all progression (for debugging or user reset)
 */
export function resetStoredProgression() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return getDefaultProgression();
  } catch {
    return getDefaultProgression();
  }
}
