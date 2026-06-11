import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Education, experience, projects, technical skills, and athletics for Giacomo Cappelletto.",
};

const additionalExperience = [
  {
    role: "Software Engineer",
    organization: "Boston University Men’s Rowing",
    dates: "Jan 2026 — May 2026",
    detail:
      "Built a mobile-first team training tracker with proof-validated entries, configurable requirements, leaderboards, weekly summaries, role-based access, and recap emails using Supabase and Prisma.",
  },
  {
    role: "Full-Stack Developer",
    organization: "Società Cappelletto S.R.L.",
    dates: "Jun 2024 — Present",
    detail:
      "Develop and maintain the original Electron, React, Node.js, Shopify, and Firebase inventory system; distribute releases through GitHub and an auto-updater.",
  },
  {
    role: "Python Developer",
    organization: "H-Farm International School",
    dates: "Apr 2024 — Present",
    detail:
      "Built a Streamlit scheduling tool that reads ManageBac timetables, finds free periods, and drafts meeting requests with local Ollama models.",
  },
  {
    role: "iOS Developer",
    organization: "ASD DLF Treviso",
    dates: "Oct 2023 — Present",
    detail:
      "Built a SwiftUI rowing logbook for training records and progression analysis using Swift Charts.",
  },
];

const skillGroups = [
  {
    label: "Languages",
    value: "TypeScript / JavaScript, Python, Rust, Ruby, C / C++, Swift, Java",
  },
  {
    label: "Frameworks",
    value:
      "Next.js, React, Ruby on Rails, Node.js, Tauri, SwiftUI, TensorFlow / Keras",
  },
  {
    label: "Tools",
    value:
      "Git, Supabase, Prisma, PostgreSQL, Docker, Firebase, Shopify GraphQL, Streamlit, Ollama, Google Cloud Run, Vercel",
  },
];

export default function ResumePage() {
  return (
    <Layout>
      <header className="page-intro resume-intro">
        <h1>Resume</h1>
        <p>
          Computer Engineering student and D1 rowing athlete building
          production software and applied ML systems.
        </p>
        <div className="resume-actions">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            View Resume
          </a>
          <a href="/resume.pdf" download className="text-link">
            Download PDF
          </a>
        </div>
      </header>

      <div className="resume-sheet">
        <section className="resume-section">
          <h2>Education</h2>
          <div className="resume-entry">
            <div>
              <h3>Boston University</h3>
              <p>B.Sc. in Computer Engineering · GPA 3.97</p>
            </div>
            <p>2024 — 2028</p>
          </div>
          <div className="resume-entry">
            <div>
              <h3>H-Farm International School</h3>
              <p>
                International Baccalaureate · HL Mathematics, Physics, Computer
                Science
              </p>
            </div>
            <p>2022 — 2024</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          {experience.map((item) => (
            <div className="resume-entry" key={`${item.organization}-${item.role}`}>
              <div>
                <h3>
                  {item.role} · {item.organization}
                </h3>
                <p>{item.summary.join(" ")}</p>
                <span>{item.stack.join(" · ")}</span>
              </div>
              <p>{item.dates}</p>
            </div>
          ))}
          {additionalExperience.map((item) => (
            <div className="resume-entry" key={`${item.organization}-${item.role}`}>
              <div>
                <h3>
                  {item.role} · {item.organization}
                </h3>
                <p>{item.detail}</p>
              </div>
              <p>{item.dates}</p>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Projects</h2>
          <div className="resume-entry">
            <div>
              <h3>NoteWorthy</h3>
              <p>
                Next.js and TypeScript application converting handwritten notes
                into styled PDFs and LaTeX through Google AI Studio and a
                Dockerized compiler on Cloud Run.
              </p>
            </div>
            <p>2026</p>
          </div>
          <div className="resume-entry">
            <div>
              <h3>CIFAR-10 Neural Architecture Search</h3>
              <p>
                TensorFlow and Keras pipeline generating, training, evaluating,
                and selecting CNN candidates for extended training.
              </p>
            </div>
            <p>2025</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Athletics</h2>
          <div className="resume-entry">
            <div>
              <h3>NCAA Division I Student-Athlete</h3>
              <p>
                Boston University Men’s Rowing · 20+ hours each week across
                training, competition, travel, and team commitments.
              </p>
              <span>
                Freshman Student-Athlete of the Year, 2025 · Most Improved
                Oarsman, 2026
              </span>
            </div>
            <p>2024 — Present</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Skills</h2>
          {skillGroups.map((group) => (
            <div className="resume-skill" key={group.label}>
              <h3>{group.label}</h3>
              <p>{group.value}</p>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
}
