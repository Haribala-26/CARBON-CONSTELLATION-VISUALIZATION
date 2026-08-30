import { InfrastructureStage } from "../types";

export const INFRASTRUCTURE_STAGES: InfrastructureStage[] = [
  {
    id: "stage-device",
    order: 1,
    title: "User Device",
    subtitle: "Local Silicon & Radio Emission",
    physicalLocation: "In the user's hand / desk",
    energySharePercent: 34,
    timeMicroseconds: 2400,
    description: "The moment you tap or click, your device CPU wakes from idle, the display driver illuminates millions of pixels, and the RF radio transmitter broadcasts modulated electromagnetic waves to the nearest transceiver.",
    physicalMechanism: "OLED/MiniLED backlight photon generation, silicon CPU state cycling, and 2.4/5GHz / 5G mmWave radio frequency amplification.",
    energyMetric: "~0.12 Wh per page load",
    carbonMetric: "~0.05 g CO₂e",
    visualAnchor: "Glass Screen & Radio Transceiver",
    iconName: "Smartphone"
  },
  {
    id: "stage-network",
    order: 2,
    title: "Network & Core Routing",
    subtitle: "Metro Rings & Internet Exchanges (IXP)",
    physicalLocation: "Street cabinets, cell towers, and IXP switching vaults",
    energySharePercent: 28,
    timeMicroseconds: 14200,
    description: "Your digital packet is serialized into laser light over local fiber or copper DSLAM nodes, traversing dozens of high-throughput border gateway routers across regional Internet Exchange Points (e.g. DE-CIX Frankfurt, Equinix Ashburn).",
    physicalMechanism: "Photonic laser diodes pulsing at 100-800 Gbps, active ASIC packet inspection, and cooled switching backplanes.",
    energyMetric: "~0.09 Wh per packet stream",
    carbonMetric: "~0.04 g CO₂e",
    visualAnchor: "Fiber-Optic Bundles & 400G Optical Transceivers",
    iconName: "Network"
  },
  {
    id: "stage-subsea",
    order: 3,
    title: "Subsea Cable Highways",
    subtitle: "Transoceanic Optical Amplification",
    physicalLocation: "Ocean floor (up to 8,000m deep across Atlantic & Pacific)",
    energySharePercent: 8,
    timeMicroseconds: 38000,
    description: "For international services, photons traverse armored cables laid across the seabed. Because light weakens over thousands of kilometers, erbium-doped fiber amplifiers (EDFAs) stationed every 60km along the ocean floor continuously consume high-voltage DC power from landing stations.",
    physicalMechanism: "Erbium-doped laser pumping powered by 10,000V DC copper conductors embedded in deep-sea armored cables.",
    energyMetric: "~0.03 Wh per transoceanic hop",
    carbonMetric: "~0.01 g CO₂e",
    visualAnchor: "Seabed Armored Fiber & High-Voltage Optical Repeaters",
    iconName: "Waves"
  },
  {
    id: "stage-compute",
    order: 4,
    title: "Hyperscale Data Center",
    subtitle: "Compute, Tensor Cores & Memory Arrays",
    physicalLocation: "Mega-facilities (Iowa, Dublin, Virginia, Luleå, Singapore)",
    energySharePercent: 18,
    timeMicroseconds: 8500,
    description: "The packet arrives at a hyperscale campus spanning hundreds of thousands of square feet. Racks of server blades draw continuous kilowatt electrical power to query databases, run neural network inference, and compress response payloads.",
    physicalMechanism: "Nanometer-scale silicon transistors switching billions of times per second, drawing 300W–1000W per server blade.",
    energyMetric: "~0.07 Wh per request cycle",
    carbonMetric: "~0.03 g CO₂e",
    visualAnchor: "Blade Server Racks & GPU Inference Clusters",
    iconName: "Cpu"
  },
  {
    id: "stage-cooling",
    order: 5,
    title: "Cooling & Power Conditioning",
    subtitle: "Water Evaporation & Industrial HVAC Chillers",
    physicalLocation: "Data center mechanical yard & cooling towers",
    energySharePercent: 12,
    timeMicroseconds: 0,
    description: "Every watt of electricity converted to heat by CPUs must be extracted to prevent thermal meltdown. Industrial chillers, liquid cooling cold-plates, and evaporative cooling towers cycle millions of liters of fresh water and electricity around the clock.",
    physicalMechanism: "Thermodynamic heat exchange via evaporative cooling towers, adiabatic dry coolers, and chilled water loops (PUE 1.1–1.5 multiplier).",
    energyMetric: "~0.05 Wh cooling overhead",
    carbonMetric: "~0.02 g CO₂e + ~12 mL Water",
    visualAnchor: "Cooling Towers & Heat Exchange Radiators",
    iconName: "ThermometerSnowflake"
  },
  {
    id: "stage-impact",
    order: 6,
    title: "Physical Earth Consequence",
    subtitle: "Grid Generation & Atmospheric Carbon",
    physicalLocation: "Regional Power Grids & Global Atmosphere",
    energySharePercent: 100, // Aggregate outcome
    timeMicroseconds: 0,
    description: "The cumulative energy demanded by the device, network, subsea cables, compute servers, and cooling pumps is pulled in real time from regional electrical grids—burning coal, natural gas, or drawing from hydro/wind/solar arrays. The physical consequence is measurable.",
    physicalMechanism: "Turbine fuel combustion (gCO₂e/kWh), thermodynamic heat dissipation into the surrounding biosphere, and cumulative planetary atmospheric warming.",
    energyMetric: "Total ~0.36 Wh per visit (Average)",
    carbonMetric: "Total ~0.15–0.98 g CO₂e per single visit",
    visualAnchor: "Grid Power Lines, Thermal Plumes & Atmospheric Carbon",
    iconName: "Globe"
  }
];
