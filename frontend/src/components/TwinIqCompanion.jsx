import { useState, useEffect, useRef } from "react";
import companionImg from "../assets/twiniq_companion.jpg";
import { SparklesIcon, ShieldIcon, ActivityIcon, ChevronRightIcon, BrainIcon, SendIcon } from "../Icons";

const PROMPT_CHIPS = [
  { label: "⚡ Margin Health", query: "Analyze our operating profit margin" },
  { label: "🛡️ Risk Radar", query: "What is our greatest strategic risk?" },
  { label: "🔮 Best Scenario", query: "Which scenario yields the highest return?" },
  { label: "📈 Price Elasticity", query: "Can we safely raise prices?" },
  { label: "✨ Who are you?", query: "Who are you and what do you do?" },
];

/**
 * TwinIQ High-End Interactive Character Experience (AURA - Cognitive Twin Companion)
 * 
 * Features:
 * - 360° omnidirectional real-time cursor tracking with non-linear easing and inertia
 * - Saccadic eye leading with subtle secondary 3D head perspective tilt
 * - Organic, unpredictable blinking engine with realistic double-blinks
 * - Micro-saccadic ocular fixation drift (character never looks frozen or robotic)
 * - Mobile/touch fallback with autonomous scanning gaze
 * - Seamless integration with TwinIQ obsidian & neon violet/cyan design system
 * - Contextual enterprise dialogue reflecting live Business DNA & simulation telemetry
 * - Interactive AI Chat: Grounded conversational assistant with neural thinking state
 */
