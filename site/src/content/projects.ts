export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
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
};

export const projects: Project[] = [
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
    year: "2024–2025",
    type: "Product Engineering",
    role: "Frontend & Backend Engineer",
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
  {
    title: "Rowing Logbook",
    slug: "rowing-logbook",
    summary:
      "A lightweight rowing logbook built for structured training records and athlete-facing workflows.",
    stack: ["Swift", "SwiftUI", "Swift Charts", "iOS"],
    year: "2023–Present",
    type: "Athletics / Product",
    role: "iOS developer",
    links: [],
    diagram: [
      "Session entry",
      "Structured training log",
      "Progress metrics",
      "Swift Charts",
    ],
    sections: [
      {
        title: "Problem",
        paragraphs: [
          "Athletes needed a faster way to record training sessions and review progression without adapting a general-purpose fitness product to rowing-specific data.",
        ],
      },
      {
        title: "Constraints",
        bullets: [
          "Keep session entry lightweight enough for daily use.",
          "Represent rowing-specific training fields clearly.",
          "Make progression visible without overwhelming the athlete with charts.",
        ],
      },
      {
        title: "Architecture",
        paragraphs: [
          "The application is built natively in Swift and SwiftUI, with Swift Charts used for progression views and athlete-facing summaries.",
        ],
      },
      {
        title: "Implementation",
        bullets: [
          "Led planning through athlete interviews.",
          "Designed structured session logging and history views.",
          "Built progression visualizations around actual training workflows.",
        ],
      },
      {
        title: "Current Status",
        paragraphs: [
          "The core logging and analysis workflow is implemented. Iteration continues around the smallest set of inputs athletes will reliably maintain.",
        ],
      },
      {
        title: "Lessons",
        paragraphs: [
          "A training tool earns adoption through low-friction input and trustworthy history, not by exposing every metric that can be collected.",
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
