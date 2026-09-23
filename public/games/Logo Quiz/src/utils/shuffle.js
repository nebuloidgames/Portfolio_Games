export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomQuestions(allQuestions, count = 10, difficulty = 'all') {
  let primaryPool = allQuestions;

  if (difficulty && difficulty !== 'all') {
    primaryPool = allQuestions.filter(
      (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  let selected = shuffleArray(primaryPool).slice(0, count);

  if (selected.length < count) {
    const selectedIds = new Set(selected.map((q) => q.id));
    const fallbackPool = shuffleArray(allQuestions.filter((q) => !selectedIds.has(q.id)));
    const needed = count - selected.length;
    selected = [...selected, ...fallbackPool.slice(0, needed)];
  }

  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}
