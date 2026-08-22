"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useState,
} from "react";
import { useMotionActivity } from "@/hooks/useMotionActivity";
import styles from "./TickitExplodedViews.module.css";

type EvidenceTone = "current" | "history";

type ExplodedLayer = {
  id: string;
  label: string;
  src?: string;
  evidence: string;
  sourceAvailability: string;
  summary: string;
  boundary: string;
};

type ExplodedDefinition = {
  title: string;
  kicker: string;
  description: string;
  accessibleName: string;
  masterSrc: string;
  tone: EvidenceTone;
  layers: ExplodedLayer[];
};

const PLATFORM: ExplodedDefinition = {
  kicker: "Interactive system 01",
  title: "Current event-operations platform",
  description:
    "Isolate the supplied Next.js product surfaces, the authenticated Rails boundary, or the persisted event-operations layer. Every view stays aligned to one full-frame source master.",
  accessibleName:
    "Exploded TickIT current platform with public and organizer Next.js interfaces, organization-scoped Rails APIs using Devise JWT, and PostgreSQL plus PostGIS event, ticket, member, invitation, and checker-routine state.",
  masterSrc: "/media/projects/tickit/tickit-platform-exploded.svg",
  tone: "current",
  layers: [
    {
      id: "overview",
      label: "Overview",
      evidence: "Current snapshot / verified",
      sourceAvailability: "Implementation source available",
      summary:
        "The supplied snapshot connects public discovery and organizer controls to authenticated, organization-scoped Rails services and persisted event operations.",
      boundary:
        "This master focuses on the event-operations core; the implemented commerce, access, and intelligence layers are mapped in the second system.",
    },
    {
      id: "interface",
      label: "Interfaces",
      src: "/media/projects/tickit/tickit-platform-interface-layer.svg",
      evidence: "Current snapshot / verified",
      sourceAvailability: "Next.js source available",
      summary:
        "Public event details sit alongside organizer event setup, details, tickets and tiers, team status, invitations, and checker-routine controls.",
      boundary:
        "The layer shows the implemented product surfaces and the typed API edges connecting them to Rails.",
    },
    {
      id: "service",
      label: "Services",
      src: "/media/projects/tickit/tickit-platform-service-layer.svg",
      evidence: "Current snapshot / verified",
      sourceAvailability: "Rails and client source available",
      summary:
        "Typed client modules cross public, business, and admin Rails route boundaries. Business requests authenticate with Devise JWT and resolve organization scope before controller work.",
      boundary:
        "Google Maps is shown only at the configured place-resolution boundary. No additional services or queues are inferred.",
    },
    {
      id: "operations",
      label: "Operations",
      src: "/media/projects/tickit/tickit-platform-operations-layer.svg",
      evidence: "Current snapshot / verified",
      sourceAvailability: "Models and schema available",
      summary:
        "PostgreSQL and PostGIS hold event, location, ticket, tier, member, invitation, and checker-routine state. Event creation runs the current checker-copy job.",
      boundary:
        "The job is represented as the supplied synchronous after-create path, not as an invented asynchronous topology.",
    },
  ],
};

const HISTORY: ExplodedDefinition = {
  kicker: "Interactive system 02",
  title: "Implemented commerce, access, and intelligence",
  description:
    "Inspect the delivered product boundaries alongside the technical details preserved in the current platform source and surviving QR implementation artifacts.",
  accessibleName:
    "Exploded TickIT implementation with attendee ticket purchasing and Stripe processing, encrypted and signed QR generation with validation and friend sharing, and organizer spend analytics and planning.",
  masterSrc:
    "/media/projects/tickit/tickit-commerce-intelligence-exploded.svg",
  tone: "history",
  layers: [
    {
      id: "overview",
      label: "Overview",
      evidence: "Implemented / shipped",
      sourceAvailability: "Author-attested delivery + inspected artifacts",
      summary:
        "The delivered product connected attendee commerce and access workflows to organizer operations, analytics, forecasting, and planning.",
      boundary:
        "The view groups implemented product capabilities without treating the surviving source snapshots as an exact copy of the production topology.",
    },
    {
      id: "commerce",
      label: "Commerce",
      src: "/media/projects/tickit/tickit-commerce-intelligence-commerce-layer.svg",
      evidence: "Implemented / shipped",
      sourceAvailability: "Shipped boundary + inspected platform source",
      summary:
        "Attendee ticket purchasing shipped with Stripe processing; the inspected platform source documents typed ticket and tier APIs plus PostgreSQL event and catalog state.",
      boundary:
        "The diagram relates those observed boundaries at product level without reconstructing an unavailable production payment sequence.",
    },
    {
      id: "access",
      label: "Access",
      src: "/media/projects/tickit/tickit-commerce-intelligence-access-layer.svg",
      evidence: "Implemented / shipped",
      sourceAvailability: "Rails + client implementation artifacts",
      summary:
        "Surviving artifacts implement authenticated encrypted-and-signed token generation, typed client retrieval, expiry selection, and QR rendering; the shipped product also included validation, sharing, and access management.",
      boundary:
        "The artifacts document token generation and rendering; author attestation establishes the delivered validation and sharing capabilities without claiming exact snapshot equivalence.",
    },
    {
      id: "intelligence",
      label: "Intelligence",
      src: "/media/projects/tickit/tickit-commerce-intelligence-intelligence-layer.svg",
      evidence: "Implemented / shipped",
      sourceAvailability: "Implemented capability evidence",
      summary:
        "Customer-spend tracking and analytics supported organizer dashboards for predictions, forecasts, operational metrics, and cost planning.",
      boundary:
        "The available evidence does not expose private analytics schemas, jobs, model families, or the exact production data path.",
    },
  ],
};

