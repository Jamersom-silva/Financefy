import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * 📦 MainLayout
 *
 * Estrutura base para páginas públicas do Financefy.
 * Inclui:
 * - Navbar fixa no topo
 * - Espaço compensatório abaixo do header
 * - Conteúdo principal centralizado
 * - Footer fixado ao final da página
 */

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 🔹 Navbar fixa no topo */}
      <Navbar />

      {/* 🔹 Espaço para compensar o header fixo */}
      <div className="h-20" />

      {/* 🔹 Conteúdo principal */}
      <main className="mx-auto w-full max-w-7xl grow px-6 py-8">{children}</main>

      {/* 🔹 Footer fixado ao final */}
      <Footer />
    </div>
  );
}
