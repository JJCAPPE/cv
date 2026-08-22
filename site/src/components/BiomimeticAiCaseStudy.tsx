"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import type { Project } from "@/content/projects";
import styles from "./BiomimeticAiCaseStudy.module.css";

const ATLAS_SRC =
  "/media/projects/biomimetic-ai/technical/biomimetic-ai-adaptability-atlas.svg";
const PAPER_HREF =
  "/media/projects/biomimetic-ai/forging-adaptability-paper.pdf";
const PAPER_PAGE_COUNT = 8;

type AtlasModeId =
  | "overview"
  | "compositionality"
  | "continual-learning"
  | "plasticity";

type AtlasMode = {
  id: AtlasModeId;
  label: string;
  layer?: string;
  mechanism: string;
  evidence: string;
  boundary: string;
  source: string;
};

const ATLAS_MODES: AtlasMode[] = [
  {
    id: "overview",
    label: "Overview",
    mechanism:
      "Three independent evidence lanes organize the paper around composing, retaining, and renewing learning capacity.",
    evidence:
      "MLC episodes, PFC-inspired context mechanisms, and plasticity-loss mechanisms are reviewed as separate research programs.",
    boundary:
      "This is a literature synthesis, not one executable architecture. The cited experiments are not presented as original measurements.",
    source: "Final paper sections 2, 3, and 4.",
  },
  {
    id: "compositionality",
    label: "Compositionality",
    layer:
      "/media/projects/biomimetic-ai/technical/biomimetic-ai-compositionality-layer.svg",
    mechanism:
      "Known primitives and a small set of study examples frame a novel query inside a dynamic MLC episode.",
    evidence:
      "The cited approach trains a standard transformer across changing few-shot compositional tasks to learn systematic rule application.",
    boundary:
      "The page omits the truncated validation figures and does not imply that this project ran the cited experiment.",
    source: "The MLC Approach, section 2.2.",
  },
  {
    id: "continual-learning",
    label: "Continual learning",
    layer:
      "/media/projects/biomimetic-ai/technical/biomimetic-ai-continual-learning-layer.svg",
    mechanism:
      "Sluggish task units carry recent context, while a Hebbian step gates task-relevant hidden units.",
    evidence:
      "The cited model uses these motifs to separate task representations during sequential learning.",
    boundary:
      "The diagram does not model a full prefrontal cortex or undocumented neural topology.",
    source: "PFC-Inspired Mechanisms, section 3.2.",
  },
  {
    id: "plasticity",
    label: "Plasticity",
    layer:
      "/media/projects/biomimetic-ai/technical/biomimetic-ai-plasticity-layer.svg",
    mechanism:
      "Prolonged standard training is associated with dormant units, lower effective rank, and problematic weight dynamics.",
    evidence:
      "The cited study presents continual backpropagation, including reinitializing less-used units, as an intervention to retain plasticity.",
    boundary:
      "The dashed branch marks a separate documented intervention, not automatic retraining or a loop connecting all three studies.",
    source:
      "Mechanisms of Decline and Biological Contrast and Required Interventions, sections 4.2 and 4.3.",
  },
];

const ARTIFACTS = [
  {
    type: "PDF / DELIVERED",
    title: "Final paper",
    detail:
      "8 A4 pages with embedded fonts and no raster images. This is the delivered paper artifact.",
    href: PAPER_HREF,
    downloadName: "forging-adaptability-paper.pdf",
    action: "Download final paper",
  },
  {
    type: "PDF / COVER MEMO",
    title: "Cover-memo edition",
    detail:
      "9 A4 pages containing the cover memo and highlighted revision evidence alongside the paper.",
    href: "/media/projects/biomimetic-ai/forging-adaptability-cover-memo.pdf",
    downloadName: "forging-adaptability-cover-memo.pdf",
    action: "Download cover memo",
  },
  {
    type: "TEX / SOURCE AS PROVIDED",
    title: "TeX source",
    detail:
      "199 lines. It references structure.tex and article.bib, which were not supplied, so this is not a standalone compile bundle.",
    href: "/media/projects/biomimetic-ai/forging-adaptability.tex",
    downloadName: "forging-adaptability.tex",
    action: "Download TeX source",
  },
] as const;

function handleArrowSelection<T extends { id: string }>(
  event: KeyboardEvent<HTMLButtonElement>,
  items: T[],
  index: number,
  select: (id: string) => void,
) {
  let nextIndex: number | undefined;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (index + 1) % items.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (index - 1 + items.length) % items.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = items.length - 1;
  }

  if (nextIndex === undefined) {
    return;
  }

  event.preventDefault();
  select(items[nextIndex].id);
  const buttons =
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      "button",
    );
  buttons?.item(nextIndex).focus();
}

