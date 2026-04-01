const OpenAI = require("openai");
const env = require("../config/env");

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

function estimateCostUsd({ promptTokens, completionTokens }) {
  if (promptTokens == null || completionTokens == null) {
    return null;
  }

  const inputCost = (promptTokens / 1_000_000) * env.OPENAI_INPUT_COST_PER_1M;
  const outputCost = (completionTokens / 1_000_000) * env.OPENAI_OUTPUT_COST_PER_1M;
  return Number((inputCost + outputCost).toFixed(8));
}

async function getChatCompletion({ message }) {
  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: "system", content: "You are a concise and helpful assistant." },
      { role: "user", content: message }
    ],
    temperature: 0.4
  });

  const promptTokens = completion.usage?.prompt_tokens ?? null;
  const completionTokens = completion.usage?.completion_tokens ?? null;
  const totalTokens = completion.usage?.total_tokens ?? null;

  return {
    reply: completion.choices?.[0]?.message?.content || "",
    model: completion.model || env.OPENAI_MODEL,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens
    },
    estimatedCostUsd: estimateCostUsd({ promptTokens, completionTokens })
  };
}

module.exports = {
  getChatCompletion
};
