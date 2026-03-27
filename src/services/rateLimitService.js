const { AppError } = require("../utils/errors");

const clientBuckets = new Map();

function enforceClientRateLimit({ userId, maxPerMinute }) {
  const now = Date.now();
  const windowMs = 60 * 1000;

  const bucket = clientBuckets.get(userId) || [];
  const validHits = bucket.filter((timestamp) => now - timestamp <= windowMs);

  if (validHits.length >= maxPerMinute) {
    throw new AppError("Client rate limit exceeded", 429);
  }

  validHits.push(now);
  clientBuckets.set(userId, validHits);
}

module.exports = {
  enforceClientRateLimit
};
