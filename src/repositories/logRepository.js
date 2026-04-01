const pool = require("../db/mysql");

async function createChatbotLog({
  userId,
  ip,
  messageLength,
  responseCode,
  model,
  latencyMs,
  promptTokens,
  completionTokens,
  totalTokens,
  estimatedCostUsd
}) {
  await pool.query(
    `INSERT INTO chatbot_logs (
      user_id,
      ip,
      message_length,
      response_code,
      model,
      latency_ms,
      prompt_tokens,
      completion_tokens,
      total_tokens,
      estimated_cost_usd
    )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      userId,
      ip,
      messageLength,
      responseCode,
      model || null,
      latencyMs ?? null,
      promptTokens ?? null,
      completionTokens ?? null,
      totalTokens ?? null,
      estimatedCostUsd ?? null
    ]
  );

  // Keep at most 1 month of logs in Supabase.
  await pool.query(
    `DELETE FROM chatbot_logs
     WHERE created_at < NOW() - INTERVAL '1 month'`
  );
}

module.exports = {
  createChatbotLog
};
