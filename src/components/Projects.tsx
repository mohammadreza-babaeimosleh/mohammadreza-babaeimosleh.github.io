import Reveal from "./Reveal";

type Project = {
  title: string;
  period: string;
  status: string;
  description: string;
  bullets: string[];
  tags: string[];
  featured?: boolean;
};

const PROJECTS: Project[] = [
  {
    title: "WearGait-PD",
    period: "2025 — Present",
    status: "Paper in preparation",
    description:
      "Unsupervised gait representation learning for Parkinson's disease classification.",
    bullets: [
      "BiLSTM sequence autoencoder trained on 286-channel IMU data from 185 subjects (100 PD, 85 control) across 8 clinical tasks",
      "Mean ROC-AUC 0.884 (peak 0.899 on TandemGait), outperforming a Conv-Window baseline",
      "Identified that recording duration — not PD/control status — drives reconstruction-error correlation, ruling out a key confound",
    ],
    tags: ["PyTorch", "Signal Processing", "Unsupervised Learning", "Biomedical AI"],
    featured: true,
  },
  {
    title: "PropertyGPT",
    period: "Jun 2023 — Jun 2026",
    status: "Production",
    description:
      "End-to-end AI-powered real estate platform for personalized home search and investment tours.",
    bullets: [
      "LLM-driven insight extraction via LangGraph + LlamaIndex agentic workflows",
      "RAG pipeline optimization achieving ~2x improvement in response speed",
      "Data pipeline over 3M+ real estate listings, 10x faster after optimization",
      "Led a team of 7 engineers within a 20+ person cross-functional org",
    ],
    tags: ["LangGraph", "LlamaIndex", "FastAPI", "Kubernetes", "GCP/AWS"],
    featured: true,
  },
  {
    title: "AI Virtual Try-On",
    period: "2025",
    status: "Shipped",
    description:
      "Production virtual try-on feature for an e-commerce fashion platform.",
    bullets: [
      "Prompt-engineered FLUX.1 Kontext to fix real failure modes: belt placement, layered garments, anatomical distortion",
      "FastAPI + GCP Cloud Run backend wrapping Vertex AI's virtual-try-on model",
      "Solved regional access issues with a custom proxy layer for image delivery",
    ],
    tags: ["Generative AI", "Computer Vision", "FastAPI", "Cloud Run"],
  },
  {
    title: "IoT Malware Classification",
    period: "2024",
    status: "Published",
    description:
      "An efficient cloud-integrated multi-stage CNN framework for IoT malware classification.",
    bullets: [
      "Co-authored with S. Sharifian",
      "Multi-stage convolutional architecture designed for cloud deployment at scale",
    ],
    tags: ["Deep Learning", "Cloud", "Security"],
  },
];

export default function Projects() {
  return (
    <section id="work" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            02 — Research &amp; Projects
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Selected work.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={i * 100}>
              <article
                className={`group h-full border border-border bg-card p-6 transition-colors hover:border-accent md:p-8 ${
                  project.featured ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold sm:text-2xl">
                    {project.title}
                  </h3>
                  <span className="border border-accent px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {project.period}
                </p>
                <p className="mt-4 text-foreground">{project.description}</p>
                <ul className="mt-4 space-y-2">
                  {project.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
