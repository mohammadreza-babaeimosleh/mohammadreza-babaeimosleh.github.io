"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const BAR_COUNT = 56;

export default function SonicWaveform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = reduceMotion || !isVisible;
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="flex h-16 w-full items-center gap-[3px]"
    >
      {bars.map((i) => {
        // Vary duration/phase/base-height per bar so the row reads as one
        // continuous, organic signal rather than uniformly pulsing blocks.
        const duration = 1.4 + (i % 9) * 0.11;
        const delay = -(i * 0.08);
        const baseScale = 0.18 + ((Math.sin(i * 0.55) + 1) / 2) * 0.42;
        return (
          <span
            key={i}
            className="waveform-bar block h-full flex-1 rounded-full bg-accent/60"
            style={
              {
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                animationPlayState: paused ? "paused" : "running",
                "--base-scale": baseScale,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
