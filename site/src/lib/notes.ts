import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const notesDirectory = path.join(process.cwd(), "content", "notes");

export type Note = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  content: string;
};

export function getNoteSlugs() {
  return fs
    .readdirSync(notesDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getNote(slug: string): Note | undefined {
  const filePath = path.join(notesDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    date: data.date,
    content,
  };
}

export function getNotes() {
  return getNoteSlugs()
    .map((slug) => getNote(slug))
    .filter((note): note is Note => Boolean(note))
    .sort((a, b) => b.date.localeCompare(a.date));
}
