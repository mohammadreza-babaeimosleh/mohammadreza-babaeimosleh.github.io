"use client";

import { useEffect, useRef, useState } from "react";

const STOPS = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

// The trace alternates between two lanes, jogging at 45° like a PCB track.
const LANES = [6, 18];
const JOG = LANES[1] - LANES[0];
const LAST = STOPS.length - 1;

function laneX(i: number) {
  return LANES[i % 2];
}

function buildTrace(height: number) {
  const step = height / LAST;
  let d = `M ${laneX(0)} 0`;
  for (let i = 0; i < LAST; i++) {
    const mid = (i + 0.5) * step;
    d += ` L ${laneX(i)} ${mid - JOG / 2} L ${laneX(i + 1)} ${mid + JOG / 2} L ${laneX(i + 1)} ${(i + 1) * step}`;
  }
  return d;
}

/** Horizontal position of the trace at a given distance down the rail. */
function traceX(y: number, height: number) {
  const step = height / LAST;
  const i = Math.min(Math.floor(y / step), LAST - 1);
  const mid = (i + 0.5) * step;
  const t = Math.min(Math.max((y - (mid - JOG / 2)) / JOG, 0), 1);
  return laneX(i) + (laneX(i + 1) - laneX(i)) * t;
}

/** Scroll offsets at which each section counts as "reached". */
function measure() {
  const viewport = window.innerHeight;
  const max = Math.max(document.documentElement.scrollHeight - viewport, 0);
  const y = window.scrollY;
  const anchors = STOPS.map((stop, i) => {
    const el = document.getElementById(stop.id);
    if (i === 0 || !el) return 0;
    const top = el.getBoundingClientRect().top + y - viewport * 0.4;
    return Math.min(max, Math.max(0, top));
  });
  // Guard against sections that are out of order or shorter than the viewport.
  for (let i = 1; i < anchors.length; i++) {
    anchors[i] = Math.max(anchors[i], anchors[i - 1]);
  }
  return { anchors, max, y };
}

type ScrollTimelineCtor = new (options: {
  source: Element;
  axis: "block";
}) => AnimationTimeline;

function getScrollTimeline(): ScrollTimelineCtor | undefined {
  return (window as unknown as { ScrollTimeline?: ScrollTimelineCtor })
    .ScrollTimeline;
}

/**
 * The page's journey line: a circuit trace in the left gutter that charges as
 * you scroll, with a pad per section. Below the xl breakpoint there is no
 * gutter, so it collapses to a thin progress bar at the top of the viewport.
 *
 * Everything that moves is a `transform`, and where the browser supports
 * scroll-driven animations the transforms are bound straight to the scroll
 * position. That keeps the trace in step with the page even when the main
 * thread is busy (the 3D skills orbit used to make a script-driven version
 * stall and then jump). Browsers without scroll timelines get the same motion
 * from a scroll listener.
 */
