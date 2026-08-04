import type { MetadataRoute } from "next";
import { projectItems } from "@/content/projects";
import { researchShowcase } from "@/content/research";
import { getNotes } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

function latestDate(dates: string[]) {
  return dates.reduce<string | undefined>(
    (latest, date) => (!latest || date > latest ? date : latest),
    undefined,
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getNotes();
  const researchLastModified = latestDate(
    researchShowcase.map((item) => item.updatedAt),
  );
  const homeLastModified = latestDate([
    ...projectItems
      .filter((project) => project.featured)
      .map((project) => project.updatedAt),
    ...researchShowcase.map((item) => item.updatedAt),
    ...notes.slice(0, 3).map((note) => note.updatedAt),
  ]);
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: homeLastModified,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: latestDate(
        projectItems.map((project) => project.updatedAt),
      ),
    },
    {
      url: absoluteUrl("/research"),
      lastModified: researchLastModified,
    },
    {
      url: absoluteUrl("/notes"),
      lastModified: latestDate(notes.map((note) => note.updatedAt)),
    },
    {
      url: absoluteUrl("/resume"),
    },
  ];
  const projectRoutes: MetadataRoute.Sitemap = projectItems.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: project.updatedAt,
  }));
  const researchRoutes: MetadataRoute.Sitemap = researchShowcase.map((item) => ({
    url: absoluteUrl(item.href),
    lastModified: item.updatedAt,
  }));
  const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
    url: absoluteUrl(`/notes/${note.slug}`),
    lastModified: note.updatedAt,
  }));

  return [...staticRoutes, ...projectRoutes, ...researchRoutes, ...noteRoutes];
}
