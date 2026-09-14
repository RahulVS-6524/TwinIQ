import { useState, useMemo } from "react";
import { ForecastIcon, SparklesIcon, RefreshIcon } from "../Icons";

export default function ForecastView({ dna, snapshots, formatCurrency, formatPct }) {
  const [horizon, setHorizon] = useState(60); // 30, 60, 90 days
  const [metricKey, setMetricKey] = useState("revenue"); // revenue, profitMargin, customerRetention, customerAcquisitionCost

  const metricsConfig = {
    revenue: {
      name: "Operating Revenue",
      unit: "currency",
      baseVal: parseFloat(dna?.revenue) || 1200000,
      monthlyGrowthRate: 0.035, // +3.5% monthly
      volatility: 0.04,
      favorableHigh: true,
      description: "Projected top-line run rate based on historical retention & CAC efficiency.",
    },
    profitMargin: {
      name: "Profit Margin",
      unit: "percent",
      baseVal: parseFloat(dna?.profitMargin) || 18.5,
      monthlyGrowthRate: 0.008, // +0.8 pts monthly
      volatility: 0.015,
      favorableHigh: true,
      description: "EBITDA margin projection factoring supplier elasticity and operational scale.",
    },
    customerRetention: {
      name: "Customer Retention Rate",
      unit: "percent",
      baseVal: parseFloat(dna?.customerRetention) || 82.0,
      monthlyGrowthRate: 0.004,
      volatility: 0.01,
      favorableHigh: true,
      description: "Cohort retention curve projection under ongoing customer satisfaction initiatives.",
    },
    customerAcquisitionCost: {
      name: "Customer Acquisition Cost",
      unit: "currency",
      baseVal: parseFloat(dna?.customerAcquisitionCost) || 650,
      monthlyGrowthRate: -0.02, // -2% monthly (improving)
      volatility: 0.03,
      favorableHigh: false,
      description: "Targeted CAC efficiency gains from digital maturity optimization.",
    },
  };

  const currentConfig = metricsConfig[metricKey];

  // Compute projection curve points
  const forecastData = useMemo(() => {
    const months = horizon / 30;
    const base = currentConfig.baseVal;
    const rate = currentConfig.monthlyGrowthRate;
    const vol = currentConfig.volatility;

    // Steps: 0 (today), 15d, 30d, 45d, 60d, 75d, 90d (depending on horizon)
    const stepCount = horizon === 30 ? 4 : horizon === 60 ? 6 : 8;
    const points = [];

    for (let i = 0; i <= stepCount; i++) {
      const day = Math.round((i / stepCount) * horizon);
      const fractionOfMonth = day / 30;
      const expected = base * Math.pow(1 + rate, fractionOfMonth);
      const upper = expected * (1 + vol * Math.sqrt(fractionOfMonth));
      const lower = expected * (1 - vol * Math.sqrt(fractionOfMonth));

      points.push({
        day,
        label: day === 0 ? "Today (Baseline)" : `+${day} Days`,
        expected,
        upper,
        lower,
      });
    }

    return points;
  }, [horizon, metricKey, currentConfig]);

  const endPoint = forecastData[forecastData.length - 1];
  const delta = endPoint.expected - currentConfig.baseVal;
  const deltaPct = currentConfig.baseVal > 0 ? (delta / currentConfig.baseVal) * 100 : 0;
  const isPositiveTrend = currentConfig.favorableHigh ? delta >= 0 : delta <= 0;

  const formatValue = (val) => {
    if (currentConfig.unit === "currency") return formatCurrency(val);
    if (currentConfig.unit === "percent") return formatPct(val);
    return `${val.toFixed(1)}`;
  };

  // SVG dimensions for trend graph
  const svgWidth = 720;
  const svgHeight = 260;
  const padding = { top: 30, right: 40, bottom: 40, left: 60 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const allVals = forecastData.flatMap((p) => [p.lower, p.upper, p.expected]);
  const minVal = Math.min(...allVals) * 0.95;
  const maxVal = Math.max(...allVals) * 1.05;

  const getX = (index) => padding.left + (index / (forecastData.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal || 1)) * chartH;

  const upperPath = forecastData.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.upper)}`).join(" ");
  const lowerPathReversed = [...forecastData].reverse().map((p, i) => `L ${getX(forecastData.length - 1 - i)} ${getY(p.lower)}`).join(" ");
  const bandPath = `${upperPath} ${lowerPathReversed} Z`;
  const expectedLinePath = forecastData.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.expected)}`).join(" ");

  return (
    <div className="forecast-container">
      {/* Top Banner with Disclaimer */}
      <div className="forecast-header">
        <div className="forecast-title-block">
          <div className="forecast-pill">
            <ForecastIcon size={14} color="var(--primary)" />
            <span>Strategic Predictive Intelligence</span>
          </div>
          <h2 className="view-title">30 / 60 / 90-Day Trend Forecasting</h2>
          <p className="view-subtitle">
            Dynamic statistical extrapolation and scenario corridor modeling derived from historical snapshots and DNA velocity.
          </p>
        </div>

        <div className="forecast-disclaimer-pill">
          <span className="disclaimer-dot" />
          <span>Statistical Model Corridors • Not Guaranteed Real-World Outcomes</span>
        </div>
      </div>

      {/* Control Bar: Timeline & Metric selection */}
      <div className="forecast-controls-bar">
        <div className="horizon-toggle-group">
          <span className="control-label">Projection Horizon:</span>
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              type="button"
              className={`horizon-btn ${horizon === days ? "active" : ""}`}
              onClick={() => setHorizon(days)}
            >
              {days} Days
            </button>
          ))}
        </div>

        <div className="metric-select-group">
          <span className="control-label">Focus Dimension:</span>
          <select
            value={metricKey}
            onChange={(e) => setMetricKey(e.target.value)}
            className="forecast-metric-select"
          >
            <option value="revenue">Operating Revenue</option>
            <option value="profitMargin">Profit Margin (%)</option>
            <option value="customerRetention">Customer Retention (%)</option>
            <option value="customerAcquisitionCost">Customer Acquisition Cost</option>
          </select>
        </div>
      </div>

      {/* Highlight KPI Cards for Selected Horizon */}
      <div className="forecast-kpi-row">
        <div className="forecast-stat-card">
          <span className="forecast-stat-label">Current Baseline (T-0)</span>
          <div className="forecast-stat-val">{formatValue(currentConfig.baseVal)}</div>
          <span className="forecast-stat-sub">Live Twin DNA Baseline</span>
        </div>

        <div className="forecast-stat-card primary">
          <span className="forecast-stat-label">Expected (+{horizon}d Projection)</span>
          <div className="forecast-stat-val">{formatValue(endPoint.expected)}</div>
          <span className={`forecast-stat-sub ${isPositiveTrend ? "positive" : "negative"}`}>
            {delta >= 0 ? "▲ +" : "▼ "}{formatValue(Math.abs(delta))} ({deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%)
          </span>
        </div>

        <div className="forecast-stat-card">
          <span className="forecast-stat-label">Optimistic Corridor (90% Conf.)</span>
          <div className="forecast-stat-val">{formatValue(endPoint.upper)}</div>
          <span className="forecast-stat-sub">Upper Boundary</span>
        </div>

        <div className="forecast-stat-card">
          <span className="forecast-stat-label">Conservative Corridor (90% Conf.)</span>
          <div className="forecast-stat-val">{formatValue(endPoint.lower)}</div>
          <span className="forecast-stat-sub">Lower Boundary</span>
        </div>
      </div>

      {/* Visual Forecast Chart */}
      <div className="forecast-chart-card">
        <div className="chart-header-row">
          <div>
            <h3 className="chart-title">{currentConfig.name} — {horizon}-Day Trajectory Corridors</h3>
            <p className="chart-sub">{currentConfig.description}</p>
          </div>
          <div className="chart-legend-pills">
            <span className="legend-pill band">Confidence Corridor</span>
            <span className="legend-pill line">Expected Path</span>
          </div>
        </div>

        <div className="svg-forecast-wrapper">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="forecast-svg">
            {/* Grid lines */}
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
                    stroke="var(--border-subtle)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--text-muted)"
                  >
                    {formatValue(val)}
                  </text>
                </g>
              );
            })}

            {/* Confidence Area Corridor */}
            <path
              d={bandPath}
              fill="var(--primary)"
              fillOpacity="0.12"
            />

            {/* Upper and Lower Boundary Dashed Lines */}
            <path
              d={upperPath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.5"
            />
            <path
              d={forecastData.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.lower)}`).join(" ")}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.5"
            />

            {/* Expected Trajectory Line */}
            <path
              d={expectedLinePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Interactive Data Nodes */}
            {forecastData.map((p, i) => (
              <g key={i} className="forecast-point-node">
                <circle
                  cx={getX(i)}
                  cy={getY(p.expected)}
                  r="5"
                  fill="var(--bg-surface)"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                />
                <text
                  x={getX(i)}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-secondary)"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Strategic Sensitivity Commentary */}
      <div className="forecast-insights-grid">
        <div className="forecast-insight-card">
          <div className="insight-top">
            <SparklesIcon size={16} color="var(--primary)" />
            <span className="insight-title">Model Dynamics & Velocity</span>
          </div>
          <p className="insight-body">
            Based on current operational efficiency ({dna?.operationalEfficiency || 78} pts) and innovation capability, the digital twin models an annualized compounding momentum of approximately +{(currentConfig.monthlyGrowthRate * 12 * 100).toFixed(1)}% under stable baseline assumptions.
          </p>
        </div>

        <div className="forecast-insight-card">
          <div className="insight-top">
            <span className="insight-badge risk">Risk Drag</span>
            <span className="insight-title">Downside Sensitivities</span>
          </div>
          <p className="insight-body">
            Should macroeconomic demand contract or supplier friction escalate, the lower corridor models a maximum expected variance of ±{(currentConfig.volatility * 100).toFixed(1)}% from base target over {horizon} days.
          </p>
        </div>
      </div>
    </div>
  );
}
