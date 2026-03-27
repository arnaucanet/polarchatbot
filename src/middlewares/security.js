const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    if (env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-user-id", "x-api-key"]
});

const chatRateLimit = rateLimit({
  windowMs: env.CHAT_RATE_LIMIT_WINDOW * 1000,
  limit: env.CHAT_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests" }
});

const dataRateLimit = rateLimit({
  windowMs: env.DATA_RATE_LIMIT_WINDOW * 1000,
  limit: env.DATA_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests" }
});

module.exports = {
  helmetMiddleware: helmet(),
  corsMiddleware,
  chatRateLimit,
  dataRateLimit
};
