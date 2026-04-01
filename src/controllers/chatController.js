const { chatRequestSchema } = require("../validators/chatValidator");
const { enforceClientRateLimit } = require("../services/rateLimitService");
const { getChatCompletion } = require("../services/openaiService");
const { createChatbotLog } = require("../repositories/logRepository");
const { AppError } = require("../utils/errors");
const env = require("../config/env");

async function chat(req, res, next) {
  const startedAt = Date.now();
  const userId = req.client?.user_id;
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  let responseCode = 500;
  let messageLength = 0;
  let usedModel = env.OPENAI_MODEL;
  let promptTokens = null;
  let completionTokens = null;
  let totalTokens = null;
  let estimatedCostUsd = null;

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

    const completion = await getChatCompletion({ message });
    const { reply, model, usage } = completion;

    usedModel = model || env.OPENAI_MODEL;
    promptTokens = usage.promptTokens;
    completionTokens = usage.completionTokens;
    totalTokens = usage.totalTokens;
    estimatedCostUsd = completion.estimatedCostUsd;

    responseCode = 200;
    res.status(200).json({
      ok: true,
      user_id: userId,
      model: usedModel,
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
        responseCode,
        model: usedModel,
        latencyMs: Date.now() - startedAt,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd
      }).catch(() => {});
    }
  }
}

module.exports = {
  chat
};
