import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import Nav from "@/components/Nav";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Mohammad Reza Babaei Mosleh",
  description:
    "Mohammad Reza Babaei Mosleh — ML Engineer & Researcher. AI systems, signal processing, and biomedical machine learning. M2 student at Institut Polytechnique de Paris.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Nav />
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
