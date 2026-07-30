import {
  TickitHistoryExplorer,
  TickitOperationalSequence,
  TickitPlatformExplorer,
} from "./TickitExplodedViews";
import styles from "./TickitCaseStudy.module.css";

const evidenceClasses = [
  {
    id: "current",
    title: "Current code snapshot",
    confidence: "Verified",
    availability: "Implementation source available",
    description:
      "Solid yellow marks behavior inspected in the supplied Rails and Next.js repositories.",
  },
  {
    id: "history",
    title: "Author-verified shipped history",
    confidence: "Author attested",
    availability: "Implementation source unavailable",
    description:
      "Solid blue marks shipped capabilities confirmed by the résumé and the author without reconstructing absent internals.",
  },
  {
    id: "wip",
    title: "Local historical WIP",
    confidence: "Artifact WIP",
    availability: "Partial stash source",
    description:
      "Dotted treatment isolates the two incomplete January 2025 QR stash artifacts from both production evidence classes.",
  },
] as const;

export function TickitCaseStudy() {
  return (
    <div className={styles.caseStudy}>
      <section
        className={`${styles.section} ${styles.evidenceSection}`}
        aria-labelledby="tickit-evidence-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Evidence model</p>
          <h2 id="tickit-evidence-heading">
            Dense by design. Precise about what is known.
          </h2>
          <p>
            TickIT spans a current event-operations snapshot and a broader set
            of historically shipped product capabilities. The case study keeps
            those sources separate so visual complexity never turns into
            invented implementation detail.
          </p>
        </header>

        <dl className={styles.evidenceGrid}>
          {evidenceClasses.map((entry) => (
            <div key={entry.id} data-evidence={entry.id}>
              <dt>
                <i aria-hidden="true" />
                {entry.title}
              </dt>
              <dd>{entry.description}</dd>
              <dd>
                <span>{entry.confidence}</span>
                <span>{entry.availability}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className={`${styles.section} ${styles.platformSection}`}
        aria-labelledby="tickit-platform-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Current event-operations core</p>
          <h2 id="tickit-platform-heading">
            Product controls remain attached to their boundaries.
          </h2>
          <p>
            Public event reads and organizer workflows cross typed client
            modules into separate Rails route surfaces. Business requests
            authenticate, resolve organization scope, and operate on explicit
            event, location, catalog, membership, invitation, and checker
            models.
          </p>
        </header>

        <div className={styles.boundaryRail} aria-label="Current platform layers">
          <div>
            <span>01 / Interface</span>
            <p>Discovery, event setup, tickets, team, and routine controls.</p>
          </div>
          <div>
            <span>02 / Service</span>
            <p>Typed clients, route boundaries, JWT, scope, and controllers.</p>
          </div>
          <div>
            <span>03 / Operations</span>
            <p>PostgreSQL, PostGIS, event state, invitations, and checker job.</p>
          </div>
        </div>

        <TickitPlatformExplorer />
      </section>

      <section
        className={`${styles.section} ${styles.sequenceSection}`}
        aria-labelledby="tickit-sequence-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Cross-snapshot product sequence</p>
          <h2 id="tickit-sequence-heading">
            One event journey, with every evidence handoff exposed.
          </h2>
          <p>
            The first stage is visible in the supplied code. Commerce, access,
            and organizer intelligence are historically shipped capabilities
            confirmed by the author. The sequence explains their product
            relationship; it is not a runtime trace.
          </p>
        </header>

        <TickitOperationalSequence />
      </section>

      <section
        className={`${styles.section} ${styles.historySection}`}
        aria-labelledby="tickit-history-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Historically shipped system</p>
          <h2 id="tickit-history-heading">
            Commerce and access became organizer intelligence.
          </h2>
          <p>
            The four-developer remote team shipped attendee ticket purchasing,
            Stripe processing, QR access, friend sharing, spend tracking,
            analytics, predictions, inventory forecasts, operational metrics,
            and event cost planning across the product stack.
          </p>
        </header>

        <TickitHistoryExplorer />
      </section>

      <section
        className={`${styles.section} ${styles.boundarySection}`}
        aria-labelledby="tickit-boundary-heading"
      >
        <header className={styles.boundaryHeader}>
          <p className={styles.kicker}>Publication boundary</p>
          <h2 id="tickit-boundary-heading">
            Shipped does not mean source-invented.
          </h2>
        </header>

        <div className={styles.exclusions}>
          <p>
            No payment-intent schema, webhook handler, queue, retry topology,
            QR validation algorithm, scan table, or friend-sharing token
            mechanism is named without source.
          </p>
          <p>
            No analytics event schema, table name, pipeline job, forecast
            model, feature set, horizon, or organizer metric value is
            reconstructed.
          </p>
          <p>
            The local QR drafts remain useful evidence of work in progress, but
            they are incomplete, contract-mismatched, and explicitly separate
            from the author-verified shipped access system.
          </p>
        </div>
      </section>
    </div>
  );
}
