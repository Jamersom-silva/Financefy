// src/pages/GoalsPage.tsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Target, Trophy, PlusCircle, TrendingUp } from "lucide-react";

export default function GoalsPage() {
  const goals = [
    { title: "Montar reserva de emergência", progress: 70, color: "bg-green-500" },
    { title: "Quitar cartão de crédito", progress: 45, color: "bg-yellow-500" },
    { title: "Guardar para viagem", progress: 20, color: "bg-blue-500" },
  ];

  return (
    <>
      {/* 🔹 Navbar global */}
      <Navbar />

      {/* 🔹 Conteúdo principal */}
      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        {/* Cabeçalho */}
        <section className="mx-auto max-w-4xl text-center mb-10">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-gray-900 mb-4">
            <Target className="text-[--color-primary]" size={36} />
            Minhas Metas Financeiras
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Defina objetivos claros e acompanhe seu progresso financeiro.
            Cada passo te aproxima da liberdade 💪
          </p>
        </section>

        {/* Metas */}
        <section className="mx-auto max-w-3xl space-y-6">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">{goal.title}</h2>
                <span className="text-sm text-gray-500 font-medium">
                  {goal.progress}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full ${goal.color}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Seção motivacional */}
        <section className="mx-auto max-w-4xl mt-16 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <div className="flex justify-center mb-4">
              <Trophy className="text-yellow-500" size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Continue firme nas suas metas
            </h2>
            <p className="text-gray-600 mb-4">
              Grandes resultados vêm de pequenas ações consistentes.
              Ajuste suas metas conforme seu momento e mantenha o foco.
            </p>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[--color-primary] text-white px-5 py-2 font-medium transition hover:opacity-90">
              <PlusCircle size={18} />
              Adicionar nova meta
            </button>
          </div>
        </section>

        {/* Bloco educativo */}
        <section className="mx-auto max-w-5xl mt-16 bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-[--color-primary]" />
            Dica de ouro 💰
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Não tente alcançar todas as metas de uma vez. O segredo é escolher
            poucas e mantê-las consistentes.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Quando atingir uma, comemore e defina a próxima. Isso cria um ciclo
            de motivação e conquista.
          </p>
          <p className="text-gray-600 leading-relaxed">
            E lembre-se: pequenas vitórias constroem grandes resultados.
          </p>
        </section>
      </main>

      {/* 🔹 Footer global */}
      <Footer />
    </>
  );
}
