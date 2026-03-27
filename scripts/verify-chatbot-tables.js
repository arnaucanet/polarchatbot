const fs = require("fs");
const path = require("path");
const db = require("../src/db/mysql");

async function main() {
  const sqlFile = path.join(__dirname, "..", "sql", "chatbot_tables.sql");
  const ddl = fs.readFileSync(sqlFile, "utf8");

  const statements = ddl
    .split(";")
    .map((stmt) => stmt.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await db.query(statement);
  }

  console.log("chatbot tables verified/created successfully");
  await db.end();
}

main().catch(async (error) => {
  console.error("Failed to verify chatbot tables:", error.message);
  try {
    await db.end();
  } catch {
    // ignore close errors
  }
  process.exit(1);
});
