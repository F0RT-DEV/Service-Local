import { useState } from "react";

interface CreateServiceProps {
  onBack: () => void;
  onCreate: (serviceData: any) => void;
}

export function CreateService({ onBack, onCreate }: CreateServiceProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price_min: "",
    price_max: "",
    category_id: "",
    images: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Veja o que está sendo enviado
      console.log({
        ...form,
        price_min: Number(form.price_min),
        price_max: Number(form.price_max),
      });
      await onCreate({
        ...form,
        price_min: Number(form.price_min),
        price_max: Number(form.price_max),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cadastrar Novo Serviço</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Descrição</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 outline-none resize-none"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Preço Mínimo</label>
            <input
              type="number"
              name="price_min"
              value={form.price_min}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Preço Máximo</label>
            <input
              type="number"
              name="price_max"
              value={form.price_max}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min={0}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Categoria</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Selecione...</option>
            <option value="c9d9fa49-cdd0-4a52-8557-fe55401f2423">
              Criação de Sites
            </option>
            {/* Adicione as categorias reais aqui */}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">URL da Imagem</label>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-medium">Ativo</label>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800"
            disabled={loading}
          >
            Voltar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar Serviço"}
          </button>
        </div>
      </form>
    </div>
  );
}