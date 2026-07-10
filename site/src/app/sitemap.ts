import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getNoteSlugs } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/research", "/notes", "/resume"];
  const projectRoutes = projects.map(
    (project) => `/projects/${project.slug}`,
  );
  const noteRoutes = getNoteSlugs().map((slug) => `/notes/${slug}`);

  return [...staticRoutes, ...projectRoutes, ...noteRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-07-10"),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
