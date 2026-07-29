import Image from "next/image";
import Link from "next/link";
import { HorizontalProjectRail } from "@/components/HorizontalProjectRail";
import { ResearchOverviewAnimation } from "@/components/ResearchOverviewAnimation";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { getNotes } from "@/lib/notes";

export default function Home() {
  const notes = getNotes().slice(0, 3);
  const featuredProjects = projects
    .filter((project) => project.featured)
    .map((project) => {
      const selectedCover =
        project.slug === "rowing-biomechanics"
          ? (project.gallery?.find((media) => media.kind !== "video") ??
            project.cover)
          : project.cover;

      return {
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        year: project.year,
        type: project.type,
        cover: {
          src: selectedCover.src,
          alt: selectedCover.alt,
          width: selectedCover.width,
          height: selectedCover.height,
          fit: selectedCover.fit,
        },
      };
    });
  const rowingProject = projects.find(
    (project) => project.slug === "rowing-biomechanics",
  );
  const deskinatorProject = projects.find(
    (project) => project.slug === "deskinator",
  );

  if (!rowingProject || !deskinatorProject) {
    throw new Error("Featured portfolio media is missing.");
  }

  return (
    <main id="main-content" className="home-page" tabIndex={-1}>
      <section id="intro" className="home-hero">
        <div className="home-hero__media" aria-hidden="true">
          <div className="home-hero__media-primary">
            {rowingProject.cover.poster ? (
              <Image
                className="home-hero__poster"
                src={rowingProject.cover.poster}
                alt=""
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) 100vw, 72vw"
              />
            ) : null}
            <video
              className="home-hero__video"
              autoPlay
              disablePictureInPicture
              loop
              muted
              playsInline
              poster={rowingProject.cover.poster}
              preload="metadata"
            >
              <source src={rowingProject.cover.src} type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>
        </div>

        <div className="home-hero__content">
          <h1 className="home-hero__title">
            <span>Giacomo</span>
            <span>Cappelletto</span>
          </h1>
          <div className="home-hero__footer">
            <p>
              I build software, ML systems, and robotics around messy real-world
              data.
            </p>
            <div className="home-hero__actions">
              <a href="#work" className="action-link action-link--accent">
                View work
              </a>
              <Link href="/resume" className="action-link">
                Resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="current" className="current-panel">
        <div className="current-panel__inner">
          <h2 className="current-panel__statement">
            Software is most useful when it survives contact with the real
            world.
          </h2>
          <div className="current-panel__details">
            <p>AI engineering in Milan</p>
            <p>Biomechanics research at Boston University</p>
            <p>Seeking Summer 2027 software and AI roles</p>
          </div>
        </div>
      </section>

      <section id="experience" className="experience-story">
        <header className="experience-story__intro">
          <h2>Experience</h2>
          <p>
            Four environments, from enterprise AI systems to physical sensing
            and product delivery.
          </p>
        </header>

        <div className="experience-stack">
          {experience.map((item) => (
            <article
              className="experience-panel"
              key={`${item.organization}-${item.role}`}
            >
              <div className="experience-panel__meta">
                <p>{item.dates}</p>
                <p>{item.location}</p>
              </div>
              <div className="experience-panel__body">
                <p className="experience-panel__organization">
                  {item.organization}
                </p>
                <h3>{item.role}</h3>
                <p className="experience-panel__summary">{item.summary[0]}</p>
                <p className="experience-panel__stack">
                  {item.stack.slice(0, 6).join(" / ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HorizontalProjectRail projects={featuredProjects} />

      <section id="research" className="research-feature" tabIndex={-1}>
        <div className="research-feature__media research-feature__media--overview">
          <ResearchOverviewAnimation variant="cover" />
        </div>
        <div className="research-feature__content">
          <h2>Can motion survive bad poses?</h2>
          <p>
            My current proposal tests whether neighborhood-aware metric
            learning can preserve motion retrieval when joints jitter,
            disappear, or frames drop—an idea born from failures in the rowing
            pipeline.
          </p>
          <div className="research-feature__actions">
            <Link href="/research" className="action-link action-link--accent">
              Research proposal
            </Link>
            <Link
              href="/projects/rowing-biomechanics"
              className="action-link"
            >
              Rowing origin
            </Link>
          </div>
        </div>
      </section>

      <section id="notes" className="notes-feature">
        <header className="notes-feature__header">
          <h2>Notes</h2>
          <Link href="/notes" className="action-link">
            All notes
          </Link>
        </header>
        <div className="notes-feature__list">
          {notes.map((note) => (
            <article className="notes-feature__item" key={note.slug}>
              <p>
                {note.category} / {note.date}
              </p>
              <h3>
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-poster">
        <p>Summer 2027 software and AI opportunities</p>
        <h2>Let&apos;s build something that has to work.</h2>
        <a
          href="mailto:giacomo.cappelletto@icloud.com"
          className="contact-poster__link"
        >
          Email
        </a>
      </section>
    </main>
  );
}
