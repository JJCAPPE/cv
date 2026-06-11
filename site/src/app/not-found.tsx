import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>Page not found.</h1>
      <Link href="/" className="text-link">
        Return home
      </Link>
    </main>
  );
}
