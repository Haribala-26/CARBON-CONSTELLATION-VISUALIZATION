import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Network,
  Waves,
  Cpu,
  ThermometerSnowflake,
  Globe,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Flame,
  Droplets,
  Layers,
  ChevronRight
} from "lucide-react";
import { INFRASTRUCTURE_STAGES } from "../data/infrastructureStages";
import { InfrastructureStage } from "../types";

interface InfrastructureJourneyProps {
  onProceedToScale: () => void;
  onJumpToConstellation: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  ThermometerSnowflake: <ThermometerSnowflake className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
};

export const InfrastructureJourney: React.FC<InfrastructureJourneyProps> = ({
  onProceedToScale,
  onJumpToConstellation,
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activeStage: InfrastructureStage = INFRASTRUCTURE_STAGES[activeStageIndex];

  // Autoplay progression through stages
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % INFRASTRUCTURE_STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div id="infrastructure-journey-scene" className="relative w-full min-h-[90vh] py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Scene 02 &bull; The Hidden Physical Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white font-editorial mt-1">
            Beneath The Surface of One Click
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="journey-playback-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause Stream" : "Resume Flow"}</span>
          </button>

          <button
            id="proceed-to-scale-btn"
            onClick={onProceedToScale}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)]"
          >
            <span>Scale This Click</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spatial Interactive Pipeline */}
      <div className="my-8">
        {/* Pipeline Nodes Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {INFRASTRUCTURE_STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            const isPassed = idx < activeStageIndex;

            return (
              <button
                key={stage.id}
                id={`stage-tab-${idx}`}
                onClick={() => {
                  setActiveStageIndex(idx);
                  setIsPlaying(false);
                }}
                className={`relative p-3 rounded-xl text-left transition-all duration-300 border flex flex-col justify-between min-h-[90px] ${
                  isActive
                    ? "bg-slate-800/90 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]"
                    : isPassed
                    ? "bg-slate-900/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                    : "bg-slate-950/40 border-slate-800/50 text-slate-500 hover:border-slate-700"
                }`}
              >
                {/* Node order & Icon */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                    isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800/50 text-slate-400"
                  }`}>
                    0{stage.order}
                  </span>
                  <div className={isActive ? "text-cyan-400" : isPassed ? "text-slate-400" : "text-slate-600"}>
                    {ICONS_MAP[stage.iconName]}
                  </div>
                </div>

                {/* Title */}
                <div className="mt-2">
                  <div className={`text-xs font-medium truncate ${isActive ? "text-white font-semibold" : "text-slate-300"}`}>
                    {stage.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {stage.energySharePercent}% footprint
                  </div>
                </div>

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="active-stage-line"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Spatial Dynamic Stage Detail Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Subtle animated background grid & laser stream */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Dynamic Visual Hologram */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 relative min-h-[280px]">
              {/* Dynamic stage schematic graphic */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Rotating orbital energy ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-orbit" />
                <div className="absolute -inset-4 rounded-full border border-slate-800 animate-pulse-subtle" />

                {/* Stage-specific dynamic visualization */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center text-center p-4"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                      <div className="scale-150">
                        {ICONS_MAP[activeStage.iconName]}
                      </div>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      {activeStage.visualAnchor}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">
                      {activeStage.physicalLocation}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Real-time microsecond indicator */}
              {activeStage.timeMicroseconds > 0 && (
                <div className="mt-4 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Transit Time: {activeStage.timeMicroseconds.toLocaleString()} μs</span>
                </div>
              )}
            </div>

            {/* Right: Technical & Scientific Description */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      Layer 0{activeStage.order} of 06
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {activeStage.subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-semibold text-white font-editorial mt-3 mb-3">
                    {activeStage.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
                    {activeStage.description}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Physical Mechanism:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 font-mono-code leading-relaxed">
                      {activeStage.physicalMechanism}
                    </p>
                  </div>

                  {/* Quantitative Telemetry Pill Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Energy Demand</div>
                        <div className="text-xs font-semibold text-slate-200 font-mono">{activeStage.energyMetric}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                      <div className="p-2 rounded bg-rose-500/10 text-rose-400">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Carbon Equivalent</div>
                        <div className="text-xs font-semibold text-slate-200 font-mono">{activeStage.carbonMetric}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/60">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive physical breakdown &bull; Sustainable Web Design v3 Model</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="prev-stage-btn"
            disabled={activeStageIndex === 0}
            onClick={() => {
              setActiveStageIndex((prev) => Math.max(0, prev - 1));
              setIsPlaying(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            &larr; Previous Stage
          </button>

          <button
            id="next-stage-btn"
            onClick={() => {
              if (activeStageIndex === INFRASTRUCTURE_STAGES.length - 1) {
                onProceedToScale();
              } else {
                setActiveStageIndex((prev) => prev + 1);
                setIsPlaying(false);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors"
          >
            <span>{activeStageIndex === INFRASTRUCTURE_STAGES.length - 1 ? "Next: Scale Interaction" : "Next Stage"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
