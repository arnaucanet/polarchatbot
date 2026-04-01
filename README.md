# Polar Chatbot API Backend

Backend API avanzada para chatbot con OpenAI + PostgreSQL (Supabase), autenticacion por API key, validacion de dominio, rate limits y logging por cliente.

## Requisitos

- Node.js 18+
- PostgreSQL 14+ (Supabase recomendado)

## Instalacion

```bash
npm install
```

## Variables de entorno

- Copia `.env.example` a `.env` y completa valores.
- En este proyecto ya se incluyo un `.env` para entorno actual.

## Verificar/crear tablas

```bash
npm run migrate:chatbot
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Ejecutar en produccion

```bash
npm start
```

## Deploy en Render + Supabase

### 1) Crear base de datos en Supabase

- Abre `Connect` en Supabase y copia el `Connection string` (URI).
- Debe verse como `postgresql://postgres:[PASSWORD]@db.<project-ref>.supabase.co:5432/postgres`.

### 2) Variables en Render

En tu servicio web de Render, configura estas variables:

- `APP_ENV=production`
- `PORT=10000` (Render inyecta PORT, esta opcion es solo referencia)
- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=gpt-4o-mini`
- `DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres`
- `DB_SSL_REQUIRED=1`
- `DB_SSL_REJECT_UNAUTHORIZED=0`
- `ALLOWED_ORIGINS=https://tu-dominio-frontend.com`
- `MAX_MESSAGE_LENGTH=600`
- `CHAT_RATE_LIMIT_MAX=20`
- `CHAT_RATE_LIMIT_WINDOW=60`
- `DATA_RATE_LIMIT_MAX=120`
- `DATA_RATE_LIMIT_WINDOW=60`

### 3) Crear tablas en Supabase

Ejecuta el contenido de `sql/chatbot_tables.sql` en la consola SQL de Supabase
o ejecuta localmente:

```bash
npm run migrate:chatbot
```

### 4) Configurar Render

- Conecta tu repo a Render.
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

### 5) Probar endpoint

- `GET /health`
- `POST /api/v1/chat` con header `x-api-key`

## Endpoints

- `GET /health`
- `POST /api/v1/chat`

### Headers requeridos para chat

- `x-api-key`
- `Content-Type: application/json`

### Body

```json
{
  "message": "Hola, como estas?"
}
```

## Flujo de seguridad

- CORS por `ALLOWED_ORIGINS`
- API key hash validada con bcrypt (`chatbot_clients.api_key_hash`)
- Dominio permitido opcional por cliente (`allowed_domain`)
- Rate limit global por endpoint
- Rate limit por cliente (`rate_limit_per_min`)
- Registro de requests en `chatbot_logs`

## Tracking de consumo (usage)

Cada request a `POST /api/v1/chat` guarda en `chatbot_logs`:

- `user_id`
- `ip`
- `message_length`
- `response_code`
- `model`
- `latency_ms`
- `prompt_tokens`
- `completion_tokens`
- `total_tokens`
- `estimated_cost_usd`

`estimated_cost_usd` se calcula con:

- `OPENAI_INPUT_COST_PER_1M` (default `0.15`)
- `OPENAI_OUTPUT_COST_PER_1M` (default `0.6`)

Puedes ajustar estos valores en tu `.env` segun el modelo real que uses.

## Retencion de logs

La API aplica retencion automatica de logs: al insertar un log nuevo, elimina
registros con antiguedad mayor a 1 mes (`created_at < NOW() - INTERVAL '1 month'`).
