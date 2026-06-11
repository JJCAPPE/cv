import Link from "next/link";

const navigation = [
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Notes", href: "/notes" },
  { label: "Resume", href: "/resume" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-wordmark" aria-label="Giacomo Cappelletto home">
          Giacomo Cappelletto
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="site-nav">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-nav__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
