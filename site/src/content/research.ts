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
    title: "Contextual Similarity",
    summary:
      "A retrieval-first study of whether contextual metric learning can preserve motion similarity when joints jitter, disappear, or frames drop.",
    year: "2026",
    updatedAt: "2026-07-29",
    type: "Metric Learning / Pose Retrieval",
    actionLabel: "Read proposal",
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
