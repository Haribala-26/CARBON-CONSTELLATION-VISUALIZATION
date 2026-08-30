import React from "react";
import { Info, Disc, Orbit, ShieldCheck, Share2 } from "lucide-react";

export const DataLegend: React.FC = () => {
  return (
    <div id="data-legend-widget" className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
      <div className="flex items-center gap-2 mb-2.5 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
        <Info className="w-3.5 h-3.5 text-cyan-400" />
        <span>Constellation Visual Encoding Metaphor</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] shrink-0" />
          <span><strong>Object Radius:</strong> Traffic Volume</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-dashed border-cyan-400 shrink-0" />
          <span><strong>Orbital Ring:</strong> Page Payload (MB)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] shrink-0" />
          <span><strong>Emerald Aura:</strong> 100% Green PPA</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] shrink-0" />
          <span><strong>Amber/Red Core:</strong> High Grid Carbon</span>
        </div>
      </div>
    </div>
  );
};
