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
    <Layout>
      <header className="page-intro">
        <h1>Projects</h1>
        <p>
          Software, ML, robotics, and product work selected for technical depth
          and measurable constraints.
        </p>
      </header>
      <div className="ruled-list">
        {projects.map((project, index) => (
          <ProjectItem key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Layout>
  );
}
