import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type ProjectItemProps = {
  project: Project;
  index?: number;
};

export function ProjectItem({ project, index }: ProjectItemProps) {
  const order = index ?? 0;

  return (
    <article className="project-card" data-project-card>
      <Link
        href={`/projects/${project.slug}`}
        className="project-card__link"
        aria-label={`View ${project.title} project`}
      >
        <figure className="project-card__media">
          <Image
            src={project.cover.poster ?? project.cover.src}
            alt={project.cover.alt}
            fill
            loading={order === 0 ? "eager" : undefined}
            fetchPriority={order === 0 ? "high" : undefined}
            sizes="100vw"
          />
        </figure>
        <div className="project-card__caption">
          <p>
            {project.year} / {project.type}
          </p>
          <h2>{project.title}</h2>
          <p className="project-card__summary">{project.summary}</p>
        </div>
      </Link>
    </article>
  );
}
