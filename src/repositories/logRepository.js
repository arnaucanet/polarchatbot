const pool = require("../db/mysql");

async function createChatbotLog({ userId, ip, messageLength, responseCode }) {
  await pool.query(
    `INSERT INTO chatbot_logs (user_id, ip, message_length, response_code)
     VALUES ($1, $2, $3, $4)`,
    [userId, ip, messageLength, responseCode]
  );
}

module.exports = {
  createChatbotLog
};
