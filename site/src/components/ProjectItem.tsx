import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type ProjectItemProps = {
  project: Project;
  index?: number;
};

export function ProjectItem({ project, index }: ProjectItemProps) {
  const order = index ?? 0;
  const desktopSizes = ["42vw", "42vw", "34vw", "58vw", "50vw", "34vw"];

  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} className="project-card__link">
        <figure className="project-card__media">
          <Image
            className={
              project.cover.fit === "contain" ? "media-contain" : undefined
            }
            src={project.cover.poster ?? project.cover.src}
            alt=""
            fill
            loading={order === 0 ? "eager" : undefined}
            fetchPriority={order === 0 ? "high" : undefined}
            sizes={`(max-width: 767px) 100vw, ${desktopSizes[order % desktopSizes.length]}`}
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
