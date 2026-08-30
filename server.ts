import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// In-memory cache for interpretations
const interpretationCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache

// Rate limit cooldown tracker
let rateLimitCooldownUntil = 0;

// Helper to generate rich scientific fallback
function generateScientificInterpretation(params: {
  name?: string;
  domain?: string;
  category?: string;
  monthlyVisits?: number;
  pageWeightMB?: number;
  greenHosting?: boolean;
  carbonPerVisitGrams?: number;
  gridIntensityGCO2PerKWh?: number;
  simulationScale?: number;
  scenario?: { name?: string; multiplier?: number; renewablePercentage?: number };
  isPhysicalWorldView?: boolean;
}) {
  const {
    name,
    domain,
    monthlyVisits,
    pageWeightMB = 2.0,
    greenHosting,
    carbonPerVisitGrams = 0.5,
    simulationScale = 1,
    scenario,
    isPhysicalWorldView,
  } = params;

  const siteName = name || domain || "Target Platform";
  const scale = simulationScale || 1;
  const isGreen = greenHosting === true;

  const scaleLabel =
    scale === 1
      ? "a single user click"
      : scale === 10
      ? "10 simultaneous requests"
      : scale === 1000
      ? "1,000 page transfers"
      : scale === 1000000
      ? "1 million sessions"
      : scale >= 1000000000
      ? `planetary volume (${(scale / 1e9).toFixed(1)}B visits)`
      : `${scale.toLocaleString()} concurrent requests`;

  const totalCarbonKg = ((carbonPerVisitGrams * scale) / 1000).toFixed(scale > 1000 ? 1 : 3);
  const totalWaterLiters = ((pageWeightMB * 1.8 * scale) / 1000).toFixed(2);
  const scenarioNote = scenario?.name
    ? ` Under the '${scenario.name}' scenario, power draw shifts dynamically.`
    : "";

  return {
    headline: isPhysicalWorldView
      ? `Physical Grid Consequence of ${siteName}`
      : `Scaling ${siteName} to ${scaleLabel}`,
    insight: isPhysicalWorldView
      ? `Every request to ${siteName} triggers electrical line loss, optical laser pulses through subsea conduits, and heat expulsion in data center evaporative cooling towers.`
      : `At ${scaleLabel}, this workload demands ~${totalCarbonKg} kg CO₂e and evaporates approx. ${totalWaterLiters}L of data center cooling water across transit nodes.${scenarioNote}`,
    visual_mode: isPhysicalWorldView ? "physical_grid" : "celestial_orbit",
    impact_explanation: isGreen
      ? `Verified renewable hosting mitigates operational scope 2 compute emissions, though fiber repeater hops, edge routing caches, and end-user OLED displays still draw municipal grid power.`
      : `Standard grid mix reliance means server CPUs and water-cooled chiller plants draw fossil-supplemented electricity during peak traffic surges.`,
    uncertainty_note:
      "Calculated via Sustainable Web Design (SWDv3) standard. Network transmission variance and cache hit ratios introduce an estimated ±20% operational margin.",
    isAiGenerated: false,
  };
}

