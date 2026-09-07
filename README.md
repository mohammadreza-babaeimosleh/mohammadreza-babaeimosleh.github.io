# Personal Website — Mohammad Reza Babaei Mosleh

Source for [mohammadreza-babaeimosleh.github.io](https://mohammadreza-babaeimosleh.github.io), built with Next.js (App Router, static export), TypeScript, and Tailwind CSS v4.

## Stack

- Next.js 16 (static export, `output: "export"`)
- TypeScript
- Tailwind CSS v4
- Self-hosted fonts via Fontsource (Space Grotesk, Inter, JetBrains Mono) — no external font requests at build or runtime
- Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs static site to ./out
npm run lint
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow, which builds the site and publishes `./out` to GitHub Pages automatically. Enable Pages once under **Settings → Pages → Build and deployment → Source: GitHub Actions** on the repo.
