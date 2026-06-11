import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research interests and current work in human motion understanding, rowing biomechanics, and applied machine learning.",
};

const interests = [
  "Pose estimation",
  "Temporal and sequence models",
  "Biomechanics",
  "Representation learning",
  "Multimodal systems",
];

export default function ResearchPage() {
  return (
    <Layout>
      <header className="page-intro">
        <h1>Research</h1>
        <p>
          I’m working on low-cost systems that recover useful biomechanical
          signals from video, with rowing as a constrained test domain.
        </p>
      </header>

      <section className="editorial-section">
        <h2>Projects</h2>
        <div className="research-projects">
          <article>
            <p>Current</p>
            <h3>
              <Link href="/projects/rowing-biomechanics">
                Rowing Biomechanics Pipeline
              </Link>
            </h3>
            <span>
              2D pose, 3D lifting, kinematic features, and stroke-level models.
            </span>
          </article>
          <article>
            <p>Next</p>
            <h3>Video-to-force-curve modeling</h3>
            <span>
              Temporal models aligned with instrumented on-water and erg
              telemetry.
            </span>
          </article>
          <article>
            <p>Future</p>
            <h3>Elite / novice motion comparison</h3>
            <span>
              Representations for coordination, range of motion, and technical
              consistency.
            </span>
          </article>
        </div>
      </section>

      <section className="editorial-section">
        <h2>Technical interests</h2>
        <ul className="interest-list">
          {interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
