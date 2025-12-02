// src/pages/TipsPage.tsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Lightbulb,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Wallet,
  Target,
  BookOpen,
} from "lucide-react";

export default function TipsPage() {
  const tips = [
    {
      icon: <PiggyBank className="text-green-600" size={28} />,
      title: "Monte uma reserva de emergência",
      description:
        "Comece guardando de 3 a 6 meses dos seus custos fixos. Isso traz segurança em imprevistos e liberdade para decisões futuras.",
    },
    {
      icon: <TrendingUp className="text-blue-600" size={28} />,
      title: "Invista cedo, mesmo com pouco",
      description:
        "O tempo é mais importante que o valor. Invista pequenas quantias de forma consistente e aproveite os juros compostos.",
    },
    {
      icon: <Lightbulb className="text-yellow-500" size={28} />,
      title: "Acompanhe seus gastos semanalmente",
      description:
        "Revise seus gastos toda semana. Pequenas correções constantes evitam surpresas no fim do mês e ajudam a economizar.",
    },
    {
      icon: <CreditCard className="text-red-600" size={28} />,
      title: "Evite dívidas caras",
      description:
        "Priorize quitar dívidas com juros altos, como cartão de crédito e cheque especial. Essas são as que mais impactam seu orçamento.",
    },
    {
      icon: <Wallet className="text-gray-800" size={28} />,
      title: "Tenha um orçamento realista",
      description:
        "Liste todas as despesas fixas e variáveis. Assim, você visualiza para onde seu dinheiro vai e onde pode economizar.",
    },
    {
      icon: <Target className="text-purple-600" size={28} />,
      title: "Defina metas claras",
      description:
        "Estabeleça objetivos mensais e anuais, como poupar para uma viagem ou quitar uma dívida. Isso dá propósito ao seu planejamento.",
    },
  ];

  return (
    <>
      {/* 🔹 Navbar global */}
      <Navbar />

      {/* 🔹 Conteúdo principal */}
      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        <section className="mx-auto max-w-5xl text-center mb-12">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-gray-900 mb-4">
            <BookOpen className="text-[--color-primary]" size={36} />
            Dicas de Educação Financeira
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Aprenda a cuidar melhor do seu dinheiro com orientações práticas e
            aplicáveis no seu dia a dia.  
            Conhecimento financeiro é liberdade — comece hoje!
          </p>
        </section>

        {/* 🔹 Grid de dicas */}
        <section className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">{tip.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </section>

        {/* 🔹 Seção extra */}
        <section className="mx-auto max-w-5xl mt-16 bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📘 Educação financeira é um hábito
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Aprender a lidar com o dinheiro é um processo contínuo.  
            Não se trata apenas de economizar, mas de entender como suas escolhas
            financeiras afetam seu futuro.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Tente revisar seu orçamento mensalmente e defina metas pequenas,
            mas alcançáveis. Cada pequena conquista fortalece sua disciplina e
            sua confiança financeira.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Informação é o primeiro passo para conquistar estabilidade e
            liberdade. Continue aprendendo, ajustando e evoluindo.
          </p>
        </section>
      </main>

      {/* 🔹 Footer global */}
      <Footer />
    </>
  );
}