function AdaptabilityAtlas() {
  const [selectedId, setSelectedId] = useState<AtlasModeId>("overview");
  const selected =
    ATLAS_MODES.find((mode) => mode.id === selectedId) ?? ATLAS_MODES[0];
  const liveLabel = [
    selected.label,
    `Mechanism: ${selected.mechanism}`,
    `Evidence: ${selected.evidence}`,
    `Boundary: ${selected.boundary}`,
    `Source: ${selected.source}`,
  ].join(". ");

  return (
    <section className={styles.atlasSection} aria-labelledby="atlas-title">
      <header className={styles.sectionIntro}>
        <p className={styles.kicker}>01 / Evidence atlas</p>
        <div>
          <h2 id="atlas-title">Three studies, held apart</h2>
          <p>
            Select a lane to inspect its mechanism, evidence, and boundary. The
            atlas keeps the cited programs independent so a literature review
            does not read as one implemented neural system.
          </p>
        </div>
      </header>

      <div className={styles.atlasShell}>
        <div
          className={styles.atlasControls}
          role="group"
          aria-label="Select evidence atlas view"
        >
          {ATLAS_MODES.map((mode, index) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={selected.id === mode.id}
              aria-controls="biomimetic-atlas-readout"
              onClick={() => setSelectedId(mode.id)}
              onKeyDown={(event) =>
                handleArrowSelection(event, ATLAS_MODES, index, (id) =>
                  setSelectedId(id as AtlasModeId),
                )
              }
            >
              {mode.label}
            </button>
          ))}
        </div>

        <figure className={styles.atlasFigure} data-technical-visual="true">
          <div
            className={styles.atlasViewport}
            data-focused={Boolean(selected.layer)}
          >
            <Image
              className={styles.atlasBase}
              src={ATLAS_SRC}
              alt="Three independent evidence lanes: MLC combines known primitives and study examples for a novel query; PFC-inspired context mechanisms separate sequential task representations; prolonged training exposes plasticity-loss markers beside a separate continual-backpropagation intervention."
              width={2400}
              height={1350}
              sizes="(max-width: 767px) 100vw, 94rem"
            />
            {selected.layer ? (
              <Image
                key={selected.layer}
                className={styles.atlasOverlay}
                src={selected.layer}
                alt=""
                aria-hidden="true"
                width={2400}
                height={1350}
                sizes="(max-width: 767px) 100vw, 94rem"
              />
            ) : null}
          </div>
          <figcaption>
            Source-led schematic of relationships described in the supplied
            paper. Solid paths stay within one cited study; the dashed Renew
            branch marks a separate documented intervention.
          </figcaption>
        </figure>

        <dl className={styles.atlasReadout} id="biomimetic-atlas-readout">
          <div>
            <dt>Mechanism</dt>
            <dd>{selected.mechanism}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{selected.evidence}</dd>
          </div>
          <div>
            <dt>Boundary</dt>
            <dd>{selected.boundary}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{selected.source}</dd>
          </div>
        </dl>

        <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
          {liveLabel}
        </p>
      </div>
    </section>
  );
}

function PaperPageViewer({ project }: { project: Project }) {
  const pages = project.gallery ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = pages[selectedIndex];

  if (!selected) {
    return null;
  }

  const pageItems = pages.map((_, index) => ({ id: String(index) }));
  const pageNumber = selected.page ?? selectedIndex + 1;
  const liveLabel = `Selected final paper page ${pageNumber} of ${PAPER_PAGE_COUNT}. ${selected.caption ?? ""}`;

  return (
    <section className={styles.paperSection} aria-labelledby="paper-title">
      <header className={styles.sectionIntro}>
        <div aria-hidden="true" />
        <div>
          <h2 id="paper-title">Read the paper as delivered</h2>
          <p>
            Five curated pages span the research question, compositionality,
            continual learning, plasticity mechanisms, and conclusion. Each
            preview preserves the full A4 page.
          </p>
        </div>
      </header>

      <div className={styles.paperViewer}>
        <div className={styles.pageControls}>
          <button
            type="button"
            onClick={() =>
              setSelectedIndex((index) => Math.max(0, index - 1))
            }
            disabled={selectedIndex === 0}
            aria-label="Show previous curated paper page"
          >
            Previous
          </button>

          <div
            className={styles.pageNumbers}
            role="group"
            aria-label="Select curated final paper page"
          >
            {pages.map((page, index) => (
              <button
                key={page.src}
                type="button"
                aria-pressed={selectedIndex === index}
                aria-controls="biomimetic-paper-page"
                aria-label={`Show final paper page ${page.page ?? index + 1}`}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(event) =>
                  handleArrowSelection(event, pageItems, index, (id) =>
                    setSelectedIndex(Number(id)),
                  )
                }
              >
                {page.page ?? index + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setSelectedIndex((index) =>
                Math.min(pages.length - 1, index + 1),
              )
            }
            disabled={selectedIndex === pages.length - 1}
            aria-label="Show next curated paper page"
          >
            Next
          </button>
        </div>

        <figure className={styles.pageFigure} id="biomimetic-paper-page">
          <div className={styles.pageFrame}>
            <Image
              key={selected.src}
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              sizes="(max-width: 767px) 92vw, 52rem"
            />
          </div>
          <figcaption className={styles.pageCaption}>
            <span>
              Final paper / page {pageNumber} of {PAPER_PAGE_COUNT}
            </span>
            <p>{selected.caption}</p>
            <p>
              This is source evidence from the delivered PDF, not a recreated
              or corrected page.
            </p>
          </figcaption>
        </figure>

        <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
          {liveLabel}
        </p>
      </div>
    </section>
  );
}

function ArtifactBundle() {
  return (
    <section
      className={styles.artifactSection}
      aria-labelledby="artifacts-title"
    >
      <header className={styles.sectionIntro}>
        <div aria-hidden="true" />
        <div>
          <h2 id="artifacts-title">The complete artifact bundle</h2>
          <p>
            All three files are byte-preserved from the supplied attachments.
            The PDFs are delivered artifacts; the TeX is supporting source as
            provided.
          </p>
        </div>
      </header>

      <div className={styles.artifactGrid}>
        {ARTIFACTS.map((artifact) => (
          <a
            key={artifact.href}
            className={styles.artifactCard}
            href={artifact.href}
            download={artifact.downloadName}
          >
            <span className={styles.artifactType}>{artifact.type}</span>
            <h3>{artifact.title}</h3>
            <p>{artifact.detail}</p>
            <span className={styles.artifactAction}>{artifact.action}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function BiomimeticAiCaseStudy({ project }: { project: Project }) {
  return (
    <div className={styles.caseStudy}>
      <AdaptabilityAtlas />
      <PaperPageViewer project={project} />
      <ArtifactBundle />
    </div>
  );
}
