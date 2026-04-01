const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  APP_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().int().positive().default(3000),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().min(1).default("gpt-4o-mini"),
  OPENAI_INPUT_COST_PER_1M: z.coerce.number().nonnegative().default(0.15),
  OPENAI_OUTPUT_COST_PER_1M: z.coerce.number().nonnegative().default(0.6),
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASS: z.string().optional(),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_SSL_REQUIRED: z.enum(["0", "1"]).default("1"),
  DB_SSL_REJECT_UNAUTHORIZED: z.enum(["0", "1"]).default("0"),
  ALLOWED_ORIGINS: z.string().default("*"),
  MAX_MESSAGE_LENGTH: z.coerce.number().int().positive().default(600),
  CHAT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  CHAT_RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(60),
  DATA_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  DATA_RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(60),
  ENABLE_INSTALLER: z.enum(["0", "1"]).default("0"),
  INSTALL_TOKEN: z.string().min(8).optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${issues}`);
}

const env = parsed.data;

const sslConfig = env.DB_SSL_REQUIRED === "1"
  ? { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED === "1" }
  : undefined;

if (env.DATABASE_URL) {
  env.dbConfig = {
    connectionString: env.DATABASE_URL,
    ssl: sslConfig
  };
} else {
  if (!env.DB_HOST || !env.DB_USER || !env.DB_NAME) {
    throw new Error("Database configuration missing. Use DATABASE_URL or DB_HOST/DB_USER/DB_NAME.");
  }

  env.dbConfig = {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS || "",
    database: env.DB_NAME,
    ssl: sslConfig
  };
}

env.allowedOrigins = env.ALLOWED_ORIGINS === "*"
  ? ["*"]
  : env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);

env.isProduction = env.APP_ENV === "production";

module.exports = env;
