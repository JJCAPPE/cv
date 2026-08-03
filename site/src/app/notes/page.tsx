import { Layout } from "@/components/Layout";
import { NotePreview } from "@/components/NotePreview";
import { createPageMetadata } from "@/lib/metadata";
import { getNotes } from "@/lib/notes";

export const metadata = createPageMetadata({
  title: "Notes",
  description:
    "Technical notes on machine learning, computer vision, systems, rowing biomechanics, and building useful tools.",
  pathname: "/notes",
});

export default function NotesPage() {
  const notes = getNotes();

  return (
    <Layout className="notes-index">
      <header className="page-intro notes-intro">
        <h1>Notes</h1>
        <div className="notes-intro__meta">
          <p>
            Working notes on machine learning, computer vision, systems, and
            rowing biomechanics.
          </p>
          <p className="notes-intro__count">
            {String(notes.length).padStart(2, "0")} entries
          </p>
        </div>
      </header>
      <div className="notes-index__list">
        {notes.map((note, index) => (
          <NotePreview key={note.slug} note={note} index={index} />
        ))}
      </div>
    </Layout>
  );
}
