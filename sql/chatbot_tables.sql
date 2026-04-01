CREATE TABLE IF NOT EXISTS chatbot_clients (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(80) NOT NULL UNIQUE,
    api_key_hash VARCHAR(255) NOT NULL,
    allowed_domain VARCHAR(255) DEFAULT NULL,
    status VARCHAR(8) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    rate_limit_per_min INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_clients_user_id ON chatbot_clients (user_id);

CREATE TABLE IF NOT EXISTS chatbot_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(80) NOT NULL,
    ip VARCHAR(64) NOT NULL,
    message_length INT NOT NULL,
    response_code INT NOT NULL,
    model VARCHAR(120),
    latency_ms INT,
    prompt_tokens INT,
    completion_tokens INT,
    total_tokens INT,
    estimated_cost_usd NUMERIC(12,8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS model VARCHAR(120);
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS latency_ms INT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS prompt_tokens INT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS completion_tokens INT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS total_tokens INT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS estimated_cost_usd NUMERIC(12,8);

CREATE INDEX IF NOT EXISTS idx_chatbot_logs_user_date ON chatbot_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_logs_created_at ON chatbot_logs (created_at);
