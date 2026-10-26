import type { MetadataRoute } from "next";
import { mutlakUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/hesap/" },
    sitemap: mutlakUrl("/sitemap.xml"),
  };
}

// Statik dosya olarak üretilir (GitHub Pages dışa aktarması için gerekli).
export const dynamic = "force-static";
