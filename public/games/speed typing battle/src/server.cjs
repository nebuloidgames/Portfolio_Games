const WebSocket = require('ws');
const { randomUUID } = require('crypto');

const PORT = 8787;
const wss = new WebSocket.Server({ port: PORT });
const queues = new Map();
const matches = new Map();

function send(ws, message) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}

function removeFromQueue(ws) {
  for (const [key, list] of queues) {
    const next = list.filter(p => p.ws !== ws);
    if (next.length) queues.set(key, next);
    else queues.delete(key);
  }
}

function finishMatch(match, winnerId) {
  if (!match || match.finished) return;
  match.finished = true;
  const loserId = match.players.find(id => id !== winnerId);
  for (const id of match.players) {
    const p = match.data[id];
    send(p.ws, {
      type: 'round-result',
      winnerId,
      playerId: id,
      opponent: match.data[loserId]?.name || 'Opponent'
    });
  }
  matches.delete(match.id);
}

wss.on('connection', ws => {
  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === 'queue') {
      removeFromQueue(ws);
      const level = Number(msg.level) || 1;
      const key = `level-${level}`;
      const entry = { ws, name: String(msg.name || 'Player').slice(0, 30), level };

      if (!queues.has(key)) queues.set(key, []);
      const queue = queues.get(key);
      const otherIndex = queue.findIndex(p => p.ws !== ws);

      if (otherIndex === -1) {
        queue.push(entry);
        send(ws, { type: 'queued' });
        return;
      }

      const opponent = queue.splice(otherIndex, 1)[0];
      if (!queue.length) queues.delete(key);

      const matchId = randomUUID();
      const startAt = Date.now() + 2500;
      const match = {
        id: matchId,
        level,
        players: [opponent.ws._id, ws._id],
        data: {
          [opponent.ws._id]: { ws: opponent.ws, name: opponent.name, progress: 0, wpm: 0, accuracy: 100 },
          [ws._id]: { ws, name: entry.name, progress: 0, wpm: 0, accuracy: 100 }
        },
        finished: false
      };
      matches.set(matchId, match);

      for (const id of match.players) {
        const me = match.data[id];
        const other = match.data[match.players.find(x => x !== id)];
        send(me.ws, {
          type: 'matched',
          matchId,
          level,
          startAt,
          opponent: { name: other.name }
        });
      }
      return;
    }

    if (msg.type === 'progress' || msg.type === 'finish' || msg.type === 'timeout') {
      const match = matches.get(msg.matchId);
      if (!match || match.finished) return;

      const playerId = ws._id;
      if (!match.data[playerId]) return;

      if (msg.type === 'progress') {
        const p = match.data[playerId];
        p.progress = Math.max(0, Math.min(100, Number(msg.progress) || 0));
        p.wpm = Math.max(0, Number(msg.wpm) || 0);
        p.accuracy = Math.max(0, Math.min(100, Number(msg.accuracy) || 0));

        const otherId = match.players.find(id => id !== playerId);
        send(match.data[otherId]?.ws, {
          type: 'opponent-progress',
          name: p.name,
          progress: p.progress,
          wpm: p.wpm,
          accuracy: p.accuracy
        });
      }

      if (msg.type === 'finish') {
        finishMatch(match, playerId);
      }

      if (msg.type === 'timeout') {
        const otherId = match.players.find(id => id !== playerId);
        if (otherId) finishMatch(match, otherId);
      }
    }
  });

  ws._id = randomUUID();

  ws.on('close', () => {
    removeFromQueue(ws);

    for (const [id, match] of matches) {
      const playerId = ws._id;
      if (!match.data[playerId]) continue;

      const otherId = match.players.find(x => x !== playerId);
      if (otherId && !match.finished) {
        send(match.data[otherId].ws, { type: 'opponent-left' });
      }
      matches.delete(id);
    }
  });
});

console.log(`Speed Typing Battle server running on ws://localhost:${PORT}`);
