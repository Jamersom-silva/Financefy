import { TrendingUp, PieChart, Wallet } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Wallet className="h-8 w-8 text-[--color-primary]" />,
      title: "Gerencie suas contas",
      desc: "Crie e acompanhe suas contas bancárias e carteiras em um só lugar.",
    },
    {
      icon: <PieChart className="h-8 w-8 text-[--color-primary]" />,
      title: "Controle total de categorias",
      desc: "Organize receitas e despesas com categorias personalizadas.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-[--color-primary]" />,
      title: "Relatórios inteligentes",
      desc: "Visualize gráficos mensais e entenda melhor seus hábitos financeiros.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Recursos que facilitam sua vida
        </h2>
        <p className="mt-3 mb-12 text-gray-600">
          Tudo o que você precisa para entender e organizar suas finanças.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gray-50 p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
