const STORAGE_KEYS = {
  BEST_SCORE: 'logoQuiz_bestScore',
  GAMES_PLAYED: 'logoQuiz_gamesPlayed',
  TOTAL_CORRECT: 'logoQuiz_totalCorrect',
  SOUND_ENABLED: 'logoQuiz_soundEnabled',
};

export const storage = {
  getBestScore() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  setBestScore(score) {
    try {
      const current = this.getBestScore();
      if (score > current) {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
        return true; // New high score!
      }
      return false;
    } catch {
      return false;
    }
  },

  getGamesPlayed() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  incrementGamesPlayed() {
    try {
      const next = this.getGamesPlayed() + 1;
      localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, next.toString());
      return next;
    } catch {
      return 1;
    }
  },

  getSoundEnabled() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return val !== null ? val === 'true' : true; // Default ON
    } catch {
      return true;
    }
  },

  setSoundEnabled(enabled) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
    } catch {}
  },
};
