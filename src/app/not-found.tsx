import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center px-6 py-20"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        404 — Page not found
      </p>
      <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-bold tracking-tight sm:text-6xl">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
        The link may be broken or the page may have moved. Head back to the
        homepage to find what you were looking for.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-block border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
