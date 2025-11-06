import { LogIn, PlusCircle, BarChart3 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <LogIn className="h-8 w-8 text-[--color-primary]" />,
      title: "1. Crie sua conta",
      desc: "Registre-se em poucos segundos e tenha acesso ao painel completo.",
    },
    {
      icon: <PlusCircle className="h-8 w-8 text-[--color-primary]" />,
      title: "2. Adicione suas transações",
      desc: "Registre suas receitas e despesas com categorias personalizadas.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-[--color-primary]" />,
      title: "3. Acompanhe seu progresso",
      desc: "Veja relatórios e gráficos para entender melhor seus hábitos financeiros.",
    },
  ];

  return (
    <section className="bg-[--color-light] py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
          Como funciona o Financefy?
        </h2>
        <p className="mb-12 text-gray-600">
          Em poucos passos, você tem o controle completo do seu dinheiro.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[--color-primary]/10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
              <p className="mt-3 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
