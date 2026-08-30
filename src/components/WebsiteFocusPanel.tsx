import React from "react";
import { motion } from "motion/react";
import {
  X,
  Zap,
  Flame,
  Droplets,
  Server,
  Globe,
  Radio,
  Leaf,
  Layers,
  Sparkles,
  GitCompare,
  ExternalLink,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { WebsiteData } from "../types";

interface WebsiteFocusPanelProps {
  website: WebsiteData;
  simulationScale?: number;
  onClose: () => void;
  onSelectForComparison?: (site: WebsiteData) => void;
  onTriggerAIInterpretation?: (site: WebsiteData) => void;
}

export const WebsiteFocusPanel: React.FC<WebsiteFocusPanelProps> = ({
  website,
  simulationScale = 1,
  onClose,
  onSelectForComparison,
  onTriggerAIInterpretation,
}) => {
  const scale = simulationScale || 1;
  const scaledCarbonGrams = website.carbonPerVisitGrams * scale;
  const scaledCarbonKg = scaledCarbonGrams / 1000;
  const scaledCarbonTonnes = scaledCarbonKg / 1000;

  const scaledEnergyWh = website.energyPerVisitWh * scale;
  const scaledEnergyKWh = scaledEnergyWh / 1000;

  const scaledWaterML = website.waterConsumptionMLPerVisit * scale;
  const scaledWaterLiters = scaledWaterML / 1000;

  // Format carbon display based on magnitude
  const formatCarbon = () => {
    if (scaledCarbonTonnes >= 1) return `${scaledCarbonTonnes.toLocaleString(undefined, { maximumFractionDigits: 2 })} Tonnes CO₂e`;
    if (scaledCarbonKg >= 1) return `${scaledCarbonKg.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO₂e`;
    return `${scaledCarbonGrams.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e`;
  };

  // Format energy display
  const formatEnergy = () => {
    if (scaledEnergyKWh >= 1000) return `${(scaledEnergyKWh / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} MWh`;
    if (scaledEnergyKWh >= 1) return `${scaledEnergyKWh.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh`;
    return `${scaledEnergyWh.toLocaleString(undefined, { maximumFractionDigits: 2 })} Wh`;
  };

  // Format water display
  const formatWater = () => {
    if (scaledWaterLiters >= 1000) return `${(scaledWaterLiters / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} m³ (kL)`;
    if (scaledWaterLiters >= 1) return `${scaledWaterLiters.toLocaleString(undefined, { maximumFractionDigits: 2 })} Liters`;
    return `${scaledWaterML.toLocaleString(undefined, { maximumFractionDigits: 1 })} mL`;
  };

  // Physical equivalence calculation
  const carKmEquivalent = (scaledCarbonKg / 0.12).toFixed(1);
  const smartphoneCharges = Math.round(scaledEnergyWh / 12);
  const scaleLabel =
    scale === 1
      ? "1 Single Visit"
      : scale === 10
      ? "10 Simultaneous Visits"
      : scale === 1000
      ? "1,000 Page Transfers"
      : scale === 1000000
      ? "1 Million Sessions"
      : scale >= 1000000000
      ? `${(scale / 1e9).toFixed(1)}B Global Users`
      : `${scale.toLocaleString()} Visits`;
  return (
    <motion.div
      id="website-focus-inspector-panel"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl bg-slate-900/95 border border-slate-700/80 p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Top Background Atmospheric Glow */}
      <div className={`absolute top-0 right-0 w-96 h-48 rounded-full blur-[100px] pointer-events-none ${
        website.greenHosting ? "bg-emerald-500/10" : "bg-cyan-500/10"
      }`} />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
            <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
              #{website.trafficRank} Global Rank
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
              {website.category}
            </span>
            {website.greenHosting ? (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Renewable PPA</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded-full">
                <ShieldAlert className="w-3 h-3" />
                <span>Standard Grid Mix</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-editorial tracking-tight">
            {website.name}
          </h3>
          <p className="text-[11px] sm:text-xs font-mono text-slate-400 mt-0.5">
            {website.domain} &bull; Hosted on {website.hostingProvider} ({website.hostingRegion})
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-start">
          {onSelectForComparison && (
            <button
              id="compare-site-btn"
              onClick={() => onSelectForComparison(website)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] sm:text-xs font-mono text-cyan-300 border border-slate-700 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
          )}

          {onTriggerAIInterpretation && (
            <button
              id="ai-interpret-site-btn"
              onClick={() => onTriggerAIInterpretation(website)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-[11px] sm:text-xs font-mono text-cyan-200 border border-cyan-500/40 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Reading</span>
            </button>
          )}

          <button
            id="close-focus-panel-btn"
            onClick={onClose}
            aria-label="Close website focus panel"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scale Context Banner */}
      {scale > 1 && (
        <div className="relative z-10 my-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-300 font-bold">
              Simulation Scaled to: {scaleLabel}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 flex items-center gap-3">
            <span>🚗 Equiv: <strong className="text-white">{carKmEquivalent} km</strong> gas car</span>
            <span>📱 Equiv: <strong className="text-white">{smartphoneCharges.toLocaleString()}</strong> phone charges</span>
          </div>
        </div>
      )}

      {/* Main Quantitative Telemetry Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 transition-all hover:border-cyan-500/30">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Page Payload</span>
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {website.pageWeightMB} MB
          </div>
          <span className="text-[10px] font-mono text-slate-500">Per clean session transfer</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 transition-all hover:border-amber-500/30">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{scale > 1 ? `Energy (${scaleLabel})` : "Energy / Visit"}</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {formatEnergy()}
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {scale > 1 ? `Base: ${website.energyPerVisitWh} Wh/visit` : `PUE factor ${website.serverEfficiencyPUE}`}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 transition-all hover:border-rose-500/30">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{scale > 1 ? `Carbon (${scaleLabel})` : "Carbon / Visit"}</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-300 mt-1">
            {formatCarbon()}
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {scale > 1 ? `Base: ${website.carbonPerVisitGrams} gCO₂e/visit` : `Grid: ${website.gridIntensityGCO2PerKWh} g/kWh`}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 transition-all hover:border-blue-500/30">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>{scale > 1 ? `Cooling Water (${scaleLabel})` : "Cooling Water"}</span>
          </div>
          <div className="text-xl font-bold font-mono text-blue-300 mt-1">
            {formatWater()}
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {scale > 1 ? `Base: ${website.waterConsumptionMLPerVisit} mL/visit` : "Direct evaporative loss"}
          </span>
        </div>
      </div>

      {/* Deep Physical Infrastructure Stack Breakdown */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        <div className="lg:col-span-7 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Physical Infrastructure Pathways</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {website.keyInfrastructure.map((infra, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-xs text-slate-300 font-mono flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{infra}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Annual Planetary Accumulation
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ~{website.annualCarbonTonnes.toLocaleString()} Tonnes CO₂e
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Based on ~{(website.monthlyVisits / 1e9).toFixed(2)}B monthly user sessions. {website.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
