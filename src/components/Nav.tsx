"use client";

import { useEffect, useState } from "react";
import { Command } from "lucide-react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Research & Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

function openCommandPalette() {
  window.dispatchEvent(new Event("open-command-palette"));
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // Highlight the link of the section currently crossing the middle of the viewport.
  useEffect(() => {
    const sections = LINKS.map((link) =>
      document.getElementById(link.href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    const hero = document.getElementById("top");
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveId("");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          aria-label={`${SITE.name} — back to top`}
          className="font-display text-lg font-bold tracking-tight"
        >
          MRBM<span className="text-accent animate-buzz">.</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const active = activeId === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "location" : undefined}
                className={`border-b pb-0.5 font-mono text-xs uppercase tracking-widest transition-colors hover:text-foreground ${
                  active
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="electric-border flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Command size={12} aria-hidden />K
          </button>
          <a
            href={SITE.cv}
            className="electric-border border border-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Résumé
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-border md:hidden"
        >
          <span
            className={`h-px w-5 bg-foreground transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-foreground transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="flex flex-col border-t border-border md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border px-6 py-4 font-mono text-sm uppercase tracking-widest"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCommandPalette();
            }}
            className="border-b border-border px-6 py-4 text-left font-mono text-sm uppercase tracking-widest text-muted-foreground"
          >
            Search (&#8984;K)
          </button>
          <a
            href={SITE.cv}
            className="px-6 py-4 font-mono text-sm uppercase tracking-widest text-accent"
          >
            Résumé
          </a>
        </nav>
      )}
    </header>
  );
}
