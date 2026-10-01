"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, Command as CommandIcon } from "lucide-react";
import { SITE } from "@/lib/site";

type Item = {
  id: string;
  label: string;
  hint: string;
  action: () => void;
};

function scrollToSection(hash: string) {
  document
    .querySelector(hash)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const ITEMS: Item[] = [
  {
    id: "top",
    label: "Go to Top",
    hint: "Section",
    action: () => scrollToSection("#top"),
  },
  {
    id: "about",
    label: "Go to About",
    hint: "Section",
    action: () => scrollToSection("#about"),
  },
  {
    id: "work",
    label: "Go to Research & Projects",
    hint: "Section",
    action: () => scrollToSection("#work"),
  },
  {
    id: "experience",
    label: "Go to Experience",
    hint: "Section",
    action: () => scrollToSection("#experience"),
  },
  {
    id: "contact",
    label: "Go to Contact",
    hint: "Section",
    action: () => scrollToSection("#contact"),
  },
  {
    id: "resume",
    label: "Download Résumé",
    hint: "PDF",
    action: () => window.open(SITE.cv, "_blank", "noopener"),
  },
  {
    id: "email",
    label: "Email Mohammad",
    hint: "Mail",
    action: () => {
      window.location.href = `mailto:${SITE.email}`;
    },
  },
  {
    id: "github",
    label: "Open GitHub",
    hint: "External",
    action: () => window.open(SITE.github, "_blank", "noopener,noreferrer"),
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    hint: "External",
    action: () => window.open(SITE.linkedin, "_blank", "noopener,noreferrer"),
  },
];

const LISTBOX_ID = "command-palette-list";

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  // Focus the input on open, lock page scroll, and hand focus back on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, []);

  function run(item: Item) {
    onClose();
    item.action();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) run(item);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog: the input is the only tab stop.
      e.preventDefault();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="electric-border w-full max-w-lg border border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <CommandIcon size={16} aria-hidden className="shrink-0 text-accent" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={LISTBOX_ID}
            aria-activedescendant={
              filtered[activeIndex]
                ? `command-${filtered[activeIndex].id}`
                : undefined
            }
            aria-label="Search commands"
            placeholder="Type a command or search…"
            className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="shrink-0 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <ul
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto py-2"
        >
          {filtered.length === 0 && (
            <li
              role="presentation"
              className="px-4 py-6 text-center font-mono text-xs text-muted-foreground"
            >
              No results
            </li>
          )}
          {filtered.map((item, i) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                id={`command-${item.id}`}
                role="option"
                aria-selected={i === activeIndex}
                tabIndex={-1}
                onClick={() => run(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                  i === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ArrowRight
                    size={13}
                    aria-hidden
                    className={i === activeIndex ? "" : "opacity-40"}
                  />
                  {item.label}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-widest ${
                    i === activeIndex ? "opacity-80" : "text-muted-foreground"
                  }`}
                >
                  {item.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onCustomOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onCustomOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onCustomOpen);
    };
  }, []);

  // The dialog remounts on every open, so its query and selection start fresh.
  return open ? <PaletteDialog onClose={() => setOpen(false)} /> : null;
}