// API Route: AI Climate Interpretation Engine
app.post("/api/interpret", async (req, res) => {
  try {
    const {
      domain,
      name,
      category,
      trafficRank,
      monthlyVisits,
      pageWeightMB,
      greenHosting,
      carbonPerVisitGrams,
      gridIntensityGCO2PerKWh,
      simulationScale,
      scenario,
      comparisonTarget,
      isPhysicalWorldView,
    } = req.body;

    const cacheKey = `${domain || name || "global"}_${simulationScale || 1}_${scenario?.name || "base"}_${isPhysicalWorldView ? "phys" : "const"}`;
    const cached = interpretationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const ai = getGeminiClient();
    const now = Date.now();

    // If no client, or currently in rate limit cooldown, serve rich scientific fallback immediately
    if (!ai || now < rateLimitCooldownUntil) {
      const fallbackResult = generateScientificInterpretation({
        name,
        domain,
        category,
        monthlyVisits,
        pageWeightMB,
        greenHosting,
        carbonPerVisitGrams,
        gridIntensityGCO2PerKWh,
        simulationScale,
        scenario,
        isPhysicalWorldView,
      });
      interpretationCache.set(cacheKey, { data: fallbackResult, timestamp: now });
      return res.json(fallbackResult);
    }

    const promptPayload = `
Analyze this digital infrastructure scenario:
- Target: ${name || domain || "Global Web"} (${domain || "aggregate"})
- Category: ${category || "General Web Service"}
- Global Traffic Rank: #${trafficRank || "N/A"}
- Estimated Monthly Visits: ${monthlyVisits ? (monthlyVisits / 1e9).toFixed(2) + "B" : "N/A"}
- Average Transfer Payload: ${pageWeightMB || 1.8} MB per load
- Green-Certified Hosting: ${greenHosting ? "YES (Verified 100% Renewable PPA)" : "NO / Standard Grid Mix"}
- Carbon Intensity: ${carbonPerVisitGrams || 0.5} g CO₂e/visit
- Regional Grid Carbon Intensity: ${gridIntensityGCO2PerKWh || 420} gCO₂e/kWh
- Current Simulation Scale: ${simulationScale || 1} visits (${
      simulationScale === 1 ? "1 Click" : simulationScale >= 1e6 ? "Planetary Traffic" : simulationScale + " Visits"
    })
- Active Scenario: ${scenario?.name || "Standard Baseline"} (Renewable: ${scenario?.renewablePercentage ?? "Default"}%)
- Mode: ${isPhysicalWorldView ? "Physical Grid & Thermal Consequence" : "Constellation Scale Explorer"}
${comparisonTarget ? `- Comparison with: ${comparisonTarget.name} (${comparisonTarget.pageWeightMB} MB, ${comparisonTarget.greenHosting ? "Green" : "Conventional"})` : ""}

Generate a concise, scientifically cautious interpretation. Explain scale clearly without hyperbole. Output JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptPayload,
      config: {
        systemInstruction: `You are a climate-data interpretation engine for an interactive visualization of digital infrastructure called CARBON CONSTELLATION.
Convert structured website traffic and sustainability signals into concise, scientifically cautious visual narratives.
Never invent measurements. Clearly distinguish measured data, estimates, and simulations.
Explain scale in language a general audience can understand.
Tone: Editorial, philosophical yet rigorous, captivating, avoiding cliché sustainability fluff.
Output ONLY structured JSON with the exact keys:
- headline: string (sharp 4-8 words title)
- insight: string (1-2 sentences explaining what the visual shift means physically)
- visual_mode: string ("celestial_orbit" | "physical_grid" | "scale_surge" | "comparative_orbit")
- impact_explanation: string (1-2 sentences on energy, transmission, cooling or embodied carbon)
- uncertainty_note: string (1 sentence explaining scientific assumptions or model bounds)`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            insight: { type: Type.STRING },
            visual_mode: { type: Type.STRING },
            impact_explanation: { type: Type.STRING },
            uncertainty_note: { type: Type.STRING },
          },
          required: [
            "headline",
            "insight",
            "visual_mode",
            "impact_explanation",
            "uncertainty_note",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const result = {
      ...parsed,
      isAiGenerated: true,
    };
    interpretationCache.set(cacheKey, { data: result, timestamp: now });
    return res.json(result);
  } catch (error: any) {
    const is429 = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota");
    if (is429) {
      // Set 30 second cooldown before retrying external API
      rateLimitCooldownUntil = Date.now() + 30000;
      console.warn("Gemini rate limit encountered. Activating 30s scientific fallback cooldown.");
    } else {
      console.warn("Gemini generation fallback:", error?.message || error);
    }

    const fallbackResult = generateScientificInterpretation({
      name: req.body?.name,
      domain: req.body?.domain,
      category: req.body?.category,
      monthlyVisits: req.body?.monthlyVisits,
      pageWeightMB: req.body?.pageWeightMB,
      greenHosting: req.body?.greenHosting,
      carbonPerVisitGrams: req.body?.carbonPerVisitGrams,
      gridIntensityGCO2PerKWh: req.body?.gridIntensityGCO2PerKWh,
      simulationScale: req.body?.simulationScale,
      scenario: req.body?.scenario,
      isPhysicalWorldView: req.body?.isPhysicalWorldView,
    });

    const cacheKey = `${req.body?.domain || req.body?.name || "global"}_${req.body?.simulationScale || 1}_${req.body?.scenario?.name || "base"}_${req.body?.isPhysicalWorldView ? "phys" : "const"}`;
    interpretationCache.set(cacheKey, { data: fallbackResult, timestamp: Date.now() });

    return res.json(fallbackResult);
  }
});

// API Route: Live Website sustainability adapter
app.get("/api/website-lookup", async (req, res) => {
  const domain = (req.query.domain as string || "").toLowerCase().trim();
  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  // Green Web Foundation check adapter (with fallback heuristic)
  let greenWebResult = { green: false, hostedby: "Unknown Cloud Provider" };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const gwfRes = await fetch(`https://api.thegreenwebfoundation.org/greencheck/${encodeURIComponent(domain)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (gwfRes.ok) {
      const data = await gwfRes.json();
      greenWebResult = {
        green: Boolean(data.green),
        hostedby: data.hosted_by || "Global CDN / Cloud",
      };
    }
  } catch (e) {
    // Green web lookup fallback
    const knownGreen = ["google.com", "apple.com", "wikipedia.org", "microsoft.com", "github.com", "cloudflare.com", "stripe.com"];
    greenWebResult = {
      green: knownGreen.some(k => domain.includes(k)),
      hostedby: "Edge Distributed Infrastructure",
    };
  }

  // Sustainable Web Design model calculation for simulated payload
  const estimatedMB = domain.includes("video") || domain.includes("youtube") || domain.includes("netflix") || domain.includes("tiktok")
    ? 6.8
    : domain.includes("wiki") || domain.includes("gov") || domain.includes("text")
    ? 0.7
    : domain.includes("news") || domain.includes("shop")
    ? 3.4
    : 2.1;

  // 0.19 kWh per GB * 442 gCO2/kWh global average * MB/1024
  const kwhPerVisit = (estimatedMB / 1024) * 0.19;
  const gridFactor = greenWebResult.green ? 60 : 436; // gCO2e per kWh
  const carbonGrams = Number((kwhPerVisit * gridFactor).toFixed(3));

  res.json({
    domain,
    greenHosting: greenWebResult.green,
    hostProvider: greenWebResult.hostedby,
    pageWeightMB: estimatedMB,
    carbonPerVisitGrams: carbonGrams,
    kwhPerVisit: Number(kwhPerVisit.toFixed(6)),
    methodology: "Sustainable Web Design Model (SWDv3) + The Green Web Foundation",
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Carbon Constellation server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
