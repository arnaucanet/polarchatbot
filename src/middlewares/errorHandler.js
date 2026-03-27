const logger = require("../config/logger");
const { AppError } = require("../utils/errors");

function notFoundHandler(_req, res) {
  res.status(404).json({
    ok: false,
    error: "Route not found"
  });
}

function errorHandler(err, _req, res, _next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  logger.error({ err }, "Unhandled request error");

  res.status(statusCode).json({
    ok: false,
    error: err.message || "Internal server error",
    details: isAppError ? err.details : undefined
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
