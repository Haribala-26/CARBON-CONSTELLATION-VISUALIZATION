import React, { useState } from "react";
import { Search, Filter, Leaf, Zap, Sparkles, Plus, Loader2 } from "lucide-react";
import { CATEGORIES } from "../data/websites";
import { lookupCustomDomain } from "../services/apiAdapter";
import { WebsiteData } from "../types";

interface WebsiteSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onlyGreen: boolean;
  onOnlyGreenToggle: (val: boolean) => void;
  onAddCustomWebsite?: (site: WebsiteData) => void;
}

export const WebsiteSearch: React.FC<WebsiteSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onlyGreen,
  onOnlyGreenToggle,
  onAddCustomWebsite,
}) => {
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [isAnalyzingDomain, setIsAnalyzingDomain] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleCustomDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim()) return;

    setIsAnalyzingDomain(true);
    setAnalysisError(null);

    const cleanDomain = customDomainInput
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .toLowerCase()
      .trim();

    try {
      const data = await lookupCustomDomain(cleanDomain);
      if (data && onAddCustomWebsite) {
        const newSite: WebsiteData = {
          id: `custom-${cleanDomain.replace(/[^a-z0-9]/g, "-")}`,
          domain: cleanDomain,
          name: data.name || cleanDomain,
          category: "Knowledge & Docs",
          trafficRank: 999,
          monthlyVisits: 10000000,
          pageWeightMB: data.pageWeightMB || 2.1,
          carbonPerVisitGrams: data.carbonPerVisitGrams || 0.45,
          energyPerVisitWh: data.energyPerVisitWh || 0.95,
          greenHosting: Boolean(data.greenHosting),
          hostingProvider: data.hostingProvider || "Cloud Infrastructure",
          hostingRegion: "Global Edge Network",
          gridIntensityGCO2PerKWh: data.gridIntensityGCO2PerKWh || 380,
          serverEfficiencyPUE: data.serverEfficiencyPUE || 1.2,
          annualCarbonTonnes: data.annualCarbonTonnes || 450,
          waterConsumptionMLPerVisit: data.waterConsumptionMLPerVisit || 4.2,
          celestialCoordinates: {
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 50,
            z: (Math.random() - 0.5) * 40,
            radius: 8,
            orbitSpeed: 0.25,
            auraColor: data.greenHosting ? "#10b981" : "#38bdf8",
          },
          keyInfrastructure: [
            "Real-time lookup via Green Web Foundation adapter",
            "Sustainable Web Design v3 payload estimation",
            "CDN Edge Caching node",
          ],
          description: `Custom evaluated domain analyzed via live API adapter. Page weight estimate: ${data.pageWeightMB} MB.`,
        };

        onAddCustomWebsite(newSite);
        setCustomDomainInput("");
      } else {
        setAnalysisError("Unable to evaluate domain metrics.");
      }
    } catch (err) {
      setAnalysisError("Evaluation failed. Check connectivity.");
    } finally {
      setIsAnalyzingDomain(false);
    }
  };

  return (
    <div id="website-search-controls" className="w-full space-y-4">
      {/* Top Search & Custom URL Live Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Constellation Search Filter */}
        <div className="lg:col-span-7 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="constellation-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search celestial bodies (e.g. YouTube, Wikipedia, Netflix, OpenAI)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Live Domain Inspector Engine */}
        <div className="lg:col-span-5">
          <form onSubmit={handleCustomDomainSubmit} className="relative flex items-center">
            <input
              id="custom-domain-analyzer-input"
              type="text"
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              placeholder="Analyze any domain (e.g. mit.edu)"
              className="w-full pl-3 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800/90 focus:border-emerald-500 text-xs font-mono text-emerald-300 placeholder:text-slate-500 focus:outline-none transition-colors"
            />
            <button
              id="analyze-domain-submit-btn"
              type="submit"
              disabled={isAnalyzingDomain || !customDomainInput.trim()}
              className="absolute right-1 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              {isAnalyzingDomain ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Scanning</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>Add Star</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {analysisError && (
        <div className="text-xs font-mono text-rose-400 px-1">{analysisError}</div>
      )}

      {/* Category Filter Pills & Green Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 100% Green Verification Toggle */}
        <button
          id="green-verification-filter-btn"
          onClick={() => onOnlyGreenToggle(!onlyGreen)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-all border ${
            onlyGreen
              ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-emerald-900/50 hover:text-slate-300"
          }`}
        >
          <Leaf className={`w-3 h-3 ${onlyGreen ? "text-emerald-400" : "text-slate-400"}`} />
          <span>Green-Certified Only</span>
        </button>
      </div>
    </div>
  );
};
