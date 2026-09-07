import Reveal from "./Reveal";

const STATS = [
  { value: "3+", label: "Years Experience" },
  { value: "0.884", label: "ROC-AUC, WearGait-PD" },
  { value: "3M+", label: "Listings Processed" },
  { value: "17.4/20", label: "M.Sc. GPA" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 border border-border px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Open to AI/ML &amp; Signal Processing Internships
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Mohammad Reza
            <br />
            Babaei Mosleh
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            ML engineer &amp; researcher building AI systems that ship —
            from LLM-powered platforms and RAG pipelines to biomedical
            signal processing for Parkinson&rsquo;s disease detection.
          </p>
          <p className="mt-2 max-w-xl font-mono text-sm text-muted-foreground">
            M2 student, Institut Polytechnique de Paris — Machine Learning,
            Communications &amp; Security
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#work"
              className="border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90"
            >
              View Research &amp; Projects
            </a>
            <a
              href="#contact"
              className="border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-foreground"
            >
              Get In Touch
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs border border-border bg-card md:ml-auto">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="font-display text-4xl font-bold text-accent">
                MB
              </span>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Photo coming soon
              </p>
            </div>
            <div className="absolute -bottom-3 -right-3 h-full w-full border border-accent/40 -z-10" />
          </div>
        </Reveal>
      </div>

      <Reveal>
        <dl className="grid grid-cols-2 divide-x divide-border border-t border-border md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-6 py-6 text-center md:text-left">
              <dt className="font-display text-2xl font-bold sm:text-3xl">
                {stat.value}
              </dt>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
