import React from "react";
import { Sliders, Sun, Zap, Cpu, Sparkles, RefreshCw } from "lucide-react";
import { SimulationScenario } from "../types";

export const PRESET_SCENARIOS: SimulationScenario[] = [
  {
    id: "baseline",
    name: "Current Web Reality",
    label: "Baseline",
    description: "Current global grid mix (~436 gCO₂e/kWh) with standard video/script bloat.",
    renewablePercentage: 35,
    efficiencyMultiplier: 1.0,
    gridCleanlinessFactor: 1.0,
    coolingType: "evaporative",
  },
  {
    id: "carbon_free_grid",
    name: "24/7 Carbon-Free Energy",
    label: "100% Renewable",
    description: "Every data center and transmission node powered by real-time matched solar, wind & hydro PPAs.",
    renewablePercentage: 100,
    efficiencyMultiplier: 0.2,
    gridCleanlinessFactor: 0.15,
    coolingType: "closed_loop_air",
  },
  {
    id: "lightweight_minimalist",
    name: "Payload Optimization (-50%)",
    label: "Clean Code",
    description: "Removing heavyweight tracking scripts, modern AVIF/AV1 compression, strict edge caching.",
    renewablePercentage: 35,
    efficiencyMultiplier: 0.5,
    gridCleanlinessFactor: 0.5,
    coolingType: "evaporative",
  },
  {
    id: "ai_inference_surge",
    name: "Heavy AI Autoregressive Surge",
    label: "AI Surge",
    description: "Simulating generative AI transformer models embedded across every user click & query (5x GPU compute power).",
    renewablePercentage: 35,
    efficiencyMultiplier: 3.5,
    gridCleanlinessFactor: 3.0,
    coolingType: "liquid_immersion",
  },
];

interface ScenarioControlsProps {
  activeScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  activeScenario,
  onSelectScenario,
}) => {
  return (
    <div id="scenario-controls-panel" className="w-full rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 sm:p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
            Planetary What-If Scenarios
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Simulate infrastructural shifts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESET_SCENARIOS.map((sc) => {
          const isSelected = activeScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              id={`scenario-btn-${sc.id}`}
              onClick={() => onSelectScenario(sc)}
              className={`p-3 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div>
                <div className={`text-xs font-semibold font-mono ${isSelected ? "text-cyan-300" : "text-slate-200"}`}>
                  {sc.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {sc.description}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Impact Factor:</span>
                <span className={`font-bold ${
                  sc.efficiencyMultiplier < 1
                    ? "text-emerald-400"
                    : sc.efficiencyMultiplier > 1
                    ? "text-rose-400"
                    : "text-slate-300"
                }`}>
                  {sc.efficiencyMultiplier}x
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
