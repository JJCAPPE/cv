import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { NotePreview } from "@/components/NotePreview";
import { getNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Technical notes on machine learning, computer vision, systems, rowing biomechanics, and building useful tools.",
};

export default function NotesPage() {
  const notes = getNotes();

  return (
    <Layout>
      <header className="page-intro">
        <h1>Notes</h1>
        <p>
          Short writeups on machine learning, computer vision, systems, and
          rowing biomechanics.
        </p>
      </header>
      <div className="ruled-list">
        {notes.map((note) => (
          <NotePreview key={note.slug} note={note} />
        ))}
      </div>
    </Layout>
  );
}
