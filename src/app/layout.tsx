import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

// Tüm site JSON'dan build sırasında üretilir; sunucuda istek anında render olmamalı.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.marka}: OYSS rehberi ve yazılı soruları`, template: `%s | ${site.marka}` },
  description: site.aciklama,
  openGraph: { siteName: site.marka, locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${literata.variable} ${manrope.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
