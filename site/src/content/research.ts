import { researchProjects } from "@/content/projects";

export type ResearchShowcaseItem = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  year: string;
  updatedAt: string;
  type: string;
  actionLabel: string;
  media:
    | {
        kind: "contextual-overview";
      }
    | {
        kind: "image";
        src: string;
        alt: string;
        width: number;
        height: number;
        fit?: "cover" | "contain";
      };
};

const biomimeticPaper = researchProjects.find(
  (project) => project.slug === "biomimetic-ai",
);
const rowingResearch = researchProjects.find(
  (project) => project.slug === "rowing-biomechanics",
);

if (!biomimeticPaper) {
  throw new Error("The biomimetic AI research paper is missing.");
}

if (!rowingResearch) {
  throw new Error("The rowing biomechanics research case study is missing.");
}

export const researchShowcase: ResearchShowcaseItem[] = [
  {
    slug: "contextual-similarity",
    href: "/research/contextual-similarity",
    title: "Robust Human-Motion Retrieval from Pose Sequences",
    summary:
      "Funded undergraduate research comparing motion-retrieval training recipes under joint jitter, missing joints, and missing frames.",
    year: "2026",
    updatedAt: "2026-10-23",
    type: "Funded research · Active",
    actionLabel: "Read study",
    media: {
      kind: "contextual-overview",
    },
  },
  {
    slug: rowingResearch.slug,
    href: `/research/${rowingResearch.slug}`,
    title: rowingResearch.title,
    summary: rowingResearch.summary,
    year: rowingResearch.year,
    updatedAt: rowingResearch.updatedAt,
    type: rowingResearch.type,
    actionLabel: "View case study",
    media: {
      kind: "image",
      src: "/media/projects/rowing-biomechanics/full-tracking.png",
      alt: "Side-view rowing frame with full-body pose landmarks, face and hand tracking, ergometer detection, joint angles, and a 3D pose inset.",
      width: 2726,
      height: 1676,
      fit: "contain",
    },
  },
  {
    slug: biomimeticPaper.slug,
    href: `/research/${biomimeticPaper.slug}`,
    title: biomimeticPaper.title,
    summary: biomimeticPaper.summary,
    year: biomimeticPaper.year,
    updatedAt: biomimeticPaper.updatedAt,
    type: biomimeticPaper.type,
    actionLabel: "Read paper",
    media: {
      kind: "image",
      src: biomimeticPaper.cover.src,
      alt: biomimeticPaper.cover.alt,
      width: biomimeticPaper.cover.width,
      height: biomimeticPaper.cover.height,
      fit: biomimeticPaper.cover.fit,
    },
  },
];
