import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { ProjectItem } from "@/components/ProjectItem";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected software systems, applied ML, robotics autonomy, computer vision, and product engineering work by Giacomo Cappelletto.",
};

export default function ProjectsPage() {
  return (
    <Layout className="projects-index">
      <header className="page-intro projects-intro">
        <h1>Projects</h1>
        <p>
          Software, ML, robotics, and product work shaped by measurable
          constraints.
        </p>
      </header>
      <div className="project-gallery">
        {projects.map((project, index) => (
          <ProjectItem key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Layout>
  );
}
