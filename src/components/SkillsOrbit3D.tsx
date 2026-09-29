"use client";

import { useEffect, useRef, useState } from "react";
import { Code2 } from "lucide-react";

type OrbitRing = {
  group: string;
  items: string[];
  spreadDeg: number;
  scale: number;
  duration: number;
  reverse?: boolean;
};

const TILT_DEG = 68;

const RINGS: OrbitRing[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "Next.js", "React", "Bash"],
    spreadDeg: 0,
    scale: 1,
    duration: 22,
  },
  {
    group: "AI & ML",
    items: ["LangChain", "LlamaIndex", "RAG", "PyTorch", "Prompt Eng."],
    spreadDeg: 45,
    scale: 0.86,
    duration: 30,
    reverse: true,
  },
  {
    group: "Infrastructure",
    items: ["GCP", "AWS", "Docker", "K8s", "Kafka", "Postgres"],
    spreadDeg: 90,
    scale: 0.72,
    duration: 38,
  },
  {
    group: "Signal & Embedded",
    items: ["Signal Proc.", "Time-Series", "Embedded/IoT", "Biomedical"],
    spreadDeg: 135,
    scale: 0.58,
    duration: 46,
    reverse: true,
  },
];

export default function SkillsOrbit3D() {
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
      className="relative mx-auto aspect-square w-full max-w-[300px]"
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="electric-border absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card">
          <Code2 className="h-4 w-4 text-accent" aria-hidden />
        </div>

        {RINGS.map((ring) => (
          <div
            key={ring.group}
            className="absolute inset-0"
            style={{
              transform: `scale(${ring.scale})`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `rotateZ(${ring.spreadDeg}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotateX(${TILT_DEG}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-dashed border-border/50"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    animationName: "ring3d-spin",
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
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div
                          style={{
                            display: "block",
                            transformStyle: "preserve-3d",
                            animationName: "ring3d-spin",
                            animationDuration: `${ring.duration}s`,
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            animationDirection: ring.reverse
                              ? "normal"
                              : "reverse",
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        >
                          <div
                            style={{
                              display: "block",
                              transform: `rotateX(${-TILT_DEG}deg)`,
                              transformStyle: "preserve-3d",
                            }}
                          >
                            <span
                              style={{
                                display: "block",
                                transform: `rotateZ(${-ring.spreadDeg}deg)`,
                              }}
                              className="whitespace-nowrap border border-border bg-background/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                            >
                              {item}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
