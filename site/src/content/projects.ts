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
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  fit?: "cover" | "contain";
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
      src: "/media/projects/move/move-interface-overview.webp",
      alt: "The MOVE interface rendering a synthetic portfolio analysis with structured metrics, a table, and a chart.",
      width: 1600,
      height: 1200,
      fit: "contain",
      caption:
        "The production interface rendering a fictional, anonymized payload through the real ResponsesAgent adapter.",
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
      "A computer vision and biomechanics pipeline that extracts rowing kinematics from video and maps stroke motion toward power and force-curve prediction.",
    stack: [
      "Python",
      "MMPose",
      "MotionBERT",
      "OpenCV",
      "NumPy",
      "Pandas",
    ],
    year: "2026",
    type: "Research / ML",
    role: "Undergraduate Researcher",
    featured: true,
    cover: {
      src: "/media/projects/rowing-biomechanics/erg-pose-overlay.webp",
      alt: "Rowing athlete on an ergometer with a pose-estimation skeleton overlay.",
      width: 1283,
      height: 676,
      caption: "Pose extraction during a controlled ergometer capture.",
    },
    gallery: [
      {
        src: "/media/projects/rowing-biomechanics/handle-tracking.webp",
        alt: "Tracked ergometer handle highlighted in a rowing video frame.",
        width: 1920,
        height: 1080,
        caption: "Handle tracking provides a stable reference for stroke timing.",
      },
      {
        src: "/media/projects/rowing-biomechanics/stroke-angle-diagnostics.webp",
        alt: "Diagnostic plots aligning rowing joint angles with stroke phases.",
        width: 2400,
        height: 1342,
        caption: "Stroke alignment checked against reconstructed joint angles.",
      },
      {
        src: "/media/projects/rowing-biomechanics/force-curve-comparison.webp",
        alt: "A set of rowing force curves plotted for comparison.",
        width: 2064,
        height: 860,
        caption: "Measured force curves used as temporal model targets.",
      },
      {
        src: "/media/projects/rowing-biomechanics/kinematic-feature-heatmap.webp",
        alt: "Heatmap showing relationships across rowing kinematic features.",
        width: 1980,
        height: 945,
      },
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/JJCAPPE/rowing-dynamics-analysis",
      },
      {
        label: "Pipeline demo",
        href: "https://jjcappe.github.io/rowing-dynamics-analysis/pipeline-visualisation.html",
      },
    ],
    diagram: [
      "Single-camera video",
      "Stabilization",
      "MMPose 2D keypoints",
      "MotionBERT 3D lift",
      "Kinematic features",
      "Stroke segmentation",
      "Force-curve model",
    ],
    sections: [
      {
        title: "Abstract",
        paragraphs: [
          "This research explores whether a low-cost, single-camera setup can recover useful rowing biomechanics. The pipeline converts video into stabilized 2D and 3D joint trajectories, stroke-level kinematics, and inputs for sequence models that estimate force-curve behavior.",
        ],
      },
      {
        title: "Method",
        paragraphs: [
          "The system isolates an athlete, estimates 2D keypoints with MMPose, lifts those sequences into 3D with MotionBERT, and computes joint angles, positions, velocities, and coordination features. Stroke phases then align the motion representation with instrumented telemetry.",
        ],
      },
      {
        title: "Data",
        bullets: [
          "Single-camera ergometer and on-water recordings.",
          "Frame-level 2D and lifted 3D pose sequences.",
          "Time-aligned force and power telemetry for model targets.",
          "Stroke-level features for technique comparison and sequence modeling.",
        ],
      },
      {
        title: "Evaluation / Current Status",
        paragraphs: [
          "The pose, 3D lift, and feature extraction stages are implemented. Current work focuses on robust stroke alignment and sequence-to-sequence regression against measured force curves.",
        ],
      },
      {
        title: "Limitations",
        bullets: [
          "A single camera limits depth accuracy and can amplify occlusion errors.",
          "Generalization across athletes, boats, viewpoints, and lighting remains untested.",
          "Force prediction depends on high-quality time alignment with instrumented data.",
        ],
      },
      {
        title: "Future Work",
        bullets: [
          "Expand the dataset across athletes and capture conditions.",
          "Compare elite and novice coordination patterns.",
          "Evaluate temporal architectures for video-to-force-curve modeling.",
          "Quantify uncertainty from pose estimation through final predictions.",
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
      src: "/media/projects/deskinator/prototype.webp",
      alt: "The assembled Deskinator robot on a tabletop beside its charging and test equipment.",
      width: 1800,
      height: 1013,
      caption:
        "The assembled prototype used for sensing, control, and coverage testing.",
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
      "A native desktop rewrite of an internal inventory system using Tauri, React, Rust, Firebase, and Shopify GraphQL.",
    stack: [
      "Rust",
      "Tauri",
      "React",
      "TypeScript",
      "Firebase",
      "Shopify GraphQL",
    ],
    year: "2025",
    type: "Systems / Product",
    role: "Sole developer",
    featured: true,
    cover: {
      src: "/media/projects/inventory-system/checkout-funnel.png",
      alt: "Checkout funnel analysis generated by the inventory system project.",
      width: 1920,
      height: 1247,
      caption: "Operational data turned into a concrete decision path.",
    },
    gallery: [
      {
        src: "/media/projects/inventory-system/app-icon.png",
        alt: "Inventory desktop application icon.",
        width: 1024,
        height: 1024,
        fit: "contain",
      },
      {
        src: "/media/projects/inventory-system/cluster-diagnostics.webp",
        alt: "Cluster diagnostics and principal-component analysis plots.",
        width: 2400,
        height: 945,
      },
      {
        src: "/media/projects/inventory-system/correlation-heatmap.webp",
        alt: "Correlation heatmap from checkout behavior analysis.",
        width: 2000,
        height: 1774,
      },
    ],
    links: [],
    diagram: [
      "Tauri desktop client",
      "Rust commands",
      "Shopify GraphQL",
      "Firebase history",
      "Location reconciliation",
    ],
    sections: [
      {
        title: "Problem",
        paragraphs: [
          "The existing Electron tool handled inventory updates across physical stores and Shopify, but startup time, memory use, package size, and search latency made routine workflows slower than they needed to be.",
        ],
      },
      {
        title: "Constraints",
        bullets: [
          "Preserve the existing staff workflow during migration.",
          "Support SKU search and updates across two locations.",
          "Keep a durable history of every inventory modification.",
          "Ship as an installable desktop application with simple updates.",
        ],
      },
      {
        title: "Architecture",
        paragraphs: [
          "The rewrite uses a React and TypeScript interface inside Tauri, with Rust commands for native operations. Shopify GraphQL provides inventory data, while Firebase records modification history and reconciliation state.",
        ],
      },
      {
        title: "Implementation",
        bullets: [
          "Parallelized Shopify requests and tightened GraphQL queries.",
          "Added immediate SKU search and multi-location update flows.",
          "Recorded user-visible modification history in Firebase.",
          "Kept the interface focused on the small set of daily staff tasks.",
        ],
      },
      {
        title: "Impact",
        bullets: [
          "70% smaller application package.",
          "80% lower memory usage.",
          "60% faster startup.",
          "43% faster Shopify inventory search.",
        ],
      },
      {
        title: "Lessons",
        paragraphs: [
          "The largest gains came from narrowing the desktop boundary, reducing runtime overhead, and optimizing network work around the actual search path rather than adding more interface features.",
        ],
      },
    ],
  },
  {
    title: "TickIT",
    slug: "tickit",
    summary:
      "A full-stack ticketing platform built with Next.js, Rails, PostgreSQL, Tailwind, and shadcn/ui.",
    stack: [
      "Next.js",
      "React",
      "Rails",
      "PostgreSQL",
      "Tailwind",
      "shadcn/ui",
    ],
    year: "2024-2025",
    type: "Product Engineering",
    role: "Frontend & Backend Engineer",
    cover: {
      src: "/media/projects/tickit/concert-crowd.webp",
      alt: "A concert audience facing a brightly lit stage.",
      width: 2400,
      height: 1600,
      caption: "Conceptual event imagery. CC0 public-domain photograph.",
    },
    links: [],
    diagram: [
      "Next.js interface",
      "Rails API",
      "PostgreSQL",
      "Ticket authentication",
    ],
    sections: [
      {
        title: "Problem",
        paragraphs: [
          "TickIT needed product interfaces and backend capabilities for a ticketing platform, including reliable API integration and a foundation for ticket authentication.",
        ],
      },
      {
        title: "Constraints",
        bullets: [
          "Ramp quickly across a mixed Next.js and Rails codebase.",
          "Keep product UI consistent while backend capabilities evolved.",
          "Design authentication work around ticket integrity and operational scale.",
        ],
      },
      {
        title: "Architecture",
        paragraphs: [
          "The frontend uses Next.js, React, Tailwind, and shadcn/ui. Rails exposes product APIs backed by PostgreSQL, keeping transactional concerns on the server and interface concerns in the web application.",
        ],
      },
      {
        title: "Implementation",
        bullets: [
          "Built responsive frontend flows and reusable interface patterns.",
          "Implemented Rails and PostgreSQL-backed product features.",
          "Shipped API integrations and contributed to ticket authentication architecture.",
        ],
      },
      {
        title: "Impact",
        paragraphs: [
          "The work moved production features across both sides of the stack and established shared patterns for a team working through a new product architecture.",
        ],
      },
      {
        title: "Lessons",
        paragraphs: [
          "Full-stack delivery was less about using every layer and more about keeping contracts explicit between product UI, APIs, and persistent data.",
        ],
      },
    ],
  },
  {
    title: "NoteWorthy",
    slug: "ai-notes-or-ocr",
    summary:
      "A system for converting handwritten notes into structured, styled PDFs and LaTeX documents.",
    stack: [
      "Next.js",
      "TypeScript",
      "Google AI Studio",
      "OAuth",
      "Docker",
      "Cloud Run",
    ],
    year: "2026",
    type: "Applied AI / Product",
    role: "Full-stack developer",
    featured: true,
    cover: {
      src: "/media/projects/ai-notes-or-ocr/generated-document.png",
      alt: "A typeset document generated from source notes by NoteWorthy.",
      width: 1020,
      height: 1320,
      caption: "Generated PDF output from the live conversion pipeline.",
      fit: "contain",
    },
    gallery: [
      {
        src: "/media/projects/ai-notes-or-ocr/logo.svg",
        alt: "NoteWorthy wordmark.",
        width: 1306,
        height: 180,
        fit: "contain",
      },
    ],
    links: [
      {
        label: "Live site",
        href: "https://noteworthy-git-main-giacomo-cappellettos-projects.vercel.app/",
      },
    ],
    diagram: [
      "Note upload",
      "OCR / vision model",
      "Structured document",
      "LaTeX compiler",
      "PDF export",
    ],
    sections: [
      {
        title: "Problem",
        paragraphs: [
          "Handwritten academic notes are difficult to search, restyle, and reuse. NoteWorthy converts source notes into structured documents without requiring the user to rebuild formatting manually.",
        ],
      },
      {
        title: "Constraints",
        bullets: [
          "Preserve mathematical notation and document hierarchy.",
          "Compile untrusted document input inside an isolated environment.",
          "Support sign-in and a web-first upload-to-export workflow.",
        ],
      },
      {
        title: "Architecture",
        paragraphs: [
          "A Next.js application manages uploads, authentication, and document state. Google AI Studio extracts structure and notation, while a Dockerized LaTeX compiler on Cloud Run generates the final output.",
        ],
      },
      {
        title: "Implementation",
        bullets: [
          "Integrated GitHub and Google OAuth.",
          "Mapped model output into a controlled LaTeX document shape.",
          "Containerized compilation and deployed the product across Vercel and Cloud Run.",
        ],
      },
      {
        title: "Current Status",
        paragraphs: [
          "The application is deployed and supports note conversion into styled PDF and LaTeX output. Current work is centered on extraction consistency for dense notation and varied handwriting.",
        ],
      },
      {
        title: "Next Steps",
        bullets: [
          "Improve structured extraction evaluation.",
          "Add better correction workflows before compilation.",
          "Explore semantic organization and retrieval across converted notes.",
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
