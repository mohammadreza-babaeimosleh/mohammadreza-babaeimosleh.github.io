import Reveal from "./Reveal";

const EXPERIENCE = [
  {
    role: "Software Developer & AI Engineer",
    org: "PropertyGPT",
    period: "Jun 2023 — Jun 2026",
    bullets: [
      "Architected an end-to-end AI real estate platform with agentic LLM workflows (LangGraph, LlamaIndex)",
      "Built RESTful services with FastAPI, containerized with Docker, orchestrated via Kubernetes on GCP/AWS",
      "Led a team of 7 engineers: task allocation, code review, technical delivery",
    ],
  },
  {
    role: "Embedded Systems & AI Engineer",
    org: "NikTed",
    period: "Jul 2023 — Sep 2023",
    bullets: [
      "Optimized frequency-based signal amplification for home-care hearing aid hardware",
      "Built a computer-vision pipeline to detect and count white blood cells for early disease screening",
      "Programmed embedded firmware with STM32CubeIDE and Zephyr RTOS",
    ],
  },
  {
    role: "AI Engineer & Database Administrator",
    org: "IthermAI",
    period: "Jul 2022 — Feb 2023",
    bullets: [
      "Curated large-scale image datasets for an industrial smoke/fire detection system",
      "Designed database schemas and ingestion workflows for model training pipelines",
    ],
  },
];

const EDUCATION = [
  {
    degree: "M2, Information Processing — ML, Communications & Security",
    school: "Institut Polytechnique de Paris",
    period: "2026 — Present",
  },
  {
    degree: "M1, Electrical Engineering for Communications & Info. Processing",
    school: "Institut Polytechnique de Paris · GPA 17.4/20",
    period: "2025 — 2026",
  },
  {
    degree: "B.Sc., Electrical & Computer Engineering (AI minor)",
    school: "Amirkabir University of Technology · GPA 3.83/4",
    period: "2019 — 2024",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                03 — Experience
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Where I&rsquo;ve worked.
              </h2>
            </div>
            <a
              href="/Mohammad-Reza-Babaei-Mosleh-CV.pdf"
              className="border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90"
            >
              Download Full Résumé
            </a>
          </div>
        </Reveal>

        <div className="mt-10 space-y-0">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.org} delay={i * 100}>
              <div className="grid gap-2 border-t border-border py-8 md:grid-cols-[220px_1fr]">
                <div>
                  <h3 className="font-display text-lg font-bold">{job.org}</h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {job.period}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{job.role}</p>
                  <ul className="mt-3 space-y-2">
                    {job.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="mt-16 font-mono text-xs uppercase tracking-widest text-accent">
            Education
          </h3>
          <div className="mt-6 space-y-0">
            {EDUCATION.map((edu) => (
              <div
                key={edu.degree}
                className="grid gap-1 border-t border-border py-5 last:border-b md:grid-cols-[160px_1fr]"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {edu.period}
                </p>
                <div>
                  <p className="text-foreground">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
