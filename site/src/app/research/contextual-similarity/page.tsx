import Link from "next/link";
import { Layout } from "@/components/Layout";
import {
  ContextualMatrixExplorer,
  NeighborhoodExplorer,
  PoseCorruptionLab,
} from "@/components/PoseResearchVisuals";
import { ResearchOverviewAnimation } from "@/components/ResearchOverviewAnimation";
import { researchShowcase } from "@/content/research";
import { createPageMetadata } from "@/lib/metadata";
import styles from "../research.module.css";

const contextualSimilarityPage = researchShowcase.find(
  (item) => item.href === "/research/contextual-similarity",
);
const contextualSimilarityIndex = researchShowcase.findIndex(
  (item) => item.href === "/research/contextual-similarity",
);
const nextResearch =
  researchShowcase[(contextualSimilarityIndex + 1) % researchShowcase.length];

export const metadata = createPageMetadata({
  title: "Research: Robust pose-sequence retrieval",
  description:
    "A research proposal testing contextual metric learning for pose-sequence retrieval under joint noise, missing limbs, frame loss, and pose-estimator shift.",
  pathname: "/research/contextual-similarity",
  type: "article",
  modifiedTime: contextualSimilarityPage?.updatedAt,
});

const PROPOSAL_URL =
  "/media/research/pose-embedding/robust-pose-sequence-retrieval-prospectus.pdf";
const CODE_URL = "https://github.com/JJCAPPE/pose-embedding";

const comparisonRows = [
  {
    dimension: "Domain",
    foundation: "Still images",
    extension: "Temporal skeleton sequences",
  },
  {
    dimension: "Observation",
    foundation: "Image embedding",
    extension: "T × J × C joint coordinates → motion embedding",
  },
  {
    dimension: "Stressor",
    foundation: "Inconsistent or noisy labels",
    extension: "Jitter, occlusion, frame loss, pose-source shift",
  },
  {
    dimension: "Task",
    foundation: "Supervised image retrieval",
    extension: "Class-level pose-sequence retrieval",
  },
  {
    dimension: "Evidence",
    foundation: "Reported by Liao et al., ICML 2023",
    extension: "Open hypothesis; no robustness result yet",
  },
] as const;

const equationStages = [
  {
    label: "Sequence",
    equation: "x ∈ ℝᵀˣᴶˣᶜ",
    description: "A tracked body across T frames, J joints, and C coordinates.",
  },
  {
    label: "Embedding",
    equation: "z = fθ(x) / ‖fθ(x)‖₂",
    description: "MotionBERT supplies the temporal encoder; the output is normalized.",
  },
  {
    label: "Geometry",
    equation: "S = ZZᵀ  ·  D = 2 − 2S",
    description: "Cosine similarity and unit-sphere squared distance describe every pair.",
  },
  {
    label: "Neighborhood",
    equation: "Nᵢⱼ = 𝟙[Dᵢⱼ ≤ dᵢ,ₖ + ε]",
    description: "Expanded top-k neighborhoods turn pairwise distances into local structure.",
  },
  {
    label: "Context",
    equation: "W₁ → R → W₂ → W",
    description: "Shared agreement, reciprocal neighbors, query expansion, then symmetry.",
  },
  {
    label: "Objective",
    equation: "λLcontext + (1−λ)Lcontrast + γLreg",
    description: "The hybrid loss combines contextual fit, pairwise margins, and regularization.",
  },
] as const;

const protocol = [
  {
    term: "Dataset",
    detail:
      "NTU RGB+D 120, using its official cross-subject and cross-setup protocols.",
  },
  {
    term: "Encoder",
    detail:
      "Pretrained MotionBERT with a normalized projection output; freeze first, fine-tune later.",
  },
  {
    term: "Retrieval",
    detail:
      "A saved, disjoint query/gallery manifest with noisy queries against a fixed clean gallery.",
  },
  {
    term: "Corruptions",
    detail:
      "Body-scaled Gaussian joint jitter, joint or limb masking, frame dropout, temporal jitter, and pose-source shift when available.",
  },
  {
    term: "Controls",
    detail:
      "The same split, backbone, sampler, embedding dimension, augmentations, tuning budget, evaluator, and seeds for every loss.",
  },
  {
    term: "Metrics",
    detail:
      "Recall@1/5/10, mAP, mAP@R or R-precision, retention, and clean-to-corrupted degradation.",
  },
] as const;

