import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Waves,
  Zap,
  Flame,
  Droplets,
  Server,
  Activity,
  Layers,
  ThermometerSun,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface ImpactTransformationProps {
  onReturnToConstellation: () => void;
  onOpenMethodology: () => void;
}

type PhysicalViewLayer = "subsea" | "datacenter_thermal" | "grid_intensity" | "carbon_column";

export const ImpactTransformation: React.FC<ImpactTransformationProps> = ({
  onReturnToConstellation,
  onOpenMethodology,
}) => {
  const [activeLayer, setActiveLayer] = useState<PhysicalViewLayer>("subsea");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Global physical numbers
  const planetaryInternetElectricityTWh = 460; // ~1.5% - 2% of total human electricity
  const subseaCableLengthKm = 1400000; // 1.4 million km of subsea cables
  const activeDataCentersWorldwide = 10500;
  const annualInternetCarbonMTonnes = 850; // ~3.7% of global greenhouse emissions (comparable to aviation)

  // Interactive 2D Canvas rendering the physical map simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    // Major global subsea / data center geographic hubs
    const hubs = [
      { name: "Ashburn, VA (Data Center Alley)", x: width * 0.28, y: height * 0.38, powerMW: 2800, isRenewable: false },
      { name: "Silicon Valley, CA", x: width * 0.18, y: height * 0.42, powerMW: 1400, isRenewable: true },
      { name: "Dublin, Ireland (Hyperscale Hub)", x: width * 0.48, y: height * 0.32, powerMW: 1200, isRenewable: true },
      { name: "Frankfurt, Germany (DE-CIX)", x: width * 0.54, y: height * 0.34, powerMW: 1600, isRenewable: false },
      { name: "Hamina, Finland (Nordic Sea Cooling)", x: width * 0.58, y: height * 0.24, powerMW: 850, isRenewable: true },
      { name: "Singapore (Southeast Asia Gateway)", x: width * 0.78, y: height * 0.62, powerMW: 1100, isRenewable: false },
      { name: "Tokyo, Japan", x: width * 0.86, y: height * 0.42, powerMW: 1300, isRenewable: false },
      { name: "São Paulo, Brazil", x: width * 0.34, y: height * 0.74, powerMW: 600, isRenewable: true },
    ];

    // Subsea cable paths connecting hubs
    const cables = [
      [0, 2], // Transatlantic North (Dunant / Grace Hopper)
      [1, 6], // Transpacific (FASTER / Unity)
      [2, 3], // European terrestrial backhaul
      [3, 4], // Nordic fiber
      [3, 5], // Sea-Me-We Eurasian subsea
      [6, 5], // Asia-Pacific Gateway
      [0, 7], // Monet cable to South America
    ];

    let pulseTime = 0;

    const render = () => {
      pulseTime += 0.03;
      ctx.fillStyle = "rgba(6, 8, 12, 0.35)";
      ctx.fillRect(0, 0, width, height);

      // 1. Draw stylized world map land silhouettes
      ctx.strokeStyle = "rgba(51, 65, 85, 0.35)";
      ctx.lineWidth = 1;

      // Stylized latitude / longitude grid
      for (let y = 40; y < height; y += 70) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 60; x < width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 2. Draw Subsea Cables
      for (const [i1, i2] of cables) {
        const h1 = hubs[i1];
        const h2 = hubs[i2];

        ctx.strokeStyle =
          activeLayer === "subsea"
            ? "rgba(56, 189, 248, 0.45)"
            : activeLayer === "datacenter_thermal"
            ? "rgba(244, 63, 94, 0.3)"
            : "rgba(100, 116, 139, 0.25)";
        ctx.lineWidth = activeLayer === "subsea" ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(h1.x, h1.y);
        const midX = (h1.x + h2.x) / 2;
        const midY = (h1.y + h2.y) / 2 + (h1.x < h2.x ? 25 : -25);
        ctx.quadraticCurveTo(midX, midY, h2.x, h2.y);
        ctx.stroke();

        // Pulsing laser photon packets traversing cable
        const packetProgress = (pulseTime * 0.3 + (i1 + i2) * 0.2) % 1;
        const px = (1 - packetProgress) * (1 - packetProgress) * h1.x + 2 * (1 - packetProgress) * packetProgress * midX + packetProgress * packetProgress * h2.x;
        const py = (1 - packetProgress) * (1 - packetProgress) * h1.y + 2 * (1 - packetProgress) * packetProgress * midY + packetProgress * packetProgress * h2.y;

        ctx.fillStyle = activeLayer === "datacenter_thermal" ? "#fb7185" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(px, py, activeLayer === "subsea" ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Hyperscale Data Center Clusters & Thermal Plumes
      for (const hub of hubs) {
        const radius = Math.sqrt(hub.powerMW) * 0.35;

        // Thermal bloom or renewable green aura
        if (activeLayer === "datacenter_thermal") {
          const grad = ctx.createRadialGradient(hub.x, hub.y, 2, hub.x, hub.y, radius * 3.5);
          grad.addColorStop(0, "rgba(239, 68, 68, 0.8)");
          grad.addColorStop(0.5, "rgba(249, 115, 22, 0.3)");
          grad.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeLayer === "grid_intensity") {
          const grad = ctx.createRadialGradient(hub.x, hub.y, 2, hub.x, hub.y, radius * 2.5);
          grad.addColorStop(0, hub.isRenewable ? "rgba(16, 185, 129, 0.7)" : "rgba(245, 158, 11, 0.7)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core Hub Pin
        ctx.fillStyle = hub.isRenewable ? "#10b981" : "#f43f5e";
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing Ring
        ctx.strokeStyle = hub.isRenewable ? "rgba(16, 185, 129, 0.5)" : "rgba(244, 63, 94, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 8 + Math.sin(pulseTime * 2 + hub.powerMW) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(hub.name, hub.x + 8, hub.y - 6);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeLayer]);

  return (
    <div id="impact-transformation-scene" className="relative w-full min-h-[90vh] py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5" />
            Scene 05 &bull; The Physical Consequence
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white font-editorial mt-1">
            What The Internet Does To The Physical World
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="return-to-universe-btn"
            onClick={onReturnToConstellation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Constellation</span>
          </button>

          <button
            id="open-methodology-btn"
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)]"
          >
            <span>Inspect Methodology</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Layer Tabs */}
      <div className="my-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          <button
            id="layer-tab-subsea"
            onClick={() => setActiveLayer("subsea")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
              activeLayer === "subsea"
                ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Subsea Transoceanic Cables (1.4M km)</span>
          </button>

          <button
            id="layer-tab-thermal"
            onClick={() => setActiveLayer("datacenter_thermal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
              activeLayer === "datacenter_thermal"
                ? "bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <ThermometerSun className="w-3.5 h-3.5 text-rose-400" />
            <span>Data Center Thermal Plumes & Heat</span>
          </button>

          <button
            id="layer-tab-grid"
            onClick={() => setActiveLayer("grid_intensity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
              activeLayer === "grid_intensity"
                ? "bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Regional Power Grid Draw</span>
          </button>
        </div>

        {/* The Physical Transformation World Map Canvas */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-[380px] sm:h-[420px] block" />

          {/* Top telemetry tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Layer: {activeLayer.toUpperCase().replace("_", " ")}</span>
          </div>
        </div>

        {/* Global Planetary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Global Power Draw</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              ~{planetaryInternetElectricityTWh} TWh / year
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Approx. 1.5%–2% of total human electrical generation (IEA Data)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Atmospheric Emissions</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              ~{annualInternetCarbonMTonnes} Million Tonnes
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Comparable to total commercial aviation emissions globally
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Subsea Fiber Highway</span>
              <Waves className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              1.4 Million km
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Armored glass fibers with 10,000V DC repeaters on the ocean floor
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Cooling Water Loss</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              Hundreds of Billion Liters
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Continuous evaporative cooling to prevent server thermal shutdown
            </span>
          </div>
        </div>
      </div>

      {/* The Culminating Hackathon Thesis Quote */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="my-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-slate-700/80 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="text-xl sm:text-2xl md:text-3xl font-light text-slate-100 font-editorial tracking-tight leading-relaxed max-w-4xl mx-auto">
          “Nothing about the internet is weightless.
          <br className="hidden sm:inline" />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300">
            {" "}We just stopped seeing the infrastructure.”
          </span>
        </div>
      </motion.div>
    </div>
  );
};
