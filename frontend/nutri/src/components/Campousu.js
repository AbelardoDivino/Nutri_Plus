import { useState } from "react";
import Fazerdieta from "./pages/Fazerdieta";

function Campousu({ usuario }) {
  const [mostrarDieta, setMostrarDieta] = useState(false);

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
