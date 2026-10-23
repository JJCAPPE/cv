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
  title: "Robust Human-Motion Retrieval from Pose Sequences",
  description:
    "Funded undergraduate research at Boston University comparing frozen MotionBERT training recipes for human-motion retrieval from noisy and incomplete poses.",
  pathname: "/research/contextual-similarity",
  type: "article",
  modifiedTime: contextualSimilarityPage?.updatedAt,
});

const PROPOSAL_URL =
  "/media/research/pose-embedding/robust-pose-sequence-retrieval-prospectus.pdf";
const CODE_URL = "https://github.com/JJCAPPE/pose-embedding";
const PLAN_URL = `${CODE_URL}/blob/main/plan/research-plan.v3.md`;

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
    extension: "Query-only jitter, missing joints, and missing frames",
  },
  {
    dimension: "Task",
    foundation: "Supervised image retrieval",
    extension: "One-shot retrieval on 20 unseen action classes",
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
    equation: "z = h(f(x)) / ‖h(f(x))‖₂",
    description: "Frozen MotionBERT supplies 8,704 features; a learned linear head yields 2,048 normalized values.",
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
      "NTU RGB+D 120: 80 training actions, 20 disjoint development actions, and 20 unseen test actions. Final heads train on all 100 auxiliary actions.",
  },
  {
    term: "Encoder",
    detail:
      "Frozen pretrained MotionBERT, with only a biased linear 8,704-to-2,048 head trained. Outputs are L2-normalized for cosine retrieval.",
  },
  {
    term: "Retrieval",
    detail:
      "One clean exemplar per unseen action. Primary queries exclude the exemplar and every synchronized view of that performance; an exact-official secondary query set is also reported.",
  },
  {
    term: "Corruptions",
    detail:
      "Three separate, nested stress tests: jitter at 1%, 2.5%, and 5% of torso scale; 3, 6, or 8 missing joint trajectories; and 10, 25, or 40 masked frames out of 100.",
  },
  {
    term: "Matched recipes",
    detail:
      "Contrastive, full contextual, and descriptive SupCon; paired seeds 7, 17, and 29; physical batches of 8 actions × 4 examples; exactly 20 epochs per run. Three pilots and 27 clean-development selection runs precede nine fresh final heads.",
  },
  {
    term: "Evaluation",
    detail:
      "Lock all nine heads before novel opening. Nine heads × ten query conditions × two query definitions yield 180 cells, with top-1, mean reciprocal rank, top-5, and clean-to-corrupted top-1 drops.",
  },
] as const;

const outcomes = [
  {
    observation: "Contextual-minus-contrastive degradation interval entirely below zero",
    interpretation:
      "Supports a smaller clean-to-corrupted top-1 accuracy drop for the full contextual recipe, conditional on the fixed seeds, actions, and gallery exemplars. Different margins and regularization prevent attribution to neighborhoods alone; absolute corrupted accuracy must also be reported.",
  },
  {
    observation: "No resolved contextual advantage",
    interpretation:
      "A useful null result. Report the uncertainty, every seed and condition, and absolute accuracy without changing the study after opening.",
  },
  {
    observation: "Contextual degrades more",
    interpretation:
      "A valid contrary result that limits the hypothesis. The comparison remains between complete recipes; SupCon is descriptive.",
  },
] as const;

