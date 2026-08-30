import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, Pause, SkipForward, X, CheckCircle2 } from "lucide-react";
import { SceneStep, SimulationScale, WebsiteData } from "../types";

interface JudgeDemoOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onNavigateScene: (scene: SceneStep) => void;
  onSetScale: (scale: SimulationScale) => void;
  onSelectWebsite: (site: WebsiteData) => void;
  websites: WebsiteData[];
}

interface DemoStep {
  stepNumber: number;
  durationSec: number;
  title: string;
  narration: string;
  action: () => void;
}

export const JudgeDemoOverlay: React.FC<JudgeDemoOverlayProps> = ({
  isActive,
  onClose,
  onNavigateScene,
  onSetScale,
  onSelectWebsite,
  websites,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps: DemoStep[] = [
    {
      stepNumber: 1,
      durationSec: 6,
      title: "The Empty World",
      narration: "We start from complete digital stillness. 'The internet feels weightless.'",
      action: () => onNavigateScene(1),
    },
    {
      stepNumber: 2,
      durationSec: 7,
      title: "One Digital Action",
      narration: "A single glowing photon appears. One click to initiate the physical journey.",
      action: () => onNavigateScene(1),
    },
    {
      stepNumber: 3,
      durationSec: 12,
      title: "Beneath the Surface",
      narration: "Traversing user screen silicon, metro fiber, subsea cables, compute racks, and evaporative cooling.",
      action: () => onNavigateScene(2),
    },
    {
      stepNumber: 4,
      durationSec: 10,
      title: "Scaling to Planetary Concurrency",
      narration: "Scaling 1 click into 1,000,000 concurrent sessions. The visual world density surges.",
      action: () => {
        onNavigateScene(3);
        onSetScale(1000000);
      },
    },
    {
      stepNumber: 5,
      durationSec: 12,
      title: "The Carbon Constellation",
      narration: "Entering the signature universe: humanity's top websites as living celestial bodies.",
      action: () => onNavigateScene(4),
    },
    {
      stepNumber: 6,
      durationSec: 12,
      title: "Inspecting Global Giants",
      narration: "Focusing on YouTube: 8.4 MB video payload, edge caches, and server cooling demands.",
      action: () => {
        onNavigateScene(4);
        const yt = websites.find((w) => w.id === "youtube") || websites[0];
        if (yt) onSelectWebsite(yt);
      },
    },
    {
      stepNumber: 7,
      durationSec: 14,
      title: "The Physical World Transformation",
      narration: "Transforming abstract constellation into subsea fiber highways and regional power grid loads.",
      action: () => onNavigateScene(5),
    },
    {
      stepNumber: 8,
      durationSec: 10,
      title: "The Closing Reality",
      narration: "“Nothing about the internet is weightless. We just stopped seeing the infrastructure.”",
      action: () => onNavigateScene(5),
    },
  ];

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isActive || isPaused) return;

    // Run action for current step
    currentStep.action();
    setProgress(0);

    const intervalMs = 100;
    const totalTicks = (currentStep.durationSec * 1000) / intervalMs;
    let tickCount = 0;

    const timer = setInterval(() => {
      tickCount++;
      setProgress((tickCount / totalTicks) * 100);

      if (tickCount >= totalTicks) {
        clearInterval(timer);
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPaused(true);
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, isPaused]);

  if (!isActive) return null;

  return (
    <div id="guided-tour-bar" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl rounded-2xl bg-slate-950/95 border border-cyan-500/50 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)]">
      {/* Top progress bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Step indicator & title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono text-xs font-bold shrink-0">
            {currentStepIndex + 1}/{steps.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Living Infrastructure Tour
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                &bull; {currentStep.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-sans mt-0.5 leading-snug">
              {currentStep.narration}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {currentStepIndex < steps.length - 1 && (
            <button
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
