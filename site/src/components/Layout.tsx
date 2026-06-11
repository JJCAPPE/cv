import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="page-shell">{children}</main>
      <Footer />
    </>
  );
}
