const pino = require("pino");
const env = require("./env");

const logger = pino({
  level: env.isProduction ? "info" : "debug",
  redact: {
    paths: ["req.headers.authorization", "req.headers.x-api-key", "env.OPENAI_API_KEY", "db.password"],
    censor: "[REDACTED]"
  }
});

module.exports = logger;
