import { useEffect, useState, useCallback } from "react";
import { apiGet, apiRequest } from "../../api/api";
import { toast } from "react-hot-toast";
import { Plus, Upload, ChevronDown, ChevronRight } from "lucide-react";

interface Group {
  id: number;
  name: string;
}

interface RecordItem {
  id: number;
  group: number;
  month: number;
  year: number;
}

interface Attachment {
  id: number;
  type: "invoice" | "receipt";
  file: string;
  uploaded_at: string;
}

export default function Attachments() {
  const token = localStorage.getItem("token") ?? undefined;

  const [groups, setGroups] = useState<Group[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [attachments, setAttachments] = useState<Record<string, Attachment[]>>({});

  const [newGroupName, setNewGroupName] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const loadGroups = useCallback(async () => {
    setGroups(await apiGet<Group[]>("/attachment-groups/", token));
  }, [token]);

  const loadRecords = useCallback(async () => {
    if (!expandedGroup) return;
    setRecords(await apiGet<RecordItem[]>(`/attachment-records/?group=${expandedGroup}`, token));
  }, [expandedGroup, token]);

  const loadAttachments = useCallback(async () => {
    if (!expandedRecord) return;
    const data = await apiGet<Attachment[]>(`/attachments/?record=${expandedRecord}`, token);
    setAttachments((prev) => ({ ...prev, [expandedRecord]: data }));
  }, [expandedRecord, token]);

  useEffect(() => { loadGroups(); }, [loadGroups]);
  useEffect(() => { loadRecords(); }, [loadRecords]);
  useEffect(() => { loadAttachments(); }, [loadAttachments]);

  const createGroup = async () => {
    if (!newGroupName.trim()) return toast.error("Digite um nome para o grupo.");
    const newGroup = await apiRequest<Group>("/attachment-groups/", "POST", { name: newGroupName });
    setGroups((prev) => [...prev, newGroup]);
    setNewGroupName("");
    toast.success("Grupo criado!");
  };

  const createRecord = async (groupId: number) => {
    const newRecord = await apiRequest<RecordItem>("/attachment-records/", "POST", {
      group: groupId,
      month,
      year,
    });
    setRecords((prev) => [...prev, newRecord]);
    toast.success("Mês adicionado!");
  };

  const upload = async (type: "invoice" | "receipt") => {
    if (!selectedRecord) return toast.error("Selecione um mês antes de enviar.");

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("record", String(selectedRecord));
      formData.append("type", type);
      formData.append("file", file);

      await apiRequest("/attachments/", "POST", formData, true);
      toast.success("Arquivo enviado!");
      loadAttachments();
    };

    input.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">

      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">📁 Grupos de Contas</h2>

        <div className="flex gap-3">
          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Ex: Conta de Luz"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button
            onClick={createGroup}
            className="bg-black text-white px-4 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus size={18} /> Criar
          </button>
        </div>

        {groups.map((g) => (
          <div key={g.id} className="border rounded-lg overflow-hidden">
            <button
              className="flex justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200"
              onClick={() => setExpandedGroup(expandedGroup === g.id ? null : g.id)}
            >
              <span className="font-semibold">{g.name}</span>
              {expandedGroup === g.id ? <ChevronDown /> : <ChevronRight />}
            </button>

            {expandedGroup === g.id && (
              <div className="p-4 space-y-4 bg-white">

                <div className="flex gap-3 items-center">
                  <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border px-2 py-1 rounded">
                    {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>

                  <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="border px-2 py-1 rounded w-24" />

                  <button onClick={() => createRecord(g.id)} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">
                    + Mês
                  </button>
                </div>

                {records.filter((r) => r.group === g.id).map((r) => (
                  <div key={r.id}>
                    <button
                      className="w-full flex justify-between bg-gray-50 px-3 py-2 rounded-lg border"
                      onClick={() => {
                        setExpandedRecord(expandedRecord === r.id ? null : r.id);
                        setSelectedRecord(r.id);
                      }}
                    >
                      {r.month}/{r.year}
                      {expandedRecord === r.id ? <ChevronDown /> : <ChevronRight />}
                    </button>

                    {expandedRecord === r.id && (
                      <div className="p-4 space-y-3 border rounded-lg bg-gray-50">

                        <div className="flex gap-3">
                          <button onClick={() => upload("invoice")} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2">
                            <Upload size={18} /> Enviar Fatura
                          </button>

                          <button onClick={() => upload("receipt")} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                            <Upload size={18} /> Enviar Comprovante
                          </button>
                        </div>

                        {(attachments[r.id] ?? []).map((a) => (
                          <a key={a.id} href={a.file} target="_blank" className="block text-sm text-blue-600 hover:underline">
                            {a.type === "invoice" ? "📄 Fatura" : "💳 Comprovante"} — {new Date(a.uploaded_at).toLocaleDateString("pt-BR")}
                          </a>
                        ))}

                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
