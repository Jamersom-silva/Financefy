export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sobre o Financefy</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          O <strong>Financefy</strong> é um painel de controle financeiro desenvolvido para ajudar 
          você a gerenciar suas finanças pessoais de forma simples, intuitiva e organizada.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Nosso objetivo é oferecer uma experiência prática para acompanhar receitas, despesas e 
          saldo em tempo real, com relatórios claros e visualmente agradáveis.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          O projeto foi desenvolvido com <strong>React</strong> e <strong>Django REST Framework</strong>,
          combinando performance, segurança e escalabilidade. Ele é ideal para quem busca aprender, 
          testar ou apresentar suas habilidades em desenvolvimento full stack.
        </p>

        <p className="text-gray-700 leading-relaxed">
          💡 Este projeto é open-source e tem fins educacionais. Sinta-se à vontade para explorá-lo, 
          testar melhorias e contribuir!
        </p>
      </div>
    </div>
  );
}
