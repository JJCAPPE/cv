"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";
import type { Project } from "@/content/projects";
import styles from "./NoteWorthyCaseStudy.module.css";

type AgentLayer = {
  id: string;
  label: string;
  src?: string;
  summary: string;
  boundary: string;
};

type InspectorMode = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  facts: string[];
  snippet: string;
  boundary: string;
};

const AGENT_LAYERS: AgentLayer[] = [
  {
    id: "overview",
    label: "Overview",
    summary:
      "The current path carries image notes through client preparation, guarded upload, streamed Gemini generation, template composition, external HTTP compilation, and browser output.",
    boundary:
      "Solid paths are current defaults. Dashed nodes are selectable or authenticated options; the subdued lower rail is retained historical code.",
  },
  {
    id: "ingest",
    label: "Ingest",
    src: "/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-ingest-layer.svg",
    summary:
      "The client compresses only when the batch exceeds 20 MiB, then POSTs images for server-side count, size, and declared image-MIME guards before request-local temporary storage.",
    boundary:
      "The route trusts browser-declared MIME metadata rather than decoding or checking file signatures. Files written for accepted requests are cleaned up after generation completes or errors.",
  },
  {
    id: "generation",
    label: "Generate",
    src: "/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-generation-layer.svg",
    summary:
      "Images upload through GoogleAIFileManager in parallel. Summary, Base, or Expansion instructions and the selected model feed one streamed LaTeX-body generation. Regular is the default; Fast and Pro are premium-gated.",
    boundary:
      "There is no separately implemented OCR stage. Progress is approximate, and generation has a five-minute deadline.",
  },
  {
    id: "compile",
    label: "Compile",
    src: "/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-compile-layer.svg",
    summary:
      "The generated body replaces <content> in the 1,065-line template, then a configured HTTP compiler chain receives backend-specific payloads.",
    boundary:
      "Responses are bounded by a 30-second request timeout, retries, and a PDF magic-byte check. Repository evidence does not establish a compiler sandbox.",
  },
  {
    id: "output",
    label: "Output",
    src: "/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-output-layer.svg",
    summary:
      "The browser receives a PDF blob and retains both generated-body and composed-source LaTeX for preview or copy.",
    boundary:
      "Saving PDF bytes and combining documents requires authentication and is optional to the conversion path.",
  },
  {
    id: "proposed",
    label: "Proposed",
    src: "/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-proposed-layer.svg",
    summary:
      "PROPOSED / CONCEPTUAL ML-CV: perspective and illumination normalization, a math-aware layout graph, region uncertainty, and compile-repair plus render-regression gates.",
    boundary:
      "This disconnected dashed layer is not shipped behavior, not an implementation claim, and carries no fabricated accuracy, confidence, or latency values.",
  },
];

