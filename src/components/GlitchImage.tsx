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
    let redLayer: HTMLCanvasElement | null = null;
    let cyanLayer: HTMLCanvasElement | null = null;

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

    // Pre-render duotone "channel" layers once per size, so per-frame
    // glitch drawing is just cheap drawImage calls, not pixel math.
    function prepareChannelLayers() {
      if (width <= 0 || height <= 0) return;
      const { sx, sy, sw, sh } = getCoverRect();

      const base = document.createElement("canvas");
      base.width = width;
      base.height = height;
      const baseCtx = base.getContext("2d");
      if (!baseCtx) return;
      baseCtx.filter = "grayscale(1) contrast(1.2)";
      baseCtx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

      function tint(color: string) {
        const layer = document.createElement("canvas");
        layer.width = width;
        layer.height = height;
        const lctx = layer.getContext("2d");
        if (!lctx) return layer;
        lctx.drawImage(base, 0, 0);
        lctx.globalCompositeOperation = "multiply";
        lctx.fillStyle = color;
        lctx.fillRect(0, 0, width, height);
        return layer;
      }

      redLayer = tint("#ff2b4d");
      cyanLayer = tint("#19e8ff");
    }

    function drawGlitchFrame(elapsed: number) {
      const { sx, sy, sw, sh } = getCoverRect();

      // Trailing smear instead of a hard clear — previous frame bleeds
      // through faintly, reading as lag rather than a clean redraw.
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
      ctx!.filter = "none";
      ctx!.fillStyle = "rgba(10, 10, 11, 0.22)";
      ctx!.fillRect(0, 0, width, height);

      const phase = elapsed / 130;
      const wobble = Math.sin(phase) * 12;
      const jitterX = wobble + (Math.random() - 0.5) * 9;
      const jitterY = (Math.random() - 0.5) * 6;

      ctx!.globalAlpha = 0.9;
      ctx!.drawImage(img, sx, sy, sw, sh, jitterX, jitterY, width, height);

      // Chromatic phase split: red/cyan duotone layers drifting apart
      // and back together out of sync, like a signal losing lock.
      const splitAmount = 8 + Math.abs(Math.sin(phase * 0.55)) * 18;
      ctx!.globalCompositeOperation = "screen";
      ctx!.globalAlpha = 0.72;
      if (redLayer) {
        ctx!.drawImage(redLayer, jitterX - splitAmount, jitterY - 2);
      }
      if (cyanLayer) {
        ctx!.drawImage(cyanLayer, jitterX + splitAmount, jitterY + 2);
      }
      ctx!.globalCompositeOperation = "source-over";
      ctx!.globalAlpha = 1;

      // Slice tears
      const bands = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < bands; i++) {
        const bandH = 10 + Math.random() * 42;
        const bandY = Math.random() * Math.max(1, height - bandH);
        const shift = (Math.random() - 0.5) * 60;
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

      // Occasional large block tear for a heavier, more "corrupted
      // codec" moment within the burst.
      if (Math.random() < 0.35) {
        const blockH = height * (0.18 + Math.random() * 0.22);
        const blockY = Math.random() * Math.max(1, height - blockH);
        const blockShift = (Math.random() - 0.5) * 90;
        const srcBlockY = sy + (blockY / height) * sh;
        const srcBlockH = (blockH / height) * sh;
        ctx!.drawImage(
          img,
          sx,
          srcBlockY,
          sw,
          srcBlockH,
          blockShift,
          blockY,
          width,
          blockH,
        );
      }

      ctx!.fillStyle = "rgba(0, 227, 154, 0.1)";
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
      if (ready) {
        prepareChannelLayers();
        drawClean();
      }
    }

    function scheduleBurst() {
      if (cancelled) return;
      const delay = 1800 + Math.random() * 1800;
      burstTimeout = setTimeout(runBurst, delay);
    }

    function runBurst() {
      if (cancelled) return;
      const burstDuration = 700 + Math.random() * 500;
      let start: number | null = null;
      let holdUntil = 0;

      function step(ts: number) {
        if (start === null) start = ts;
        const elapsed = ts - start;

        // Occasional lag stutter: freeze the current frame briefly
        // instead of redrawing every tick, then snap forward again.
        if (ts < holdUntil) {
          if (elapsed < burstDuration && !cancelled) {
            raf = requestAnimationFrame(step);
          } else {
            drawClean();
            scheduleBurst();
          }
          return;
        }
        if (Math.random() < 0.1) {
          holdUntil = ts + 60 + Math.random() * 90;
        }

        drawGlitchFrame(elapsed);

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
      const duration = 1500;
      let start: number | null = null;
      function step(ts: number) {
        if (start === null) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        // Gentler, closer-to-linear falloff so the pixelation stays
        // visible for most of the duration instead of snapping sharp
        // early — keeps this in step with the text scramble, which
        // stays unresolved until its very last frame.
        const eased = 1 - Math.pow(1 - progress, 1.3);
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
      prepareChannelLayers();
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
