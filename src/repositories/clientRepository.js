const pool = require("../db/mysql");

async function findByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, api_key_hash, allowed_domain, status, rate_limit_per_min
     FROM chatbot_clients
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

module.exports = {
  findByUserId
};
