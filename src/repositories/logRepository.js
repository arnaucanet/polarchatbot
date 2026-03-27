const pool = require("../db/mysql");

async function createChatbotLog({ userId, ip, messageLength, responseCode }) {
  await pool.execute(
    `INSERT INTO chatbot_logs (user_id, ip, message_length, response_code)
     VALUES (?, ?, ?, ?)`,
    [userId, ip, messageLength, responseCode]
  );
}

module.exports = {
  createChatbotLog
};
