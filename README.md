# BiteBridge (Single Deploy: Frontend + Backend on Render)

This project is now configured for **one Render web service** that serves:

- React frontend (Vite build)
- Spring Boot backend API
- MongoDB-backed data

API runs under `/api/*`, and frontend is served from `/` in the same service.

## What was prepared

- Fullstack Docker build: `backend/Dockerfile`
  - Builds frontend
  - Bundles frontend `dist` into Spring Boot `static`
  - Runs one backend container
- API routing prefix config: `backend/src/main/java/com/bitebridge/config/ApiPathConfig.java`
- SPA route fallback: `backend/src/main/java/com/bitebridge/config/SpaForwardController.java`
- Frontend API base default updated to same-origin: `frontend/src/services/api.js` (`/api`)
- Realistic seed dataset enabled in backend startup (12 restaurants + menus + coupons)

## Local run (dev)

### Backend

```bash
mvn -f backend/pom.xml spring-boot:run
```

### Frontend

```bash
npm --prefix frontend run dev -- --host
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:8080/api`

## Render deployment (single service)

### 1) Push repo to GitHub

Render pulls from GitHub repo.

### 2) Create Web Service on Render

- In Render dashboard: **New +** → **Web Service**
- Select this GitHub repo
- Environment: `Docker`
- Dockerfile path: `backend/Dockerfile`
- Name: `bitebridge-fullstack` (or any name you prefer)

### 3) Set required secrets in Render

In service environment variables, set:

- `SPRING_DATA_MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `SPRING_PROFILES_ACTIVE=prod`
- `SPRING_DATA_MONGODB_DATABASE=bitebridge`
- `APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://*.onrender.com`
- `APP_SEED_ENABLED=true` (first deploy only)

### 4) Deploy

Render builds using `backend/Dockerfile` and starts a single container.

- App URL: `https://<your-service>.onrender.com`
- Health check: `/actuator/health`
- API base: `/api`

## Notes

- If you already have old data, seeder may skip regeneration depending on data count.
- For production, set a strong `JWT_SECRET` and your own MongoDB Atlas URI.
