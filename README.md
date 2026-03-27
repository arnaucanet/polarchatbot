# Polar Chatbot API Backend

Backend API avanzada para chatbot con OpenAI + MySQL, autenticacion por API key, validacion de dominio, rate limits y logging por cliente.

## Requisitos

- Node.js 18+
- MySQL 8+

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

## Endpoints

- `GET /health`
- `POST /api/v1/chat`

### Headers requeridos para chat

- `x-user-id`
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
