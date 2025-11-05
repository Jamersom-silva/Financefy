export default function FAQ() {
  const faqs = [
    {
      q: "O Financefy é gratuito?",
      a: "Sim, a versão inicial é gratuita. Planejamos recursos avançados no futuro.",
    },
    {
      q: "Meus dados estão seguros?",
      a: "Sim. Usamos autenticação JWT e cada usuário só acessa os próprios dados.",
    },
    {
      q: "Preciso conectar banco?",
      a: "Não. Você registra contas e transações manualmente (controle total).",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* 🔹 Título principal */}
        <h2 className="text-center text-3xl font-bold text-black md:text-4xl">
          Perguntas frequentes
        </h2>

        {/* 🔹 Lista de perguntas */}
        <div className="mt-10 space-y-6">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-gray-200 p-6 transition-all hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-black">{f.q}</h3>
              <p className="mt-3 text-lg leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
