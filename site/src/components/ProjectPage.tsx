import Link from "next/link";
import type { Project } from "@/content/projects";
import { Layout } from "@/components/Layout";
import { LinkPill } from "@/components/LinkPill";

export function ProjectPage({ project }: { project: Project }) {
  return (
    <Layout>
      <article className="project-page">
        <Link href="/projects" className="back-link">
          ← All projects
        </Link>

        <header className="project-page__hero">
          <h1>{project.title}</h1>
          <p className="project-page__summary">{project.summary}</p>
          <div className="project-page__metadata" aria-label="Project metadata">
            <span>{project.year}</span>
            <span>{project.role}</span>
            <span>{project.stack.join(", ")}</span>
          </div>
          {project.links.length ? (
            <div className="project-page__links">
              {project.links.map((link) => (
                <LinkPill key={link.href} href={link.href}>
                  {link.label}
                </LinkPill>
              ))}
            </div>
          ) : null}
        </header>

        <div className="project-page__content">
          {project.sections.map((section, index) => {
            const sectionNumber = index < 3 ? index + 1 : index + 2;

            return (
              <div key={section.title}>
                <section className="case-section">
                  <header className="case-section__header">
                    <span>{String(sectionNumber).padStart(2, "0")}</span>
                    <h2>{section.title}</h2>
                  </header>
                  <div className="case-section__body">
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="plain-list">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>

                {index === 2 && project.diagram ? (
                  <section className="case-section">
                    <header className="case-section__header">
                      <span>04</span>
                      <h2>System Diagram</h2>
                    </header>
                    <ol
                      className="system-diagram"
                      aria-label={`${project.title} system`}
                    >
                      {project.diagram.map((node, nodeIndex) => (
                        <li key={node}>
                          <span>{String(nodeIndex + 1).padStart(2, "0")}</span>
                          <strong>{node}</strong>
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}
              </div>
            );
          })}
        </div>
      </article>
    </Layout>
  );
}
