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
    availability: "Implementation source inspected",
    description:
      "Solid yellow marks behavior inspected in the supplied Rails and Next.js repositories.",
  },
  {
    id: "history",
    title: "Delivered product systems",
    confidence: "Implemented and shipped",
    availability: "Cross-stack production work",
    description:
      "Solid blue marks the implemented commerce, access, analytics, forecasting, and planning capabilities.",
  },
  {
    id: "access",
    title: "QR access implementation",
    confidence: "Implemented and shipped",
    availability: "Implementation artifacts inspected",
    description:
      "Surviving Rails and client artifacts document expiring encrypted-and-signed tokens, typed retrieval, and attendee QR rendering.",
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
          <p className={styles.kicker}>Implementation status</p>
          <h2 id="tickit-evidence-heading">
            Implemented, shipped, and mapped across the stack.
          </h2>
          <p>
            TickIT joined the current event-operations core with delivered
            commerce, access, and organizer-intelligence systems. The case
            study shows their implementation status and the technical
            boundaries connecting the Next.js client, Rails services,
            PostgreSQL state, and external payment processing.
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
            Event setup, commerce, access, and organizer intelligence were all
            implemented and shipped. The sequence relates those product
            handoffs to the client, Rails, PostgreSQL, and QR boundaries that
            remain inspectable, without treating the surviving snapshots as
            an exact production trace.
          </p>
        </header>

        <TickitOperationalSequence />
      </section>

      <section
        className={`${styles.section} ${styles.historySection}`}
        aria-labelledby="tickit-history-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Implemented product system</p>
          <h2 id="tickit-history-heading">
            Commerce, access, and intelligence shipped together.
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
          <p className={styles.kicker}>Technical implementation</p>
          <h2 id="tickit-boundary-heading">
            Implemented across the product stack.
          </h2>
        </header>

        <div className={styles.exclusions}>
          <p>
            The inspected platform uses Next.js and TypeScript for public and
            organizer interfaces, Rails for authenticated organization-scoped
            business APIs, and PostgreSQL with PostGIS for event state. The
            shipped attendee purchase flow integrated Stripe at the payment
            boundary.
          </p>
          <p>
            Surviving QR artifacts show an authenticated Rails endpoint
            building an expiring payload, encrypting and signing it, and
            returning the token to a typed React viewer that renders a
            scanner-ready code. They preserve implementation detail without
            being presented as an exact production snapshot.
          </p>
          <p>
            The shipped organizer-intelligence system covered customer-spend
            tracking, analytics, spending predictions, inventory forecasts,
            operational metrics, and event cost planning. Private schemas,
            pipeline jobs, and forecasting algorithms are intentionally not
            reconstructed.
          </p>
        </div>
      </section>
    </div>
  );
}
