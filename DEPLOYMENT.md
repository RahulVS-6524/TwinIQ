# TwinIQ — Production Deployment Guide

A complete, enterprise-grade deployment manual for **TwinIQ: Living Cognitive Business Twin Platform**.

---

## Architecture Overview

TwinIQ consists of three modular tiers:

```
                  ┌─────────────────────────────────────┐
                  │          CLIENT BROWSERS            │
                  └──────────────────┬──────────────────┘
                                     │ HTTPS
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       FRONTEND (Vite / React 19)    │
                  │   Served via Nginx or Global CDN   │
                  └──────────────────┬──────────────────┘
                                     │ REST /api (JSON + JWT)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    BACKEND (Spring Boot 4 / Java 17)│
                  │   Stateless JWT + HikariCP Pool    │
                  └──────────────────┬──────────────────┘
                                     │ JDBC (Port 5432)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │     DATABASE (PostgreSQL 16)        │
                  │   13 Core Entities + DDL Migrations │
                  └─────────────────────────────────────┘
```

---

## Hosting Recommendations

Based on Java 17 memory requirements (persistent ~350MB JVM heap) and PostgreSQL 16 relational data:

### 🌟 Option 1: Render (Recommended — Lowest Maintenance & Fast Setup)
* **PostgreSQL Database**: Render Managed PostgreSQL (Free / Starter \$7/mo).
* **Backend Web Service**: Native Java runtime or Docker (`Dockerfile` in `backend/twiniq-backend/`).
* **Frontend Static Site**: Render Static Site (`npm run build`, publish dir `dist`, redirect `/* -> /index.html`).
* **Total Setup Time**: ~10 minutes.

### Option 2: Railway (Automated Multi-Service Git Deployment)
* Connect your GitHub repo.
* Add PostgreSQL database plugin.
* Railway auto-detects `backend/twiniq-backend` as Java Maven and `frontend` as Node/Vite.
* Dynamic networking between services.

### Option 3: Self-Hosted VPS (Docker Compose — Lowest Monthly Cost)
* Platform: DigitalOcean Droplet (\$6–\$12/mo), AWS Lightsail (\$10/mo), or Hetzner VPS.
* Command: `docker compose up -d --build`.
* Nginx automatically serves the React UI and reverse-proxies `/api/` to Spring Boot, completely bypassing cross-origin (CORS) concerns.

---

## Environment Variables Reference

### Backend Service

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8081` | Port Spring Boot listens on. Auto-assigned on Render/Railway. |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/twiniq` | JDBC connection URL for PostgreSQL. |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username. |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | Database password. |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production optimizations in `application-prod.properties`. |
| `JWT_SECRET` | *(Default 256-bit key)* | Secret key for signing and validating JWT tokens. |
| `JWT_EXPIRATION_MS` | `86400000` | JWT token validity in milliseconds (24 hours). |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated list of allowed web origins (e.g. `https://twiniq.vercel.app`). |
| `SHOW_SQL` | `false` | Disable Hibernate SQL query logging in production logs. |
| `DDL_AUTO` | `update` | Hibernate schema validation/update mode. |

### Frontend Service

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `/api` | Base URL for REST API calls. Use `/api` when behind Nginx or full URL `https://api.yourdomain.com/api`. |

---

## Step-by-Step Cloud Deployment

### Deploying to Render.com

#### 1. Provision the PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **PostgreSQL**.
2. Name: `twiniq-db`
3. Database: `twiniq`
4. User: `twiniq_user`
5. Click **Create Database**.
6. Copy the **Internal Database URL** (for Render services) or **External Connection String**.

#### 2. Deploy the Backend Web Service
1. In Render Dashboard → **New** → **Web Service**.
2. Connect your Git repository.
3. Root Directory: `backend/twiniq-backend`
4. Runtime: **Docker** (Render will use `Dockerfile`), or **Java 17**.
5. If using Java runtime:
   * Build Command: `./mvnw clean package -DskipTests`
   * Start Command: `java -jar target/twiniq-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`
6. Add Environment Variables:
   * `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<db-host>:5432/twiniq`
   * `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
   * `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
   * `JWT_SECRET`: `<generated-random-256-bit-string>`
   * `CORS_ALLOWED_ORIGINS`: `https://twiniq.onrender.com,http://localhost:5173`
   * `SHOW_SQL`: `false`
7. Click **Create Web Service**. Note your backend URL (e.g. `https://twiniq-api.onrender.com`).

#### 3. Deploy the Frontend Static Site
1. In Render Dashboard → **New** → **Static Site**.
2. Connect your Git repository.
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Add Environment Variable:
   * `VITE_API_BASE_URL`: `https://twiniq-api.onrender.com/api`
7. Under **Redirects/Rewrites**:
   * Add Rewrite: Source `/*`, Destination `/index.html`, Action `Rewrite`.
8. Click **Create Static Site**.

---

### Deploying with Docker Compose (Single Server / VPS)

1. Clone the repository onto your server:
   ```bash
   git clone <repo-url> /opt/twiniq
   cd /opt/twiniq
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your secure database password
   ```
3. Start the entire platform with one command:
   ```bash
   docker compose up -d --build
   ```
4. Check service status:
   ```bash
   docker compose ps
   ```
5. Access TwinIQ in your browser at `http://<your-server-ip>/`.

---

## Local Production Testing Procedure

You can test the exact production flow on your local machine before pushing to cloud:

### 1. Build and Run the Backend Production JAR
```powershell
cd backend\twiniq-backend
.\mvnw.cmd clean package -DskipTests

# Run with production environment variables
$env:PORT="8081"
$env:SHOW_SQL="false"
$env:SPRING_PROFILES_ACTIVE="prod"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/twiniq"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgres"

java -jar target\twiniq-backend-0.0.1-SNAPSHOT.jar
```

### 2. Build and Serve the Frontend Production Bundle
```powershell
cd frontend
npm run build

# Preview production build on port 5000
npm run preview -- --port 5000 --host
```

Open `http://localhost:5000` in your browser.

---

## Production Health Checks & Smoke Tests

Verify system health using standard HTTP endpoints:

* **Backend Health**:
  ```bash
  curl http://localhost:8081/actuator/health
  # Expected: {"status":"UP"}
  ```
* **Authentication**:
  ```bash
  curl -X POST http://localhost:8081/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"usernameOrEmail":"rahul","password":"Rahul@TwinIQ2026!"}'
  # Expected: 200 OK with token and user object
  ```
* **Telemetry Pipeline**:
  ```bash
  curl -H "Authorization: Bearer <TOKEN>" http://localhost:8081/api/businesses/1/dashboard
  # Expected: 200 OK with overallHealthScore and metrics
  ```
