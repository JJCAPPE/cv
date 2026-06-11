export type Experience = {
  role: string;
  organization: string;
  dates: string;
  location: string;
  summary: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "Software / Data Intern",
    organization: "Banca Mediolanum",
    dates: "Jun 2026 — Present",
    location: "Milan, Italy",
    summary: [
      "Analyze large customer datasets with SQL and build predictive models for customer behavior and churn.",
      "Build LLM-agent workflows supporting internal marketing analytics and customer insight operations.",
    ],
    stack: [
      "SQL",
      "Python",
      "Data Analysis",
      "Predictive Modeling",
      "LLM Agents",
    ],
  },
  {
    role: "Undergraduate Researcher",
    organization: "Boston University College of Engineering",
    dates: "Jan 2026 — May 2026",
    location: "Boston, MA",
    summary: [
      "Built a single-camera rowing biomechanics pipeline spanning stabilization, MMPose 2D keypoints, and MotionBERT 3D lifting.",
      "Extracted stroke-level kinematics and developed sequence models mapping time-aligned motion to force curves.",
    ],
    stack: [
      "Python",
      "MMPose",
      "MotionBERT",
      "OpenCV",
      "NumPy",
      "Pandas",
      "ML",
    ],
  },
  {
    role: "Full-Stack / Systems Developer",
    organization: "Società Cappelletto S.R.L.",
    dates: "May 2025 — Oct 2025",
    location: "Treviso, Italy",
    summary: [
      "Rebuilt an Electron inventory application with Tauri, React, and Rust, reducing app size by 70%, memory use by 80%, and startup time by 60%.",
      "Implemented Shopify GraphQL search, Firebase-backed history, and multi-location inventory reconciliation.",
    ],
    stack: [
      "Rust",
      "Tauri",
      "React",
      "TypeScript",
      "Firebase",
      "Shopify GraphQL",
    ],
  },
  {
    role: "Full-Stack Engineer",
    organization: "TickIT",
    dates: "Nov 2024 — Feb 2025",
    location: "Remote",
    summary: [
      "Built responsive product interfaces in Next.js and backend features in Rails and PostgreSQL for a ticketing platform.",
      "Contributed to ticket authentication architecture and shipped API integrations across a new stack.",
    ],
    stack: [
      "Next.js",
      "React",
      "Rails",
      "PostgreSQL",
      "Tailwind",
      "shadcn/ui",
    ],
  },
];
