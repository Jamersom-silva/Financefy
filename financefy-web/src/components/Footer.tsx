import { useLocation } from "react-router-dom";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import Logo from "../assets/logo.svg"; // ✅ Caminho da sua logo

export default function Footer() {
  const location = useLocation();

  // 🔹 Verifica se está em página de login ou registro
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // ==============================================================
  // 🔹 Footer simples (Login / Register)
  // ==============================================================
  if (isAuthPage) {
    return (
      <footer className="border-t border-gray-200 bg-white py-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-900">Financefy</span>. Todos os direitos
          reservados.
        </p>
      </footer>
    );
  }

  // ==============================================================
  // 🔹 Footer completo (páginas principais)
  // ==============================================================
  return (
<footer className="mt-12 border-t border-gray-200 bg-linear-to-b from-white to-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-10 md:flex-row md:items-start">
        {/* ==========================================================
            🔹 Coluna 1: Logo e descrição
        ========================================================== */}
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Financefy Logo" className="h-10 w-10" />
            <h3 className="text-xl font-bold text-gray-900">Financefy 💸</h3>
          </div>
          <p className="max-w-xs text-sm text-gray-600">
            Gerencie suas finanças de forma simples, clara e eficiente. Controle suas receitas,
            despesas e visualize relatórios detalhados com facilidade.
          </p>
        </div>

        {/* ==========================================================
            🔹 Coluna 2: Links úteis
        ========================================================== */}
        <div className="flex flex-col items-center gap-2 text-sm text-gray-600 md:items-start">
          <h4 className="mb-1 font-semibold text-gray-800">Links úteis</h4>

          <a href="/about" className="transition hover:text-[--color-primary]">
            Sobre
          </a>
          <a href="/privacy" className="transition hover:text-[--color-primary]">
            Política de Privacidade
          </a>
          <a href="/contact" className="transition hover:text-[--color-primary]">
            Contato
          </a>
        </div>

        {/* ==========================================================
            🔹 Coluna 3: Redes sociais
        ========================================================== */}
        <div className="flex flex-col items-center gap-3 md:items-start">
          <h4 className="mb-1 font-semibold text-gray-800">Conecte-se</h4>
          <div className="flex gap-5 text-gray-500">
            <a
              href="https://github.com/seuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition hover:scale-110 hover:text-[--color-primary]"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://linkedin.com/in/seulinkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition hover:scale-110 hover:text-[--color-primary]"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>

            <a
              href="https://instagram.com/seuinsta"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition hover:scale-110 hover:text-[--color-primary]"
              title="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href="mailto:contato@financefy.com"
              className="transform transition hover:scale-110 hover:text-[--color-primary]"
              title="E-mail"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* ==========================================================
          🔹 Linha inferior (créditos)
      ========================================================== */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-900">Financefy</span> — Todos os direitos reservados.
      </div>
    </footer>
  );
}
