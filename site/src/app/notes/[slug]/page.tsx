import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { JsonLd } from "@/components/JsonLd";
import { Layout } from "@/components/Layout";
import { links } from "@/content/links";
import { createPageMetadata, siteName, socialImage } from "@/lib/metadata";
import { getNote, getNoteSlugs } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

type NoteRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NoteRouteProps): Promise<Metadata> {
  const note = getNote((await params).slug);

  if (!note) {
    return {};
  }

  return createPageMetadata({
    title: note.title,
    description: note.description,
    pathname: `/notes/${note.slug}`,
    type: "article",
    publishedTime: note.date,
    modifiedTime: note.updatedAt,
  });
}

export default async function NoteRoute({ params }: NoteRouteProps) {
  const note = getNote((await params).slug);

  if (!note) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/notes/${note.slug}`);
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    headline: note.title,
    description: note.description,
    datePublished: note.date,
    dateModified: note.updatedAt,
    image: socialImage.url,
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: siteName,
      url: absoluteUrl("/"),
      sameAs: [links.github, links.linkedin],
    },
  };

  return (
    <Layout>
      <JsonLd data={blogPostingJsonLd} />
      <article className="note-page">
        <Link href="/notes" className="back-link">
          All notes
        </Link>
        <header className="note-page__header">
          <p>
            {note.category} / {note.date}
          </p>
          <h1>{note.title}</h1>
          <span>{note.description}</span>
        </header>
        <div className="prose">
          <MDXRemote source={note.content} />
        </div>
      </article>
    </Layout>
  );
}
