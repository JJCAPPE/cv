"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./MoveExplodedViews.module.css";

type ExplodedLayer = {
  id: string;
  label: string;
  src?: string;
  summary: string;
  boundary: string;
};

type ExplodedDefinition = {
  title: string;
  kicker: string;
  description: string;
  accessibleName: string;
  masterSrc: string;
  layers: ExplodedLayer[];
};

const AGENT_INTERFACE: ExplodedDefinition = {
  kicker: "Interactive system 01",
  title: "Agent ↔ interface layers",
  description:
    "Isolate the authenticated request boundary, governed runtime, or typed return path. Every state uses a generated transparent plate aligned to the same master.",
  accessibleName:
    "Exploded MOVE system with an authenticated React request passing through FastAPI and Databricks Model Serving into the governed agent runtime, then returning through a versioned contract and typed UI renderers.",
  masterSrc: "/media/projects/move/move-agent-interface-exploded.svg",
  layers: [
    {
      id: "overview",
      label: "Overview",
      summary:
        "The complete path shows the interface, governed agent runtime, and typed return as one source-pinned system.",
      boundary:
        "This is a deterministic teaching view, not a live request trace or simulated agent run.",
    },
    {
      id: "request",
      label: "Request",
      src: "/media/projects/move/move-agent-interface-request-layer.svg",
      summary:
        "The React client posts to /api/chat. FastAPI validates session and access, then hands a ChatRequest to ServingEndpointBackend.",
      boundary:
        "The browser never calls Databricks directly. Interface history and votes remain optional.",
    },
    {
      id: "runtime",
      label: "Runtime",
      src: "/media/projects/move/move-agent-interface-runtime-layer.svg",
      summary:
        "Model Serving invokes the ResponsesAgent; validation, trusted identity, routing, context, safe execution, evidence coverage, and one scoped repair stay in code.",
      boundary:
        "SQL and document evidence are governed side inputs. Agent conversation state is off in the tracked target.",
    },
    {
      id: "response",
      label: "Response",
      src: "/media/projects/move/move-agent-interface-response-layer.svg",
      summary:
        "bmed.agent.contract.v1 is converted by _ResponsesAgentAdapter into AI UI events consumed by useChat and typed message renderers.",
      boundary:
        "Only public reasoning summaries are shown; private chain-of-thought is not exposed.",
    },
  ],
};

const SKILLS_ADG: ExplodedDefinition = {
  kicker: "Interactive system 02",
  title: "Skills / ADG layers",
  description:
    "Inspect how reviewed file packages become bounded context while selection and execution authority remain in registered code.",
  accessibleName:
    "Exploded MOVE skill system showing manifest-bound file packages resolving into bounded ADG context, then narrowing tool ranking before SafeToolExecutor applies final policy.",
  masterSrc: "/media/projects/move/move-skill-adg-exploded.svg",
  layers: [
    {
      id: "overview",
      label: "Overview",
      summary:
        "The full system separates package resolution, bounded context composition, and code-owned tool authority.",
      boundary:
        "The tracked production target uses advise mode with files; optional and historical rails are visually distinct.",
    },
    {
      id: "resolve",
      label: "Resolve",
      src: "/media/projects/move/move-skill-adg-resolve-layer.svg",
      summary:
        "manifest.yml bounds reviewed YAML/Markdown pairs. Resolution reads at most eight messages and 6,000 characters, then loads core, one domain, matching actions, and no more than four skills.",
      boundary:
        "Delta is a supported optional source. Loading a draft package emits an explicit warning.",
    },
    {
      id: "context",
      label: "Compose",
      src: "/media/projects/move/move-skill-adg-context-layer.svg",
      summary:
        "Successful structured history reconstructs state; general and current sections are mandatory, while successor sections fit only when the 12,000-character envelope permits.",
      boundary:
        "ADG edges describe allowed guidance, not a forced funnel. Prospective content is follow-up only.",
    },
    {
      id: "authority",
      label: "Authorize",
      src: "/media/projects/move/move-skill-adg-authority-layer.svg",
      summary:
        "Primary and documented tools are ranking hints. ToolSelector intersects registry, policy, route, and identity, then exposes at most six schemas.",
      boundary:
        "SafeToolExecutor still enforces read-only policy, budgets, timeouts, limits, redaction, and stable failures. Skills never grant tools.",
    },
  ],
};

function ExplodedView({ definition }: { definition: ExplodedDefinition }) {
  const viewportId = useId();
  const [selectedId, setSelectedId] = useState("overview");
  const selected =
    definition.layers.find((layer) => layer.id === selectedId) ??
    definition.layers[0];

  return (
    <figure className={styles.explorer} data-active={selected.id}>
      <header className={styles.header}>
        <div>
          <p>{definition.kicker}</p>
          <h3>{definition.title}</h3>
        </div>
        <p>{definition.description}</p>
      </header>

      <div
        className={styles.controls}
        role="group"
        aria-label={`Select ${definition.title.toLowerCase()} view`}
      >
        {definition.layers.map((layer, index) => (
          <button
            key={layer.id}
            type="button"
            aria-controls={viewportId}
            aria-pressed={selected.id === layer.id}
            onClick={() => setSelectedId(layer.id)}
          >
            <span>{String(index).padStart(2, "0")}</span>
            {layer.label}
          </button>
        ))}
      </div>

      <div
        id={viewportId}
        className={styles.viewport}
        role="img"
        aria-label={definition.accessibleName}
      >
        <div className={styles.stack}>
          <Image
            className={styles.master}
            src={definition.masterSrc}
            alt=""
            width={2400}
            height={1350}
            sizes="(max-width: 767px) 92vw, 94vw"
            unoptimized
            draggable={false}
          />
          {definition.layers
            .filter(
              (layer): layer is ExplodedLayer & { src: string } =>
                Boolean(layer.src),
            )
            .map((layer) => (
              <Image
                key={layer.id}
                className={styles.layer}
                data-layer={layer.id}
                src={layer.src}
                alt=""
                width={2400}
                height={1350}
                sizes="(max-width: 767px) 92vw, 94vw"
                unoptimized
                draggable={false}
                aria-hidden="true"
              />
            ))}
        </div>
      </div>

      <figcaption className={styles.readout} aria-live="polite" aria-atomic="true">
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

export function MoveAgentInterfaceExplorer() {
  return <ExplodedView definition={AGENT_INTERFACE} />;
}

export function MoveSkillAdgExplorer() {
  return <ExplodedView definition={SKILLS_ADG} />;
}
