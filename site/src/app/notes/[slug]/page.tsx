import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Layout } from "@/components/Layout";
import { getNote, getNoteSlugs } from "@/lib/notes";

type NoteRouteProps = {
  params: Promise<{ slug: string }>;
};

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

  return {
    title: note.title,
    description: note.description,
    openGraph: {
      title: note.title,
      description: note.description,
      type: "article",
      publishedTime: note.date,
    },
  };
}

export default async function NoteRoute({ params }: NoteRouteProps) {
  const note = getNote((await params).slug);

  if (!note) {
    notFound();
  }

  return (
    <Layout>
      <article className="note-page">
        <Link href="/notes" className="back-link">
          ← All notes
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
