import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Server,
  Activity,
  Radio,
  Share2
} from "lucide-react";
import { SimulationScale } from "../types";

interface ScaleControllerProps {
  currentScale: SimulationScale;
  onScaleChange: (scale: SimulationScale) => void;
  onProceedToConstellation: () => void;
}

const SCALES: { value: SimulationScale; label: string; sublabel: string; multiplier: number }[] = [
  { value: 1, label: "1 Visit", sublabel: "Single User Action", multiplier: 1 },
  { value: 10, label: "10 Visits", sublabel: "A Single Household", multiplier: 10 },
  { value: 1000, label: "1,000 Visits", sublabel: "Small Community Batch", multiplier: 1000 },
  { value: 1000000, label: "1 Million", sublabel: "Viral Content Spike", multiplier: 1000000 },
  { value: 50000000, label: "Global Scale", sublabel: "Planetary Concurrent Load", multiplier: 50000000 },
];

export const ScaleController: React.FC<ScaleControllerProps> = ({
  currentScale,
  onScaleChange,
  onProceedToConstellation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Baseline metrics for an average 2.2MB webpage
  const baseEnergyWh = 0.36; // Wh per visit
  const baseCarbonGrams = 0.45; // gCO2e per visit
  const baseWaterML = 6.8; // mL water evaporated for cooling
  const baseDataMB = 2.2; // MB transferred

  // Computed metrics at scale
  const totalEnergyKWh = (baseEnergyWh * currentScale) / 1000;
  const totalCarbonKg = (baseCarbonGrams * currentScale) / 1000;
  const totalWaterLiters = (baseWaterML * currentScale) / 1000;
  const totalDataTB = (baseDataMB * currentScale) / 1024 / 1024;

  // Real world equivalents
  const smartphoneCharges = Math.round(totalEnergyKWh / 0.012);
  const gasolineEquivalentLiters = (totalCarbonKg / 2.31).toFixed(1);
  const kmDrivenEquivalent = Math.round(totalCarbonKg / 0.12);

  // Canvas particle stream simulation that dynamically alters density based on scale
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 320);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 320;
    };
    window.addEventListener("resize", handleResize);

    // Particle count scales non-linearly for smooth visual density
    const particleCount =
      currentScale === 1
        ? 6
        : currentScale === 10
        ? 35
        : currentScale === 1000
        ? 140
        : currentScale === 1000000
        ? 450
        : 900;

    const speedMultiplier =
      currentScale === 1
        ? 0.8
        : currentScale === 10
        ? 1.3
        : currentScale === 1000
        ? 2.2
        : currentScale === 1000000
        ? 3.8
        : 5.5;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 1.5 + 0.5) * speedMultiplier,
      vy: (Math.random() - 0.5) * 0.8 * speedMultiplier,
      size: Math.random() * (currentScale >= 1000000 ? 2.5 : 1.8) + 0.5,
      hue: currentScale >= 1000000 ? 15 + Math.random() * 30 : 180 + Math.random() * 40, // turns amber/heat at mega scale
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    // Data packet conduit nodes
    const nodes = [
      { x: width * 0.1, y: height * 0.5, label: "Client Radio" },
      { x: width * 0.3, y: height * 0.3, label: "Metro Ring" },
      { x: width * 0.5, y: height * 0.7, label: "Subsea Cable" },
      { x: width * 0.7, y: height * 0.4, label: "Data Center" },
      { x: width * 0.9, y: height * 0.5, label: "Power Grid" },
    ];

    const render = () => {
      ctx.fillStyle = "rgba(8, 10, 14, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Draw active conduit paths
      ctx.lineWidth = currentScale >= 1000000 ? 2 : 1;
      ctx.strokeStyle =
        currentScale >= 1000000 ? "rgba(245, 158, 11, 0.25)" : "rgba(6, 182, 212, 0.15)";
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        const xc = (nodes[i].x + nodes[i - 1].x) / 2;
        const yc = (nodes[i].y + nodes[i - 1].y) / 2;
        ctx.quadraticCurveTo(nodes[i - 1].x, nodes[i - 1].y, xc, yc);
      }
      ctx.lineTo(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y);
      ctx.stroke();

      // Render streaming particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.05 * speedMultiplier;

        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Particle trail when scale is high
        if (currentScale >= 1000) {
          ctx.strokeStyle = `hsla(${p.hue}, 85%, 55%, ${currentAlpha * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.stroke();
        }
      }

      // Draw node beacons
      for (const node of nodes) {
        ctx.fillStyle = currentScale >= 1000000 ? "#f59e0b" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle =
          currentScale >= 1000000
            ? "rgba(245, 158, 11, 0.4)"
            : "rgba(56, 189, 248, 0.3)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentScale]);

  return (
    <div id="scale-controller-scene" className="relative w-full min-h-[90vh] py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Scene 03 &bull; Planetary Scaling
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white font-editorial mt-1">
            Scale This One Click
          </h2>
        </div>

        <button
          id="enter-constellation-btn"
          onClick={onProceedToConstellation}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          <span>Enter Carbon Constellation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Canvas & Particle Conduit */}
      <div className="my-6">
        {/* Scale Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
          {SCALES.map((s) => {
            const isSelected = currentScale === s.value;
            return (
              <button
                key={s.value}
                id={`scale-btn-${s.value}`}
                onClick={() => onScaleChange(s.value)}
                className={`px-4 sm:px-6 py-3 rounded-xl border text-center transition-all duration-300 relative ${
                  isSelected
                    ? "bg-slate-800 border-cyan-400 text-white shadow-[0_0_25px_rgba(56,189,248,0.3)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className={`text-sm sm:text-base font-semibold font-mono ${isSelected ? "text-cyan-300" : ""}`}>
                  {s.label}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {s.sublabel}
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="scale-active-glow"
                    className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 -z-10 blur-sm"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Simulation Viewport */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Canvas particle renderer */}
          <canvas ref={canvasRef} className="w-full h-[300px] sm:h-[320px] block" />

          {/* Overlay Status Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Simulated Traffic Density: {currentScale.toLocaleString()} concurrency</span>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-md ${
              currentScale >= 1000000
                ? "bg-amber-950/80 border-amber-600 text-amber-300"
                : "bg-slate-900/90 border-slate-700/80 text-cyan-300"
            }`}>
              {currentScale === 1 ? "Microscopic Load" : currentScale >= 1000000 ? "Massive Planetary Draw" : "Escalating Flux"}
            </div>
          </div>
        </div>

        {/* Real-time Dynamic Footprint Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Total Energy */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Electrical Energy</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalEnergyKWh >= 1000
                ? `${(totalEnergyKWh / 1000).toFixed(2)} MWh`
                : `${totalEnergyKWh.toFixed(3)} kWh`}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Equivalent to {smartphoneCharges.toLocaleString()} smartphone battery charges
            </span>
          </div>

          {/* Carbon Output */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Atmospheric Carbon</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalCarbonKg >= 1000
                ? `${(totalCarbonKg / 1000).toFixed(2)} Tonnes CO₂e`
                : `${totalCarbonKg.toFixed(2)} kg CO₂e`}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Equivalent to driving ~{kmDrivenEquivalent.toLocaleString()} km in a passenger vehicle
            </span>
          </div>

          {/* Cooling Water */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Cooling Water Evaporated</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalWaterLiters >= 1000
                ? `${(totalWaterLiters / 1000).toFixed(2)} m³`
                : `${totalWaterLiters.toFixed(1)} Liters`}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Direct adiabatic and evaporative cooling tower loss
            </span>
          </div>

          {/* Data Transfer */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Payload Transferred</span>
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalDataTB >= 1
                ? `${totalDataTB.toFixed(2)} TB`
                : `${(totalDataTB * 1024).toFixed(1)} GB`}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Light photons routed over subsea & metro fiber
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Callout */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">The Core Insight:</strong> Digital interactions feel weightless because individual packets are measured in fractions of a watt-second. When multiplied by 5.4 billion internet users making tens of thousands of requests daily, digital infrastructure demands hundreds of terawatt-hours of continuous planetary electricity.
        </p>
      </div>
    </div>
  );
};
