import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export function ProfileEdit() {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    numero: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        cpf: user.cpf || "",
        cep: user.cep || "",
        logradouro: user.logradouro || "",
        complemento: user.complemento || "",
        bairro: user.bairro || "",
        localidade: user.localidade || "",
        uf: user.uf || "",
        numero: user.numero || "",
      });
    }
  }, [user]);

  if (!token) {
    return <div className="text-red-600">Você precisa estar logado para editar seu perfil.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("http://localhost:3333/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao atualizar perfil");
      const updated = await res.json();
      setMsg("Perfil atualizado com sucesso!");
      setEditMode(false);
      if (setUser) setUser(updated); // Atualiza contexto se necessário
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-2">Meu Perfil</h2>
      {msg && <div className="text-green-600">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label>Nome</label>
        <input name="name" value={form.name} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Telefone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>CPF</label>
        <input name="cpf" value={form.cpf} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>CEP</label>
        <input name="cep" value={form.cep} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Logradouro</label>
        <input name="logradouro" value={form.logradouro} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Complemento</label>
        <input name="complemento" value={form.complemento} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Bairro</label>
        <input name="bairro" value={form.bairro} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Cidade</label>
        <input name="localidade" value={form.localidade} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>UF</label>
        <input name="uf" value={form.uf} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      <div>
        <label>Número</label>
        <input name="numero" value={form.numero} onChange={handleChange} className="border rounded w-full px-2 py-1" disabled={!editMode} />
      </div>
      {!editMode ? (
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setEditMode(true)}
        >
          Editar
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditMode(false);
              if (user) {
                setForm({
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                  cpf: user.cpf || "",
                  cep: user.cep || "",
                  logradouro: user.logradouro || "",
                  complemento: user.complemento || "",
                  bairro: user.bairro || "",
                  localidade: user.localidade || "",
                  uf: user.uf || "",
                  numero: user.numero || "",
                });
              }
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </form>
  );
}