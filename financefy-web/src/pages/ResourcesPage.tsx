// src/pages/ResourcesPage.tsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck, BarChart3, Smartphone, Wrench } from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    {
      icon: <BarChart3 className="text-blue-600" size={28} />,
      title: "Controle Inteligente de Gastos",
      description:
        "Monitore suas despesas e receitas em tempo real com gráficos claros e intuitivos, ajudando você a entender seus hábitos financeiros.",
    },
    {
      icon: <ShieldCheck className="text-green-600" size={28} />,
      title: "Segurança e Privacidade",
      description:
        "Seus dados financeiros são protegidos com autenticação segura e criptografia de ponta a ponta, garantindo total confidencialidade.",
    },
    {
      icon: <Smartphone className="text-purple-600" size={28} />,
      title: "Acesso em Qualquer Lugar",
      description:
        "Gerencie suas finanças do computador, tablet ou celular — tudo sincronizado automaticamente na nuvem.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        {/* 🔹 Cabeçalho da página */}
        <section className="mx-auto max-w-5xl text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[--color-primary]/10 px-4 py-2 text-[--color-primary] font-semibold mb-4">
            <BarChart3 size={18} /> Recursos do Financefy
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Tudo o que você precisa para dominar suas finanças
          </h1>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Descubra as principais funcionalidades que tornam o Financefy
            uma plataforma completa, segura e fácil de usar.
          </p>

          {/* 🔸 Aviso de desenvolvimento */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-yellow-100 px-4 py-2 text-yellow-800 text-sm font-medium border border-yellow-300">
            <Wrench size={18} className="text-yellow-600" />
            <span>Esta seção está em desenvolvimento — novos recursos serão adicionados em breve.</span>
          </div>
        </section>

        {/* 🔹 Cards de recursos */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
          {resources.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gray-100">{item.icon}</div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {item.title}
              </h2>
              <p className="text-gray-600 text-center leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
