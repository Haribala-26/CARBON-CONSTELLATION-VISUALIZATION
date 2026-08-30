import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BrainCircuit, RefreshCw, AlertCircle, Info } from "lucide-react";
import { AIInterpretation } from "../types";

interface AIInsightLayerProps {
  interpretation: AIInterpretation | null;
  isLoading: boolean;
  onRefresh: () => void;
  targetName?: string;
}

export const AIInsightLayer: React.FC<AIInsightLayerProps> = ({
  interpretation,
  isLoading,
  onRefresh,
  targetName,
}) => {
  if (!interpretation && !isLoading) return null;

  return (
    <motion.div
      id="ai-climate-insight-layer"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-cyan-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.15)] relative overflow-hidden"
    >
      {/* Subtle glowing ambient pulse */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">
                AI Interpretation Layer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {interpretation?.isAiGenerated ? "Gemini 3.7 Flash Model" : "Climate Intelligence Model"}
              </span>
            </div>
            {targetName && (
              <span className="text-[11px] font-mono text-slate-400">
                Evaluating: {targetName}
              </span>
            )}
          </div>
        </div>

        <button
          id="refresh-ai-insight-btn"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-40 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          <span>{isLoading ? "Synthesizing..." : "Re-evaluate"}</span>
        </button>
      </div>

      {/* Main Narrative Body */}
      <div className="relative z-10 mt-4 space-y-3">
        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-slate-400 animate-pulse">
              Synthesizing infrastructure telemetry into scientific narrative...
            </span>
          </div>
        ) : (
          interpretation && (
            <>
              <h4 className="text-lg sm:text-xl font-semibold text-white font-editorial tracking-tight">
                {interpretation.headline}
              </h4>

              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {interpretation.insight}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed">
                <span className="text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
                  Physical Mechanism & Transmission:
                </span>
                {interpretation.impact_explanation}
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{interpretation.uncertainty_note}</span>
              </div>
            </>
          )
        )}
      </div>
    </motion.div>
  );
};
