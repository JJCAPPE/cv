import Link from "next/link";
import type { Note } from "@/lib/notes";

export function NotePreview({ note }: { note: Note }) {
  return (
    <article className="note-preview">
      <div>
        <p className="note-preview__meta">
          {note.category} / {note.date}
        </p>
        <h3>
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </h3>
        <p>{note.description}</p>
      </div>
      <Link
        href={`/notes/${note.slug}`}
        className="note-preview__arrow"
        aria-label={`Read ${note.title}`}
      >
        →
      </Link>
    </article>
  );
}
