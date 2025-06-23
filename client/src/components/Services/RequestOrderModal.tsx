import React, { useState } from "react";
import { usePromptAlerts } from '../UI/AlertContainer';

// ...interfaces...

export function RequestOrderModal({ serviceId, open, onClose, onSuccess }: RequestOrderModalProps) {
  const [form, setForm] = useState({
    scheduled_date: "",
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const alerts = usePromptAlerts();

  if (!open) return null;

  // Busca dados do endereço pelo CEP usando ViaCEP
  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      alerts.warning("CEP deve ter 8 dígitos.", "CEP inválido");
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        alerts.error("CEP não encontrado.", "Erro no CEP");
        return;
      }
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch {
      alerts.error("Erro ao buscar o CEP.", "Erro no CEP");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    // Limita caracteres
    if (name === "cep") value = value.replace(/\D/g, "").slice(0, 8);
    if (name === "uf") value = value.slice(0, 2).toUpperCase();
    if (name === "notes") value = value.slice(0, 200);
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações básicas
    if (!form.scheduled_date) {
      alerts.warning('Por favor, selecione uma data para o serviço', 'Data obrigatória');
      setLoading(false);
      return;
    }

    if (!form.cep || !form.logradouro || !form.bairro || !form.cidade || !form.uf) {
      alerts.error('Por favor, preencha todos os campos de endereço obrigatórios', 'Campos obrigatórios');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alerts.error('Você precisa estar logado para solicitar um serviço', 'Erro de autenticação');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3333/clients/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_id: serviceId,
          scheduled_date: form.scheduled_date,
          address: {
            cep: form.cep,
            logradouro: form.logradouro,
            complemento: form.complemento,
            bairro: form.bairro,
            cidade: form.cidade,
            uf: form.uf,
          },
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar ordem");
      }

      setForm({
        scheduled_date: "",
        cep: "",
        logradouro: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        notes: "",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar ordem";
      alerts.error(errorMessage, 'Erro na Solicitação');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Solicitar Serviço</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="datetime-local"
            name="scheduled_date"
            value={form.scheduled_date}
            onChange={handleChange}
            required
            className="w-full border rounded px-2 py-1"
            placeholder="Data agendada"
          />
          <input
            type="text"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            required
            maxLength={8}
            className="w-full border rounded px-2 py-1"
            placeholder="CEP"
          />
          <input
            type="text"
            name="logradouro"
            value={form.logradouro}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full border rounded px-2 py-1"
            placeholder="Logradouro"
          />
          <input
            type="text"
            name="complemento"
            value={form.complemento}
            onChange={handleChange}
            maxLength={50}
            className="w-full border rounded px-2 py-1"
            placeholder="Complemento"
          />
          <input
            type="text"
            name="bairro"
            value={form.bairro}
            onChange={handleChange}
            required
            maxLength={50}
            className="w-full border rounded px-2 py-1"
            placeholder="Bairro"
          />
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            required
            maxLength={50}
            className="w-full border rounded px-2 py-1"
            placeholder="Cidade"
          />
          <input
            type="text"
            name="uf"
            value={form.uf}
            onChange={handleChange}
            required
            maxLength={2}
            className="w-full border rounded px-2 py-1"
            placeholder="UF"
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            maxLength={200}
            className="w-full border rounded px-2 py-1 resize-none"
            placeholder="Observações (máx. 200 caracteres)"
          />
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {loading ? "Enviando..." : "Solicitar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}