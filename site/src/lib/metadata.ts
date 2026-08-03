import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const siteName = "Giacomo Cappelletto";
export const siteDescription =
  "Computer Engineering student at Boston University building software systems, applied ML tools, robotics autonomy projects, and computer vision pipelines for biomechanics.";
export const socialImage = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "Giacomo Cappelletto, software systems, applied ML, robotics, and computer vision",
};

type PageMetadata = {
  title: string;
  description: string;
  pathname: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function createPageMetadata({
  title,
  description,
  pathname,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadata): Metadata {
  const url = absoluteUrl(pathname);
  const sharedOpenGraph = {
    title,
    description,
    url,
    siteName,
    locale: "en_US",
    images: [socialImage],
  };

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph:
      type === "article"
        ? {
            ...sharedOpenGraph,
            type: "article",
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : {
            ...sharedOpenGraph,
            type: "website",
          },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: socialImage.url,
          alt: socialImage.alt,
        },
      ],
    },
  };
}
