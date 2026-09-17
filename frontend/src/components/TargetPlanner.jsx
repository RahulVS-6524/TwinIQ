import { useState, useMemo, useEffect } from "react";
import {
  TargetIcon,
  SparklesIcon,
  SpeakerIcon,
  VolumeXIcon,
  CheckCircleIcon,
  PlayIcon,
  CompassIcon,
  ShieldIcon,
  ScenarioIcon,
  DecisionIcon,
  OpportunityIcon,
} from "../Icons";

export default function TargetPlanner({
  business,
  dna,
  scenarios = [],
  simulations = [],
  dashboardData,
  formatCurrency,
  formatPct,
  onNavigateTab,
  onTestScenarioInSimulator,
  onCommitDecision,
}) {
  // Baseline initializers from live DNA
  const rawRev = parseFloat(dna?.revenue) || 12500000;
  const rawMargin = parseFloat(dna?.profitMargin) || 24.5;
  const rawRet = parseFloat(dna?.customerRetention) || 82.0;
  const rawCac = parseFloat(dna?.customerAcquisitionCost) || 1450;
  const rawEff = parseFloat(dna?.operationalEfficiency) || 76.0;
  const rawRisk = parseFloat(dna?.riskLevel) || 35.0;

  // Step 1: Baseline Inputs (defaults to live DNA, allows user override & reset)
  const [currentRev, setCurrentRev] = useState(rawRev);
  const [currentMargin, setCurrentMargin] = useState(rawMargin);
  const [currentRetention, setCurrentRetention] = useState(rawRet);
  const [currentCac, setCurrentCac] = useState(rawCac);

  // Sync with DNA if DNA changes
  useEffect(() => {
    if (dna) {
      if (dna.revenue) setCurrentRev(parseFloat(dna.revenue));
      if (dna.profitMargin) setCurrentMargin(parseFloat(dna.profitMargin));
      if (dna.customerRetention) setCurrentRetention(parseFloat(dna.customerRetention));
      if (dna.customerAcquisitionCost) setCurrentCac(parseFloat(dna.customerAcquisitionCost));
    }
  }, [dna?.id]);

  // Step 2: Target Outcome Inputs
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [targetRev, setTargetRev] = useState(() => Math.round(rawRev * 1.35));
  const [targetMargin, setTargetMargin] = useState(() => Math.min(65, Math.round(rawMargin + 5.5)));
  const [targetRetention, setTargetRetention] = useState(() => Math.min(98, Math.round(rawRet + 6)));
  const [riskPosture, setRiskPosture] = useState("balanced"); // conservative | balanced | aggressive

  // Audio Speech state for AURA Voice Briefing
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(null);

  // Reset baseline to live DNA
  const handleResetBaseline = () => {
    setCurrentRev(rawRev);
    setCurrentMargin(rawMargin);
    setCurrentRetention(rawRet);
    setCurrentCac(rawCac);
  };

  // Quick Preset Handlers
  const applyPreset = (presetType) => {
    if (presetType === "steady_growth") {
      setTargetRev(Math.round(currentRev * 1.20));
      setTargetMargin(Math.min(60, currentMargin + 3));
      setTargetRetention(Math.min(95, currentRetention + 4));
      setRiskPosture("conservative");
    } else if (presetType === "market_leader") {
      setTargetRev(Math.round(currentRev * 1.45));
      setTargetMargin(Math.min(60, currentMargin + 6));
      setTargetRetention(Math.min(95, currentRetention + 7));
      setRiskPosture("balanced");
    } else if (presetType === "hyper_scale") {
      setTargetRev(Math.round(currentRev * 1.85));
      setTargetMargin(Math.min(60, currentMargin + 8));
      setTargetRetention(Math.min(95, currentRetention + 10));
      setRiskPosture("aggressive");
    }
  };

  // Backcasting calculations
  const engineResults = useMemo(() => {
    const revDelta = targetRev - currentRev;
    const revGrowthPct = currentRev > 0 ? (revDelta / currentRev) * 100 : 0;
    const marginDelta = targetMargin - currentMargin;
    const retDelta = targetRetention - currentRetention;

    // Monthly required compound growth rate
    const months = Math.max(1, horizonMonths);
    const monthlyRate = currentRev > 0 && targetRev > 0
      ? (Math.pow(targetRev / currentRev, 1 / months) - 1) * 100
      : 0;

    // Feasibility Score formulation
    let feasibility = 92;

    if (monthlyRate > 5.0) feasibility -= (monthlyRate - 5.0) * 8;
    else if (monthlyRate > 3.0) feasibility -= (monthlyRate - 3.0) * 4;
    else if (monthlyRate < 0) feasibility -= 15;

    if (marginDelta > 10) feasibility -= (marginDelta - 10) * 2.5;
    else if (marginDelta > 5) feasibility -= (marginDelta - 5) * 1.5;

    if (retDelta > 12) feasibility -= (retDelta - 12) * 2;

    if (riskPosture === "conservative") {
      feasibility = Math.max(feasibility - 5, 20);
    } else if (riskPosture === "aggressive") {
      feasibility = Math.min(feasibility + 8, 98);
    }

    const effBonus = (rawEff - 70) * 0.2;
    feasibility += effBonus;

    const clampedScore = Math.max(15, Math.min(98, Math.round(feasibility)));

    let feasibilityStatus = "High Feasibility";
    let statusClass = "status-high";
    let statusSummary = "Strategic target is aligned with twin capacity and sustainable market velocity.";

    if (clampedScore < 50) {
      feasibilityStatus = "Extreme Moonshot (High Risk)";
      statusClass = "status-low";
      statusSummary = "Aggressive growth demands significant external capital or operational restructuring.";
    } else if (clampedScore < 75) {
      feasibilityStatus = "Moderate Stretch (Calculated)";
      statusClass = "status-medium";
      statusSummary = "Achievable with disciplined execution across all three roadmap phases.";
    }

    // Phase 1 Breakdown (Months 1 to ~1/3 horizon)
    const phase1Months = Math.max(1, Math.round(months * 0.25));
    const phase1RevTarget = Math.round(currentRev + revDelta * 0.22);
    const phase1MarginTarget = +(currentMargin + marginDelta * 0.35).toFixed(1);
    const phase1PriceLever = riskPosture === "aggressive" ? +6.5 : +4.2;
    const phase1OpexCut = riskPosture === "conservative" ? -5.5 : -3.5;

    // Phase 2 Breakdown (Months ~1/3 to 2/3 horizon)
    const phase2Months = Math.max(2, Math.round(months * 0.65));
    const phase2RevTarget = Math.round(currentRev + revDelta * 0.68);
    const phase2MarginTarget = +(currentMargin + marginDelta * 0.75).toFixed(1);
    const phase2CacTarget = Math.max(500, Math.round(currentCac * 0.91));
    const phase2MarketingLever = riskPosture === "aggressive" ? +28 : +16;

    // Phase 3 Breakdown (Final completion)
    const phase3RevTarget = targetRev;
    const phase3MarginTarget = targetMargin;
    const phase3RetTarget = targetRetention;

    return {
      revDelta,
      revGrowthPct,
      marginDelta,
      retDelta,
      monthlyRate,
      clampedScore,
      feasibilityStatus,
      statusClass,
      statusSummary,
      phase1: {
        title: "Phase 1: Foundation & High-Yield Levers",
        timeframe: `Months 1 - ${phase1Months}`,
        focus: "Immediate margin stabilization, price cushion testing, and churn intervention.",
        targetRev: phase1RevTarget,
        targetMargin: phase1MarginTarget,
        levers: [
          { label: "Price Elasticity Cushion", value: `+${phase1PriceLever}%`, detail: "Calibrated selective price adjustment on high-stickiness products" },
          { label: "Procurement & Leakage Tightening", value: `${phase1OpexCut}%`, detail: "Eliminate low-ROI discretionary overhead & contract renegotiation" },
          { label: "At-Risk Account Shield", value: "+3.2 pts", detail: "Early-warning trigger on customers exceeding 30-day inactivity" },
        ],
        milestone: `Reach ${formatCurrency(phase1RevTarget)} run-rate with ${phase1MarginTarget}% margin cushion.`,
      },
      phase2: {
        title: "Phase 2: Growth Acceleration & Engine Scaling",
        timeframe: `Months ${phase1Months + 1} - ${phase2Months}`,
        focus: "Channel scaling, digital conversion lift, and expansion ACV.",
        targetRev: phase2RevTarget,
        targetMargin: phase2MarginTarget,
        levers: [
          { label: "Performance Marketing Allocation", value: `+${phase2MarketingLever}%`, detail: "Reallocate budget into top 2 ROI acquisition channels" },
          { label: "Customer Acquisition Efficiency", value: formatCurrency(phase2CacTarget), detail: "Trim CAC by ~9% through higher-intent funnel qualification" },
          { label: "Cross-Sell / Expansion Revenue", value: "+14.5%", detail: "Introduce packaged add-ons for accounts past month 4" },
        ],
        milestone: `Cross ${formatCurrency(phase2RevTarget)} run-rate while holding CAC below ${formatCurrency(phase2CacTarget)}.`,
      },
      phase3: {
        title: "Phase 3: Flywheel Moat & Target Realization",
        timeframe: `Months ${phase2Months + 1} - ${months}`,
        focus: "Cohort retention moat, premium product mix, and resilient capital reserves.",
        targetRev: phase3RevTarget,
        targetMargin: phase3MarginTarget,
        levers: [
          { label: "Cohort Retention Lock-In", value: `${phase3RetTarget}%`, detail: "Automated customer success workflows and loyalty lock-in" },
          { label: "High-Margin Tier Expansion", value: `+${(marginDelta * 0.4).toFixed(1)} pts`, detail: "Transition tier mix toward enterprise recurring tiers" },
          { label: "Predictive Twin Feedback", value: "Active", detail: "Autonomous calibration preventing forecast drift" },
        ],
        milestone: `Full realization of ${formatCurrency(targetRev)} at ${targetMargin}% margin and ${phase3RetTarget}% retention.`,
      },
      risks: [
        {
          title: "CAC Inflation Risk",
          level: monthlyRate > 4 ? "High" : "Medium",
          desc: "Scaling marketing spend faster than channel saturation could inflate acquisition costs by 15-25%.",
          remedy: "Set strict weekly CAC ceilings in Phase 2 before scaling budget.",
        },
        {
          title: "Margin Compression Threat",
          level: marginDelta < 3 ? "Low" : "Medium",
          desc: "Volume growth without strict COGS discipline can erode gross margins.",
          remedy: "Lock Phase 1 supplier contracts before initiating Phase 2 volume surge.",
        },
        {
          title: "Working Capital Runaway",
          level: revGrowthPct > 50 ? "High" : "Low",
          desc: "Accelerating receivables can strain short-term liquidity if payment cycles lag.",
          remedy: "Incentivize annual upfront billing in Phase 1 with modest discount.",
        },
      ],
    };
  }, [
    currentRev,
    currentMargin,
    currentRetention,
    currentCac,
    targetRev,
    targetMargin,
    targetRetention,
    horizonMonths,
    riskPosture,
    rawEff,
    formatCurrency,
  ]);

  // Voice Briefing via Web Speech API
  const handleToggleVoiceBriefing = () => {
    if (!("speechSynthesis" in window)) {
      alert("Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrationText = `Strategic Target Briefing for ${business?.businessName || "your enterprise"}.
      You are planning for a ${horizonMonths} month horizon.
      Target revenue is set to ${formatCurrency(targetRev)}, representing a ${engineResults.revGrowthPct.toFixed(1)} percent growth.
      Target profit margin is ${targetMargin} percent, and target customer retention is ${targetRetention} percent.
      Our cognitive twin assesses this strategic plan with a feasibility score of ${engineResults.clampedScore} percent, classified as ${engineResults.feasibilityStatus}.
      Here is your phased execution roadmap:
      In Phase 1, focus on foundation and immediate margin cushioning with a price optimization of plus ${riskPosture === "aggressive" ? "6.5" : "4.2"} percent.
      In Phase 2, scale marketing by ${riskPosture === "aggressive" ? "28" : "16"} percent while guarding CAC below ${formatCurrency(Math.round(currentCac * 0.91))}.
      In Phase 3, cement your retention moat to lock in ${targetRetention} percent retention and capture your target revenue.
      The TwinIQ engine is ready to simulate these levers in the Decision Lab.`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Natural") ||
        v.name.includes("Google") ||
        v.name.includes("Samantha") ||
        v.name.includes("Jenny") ||
        v.name.includes("Zira")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 1-Click CTA: Test Phase 1 in Simulator
  const handleTestInSimulator = () => {
    if (onTestScenarioInSimulator) {
      onTestScenarioInSimulator({
        scenarioType: "PRICE_CHANGE",
        changePercent: riskPosture === "aggressive" ? 6.5 : 4.2,
        notes: `Backcasted Phase 1 lever for ${formatCurrency(targetRev)} target revenue (${horizonMonths}-month horizon)`,
      });
    } else if (onNavigateTab) {
      onNavigateTab("scenarios");
    }
  };

  // 1-Click CTA: Commit Roadmap to Decision Ledger
  const handleCommitPlan = async () => {
    setIsCommitting(true);
    setCommitSuccess(null);
    try {
      if (onCommitDecision) {
        await onCommitDecision({
          notes: `[Strategic Target Plan] Horizon: ${horizonMonths}M | Target Rev: ${formatCurrency(targetRev)} (+${engineResults.revGrowthPct.toFixed(1)}%) | Target Margin: ${targetMargin}% | Feasibility: ${engineResults.clampedScore}% (${engineResults.feasibilityStatus}) | Posture: ${riskPosture}`,
          status: "APPROVED",
        });
      }
      setCommitSuccess("Strategic Target Roadmap successfully committed to Decision Ledger!");
      setTimeout(() => setCommitSuccess(null), 5000);
    } catch (err) {
      alert("Failed to commit roadmap: " + err.message);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="target-planner-container">
      {/* HEADER BANNER */}
      <div className="target-planner-header">
        <div className="planner-header-left">
          <div className="planner-badge">
            <span className="planner-badge-icon"><TargetIcon size={16} /></span>
            <span>Strategic Target Planner & Outcome Engine</span>
          </div>
          <h1 className="planner-title">
            Goal-to-Outcome <span className="gradient-text">Backcasting Engine</span>
          </h1>
          <p className="planner-subtitle">
            Define your enterprise destination. TwinIQ backpropagates the required quantitative milestones,
            execution phases, exact operational levers, and risk guardrails needed to achieve your goals.
          </p>
        </div>

        <div className="planner-header-actions">
          <button
            className={`aura-voice-briefing-btn ${isSpeaking ? "speaking" : ""}`}
            onClick={handleToggleVoiceBriefing}
            title={isSpeaking ? "Stop Voice Briefing" : "Listen to AURA Executive Voice Briefing"}
          >
            {isSpeaking ? (
              <>
                <VolumeXIcon size={18} />
                <span>Stop Briefing</span>
                <span className="voice-pulse-ring"></span>
              </>
            ) : (
              <>
                <SpeakerIcon size={18} />
                <span>🎙️ AURA Voice Briefing</span>
              </>
            )}
          </button>

          <button
            className="planner-print-btn"
            onClick={() => window.print()}
            title="Print or Export Executive Blueprint"
          >
            📄 Board Memo
          </button>
        </div>
      </div>

      {commitSuccess && (
        <div className="commit-success-banner">
          <CheckCircleIcon size={18} color="#10B981" />
          <span>{commitSuccess}</span>
        </div>
      )}

      {/* TWO-COLUMN CONFIGURATION MATRIX */}
      <div className="planner-config-grid">
        {/* LEFT COLUMN: CURRENT STATUS (INPUTS) */}
        <div className="planner-card baseline-card">
          <div className="card-header-row">
            <div>
              <span className="card-step-badge">STEP 1</span>
              <h3 className="card-title">Current Business Status (Baseline)</h3>
            </div>
            <button
              className="reset-baseline-btn"
              onClick={handleResetBaseline}
              title="Reset to live calibrated DNA metrics"
            >
              🔄 Reset to DNA
            </button>
          </div>
          <p className="card-desc">
            Pre-populated from active Business DNA #{business?.id || 1}. Adjust any parameter to model a customized starting position.
          </p>

          <div className="input-fields-grid">
            <div className="planner-input-group">
              <label className="input-label">Current Revenue (Run-Rate)</label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  className="planner-input"
                  value={currentRev}
                  onChange={(e) => setCurrentRev(Number(e.target.value))}
                  step="50000"
                />
              </div>
              <span className="input-hint">{formatCurrency(currentRev)} annual run-rate</span>
            </div>

            <div className="planner-input-group">
              <label className="input-label">Current Profit Margin</label>
              <div className="percentage-input-wrapper">
                <input
                  type="number"
                  className="planner-input"
                  value={currentMargin}
                  onChange={(e) => setCurrentMargin(Number(e.target.value))}
                  step="0.5"
                  min="0"
                  max="100"
                />
                <span className="input-unit">%</span>
              </div>
              <span className="input-hint">EBITDA margin baseline</span>
            </div>

            <div className="planner-input-group">
              <label className="input-label">Customer Retention Rate</label>
              <div className="percentage-input-wrapper">
                <input
                  type="number"
                  className="planner-input"
                  value={currentRetention}
                  onChange={(e) => setCurrentRetention(Number(e.target.value))}
                  step="0.5"
                  min="0"
                  max="100"
                />
                <span className="input-unit">%</span>
              </div>
              <span className="input-hint">Annual cohort retention</span>
            </div>

            <div className="planner-input-group">
              <label className="input-label">Customer Acquisition Cost (CAC)</label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  className="planner-input"
                  value={currentCac}
                  onChange={(e) => setCurrentCac(Number(e.target.value))}
                  step="50"
                  min="0"
                />
              </div>
              <span className="input-hint">Blended channel CAC</span>
            </div>
          </div>

          <div className="baseline-health-strip">
            <div className="strip-item">
              <span className="strip-label">Operational Efficiency:</span>
              <span className="strip-val">{rawEff}%</span>
            </div>
            <div className="strip-item">
              <span className="strip-label">Baseline Risk Score:</span>
              <span className="strip-val">{rawRisk}/100</span>
            </div>
            <div className="strip-item">
              <span className="strip-label">Twin Telemetry:</span>
              <span className="strip-val active-green">● Live Ingestion</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DESIRED FUTURE OUTCOMES (GOALS) */}
        <div className="planner-card target-card">
          <div className="card-header-row">
            <div>
              <span className="card-step-badge target-step">STEP 2</span>
              <h3 className="card-title">Desired Future Outcome (Target)</h3>
            </div>
            <div className="preset-pill-group">
              <button className="preset-pill" onClick={() => applyPreset("steady_growth")}>
                +20% Steady
              </button>
              <button className="preset-pill" onClick={() => applyPreset("market_leader")}>
                +45% Leader
              </button>
              <button className="preset-pill highlight" onClick={() => applyPreset("hyper_scale")}>
                ⚡ Hyper-Scale
              </button>
            </div>
          </div>
          <p className="card-desc">
            Specify the strategic destination your executive board aims to reach.
          </p>

          <div className="input-fields-grid">
            <div className="planner-input-group">
              <label className="input-label">Target Revenue</label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  className="planner-input highlight"
                  value={targetRev}
                  onChange={(e) => setTargetRev(Number(e.target.value))}
                  step="100000"
                />
              </div>
              <span className="input-hint delta-positive">
                +{engineResults.revGrowthPct.toFixed(1)}% ({formatCurrency(engineResults.revDelta)} growth)
              </span>
            </div>

            <div className="planner-input-group">
              <label className="input-label">Target Profit Margin</label>
              <div className="percentage-input-wrapper">
                <input
                  type="number"
                  className="planner-input highlight"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  step="0.5"
                  min="0"
                  max="100"
                />
                <span className="input-unit">%</span>
              </div>
              <span className="input-hint delta-positive">
                +{engineResults.marginDelta.toFixed(1)} pts expansion
              </span>
            </div>

            <div className="planner-input-group">
              <label className="input-label">Target Customer Retention</label>
              <div className="percentage-input-wrapper">
                <input
                  type="number"
                  className="planner-input highlight"
                  value={targetRetention}
                  onChange={(e) => setTargetRetention(Number(e.target.value))}
                  step="0.5"
                  min="0"
                  max="100"
                />
                <span className="input-unit">%</span>
              </div>
              <span className="input-hint delta-positive">
                +{engineResults.retDelta.toFixed(1)} pts retention moat
              </span>
            </div>

            <div className="planner-input-group">
              <label className="input-label">Planning Horizon</label>
              <div className="horizon-selector-row">
                {[3, 6, 12, 24].map((m) => (
                  <button
                    key={m}
                    className={`horizon-btn ${horizonMonths === m ? "active" : ""}`}
                    onClick={() => setHorizonMonths(m)}
                  >
                    {m}M
                  </button>
                ))}
              </div>
              <span className="input-hint">Required rate: {engineResults.monthlyRate.toFixed(2)}%/mo</span>
            </div>
          </div>

          {/* RISK POSTURE SELECTOR */}
          <div className="risk-posture-container">
            <label className="input-label">Strategic Risk Appetite</label>
            <div className="posture-buttons-grid">
              <button
                className={`posture-btn ${riskPosture === "conservative" ? "active conservative" : ""}`}
                onClick={() => setRiskPosture("conservative")}
              >
                <span className="posture-icon">🛡️</span>
                <span className="posture-name">Conservative</span>
                <span className="posture-sub">Defend Margins & Cash</span>
              </button>

              <button
                className={`posture-btn ${riskPosture === "balanced" ? "active balanced" : ""}`}
                onClick={() => setRiskPosture("balanced")}
              >
                <span className="posture-icon">⚖️</span>
                <span className="posture-name">Balanced</span>
                <span className="posture-sub">Optimal Risk-Reward</span>
              </button>

              <button
                className={`posture-btn ${riskPosture === "aggressive" ? "active aggressive" : ""}`}
                onClick={() => setRiskPosture("aggressive")}
              >
                <span className="posture-icon">🚀</span>
                <span className="posture-name">Aggressive</span>
                <span className="posture-sub">Maximum Growth Velocity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME FEASIBILITY & GAP ANALYSIS STRIP */}
      <div className="feasibility-banner-card">
        <div className="feasibility-meter-section">
          <div className="feasibility-radial-wrap">
            <svg viewBox="0 0 100 100" className="feasibility-radial">
              <circle cx="50" cy="50" r="42" className="radial-track" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`radial-fill ${engineResults.statusClass}`}
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * engineResults.clampedScore) / 100}
              />
            </svg>
            <div className="feasibility-center-label">
              <span className="feasibility-num">{engineResults.clampedScore}%</span>
              <span className="feasibility-unit">SCORE</span>
            </div>
          </div>

          <div className="feasibility-text-wrap">
            <div className="feasibility-status-row">
              <span className={`feasibility-badge ${engineResults.statusClass}`}>
                {engineResults.feasibilityStatus}
              </span>
              <span className="horizon-tag">⏱️ {horizonMonths} Month Backcast</span>
            </div>
            <p className="feasibility-summary">{engineResults.statusSummary}</p>
          </div>
        </div>

        <div className="gap-kpis-section">
          <div className="gap-kpi-item">
            <span className="kpi-label">Top-Line Expansion Gap</span>
            <span className="kpi-value text-cyan">{formatCurrency(engineResults.revDelta)}</span>
            <span className="kpi-sub">+{engineResults.revGrowthPct.toFixed(1)}% total lift</span>
          </div>

          <div className="gap-kpi-item">
            <span className="kpi-label">Required Velocity</span>
            <span className="kpi-value text-purple">+{engineResults.monthlyRate.toFixed(2)}%/mo</span>
            <span className="kpi-sub">Compound Monthly Growth</span>
          </div>

          <div className="gap-kpi-item">
            <span className="kpi-label">Margin Expansion</span>
            <span className="kpi-value text-emerald">+{engineResults.marginDelta.toFixed(1)} pts</span>
            <span className="kpi-sub">{currentMargin}% → {targetMargin}%</span>
          </div>

          <div className="gap-kpi-item">
            <span className="kpi-label">Retention Delta</span>
            <span className="kpi-value text-amber">+{engineResults.retDelta.toFixed(1)} pts</span>
            <span className="kpi-sub">{currentRetention}% → {targetRetention}%</span>
          </div>
        </div>
      </div>

      {/* STEP 3: THE STEP-BY-STEP PHASED EXECUTION ROADMAP */}
      <div className="roadmap-section">
        <div className="section-title-row">
          <div>
            <span className="card-step-badge">STEP 3</span>
            <h2 className="section-title">Step-by-Step Phased Execution Playbook</h2>
          </div>
          <span className="roadmap-tagline">
            Autonomous Backcast: Levers synthesized to bridge the {formatCurrency(engineResults.revDelta)} delta
          </span>
        </div>

        <div className="roadmap-cards-container">
          {/* PHASE 1 */}
          <div className="phase-card">
            <div className="phase-header">
              <div className="phase-tag phase-1-tag">PHASE 1</div>
              <span className="phase-timeframe">{engineResults.phase1.timeframe}</span>
            </div>
            <h3 className="phase-title">{engineResults.phase1.title}</h3>
            <p className="phase-focus">{engineResults.phase1.focus}</p>

            <div className="phase-levers-list">
              {engineResults.phase1.levers.map((lever, idx) => (
                <div key={idx} className="lever-item">
                  <div className="lever-header">
                    <span className="lever-name">{lever.label}</span>
                    <span className="lever-val text-cyan">{lever.value}</span>
                  </div>
                  <span className="lever-detail">{lever.detail}</span>
                </div>
              ))}
            </div>

            <div className="phase-milestone">
              <span className="milestone-icon">🎯</span>
              <span className="milestone-text">{engineResults.phase1.milestone}</span>
            </div>
          </div>

          {/* PHASE 2 */}
          <div className="phase-card highlight-phase">
            <div className="phase-header">
              <div className="phase-tag phase-2-tag">PHASE 2</div>
              <span className="phase-timeframe">{engineResults.phase2.timeframe}</span>
            </div>
            <h3 className="phase-title">{engineResults.phase2.title}</h3>
            <p className="phase-focus">{engineResults.phase2.focus}</p>

            <div className="phase-levers-list">
              {engineResults.phase2.levers.map((lever, idx) => (
                <div key={idx} className="lever-item">
                  <div className="lever-header">
                    <span className="lever-name">{lever.label}</span>
                    <span className="lever-val text-purple">{lever.value}</span>
                  </div>
                  <span className="lever-detail">{lever.detail}</span>
                </div>
              ))}
            </div>

            <div className="phase-milestone">
              <span className="milestone-icon">🚀</span>
              <span className="milestone-text">{engineResults.phase2.milestone}</span>
            </div>
          </div>

          {/* PHASE 3 */}
          <div className="phase-card">
            <div className="phase-header">
              <div className="phase-tag phase-3-tag">PHASE 3</div>
              <span className="phase-timeframe">{engineResults.phase3.timeframe}</span>
            </div>
            <h3 className="phase-title">{engineResults.phase3.title}</h3>
            <p className="phase-focus">{engineResults.phase3.focus}</p>

            <div className="phase-levers-list">
              {engineResults.phase3.levers.map((lever, idx) => (
                <div key={idx} className="lever-item">
                  <div className="lever-header">
                    <span className="lever-name">{lever.label}</span>
                    <span className="lever-val text-emerald">{lever.value}</span>
                  </div>
                  <span className="lever-detail">{lever.detail}</span>
                </div>
              ))}
            </div>

            <div className="phase-milestone">
              <span className="milestone-icon">🏆</span>
              <span className="milestone-text">{engineResults.phase3.milestone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COGNITIVE GUARDRAILS & RISK PITFALLS */}
      <div className="risk-guardrails-section">
        <div className="section-title-row">
          <div>
            <span className="card-step-badge risk-step">STEP 4</span>
            <h3 className="section-title">Cognitive Risk Guardrails & Pitfalls</h3>
          </div>
          <span className="roadmap-tagline">
            Stress-testing your destination against common execution failures
          </span>
        </div>

        <div className="risk-cards-grid">
          {engineResults.risks.map((risk, idx) => (
            <div key={idx} className="risk-guardrail-card">
              <div className="risk-card-top">
                <span className="risk-title">
                  <ShieldIcon size={16} /> {risk.title}
                </span>
                <span className={`risk-level-badge level-${risk.level.toLowerCase()}`}>
                  {risk.level} Risk
                </span>
              </div>
              <p className="risk-desc">{risk.desc}</p>
              <div className="risk-remedy-box">
                <span className="remedy-label">💡 Recommended Guardrail:</span>
                <span className="remedy-text">{risk.remedy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 5: 1-CLICK INTEGRATED EXECUTION ACTIONS */}
      <div className="planner-execution-footer">
        <div className="execution-footer-left">
          <h4 className="footer-title">Ready to operationalize this strategic trajectory?</h4>
          <p className="footer-desc">
            Instantly push these levers into the Decision Lab simulation sandbox or formalize the plan into the enterprise Decision Ledger.
          </p>
        </div>

        <div className="execution-actions-row">
          <button
            className="action-btn test-simulator-btn"
            onClick={handleTestInSimulator}
            title="Formulate a live What-If scenario using Phase 1 levers"
          >
            <ScenarioIcon size={18} />
            <span>⚡ Test Phase 1 in What-If Simulator</span>
          </button>

          <button
            className="action-btn commit-ledger-btn"
            onClick={handleCommitPlan}
            disabled={isCommitting}
            title="Commit this roadmap into the enterprise Decision Ledger"
          >
            <DecisionIcon size={18} />
            <span>{isCommitting ? "Committing..." : "📋 Commit to Decision Ledger"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
