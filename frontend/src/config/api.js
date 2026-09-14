/**
 * TwinIQ Centralized API Configuration
 *
 * Dynamically resolves the API base URL:
 * 1. From VITE_API_BASE_URL environment variable (if explicitly configured)
 * 2. In development mode: falls back to http://localhost:8081/api
 * 3. In production mode: falls back to relative '/api' (ideal for reverse proxies like Nginx/Docker)
 */

export const API_BASE = (() => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    // Strip trailing slash if present for consistency
    return envUrl.replace(/\/+$/, "");
  }
  return import.meta.env.DEV ? "http://localhost:8081/api" : "/api";
})();

export default API_BASE;
