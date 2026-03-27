const mysql = require("mysql2/promise");
const env = require("../config/env");

const pool = mysql.createPool({
  ...env.dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4"
});

module.exports = pool;
