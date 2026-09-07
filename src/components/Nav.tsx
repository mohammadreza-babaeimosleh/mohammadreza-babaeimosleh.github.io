"use client";

import { useState } from "react";
import { Command } from "lucide-react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Research & Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight"
        >
          MRBM<span className="text-accent animate-buzz">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            aria-label="Open command palette"
            className="electric-border flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Command size={12} />K
          </button>
          <a
            href="/Mohammad-Reza-Babaei-Mosleh-CV.pdf"
            className="electric-border border border-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Résumé
          </a>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
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
        <nav className="flex flex-col border-t border-border md:hidden">
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
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new Event("open-command-palette"));
            }}
            className="border-b border-border px-6 py-4 text-left font-mono text-sm uppercase tracking-widest text-muted-foreground"
          >
            Search (&#8984;K)
          </button>
          <a
            href="/Mohammad-Reza-Babaei-Mosleh-CV.pdf"
            className="px-6 py-4 font-mono text-sm uppercase tracking-widest text-accent"
          >
            Résumé
          </a>
        </nav>
      )}
    </header>
  );
}
