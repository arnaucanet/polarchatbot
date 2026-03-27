const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  APP_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().int().positive().default(3000),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().min(1).default("gpt-4o-mini"),
  DB_HOST: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASS: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
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

env.allowedOrigins = env.ALLOWED_ORIGINS === "*"
  ? ["*"]
  : env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);

env.isProduction = env.APP_ENV === "production";

module.exports = env;
