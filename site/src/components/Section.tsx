type SectionProps = {
  number: string;
  title: string;
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({
  number,
  title,
  id,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`section ${className}`}>
      <header className="section__header">
        <span>{number}</span>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}
