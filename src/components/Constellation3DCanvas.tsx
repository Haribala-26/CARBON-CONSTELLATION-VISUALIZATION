import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { WebsiteData } from "../types";

interface Constellation3DCanvasProps {
  websites: WebsiteData[];
  selectedWebsite: WebsiteData | null;
  comparisonWebsite?: WebsiteData | null;
  onSelectWebsite: (site: WebsiteData) => void;
  displayMode: "traffic" | "carbon" | "green";
  isGlobalSimulationActive: boolean;
  simulationScale?: number;
  pulseTrigger?: number;
}

export const Constellation3DCanvas: React.FC<Constellation3DCanvasProps> = ({
  websites,
  selectedWebsite,
  comparisonWebsite,
  onSelectWebsite,
  displayMode,
  isGlobalSimulationActive,
  simulationScale = 1,
  pulseTrigger = 0,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredSite, setHoveredSite] = useState<{
    site: WebsiteData;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Keep references to Three.js internal objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const celestialMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const targetCamPos = useRef(new THREE.Vector3(0, 30, 130));
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rotationGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x06080d, 0.0035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, 130);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Rotation root group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rotationGroupRef.current = rootGroup;

    // 4. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x334155, 1.2);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 2.5, 300);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 5. Deep Space Dust Particle Cloud
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 90 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Star hues: soft icy blue, amber, mineral gray
      const isCyan = Math.random() > 0.4;
      starColors[i * 3] = isCyan ? 0.3 + Math.random() * 0.3 : 0.8;
      starColors[i * 3 + 1] = isCyan ? 0.7 + Math.random() * 0.3 : 0.6;
      starColors[i * 3 + 2] = isCyan ? 0.9 : 0.4;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 6. Build Celestial Bodies for Websites
    const meshMap = new Map<string, THREE.Group>();

    websites.forEach((site) => {
      const siteGroup = new THREE.Group();
      siteGroup.position.set(
        site.celestialCoordinates.x,
        site.celestialCoordinates.y,
        site.celestialCoordinates.z
      );
      siteGroup.userData = { siteId: site.id, site };

      // Core sphere geometry
      const baseRadius = Math.max(3.0, (site.celestialCoordinates.radius || 10) * 0.4);
      const sphereGeo = new THREE.SphereGeometry(baseRadius, 32, 32);

      // Base color based on environmental mode
      let coreColor = new THREE.Color(site.celestialCoordinates.auraColor || "#38bdf8");
      if (displayMode === "green") {
        coreColor = site.greenHosting ? new THREE.Color("#10b981") : new THREE.Color("#f59e0b");
      } else if (displayMode === "carbon") {
        // High carbon = warm red/orange; low carbon = cyan/emerald
        coreColor = site.carbonPerVisitGrams > 1.0
          ? new THREE.Color("#ef4444")
          : site.carbonPerVisitGrams > 0.4
          ? new THREE.Color("#f97316")
          : new THREE.Color("#10b981");
      }

      const sphereMat = new THREE.MeshStandardMaterial({
        color: coreColor,
        roughness: 0.25,
        metalness: 0.8,
        emissive: coreColor,
        emissiveIntensity: 0.45,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.userData = { isCelestialCore: true, siteId: site.id };
      siteGroup.add(sphereMesh);

      // Outer Glowing Aura Atmosphere
      const auraGeo = new THREE.SphereGeometry(baseRadius * 1.5, 24, 24);
      const auraMat = new THREE.MeshBasicMaterial({
        color: site.greenHosting ? 0x10b981 : coreColor,
        transparent: true,
        opacity: site.greenHosting ? 0.28 : 0.16,
        wireframe: true,
      });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      siteGroup.add(auraMesh);

      // Orbital Satellites / Data Packet Rings
      const ringGeo = new THREE.RingGeometry(baseRadius * 1.8, baseRadius * 1.85, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: coreColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + Math.random() * 0.4;
      siteGroup.add(ringMesh);

      // Little orbiting packet particle
      const packetGeo = new THREE.SphereGeometry(0.6, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      packetMesh.position.set(baseRadius * 1.82, 0, 0);
      ringMesh.add(packetMesh);

      rootGroup.add(siteGroup);
      meshMap.set(site.id, siteGroup);
    });

    celestialMeshesRef.current = meshMap;

    // 7. Constellation Interconnecting Filaments (Lines between related sites)
    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < websites.length; i++) {
      for (let j = i + 1; j < websites.length; j++) {
        const siteA = websites[i];
        const siteB = websites[j];

        // Connect if in same category or key internet hub
        if (siteA.category === siteB.category || siteA.trafficRank <= 3 || siteB.trafficRank <= 3) {
          linePositions.push(
            siteA.celestialCoordinates.x, siteA.celestialCoordinates.y, siteA.celestialCoordinates.z,
            siteB.celestialCoordinates.x, siteB.celestialCoordinates.y, siteB.celestialCoordinates.z
          );

          const isGreenLink = siteA.greenHosting && siteB.greenHosting;
          const colR = isGreenLink ? 0.06 : 0.2;
          const colG = isGreenLink ? 0.72 : 0.4;
          const colB = isGreenLink ? 0.5 : 0.65;

          lineColors.push(colR, colG, colB, colR, colG, colB);
        }
      }
    }

    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
    });
    const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    rootGroup.add(constellationLines);

    // 8. Event Handlers & Mobile Touch Handlers
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Touch & Pointer state
    let initialPinchDistance: number | null = null;
    let initialCameraZ = 130;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);

      if (isDraggingRef.current && rootGroup) {
        const deltaX = e.clientX - prevMousePos.current.x;
        const deltaY = e.clientY - prevMousePos.current.y;
        rootGroup.rotation.y += deltaX * 0.005;
        rootGroup.rotation.x += deltaY * 0.005;
        prevMousePos.current = { x: e.clientX, y: e.clientY };
      } else if (e.pointerType !== "touch") {
        // Raycast for hover detection on non-touch
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(rootGroup.children, true);

        const hit = intersects.find(
          (i) => i.object.userData.isCelestialCore || (i.object.parent && i.object.parent.userData.site)
        );

        if (hit) {
          const site = hit.object.userData.site || (hit.object.parent && hit.object.parent.userData.site);
          if (site) {
            setHoveredSite({
              site,
              screenX: e.clientX - rect.left,
              screenY: e.clientY - rect.top,
            });
            document.body.style.cursor = "pointer";
            return;
          }
        }
        setHoveredSite(null);
        document.body.style.cursor = "default";
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const deltaDrag = Math.hypot(
        e.clientX - prevMousePos.current.x,
        e.clientY - prevMousePos.current.y
      );

      // If it wasn't a significant drag, treat as click / tap
      if (deltaDrag < 10) {
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersects = raycasterRef.current.intersectObjects(rootGroup.children, true);

        const hit = intersects.find(
          (i) => i.object.userData.isCelestialCore || (i.object.parent && i.object.parent.userData.site)
        );

        if (hit) {
          const site: WebsiteData =
            hit.object.userData.site ||
            (hit.object.parent && hit.object.parent.userData.site);
          if (site) {
            onSelectWebsite(site);
          }
        }
      }

      isDraggingRef.current = false;
    };

    // Mobile Pinch-To-Zoom Touch Event Handlers
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
        initialCameraZ = camera.position.z;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const factor = initialPinchDistance / currentDistance;
        camera.position.z = THREE.MathUtils.clamp(initialCameraZ * factor, 40, 220);
      }
    };

    const onTouchEnd = () => {
      initialPinchDistance = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.1, 40, 220);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("wheel", onWheel, { passive: false });

    // 9. Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let pulseWave = 0;

    // Computed scale multiplier for celestial bodies based on traffic scale
    const scaleLog = Math.log10(Math.max(1, simulationScale));
    const globalScaleFactor = 1 + Math.min(2.5, scaleLog * 0.18);
    const auraScaleFactor = 1 + Math.min(3.2, scaleLog * 0.28);
    const speedMultiplier = 1 + Math.min(4.0, scaleLog * 0.35);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle ambient cosmic rotation
      if (!isDraggingRef.current && rootGroup) {
        rootGroup.rotation.y += (isGlobalSimulationActive ? 0.003 : 0.0008) * speedMultiplier;
      }

      // Rotate individual orbital rings, adjust scales, and pulse celestial cores
      meshMap.forEach((group, id) => {
        const isSelected = selectedWebsite && selectedWebsite.id === id;
        
        // 1. Orbital Ring rotation
        const ring = group.children[2];
        if (ring) {
          ring.rotation.z += 0.02 * (group.userData.site?.celestialCoordinates?.orbitSpeed || 0.2) * speedMultiplier;
          const targetRingScale = isSelected ? globalScaleFactor * 1.25 : globalScaleFactor;
          ring.scale.lerp(new THREE.Vector3(targetRingScale, targetRingScale, targetRingScale), 0.08);
        }

        // 2. Outer Glowing Atmosphere Aura
        const aura = group.children[1] as THREE.Mesh;
        if (aura) {
          const auraPulse = isSelected ? Math.sin(time * 3) * 0.15 : 0;
          const targetAuraScale = (auraScaleFactor + auraPulse) * (isSelected ? 1.3 : 1.0);
          aura.scale.lerp(new THREE.Vector3(targetAuraScale, targetAuraScale, targetAuraScale), 0.08);
        }

        // 3. Core Sphere mesh
        const core = group.children[0] as THREE.Mesh;
        if (core) {
          if (isSelected) {
            const selectedPulse = 1.0 + Math.sin(time * 4) * 0.14;
            const finalScale = globalScaleFactor * selectedPulse;
            core.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.15);
          } else {
            core.scale.lerp(new THREE.Vector3(globalScaleFactor, globalScaleFactor, globalScaleFactor), 0.08);
          }
        }
      });

      // Smooth camera pan towards selected site if requested
      if (selectedWebsite) {
        const targetGroup = meshMap.get(selectedWebsite.id);
        if (targetGroup) {
          const worldPos = new THREE.Vector3();
          targetGroup.getWorldPosition(worldPos);
          targetCamPos.current.set(worldPos.x, worldPos.y + 12, worldPos.z + 55);
        }
      } else {
        targetCamPos.current.set(0, 30, 130);
      }

      // Smoothly lerp camera position towards target position
      if (!isDraggingRef.current) {
        camera.position.lerp(targetCamPos.current, 0.045);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [websites, displayMode, isGlobalSimulationActive, selectedWebsite, simulationScale, pulseTrigger]);

  return (
    <div id="constellation-3d-viewport" className="relative w-full h-[400px] sm:h-[500px] md:h-[580px] rounded-2xl bg-gradient-to-b from-[#06080d] via-[#080b12] to-[#040609] border border-slate-800/80 overflow-hidden shadow-2xl touch-none">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Floating Hover Telemetry Card */}
      {hoveredSite && (
        <div
          id="celestial-hover-tooltip"
          style={{
            left: Math.min(window.innerWidth - 260, hoveredSite.screenX + 16),
            top: Math.max(16, hoveredSite.screenY - 80),
          }}
          className="absolute z-30 pointer-events-none p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md min-w-[220px]"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-white text-sm truncate">
              {hoveredSite.site.name}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              hoveredSite.site.greenHosting
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {hoveredSite.site.greenHosting ? "100% Green" : "Grid Mix"}
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 mb-2">
            #{hoveredSite.site.trafficRank} Global &bull; {hoveredSite.site.category}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Page Weight</span>
              <span className="text-slate-200 font-semibold">{hoveredSite.site.pageWeightMB} MB</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Carbon/Visit</span>
              <span className="text-slate-200 font-semibold">{hoveredSite.site.carbonPerVisitGrams} gCO₂e</span>
            </div>
          </div>
        </div>
      )}

      {/* Viewport Overlay Controls Guide & Scale Badge */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 border border-slate-800/80 text-slate-300 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Drag to rotate &bull; Pinch/Scroll to zoom &bull; Tap node to inspect</span>
          <span className="sm:hidden">Drag &bull; Pinch zoom &bull; Tap node</span>
        </div>

        {simulationScale > 1 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span>Scale: {simulationScale >= 1e9 ? `${(simulationScale / 1e9).toFixed(1)}B Global` : simulationScale >= 1e6 ? `${simulationScale / 1e6}M Sessions` : simulationScale >= 1e3 ? `${simulationScale / 1e3}K Visits` : `${simulationScale}x`}</span>
          </div>
        )}
      </div>
    </div>
  );
};
