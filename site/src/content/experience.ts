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
    dates: "Jun 2026 - Present",
    location: "Milan, Italy",
    summary: [
      "Lead developer, as an intern, for internal AI agent and prompt-governance platforms; own backend, frontend, data workflows, evaluation, deployment, and stakeholder requirements.",
      "Built Databricks-served LLM agent infrastructure using MLflow, LangGraph ReAct, tool calling, Vector Search, SQL Warehouse, Genie, Unity Catalog, Delta tables, and structured response contracts.",
      "Developed React/Express and Dash/Flask applications for agent chat, prompt, versioning, RAG search, lifecycle controls, side-by-side testing, benchmark logging, and review workflows.",
      "Implemented semantic retrieval, append-only versioning, permission-aware workflows, MLflow GenAI evaluation, and Delta/Vector Search pipelines supporting scalable enterprise AI governance.",
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
      "MLflow",
      "LangChain",
      "LLM Agents",
      "Prompt Engineering",
      "Predictive Modeling",
      "Data Analytics",
    ],
  },
  {
    role: "Undergraduate Researcher",
    organization: "Boston University College of Engineering",
    dates: "Jan 2026 - May 2026",
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
    dates: "May 2025 - Oct 2025",
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
    dates: "Nov 2024 - Feb 2025",
    location: "Remote",
    summary: [
      "Worked across Next.js and TypeScript interfaces plus Rails and PostgreSQL backend features as part of a four-developer remote event-ticketing team.",
      "Shipped ticket-purchasing and Stripe payment flows, QR generation and validation, ticket-validation interfaces, and friend sharing for attendee access management.",
      "Built customer-spend tracking and analytics capabilities supporting organizer dashboards for predictions, inventory forecasts, operational metrics, and event cost planning.",
    ],
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
  },
];
