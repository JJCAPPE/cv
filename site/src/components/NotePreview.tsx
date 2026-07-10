import Link from "next/link";
import type { Note } from "@/lib/notes";

export function NotePreview({ note }: { note: Note }) {
  return (
    <article>
      <Link href={`/notes/${note.slug}`} className="note-preview">
        <div>
          <p className="note-preview__meta">
            {note.category} / <time dateTime={note.date}>{note.date}</time>
          </p>
          <h2>{note.title}</h2>
          <p>{note.description}</p>
        </div>
        <span className="note-preview__link" aria-hidden="true">
          Read
        </span>
      </Link>
    </article>
  );
}
