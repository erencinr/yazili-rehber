import type { NextConfig } from "next";

// Statik derleme (GitHub Pages veya atomica.com.tr/yazili): düz HTML olarak dışa aktarılır ve alt yolda yayınlanır.
// Örnek: BASE_PATH=/yazili npm run build  →  out/ klasörü
// Not: Cache Components bilinçli olarak kapalı; statik dışa aktarmayla (PPR) uyumlu değil
// ve tüm sayfalar zaten build sırasında generateStaticParams ile üretiliyor.
const pagesBasePath = process.env.BASE_PATH;

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
