import { useState } from "react";
import { SparklesIcon, ShieldIcon } from "../Icons";

export default function ExplainableAiChain({ onCommitDecision, onExploreEvolution }) {
  const [activeStageId, setActiveStageId] = useState("reasoning");
  const [decisionCommitted, setDecisionCommitted] = useState(false);

  const stages = [
    {
      id: "signals",
      step: "01",
      label: "BUSINESS SIGNALS",
      sub: "Raw Ingestion",
      status: "Observed",
      color: "#06B6D4",
      summary: "Customer retention of 84.5% shows inelastic behavior during recent market shifts.",
      evidence: [
        "Repeat customer purchase frequency unchanged over last 3 quarters.",
        "Competitor price hikes of 12-18% absorbed across the industry without churn.",
        "CAC rising 4.2% in paid search channels, signaling diminishing returns on ad spend.",
      ],
      mathFormula: "Elasticity \\(E_d = \\frac{\\% \\Delta Q}{\\% \\Delta P} = -0.15\\) (Highly Inelastic)",
    },
    {
      id: "dna",
      step: "02",
      label: "BUSINESS DNA",
      sub: "Structural Genes",
      status: "Calibrated",
      color: "#8B5CF6",
      summary: "Competitive moat score (81/100) and customer lifetime loyalty provide pricing power buffer.",
      evidence: [
        "Customer Switching Cost Index: 88/100 (High Barrier).",
        "Operating Margin Baseline: 21.0% with stable unit economics.",
        "Cash Runway Buffer: 14.2 months under zero external capital.",
      ],
      mathFormula: "Safety Buffer Index = \\(100 - \\text{Risk Level} = 72/100\\)",
    },
    {
      id: "current_state",
      step: "03",
      label: "CURRENT STATE",
      sub: "Operational Anchor",
      status: "Verified",
      color: "#3B82F6",
      summary: "Current monthly run-rate stands at ₹22.37L with 21.0% margin.",
      evidence: [
        "Baseline Revenue: ₹22,37,500 run-rate.",
        "Baseline Operating Profit: ₹4,69,875.",
        "Operational Efficiency Rating: 88.0 pts.",
      ],
      mathFormula: "Net Operating Profit = \\(22,37,500 \\times 21.0\\% = 4,69,875\\)",
    },
    {
      id: "scenario",
      step: "04",
      label: "SCENARIO HYPOTHESIS",
      sub: "Stress Injection",
      status: "Simulated",
      color: "#F59E0B",
      summary: "Evaluated +15% price adjustment vs +25% marketing spend.",
      evidence: [
        "Tested Hypothesis Alpha: Price +15%, Marketing 0%, Demand Neutral.",
        "Tested Hypothesis Beta: Price 0%, Marketing +25%, Demand Neutral.",
        "Stress Shock: -10% macro consumption scenario.",
      ],
      mathFormula: "\\Delta P = +15\\%, \\quad \\Delta M = 0\\%",
    },
    {
      id: "simulation",
      step: "05",
      label: "SIMULATION CASCADE",
      sub: "Digital Twin Mechanics",
      status: "Computed",
      color: "#14B8A6",
      summary: "The Living Twin projected +₹3,35,625 in annual operating revenue and +3.3 pts in profit margin.",
      evidence: [
        "Projected Revenue: ₹25,73,125 (+15.0%).",
        "Projected Operating Profit Margin: 24.30% (+3.3 pts).",
        "Expected churn impact: < 0.7% of volume, fully offset by price uplift.",
      ],
      mathFormula: "Projected Rev = \\(22,37,500 \\times (1 + 0.15 \\times (1 - 0.15)) = 25,73,125\\)",
    },
    {
      id: "reasoning",
      step: "06",
      label: "AI CAUSAL REASONING",
      sub: "Trade-off Synthesis",
      status: "Inference Complete",
      color: "#EC4899",
      summary: "TwinIQ selected Price +15% over Marketing +25% because it delivers pure profit without CAC dilution.",
      evidence: [
        "Marketing spend +25% increases volume but compresses margin from 21.0% down to 20.5% due to ad bidding inflation.",
        "Pricing +15% delivers an immediate 3.96× Expected ROI with 91% statistical confidence.",
        "Downside risk remains low (28/100), leaving ample cash buffer for future expansion.",
      ],
      mathFormula: "\\text{Expected ROI} = \\frac{\\Delta \\text{Operating Profit}}{\\text{Implementation Cost}} = 3.96\\times",
    },
    {
      id: "recommendation",
      step: "07",
      label: "RECOMMENDATION",
      sub: "Strategic Directive",
      status: "Optimal Action",
      color: "#10B981",
      summary: "Authorize a +15% phased pricing adjustment across premium and core tiers.",
      evidence: [
        "Phase 1: Adjust new customer onboarding tiers immediately.",
        "Phase 2: Transition existing accounts after 60-day notification with grandfathered loyalty discounts.",
        "Projected Annual Profit Uplift: +₹3,35,625.",
      ],
      mathFormula: "\\text{Confidence} = 91\\%, \\quad \\text{Risk Grade} = \\text{LOW}",
    },
  ];

  const activeStage = stages.find((s) => s.id === activeStageId) || stages[5];

  const handleCommit = () => {
    setDecisionCommitted(true);
    if (onCommitDecision) {
      onCommitDecision({
        strategy: "PRICE_INCREASE_15",
        projectedRevenue: 2573125,
        projectedMargin: 24.3,
        confidence: 91,
      });
    }
  };

  return (
    <div className="explainable-ai-container">
      {/* Dramatic Hero Reveal */}
      <div className="ai-reveal-hero">
        <div className="ai-reveal-badge">
          <span className="dot pulse-violet" />
          <span>Strategic Intelligence Synthesis</span>
        </div>
        <h1 className="ai-reveal-headline">TWINIQ HAS A RECOMMENDATION.</h1>
        <div className="ai-reveal-core-box">
          <div className="recommendation-text-lead">
            Authorize a <strong>+15% Phased Price Optimization</strong> across Core & Premium Product Tiers.
          </div>
          <div className="recommendation-metrics-row">
            <div className="rec-metric">
              <span className="rec-m-label">Statistical Confidence</span>
              <span className="rec-m-val highlight">91%</span>
            </div>
            <div className="rec-metric">
              <span className="rec-m-label">Expected ROI</span>
              <span className="rec-m-val highlight">3.96×</span>
            </div>
            <div className="rec-metric">
              <span className="rec-m-label">Net Profit Expansion</span>
              <span className="rec-m-val">+₹3.35 Lakhs</span>
            </div>
            <div className="rec-metric">
              <span className="rec-m-label">Risk Profile</span>
              <span className="rec-m-val safe">Low (28/100)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Interactive Reasoning Pipeline */}
      <div className="reasoning-pipeline-section">
        <div className="section-title-row">
          <h2 className="pipeline-heading">Explainable AI Causal Chain</h2>
          <span className="pipeline-sub">Click any node to inspect evidence, mathematical formulas, and causal logic</span>
        </div>

        {/* The 7-Stage Horizontal / Interactive Chain */}
        <div className="stages-nav-bar">
          {stages.map((stage, idx) => {
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                className={`stage-nav-pill ${isSelected ? "active" : ""}`}
                onClick={() => setActiveStageId(stage.id)}
                style={{
                  borderColor: isSelected ? stage.color : "rgba(255, 255, 255, 0.08)",
                  boxShadow: isSelected ? `0 4px 20px ${stage.color}40` : "none",
                }}
              >
                <span className="stage-step-num">{stage.step}</span>
                <span className="stage-pill-label">{stage.label}</span>
                {idx < stages.length - 1 && <span className="stage-arrow">→</span>}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Inspector */}
        <div className="stage-detail-card" style={{ borderColor: `${activeStage.color}40` }}>
          <div className="detail-top-row">
            <div className="detail-identity">
              <span className="stage-number-badge" style={{ background: activeStage.color }}>
                Step {activeStage.step}
              </span>
              <div>
                <h3 className="detail-title">{activeStage.label}</h3>
                <span className="detail-sub">{activeStage.sub} • {activeStage.status}</span>
              </div>
            </div>
            <div className="detail-status-pill" style={{ color: activeStage.color, borderColor: `${activeStage.color}40` }}>
              <span>Verified Causal Node</span>
            </div>
          </div>

          <p className="detail-summary-text">{activeStage.summary}</p>

          <div className="detail-evidence-box">
            <h4 className="evidence-heading">Mathematical Evidence & Observational Signals</h4>
            <ul className="evidence-list">
              {activeStage.evidence.map((ev, i) => (
                <li key={i}>
                  <span className="bullet" style={{ background: activeStage.color }} />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeStage.mathFormula && (
            <div className="formula-box">
              <span className="formula-label">Governing Formula / Mathematical Function:</span>
              <code className="formula-code">{activeStage.mathFormula}</code>
            </div>
          )}
        </div>
      </div>

      {/* Decision Execution & Evolution Bridge */}
      <div className="decision-commit-bar">
        {!decisionCommitted ? (
          <div className="commit-prompt">
            <div className="prompt-text">
              <strong>Ready to Execute Strategic Decision?</strong> Committing this decision logs it to the immutable ledger and activates the real-world tracking cycle.
            </div>
            <button
              type="button"
              className="commit-decision-btn"
              onClick={handleCommit}
            >
              <ShieldIcon size={16} />
              <span>COMMIT & EXECUTE DECISION</span>
            </button>
          </div>
        ) : (
          <div className="commit-success-box">
            <div className="success-content">
              <span className="success-icon">✓</span>
              <div>
                <strong>Strategic Decision Committed to Ledger (ID #102)</strong>
                <p>TwinIQ has set up live observability checkpoints to capture real-world outcomes and trigger self-learning evolution.</p>
              </div>
            </div>
            {onExploreEvolution && (
              <button
                type="button"
                className="view-evolution-btn"
                onClick={onExploreEvolution}
              >
                <span>Witness Self-Learning Evolution →</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
