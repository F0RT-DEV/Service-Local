import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3333";

const PerfilPublicoPrestador = () => {
  const { id } = useParams();
  const [prestador, setPrestador] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    // Buscar dados do prestador
    axios.get(`${API_URL}/providers/${id}`)
      .then(res => setPrestador(res.data))
      .catch(() => setPrestador(null));

    // Buscar serviços do prestador
    axios.get(`${API_URL}/providers/${id}/services`)
      .then(res => setServicos(res.data))
      .catch(() => setServicos([]));

    // Buscar avaliações do prestador (ajuste a rota conforme seu backend)
    axios.get(`${API_URL}/orders?provider_id=${id}`)
      .then(res => setAvaliacoes(res.data))
      .catch(() => setAvaliacoes([]));
  }, [id]);

  if (!prestador) return <div>Carregando perfil do prestador...</div>;
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1>{prestador.bio || "Prestador de Serviço"}</h1>
      <div>
        <strong>Categorias:</strong>{" "}
        {prestador.categories?.map(c => c.name).join(", ")}
      </div>
      <div>
        <strong>Tipo:</strong> {prestador.cnpj ? "PJ" : "Autônomo"}
      </div>
      <hr style={{ margin: "2rem 0" }} />

      <h2>Serviços Oferecidos</h2>
      {servicos.length === 0 ? (
        <p>Nenhum serviço cadastrado.</p>
      ) : (
        <ul>
          {servicos.map(s => (
            <li key={s.id}>
              <strong>{s.title}</strong> - {s.description?.slice(0, 60)}...
              <br />
              <span style={{ color: "#2563EB" }}>
                {s.price_min && s.price_max
                  ? `R$ ${Number(s.price_min).toFixed(2)} - R$ ${Number(s.price_max).toFixed(2)}`
                  : "A combinar"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "2rem 0" }} />

<h2>Avaliações</h2>
{avaliacoes.length === 0 ? (
  <p>Este prestador ainda não possui avaliações.</p>
) : (
  <ul>
    {avaliacoes.slice(0, 5).map((a, idx) => (
      <li key={idx}>
        <strong>Nota:</strong> {a.rating} <br />
        <strong>Comentário:</strong> {a.rating_comment}
      </li>
    ))}
  </ul>
)}
    </div>
  );
};

export default PerfilPublicoPrestador;