import Link from "next/link";
import { primaryLinks } from "@/content/links";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="site-footer__name">
          Giacomo Cappelletto
        </Link>
        <p>Software, ML, robotics, and real-world signals.</p>
      </div>
      <nav aria-label="Profile links" className="site-footer__links">
        {primaryLinks.map((link) => {
          return (
            <a
              key={link.label}
              href={link.href}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
      <p className="site-footer__copyright">
        © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
