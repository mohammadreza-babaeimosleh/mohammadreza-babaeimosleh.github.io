"use client";

import { useEffect, useRef, useState } from "react";

type GlobeLocation = {
  name: string;
  role: string;
  lat: number;
  lon: number;
};

type Vec3 = [number, number, number];

function latLonToVec3(latDeg: number, lonDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [
    Math.cos(lat) * Math.sin(lon),
    -Math.sin(lat),
    Math.cos(lat) * Math.cos(lon),
  ];
}

function rotateY([x, y, z]: Vec3, angleDeg: number): Vec3 {
  const a = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(
    -1,
    Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  );
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s0 = Math.sin((1 - t) * omega) / Math.sin(omega);
  const s1 = Math.sin(t * omega) / Math.sin(omega);
  return [a[0] * s0 + b[0] * s1, a[1] * s0 + b[1] * s1, a[2] * s0 + b[2] * s1];
}

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

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;

    let autoRotation = 0;
    let dragRotation = 0;
    let isDragging = false;
    let lastDragX = 0;
    let isVisible = true;
    let hoveredIndex = -1;
    let raf = 0;
    let lastTs = 0;

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
      radius = width * 0.42;
      centerX = width / 2;
      centerY = height / 2;
    }

    function project(v: Vec3) {
      return { x: centerX + v[0], y: centerY + v[1], z: v[2] };
    }

    function drawRing(points3: Vec3[]) {
      let started = false;
      ctx!.beginPath();
      for (let i = 0; i <= points3.length; i++) {
        const v = points3[i % points3.length];
        const front = v[2] >= 0;
        const p = project(v);
        if (!front) {
          started = false;
          continue;
        }
        if (!started) {
          ctx!.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx!.lineTo(p.x, p.y);
        }
      }
      ctx!.stroke();
    }

    function draw(ts: number) {
      if (!lastTs) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;

      if (!reduceMotion && !isDragging) {
        autoRotation += dt * 0.02; // 2.5x the original slow spin
      }
      const totalRotation = autoRotation + dragRotation;

      ctx!.clearRect(0, 0, width, height);

      // Sphere silhouette
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(0, 227, 154, 0.35)";
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.fillStyle = "rgba(0, 227, 154, 0.04)";
      ctx!.fill();

      ctx!.strokeStyle = "rgba(0, 227, 154, 0.18)";
      ctx!.lineWidth = 1;

      // Latitude rings
      for (const lat of [-60, -30, 0, 30, 60]) {
        const pts: Vec3[] = [];
        for (let lon = 0; lon <= 360; lon += 6) {
          const v = rotateY(latLonToVec3(lat, lon), totalRotation);
          pts.push([v[0] * radius, v[1] * radius, v[2] * radius]);
        }
        drawRing(pts);
      }

      // Longitude meridians
      for (let lon = 0; lon < 360; lon += 30) {
        const pts: Vec3[] = [];
        for (let lat = -90; lat <= 90; lat += 6) {
          const v = rotateY(latLonToVec3(lat, lon), totalRotation);
          pts.push([v[0] * radius, v[1] * radius, v[2] * radius]);
        }
        drawRing(pts);
      }

      // Career-path arcs between consecutive locations
      const rawVecs = locations.map((loc) => latLonToVec3(loc.lat, loc.lon));
      ctx!.strokeStyle = "rgba(0, 227, 154, 0.55)";
      ctx!.lineWidth = 1.4;
      for (let i = 0; i < rawVecs.length - 1; i++) {
        let started = false;
        ctx!.beginPath();
        const steps = 40;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const mid = slerp(rawVecs[i], rawVecs[i + 1], t);
          const lift = 1 + 0.18 * Math.sin(Math.PI * t);
          const rotated = rotateY(mid, totalRotation);
          const v: Vec3 = [
            rotated[0] * radius * lift,
            rotated[1] * radius * lift,
            rotated[2] * radius * lift,
          ];
          const front = v[2] >= 0;
          const p = project(v);
          if (!front) {
            started = false;
            continue;
          }
          if (!started) {
            ctx!.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx!.lineTo(p.x, p.y);
          }
        }
        ctx!.stroke();
      }

      // Markers
      locations.forEach((loc, i) => {
        const rotated = rotateY(rawVecs[i], totalRotation);
        const v: Vec3 = [
          rotated[0] * radius,
          rotated[1] * radius,
          rotated[2] * radius,
        ];
        const p = project(v);
        const front = v[2] >= -radius * 0.05;
        if (!front) return;

        const depthT = (v[2] + radius) / (2 * radius); // 0 (back) .. 1 (front)
        const isHovered = hoveredIndex === i;
        const baseSize = 3.5 + depthT * 2.5;
        const size = isHovered ? baseSize * 1.7 : baseSize;
        const alpha = 0.45 + depthT * 0.55;

        if (isHovered) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, size + 6, 0, Math.PI * 2);
          ctx!.fillStyle = "rgba(0, 227, 154, 0.18)";
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 227, 154, ${alpha})`;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
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
      const totalRotation = autoRotation + dragRotation;
      let closest = -1;
      let closestDist = 16; // hit radius in px
      locations.forEach((loc, i) => {
        const rotated = rotateY(latLonToVec3(loc.lat, loc.lon), totalRotation);
        const v: Vec3 = [
          rotated[0] * radius,
          rotated[1] * radius,
          rotated[2] * radius,
        ];
        if (v[2] < -radius * 0.05) return;
        const p = project(v);
        const dist = Math.hypot(p.x - mx, p.y - my);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      return { closest, mx, my };
    }

    function onMouseMove(e: MouseEvent) {
      if (isDragging) {
        const delta = e.clientX - lastDragX;
        lastDragX = e.clientX;
        dragRotation += delta * 0.4;
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
      lastDragX = e.clientX;
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

    if (reduceMotion) {
      draw(0);
    }

    return () => {
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
