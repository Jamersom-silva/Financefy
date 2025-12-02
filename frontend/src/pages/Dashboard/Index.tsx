import { useEffect, useState, useCallback } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  PieChart,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart as RePieChart,
  Cell,
  Legend,
  PieLabelRenderProps,
} from "recharts";

// ============================================================
// 🔹 Tipos
// ============================================================
interface CategoryData {
  name: string;
  total: number;
  [key: string]: string | number;
}

interface Transaction {
  description: string;
  account: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  date: string;
}

// ============================================================
// 🔹 Componente principal
// ============================================================
export default function DashboardHome() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<
    { month: string; income: number; expense: number; balance: number }[]
  >([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

  // ============================================================
  // 🔹 Buscar dados do backend
  // ============================================================
  const fetchReports = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);

      const headers = { Authorization: `Bearer ${accessToken}` };

      // --- Relatório Mensal ---
      const monthlyRes = await fetch(
        `http://127.0.0.1:8000/api/v1/reports/monthly/?${params}`,
        { headers }
      );
      if (!monthlyRes.ok) throw new Error();
      const monthlyJson = await monthlyRes.json();

      // ✔ Construção correta do gráfico mensal (seu backend não envia monthly_data)
      const chartData = [
        {
          month: String(monthlyJson.month).padStart(2, "0"),
          income: monthlyJson.total_income ?? 0,
          expense: monthlyJson.total_expense ?? 0,
          balance: monthlyJson.balance ?? 0,
        },
      ];
      setData(chartData);

      setSummary({
        totalIncome: monthlyJson.total_income ?? 0,
        totalExpense: monthlyJson.total_expense ?? 0,
        balance: monthlyJson.balance ?? 0,
      });

      // --- Categorias ---
      const catRes = await fetch(
        `http://127.0.0.1:8000/api/v1/reports/categories/?${params}`,
        { headers }
      );
      if (!catRes.ok) throw new Error();
      const catJson = await catRes.json();

      // ✔ Seu backend envia { "categories": { "Alimentação": 300, ... } }
      const exp = catJson.categories ?? {};

      const formatted: CategoryData[] = Object.entries(exp).map(([name, total]) => ({
        name,
        total: Number(total),
      }));
      setCategories(formatted);

      // --- Recentes ---
      const recentRes = await fetch(`http://127.0.0.1:8000/api/v1/reports/recent/`, {
        headers,
      });

      if (recentRes.ok) {
        const recentJson: Transaction[] = await recentRes.json();
        setRecent(recentJson);
      }
    } catch {
      setError("Não foi possível carregar os dados do painel.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedMonth, selectedYear]);

  useEffect(() => {
    if (accessToken) fetchReports();
  }, [fetchReports, accessToken]);

  // ============================================================
  // 🔹 Loading
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Carregando painel...
      </div>
    );
  }

  // ============================================================
  // 🔹 Layout
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-8 lg:px-12 xl:px-20 mx-auto max-w-7xl space-y-12">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <TrendingUp className="text-[--color-primary]" size={24} />
          Painel Financeiro
        </h2>

        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-lg border px-4 py-2 text-sm bg-white shadow-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Mês</option>
            {[
              "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
            ].map((name, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {name}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border px-4 py-2 text-sm bg-white shadow-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Ano</option>
            {["2023", "2024", "2025", "2026"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border bg-green-50 p-6 shadow-sm">
          <div>
            <p className="text-sm text-gray-700">Entradas</p>
            <h3 className="text-2xl font-bold text-green-600">
              R$ {summary.totalIncome.toFixed(2)}
            </h3>
          </div>
          <ArrowUpCircle className="text-green-600" size={36} />
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-red-50 p-6 shadow-sm">
          <div>
            <p className="text-sm text-gray-700">Saídas</p>
            <h3 className="text-2xl font-bold text-red-500">
              R$ {summary.totalExpense.toFixed(2)}
            </h3>
          </div>
          <ArrowDownCircle className="text-red-500" size={36} />
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-indigo-50 p-6 shadow-sm">
          <div>
            <p className="text-sm text-gray-700">Saldo Atual</p>
            <h3
              className={`text-2xl font-bold ${
                summary.balance >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              R$ {summary.balance.toFixed(2)}
            </h3>
          </div>
          <Wallet className="text-[--color-primary]" size={36} />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-10 lg:grid-cols-2">

        {/* Linha */}
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-800">Evolução Mensal</h3>

          {data.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" />
                  <Line type="monotone" dataKey="expense" stroke="#dc2626" />
                  <Line type="monotone" dataKey="balance" stroke="#4f46e5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">Nenhum dado disponível.</p>
          )}
        </div>

        {/* Pizza */}
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <PieChart size={20} /> Gastos por Categoria
          </h3>

          {categories.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer>
                <RePieChart>
                  <Pie
                    data={categories}
                    dataKey="total"
                    nameKey="name"
                    outerRadius={120}
                    label={(props: PieLabelRenderProps) => {
                      const name = props.name as string;
                      const percent = Number(props.percent ?? 0);
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip formatter={(v) => `R$ ${Number(v).toFixed(2)}`} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">
              Nenhum dado de categoria disponível.
            </p>
          )}
        </div>
      </div>

      {/* Últimas transações */}
      <div className="rounded-xl border bg-white p-8 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Últimas Transações</h3>
          <button
            onClick={() => navigate("/dashboard/transactions")}
            className="text-sm text-[--color-primary] font-medium hover:underline"
          >
            Ver todas →
          </button>
        </div>

        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="py-2 text-left">Descrição</th>
                  <th className="py-2 text-left">Conta</th>
                  <th className="py-2 text-left">Categoria</th>
                  <th className="py-2 text-right">Valor</th>
                </tr>
              </thead>

              <tbody>
                {recent.map((tx, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3">{tx.description}</td>
                    <td>{tx.account}</td>
                    <td>{tx.category}</td>
                    <td
                      className={`py-3 text-right font-semibold ${
                        tx.type === "income" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}{" "}
                      {tx.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            Nenhuma transação recente encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
