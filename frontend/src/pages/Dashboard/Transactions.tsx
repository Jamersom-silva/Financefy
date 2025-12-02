import { useCallback, useEffect, useMemo, useState, ChangeEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  Download,
  Wallet2,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";

import { apiGet, apiRequest } from "../../api/api";

type Transaction = {
  id: number;
  account: number;
  account_name: string;
  category: number;
  category_name: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  date: string;
};

type Account = { id: number; name: string };
type Category = { id: number; name: string; type: "income" | "expense" };

type FormState = {
  account: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  description: string;
  date: string;
};

export default function Transactions() {
  const { accessToken } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const [form, setForm] = useState<FormState>({
    account: "",
    category: "",
    amount: "",
    type: "expense",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // ============================================================
  // 🔹 Buscar transações
  // ============================================================
  const fetchTransactions = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError("");

      const data = await apiGet<Transaction[]>("/transactions/");
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setError("Não foi possível carregar as transações.");
      toast.error("Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ============================================================
  // 🔹 Buscar contas e categorias
  // ============================================================
  const fetchAccountsAndCategories = useCallback(async () => {
    if (!accessToken) return;

    try {
      const [accData, catData] = await Promise.all([
        apiGet<Account[]>("/accounts/"),
        apiGet<Category[]>("/categories/"),
      ]);

      setAccounts(accData);
      setCategories(catData);
    } catch {
      toast.error("Falha ao carregar contas e categorias.");
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchTransactions();
      fetchAccountsAndCategories();
    }
  }, [accessToken, fetchTransactions, fetchAccountsAndCategories]);

  // ============================================================
  // 🔹 Resumo financeiro
  // ============================================================
  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  // ============================================================
  // 🔹 Modal Helpers
  // ============================================================
  const openCreate = () => {
    setEditing(null);
    setForm({
      account: accounts[0]?.id?.toString() || "",
      category: categories[0]?.id?.toString() || "",
      amount: "",
      type: "expense",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setForm({
      account: tx.account.toString(),
      category: tx.category.toString(),
      amount: tx.amount.toString(),
      type: tx.type,
      description: tx.description,
      date: tx.date,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // 🔹 Criar / Editar transação
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = Number(form.amount);
    if (!form.account || !form.category || amount <= 0) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    try {
      setSaving(true);
      const body = { ...form, amount };

      if (editing) {
        const updated = await apiRequest<Transaction>(
          `/transactions/${editing.id}/`,
          "PUT",
          body
        );

        if (updated) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
          toast.success("Transação atualizada!");
        }
      } else {
        const created = await apiRequest<Transaction>("/transactions/", "POST", body);

        if (created) {
          setTransactions((prev) => [...prev, created]);
          toast.success("Transação criada!");
        }
      }

      closeModal();
    } catch {
      toast.error("Erro ao salvar transação.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 🔹 Excluir transação
  // ============================================================
  const handleDelete = async (tx: Transaction) => {
    const ok = window.confirm(`Excluir a transação "${tx.description}"?`);
    if (!ok) return;

    const previous = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));

    try {
      await apiRequest(`/transactions/${tx.id}/`, "DELETE");
      toast.success("Transação excluída!");
    } catch {
      toast.error("Erro ao excluir transação.");
      setTransactions(previous);
    }
  };

  // ============================================================
  // 🔹 Exportar CSV
  // ============================================================
  const handleExportCSV = () => {
    const header = "Descrição,Conta,Categoria,Tipo,Valor,Data\n";
    const rows = transactions
      .map(
        (t) =>
          `${t.description},${t.account_name},${t.category_name},${
            t.type === "income" ? "Receita" : "Despesa"
          },${t.amount.toFixed(2)},${new Date(t.date).toLocaleDateString("pt-BR")}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transacoes.csv");
    link.click();
  };

  // ============================================================
  // 🔹 UI
  // ============================================================
  return (
    <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Wallet2 size={22} className="text-[--color-primary]" /> Transações
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[--color-primary]"
          />

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <Download size={18} /> Exportar CSV
          </button>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-blue-500 px-4 py-2 text-white shadow-md transition hover:opacity-90"
          >
            <Plus size={18} /> Nova Transação
          </button>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-green-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Entradas</span>
            <ArrowUpCircle className="text-green-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-700">
            {summary.income.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Saídas</span>
            <ArrowDownCircle className="text-red-600" size={22} />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {summary.expense.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Saldo Atual</span>
            <Wallet2 className="text-indigo-600" size={22} />
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              summary.balance >= 0 ? "text-indigo-700" : "text-red-600"
            }`}
          >
            {summary.balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={18} /> Carregando...
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="py-3 px-4 font-medium">Descrição</th>
                  <th className="py-3 px-4 font-medium">Conta</th>
                  <th className="py-3 px-4 font-medium">Categoria</th>
                  <th className="py-3 px-4 font-medium">Valor</th>
                  <th className="py-3 px-4 font-medium">Data</th>
                  <th className="py-3 px-4 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`transition hover:bg-gray-50 ${
                      tx.type === "income" ? "bg-green-50/40" : "bg-red-50/40"
                    } border-b border-gray-100`}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {tx.description}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {tx.account_name}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {tx.category_name}
                    </td>

                    <td
                      className={`py-3 px-4 font-semibold flex items-center gap-2 ${
                        tx.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowUpCircle size={18} />
                      ) : (
                        <ArrowDownCircle size={18} />
                      )}

                      {tx.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>

                    <td className="py-3 px-4 text-gray-500">
                      {new Date(tx.date).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(tx)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          <Pencil size={16} /> Editar
                        </button>

                        <button
                          onClick={() => handleDelete(tx)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editing ? "Editar Transação" : "Nova Transação"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Conta
                  </label>
                  <select
                    name="account"
                    value={form.account}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.type === "income" ? "Receita" : "Despesa"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Valor</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Data</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  {saving ? (
                    <Loader2 className="animate-spin inline-block" />
                  ) : editing ? (
                    "Salvar Alterações"
                  ) : (
                    "Salvar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
