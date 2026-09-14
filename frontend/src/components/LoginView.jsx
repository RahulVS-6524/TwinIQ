import { useState } from "react";
import { LockIcon, ShieldIcon, SparklesIcon, SunIcon, MoonIcon } from "../Icons";
import { API_BASE } from "../config/api";

export default function LoginView({ onLoginSuccess, theme, toggleTheme }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setError("Please enter your username/email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: usernameOrEmail.trim(), password }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Invalid username/email or password. Please check your credentials.");
        }
        throw new Error(`Authentication failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || "Failed to connect to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (userType) => {
    setError("");
    if (userType === "admin") {
      setUsernameOrEmail("admin");
      setPassword("Admin@TwinIQ2026!");
    } else {
      setUsernameOrEmail("rahul");
      setPassword("Rahul@TwinIQ2026!");
    }
  };

  return (
    <div className="login-canvas">
      {/* Top utility bar */}
      <div className="login-topbar">
        <div className="login-brand-chip">
          <div className="brand-dot pulse" />
          <span>TwinIQ Enterprise Intelligence</span>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </button>
      </div>

      {/* Center login card */}
      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-logo-badge">
              <ShieldIcon size={28} color="#FFFFFF" />
            </div>
            <h1 className="login-title">TwinIQ</h1>
            <p className="login-tagline">Living Cognitive Business Twin Platform</p>
            <span className="login-edition-badge">Enterprise Decision Intelligence • RBAC Secured</span>
          </div>

          {/* Quick-fill demo presets */}
          <div className="login-demo-presets">
            <div className="demo-preset-label">
              <SparklesIcon size={14} color="var(--primary)" />
              <span>Project Viva / Quick Demo Accounts</span>
            </div>
            <div className="demo-preset-buttons">
              <button
                type="button"
                className="demo-pill-btn admin"
                onClick={() => handleQuickDemo("admin")}
                title="Fill Admin Credentials"
              >
                <ShieldIcon size={13} />
                <span>Admin Portal</span>
                <span className="pill-sub">Full System</span>
              </button>
              <button
                type="button"
                className="demo-pill-btn strategist"
                onClick={() => handleQuickDemo("user")}
                title="Fill Lead Strategist Credentials"
              >
                <LockIcon size={13} />
                <span>Lead Strategist</span>
                <span className="pill-sub">Rahul Demo Business</span>
              </button>
            </div>
          </div>

          {/* Error alert banner */}
          {error && (
            <div className="login-error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="login-username">Username or Corporate Email</label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                placeholder="admin or rahul@twiniq.com"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Master Security Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <LockIcon size={16} />
                  <span>Sign In to Decision Twin</span>
                </>
              )}
            </button>
          </form>

          {/* Security details footer */}
          <div className="login-card-footer">
            <div className="security-guarantee">
              <span className="badge-bullet" />
              <span>Stateless 256-Bit JWT • Salted BCrypt • Server-Side Tenant Isolation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
