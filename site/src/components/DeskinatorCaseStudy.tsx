import Image from "next/image";
import styles from "./DeskinatorCaseStudy.module.css";

const architectureStages = [
  {
    eyebrow: "01 / Sense",
    title: "Hardware inputs",
    code: "APDS9960 + step counts",
    detail:
      "Two front edge sensors, a dedicated gesture sensor, and STEP-pulse counters provide the loop’s observable inputs.",
  },
  {
    eyebrow: "02 / Stabilize",
    title: "Signal and pose",
    code: "_filter_sensor() + SimpleOdometry",
    detail:
      "Thresholding, EWMA, hysteresis, and debounce qualify edge events while differential-drive integration updates pose at 50 Hz.",
  },
  {
    eyebrow: "03 / Infer",
    title: "Workspace and route",
    code: "SimpleRectangleFit + CoveragePlanner",
    detail:
      "World-frame observations become an orthogonal rectangle, a geometry-derived safe inset, and oriented coverage waypoints.",
  },
  {
    eyebrow: "04 / Execute",
    title: "Motion and evidence",
    code: "StepperDrive + SweptMap",
    detail:
      "Velocity commands become motor pulses while a 5 mm raster, CSV telemetry, and diagnostic plots record the outcome.",
  },
];

const controllerStates = [
  {
    name: "WAIT_START",
    detail: "Gesture-gated idle; motors and vacuum remain off.",
  },
  {
    name: "BOUNDARY_DISCOVERY",
    detail: "React to edge state, collect world points, and close one lap.",
  },
  {
    name: "COVERAGE",
    detail: "Fit the table, generate lanes, and advance oriented waypoints.",
  },
  {
    name: "DONE",
    detail: "Zero commands, stop the vacuum, and close the evidence trail.",
  },
];

const evidence = [
  {
    src: "/media/projects/deskinator/boundary-discovery.webp",
    width: 1499,
    height: 1507,
    layout: "standard",
    label: "Perception / simulated trace",
    alt: "A Deskinator simulation trace with robot poses, edge observations, and an orthogonal rectangle fitted around a square tabletop.",
    caption:
      "Boundary observations are stored in world coordinates, then explained by a scored orthogonal rectangle.",
  },
  {
    src: "/media/projects/deskinator/coverage-path.webp",
    width: 1061,
    height: 1121,
    layout: "standard",
    label: "Planning / simulated trace",
    alt: "A Deskinator simulation showing an inset rectangular boundary, alternating cleaning lanes, and perimeter waypoints.",
    caption:
      "The planner contracts the sensed table before laying alternating lanes and a final perimeter pass.",
  },
  {
    src: "/media/projects/deskinator/coverage-inset-distribution.webp",
    width: 1600,
    height: 953,
    layout: "full",
    label: "Validation / 48 retained runs",
    alt: "Distribution of safe-inset coverage across 48 retained Deskinator simulations, centered near 99.4 percent.",
    caption:
      "Safe-inset coverage averaged 99.40% with a 0.70% standard deviation and a 96.95–100% range.",
  },
  {
    src: "/media/projects/deskinator/runtime-distribution.webp",
    width: 1600,
    height: 461,
    layout: "scrollable",
    label: "Validation / 48 retained runs",
    alt: "Distribution of Deskinator simulation completion times, centered near 137 seconds and above the 120-second target.",
    caption:
      "Mean simulated completion was 137.22 s (σ 3.57 s; range 129.35–146.25 s), exposing a clear speed shortfall.",
  },
];

const artifacts = [
  {
    type: "PDF / 17 pages",
    title: "Final design report",
    detail:
      "Requirements, mechanical and electrical design, software evolution, tests, results, and lessons learned.",
    href: "/media/projects/deskinator/deskinator-final-design-report.pdf",
  },
  {
    type: "PDF / engineering drawing",
    title: "Final assembly CAD",
    detail:
      "Dimensioned assembly drawing for the fabricated robot and its integrated cleaning mechanism.",
    href: "/media/projects/deskinator/deskinator-final-assembly-cad.pdf",
  },
  {
    type: "GitHub / source",
    title: "Executable new-alg branch",
    detail:
      "The current synchronous controller, hardware interfaces, geometry, planner, simulator, and analysis code.",
    href: "https://github.com/JJCAPPE/deskinator/tree/new-alg",
  },
  {
    type: "GitHub / raw evidence",
    title: "Simulation result artifacts",
    detail:
      "The no-offset run workbook and generated evidence behind the statistics published on this page.",
    href: "https://github.com/JJCAPPE/deskinator/tree/new-alg/tests/results/no-offset",
  },
  {
    type: "GitHub / generated media",
    title: "Plots and CAD exports",
    detail:
      "Boundary, coverage, timing, wiring, and drawing exports produced during development.",
    href: "https://github.com/JJCAPPE/deskinator/tree/new-alg/deliverables/images",
  },
];

