import { useState } from "react";
import { SparklesIcon, ShieldIcon } from "../Icons";

export default function FutureWorldsVisualizer({ onSelectFuture, onInspectAiChain }) {
  const [activeFutureId, setActiveFutureId] = useState("future-a");

  const worlds = [
    {
      id: "baseline",
      name: "Current Enterprise Reality",
      tagline: "Unmodified Status Quo",
      badge: "Operating Baseline",
      revenue: "₹22,37,500",
      margin: "21.0%",
      retention: "84.5%",
      risk: "30%",
      riskLabel: "Baseline Risk",
      confidence: "100% (Observed)",
      score: 78,
      color: "#94A3B8",
      glow: "rgba(148, 163, 184, 0.2)",
      description: "Organic growth trajectory without pricing intervention or accelerated capital injection.",
      pros: ["Zero capital expenditure", "Predictable operational cadence"],
      cons: ["Inflation margin compression", "Sub-optimal revenue yield"],
    },
    {
      id: "future-a",
      name: "Future Alpha: Strategic Price Optimization",
      tagline: "+15% Targeted Price Hike across Core Tiers",
      badge: "👑 TwinIQ Recommended Winner",
      winner: true,
      revenue: "₹25,73,125",
      margin: "24.30%",
      retention: "83.8%",
      risk: "28%",
      riskLabel: "Low Risk",
      confidence: "91% Confidence",
      roi: "3.96× Expected ROI",
      score: 96,
      color: "#10B981",
      glow: "rgba(16, 185, 129, 0.35)",
      description: "Leverages high brand loyalty and switching costs to capture pure profit margin with negligible (<1%) churn elasticity.",
      pros: ["₹3.35L annual profit expansion", "+3.3 pts margin expansion", "Capital preservation"],
      cons: ["Requires customer communication care"],
    },
    {
      id: "future-b",
      name: "Future Beta: Aggressive Growth Marketing",
      tagline: "+25% Customer Acquisition Budget Injection",
      badge: "High-Volume Alternate",
      revenue: "₹27,18,750",
      margin: "20.50%",
      retention: "85.2%",
      risk: "42%",
      riskLabel: "Moderate Risk",
      confidence: "82% Confidence",
      roi: "2.15× Expected ROI",
      score: 84,
      color: "#06B6D4",
      glow: "rgba(6, 182, 212, 0.35)",
      description: "Pumps acquisition spend to expand market share rapidly, but increases customer acquisition cost (CAC) and slightly compresses operating margin.",
      pros: ["Maximum top-line revenue (₹27.18L)", "Accelerated market presence"],
      cons: ["-0.5 pts margin compression", "Higher CAC cash drain"],
    },
    {
      id: "future-c",
      name: "Future Gamma: Macro Demand Stress Test",
      tagline: "-20% Discretionary Spend Downturn",
      badge: "Worst-Case Resilience",
      revenue: "₹18,45,000",
      margin: "17.80%",
      retention: "79.2%",
      risk: "68%",
      riskLabel: "Elevated Risk",
      confidence: "75% Confidence",
      roi: "Capital Preservation Mode",
      score: 58,
      color: "#EF4444",
      glow: "rgba(239, 68, 68, 0.35)",
      description: "Stress-tests the enterprise against sudden macro headwinds to verify minimum liquidity safety buffers.",
      pros: ["Validates 9-month cash runway resilience"],
      cons: ["-17.5% revenue shortfall", "Requires immediate cost trimming"],
    },
  ];

  const selectedWorld = worlds.find((w) => w.id === activeFutureId) || worlds[1];

  return (
    <div className="future-worlds-container">
      {/* Header */}
      <div className="future-worlds-header">
        <div className="future-badge-pill">
          <SparklesIcon size={14} color="var(--primary)" />
          <span>Multi-Verse Decision Intelligence</span>
        </div>
        <h1 className="future-title">Divergent Future Worlds</h1>
        <p className="future-subtitle">
          TwinIQ evaluates multiple parallel enterprise timelines, calculating causal trade-offs between yield, churn elasticity, and risk buffers.
        </p>
      </div>

      {/* Grid of Future Cards */}
      <div className="worlds-card-grid">
        {worlds.map((w) => {
          const isSelected = w.id === activeFutureId;
          return (
            <div
              key={w.id}
              className={`world-card ${isSelected ? "selected" : ""} ${w.winner ? "winner-card" : ""}`}
              onClick={() => {
                setActiveFutureId(w.id);
                if (onSelectFuture) onSelectFuture(w);
              }}
              style={{
                borderColor: isSelected ? w.color : "rgba(255, 255, 255, 0.08)",
                boxShadow: isSelected ? `0 12px 36px ${w.glow}` : "none",
              }}
            >
              {w.winner && (
                <div className="winner-ribbon">
                  <SparklesIcon size={12} />
                  <span>TwinIQ Recommended Strategy</span>
                </div>
              )}

              <div className="world-card-top">
                <span className="world-badge" style={{ color: w.color, borderColor: `${w.color}40` }}>
                  {w.badge}
                </span>
                <span className="world-score-pill" style={{ background: `${w.color}15`, color: w.color }}>
                  AI Score: {w.score}/100
                </span>
              </div>

              <h3 className="world-name">{w.name}</h3>
              <div className="world-tagline">{w.tagline}</div>

              <div className="world-metrics-row">
                <div className="metric-chip">
                  <span className="chip-label">Revenue</span>
                  <span className="chip-val">{w.revenue}</span>
                </div>
                <div className="metric-chip">
                  <span className="chip-label">Margin</span>
                  <span className="chip-val">{w.margin}</span>
                </div>
                <div className="metric-chip">
                  <span className="chip-label">Risk</span>
                  <span className="chip-val" style={{ color: w.risk.startsWith("2") ? "#10B981" : w.risk.startsWith("4") ? "#F59E0B" : "#EF4444" }}>
                    {w.risk}
                  </span>
                </div>
              </div>

              <p className="world-desc">{w.description}</p>
            </div>
          );
        })}
      </div>

      {/* Expanded Future Deep-Dive Inspector */}
      <div className="selected-world-inspector" style={{ borderColor: `${selectedWorld.color}40` }}>
        <div className="inspector-left">
          <div className="inspector-header">
            <span className="world-pill-active" style={{ background: selectedWorld.color }}>
              {selectedWorld.winner ? "OPTIMAL STRATEGY" : "EXPLORED TIMELINE"}
            </span>
            <span className="confidence-text">{selectedWorld.confidence}</span>
            {selectedWorld.roi && <span className="roi-text">{selectedWorld.roi}</span>}
          </div>
          <h2 className="inspector-name">{selectedWorld.name}</h2>
          <p className="inspector-full-desc">{selectedWorld.description}</p>

          <div className="pros-cons-grid">
            <div className="pro-box">
              <span className="box-heading positive">Strategic Advantages</span>
              <ul>
                {selectedWorld.pros.map((p, i) => (
                  <li key={i}>✓ {p}</li>
                ))}
              </ul>
            </div>
            <div className="pro-box">
              <span className="box-heading negative">Trade-Offs & Exposure</span>
              <ul>
                {selectedWorld.cons.map((c, i) => (
                  <li key={i}>⚠️ {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="inspector-right">
          <div className="summary-telemetry-box">
            <div className="telemetry-item">
              <span className="tel-label">Projected Revenue Yield</span>
              <span className="tel-val highlight">{selectedWorld.revenue}</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">Operating Profit Margin</span>
              <span className="tel-val">{selectedWorld.margin}</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">Customer Retention</span>
              <span className="tel-val">{selectedWorld.retention}</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">Risk Profile</span>
              <span className="tel-val" style={{ color: selectedWorld.color }}>{selectedWorld.riskLabel}</span>
            </div>
          </div>

          <div className="inspector-actions">
            {onInspectAiChain && (
              <button
                type="button"
                className="ai-chain-btn"
                onClick={onInspectAiChain}
              >
                <SparklesIcon size={16} />
                <span>Inspect Causal AI Evidence Chain →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
