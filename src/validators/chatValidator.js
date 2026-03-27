const { z } = require("zod");
const env = require("../config/env");

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(env.MAX_MESSAGE_LENGTH)
});

module.exports = {
  chatRequestSchema
};
