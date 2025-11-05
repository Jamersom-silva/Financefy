import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/logo.svg";
import UserMenu from "../components/UserMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  // ===============================================================
  // 🔹 Navbar para Login / Registro
  // ===============================================================
  if (isAuthPage) {
    return (
      <header
        className={`fixed z-50 w-full border-b border-gray-200 bg-white py-4 transition-all duration-300 ${
          scrolled ? "shadow-md bg-white/90 backdrop-blur-md" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Financefy Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">
              Financefy 💸
            </span>
          </Link>
        </div>
      </header>
    );
  }

  // ===============================================================
  // 🔹 Navbar do Dashboard (limpa e estática)
  // ===============================================================
  if (isDashboardPage) {
    return (
      <header
        className={`w-full bg-white border-b border-gray-200 transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <nav className="flex items-center justify-end px-6 py-4">
          {/* 🔹 Menu do Usuário */}
          {user && <UserMenu />}
        </nav>
      </header>
    );
  }

  // ===============================================================
  // 🔹 Navbar pública (visitantes e home)
  // ===============================================================
  const publicLinks = [
    { to: "/resources", label: "Recursos" },
    { to: "/plans", label: "Planos" },
    { to: "/contact", label: "Contato" },
  ];

  const privateLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/tips", label: "Dicas" },
    { to: "/goals", label: "Metas" },
    { to: "/planning", label: "Planejamento" },
  ];

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-md bg-white/90 backdrop-blur-md" : "bg-white"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* 🔹 Logo principal */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Financefy Logo" className="h-8 w-8" />
          <span className="text-2xl font-extrabold text-[--color-primary]">
            Financefy
          </span>
        </Link>

        {/* 🔹 Links Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {(user ? privateLinks : publicLinks).map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`transition hover:text-[--color-primary] ${
                  location.pathname.startsWith(to)
                    ? "font-semibold text-[--color-primary] border-b-2 border-[--color-primary]"
                    : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 🔹 Ações Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="transform rounded-lg border-2 border-black bg-black px-7 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(0,0,0,0.25)]"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="transform rounded-lg border-2 border-black bg-black px-7 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(0,0,0,0.25)]"
              >
                Criar Conta
              </Link>
            </>
          ) : (
            <UserMenu />
          )}
        </div>

        {/* 🔹 Botão Mobile ☰ */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-3xl text-[--color-primary] md:hidden"
        >
          ☰
        </button>
      </nav>

      {/* 🔹 Menu Mobile */}
      {menuOpen && (
        <div
          className="space-y-4 bg-white px-6 py-4 shadow-md md:hidden animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        >
          {(user ? privateLinks : publicLinks).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block py-2 text-center hover:text-[--color-primary]"
            >
              {label}
            </Link>
          ))}

          <hr className="border-gray-200" />

          {!user ? (
            <>
              <Link
                to="/login"
                className="block rounded-md border border-[--color-primary] py-2 text-center text-[--color-primary] transition hover:bg-[--color-primary] hover:text-white"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="block rounded-md bg-[--color-primary] py-2 text-center text-white transition hover:opacity-90"
              >
                Criar Conta
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full rounded-md border border-gray-300 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              Sair
            </button>
          )}
        </div>
      )}
    </header>
  );
}
