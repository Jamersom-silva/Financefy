import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">{children}</main>
      <Footer />
    </>
  );
}
