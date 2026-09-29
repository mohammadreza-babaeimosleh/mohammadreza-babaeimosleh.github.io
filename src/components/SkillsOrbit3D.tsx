"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
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
  color: string;
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
    color: "#60a5fa",
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
    color: "#c084fc",
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
    color: "#fb923c",
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
    color: "#f472b6",
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
    <div>
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-[300px]"
        style={{ perspective: "1200px" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="electric-border absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card">
            <Code2 className="h-4 w-4 text-accent" aria-hidden />
          </div>

          {RINGS.map((ring) => (
            <div
              key={ring.group}
              className="pointer-events-none absolute inset-0"
              style={{
                transform: `scale(${ring.scale})`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  transform: `rotateZ(${ring.spreadDeg}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    transform: `rotateX(${TILT_DEG}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full border border-dashed"
                    style={{ borderColor: `${ring.color}4d` }}
                  />

                  <div
                    className="pointer-events-none absolute inset-0"
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
                          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
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
                                style={
                                  {
                                    display: "flex",
                                    transform: `rotateZ(${-ring.spreadDeg}deg)`,
                                    "--chip-color": ring.color,
                                  } as CSSProperties
                                }
                                title={item.label}
                                aria-label={item.label}
                                role="img"
                                className="skill-chip h-8 w-8 items-center justify-center rounded-md border bg-background/90 backdrop-blur-sm"
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

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {RINGS.map((ring) => (
          <div key={ring.group} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ring.color }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {ring.group}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
