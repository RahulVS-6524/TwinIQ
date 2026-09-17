import { useState, useMemo, useRef } from "react";
import {
  ForecastIcon,
  SparklesIcon,
  RefreshIcon,
  TargetIcon,
  SimulationIcon,
  DecisionIcon,
  SpeakerIcon,
  VolumeXIcon,
  CheckCircleIcon,
} from "../Icons";

// Smooth Spline Path Generator (Catmull-Rom to Cubic Bezier)
function getSplinePath(points, getX, getY) {
  if (!points || points.length < 2) return "";
  const d = [`M ${getX(points[0])} ${getY(points[0])}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = getX(p1) + (getX(p2) - getX(p0)) / 6;
    const cp1y = getY(p1) + (getY(p2) - getY(p0)) / 6;
    const cp2x = getX(p2) - (getX(p3) - getX(p1)) / 6;
    const cp2y = getY(p2) - (getY(p3) - getY(p1)) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${getX(p2)} ${getY(p2)}`);
  }
  return d.join(" ");
}

export default function ForecastView({
  business,
  dna,
  snapshots = [],
  formatCurrency,
  formatPct,
  onNavigateTab,
  flashMessage,
}) {
  // Horizon in days
  const [horizon, setHorizon] = useState(90); // 30, 60, 90, 180, 365
  const [metricKey, setMetricKey] = useState("revenue");
  const [forecastModel, setForecastModel] = useState("neural"); // neural, linear, s_curve, stress
  const [hoverPoint, setHoverPoint] = useState(null);
  const [pinnedPoint, setPinnedPoint] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Trajectory Layer Toggles
  const [showExpected, setShowExpected] = useState(true);
  const [showBull, setShowBull] = useState(true);
  const [showBear, setShowBear] = useState(true);
  const [showCorridor, setShowCorridor] = useState(true);
  const [showHistorical, setShowHistorical] = useState(true);

  // Dynamic sensitivity levers
  const [customGrowthRate, setCustomGrowthRate] = useState(null);
  const [customVolatility, setCustomVolatility] = useState(null);

  const svgRef = useRef(null);

  // Baseline metrics from live DNA
  const metricsConfig = useMemo(() => {
    const rawRev = parseFloat(dna?.revenue) || 12500000;
    const rawMargin = parseFloat(dna?.profitMargin) || 22.5;
    const rawRet = parseFloat(dna?.customerRetention) || 82.0;
    const rawCac = parseFloat(dna?.customerAcquisitionCost) || 1250;

    return {
      revenue: {
        name: "Operating Revenue",
        unit: "currency",
        baseVal: rawRev,
        defaultMonthlyGrowth: 0.038, // +3.8% monthly
        defaultVolatility: 0.045,
        favorableHigh: true,
        description: "Projected gross billing trajectory modeled from live customer cohort expansion.",
        unitSymbol: "₹",
      },
      profitMargin: {
        name: "Profit Margin",
        unit: "percent",
        baseVal: rawMargin,
        defaultMonthlyGrowth: 0.009, // +0.9 pts monthly
        defaultVolatility: 0.018,
        favorableHigh: true,
        description: "EBITDA operational margin corridor factoring procurement scale efficiencies.",
        unitSymbol: "%",
      },
      customerRetention: {
        name: "Customer Retention Rate",
        unit: "percent",
        baseVal: rawRet,
        defaultMonthlyGrowth: 0.004,
        defaultVolatility: 0.012,
        favorableHigh: true,
        description: "Sticky recurring account renewal rate and churn resistance projection.",
        unitSymbol: "%",
      },
      customerAcquisitionCost: {
        name: "Customer Acquisition Cost",
        unit: "currency",
        baseVal: rawCac,
        defaultMonthlyGrowth: -0.018, // -1.8% monthly (improving)
        defaultVolatility: 0.032,
        favorableHigh: false,
        description: "Blended paid marketing efficiency and referral CAC compression corridor.",
        unitSymbol: "₹",
      },
    };
  }, [dna]);

  const currentConfig = metricsConfig[metricKey];

  // Active rate & volatility considering custom sliders
  const activeRate = customGrowthRate !== null ? customGrowthRate : currentConfig.defaultMonthlyGrowth;
  const activeVol = customVolatility !== null ? customVolatility : currentConfig.defaultVolatility;

  // Real historical points from snapshots
  const historicalPoints = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return [];
    const sorted = [...snapshots].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const recents = sorted.slice(-4);
    const stepDays = Math.max(15, Math.round(horizon / 4));

    return recents.map((s, idx) => {
      let val = currentConfig.baseVal;
      if (metricKey === "revenue") val = parseFloat(s.revenue) || val;
      else if (metricKey === "profitMargin") val = parseFloat(s.profitMargin) || val;
      else if (metricKey === "customerRetention") val = parseFloat(s.customerRetention) || val;
      else if (metricKey === "customerAcquisitionCost") val = parseFloat(s.customerAcquisitionCost) || val;

      const dayOffset = -(recents.length - idx) * stepDays;
      return {
        isHistorical: true,
        id: s.id,
        day: dayOffset,
        label: `Snapshot #${s.id}`,
        subLabel: `${Math.abs(dayOffset)}d Ago`,
        expected: val,
        bull: val,
        bear: val,
        upper: val,
        lower: val,
        actual: val,
      };
    });
  }, [snapshots, metricKey, currentConfig, horizon]);

  // Forward projection curve points
  const forwardPoints = useMemo(() => {
    const base = currentConfig.baseVal;
    const stepCount = horizon <= 30 ? 6 : horizon <= 90 ? 8 : 12;
    const points = [];

    // T-0: Today (Baseline)
    points.push({
      isHistorical: false,
      day: 0,
      label: "Today (T-0)",
      subLabel: "Live Baseline",
      expected: base,
      bull: base,
      bear: base,
      upper: base,
      lower: base,
    });

    for (let i = 1; i <= stepCount; i++) {
      const day = Math.round((i / stepCount) * horizon);
      const fracMonth = day / 30;

      let expected = base;
      if (forecastModel === "neural") {
        // Compound velocity with slight dampening
        expected = base * Math.pow(1 + activeRate, fracMonth);
      } else if (forecastModel === "linear") {
        // Constant slope
        expected = base + (base * activeRate * fracMonth);
      } else if (forecastModel === "s_curve") {
        // Diminishing returns ceiling
        const maxMult = activeRate > 0 ? 1.25 : 0.8;
        const ceiling = base * maxMult;
        expected = base + (ceiling - base) * (1 - Math.exp(-0.35 * fracMonth));
      } else if (forecastModel === "stress") {
        // Stress-tested macro drag
        const shockDrag = 1 - (0.015 * fracMonth);
        expected = base * Math.pow(1 + activeRate, fracMonth) * shockDrag;
      }

      // Corridors & scenarios
      const corridorWidth = activeVol * Math.sqrt(fracMonth);
      const upper = expected * (1 + corridorWidth * 1.64); // 90% confidence
      const lower = expected * (1 - corridorWidth * 1.64);

      // Bull (+12% above expected) and Bear (-10% below expected)
      const bull = expected * (1 + 0.12 * Math.sqrt(fracMonth / (horizon / 30)));
      const bear = expected * (1 - 0.10 * Math.sqrt(fracMonth / (horizon / 30)));

      points.push({
        isHistorical: false,
        day,
        label: `+${day} Days`,
        subLabel: `Day ${day}`,
        expected,
        bull,
        bear,
        upper,
        lower,
      });
    }

    return points;
  }, [currentConfig, horizon, activeRate, activeVol, forecastModel]);

  // Combined timeline points for plotting
  const allTimelinePoints = useMemo(() => {
    if (!showHistorical) return forwardPoints;
    return [...historicalPoints, ...forwardPoints];
  }, [historicalPoints, forwardPoints, showHistorical]);

  // End point and delta calculations
  const endPoint = forwardPoints[forwardPoints.length - 1];
  const delta = endPoint.expected - currentConfig.baseVal;
  const deltaPct = currentConfig.baseVal > 0 ? (delta / currentConfig.baseVal) * 100 : 0;
  const isPositiveTrend = currentConfig.favorableHigh ? delta >= 0 : delta <= 0;

  const formatValue = (val) => {
    if (val == null || isNaN(val)) return "-";
    if (currentConfig.unit === "currency") return formatCurrency(val);
    if (currentConfig.unit === "percent") return formatPct(val);
    return `${val.toFixed(1)}`;
  };

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 320;
  const padding = { top: 35, right: 40, bottom: 45, left: 75 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  // Min and Max scale bounds
  const minDay = allTimelinePoints[0]?.day ?? 0;
  const maxDay = allTimelinePoints[allTimelinePoints.length - 1]?.day ?? horizon;
  const dayRange = maxDay - minDay || 1;

  const allYVals = allTimelinePoints.flatMap((p) => [
    p.lower,
    p.upper,
    p.expected,
    p.bull,
    p.bear,
    p.actual,
  ]).filter((v) => v != null && !isNaN(v));

  const minVal = Math.min(...allYVals) * 0.94;
  const maxVal = Math.max(...allYVals) * 1.06;
  const valRange = maxVal - minVal || 1;

  const getX = (p) => padding.left + ((p.day - minDay) / dayRange) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minVal) / valRange) * chartH;

  // Split forward and historical for path rendering
  const fwdExpectedPath = getSplinePath(forwardPoints, getX, (p) => getY(p.expected));
  const fwdBullPath = getSplinePath(forwardPoints, getX, (p) => getY(p.bull));
  const fwdBearPath = getSplinePath(forwardPoints, getX, (p) => getY(p.bear));
  const fwdUpperPath = getSplinePath(forwardPoints, getX, (p) => getY(p.upper));
  const fwdLowerPath = getSplinePath(forwardPoints, getX, (p) => getY(p.lower));

  // Closed confidence band path
  const bandPolygonPath = useMemo(() => {
    if (forwardPoints.length < 2) return "";
    const topPts = forwardPoints.map((p) => `${getX(p)},${getY(p.upper)}`).join(" ");
    const botPts = [...forwardPoints].reverse().map((p) => `${getX(p)},${getY(p.lower)}`).join(" ");
    return `M ${forwardPoints[0] ? getX(forwardPoints[0]) : 0},${forwardPoints[0] ? getY(forwardPoints[0].upper) : 0} L ${topPts} L ${botPts} Z`;
  }, [forwardPoints, minDay, maxDay, minVal, maxVal]);

  // Historical path connecting to Today (T-0)
  const historicalPath = useMemo(() => {
    if (!showHistorical || historicalPoints.length === 0) return "";
    const connPoints = [...historicalPoints, forwardPoints[0]];
    return getSplinePath(connPoints, getX, (p) => getY(p.expected));
  }, [historicalPoints, forwardPoints, showHistorical, minDay, maxDay, minVal, maxVal]);

  // Today (T-0) divider X coordinate
  const todayX = getX({ day: 0 });

  // Handle Chart Hover
  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;

    // Find closest point
    let closest = allTimelinePoints[0];
    let minDist = 99999;

    allTimelinePoints.forEach((p) => {
      const px = getX(p);
      const dist = Math.abs(px - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    });

    setHoverPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoverPoint(null);
  };

  const handlePointClick = (p) => {
    setPinnedPoint(p);
    if (flashMessage) {
      flashMessage(`Pinned ${p.label}: Projected ${formatValue(p.expected)}`);
    }
  };

  // Voice briefing
  const handleVoiceBriefing = () => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrative = `Trend forecast for ${currentConfig.name} over ${horizon} days for ${business?.businessName || "your enterprise"}. Baseline is ${formatValue(currentConfig.baseVal)}. Projected target at plus ${horizon} days is ${formatValue(endPoint.expected)}, representing a ${deltaPct >= 0 ? "gain" : "decline"} of ${Math.abs(deltaPct).toFixed(1)} percent. The upper corridor reaches ${formatValue(endPoint.upper)}, and the lower risk boundary sits at ${formatValue(endPoint.lower)}.`;
    const utterance = new SpeechSynthesisUtterance(narrative);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const activeInspection = pinnedPoint || hoverPoint || endPoint;

  return (
    <div className="forecast-container forecast-interactive-suite">
      {/* CINEMATIC PREDICTIVE HEADER */}
      <div className="cinematic-tab-header">
        <div className="cinematic-header-left">
          <span className="cinematic-header-badge badge-sim">📈 STRATEGIC PREDICTIVE INTELLIGENCE</span>
          <h1 className="cinematic-header-title">
            30 / 60 / 90-Day <span className="gradient-text">Trend Forecasting</span>
          </h1>
          <p className="cinematic-header-sub">
            Dynamic statistical extrapolation, historical snapshot continuity, and multi-scenario corridors for #{business?.id || 1} {business?.businessName || "Enterprise"}.
            Scrub across the graph or adjust levers to explore predictive futures.
          </p>
        </div>
        <div className="cinematic-header-actions">
          <button
            className={`cinematic-voice-btn ${isSpeaking ? "active-voice" : ""}`}
            onClick={handleVoiceBriefing}
            title="Listen to Forecast Voice Briefing"
          >
            {isSpeaking ? <VolumeXIcon size={16} /> : <SpeakerIcon size={16} />}
            {isSpeaking ? "Mute Briefing" : "🎙️ Voice Forecast"}
          </button>
          <div className="forecast-disclaimer-pill">
            <span className="disclaimer-dot" />
            <span>90% Confidence Corridors • Digital Twin Extrapolation</span>
          </div>
        </div>
      </div>

      {/* PRIMARY CONTROLS & TIMELINE HORIZON BAR */}
      <div className="forecast-master-controls">
        {/* Metric Selector Tabs */}
        <div className="metric-chip-group">
          <span className="ctrl-heading">Dimension:</span>
          {Object.entries(metricsConfig).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              className={`metric-select-chip ${metricKey === key ? "active" : ""}`}
              onClick={() => {
                setMetricKey(key);
                setCustomGrowthRate(null);
                setCustomVolatility(null);
                setPinnedPoint(null);
              }}
            >
              {cfg.name}
            </button>
          ))}
        </div>

        {/* Time Horizon Selector */}
        <div className="horizon-toggle-group">
          <span className="ctrl-heading">Horizon:</span>
          {[
            { days: 30, label: "30d Sprint" },
            { days: 60, label: "60d Quarter" },
            { days: 90, label: "90d Mid-Term" },
            { days: 180, label: "180d Half-Year" },
            { days: 365, label: "365d Annual" },
          ].map(({ days, label }) => (
            <button
              key={days}
              type="button"
              className={`horizon-btn ${horizon === days ? "active" : ""}`}
              onClick={() => {
                setHorizon(days);
                setPinnedPoint(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI HIGHLIGHT CARDS STRIP */}
      <div className="forecast-kpi-row">
        <div className="forecast-stat-card">
          <span className="forecast-stat-label">Current Baseline (T-0)</span>
          <div className="forecast-stat-val">{formatValue(currentConfig.baseVal)}</div>
          <span className="forecast-stat-sub">Live Twin DNA State</span>
        </div>

        <div className="forecast-stat-card primary">
          <span className="forecast-stat-label">Expected Target (+{horizon}d)</span>
          <div className="forecast-stat-val text-gradient-indigo">{formatValue(endPoint.expected)}</div>
          <span className={`forecast-stat-sub ${isPositiveTrend ? "positive" : "negative"}`}>
            {delta >= 0 ? "▲ +" : "▼ "}{formatValue(Math.abs(delta))} ({deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%)
          </span>
        </div>

        <div className="forecast-stat-card">
          <span className="forecast-stat-label">Optimistic Bull Corridor (+12%)</span>
          <div className="forecast-stat-val text-gradient-emerald">{formatValue(endPoint.bull)}</div>
          <span className="forecast-stat-sub">Upper Strategic Boundary</span>
        </div>

        <div className="forecast-stat-card">
          <span className="forecast-stat-label">Conservative Bear Corridor (-10%)</span>
          <div className="forecast-stat-val text-danger">{formatValue(endPoint.bear)}</div>
          <span className="forecast-stat-sub">Macro Downside Floor</span>
        </div>
      </div>

      {/* GRAPH SETTINGS & MULTI-TRAJECTORY TOGGLES */}
      <div className="forecast-graph-toolbar">
        {/* Model Presets */}
        <div className="toolbar-left-group">
          <span className="ctrl-heading">Model Engine:</span>
          {[
            { id: "neural", label: "🧠 Neural Momentum" },
            { id: "linear", label: "📐 Linear Trend" },
            { id: "s_curve", label: "📊 Dampened S-Curve" },
            { id: "stress", label: "⚡ Stress Drag" },
          ].map((m) => (
            <button
              key={m.id}
              className={`model-pill-btn ${forecastModel === m.id ? "active" : ""}`}
              onClick={() => setForecastModel(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Trajectory Visibility Checkboxes */}
        <div className="toolbar-right-group">
          <span className="ctrl-heading">Layers:</span>
          <label className="layer-checkbox-label">
            <input
              type="checkbox"
              checked={showExpected}
              onChange={(e) => setShowExpected(e.target.checked)}
            />
            <span className="layer-color-dot dot-expected"></span> Expected
          </label>

          <label className="layer-checkbox-label">
            <input
              type="checkbox"
              checked={showBull}
              onChange={(e) => setShowBull(e.target.checked)}
            />
            <span className="layer-color-dot dot-bull"></span> Bull (+12%)
          </label>

          <label className="layer-checkbox-label">
            <input
              type="checkbox"
              checked={showBear}
              onChange={(e) => setShowBear(e.target.checked)}
            />
            <span className="layer-color-dot dot-bear"></span> Bear (-10%)
          </label>

          <label className="layer-checkbox-label">
            <input
              type="checkbox"
              checked={showCorridor}
              onChange={(e) => setShowCorridor(e.target.checked)}
            />
            <span className="layer-color-dot dot-corridor"></span> 90% Corridor
          </label>

          {historicalPoints.length > 0 && (
            <label className="layer-checkbox-label">
              <input
                type="checkbox"
                checked={showHistorical}
                onChange={(e) => setShowHistorical(e.target.checked)}
              />
              <span className="layer-color-dot dot-history"></span> Past Actuals ({historicalPoints.length})
            </label>
          )}
        </div>
      </div>

      {/* MAIN CINEMATIC CHART CARD */}
      <div className="forecast-chart-card interactive-chart-card">
        <div className="chart-header-row">
          <div>
            <h3 className="chart-title">
              {currentConfig.name} — {horizon}-Day Trajectory Matrix
            </h3>
            <p className="chart-sub">
              {currentConfig.description} Hover across the timeline to scrub metrics or click any node to pin.
            </p>
          </div>
          <div className="chart-hud-summary">
            <span className="hud-badge">
              Active Focus: <strong>{activeInspection?.label}</strong> ({formatValue(activeInspection?.expected)})
            </span>
          </div>
        </div>

        {/* SVG CHART CONTAINER */}
        <div className="svg-forecast-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="forecast-svg modern-svg"
          >
            <defs>
              {/* Corridor Gradient */}
              <linearGradient id="corridorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
              </linearGradient>

              {/* Neon Glow Filter */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
              const y = padding.top + chartH * frac;
              const val = maxVal - frac * (maxVal - minVal);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.07)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--text-muted)"
                    fontWeight="600"
                  >
                    {formatValue(val)}
                  </text>
                </g>
              );
            })}

            {/* Historical Zone Background Shading */}
            {showHistorical && historicalPoints.length > 0 && (
              <g className="historical-zone">
                <rect
                  x={padding.left}
                  y={padding.top}
                  width={Math.max(0, todayX - padding.left)}
                  height={chartH}
                  fill="rgba(6, 182, 212, 0.04)"
                />
                <text
                  x={(padding.left + todayX) / 2}
                  y={padding.top + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="rgba(6, 182, 212, 0.7)"
                  fontWeight="700"
                  letterSpacing="0.06em"
                >
                  ◄ HISTORICAL RECORDED ACTUALS
                </text>
              </g>
            )}

            {/* Today Divider Vertical Line */}
            <g className="today-divider">
              <line
                x1={todayX}
                y1={padding.top - 10}
                x2={todayX}
                y2={padding.top + chartH + 10}
                stroke="#6366F1"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <rect
                x={todayX - 28}
                y={padding.top - 24}
                width="56"
                height="18"
                rx="4"
                fill="#6366F1"
              />
              <text
                x={todayX}
                y={padding.top - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#FFFFFF"
                fontWeight="800"
              >
                TODAY
              </text>
            </g>

            {/* 90% Confidence Corridor Band */}
            {showCorridor && bandPolygonPath && (
              <path
                d={bandPolygonPath}
                fill="url(#corridorGradient)"
              />
            )}

            {/* Bull Horizon Spline (Emerald Dashed) */}
            {showBull && fwdBullPath && (
              <path
                d={fwdBullPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeOpacity="0.8"
              />
            )}

            {/* Bear Horizon Spline (Rose Dashed) */}
            {showBear && fwdBearPath && (
              <path
                d={fwdBearPath}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeOpacity="0.8"
              />
            )}

            {/* Historical Connection Spline (Cyan) */}
            {showHistorical && historicalPath && (
              <path
                d={historicalPath}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Expected Primary Spline Line (Neon Indigo) */}
            {showExpected && fwdExpectedPath && (
              <path
                d={fwdExpectedPath}
                fill="none"
                stroke="#6366F1"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#neonGlow)"
              />
            )}

            {/* Interactive Timeline Nodes */}
            {allTimelinePoints.map((p, i) => {
              const cx = getX(p);
              const cy = getY(p.expected);
              const isHovered = hoverPoint?.day === p.day;
              const isPinned = pinnedPoint?.day === p.day;
              const isToday = p.day === 0;

              return (
                <g
                  key={i}
                  className="timeline-node-group"
                  onClick={() => handlePointClick(p)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Outer pulse ring for pinned/hovered */}
                  {(isHovered || isPinned || isToday) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isPinned ? 12 : 9}
                      fill="none"
                      stroke={p.isHistorical ? "#06B6D4" : "#818CF8"}
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isPinned ? 6 : isToday ? 5.5 : 4.5}
                    fill={isPinned ? "#FFFFFF" : isToday ? "#6366F1" : p.isHistorical ? "#0891B2" : "#1E1B4B"}
                    stroke={p.isHistorical ? "#22D3EE" : isToday ? "#A5B4FC" : "#818CF8"}
                    strokeWidth="2.5"
                  />

                  {/* X-Axis Day Labels */}
                  <text
                    x={cx}
                    y={svgHeight - 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isHovered || isPinned ? "#FFFFFF" : "var(--text-secondary)"}
                    fontWeight={isHovered || isPinned || isToday ? "700" : "500"}
                  >
                    {p.day === 0 ? "0d" : p.day > 0 ? `+${p.day}d` : `${p.day}d`}
                  </text>
                </g>
              );
            })}

            {/* Vertical Cursor Scrubber Line on Hover */}
            {hoverPoint && (
              <g className="scrubber-crosshair">
                <line
                  x1={getX(hoverPoint)}
                  y1={padding.top}
                  x2={getX(hoverPoint)}
                  y2={padding.top + chartH}
                  stroke="#A5B4FC"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.75"
                />
              </g>
            )}
          </svg>

          {/* Floating Hover Tooltip HUD */}
          {hoverPoint && (
            <div
              className="chart-hover-hud"
              style={{
                left: `${Math.min(svgWidth - 200, Math.max(80, getX(hoverPoint)))}px`,
                top: `${Math.max(10, getY(hoverPoint.expected) - 90)}px`,
              }}
            >
              <div className="hud-title">{hoverPoint.label}</div>
              <div className="hud-expected">{formatValue(hoverPoint.expected)}</div>
              <div className="hud-bounds">
                <span>Lower: {formatValue(hoverPoint.lower)}</span>
                <span>Upper: {formatValue(hoverPoint.upper)}</span>
              </div>
              <div className="hud-delta">
                {hoverPoint.day === 0
                  ? "Current Baseline Point"
                  : `Variance: ${(((hoverPoint.expected - currentConfig.baseVal) / currentConfig.baseVal) * 100).toFixed(1)}%`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SENSITIVITY LEVERS & SIMULATION DISPATCH */}
      <div className="forecast-interactive-levers-grid">
        {/* Levers Card (Left) */}
        <div className="levers-control-card">
          <div className="levers-header">
            <h4 className="levers-title">⚡ Interactive Growth & Volatility Levers</h4>
            <button
              className="reset-levers-btn"
              onClick={() => {
                setCustomGrowthRate(null);
                setCustomVolatility(null);
                if (flashMessage) flashMessage("Reset levers to live business DNA defaults.");
              }}
            >
              <RefreshIcon size={12} /> Reset Levers
            </button>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>Compounding Velocity (Monthly):</span>
              <strong className="slider-val text-gradient-indigo">
                {(activeRate * 100).toFixed(1)}% / mo ({(activeRate * 12 * 100).toFixed(1)}% Annualized)
              </strong>
            </div>
            <input
              type="range"
              min="-0.04"
              max="0.10"
              step="0.002"
              value={activeRate}
              onChange={(e) => setCustomGrowthRate(parseFloat(e.target.value))}
              className="forecast-slider indigo-slider"
            />
            <div className="slider-endpoints">
              <span>-4.0% Contraction</span>
              <span>Baseline: {(currentConfig.defaultMonthlyGrowth * 100).toFixed(1)}%</span>
              <span>+10.0% Aggressive Surge</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>Macroeconomic Dispersion / Corridor Width:</span>
              <strong className="slider-val text-gradient-emerald">
                ±{(activeVol * 100).toFixed(1)}% Corridor Spread
              </strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.12"
              step="0.005"
              value={activeVol}
              onChange={(e) => setCustomVolatility(parseFloat(e.target.value))}
              className="forecast-slider emerald-slider"
            />
            <div className="slider-endpoints">
              <span>±1.0% Tight Confidence</span>
              <span>Baseline: {(currentConfig.defaultVolatility * 100).toFixed(1)}%</span>
              <span>±12.0% High Uncertainty</span>
            </div>
          </div>
        </div>

        {/* Milestone Inspector & Action Dispatcher (Right) */}
        <div className="forecast-inspection-card">
          <div className="inspection-header">
            <span className="inspection-tag">
              {pinnedPoint ? "📌 PINNED MILESTONE INSPECTION" : "🎯 TARGET HORIZON SUMMARY"}
            </span>
            <span className="inspection-day">{activeInspection?.label}</span>
          </div>

          <div className="inspection-metrics-strip">
            <div className="insp-metric">
              <span className="lbl">Target Trajectory</span>
              <span className="val text-gradient-indigo">{formatValue(activeInspection?.expected)}</span>
            </div>
            <div className="insp-metric">
              <span className="lbl">Bull Case</span>
              <span className="val text-gradient-emerald">{formatValue(activeInspection?.bull)}</span>
            </div>
            <div className="insp-metric">
              <span className="lbl">Bear Case</span>
              <span className="val text-danger">{formatValue(activeInspection?.bear)}</span>
            </div>
          </div>

          <p className="inspection-desc">
            To achieve this forward run rate of <strong>{formatValue(activeInspection?.expected)}</strong> within {activeInspection?.day || horizon} days, the digital twin requires maintaining retention above <strong>{dna?.customerRetention || 82}%</strong> while controlling CAC below <strong>{formatCurrency(dna?.customerAcquisitionCost || 1250)}</strong>.
          </p>

          <div className="inspection-actions">
            <button
              className="cinematic-action-btn primary"
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab("target-planner");
                  if (flashMessage) flashMessage(`Transferring forecast target ${formatValue(activeInspection?.expected)} to Target Planner...`);
                }
              }}
            >
              <TargetIcon size={14} /> Commit to Strategic Target Planner
            </button>

            <button
              className="cinematic-action-btn secondary"
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab("simulations");
                  if (flashMessage) flashMessage(`Simulating operational hedges for ${currentConfig.name} in Simulator...`);
                }
              }}
            >
              <SimulationIcon size={14} /> Simulate in What-If Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
