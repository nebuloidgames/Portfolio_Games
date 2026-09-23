import { shuffleCards } from "./shuffleCards";

const DIFF_MAP = {
  nursery: { pairs: 4, columns: 4, label: "Nursery", maxVal: 5, minVal: 1, ops: ["+"] },
  primary: { pairs: 6, columns: 4, label: "Primary", maxVal: 10, minVal: 1, ops: ["+", "-"] },
  middle: { pairs: 8, columns: 4, label: "Middle", maxVal: 20, minVal: 5, ops: ["+", "-", "*"] },
  high: { pairs: 10, columns: 5, label: "High", maxVal: 50, minVal: 10, ops: ["+", "-", "*", "÷"] },
  gamer: { pairs: 12, columns: 6, label: "Gamer", maxVal: 100, minVal: 20, ops: ["+", "-", "*", "÷"] },
};

export const DIFFICULTY_CONFIG = {
  nursery: { pairs: 4, columns: 4, label: "Nursery" },
  primary: { pairs: 6, columns: 4, label: "Primary" },
  middle: { pairs: 8, columns: 4, label: "Middle" },
  high: { pairs: 10, columns: 5, label: "High" },
  gamer: { pairs: 12, columns: 6, label: "Gamer" },
};

export function createCards(difficulty = "primary") {
  const diff = DIFF_MAP[difficulty];
  if (!diff) {
    throw new Error(`Unknown difficulty: ${difficulty}`);
  }

  const cards = [];
  for(let i=1; i<=diff.pairs; i++) {
    let v = Math.floor(Math.random() * diff.maxVal) + diff.minVal;
    let o = diff.ops[Math.floor(Math.random() * diff.ops.length)];
    let a = Math.floor(Math.random() * diff.maxVal) + diff.minVal;
    let expr = o === "+" ? `${v-a} + ${a}` : o === "-" ? `${v+a} - ${a}` : o === "*" || o === "×" ? `${v} × 1` : `${v*a} ÷ ${a}`;
    
    cards.push({ id: `card-${i}-a`, val: v, lbl: expr });
    cards.push({ id: `card-${i}-b`, val: v, lbl: `${v}` });
  }

  return shuffleCards(cards);
}
