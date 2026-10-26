import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UyelikSaglayici } from "@/components/uyelik/UyelikSaglayici";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "5, 6 ve 7. Sınıf Matematik Yazılı Soruları", template: "%s | Atomica" },
  description: site.aciklama,
  openGraph: { siteName: site.marka, locale: "tr_TR", type: "website" },
  icons: { icon: site.atomica.favicon },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <UyelikSaglayici>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </UyelikSaglayici>
      </body>
    </html>
  );
}
