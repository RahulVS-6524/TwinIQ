import { useState } from "react";
import { SparklesIcon, ShieldIcon } from "../Icons";

export default function DnaConstellation({ dna, dnaHistory = [] }) {
  const [selectedParam, setSelectedParam] = useState(null);

  // Extract dimensions from real DNA entity or fallback to standard baseline
  const parameters = [
    {
      id: "fin_stability",
      label: "Financial Stability",
      val: parseFloat(dna?.financialStability) || 82,
      max: 100,
      unit: "pts",
      color: "#F59E0B",
      desc: "Capital adequacy, working capital liquidity, and cash runway buffers.",
      sensitivity: "High",
      drift: "+2.4 pts",
    },
    {
      id: "profit_margin",
      label: "Pricing & Margin Yield",
      val: parseFloat(dna?.profitMargin) || 24.3,
      max: 50,
      unit: "%",
      color: "#10B981",
      desc: "Unit economic margin buffer and price elasticity tolerance under inflation.",
      sensitivity: "Critical",
      drift: "+1.8 pts",
    },
    {
      id: "market_growth",
      label: "Market Growth Velocity",
      val: parseFloat(dna?.marketGrowth) || 16.5,
      max: 30,
      unit: "%",
      color: "#06B6D4",
      desc: "Addressable sector expansion rate and organic demand capture.",
      sensitivity: "Medium",
      drift: "+0.5 pts",
    },
    {
      id: "ops_efficiency",
      label: "Operational Efficiency",
      val: parseFloat(dna?.operationalEfficiency) || 88.0,
      max: 100,
      unit: "pts",
      color: "#8B5CF6",
      desc: "Asset turnover ratio, supply chain throughput, and overhead absorption.",
      sensitivity: "High",
      drift: "+3.1 pts",
    },
    {
      id: "digital_maturity",
      label: "Digital Infrastructure",
      val: parseFloat(dna?.digitalMaturity) || 78.0,
      max: 100,
      unit: "pts",
      color: "#EC4899",
      desc: "Data telemetry readiness, API integration depth, and predictive observability.",
      sensitivity: "Medium",
      drift: "Stable",
    },
    {
      id: "competitive_strength",
      label: "Competitive Moat",
      val: parseFloat(dna?.competitiveStrength) || 81.0,
      max: 100,
      unit: "pts",
      color: "#3B82F6",
      desc: "Brand equity, customer switching costs, and defensive barrier indices.",
      sensitivity: "High",
      drift: "+1.2 pts",
    },
    {
      id: "customer_retention",
      label: "Customer Retention & LTV",
      val: parseFloat(dna?.customerRetention) || 84.5,
      max: 100,
      unit: "%",
      color: "#14B8A6",
      desc: "Net revenue retention, churn resistance, and cohort lifetime resilience.",
      sensitivity: "Critical",
      drift: "+0.8 pts",
    },
  ];

  // Calculate polygon points on SVG radar
  const center = 220;
  const radius = 160;
  const numPoints = parameters.length;

  const getCoordinates = (index, value, max) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      angle,
    };
  };

  const getOuterCoordinates = (index) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const polygonPoints = parameters
    .map((p, idx) => {
      const { x, y } = getCoordinates(idx, p.val, p.max);
      return `${x},${y}`;
    })
    .join(" ");

  const activeParam = selectedParam || parameters[0];

  return (
    <div className="dna-constellation-card">
      <div className="constellation-header">
        <div className="constellation-badge">
          <SparklesIcon size={14} color="var(--primary)" />
          <span>Living Cognitive Identity</span>
        </div>
        <h2 className="constellation-title">Business DNA Mathematical Constellation</h2>
        <p className="constellation-sub">
          The structural gene sequence governing how your enterprise responds to pricing shocks, marketing capital, and competitive friction.
        </p>
      </div>

      <div className="constellation-body">
        {/* Left: Interactive Radial Mesh */}
        <div className="constellation-visual-wrap">
          <svg className="constellation-svg" viewBox="0 0 440 440">
            {/* Concentric baseline webs */}
            {[0.25, 0.5, 0.75, 1].map((scale, i) => (
              <polygon
                key={i}
                points={parameters
                  .map((_, idx) => {
                    const angle = (Math.PI * 2 / numPoints) * idx - Math.PI / 2;
                    return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Radial spoke lines */}
            {parameters.map((_, idx) => {
              const outer = getOuterCoordinates(idx);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled DNA Multi-dimensional polygon */}
            <polygon
              points={polygonPoints}
              fill="url(#dnaGradient)"
              stroke="#8B5CF6"
              strokeWidth="2.5"
              className="constellation-polygon"
            />

            {/* SVG Gradients */}
            <defs>
              <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.25)" />
              </linearGradient>
            </defs>

            {/* Glowing parameter nodes */}
            {parameters.map((p, idx) => {
              const { x, y } = getCoordinates(idx, p.val, p.max);
              const isSelected = activeParam.id === p.id;
              return (
                <g
                  key={p.id}
                  className="constellation-node-group"
                  onClick={() => setSelectedParam(p)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={x}
                    y={y}
                    r={isSelected ? 10 : 6}
                    fill={p.color}
                    className="constellation-pulse-node"
                  />
                  <circle
                    cx={x}
                    y={y}
                    r={isSelected ? 16 : 9}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={isSelected ? 0.9 : 0.4}
                  />
                </g>
              );
            })}
          </svg>

          <div className="constellation-hint">
            <span>Click any node to inspect sensitivity weights</span>
          </div>
        </div>

        {/* Right: Selected Parameter Inspector */}
        <div className="constellation-inspector">
          <div className="inspector-badge" style={{ borderColor: activeParam.color, color: activeParam.color }}>
            <span>DNA Dimension Active</span>
          </div>
          <h3 className="inspector-title">{activeParam.label}</h3>
          <div className="inspector-value-row">
            <span className="inspector-val">{activeParam.val}{activeParam.unit}</span>
            <span className="inspector-drift">{activeParam.drift} drift</span>
          </div>
          <p className="inspector-desc">{activeParam.desc}</p>

          <div className="inspector-spec-grid">
            <div className="spec-box">
              <span className="spec-label">Simulation Sensitivity</span>
              <span className="spec-value">{activeParam.sensitivity}</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Self-Learning Drift</span>
              <span className="spec-value">{activeParam.drift}</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Telemetry Status</span>
              <span className="spec-value healthy">Calibrated</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Mathematical Role</span>
              <span className="spec-value">Elasticity Anchor</span>
            </div>
          </div>

          <div className="inspector-param-pills">
            {parameters.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`param-pill ${activeParam.id === p.id ? "active" : ""}`}
                style={{
                  borderColor: activeParam.id === p.id ? p.color : "rgba(255,255,255,0.08)",
                  background: activeParam.id === p.id ? `${p.color}18` : "transparent",
                }}
                onClick={() => setSelectedParam(p)}
              >
                <span className="param-dot" style={{ background: p.color }} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
