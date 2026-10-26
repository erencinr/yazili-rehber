import type { NextConfig } from "next";

// GitHub Pages derlemesi: düz HTML olarak dışa aktarılır ve /<repo>/ alt yolunda yayınlanır.
// Örnek: PAGES_BASE_PATH=/yazili-rehber npm run build  →  out/ klasörü
// Not: Cache Components bilinçli olarak kapalı; statik dışa aktarmayla (PPR) uyumlu değil
// ve tüm sayfalar zaten build sırasında generateStaticParams ile üretiliyor.
const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  trailingSlash: true,
  ...(pagesBasePath !== undefined && {
    output: "export",
    basePath: pagesBasePath,
  }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
