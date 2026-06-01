import { useEffect, useState } from "react";

function Fazerdieta({ usuarioId }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!usuarioId) {
      setErro("Faça login novamente para ver sua dieta.");
      setCarregando(false);
      return;
    }

    async function carregar() {
      try {
        const res = await fetch(`/api/usuario/${usuarioId}/dieta`);
        const json = await res.json();
        if (json.sucesso) {
          setDados(json);
        } else {
          setErro(json.erro || "Não foi possível carregar a dieta");
        }
      } catch {
        setErro("Erro ao conectar com o servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuarioId]);

  if (carregando) return <p>Carregando sua dieta...</p>;
  if (erro) return <p className="admin-erro">{erro}</p>;

  const dieta = dados?.dieta;
  const basal = dados?.calculo_basal;

  if (!dieta) {
    return (
      <div>
        <h2 className="form-title">Sua dieta</h2>
        <p className="form-subtitle">
          Sua dieta ainda não foi publicada. Um profissional de nutrição ou educação física
          irá montá-la e disponibilizá-la aqui no app.
        </p>
        {basal && (
          <div className="admin-basal">
            <p>
              <strong>Sua taxa basal estimada:</strong> {basal.tmb} kcal/dia
            </p>
            <p>
              <strong>Calorias recomendadas:</strong> {basal.caloriasDia} kcal/dia
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="form-title">Sua dieta</h2>
      <p className="form-subtitle">Plano elaborado pelo seu profissional</p>
      {basal && (
        <p className="form-subtitle">
          Referência basal: {basal.tmb} kcal (TMB) — Total do plano:{" "}
          {Math.round(dieta.calorias_totais || 0)} kcal
        </p>
      )}

      <div className="refeicoes-grid">
        <article className="refeicao-card">
          <h3>☕ Café da manhã</h3>
          <p>{dieta.cafe || "—"}</p>
          <small>{dieta.cafe_calorias || 0} kcal</small>
        </article>
        <article className="refeicao-card">
          <h3>🍽️ Almoço</h3>
          <p>{dieta.almoco || "—"}</p>
          <small>{dieta.almoco_calorias || 0} kcal</small>
        </article>
        <article className="refeicao-card">
          <h3>🌙 Jantar</h3>
          <p>{dieta.janta || "—"}</p>
          <small>{dieta.janta_calorias || 0} kcal</small>
        </article>
      </div>
    </div>
  );
}

export default Fazerdieta;
