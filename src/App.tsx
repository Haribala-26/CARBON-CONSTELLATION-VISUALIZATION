import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Flame,
  Zap,
  Sparkles,
  Layers,
  RotateCcw,
  Search,
  ArrowRight,
  Radio,
  Sliders,
  Play,
  CheckCircle2
} from "lucide-react";
import { Constellation3DCanvas } from "./components/Constellation3DCanvas";
import { ImpactTransformation } from "./components/ImpactTransformation";
import { InfrastructureJourney } from "./components/InfrastructureJourney";
import { WebsiteFocusPanel } from "./components/WebsiteFocusPanel";
import { AIInsightLayer } from "./components/AIInsightLayer";
import { ScenarioControls, PRESET_SCENARIOS } from "./components/ScenarioControls";
import { DataLegend } from "./components/DataLegend";
import { MethodologyDrawer } from "./components/MethodologyDrawer";
import { GuidedExperienceOverlay } from "./components/GuidedExperienceOverlay";
import { GLOBAL_WEBSITES } from "./data/websites";
import { INFRASTRUCTURE_STAGES } from "./data/infrastructureStages";
import { fetchAIInterpretation } from "./services/apiAdapter";
import {
  AIInterpretation,
  SimulationScale,
  SimulationScenario,
  WebsiteData
} from "./types";

