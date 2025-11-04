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
import { useAuth } from "../../hooks/useAuth";
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
} from "recharts";

// ============================================================
// 🔹 Tipos
// ============================================================
interface MonthlyData {
  income?: number;
  expense?: number;
  balance?: number;
}

interface ReportData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

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
  const { token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<ReportData[]>([]);
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
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (selectedMonth) queryParams.append("month", selectedMonth);
      if (selectedYear) queryParams.append("year", selectedYear);

      const headers = { Authorization: `Bearer ${token}` };

      const reportRes = await fetch(
        `http://127.0.0.1:8000/api/v1/reports/monthly/?${queryParams.toString()}`,
        { headers }
      );
      if (!reportRes.ok) throw new Error("Erro ao carregar relatório mensal.");

      const report = await reportRes.json();
      const monthlyData: Record<string, MonthlyData> = report?.monthly_data ?? {};

      const chartData = Object.entries(monthlyData).map(([month, values]) => ({
        month,
        income: values.income ?? 0,
        expense: values.expense ?? 0,
        balance: values.balance ?? 0,
      }));

      setData(chartData);
      setSummary({
        totalIncome: report?.total_income ?? 0,
        totalExpense: report?.total_expense ?? 0,
        balance: report?.balance ?? 0,
      });

      const catRes = await fetch(
        `http://127.0.0.1:8000/api/v1/reports/categories/?${queryParams.toString()}`,
        { headers }
      );
      if (!catRes.ok) throw new Error("Erro ao carregar categorias.");

      const catData = await catRes.json();
      const exp = catData?.expenses_by_category ?? {};
      const formatted: CategoryData[] = Object.entries(exp).map(([name, total]) => ({
        name,
        total: Number(total),
      }));
      setCategories(formatted);

      const recentRes = await fetch(`http://127.0.0.1:8000/api/v1/reports/recent/`, {
        headers,
      });
      if (recentRes.ok) {
        const recentData: Transaction[] = await recentRes.json();
        setRecent(recentData);
      }
    } catch {
  setError("Não foi possível carregar os dados do painel.");
} finally {
      setLoading(false);
    }
  }, [token, selectedMonth, selectedYear]);

  useEffect(() => {
    if (token) fetchReports();
  }, [fetchReports, token]);

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
  // 🔹 Layout Refinado e Responsivo
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-8 lg:px-12 xl:px-20 mx-auto max-w-7xl space-y-12 transition-all duration-300 ease-in-out">
      {/* 🔹 Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <TrendingUp className="text-[--color-primary]" size={24} /> Painel Financeiro
        </h2>

        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Mês</option>
            {[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ].map((month, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {month}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Ano</option>
            {["2023", "2024", "2025", "2026"].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔹 Mensagem de erro */}
      {error && (
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* 🔹 Resumo Financeiro */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-green-50 p-6 shadow-sm hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-700">Entradas</p>
            <h3 className="text-2xl font-bold text-green-600">
              R$ {summary.totalIncome.toFixed(2)}
            </h3>
          </div>
          <ArrowUpCircle className="text-green-600" size={36} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-red-50 p-6 shadow-sm hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-700">Saídas</p>
            <h3 className="text-2xl font-bold text-red-500">
              R$ {summary.totalExpense.toFixed(2)}
            </h3>
          </div>
          <ArrowDownCircle className="text-red-500" size={36} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-indigo-50 p-6 shadow-sm hover:shadow-md transition">
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

      {/* 🔹 Gráficos */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* 📈 Evolução Mensal */}
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition">
          <h3 className="mb-6 text-lg font-semibold text-gray-800">
            Evolução Mensal
          </h3>
          {data.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" name="Receitas" />
                  <Line type="monotone" dataKey="expense" stroke="#dc2626" name="Despesas" />
                  <Line type="monotone" dataKey="balance" stroke="#4f46e5" name="Saldo" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">Nenhum dado disponível.</p>
          )}
        </div>

        {/* 🥧 Gastos por Categoria */}
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <PieChart className="text-[--color-primary]" size={20} /> Gastos por Categoria
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
                    label={({ name, percent = 0 }: { name?: string; percent?: number }) =>
                      `${name ?? ""} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
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

      {/* 🔹 Últimas Transações */}
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Últimas Transações</h3>
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
              <thead className="border-b text-gray-500 bg-gray-50">
                <tr>
                  <th className="py-2 text-left">Descrição</th>
                  <th className="py-2 text-left">Conta</th>
                  <th className="py-2 text-left">Categoria</th>
                  <th className="py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
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
