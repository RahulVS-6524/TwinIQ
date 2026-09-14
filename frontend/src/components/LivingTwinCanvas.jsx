import { useEffect, useRef, useState } from "react";

export default function LivingTwinCanvas({
  width = 800,
  height = 560,
  dna = null,
  morphState = { priceChange: 0, marketingChange: 0, demandShock: 0 },
  interactive = true,
  onNodeClick = null,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Node telemetry based on real DNA or realistic baseline
  const revenueVal = dna ? parseFloat(dna.revenue) || 2573125 : 2573125;
  const marginVal = dna ? parseFloat(dna.profitMargin) || 24.3 : 24.3;
  const retentionVal = dna ? parseFloat(dna.customerRetention) || 84.5 : 84.5;
  const cacVal = dna ? parseFloat(dna.customerAcquisitionCost) || 850 : 850;
  const effVal = dna ? parseFloat(dna.operationalEfficiency) || 88.0 : 88.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = width;
    const displayHeight = height;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    ctx.scale(dpr, dpr);

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;

    // Parallax mouse offset
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    // Particle pool for conduits
    const particles = [];
    const PARTICLE_COUNT = 36;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        conduitIndex: i % 8,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: 1.5 + Math.random() * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth tilt easing
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Morphing multipliers from slider state
      const pMod = 1 + (morphState.priceChange || 0) / 100;
      const mMod = 1 + (morphState.marketingChange || 0) / 100;
      const dMod = 1 + (morphState.demandShock || 0) / 100;

      // Node definitions relative to center with tilt offset
      const cx = centerX + currentTiltX * 18;
      const cy = centerY + currentTiltY * 18;

      const nodes = [
        {
          id: "core",
          label: "TWINIQ CORE",
          sub: "Cognitive Engine",
          x: cx,
          y: cy,
          baseRadius: 36,
          radius: 36 + Math.sin(time * 2) * 2,
          color: "#8B5CF6", // Electric violet
          glow: "rgba(139, 92, 246, 0.45)",
          stat: "94.98% Accuracy",
          tag: "Active Intelligence",
        },
        {
          id: "revenue",
          label: "REVENUE",
          sub: "Top-line Yield",
          x: cx,
          y: cy - 170,
          baseRadius: 26,
          radius: (26 + Math.sin(time + 1) * 2) * Math.max(0.7, pMod),
          color: "#F59E0B", // Gold / Amber
          glow: "rgba(245, 158, 11, 0.4)",
          stat: `₹${((revenueVal * pMod) / 100000).toFixed(2)}L`,
          tag: pMod > 1 ? `+${((pMod - 1) * 100).toFixed(0)}% Lift` : "Run Rate",
        },
        {
          id: "customers",
          label: "CUSTOMERS",
          sub: "Market Demand",
          x: cx - 210,
          y: cy - 25,
          baseRadius: 24,
          radius: (24 + Math.sin(time + 2) * 2) * Math.max(0.8, mMod * 0.6 + dMod * 0.4),
          color: "#06B6D4", // Cyan
          glow: "rgba(6, 182, 212, 0.4)",
          stat: `${(retentionVal * Math.min(1.1, dMod)).toFixed(1)}% Ret.`,
          tag: "Demand Pool",
        },
        {
          id: "inventory",
          label: "INVENTORY & OPS",
          sub: "Supply Chain",
          x: cx + 210,
          y: cy - 25,
          baseRadius: 24,
          radius: (24 + Math.sin(time + 3) * 2) * Math.max(0.8, dMod),
          color: "#10B981", // Emerald
          glow: "rgba(16, 185, 129, 0.4)",
          stat: `${effVal.toFixed(1)} Eff.`,
          tag: "Capacity 92%",
        },
        {
          id: "marketing",
          label: "MARKETING",
          sub: "Acquisition Funnel",
          x: cx - 135,
          y: cy + 155,
          baseRadius: 23,
          radius: (23 + Math.sin(time + 4) * 2) * Math.max(0.7, mMod),
          color: "#EC4899", // Magenta
          glow: "rgba(236, 72, 153, 0.4)",
          stat: `₹${(cacVal / Math.max(0.5, mMod)).toFixed(0)} CAC`,
          tag: mMod > 1 ? `+${((mMod - 1) * 100).toFixed(0)}% Spend` : "Acquisition",
        },
        {
          id: "cashflow",
          label: "CASH FLOW",
          sub: "Operating Margin",
          x: cx + 135,
          y: cy + 155,
          baseRadius: 23,
          radius: (23 + Math.sin(time + 5) * 2) * Math.max(0.7, (pMod + dMod) / 2),
          color: "#14B8A6", // Teal
          glow: "rgba(20, 184, 166, 0.4)",
          stat: `${(marginVal * (pMod > 1 ? 1.12 : 1)).toFixed(1)}% Margin`,
          tag: "Liquidity Buffer",
        },
      ];

      // Conduits connecting nodes
      const conduits = [
        { from: nodes[0], to: nodes[1], cp: { x: cx - 25, y: cy - 85 } }, // Core -> Revenue
        { from: nodes[0], to: nodes[2], cp: { x: cx - 105, y: cy - 20 } }, // Core -> Customers
        { from: nodes[0], to: nodes[3], cp: { x: cx + 105, y: cy - 20 } }, // Core -> Inventory
        { from: nodes[0], to: nodes[4], cp: { x: cx - 70, y: cy + 80 } }, // Core -> Marketing
        { from: nodes[0], to: nodes[5], cp: { x: cx + 70, y: cy + 80 } }, // Core -> Cash Flow
        { from: nodes[2], to: nodes[1], cp: { x: cx - 120, y: cy - 120 } }, // Customers -> Revenue
        { from: nodes[1], to: nodes[3], cp: { x: cx + 120, y: cy - 120 } }, // Revenue -> Inventory
        { from: nodes[4], to: nodes[2], cp: { x: cx - 190, y: cy + 60 } }, // Marketing -> Customers
      ];

      // 1. Draw atmospheric background glow behind core
      const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
      coreGrad.addColorStop(0, "rgba(139, 92, 246, 0.18)");
      coreGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.08)");
      coreGrad.addColorStop(1, "rgba(8, 9, 13, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 260, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw subtle orbital rings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      [110, 190, 260].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting micro ticks
        const angle = time * (0.15 * (idx % 2 === 0 ? 1 : -1)) + idx;
        const tickX = cx + Math.cos(angle) * r;
        const tickY = cy + Math.sin(angle) * r;
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.arc(tickX, tickY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw energy conduits (Curved Bezier lines)
      conduits.forEach((c) => {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.quadraticCurveTo(c.cp.x, c.cp.y, c.to.x, c.to.y);
        ctx.stroke();

        // Glowing conduit highlight
        const grad = ctx.createLinearGradient(c.from.x, c.from.y, c.to.x, c.to.y);
        grad.addColorStop(0, c.from.glow);
        grad.addColorStop(1, c.to.glow);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 4. Draw conduit energy particles
      particles.forEach((p) => {
        p.t += p.speed * (1 + (morphState.marketingChange + morphState.priceChange) / 150);
        if (p.t > 1) p.t = 0;

        const c = conduits[p.conduitIndex % conduits.length];
        // Quadratic bezier interpolation: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const t = p.t;
        const invT = 1 - t;
        const px = invT * invT * c.from.x + 2 * invT * t * c.cp.x + t * t * c.to.x;
        const py = invT * invT * c.from.y + 2 * invT * t * c.cp.y + t * t * c.to.y;

        ctx.fillStyle = c.to.color;
        ctx.shadowColor = c.to.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 5. Draw Nodes
      nodes.forEach((n) => {
        const isHovered = hoveredNode?.id === n.id;
        const radius = isHovered ? n.radius * 1.15 : n.radius;

        // Node outer ambient glow
        const glowRadius = radius * (isHovered ? 2.5 : 1.9);
        const nodeGlow = ctx.createRadialGradient(n.x, n.y, radius * 0.6, n.x, n.y, glowRadius);
        nodeGlow.addColorStop(0, n.glow);
        nodeGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node outer glass ring
        ctx.strokeStyle = isHovered ? "#FFFFFF" : n.color;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Node inner surface
        ctx.fillStyle = "#0D111A";
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius - 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Core pulsating center dot
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = isHovered ? 14 : 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.id === "core" ? 14 + Math.sin(time * 3) * 2 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label & Stats
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "600 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (n.id !== "core") {
          ctx.fillText(n.label, n.x, n.y + radius + 15);
          ctx.fillStyle = n.color;
          ctx.font = "700 12px Inter, sans-serif";
          ctx.fillText(n.stat, n.x, n.y + radius + 29);
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "700 10px Inter, sans-serif";
          ctx.fillText("TWINIQ", n.x, n.y + 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse movement listener for parallax & node hover
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      targetTiltX = (x / displayWidth - 0.5) * 2;
      targetTiltY = (y / displayHeight - 0.5) * 2;

      // Find closest hovered node
      const cx = centerX + currentTiltX * 18;
      const cy = centerY + currentTiltY * 18;
      const pMod = 1 + (morphState.priceChange || 0) / 100;
      const mMod = 1 + (morphState.marketingChange || 0) / 100;
      const dMod = 1 + (morphState.demandShock || 0) / 100;

      const nodes = [
        { id: "core", x: cx, y: cy, radius: 38, label: "TWINIQ CORE", stat: "94.98% Accuracy", sub: "Cognitive Engine" },
        { id: "revenue", x: cx, y: cy - 170, radius: 30 * pMod, label: "REVENUE", stat: `₹${((revenueVal * pMod) / 100000).toFixed(2)}L`, sub: "Top-line Yield" },
        { id: "customers", x: cx - 210, y: cy - 25, radius: 28 * mMod, label: "CUSTOMERS", stat: `${(retentionVal * dMod).toFixed(1)}% Ret.`, sub: "Market Demand" },
        { id: "inventory", x: cx + 210, y: cy - 25, radius: 28 * dMod, label: "INVENTORY", stat: `${effVal.toFixed(1)} Eff.`, sub: "Supply Chain" },
        { id: "marketing", x: cx - 135, y: cy + 155, radius: 26 * mMod, label: "MARKETING", stat: `₹${cacVal} CAC`, sub: "Acquisition Funnel" },
        { id: "cashflow", x: cx + 135, y: cy + 155, radius: 26 * pMod, label: "CASH FLOW", stat: `${marginVal.toFixed(1)}% Margin`, sub: "Operating Margin" },
      ];

      let found = null;
      for (const n of nodes) {
        const dist = Math.hypot(x - n.x, y - n.y);
        if (dist < n.radius + 15) {
          found = n;
          break;
        }
      }
      setHoveredNode(found);
    };

    const handleMouseLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      setHoveredNode(null);
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [width, height, dna, morphState, interactive, revenueVal, marginVal, retentionVal, cacVal, effVal]);

  return (
    <div className="living-twin-canvas-container" ref={containerRef} style={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          cursor: interactive ? (hoveredNode ? "pointer" : "default") : "default",
        }}
        onClick={() => {
          if (hoveredNode && onNodeClick) {
            onNodeClick(hoveredNode);
          }
        }}
      />

      {/* Floating HUD Telemetry Card when hovering a node */}
      {hoveredNode && (
        <div
          className="canvas-node-hud"
          style={{
            position: "absolute",
            left: `${Math.min(width - 200, Math.max(20, mousePos.x + 15))}px`,
            top: `${Math.min(height - 110, Math.max(20, mousePos.y - 45))}px`,
            pointerEvents: "none",
          }}
        >
          <div className="hud-header">
            <span className="hud-dot" />
            <span className="hud-label">{hoveredNode.label}</span>
          </div>
          <div className="hud-stat">{hoveredNode.stat}</div>
          <div className="hud-sub">{hoveredNode.sub}</div>
          <div className="hud-hint">Real-time digital twin node • Live telemetry</div>
        </div>
      )}
    </div>
  );
}
