"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { MousePointerClick } from "lucide-react";

export type TimelineJob = {
  role: string;
  org: string;
  link?: string;
  location: string;
  period: string;
  bullets: string[];
};

const AUTOPLAY_DELAY_MS = 4000;

export default function ExperienceTimeline({ jobs }: { jobs: TimelineJob[] }) {
  const [activeIndex, setActiveIndex] = useState(jobs.length - 1);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause the autoplay loop while off-screen so it doesn't spin in the background.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Loop through the milestones automatically; pause on hover/focus, off-screen,
  // or when the viewer prefers reduced motion. Restarting on every activeIndex
  // change means a manual click naturally resets the timer instead of racing it.
  useEffect(() => {
    if (reduceMotion || !isVisible || isPaused || jobs.length < 2) return;
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % jobs.length);
    }, AUTOPLAY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isVisible, isPaused, reduceMotion, jobs.length]);

  function focusTab(index: number) {
    const clamped = Math.max(0, Math.min(jobs.length - 1, index));
    setActiveIndex(clamped);
    tabRefs.current[clamped]?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(jobs.length - 1);
    }
  }

  function handleSelect(index: number) {
    setActiveIndex(index);
  }

  const active = jobs[activeIndex];
  const progressPct =
    jobs.length > 1 ? (activeIndex / (jobs.length - 1)) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="mt-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <p className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
        <MousePointerClick className="h-3 w-3 text-accent" aria-hidden />
        Click a milestone to explore
      </p>

      <div className="no-scrollbar overflow-x-auto">
        <div
          role="tablist"
          aria-label="Career timeline"
          className="relative flex min-w-[560px] items-start justify-between gap-2 pb-2 sm:min-w-0"
        >
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[7px] h-px bg-border"
          />
          <div
            aria-hidden
            className="absolute left-0 top-[7px] h-px bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />

          {jobs.map((job, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <button
                key={job.org}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`timeline-tab-${i}`}
                aria-selected={isActive}
                aria-controls="timeline-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelect(i)}
                onKeyDown={(event) => handleKeyDown(event, i)}
                className="group relative z-10 flex flex-1 flex-col items-center gap-3 text-center focus:outline-none"
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 ${
                    isActive
                      ? "border-accent bg-accent"
                      : isPast
                        ? "border-accent bg-background"
                        : "border-border bg-background group-hover:border-accent/60"
                  }`}
                />
                <span className="max-w-[120px]">
                  <span
                    className={`block font-display text-xs font-bold transition-colors duration-300 sm:text-sm ${
                      isActive
                        ? "text-accent"
                        : "text-foreground/80 group-hover:text-foreground"
                    }`}
                  >
                    {job.org}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                    {job.period.split("—")[0].trim()}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={activeIndex}
        id="timeline-panel"
        role="tabpanel"
        aria-labelledby={`timeline-tab-${activeIndex}`}
        className="mt-8 grid animate-[timeline-fade-in_0.4s_ease-out] gap-2 border-t border-border pt-8 md:grid-cols-[220px_1fr]"
      >
        <div>
          <h3 className="font-display text-lg font-bold text-accent">
            {active.link ? (
              <a
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-border decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {active.org}
              </a>
            ) : (
              active.org
            )}
          </h3>
          <p className="font-mono text-xs text-muted-foreground">
            {active.period}
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground/70">
            {active.location}
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground">{active.role}</p>
          <ul className="mt-3 space-y-2">
            {active.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
