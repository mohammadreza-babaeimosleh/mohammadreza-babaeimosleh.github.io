import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {SITE.name}
        </p>
        <p>Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
