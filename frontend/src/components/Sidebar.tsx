import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Tags,
  ArrowRightLeft,
  FileText,     // ✅ Novo ícone para anexos
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";

import Logo from "../assets/logo.svg";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { to: "/dashboard/accounts", label: "Contas", icon: CreditCard },
    { to: "/dashboard/categories", label: "Categorias", icon: Tags },
    { to: "/dashboard/transactions", label: "Transações", icon: ArrowRightLeft },
    { to: "/dashboard/attachments", label: "Anexos", icon: FileText }, // ✅ Novo link
  ];

  return (
    <>
      {/* 🔹 Overlay no mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col justify-between border-r border-gray-200 bg-white text-gray-800 shadow-md transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* 🔹 Cabeçalho */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          {/* 🔸 Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2 hover:opacity-80 transition"
            onClick={onClose}
          >
            <img
              src={Logo}
              alt="Financefy"
              className={`transition-all duration-300 ${
                collapsed ? "h-8 w-8" : "h-9 w-9"
              }`}
            />
            {!collapsed && (
              <h2 className="text-xl font-bold text-gray-900 transition-all duration-300">
                Financefy
              </h2>
            )}
          </Link>

          {/* 🔹 Botão recolher/expandir */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`hidden lg:flex items-center justify-center rounded-md p-1 transition hover:bg-gray-100 ${
              collapsed ? "rotate-180" : "rotate-0"
            }`}
            title={collapsed ? "Expandir" : "Recolher"}
          >
            <Menu size={18} className="transition-transform duration-300" />
          </button>

          {/* 🔹 Botão fechar (mobile) */}
          <button
            onClick={onClose}
            className="rounded-md p-1 transition hover:bg-gray-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔹 Navegação */}
        <nav className="mt-6 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `group flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-r-full ${
                  isActive
                    ? "bg-[--color-primary]/10 text-[--color-primary] font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[--color-primary]"
                }`
              }
              onClick={onClose}
            >
              <Icon
                size={20}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              {!collapsed && (
                <span className="transition-all duration-300">{label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 🔹 Logout */}
        <div className="border-t border-gray-200 px-5 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-[--color-primary]"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
