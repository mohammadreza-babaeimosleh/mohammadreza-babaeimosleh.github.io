import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import CommandPalette from "@/components/CommandPalette";
import { SITE } from "@/lib/site";

const DESCRIPTION =
  "ML engineer, software engineer and researcher building AI systems that ship — LLM platforms, RAG pipelines, signal processing and biomedical machine learning. M2 student at Institut Polytechnique de Paris.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ML Engineer & Researcher`,
    template: `%s | ${SITE.name}`,
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    "machine learning engineer",
    "software engineer",
    "signal processing",
    "biomedical AI",
    "LLM",
    "RAG",
    "Institut Polytechnique de Paris",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: `${SITE.name} — ML Engineer & Researcher`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ML Engineer & Researcher`,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  jobTitle: "ML Engineer & Researcher",
  alumniOf: [
    "Institut Polytechnique de Paris",
    "Amirkabir University of Technology",
  ],
  sameAs: [SITE.github, SITE.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        {children}
        <CommandPalette />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </body>
    </html>
  );
}
