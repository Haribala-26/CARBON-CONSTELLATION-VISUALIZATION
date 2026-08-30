import { AIInterpretation, SimulationScenario, WebsiteData } from "../types";
import { GLOBAL_WEBSITES } from "../data/websites";

export interface InterpretParams {
  website?: WebsiteData | null;
  simulationScale?: number;
  scale?: number;
  scenario?: SimulationScenario;
  comparisonTarget?: WebsiteData | null;
  isPhysicalWorldView?: boolean;
}

// Client-side cache for rapid UI toggling
const clientCache = new Map<string, AIInterpretation>();
const inFlightRequests = new Map<string, Promise<AIInterpretation>>();

export async function fetchAIInterpretation(params: InterpretParams): Promise<AIInterpretation> {
  const targetSite = params.website || GLOBAL_WEBSITES[0];
  const activeScale = params.simulationScale || params.scale || 1;
  const cacheKey = `${targetSite.domain}_${activeScale}_${params.scenario?.name || "base"}_${params.isPhysicalWorldView ? "1" : "0"}`;

  // Instant response from client memory if available
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }

  // Deduplicate identical in-flight requests
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: targetSite.domain,
          name: targetSite.name,
          category: targetSite.category,
          trafficRank: targetSite.trafficRank,
          monthlyVisits: targetSite.monthlyVisits,
          pageWeightMB: targetSite.pageWeightMB,
          greenHosting: targetSite.greenHosting,
          carbonPerVisitGrams: targetSite.carbonPerVisitGrams,
          gridIntensityGCO2PerKWh: targetSite.gridIntensityGCO2PerKWh,
          simulationScale: activeScale,
          scenario: params.scenario
            ? {
                name: params.scenario.name,
                multiplier: params.scenario.efficiencyMultiplier,
                renewablePercentage: params.scenario.renewablePercentage,
              }
            : undefined,
          comparisonTarget: params.comparisonTarget
            ? {
                name: params.comparisonTarget.name,
                pageWeightMB: params.comparisonTarget.pageWeightMB,
                greenHosting: params.comparisonTarget.greenHosting,
              }
            : undefined,
          isPhysicalWorldView: params.isPhysicalWorldView,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      clientCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.warn("Using scientific client fallback for AI interpretation:", error);
      // Scientifically rigorous fallback interpretation
      const scaleFormatted =
        activeScale === 1
          ? "1 single interaction"
          : activeScale === 10
          ? "10 simultaneous requests"
          : activeScale === 1000
          ? "1,000 page transfers"
          : activeScale === 1000000
          ? "1 million sessions"
          : "global concurrent planetary demand";

      const totalCarbonKg = (
        (targetSite.carbonPerVisitGrams * activeScale) /
        1000
      ).toFixed(2);

      const fallback: AIInterpretation = {
        headline: params.isPhysicalWorldView
          ? `Physical Grid Consequence of ${targetSite.name}`
          : `Scale Analysis: ${targetSite.name} at ${scaleFormatted}`,
        insight: params.isPhysicalWorldView
          ? `Digital activity translates directly into active electrical grid draws, industrial data center cooling water evaporation, and thermal heat release.`
          : `At a scale of ${scaleFormatted}, ${targetSite.name} accounts for an estimated ${totalCarbonKg} kg CO₂e across device silicon, optical transmission rings, and compute clusters.`,
        visual_mode: params.isPhysicalWorldView ? "physical_grid" : "celestial_orbit",
        impact_explanation: targetSite.greenHosting
          ? `With renewable-backed hosting, operational compute emissions are substantially neutralized, though transmission networks and end-user screens still draw local power.`
          : `Relying on standard grid mixes means peak traffic bursts trigger fossil-supplemented regional power generation and cooling tower heat dissipation.`,
        uncertainty_note:
          "Estimates based on the Sustainable Web Design (SWDv3) framework. Real-world cache ratios and device silicon efficiency introduce a ±20% variance.",
        isAiGenerated: false,
      };

      clientCache.set(cacheKey, fallback);
      return fallback;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export async function lookupCustomDomain(domain: string): Promise<Partial<WebsiteData> | null> {
  try {
    const res = await fetch(`/api/website-lookup?domain=${encodeURIComponent(domain)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      domain: data.domain,
      name: data.domain.replace(/\.[a-z]+$/, "").toUpperCase(),
      greenHosting: data.greenHosting,
      hostingProvider: data.hostProvider,
      pageWeightMB: data.pageWeightMB,
      carbonPerVisitGrams: data.carbonPerVisitGrams,
      energyPerVisitWh: Number((data.kwhPerVisit * 1000).toFixed(3)),
      gridIntensityGCO2PerKWh: data.greenHosting ? 80 : 380,
      serverEfficiencyPUE: data.greenHosting ? 1.12 : 1.35,
      waterConsumptionMLPerVisit: data.pageWeightMB * 2.2,
      annualCarbonTonnes: Math.round(data.carbonPerVisitGrams * 500000),
    };
  } catch (err) {
    console.error("Custom domain lookup error:", err);
    return null;
  }
}
