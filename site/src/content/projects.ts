export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ProjectMedia = {
  kind?: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
  page?: number;
  caption?: string;
  fit?: "cover" | "contain";
  railFit?: "cover" | "contain";
  railLayout?: "split" | "background";
};

export type ProjectMetric = {
  value: string;
  label: string;
  note?: string;
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  year: string;
  type: string;
  role: string;
  links: ProjectLink[];
  sections: ProjectSection[];
  diagram?: string[];
  cover: ProjectMedia;
  gallery?: ProjectMedia[];
  metrics?: ProjectMetric[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "MOVE",
    slug: "move",
    summary:
      "A governed enterprise AI copilot that turns natural-language questions into scoped, traceable answers across approved CRM and document sources.",
    stack: [
      "Python",
      "MLflow ResponsesAgent",
      "LangGraph",
      "Databricks",
      "SQLGlot",
      "FastAPI",
      "React",
      "TypeScript",
      "Lakebase",
    ],
    year: "2026",
    type: "Enterprise AI / Platform",
    role: "Lead developer, Software and AI Engineering Intern",
    featured: true,
    cover: {
      src: "/media/projects/move/move-agent-interface-exploded.svg",
      alt: "Exploded MOVE system showing an authenticated web request entering the governed agent runtime and returning through a versioned typed UI contract.",
      width: 2400,
      height: 1350,
      fit: "cover",
      railFit: "contain",
      railLayout: "background",
      caption:
        "Source-led system master pinned to the inspected July 2026 repositories. Solid paths are tracked defaults; dashed paths are optional or configured.",
    },
    gallery: [
      {
        src: "/media/projects/move/move-interface-evidence.webp",
        alt: "Synthetic MOVE portfolio metrics and a priority-segment chart rendered from typed agent output.",
        width: 954,
        height: 686,
        fit: "contain",
        caption:
          "Typed metric and chart renderables from a synthetic portfolio response. No customer or production data is shown.",
      },
    ],
    links: [],
    metrics: [
      {
        value: "79.2%",
        label: "direct SQL latency reduction",
        note: "dated audit, failure to correct result",
      },
      {
        value: "14 → 3",
        label: "tool calls",
        note: "same request, corrected grain",
      },
      {
        value: "1,200+",
        label: "named tests",
        note: "agent and interface source snapshot",
      },
    ],
    sections: [
      {
        title: "Why MOVE exists",
        paragraphs: [
          "Enterprise questions are rarely just language tasks. They carry customer scope, business definitions, permission boundaries, freshness requirements, and presentation needs. MOVE was built so a useful answer must also be scoped, inspectable, and grounded in approved evidence.",
          "Relationship managers can ask about a portfolio, a specific customer, or an approved document in natural language. The system returns structured answers, tables, metrics, charts, citations, and a trace of the work used to support them.",
        ],
      },
      {
        title: "The operating boundary",
        bullets: [
          "Read-only access through registered tools and governed data services.",
          "Request-scoped identity and portfolio filters applied before execution.",
          "No general-knowledge completion when the required evidence is missing.",
          "No write authority, outbound action, or hidden customer-row persistence.",
          "Conversation state remains disabled in tracked targets until identity and Lakebase prerequisites are ready.",
        ],
      },
      {
        title: "What I built",
        bullets: [
          "The MLflow ResponsesAgent and LangGraph orchestration path, including routing, context assembly, skill composition, tool selection, evidence checks, and final review.",
          "A governed text-to-SQL path with scoped metadata retrieval, deterministic templates, bounded generation, SQLGlot validation, and execution telemetry.",
          "A versioned Python response contract and the FastAPI adapter that converts it into resilient streaming UI events.",
          "React renderers for answer blocks, metrics, tables, charts, citations, tool activity, feedback, and follow-up questions.",
          "Databricks packaging, deployment configuration, MLflow tracing, evaluation harnesses, and broad backend and interface test coverage.",
        ],
      },
      {
        title: "Measured iteration",
        paragraphs: [
          "A dated dynamic-SQL audit isolated model generation as the dominant bottleneck. The original representative request failed after four attempts and 122.9 seconds. A smaller grain-aware schema pack, clearer metric ownership, semantic invariants, and bounded retry reduced the path to one successful attempt and 25.6 seconds.",
          "A faster model candidate completed sooner but returned the wrong rows and metric mappings. I kept the slower model because execution correctness, scope preservation, and business semantics mattered more than an attractive latency number.",
        ],
      },
      {
        title: "Limits, stated plainly",
        bullets: [
          "The published timings are audit scenarios, not production service-level claims.",
          "The interface screenshots use fictional, anonymized values passed through the real renderer.",
          "Skill guidance can narrow behavior but cannot override the tool registry or execution policy.",
          "Only successful normalized evidence can support an answer or a future state fact.",
        ],
      },
    ],
  },
  {
    title: "Rowing Biomechanics Pipeline",
    slug: "rowing-biomechanics",
    summary:
      "An inspectable research system that learns a stroke-level force representation from synchronized video and RP3 telemetry, then packages the same kinematic contract for video-only inference.",
    stack: [
      "Python",
      "Sports2D",
      "MotionBERT",
      "OpenCV",
      "NumPy",
      "Pandas",
      "PyTorch",
    ],
    year: "2026",
    type: "Research / Applied ML",
    role: "Undergraduate researcher",
    featured: true,
    cover: {
      kind: "video",
      src: "/media/projects/rowing-biomechanics/rowing-biomechanics-showcase.mp4",
      poster:
        "/media/projects/rowing-biomechanics/rowing-biomechanics-showcase-poster.webp",
      alt: "Rowing biomechanics pipeline showcase combining side-view video, two-dimensional pose tracking, a three-dimensional skeleton, joint-angle traces, stroke phase, and synchronized RP3 force telemetry.",
      width: 1440,
      height: 810,
      caption:
        "The complete pipeline on a synchronized ergometer capture: pose, phase, joint angles, 3D lift, and RP3 force in one inspectable view. RP3 supplies supervision during dataset construction; the intended inference path uses video alone.",
    },
    gallery: [
      {
        kind: "video",
        src: "/media/projects/rowing-biomechanics/pose3d-tracking-example.mp4",
        poster:
          "/media/projects/rowing-biomechanics/pose3d-tracking-poster.webp",
        alt: "Pose-tracking example showing whole-body landmarks, handle and ergometer geometry, joint angles, and a three-dimensional skeleton throughout a rowing stroke.",
        width: 1440,
        height: 810,
        caption:
          "Tracking diagnostic from a separate RP3 session. Whole-body landmarks, handle and machine geometry, joint angles, and the 3D lift stay visible so failures can be inspected frame by frame.",
      },
      {
        src: "/media/projects/rowing-biomechanics/calibrated-match.webp",
        alt: "Five rowing strokes aligned against RP3 telemetry with interval, drive-duration, cumulative-error, and joint-angle diagnostics.",
        width: 2000,
        height: 1118,
        caption:
          "An actual calibrated-run diagnostic: local drive timing is close, while the cumulative-error trace makes residual clock drift visible.",
        fit: "contain",
      },
      {
        src: "/media/projects/rowing-biomechanics/handle-tracking.webp",
        alt: "Rowing frame with two-dimensional joints, a three-dimensional pose inset, and tracked handle and ergometer reference points.",
        width: 1920,
        height: 1080,
        caption:
          "The feature-extraction surface: 2D landmarks, MotionBERT 3D lift, and handle-relative geometry derived from one side-view camera.",
      },
      {
        src: "/media/projects/rowing-biomechanics/force-reconstruction.webp",
        alt: "An RP3 force export recreated from its distance-indexed samples with peak force and peak-position annotations.",
        width: 1800,
        height: 1068,
        caption:
          "Target interpretation, not a model prediction: recreating the RP3 export established that its force samples are spaced every 2.2 cm before normalization to stroke progress.",
        fit: "contain",
      },
      {
        src: "/media/projects/rowing-biomechanics/force-curve-comparison.webp",
        alt: "Synthetic comparison of raw rowing force curves and the same curves after peak normalization.",
        width: 2064,
        height: 860,
        caption:
          "Synthetic explanatory figure: peak normalization lets the shape model separate curve geometry from absolute force magnitude.",
        fit: "contain",
      },
      {
        src: "/media/projects/rowing-biomechanics/kinematic-feature-heatmap.webp",
        alt: "Synthetic heatmap illustrating a 64-by-14 rowing-stroke feature tensor.",
        width: 1980,
        height: 945,
        caption:
          "Synthetic explanatory figure: every stroke becomes 64 progress samples across 14 canonical kinematic channels.",
        fit: "contain",
      },
    ],
    links: [
      {
        label: "Methods paper",
        href: "/media/projects/rowing-biomechanics/rowing-video-force-prediction-paper.pdf",
      },
      {
        label: "GitHub",
        href: "https://github.com/JJCAPPE/rowing-dynamics-analysis",
      },
      {
        label: "Pipeline demo",
        href: "https://jjcappe.github.io/rowing-dynamics-analysis/pipeline-visualisation.html",
      },
    ],
    metrics: [
      {
        value: "20",
        label: "matched strokes",
        note: "calibrated evaluation run",
      },
      {
        value: "1,203",
        label: "aligned segment rows",
        note: "20-stroke calibrated run",
      },
      {
        value: "11.43 ms",
        label: "drive-duration MAE",
        note: "two-pass calibrated run",
      },
      {
        value: "64 × 14",
        label: "stroke feature tensor",
        note: "progress samples × channels",
      },
    ],
    diagram: [
      "Side-view video",
      "Shared feature contract",
      "RP3-labeled strokes",
      "Quality-gated dataset",
      "Stage 0 / A / B",
      "Video-only inference",
    ],
    sections: [
      {
        title: "Why this project exists",
        paragraphs: [
          "Force curves reveal when a rower produces power, not just how quickly the handle moves. The usual measurement path requires an instrumented ergometer or lab hardware; ordinary side-view video is far easier to collect.",
          "The project asks a deliberately narrow question: can synchronized RP3 telemetry teach a video pipeline a useful stroke representation, then be removed at inference time? That boundary turns the work into a problem of data contracts, synchronization, leakage control, and honest evaluation—not simply pose estimation.",
        ],
      },
      {
        title: "Scope and evidence boundary",
        paragraphs: [
          "The repository implements the end-to-end path: extraction, calibration, stroke matching, dataset construction, model training, model bundles, video-only prediction, and generated reports. The evidence on this page is strongest for feasibility and data construction.",
        ],
        bullets: [
          "RP3 telemetry supplies labels during supervised dataset creation; it is not required by the intended prediction path.",
          "The best calibrated evidence currently comes from one athlete in a controlled ergometer setup.",
          "The repository supports athlete-held-out evaluation, but the current paper does not claim a compiled athlete-held-out force-prediction result.",
        ],
      },
      {
        title: "One stroke, one contract",
        paragraphs: [
          "Every drive is resampled onto 64 normalized progress positions. Fourteen channels describe the active-chain knee, hip, elbow, trunk, spine, and head angles; their progress derivatives; and handle velocity and acceleration. Facing direction is canonicalized so left- and right-facing recordings do not teach contradictory signs.",
          "Derivatives are computed in time and converted with dθ/ds = (dθ/dt) / (ds/dt + ε). A stall guard, masks, and explicit quality flags keep low-motion or sparse-tracking regions visible instead of silently turning them into clean-looking numbers.",
        ],
      },
      {
        title: "Synchronizing imperfect clocks",
        paragraphs: [
          "Video events and RP3 strokes are not matched greedily. A coarse interval anchor starts the alignment, a first pass estimates velocity thresholds, and a second pass reruns event detection with calibrated drive durations. Dynamic programming then scores drive, recovery, interval, cumulative, and skip costs across the session.",
          "The visual match editor records pins, exclusions, side, and facing overrides as reusable data. This matters because a good per-stroke duration can coexist with bad cumulative timing; the longer run made that failure mode impossible to ignore.",
        ],
      },
      {
        title: "Models earn their complexity",
        bullets: [
          "Stage 0 is a reproducibility floor and metadata-only Ridge baseline using rate, length, and drive time.",
          "Stage A predicts PCA or functional-PCA force-shape coefficients from scalar and coordination summaries with Ridge, Lasso, or gradient boosting.",
          "Stage B consumes the full sequence with a TCN or Transformer, masked loss, derivative loss, AdamW, cosine scheduling, gradient clipping, and early stopping.",
          "A model must beat the baseline on curve error and at least peak force or impulse before added complexity is treated as useful.",
        ],
      },
      {
        title: "Engineering for inspection",
        paragraphs: [
          "The package is organized around contracts rather than notebooks. Training and inference share the same side map and segment builder; model bundles carry the progress grid and preprocessing state; generated run and training reports expose provenance, leakage warnings, metrics, and plots.",
        ],
        bullets: [
          "Native RP3 force bins and masks are preserved alongside the fixed-grid representation.",
          "Per-stroke QC covers sparse tracking, implausible angular velocity, progress non-monotonicity, detection confidence, and timing plausibility.",
          "The current suite contains 50 tests across eight modules, including feature-contract, matching-override, bundle, and report behavior.",
        ],
      },
      {
        title: "What the evidence says",
        paragraphs: [
          "On the controlled 120 fps run, the pipeline matched 20 strokes and exported 1,203 aligned segment rows. Mean absolute drive-duration error was 11.43 ms; interval error was 64 ms and cumulative catch error was 208 ms.",
          "A separate 208-stroke run looked locally credible—32 ms drive-duration error and 22 ms interval error—while accumulating 2.36 seconds of catch drift. That contrast is the most useful result: local agreement alone cannot certify synchronization.",
        ],
        bullets: [
          "The force reconstruction shown below validates RP3 target interpretation; it is not a learned prediction result.",
          "Single-athlete evaluation is marked provisional by the reporting code.",
          "Generalization across athletes, boats, viewpoints, lighting, and camera clocks remains unproven.",
        ],
      },
      {
        title: "What I learned",
        bullets: [
          "Normalize the physical domain before choosing the model: RP3 labels live in distance, while video begins in time.",
          "Measure local error and accumulated drift separately; one can look excellent while the other invalidates a session.",
          "A shared feature contract and self-describing model bundle are as important as the network architecture.",
          "The next high-value work is direct shared timestamps and a multi-athlete dataset—not a larger neural network.",
        ],
      },
    ],
  },
  {
    title: "Deskinator",
    slug: "deskinator",
    summary:
      "An end-to-end tabletop-cleaning robot that turns touchless edge sensing into a fitted workspace, a safe coverage plan, and measurable motor commands.",
    stack: [
      "Python",
      "NumPy",
      "Raspberry Pi",
      "APDS9960",
      "A4988 + NEMA17",
      "RANSAC + PCA",
      "Coverage planning",
      "Matplotlib",
    ],
    year: "2025",
    type: "Robotics / Autonomy",
    role: "Sole designer and developer",
    featured: true,
    cover: {
      src: "/media/projects/deskinator/deskinator-software-exploded.svg",
      alt: "Exploded Deskinator software stack showing sensing, signal stabilization, controller states, coverage planning, actuation, evidence, and the separate stepper pulse timing boundary.",
      width: 2400,
      height: 1350,
      railLayout: "background",
      caption:
        "The supported runtime as one inspectable stack: a synchronous 50 Hz supervisory loop above the StepperDrive hardware timing boundary.",
    },
    gallery: [
      {
        src: "/media/projects/deskinator/boundary-discovery.webp",
        alt: "A boundary-discovery visualization showing detected points and a fitted tabletop.",
        width: 1499,
        height: 1507,
        caption:
          "Noisy proximity events become a conservative rectangular workspace.",
      },
      {
        src: "/media/projects/deskinator/coverage-path.webp",
        alt: "A planned wall-following and boustrophedon coverage path around a tabletop.",
        width: 1061,
        height: 1121,
        caption:
          "Inset coverage lanes keep the cleaning footprint away from detected edges.",
      },
      {
        src: "/media/projects/deskinator/coverage-inset-distribution.webp",
        alt: "A distribution plot of safe-inset coverage across 48 retained tabletop-cleaning simulations.",
        width: 1600,
        height: 953,
        caption:
          "Safe-inset coverage averaged 99.40%; these are idealized simulation results.",
      },
      {
        src: "/media/projects/deskinator/runtime-distribution.webp",
        alt: "A distribution plot of completion times across 48 retained tabletop-cleaning simulations.",
        width: 1600,
        height: 461,
        caption:
          "Mean simulated completion was 137.22 seconds against a 120-second target.",
      },
    ],
    links: [
      {
        label: "Final report · PDF",
        href: "/media/projects/deskinator/deskinator-final-design-report.pdf",
      },
      {
        label: "GitHub",
        href: "https://github.com/JJCAPPE/deskinator/tree/new-alg",
      },
      {
        label: "Assembly CAD · PDF",
        href: "/media/projects/deskinator/deskinator-final-assembly-cad.pdf",
      },
    ],
    metrics: [
      {
        value: "48",
        label: "retained simulations",
        note: "from a reported 50-run campaign",
      },
      {
        value: "99.40%",
        label: "mean safe-inset coverage",
        note: "σ 0.70% in idealized simulation",
      },
      {
        value: "137.22 s",
        label: "mean simulated cycle",
        note: "σ 3.57 s; target was 120 s",
      },
    ],
    diagram: [
      "Gesture, edge sensors, and step counts",
      "EWMA, hysteresis, and debounce",
      "50 Hz differential-drive odometry",
      "World-frame boundary observations",
      "RANSAC / PCA rectangle fit",
      "Geometry-derived safe inset",
      "Boustrophedon lanes and perimeter pass",
      "Drive-then-turn motor control",
      "Swept map, telemetry, and plots",
    ],
    sections: [
      {
        title: "Scope and ownership",
        paragraphs: [
          "Deskinator was a self-directed robotics build around a deceptively strict brief: create a compact, touch-free vacuum robot that can start with a hand gesture, discover an unknown rectangular tabletop, clean it without crossing an edge, and aim for a two-minute cycle. I designed and implemented the complete system—from electronics and mechanical integration through the Raspberry Pi software, simulator, analysis, and final documentation.",
          "Rather than assuming a known map, the robot earns one. It follows the boundary, records where its two front sensors lose the surface, fits a rectangle, contracts that rectangle using the physical sensor-to-vacuum geometry, and only then executes a coverage path. Safety is therefore a property of perception and planning, not a last-second motor stop.",
        ],
      },
      {
        title: "One inspectable control loop",
        paragraphs: [
          "The supported new-alg executable is deliberately organized around one synchronous 50 Hz loop in DeskinatorSimple.run(). Every cycle checks the gesture stop, reads edge sensors, advances differential-drive odometry from step counts, evaluates the state machine, commands the motors, rasterizes the vacuum footprint, and writes telemetry. A shared time base makes a failure traceable from sensor sample to actuator command.",
          "The executable states are explicit: WAIT_START, BOUNDARY_DISCOVERY, COVERAGE, and DONE. A failed rectangle fit enters DONE; a stop gesture exits the active loop into the same safe-shutdown path. Optional IMU and EKF files remain experimental scaffolding; the supported default path uses stepper odometry.",
        ],
      },
      {
        title: "From proximity to geometry",
        paragraphs: [
          "Two front APDS9960 sensors report whether the surface is present. The filter combines a raw threshold, an exponentially weighted moving average, hysteresis, and 60 ms debounce before an observation can become an edge event. Each event is projected into world coordinates from the robot pose and measured sensor offsets, preserving which physical reading produced each boundary point.",
          "After the robot closes a lap, SimpleRectangleFit extracts candidate lines with a 2 cm RANSAC inlier threshold, refines each direction with SVD/PCA, searches for orthogonal four-line combinations, and scores how well they explain the observations. A coarse 5° angle search provides a fallback when the line combination is weak.",
        ],
      },
      {
        title: "From geometry to motion",
        paragraphs: [
          "CoveragePlanner derives a safe inset from the sensor-to-vacuum offset, then lays lanes along the rectangle’s longer dimension. A 0.20 m cleaning width with 0.02 m overlap controls the lane spacing. The planner evaluates four traversal variants to reduce the distance from the current pose, alternates lane direction, adds explicit turn transitions, and finishes with a perimeter pass.",
          "The drive-then-turn controller turns those oriented waypoints into linear and angular velocity commands. StepperDrive converts them to wheel rates, applies acceleration-aware updates, and emits 1/16-microstep pulses through A4988 drivers. In parallel, a 5 mm SweptMap raster and CSV telemetry expose where the modeled vacuum actually traveled.",
        ],
      },
      {
        title: "Evidence, with boundaries",
        paragraphs: [
          "The reported 50-run simulation campaign retained 48 completed trials. On an ideal 2 m × 2 m table with randomized starting poses, those runs averaged 99.40% coverage of the safe inset and 90.97% of the full modeled tabletop. Mean completion time was 137.22 seconds, so the planner missed the two-minute target even while producing strong simulated coverage.",
        ],
        bullets: [
          "The simulator uses deterministic unicycle dynamics and does not model sensor noise, wheel slip, battery sag, or surface variation; these are simulation results, not physical-cleaning claims.",
          "Rectangle fitting and coverage planning assume a rectangular tabletop.",
          "The source workbook’s stale summary and invalid rectangle-error field are excluded; the published statistics come from the 48 retained raw rows.",
          "Physical performance remains sensitive to surface reflectivity, wheel traction, sensor placement, and battery state.",
        ],
      },
    ],
  },
  {
    title: "Inventory System Rebuild",
    slug: "inventory-system",
    summary:
      "A Tauri desktop workflow that resolves exact SKUs across two locations, decrements one available unit through Shopify, records an app-owned audit log, and exposes bounded recovery paths.",
    stack: [
      "Rust",
      "Tauri",
      "React",
      "TypeScript",
      "Shopify Admin API (GraphQL + REST)",
      "Firestore REST",
    ],
    year: "2025",
    type: "Systems / Product",
    role: "Sole developer",
    featured: true,
    cover: {
      src: "/media/projects/inventory-system/inventory-cover-exploded.svg",
      alt: "Exploded inventory execution stack connecting staff SKU input, React and Tauri, Rust orchestration, Shopify reads and adjustments, Firestore logging, and refresh.",
      width: 2400,
      height: 1350,
      railFit: "contain",
      railLayout: "background",
      caption:
        "Generated from the current execution path at source commit 3b2169e6; solid paths are default and dashed paths are conditional.",
    },
    links: [],
    sections: [
      {
        title: "Problem",
        paragraphs: [
          "A routine stock correction starts with a known SKU and a physical location, but accuracy depends on more than the visible click: the right variant and location must be resolved, available stock must be validated, Shopify must persist the adjustment, and the result must remain inspectable and recoverable.",
        ],
      },
      {
        title: "Constraints",
        bullets: [
          "Resolve an exact SKU before falling back to title-prefix search.",
          "Hydrate and display primary and secondary location quantities without publishing configured IDs.",
          "Block a decrement when the selected location has no available stock.",
          "Keep the operator action, Shopify write, product-status policy, app-owned log, refresh, and recovery boundary visible.",
        ],
      },
      {
        title: "Architecture",
        paragraphs: [
          "The React and TypeScript interface runs inside Tauri and invokes Rust commands across the IPC boundary. Exact-SKU and title-prefix search use Shopify GraphQL. Selected-product and inventory-level reads, the default one-unit adjustment, and the conditional product-status change use Shopify REST, while FirebaseClient writes the application-owned audit entry through Firestore REST.",
        ],
      },
      {
        title: "Implementation",
        bullets: [
          "Search waits for at least two characters, debounces for 300 ms, queries exact SKU first, and auto-selects an exact or sole result.",
          "After fetching the product, location inventory loads while product data is processed; primary and secondary quantities are then mapped onto each variant.",
          "A confirmed decrement resolves the configured primary location and sends available_adjustment: -1 through the logged Rust command.",
          "After the Shopify write, Rust checks all variants and locations, conditionally attempts status → draft, writes a Rettifica log, and the UI refreshes logs and stock while retaining the undo target.",
        ],
      },
      {
        title: "Failure boundaries",
        bullets: [
          "The decrement is sequential, not atomic: Shopify inventory can change before a later zero check, status update, or Firestore write fails.",
          "Undo adds one unit back, records Annullamento, and can reactivate a product that was previously at zero.",
          "A two-location transfer restores the source when the destination adjustment fails, but successful Shopify writes are not rolled back for later logging warnings.",
          "No matched timing artifact supports the previous package, memory, startup, or search percentages, so those claims are not published here.",
        ],
      },
      {
        title: "Lessons",
        paragraphs: [
          "A short operator flow is only credible when the automated work behind it stays visible. The useful simplification is reduced staff navigation with exact-SKU selection, location hydration, logging, status handling, refresh, and recovery bundled into one inspectable path—not the disappearance of backend work.",
        ],
      },
    ],
  },
  {
    title: "TickIT",
    slug: "tickit",
    summary:
      "A full-stack event platform spanning public discovery, ticket commerce, QR access control, organizer operations, and analytics.",
    stack: [
      "Next.js",
      "TypeScript",
      "React",
      "Rails",
      "PostgreSQL",
      "PostGIS",
      "Devise JWT",
      "Stripe",
      "Tailwind",
      "shadcn/ui",
    ],
    year: "2024-2025",
    type: "Full-Stack Product Engineering",
    role: "Full-Stack Engineer",
    featured: true,
    cover: {
      src: "/media/projects/tickit/tickit-platform-exploded.svg",
      alt: "Exploded TickIT current platform showing public and organizer interfaces, authenticated organization-scoped Rails services, and PostgreSQL plus PostGIS event operations.",
      width: 2400,
      height: 1350,
      fit: "contain",
      railFit: "contain",
      caption:
        "Full-stack platform map covering the implemented interface, service, and event-operations core.",
    },
    links: [],
    sections: [
      {
        title: "The product boundary",
        paragraphs: [
          "TickIT combined attendee-facing event discovery with organizer event operations, ticket commerce, access control, and decision support. I worked across the Next.js and TypeScript interface and the Rails and PostgreSQL backend as part of a four-developer remote team.",
          "The delivered product included the event-operations core together with implemented ticket purchasing, Stripe payments, QR generation and validation, friend sharing, customer-spend tracking, forecasting, and organizer planning tools.",
        ],
      },
      {
        title: "Current platform",
        bullets: [
          "Public event index and detail APIs expose active event discovery.",
          "Organizer surfaces cover event creation and details, ticket and tier management, event teams, invitations, and checker-routine controls.",
          "Business API requests authenticate with Devise JWT and resolve organization scope before accessing events and related records.",
          "PostgreSQL and PostGIS persist events, geographic locations, ticket catalogs, members, invitations, checker routines, and JWT allowlists.",
          "Event creation applies the active checker routine by creating event-member records through the supplied after-create job.",
        ],
      },
      {
        title: "Implemented commerce and access",
        bullets: [
          "Shipped attendee ticket purchasing with Stripe at the payment-processing boundary.",
          "The inspected platform source documents typed ticket and tier APIs plus PostgreSQL event and catalog state; the case study does not reconstruct an unavailable production payment sequence.",
          "Surviving implementation artifacts show Rails generating encrypted-and-signed expiring QR tokens and the TypeScript client fetching and rendering them in the attendee interface.",
          "Implemented validation and friend-sharing capabilities for attendee access management; their private production internals are not reconstructed from the artifact snapshots.",
        ],
      },
      {
        title: "Organizer intelligence",
        bullets: [
          "Built customer-spend tracking systems and analytics pipelines around ticket and event activity.",
          "Implemented organizer dashboards for spending predictions, inventory forecasts, operational metrics, and event cost planning.",
          "Kept private schemas, jobs, API contracts, model families, and forecasting metrics outside the published architecture where source was unavailable.",
        ],
      },
      {
        title: "Cross-stack delivery",
        paragraphs: [
          "The work moved between responsive product interfaces, typed browser-to-API contracts, Rails controllers and models, data persistence, planning, and code review. That cross-stack collaboration mattered more than treating frontend and backend work as separate tracks.",
        ],
      },
      {
        title: "Implementation details",
        paragraphs: [
          "The surviving access artifacts use an authenticated Rails endpoint to build an expiring payload, encrypt and sign it with application key material, and return a token for a typed React QR viewer. The artifacts preserve concrete implementation detail without being treated as an exact production snapshot.",
          "Across the inspected platform, React and TypeScript handle public and organizer interfaces, Rails owns authenticated business boundaries, and PostgreSQL with PostGIS persists event state. The delivered product adds Stripe purchasing and organizer intelligence at the capability boundary supported by the author’s implementation attestation.",
        ],
      },
    ],
  },
  {
    title: "NoteWorthy",
    slug: "ai-notes-or-ocr",
    summary:
      "A multimodal notes-to-LaTeX pipeline that streams Gemini-generated structure into a styled template, compiles it through configured HTTP backends, and returns PDF plus source.",
    stack: [
      "Next.js",
      "TypeScript",
      "Gemini File API",
      "Server-Sent Events",
      "LaTeX",
      "Prisma",
      "PostgreSQL",
    ],
    year: "2026",
    type: "Applied AI / Product",
    role: "Full-stack developer",
    featured: true,
    cover: {
      src: "/media/projects/ai-notes-or-ocr/technical/noteworthy-agent-exploded.svg",
      alt: "Exploded NoteWorthy system showing image preparation and server request guards, streamed Gemini LaTeX generation, template composition, configurable HTTP compilation, browser output, optional persistence, and separate historical rails.",
      width: 2400,
      height: 1350,
      caption:
        "Source-led execution atlas pinned to the inspected July 2026 repository. Solid paths are current defaults, dashed nodes are selectable or authenticated options, and subdued rails are historical alternatives.",
      fit: "contain",
      railFit: "contain",
    },
    gallery: [
      {
        src: "/media/projects/ai-notes-or-ocr/casma225/page-015.webp",
        alt: "Full portrait page 15 from the supplied PDF, with a three-dimensional parametric helix, a theorem box, and a worked question box.",
        width: 1224,
        height: 1584,
        page: 15,
        caption:
          "A 3D parametric helix above theorem and question structures generated from the source grammar.",
        fit: "contain",
      },
      {
        src: "/media/projects/ai-notes-or-ocr/casma225/page-042.webp",
        alt: "Full portrait page 42 from the supplied PDF, showing two colored three-dimensional multivariable surface plots and worked limit examples.",
        width: 1224,
        height: 1584,
        page: 42,
        caption:
          "Two PGFPlots surfaces pair path-dependent and path-independent multivariable limits with worked examples.",
        fit: "contain",
      },
      {
        src: "/media/projects/ai-notes-or-ocr/generated-document.png",
        alt: "Full portrait page 75 from the supplied PDF, with a boxed definition, worked double-integral example, and a three-dimensional cylinder surface.",
        width: 1020,
        height: 1320,
        page: 75,
        caption:
          "Definition and example macros frame a surface-area derivation and its 3D cylinder construction.",
        fit: "contain",
      },
      {
        src: "/media/projects/ai-notes-or-ocr/casma225/page-083.webp",
        alt: "Full portrait page 83 from the supplied PDF, with a boxed Cartesian-to-polar definition and three coordinate diagrams.",
        width: 1224,
        height: 1584,
        page: 83,
        caption:
          "Cartesian and polar coordinate diagrams show the same point, angle, and alternate notations.",
        fit: "contain",
      },
      {
        src: "/media/projects/ai-notes-or-ocr/casma225/page-100.webp",
        alt: "Full portrait page 100 from the supplied PDF, with radial and rotational vector-field diagrams and a gradient-vector-field example.",
        width: 1224,
        height: 1584,
        page: 100,
        caption:
          "Two vector-field plots contrast radial and rotational behavior before the gradient-field section.",
        fit: "contain",
      },
    ],
    links: [
      {
        label: "Live site",
        href: "https://noteworthy-git-main-giacomo-cappellettos-projects.vercel.app/",
      },
    ],
    metrics: [
      {
        value: "7,237",
        label: "supplied TeX lines",
        note: "byte-stable source artifact",
      },
      {
        value: "63",
        label: "TikZ scenes",
        note: "plus 32 PGFPlots axes",
      },
      {
        value: "110",
        label: "supplied PDF pages",
        note: "US-letter metadata",
      },
    ],
    sections: [
      {
        title: "Why the conversion path matters",
        paragraphs: [
          "Dense mathematical notes are more than text: hierarchy, notation, diagrams, and relationships must survive the move into an editable document. NoteWorthy turns image notes into a generated LaTeX body, composes that body into a styled source file, and returns both source and a compiled PDF.",
          "The implementation keeps the user-facing loop visible through streamed status updates, while each server boundary applies a narrower set of request, generation, composition, or response guards.",
        ],
      },
      {
        title: "Current execution path",
        bullets: [
          "Client-side compression begins only above a 20 MiB batch, with a 2,000 px maximum dimension and JPEG quality 0.82.",
          "POST /api/latex/generate accepts no more than ten files or 25 MiB, checks browser-declared MIME values for an image/ prefix, and emits Server-Sent Events.",
          "GoogleAIFileManager uploads images in parallel before streamed Gemini generation accumulates one LaTeX body.",
          "Files written for accepted requests are removed after generation completes or raises an error; early validation exits happen before those file writes.",
        ],
      },
      {
        title: "Generation contract",
        paragraphs: [
          "Summary, Base, and Expansion modes change the conversion instruction, while Regular is the default model and Fast/Pro are premium-gated selectable alternatives mapped to Gemini identifiers. The prompt requests a body compatible with the template’s definition, note, theorem, question, solution, example, and TikZ grammar.",
          "The streamed result is trimmed, fenced output and a returned document prefix are removed, and the cleaned body is handed to composition. This normalization is deterministic cleanup, not a separately implemented OCR or compile-repair stage.",
        ],
      },
      {
        title: "Proposed / conceptual ML-CV layer",
        paragraphs: [
          "A disconnected dashed overlay explores possible perspective and illumination normalization, a math-aware layout graph, region-level uncertainty visualization, and compile-repair plus render-regression gates.",
          "These components are design hypotheses only. They are not present in the inspected runtime, carry no accuracy or latency claims, and never share the solid visual path used for source-verified behavior.",
        ],
      },
      {
        title: "Compile and output boundary",
        bullets: [
          "The composition route replaces <content> in a 1,065-line styled template.",
          "The PDF route tries configured external HTTP compiler targets with backend-specific payloads, a 30-second request timeout, and bounded retries.",
          "Returned bytes must begin with the PDF file signature before the browser creates a preview URL.",
          "The interface retains the generated body, composed source, and PDF blob for copy, preview, and export.",
        ],
      },
      {
        title: "Optional and historical rails",
        paragraphs: [
          "Authenticated users can optionally save PDF bytes and metadata through Prisma and combine selected saved documents. Neither operation is required for conversion.",
          "The repository also retains a Socket.IO server and a Dockerized latexmk service. They document earlier or alternate approaches; the current client uses fetch plus SSE, and the current PDF route defaults to configured HTTP compiler backends.",
        ],
      },
      {
        title: "Artifact evidence",
        paragraphs: [
          "The supplied main.tex contains 7,237 lines across three chapters and 62 numbered sections, including 63 TikZ scenes and 32 PGFPlots axes. It imports preamble, macros, and letterfonts and references two external images, so it is offered as source-as-is rather than a standalone compile bundle.",
          "The supplied generated PDF reports 110 US-letter pages. Five full-page previews are shown below without asserting that the file is a complete or partial corpus, and without turning structural counts into model-quality claims.",
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
