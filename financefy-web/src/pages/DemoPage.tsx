// src/pages/DemoPage.tsx
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  PieChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  Pie,
  PieChart as RePieChart,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DemoPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // =====================================================
  // 🔹 Dados simulados
  // =====================================================
  const pieData = [
    { name: "Alimentação", value: 450 },
    { name: "Transporte", value: 320 },
    { name: "Lazer", value: 180 },
    { name: "Educação", value: 220 },
  ];

  const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

  const monthlyData = [
    { name: "Jan", income: 5200, expense: 2800 },
    { name: "Fev", income: 4900, expense: 3100 },
    { name: "Mar", income: 5300, expense: 3400 },
    { name: "Abr", income: 5700, expense: 3000 },
  ];

  const transactions = [
    { name: "Supermercado", category: "Alimentação", amount: -150.0 },
    { name: "Salário", category: "Receita", amount: 4200.0 },
    { name: "Netflix", category: "Lazer", amount: -55.9 },
    { name: "Posto Shell", category: "Transporte", amount: -200.0 },
    { name: "Curso online", category: "Educação", amount: -120.0 },
  ];

  // =====================================================
  // 🔹 Render
  // =====================================================
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        {/* =====================================================
            🔹 Cabeçalho da Demo
        ===================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            💸 Modo Demonstração
          </h1>
          <p className="text-gray-600 text-lg">
            Explore o <strong>Financefy</strong> com dados fictícios e veja como o
            sistema ajuda você a entender e controlar suas finanças pessoais.
          </p>
        </motion.section>

        {/* =====================================================
            🔹 Cards principais
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-16"
        >
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <Wallet className="text-[--color-primary]" size={30} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Saldo Total
              </h3>
              <p className="text-2xl font-bold text-gray-900">R$ 4.250,00</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <ArrowUpCircle className="text-green-500" size={30} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Receitas
              </h3>
              <p className="text-2xl font-bold text-green-600">R$ 6.100,00</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <ArrowDownCircle className="text-red-500" size={30} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Despesas
              </h3>
              <p className="text-2xl font-bold text-red-600">R$ 1.850,00</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* =====================================================
            🔹 Gráfico de pizza (categorias)
        ===================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
            <PieChart className="text-[--color-primary]" />
            Distribuição por categoria
          </h2>

          <div className="w-full h-80">
            <ResponsiveContainer>
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* =====================================================
            🔹 Transações recentes
        ===================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16 bg-white border border-gray-200 rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Últimas Transações
          </h2>

          <ul className="divide-y divide-gray-200">
            {transactions.map((tx, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-3 text-gray-700"
              >
                <div>
                  <p className="font-medium">{tx.name}</p>
                  <p className="text-sm text-gray-500">{tx.category}</p>
                </div>
                <span
                  className={`font-semibold ${
                    tx.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {tx.amount < 0 ? "-" : "+"} R${" "}
                  {Math.abs(tx.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* =====================================================
            🔹 Gráfico de barras (Resumo mensal)
        ===================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-16 bg-white border border-gray-200 rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Resumo Mensal
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="income" fill="#22C55E" name="Receitas" />
                <Bar dataKey="expense" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* =====================================================
            🔹 Chamada final (CTA)
        ===================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Gostou do que viu?
          </h3>
          <p className="text-gray-600 mb-6">
            Crie sua conta gratuita e comece a organizar suas finanças hoje
            mesmo!
          </p>
          <button
            onClick={() => navigate("/register")}
            className="rounded-lg bg-[--color-primary] text-white px-8 py-3 font-semibold hover:opacity-90 transition"
          >
            Criar minha conta →
          </button>
        </motion.section>

        {/* =====================================================
            🔹 Botão de voltar
        ===================================================== */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="border border-gray-800 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            ← Voltar à página inicial
          </button>
        </div>

        {/* =====================================================
            🔹 Botão flutuante para Dashboard (se logado)
        ===================================================== */}
        {token && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => navigate("/dashboard")}
            className="fixed bottom-6 right-6 rounded-full bg-[--color-primary] text-white p-4 shadow-lg hover:scale-105 transition"
          >
            🧭 Ir para o Dashboard
          </motion.button>
        )}
      </main>

      <Footer />
    </>
  );
}
