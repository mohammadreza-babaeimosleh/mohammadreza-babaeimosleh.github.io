"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent } from "react";

type Project = {
  title: string;
  period: string;
  status: string;
  description: string;
  bullets: string[];
  tags: string[];
};

const PROJECTS: Project[] = [
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
  },
  {
    title: "AI Styling & Virtual Try-On Platform",
    period: "2025",
    status: "Shipped",
    description:
      "White-label platform bringing virtual try-on, AI styling, and an AI studio to fashion retailers of any size.",
    bullets: [
      "Virtual try-on engine handling belt placement, layered garments, and anatomical distortion — built to scale across any retailer's catalog",
      "AI styling assistant matching catalog products to a customer's desired style, body type, and skin tone using real styling expertise",
      "AI Studio module for image editing, model generation, and professional-grade photoshoot production",
    ],
    tags: ["Computer Vision", "FastAPI", "Cloud Run", "E-Commerce"],
  },
  {
    title: "WearGait-PD",
    period: "2025 — Present",
    status: "Paper in preparation",
    description:
      "Unsupervised gait representation learning for Parkinson's disease classification.",
    bullets: [
      "BiLSTM sequence autoencoder trained on 286-channel IMU data from 185 subjects (100 PD, 85 control) across 8 clinical tasks",
      "Outperforms prior models in this research direction with a novel signal-processing approach that enables reliable classification across clinical gait experiments",
    ],
    tags: ["PyTorch", "Signal Processing", "Unsupervised Learning", "Biomedical AI"],
  },
  {
    title: "IoT Malware Classification",
    period: "2024",
    status: "Published",
    description:
      "An efficient cloud-integrated multi-stage CNN framework for IoT malware classification.",
    bullets: [
      "Designed a multi-stage convolutional architecture built for cloud deployment at scale",
      "Matched the accuracy of far larger architectures using roughly 1/100th the parameters, cutting compute and memory requirements accordingly",
    ],
    tags: ["Deep Learning", "Cloud", "Security"],
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(0, 227, 154, 0.14), transparent 70%)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      onMouseMove={handleMouseMove}
      className="group relative h-full overflow-hidden border border-border bg-card p-6 transition-colors hover:border-accent md:p-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-2">
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
            <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
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
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            02 — Research &amp; Projects
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Selected work.
          </h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
