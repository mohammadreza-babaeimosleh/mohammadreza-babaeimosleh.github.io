import Reveal from "./Reveal";

const LINKS = [
  {
    label: "Email",
    value: "babaeimoslehmohammadreza@gmail.com",
    href: "mailto:babaeimoslehmohammadreza@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mohammadreza-babaei-mosleh",
    href: "https://linkedin.com/in/mohammadreza-babaei-mosleh",
  },
  {
    label: "GitHub",
    value: "github.com/mohammadreza-babaeimosleh",
    href: "https://github.com/mohammadreza-babaeimosleh",
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
            Open to AI/ML, signal processing, and software engineering
            positions across France and the EU, starting spring. Reach out
            directly — I read every message.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 grid gap-0 border-t border-border sm:grid-cols-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noreferrer" : undefined}
                className="group border-b border-r border-border p-6 transition-colors last:border-r-0 hover:bg-card sm:border-b-0"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                  {link.label}
                </p>
                <p className="mt-2 break-words text-sm text-foreground transition-colors group-hover:text-accent">
                  {link.value}
                </p>
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Mohammad Reza Babaei Mosleh</p>
          <p>Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </footer>
    </section>
  );
}
