const { Pool } = require("pg");
const env = require("../config/env");

const pool = new Pool({
  ...env.dbConfig,
  max: 10
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end()
};
