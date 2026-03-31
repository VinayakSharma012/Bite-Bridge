# BiteBridge (Single Render Web Service, Non-Docker)

This repo is configured for a single Render web service using script-based deploy (no Docker).

The service builds frontend assets, copies them into Spring Boot static resources, then runs the backend jar.

## Deployment mode

- Build script: `render-build.sh`
- Start script: `render-start.sh`
- Frontend served from `/`
- Backend API served from `/api/*`

## Local development

### Backend

```bash
mvn -f backend/pom.xml spring-boot:run
```

### Frontend

```bash
npm --prefix frontend run dev -- --host
```

## Render setup (Web Service)

- Root Directory: `.`
- Build Command: `bash render-build.sh`
- Start Command: `bash render-start.sh`
- Health Check Path: `/actuator/health/liveness`

Set environment variables:

- `SPRING_PROFILES_ACTIVE=prod`
- `SPRING_DATA_MONGODB_URI=<atlas-uri>`
- `SPRING_DATA_MONGODB_DATABASE=bitebridge`
- `JWT_SECRET=<strong-random-secret>`
- `APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://bite-bridge.onrender.com,https://*.onrender.com`
- `APP_SEED_ENABLED=false`

Optional Mongo tuning vars:

- `APP_MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000`
- `APP_MONGODB_CONNECT_TIMEOUT_MS=10000`
- `APP_MONGODB_READ_TIMEOUT_MS=20000`
- `APP_MONGODB_MAX_CONNECTION_POOL_SIZE=50`
- `APP_MONGODB_MIN_CONNECTION_POOL_SIZE=5`
- `APP_MONGODB_MAX_CONNECTION_IDLE_TIME_MS=60000`