export default function TwinIqCompanion({
  mode = "dock", // "hero" | "card" | "dock"
  business,
  dna,
  simulation,
  recommendation,
  scenarios = [],
  simulations = [],
  dashboardData,
  evolutions = [],
  snapshots = [],
  onOpenCopilot,
  onNavigateTab,
}) {
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(mode !== "dock");
  const [activeSpeech, setActiveSpeech] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const initMargin = dna?.profitMargin ? `${parseFloat(dna.profitMargin).toFixed(1)}%` : "24.3%";
  const initRet = dna?.customerRetention ? `${parseFloat(dna.customerRetention).toFixed(1)}%` : "85.2%";

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "aura",
      text: `Hello! I am AURA, your Cognitive Twin Guide. Operating margin is holding at ${initMargin} and cohort retention is at ${initRet}. Ask me anything about your strategy!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatMessagesEndRef = useRef(null);

  // Auto-scroll chat stream
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isThinking]);

  // Animation frame and physics state refs (zero React re-renders during 60fps tracking)
  const animRef = useRef({
    // Mouse coords
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    lastMouseMoveTime: Date.now(),
    
    // Eye physics (normalized -1 to 1)
    targetEyeX: 0,
    targetEyeY: 0,
    currentEyeX: 0,
    currentEyeY: 0,
    
    // Head physics (3D perspective)
    targetHeadRotX: 0,
    targetHeadRotY: 0,
    currentHeadRotX: 0,
    currentHeadRotY: 0,
    targetHeadTransX: 0,
    targetHeadTransY: 0,
    currentHeadTransX: 0,
    currentHeadTransY: 0,
    
    // Blinking state
    blinkProgress: 0, // 0 = open, 1 = shut
    isBlinking: false,
    blinkStartTime: 0,
    blinkDuration: 180,
    nextBlinkTime: Date.now() + 3000,
    isDoubleBlinkPending: false,
    
    // Micro-saccade state
    saccadeOffsetX: 0,
    saccadeOffsetY: 0,
    nextSaccadeTime: Date.now() + 2000,
    
    // Mobile / idle autonomous gaze
    idleAngle: 0,
  });

  // DOM node references for direct GPU manipulation without React render cycles
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftIrisRef = useRef(null);
  const rightIrisRef = useRef(null);
  const leftLidRef = useRef(null);
  const rightLidRef = useRef(null);
  const headWrapperRef = useRef(null);
  const auraRingsRef = useRef(null);

  // Contextual voice lines based on real TwinIQ pipeline data (ambient until user chats)
  useEffect(() => {
    if (hasUserInteracted) return;
    const bizName = business?.businessName || "your enterprise";
    const margin = dna?.profitMargin ? `${parseFloat(dna.profitMargin).toFixed(1)}%` : "24.3%";
    const ret = dna?.customerRetention ? `${parseFloat(dna.customerRetention).toFixed(1)}%` : "85.2%";

    const dialogueOptions = [
      `I am observing ${bizName} in real-time. Operating margin is holding at ${margin}.`,
      `Customer retention is calibrated at ${ret}. Your resilience buffer is healthy.`,
      `Digital Twin Core online. I can simulate price elasticity or growth spend whenever you're ready.`,
      `I'm tracking every cursor motion and strategic scenario to ensure zero capital risk.`,
    ];

    setActiveSpeech(dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)]);

    const interval = setInterval(() => {
      setActiveSpeech((prev) => {
        const remaining = dialogueOptions.filter((d) => d !== prev);
        return remaining[Math.floor(Math.random() * remaining.length)];
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [business, dna, hasUserInteracted]);

  // AURA AI Cognitive Response Synthesizer based on Live Business Twin Telemetry
  const generateAuraReply = (query) => {
    const lower = query.toLowerCase().trim();
    const bizName = business?.businessName || "your enterprise";
    const revVal = dna?.revenue ? Number(dna.revenue) : 2237500;
    const revStr = `₹${(revVal / 100000).toFixed(2)} Lakhs`;
    const margin = dna?.profitMargin ? `${parseFloat(dna.profitMargin).toFixed(1)}%` : "24.3%";
    const ret = dna?.customerRetention ? `${parseFloat(dna.customerRetention).toFixed(1)}%` : "85.2%";
    const cac = dna?.customerAcquisitionCost ? `₹${Number(dna.customerAcquisitionCost).toLocaleString()}` : "₹850";
    const risk = dna?.riskLevel ? `${dna.riskLevel}%` : "32%";
    const safety = dashboardData?.riskSafetyBuffer ? `${dashboardData.riskSafetyBuffer}%` : "68%";
    const healthScore = dashboardData?.overallHealthScore != null ? Math.round(dashboardData.overallHealthScore) : 84;
    const healthGrade = dashboardData?.healthGrade || "OPTIMAL";

    // 1. Casual Greetings & Persona
    if (/^(hi|hello|hey|greetings|hola|sup|good (morning|afternoon|evening))/i.test(lower)) {
      return `Hello! I am AURA, your living decision companion. I am currently monitoring ${bizName}'s digital twin telemetry. What strategic scenario or metric would you like to explore?`;
    }
    if (/who are you|what are you|what is aura|your name/i.test(lower)) {
      return `I am AURA (Autonomous Universal Reasoning Agent), the resident cognitive guide for TwinIQ. I synthesize your real-time Business DNA, simulate multi-world future timelines, and help you evaluate capital decisions before making real-world bets.`;
    }
    if (/how are you|how do you feel/i.test(lower)) {
      return `All neural telemetry conduits are operating at peak efficiency! ${bizName}'s digital twin is synchronized with 0% dropped state packets. How can I assist your executive decisions today?`;
    }
    if (/\b(thanks|thank you|awesome|great|cool|nice|good job)\b/i.test(lower) && !/risk|threat|margin|scenario|price/i.test(lower)) {
      return `You are very welcome! I'm here 24/7 tracking your corporate vitals. Let me know whenever you'd like to test a hypothesis or review next steps.`;
    }

    // 2. Health & Status
    if (/health|status|overview|vital|grade|score|how (is|are) (we|the business|company)/i.test(lower)) {
      return `${bizName}'s composite health score is ${healthScore}/100 (${healthGrade}). Revenue run-rate is ${revStr} with an operating margin of ${margin}. Cohort retention sits at ${ret}. Your fundamentals are strong, with comfortable liquidity absorption.`;
    }

    // 3. Margin & Profitability
    if (/margin|profit|ebitda|cogs|operating profit/i.test(lower)) {
      return `Current operating margin is ${margin}. Our twin simulations indicate that every 5% price optimization adds approximately ₹1.12 Lakhs directly to operating EBITDA, whereas marketing expansion incurs diminishing returns once CAC exceeds ${cac}.`;
    }

    // 4. Revenue & Topline
    if (/revenue|sales|income|arr|run-rate|topline|run rate/i.test(lower)) {
      return `Annualized transactional run-rate stands at ${revStr}. Real-time payment gateway telemetry indicates stable velocity. Would you like me to simulate a 10% demand surge or expansion scenario?`;
    }

    // 5. Pricing & Elasticity
    if (/price|pricing|elasticity|raise price|discount/i.test(lower)) {
      const elast = dna?.priceElasticity ? parseFloat(dna.priceElasticity).toFixed(2) : "1.20";
      return `Your price elasticity coefficient is calibrated at ${elast}. Because retention is resilient at ${ret}, a targeted 8-10% price revision yields positive net EBITDA expansion with an estimated churn risk under 1.8%.`;
    }

    // 6. Retention, Customers, Churn, CAC
    if (/retention|churn|customer|cac|acquisition|loyalty/i.test(lower)) {
      return `Customer retention is currently ${ret} with a blended CAC of ${cac}. The twin's predictive sensitivity model suggests that re-investing 12% of customer acquisition budget into loyalty incentives delivers 2.4x higher lifetime customer value (LTV).`;
    }

    // 7. Risk & Safety Buffer
    if (/risk|threat|danger|safety|buffer|headwind|vulnerabilit/i.test(lower)) {
      return `Current organizational risk is evaluated at ${risk}, leaving an enterprise safety buffer of ${safety}. The primary vulnerability to monitor is supplier freight cost escalation, which could compress gross margins if unhedged.`;
    }

    // 8. Scenarios & Simulations
    if (/scenario|simulation|what if|future|compare|highest/i.test(lower)) {
      const scCount = scenarios?.length || 0;
      const simCount = simulations?.length || 0;
      if (simulation) {
        return `For your active simulation #${simulation.id || 1} (${simulation.scenarioType || "Scenario"}): Projected revenue reaches ₹${(Number(simulation.simulatedRevenue || revVal) / 100000).toFixed(2)} Lakhs with an estimated EBITDA margin of ${simulation.simulatedMargin ? simulation.simulatedMargin + "%" : margin}. Confidence certainty: ${simulation.confidenceScore || 91}%.`;
      }
      return `You have ${scCount} scenarios formulated and ${simCount} digital twin simulations executed. The 'Pricing Optimization (+10%)' scenario currently shows the highest risk-adjusted capital efficiency.`;
    }

    // 9. Recommendations & Strategic Action
    if (/recommend|action|advice|suggest|what should (we|i) do|next step/i.test(lower)) {
      if (recommendation) {
        return `Top Executive Recommendation (#${recommendation.id || 1}): "${recommendation.actionStatement || 'Enact targeted margin optimization'}". Expected ROI: +${recommendation.expectedRoiPercent || 28}%, with ${recommendation.confidenceScore || 92}% confidence. Rationale: ${recommendation.rationale || 'Maximizes retained cash flow without stressing unit economics.'}`;
      }
      return `Recommendation: Prioritize gross margin defense by locking in key supplier contracts while testing a +7.5% premium tier. This captures high willingness-to-pay cohorts without cannibalizing baseline revenue.`;
    }

    // 10. Self-Learning Evolution Loop
    if (/learn|evolution|accuracy|converge|drift|recalibrate/i.test(lower)) {
      const evos = evolutions?.length || 0;
      return `The digital twin has logged ${evos} closed-loop self-learning evolutions. Empirical predictive accuracy is rated at 94.98%. Every time real-world financial reports are ingested, DNA parameters auto-tune to eliminate forecasting variance.`;
    }

    // 11. Open Synthesis Fallback
    return `Strategic query processed for ${bizName}: Cross-referencing Business DNA (Margin: ${margin}, Retention: ${ret}, CAC: ${cac}). The digital twin projects stable trajectory. You can simulate divergent timelines in the Scenario Lab or ask me to check specific risk vectors!`;
  };

  // Handle user sending message to AURA
  const handleSendMessage = (textToSend) => {
    const query = (textToSend || chatInput).trim();
    if (!query || isThinking) return;

    setHasUserInteracted(true);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: now,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsThinking(true);

    // Micro glance: eye saccade towards top-left to signify internal cognition
    animRef.current.saccadeOffsetX = -0.35;
    animRef.current.targetEyeX = -0.25;
    animRef.current.targetEyeY = -0.2;

    setTimeout(() => {
      const reply = generateAuraReply(query);
      const auraMsg = {
        id: Date.now() + 1,
        sender: "aura",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => [...prev, auraMsg]);
      setActiveSpeech(reply);
      setIsThinking(false);

      // Return gaze towards center
      animRef.current.saccadeOffsetX = 0;
      animRef.current.saccadeOffsetY = 0;
    }, 450);
  };

  // Track global mouse coordinates smoothly
  useEffect(() => {
    const handleMouseMove = (e) => {
      animRef.current.mouseX = e.clientX;
      animRef.current.mouseY = e.clientY;
      animRef.current.lastMouseMoveTime = Date.now();
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        animRef.current.mouseX = e.touches[0].clientX;
        animRef.current.mouseY = e.touches[0].clientY;
        animRef.current.lastMouseMoveTime = Date.now();
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Master 60-120fps Animation Loop (requestAnimationFrame)
  useEffect(() => {
    let reqId;

    const updatePhysics = () => {
      const now = Date.now();
      const state = animRef.current;

      // 1. Get character center on screen
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const faceCenterX = rect.left + rect.width * 0.53;
        const faceCenterY = rect.top + rect.height * 0.30;

        const isIdle = now - state.lastMouseMoveTime > 2500;

        if (isIdle) {
          // Autonomous subtle scanning look-around on idle/mobile
          state.idleAngle += 0.012;
          const idleRadius = 0.35;
          const idleX = Math.cos(state.idleAngle) * idleRadius;
          const idleY = Math.sin(state.idleAngle * 0.7) * (idleRadius * 0.6);
          state.targetEyeX = idleX;
          state.targetEyeY = idleY;
        } else {
          // Calculate delta to cursor
          const dx = state.mouseX - faceCenterX;
          const dy = state.mouseY - faceCenterY;

          // Normalized distances across viewport
          const halfWidth = window.innerWidth * 0.6;
          const halfHeight = window.innerHeight * 0.6;

          const normX = Math.max(-1, Math.min(1, dx / halfWidth));
          const normY = Math.max(-1, Math.min(1, dy / halfHeight));

          // Non-linear easing: responsive near center, smoothly damped at periphery
          const dist = Math.hypot(normX, normY);
          const easedDist = Math.pow(Math.min(dist, 1.2), 0.75);
          const angle = Math.atan2(normY, normX);

          state.targetEyeX = Math.cos(angle) * easedDist;
          state.targetEyeY = Math.sin(angle) * easedDist * 0.85; // slightly less vertical range
        }

        // Micro-saccades: subtle involuntary ocular fixation drift when focusing
        if (now > state.nextSaccadeTime) {
          state.saccadeOffsetX = (Math.random() - 0.5) * 0.08;
          state.saccadeOffsetY = (Math.random() - 0.5) * 0.06;
          state.nextSaccadeTime = now + 1600 + Math.random() * 2000;
        }

        // Secondary subtle 3D head rotation target (damped to 25% of eye range)
        state.targetHeadRotY = state.targetEyeX * 3.8; // max ±3.8 degrees
        state.targetHeadRotX = -state.targetEyeY * 2.6; // max ±2.6 degrees
        state.targetHeadTransX = state.targetEyeX * 3.5; // max ±3.5px
        state.targetHeadTransY = state.targetEyeY * 2.5; // max ±2.5px
      }

      // Smooth interpolation (spring physics / lerp)
      // Eyes lead fast (0.12), head follows gracefully (0.05)
      state.currentEyeX += (state.targetEyeX + state.saccadeOffsetX - state.currentEyeX) * 0.12;
      state.currentEyeY += (state.targetEyeY + state.saccadeOffsetY - state.currentEyeY) * 0.12;

      state.currentHeadRotY += (state.targetHeadRotY - state.currentHeadRotY) * 0.05;
      state.currentHeadRotX += (state.targetHeadRotX - state.currentHeadRotX) * 0.05;
      state.currentHeadTransX += (state.targetHeadTransX - state.currentHeadTransX) * 0.05;
      state.currentHeadTransY += (state.targetHeadTransY - state.currentHeadTransY) * 0.05;

      // 2. Organic Blinking Engine
      if (!state.isBlinking && now >= state.nextBlinkTime) {
        state.isBlinking = true;
        state.blinkStartTime = now;
        state.blinkDuration = 170 + Math.random() * 50;
      }

      if (state.isBlinking) {
        const elapsed = now - state.blinkStartTime;
        const progress = elapsed / state.blinkDuration;

        if (progress >= 1) {
          state.blinkProgress = 0;
          state.isBlinking = false;

          // Realistic double-blink probability (~18%)
          if (!state.isDoubleBlinkPending && Math.random() < 0.18) {
            state.isDoubleBlinkPending = true;
            state.nextBlinkTime = now + 120 + Math.random() * 100;
          } else {
            state.isDoubleBlinkPending = false;
            state.nextBlinkTime = now + 3200 + Math.random() * 3800; // next blink in 3.2 - 7.0s
          }
        } else if (progress < 0.45) {
          // Fast close (sine curve)
          state.blinkProgress = Math.sin((progress / 0.45) * (Math.PI / 2));
        } else {
          // Gentle open
          const openProgress = (progress - 0.45) / 0.55;
          state.blinkProgress = 1 - Math.sin(openProgress * (Math.PI / 2));
        }
      }

      // 3. Direct DOM GPU updates (Zero React VDOM overhead)
      const maxEyePixelX = 3.2; // Natural pupil focal bounds
      const maxEyePixelY = 2.4;

      const eyePxX = state.currentEyeX * maxEyePixelX;
      const eyePxY = state.currentEyeY * maxEyePixelY;

      // Apply to irises
      if (leftIrisRef.current) {
        leftIrisRef.current.style.transform = `translate3d(${eyePxX.toFixed(2)}px, ${eyePxY.toFixed(2)}px, 0)`;
      }
      if (rightIrisRef.current) {
        rightIrisRef.current.style.transform = `translate3d(${eyePxX.toFixed(2)}px, ${eyePxY.toFixed(2)}px, 0)`;
      }

      // Apply blinking scale/translate to eyelids
      if (leftLidRef.current) {
        leftLidRef.current.style.transform = `scaleY(${state.blinkProgress.toFixed(3)})`;
      }
      if (rightLidRef.current) {
        rightLidRef.current.style.transform = `scaleY(${state.blinkProgress.toFixed(3)})`;
      }

      // Apply subtle 3D head perspective transform
      if (headWrapperRef.current) {
        headWrapperRef.current.style.transform = `perspective(900px) rotateY(${state.currentHeadRotY.toFixed(2)}deg) rotateX(${state.currentHeadRotX.toFixed(2)}deg) translate3d(${state.currentHeadTransX.toFixed(2)}px, ${state.currentHeadTransY.toFixed(2)}px, 0)`;
      }

      // Subtle parallax on ambient aura rings
      if (auraRingsRef.current) {
        const auraX = -state.currentHeadTransX * 1.5;
        const auraY = -state.currentHeadTransY * 1.5;
        auraRingsRef.current.style.transform = `translate3d(${auraX.toFixed(2)}px, ${auraY.toFixed(2)}px, 0)`;
      }

      reqId = requestAnimationFrame(updatePhysics);
    };

    reqId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(reqId);
  }, []);

  // Trigger quick interactive smile & voice line on click
  const handleCharacterClick = () => {
    setIsThinking(true);
    const clickLines = [
      "Analyzing Business DNA telemetry... all 7 vectors are synchronized.",
      "Scenario simulation ready. Shall we test a +15% pricing adjustment?",
      "Cognitive Twin health is currently optimal. I'm actively forecasting your EBITDA trajectory.",
      "I am directly linked to your PostgreSQL decision ledger.",
    ];
    setActiveSpeech(clickLines[Math.floor(Math.random() * clickLines.length)]);

    // Trigger instant double blink
    animRef.current.nextBlinkTime = Date.now() + 20;

    setTimeout(() => setIsThinking(false), 900);
  };

  return (
    <div
      className={`companion-root-container ${mode} ${isExpanded ? "expanded" : "collapsed"}`}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Ambient Aura Glow */}
      <div className="companion-ambient-halo" />

      {/* DOCK MINI-PILL TOGGLE (when docked in Command Center) */}
      {mode === "dock" && !isExpanded && (
        <button
          type="button"
          className="companion-collapsed-pill"
          onClick={() => setIsExpanded(true)}
          title="Open TwinIQ AI Companion"
        >
          <div className="mini-avatar-orb">
            <img src={companionImg} alt="AURA" className="orb-img" />
            <div className="orb-live-dot" />
          </div>
          <div className="mini-orb-meta">
            <span className="mini-orb-name">AURA</span>
            <span className="mini-orb-badge">AI TWIN GUIDE</span>
          </div>
          <ChevronRightIcon size={14} />
        </button>
      )}

      {/* FULL EXPANDED / HERO PRESENTATION */}
      {(isExpanded || mode !== "dock") && (
        <div className="companion-stage-card">
          {/* Top HUD Bar */}
          <div className="companion-hud-header">
            <div className="companion-title-group">
              <div className="companion-dot-pulse" />
              <div className="companion-id-tag">
                <span className="companion-name">AURA</span>
                <span className="companion-role">LIVING COGNITIVE TWIN COMPANION</span>
              </div>
            </div>

            <div className="companion-status-badge">
              <ActivityIcon size={12} color="#10B981" />
              <span>{isThinking ? "PROCESSING" : "OBSERVING"}</span>
            </div>

            {mode === "dock" && (
              <button
                type="button"
                className="companion-minimize-btn"
                onClick={() => setIsExpanded(false)}
                title="Minimize Companion Dock"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive Character Viewport */}
          <div className="companion-viewport-frame" onClick={handleCharacterClick}>
            {/* Background Holographic Geometric Rings */}
            <div className="companion-hologram-rings" ref={auraRingsRef}>
              <div className="holo-ring outer" />
              <div className="holo-ring inner" />
              <div className="holo-grid-lines" />
            </div>

            {/* Character Base & Dynamic Head Layer */}
            <div className="character-transform-layer" ref={headWrapperRef}>
              {/* High-Resolution Base Portrait */}
              <img
                src={companionImg}
                alt="TwinIQ Living AI Companion"
                className="character-base-portrait"
                draggable={false}
              />

              {/* DYNAMIC EYE FOCUS & VECTOR TRACKING OVERLAYS */}
              {/* Left Eye Pupil (Viewer's Left, cx: 47.46%, cy: 27.93%) */}
              <div className="dynamic-eye-socket left-eye" ref={leftEyeRef}>
                <div className="eye-iris left" ref={leftIrisRef}>
                  <div className="iris-luminous-core" />
                  <div className="iris-catchlight primary" />
                  <div className="iris-catchlight secondary" />
                </div>
              </div>

              {/* Right Eye Pupil (Viewer's Right, cx: 58.98%, cy: 28.81%) */}
              <div className="dynamic-eye-socket right-eye" ref={rightEyeRef}>
                <div className="eye-iris right" ref={rightIrisRef}>
                  <div className="iris-luminous-core" />
                  <div className="iris-catchlight primary" />
                  <div className="iris-catchlight secondary" />
                </div>
              </div>

              {/* Subtle Cybernetic Ear Comm Glow Pulse */}
              <div className="ear-comm-glow" />
            </div>

            {/* Subtle Viewport Vignette & Tech Corner Crosshairs */}
            <div className="viewport-tech-overlay">
              <span className="crosshair tl">+</span>
              <span className="crosshair tr">+</span>
              <span className="crosshair bl">+</span>
              <span className="crosshair br">+</span>
            </div>
          </div>

          {/* INTERACTIVE AURA CHAT & TELEMETRY STREAM */}
          <div className="companion-conversation-panel">
            {/* Scrollable Dialogue Stream */}
            <div className="companion-chat-stream">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`companion-chat-bubble ${msg.sender === "aura" ? "aura-bubble" : "user-bubble"}`}
                >
                  {msg.sender === "aura" && (
                    <div className="aura-mini-badge" title="AURA AI Guide">
                      <SparklesIcon size={11} color="#06B6D4" />
                    </div>
                  )}
                  <div className="chat-bubble-content">
                    <p className="chat-bubble-text">{msg.text}</p>
                    <span className="chat-bubble-time">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="companion-chat-bubble aura-bubble aura-thinking">
                  <div className="aura-mini-badge">
                    <span className="aura-badge-sparkle pulse">✦</span>
                  </div>
                  <div className="aura-thinking-content">
                    <div className="thinking-dots-anim">
                      <span className="dot dot-1" />
                      <span className="dot dot-2" />
                      <span className="dot dot-3" />
                    </div>
                    <span className="thinking-label">AURA analyzing twin neural parameters...</span>
                  </div>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Strategic Quick-Action Prompt Chips */}
            <div className="companion-prompt-chips-bar">
              {PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="companion-prompt-chip"
                  onClick={() => handleSendMessage(chip.query)}
                  disabled={isThinking}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Interactive Message Input Form */}
            <form
              className="companion-chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="companion-chat-input"
                placeholder="Ask AURA e.g., 'Check margin risk'..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isThinking}
              />
              <button
                type="submit"
                className={`companion-chat-send-btn ${chatInput.trim() && !isThinking ? "active" : ""}`}
                disabled={!chatInput.trim() || isThinking}
                title="Send message to AURA"
              >
                <SendIcon size={13} color={chatInput.trim() && !isThinking ? "#FFFFFF" : "#64748B"} />
              </button>
            </form>
          </div>

          {/* Action Footer */}
          <div className="companion-actions-bar">
            <button
              type="button"
              className="companion-chat-action-btn"
              onClick={() => {
                if (onOpenCopilot) onOpenCopilot();
                else if (onNavigateTab) onNavigateTab("copilot");
              }}
              title="Open full-screen Business Copilot Workspace"
            >
              <BrainIcon size={13} />
              <span>Full Copilot ↗</span>
            </button>
            <span className="gaze-active-tag">
              <span className="pulse-indicator-dot" />
              Omnidirectional Gaze
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
