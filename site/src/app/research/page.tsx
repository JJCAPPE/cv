import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { getProject } from "@/content/projects";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research in human motion understanding, rowing biomechanics, and applied machine learning.",
};

const interests = [
  "Pose estimation",
  "Temporal models",
  "Biomechanics",
  "Representation learning",
  "Multimodal systems",
];

export default function ResearchPage() {
  const project = getProject("rowing-biomechanics");

  if (!project) {
    throw new Error("Rowing research project is missing.");
  }

  const signalMedia =
    project.gallery?.find((media) => media.kind !== "video") ?? project.cover;
  const coverImage = project.cover.poster ?? project.cover.src;

  return (
    <Layout className="research-page">
      <header className="research-hero">
        <div className="research-hero__media">
          <Image
            src={coverImage}
            alt={project.cover.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        <div className="research-hero__content">
          <h1>Human motion, measured from video.</h1>
          <p>
            I build low-cost systems that recover useful biomechanical signals
            from ordinary cameras.
          </p>
        </div>
      </header>

      <section className="research-method">
        <div className="research-method__copy">
          <h2>Current work</h2>
          <p>
            Rowing provides a constrained test domain for pose estimation,
            temporal alignment, kinematic features, and force-curve prediction.
          </p>
          <Link
            href="/projects/rowing-biomechanics"
            className="action-link action-link--accent"
          >
            Case study
          </Link>
        </div>
        <figure className="research-method__media">
          <Image
            src={signalMedia.src}
            alt={signalMedia.alt}
            fill
            sizes="(max-width: 767px) 100vw, 58vw"
          />
        </figure>
      </section>

      <section className="research-interests">
        <h2>Technical interests</h2>
        <div className="research-interests__list">
          {interests.map((interest) => (
            <p key={interest}>{interest}</p>
          ))}
        </div>
      </section>

      <section className="research-outlook">
        <h2>What comes next</h2>
        <p>
          Better temporal models, broader athlete datasets, and evaluation that
          makes uncertainty visible instead of hiding it in one score.
        </p>
      </section>
    </Layout>
  );
}
