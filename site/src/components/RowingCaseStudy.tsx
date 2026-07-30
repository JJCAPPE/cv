import Image from "next/image";
import type { Project } from "@/content/projects";
import styles from "./RowingCaseStudy.module.css";

const architectureFlows = [
  {
    eyebrow: "01 / Training and evaluation",
    title: "Build trustworthy labeled strokes.",
    description:
      "Two imperfect clocks and two different sampling domains have to agree before a model sees a single example.",
    inputs: [
      {
        label: "Side-view video",
        detail:
          "Sports2D landmarks, MotionBERT 3D lift, tracked handle geometry, and detected catch/finish events.",
      },
      {
        label: "RP3 telemetry",
        detail:
          "Distance-indexed force samples cleaned in their native 2.2 cm bins and resampled onto normalized drive progress.",
      },
    ],
    steps: [
      {
        label: "Canonicalize",
        detail:
          "Mirror the active side consistently and build the shared 64 × 14 angle, derivative, handle-velocity, and handle-acceleration tensor.",
      },
      {
        label: "Match and quality-gate",
        detail:
          "Two-pass calibration and dynamic programming align strokes; hard caps, masks, QC flags, pins, and exclusions preserve uncertainty.",
      },
      {
        label: "Train behind a baseline gate",
        detail:
          "Stage 0 metadata Ridge, Stage A summary models, and Stage B TCN/Transformer models are compared under time-, session-, or athlete-held-out splits.",
      },
    ],
    output: {
      label: "Versioned model bundle",
      detail:
        "Feature order, progress grid, normalization, decomposition, weights, manifest, and git SHA travel together.",
    },
  },
  {
    eyebrow: "02 / Video-only inference",
    title: "Reuse the contract without the ergometer.",
    description:
      "A new recording follows the video branch only. RP3 telemetry is a source of supervision, not a runtime dependency.",
    inputs: [
      {
        label: "New side-view video",
        detail:
          "The same pose, handle, phase-detection, and facing-direction logic runs on unseen footage.",
      },
      {
        label: "Model bundle",
        detail:
          "Saved preprocessing state prevents feature-order or normalization drift between training and inference.",
      },
    ],
    steps: [
      {
        label: "Segment the drive",
        detail:
          "Catch and finish events isolate each stroke without consulting RP3 timestamps.",
      },
      {
        label: "Build the same 64 × 14 tensor",
        detail:
          "Progress-domain resampling and QC reproduce the representation used during model training.",
      },
      {
        label: "Reconstruct and summarize",
        detail:
          "Predicted coefficients or sequence outputs become a force curve with peak, peak position, impulse, and region metrics.",
      },
    ],
    output: {
      label: "Per-stroke force estimate",
      detail:
        "A normalized and distance-indexed curve plus derived metrics, with quality flags retained for downstream review.",
    },
  },
];

const artifacts = [
  {
    type: "PDF / 9 pages / June 2026",
    title: "Final methods paper",
    detail:
      "The complete method, feature contract, synchronization results, modeling design, limitations, and next experiments.",
    href: "/media/projects/rowing-biomechanics/rowing-video-force-prediction-paper.pdf",
    action: "Read the paper",
  },
  {
    type: "PDF / 42 pages",
    title: "Modeling study guide",
    detail:
      "The mathematics and implementation choices behind progress normalization, force-shape decomposition, leakage-safe splits, and Stage 0/A/B models.",
    href: "/media/projects/rowing-biomechanics/rowing-force-modeling-study-guide.pdf",
    action: "Open the guide",
  },
  {
    type: "PDF / 29 pages / GitHub",
    title: "Research journal",
    detail:
      "The longer development record: experiments, failed assumptions, matching diagnostics, design decisions, and the evidence trail behind the system.",
    href: "https://github.com/JJCAPPE/rowing-dynamics-analysis/blob/main/journal/journal.pdf",
    action: "Read the journal",
  },
  {
    type: "Python / 50 tests",
    title: "Source repository",
    detail:
      "The package, CLI workflow, matching editor, dataset builder, modeling stages, reports, and contract-focused tests.",
    href: "https://github.com/JJCAPPE/rowing-dynamics-analysis",
    action: "Browse the code",
  },
  {
    type: "Interactive / GitHub Pages",
    title: "Pipeline visualization",
    detail:
      "A visual walkthrough from raw video and RP3 telemetry to matched strokes and model-ready data.",
    href: "https://jjcappe.github.io/rowing-dynamics-analysis/pipeline-visualisation.html",
    action: "Explore the pipeline",
  },
  {
    type: "Interactive / GitHub Pages",
    title: "Model-training stages",
    detail:
      "The baseline gate, summary-feature models, full-sequence models, and evaluation regimes.",
    href: "https://jjcappe.github.io/rowing-dynamics-analysis/model-training-stages.html",
    action: "View the stages",
  },
];

