"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export default function Spotlight({
  children,
  className = "",
  size = 650,
  opacity = 0.12,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
  opacity?: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, rgba(0, 227, 154, ${opacity}), transparent 80%)`;

  return (
    <div onMouseMove={handleMouseMove} className={`relative ${className}`}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background }}
      />
      {children}
    </div>
  );
}