export function App() {
  // Active visualization view mode: 'constellation' (3D), 'physical' (grid & cables), 'journey' (packet transmission)
  const [activeView, setActiveView] = useState<"constellation" | "physical" | "journey">("constellation");

  // Global simulation states
  const [websites, setWebsites] = useState<WebsiteData[]>(GLOBAL_WEBSITES);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteData | null>(GLOBAL_WEBSITES[0]);
  const [simulationScale, setSimulationScale] = useState<SimulationScale>(1);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(PRESET_SCENARIOS[0]);
  const [displayMode, setDisplayMode] = useState<"traffic" | "carbon" | "green">("carbon");
  const [isGlobalSimulationActive, setIsGlobalSimulationActive] = useState(false);

  // Guided Living Tour State
  const [isGuidedTourActive, setIsGuidedTourActive] = useState(false);

  // Quick domain input
  const [customInput, setCustomInput] = useState("");
  const [isVisualizingPulse, setIsVisualizingPulse] = useState(false);
  const [pulseCounter, setPulseCounter] = useState(0);

  // AI Interpretation layer state
  const [aiInterpretation, setAiInterpretation] = useState<AIInterpretation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Load AI interpretation for current context
  const triggerAIUpdate = useCallback(async () => {
    setIsLoadingAI(true);
    try {
      const data = await fetchAIInterpretation({
        website: selectedWebsite || undefined,
        scale: simulationScale,
        scenario: activeScenario,
        isPhysicalWorldView: activeView === "physical",
      });
      setAiInterpretation(data);
    } catch (err) {
      console.warn("AI Update notice:", err);
    } finally {
      setIsLoadingAI(false);
    }
  }, [selectedWebsite, simulationScale, activeScenario, activeView]);

  // Debounced auto-update on context change
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerAIUpdate();
    }, 250);
    return () => clearTimeout(timer);
  }, [triggerAIUpdate]);

  // Primary action: Visualize
  const handleVisualize = (domainOrSite?: string | WebsiteData) => {
    setIsVisualizingPulse(true);
    setPulseCounter((prev) => prev + 1);
    setTimeout(() => setIsVisualizingPulse(false), 1200);

    // Switch view to constellation to ensure 3D scene is visible
    setActiveView("constellation");

    if (typeof domainOrSite === "string" && domainOrSite.trim().length > 0) {
      const clean = domainOrSite.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const existing = websites.find(
        (w) =>
          w.domain.toLowerCase().includes(clean) ||
          w.name.toLowerCase().includes(clean) ||
          clean.includes(w.domain.toLowerCase())
      );

      if (existing) {
        setSelectedWebsite(existing);
      } else {
        // Create custom parsed celestial node
        const isLikelyGreen = clean.includes("green") || clean.includes("eco") || clean.includes("wiki") || clean.includes("org");
        const cleanName = clean.split(".")[0].toUpperCase();
        const newSite: WebsiteData = {
          id: `custom-${Date.now()}`,
          name: cleanName,
          domain: clean,
          category: "Cloud & Dev",
          trafficRank: Math.floor(Math.random() * 500) + 50,
          monthlyVisits: 85000000,
          pageWeightMB: +(1.5 + Math.random() * 3.2).toFixed(2),
          carbonPerVisitGrams: +(0.35 + Math.random() * 0.85).toFixed(2),
          energyPerVisitWh: +(0.25 + Math.random() * 0.45).toFixed(2),
          greenHosting: isLikelyGreen,
          hostingProvider: isLikelyGreen ? "Renewable Direct Contract" : "Regional Edge Colocation",
          hostingRegion: "Global CDN Edge",
          gridIntensityGCO2PerKWh: isLikelyGreen ? 65 : 430,
          serverEfficiencyPUE: +(1.15 + Math.random() * 0.22).toFixed(2),
          annualCarbonTonnes: Math.floor(2000 + Math.random() * 7500),
          waterConsumptionMLPerVisit: +(1.2 + Math.random() * 2.2).toFixed(1),
          description: `Custom domain target ${clean} dynamically evaluated across physical subsea transit and data center energy intensity.`,
          keyInfrastructure: ["Subsea Fiber Route", "Regional PoP", "Compute Server Rack"],
          celestialCoordinates: {
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 50,
            z: (Math.random() - 0.5) * 60,
            radius: 10,
            auraColor: isLikelyGreen ? "#10b981" : "#38bdf8",
            orbitSpeed: 0.3,
          },
        };
        setWebsites((prev) => [newSite, ...prev]);
        setSelectedWebsite(newSite);
      }
    } else if (domainOrSite && typeof domainOrSite !== "string") {
      setSelectedWebsite(domainOrSite);
    } else if (!selectedWebsite && websites.length > 0) {
      setSelectedWebsite(websites[0]);
    }
  };

  return (
    <div id="carbon-constellation-app" className="min-h-screen bg-[#040609] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Clean Visualization Control Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          {/* Logo & Identity Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white font-editorial leading-none">
                  CARBON CONSTELLATION
                </h1>
                <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider">
                  The internet feels weightless. It isn&apos;t.
                </p>
              </div>
            </div>

            {/* Guided Tour trigger badge on mobile */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="guided-tour-toggle-btn-mobile"
                onClick={() => setIsGuidedTourActive(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono font-medium"
              >
                <Play className="w-3 h-3 fill-cyan-300 text-cyan-300" />
                <span>Tour</span>
              </button>
            </div>
          </div>

          {/* Visualization Modes */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] sm:text-xs font-mono overflow-x-auto no-scrollbar">
            <button
              id="view-constellation-tab"
              onClick={() => setActiveView("constellation")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === "constellation"
                  ? "bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Constellation</span>
            </button>

            <button
              id="view-physical-tab"
              onClick={() => setActiveView("physical")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === "physical"
                  ? "bg-slate-800 text-rose-300 border border-rose-500/40 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Physical Grid</span>
            </button>

            <button
              id="view-journey-tab"
              onClick={() => setActiveView("journey")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === "journey"
                  ? "bg-slate-800 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Packet Journey</span>
            </button>
          </div>

          {/* Quick Domain Input + Primary "Visualize" Action */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="quick-domain-input"
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVisualize(customInput);
                }}
                placeholder="e.g. youtube.com"
                className="w-full sm:w-48 md:w-52 pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              id="visualize-action-btn"
              onClick={() => handleVisualize(customInput)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md shrink-0 ${
                isVisualizingPulse
                  ? "bg-cyan-400 text-slate-950 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visualize</span>
            </button>

            <button
              id="guided-tour-toggle-btn"
              onClick={() => setIsGuidedTourActive(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-medium transition-all shadow-sm"
              title="Start Living Infrastructure Guided Tour"
            >
              <Play className="w-3 h-3 fill-cyan-300 text-cyan-300" />
              <span>Guided Tour</span>
            </button>

            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hidden sm:block text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Data Spec
            </button>
          </div>
        </div>
      </header>

      {/* Scale & Mode Sub-bar */}
      <div className="w-full bg-slate-950/60 border-b border-slate-900 px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-mono min-w-max">
          {/* Scale Multiplier */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
            <span className="text-slate-400 flex items-center gap-1 text-[10px] sm:text-[11px] shrink-0">
              <Sliders className="w-3 h-3 text-cyan-400" />
              Scale:
            </span>
            {[
              { val: 1 as SimulationScale, label: "1 Visit" },
              { val: 10 as SimulationScale, label: "10x" },
              { val: 1000 as SimulationScale, label: "1K" },
              { val: 1000000 as SimulationScale, label: "1M" },
              { val: 50000000 as SimulationScale, label: "50M" },
              { val: 5400000000 as SimulationScale, label: "5.4B Global" },
            ].map((sc) => (
              <button
                key={sc.val}
                onClick={() => setSimulationScale(sc.val)}
                className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all shrink-0 ${
                  simulationScale === sc.val
                    ? "bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 shrink-0">
            <span className="text-slate-400 text-[10px] sm:text-[11px] mr-1">Presets:</span>
            {GLOBAL_WEBSITES.slice(0, 6).map((site) => (
              <button
                key={site.id}
                onClick={() => handleVisualize(site)}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors whitespace-nowrap ${
                  selectedWebsite?.id === site.id
                    ? "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* VIEW 1: 3D CELESTIAL CONSTELLATION */}
          {activeView === "constellation" && (
            <motion.div
              key="view-constellation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col space-y-4"
            >
              {/* 3D WebGL Canvas */}
              <div className="relative">
                <Constellation3DCanvas
                  websites={websites}
                  selectedWebsite={selectedWebsite}
                  onSelectWebsite={(site) => setSelectedWebsite(site)}
                  displayMode={displayMode}
                  isGlobalSimulationActive={isGlobalSimulationActive}
                  simulationScale={simulationScale}
                  pulseTrigger={pulseCounter}
                />

                {/* Overlaid Mode Filter Pills */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setDisplayMode("carbon")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      displayMode === "carbon" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "text-slate-400"
                    }`}
                  >
                    Carbon Aura
                  </button>
                  <button
                    onClick={() => setDisplayMode("green")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      displayMode === "green" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400"
                    }`}
                  >
                    Renewable %
                  </button>
                  <button
                    onClick={() => setDisplayMode("traffic")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      displayMode === "traffic" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400"
                    }`}
                  >
                    Traffic Size
                  </button>
                </div>
              </div>

              {/* Live Inspected Website HUD & Telemetry */}
              {selectedWebsite && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <WebsiteFocusPanel
                      website={selectedWebsite}
                      simulationScale={simulationScale}
                      onClose={() => setSelectedWebsite(null)}
                      onTriggerAIInterpretation={() => triggerAIUpdate()}
                    />
                  </div>

                  <div className="flex flex-col space-y-4">
                    {/* Scenario What-If Controls */}
                    <ScenarioControls
                      activeScenario={activeScenario}
                      onSelectScenario={(sc) => setActiveScenario(sc)}
                    />

                    {/* AI Physical Telemetry Layer */}
                    <AIInsightLayer
                      interpretation={aiInterpretation}
                      isLoading={isLoadingAI}
                      onRefresh={triggerAIUpdate}
                      targetName={selectedWebsite?.name}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW 2: PHYSICAL WORLD GRID & CABLES */}
          {activeView === "physical" && (
            <motion.div
              key="view-physical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ImpactTransformation
                onReturnToConstellation={() => setActiveView("constellation")}
                onOpenMethodology={() => setIsMethodologyOpen(true)}
              />
            </motion.div>
          )}

          {/* VIEW 3: STEP-BY-STEP PACKET JOURNEY */}
          {activeView === "journey" && (
            <motion.div
              key="view-journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <InfrastructureJourney
                stages={INFRASTRUCTURE_STAGES}
                onCompleteJourney={() => setActiveView("constellation")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Bottom Bar */}
      <footer className="w-full border-t border-slate-900 bg-[#040609] py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <div>
            Sustainable Web Design (SWDv3) &bull; Green Web Foundation &bull; IEA Benchmarks
          </div>
          <div>
            1 visit = 0.2–1.5g CO₂ &bull; Global internet = ~850M tonnes CO₂/yr
          </div>
        </div>
      </footer>

      {/* Methodology Drawer */}
      <MethodologyDrawer
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Guided Living Tour Interactive Player Overlay */}
      <GuidedExperienceOverlay
        isActive={isGuidedTourActive}
        onClose={() => setIsGuidedTourActive(false)}
        websites={websites}
        onSelectWebsite={(site) => setSelectedWebsite(site)}
        onSetScale={(scale) => setSimulationScale(scale)}
        onSetView={(view) => setActiveView(view)}
        onSetScenario={(scenarioId) => {
          const sc = PRESET_SCENARIOS.find((s) => s.id === scenarioId) || PRESET_SCENARIOS[0];
          setActiveScenario(sc);
        }}
        onTriggerVisualizePulse={() => {
          setIsVisualizingPulse(true);
          setPulseCounter((prev) => prev + 1);
          setTimeout(() => setIsVisualizingPulse(false), 1000);
        }}
      />
    </div>
  );
}

export default App;

