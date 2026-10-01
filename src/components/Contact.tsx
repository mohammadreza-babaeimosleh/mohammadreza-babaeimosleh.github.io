import Reveal from "./Reveal";
import { SITE } from "@/lib/site";

const LINKS = [
  {
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mohammadreza-babaei-mosleh",
    href: SITE.linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/mohammadreza-babaeimosleh",
    href: SITE.github,
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            04 — Contact
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Looking for AI/ML, signal processing, or software engineering
            talent? Let&rsquo;s talk.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Open to AI/ML, signal processing, and software engineering positions
            across France and the EU, starting spring. Reach out directly — I
            read every message.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <ul className="mt-10 grid gap-0 border-t border-border sm:grid-cols-3">
            {LINKS.map((link) => (
              <li
                key={link.label}
                className="border-b border-border sm:border-r sm:last:border-r-0"
              >
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group block h-full p-6 transition-colors hover:bg-card"
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                    {link.label}
                  </p>
                  <p className="mt-2 break-words text-sm text-foreground transition-colors group-hover:text-accent">
                    {link.value}
                    {link.external && (
                      <span className="sr-only"> (opens in a new tab)</span>
                    )}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
