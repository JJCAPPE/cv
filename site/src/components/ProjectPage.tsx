import Image from "next/image";
import Link from "next/link";
import { DeskinatorCaseStudy } from "@/components/DeskinatorCaseStudy";
import { Layout } from "@/components/Layout";
import { MoveProjectStory } from "@/components/MoveProjectStory";
import type { Project } from "@/content/projects";
import { projects } from "@/content/projects";

export function ProjectPage({ project }: { project: Project }) {
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const isDeskinator = project.slug === "deskinator";
  const isMove = project.slug === "move";

  return (
    <Layout className="project-page-shell">
      <article className="project-page">
        <header className="project-page__hero">
          <Link href="/projects" className="back-link">
            All projects
          </Link>
          <p className="project-page__type">
            {project.year} / {project.type}
          </p>
          <h1>{project.title}</h1>
          <p className="project-page__summary">{project.summary}</p>
          <div className="project-page__actions">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="action-link action-link--accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <figure className="project-page__cover">
          <div className="project-page__cover-image">
            <Image
              className={
                project.cover.fit === "contain" ? "media-contain" : undefined
              }
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="100vw"
            />
          </div>
          {project.cover.caption ? (
            <figcaption>{project.cover.caption}</figcaption>
          ) : null}
        </figure>

        <dl className="project-page__facts">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.join(" / ")}</dd>
          </div>
        </dl>

        {project.metrics?.length ? (
          <dl
            className="project-page__metrics"
            aria-label={`${project.title} project facts`}
          >
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
                {metric.note ? <dd>{metric.note}</dd> : null}
              </div>
            ))}
          </dl>
        ) : null}

        <div className="project-page__chapters">
          {project.sections.map((section, index) => {
            const media =
              isDeskinator || isMove ? undefined : project.gallery?.[index];

            return (
              <div className="project-chapter-group" key={section.title}>
                <section className="project-chapter">
                  <h2>{section.title}</h2>
                  <div className="project-chapter__body">
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="plain-list" role="list">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>

                {media ? (
                  <figure className="project-inline-media">
                    <div className="project-inline-media__image">
                      <Image
                        className={
                          media.fit === "contain" ? "media-contain" : undefined
                        }
                        src={media.src}
                        alt={media.alt}
                        fill
                        sizes="(max-width: 767px) 100vw, 82vw"
                      />
                    </div>
                    {media.caption ? (
                      <figcaption>{media.caption}</figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </div>
            );
          })}
        </div>

        {isMove ? (
          <MoveProjectStory />
        ) : isDeskinator ? (
          <DeskinatorCaseStudy />
        ) : project.diagram ? (
          <section className="project-system">
            <h2>System</h2>
            <ol aria-label={`${project.title} system flow`} role="list">
              {project.diagram.map((node) => (
                <li key={node}>{node}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <nav className="next-project" aria-label="Next project">
          <p>Next project</p>
          <Link href={`/projects/${nextProject.slug}`}>
            {nextProject.title}
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