const outcomes = [
  {
    observation: "Robust gain with similar clean retrieval",
    interpretation:
      "Evidence that contextual neighborhoods help under input corruption.",
  },
  {
    observation: "Clean gain, no robustness gain",
    interpretation:
      "Better ranking, but not support for the pose-noise hypothesis.",
  },
  {
    observation: "Gain only with corruption augmentation",
    interpretation:
      "Neighborhood learning and robust data exposure are complementary.",
  },
  {
    observation: "No gain over SupCon or MaskCLR",
    interpretation:
      "The encoder or corruption-aware training matters more than this objective.",
  },
] as const;

const sourceGroups = [
  {
    label: "Current work",
    sources: [
      {
        index: "A1",
        title: "Robust pose-sequence retrieval prospectus",
        description:
          "The eight-page July 2026 literature review, feasibility assessment, and proposed experiment.",
        links: [{ label: "Proposal PDF", href: PROPOSAL_URL }],
      },
      {
        index: "A2",
        title: "Pose embedding repository",
        description:
          "The implementation workspace and study artifacts for the proposed extension.",
        links: [{ label: "GitHub", href: CODE_URL, external: true }],
      },
      {
        index: "A3",
        title: "Rowing biomechanics origin",
        description:
          "The case study where noisy tracking, uncertain 3D lift, and derivative amplification made the robustness question concrete.",
        links: [
          {
            label: "Case study",
            href: "/research/rowing-biomechanics",
          },
        ],
      },
    ],
  },
  {
    label: "Foundation",
    sources: [
      {
        index: "F1",
        title: "Contextual similarity optimization",
        description:
          "Liao, Tsiligkaridis, and Kulis, ICML 2023. The image-retrieval objective and label-noise evidence this proposal transfers.",
        links: [
          {
            label: "PMLR paper",
            href: "https://proceedings.mlr.press/v202/liao23b.html",
            external: true,
          },
          {
            label: "Official code",
            href: "https://github.com/Chris210634/metric-learning-using-contextual-similarity",
            external: true,
          },
        ],
      },
      {
        index: "F2",
        title: "MotionBERT",
        description:
          "The pretrained temporal motion encoder and public one-shot NTU pipeline chosen as the lowest-risk starting point.",
        links: [
          {
            label: "Paper",
            href: "https://arxiv.org/abs/2210.06551",
            external: true,
          },
          {
            label: "Code",
            href: "https://github.com/Walter0807/MotionBERT",
            external: true,
          },
        ],
      },
      {
        index: "F3",
        title: "NTU RGB+D 120",
        description:
          "A large-scale skeleton action benchmark with standard cross-subject and cross-setup evaluation protocols.",
        links: [
          {
            label: "Paper",
            href: "https://arxiv.org/abs/1905.04757",
            external: true,
          },
        ],
      },
    ],
  },
  {
    label: "Robustness controls",
    sources: [
      {
        index: "R1",
        title: "MaskCLR",
        description:
          "The closest robustness-specific comparator and the source for joint noise, occlusion, frame masking, and pose-estimator-shift tests.",
        links: [
          {
            label: "CVPR 2024 paper",
            href: "https://openaccess.thecvf.com/content/CVPR2024/html/Abdelfattah_MaskCLR_Attention-Guided_Contrastive_Learning_for_Robust_Action_Representation_Learning_CVPR_2024_paper.html",
            external: true,
          },
        ],
      },
      {
        index: "R2",
        title: "PoseConv3D",
        description:
          "Independent evidence that estimated-pose representations can be tested for noise robustness and cross-dataset transfer.",
        links: [
          {
            label: "CVPR 2022 paper",
            href: "https://openaccess.thecvf.com/content/CVPR2022/html/Duan_Revisiting_Skeleton-Based_Action_Recognition_CVPR_2022_paper.html",
            external: true,
          },
          {
            label: "Code",
            href: "https://github.com/kennymckormick/pyskl",
            external: true,
          },
        ],
      },
      {
        index: "R3",
        title: "Skeleton-DML",
        description:
          "Direct precedent for deep metric learning and nearest-neighbor recognition on skeleton sequences.",
        links: [
          {
            label: "Paper",
            href: "https://arxiv.org/abs/2012.13823",
            external: true,
          },
        ],
      },
    ],
  },
] as const;

