import { ExperienceItem } from "@/components/ExperienceItem";
import { LinkPill } from "@/components/LinkPill";
import { NotePreview } from "@/components/NotePreview";
import { ProjectItem } from "@/components/ProjectItem";
import { Section } from "@/components/Section";
import { Sidebar } from "@/components/Sidebar";
import { StatusBlock } from "@/components/StatusBlock";
import { WorkVector } from "@/components/WorkVector";
import { experience } from "@/content/experience";
import { primaryLinks } from "@/content/links";
import { projects } from "@/content/projects";
import { getNotes } from "@/lib/notes";

export default function Home() {
  const notes = getNotes().slice(0, 4);

  return (
    <main className="home-shell">
      <Sidebar />

      <div className="home-content">
        <header className="mobile-identity">
          <h1>Giacomo Cappelletto</h1>
          <p>Computer Engineering @ Boston University</p>
          <p>D1 Varsity Rowing</p>
          <p>Software · ML · Systems</p>
        </header>

        <Section number="01" title="Intro" id="intro" className="intro-section">
          <h1 className="hero-title">
            I build software systems and applied ML tools around real data.
          </h1>
          <p className="hero-copy">
            I’m Giacomo Cappelletto, a Computer Engineering student at Boston
            University building software, data systems, and applied ML tools.
            My work sits between full-stack engineering, backend infrastructure,
            and computer vision for human motion analysis. I also compete in
            Division I rowing at BU.
          </p>
          <div className="mobile-links" aria-label="Profile links">
            {primaryLinks.map((link) => (
              <LinkPill key={link.label} href={link.href}>
                {link.label}
              </LinkPill>
            ))}
          </div>
          <WorkVector />
        </Section>

        <Section number="02" title="Current Focus" id="current">
          <StatusBlock />
        </Section>

        <Section number="03" title="Selected Work" id="work">
          <div className="ruled-list">
            {projects.map((project, index) => (
              <ProjectItem
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>
          <div className="section-link">
            <LinkPill href="/projects">View all project details →</LinkPill>
          </div>
        </Section>

        <Section number="04" title="Experience" id="experience">
          <div className="ruled-list">
            {experience.map((item) => (
              <ExperienceItem
                key={`${item.organization}-${item.role}`}
                experience={item}
              />
            ))}
          </div>
        </Section>

        <Section number="05" title="Research" id="research">
          <p className="section-lead">
            I’m interested in systems that turn noisy human motion into
            measurable, useful representations.
          </p>
          <ul className="interest-list">
            <li>Human motion understanding</li>
            <li>Computer vision for biomechanics</li>
            <li>Sequence modeling from kinematics</li>
            <li>Applied ML for athletic performance</li>
            <li>Data systems for high-signal decision workflows</li>
          </ul>
          <div className="section-link">
            <LinkPill href="/research">Research overview →</LinkPill>
          </div>
        </Section>

        <Section number="06" title="Notes" id="notes">
          <div className="ruled-list">
            {notes.map((note) => (
              <NotePreview key={note.slug} note={note} />
            ))}
          </div>
          <div className="section-link">
            <LinkPill href="/notes">All notes →</LinkPill>
          </div>
        </Section>

        <Section number="07" title="Contact" id="contact">
          <p className="contact-copy">
            I’m looking for software and AI internship opportunities for Summer
            2027. The most direct way to reach me is{" "}
            <LinkPill href="mailto:giacomo.cappelletto@icloud.com">
              email
            </LinkPill>
            .
          </p>
          <div className="contact-links">
            {primaryLinks.map((link) => (
              <LinkPill key={link.label} href={link.href}>
                {link.label}
              </LinkPill>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
