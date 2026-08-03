import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/ProjectPage";
import { getProject, researchProjects } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";

type ResearchRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return researchProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ResearchRouteProps): Promise<Metadata> {
  const project = getProject((await params).slug);

  if (!project || project.collection !== "research") {
    return {};
  }

  return createPageMetadata({
    title: project.title,
    description: project.summary,
    pathname: `/research/${project.slug}`,
    type: "article",
    modifiedTime: project.updatedAt,
  });
}

export default async function ResearchRoute({ params }: ResearchRouteProps) {
  const project = getProject((await params).slug);

  if (!project || project.collection !== "research") {
    notFound();
  }

  return <ProjectPage project={project} />;
}
