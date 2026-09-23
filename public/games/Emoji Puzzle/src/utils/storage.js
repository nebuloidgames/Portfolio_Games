// LocalStorage persistence manager for Emoji Puzzle

const PROGRESS_KEY = 'emoji_puzzle_progress';
const CERTIFICATES_HISTORY_KEY = 'emoji_puzzle_certificates_history';

const DEFAULT_PROGRESS = {
  easy: {
    unlockedLevels: 1, // 1 to 5
    completedLevels: {}, // { 1: { stars: 3, score: 200 } }
  },
  medium: {
    unlockedLevels: 1,
    completedLevels: {},
  },
  hard: {
    unlockedLevels: 1,
    completedLevels: {},
  },
  expert: {
    unlockedLevels: 1,
    completedLevels: {},
  },
  totalScore: 0,
  totalPuzzlesSolved: 0,
};

export const getProgress = () => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      easy: { ...DEFAULT_PROGRESS.easy, ...(parsed.easy || {}) },
      medium: { ...DEFAULT_PROGRESS.medium, ...(parsed.medium || {}) },
      hard: { ...DEFAULT_PROGRESS.hard, ...(parsed.hard || {}) },
      expert: { ...DEFAULT_PROGRESS.expert, ...(parsed.expert || {}) },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
};

export const completeSubLevel = (difficulty, levelNum, stars = 3, scoreEarned = 200) => {
  const current = getProgress();
  const diffData = current[difficulty] || { unlockedLevels: 1, completedLevels: {} };
  
  const prevCompleted = diffData.completedLevels[levelNum];
  const isFirstTime = !prevCompleted;
  
  const updatedCompleted = {
    ...diffData.completedLevels,
    [levelNum]: {
      stars: Math.max(stars, prevCompleted?.stars || 0),
      score: Math.max(scoreEarned, prevCompleted?.score || 0),
    },
  };

  // Next level unlocked (up to level 5)
  const nextUnlocked = Math.max(diffData.unlockedLevels, Math.min(5, levelNum + 1));

  const updatedProgress = {
    ...current,
    [difficulty]: {
      ...diffData,
      unlockedLevels: nextUnlocked,
      completedLevels: updatedCompleted,
    },
    totalScore: current.totalScore + (isFirstTime ? scoreEarned : 0),
    totalPuzzlesSolved: current.totalPuzzlesSolved + (isFirstTime ? 2 : 0),
  };

  saveProgress(updatedProgress);
  return updatedProgress;
};

export const resetProgress = () => {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(CERTIFICATES_HISTORY_KEY);
    return DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
};

// Certificates History Management
export const getCertificatesHistory = () => {
  try {
    const raw = localStorage.getItem(CERTIFICATES_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCertificateToHistory = (certificate) => {
  try {
    const current = getCertificatesHistory();
    // Add unique id if not present
    const certWithId = {
      id: certificate.id || `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...certificate,
      createdAt: new Date().toISOString(),
    };
    const updated = [certWithId, ...current];
    localStorage.setItem(CERTIFICATES_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save certificate history', e);
    return [];
  }
};
