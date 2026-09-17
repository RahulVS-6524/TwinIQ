import { useState, useMemo } from "react";
import {
  RiskIcon,
  ShieldIcon,
  SparklesIcon,
  CheckCircleIcon,
  SpeakerIcon,
  VolumeXIcon,
  DecisionIcon,
  SimulationIcon,
} from "../Icons";

export default function EnterpriseRiskRadar({
  business,
  dna,
  selectedBusinessId,
  formatCurrency,
  formatPct,
  onNavigateTab,
  flashMessage,
}) {
  const baseRev = dna ? parseFloat(dna.revenue) || 12500000 : 12500000;
  const baseMargin = dna ? parseFloat(dna.profitMargin) || 22.5 : 22.5;
  const baseRet = dna ? parseFloat(dna.customerRetention) || 82.0 : 82.0;
  const baseCac = dna ? parseFloat(dna.customerAcquisitionCost) || 1250 : 1250;
  const baseRisk = dna ? parseFloat(dna.riskLevel) || 35 : 35;
  const baseEff = dna ? parseFloat(dna.operationalEfficiency) || 78 : 78;
  const baseStab = dna ? parseFloat(dna.financialStability) || 82 : 82;

  // Interactive selection state
  const [selectedRiskId, setSelectedRiskId] = useState("R1");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [stressMultiplier, setStressMultiplier] = useState(1.0);
  const [hedgedMap, setHedgedMap] = useState({ R4: true });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic Risk Vectors generated from business telemetry & live DNA
  const rawRisks = useMemo(() => [
    {
      id: "R1",
      code: "DEMAND-ELAST",
      category: "MARKET",
      categoryLabel: "Market Shock",
      title: "Demand Elasticity & Downside Slippage",
      likelihood: 4,
      likelihoodLabel: "Likely (78%)",
      impact: 4,
      impactLabel: "Major (-8.2% Rev)",
      severity: baseRisk > 45 ? "CRITICAL" : "HIGH",
      baseExposure: Math.round(baseRev * 0.082),
      threatScore: Math.min(95, Math.round(baseRisk * 1.1 + (100 - baseRet) * 0.5)),
      dnaTriggers: [
        { label: "DNA Risk Index", value: `${baseRisk}/100`, status: baseRisk > 40 ? "warning" : "good" },
        { label: "Retention Rate", value: `${baseRet}%`, status: baseRet < 80 ? "warning" : "good" },
      ],
      description: `Structural risk level is calibrated at ${baseRisk}%. In adverse demand contractions, top-line revenue is vulnerable to volume slippage without contractual lock-ins.`,
      rootCause: `Customer retention of ${baseRet}% leaves an open 18% annual churn vulnerability that amplifies macro down-turns.`,
      recommendedHedge: `Calibrate dynamic tier pricing. Shift top 20% high-LTV customer accounts to 12-month recurring contracts with a guaranteed floor.`,
      actionTab: "simulations",
      actionLabel: "Simulate Price & Retention Hedge",
      presetScenario: "PRICE_CHANGE",
    },
    {
      id: "R2",
      code: "INFLATION-SQZ",
      category: "SUPPLY_CHAIN",
      categoryLabel: "Supply Chain & Costs",
      title: "Vendor Inflation & Margin Squeeze",
      likelihood: 4,
      likelihoodLabel: "Likely (72%)",
      impact: 3,
      impactLabel: "Moderate (-3.1 pts Margin)",
      severity: baseMargin < 20 ? "CRITICAL" : "HIGH",
      baseExposure: Math.round(baseRev * 0.054),
      threatScore: Math.min(92, Math.round(40 + (30 - baseMargin) * 2.5)),
      dnaTriggers: [
        { label: "Operating Margin", value: `${baseMargin}%`, status: baseMargin < 20 ? "danger" : "warning" },
        { label: "Operational Efficiency", value: `${baseEff}/100`, status: "good" },
      ],
      description: `Current operating margin is ${baseMargin}%. A 12% rise in wholesale procurement costs will erode EBITDA margin by ~2.8 pts without automatic pricing pass-through.`,
      rootCause: `High reliance on variable-rate vendor contracts exposes gross margin to raw supply-chain swings.`,
      recommendedHedge: `Formulate a +5% to +10% selective price adjustment in the What-If Engine to test elasticity resilience.`,
      actionTab: "simulations",
      actionLabel: "Simulate Inflation Surcharge",
      presetScenario: "SUPPLIER_COST_CHANGE",
    },
    {
      id: "R3",
      code: "CAC-SATURATION",
      category: "ACQUISITION",
      categoryLabel: "Customer & CAC",
      title: "CAC Payback Ceiling & Funnel Friction",
      likelihood: 3,
      likelihoodLabel: "Possible (56%)",
      impact: 3,
      impactLabel: `Moderate (${formatCurrency(baseCac)}/lead)`,
      severity: baseCac > 1500 ? "HIGH" : "MEDIUM",
      baseExposure: Math.round(baseRev * 0.038),
      threatScore: Math.min(88, Math.round((baseCac / 2000) * 60 + 20)),
      dnaTriggers: [
        { label: "Acquisition Cost (CAC)", value: formatCurrency(baseCac), status: baseCac > 1500 ? "warning" : "good" },
        { label: "Retention Floor", value: `${baseRet}%`, status: "good" },
      ],
      description: `CAC is measured at ${formatCurrency(baseCac)}. Ad-spend saturation across primary digital channels extends payback velocity past 90 days.`,
      rootCause: `Paid channel bidding competition has increased unit acquisition costs by ~14% year-over-year.`,
      recommendedHedge: `Reallocate 30% of paid search budget into customer referral programs and high-margin expansion cohorts.`,
      actionTab: "simulations",
      actionLabel: "Simulate Marketing Reallocation",
      presetScenario: "MARKETING_CHANGE",
    },
    {
      id: "R4",
      code: "LIQUIDITY-RUN",
      category: "FINANCIAL",
      categoryLabel: "Liquidity & Runway",
      title: "Working Capital Runway Shock",
      likelihood: 2,
      likelihoodLabel: "Unlikely (30%)",
      impact: 5,
      impactLabel: "Catastrophic (Runway Risk)",
      severity: baseStab < 60 ? "CRITICAL" : "MEDIUM",
      baseExposure: Math.round(baseRev * 0.115),
      threatScore: Math.min(90, Math.max(35, Math.round(110 - baseStab))),
      dnaTriggers: [
        { label: "Financial Stability", value: `${baseStab}/100`, status: baseStab < 70 ? "warning" : "good" },
        { label: "Capital Buffer", value: "8.5 Months", status: "good" },
      ],
      description: `Financial stability score is ${baseStab}/100. In an unforeseen macroeconomic credit freeze, liquidity runway could tighten within 9 months without proactive facilities.`,
      rootCause: `Receivable collection cycles average 48 days against 30-day payable obligations.`,
      recommendedHedge: `Secure a revolving treasury facility and enforce net-21 payment discounts to accelerate cash collections.`,
      actionTab: "decisions",
      actionLabel: "Record Treasury Governance Decision",
      presetScenario: "CAPITAL_FACILITY",
    },
    {
      id: "R5",
      code: "OPS-BOTTLENECK",
      category: "OPERATIONAL",
      categoryLabel: "Operational Execution",
      title: "Throughput Bottlenecks & Manual Overhead",
      likelihood: 3,
      likelihoodLabel: "Possible (50%)",
      impact: 2,
      impactLabel: "Minor (-1.8% Efficiency)",
      severity: baseEff < 70 ? "HIGH" : "LOW",
      baseExposure: Math.round(baseRev * 0.025),
      threatScore: Math.min(80, Math.round(100 - baseEff)),
      dnaTriggers: [
        { label: "Operational Efficiency", value: `${baseEff}/100`, status: baseEff < 75 ? "warning" : "good" },
        { label: "Automation Index", value: "64/100", status: "warning" },
      ],
      description: `Operational efficiency is currently ${baseEff}/100. Peak seasonal order bursts create fulfillment lag and increase customer support tickets.`,
      rootCause: `Legacy manual reconciliations consume ~18% of mid-management operational time.`,
      recommendedHedge: `Deploy cognitive workflow automation across fulfillment pipelines to sustain high throughput margin.`,
      actionTab: "decisions",
      actionLabel: "Record Automation CapEx Decision",
      presetScenario: "AUTOMATION_CAPEX",
    },
    {
      id: "R6",
      code: "COMP-DISCOUNT",
      category: "MARKET",
      categoryLabel: "Competitive Dynamics",
      title: "Competitor Price Undercutting",
      likelihood: 4,
      likelihoodLabel: "Likely (68%)",
      impact: 4,
      impactLabel: "Major (-6.5% Market Share)",
      severity: "HIGH",
      baseExposure: Math.round(baseRev * 0.068),
      threatScore: 74,
      dnaTriggers: [
        { label: "Market Vulnerability", value: "Moderate", status: "warning" },
        { label: "Retention Anchor", value: `${baseRet}%`, status: "good" },
      ],
      description: `Rival market entrants are offering 20% introductory discounts to poach mid-tier accounts.`,
      rootCause: `Low product differentiation in non-core service tiers exposes account churn to aggressive price matching.`,
      recommendedHedge: `Bundle TwinIQ intelligent decision services and real-time business telemetry to eliminate pure commodity price comparisons.`,
      actionTab: "simulations",
      actionLabel: "Simulate Differentiation Strategy",
      presetScenario: "PRICE_CHANGE",
    },
  ], [baseRev, baseMargin, baseRet, baseCac, baseRisk, baseEff, baseStab, formatCurrency]);

  // Filtered risks
  const filteredRisks = useMemo(() => {
    return rawRisks.filter((r) => {
      if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false;
      if (severityFilter !== "ALL" && r.severity !== severityFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.categoryLabel.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rawRisks, categoryFilter, severityFilter, searchQuery]);

  // Selected risk object
  const selectedRisk = useMemo(() => {
    return rawRisks.find((r) => r.id === selectedRiskId) || rawRisks[0];
  }, [rawRisks, selectedRiskId]);

  // Aggregate metrics
  const totalBaseExposure = useMemo(() => {
    return rawRisks.reduce((acc, r) => acc + r.baseExposure, 0);
  }, [rawRisks]);

  const totalStressedExposure = useMemo(() => {
    return Math.round(totalBaseExposure * stressMultiplier);
  }, [totalBaseExposure, stressMultiplier]);

  const hedgedCount = useMemo(() => {
    return Object.values(hedgedMap).filter(Boolean).length;
  }, [hedgedMap]);

  const hedgePercentage = Math.round((hedgedCount / rawRisks.length) * 100);

  // Audio briefing
  const handleVoiceBriefing = () => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = `Enterprise Risk Briefing for ${business?.businessName || "your company"}. Total value at risk is estimated at ${formatCurrency(totalStressedExposure)} under a ${stressMultiplier}x stress multiplier. Currently selected threat is ${selectedRisk.title}. Threat score is ${selectedRisk.threatScore} out of 100. Recommended executive hedge: ${selectedRisk.recommendedHedge}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleHedge = (riskId) => {
    setHedgedMap((prev) => {
      const nextState = !prev[riskId];
      if (flashMessage) {
        flashMessage(
          nextState
            ? `🛡️ Threat [${riskId}] registered as HEDGED in governance ledger!`
            : `⚠️ Threat [${riskId}] marked UNHEDGED. Exposure requires mitigation.`
        );
      }
      return { ...prev, [riskId]: nextState };
    });
  };

  const handleExecuteHedgeAction = () => {
    if (!onNavigateTab) return;
    if (flashMessage) {
      flashMessage(`⚡ Dispatching mitigation workflow for "${selectedRisk.title}" in ${selectedRisk.actionTab}...`);
    }
    onNavigateTab(selectedRisk.actionTab);
  };

  // Matrix coordinate mapper (Impact 1-5, Likelihood 1-5)
  const matrixCells = [5, 4, 3, 2, 1];
  const matrixCols = [1, 2, 3, 4, 5];

  const getCellSeverityColor = (imp, lik) => {
    const prod = imp * lik;
    if (prod >= 16) return "cell-critical";
    if (prod >= 10) return "cell-high";
    if (prod >= 5) return "cell-medium";
    return "cell-low";
  };

  return (
    <div className="tab-pane risk-radar-pane">
      {/* CINEMATIC RADAR HEADER */}
      <div className="cinematic-tab-header">
        <div className="cinematic-header-left">
          <span className="cinematic-header-badge badge-risk">🛡️ ENTERPRISE THREAT RADAR & EXPOSURE MATRIX</span>
          <h1 className="cinematic-header-title">
            Enterprise Risk Radar & <span className="gradient-text">Exposure Matrix</span>
          </h1>
          <p className="cinematic-header-sub">
            Interactive cognitive threat telemetry for #{selectedBusinessId} {business?.businessName || "Enterprise"}.
            Select any risk cell or vector to stress-test financial exposure, simulate hedges, and enforce mitigation governance.
          </p>
        </div>
        <div className="cinematic-header-actions">
          <button
            className={`cinematic-voice-btn ${isSpeaking ? "active-voice" : ""}`}
            onClick={handleVoiceBriefing}
            title="Listen to Live Threat Briefing"
          >
            {isSpeaking ? <VolumeXIcon size={16} /> : <SpeakerIcon size={16} />}
            {isSpeaking ? "Mute Briefing" : "🎙️ Risk Audio"}
          </button>
          <div className="radar-status-badge">
            <span className="status-dot-pulse"></span>
            Composite Risk: <strong>{baseRisk}/100</strong>
          </div>
        </div>
      </div>

      {/* TOP EXECUTIVE METRIC CARDS */}
      <div className="radar-kpi-strip">
        <div className="radar-kpi-card">
          <div className="radar-kpi-label">TOTAL VALUE AT RISK (VaR)</div>
          <div className="radar-kpi-val text-gradient-danger">
            {formatCurrency(totalStressedExposure)}
          </div>
          <div className="radar-kpi-sub">
            {stressMultiplier > 1.0 ? `Stressed at ${stressMultiplier}x Macro Shock` : "Baseline 1.0x Exposure"}
          </div>
        </div>

        <div className="radar-kpi-card">
          <div className="radar-kpi-label">ACTIVE THREAT VECTORS</div>
          <div className="radar-kpi-val">
            {rawRisks.length} <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Monitored</span>
          </div>
          <div className="radar-kpi-sub">
            {rawRisks.filter((r) => r.severity === "CRITICAL").length} Critical • {rawRisks.filter((r) => r.severity === "HIGH").length} Elevated
          </div>
        </div>

        <div className="radar-kpi-card">
          <div className="radar-kpi-label">HEDGE COVERAGE RATIO</div>
          <div className="radar-kpi-val text-gradient-emerald">
            {hedgePercentage}%
          </div>
          <div className="radar-kpi-sub">
            {hedgedCount} of {rawRisks.length} Vectors Mitigated
          </div>
        </div>

        <div className="radar-kpi-card">
          <div className="radar-kpi-label">MAX SINGLE EXPOSURE</div>
          <div className="radar-kpi-val">
            {formatCurrency(Math.max(...rawRisks.map((r) => r.baseExposure * stressMultiplier)))}
          </div>
          <div className="radar-kpi-sub">Liquidity / Demand Contraction</div>
        </div>
      </div>

      {/* MACRO STRESS SIMULATOR CONTROLS */}
      <div className="radar-stress-toolbar">
        <div className="stress-label-group">
          <SparklesIcon size={16} color="#6366F1" />
          <span className="stress-title">Macroeconomic Stress-Testing Simulator:</span>
          <span className="stress-multiplier-badge">{stressMultiplier.toFixed(2)}x Multiplier</span>
        </div>
        <div className="stress-buttons-group">
          {[
            { label: "1.0x Baseline", val: 1.0 },
            { label: "1.25x Moderate Shock", val: 1.25 },
            { label: "1.50x Severe Stagflation", val: 1.5 },
            { label: "2.0x Black Swan Crisis", val: 2.0 },
          ].map((preset) => (
            <button
              key={preset.val}
              className={`stress-preset-btn ${stressMultiplier === preset.val ? "active" : ""}`}
              onClick={() => {
                setStressMultiplier(preset.val);
                if (flashMessage) {
                  flashMessage(`Applied ${preset.label}: Recalculating Value-at-Risk across all vectors.`);
                }
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2D INTERACTIVE EXPOSURE MATRIX */}
      <div className="exposure-matrix-section">
        <div className="matrix-section-header">
          <div>
            <h2 className="matrix-section-title">
              Interactive 2D Risk Exposure Matrix <span className="interactive-hint">(Click any cell or dot to select)</span>
            </h2>
            <p className="matrix-section-sub">
              Cross-plots <strong>Impact Severity</strong> vs. <strong>Likelihood Probability</strong>. Click any cell or risk token to inspect diagnostics and dispatch mitigations.
            </p>
          </div>
          <div className="matrix-legend">
            <span className="legend-item"><span className="legend-box box-critical"></span> Critical</span>
            <span className="legend-item"><span className="legend-box box-high"></span> High</span>
            <span className="legend-item"><span className="legend-box box-medium"></span> Moderate</span>
            <span className="legend-item"><span className="legend-box box-low"></span> Low</span>
          </div>
        </div>

        <div className="matrix-grid-container">
          <div className="matrix-y-axis-label">
            <span>IMPACT SEVERITY →</span>
          </div>

          <div className="matrix-table-wrap">
            <div className="matrix-grid-table">
              {matrixCells.map((rowImpact) => {
                const impactTitles = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];
                return (
                  <div key={rowImpact} className="matrix-row">
                    <div className="matrix-row-label">
                      <span className="matrix-row-num">{rowImpact}</span>
                      <span className="matrix-row-name">{impactTitles[rowImpact - 1]}</span>
                    </div>

                    {matrixCols.map((colLikelihood) => {
                      const cellRisks = rawRisks.filter(
                        (r) => r.impact === rowImpact && r.likelihood === colLikelihood
                      );
                      const isCellSelected = cellRisks.some((r) => r.id === selectedRiskId);
                      const severityClass = getCellSeverityColor(rowImpact, colLikelihood);

                      return (
                        <div
                          key={colLikelihood}
                          className={`matrix-cell ${severityClass} ${isCellSelected ? "matrix-cell-selected" : ""} ${cellRisks.length > 0 ? "has-risks" : ""}`}
                          onClick={() => {
                            if (cellRisks.length > 0) {
                              setSelectedRiskId(cellRisks[0].id);
                              if (flashMessage) flashMessage(`Selected ${cellRisks[0].title} from Exposure Matrix`);
                            }
                          }}
                          title={`Impact ${rowImpact}/5, Likelihood ${colLikelihood}/5: ${cellRisks.length} Risk(s)`}
                        >
                          {cellRisks.map((r) => {
                            const isSelected = r.id === selectedRiskId;
                            const isHedged = hedgedMap[r.id];
                            return (
                              <button
                                key={r.id}
                                className={`matrix-risk-dot ${isSelected ? "dot-selected" : ""} ${isHedged ? "dot-hedged" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRiskId(r.id);
                                  if (flashMessage) flashMessage(`Selected threat: ${r.title}`);
                                }}
                                title={`${r.id}: ${r.title} (${formatCurrency(r.baseExposure * stressMultiplier)})`}
                              >
                                <span className="dot-code">{r.id}</span>
                                {isSelected && <span className="dot-pulse-ring"></span>}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* X-AXIS LIKELIHOOD LABELS */}
            <div className="matrix-x-axis">
              <div className="matrix-x-spacer"></div>
              {["1: Rare", "2: Unlikely", "3: Possible", "4: Likely", "5: Almost Certain"].map((label, idx) => (
                <div key={idx} className="matrix-col-label">
                  {label}
                </div>
              ))}
            </div>
            <div className="matrix-x-axis-title">
              <span>LIKELIHOOD PROBABILITY →</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="radar-filter-bar">
        <div className="filter-group">
          <span className="filter-group-label">Category:</span>
          {["ALL", "MARKET", "SUPPLY_CHAIN", "ACQUISITION", "FINANCIAL", "OPERATIONAL"].map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "ALL" ? "All Vectors (6)" : cat.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Severity:</span>
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
            <button
              key={sev}
              className={`filter-chip ${severityFilter === sev ? "active" : ""}`}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="search-box-wrap">
          <input
            type="text"
            className="radar-search-input"
            placeholder="Search risk vectors, triggers, hedges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: SELECTABLE CARDS (LEFT) & DEEP DIAGNOSTICS (RIGHT) */}
      <div className="risk-workspace-grid">
        {/* LEFT COLUMN: SELECTABLE THREAT CARDS */}
        <div className="risk-list-column">
          <div className="column-header">
            <h3 className="column-title">
              Identified Threat Vectors ({filteredRisks.length})
            </h3>
            <span className="column-sub">Click any card to select & inspect</span>
          </div>

          <div className="risk-cards-stack">
            {filteredRisks.map((r) => {
              const isSelected = r.id === selectedRiskId;
              const isHedged = hedgedMap[r.id];
              const dynamicExp = Math.round(r.baseExposure * stressMultiplier);

              return (
                <div
                  key={r.id}
                  className={`interactive-risk-card ${isSelected ? "card-selected" : ""} ${isHedged ? "card-hedged" : ""}`}
                  onClick={() => {
                    setSelectedRiskId(r.id);
                    if (flashMessage) flashMessage(`Selected: ${r.title}`);
                  }}
                >
                  <div className="risk-card-top">
                    <div className="risk-badge-cluster">
                      <span className={`risk-id-pill ${isSelected ? "pill-active" : ""}`}>{r.id}</span>
                      <span className="risk-category-tag">{r.categoryLabel}</span>
                      {isHedged && <span className="risk-hedged-tag">🛡️ HEDGED</span>}
                    </div>
                    <span className={`status-pill ${r.severity === "CRITICAL" ? "pill-rejected" : r.severity === "HIGH" ? "pill-modified" : "pill-accepted"}`}>
                      {r.severity}
                    </span>
                  </div>

                  <h4 className="risk-card-title">{r.title}</h4>

                  <p className="risk-card-summary">
                    {r.description.slice(0, 110)}...
                  </p>

                  <div className="risk-card-metrics">
                    <div className="metric-col">
                      <span className="m-label">Value at Risk</span>
                      <span className="m-val text-danger">{formatCurrency(dynamicExp)}</span>
                    </div>
                    <div className="metric-col">
                      <span className="m-label">Threat Index</span>
                      <span className="m-val">{r.threatScore}/100</span>
                    </div>
                    <div className="metric-col">
                      <span className="m-label">Matrix Coordinates</span>
                      <span className="m-val">Imp {r.impact} • Lik {r.likelihood}</span>
                    </div>
                  </div>

                  <div className="risk-card-action-hint">
                    {isSelected ? (
                      <span className="active-selection-indicator">
                        <CheckCircleIcon size={14} color="#10B981" /> Currently Selected for Diagnostics
                      </span>
                    ) : (
                      <span className="click-to-select-indicator">
                        Click to Select & Stress-Test →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredRisks.length === 0 && (
              <div className="empty-filter-state">
                <p>No threat vectors match the active filter criteria.</p>
                <button
                  className="cinematic-action-btn"
                  onClick={() => {
                    setCategoryFilter("ALL");
                    setSeverityFilter("ALL");
                    setSearchQuery("");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DEEP-DIVE THREAT DIAGNOSTICS & ACTION ENGINE */}
        <div className="risk-diagnostics-column">
          {selectedRisk ? (
            <div className="diagnostics-panel">
              <div className="diag-header">
                <div className="diag-header-top">
                  <span className="diag-id-badge">{selectedRisk.id} • {selectedRisk.categoryLabel}</span>
                  <span className={`status-pill ${selectedRisk.severity === "CRITICAL" ? "pill-rejected" : selectedRisk.severity === "HIGH" ? "pill-modified" : "pill-accepted"}`}>
                    {selectedRisk.severity} SEVERITY
                  </span>
                </div>
                <h3 className="diag-title">{selectedRisk.title}</h3>
                <p className="diag-sub">{selectedRisk.description}</p>
              </div>

              {/* THREAT SCORE GAUGE & METRICS */}
              <div className="diag-score-strip">
                <div className="score-box">
                  <div className="score-val text-gradient-danger">{selectedRisk.threatScore}</div>
                  <div className="score-lbl">Threat Score / 100</div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${selectedRisk.threatScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="score-box">
                  <div className="score-val">{selectedRisk.likelihoodLabel}</div>
                  <div className="score-lbl">Likelihood Rating</div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill fill-amber"
                      style={{ width: `${selectedRisk.likelihood * 20}%` }}
                    ></div>
                  </div>
                </div>

                <div className="score-box">
                  <div className="score-val">{selectedRisk.impactLabel}</div>
                  <div className="score-lbl">Impact Rating</div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill fill-rose"
                      style={{ width: `${selectedRisk.impact * 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* FINANCIAL EXPOSURE BREAKDOWN */}
              <div className="diag-exposure-box">
                <div className="exp-row">
                  <span>Baseline Exposure (1.0x):</span>
                  <strong style={{ color: "var(--text-primary)" }}>{formatCurrency(selectedRisk.baseExposure)}</strong>
                </div>
                <div className="exp-row">
                  <span>Macro Stress Multiplier:</span>
                  <strong style={{ color: "#818CF8" }}>{stressMultiplier.toFixed(2)}x Active</strong>
                </div>
                <div className="exp-row total-exp-row">
                  <span>Stressed Value at Risk (VaR):</span>
                  <strong className="text-danger">{formatCurrency(Math.round(selectedRisk.baseExposure * stressMultiplier))}</strong>
                </div>
              </div>

              {/* LIVE DNA TELEMETRY TRIGGERS */}
              <div className="diag-section">
                <h4 className="diag-sec-title">🧬 Live Business DNA Telemetry Correlation</h4>
                <div className="dna-triggers-grid">
                  {selectedRisk.dnaTriggers.map((t, idx) => (
                    <div key={idx} className="dna-trigger-card">
                      <span className="trigger-label">{t.label}</span>
                      <span className={`trigger-val ${t.status}`}>{t.value}</span>
                    </div>
                  ))}
                </div>
                <p className="diag-root-cause">
                  <strong>Root Cause:</strong> {selectedRisk.rootCause}
                </p>
              </div>

              {/* AUTONOMOUS MITIGATION BLUEPRINT */}
              <div className="diag-section">
                <h4 className="diag-sec-title">🛡️ Recommended Executive Hedge</h4>
                <div className="hedge-blueprint-card">
                  <p>{selectedRisk.recommendedHedge}</p>
                </div>
              </div>

              {/* EXECUTIVE ACTION TOOLBAR */}
              <div className="diag-actions">
                <button
                  className="action-btn-primary"
                  onClick={handleExecuteHedgeAction}
                >
                  <SimulationIcon size={16} />
                  {selectedRisk.actionLabel}
                </button>

                <button
                  className={`action-btn-secondary ${hedgedMap[selectedRisk.id] ? "btn-hedged-active" : ""}`}
                  onClick={() => toggleHedge(selectedRisk.id)}
                >
                  <ShieldIcon size={16} />
                  {hedgedMap[selectedRisk.id] ? "Hedge Verified (Click to Unmark)" : "Register as Hedged"}
                </button>

                <button
                  className="action-btn-outline"
                  onClick={() => {
                    if (onNavigateTab) {
                      onNavigateTab("decisions");
                      if (flashMessage) flashMessage(`Navigating to Decision Ledger to codify hedge for ${selectedRisk.title}`);
                    }
                  }}
                >
                  <DecisionIcon size={16} />
                  Record Governance Decision
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection-panel">
              <RiskIcon size={48} color="#6366F1" />
              <h4>Select a Risk Vector to Inspect</h4>
              <p>Choose any threat vector from the list or click a cell in the Exposure Matrix above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