export function RowingCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section
        className={styles.architecture}
        aria-labelledby="rowing-architecture-heading"
      >
        <header className={styles.sectionHeading}>
          <p className={styles.kicker}>Architecture / data contract</p>
          <h2 id="rowing-architecture-heading">
            Two systems, one feature contract.
          </h2>
          <p>
            Training needs synchronized RP3 telemetry to create labels.
            Inference does not. Both paths call the same canonicalization,
            feature-ordering, and progress-resampling code.
          </p>
        </header>

        <div className={styles.flows}>
          {architectureFlows.map((flow) => (
            <article className={styles.flow} key={flow.title}>
              <header className={styles.flowHeading}>
                <p>{flow.eyebrow}</p>
                <h3>{flow.title}</h3>
                <p>{flow.description}</p>
              </header>

              <div
                className={styles.inputs}
                aria-label={`${flow.title} inputs`}
              >
                {flow.inputs.map((input) => (
                  <div key={input.label}>
                    <strong>{input.label}</strong>
                    <span>{input.detail}</span>
                  </div>
                ))}
              </div>

              <ol
                className={styles.steps}
                aria-label={`${flow.title} processing stages`}
              >
                {flow.steps.map((step) => (
                  <li key={step.label}>
                    <strong>{step.label}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>

              <div className={styles.output}>
                <span>Output</span>
                <strong>{flow.output.label}</strong>
                <p>{flow.output.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {project.gallery?.length ? (
        <section
          className={styles.evidence}
          aria-labelledby="rowing-evidence-heading"
        >
          <header>
            <p className={styles.kicker}>Source artifacts</p>
            <h2 id="rowing-evidence-heading">Evidence, in context.</h2>
          </header>
          <div className={styles.evidenceGrid}>
            {project.gallery.map((media) => (
              <figure key={media.src}>
                <div
                  className={
                    media.kind === "video"
                      ? styles.videoFrame
                      : styles.imageFrame
                  }
                >
                  {media.kind === "video" ? (
                    <video
                      controls
                      muted
                      playsInline
                      poster={media.poster}
                      preload="metadata"
                      aria-label={media.alt}
                    >
                      <source src={media.src} type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                  ) : (
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      sizes="(max-width: 767px) 100vw, 94vw"
                    />
                  )}
                </div>
                {media.caption ? (
                  <figcaption>{media.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className={styles.artifacts}
        aria-labelledby="rowing-artifacts-heading"
      >
        <header className={styles.artifactHeading}>
          <p className={styles.kicker}>Paper / guide / journal / source</p>
          <h2 id="rowing-artifacts-heading">Continue into the work.</h2>
          <p>
            The case study is a map. The paper, study guide, research journal,
            source, and generated visualizations expose the full evidence trail.
          </p>
        </header>
        <nav className={styles.artifactList} aria-label="Rowing project artifacts">
          {artifacts.map((artifact, index) => (
            <a href={artifact.href} key={artifact.href}>
              <span className={styles.artifactIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p>{artifact.type}</p>
                <h3>{artifact.title}</h3>
                <p>{artifact.detail}</p>
              </div>
              <span className={styles.artifactAction}>
                {artifact.action} <i aria-hidden="true">↗</i>
              </span>
            </a>
          ))}
        </nav>
      </section>
    </>
  );
}
