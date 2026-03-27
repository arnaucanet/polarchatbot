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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_logs_user_date ON chatbot_logs (user_id, created_at);