const INSPECTOR_MODES: InspectorMode[] = [
  {
    id: "source",
    label: "Source",
    eyebrow: "Artifact 01 / source",
    title: "A large TeX corpus with an explicit dependency boundary.",
    facts: [
      "7,237 source lines",
      "3 chapters",
      "62 numbered sections",
      "SHA-256 6ff659b0…e6cbab",
    ],
    snippet: [
      "\\documentclass{report}",
      "",
      "\\input{preamble}",
      "\\input{macros}",
      "\\input{letterfonts}",
      "",
      "\\chapter{Vector Fields $f:\\mathbb{R}^n \\rightarrow \\mathbb{R}^n$}",
      "\\section{Vector Fields}",
    ].join("\n"),
    boundary:
      "The supplied main.tex is offered as-is. The three imported files and two referenced images are not included, so this is not described as a standalone compile bundle.",
  },
  {
    id: "grammar",
    label: "Grammar",
    eyebrow: "Artifact 02 / structure",
    title: "Semantic macros and plot code carry the document hierarchy.",
    facts: [
      "\\dfn / \\ex / \\nt",
      "\\thm / \\qs / \\sol",
      "63 tikzpicture blocks",
      "32 PGFPlots axis blocks",
    ],
    snippet: [
      "\\ex{Example: Cross Product}{",
      "\tLet \\( \\vec{v} = 2\\hat{i} - \\hat{j} - 3\\hat{k} \\) and \\( \\vec{w} = \\hat{i} + \\hat{j} + \\hat{k} \\). The cross product \\( \\vec{v} \\times \\vec{w} \\) is computed as:",
      "",
      "\t\\[",
      "\t\t\\vec{v} \\times \\vec{w} = \\left( 2\\hat{i} - \\hat{j} - 3\\hat{k} \\right) \\times \\left( \\hat{i} + \\hat{j} + \\hat{k} \\right)",
      "\t\\]",
    ].join("\n"),
    boundary:
      "This short excerpt is transcribed from the supplied source’s Cross Product example; it is not synthetic model reasoning or an accuracy claim.",
  },
  {
    id: "render",
    label: "Render",
    eyebrow: "Artifact 03 / output",
    title: "The supplied PDF makes source structures inspectable page by page.",
    facts: [
      "110 supplied PDF pages",
      "US letter / 612 × 792 pt",
      "5 curated full-page previews",
      "SHA-256 947c1a70…d56895",
    ],
    snippet: [
      "page 015  theorem + question + helix",
      "page 042  multivariable surface plots",
      "page 075  definition + example + cylinder",
      "page 083  Cartesian ↔ polar construction",
      "page 100  vector-field diagrams",
    ].join("\n"),
    boundary:
      "The file is labeled only as the supplied generated PDF. The page count is verified metadata; no completeness or model-quality claim is attached to it.",
  },
];

const ARTIFACTS = [
  {
    type: "PDF / 110 pages",
    title: "Supplied generated PDF",
    detail:
      "The exact US-letter artifact used for every page preview on this case study.",
    openHref:
      "/media/projects/ai-notes-or-ocr/casma225/CASMA225_Giacomo_pieces.pdf",
    downloadName: "CASMA225_Giacomo_pieces.pdf",
  },
  {
    type: "TeX / 7,237 lines",
    title: "Supplied main.tex",
    detail:
      "The source artifact as provided, including its external import and image references.",
    openHref: "/media/projects/ai-notes-or-ocr/casma225/main.tex",
    downloadName: "main.tex",
  },
];

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

