export type SceneStep = 1 | 2 | 3 | 4 | 5;

export type SimulationScale = 1 | 10 | 1000 | 1000000 | 50000000 | 5400000000;

export interface WebsiteData {
  id: string;
  domain: string;
  name: string;
  category: "Streaming & Media" | "Search & AI" | "Social & Community" | "E-Commerce" | "Knowledge & Docs" | "Cloud & Dev" | "News & Media";
  trafficRank: number;
  monthlyVisits: number; // estimated monthly visits
  pageWeightMB: number; // average transfer payload
  carbonPerVisitGrams: number; // gCO2e per visit
  energyPerVisitWh: number; // Wh per visit
  greenHosting: boolean;
  hostingProvider: string;
  hostingRegion: string;
  gridIntensityGCO2PerKWh: number;
  serverEfficiencyPUE: number; // Power Usage Effectiveness (e.g. 1.15 to 1.6)
  annualCarbonTonnes: number;
  waterConsumptionMLPerVisit: number; // mL of cooling water per visit
  celestialCoordinates: {
    x: number;
    y: number;
    z: number;
    radius: number; // size in 3D constellation
    orbitSpeed: number;
    auraColor: string;
  };
  keyInfrastructure: string[];
  description: string;
}

export interface InfrastructureStage {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  physicalLocation: string;
  energySharePercent: number; // Percentage of total footprint
  timeMicroseconds: number;
  description: string;
  physicalMechanism: string;
  energyMetric: string;
  carbonMetric: string;
  visualAnchor: string;
  iconName: string;
}

export interface AIInterpretation {
  headline: string;
  insight: string;
  visual_mode: "celestial_orbit" | "physical_grid" | "scale_surge" | "comparative_orbit";
  impact_explanation: string;
  uncertainty_note: string;
  isAiGenerated?: boolean;
}

export interface SimulationScenario {
  id: string;
  name: string;
  label: string;
  description: string;
  renewablePercentage: number; // 0 - 100%
  efficiencyMultiplier: number; // e.g. 0.6 for 40% reduction
  gridCleanlinessFactor: number;
  coolingType: "evaporative" | "liquid_immersion" | "closed_loop_air";
}

export interface ComparisonPair {
  siteA: WebsiteData;
  siteB: WebsiteData;
}
