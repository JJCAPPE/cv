import {
  HorizontalResearchRail,
  type HorizontalShowcaseItem,
} from "./HorizontalResearchRail";

export type HorizontalProjectRailProject = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  type: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    fit?: "cover" | "contain";
    railFit?: "cover" | "contain";
  };
};

type HorizontalProjectRailProps = {
  projects: HorizontalProjectRailProject[];
};

export function HorizontalProjectRail({
  projects,
}: HorizontalProjectRailProps) {
  const items: HorizontalShowcaseItem[] = projects.map((project) => ({
    slug: project.slug,
    href: `/projects/${project.slug}`,
    title: project.title,
    summary: project.summary,
    year: project.year,
    type: project.type,
    actionLabel: "View project",
    media: {
      kind: "image",
      src: project.cover.src,
      alt: project.cover.alt,
      width: project.cover.width,
      height: project.cover.height,
      fit: project.cover.railFit ?? project.cover.fit,
    },
  }));

  return (
    <HorizontalResearchRail
      items={items}
      sectionId="featured-work"
      anchorId="work"
      heading="Selected work"
      description="Production software, applied ML, and physical systems built around real operational constraints."
      navigationLabel="Selected work navigation"
      skipTargetId="research"
      skipLabel="Skip featured work"
      dataNamespace="project"
    />
  );
}
