const bcrypt = require("bcryptjs");
const { findByUserId } = require("../repositories/clientRepository");
const { AppError } = require("../utils/errors");

async function validateClientCredentials({ userId, apiKey, originHost }) {
  if (!userId || !apiKey) {
    throw new AppError("Missing x-user-id or x-api-key header", 401);
  }

  const client = await findByUserId(userId);

  if (!client) {
    throw new AppError("Client not found", 401);
  }

  if (client.status !== "active") {
    throw new AppError("Client is inactive", 403);
  }

  const isValidApiKey = await bcrypt.compare(apiKey, client.api_key_hash);
  if (!isValidApiKey) {
    throw new AppError("Invalid API key", 401);
  }

  if (client.allowed_domain && originHost && client.allowed_domain.toLowerCase() !== originHost.toLowerCase()) {
    throw new AppError("Domain not allowed for this client", 403);
  }

  return client;
}

module.exports = {
  validateClientCredentials
};
