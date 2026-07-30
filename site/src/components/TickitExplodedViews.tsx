"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import styles from "./TickitExplodedViews.module.css";

type EvidenceTone = "current" | "history" | "wip";

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
        "This master describes the inspected Rails and Next.js repositories only. Historically shipped commerce is kept in a separate system.",
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
        "The layer shows implemented product surfaces and their documented API edges; it does not claim that every visible control is complete.",
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
  title: "Shipped commerce, access, and intelligence",
  description:
    "Inspect the author-verified shipped capability boundaries without filling the absent production source with invented services, schemas, algorithms, or metrics.",
  accessibleName:
    "Exploded TickIT shipped capability system with attendee ticket purchasing and Stripe processing, QR generation and validation with friend sharing, organizer spend analytics and planning, and a separate dotted rail for incomplete local QR stash artifacts.",
  masterSrc:
    "/media/projects/tickit/tickit-commerce-intelligence-exploded.svg",
  tone: "history",
  layers: [
    {
      id: "overview",
      label: "Overview",
      evidence: "Author-verified shipped history",
      sourceAvailability: "Implementation source unavailable",
      summary:
        "The shipped product covered ticket commerce, attendee access, and organizer intelligence. Local QR drafts remain a visibly separate WIP evidence class.",
      boundary:
        "The relationships are explanatory capability groupings, not a live trace or reconstruction of unavailable production topology.",
    },
    {
      id: "commerce",
      label: "Commerce",
      src: "/media/projects/tickit/tickit-commerce-intelligence-commerce-layer.svg",
      evidence: "Author-verified shipped history",
      sourceAvailability: "Implementation source unavailable",
      summary:
        "Attendee ticket-purchase flows shipped with a documented Stripe payment-processing boundary.",
      boundary:
        "No payment-intent schema, webhook handler, queue, retry policy, or service name is claimed.",
    },
    {
      id: "access",
      label: "Access",
      src: "/media/projects/tickit/tickit-commerce-intelligence-access-layer.svg",
      evidence: "Author-verified shipped + artifact WIP",
      sourceAvailability: "Production source unavailable; two stashes partial",
      summary:
        "QR generation, QR validation, friend sharing, and attendee access management shipped. Two January 2025 QR drafts are shown below as dotted local artifacts.",
      boundary:
        "The stash drafts disagree on expiration options and are not presented as the source of the shipped validation path.",
    },
    {
      id: "intelligence",
      label: "Intelligence",
      src: "/media/projects/tickit/tickit-commerce-intelligence-intelligence-layer.svg",
      evidence: "Author-verified shipped history",
      sourceAvailability: "Implementation source unavailable",
      summary:
        "Customer-spend tracking and analytics supported organizer dashboards for predictions, forecasts, operational metrics, and event cost planning.",
      boundary:
        "The visual asserts capability boundaries only—no table names, event schemas, model family, forecast method, or performance number.",
    },
  ],
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

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
  tone: Exclude<EvidenceTone, "wip">;
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
    evidence: "Author-verified shipped history",
    sourceAvailability: "Implementation source unavailable",
    summary:
      "The shipped attendee journey included ticket purchasing and a Stripe payment-processing boundary.",
    boundary:
      "The step is capability-level; no unavailable payment sequence or handler is reconstructed.",
    tone: "history",
    claimIds: ["commerce-purchase", "commerce-stripe"],
  },
  {
    id: "access",
    number: "03",
    title: "QR access + friend sharing",
    evidence: "Author-verified shipped history",
    sourceAvailability: "Implementation source unavailable",
    summary:
      "Shipped QR generation and validation worked alongside friend sharing and attendee access management.",
    boundary:
      "The separate stash drafts are historical WIP and do not define this shipped access stage.",
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
    evidence: "Author-verified shipped history",
    sourceAvailability: "Implementation source unavailable",
    summary:
      "Customer-spend tracking and analytics pipelines fed the organizer-facing intelligence capability.",
    boundary:
      "“Fed” describes the documented product relationship, not an invented event or data schema.",
    tone: "history",
    claimIds: ["intelligence-spend", "intelligence-analytics"],
  },
  {
    id: "planning",
    number: "05",
    title: "Forecast + cost planning",
    evidence: "Author-verified shipped history",
    sourceAvailability: "Implementation source unavailable",
    summary:
      "Organizer dashboards supported spending predictions, inventory forecasts, operational metrics, and event cost planning.",
    boundary:
      "No algorithm, horizon, metric value, or measured outcome is asserted.",
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
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = SEQUENCE_STAGES[activeIndex];
  const sequencePaused = paused || reducedMotion;

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
        aria-label="Five-stage explanatory TickIT product sequence from current event setup through author-verified commerce, access, analytics, forecasting, and cost planning."
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
