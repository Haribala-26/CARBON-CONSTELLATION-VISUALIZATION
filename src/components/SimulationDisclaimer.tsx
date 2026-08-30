import React from "react";
import { AlertTriangle, Info } from "lucide-react";

export const SimulationDisclaimer: React.FC = () => {
  return (
    <div id="simulation-disclaimer-bar" className="w-full py-3 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 gap-3">
      <div className="flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          <strong>Scientific Disclaimer:</strong> Calculations represent empirical estimates derived from the Sustainable Web Design (SWDv3) model and Green Web Foundation verification. Real-world physical impact varies based on client hardware caching, content delivery network routing, and regional hourly grid carbon intensity.
        </span>
      </div>
    </div>
  );
};