function ExplodedView({ definition }: { definition: ExplodedDefinition }) {
  const viewportId = useId();
  const readoutId = useId();
  const [selectedId, setSelectedId] = useState("overview");
  const selected =
    definition.layers.find((layer) => layer.id === selectedId) ??
    definition.layers[0];

  return (
    <figure
      className={styles.explorer}
      data-active={selected.id}
      data-tone={definition.tone}
    >
      <header className={styles.explorerHeader}>
        <div>
          <p>{definition.kicker}</p>
          <h3>{definition.title}</h3>
        </div>
        <p>{definition.description}</p>
      </header>

      <div
        className={styles.layerControls}
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
        data-technical-visual="true"
        role="img"
        aria-label={definition.accessibleName}
        aria-describedby={readoutId}
        tabIndex={0}
      >
        <div className={styles.stack}>
          <Image
            className={`${styles.master} ${
              selected.id === "overview" ? "" : styles.masterDimmed
            }`}
            src={definition.masterSrc}
            alt=""
            width={2400}
            height={1350}
            sizes="(max-width: 767px) 100vw, 94vw"
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
                className={`${styles.layer} ${
                  selected.id === layer.id ? styles.layerActive : ""
                }`}
                data-layer={layer.id}
                src={layer.src}
                alt=""
                width={2400}
                height={1350}
                sizes="(max-width: 767px) 100vw, 94vw"
                unoptimized
                draggable={false}
                aria-hidden="true"
              />
            ))}
        </div>
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
        <div>
          <span>{selected.evidence}</span>
          <p>{selected.sourceAvailability}</p>
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

type SequenceStage = {
  id: string;
  number: string;
  title: string;
  evidence: string;
  sourceAvailability: string;
  summary: string;
  boundary: string;
  tone: EvidenceTone;
  claimIds: string[];
};

const SEQUENCE_STAGES: SequenceStage[] = [
  {
    id: "setup",
    number: "01",
    title: "Event setup + catalog",
    evidence: "Current snapshot / verified",
    sourceAvailability: "Implementation source available",
    summary:
      "An organizer creates an event, resolves its location, and builds the ticket and tier catalog in the supplied snapshot.",
    boundary:
      "This stage stops at current event operations; it does not imply that the supplied snapshot contains purchasing.",
    tone: "current",
    claimIds: [
      "interface-event-setup",
      "interface-ticket-management",
      "operations-tickets",
    ],
  },
  {
    id: "purchase",
    number: "02",
    title: "Ticket purchase + Stripe",
    evidence: "Implemented / shipped",
    sourceAvailability: "Shipped boundary + inspected ticket/catalog source",
    summary:
      "The attendee purchase flow shipped with Stripe processing; the inspected platform separately documents typed ticket and tier APIs plus persisted event and catalog state.",
    boundary:
      "The relationship is product-level and does not reconstruct an unavailable handler, webhook, retry, or persistence sequence.",
    tone: "history",
    claimIds: ["commerce-purchase", "commerce-stripe"],
  },
  {
    id: "access",
    number: "03",
    title: "QR access + friend sharing",
    evidence: "Implemented / shipped",
    sourceAvailability: "Rails + React implementation artifacts",
    summary:
      "Surviving Rails and client artifacts build an expiring encrypted-and-signed token, fetch it through a typed API, and render it as QR; the shipped capability set also included validation and sharing.",
    boundary:
      "The artifacts disagree on expiration option names, so the view does not claim that their stashed contract exactly matches the production validation path.",
    tone: "history",
    claimIds: [
      "access-qr-generation",
      "access-qr-validation",
      "access-friend-sharing",
    ],
  },
  {
    id: "analytics",
    number: "04",
    title: "Spend signal + analytics",
    evidence: "Implemented / shipped",
    sourceAvailability: "Implemented; private internals unpublished",
    summary:
      "Customer-spend tracking and analytics shipped as the input capability for organizer-facing operational intelligence.",
    boundary:
      "No unavailable event schema, table, job, API contract, or orchestration topology is inferred.",
    tone: "history",
    claimIds: ["intelligence-spend", "intelligence-analytics"],
  },
  {
    id: "planning",
    number: "05",
    title: "Forecast + cost planning",
    evidence: "Implemented / shipped",
    sourceAvailability: "Next.js organizer dashboards",
    summary:
      "Organizer dashboards presented spending predictions, inventory forecasts, operational metrics, and event cost-planning outputs.",
    boundary:
      "The capability is implemented; unavailable model families, features, horizons, and evaluation metrics are not reconstructed.",
    tone: "history",
    claimIds: [
      "intelligence-spending-prediction",
      "intelligence-inventory-forecast",
      "intelligence-cost-planning",
    ],
  },
];

