import Link from "next/link";
import type { Note } from "@/lib/notes";

export function NotePreview({ note, index }: { note: Note; index: number }) {
  return (
    <article>
      <Link href={`/notes/${note.slug}`} className="note-preview">
        <span className="note-preview__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
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
