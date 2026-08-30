import React from "react";
import { motion } from "motion/react";
import { X, GitCompare, Zap, Flame, Droplets, Radio, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { WebsiteData } from "../types";

interface ComparisonViewProps {
  siteA: WebsiteData;
  siteB: WebsiteData;
  onClose: () => void;
  onSelectSite: (site: WebsiteData) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  siteA,
  siteB,
  onClose,
  onSelectSite,
}) => {
  const energyRatio = (siteA.energyPerVisitWh / siteB.energyPerVisitWh).toFixed(1);
  const carbonRatio = (siteA.carbonPerVisitGrams / siteB.carbonPerVisitGrams).toFixed(1);

  return (
    <motion.div
      id="comparison-orbital-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full rounded-2xl bg-slate-900/95 border border-cyan-500/40 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden my-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white font-editorial">
            Comparative Orbital Analysis
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Site A Card */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400">#{siteA.trafficRank} Global</span>
              {siteA.greenHosting ? (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  100% Green
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                  Grid Mix
                </span>
              )}
            </div>
            <h4 className="text-2xl font-bold text-white font-editorial">{siteA.name}</h4>
            <p className="text-xs font-mono text-slate-400 mt-1">{siteA.domain}</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Payload</span>
                <span className="text-slate-200 font-bold">{siteA.pageWeightMB} MB</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Carbon / Visit</span>
                <span className="text-slate-200 font-bold">{siteA.carbonPerVisitGrams} gCO₂e</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Energy / Visit</span>
                <span className="text-slate-200 font-bold">{siteA.energyPerVisitWh} Wh</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cooling Water</span>
                <span className="text-slate-200 font-bold">{siteA.waterConsumptionMLPerVisit} mL</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectSite(siteA)}
            className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 transition-colors"
          >
            Focus {siteA.name}
          </button>
        </div>

        {/* Site B Card */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400">#{siteB.trafficRank} Global</span>
              {siteB.greenHosting ? (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  100% Green
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                  Grid Mix
                </span>
              )}
            </div>
            <h4 className="text-2xl font-bold text-white font-editorial">{siteB.name}</h4>
            <p className="text-xs font-mono text-slate-400 mt-1">{siteB.domain}</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Payload</span>
                <span className="text-slate-200 font-bold">{siteB.pageWeightMB} MB</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Carbon / Visit</span>
                <span className="text-slate-200 font-bold">{siteB.carbonPerVisitGrams} gCO₂e</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Energy / Visit</span>
                <span className="text-slate-200 font-bold">{siteB.energyPerVisitWh} Wh</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cooling Water</span>
                <span className="text-slate-200 font-bold">{siteB.waterConsumptionMLPerVisit} mL</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectSite(siteB)}
            className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 transition-colors"
          >
            Focus {siteB.name}
          </button>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
        <span>
          <strong>Structural Variance:</strong> {siteA.name} demands approximately{" "}
          <strong className="text-cyan-300">{energyRatio}x</strong> the electrical energy and produces{" "}
          <strong className="text-rose-300">{carbonRatio}x</strong> the carbon footprint per visit compared to {siteB.name}.
        </span>
      </div>
    </motion.div>
  );
};
