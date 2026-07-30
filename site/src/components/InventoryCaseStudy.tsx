import Image from "next/image";
import { InventoryWorkflowComparison } from "./InventoryWorkflowComparison";
import styles from "./InventoryCaseStudy.module.css";

const operationalAnalysisMedia = [
  {
    src: "/media/projects/inventory-system/checkout-funnel.png",
    width: 1920,
    height: 1247,
    label: "Checkout-stage analysis",
    alt: "Bar chart summarizing where abandoned checkout records contain shipping and payment-stage fields.",
    caption:
      "A field-presence funnel from the separate checkout analysis. It describes the inspected abandoned-checkout export, not the inventory app’s runtime.",
  },
  {
    src: "/media/projects/inventory-system/cluster-diagnostics.webp",
    width: 2400,
    height: 945,
    label: "Segmentation diagnostics",
    alt: "Clustering diagnostics and a principal-component projection for abandoned checkout records.",
    caption:
      "Silhouette, bootstrap stability, minimum share, and PCA diagnostics used to test whether behavioral clusters were defensible.",
  },
  {
    src: "/media/projects/inventory-system/correlation-heatmap.webp",
    width: 2000,
    height: 1774,
    label: "Behavior relationships",
    alt: "Spearman correlation heatmap for derived abandoned-checkout behavior features.",
    caption:
      "A Spearman correlation view of the analysis features. It is an analytical artifact, not an application architecture diagram.",
  },
] as const;

export function InventoryCaseStudy() {
  return (
    <div className={styles.caseStudy}>
      <section
        className={styles.section}
        aria-labelledby="inventory-execution-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Executable architecture</p>
          <h2 id="inventory-execution-heading">
            One adjustment. Every boundary visible.
          </h2>
          <p>
            The short staff action sits in front of a longer, sequential
            execution path. Exact-SKU and title-prefix search use Shopify
            GraphQL. Selected-product and inventory-level reads, the default
            inventory adjustment, and the status branch use Shopify REST; the
            application-owned audit entry uses Firestore REST. Tauri IPC and
            Rust orchestration connect those boundaries.
          </p>
        </header>

        <figure className={styles.systemFigure}>
          <div className={styles.systemFigureViewport}>
            <Image
              src="/media/projects/inventory-system/inventory-decrement-exploded.svg"
              alt="Exploded execution stack showing staff SKU input, exact GraphQL search with title fallback, two-location hydration, Tauri IPC, Rust orchestration, Shopify REST adjustment and optional draft status, Firestore logging, and refresh."
              width={2400}
              height={1350}
              sizes="(max-width: 767px) 92vw, 94vw"
              unoptimized
            />
          </div>
          <figcaption>
            Solid connectors are the default path; dashed connectors are
            fallback or conditional work. The Shopify quantity write occurs
            before the zero check, optional status update, and Firestore log,
            so the sequence is not atomic.
          </figcaption>
        </figure>
      </section>

      <section
        className={`${styles.section} ${styles.recoverySection}`}
        aria-labelledby="inventory-recovery-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Recovery boundaries</p>
          <h2 id="inventory-recovery-heading">
            Undo is not the same as rollback.
          </h2>
          <p>
            Undo adds one unit back and can reactivate a product that was
            previously at zero. A two-location transfer has a narrower
            compensating path: if the destination increment fails, Rust tries
            to restore the source. Successful Shopify writes are not reversed
            when a later transfer log produces a warning.
          </p>
        </header>

        <figure className={styles.systemFigure}>
          <div className={styles.systemFigureViewport}>
            <Image
              src="/media/projects/inventory-system/inventory-recovery-exploded.svg"
              alt="Companion exploded view comparing one-unit undo and possible reactivation with a two-location transfer, destination-failure source rollback, rollback-failure error, and non-rolled-back Firestore logging warnings."
              width={2400}
              height={1350}
              sizes="(max-width: 767px) 92vw, 94vw"
              unoptimized
            />
          </div>
          <figcaption>
            The transfer compensation covers a failed destination adjustment,
            not every later step. “Transaction” and “atomic” would overstate
            the implemented guarantee.
          </figcaption>
        </figure>
      </section>

      <section
        className={styles.section}
        aria-labelledby="inventory-workflow-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Matched workflow proposal</p>
          <h2 id="inventory-workflow-heading">
            Fewer staff steps, not less system work.
          </h2>
          <p>
            The custom application bundles exact-SKU lookup, two-location
            hydration, a one-unit adjustment, audit logging, policy checks,
            refresh, and an undo affordance behind a compact operator flow.
            Shopify Admin exposes more of the adjustment and pending-review
            sequence. No matched timing study is attached, so this comparison
            makes no speed claim.
          </p>
        </header>

        <InventoryWorkflowComparison />
      </section>

      <section
        className={`${styles.section} ${styles.analysisSection}`}
        aria-labelledby="inventory-analysis-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Separate operational analysis</p>
          <h2 id="inventory-analysis-heading">
            Checkout evidence, kept in its own lane.
          </h2>
          <p>
            These figures come from a separate abandoned-checkout analysis in
            the same source repository. They remain useful evidence of
            analytical work, but they do not describe the desktop inventory
            execution path and are not measurements of the rebuild.
          </p>
        </header>

        <div className={styles.analysisGrid}>
          {operationalAnalysisMedia.map((media) => (
            <figure key={media.src}>
              <p>{media.label}</p>
              <div className={styles.analysisImage}>
                <Image
                  src={media.src}
                  alt={media.alt}
                  width={media.width}
                  height={media.height}
                  sizes="(max-width: 767px) 100vw, 94vw"
                />
              </div>
              <figcaption>{media.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
