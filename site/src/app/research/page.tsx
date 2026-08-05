import { Layout } from "@/components/Layout";
import { ResearchFileRelay } from "@/components/ResearchFileRelay";
import { researchShowcase } from "@/content/research";
import { createPageMetadata } from "@/lib/metadata";

const latestResearchUpdate = researchShowcase
  .map((item) => item.updatedAt)
  .sort((left, right) => right.localeCompare(left))[0];

export const metadata = createPageMetadata({
  title: "Research",
  description:
    "Research in robust motion learning, rowing biomechanics, and biologically inspired adaptability.",
  pathname: "/research",
  modifiedTime: latestResearchUpdate,
});

export default function ResearchPage() {
  return (
    <Layout className="research-index">
      <ResearchFileRelay items={researchShowcase} />
    </Layout>
  );
}
