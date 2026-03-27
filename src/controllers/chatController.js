const { chatRequestSchema } = require("../validators/chatValidator");
const { enforceClientRateLimit } = require("../services/rateLimitService");
const { getChatCompletion } = require("../services/openaiService");
const { createChatbotLog } = require("../repositories/logRepository");
const { AppError } = require("../utils/errors");
const env = require("../config/env");

async function chat(req, res, next) {
  const userId = req.client?.user_id;
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  let responseCode = 500;
  let messageLength = 0;

  try {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid request body", 400, parsed.error.flatten());
    }

    const { message } = parsed.data;
    messageLength = message.length;

    enforceClientRateLimit({
      userId,
      maxPerMinute: req.client.rate_limit_per_min
    });

    const reply = await getChatCompletion({ message });

    responseCode = 200;
    res.status(200).json({
      ok: true,
      user_id: userId,
      model: env.OPENAI_MODEL,
      reply
    });
  } catch (error) {
    responseCode = error.statusCode || 500;
    next(error);
  } finally {
    if (userId) {
      createChatbotLog({
        userId,
        ip,
        messageLength,
        responseCode
      }).catch(() => {});
    }
  }
}

module.exports = {
  chat
};
