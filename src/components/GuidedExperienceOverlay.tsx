import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  Globe,
  Radio,
  Sliders,
  Flame,
  Zap,
  Droplets,
  Server,
  Cable,
  CheckCircle2,
  Eye,
  Layers,
  Activity,
  ArrowRight,
  TrendingDown,
  Navigation,
  Compass
} from "lucide-react";
import { SimulationScale, SimulationScenario, WebsiteData } from "../types";

export interface WalkthroughStep {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  durationSec: number;
  highlightTargetId?: string;
  viewMode: "constellation" | "physical" | "journey";
  scale: SimulationScale;
  scenarioId?: string;
  targetSiteId?: string;
  icon: any;
  accentColor: string;
  summary: string;
  narrativeBullets: string[];
  liveMetrics: { label: string; value: string; unit?: string }[];
}

interface GuidedExperienceModalProps {
  isActive: boolean;
  onClose: () => void;
  websites: WebsiteData[];
  onSelectWebsite: (site: WebsiteData) => void;
  onSetScale: (scale: SimulationScale) => void;
  onSetView: (view: "constellation" | "physical" | "journey") => void;
  onSetScenario: (scenarioId: string) => void;
  onTriggerVisualizePulse: () => void;
}

export const GuidedExperienceOverlay: React.FC<GuidedExperienceModalProps> = ({
  isActive,
  onClose,
  websites,
  onSelectWebsite,
  onSetScale,
  onSetView,
  onSetScenario,
  onTriggerVisualizePulse,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [progress, setProgress] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const steps: WalkthroughStep[] = [
    {
      id: "step-1",
      stepNumber: 1,
      badge: "Origin • The Single Request",
      title: "The Physical Weight of One Click",
      durationSec: 14,
      viewMode: "constellation",
      scale: 1,
      targetSiteId: "google",
      accentColor: "#38bdf8",
      icon: Radio,
      highlightTargetId: "constellation-3d-viewport",
      summary: "Digital interactions appear weightless, but trigger immediate electrical draw across silicon chips and network routing hubs.",
      narrativeBullets: [
        "A single Google search or page load transfers ~2.1 MB of compressed assets.",
        "Generates ~0.38g CO₂e and evaporates 1.4 mL of data center chiller cooling water.",
        "Data travels across local Wi-Fi radios, regional ISP rings, and edge transit routers."
      ],
      liveMetrics: [
        { label: "Data Payload", value: "2.1", unit: "MB" },
        { label: "Per-Click Carbon", value: "0.38", unit: "gCO₂e" },
        { label: "Transit Radios", value: "3", unit: "Hops" }
      ]
    },
    {
      id: "step-2",
      stepNumber: 2,
      badge: "Ecosystem • The Constellation",
      title: "Planetary Web Ecosystem as Living Celestial Bodies",
      durationSec: 16,
      viewMode: "constellation",
      scale: 1,
      targetSiteId: "youtube",
      accentColor: "#f43f5e",
      icon: Globe,
      highlightTargetId: "constellation-3d-viewport",
      summary: "Top global platforms orbit based on their network payload weight and localized grid carbon intensity.",
      narrativeBullets: [
        "Video streaming giants (YouTube, Netflix) generate expansive orbital envelopes due to high video bitrates.",
        "Green glowing auras indicate verified 100% renewable hosting matching.",
        "Orbital radius and pulse speed reflect active session concurrency."
      ],
      liveMetrics: [
        { label: "Mapped Nodes", value: String(websites.length), unit: "Platforms" },
        { label: "Heavy Streamers", value: "3", unit: "Services" },
        { label: "Renewable Verified", value: "40%", unit: "Ecosystem" }
      ]
    },
    {
      id: "step-3",
      stepNumber: 3,
      badge: "Physics • Deep-Sea Transit",
      title: "1.4 Million Kilometers of Subsea Fiber Optic Conduits",
      durationSec: 16,
      viewMode: "journey",
      scale: 1,
      accentColor: "#06b6d4",
      icon: Cable,
      highlightTargetId: "infrastructure-journey-scene",
      summary: "99% of international data travels not through satellites, but through armored fiber cables resting on ocean floor trenches.",
      narrativeBullets: [
        "Lasers shoot photon bursts through glass fibers narrower than human hair.",
        "High-voltage electrical repeaters every 70km boost signal against oceanic pressure.",
        "Cable landing stations draw continuous 24/7 municipal electricity."
      ],
      liveMetrics: [
        { label: "Ocean Subsea Cables", value: "550+", unit: "Active Lines" },
        { label: "Laser Wavelength", value: "1550", unit: "nm Light" },
        { label: "Optical Latency", value: "65", unit: "ms" }
      ]
    },
    {
      id: "step-4",
      stepNumber: 4,
      badge: "Compute • Thermal Plumes",
      title: "Hyperscale Server Halls & Evaporative Cooling",
      durationSec: 16,
      viewMode: "physical",
      scale: 1,
      accentColor: "#f59e0b",
      icon: Server,
      highlightTargetId: "impact-transformation-scene",
      summary: "Dense clusters of server racks generate intense thermal loads that require industrial evaporative cooling towers.",
      narrativeBullets: [
        "Power Usage Effectiveness (PUE) measures cooling overhead: 1.15 is ultra-efficient, 1.6+ wastes substantial power.",
        "Data centers consume billions of gallons of freshwater annually for temperature control.",
        "Grid carbon intensity varies wildly from hydro (Norway: 25g/kWh) to coal-heavy regions (500g+/kWh)."
      ],
      liveMetrics: [
        { label: "Average PUE", value: "1.22", unit: "Factor" },
        { label: "Cooling Evaporation", value: "1.8", unit: "L/kWh" },
        { label: "Operating Temp", value: "24°", unit: "Celsius" }
      ]
    },
    {
      id: "step-5",
      stepNumber: 5,
      badge: "Surge • 1 Million Sessions",
      title: "The Exponential Concurrency Multiplier",
      durationSec: 16,
      viewMode: "constellation",
      scale: 1000000,
      targetSiteId: "netflix",
      accentColor: "#a855f7",
      icon: Sliders,
      highlightTargetId: "website-focus-inspector-panel",
      summary: "When a platform serves 1 Million simultaneous users, fractional grams of CO₂ rapidly compound into metric tons.",
      narrativeBullets: [
        "1 Million Netflix streams consume ~420,000 kWh of electricity across user TV displays and edge caches.",
        "Emits ~190 Metric Tons of CO₂e in just a single viewing window.",
        "Equivalent to driving an average gasoline passenger vehicle for over 790,000 kilometers."
      ],
      liveMetrics: [
        { label: "Simulated Traffic", value: "1,000,000", unit: "Sessions" },
        { label: "Energy Demand", value: "420", unit: "MWh" },
        { label: "Carbon Surge", value: "190", unit: "Tonnes" }
      ]
    },
    {
      id: "step-6",
      stepNumber: 6,
      badge: "Macro • Planetary Load",
      title: "5.4 Billion Global Users: Internet as a Super-Emitter",
      durationSec: 16,
      viewMode: "constellation",
      scale: 5400000000,
      accentColor: "#ef4444",
      icon: Flame,
      highlightTargetId: "constellation-3d-viewport",
      summary: "Global internet infrastructure now generates over 1.6 Billion tons of greenhouse gas emissions annually (~3.7% of world total).",
      narrativeBullets: [
        "Surpasses the global commercial aviation industry in total electricity consumption.",
        "Data traffic grows ~25% year-over-year, driven by 4K streaming, cloud compute, and AI training workloads.",
        "Efficiency gains in silicon must outpace exponential traffic expansion to prevent grid overload."
      ],
      liveMetrics: [
        { label: "Global Population", value: "5.4B", unit: "Users" },
        { label: "Global Emission Share", value: "3.7%", unit: "World GHG" },
        { label: "Global Electricity", value: "~1,000", unit: "TWh/yr" }
      ]
    },
    {
      id: "step-7",
      stepNumber: 7,
      badge: "Solution • Clean Cloud",
      title: "Decarbonizing Digital Architecture: 100% Renewables",
      durationSec: 16,
      viewMode: "constellation",
      scale: 1000000,
      scenarioId: "carbon_free_grid",
      targetSiteId: "wikipedia",
      accentColor: "#10b981",
      icon: TrendingDown,
      highlightTargetId: "scenario-controls-panel",
      summary: "24/7 carbon-intelligent workload scheduling and renewable power purchasing can eliminate up to 85% of digital emissions.",
      narrativeBullets: [
        "Shifting compute to regions with surplus solar and wind power slashes operational scope 2 emissions.",
        "Aggressive asset compression, dark mode styling, and lightweight code reduce payload transfer sizes.",
        "Every engineer and architect plays a direct role in creating a sustainable, regenerative internet."
      ],
      liveMetrics: [
        { label: "Carbon Reduction", value: "-85%", unit: "Emissions" },
        { label: "Renewable Matching", value: "100%", unit: "Hourly" },
        { label: "Efficiency Boost", value: "+40%", unit: "Optimized" }
      ]
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Apply step configuration across the entire app state
  const applyStepState = (step: WalkthroughStep) => {
    onSetView(step.viewMode);
    onSetScale(step.scale);

    if (step.scenarioId) {
      onSetScenario(step.scenarioId);
    } else {
      onSetScenario("baseline");
    }

    if (step.targetSiteId) {
      const site = websites.find((w) => w.id === step.targetSiteId) || websites[0];
      if (site) onSelectWebsite(site);
    }

    onTriggerVisualizePulse();

    // Scroll viewport to relevant section if appropriate
    if (step.highlightTargetId) {
      setTimeout(() => {
        const el = document.getElementById(step.highlightTargetId!);
        if (el) {
          const rect = el.getBoundingClientRect();
          setSpotlightRect({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setSpotlightRect(null);
        }
      }, 150);
    } else {
      setSpotlightRect(null);
    }
  };

  useEffect(() => {
    if (!isActive) return;
    applyStepState(currentStep);
    setProgress(0);
  }, [isActive, currentStepIndex]);

  // Window resize updater for spotlight
  useEffect(() => {
    if (!isActive || !currentStep.highlightTargetId) return;
    const handleResize = () => {
      const el = document.getElementById(currentStep.highlightTargetId!);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSpotlightRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, currentStepIndex]);

  // Keyboard navigation: Left/Right arrow, Space for pause/play, Escape to exit
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, currentStepIndex, isPaused]);

  // Step timer loop
  useEffect(() => {
    if (!isActive || isPaused) return;

    const intervalMs = 50;
    const effectiveDuration = currentStep.durationSec / playbackSpeed;
    const totalTicks = (effectiveDuration * 1000) / intervalMs;
    let ticks = 0;

    const timer = setInterval(() => {
      ticks++;
      setProgress((ticks / totalTicks) * 100);

      if (ticks >= totalTicks) {
        clearInterval(timer);
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPaused(true);
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, isPaused, playbackSpeed, currentStep.durationSec]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsPaused(false);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsPaused(false);
      setProgress(0);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    setIsPaused(false);
    setProgress(0);
  };

  if (!isActive) return null;

  const IconComponent = currentStep.icon;

  return (
    <div id="interactive-guided-walkthrough-layer" className="fixed inset-0 z-50 pointer-events-none">
      {/* Visual Ambient Beacon on Target Container */}
      {spotlightRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            top: spotlightRect.top - 6,
            left: spotlightRect.left - 6,
            width: spotlightRect.width + 12,
            height: spotlightRect.height + 12,
          }}
          className="absolute rounded-3xl border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.35)] pointer-events-none z-30 transition-all duration-500 ease-out"
        >
          <div className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-full bg-cyan-500 text-[#050811] text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" />
            <span>Active Focus: {currentStep.title}</span>
          </div>
        </motion.div>
      )}

      {/* Top Floating Mini Scrubber / Phase Dots */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#050811]/95 border border-slate-800/80 backdrop-blur-xl shadow-2xl max-w-[94vw] overflow-x-auto no-scrollbar">
        {steps.map((st, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;
          return (
            <button
              key={st.id}
              onClick={() => handleJumpToStep(idx)}
              className={`group relative shrink-0 flex items-center justify-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono transition-all ${
                isCurrent
                  ? "bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-bold"
                  : isPassed
                  ? "bg-slate-900/90 text-slate-300 hover:text-white"
                  : "bg-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="flex items-center gap-1 sm:gap-1.5">
                {isPassed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCurrent ? "bg-cyan-400 animate-pulse" : "bg-slate-600"}`} />
                )}
                <span>0{st.stepNumber}</span>
              </span>

              {/* Hover Tooltip on desktop */}
              <div className="hidden sm:block absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {st.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary Bottom HUD Control Card */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        id="walkthrough-main-card"
        className="pointer-events-auto absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[95%] max-w-4xl max-h-[85vh] overflow-y-auto sm:overflow-visible rounded-2xl bg-gradient-to-b from-[#080d1a]/98 via-[#060913]/98 to-[#04060d]/98 border border-cyan-500/40 p-3.5 sm:p-5 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.22)] z-50"
      >
        {/* Continuous Step Progress Bar */}
        <div className="w-full h-1 sm:h-1.5 bg-slate-900 rounded-full overflow-hidden mb-2.5 sm:mb-3.5 border border-slate-800/60">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
          {/* Narrative Content */}
          <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border shadow-inner mt-0.5"
              style={{
                backgroundColor: `${currentStep.accentColor}18`,
                borderColor: `${currentStep.accentColor}55`,
                color: currentStep.accentColor,
              }}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: `${currentStep.accentColor}15`,
                    borderColor: `${currentStep.accentColor}40`,
                    color: currentStep.accentColor,
                  }}
                >
                  {currentStep.badge}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                  Step {currentStep.stepNumber}/{steps.length}
                </span>
              </div>

              <h3 className="text-xs sm:text-base font-bold text-white mt-1 leading-snug tracking-tight">
                {currentStep.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                {currentStep.summary}
              </p>

              {/* Real-time telemetry badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mt-2 sm:mt-2.5">
                {currentStep.liveMetrics.map((met, mi) => (
                  <div
                    key={mi}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[10px] sm:text-[11px] font-mono"
                  >
                    <span className="text-slate-400">{met.label}:</span>
                    <strong className="text-cyan-300">{met.value}</strong>
                    {met.unit && <span className="text-slate-500 text-[9px] sm:text-[10px]">{met.unit}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Playback & Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-stretch lg:self-center shrink-0 border-t lg:border-t-0 border-slate-800/80 pt-2.5 lg:pt-0 justify-between lg:justify-end">
            {/* Speed Selector */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 sm:p-1">
              {([1, 1.5, 2] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono transition-colors ${
                    playbackSpeed === spd
                      ? "bg-cyan-500/30 text-cyan-200 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Previous */}
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:hover:border-slate-800 transition-colors"
                title="Previous Phase (Left Arrow)"
              >
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/25 to-emerald-500/25 border border-cyan-500/50 text-cyan-200 hover:border-cyan-400 transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-bold shadow-sm"
                title="Spacebar to Play/Pause"
              >
                {isPaused ? <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> : <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />}
                <span>{isPaused ? "Play" : "Pause"}</span>
              </button>

              {/* Next or Finish */}
              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold"
                  title="Next Phase (Right Arrow)"
                >
                  <span>Next</span>
                  <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold"
                >
                  <span>Finish</span>
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}

              {/* Restart */}
              <button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPaused(false);
                  setProgress(0);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Restart from Beginning"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Close / Exit */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors ml-0.5 sm:ml-1"
                title="Exit Walkthrough (Esc)"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
