import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/checkout", "/login", "/register", "/forgot-password", "/reset-password"],
    },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
