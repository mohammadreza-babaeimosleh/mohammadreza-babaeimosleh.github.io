"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, Command as CommandIcon } from "lucide-react";

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

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(
    () => [
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
        action: () =>
          window.open("/Mohammad-Reza-Babaei-Mosleh-CV.pdf", "_blank"),
      },
      {
        id: "email",
        label: "Email Mohammad",
        hint: "Mail",
        action: () => {
          window.location.href = "mailto:babaeimoslehmohammadreza@gmail.com";
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: "External",
        action: () =>
          window.open(
            "https://github.com/mohammadreza-babaeimosleh",
            "_blank",
            "noreferrer",
          ),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "External",
        action: () =>
          window.open(
            "https://linkedin.com/in/mohammadreza-babaei-mosleh",
            "_blank",
            "noreferrer",
          ),
      },
    ],
    [],
  );

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase()),
  );

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

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
      return () => {
        cancelAnimationFrame(id);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function handleKeyNav(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) {
        item.action();
        setOpen(false);
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="electric-border w-full max-w-lg border border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <CommandIcon size={16} className="shrink-0 text-accent" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyNav}
            placeholder="Type a command or search..."
            className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="shrink-0 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center font-mono text-xs text-muted-foreground">
              No results
            </li>
          )}
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
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
