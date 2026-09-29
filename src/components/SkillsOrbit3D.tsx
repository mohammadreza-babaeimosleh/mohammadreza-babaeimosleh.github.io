"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Code2,
  Layers,
  Sparkles,
  MessageSquareText,
  AudioWaveform,
  TrendingUp,
  Cpu,
  HeartPulse,
} from "lucide-react";
import {
  SiPython,
  SiTypescript,
  SiNextdotjs,
  SiReact,
  SiGnubash,
  SiLangchain,
  SiPytorch,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiApachekafka,
  SiPostgresql,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";

type IconType = ComponentType<{ className?: string }>;

type SkillItem = { label: string; Icon: IconType };

type OrbitRing = {
  group: string;
  items: SkillItem[];
  spreadDeg: number;
  scale: number;
  duration: number;
  reverse?: boolean;
};

const TILT_DEG = 68;

const RINGS: OrbitRing[] = [
  {
    group: "Languages",
    items: [
      { label: "Python", Icon: SiPython },
      { label: "TypeScript", Icon: SiTypescript },
      { label: "Next.js", Icon: SiNextdotjs },
      { label: "React", Icon: SiReact },
      { label: "Bash", Icon: SiGnubash },
    ],
    spreadDeg: 0,
    scale: 1,
    duration: 22,
  },
  {
    group: "AI & ML",
    items: [
      { label: "LangChain", Icon: SiLangchain },
      { label: "LlamaIndex", Icon: Layers },
      { label: "RAG", Icon: Sparkles },
      { label: "PyTorch", Icon: SiPytorch },
      { label: "Prompt Engineering", Icon: MessageSquareText },
    ],
    spreadDeg: 45,
    scale: 0.86,
    duration: 30,
    reverse: true,
  },
  {
    group: "Infrastructure",
    items: [
      { label: "GCP", Icon: SiGooglecloud },
      { label: "AWS", Icon: FaAws },
      { label: "Docker", Icon: SiDocker },
      { label: "Kubernetes", Icon: SiKubernetes },
      { label: "Kafka", Icon: SiApachekafka },
      { label: "PostgreSQL", Icon: SiPostgresql },
    ],
    spreadDeg: 90,
    scale: 0.72,
    duration: 38,
  },
  {
    group: "Signal & Embedded",
    items: [
      { label: "Signal Processing", Icon: AudioWaveform },
      { label: "Time-Series Analysis", Icon: TrendingUp },
      { label: "Embedded / IoT", Icon: Cpu },
      { label: "Biomedical Signals", Icon: HeartPulse },
    ],
    spreadDeg: 135,
    scale: 0.58,
    duration: 46,
    reverse: true,
  },
];

export default function SkillsOrbit3D() {
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = reduceMotion || !isVisible;

  return (
    <div
      ref={containerRef}
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
                    const Icon = item.Icon;
                    return (
                      <div
                        key={item.label}
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
                                display: "flex",
                                transform: `rotateZ(${-ring.spreadDeg}deg)`,
                              }}
                              title={item.label}
                              aria-label={item.label}
                              role="img"
                              className="h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                            >
                              <Icon className="h-4 w-4" />
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
