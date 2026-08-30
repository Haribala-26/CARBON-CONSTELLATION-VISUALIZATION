import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, ExternalLink, ShieldCheck, Scale, Database, Zap } from "lucide-react";

interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyDrawer: React.FC<MethodologyDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="methodology-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-700 p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white font-editorial">
                  Scientific Methodology & Data Models
                </h3>
              </div>
              <button
                id="close-methodology-btn"
                onClick={onClose}
                aria-label="Close methodology drawer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="mt-6 space-y-6 text-sm text-slate-300">
              {/* Section 1: SWD Model */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold font-mono text-xs uppercase mb-2">
                  <Scale className="w-4 h-4" />
                  <span>1. Sustainable Web Design Model (SWDv3)</span>
                </div>
                <p className="leading-relaxed mb-3">
                  Our calculations utilize the internationally recognized <strong>SWD Version 3</strong> carbon estimation standard. It segments digital energy into four distinct infrastructural boundaries:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 mb-3">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-200 block font-semibold">User Device: 34%</span>
                    Screen light & local CPU computation
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-200 block font-semibold">Network & Transit: 28%</span>
                    Cell towers, metro fiber & subsea lasers
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-200 block font-semibold">Data Centers: 18%</span>
                    Server blade compute & database queries
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-200 block font-semibold">Cooling & Facilities: 12%</span>
                    Chillers, pumps & adiabatic evaporation
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 font-mono-code text-xs text-cyan-300">
                  Energy per Transfer (kWh) = Data (GB) × 0.19 kWh/GB × PUE factor
                </div>
              </div>

              {/* Section 2: The Green Web Foundation */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-xs uppercase mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. Renewable Energy Verification</span>
                </div>
                <p className="leading-relaxed">
                  Renewable hosting flags and power purchase agreements (PPAs) are structured via <strong>The Green Web Foundation</strong> open dataset. Platforms verified with direct 100% renewable power contracts receive distinct emerald celestial auras.
                </p>
              </div>

              {/* Section 3: Regional Grid Carbon Intensity */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold font-mono text-xs uppercase mb-2">
                  <Zap className="w-4 h-4" />
                  <span>3. Grid Carbon Intensity Coefficients</span>
                </div>
                <p className="leading-relaxed">
                  Regional grid carbon factors range from <strong>45 gCO₂e/kWh</strong> (dedicated solar/wind in Sweden or Iceland) to <strong>442 gCO₂e/kWh</strong> (global average grid mix) up to <strong>700+ gCO₂e/kWh</strong> (coal-heavy regions).
                </p>
              </div>

              {/* Section 4: Data Adapters */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 font-semibold font-mono text-xs uppercase mb-2">
                  <Database className="w-4 h-4" />
                  <span>4. Extensible Adapter Architecture</span>
                </div>
                <p className="leading-relaxed">
                  The frontend architecture is decoupled from static mocks through clean adapter functions (<code>lookupCustomDomain</code>, <code>fetchAIInterpretation</code>). Real-world APIs (Green Web API, Cloudflare Radar, HTTPArchive) can be plugged directly without modifying UI rendering logic.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>CARBON CONSTELLATION &bull; Hackathon Edition</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close Documentation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
