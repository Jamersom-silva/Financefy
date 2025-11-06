import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Tag,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiGet, apiRequest } from "../../api/api";

// ============================
// 🔹 Tipos
// ============================
type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
  created_at: string | null;
};

type FormState = {
  name: string;
  type: "income" | "expense";
};

// ============================
// 🔹 Componente principal
// ============================
export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", type: "expense" });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // ============================================================
  // 🔹 Buscar categorias
  // ============================================================
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet<Category[]>("/categories/");
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Falha ao buscar categorias.");
      setError("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ============================================================
  // 🔹 Filtro e Paginação
  // ============================================================
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results = q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : categories;
    return results.slice((page - 1) * pageSize, page * pageSize);
  }, [categories, query, page]);

  const totalPages = Math.ceil(
    (query
      ? categories.filter((c) => c.name.toLowerCase().includes(query)).length
      : categories.length) / pageSize
  );

  // ============================================================
  // 🔹 Modal Helpers
  // ============================================================
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", type: "expense" });
    setIsOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({ name: category.name, type: category.type });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    setForm({ name: "", type: "expense" });
  };

  // ============================================================
  // 🔹 Criar / Editar Categoria
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("O nome da categoria é obrigatório.");
      return;
    }

    try {
      setSaving(true);
      let newCategory: Category | null = null;

      if (editing) {
        newCategory = await apiRequest<Category>(`/categories/${editing.id}/`, "PUT", form);
        toast.success("Categoria atualizada!");
      } else {
        newCategory = await apiRequest<Category>("/categories/", "POST", form);
        toast.success("Categoria criada!");
      }

      if (newCategory?.id) {
        setCategories((prev) =>
          editing
            ? prev.map((c) => (c.id === newCategory.id ? newCategory : c))
            : [...prev, newCategory]
        );
      } else {
        await fetchCategories();
      }

      closeModal();
    } catch {
      toast.error("Erro ao salvar categoria.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 🔹 Excluir Categoria
  // ============================================================
  const handleDelete = async (category: Category) => {
    const ok = window.confirm(`Excluir a categoria "${category.name}"?`);
    if (!ok) return;

    const previous = [...categories];
    setCategories((prev) => prev.filter((c) => c.id !== category.id));

    try {
      await apiRequest(`/categories/${category.id}/`, "DELETE");
      toast.success("Categoria excluída!");
    } catch {
      toast.error("Erro ao excluir categoria.");
      setCategories(previous);
    }
  };

  // ============================================================
  // 🔹 Exportar CSV
  // ============================================================
  const handleExportCSV = () => {
    const header = "Nome,Tipo,Criada em\n";
    const rows = categories
      .map((c) => {
        const date = c.created_at ? new Date(c.created_at) : null;
        const formattedDate =
          date && !isNaN(date.getTime()) ? date.toLocaleDateString("pt-BR") : "—";
        return `${c.name},${c.type === "income" ? "Receita" : "Despesa"},${formattedDate}`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "categorias.csv");
    link.click();
  };

  // ============================================================
  // 🔹 Formatar data
  // ============================================================
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
  };

  // ============================================================
  // 🔹 Renderização
  // ============================================================
  return (
    <div className="space-y-6 transition-all duration-300 ease-in-out mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 🔹 Cabeçalho */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Tag size={22} className="text-[--color-primary]" />
          Categorias
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar categoria..."
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
            <Plus size={18} /> Nova Categoria
          </button>
        </div>
      </div>

      {/* 🔹 Lista */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={18} /> Carregando categorias...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Nenhuma categoria encontrada.</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="py-3 px-4 font-medium">Nome</th>
                    <th className="py-3 px-4 font-medium">Tipo</th>
                    <th className="py-3 px-4 font-medium">Criada em</th>
                    <th className="py-3 px-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">{cat.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            cat.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {cat.type === "income" ? "Receita" : "Despesa"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(cat.created_at)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <Pencil size={16} /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
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
                {editing ? "Editar Categoria" : "Nova Categoria"}
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
                <label className="mb-1 block text-sm text-gray-700">Nome da categoria</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Ex: Alimentação, Transporte..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, type: e.target.value as "income" | "expense" }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
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
                  {editing ? "Salvar Alterações" : "Criar Categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
