# ==============================================================================
# TwinIQ Frontend - Production Multi-Stage Dockerfile
# Optimized Vite build + lightweight Nginx Alpine web server
# ==============================================================================

# --- STAGE 1: Build Static Assets ---
FROM node:20-alpine AS builder
WORKDIR /app

# Cache package dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
ENV VITE_API_BASE_URL=/api
RUN npm run build

# --- STAGE 2: Lightweight Nginx Server ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx website
RUN rm -rf ./*

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./

# Copy customized production Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Healthcheck to verify Nginx is serving traffic
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
