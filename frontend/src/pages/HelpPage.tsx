// src/pages/HelpPage.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

import {
  HelpCircle,
  Mail,
  ArrowLeft,
  BookOpen,
  MessageSquare,
} from "lucide-react";

export default function HelpPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth(); // ✅ substitui token

  const handleBack = () => {
    if (accessToken) navigate("/dashboard");
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-[--color-primary]" size={22} />
            <h1 className="text-xl font-semibold text-gray-900">Ajuda</h1>
          </div>

          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            {accessToken ? "Voltar ao Dashboard" : "Voltar ao Início"}
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Busca rápida */}
        <div className="mb-8">
          <label htmlFor="help-search" className="block text-sm text-gray-600 mb-1">
            Pesquise por uma dúvida
          </label>
          <input
            id="help-search"
            type="text"
            placeholder="Ex.: Como cadastrar uma conta? Como ver relatórios?"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {/* Cards principais */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card
            icon={<BookOpen size={20} className="text-[--color-primary]" />}
            title="Guia rápido"
          >
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Crie suas <strong>Contas</strong> para organizar saldos.</li>
              <li>Defina <strong>Categorias</strong> para receitas e despesas.</li>
              <li>Lance <strong>Transações</strong> e acompanhe os gráficos.</li>
              <li>Use os filtros de <strong>mês/ano</strong> no painel.</li>
            </ul>
          </Card>

          <Card
            icon={<MessageSquare size={20} className="text-[--color-primary]" />}
            title="Perguntas frequentes"
          >
            <FAQItem
              q="Como cadastro uma nova conta?"
              a="Acesse Dashboard → Contas → Novo. Informe nome e saldo inicial."
            />
            <FAQItem
              q="Posso editar categorias?"
              a="Sim. Vá em Dashboard → Categorias para criar, editar ou remover."
            />
            <FAQItem
              q="Os gráficos não aparecem, e agora?"
              a="Verifique se há transações no período filtrado e se o servidor da API está ativo."
            />
          </Card>

          <Card
            icon={<Mail size={20} className="text-[--color-primary]" />}
            title="Fale conosco"
          >
            <p className="text-sm text-gray-700">
              Não encontrou o que precisa? Envie uma mensagem pela página de contato.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="mt-3 w-full rounded-md bg-[--color-primary] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Ir para Contato
            </button>
          </Card>
        </section>

        {/* Mais dúvidas */}
        <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Mais dúvidas comuns</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FAQItem
              q="Como exportar meus dados?"
              a="(Em desenvolvimento) A exportação em CSV/Excel será adicionada em breve."
              large
            />
            <FAQItem
              q="Como redefinir minha senha?"
              a="Na tela de login, clique em 'Esqueci minha senha'. Se estiver logado, use o menu do usuário → Alterar senha."
              large
            />
            <FAQItem
              q="Como mudar o período dos relatórios?"
              a="Use os seletores de Mês e Ano no Painel para filtrar os dados exibidos."
              large
            />
            <FAQItem
              q="Meu saldo parece incorreto. O que checar?"
              a="Confira o saldo inicial das contas e se as transações foram lançadas com o tipo correto (receita/despesa)."
              large
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ----------------- Componentes auxiliares ----------------- */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FAQItem({
  q,
  a,
  large = false,
}: {
  q: string;
  a: string;
  large?: boolean;
}) {
  return (
    <div className={large ? "space-y-1" : "mb-2"}>
      <p className="font-medium text-gray-800">{q}</p>
      <p className="text-sm text-gray-700">{a}</p>
    </div>
  );
}
