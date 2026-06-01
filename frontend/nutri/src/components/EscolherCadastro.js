import { FcGoogle } from "react-icons/fc";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

function EscolherCadastro({ onVoltar, onCadastroUsuario, onCadastroAdmin }) {
  return (
    <div className="form-card">
      <h1 className="form-title">Criar conta</h1>
      <p className="form-subtitle">Escolha o tipo de cadastro</p>

      <div className="escolha-cadastro-grid">
        <button type="button" className="escolha-card" onClick={onCadastroUsuario}>
          <HiUserGroup size={48} color="#00C853" />
          <strong>Usuário</strong>
          <span>Para quem vai receber dieta e acompanhamento</span>
        </button>

        <button type="button" className="escolha-card" onClick={onCadastroAdmin}>
          <MdOutlineAdminPanelSettings size={48} color="#FF6D00" />
          <strong>Profissional</strong>
          <span>Para nutricionistas, educadores físicos e profissionais</span>
        </button>
      </div>

      <div className="form-actions" style={{ marginTop: "1.5rem" }}>
        <button type="button" className="btn btn-secondary" onClick={onVoltar}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default EscolherCadastro;