export function TickitOperationalSequence() {
  const viewportId = useId();
  const readoutId = useId();
  const { isActive, reducedMotion, ref: motionRef } =
    useMotionActivity<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = SEQUENCE_STAGES[activeIndex];
  const sequencePaused = paused || !isActive;

  useEffect(() => {
    if (sequencePaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SEQUENCE_STAGES.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [sequencePaused]);

  const focusStage = (index: number) => {
    setActiveIndex(index);
    if (!reducedMotion) {
      setPaused(true);
    }
  };

  return (
    <figure
      ref={motionRef}
      className={styles.sequence}
      data-paused={sequencePaused}
      data-active={active.id}
    >
      <header className={styles.sequenceHeader}>
        <div>
          <p>Operational sequence / explanatory view</p>
          <h3>From event setup to organizer planning</h3>
        </div>
        <button
          type="button"
          aria-controls={viewportId}
          aria-pressed={sequencePaused}
          disabled={reducedMotion}
          onClick={() => setPaused((current) => !current)}
        >
          {reducedMotion
            ? "Static sequence"
            : paused
              ? "Play sequence"
              : "Pause sequence"}
        </button>
      </header>

      <ol className={styles.stageControls} aria-label="Select sequence stage">
        {SEQUENCE_STAGES.map((stage, index) => (
          <li key={stage.id}>
            <button
              type="button"
              aria-controls={viewportId}
              aria-pressed={index === activeIndex}
              onClick={() => focusStage(index)}
            >
              <span>{stage.number}</span>
              {stage.title}
            </button>
          </li>
        ))}
      </ol>

      <div
        id={viewportId}
        className={styles.sequenceViewport}
        role="img"
        aria-label="Five-stage TickIT product sequence from event setup through implemented commerce, access, analytics, forecasting, and cost planning."
        aria-describedby={readoutId}
        tabIndex={0}
      >
        <div className={styles.sequenceFlow} aria-hidden="true">
          {SEQUENCE_STAGES.map((stage, index) => (
            <div
              key={stage.id}
              className={`${styles.sequenceStage} ${
                index === activeIndex ? styles.sequenceStageActive : ""
              }`}
              data-tone={stage.tone}
              data-claim-ids={stage.claimIds.join(" ")}
            >
              <span>{stage.number}</span>
              <strong>{stage.title}</strong>
              <i />
              <small>{stage.evidence}</small>
            </div>
          ))}
        </div>
      </div>

      <figcaption
        id={readoutId}
        className={styles.sequenceReadout}
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <span>Stage {active.number}</span>
          <strong>{active.title}</strong>
        </div>
        <div>
          <span>{active.evidence}</span>
          <p>{active.sourceAvailability}</p>
        </div>
        <p>{active.summary}</p>
        <p>
          <span>Boundary</span>
          {active.boundary}
        </p>
      </figcaption>
    </figure>
  );
}

export function TickitPlatformExplorer() {
  return <ExplodedView definition={PLATFORM} />;
}

export function TickitHistoryExplorer() {
  return <ExplodedView definition={HISTORY} />;
}
