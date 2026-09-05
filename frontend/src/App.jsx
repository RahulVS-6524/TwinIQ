import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:8081/api";

const inrWholeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrDecimalFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function App() {
  const [businesses, setBusinesses] = useState([]);
  
  // Persisted state from localStorage
  const [selectedBusinessId, setSelectedBusinessId] = useState(() => {
    const saved = localStorage.getItem("twiniq_selectedBusinessId");
    return saved ? Number(saved) : 1;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("twiniq_activeTab") || "dna";
  });

  // Data states
  const [business, setBusiness] = useState(null);
  const [dna, setDna] = useState(null);
  const [dnaHistory, setDnaHistory] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [evolutions, setEvolutions] = useState([]);

  // Scenario Comparison state
  const [compareIds, setCompareIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [scenarioForm, setScenarioForm] = useState({
    scenarioType: "MARKETING_CHANGE",
    changePercent: 20.0,
  });

  const [decisionForm, setDecisionForm] = useState({
    scenarioId: "",
    simulationId: "",
    recommendationId: "",
    decisionStatus: "ACCEPTED",
    decisionMaker: "Rahul V S (Strategic Lead)",
    notes: "Approved based on positive ROI projection.",
  });

  const [outcomeForm, setOutcomeForm] = useState({
    decisionId: "",
    actualRevenue: "",
    actualProfitMargin: "",
    actualCustomerRetention: "",
    actualCustomerAcquisitionCost: "",
    actualOperationalEfficiency: "",
    notes: "Quarterly review data recorded.",
  });

  // Persist tab & business choice
  const switchTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("twiniq_activeTab", tab);
    window.location.hash = tab;
  };

  const handleSelectBusiness = (bId) => {
    setSelectedBusinessId(bId);
    localStorage.setItem("twiniq_selectedBusinessId", bId);
  };

  // Load initial business list
  useEffect(() => {
    fetch(`${API_BASE}/businesses`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [data];
        setBusinesses(list);
        if (list.length > 0 && !list.some((b) => b.id === selectedBusinessId)) {
          handleSelectBusiness(list[0].id);
        }
      })
      .catch((err) => console.error("Error fetching businesses:", err));
  }, []);

  // Fetch all business modules whenever selected business changes
  useEffect(() => {
    if (!selectedBusinessId) return;
    refreshAllData(selectedBusinessId);
  }, [selectedBusinessId]);

  const refreshAllData = async (bId) => {
    setLoading(true);
    setError("");
    try {
      const bRes = await fetch(`${API_BASE}/businesses/${bId}`);
      if (bRes.ok) setBusiness(await bRes.json());

      const dnaRes = await fetch(`${API_BASE}/businesses/${bId}/dna`);
      if (dnaRes.ok) setDna(await dnaRes.json());

      const histRes = await fetch(`${API_BASE}/businesses/${bId}/dna/history`);
      if (histRes.ok) setDnaHistory(await histRes.json());

      const snapRes = await fetch(`${API_BASE}/businesses/${bId}/snapshots`);
      if (snapRes.ok) setSnapshots(await snapRes.json());

      const scenRes = await fetch(`${API_BASE}/businesses/${bId}/scenarios`);
      if (scenRes.ok) {
        const scData = await scenRes.json();
        setScenarios(scData);
        if (scData.length >= 2 && compareIds.length === 0) {
          setCompareIds([scData[0].id, scData[1].id]);
        }
      }

      const simRes = await fetch(`${API_BASE}/businesses/${bId}/simulations`);
      if (simRes.ok) {
        const simData = await simRes.json();
        setSimulations(simData);
        if (simData.length > 0 && !selectedSimulation) {
          setSelectedSimulation(simData[0]);
        }
      }

      const recRes = await fetch(`${API_BASE}/businesses/${bId}/recommendations`);
      if (recRes.ok) setRecommendations(await recRes.json());

      const decRes = await fetch(`${API_BASE}/businesses/${bId}/decisions`);
      if (decRes.ok) setDecisions(await decRes.json());

      const outRes = await fetch(`${API_BASE}/businesses/${bId}/outcomes`);
      if (outRes.ok) setOutcomes(await outRes.json());

      const evoRes = await fetch(`${API_BASE}/businesses/${bId}/evolution`);
      if (evoRes.ok) setEvolutions(await evoRes.json());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch some TwinIQ modules.");
    } finally {
      setLoading(false);
    }
  };

  const flashMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleCreateSnapshot = async () => {
    try {
      const res = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/snapshots`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to create snapshot");
      flashMessage("Fresh Twin Snapshot captured successfully!");
      refreshAllData(selectedBusinessId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateScenario = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { scenarioType: scenarioForm.scenarioType };
      const val = parseFloat(scenarioForm.changePercent);
      if (scenarioForm.scenarioType === "PRICE_CHANGE") payload.priceChangePercent = val;
      if (scenarioForm.scenarioType === "MARKETING_CHANGE") payload.marketingSpendChangePercent = val;
      if (scenarioForm.scenarioType === "SUPPLIER_COST_CHANGE") payload.supplierCostChangePercent = val;
      if (scenarioForm.scenarioType === "DEMAND_SHOCK") payload.demandChangePercent = val;

      const res = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Scenario creation failed: ${errText}`);
      }

      const created = await res.json();
      flashMessage(`Scenario #${created.id} (${created.scenarioType}) created!`);
      refreshAllData(selectedBusinessId);
      switchTab("scenarios");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRunSimulation = async (scenarioId) => {
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/businesses/${selectedBusinessId}/scenarios/${scenarioId}/simulate`,
        { method: "POST" }
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Simulation failed: ${errText}`);
      }
      const sim = await res.json();
      setSelectedSimulation(sim);
      flashMessage(`Simulation #${sim.id} complete for Scenario #${scenarioId}!`);

      await fetch(`${API_BASE}/businesses/${selectedBusinessId}/simulations/${sim.id}/recommendations`, {
        method: "POST",
      });

      refreshAllData(selectedBusinessId);
      switchTab("simulations");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewExplanation = async (simId) => {
    try {
      const res = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/simulations/${simId}/explanation`);
      if (res.ok) {
        setExplanation(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Multi-Scenario Comparison Action
  const handleRunComparison = async () => {
    if (compareIds.length < 2) {
      setError("Please select at least 2 scenarios to compare.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/scenarios/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioIds: compareIds }),
      });
      if (!res.ok) {
        throw new Error("Comparison failed");
      }
      const data = await res.json();
      setComparisonResult(data);
      flashMessage(`Evaluated strategic trade-offs across ${data.scenarios.length} scenarios!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCompareId = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id));
    } else {
      setCompareIds([...compareIds, id]);
    }
  };

  const handleRecordDecision = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/decisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: parseInt(decisionForm.scenarioId),
          simulationId: parseInt(decisionForm.simulationId),
          recommendationId: decisionForm.recommendationId ? parseInt(decisionForm.recommendationId) : null,
          decisionStatus: decisionForm.decisionStatus,
          decisionMaker: decisionForm.decisionMaker,
          notes: decisionForm.notes,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const dec = await res.json();
      flashMessage(`Decision #${dec.id} recorded with status: ${dec.decisionStatus}`);
      refreshAllData(selectedBusinessId);
      switchTab("decisions");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRecordOutcome = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/outcomes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionId: parseInt(outcomeForm.decisionId),
          actualRevenue: parseFloat(outcomeForm.actualRevenue),
          actualProfitMargin: parseFloat(outcomeForm.actualProfitMargin),
          actualCustomerRetention: outcomeForm.actualCustomerRetention ? parseFloat(outcomeForm.actualCustomerRetention) : null,
          actualCustomerAcquisitionCost: outcomeForm.actualCustomerAcquisitionCost ? parseFloat(outcomeForm.actualCustomerAcquisitionCost) : null,
          actualOperationalEfficiency: outcomeForm.actualOperationalEfficiency ? parseFloat(outcomeForm.actualOperationalEfficiency) : null,
          notes: outcomeForm.notes,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const out = await res.json();
      flashMessage(`Actual Outcome #${out.id} recorded! Triggering Twin Evolution...`);

      const evoRes = await fetch(`${API_BASE}/businesses/${selectedBusinessId}/evolution/evaluate/${out.id}`, {
        method: "POST",
      });
      if (evoRes.ok) {
        flashMessage(`Twin Evolution complete! Live DNA updated and new snapshot captured.`);
      }

      refreshAllData(selectedBusinessId);
      switchTab("evolution");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (val) => {
    if (val == null) return "-";
    const num = parseFloat(val);
    if (isNaN(num)) return "-";
    return (num % 1 === 0 ? inrWholeFormatter : inrDecimalFormatter).format(num);
  };

  const formatPct = (val) =>
    val != null ? `${parseFloat(val).toFixed(1)}%` : "-";

  return (
    <div className="twiniq-root">
      {/* HEADER */}
      <header className="top-header">
        <div className="brand-group">
          <div className="brand-logo">TwinIQ</div>
          <div>
            <h1 className="brand-title">Cognitive Business Twin</h1>
            <p className="brand-subtitle">Strategic Decision Intelligence & Autonomous Evolution</p>
          </div>
        </div>

        <div className="header-meta">
          <div className="business-selector-box">
            <span className="selector-label">Active Business</span>
            <select
              value={selectedBusinessId}
              onChange={(e) => handleSelectBusiness(Number(e.target.value))}
              className="business-select"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.id} - {b.businessName} ({b.businessCode})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleCreateSnapshot} className="btn-action-snapshot">
            📸 Capture Snapshot
          </button>

          <div className="system-status-badge">
            <span className="live-dot"></span>
            Backend Active (8081)
          </div>
        </div>
      </header>

      {/* NOTIFICATIONS */}
      {message && <div className="banner banner-success">{message}</div>}
      {error && <div className="banner banner-error">{error}</div>}

      {/* PIPELINE NAVIGATION TABS */}
      <nav className="pipeline-nav">
        <div className="pipeline-step-label">INTELLIGENCE PIPELINE:</div>
        <button className={`nav-tab ${activeTab === "dna" ? "active" : ""}`} onClick={() => switchTab("dna")}>
          🧬 1. Business DNA
        </button>
        <button className={`nav-tab ${activeTab === "snapshots" ? "active" : ""}`} onClick={() => switchTab("snapshots")}>
          📸 2. Snapshots ({snapshots.length})
        </button>
        <button className={`nav-tab ${activeTab === "scenarios" ? "active" : ""}`} onClick={() => switchTab("scenarios")}>
          🎯 3. Scenarios ({scenarios.length})
        </button>
        <button className={`nav-tab ${activeTab === "comparison" ? "active" : ""}`} onClick={() => switchTab("comparison")}>
          ⚖️ 4. Multi-Scenario Compare
        </button>
        <button className={`nav-tab ${activeTab === "simulations" ? "active" : ""}`} onClick={() => switchTab("simulations")}>
          ⚡ 5. Simulation & Trace ({simulations.length})
        </button>
        <button className={`nav-tab ${activeTab === "recommendations" ? "active" : ""}`} onClick={() => switchTab("recommendations")}>
          💡 6. Recommendations ({recommendations.length})
        </button>
        <button className={`nav-tab ${activeTab === "decisions" ? "active" : ""}`} onClick={() => switchTab("decisions")}>
          🏛️ 7. Decisions ({decisions.length})
        </button>
        <button className={`nav-tab ${activeTab === "outcomes" ? "active" : ""}`} onClick={() => switchTab("outcomes")}>
          📊 8. Actual Outcomes ({outcomes.length})
        </button>
        <button className={`nav-tab ${activeTab === "evolution" ? "active" : ""}`} onClick={() => switchTab("evolution")}>
          🚀 9. Twin Evolution ({evolutions.length})
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="content-container">
        {loading && <div className="loading-indicator">Processing Cognitive Twin Data...</div>}

        {/* TAB 1: BUSINESS DNA */}
        {activeTab === "dna" && dna && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Living Business DNA Genome</h2>
                <p>Real-time cognitive representation of organizational state, capacities, and strategic metrics.</p>
              </div>
              <div className="timestamp-badge">
                Last Calibrated: {dna.lastUpdated ? new Date(dna.lastUpdated).toLocaleString() : "Initial"}
              </div>
            </div>

            <div className="dna-metric-grid">
              <div className="dna-card highlight">
                <span className="dna-card-title">Annualized Revenue</span>
                <span className="dna-card-value">{formatCurrency(dna.revenue)}</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: "88%" }}></div></div>
              </div>

              <div className="dna-card highlight">
                <span className="dna-card-title">Operating Profit Margin</span>
                <span className="dna-card-value">{formatPct(dna.profitMargin)}</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${Math.min(dna.profitMargin * 3.5, 100)}%` }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Customer Retention Rate</span>
                <span className="dna-card-value">{formatPct(dna.customerRetention)}</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.customerRetention}%` }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Customer Acquisition Cost (CAC)</span>
                <span className="dna-card-value">{formatCurrency(dna.customerAcquisitionCost)}</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: "65%" }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Operational Efficiency Index</span>
                <span className="dna-card-value">{dna.operationalEfficiency}/100</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.operationalEfficiency}%` }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Systemic Risk Level</span>
                <span className="dna-card-value" style={{ color: dna.riskLevel > 50 ? "#ef4444" : "#10b981" }}>
                  {dna.riskLevel}/100
                </span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.riskLevel}%`, background: dna.riskLevel > 50 ? "#ef4444" : "#10b981" }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Competitive Strength</span>
                <span className="dna-card-value">{dna.competitiveStrength}/100</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.competitiveStrength}%` }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Digital Maturity</span>
                <span className="dna-card-value">{dna.digitalMaturity}/100</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.digitalMaturity}%` }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Financial Stability</span>
                <span className="dna-card-value">{dna.financialStability}/100</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.financialStability}%` }}></div></div>
              </div>

              <div className="dna-card">
                <span className="dna-card-title">Innovation Capability</span>
                <span className="dna-card-value">{dna.innovationCapability}/100</span>
                <div className="dna-bar-track"><div className="dna-bar-fill" style={{ width: `${dna.innovationCapability}%` }}></div></div>
              </div>
            </div>

            {/* DNA History */}
            <div className="sub-section">
              <h3>Parameter Evolution History ({dnaHistory.length} events)</h3>
              {dnaHistory.length === 0 ? (
                <p className="empty-text">No parameter changes recorded yet.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Parameter</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnaHistory.map((h) => (
                      <tr key={h.id}>
                        <td>{new Date(h.changedAt).toLocaleString()}</td>
                        <td><strong>{h.parameterName}</strong></td>
                        <td>{h.oldValue}</td>
                        <td className="text-highlight">{h.newValue}</td>
                        <td>{h.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TWIN SNAPSHOTS & VISUAL TREND CHART */}
        {activeTab === "snapshots" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Frozen Baseline Snapshots & Evolution Trend</h2>
                <p>Immutable checkpoints capturing the state of the business twin over historical horizons.</p>
              </div>
              <button onClick={handleCreateSnapshot} className="btn-primary">
                + Capture New Snapshot
              </button>
            </div>

            {/* Visual SVG Trend Chart across snapshots */}
            {snapshots.length > 0 && (
              <div className="visualization-card">
                <h3>📈 Snapshot Evolution Horizon (Revenue & Profit Margin Trajectory)</h3>
                <div className="chart-canvas-container">
                  <svg className="trend-svg" viewBox="0 0 800 180">
                    <line x1="50" y1="140" x2="750" y2="140" stroke="#E2E8F0" strokeWidth="1" />
                    <line x1="50" y1="40" x2="750" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                    
                    {/* Render dots and lines */}
                    {snapshots.map((s, i) => {
                      const x = 80 + i * (600 / Math.max(snapshots.length - 1, 1));
                      const revNorm = Math.min(100, Math.max(20, (parseFloat(s.revenue) - 450000) / 1500));
                      const yRev = 140 - revNorm;
                      return (
                        <g key={s.id}>
                          <circle cx={x} cy={yRev} r="6" fill="#4F46E5" />
                          <text x={x} y={yRev - 12} fill="#0F172A" fontSize="11" fontWeight="700" textAnchor="middle">
                            ₹{(parseFloat(s.revenue) / 1000).toFixed(0)}k
                          </text>
                          <text x={x} y="160" fill="#64748B" fontSize="11" textAnchor="middle">
                            Snap #{s.id} ({formatPct(s.profitMargin)})
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="legend-dot" style={{ background: "#4F46E5" }}></span> Projected / Captured Revenue Trend</span>
                  </div>
                </div>
              </div>
            )}

            <div className="snapshot-timeline">
              {snapshots.map((s, idx) => (
                <div className="snapshot-card" key={s.id}>
                  <div className="snapshot-header">
                    <div className="snapshot-tag">Snapshot #{s.id} {idx === 0 ? "(Latest Baseline)" : ""}</div>
                    <span className="snapshot-time">{new Date(s.snapshotTime).toLocaleString()}</span>
                  </div>

                  <div className="snapshot-metrics-row">
                    <div><span>Revenue:</span> <strong>{formatCurrency(s.revenue)}</strong></div>
                    <div><span>Margin:</span> <strong>{formatPct(s.profitMargin)}</strong></div>
                    <div><span>Retention:</span> <strong>{formatPct(s.customerRetention)}</strong></div>
                    <div><span>CAC:</span> <strong>{formatCurrency(s.customerAcquisitionCost)}</strong></div>
                    <div><span>Efficiency:</span> <strong>{s.operationalEfficiency}%</strong></div>
                    <div><span>Risk:</span> <strong>{s.riskLevel}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SCENARIOS */}
        {activeTab === "scenarios" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>What-If Strategic Scenarios</h2>
                <p>Formulate prospective hypothesis perturbations to test organizational resiliency.</p>
              </div>
            </div>

            <div className="scenario-workspace-layout">
              <div className="scenario-form-card">
                <h3>New Scenario Formulation</h3>
                <form onSubmit={handleCreateScenario}>
                  <div className="form-group">
                    <label>Scenario Archetype</label>
                    <select
                      value={scenarioForm.scenarioType}
                      onChange={(e) => setScenarioForm({ ...scenarioForm, scenarioType: e.target.value })}
                      className="form-input"
                    >
                      <option value="MARKETING_CHANGE">MARKETING_CHANGE (Scale/Reduce Spend)</option>
                      <option value="PRICE_CHANGE">PRICE_CHANGE (Strategic Pricing Shift)</option>
                      <option value="SUPPLIER_COST_CHANGE">SUPPLIER_COST_CHANGE (COGS Inflation)</option>
                      <option value="DEMAND_SHOCK">DEMAND_SHOCK (Macro Market Volatility)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Percentage Magnitude Shift (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={scenarioForm.changePercent}
                      onChange={(e) => setScenarioForm({ ...scenarioForm, changePercent: e.target.value })}
                      className="form-input"
                      placeholder="e.g. +20.0 or -10.0"
                      required
                    />
                    <small className="hint-text">Positive for increase/expansion; negative for reduction.</small>
                  </div>

                  <button type="submit" className="btn-primary full-width">
                    Create & Queue Scenario
                  </button>
                </form>
              </div>

              <div className="scenarios-list-container">
                <div className="list-top-action-bar">
                  <h3>Formulated Scenarios ({scenarios.length})</h3>
                  <button onClick={() => switchTab("comparison")} className="btn-action-compare">
                    ⚖️ Multi-Scenario Comparison Mode →
                  </button>
                </div>
                {scenarios.length === 0 ? (
                  <p className="empty-text">No scenarios formulated yet.</p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Perturbation Parameter</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map((sc) => {
                        let paramText = "-";
                        if (sc.marketingSpendChangePercent != null) paramText = `Marketing: ${sc.marketingSpendChangePercent}%`;
                        if (sc.priceChangePercent != null) paramText = `Price: ${sc.priceChangePercent}%`;
                        if (sc.supplierCostChangePercent != null) paramText = `Supplier Cost: ${sc.supplierCostChangePercent}%`;
                        if (sc.demandChangePercent != null) paramText = `Demand Shock: ${sc.demandChangePercent}%`;

                        return (
                          <tr key={sc.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={compareIds.includes(sc.id)}
                                onChange={() => toggleCompareId(sc.id)}
                              />
                            </td>
                            <td><strong>#{sc.id}</strong></td>
                            <td><span className="badge badge-scenario">{sc.scenarioType}</span></td>
                            <td>{paramText}</td>
                            <td>
                              <span className={`badge ${sc.status === "SIMULATED" ? "badge-simulated" : "badge-ready"}`}>
                                {sc.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleRunSimulation(sc.id)}
                                className="btn-simulate-small"
                              >
                                ⚡ Run Simulation
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MULTI-SCENARIO COMPARISON */}
        {activeTab === "comparison" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>⚖️ Multi-Scenario Strategic Comparison</h2>
                <p>Simultaneously evaluate multiple what-if hypotheses side-by-side to determine optimal resource allocation.</p>
              </div>
              <button onClick={handleRunComparison} className="btn-primary">
                ⚡ Evaluate Trade-Offs
              </button>
            </div>

            <div className="compare-picker-strip">
              <span className="picker-label">Select Scenarios to Compare:</span>
              <div className="compare-checkboxes">
                {scenarios.map((s) => (
                  <label key={s.id} className={`chip-checkbox ${compareIds.includes(s.id) ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={compareIds.includes(s.id)}
                      onChange={() => toggleCompareId(s.id)}
                    />
                    Scenario #{s.id} ({s.scenarioType})
                  </label>
                ))}
              </div>
            </div>

            {comparisonResult ? (
              <div className="comparison-results-panel">
                {/* Synthesis Banner */}
                <div className="synthesis-card">
                  <span className="synthesis-tag">STRATEGIC SYNTHESIS & TRADE-OFF VERDICT</span>
                  <p className="synthesis-text">{comparisonResult.comparativeSynthesis}</p>
                  <div className="synthesis-badges">
                    <span className="pill-badge pill-rev">👑 Best Revenue: Scenario #{comparisonResult.bestRevenueScenarioId}</span>
                    <span className="pill-badge pill-margin">💎 Best Margin: Scenario #{comparisonResult.bestMarginScenarioId}</span>
                    <span className="pill-badge pill-risk">🛡️ Lowest Risk: Scenario #{comparisonResult.lowestRiskScenarioId}</span>
                  </div>
                </div>

                {/* Comparison Matrix Table */}
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Scenario & Parameter</th>
                      <th>Projected Revenue</th>
                      <th>Profit Margin</th>
                      <th>CAC</th>
                      <th>Retention</th>
                      <th>Efficiency</th>
                      <th>Risk Index</th>
                      <th>Impact</th>
                      <th>Prescriptive Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonResult.scenarios.map((sc) => (
                      <tr key={sc.scenarioId} className={sc.scenarioId === comparisonResult.bestRevenueScenarioId ? "row-highlight" : ""}>
                        <td>
                          <strong>Scenario #{sc.scenarioId}</strong>
                          <div className="sc-subtext">{sc.scenarioType}</div>
                          <div className="param-pill">{sc.parameterDescription}</div>
                        </td>
                        <td>
                          <div className="bold-val">{formatCurrency(sc.projectedRevenue)}</div>
                          <div className="delta-sm">{sc.revenueImpactPercent >= 0 ? "+" : ""}{sc.revenueImpactPercent}%</div>
                        </td>
                        <td>
                          <div className="bold-val">{formatPct(sc.projectedProfitMargin)}</div>
                          <div className="delta-sm">{sc.profitMarginImpactPercent >= 0 ? "+" : ""}{sc.profitMarginImpactPercent} pts</div>
                        </td>
                        <td>{formatCurrency(sc.projectedCustomerAcquisitionCost)}</td>
                        <td>{formatPct(sc.projectedCustomerRetention)}</td>
                        <td>{sc.projectedOperationalEfficiency}%</td>
                        <td>
                          <span style={{ color: sc.projectedRiskLevel > 50 ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                            {sc.projectedRiskLevel}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge impact-${sc.overallImpact?.toLowerCase()}`}>
                            {sc.overallImpact}
                          </span>
                        </td>
                        <td className="action-col-text">"{sc.recommendedAction}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state-box">
                <p>Select 2 or more scenarios above and click <strong>Evaluate Trade-Offs</strong> to inspect comparative matrix.</p>
                <button onClick={handleRunComparison} className="btn-primary">
                  Evaluate Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SIMULATION & EXPLANATION TRACE */}
        {activeTab === "simulations" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Rule-Based Simulation & Explanation Trace</h2>
                <p>Cognitive modeling estimating multi-variable business impact with transparent causal reasoning.</p>
              </div>
            </div>

            {simulations.length === 0 ? (
              <div className="empty-state-box">
                <p>No simulations run yet. Go to <strong>3. Scenarios</strong> and click <strong>Run Simulation</strong>.</p>
                <button onClick={() => switchTab("scenarios")} className="btn-primary">
                  Go to Scenarios
                </button>
              </div>
            ) : (
              <div className="simulation-dashboard-grid">
                <div className="sim-selector-strip">
                  <span>Select Simulation:</span>
                  {simulations.map((sim) => (
                    <button
                      key={sim.id}
                      className={`chip-btn ${selectedSimulation?.id === sim.id ? "active" : ""}`}
                      onClick={() => {
                        setSelectedSimulation(sim);
                        setExplanation(null);
                      }}
                    >
                      Sim #{sim.id} ({sim.scenarioType})
                    </button>
                  ))}
                </div>

                {selectedSimulation && (
                  <>
                    <div className="sim-summary-card">
                      <div className="summary-left">
                        <span className="summary-label">COGNITIVE TWIN SIMULATION #{selectedSimulation.id}</span>
                        <h3>{selectedSimulation.summary}</h3>
                        <p>Simulated against Scenario #{selectedSimulation.scenarioId} using Baseline Snapshot #{selectedSimulation.twinSnapshotId}.</p>
                      </div>

                      <div className="summary-right">
                        <div className={`impact-badge impact-${selectedSimulation.overallImpact?.toLowerCase()}`}>
                          Impact: {selectedSimulation.overallImpact}
                        </div>
                        <button
                          onClick={() => handleViewExplanation(selectedSimulation.id)}
                          className="btn-trace"
                        >
                          🔍 Inspect Explanation Trace
                        </button>
                      </div>
                    </div>

                    <div className="metrics-comparison-grid">
                      <div className="metric-compare-card">
                        <span className="metric-name">Revenue</span>
                        <div className="compare-values">
                          <div><span className="label">Baseline</span><strong className="val-base">{formatCurrency(selectedSimulation.baselineRevenue)}</strong></div>
                          <div className="arrow-sep">→</div>
                          <div><span className="label">Projected</span><strong className="val-proj">{formatCurrency(selectedSimulation.projectedRevenue)}</strong></div>
                        </div>
                        <div className="delta-tag">
                          {selectedSimulation.revenueImpactPercent >= 0 ? "+" : ""}{selectedSimulation.revenueImpactPercent}%
                        </div>
                      </div>

                      <div className="metric-compare-card">
                        <span className="metric-name">Profit Margin</span>
                        <div className="compare-values">
                          <div><span className="label">Baseline</span><strong className="val-base">{formatPct(selectedSimulation.baselineProfitMargin)}</strong></div>
                          <div className="arrow-sep">→</div>
                          <div><span className="label">Projected</span><strong className="val-proj">{formatPct(selectedSimulation.projectedProfitMargin)}</strong></div>
                        </div>
                        <div className="delta-tag">
                          {selectedSimulation.profitMarginImpactPercent >= 0 ? "+" : ""}{selectedSimulation.profitMarginImpactPercent} pts
                        </div>
                      </div>

                      <div className="metric-compare-card">
                        <span className="metric-name">Customer Retention</span>
                        <div className="compare-values">
                          <div><span className="label">Baseline</span><strong className="val-base">{formatPct(selectedSimulation.baselineCustomerRetention)}</strong></div>
                          <div className="arrow-sep">→</div>
                          <div><span className="label">Projected</span><strong className="val-proj">{formatPct(selectedSimulation.projectedCustomerRetention)}</strong></div>
                        </div>
                      </div>

                      <div className="metric-compare-card">
                        <span className="metric-name">CAC (Acquisition Cost)</span>
                        <div className="compare-values">
                          <div><span className="label">Baseline</span><strong className="val-base">{formatCurrency(selectedSimulation.baselineCustomerAcquisitionCost)}</strong></div>
                          <div className="arrow-sep">→</div>
                          <div><span className="label">Projected</span><strong className="val-proj">{formatCurrency(selectedSimulation.projectedCustomerAcquisitionCost)}</strong></div>
                        </div>
                      </div>

                      <div className="metric-compare-card">
                        <span className="metric-name">Operational Efficiency</span>
                        <div className="compare-values">
                          <div><span className="label">Baseline</span><strong className="val-base">{selectedSimulation.baselineOperationalEfficiency}%</strong></div>
                          <div className="arrow-sep">→</div>
                          <div><span className="label">Projected</span><strong className="val-proj">{selectedSimulation.projectedOperationalEfficiency}%</strong></div>
                        </div>
                      </div>

                      <div className="metric-compare-card">
                        <span className="metric-name">Risk Index</span>
                        <div className="compare-values">
                          <div><span className="label">Baseline</span><strong className="val-base">{selectedSimulation.baselineRiskLevel}%</strong></div>
                          <div className="arrow-sep">→</div>
                          <div><span className="label">Projected</span><strong className="val-proj" style={{ color: selectedSimulation.projectedRiskLevel > 50 ? "#ef4444" : "#10b981" }}>{selectedSimulation.projectedRiskLevel}%</strong></div>
                        </div>
                        <div className="delta-tag">
                          {selectedSimulation.riskImpactPercent >= 0 ? "+" : ""}{selectedSimulation.riskImpactPercent} pts
                        </div>
                      </div>
                    </div>

                    <div className="explanation-trace-box">
                      <div className="trace-header">
                        <h3>🧠 Causal Explanation Trace</h3>
                        <span className="trace-subtitle">Step-by-step cognitive reasoning explaining WHY the twin produced this result:</span>
                      </div>

                      <div className="trace-steps-list">
                        {(explanation ? explanation.traceSteps : selectedSimulation.explanationSteps || []).map((step, idx) => (
                          <div className="trace-step-item" key={idx}>
                            <div className="step-number">{idx + 1}</div>
                            <div className="step-content">{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: RECOMMENDATIONS */}
        {activeTab === "recommendations" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Prescriptive Recommendations</h2>
                <p>Actionable intelligence synthesized automatically from simulation outcomes and causal traces.</p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <p className="empty-text">No recommendations generated yet. Run a simulation first.</p>
            ) : (
              <div className="recommendations-grid">
                {recommendations.map((rec) => (
                  <div className="rec-card" key={rec.id}>
                    <div className="rec-top-row">
                      <span className={`rec-badge rec-${rec.recommendationType?.toLowerCase()}`}>
                        {rec.recommendationType}
                      </span>
                      <span className="confidence-tag">Confidence: {rec.confidenceScore}%</span>
                    </div>

                    <h3 className="rec-action">{rec.actionStatement}</h3>
                    <p className="rec-rationale">{rec.rationale}</p>

                    <div className="rec-meta-row">
                      <div><span>Scenario:</span> <strong>#{rec.scenarioId} ({rec.scenarioType})</strong></div>
                      <div><span>Expected ROI:</span> <strong className="text-highlight">+{rec.expectedRoiPercent}%</strong></div>
                      <div><span>Risk Profile:</span> <strong>{rec.riskAssessment}</strong></div>
                      <div><span>Decision Status:</span> <strong className="status-tag">{rec.status}</strong></div>
                    </div>

                    <div className="rec-action-row">
                      <button
                        onClick={() => {
                          setDecisionForm({
                            ...decisionForm,
                            scenarioId: rec.scenarioId,
                            simulationId: rec.simulationId,
                            recommendationId: rec.id,
                            decisionStatus: "ACCEPTED",
                            notes: `Accepted recommendation #${rec.id}: ${rec.actionStatement}`,
                          });
                          switchTab("decisions");
                        }}
                        className="btn-primary"
                      >
                        🏛️ Act on Recommendation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: DECISIONS */}
        {activeTab === "decisions" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Executive Decision Tracking</h2>
                <p>Record leadership decisions on simulated scenarios and recommendations to close the loop.</p>
              </div>
            </div>

            <div className="decision-workspace-layout">
              <div className="decision-form-card">
                <h3>Record New Decision</h3>
                <form onSubmit={handleRecordDecision}>
                  <div className="form-group">
                    <label>Target Scenario</label>
                    <select
                      value={decisionForm.scenarioId}
                      onChange={(e) => setDecisionForm({ ...decisionForm, scenarioId: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">-- Choose Scenario --</option>
                      {scenarios.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          #{sc.id} - {sc.scenarioType} ({sc.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Associated Simulation</label>
                    <select
                      value={decisionForm.simulationId}
                      onChange={(e) => setDecisionForm({ ...decisionForm, simulationId: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">-- Choose Simulation --</option>
                      {simulations.map((sim) => (
                        <option key={sim.id} value={sim.id}>
                          Sim #{sim.id} for Scenario #{sim.scenarioId} ({sim.overallImpact})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Decision Verdict</label>
                    <select
                      value={decisionForm.decisionStatus}
                      onChange={(e) => setDecisionForm({ ...decisionForm, decisionStatus: e.target.value })}
                      className="form-input"
                    >
                      <option value="ACCEPTED">ACCEPTED (Implement Proposed Strategy)</option>
                      <option value="REJECTED">REJECTED (Decline Proposal)</option>
                      <option value="MODIFIED">MODIFIED (Adopt with Conditional Changes)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Decision Maker</label>
                    <input
                      type="text"
                      value={decisionForm.decisionMaker}
                      onChange={(e) => setDecisionForm({ ...decisionForm, decisionMaker: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Executive Notes / Rationale</label>
                    <textarea
                      value={decisionForm.notes}
                      onChange={(e) => setDecisionForm({ ...decisionForm, notes: e.target.value })}
                      className="form-input"
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary full-width">
                    Record Executive Decision
                  </button>
                </form>
              </div>

              <div className="decisions-history-box">
                <h3>Recorded Executive Decisions ({decisions.length})</h3>
                {decisions.length === 0 ? (
                  <p className="empty-text">No decisions recorded yet.</p>
                ) : (
                  <div className="decisions-timeline">
                    {decisions.map((d) => (
                      <div className="decision-item-card" key={d.id}>
                        <div className="d-top">
                          <span className={`status-pill pill-${d.decisionStatus?.toLowerCase()}`}>
                            {d.decisionStatus}
                          </span>
                          <span className="d-time">{new Date(d.createdAt).toLocaleString()}</span>
                        </div>
                        <h4>Scenario #{d.scenarioId} ({d.scenarioType})</h4>
                        <p className="d-notes">"{d.notes}"</p>
                        <div className="d-meta">
                          <span>Decision Maker: <strong>{d.decisionMaker}</strong></span>
                          <span>Simulation: <strong>#{d.simulationId}</strong></span>
                        </div>
                        <div className="d-actions">
                          <button
                            onClick={() => {
                              setOutcomeForm({
                                ...outcomeForm,
                                decisionId: d.id,
                                actualRevenue: "540000.00",
                                actualProfitMargin: "20.50",
                                actualCustomerRetention: "84.00",
                                actualCustomerAcquisitionCost: "1150.00",
                                notes: `Realized outcome following Decision #${d.id} implementation.`,
                              });
                              switchTab("outcomes");
                            }}
                            className="btn-action-small"
                          >
                            📊 Record Realized Outcome
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ACTUAL OUTCOMES */}
        {activeTab === "outcomes" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Real-World Actual Outcomes</h2>
                <p>Capture empirical post-implementation results to validate predictions and trigger learning.</p>
              </div>
            </div>

            <div className="outcomes-workspace-layout">
              <div className="outcome-form-card">
                <h3>Record Realized Outcome</h3>
                <form onSubmit={handleRecordOutcome}>
                  <div className="form-group">
                    <label>Target Implemented Decision</label>
                    <select
                      value={outcomeForm.decisionId}
                      onChange={(e) => setOutcomeForm({ ...outcomeForm, decisionId: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">-- Choose Decision --</option>
                      {decisions.map((dec) => (
                        <option key={dec.id} value={dec.id}>
                          Decision #{dec.id} ({dec.decisionStatus}) - Scenario #{dec.scenarioId}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Realized Revenue (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={outcomeForm.actualRevenue}
                        onChange={(e) => setOutcomeForm({ ...outcomeForm, actualRevenue: e.target.value })}
                        className="form-input"
                        placeholder="e.g. 540000"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Realized Profit Margin (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={outcomeForm.actualProfitMargin}
                        onChange={(e) => setOutcomeForm({ ...outcomeForm, actualProfitMargin: e.target.value })}
                        className="form-input"
                        placeholder="e.g. 20.5"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Realized Retention (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={outcomeForm.actualCustomerRetention}
                        onChange={(e) => setOutcomeForm({ ...outcomeForm, actualCustomerRetention: e.target.value })}
                        className="form-input"
                        placeholder="e.g. 84.0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Realized CAC (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={outcomeForm.actualCustomerAcquisitionCost}
                        onChange={(e) => setOutcomeForm({ ...outcomeForm, actualCustomerAcquisitionCost: e.target.value })}
                        className="form-input"
                        placeholder="e.g. 1150"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Implementation Context / Notes</label>
                    <textarea
                      value={outcomeForm.notes}
                      onChange={(e) => setOutcomeForm({ ...outcomeForm, notes: e.target.value })}
                      className="form-input"
                      rows="2"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary full-width">
                    Save Outcome & Trigger Evolution 🚀
                  </button>
                </form>
              </div>

              <div className="outcomes-history-table">
                <h3>Empirical Outcome Records ({outcomes.length})</h3>
                {outcomes.length === 0 ? (
                  <p className="empty-text">No actual outcomes recorded yet.</p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Decision</th>
                        <th>Actual Revenue</th>
                        <th>Actual Margin</th>
                        <th>Realized At</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outcomes.map((o) => (
                        <tr key={o.id}>
                          <td><strong>#{o.id}</strong></td>
                          <td>Decision #{o.decisionId} ({o.scenarioType})</td>
                          <td className="text-highlight">{formatCurrency(o.actualRevenue)}</td>
                          <td>{formatPct(o.actualProfitMargin)}</td>
                          <td>{new Date(o.realizedAt).toLocaleDateString()}</td>
                          <td>{o.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: TWIN EVOLUTION WITH VARIANCE VISUALIZATION */}
        {activeTab === "evolution" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <div>
                <h2>Twin Learning & Autonomous Evolution</h2>
                <p>Closed-loop empirical validation comparing predictions against reality to recalibrate the cognitive twin.</p>
              </div>
            </div>

            {evolutions.length === 0 ? (
              <div className="empty-state-box">
                <p>No twin evolution cycles recorded yet. Record an Actual Outcome to trigger calibration.</p>
              </div>
            ) : (
              <div className="evolution-stream">
                {evolutions.map((evo) => (
                  <div className="evolution-card" key={evo.id}>
                    <div className="evo-header">
                      <div className="evo-title">
                        <span className="evo-badge">CYCLE #{evo.id}</span>
                        <h3>Cognitive Model Recalibration</h3>
                      </div>
                      <div className="accuracy-meter">
                        <span className="meter-label">Model Precision Accuracy</span>
                        <strong className="meter-val">{evo.overallAccuracyPercent}%</strong>
                      </div>
                    </div>

                    {/* Visual Prediction vs Actual Bar Comparison */}
                    <div className="visualization-card" style={{ marginBottom: "18px" }}>
                      <h4>📊 Predictive Variance Analysis (Projected vs Realized)</h4>
                      <div className="variance-bar-group">
                        <div className="v-bar-row">
                          <span className="v-label">Revenue</span>
                          <div className="v-track">
                            <div className="v-fill pred" style={{ width: "85%" }} title={`Projected: ${formatCurrency(evo.projectedRevenue)}`}>
                              Pred: {formatCurrency(evo.projectedRevenue)}
                            </div>
                            <div className="v-fill real" style={{ width: "87%" }} title={`Actual: ${formatCurrency(evo.actualRevenue)}`}>
                              Real: {formatCurrency(evo.actualRevenue)}
                            </div>
                          </div>
                          <span className="v-delta">+{evo.revenueVariancePercent}%</span>
                        </div>

                        <div className="v-bar-row">
                          <span className="v-label">Margin</span>
                          <div className="v-track">
                            <div className="v-fill pred" style={{ width: "70%" }}>
                              Pred: {formatPct(evo.projectedProfitMargin)}
                            </div>
                            <div className="v-fill real" style={{ width: "74%" }}>
                              Real: {formatPct(evo.actualProfitMargin)}
                            </div>
                          </div>
                          <span className="v-delta">+{evo.profitMarginVariancePoints} pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="evo-comparison-row">
                      <div className="comp-item">
                        <span className="comp-label">Revenue Prediction vs Actual</span>
                        <div className="comp-figures">
                          <span>Pred: {formatCurrency(evo.projectedRevenue)}</span>
                          <span className="arrow-sep">→</span>
                          <strong>Real: {formatCurrency(evo.actualRevenue)}</strong>
                        </div>
                        <span className="variance-pill">Variance: {evo.revenueVariancePercent}%</span>
                      </div>

                      <div className="comp-item">
                        <span className="comp-label">Profit Margin Prediction vs Actual</span>
                        <div className="comp-figures">
                          <span>Pred: {formatPct(evo.projectedProfitMargin)}</span>
                          <span className="arrow-sep">→</span>
                          <strong>Real: {formatPct(evo.actualProfitMargin)}</strong>
                        </div>
                        <span className="variance-pill">Variance: {evo.profitMarginVariancePoints} pts</span>
                      </div>

                      <div className="comp-item">
                        <span className="comp-label">CAC Prediction vs Actual</span>
                        <div className="comp-figures">
                          <span>Pred: {formatCurrency(evo.projectedCac)}</span>
                          <span className="arrow-sep">→</span>
                          <strong>Real: {formatCurrency(evo.actualCac)}</strong>
                        </div>
                        <span className="variance-pill">Variance: {evo.cacVariancePercent}%</span>
                      </div>
                    </div>

                    <div className="evo-insight-box">
                      <h4>🧠 Cognitive Insight & Feedback Loop</h4>
                      <p>{evo.evolutionInsight}</p>
                    </div>

                    <div className="evo-action-box">
                      <h4>⚙️ Autonomous Twin Calibration Applied</h4>
                      <p>{evo.calibrationAction}</p>
                    </div>

                    <div className="evo-footer">
                      <span>Applied to Living Twin: {new Date(evo.appliedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}