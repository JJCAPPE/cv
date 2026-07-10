import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          className="site-wordmark"
          aria-label="Giacomo Cappelletto home"
        >
          <span className="site-wordmark__full">Giacomo Cappelletto</span>
          <span className="site-wordmark__short" aria-hidden="true">
            GC
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
