import { useState, useEffect } from "react";
import {
  ShieldIcon,
  UsersIcon,
  AuditIcon,
  RefreshIcon,
  BuildingIcon,
  SparklesIcon,
} from "../Icons";
import { API_BASE } from "../config/api";

export default function AdminPortal({ token, onSwitchToBusiness }) {
  const [activeAdminTab, setActiveAdminTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "ROLE_USER",
    businessIds: [],
  });

  const [assignUserTarget, setAssignUserTarget] = useState(null);
  const [selectedAssignBizIds, setSelectedAssignBizIds] = useState([]);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/overview`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (e) {
      console.error("Failed to load admin overview", e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to load users", e);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/businesses`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data);
      }
    } catch (e) {
      console.error("Failed to load businesses", e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (e) {
      console.error("Failed to load audit logs", e);
    }
  };

  const reloadAll = async () => {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchUsers(), fetchBusinesses(), fetchAuditLogs()]);
    setLoading(false);
  };

  useEffect(() => {
    reloadAll();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-status`, {
        method: "PUT",
        headers: authHeaders,
      });
      if (res.ok) {
        setActionMsg("User status updated successfully.");
        await fetchUsers();
        await fetchOverview();
        setTimeout(() => setActionMsg(""), 4000);
      }
    } catch (e) {
      setActionMsg("Failed to update status.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.email || !newUser.fullName) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Failed to create user: " + err);
        return;
      }

      setShowCreateModal(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        fullName: "",
        role: "ROLE_USER",
        businessIds: [],
      });
      setActionMsg("User created successfully!");
      await fetchUsers();
      await fetchOverview();
      setTimeout(() => setActionMsg(""), 4000);
    } catch (e) {
      alert("Error creating user: " + e.message);
    }
  };

  const openAssignModal = (u) => {
    setAssignUserTarget(u);
    setSelectedAssignBizIds(u.assignedBusinessIds || []);
  };

  const handleSaveAssignments = async () => {
    if (!assignUserTarget) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${assignUserTarget.id}/assign-businesses`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ businessIds: selectedAssignBizIds }),
      });

      if (res.ok) {
        setAssignUserTarget(null);
        setActionMsg(`Updated enterprise assignments for ${assignUserTarget.fullName}`);
        await fetchUsers();
        setTimeout(() => setActionMsg(""), 4000);
      } else {
        alert("Failed to assign businesses");
      }
    } catch (e) {
      alert("Error saving assignments: " + e.message);
    }
  };

  return (
    <div className="admin-portal">
      {/* Admin Header */}
      <div className="admin-header-row">
        <div className="admin-header-info">
          <div className="admin-badge-pill">
            <ShieldIcon size={14} color="var(--primary)" />
            <span>Platform Governance & RBAC Console</span>
          </div>
          <h1 className="admin-title">Enterprise System Administration</h1>
          <p className="admin-desc">
            Manage multi-tenant business assignments, platform credentials, system health, and compliance audit streams.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={reloadAll}
            disabled={loading}
            title="Refresh All Metrics"
          >
            <RefreshIcon size={16} />
            <span>Refresh</span>
          </button>
          {onSwitchToBusiness && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => onSwitchToBusiness(businesses[0]?.id || 1)}
            >
              <BuildingIcon size={16} />
              <span>Open Business Twin</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMsg && (
        <div className="success-banner" role="status">
          <SparklesIcon size={16} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Admin Subtabs */}
      <div className="admin-subtabs">
        <button
          type="button"
          className={`admin-subtab ${activeAdminTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("overview")}
        >
          <SparklesIcon size={16} />
          <span>Platform Overview</span>
        </button>
        <button
          type="button"
          className={`admin-subtab ${activeAdminTab === "users" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("users")}
        >
          <UsersIcon size={16} />
          <span>User Directory ({users.length})</span>
        </button>
        <button
          type="button"
          className={`admin-subtab ${activeAdminTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("audit")}
        >
          <AuditIcon size={16} />
          <span>Compliance Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeAdminTab === "overview" && (
        <div className="admin-tab-content">
          {/* System Health Status Banner */}
          <div className="system-health-banner">
            <div className="health-status-item">
              <span className="health-label">System State</span>
              <span className="health-value-badge healthy">
                <span className="dot pulse" />
                {overview?.systemStatus || "OPTIMAL"}
              </span>
            </div>
            <div className="health-status-item">
              <span className="health-label">Database Status</span>
              <span className="health-value-badge healthy">
                <span className="dot pulse" />
                PostgreSQL 16 Connected
              </span>
            </div>
            <div className="health-status-item">
              <span className="health-label">Access Control</span>
              <span className="health-value-badge secure">
                <ShieldIcon size={13} />
                Stateless JWT RBAC
              </span>
            </div>
            <div className="health-status-item">
              <span className="health-label">Data Isolation</span>
              <span className="health-value-badge secure">
                Strict Server-Side Enforced
              </span>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="admin-metric-grid">
            <div className="admin-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-title">Registered Users</span>
                <UsersIcon size={18} color="var(--primary)" />
              </div>
              <div className="stat-card-number">{overview?.totalUsers ?? users.length}</div>
              <div className="stat-card-sub">{overview?.activeUsers ?? users.length} Active Accounts</div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-title">Active Enterprises</span>
                <BuildingIcon size={18} color="var(--accent-ai)" />
              </div>
              <div className="stat-card-number">{overview?.totalBusinesses ?? businesses.length}</div>
              <div className="stat-card-sub">Multi-tenant Segregation</div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-title">Simulations Executed</span>
                <SparklesIcon size={18} color="#10B981" />
              </div>
              <div className="stat-card-number">{overview?.totalSimulations ?? 0}</div>
              <div className="stat-card-sub">Across {overview?.totalScenarios ?? 0} Scenarios</div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-title">Decisions Recorded</span>
                <ShieldIcon size={18} color="#F59E0B" />
              </div>
              <div className="stat-card-number">{overview?.totalDecisions ?? 0}</div>
              <div className="stat-card-sub">{overview?.totalEvolutions ?? 0} Twin Evolutions Applied</div>
            </div>
          </div>

          {/* Quick Enterprises Overview Card */}
          <div className="admin-card-section">
            <div className="section-title-row">
              <h3 className="section-heading">Active Registered Enterprises</h3>
              <span className="section-count">{businesses.length} Businesses</span>
            </div>
            <div className="admin-biz-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Enterprise Name</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Contact Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b) => (
                    <tr key={b.id}>
                      <td><span className="badge-code">{b.businessCode}</span></td>
                      <td className="font-semibold">{b.businessName}</td>
                      <td>{b.industry || "General"}</td>
                      <td>{b.location || "Headquarters"}</td>
                      <td>{b.contactEmail || "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="table-action-btn primary"
                          onClick={() => onSwitchToBusiness && onSwitchToBusiness(b.id)}
                        >
                          Launch Twin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeAdminTab === "users" && (
        <div className="admin-tab-content">
          <div className="user-management-toolbar">
            <div className="toolbar-info">
              <h3 className="section-heading">Platform Users & Access Control</h3>
              <p className="section-sub">Assign enterprises to strategists. Only assigned businesses are accessible to a user.</p>
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <UsersIcon size={16} />
              <span>Create New User</span>
            </button>
          </div>

          <div className="admin-biz-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assigned Enterprises</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">
                          {u.fullName?.charAt(0) || u.username?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="user-fullname">{u.fullName}</div>
                          <div className="user-username">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === "ROLE_ADMIN" ? "admin" : "strategist"}`}>
                        {u.role === "ROLE_ADMIN" ? "ADMIN" : "STRATEGIST"}
                      </span>
                    </td>
                    <td>
                      {u.role === "ROLE_ADMIN" ? (
                        <span className="badge-all">All Enterprises (Global)</span>
                      ) : u.assignedBusinessNames?.length > 0 ? (
                        <div className="assigned-biz-chips">
                          {u.assignedBusinessNames.map((name, i) => (
                            <span key={i} className="biz-chip">{name}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">None assigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${u.enabled ? "active" : "disabled"}`}>
                        {u.enabled ? "ACTIVE" : "DISABLED"}
                      </span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="row-actions">
                        {u.role !== "ROLE_ADMIN" && (
                          <button
                            type="button"
                            className="table-action-btn"
                            onClick={() => openAssignModal(u)}
                            title="Assign Enterprises"
                          >
                            Assign
                          </button>
                        )}
                        <button
                          type="button"
                          className={`table-action-btn ${u.enabled ? "danger" : "success"}`}
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          {u.enabled ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeAdminTab === "audit" && (
        <div className="admin-tab-content">
          <div className="toolbar-info" style={{ marginBottom: "16px" }}>
            <h3 className="section-heading">Compliance & Security Audit Stream</h3>
            <p className="section-sub">Chronological immutable record of authentication, data access, and strategic actions.</p>
          </div>

          <div className="admin-biz-table-wrapper">
            <table className="admin-table audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                    </td>
                    <td>
                      <span className="font-semibold">{log.username || "system"}</span>
                    </td>
                    <td>
                      <span className="action-pill font-mono">{log.action}</span>
                    </td>
                    <td>{log.entityType ? `${log.entityType} #${log.entityId || ""}` : "-"}</td>
                    <td className="text-secondary text-sm">{log.details}</td>
                    <td className="font-mono text-xs text-muted">{log.ipAddress || "127.0.0.1"}</td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No audit events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Platform User</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. priya"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@company.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Initial Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Platform Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="ROLE_USER">Lead Strategist (ROLE_USER)</option>
                    <option value="ROLE_ADMIN">System Administrator (ROLE_ADMIN)</option>
                  </select>
                </div>
              </div>

              {newUser.role !== "ROLE_ADMIN" && (
                <div className="form-group">
                  <label>Assign Primary Enterprises</label>
                  <div className="checkbox-list">
                    {businesses.map((b) => (
                      <label key={b.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={newUser.businessIds.includes(b.id)}
                          onChange={(e) => {
                            const cur = newUser.businessIds;
                            setNewUser({
                              ...newUser,
                              businessIds: e.target.checked
                                ? [...cur, b.id]
                                : cur.filter((id) => id !== b.id),
                            });
                          }}
                        />
                        <span>{b.businessName} ({b.businessCode})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN BUSINESSES */}
      {assignUserTarget && (
        <div className="modal-backdrop" onClick={() => setAssignUserTarget(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Enterprises to {assignUserTarget.fullName}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setAssignUserTarget(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-secondary" style={{ marginBottom: "16px" }}>
                Select which enterprise twins @{assignUserTarget.username} has permission to simulate and monitor.
              </p>
              <div className="checkbox-list">
                {businesses.map((b) => (
                  <label key={b.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedAssignBizIds.includes(b.id)}
                      onChange={(e) => {
                        setSelectedAssignBizIds((prev) =>
                          e.target.checked
                            ? [...prev, b.id]
                            : prev.filter((id) => id !== b.id)
                        );
                      }}
                    />
                    <span>
                      <strong>{b.businessName}</strong> ({b.businessCode}) — {b.industry}
                    </span>
                  </label>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setAssignUserTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleSaveAssignments}
                >
                  Save Access Rights
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
