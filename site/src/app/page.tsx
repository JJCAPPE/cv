import Image from "next/image";
import Link from "next/link";
import { HorizontalProjectRail } from "@/components/HorizontalProjectRail";
import { HorizontalResearchRail } from "@/components/HorizontalResearchRail";
import { experience } from "@/content/experience";
import { projectItems } from "@/content/projects";
import { researchShowcase } from "@/content/research";
import { getNotes } from "@/lib/notes";

export default function Home() {
  const notes = getNotes().slice(0, 3);
  const featuredProjects = projectItems
    .filter((project) => project.featured)
    .map((project) => {
      const selectedCover =
        project.slug === "rowing-biomechanics"
          ? {
              src: "/media/projects/rowing-biomechanics/full-tracking.png",
              alt: "Side-view rowing frame with full-body pose landmarks, face and hand tracking, ergometer detection, joint angles, and a 3D pose inset.",
              width: 2726,
              height: 1676,
              fit: "cover" as const,
            }
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
          railFit: project.cover.railFit,
          railLayout: project.cover.railLayout,
        },
      };
    });
  const rowingProject = projectItems.find(
    (project) => project.slug === "rowing-biomechanics",
  );
  const deskinatorProject = projectItems.find(
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
          <div className="home-hero__orientation" aria-hidden="true">
            <span>Software / ML / Robotics</span>
            <span>01 / Intro</span>
          </div>
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
          <ol className="current-panel__details" aria-label="Current focus">
            <li>AI engineering in Milan</li>
            <li>Biomechanics research at Boston University</li>
            <li>Seeking Summer 2027 software and AI roles</li>
          </ol>
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
          {experience.map((item, index) => (
            <article
              className="experience-panel"
              key={`${item.organization}-${item.role}`}
            >
              <div className="experience-panel__meta">
                <span className="experience-panel__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(experience.length).padStart(2, "0")}
                </span>
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

      <HorizontalResearchRail items={researchShowcase} />

      <section id="notes" className="notes-feature" tabIndex={-1}>
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
