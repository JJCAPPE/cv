import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexableDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexableDeployment
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
