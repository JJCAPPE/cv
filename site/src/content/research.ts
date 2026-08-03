import { researchProjects } from "@/content/projects";

export type ResearchShowcaseItem = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  year: string;
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

if (!biomimeticPaper) {
  throw new Error("The biomimetic AI research paper is missing.");
}

export const researchShowcase: ResearchShowcaseItem[] = [
  {
    slug: "contextual-similarity",
    href: "/research",
    title: "Contextual Similarity",
    summary:
      "A retrieval-first study of whether contextual metric learning can preserve motion similarity when joints jitter, disappear, or frames drop.",
    year: "2026",
    type: "Metric Learning / Pose Retrieval",
    actionLabel: "Read proposal",
    media: {
      kind: "contextual-overview",
    },
  },
  {
    slug: biomimeticPaper.slug,
    href: `/research/${biomimeticPaper.slug}`,
    title: biomimeticPaper.title,
    summary: biomimeticPaper.summary,
    year: biomimeticPaper.year,
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
