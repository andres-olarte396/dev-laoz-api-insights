# dev-laoz-api-insights

API de observabilidad y auditoría con streaming en tiempo real (SSE) para el ecosistema WebTools.

## Características
- Ingesta de logs y eventos (audit, info, warn, error, http)
- Stream SSE para monitor en vivo (usado por `dev-laoz-server-dev-web-tools`)
- Persistencia en MongoDB
- Endpoints de salud (`/health`)

## Requisitos
- Node.js 18+
- MongoDB 6+

## Configuración
Variables de entorno recomendadas:
- `PORT`: Puerto del servicio (por defecto 3600)
- `MONGO_URI`: `mongodb://mongodb:27017/insights`

## Ejecutar en desarrollo
```bash
npm install
npm run dev
```

## Endpoints
- `GET /health`: estado del servicio
- `GET /api/insights/stream`: stream SSE
- `POST /api/insights/log`: ingesta de logs

## Docker
Se integra vía `docker-compose.yml` del proyecto `dev-laoz-server-dev-web-tools`. No requiere configuración adicional.

## Licencia
MIT
