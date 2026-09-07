"use client";

import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01アイウエオカキクケコ";

export default function TextScramble({
  text,
  className = "",
  duration = 900,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  duration?: number;
  startDelay?: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setDisplay(text);
      return;
    }

    let raf = 0;
    const len = text.length;

    function frame(startTime: number, ts: number) {
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * len);

      let out = "";
      for (let i = 0; i < len; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i < revealCount) {
          out += text[i];
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);

      if (progress < 1) {
        raf = requestAnimationFrame((next) => frame(startTime, next));
      } else {
        setDisplay(text);
      }
    }

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame((ts) => frame(ts, ts));
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, duration, startDelay]);

  return <span className={className}>{display}</span>;
}
