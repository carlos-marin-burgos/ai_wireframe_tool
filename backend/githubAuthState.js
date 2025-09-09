// Simple in-memory state store for GitHub OAuth (development only)
const STATE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const states = new Map();

function prune() {
  const now = Date.now();
  for (const [k, v] of states.entries()) {
    if (now - v.created > STATE_TTL_MS) states.delete(k);
  }
}

module.exports = {
  save(state, data) {
    prune();
    states.set(state, data);
  },
  consume(state) {
    prune();
    if (!states.has(state)) return false;
    states.delete(state);
    return true;
  },
};
