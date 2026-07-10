type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <main id="main-content" className={`page-shell ${className}`}>
      {children}
    </main>
  );
}
