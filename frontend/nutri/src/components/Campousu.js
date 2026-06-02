import { useState } from "react";
import Fazerdieta from "./pages/Fazerdieta";

function Campousu({ usuario }) {
  const [mostrarDieta, setMostrarDieta] = useState(false);

  if (!usuario?.profissional_id) {
    return (
      <div className="form-card welcome-card">
        <h2>Cadastro incompleto</h2>
        <p>Você ainda não escolheu um profissional para acompanhar seu plano.</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Procure seu nutricionista ou educador físico e peça para ser vinculado.
        </p>
      </div>
    );
  }

  if (mostrarDieta) {
    return (
      <div className="form-card form-card--wide">
        <Fazerdieta usuarioId={usuario?.id} />
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMostrarDieta(false)}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card welcome-card">
      <h2>Bem-vindo ao Nutri+</h2>
      <p>Veja aqui o plano alimentar preparado pelo seu profissional.</p>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setMostrarDieta(true)}
        >
          Fazer dieta
        </button>
      </div>
    </div>
  );
}

export default Campousu;
