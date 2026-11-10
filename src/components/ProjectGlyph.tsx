"use client";

import { useEffect, useRef, useState } from "react";

export type GlyphKind = "listings" | "try-on" | "gait" | "malware";

/** Repeats a relative zig-zag so a trace can scroll by one period seamlessly. */
function periodicTrace(
  startY: number,
  period: [number, number][],
  repeats: number,
) {
  let d = `M 0 ${startY}`;
  for (let k = 0; k < repeats; k++) {
    for (const [dx, dy] of period) d += ` l ${dx} ${dy}`;
  }
  return d;
}

const SHIRT =
  "M10 0 L0 8 L6 16 L10 13 V40 H34 V13 L38 16 L44 8 L34 0 Q22 9 10 0 Z";

/** PropertyGPT: a scan sweeps a row of listings and keeps the matches lit. */
function ListingsGlyph() {
  const matches = new Set([1, 4, 8]);
  const sweep = 4; // seconds, must match glyph-scan in globals.css
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const x = 20 + i * 37;
        return (
          <g key={i} transform={`translate(${x} 24)`}>
            <path
              d="M0 12 L12 2 L24 12 V32 H0 Z M9 32 V22 H15 V32"
              className={
                matches.has(i) ? "glyph-listing-match" : "glyph-listing"
              }
              style={{
                animationDelay: `${(((x + 12) / 400) * sweep).toFixed(2)}s`,
              }}
            />
          </g>
        );
      })}
      <g className="glyph-scan">
        <rect
          x="-44"
          y="8"
          width="44"
          height="64"
          fill="url(#glyph-scan-trail)"
        />
        <rect x="-1" y="8" width="1.5" height="64" className="fill-accent" />
      </g>
      <defs>
        <linearGradient id="glyph-scan-trail" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#00e39a" stopOpacity="0" />
          <stop offset="1" stopColor="#00e39a" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </>
  );
}

/** BeforeAI: a garment leaves the rail and is fitted onto the figure. */
function TryOnGlyph() {
  return (
    <>
      {/* Garment rail */}
      <path d="M36 15 H150" className="stroke-border" />
      {[44, 82].map((x) => (
        <g key={x} transform={`translate(${x} 18) scale(0.5)`}>
          <path d={SHIRT} className="stroke-muted-foreground" strokeWidth="2" />
        </g>
      ))}
      <g transform="translate(121 18) scale(0.5)">
        <path
          d={SHIRT}
          className="stroke-border"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </g>

      {/* Figure */}
      <circle cx="200" cy="13" r="6" className="stroke-muted-foreground" />
      <path d="M200 19 V24 M190 64 V76 M210 64 V76" className="stroke-border" />
      <g transform="translate(178 24)">
        <path d={SHIRT} className="stroke-border" strokeDasharray="3 3" />
      </g>
      <g className="glyph-garment">
        <path d={SHIRT} className="fill-accent/15 stroke-accent" />
      </g>

      {/* Fit parameters: style, body type, skin tone */}
      {[26, 40, 54].map((y, i) => (
        <g key={y}>
          <path d={`M272 ${y} H362`} className="stroke-border" />
          <circle
            cx="290"
            cy={y}
            r="3.5"
            className={`glyph-knob glyph-knob-${i} fill-accent`}
          />
        </g>
      ))}
    </>
  );
}

/** WearGait-PD: IMU gait channels streaming through the model's window. */
function GaitGlyph() {
  const primary = periodicTrace(
    32,
    [
      [8, 0],
      [5, -20],
      [5, 34],
      [5, -22],
      [6, 10],
      [10, -6],
      [10, 6],
      [31, -2],
    ],
    7,
  );
  const secondary = periodicTrace(
    60,
    [
      [12, 0],
      [8, -8],
      [8, 14],
      [8, -9],
      [14, 5],
      [30, -2],
    ],
    7,
  );
  return (
    <>
      <g className="glyph-stream">
        <path d={secondary} className="stroke-muted-foreground" opacity="0.6" />
        <path d={primary} className="stroke-accent" strokeWidth="1.5" />
        {Array.from({ length: 7 }, (_, k) => (
          <circle
            key={k}
            cx={13 + k * 80}
            cy={12}
            r="2"
            className="fill-accent"
          />
        ))}
      </g>
      {/* Analysis window */}
      <rect
        x="150"
        y="5"
        width="100"
        height="70"
        className="glyph-window fill-accent/5 stroke-accent"
        strokeDasharray="5 4"
      />
    </>
  );
}

/** IoT malware: a binary rendered as pixels, convolved through shrinking stages. */
function MalwareGlyph() {
  const cols = 14;
  const rows = 4;
  const pitch = 14;
  const flagged = new Set(["8-1", "9-1", "9-2", "10-2", "3-0", "4-3"]);
  return (
    <>
      {Array.from({ length: cols * rows }, (_, n) => {
        const i = n % cols;
        const j = Math.floor(n / cols);
        const isFlagged = flagged.has(`${i}-${j}`);
        const shade = 0.12 + (((i * 7 + j * 13 + i * j * 3) % 10) / 10) * 0.5;
        return (
          <rect
            key={n}
            x={24 + i * pitch}
            y={13 + j * pitch}
            width="11"
            height="11"
            className={
              isFlagged ? "glyph-flagged fill-accent" : "fill-muted-foreground"
            }
            opacity={isFlagged ? undefined : shade.toFixed(2)}
            style={
              isFlagged
                ? { animationDelay: `${(i * 0.3).toFixed(1)}s` }
                : undefined
            }
          />
        );
      })}
      <rect
        x="22"
        y="11"
        width="43"
        height="43"
        className="glyph-kernel stroke-accent"
        strokeWidth="1.5"
      />

      {/* Stages shrink toward a verdict */}
      <path
        d="M228 40 H246 M286 40 H292 M318 40 H326 M344 40 H354"
        className="stroke-border"
      />
      {[
        [250, 18, 34, 44],
        [294, 26, 22, 28],
        [328, 32, 14, 16],
      ].map(([x, y, w, h], i) => (
        <g key={x}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            className="glyph-stage fill-accent"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            className="stroke-muted-foreground"
          />
        </g>
      ))}
      <circle cx="364" cy="40" r="5" className="glyph-verdict fill-accent" />
    </>
  );
}

const GLYPHS: Record<GlyphKind, () => React.JSX.Element> = {
  listings: ListingsGlyph,
  "try-on": TryOnGlyph,
  gait: GaitGlyph,
  malware: MalwareGlyph,
};

/**
 * A small looping illustration of what a project does. Decorative, so hidden
 * from assistive tech; it only animates while it is on screen.
 */
export default function ProjectGlyph({
  kind,
  className = "",
}: {
  kind: GlyphKind;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Glyph = GLYPHS[kind];

  return (
    <div
      ref={ref}
      aria-hidden
      className={`project-glyph ${running ? "is-running" : ""} ${
        kind === "gait" ? "project-glyph-faded" : ""
      } ${className}`}
    >
      <svg viewBox="0 0 400 80" fill="none" className="block w-full">
        <Glyph />
      </svg>
    </div>
  );
}
