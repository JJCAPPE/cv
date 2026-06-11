import Link from "next/link";

type LinkPillProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: boolean;
};

export function LinkPill({
  href,
  children,
  className = "",
  download,
}: LinkPillProps) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      className={`text-link ${className}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      download={download}
    >
      {children}
    </Link>
  );
}
