import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // ✅ CORRIGIDO
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); // ✔️ Usa método correto do Provider

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      await register(username, email, password); // 🔥 Registro correto

      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-[80vh] flex-col items-center justify-start bg-gray-50 px-6 pt-28">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h2 className="mb-2 text-center text-3xl font-bold text-black">
            Criar conta no <span className="text-[--color-primary]">Financefy</span>
          </h2>
          <p className="mb-6 text-center text-gray-500">É rápido, gratuito e seguro.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-700">Usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                placeholder="Escolha um nome de usuário"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                placeholder="Seu melhor e-mail"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                placeholder="Crie uma senha segura"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Confirmar senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                placeholder="Digite novamente a senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md py-2 font-medium transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-medium text-[--color-primary] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
