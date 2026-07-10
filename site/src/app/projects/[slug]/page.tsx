import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/ProjectPage";
import { getProject, projects } from "@/content/projects";

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectRouteProps): Promise<Metadata> {
  const project = getProject((await params).slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const project = getProject((await params).slug);

  if (!project) {
    notFound();
  }

  return <ProjectPage project={project} />;
}
