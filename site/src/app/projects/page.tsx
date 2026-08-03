import { Layout } from "@/components/Layout";
import { ProjectItem } from "@/components/ProjectItem";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { projectItems } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected software systems, applied ML, robotics autonomy, computer vision, and product engineering work by Giacomo Cappelletto.",
  pathname: "/projects",
});

export default function ProjectsPage() {
  return (
    <Layout className="projects-index">
      <ProjectsShowcase projectCount={projectItems.length}>
        {projectItems.map((project, index) => (
          <ProjectItem key={project.slug} project={project} index={index} />
        ))}
      </ProjectsShowcase>
    </Layout>
  );
}
