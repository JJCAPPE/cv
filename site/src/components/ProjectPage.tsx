import Image from "next/image";
import Link from "next/link";
import { ActivityVideo } from "@/components/ActivityVideo";
import { BiomimeticAiCaseStudy } from "@/components/BiomimeticAiCaseStudy";
import { DeskinatorCaseStudy } from "@/components/DeskinatorCaseStudy";
import { InventoryCaseStudy } from "@/components/InventoryCaseStudy";
import { Layout } from "@/components/Layout";
import { MoveProjectStory } from "@/components/MoveProjectStory";
import { NoteWorthyCaseStudy } from "@/components/NoteWorthyCaseStudy";
import { RowingCaseStudy } from "@/components/RowingCaseStudy";
import { TickitCaseStudy } from "@/components/TickitCaseStudy";
import type { Project } from "@/content/projects";
import { projectItems } from "@/content/projects";
import { researchShowcase } from "@/content/research";

export function ProjectPage({ project }: { project: Project }) {
  const isResearch = project.collection === "research";
  const collectionItems = isResearch ? researchShowcase : projectItems;
  const itemIndex = collectionItems.findIndex(
    (item) => item.slug === project.slug,
  );
  const itemPosition = String(itemIndex + 1).padStart(2, "0");
  const collectionSize = String(collectionItems.length).padStart(2, "0");
  const nextItem = collectionItems[(itemIndex + 1) % collectionItems.length];
  const collectionHref = isResearch ? "/research" : "/projects";
  const collectionLabel = isResearch ? "research" : "projects";
  const nextItemHref =
    isResearch && "href" in nextItem
      ? nextItem.href
      : `/projects/${nextItem.slug}`;
  const isBiomimeticAi = project.slug === "biomimetic-ai";
  const isDeskinator = project.slug === "deskinator";
  const isInventory = project.slug === "inventory-system";
  const isMove = project.slug === "move";
  const isNoteWorthy = project.slug === "ai-notes-or-ocr";
  const isRowing = project.slug === "rowing-biomechanics";
  const isTickit = project.slug === "tickit";
  const caseStudyRendersCover =
    isBiomimeticAi ||
    isDeskinator ||
    isInventory ||
    isMove ||
    isNoteWorthy ||
    isTickit;

  return (
    <Layout className="project-page-shell">
      <article className="project-page">
        <header className="project-page__hero">
          <Link href={collectionHref} className="back-link">
            All {collectionLabel}
          </Link>
          <div className="project-page__meta">
            <p className="project-page__type">
              {project.year} / {project.type}
            </p>
            <p className="project-page__position">
              {isResearch ? "Research" : "Project"} {itemPosition} /{" "}
              {collectionSize}
            </p>
          </div>
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

        {!caseStudyRendersCover ? (
          <figure className="project-page__cover">
            {project.cover.kind === "video" ? (
              <div className="project-page__cover-video-frame">
                <ActivityVideo
                  className="project-page__cover-video"
                  poster={project.cover.poster}
                  src={project.cover.src}
                  ariaLabel={project.cover.alt}
                />
              </div>
            ) : (
              <div className="project-page__cover-image">
                <Image
                  className={
                    project.cover.fit === "contain"
                      ? "media-contain"
                      : undefined
                  }
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  sizes="100vw"
                />
              </div>
            )}
            {project.cover.caption ? (
              <figcaption>{project.cover.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <dl className="project-page__facts">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>{project.stackLabel ?? "Stack"}</dt>
            <dd>{project.stack.join(" / ")}</dd>
          </div>
        </dl>

        {project.metrics?.length ? (
          <dl
            className="project-page__metrics"
            aria-label={`${project.title} facts`}
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
              isBiomimeticAi ||
              isDeskinator ||
              isInventory ||
              isMove ||
              isNoteWorthy ||
              isRowing ||
              isTickit
                ? undefined
                : project.gallery?.[index];

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

        {isTickit ? (
          <TickitCaseStudy />
        ) : isBiomimeticAi ? (
          <BiomimeticAiCaseStudy project={project} />
        ) : isRowing ? (
          <RowingCaseStudy project={project} />
        ) : isNoteWorthy ? (
          <NoteWorthyCaseStudy project={project} />
        ) : isMove ? (
          <MoveProjectStory />
        ) : isDeskinator ? (
          <DeskinatorCaseStudy />
        ) : isInventory ? (
          <InventoryCaseStudy />
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

        {collectionItems.length > 1 ? (
          <nav
            className="next-project"
            aria-label={`Next ${isResearch ? "research item" : "project"}`}
          >
            <p>Next {isResearch ? "research" : "project"}</p>
            <Link href={nextItemHref}>{nextItem.title}</Link>
          </nav>
        ) : null}
      </article>
    </Layout>
  );
}
