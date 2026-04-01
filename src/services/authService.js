const bcrypt = require("bcryptjs");
const { findActiveClients } = require("../repositories/clientRepository");
const { AppError } = require("../utils/errors");

function normalizeBcryptHash(hash) {
  if (typeof hash !== "string") return hash;
  if (hash.startsWith("$2y$")) return `$2a$${hash.slice(4)}`;
  return hash;
}

async function validateClientCredentials({ apiKey, originHost }) {
  if (!apiKey) {
    throw new AppError("Missing x-api-key header", 401);
  }

  const activeClients = await findActiveClients();
  if (!activeClients.length) {
    throw new AppError("No active clients configured", 401);
  }

  for (const client of activeClients) {
    const normalizedHash = normalizeBcryptHash(client.api_key_hash);
    const isValidApiKey = await bcrypt.compare(apiKey, normalizedHash);
    if (!isValidApiKey) {
      continue;
    }

    if (client.allowed_domain && originHost && client.allowed_domain.toLowerCase() !== originHost.toLowerCase()) {
      throw new AppError("Domain not allowed for this client", 403);
    }

    return client;
  }

  throw new AppError("Invalid API key", 401);
}

module.exports = {
  validateClientCredentials
};
