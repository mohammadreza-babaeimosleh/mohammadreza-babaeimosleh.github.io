import Reveal from "./Reveal";

const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python (Expert)", "TypeScript / JavaScript", "C / C++", "Bash"],
  },
  {
    group: "AI & ML",
    items: [
      "LangChain / LangGraph",
      "LlamaIndex",
      "RAG Architectures",
      "PyTorch",
      "Prompt Engineering",
    ],
  },
  {
    group: "Infrastructure",
    items: [
      "GCP",
      "AWS",
      "Docker",
      "Kubernetes",
      "Kafka",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
  },
  {
    group: "Signal & Embedded",
    items: [
      "Signal Processing",
      "Time-Series Analysis",
      "STM32CubeIDE",
      "Zephyr RTOS",
      "MATLAB",
    ],
  },
];

export default function About() {
  return (
    <section id="about" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            01 — About
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Software engineering fundamentals, applied to hard AI problems.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.1fr_1fr]">
          <Reveal delay={100}>
            <div className="space-y-5 text-muted-foreground">
              <p>
                I&rsquo;m a Master&rsquo;s student at{" "}
                <span className="text-foreground">
                  Institut Polytechnique de Paris
                </span>
                , specializing in Machine Learning, Communications &amp;
                Security, with 3+ years of professional experience spanning
                AI engineering, full-stack development, and signal &amp;
                information processing.
              </p>
              <p>
                I&rsquo;ve architected LLM-powered platforms with agentic
                workflows and RAG pipelines, led teams of engineers, and
                shipped scalable backend systems on GCP and AWS. My research
                sits at the intersection of machine learning and biomedical
                signal processing — currently focused on unsupervised gait
                representation learning for Parkinson&rsquo;s disease
                detection.
              </p>
              <p>
                I care about systems that work in production, not just in a
                notebook — and I&rsquo;m currently looking for a research or
                engineering internship in AI/ML, signal processing, or
                medical AI.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid gap-6 sm:grid-cols-2">
              {SKILLS.map((group) => (
                <div key={group.group}>
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-accent">
                    {group.group}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-b border-border pb-2 text-sm text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
