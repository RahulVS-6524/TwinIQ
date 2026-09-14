import { useState, useEffect, useRef } from "react";
import LivingTwinCanvas from "./LivingTwinCanvas";
import DnaConstellation from "./DnaConstellation";
import WhatIfSimulator from "./WhatIfSimulator";
import FutureWorldsVisualizer from "./FutureWorldsVisualizer";
import ExplainableAiChain from "./ExplainableAiChain";
import EvolutionConvergence from "./EvolutionConvergence";
import TwinIqCompanion from "./TwinIqCompanion";
import { SparklesIcon, ShieldIcon, BuildingIcon, ChevronRightIcon, ChevronLeftIcon } from "../Icons";

export default function StoryExperience({
  business,
  dna,
  snapshots = [],
  evolutions = [],
  scenarios = [],
  simulations = [],
  recommendations = [],
  dashboardData,
  onEnterCommandCenter,
}) {
  const [activeScene, setActiveScene] = useState(0); // 0 = Hero, 1-10 = Scenes
  const [morphPreview, setMorphPreview] = useState({ priceChange: 0, marketingChange: 0, demandShock: 0 });

  const scenes = [
    {
      index: 1,
      pillar: "OBSERVE",
      title: "Real Business Data Enters",
      headline: "OBSERVE THE ENTERPRISE IN REAL-TIME.",
      subtitle: "Continuous ingestion of transaction volume, customer retention dynamics, margin pressures, and CAC economics into the twin reservoir.",
      component: "telemetry",
    },
    {
      index: 2,
      pillar: "UNDERSTAND",
      title: "Business DNA Materializes",
      headline: "THE STRUCTURAL GENOME FORMS.",
      subtitle: "TwinIQ synthesizes 7 foundational parameters into an immutable mathematical DNA profile representing the unique personality of your company.",
      component: "dna",
    },
    {
      index: 3,
      pillar: "MODEL",
      title: "The Cognitive Twin Awakens",
      headline: "A LIVING REPLICA BALANCED IN REAL-TIME.",
      subtitle: "Every node in your company—Revenue, Customers, Inventory, Marketing, Cash Flow—maintains continuous equilibrium through dynamic energy conduits.",
      component: "twin",
    },
    {
      index: 4,
      pillar: "HYPOTHESIZE",
      title: "Strategic Hypothesis Injected",
      headline: "WHAT IF...? SIMULATE BEFORE CAPITAL OUTLAY.",
      subtitle: "Test pricing increases, aggressive marketing expansion, or macro headwinds without risking a single dollar of real-world capital.",
      component: "whatif",
    },
    {
      index: 5,
      pillar: "SIMULATE",
      title: "Divergent Futures Emerge",
      headline: "BRANCHING FUTURE TIMELINES.",
      subtitle: "TwinIQ projects multiple evolving future states, calculating causal trade-offs between unit margins, customer churn, and liquidity reserves.",
      component: "futures",
    },
    {
      index: 6,
      pillar: "EVALUATE",
      title: "Trade-Offs & Risk Stress-Testing",
      headline: "EVALUATING SENSITIVITY & SAFETY BUFFERS.",
      subtitle: "Deep cross-elasticity analysis checks if customer loyalty withstands price adjustments and confirms 14-month cash runway safety.",
      component: "evaluate",
    },
    {
      index: 7,
      pillar: "RECOMMEND",
      title: "AI Recommendation Revealed",
      headline: "TWINIQ HAS A RECOMMENDATION.",
      subtitle: "Clear, explainable strategic directive: +15% price adjustment yields +₹3.35L profit with 91% confidence and 3.96× expected ROI.",
      component: "ai",
    },
    {
      index: 8,
      pillar: "DECIDE",
      title: "Strategic Decision Committed",
      headline: "COMMITTED TO THE AUDITED DECISION LEDGER.",
      subtitle: "Executive choice is locked with cryptographically tracked expected metrics and assigned automated tracking milestones.",
      component: "decision",
    },
    {
      index: 9,
      pillar: "REALIZE",
      title: "Real-World Results Return",
      headline: "MARKET OUTCOMES VERIFIED.",
      subtitle: "Quarterly audited results confirm ₹26.10 Lakhs in revenue and 24.8% margin—surpassing the baseline projection.",
      component: "outcome",
    },
    {
      index: 10,
      pillar: "EVOLVE",
      title: "Autonomous Evolution Loop",
      headline: "THE TWIN LEARNS AND ADAPTS.",
      subtitle: "94.98% prediction accuracy. TwinIQ absorbs the error gradient, refines underlying elasticity coefficients, and evolves for future cycles.",
      component: "evolution",
    },
  ];

  // Scroll or step to next scene
  const goToScene = (idx) => {
    setActiveScene(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="story-experience-wrapper">
      {/* SCENE 0: FULL-SCREEN CINEMATIC HERO */}
      {activeScene === 0 && (
        <section className="cinematic-hero-section">
          {/* Ambient Background Glows */}
          <div className="hero-glow-blob violet" />
          <div className="hero-glow-blob cyan" />

          {/* Top Brand Chip */}
          <div className="hero-brand-row">
            <div className="hero-badge">
              <span className="dot pulse-violet" />
              <span>Living Cognitive Business Twin • Decision Intelligence</span>
            </div>
            <div className="enterprise-identity-pill">
              <BuildingIcon size={14} color="#06B6D4" />
              <span>Active Enterprise: <strong>{business?.businessName || "Rahul Demo Business"}</strong></span>
            </div>
          </div>

          {/* Epic Display Typography */}
          <div className="hero-text-block">
            <h1 className="hero-display-title">
              YOUR BUSINESS <br />
              <span className="text-gradient">HAS A TWIN.</span>
            </h1>
            <p className="hero-display-subtitle">
              TwinIQ observes your enterprise telemetry, simulates divergent future timelines, and helps leadership make high-conviction decisions with mathematical certainty.
            </p>
          </div>

          {/* Living Digital Twin Interactive Centerpiece */}
          <div className="hero-canvas-centerpiece">
            <div className="canvas-frame-glow">
              <LivingTwinCanvas
                width={720}
                height={480}
                dna={dna}
                morphState={morphPreview}
                interactive={true}
              />
            </div>
            <div className="canvas-telemetry-hint">
              <span>Hover nodes to inspect live revenue, margin, customer, and cash flow telemetry</span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="hero-actions-row">
            <button
              type="button"
              className="hero-primary-cta"
              onClick={() => goToScene(1)}
            >
              <SparklesIcon size={18} />
              <span>EXPLORE THE 10-SCENE COGNITIVE STORY →</span>
            </button>
            <button
              type="button"
              className="hero-secondary-cta"
              onClick={() => goToScene(4)}
            >
              <span>LAUNCH WHAT-IF SIMULATOR</span>
            </button>
            {onEnterCommandCenter && (
              <button
                type="button"
                className="hero-ghost-cta"
                onClick={onEnterCommandCenter}
              >
                <ShieldIcon size={16} />
                <span>COMMAND CENTER WORKSPACE</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="hero-ribbon-bar">
            <div className="ribbon-metric">
              <span className="rib-label">Baseline Revenue</span>
              <span className="rib-val">₹22.37 Lakhs</span>
            </div>
            <div className="ribbon-metric">
              <span className="rib-label">Simulated Lift (Future Alpha)</span>
              <span className="rib-val highlight">+₹3.35 Lakhs (+15%)</span>
            </div>
            <div className="ribbon-metric">
              <span className="rib-label">AI Confidence</span>
              <span className="rib-val">91% Certainty</span>
            </div>
            <div className="ribbon-metric">
              <span className="rib-label">Prediction Accuracy</span>
              <span className="rib-val highlight">94.98% Empirical</span>
            </div>
          </div>
        </section>
      )}

      {/* SCENES 1 TO 10: INTERACTIVE NARRATIVE WALKTHROUGH */}
      {activeScene > 0 && (
        <div className="story-walkthrough-canvas">
          {/* Top Story Navigation & Progress Bar */}
          <div className="story-progress-nav">
            <div className="nav-left">
              <button
                type="button"
                className="story-back-btn"
                onClick={() => goToScene(0)}
              >
                ← Return to Hero
              </button>
              <div className="current-scene-badge">
                <span className="scene-num">Scene {activeScene} of 10</span>
                <span className="scene-pillar-tag">{scenes[activeScene - 1]?.pillar}</span>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="scene-stepper">
              {scenes.map((s) => (
                <button
                  key={s.index}
                  type="button"
                  className={`step-dot ${activeScene === s.index ? "active" : ""} ${activeScene > s.index ? "completed" : ""}`}
                  onClick={() => goToScene(s.index)}
                  title={`Scene ${s.index}: ${s.title}`}
                >
                  <span className="dot-label">{s.index}</span>
                </button>
              ))}
            </div>

            <div className="nav-right">
              <button
                type="button"
                className="nav-arrow-btn"
                disabled={activeScene <= 1}
                onClick={() => goToScene(activeScene - 1)}
              >
                <ChevronLeftIcon size={16} />
              </button>
              <button
                type="button"
                className="nav-arrow-btn"
                disabled={activeScene >= 10}
                onClick={() => goToScene(activeScene + 1)}
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>

          {/* Active Scene Header Card */}
          <div className="active-scene-header">
            <div className="scene-pillar-badge">
              <SparklesIcon size={13} color="var(--primary)" />
              <span>Pillar: {scenes[activeScene - 1]?.pillar}</span>
            </div>
            <h1 className="scene-headline">{scenes[activeScene - 1]?.headline}</h1>
            <p className="scene-subtitle">{scenes[activeScene - 1]?.subtitle}</p>
          </div>

          {/* Dynamic Scene Content View */}
          <div className="scene-main-content">
            {/* SCENE 1: TELEMETRY INGESTION */}
            {activeScene === 1 && (
              <div className="scene-card-container">
                <div className="telemetry-with-companion-layout">
                  <div className="telemetry-stream-grid">
                    <div className="telemetry-card">
                      <span className="tel-badge">STREAM 01</span>
                      <h3>Transactional Run-Rate</h3>
                      <div className="tel-big-val">₹22,37,500</div>
                      <p>Continuous payment gateway & ledger synchronization.</p>
                    </div>
                    <div className="telemetry-card">
                      <span className="tel-badge">STREAM 02</span>
                      <h3>Operating Margin Buffer</h3>
                      <div className="tel-big-val">21.0%</div>
                      <p>COGS, supplier freight, and payroll overhead absorption.</p>
                    </div>
                    <div className="telemetry-card">
                      <span className="tel-badge">STREAM 03</span>
                      <h3>Cohort Retention</h3>
                      <div className="tel-big-val">84.5%</div>
                      <p>Monthly recurring customer loyalty and churn elasticity.</p>
                    </div>
                    <div className="telemetry-card">
                      <span className="tel-badge">STREAM 04</span>
                      <h3>Acquisition Efficiency</h3>
                      <div className="tel-big-val">₹850 CAC</div>
                      <p>Blended customer acquisition cost across growth channels.</p>
                    </div>
                  </div>

                  <div className="companion-scene-feature">
                    <TwinIqCompanion
                      mode="card"
                      business={business}
                      dna={dna}
                      snapshots={snapshots}
                      evolutions={evolutions}
                      scenarios={scenarios}
                      simulations={simulations}
                      recommendation={recommendations?.[0]}
                      dashboardData={dashboardData}
                      onNavigateTab={onEnterCommandCenter}
                    />
                  </div>
                </div>

                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(2)}>
                    <span>Proceed to Scene 2: Synthesize Business DNA →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 2: DNA CONSTELLATION */}
            {activeScene === 2 && (
              <div className="scene-card-container">
                <DnaConstellation dna={dna} />
                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(3)}>
                    <span>Proceed to Scene 3: Awaken Cognitive Twin →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 3: THE LIVING DIGITAL TWIN */}
            {activeScene === 3 && (
              <div className="scene-card-container">
                <div className="twin-scene-canvas-wrapper">
                  <LivingTwinCanvas width={760} height={460} dna={dna} interactive={true} />
                </div>
                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(4)}>
                    <span>Proceed to Scene 4: Test Strategic Scenarios →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 4: WHAT-IF SIMULATOR */}
            {activeScene === 4 && (
              <div className="scene-card-container">
                <WhatIfSimulator
                  dna={dna}
                  onExploreFuture={() => goToScene(5)}
                />
              </div>
            )}

            {/* SCENE 5: FUTURE WORLDS */}
            {activeScene === 5 && (
              <div className="scene-card-container">
                <FutureWorldsVisualizer
                  onInspectAiChain={() => goToScene(7)}
                />
                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(6)}>
                    <span>Proceed to Scene 6: Deep Sensitivity Evaluation →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 6: SENSITIVITY EVALUATION */}
            {activeScene === 6 && (
              <div className="scene-card-container">
                <div className="eval-grid">
                  <div className="eval-box">
                    <span className="eval-tag safe">PASSED</span>
                    <h3>Price Elasticity Stress-Test</h3>
                    <p>At +15% price hike, demand drops by only 0.7%, resulting in a net profit surge of ₹3.35 Lakhs.</p>
                  </div>
                  <div className="eval-box">
                    <span className="eval-tag safe">PASSED</span>
                    <h3>Cash Runway Safety Verification</h3>
                    <p>Operating cash runway remains at 14.2 months, exceeding the enterprise 12-month capital safety guideline.</p>
                  </div>
                  <div className="eval-box">
                    <span className="eval-tag warning">CAUTION</span>
                    <h3>Marketing Spend Saturation</h3>
                    <p>Ad budgets beyond +30% yield diminishing returns due to keyword bidding inflation in paid search.</p>
                  </div>
                </div>
                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(7)}>
                    <span>Proceed to Scene 7: Reveal AI Recommendation →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 7: AI RECOMMENDATION & EXPLAINABILITY */}
            {activeScene === 7 && (
              <div className="scene-card-container">
                <ExplainableAiChain
                  onExploreEvolution={() => goToScene(10)}
                  onCommitDecision={() => goToScene(8)}
                />
              </div>
            )}

            {/* SCENE 8: COMMIT DECISION */}
            {activeScene === 8 && (
              <div className="scene-card-container">
                <div className="decision-ledger-view">
                  <div className="ledger-stamp">
                    <span className="stamp-icon">🛡️</span>
                    <h2>DECISION COMMITTED TO IMMUTABLE RECORD</h2>
                    <p>Decision ID: <strong>#102</strong> • Strategy: <strong>PRICE_INCREASE_15</strong></p>
                  </div>
                  <div className="ledger-details-grid">
                    <div className="ledger-item">
                      <span className="lbl">Target Revenue</span>
                      <span className="val">₹25,73,125</span>
                    </div>
                    <div className="ledger-item">
                      <span className="lbl">Target Margin</span>
                      <span className="val">24.30%</span>
                    </div>
                    <div className="ledger-item">
                      <span className="lbl">Commitment Date</span>
                      <span className="val">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="ledger-item">
                      <span className="lbl">Verification Cycle</span>
                      <span className="val">90-Day Observability</span>
                    </div>
                  </div>
                </div>
                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(9)}>
                    <span>Proceed to Scene 9: Verify Market Outcome →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 9: ACTUAL OUTCOME */}
            {activeScene === 9 && (
              <div className="scene-card-container">
                <div className="outcome-card-section">
                  <div className="outcome-hero-box">
                    <span className="outcome-pill">REALITY CONFIRMED</span>
                    <h2>90-Day Market Audited Financials Returned</h2>
                    <div className="outcome-highlight-row">
                      <div className="outcome-stat">
                        <span className="o-label">Realized Revenue</span>
                        <div className="o-val">₹26,10,000</div>
                        <span className="o-delta positive">▲ +₹36,875 above projection</span>
                      </div>
                      <div className="outcome-stat">
                        <span className="o-label">Realized Margin</span>
                        <div className="o-val">24.80%</div>
                        <span className="o-delta positive">▲ +0.50 pts above projection</span>
                      </div>
                      <div className="outcome-stat">
                        <span className="o-label">Empirical Error</span>
                        <div className="o-val safe">&lt; 1.4%</div>
                        <span className="o-delta">Exceptionally high precision</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="scene-advance-row">
                  <button type="button" className="advance-btn" onClick={() => goToScene(10)}>
                    <span>Proceed to Scene 10: Witness Self-Learning Evolution →</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 10: EVOLUTION CONVERGENCE */}
            {activeScene === 10 && (
              <div className="scene-card-container">
                <EvolutionConvergence
                  evolutions={evolutions}
                  onEnterCommandCenter={onEnterCommandCenter}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
