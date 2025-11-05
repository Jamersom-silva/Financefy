import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Download,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiGet, apiRequest } from "../../api/api";

// ============================================================
// 🔹 Tipos
// ============================================================
type Account = {
  id: number;
  name: string;
  initial_balance: number;
  current_balance: number;
  created_at: string | null;
};

type FormState = {
  name: string;
  initial_balance: string;
};

// ============================================================
// 🔹 Componente Principal
// ============================================================
export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [form, setForm] = useState<FormState>({ name: "", initial_balance: "" });

  // ============================================================
  // 🔹 Buscar contas
  // ============================================================
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet<Account[]>("/accounts/");
      setAccounts(Array.isArray(data) ? data : []);
    } catch {
      setError("Não foi possível carregar as contas.");
      toast.error("Erro ao carregar contas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // ============================================================
  // 🔹 Filtro e Paginação
  // ============================================================
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results = q
      ? accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.initial_balance.toString().includes(q) ||
            a.current_balance.toString().includes(q)
        )
      : accounts;
    return results.slice((page - 1) * pageSize, page * pageSize);
  }, [accounts, query, page]);

  const totalPages = Math.ceil(
    (query
      ? accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.initial_balance.toString().includes(query) ||
            a.current_balance.toString().includes(query)
        ).length
      : accounts.length) / pageSize
  );

  // ============================================================
  // 🔹 Modal Helpers
  // ============================================================
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", initial_balance: "" });
    setIsOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setForm({
      name: account.name,
      initial_balance: String(account.initial_balance ?? 0),
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    setForm({ name: "", initial_balance: "" });
  };

  // ============================================================
  // 🔹 Criar / Editar Conta
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("O nome da conta é obrigatório.");
      return;
    }

    const initial = Number(form.initial_balance.replace(",", "."));
    if (isNaN(initial) || initial < 0) {
      toast.error("Saldo inicial deve ser um número ≥ 0.");
      return;
    }

    try {
      setSaving(true);
      const body = {
        name: form.name.trim(),
        initial_balance: initial,
      };

      let newAccount: Account | null = null;

      if (editing) {
        newAccount = await apiRequest<Account>(`/accounts/${editing.id}/`, "PUT", body);
        toast.success("Conta atualizada!");
      } else {
        newAccount = await apiRequest<Account>("/accounts/", "POST", body);
        toast.success("Conta criada!");
      }

      if (newAccount?.id) {
        setAccounts((prev) =>
          editing
            ? prev.map((a) => (a.id === newAccount.id ? newAccount : a))
            : [...prev, newAccount]
        );
      } else {
        await fetchAccounts();
      }

      closeModal();
    } catch {
      toast.error("Erro ao salvar conta.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 🔹 Excluir Conta
  // ============================================================
  const handleDelete = async (account: Account) => {
    const ok = window.confirm(
      `Excluir a conta "${account.name}"?\nAtenção: as transações relacionadas serão removidas.`
    );
    if (!ok) return;

    const previous = [...accounts];
    setAccounts((prev) => prev.filter((a) => a.id !== account.id));

    try {
      await apiRequest(`/accounts/${account.id}/`, "DELETE");
      toast.success("Conta excluída!");
    } catch {
      toast.error("Erro ao excluir conta.");
      setAccounts(previous);
    }
  };

  // ============================================================
  // 🔹 Exportar CSV
  // ============================================================
  const handleExportCSV = () => {
    const header = "Nome,Saldo Inicial,Saldo Atual,Criada em\n";
    const rows = accounts
      .map((a) => {
        const createdDate = a.created_at
          ? new Date(a.created_at).toLocaleDateString("pt-BR")
          : "Sem data";
        return `${a.name},${a.initial_balance.toFixed(2)},${a.current_balance.toFixed(
          2
        )},${createdDate}`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contas.csv");
    link.click();
  };

  // ============================================================
  // 🔹 UI
  // ============================================================
  return (
    <div className="space-y-6 transition-all duration-300 ease-in-out mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 🔹 Cabeçalho */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Wallet size={22} className="text-[--color-primary]" /> Minhas Contas
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nome ou valor..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
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
            <Plus size={18} /> Nova Conta
          </button>
        </div>
      </div>

      {/* 🔹 Tabela */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={18} /> Carregando contas...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Nenhuma conta encontrada. Clique em{" "}
            <span className="font-medium">“Nova Conta”</span>.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="py-3 px-4 font-medium">Nome</th>
                    <th className="py-3 px-4 font-medium">Saldo Inicial</th>
                    <th className="py-3 px-4 font-medium">Saldo Atual</th>
                    <th className="py-3 px-4 font-medium">Criada em</th>
                    <th className="py-3 px-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((acc) => (
                    <tr
                      key={acc.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">{acc.name}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {acc.initial_balance.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          acc.current_balance >= 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {acc.current_balance.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {acc.created_at
                          ? new Date(acc.created_at).toLocaleDateString("pt-BR")
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(acc)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <Pencil size={16} /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(acc)}
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

            {/* 🔹 Paginação */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
              <span>
                Página {page} de {totalPages || 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🔹 Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Editar Conta" : "Nova Conta"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-700">Nome da conta</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Ex.: Nubank, Carteira..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Saldo Inicial</label>
                <input
                  inputMode="decimal"
                  value={form.initial_balance}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, initial_balance: e.target.value }))
                  }
                  placeholder="0,00"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Use ponto ou vírgula. Ex.: 1500,50</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-linear-to-r from-indigo-600 to-blue-500 px-4 py-2 text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {editing ? "Salvar Alterações" : "Criar Conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