function AgentMicroscope() {
  const viewportId = useId();
  const readoutId = useId();
  const [selectedId, setSelectedId] = useState("overview");
  const selected =
    AGENT_LAYERS.find((layer) => layer.id === selectedId) ?? AGENT_LAYERS[0];

  return (
    <figure
      className={styles.explorer}
      data-active={selected.id}
      aria-labelledby="noteworthy-agent-heading"
    >
      <div
        className={styles.controls}
        role="group"
        aria-label="Select NoteWorthy execution layer"
      >
        {AGENT_LAYERS.map((layer, index) => (
          <button
            key={layer.id}
            data-layer-control={layer.id}
            type="button"
            aria-controls={viewportId}
            aria-pressed={selected.id === layer.id}
            onClick={() => setSelectedId(layer.id)}
            onKeyDown={(event) =>
              handleArrowSelection(event, AGENT_LAYERS, index, setSelectedId)
            }
          >
            <span>{String(index).padStart(2, "0")}</span>
            {layer.label}
          </button>
        ))}
      </div>

      <div
        id={viewportId}
        className={styles.technicalViewport}
        role="img"
        aria-label="Exploded NoteWorthy execution system from image preparation through streamed LaTeX generation, template composition, configurable HTTP compilation, and browser output, with optional persistence, separate historical rails, and a switchable proposed conceptual ML-CV layer."
        aria-describedby={readoutId}
        tabIndex={0}
      >
        <div className={styles.layerStack}>
          <Image
            className={styles.master}
            src="/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-exploded.svg"
            alt=""
            width={2400}
            height={1350}
            sizes="94vw"
            unoptimized
            draggable={false}
          />
          {AGENT_LAYERS.filter((layer): layer is AgentLayer & { src: string } =>
            Boolean(layer.src),
          ).map((layer) => (
            <Image
              key={layer.id}
              className={styles.layer}
              data-layer={layer.id}
              src={layer.src}
              alt=""
              width={2400}
              height={1350}
              sizes="94vw"
              unoptimized
              draggable={false}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className={styles.fullResolutionLink}>
        <a
          href="/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-exploded.svg"
          target="_blank"
          rel="noreferrer"
        >
          Open full-resolution execution atlas
        </a>
      </div>

      <figcaption
        id={readoutId}
        className={styles.readout}
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <span>Evidence focus</span>
          <strong>{selected.label}</strong>
        </div>
        <p>{selected.summary}</p>
        <p>
          <span>Boundary</span>
          {selected.boundary}
        </p>
      </figcaption>
    </figure>
  );
}

function ArtifactInspector() {
  const panelId = useId();
  const [selectedId, setSelectedId] = useState("source");
  const selected =
    INSPECTOR_MODES.find((mode) => mode.id === selectedId) ??
    INSPECTOR_MODES[0];

  return (
    <div className={styles.artifactInspector}>
      <figure className={styles.documentFigure}>
        <div
          className={styles.documentViewport}
          role="img"
          aria-label="Exploded document artifact linking the supplied main.tex source and its dependencies to document hierarchy, semantic macros, TikZ and PGFPlots structures, and five full-page previews from the supplied 110-page PDF."
          tabIndex={0}
        >
          <Image
            src="/media/projects/ai-notes-or-ocr/technical/noteworthy-document-exploded.svg"
            alt=""
            width={2400}
            height={1350}
            sizes="94vw"
            unoptimized
            draggable={false}
          />
        </div>
        <figcaption>
          Structural counts come from the byte-stable source and PDF artifacts.
          Open the full plate for its embedded source ledger and accessibility
          description.
          <a
            href="/media/projects/ai-notes-or-ocr/technical/noteworthy-document-exploded.svg"
            target="_blank"
            rel="noreferrer"
          >
            Open full-resolution artifact view
          </a>
        </figcaption>
      </figure>

      <div
        className={styles.inspectorControls}
        role="group"
        aria-label="Select source artifact view"
      >
        {INSPECTOR_MODES.map((mode, index) => (
          <button
            key={mode.id}
            type="button"
            aria-controls={panelId}
            aria-pressed={selected.id === mode.id}
            onClick={() => setSelectedId(mode.id)}
            onKeyDown={(event) =>
              handleArrowSelection(event, INSPECTOR_MODES, index, setSelectedId)
            }
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {mode.label}
          </button>
        ))}
      </div>

      <div
        id={panelId}
        className={styles.inspectorPanel}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={styles.inspectorCopy}>
          <p>{selected.eyebrow}</p>
          <h3>{selected.title}</h3>
          <ul role="list">
            {selected.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <p className={styles.boundary}>{selected.boundary}</p>
        </div>
        <pre aria-label={`${selected.label} artifact excerpt`}>
          <code>{selected.snippet}</code>
        </pre>
      </div>
    </div>
  );
}

function PageViewer({ project }: { project: Project }) {
  const pages = project.gallery ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = pages[selectedIndex];

  if (!selected) {
    return null;
  }

  const pageNumber = selected.page ?? selectedIndex + 1;
  const liveLabel = `Selected supplied PDF page ${pageNumber} of 110. ${
    selected.caption ?? ""
  }`;

  return (
    <div className={styles.pageViewer}>
      <div className={styles.pageControls}>
        <button
          type="button"
          onClick={() => setSelectedIndex((index) => Math.max(0, index - 1))}
          disabled={selectedIndex === 0}
          aria-label="Show previous curated PDF page"
        >
          Previous
        </button>

        <div
          className={styles.pageNumbers}
          role="group"
          aria-label="Select curated PDF page"
        >
          {pages.map((page, index) => (
            <button
              key={page.src}
              type="button"
              aria-pressed={selectedIndex === index}
              aria-label={`Show supplied PDF page ${page.page ?? index + 1}`}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                const pageItems = pages.map((item, itemIndex) => ({
                  id: String(itemIndex),
                  page: item,
                }));
                handleArrowSelection(event, pageItems, index, (id) =>
                  setSelectedIndex(Number(id)),
                );
              }}
            >
              {page.page ?? index + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSelectedIndex((index) => Math.min(pages.length - 1, index + 1))
          }
          disabled={selectedIndex === pages.length - 1}
          aria-label="Show next curated PDF page"
        >
          Next
        </button>
      </div>

      <figure className={styles.pageFigure}>
        <div className={styles.pageFrame}>
          <Image
            key={selected.src}
            src={selected.src}
            alt={selected.alt}
            width={selected.width}
            height={selected.height}
            sizes="(max-width: 767px) 92vw, 44rem"
          />
        </div>
        <figcaption>
          <span>Supplied PDF / page {pageNumber} of 110</span>
          {selected.caption}
        </figcaption>
      </figure>

      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {liveLabel}
      </p>
    </div>
  );
}

export function NoteWorthyCaseStudy({ project }: { project: Project }) {
  return (
    <div className={styles.caseStudy}>
      <section
        className={styles.section}
        aria-labelledby="noteworthy-agent-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>
            Interactive system 01 / current runtime
          </p>
          <h2 id="noteworthy-agent-heading">
            Follow one conversion across every boundary.
          </h2>
          <p>
            The retained hook name says “WebSocket,” but the executable client
            now uses a streamed HTTP request. Isolate each layer to inspect the
            real request path, its limits, and the optional persistence rail.
          </p>
        </header>
        <AgentMicroscope />
      </section>

      <section
        className={`${styles.section} ${styles.artifactSection}`}
        aria-labelledby="noteworthy-artifact-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>
            Interactive system 02 / artifact evidence
          </p>
          <h2 id="noteworthy-artifact-heading">
            Source, structure, and render stay connected.
          </h2>
          <p>
            The supplied TeX and PDF are treated as evidence, not a quality
            score. Counts come from the files; the selected views expose the
            grammar, plotting structures, and final page forms behind them.
          </p>
        </header>
        <ArtifactInspector />
      </section>

      <section
        className={styles.section}
        aria-labelledby="noteworthy-pages-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Selected pages / supplied PDF</p>
          <h2 id="noteworthy-pages-heading">
            Full pages, at their intrinsic portrait ratio.
          </h2>
          <p>
            Five pages span boxed theorem grammar, equations, 3D surfaces, polar
            construction, and vector fields. Nothing auto-advances, and every
            preview is contained without a landscape crop.
          </p>
        </header>
        <PageViewer project={project} />
      </section>

      <section
        className={`${styles.section} ${styles.artifactsSection}`}
        aria-labelledby="noteworthy-downloads-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Evidence bundle / direct artifacts</p>
          <h2 id="noteworthy-downloads-heading">
            Inspect the supplied files directly.
          </h2>
          <p>
            The PDF is the exact file behind the previews. The TeX source is
            available unchanged and keeps its external dependency boundary
            visible.
          </p>
        </header>

        <div className={styles.artifactGrid}>
          {ARTIFACTS.map((artifact) => (
            <article key={artifact.title}>
              <p>{artifact.type}</p>
              <h3>{artifact.title}</h3>
              <span>{artifact.detail}</span>
              <div>
                <a href={artifact.openHref} target="_blank" rel="noreferrer">
                  Open artifact
                </a>
                <a href={artifact.openHref} download={artifact.downloadName}>
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.runtimeNotes}>
          <article>
            <p>Current</p>
            <h3>SSE is the live transport.</h3>
            <span>
              The browser fetches the generation route with text/event-stream,
              then composes and compiles after completion.
            </span>
          </article>
          <article>
            <p>Optional</p>
            <h3>Library features require identity.</h3>
            <span>
              SavedPdf persistence and document combination sit outside the
              default conversion path.
            </span>
          </article>
          <article>
            <p>Historical / alternate</p>
            <h3>Socket.IO and latexmk remain repository rails.</h3>
            <span>
              They document earlier transport and compiler approaches; the
              current client and compiler route do not default to them.
            </span>
          </article>
        </div>
      </section>
    </div>
  );
}