const sourceGroups = [
  {
    label: "Current work",
    sources: [
      {
        index: "A1",
        title: "Experimental plan (v3)",
        description:
          "Training recipes, evaluation rules, and the September-December 2026 schedule.",
        links: [{ label: "Read plan", href: PLAN_URL, external: true }],
      },
      {
        index: "A2",
        title: "Original July 2026 prospectus",
        description:
          "The eight-page literature review and original proposal. The current v3 plan narrows its experimental scope.",
        links: [{ label: "Original proposal PDF", href: PROPOSAL_URL }],
      },
      {
        index: "A3",
        title: "Pose embedding repository",
        description:
          "Code, protocols, and public study files.",
        links: [{ label: "GitHub", href: CODE_URL, external: true }],
      },
      {
        index: "A4",
        title: "Rowing biomechanics origin",
        description:
          "The tracking errors that prompted this study.",
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
          "Liao, Tsiligkaridis, and Kulis, ICML 2023. The image-retrieval recipe and label-noise evidence this study adapts to poses.",
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
          "The pretrained motion encoder and one-shot NTU retrieval pipeline used in this study.",
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
          "The skeleton action benchmark used here with its official one-shot novel actions and exemplars.",
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
    label: "Related robustness research",
    sources: [
      {
        index: "R1",
        title: "MaskCLR",
        description:
          "Related corruption-aware representation learning that informed the original proposal. A MaskCLR arm and pose-estimator shifts are outside the current December study.",
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
            <p className={styles.eyebrow}>Funded research / August 2026–Present</p>
            <h1>Robust motion retrieval</h1>
          </div>
          <div className={styles.heroIntro}>
            <p>
              I’m conducting funded undergraduate research at Boston University
              with Prof. Brian Kulis, testing whether contextual training helps
              recognize an action when its tracked joints jitter or disappear.
            </p>
            <div className={styles.heroActions}>
              <a
                className="action-link action-link--accent"
                href={PLAN_URL}
                target="_blank"
                rel="noreferrer"
              >
                Read current study plan
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
              <dt>Encoder</dt>
              <dd>Frozen MotionBERT</dd>
            </div>
            <div>
              <dt>Study</dt>
              <dd>3 recipes × 3 seeds</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Active; final comparison pending</dd>
            </div>
          </dl>
        </div>
        <div className={styles.heroVisual}>
          <ResearchOverviewAnimation />
        </div>
      </header>

      <section className={styles.corruption} aria-labelledby="corruption-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / Query corruption</p>
          <h2 id="corruption-heading">First, make the pose observation fail.</h2>
          <div>
            <p>
              Change one kind of damage at a time and compare it with the clean
              reference. These synthetic examples illustrate the stress tests;
              they do not model real camera occlusion.
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
          <p className={styles.eyebrow}>03 / Training intuition</p>
          <h2 id="neighborhood-heading">
            Learning from nearby motions
          </h2>
          <div>
            <p>
              Contextual training compares each pair of motions and their shared
              neighbors. Explore cosine and contextual scores within a synthetic
              training batch below. At evaluation, every trained head uses cosine
              retrieval against a clean gallery.
            </p>
            <p>
              The experiment compares complete training recipes. Their margins and
              regularization differ too, so an improvement could not be attributed
              to neighborhoods alone.
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
              Frozen MotionBERT supplies motion features for a learned linear
              head. Contextual training constructs neighborhoods within a balanced
              batch of normalized embeddings. It uses clean training poses.
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
            Whether the full contextual training recipe reduces retrieval
            degradation when pose coordinates become unreliable.
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
            batch size. The study uses batches of eight actions × four examples
            and trains only the linear head.
          </p>
        </div>

        <ContextualMatrixExplorer />
      </section>

      <section className={styles.experiment} aria-labelledby="experiment-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>05 / Current experiment</p>
          <h2 id="experiment-heading">A useful result either way.</h2>
          <div>
            <p>
              Train contrastive, contextual, and supervised contrastive (SupCon)
              recipes on clean poses across three paired seeds. Select settings
              on clean development data, then evaluate all nine heads on unseen
              actions with identical query damage and a clean gallery.
            </p>
            <p>
              Progress as of 22 October 2026: initial engineering pilots are
              complete. Runtime revalidation is in progress, and capacity approval
              remains pending before model selection and final training. The final robustness
              comparison remains pending. Follow the{" "}
              <a href="https://pose-embed-tracker.vercel.app/" target="_blank" rel="noreferrer">
                public research tracker
              </a>{" "}
              for dated progress.
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
                Validate the frozen encoder, exact query/gallery identities,
                corruption inputs, and numerical runtime. Confirm capacity before
                beginning clean-development selection.
              </p>
            </li>
            <li>
              <span>02</span>
              <h4>Matched training recipes</h4>
              <p>
                Compare contrastive, full contextual, and SupCon recipes with
                paired seeds, initialization, and physical batches. Train and lock
                all nine final heads before opening the unseen test actions.
              </p>
            </li>
            <li>
              <span>03</span>
              <h4>Robustness claim</h4>
              <p>
                Evaluate clean and corrupted queries against the fixed clean
                gallery. Report every seed and condition, absolute accuracy, and
                clean-to-corrupted drops, including null or negative findings.
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
              they play in the study.
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
            href={PLAN_URL}
            target="_blank"
            rel="noreferrer"
          >
            Read the current study plan
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
