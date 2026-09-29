"use client";

import { useEffect, useRef, useState } from "react";
import { Code2 } from "lucide-react";

type SkillRing = {
  group: string;
  items: string[];
  diameter: number;
  duration: number;
  reverse?: boolean;
};

const RINGS: SkillRing[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "Next.js", "React", "C++", "Bash"],
    diameter: 42,
    duration: 24,
  },
  {
    group: "AI & ML",
    items: ["LangChain", "LlamaIndex", "RAG", "PyTorch", "Prompt Eng."],
    diameter: 62,
    duration: 32,
    reverse: true,
  },
  {
    group: "Infrastructure",
    items: [
      "GCP",
      "AWS",
      "Docker",
      "K8s",
      "Kafka",
      "Postgres",
      "MongoDB",
      "Redis",
    ],
    diameter: 82,
    duration: 44,
  },
  {
    group: "Signal & Embedded",
    items: [
      "Signal Proc.",
      "Time-Series",
      "Embedded/IoT",
      "Sound Proc.",
      "Biomedical",
    ],
    diameter: 100,
    duration: 56,
    reverse: true,
  },
];

export default function OrbitingSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = reduceMotion || !isVisible || isHovering;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative mx-auto aspect-square w-full max-w-[500px]"
    >
      <div className="electric-border absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card">
        <Code2 className="h-5 w-5 text-accent" aria-hidden />
      </div>

      {/* Fixed-pixel inset keeps orbiting labels from spilling past the
          container edge at any breakpoint, since chip width doesn't scale
          down with the container the way percentage-based ring sizes do. */}
      <div className="absolute inset-12">
        {RINGS.map((ring) => (
          <div key={ring.group}>
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/50"
              style={{
                width: `${ring.diameter}%`,
                height: `${ring.diameter}%`,
              }}
            />
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: `${ring.diameter}%`,
                height: `${ring.diameter}%`,
                animationName: "orbit-spin",
                animationDuration: `${ring.duration}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDirection: ring.reverse ? "reverse" : "normal",
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              {ring.items.map((item, i) => {
                const angle = (360 / ring.items.length) * i;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 50 * Math.cos(rad);
                const y = 50 + 50 * Math.sin(rad);
                return (
                  <div
                    key={item}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span
                      style={{
                        display: "block",
                        animationName: "orbit-spin-item",
                        animationDuration: `${ring.duration}s`,
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite",
                        animationDirection: ring.reverse ? "normal" : "reverse",
                        animationPlayState: paused ? "paused" : "running",
                      }}
                      className="whitespace-nowrap border border-border bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