export default function ContextualSimilarityPage() {
  return (
    <Layout className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.collectionNav}>
            <Link href="/research" className="back-link">
              All research
            </Link>
            <p>
              Research {String(contextualSimilarityIndex + 1).padStart(2, "0")} /{" "}
              {String(researchShowcase.length).padStart(2, "0")}
            </p>
          </div>
          <div>
            <p className={styles.eyebrow}>Research proposal / July 2026</p>
            <h1>Can motion embeddings survive bad poses?</h1>
          </div>
          <div className={styles.heroIntro}>
            <p>
              A retrieval-first study of whether contextual metric learning can
              keep similar motion sequences near each other when estimated
              joints jitter, disappear, or arrive in broken frames.
            </p>
            <div className={styles.heroActions}>
              <a
                className="action-link action-link--accent"
                href={PROPOSAL_URL}
                target="_blank"
                rel="noreferrer"
              >
                Read proposal
              </a>
              <a
                className="action-link"
                href={CODE_URL}
                target="_blank"
                rel="noreferrer"
              >
                View code
              </a>
            </div>
          </div>
          <dl className={styles.heroFacts}>
            <div>
              <dt>Foundation</dt>
              <dd>ICML 2023</dd>
            </div>
            <div>
              <dt>Transfer</dt>
              <dd>Images → motion</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Open hypothesis</dd>
            </div>
          </dl>
        </div>
        <div className={styles.heroVisual}>
          <ResearchOverviewAnimation />
        </div>
      </header>

      <section className={styles.corruption} aria-labelledby="corruption-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / Planned corruptions</p>
          <h2 id="corruption-heading">First, make the pose observation fail.</h2>
          <div>
            <p>
              The detailed lab separates joint jitter, missing limbs, and frame
              loss so the planned stress test stays interpretable. The clean
              sequence remains visible as a fixed reference.
            </p>
          </div>
        </div>
        <PoseCorruptionLab />
      </section>

      <section className={styles.origin} aria-labelledby="origin-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / Origin</p>
          <h2 id="origin-heading">A small keypoint error did not stay small.</h2>
          <div>
            <p>
              The rowing pipeline exposed the failure chain. Motion blur,
              occlusion, oblique views, and tracking discontinuities displaced
              joints; monocular lifting added depth uncertainty; velocity and
              acceleration features amplified what remained.
            </p>
            <p>
              That practical problem became a narrower research question: if
              the pose observation is unreliable, can the ordering of a motion
              embedding space remain useful?
            </p>
            <Link
              href="/research/rowing-biomechanics"
              className="action-link action-link--accent"
            >
              Rowing case study
            </Link>
          </div>
        </div>

        <figure className={styles.originMedia}>
          <video
            controls
            muted
            playsInline
            preload="metadata"
            poster="/media/projects/rowing-biomechanics/pose3d-tracking-poster.webp"
            aria-label="Rowing video with two-dimensional tracking and a lifted three-dimensional skeleton"
          >
            <source
              src="/media/projects/rowing-biomechanics/pose3d-tracking-example.mp4"
              type="video/mp4"
            />
            Your browser does not support embedded video.
          </video>
          <figcaption>
            Real rowing pipeline footage. This is the source of the research
            question, not evidence that the proposed loss solves it.
          </figcaption>
        </figure>
      </section>

      <section className={styles.neighborhood} aria-labelledby="neighborhood-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>03 / Retrieval intuition</p>
          <h2 id="neighborhood-heading">
            A pair is fragile. A neighborhood adds context.
          </h2>
          <div>
            <p>
              Cosine retrieval asks whether one query vector is close to one
              gallery vector. Contextual similarity also asks whether those
              examples agree about who else belongs nearby.
            </p>
            <p>
              Shared and reciprocal neighbors create a local-consensus signal.
              The proposal tests whether that inductive bias degrades more
              slowly than direct pairwise objectives under pose corruption.
            </p>
          </div>
        </div>
        <NeighborhoodExplorer />
      </section>

      <section className={styles.theory} aria-labelledby="theory-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>04 / Foundation → extension</p>
          <h2 id="theory-heading">Same objective. Different failure.</h2>
          <div>
            <p>
              The transfer changes the data and the corruption, not the central
              loss. A temporal encoder replaces the image network; the
              contextual construction still operates on a balanced batch of
              normalized embeddings.
            </p>
          </div>
        </div>

        <div className={styles.scientificBoundary}>
          <p>What is established</p>
          <strong>
            The 2023 paper reports improved image retrieval, less overfitting,
            and greater robustness to label noise.
          </strong>
          <p>What remains untested</p>
          <strong>
            Whether the same loss preserves pose-sequence retrieval when input
            coordinates—not labels—become unreliable.
          </strong>
        </div>

        <div className={styles.tableViewport}>
          <table className={styles.comparisonTable}>
            <caption>
              Comparison of the ICML 2023 foundation and the proposed
              pose-sequence extension
            </caption>
            <thead>
              <tr>
                <th scope="col">Dimension</th>
                <th scope="col">ICML 2023 foundation</th>
                <th scope="col">Proposed extension</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.dimension}>
                  <th scope="row">{row.dimension}</th>
                  <td>{row.foundation}</td>
                  <td>{row.extension}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ol className={styles.equationFlow} aria-label="Contextual loss construction">
          {equationStages.map((stage, index) => (
            <li key={stage.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{stage.label}</p>
              <code>{stage.equation}</code>
              <small>{stage.description}</small>
            </li>
          ))}
        </ol>

        <div className={styles.methodNotes}>
          <p>
            <strong>Balanced batch.</strong> The neighborhood size{" "}
            <code>k</code> equals samples per represented class and must be
            even for the reciprocal <code>k/2</code> step.
          </p>
          <p>
            <strong>Discrete forward, useful backward.</strong> The comparison
            is binary in the forward pass; a straight-through estimator supplies
            a constant heuristic gradient during training.
          </p>
          <p>
            <strong>Bounded cost.</strong> Context construction is cubic in
            batch size, so the experiment profiles moderate balanced batches
            before any full-encoder run.
          </p>
        </div>

        <ContextualMatrixExplorer />
      </section>

      <section className={styles.experiment} aria-labelledby="experiment-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>05 / Proposed experiment</p>
          <h2 id="experiment-heading">A useful result either way.</h2>
          <div>
            <p>
              The study isolates the loss before expanding scope. There are no
              completed robustness results yet; the deliverable is a controlled
              comparison whose null outcomes remain interpretable.
            </p>
          </div>
        </div>

        <dl className={styles.protocol}>
          {protocol.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.milestoneBlock}>
          <h3>Three go / no-go milestones</h3>
          <ol className={styles.milestones}>
            <li>
              <span>01</span>
              <h4>Protocol validation</h4>
              <p>
                Reproduce the starting pipeline, save the held-out
                query/gallery split, and require monotone corruption curves from
                frozen embeddings.
              </p>
            </li>
            <li>
              <span>02</span>
              <h4>Loss isolation</h4>
              <p>
                Train matched projection heads with SupCon, contextual, and
                hybrid objectives; verify that batch composition,{" "}
                <code>k</code>, and samples per class agree.
              </p>
            </li>
            <li>
              <span>03</span>
              <h4>Robustness claim</h4>
              <p>
                Fine-tune only after milestone two is stable, then add the
                corruption-aware MaskCLR control and the full matched ablation.
              </p>
            </li>
          </ol>
        </div>

        <div className={styles.tableViewport}>
          <table className={styles.outcomeTable}>
            <caption>How each possible result would be interpreted</caption>
            <thead>
              <tr>
                <th scope="col">Observed pattern</th>
                <th scope="col">Scientific interpretation</th>
              </tr>
            </thead>
            <tbody>
              {outcomes.map((outcome) => (
                <tr key={outcome.observation}>
                  <th scope="row">{outcome.observation}</th>
                  <td>{outcome.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.sources} aria-labelledby="sources-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>06 / Papers, code, artifacts</p>
          <h2 id="sources-heading">The evidence trail.</h2>
          <div>
            <p>
              Primary papers and canonical repositories, grouped by the role
              they play in the proposal.
            </p>
          </div>
        </div>

        <div className={styles.sourceGroups}>
          {sourceGroups.map((group) => (
            <section key={group.label} className={styles.sourceGroup}>
              <h3>{group.label}</h3>
              <ol>
                {group.sources.map((source) => (
                  <li key={source.index}>
                    <span>{source.index}</span>
                    <div>
                      <h4>{source.title}</h4>
                      <p>{source.description}</p>
                    </div>
                    <div className={styles.sourceLinks}>
                      {source.links.map((link) =>
                        "external" in link && link.external ? (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.label} <span aria-hidden="true">↗</span>
                          </a>
                        ) : (
                          <Link key={link.href} href={link.href}>
                            {link.label} <span aria-hidden="true">→</span>
                          </Link>
                        ),
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className={styles.closing}>
          <p>Research question</p>
          <h2>
            Is local neighborhood structure useful when the observations,
            rather than the labels, become unreliable?
          </h2>
          <a
            className="action-link action-link--accent"
            href={PROPOSAL_URL}
            target="_blank"
            rel="noreferrer"
          >
            Read the full proposal
          </a>
        </div>
      </section>

      <nav className="next-project" aria-label="Next research item">
        <p>Next research</p>
        <Link href={nextResearch.href}>{nextResearch.title}</Link>
      </nav>
    </Layout>
  );
}
