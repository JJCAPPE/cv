import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/ProjectPage";
import { getProject, projectItems } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projectItems.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectRouteProps): Promise<Metadata> {
  const project = getProject((await params).slug);

  if (!project || project.collection !== "project") {
    return {};
  }

  return createPageMetadata({
    title: project.title,
    description: project.summary,
    pathname: `/projects/${project.slug}`,
    type: "article",
    modifiedTime: project.updatedAt,
  });
}

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const project = getProject((await params).slug);

  if (!project || project.collection !== "project") {
    notFound();
  }

  return <ProjectPage project={project} />;
}
