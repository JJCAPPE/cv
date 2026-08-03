import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { ProjectItem } from "@/components/ProjectItem";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected software systems, applied ML, robotics autonomy, computer vision, and product engineering work by Giacomo Cappelletto.",
};

export default function ProjectsPage() {
  return (
    <Layout className="projects-index">
      <ProjectsShowcase projectCount={projects.length}>
        {projects.map((project, index) => (
          <ProjectItem key={project.slug} project={project} index={index} />
        ))}
      </ProjectsShowcase>
    </Layout>
  );
}
