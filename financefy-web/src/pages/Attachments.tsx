import { useEffect, useState } from "react";
import { apiGet, apiRequest } from "../api/api";
import { toast } from "react-hot-toast";
import { Loader2, FileText, Trash2, Upload } from "lucide-react";

interface Attachment {
  id: number;
  name: string;
  file: string;
  type: "invoice" | "receipt";
  uploaded_at: string;
}

export default function Attachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"invoice" | "receipt">("invoice");

  const token = localStorage.getItem("token") ?? undefined;

  // ============================================================
  // 🔹 Carrega anexos existentes
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<Attachment[]>("/attachments/", token);
        setAttachments(data);
      } catch {
        toast.error("Erro ao carregar anexos.");
      }
    };
    fetchData();
  }, [token]);

  // ============================================================
  // 🔹 Upload de novo anexo
  // ============================================================
  const handleUpload = async () => {
    if (!file || !name) {
      toast.error("Preencha o nome e selecione um arquivo PDF.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);

    try {
      const data = await apiRequest<Attachment>(
        "/attachments/",
        "POST",
        formData,
        true,
        token
      );
      setAttachments((prev) => [data, ...prev]);
      setName("");
      setFile(null);
      toast.success("Anexo enviado com sucesso!");
    } catch {
      toast.error("Erro ao enviar anexo.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔹 Excluir anexo
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este anexo?")) return;

    setLoading(true);
    try {
      await apiRequest(`/attachments/${id}/`, "DELETE", undefined, false, token);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Anexo excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir anexo.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔹 Renderização
  // ============================================================
  return (
    <div className="p-6">
      {/* 🔸 Título da página */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        <FileText className="text-black" size={30} />
        Faturas e Comprovantes
      </h1>

      {/* 🔸 Formulário de upload */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Enviar novo anexo
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Nome do arquivo */}
          <input
            type="text"
            placeholder="Nome do arquivo (ex: Caixa - Fatura Janeiro)"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:border-black focus:ring-1 focus:ring-black outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Tipo de arquivo */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:border-black focus:ring-1 focus:ring-black outline-none"
            value={type}
            onChange={(e) => setType(e.target.value as "invoice" | "receipt")}
          >
            <option value="invoice">📄 Fatura</option>
            <option value="receipt">💳 Comprovante</option>
          </select>

          {/* Upload PDF */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:col-span-2 lg:col-span-3 cursor-pointer focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Botão Enviar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex items-center gap-2 bg-black text-white font-medium px-6 py-2.5 rounded-lg shadow hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Enviando...
              </>
            ) : (
              <>
                <Upload size={18} /> Enviar PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* 🔸 Lista de anexos */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Meus anexos
        </h2>

        {attachments.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum anexo encontrado.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {a.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {a.type === "invoice" ? "📄 Fatura" : "💳 Comprovante"} —{" "}
                    {new Date(a.uploaded_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={a.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-medium text-sm hover:underline"
                  >
                    Visualizar
                  </a>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-black hover:text-gray-700 transition"
                    title="Excluir anexo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
