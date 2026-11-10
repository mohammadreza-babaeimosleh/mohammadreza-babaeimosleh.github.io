"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * End of the journey: the outlined wordmark charges with the accent colour as
 * the footer scrolls into view, closing the circuit the signal rail started.
 */
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;

    function update() {
      raf = 0;
      const footer = footerRef.current;
      const fill = fillRef.current;
      if (!footer || !fill) return;
      const rect = footer.getBoundingClientRect();
      const progress = Math.min(
        Math.max((window.innerHeight - rect.top) / rect.height, 0),
        1,
      );
      fill.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <footer ref={footerRef} className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex flex-col items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 transition-colors hover:text-accent"
          >
            Back to top
            <ArrowUp size={12} aria-hidden />
          </a>
        </div>

        <div aria-hidden className="footer-wordmark mt-6 select-none">
          <span className="footer-wordmark-outline">MRBM.</span>
          <span
            ref={fillRef}
            className="footer-wordmark-fill"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            MRBM<span className="footer-wordmark-dot">.</span>
          </span>
        </div>

        <p className="pb-8 pt-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:text-left">
          Built with Next.js &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
