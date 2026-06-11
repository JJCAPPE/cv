import Link from "next/link";
import type { Project } from "@/content/projects";
import { LinkPill } from "@/components/LinkPill";

type ProjectItemProps = {
  project: Project;
  index?: number;
};

export function ProjectItem({ project, index }: ProjectItemProps) {
  return (
    <article className="project-item">
      {typeof index === "number" ? (
        <span className="project-item__number">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      <div className="project-item__body">
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="project-item__summary">{project.summary}</p>
        <p className="stack-line">{project.stack.join(" · ")}</p>
        <div className="project-item__links">
          <LinkPill href={`/projects/${project.slug}`}>Case study</LinkPill>
          {project.links.map((link) => (
            <LinkPill key={link.href} href={link.href}>
              {link.label}
            </LinkPill>
          ))}
        </div>
      </div>
      <p className="project-item__year">{project.year}</p>
    </article>
  );
}
