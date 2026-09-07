"use client";

import { useEffect, useRef } from "react";

export default function GlitchImage({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const img = new Image();

    let width = 0;
    let height = 0;
    let ready = false;
    let raf = 0;
    let burstTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function getCoverRect() {
      const imageAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = width / height;
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (imageAspect > boxAspect) {
        sw = img.naturalHeight * boxAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / boxAspect;
        sy = (img.naturalHeight - sh) / 2;
      }
      return { sx, sy, sw, sh };
    }

    function drawPixelated(blockSize: number) {
      const { sx, sy, sw, sh } = getCoverRect();
      ctx!.clearRect(0, 0, width, height);
      if (blockSize <= 1) {
        ctx!.imageSmoothingEnabled = true;
        ctx!.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        return;
      }
      const smallW = Math.max(1, Math.round(width / blockSize));
      const smallH = Math.max(1, Math.round(height / blockSize));
      const off = document.createElement("canvas");
      off.width = smallW;
      off.height = smallH;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, smallW, smallH);
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(off, 0, 0, smallW, smallH, 0, 0, width, height);
    }

    function drawClean() {
      const { sx, sy, sw, sh } = getCoverRect();
      ctx!.clearRect(0, 0, width, height);
      ctx!.imageSmoothingEnabled = true;
      ctx!.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
    }

    function drawGlitchFrame() {
      const { sx, sy, sw, sh } = getCoverRect();
      ctx!.clearRect(0, 0, width, height);
      const jitterX = (Math.random() - 0.5) * 5;
      const jitterY = (Math.random() - 0.5) * 3;
      ctx!.imageSmoothingEnabled = true;
      ctx!.drawImage(img, sx, sy, sw, sh, jitterX, jitterY, width, height);

      const bands = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < bands; i++) {
        const bandH = 8 + Math.random() * 18;
        const bandY = Math.random() * Math.max(1, height - bandH);
        const shift = (Math.random() - 0.5) * 18;
        const srcBandY = sy + (bandY / height) * sh;
        const srcBandH = (bandH / height) * sh;
        ctx!.drawImage(
          img,
          sx,
          srcBandY,
          sw,
          srcBandH,
          shift,
          bandY,
          width,
          bandH,
        );
      }

      ctx!.fillStyle = "rgba(0, 227, 154, 0.07)";
      ctx!.fillRect(0, 0, width, height);
    }

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ready) drawClean();
    }

    function scheduleBurst() {
      if (cancelled) return;
      const delay = 2600 + Math.random() * 2600;
      burstTimeout = setTimeout(runBurst, delay);
    }

    function runBurst() {
      if (cancelled) return;
      const burstDuration = 160 + Math.random() * 120;
      let start: number | null = null;
      function step(ts: number) {
        if (start === null) start = ts;
        const elapsed = ts - start;
        drawGlitchFrame();
        if (elapsed < burstDuration && !cancelled) {
          raf = requestAnimationFrame(step);
        } else {
          drawClean();
          scheduleBurst();
        }
      }
      raf = requestAnimationFrame(step);
    }

    function runReveal() {
      const duration = 1000;
      let start: number | null = null;
      function step(ts: number) {
        if (start === null) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const blockSize = Math.max(1, Math.round(28 * (1 - eased)));
        drawPixelated(blockSize);
        if (progress < 1 && !cancelled) {
          raf = requestAnimationFrame(step);
        } else {
          drawClean();
          scheduleBurst();
        }
      }
      raf = requestAnimationFrame(step);
    }

    img.onload = () => {
      ready = true;
      resize();
      if (reduceMotion) {
        drawClean();
      } else {
        runReveal();
      }
    };
    img.src = src;

    window.addEventListener("resize", resize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(burstTimeout);
      window.removeEventListener("resize", resize);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