export function DeskinatorCaseStudy() {
  return (
    <div className={styles.caseStudy}>
      <section
        className={styles.section}
        aria-labelledby="deskinator-architecture-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Executable architecture</p>
          <h2 id="deskinator-architecture-heading">
            One loop from edge reading to evidence.
          </h2>
          <p>
            The final report captures several earlier design directions. This
            diagram follows the code that actually runs on the{" "}
            <strong>new-alg</strong> branch: a compact control loop with explicit
            data ownership and no hidden concurrency.
          </p>
        </header>

        <ol
          className={styles.architecture}
          aria-label="Deskinator executable data flow"
        >
          {architectureStages.map((stage) => (
            <li key={stage.title}>
              <p>{stage.eyebrow}</p>
              <h3>{stage.title}</h3>
              <code>{stage.code}</code>
              <span>{stage.detail}</span>
            </li>
          ))}
        </ol>

        <p className={styles.diagramNote}>
          Sensor events and step counts meet in the same 20 ms cycle. That
          makes the route from physical observation to motor command and log
          row straightforward to replay.
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.stateSection}`}
        aria-labelledby="deskinator-state-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Controller state</p>
          <h2 id="deskinator-state-heading">
            Progress is explicit. Failure is a state transition.
          </h2>
        </header>

        <ol
          className={styles.stateFlow}
          aria-label="Deskinator controller state machine"
        >
          {controllerStates.map((state, index) => (
            <li key={state.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <code>{state.name}</code>
              <p>{state.detail}</p>
            </li>
          ))}
        </ol>

        <ul className={styles.exitConditions} aria-label="Safety transitions">
          <li>
            <strong>Start gesture</strong>
            <span>WAIT_START → BOUNDARY_DISCOVERY</span>
          </li>
          <li>
            <strong>Rectangle fit failure</strong>
            <span>BOUNDARY_DISCOVERY → DONE</span>
          </li>
          <li>
            <strong>Stop gesture</strong>
            <span>Active loop → safe shutdown</span>
          </li>
          <li>
            <strong>Coverage complete</strong>
            <span>COVERAGE → DONE → safe shutdown</span>
          </li>
        </ul>
      </section>

      <section
        className={styles.section}
        aria-labelledby="deskinator-decisions-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Engineering pivots</p>
          <h2 id="deskinator-decisions-heading">
            Hardware failures changed the software architecture.
          </h2>
          <p>
            Two of the most valuable results were redesigns, not headline
            metrics. Each forced the implementation to respect an electrical
            constraint that a simulator could not reveal.
          </p>
        </header>

        <div className={styles.decisions}>
          <article className={styles.decision}>
            <p className={styles.decisionNumber}>Decision 01 / sensor topology</p>
            <h3>Make the I²C layout part of perception.</h3>
            <div
              className={styles.decisionFlow}
              aria-label="Sensor bus architecture before and after"
            >
              <div>
                <span>Before</span>
                <strong>Four APDS9960 sensors</strong>
                <p>Shared multiplexer; fixed addresses; corrupt, latent reads.</p>
              </div>
              <span aria-hidden="true">→</span>
              <div>
                <span>After</span>
                <strong>Two front edge sensors</strong>
                <p>Isolated hardware and software buses plus a gesture bus.</p>
              </div>
            </div>
            <p className={styles.lesson}>
              Fewer sensors produced a more trustworthy boundary signal because
              bus ownership and polling latency became deterministic.
            </p>
          </article>

          <article className={styles.decision}>
            <p className={styles.decisionNumber}>Decision 02 / motor drive</p>
            <h3>Design motion around current and pulse timing.</h3>
            <div
              className={styles.decisionFlow}
              aria-label="Motor driver architecture before and after"
            >
              <div>
                <span>Before</span>
                <strong>TB6612 motor HAT</strong>
                <p>Thermal and current mismatch caused jitter and lost steps.</p>
              </div>
              <span aria-hidden="true">→</span>
              <div>
                <span>After</span>
                <strong>Two A4988 drivers</strong>
                <p>Current limiting, 1/16 steps, ramped commands, 10 kHz cap.</p>
              </div>
            </div>
            <p className={styles.lesson}>
              The controller now respects a 10 μs STEP pulse and the motor
              current envelope instead of treating wheel velocity as an
              abstract output.
            </p>
          </article>
        </div>

        <figure className={styles.wiringFigure}>
          <Image
            src="/media/projects/deskinator/electronics-wiring.webp"
            alt="Deskinator electrical wiring diagram showing the Raspberry Pi, separate sensor connections, A4988 stepper drivers, motors, and vacuum system."
            width={1600}
            height={1345}
            sizes="(max-width: 767px) 100vw, 88vw"
          />
          <figcaption>
            Final electrical integration: the Raspberry Pi coordinates
            separately routed sensing, current-limited stepper drivers, and the
            vacuum actuator.
          </figcaption>
        </figure>
      </section>

      <section
        className={`${styles.section} ${styles.evidenceSection}`}
        aria-labelledby="deskinator-evidence-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Simulation evidence</p>
          <h2 id="deskinator-evidence-heading">
            Useful numbers start with a test contract.
          </h2>
          <p>
            These plots come from 48 retained completed simulations in the
            reported 50-run campaign. They validate geometry and route
            generation under controlled assumptions; they do not substitute
            for physical cleaning trials.
          </p>
        </header>

        <dl className={styles.testContract}>
          <div>
            <dt>Workspace</dt>
            <dd>Ideal 2 m × 2 m table</dd>
          </div>
          <div>
            <dt>Initial condition</dt>
            <dd>Randomized starting pose</dd>
          </div>
          <div>
            <dt>Dynamics</dt>
            <dd>Deterministic unicycle model</dd>
          </div>
          <div>
            <dt>Unmodeled</dt>
            <dd>Sensor noise and wheel slip</dd>
          </div>
        </dl>

        <div className={styles.evidenceGrid}>
          {evidence.map((item) => (
            <figure key={item.src}>
              <div
                className={`${styles.evidenceImage} ${
                  item.layout === "scrollable" ? styles.scrollablePlot : ""
                }`}
                aria-label={
                  item.layout === "scrollable"
                    ? "Scrollable timing distribution plot"
                    : undefined
                }
                role={item.layout === "scrollable" ? "region" : undefined}
                tabIndex={item.layout === "scrollable" ? 0 : undefined}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes={
                    item.layout === "scrollable"
                      ? "(max-width: 560px) 44rem, (max-width: 767px) 100vw, 88vw"
                      : item.layout === "full"
                        ? "(max-width: 767px) 100vw, 88vw"
                        : "(max-width: 560px) 100vw, (max-width: 767px) 50vw, 44vw"
                  }
                />
              </div>
              <figcaption>
                <span>{item.label}</span>
                <p>{item.caption}</p>
                {item.layout === "scrollable" ? (
                  <small className={styles.mobileHint}>
                    Scroll horizontally to inspect all three distributions.
                  </small>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>

        <aside className={styles.resultReadout} aria-label="Result interpretation">
          <p>What the runs say</p>
          <strong>Coverage was strong. Runtime was not.</strong>
          <span>
            Mean full-table coverage was 90.97%, while mean safe-inset coverage
            reached 99.40%. The 137.22 s mean cycle missed the 120 s design
            target by 17.22 s.
          </span>
        </aside>
      </section>

      <section
        className={styles.section}
        aria-labelledby="deskinator-artifacts-heading"
      >
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Project record</p>
          <h2 id="deskinator-artifacts-heading">
            Read the paper. Inspect the source. Open the drawings.
          </h2>
          <p>
            The case study is an index, not a substitute for the underlying
            work. The final report, drawing, executable branch, and raw
            simulation artifacts are linked directly below.
          </p>
        </header>

        <div className={styles.artifactLayout}>
          <figure className={styles.cadFigure}>
            <Image
              src="/media/projects/deskinator/final-assembly-cad.webp"
              alt="Dimensioned final assembly drawing of the Deskinator tabletop robot."
              width={3300}
              height={2550}
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <figcaption>
              Final assembly drawing. The one-page source PDF is available in
              the artifact index.
            </figcaption>
          </figure>

          <nav className={styles.artifactList} aria-label="Deskinator artifacts">
            {artifacts.map((artifact) => (
              <a href={artifact.href} key={artifact.href}>
                <span>{artifact.type}</span>
                <strong>{artifact.title}</strong>
                <p>{artifact.detail}</p>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}
