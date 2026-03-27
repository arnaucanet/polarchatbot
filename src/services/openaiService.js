const OpenAI = require("openai");
const env = require("../config/env");

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

async function getChatCompletion({ message }) {
  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: "system", content: "You are a concise and helpful assistant." },
      { role: "user", content: message }
    ],
    temperature: 0.4
  });

  return completion.choices?.[0]?.message?.content || "";
}

module.exports = {
  getChatCompletion
};
