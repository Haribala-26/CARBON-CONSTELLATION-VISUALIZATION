import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Flame,
  Layers,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Activity,
  Zap,
  Leaf,
  Sliders,
  GitCompare
} from "lucide-react";
import { Constellation3DCanvas } from "./Constellation3DCanvas";
import { WebsiteSearch } from "./WebsiteSearch";
import { WebsiteFocusPanel } from "./WebsiteFocusPanel";
import { AIInsightLayer } from "./AIInsightLayer";
import { ScenarioControls } from "./ScenarioControls";
import { DataLegend } from "./DataLegend";
import { ComparisonView } from "./ComparisonView";
import { AIInterpretation, SimulationScale, SimulationScenario, WebsiteData } from "../types";

interface CarbonConstellationProps {
  websites: WebsiteData[];
  selectedWebsite: WebsiteData | null;
  onSelectWebsite: (site: WebsiteData | null) => void;
  simulationScale: SimulationScale;
  activeScenario: SimulationScenario;
  onSelectScenario: (sc: SimulationScenario) => void;
  onTransformToPhysical: () => void;
  aiInterpretation: AIInterpretation | null;
  isLoadingAI: boolean;
  onRefreshAI: () => void;
  onAddCustomWebsite: (site: WebsiteData) => void;
}

export const CarbonConstellation: React.FC<CarbonConstellationProps> = ({
  websites,
  selectedWebsite,
  onSelectWebsite,
  simulationScale,
  activeScenario,
  onSelectScenario,
  onTransformToPhysical,
  aiInterpretation,
  isLoadingAI,
  onRefreshAI,
  onAddCustomWebsite,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Sectors");
  const [onlyGreen, setOnlyGreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<"traffic" | "carbon" | "green">("traffic");
  const [isGlobalSimulationActive, setIsGlobalSimulationActive] = useState(false);
  const [comparisonTarget, setComparisonTarget] = useState<WebsiteData | null>(null);

  // Filtered websites
  const filteredWebsites = useMemo(() => {
    return websites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "All Sectors" || site.category === selectedCategory;
      const matchesGreen = !onlyGreen || site.greenHosting;
      return matchesSearch && matchesCat && matchesGreen;
    });
  }, [websites, searchQuery, selectedCategory, onlyGreen]);

  return (
    <div id="carbon-constellation-scene" className="relative w-full min-h-[90vh] py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col space-y-8">
      {/* Top Header & Physical Transformation Wow Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Scene 04 &bull; Signature Constellation Universe
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white font-editorial mt-1">
            The Living Night Sky of Digital Activity
          </h2>
        </div>

        {/* WOW MOMENT BUTTON */}
        <button
          id="show-physical-world-btn"
          onClick={onTransformToPhysical}
          className="relative group overflow-hidden flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_35px_rgba(244,63,94,0.4)]"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
          <span>Show What The Internet Does To The Physical World</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search, Filter & Live Domain Scanner Bar */}
      <WebsiteSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onlyGreen={onlyGreen}
        onOnlyGreenToggle={setOnlyGreen}
        onAddCustomWebsite={onAddCustomWebsite}
      />

      {/* Universe Viewport Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            id="view-mode-traffic"
            onClick={() => setDisplayMode("traffic")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              displayMode === "traffic"
                ? "bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Traffic Mass
          </button>
          <button
            id="view-mode-carbon"
            onClick={() => setDisplayMode("carbon")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              displayMode === "carbon"
                ? "bg-slate-800 text-rose-300 border border-rose-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Carbon Auras
          </button>
          <button
            id="view-mode-green"
            onClick={() => setDisplayMode("green")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              displayMode === "green"
                ? "bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Renewable Verification
          </button>
        </div>

        <button
          id="global-simulation-toggle"
          onClick={() => setIsGlobalSimulationActive(!isGlobalSimulationActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
            isGlobalSimulationActive
              ? "bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              : "bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${isGlobalSimulationActive ? "text-cyan-400 animate-spin" : "text-slate-400"}`} />
          <span>{isGlobalSimulationActive ? "Global Flux Active" : "Simulate Global Activity"}</span>
        </button>
      </div>

      {/* The 3D Constellation Canvas */}
      <Constellation3DCanvas
        websites={filteredWebsites}
        selectedWebsite={selectedWebsite}
        comparisonWebsite={comparisonTarget}
        onSelectWebsite={(site) => onSelectWebsite(site)}
        displayMode={displayMode}
        isGlobalSimulationActive={isGlobalSimulationActive}
      />

      {/* Visual Legend */}
      <DataLegend />

      {/* Active Website Deep Inspection Focus Panel */}
      <AnimatePresence>
        {selectedWebsite && (
          <WebsiteFocusPanel
            website={selectedWebsite}
            onClose={() => onSelectWebsite(null)}
            onSelectForComparison={(site) => {
              // Pick another site to compare
              const other = websites.find((w) => w.id !== site.id) || null;
              setComparisonTarget(other);
            }}
            onTriggerAIInterpretation={() => onRefreshAI()}
          />
        )}
      </AnimatePresence>

      {/* Side-by-side Comparative View if active */}
      <AnimatePresence>
        {selectedWebsite && comparisonTarget && (
          <ComparisonView
            siteA={selectedWebsite}
            siteB={comparisonTarget}
            onClose={() => setComparisonTarget(null)}
            onSelectSite={(site) => onSelectWebsite(site)}
          />
        )}
      </AnimatePresence>

      {/* AI Climate Insight Layer */}
      <AIInsightLayer
        interpretation={aiInterpretation}
        isLoading={isLoadingAI}
        onRefresh={onRefreshAI}
        targetName={selectedWebsite?.name || "Global Digital Infrastructure"}
      />

      {/* Scenario Controls */}
      <ScenarioControls
        activeScenario={activeScenario}
        onSelectScenario={onSelectScenario}
      />
    </div>
  );
};
