import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Proplan Klima - Originální řešení pro Vaši nemovitost",
    template: "%s | Proplan Klima",
  },
  description:
    "Proplan Klima - projekce, návrh a realizace klimatizací, vzduchotechniky a tepelných čerpadel. Rychlost, přesnost a flexibilita řešení pro Vaši nemovitost.",
  metadataBase: new URL("https://www.proplan-klima.cz"),
  openGraph: {
    title: "Proplan Klima - Originální řešení pro Vaši nemovitost",
    description:
      "Projekce a realizace klimatizací, vzduchotechniky a tepelných čerpadel. Hranice, Olomoucký kraj.",
    url: "https://www.proplan-klima.cz",
    siteName: "Proplan Klima",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ScrollReveal />
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
