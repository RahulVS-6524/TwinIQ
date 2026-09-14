import { useState, useEffect } from "react";
import LivingTwinCanvas from "./LivingTwinCanvas";
import { SparklesIcon, ShieldIcon } from "../Icons";

export default function WhatIfSimulator({
  dna,
  onRunSimulation,
  onExploreFuture,
}) {
  const [priceChange, setPriceChange] = useState(15);
  const [marketingChange, setMarketingChange] = useState(25);
  const [demandShock, setDemandShock] = useState(0);

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);

  // Baseline figures
  const baseRev = dna ? parseFloat(dna.revenue) || 2237500 : 2237500;
  const baseMargin = dna ? parseFloat(dna.profitMargin) || 21.0 : 21.0;
  const baseRet = dna ? parseFloat(dna.customerRetention) || 84.5 : 84.5;
  const baseCac = dna ? parseFloat(dna.customerAcquisitionCost) || 850 : 850;

  // Real-time projected calculations based on strategic formulas
  // Price hike: inelastic demand allows revenue expansion (+15% price -> +15% rev minus 2% elasticity loss)
  const priceElasticity = -0.15; // mild elasticity for strong brand
  const priceEffectOnRev = (priceChange / 100) * (1 + priceElasticity);
  const mktEffectOnRev = (marketingChange / 100) * 0.45;
  const demandEffectOnRev = (demandShock / 100) * 1.0;

  const totalRevMultiplier = 1 + priceEffectOnRev + mktEffectOnRev + demandEffectOnRev;
  const projectedRev = baseRev * totalRevMultiplier;

  // Margin expands with price hike, slightly contracts with heavy ad spend
  const marginDelta = (priceChange * 0.22) - (marketingChange * 0.04) + (demandShock * 0.1);
  const projectedMargin = Math.max(5, Math.min(60, baseMargin + marginDelta));

  // Risk score
  const baseRisk = dna ? parseFloat(dna.riskLevel) || 30 : 30;
  const projectedRisk = Math.max(10, Math.min(95, baseRisk + (priceChange > 20 ? 15 : 0) + (marketingChange > 50 ? 20 : 0) - (demandShock < 0 ? demandShock : 0)));

  const handleRunFuture = () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimCompleted(false);

    setTimeout(() => setSimStep(2), 600);
    setTimeout(() => setSimStep(3), 1200);
    setTimeout(() => setSimStep(4), 1800);
    setTimeout(() => {
      setSimStep(5);
      setIsSimulating(false);
      setSimCompleted(true);
      if (onRunSimulation) {
        onRunSimulation({
          priceChange,
          marketingChange,
          demandShock,
          projectedRev,
          projectedMargin,
          projectedRisk,
        });
      }
    }, 2400);
  };

  return (
    <div className="what-if-sandbox">
      {/* Top Narrative Headline */}
      <div className="what-if-header">
        <div className="what-if-badge">
          <SparklesIcon size={14} color="var(--accent-ai)" />
          <span>Cognitive Simulation Laboratory</span>
        </div>
        <h1 className="what-if-title">WHAT IF...?</h1>
        <p className="what-if-subtitle">
          Test strategic pricing shifts, capital deployment, and market volatility inside the digital twin before committing real-world capital.
        </p>
      </div>

      <div className="what-if-layout">
        {/* Left: Tactile Sliders & Parameter Controls */}
        <div className="what-if-controls-card">
          <div className="controls-card-header">
            <h3>Strategic Control Levers</h3>
            <span className="live-pill">Live Reactivity</span>
          </div>

          {/* Lever 1: Pricing */}
          <div className="lever-group">
            <div className="lever-label-row">
              <div className="lever-info">
                <span className="lever-name">Product Price Strategy</span>
                <span className="lever-desc">Unit price adjustment across core product tier</span>
              </div>
              <span className={`lever-value ${priceChange >= 0 ? "positive" : "negative"}`}>
                {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="1"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="lever-slider price-slider"
              disabled={isSimulating}
            />
            <div className="slider-ticks">
              <span>-20% (Discount)</span>
              <span>Baseline</span>
              <span>+30% (Premium)</span>
            </div>
          </div>

          {/* Lever 2: Marketing */}
          <div className="lever-group">
            <div className="lever-label-row">
              <div className="lever-info">
                <span className="lever-name">Growth Marketing Budget</span>
                <span className="lever-desc">Customer acquisition and brand performance ad spend</span>
              </div>
              <span className={`lever-value ${marketingChange >= 0 ? "positive" : "negative"}`}>
                {marketingChange >= 0 ? `+${marketingChange}%` : `${marketingChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={marketingChange}
              onChange={(e) => setMarketingChange(Number(e.target.value))}
              className="lever-slider marketing-slider"
              disabled={isSimulating}
            />
            <div className="slider-ticks">
              <span>-50% (Austerity)</span>
              <span>Baseline</span>
              <span>+100% (Aggressive)</span>
            </div>
          </div>

          {/* Lever 3: Demand Shock */}
          <div className="lever-group">
            <div className="lever-label-row">
              <div className="lever-info">
                <span className="lever-name">Macro Demand Shock</span>
                <span className="lever-desc">Simulate external inflation or consumer discretionary shifts</span>
              </div>
              <span className={`lever-value ${demandShock >= 0 ? "positive" : "negative"}`}>
                {demandShock >= 0 ? `+${demandShock}%` : `${demandShock}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={demandShock}
              onChange={(e) => setDemandShock(Number(e.target.value))}
              className="lever-slider demand-slider"
              disabled={isSimulating}
            />
            <div className="slider-ticks">
              <span>-30% (Recession)</span>
              <span>Neutral</span>
              <span>+30% (Boom)</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="controls-action-row">
            <button
              type="button"
              className={`run-future-btn ${isSimulating ? "running" : ""}`}
              onClick={handleRunFuture}
              disabled={isSimulating}
            >
              {isSimulating ? (
                <>
                  <span className="btn-spinner" />
                  <span>Twin Engine Computing...</span>
                </>
              ) : (
                <>
                  <SparklesIcon size={18} />
                  <span>RUN FUTURE SIMULATION</span>
                </>
              )}
            </button>
          </div>

          {/* Progressive Intelligence Thinking Sequence */}
          {isSimulating && (
            <div className="ai-thinking-card">
              <div className="thinking-title">TWINIQ COGNITIVE INFERENCE</div>
              <div className="thinking-step-list">
                <div className={`step-item ${simStep >= 1 ? "active" : ""}`}>
                  <span className="step-icon">{simStep > 1 ? "✓" : "●"}</span>
                  <span>Analyzing business signals & elasticity coefficients...</span>
                </div>
                <div className={`step-item ${simStep >= 2 ? "active" : ""}`}>
                  <span className="step-icon">{simStep > 2 ? "✓" : "●"}</span>
                  <span>Evaluating multi-dimensional scenario relationships...</span>
                </div>
                <div className={`step-item ${simStep >= 3 ? "active" : ""}`}>
                  <span className="step-icon">{simStep > 3 ? "✓" : "●"}</span>
                  <span>Comparing historical customer retention patterns...</span>
                </div>
                <div className={`step-item ${simStep >= 4 ? "active" : ""}`}>
                  <span className="step-icon">{simStep > 4 ? "✓" : "●"}</span>
                  <span>Calculating divergent future equilibrium states...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Real-time Morphing Living Twin Canvas & Live Impact Telemetry */}
        <div className="what-if-preview-panel">
          <div className="panel-header-badge">
            <span className="dot pulse" />
            <span>Digital Twin Real-Time Dynamic Morph</span>
          </div>

          <div className="canvas-wrapper-morph">
            <LivingTwinCanvas
              width={540}
              height={380}
              dna={dna}
              morphState={{ priceChange, marketingChange, demandShock }}
              interactive={true}
            />
          </div>

          {/* Real-time Projected Metric Cards */}
          <div className="projected-metrics-grid">
            <div className="proj-metric-card">
              <span className="proj-label">Projected Revenue</span>
              <div className="proj-value">₹{(projectedRev / 100000).toFixed(2)}L</div>
              <div className={`proj-delta ${projectedRev >= baseRev ? "positive" : "negative"}`}>
                {projectedRev >= baseRev ? "▲ +" : "▼ "}
                {(((projectedRev - baseRev) / baseRev) * 100).toFixed(1)}% vs baseline
              </div>
            </div>

            <div className="proj-metric-card">
              <span className="proj-label">Projected Margin</span>
              <div className="proj-value">{projectedMargin.toFixed(1)}%</div>
              <div className={`proj-delta ${projectedMargin >= baseMargin ? "positive" : "negative"}`}>
                {projectedMargin >= baseMargin ? "▲ +" : "▼ "}
                {(projectedMargin - baseMargin).toFixed(1)} pts vs baseline
              </div>
            </div>

            <div className="proj-metric-card">
              <span className="proj-label">Simulated Risk Buffer</span>
              <div className="proj-value">{Math.round(100 - projectedRisk)}/100</div>
              <div className={`proj-delta ${projectedRisk <= baseRisk ? "positive" : "negative"}`}>
                {projectedRisk <= baseRisk ? "🛡️ Stable Buffer" : "⚠️ Elevated Exposure"}
              </div>
            </div>
          </div>

          {simCompleted && onExploreFuture && (
            <div className="simulation-ready-banner">
              <div className="banner-text">
                <strong>Future State Synthesized:</strong> TwinIQ has mapped the causal cascade for this hypothesis.
              </div>
              <button
                type="button"
                className="explore-future-btn"
                onClick={onExploreFuture}
              >
                <span>Explore Divergent Futures →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
