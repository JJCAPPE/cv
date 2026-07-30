import Image from "next/image";
import {
  MoveAgentInterfaceExplorer,
  MoveSkillAdgExplorer,
} from "./MoveExplodedViews";
import styles from "./MoveProjectStory.module.css";

const auditStages = [
  {
    label: "Baseline",
    time: "122.9 s",
    outcome: "four attempts, failed",
    className: styles.auditBar100,
  },
  {
    label: "Bounded retry",
    time: "79.1 s",
    outcome: "two attempts, failed",
    className: styles.auditBar64,
  },
  {
    label: "Intent routing",
    time: "46.4 s",
    outcome: "one attempt, empty",
    className: styles.auditBar38,
  },
  {
    label: "Schema pack",
    time: "46.5 s",
    outcome: "correct result",
    className: styles.auditBar38,
  },
  {
    label: "Metric ownership",
    time: "33.4 s",
    outcome: "correct result",
    className: styles.auditBar27,
  },
  {
    label: "Concise prompt",
    time: "25.6 s",
    outcome: "correct result",
    className: styles.auditBar21,
  },
];

export function MoveProjectStory() {
  return (
    <div className={styles.story}>
      <section
        className={`${styles.section} ${styles.architectureSection}`}
        aria-labelledby="move-architecture-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>System architecture</p>
          <h2 id="move-architecture-heading">
            A controlled path from question to evidence.
          </h2>
          <p>
            MOVE is one product across two runtimes. The interface owns
            authentication, streaming, persistence, and feedback. The agent
            runtime owns scope, orchestration, governed execution, evidence,
            and review.
          </p>
        </header>

        <MoveAgentInterfaceExplorer />
      </section>

      <section
        className={`${styles.section} ${styles.requestSection}`}
        aria-labelledby="move-request-heading"
      >
        <header className={styles.requestHeader}>
          <h2 id="move-request-heading">Agentic, with hard edges.</h2>
          <p>
            The model can decide how to solve a question inside a deliberately
            small envelope. Authority remains in code at every stage.
          </p>
        </header>

        <MoveSkillAdgExplorer />
      </section>

      <section
        className={`${styles.section} ${styles.sqlSection}`}
        aria-labelledby="move-sql-heading"
      >
        <header className={styles.sqlHeader}>
          <h2 id="move-sql-heading">
            Correctness won the model decision.
          </h2>
          <p>
            The SQL path combines scoped metadata retrieval, trusted templates,
            bounded generation, SQLGlot validation, bind parameters, and a
            maximum of two attempts. A July 2026 audit made each change
            measurable.
          </p>
        </header>

        <div className={styles.sqlFlow} aria-label="Governed SQL request flow">
          <div>
            <span>Business question</span>
            <small>scope + requested grain</small>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>Metadata preflight</span>
            <small>grain-aware schema pack</small>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>Template or generation</span>
            <small>at most two attempts</small>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>SQLGlot validation</span>
            <small>syntax + semantic invariants</small>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>Typed evidence</span>
            <small>rows + lineage + renderables</small>
          </div>
        </div>

        <div className={styles.auditLayout}>
          <div className={styles.auditSummary}>
            <div className={styles.auditBefore}>
              <span>Before</span>
              <strong>122.9 s</strong>
              <p>Four attempts. No usable result.</p>
            </div>
            <div className={styles.auditAfter}>
              <span>After</span>
              <strong>25.6 s</strong>
              <p>One attempt. Ten correct rows.</p>
            </div>
            <dl>
              <div>
                <dt>63,621 → 16,912</dt>
                <dd>prompt characters</dd>
              </div>
              <div>
                <dt>14 → 3</dt>
                <dd>full-agent tool calls</dd>
              </div>
              <div>
                <dt>79.2%</dt>
                <dd>direct path reduction</dd>
              </div>
            </dl>
          </div>

          <figure className={styles.auditChart}>
            <figcaption>
              Direct SQL path across one representative audit scenario
            </figcaption>
            <div className={styles.auditScale} aria-hidden="true">
              <span>0 s</span>
              <span>60 s</span>
              <span>120 s</span>
            </div>
            <ol>
              {auditStages.map((stage) => (
                <li key={stage.label}>
                  <div className={styles.auditLabel}>
                    <span>{stage.label}</span>
                    <strong>{stage.time}</strong>
                  </div>
                  <div className={styles.auditTrack} aria-hidden="true">
                    <span
                      className={`${styles.auditBar} ${stage.className}`}
                    />
                  </div>
                  <small>{stage.outcome}</small>
                </li>
              ))}
            </ol>
          </figure>
        </div>

        <div className={styles.modelDecision}>
          <div>
            <span>Faster candidate</span>
            <strong>20.2 s</strong>
            <p>One row, wrong metric mappings</p>
            <em>Rejected</em>
          </div>
          <p>
            A lower latency number was not a win. Semantic correctness, entity
            grain, and business meaning were explicit evaluation criteria.
          </p>
          <div>
            <span>Selected model</span>
            <strong>25.6 s</strong>
            <p>Ten correct rows and mappings</p>
            <em>Kept for correctness</em>
          </div>
        </div>

        <p className={styles.auditNote}>
          All values above come from a dated development audit. They describe
          one controlled scenario, not a production latency guarantee.
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.contractSection}`}
        aria-labelledby="move-contract-heading"
      >
        <header className={styles.contractHeader}>
          <h2 id="move-contract-heading">
            Reasoning and presentation stay separate.
          </h2>
          <p>
            A versioned contract lets Python evolve independently from the
            TypeScript renderer. The interface receives meaning, not a blob of
            model-authored markup.
          </p>
        </header>

        <div className={styles.contractFlow}>
          <div>
            <span>Python runtime</span>
            <strong>LangGraph result</strong>
          </div>
          <i aria-hidden="true" />
          <div className={styles.contractPacket}>
            <span>Versioned boundary</span>
            <strong>bmed.agent.contract.v1</strong>
            <ul role="list">
              <li>answer blocks</li>
              <li>renderables</li>
              <li>citations</li>
              <li>tool calls</li>
              <li>safety + usage</li>
            </ul>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>FastAPI adapter</span>
            <strong>Streaming events</strong>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>React renderer</span>
            <strong>Paragraphs, metrics, tables, charts</strong>
          </div>
        </div>

        <figure className={styles.interfaceOverview}>
          <div>
            <Image
              src="/media/projects/move/move-interface-overview.webp"
              alt="The real MOVE React interface rendering a synthetic portfolio answer with typed metrics, a table, a chart, citations, and follow-up actions."
              fill
              sizes="(max-width: 767px) 100vw, 92vw"
            />
          </div>
          <figcaption>
            Full interface capture using the real adapter and renderer with a
            fictional repository fixture. No customer or production data is
            shown.
          </figcaption>
        </figure>

        <div className={styles.contractCopy}>
          <h3>Failure-tolerant by design</h3>
          <p>
            Each block has a stable type and each renderable is referenced by
            identifier. An unsupported chart does not invalidate the answer,
            and a partial stream can still preserve the evidence already
            received.
          </p>
          <ul>
            <li>Structured answers remain accessible without a chart.</li>
            <li>Tool traces use public summaries, not hidden reasoning.</li>
            <li>Citations, metrics, and tables keep their source context.</li>
          </ul>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.evidenceSection}`}
        aria-labelledby="move-evidence-heading"
      >
        <header className={styles.evidenceHeader}>
          <h2 id="move-evidence-heading">Breadth, deliberately bounded.</h2>
        </header>

        <dl className={styles.evidenceGrid}>
          <div>
            <dt>29</dt>
            <dd>registered capabilities</dd>
            <dd>Inspected runtime snapshot</dd>
          </div>
          <div>
            <dt>≤ 6</dt>
            <dd>tools exposed per route</dd>
            <dd>Selected from compatible capabilities</dd>
          </div>
          <div>
            <dt>≤ 4</dt>
            <dd>skills resolved</dd>
            <dd>Focused guidance, never more authority</dd>
          </div>
          <div>
            <dt>2</dt>
            <dd>SQL generation attempts</dd>
            <dd>A hard execution budget</dd>
          </div>
          <div>
            <dt>1</dt>
            <dd>scoped final repair</dd>
            <dd>No open-ended self-correction loop</dd>
          </div>
          <div className={styles.testEvidence}>
            <dt>1,200+</dt>
            <dd>named test definitions</dd>
            <dd>Agent and interface source snapshot</dd>
          </div>
        </dl>

        <div className={styles.boundaryStatement}>
          <h3>What MOVE deliberately does not claim</h3>
          <div>
            <p>
              It is read-only. It cannot send messages, update customer
              records, or use unsupported general knowledge to fill an evidence
              gap.
            </p>
            <p>
              Agent memory is not presented as live. Its rollout depends on
              trusted identity, governed Lakebase access, integrity protection,
              and retention readiness.
            </p>
            <p>
              Registered tools and the safe executor remain the authority.
              Prompts and skills cannot override their policy, budgets, or
              redaction.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
