import { Layout } from "@/components/Layout";
import { ResearchFileRelay } from "@/components/ResearchFileRelay";
import { projectItems } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected software systems, applied ML, robotics autonomy, computer vision, and product engineering work by Giacomo Cappelletto.",
  pathname: "/projects",
});

const projectShowcase = projectItems.map((project) => ({
  slug: project.slug,
  href: `/projects/${project.slug}`,
  title: project.title,
  summary: project.summary,
  year: project.year,
  type: project.type,
  actionLabel: "View project",
  media: {
    kind: "image" as const,
    src: project.cover.poster ?? project.cover.src,
    alt: project.cover.alt,
    width: project.cover.width,
    height: project.cover.height,
    fit: project.cover.railFit ?? project.cover.fit,
  },
}));

export default function ProjectsPage() {
  return (
    <Layout className="projects-index">
      <ResearchFileRelay
        items={projectShowcase}
        sectionId="projects-relay"
        heading="Projects"
        eyebrow="Project archive"
        description="Software, ML, robotics, and product work shaped by measurable constraints."
        itemNoun="project"
        controlsLabel="Choose project"
        navigationLabel="Project navigation"
      />
    </Layout>
  );
}
