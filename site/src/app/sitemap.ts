import type { MetadataRoute } from "next";
import { projectItems, researchProjects } from "@/content/projects";
import { getNoteSlugs } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/research", "/notes", "/resume"];
  const projectRoutes = projectItems.map(
    (project) => `/projects/${project.slug}`,
  );
  const researchRoutes = researchProjects.map(
    (project) => `/research/${project.slug}`,
  );
  const noteRoutes = getNoteSlugs().map((slug) => `/notes/${slug}`);

  return [...staticRoutes, ...projectRoutes, ...researchRoutes, ...noteRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-07-10"),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
