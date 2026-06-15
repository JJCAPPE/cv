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
role: "Software & AI Engineering Intern",
organization: "Banca Mediolanum",
dates: "Jun 2026 — Present",
location: "Milan, Italy",
summary: [
"Develop internal AI tooling and LLM-agent workflows supporting customer analytics, knowledge management, and business operations.",
"Design and implement a Databricks-based platform for versioning, semantic retrieval, evaluation, and governance of enterprise LLM prompts.",
"Build Python applications integrated with Unity Catalog, Delta Lake, Databricks AI Search, and SQL Warehouses to support prompt management and testing.",
"Analyze large-scale customer datasets using SQL and Python, contributing to predictive modeling and customer behavior analysis initiatives."
],
stack: [
"Python",
"SQL",
"Azure Databricks",
"Unity Catalog",
"Delta Lake",
"Databricks AI Search",
"Vector Search",
"Dash",
"LLM Agents",
"Prompt Engineering",
"Predictive Modeling",
"Data Analytics"
]
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
