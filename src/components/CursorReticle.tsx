"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a, button, [role='button'], [role='option'], input, textarea, select, summary, label, .skill-chip, canvas";

/**
 * A reticle that trails the pointer and locks on (turns into an accent
 * diamond) over anything clickable. The native cursor stays visible, so this
 * is purely an accent; it never appears on touch devices.
 */
export default function CursorReticle() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let placed = false;

    function render() {
      raf = 0;
      // Ease toward the pointer; stop the loop once it has caught up.
      const ease = reduceMotion ? 1 : 0.22;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1) {
        x = targetX;
        y = targetY;
      } else {
        raf = requestAnimationFrame(render);
      }
      el!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!placed) {
        placed = true;
        x = targetX;
        y = targetY;
      }
      el!.dataset.visible = "true";
      const target = e.target instanceof Element ? e.target : null;
      el!.dataset.active = target?.closest(INTERACTIVE) ? "true" : "false";
      if (!raf) raf = requestAnimationFrame(render);
    }

    function onDown() {
      el!.dataset.pressed = "true";
    }
    function onUp() {
      el!.dataset.pressed = "false";
    }
    function onLeave() {
      el!.dataset.visible = "false";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="cursor-reticle">
      <div className="cursor-reticle-box">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
