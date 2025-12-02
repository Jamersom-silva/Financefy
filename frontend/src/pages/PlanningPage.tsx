// src/pages/PlanningPage.tsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, Wallet, BarChart3, ClipboardCheck, Clock } from "lucide-react";

export default function PlanningPage() {
  const sections = [
    {
      icon: <Wallet className="text-green-600" size={26} />,
      title: "Método 50/30/20",
      content:
        "Use 50% da renda para necessidades, 30% para desejos e 20% para poupar ou investir. Simples, direto e eficaz!",
    },
    {
      icon: <Calendar className="text-blue-600" size={26} />,
      title: "Planejamento semanal",
      content:
        "Acompanhe seu orçamento toda semana. Pequenos ajustes frequentes mantêm você no controle das suas metas.",
    },
    {
      icon: <BarChart3 className="text-purple-600" size={26} />,
      title: "Revise seus gastos fixos",
      content:
        "Cancele assinaturas pouco usadas, renegocie tarifas e busque alternativas mais baratas. Pequenas mudanças somam.",
    },
    {
      icon: <ClipboardCheck className="text-gray-800" size={26} />,
      title: "Priorize metas essenciais",
      content:
        "Liste seus principais objetivos financeiros e dê foco ao que realmente importa. Evite se dispersar em muitas metas ao mesmo tempo.",
    },
  ];

  return (
    <>
      {/* 🔹 Navbar global */}
      <Navbar />

      {/* 🔹 Conteúdo principal */}
      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        {/* Cabeçalho */}
        <section className="mx-auto max-w-5xl text-center mb-10">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-gray-900 mb-4">
            <Clock className="text-[--color-primary]" size={36} />
            Planejamento Financeiro
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Estruture seus objetivos e mantenha um controle saudável sobre suas
            finanças. O planejamento é a base para o sucesso financeiro.
          </p>
        </section>

        {/* Dicas e orientações */}
        <section className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h2 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </section>

        {/* Seção extra motivacional */}
        <section className="mx-auto max-w-5xl mt-16 bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Por que o planejamento é essencial?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            O planejamento financeiro te permite agir com consciência e segurança.
            Ao saber exatamente para onde vai seu dinheiro, você evita imprevistos
            e conquista mais tranquilidade no dia a dia.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Além disso, um bom plano te ajuda a alcançar metas de curto, médio e
            longo prazo, sem precisar abrir mão da qualidade de vida.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Reserve um momento toda semana para revisar suas finanças e ajustar o
            que for necessário. Pequenos ajustes consistentes geram grandes
            resultados ao longo do tempo.
          </p>
        </section>
      </main>

      {/* 🔹 Footer global */}
      <Footer />
    </>
  );
}
