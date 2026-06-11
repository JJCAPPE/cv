import { primaryLinks } from "@/content/links";
import { LinkPill } from "@/components/LinkPill";

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Identity and primary links">
      <div>
        <a href="#intro" className="sidebar__name">
          Giacomo
          <br />
          Cappelletto
        </a>
        <div className="sidebar__identity">
          <p>Computer Engineering @ Boston University</p>
          <p>D1 Varsity Rowing</p>
          <p>Software · ML · Systems</p>
          <p>Boston / Treviso</p>
        </div>
      </div>

      <nav aria-label="Profile links" className="sidebar__links">
        {primaryLinks.map((link) => (
          <LinkPill key={link.label} href={link.href}>
            {link.label}
          </LinkPill>
        ))}
      </nav>
    </aside>
  );
}
