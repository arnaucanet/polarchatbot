const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");

if (env.isProduction) {
  app.set("trust proxy", 1);
}

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.APP_ENV }, "Chatbot API started");
});

function shutdown(signal) {
  logger.info({ signal }, "Shutting down server");
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
