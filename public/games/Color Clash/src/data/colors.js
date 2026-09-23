/**
 * Color Clash - Color Definitions
 * Each color includes its name, hex value, secondary light/dark tones, and glow styles for rich UI effects.
 */

export const COLORS = [
  {
    name: "RED",
    value: "#EF4444",
    bgLight: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.5)",
    glow: "0 0 25px rgba(239, 68, 68, 0.6)"
  },
  {
    name: "BLUE",
    value: "#3B82F6",
    bgLight: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.5)",
    glow: "0 0 25px rgba(59, 130, 246, 0.6)"
  },
  {
    name: "GREEN",
    value: "#22C55E",
    bgLight: "rgba(34, 197, 94, 0.15)",
    border: "rgba(34, 197, 94, 0.5)",
    glow: "0 0 25px rgba(34, 197, 94, 0.6)"
  },
  {
    name: "YELLOW",
    value: "#EAB308",
    bgLight: "rgba(234, 179, 8, 0.15)",
    border: "rgba(234, 179, 8, 0.5)",
    glow: "0 0 25px rgba(234, 179, 8, 0.6)"
  },
  {
    name: "PURPLE",
    value: "#A855F7",
    bgLight: "rgba(168, 85, 247, 0.15)",
    border: "rgba(168, 85, 247, 0.5)",
    glow: "0 0 25px rgba(168, 85, 247, 0.6)"
  },
  {
    name: "ORANGE",
    value: "#F97316",
    bgLight: "rgba(249, 115, 22, 0.15)",
    border: "rgba(249, 115, 22, 0.5)",
    glow: "0 0 25px rgba(249, 115, 22, 0.6)"
  }
];

export const DIFFICULTY_CONFIG = {
  EASY: {
    label: "EASY",
    optionsCount: 4,
    timeLimit: 59,
    scoreMultiplier: 1.0,
    unlockScore: 0,
    badgeColor: "#22C55E"
  },
  MEDIUM: {
    label: "MEDIUM",
    optionsCount: 5,
    timeLimit: 59,
    scoreMultiplier: 1.25,
    unlockScore: 60,
    badgeColor: "#EAB308"
  },
  HARD: {
    label: "HARD",
    optionsCount: 6,
    timeLimit: 59,
    scoreMultiplier: 1.5,
    unlockScore: 150,
    badgeColor: "#EF4444"
  }
};
