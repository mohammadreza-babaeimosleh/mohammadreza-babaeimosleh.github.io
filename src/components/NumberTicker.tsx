"use client";

import { useEffect, useRef, useState } from "react";

type NumberTickerProps = {
  value: string;
  duration?: number;
  className?: string;
};

// Splits "3+" -> ["", "3", "+"], "M2" -> ["M", "2", ""], "2" -> ["", "2", ""]
function splitValue(value: string): [string, number, string] | null {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  return [prefix, parseInt(numStr, 10), suffix];
}

export default function NumberTicker({
  value,
  duration = 1400,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = splitValue(value);
  const [display, setDisplay] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!parsed) return;
    const [prefix, target, suffix] = parsed;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const node = ref.current;
    if (!node) return;

    // Start from zero once hydrated; the server-rendered markup keeps the real value.
    let frame = requestAnimationFrame(() => {
      setAnimating(true);
      setDisplay(`${prefix}0${suffix}`);
    });
    let hasStarted = false;

    const runAnimation = () => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        setDisplay(`${prefix}${current}${suffix}`);
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        } else {
          setAnimating(false);
        }
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {animating && <span className="sr-only">{value}</span>}
      <span aria-hidden={animating || undefined}>{display}</span>
    </span>
  );
}
