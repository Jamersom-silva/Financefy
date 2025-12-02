import { useState } from "react";
import {
  LogOut,
  User,
  HelpCircle,
  ChevronDown,
  Edit,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { apiRequest } from "../api/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formulários
  const [formProfile, setFormProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [formPassword, setFormPassword] = useState({
    old_password: "",
    new_password: "",
  });

  // Atualizar perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiRequest("/profile/update/", "PUT", formProfile);
      toast.success("Perfil atualizado com sucesso!");
      setShowEditProfile(false);
    } catch {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Alterar senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPassword.old_password || !formPassword.new_password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/profile/change-password/", "PUT", formPassword);
      toast.success("Senha alterada com sucesso!");
      setShowChangePassword(false);
      setFormPassword({ old_password: "", new_password: "" });
    } catch {
      toast.error("Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  // Navegar para a página de ajuda
  const handleHelpClick = () => {
    setIsOpen(false);
    navigate("/help"); // ✅ Rota da página de ajuda
  };

  return (
    <div className="relative">
      {/* Botão do usuário */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <User size={16} className="text-[--color-primary]" />
        {user?.username || "Usuário"}
        <ChevronDown size={14} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500">{user?.email || "—"}</p>
          </div>

          <ul className="mt-1 text-sm text-gray-700">
            <li>
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
              >
                <Edit size={16} /> Editar perfil
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
              >
                <Lock size={16} /> Alterar senha
              </button>
            </li>
            <li>
              <button
                onClick={handleHelpClick}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
              >
                <HelpCircle size={16} />
                Ajuda
              </button>
            </li>
            <li className="border-t border-gray-100 mt-1">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Modal: Editar perfil */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Editar perfil
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome de usuário</label>
                <input
                  type="text"
                  value={formProfile.username}
                  onChange={(e) =>
                    setFormProfile({ ...formProfile, username: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formProfile.email}
                  onChange={(e) =>
                    setFormProfile({ ...formProfile, email: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Alterar senha */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Alterar senha
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Senha atual</label>
                <input
                  type="password"
                  value={formPassword.old_password}
                  onChange={(e) =>
                    setFormPassword({ ...formPassword, old_password: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nova senha</label>
                <input
                  type="password"
                  value={formPassword.new_password}
                  onChange={(e) =>
                    setFormPassword({ ...formPassword, new_password: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Alterar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
