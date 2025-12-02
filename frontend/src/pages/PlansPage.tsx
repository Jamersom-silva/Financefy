// src/pages/PlansPage.tsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, Star, Wrench } from "lucide-react";

export default function PlansPage() {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0 / mês",
      features: [
        "Controle básico de contas e transações",
        "Relatórios mensais simples",
        "Acesso seguro com login",
      ],
    },
    {
      name: "Pro",
      price: "R$ 19,90 / mês",
      features: [
        "Tudo do plano gratuito",
        "Relatórios avançados e gráficos",
        "Metas e planejamento financeiro",
        "Suporte prioritário",
      ],
      highlight: true,
    },
    {
      name: "Empresarial",
      price: "R$ 49,90 / mês",
      features: [
        "Painel multiusuário",
        "Exportação de dados",
        "Análises personalizadas",
        "Consultoria financeira",
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        <section className="text-center mx-auto max-w-5xl mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-gray-600 text-lg">
            Comece gratuitamente e evolua conforme suas necessidades.
          </p>

          {/* 🔹 Aviso de desenvolvimento */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-yellow-100 px-4 py-2 text-yellow-800 text-sm font-medium border border-yellow-300">
            <Wrench size={18} className="text-yellow-600" />
            <span>Esta seção está em desenvolvimento — planos ainda não disponíveis.</span>
          </div>
        </section>

        {/* 🔹 Cards de planos */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl border p-8 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-1 ${
                plan.highlight
                  ? "border-[--color-primary]"
                  : "border-gray-200"
              }`}
            >
              {plan.highlight && (
                <div className="flex justify-center mb-2">
                  <Star className="text-[--color-primary]" />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-[--color-primary] text-2xl font-semibold mb-4">
                {plan.price}
              </p>
              <ul className="space-y-2 text-gray-600">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Botão desativado (placeholder) */}
              <button
                disabled
                className="mt-6 w-full rounded-lg bg-gray-200 text-gray-500 py-2 font-semibold cursor-not-allowed"
              >
                Em breve
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
