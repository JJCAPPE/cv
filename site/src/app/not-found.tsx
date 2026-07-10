import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <p>404</p>
      <h1>This page left the course.</h1>
      <Link href="/" className="action-link action-link--accent">
        Return home
      </Link>
    </main>
  );
}
