"use client";

import { useEffect, useRef, useState } from "react";
import {
  geoOrthographic,
  geoPath,
  geoGraticule10,
  geoInterpolate,
  geoDistance,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature } from "topojson-client";

type GlobeLocation = {
  name: string;
  role: string;
  lat: number;
  lon: number;
};

export default function LocationGlobe({
  locations,
  className = "",
}: {
  locations: GlobeLocation[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{
    name: string;
    role: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    // Start roughly centered over Europe/the Gulf, where all 4 markers sit.
    let rotationLambda = -28;
    let tiltPhi = -35;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let isVisible = true;
    let hoveredIndex = -1;
    let raf = 0;
    let lastTs = 0;
    let countries: GeoPermissibleObjects[] = [];

    const projection = geoOrthographic().clipAngle(90);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.width;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.scale(width * 0.47).translate([width / 2, height / 2]);
    }

    function visibleCenter(): [number, number] {
      return [-rotationLambda, -tiltPhi];
    }

    function draw(ts: number) {
      if (!lastTs) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;

      if (!reduceMotion && !isDragging) {
        rotationLambda += dt * 0.02;
      }
      projection.rotate([rotationLambda, tiltPhi, 0]);

      ctx!.clearRect(0, 0, width, height);

      // Ocean / sphere
      ctx!.beginPath();
      path({ type: "Sphere" });
      ctx!.fillStyle = "rgba(0, 40, 36, 0.45)";
      ctx!.fill();
      ctx!.strokeStyle = "rgba(0, 227, 154, 0.4)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Graticule (lat/lon grid)
      ctx!.beginPath();
      path(graticule);
      ctx!.strokeStyle = "rgba(0, 227, 154, 0.1)";
      ctx!.lineWidth = 0.5;
      ctx!.stroke();

      // Country boundaries
      ctx!.fillStyle = "rgba(0, 227, 154, 0.14)";
      ctx!.strokeStyle = "rgba(0, 227, 154, 0.5)";
      ctx!.lineWidth = 0.6;
      for (const f of countries) {
        ctx!.beginPath();
        path(f);
        ctx!.fill();
        ctx!.stroke();
      }

      // Career-path arcs between consecutive locations
      ctx!.strokeStyle = "rgba(0, 227, 154, 0.8)";
      ctx!.lineWidth = 1.4;
      for (let i = 0; i < locations.length - 1; i++) {
        const a: [number, number] = [locations[i].lon, locations[i].lat];
        const b: [number, number] = [
          locations[i + 1].lon,
          locations[i + 1].lat,
        ];
        const interp = geoInterpolate(a, b);
        let started = false;
        ctx!.beginPath();
        const steps = 48;
        for (let s = 0; s <= steps; s++) {
          const p = projection(interp(s / steps));
          if (!p) {
            started = false;
            continue;
          }
          if (!started) {
            ctx!.moveTo(p[0], p[1]);
            started = true;
          } else {
            ctx!.lineTo(p[0], p[1]);
          }
        }
        ctx!.stroke();
      }

      // Markers
      const center = visibleCenter();
      locations.forEach((loc, i) => {
        const p = projection([loc.lon, loc.lat]);
        if (!p) return;
        const dist = geoDistance([loc.lon, loc.lat], center); // 0..PI
        const depthT = Math.max(0, 1 - dist / (Math.PI / 2));
        const isHovered = hoveredIndex === i;
        const baseSize = 3.5 + depthT * 2.5;
        const size = isHovered ? baseSize * 1.7 : baseSize;
        const alpha = 0.5 + depthT * 0.5;

        if (isHovered) {
          ctx!.beginPath();
          ctx!.arc(p[0], p[1], size + 6, 0, Math.PI * 2);
          ctx!.fillStyle = "rgba(0, 227, 154, 0.18)";
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.arc(p[0], p[1], size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 227, 154, ${alpha})`;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(p[0], p[1], size, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(10, 10, 11, 0.6)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      if (isVisible) {
        raf = requestAnimationFrame(draw);
      } else {
        lastTs = 0;
      }
    }

    function startLoop() {
      raf = requestAnimationFrame(draw);
    }

    function pointerLocationHit(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      let closest = -1;
      let closestDist = 16;
      locations.forEach((loc, i) => {
        const p = projection([loc.lon, loc.lat]);
        if (!p) return;
        const d = Math.hypot(p[0] - mx, p[1] - my);
        if (d < closestDist) {
          closestDist = d;
          closest = i;
        }
      });
      return { closest, mx, my };
    }

    function onMouseMove(e: MouseEvent) {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        rotationLambda += dx * 0.35;
        tiltPhi = Math.max(-80, Math.min(80, tiltPhi - dy * 0.35));
        return;
      }
      const { closest, mx, my } = pointerLocationHit(e.clientX, e.clientY);
      if (closest !== hoveredIndex) {
        hoveredIndex = closest;
        if (closest === -1) {
          setTooltip(null);
        } else {
          setTooltip({
            name: locations[closest].name,
            role: locations[closest].role,
            x: mx,
            y: my,
          });
        }
      } else if (closest !== -1) {
        setTooltip((prev) => (prev ? { ...prev, x: mx, y: my } : prev));
      }
      canvas!.style.cursor = closest !== -1 ? "pointer" : "grab";
    }

    function onMouseDown(e: MouseEvent) {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas!.style.cursor = "grabbing";
    }
    function onMouseUp() {
      isDragging = false;
      canvas!.style.cursor = "grab";
    }
    function onMouseLeave() {
      isDragging = false;
      hoveredIndex = -1;
      setTooltip(null);
      canvas!.style.cursor = "grab";
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.style.cursor = "grab";

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTs = 0;
          startLoop();
        }
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    fetch("/world-110m.json")
      .then((r) => r.json())
      .then((topology) => {
        if (cancelled) return;
        const obj = topology.objects.countries;
        const geo = feature(topology, obj) as unknown as {
          features: GeoPermissibleObjects[];
        };
        countries = geo.features;
        if (reduceMotion) {
          draw(0);
        }
      })
      .catch(() => {
        // If the geometry fails to load, still show the graticule sphere.
        if (reduceMotion) draw(0);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      visibilityObserver.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [locations]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="block w-full" />
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap border border-accent/40 bg-card px-3 py-1.5 font-mono text-[11px] text-foreground shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span className="text-accent">{tooltip.name}</span>
          <span className="ml-2 text-muted-foreground">{tooltip.role}</span>
        </div>
      )}
    </div>
  );
}
