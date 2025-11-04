import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginUser } from "../api/auth";
import toast from "react-hot-toast";
import type { AuthContextType } from "../context/AuthContext"; // ✅ import do tipo correto

export default function Login() {
  const auth = useAuth() as AuthContextType; // ✅ tipagem explícita segura
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      auth.setAuth({
        user: data.user,
        token: data.access,
      });

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao fazer login.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 pt-28">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h2 className="mb-2 text-center text-3xl font-bold text-black">
            Entrar no <span className="text-[--color-primary]">Financefy</span>
          </h2>
          <p className="mb-6 text-center text-gray-500">Acesse sua conta para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-700">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                placeholder="Digite seu usuário"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md py-2 font-medium transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400 text-white"
                  : "border border-black bg-black text-white hover:bg-white hover:text-black"
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Ainda não tem uma conta?{" "}
            <Link to="/register" className="font-medium text-[--color-primary] hover:underline">
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