export default function SignalRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const chargeRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(Math.round(entry.contentRect.height)),
    );
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodes = [
      clipRef.current,
      chargeRef.current,
      headRef.current,
      barRef.current,
    ];
    if (nodes.some((node) => node === null)) return;
    const [clip, charge, head, bar] = nodes as HTMLElement[];

    const ScrollTimeline = getScrollTimeline();
    let animations: Animation[] = [];
    let rebuildFrame = 0;

    // Bind the moving parts to the scroll position (compositor-driven).
    function bind() {
      rebuildFrame = 0;
      animations.forEach((animation) => animation.cancel());
      animations = [];
      const { anchors, max } = measure();
      if (!ScrollTimeline || max <= 0) return;

      const timeline = new ScrollTimeline({
        source: document.documentElement,
        axis: "block",
      });
      const options = { timeline, fill: "both" as const };

      animations.push(
        bar.animate(
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          options,
        ),
      );
      if (height <= 0) return;

      const step = height / LAST;
      const clipFrames: Keyframe[] = [];
      const chargeFrames: Keyframe[] = [];
      const headFrames: Keyframe[] = [];

      // The charged trace is revealed by sliding a clipping box down while its
      // content slides up by the same amount, so the trace itself stays put.
      function push(offset: number, y: number) {
        clipFrames.push({
          offset,
          transform: `translateY(${y - height}px)`,
        });
        chargeFrames.push({
          offset,
          transform: `translateY(${height - y}px)`,
        });
        headFrames.push({
          offset,
          transform: `translate(${traceX(y, height)}px, ${y}px)`,
        });
      }

      for (let i = 0; i < LAST; i++) {
        const from = anchors[i] / max;
        const span = (anchors[i + 1] - anchors[i]) / max;
        const mid = (i + 0.5) * step;
        // Pad, then the start and end of the 45° jog to the next lane.
        for (const y of [i * step, mid - JOG / 2, mid + JOG / 2]) {
          push(from + span * ((y - i * step) / step), y);
        }
      }
      push(anchors[LAST] / max, height);
      if (anchors[LAST] < max) push(1, height);

      animations.push(
        clip.animate(clipFrames, options),
        charge.animate(chargeFrames, options),
        head.animate(headFrames, options),
      );
    }

    // Light the pads, and drive the motion by hand where timelines are missing.
    function onScroll() {
      const { anchors, max, y } = measure();

      let current = LAST;
      let progress = 1;
      if (max - y > 2) {
        for (let i = 0; i < LAST; i++) {
          if (y < anchors[i + 1]) {
            const span = anchors[i + 1] - anchors[i];
            progress = (i + (span > 0 ? (y - anchors[i]) / span : 1)) / LAST;
            current = i;
            break;
          }
        }
      }
      setActive(current);

      if (ScrollTimeline) return;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      if (height <= 0) return;
      const railY = progress * height;
      clip.style.transform = `translateY(${railY - height}px)`;
      charge.style.transform = `translateY(${height - railY}px)`;
      head.style.transform = `translate(${traceX(railY, height)}px, ${railY}px)`;
    }

    function scheduleBind() {
      if (!rebuildFrame) rebuildFrame = requestAnimationFrame(bind);
    }

    bind();
    onScroll();

    // Section offsets move whenever the page's height changes (fonts, images,
    // the experience timeline swapping entries), so re-bind when it does.
    const pageObserver = new ResizeObserver(() => {
      scheduleBind();
      onScroll();
    });
    pageObserver.observe(document.body);
    window.addEventListener("resize", scheduleBind);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rebuildFrame);
      animations.forEach((animation) => animation.cancel());
      pageObserver.disconnect();
      window.removeEventListener("resize", scheduleBind);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [height]);

  const trace = height > 0 ? buildTrace(height) : "";

  return (
    // Mouse-only enhancement: the header nav already covers keyboard and screen-reader navigation.
    <div aria-hidden>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 xl:hidden">
        <div ref={barRef} className="signal-bar h-full origin-left bg-accent" />
      </div>

      <div
        ref={railRef}
        className="signal-rail fixed bottom-14 top-28 z-40 hidden w-6 xl:block"
      >
        <svg
          width="24"
          height={height}
          className="absolute inset-0 overflow-visible"
          fill="none"
        >
          <path d={trace} className="stroke-border" />
        </svg>

        <div ref={clipRef} className="signal-rail-clip">
          <div ref={chargeRef} className="signal-rail-charge">
            <svg
              width="24"
              height={height}
              className="overflow-visible"
              fill="none"
            >
              <path d={trace} className="stroke-accent" />
            </svg>
          </div>
        </div>

        <span ref={headRef} className="signal-rail-head" />

        {STOPS.map((stop, i) => {
          const reached = i <= active;
          return (
            <a
              key={stop.id}
              href={`#${stop.id}`}
              tabIndex={-1}
              className="group absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: laneX(i), top: `${(i / LAST) * 100}%` }}
            >
              <span
                className={`signal-rail-pad ${reached ? "is-reached" : ""} ${
                  i === active ? "is-active" : ""
                }`}
              />
              <span
                className={`signal-rail-label ${
                  i === active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stop.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
