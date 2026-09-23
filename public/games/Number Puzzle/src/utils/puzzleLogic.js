// 8-Puzzle Game Logic (Number Path) with Dynamic Number Ranges

// Generate goal state for any starting number (e.g. 1 -> [1..8, null], 11 -> [11..18, null])
export function getGoalState(startNum = 1) {
  const state = [];
  for (let i = 0; i < 8; i++) {
    state.push(startNum + i);
  }
  state.push(null);
  return state;
}

export const GOAL_STATE = getGoalState(1);

// Check if a tile can slide into the empty slot
export function canMoveTile(tileIndex, board) {
  const emptyIndex = board.indexOf(null);
  if (tileIndex === emptyIndex || tileIndex < 0 || tileIndex > 8) return false;

  const tileRow = Math.floor(tileIndex / 3);
  const tileCol = tileIndex % 3;
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;

  const rowDiff = Math.abs(tileRow - emptyRow);
  const colDiff = Math.abs(tileCol - emptyCol);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Get all movable tile indices for the current board
export function getMovableTiles(board) {
  const emptyIndex = board.indexOf(null);
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;
  const movable = [];

  const deltas = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
  ];

  deltas.forEach(([dr, dc]) => {
    const r = emptyRow + dr;
    const c = emptyCol + dc;
    if (r >= 0 && r < 3 && c >= 0 && c < 3) {
      movable.push(r * 3 + c);
    }
  });

  return movable;
}

// Execute move and return new board
export function moveTile(tileIndex, board) {
  if (!canMoveTile(tileIndex, board)) return null;

  const emptyIndex = board.indexOf(null);
  const newBoard = [...board];
  newBoard[emptyIndex] = newBoard[tileIndex];
  newBoard[tileIndex] = null;
  return newBoard;
}

// Check if current board matches the goal state
export function isSolved(board, startNum = 1) {
  for (let i = 0; i < 8; i++) {
    if (board[i] !== startNum + i) return false;
  }
  return board[8] === null;
}

// Generate guaranteed-solvable board by random walk from goal state
export function generateSolvableBoard(scrambleMoves = 40, startNum = 1) {
  let board = getGoalState(startNum);
  let lastMove = -1;

  for (let i = 0; i < scrambleMoves; i++) {
    const movable = getMovableTiles(board).filter(idx => idx !== lastMove);
    const chosen = movable[Math.floor(Math.random() * movable.length)];
    const emptyIndex = board.indexOf(null);

    board = moveTile(chosen, board);
    lastMove = emptyIndex; // prevent immediately moving back to previous tile
  }

  // If accidentally ended in solved state, make 2 extra moves
  if (isSolved(board, startNum)) {
    const movable = getMovableTiles(board);
    const chosen = movable[0];
    board = moveTile(chosen, board);
  }

  return board;
}

// Calculate Manhattan distance heuristic for A* solver
function manhattanDistance(board, startNum = 1) {
  let distance = 0;
  for (let i = 0; i < 9; i++) {
    const val = board[i];
    if (val !== null) {
      const targetIdx = val - startNum;
      const targetRow = Math.floor(targetIdx / 3);
      const targetCol = targetIdx % 3;
      const currRow = Math.floor(i / 3);
      const currCol = i % 3;
      distance += Math.abs(targetRow - currRow) + Math.abs(targetCol - currCol);
    }
  }
  return distance;
}

// A* Solver to find the next optimal move (for Hint feature)
export function getNextHintTile(board, startNum = 1) {
  if (isSolved(board, startNum)) return null;

  const goal = getGoalState(startNum);
  const goalKey = goal.join(',');
  const startKey = board.join(',');

  const openSet = [{
    board: [...board],
    path: [],
    g: 0,
    h: manhattanDistance(board, startNum),
    f: manhattanDistance(board, startNum)
  }];

  const visited = new Set([startKey]);
  let iterations = 0;
  const MAX_ITER = 3000;

  while (openSet.length > 0 && iterations < MAX_ITER) {
    iterations++;
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    const currentKey = current.board.join(',');
    if (currentKey === goalKey) {
      return current.path[0] !== undefined ? current.path[0] : null;
    }

    const movable = getMovableTiles(current.board);
    for (const tileIdx of movable) {
      const nextBoard = moveTile(tileIdx, current.board);
      const nextKey = nextBoard.join(',');

      if (!visited.has(nextKey)) {
        visited.add(nextKey);
        const g = current.g + 1;
        const h = manhattanDistance(nextBoard, startNum);
        openSet.push({
          board: nextBoard,
          path: [...current.path, tileIdx],
          g,
          h,
          f: g + h
        });
      }
    }
  }

  // Fallback: Pick movable tile that reduces Manhattan distance the most
  const movable = getMovableTiles(board);
  let bestTile = movable[0];
  let minH = 999;
  for (const t of movable) {
    const nb = moveTile(t, board);
    const h = manhattanDistance(nb, startNum);
    if (h < minH) {
      minH = h;
      bestTile = t;
    }
  }
  return bestTile;
}
