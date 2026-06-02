import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Esqueceuasenha({ onVoltar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  async function handleRecuperar() {
    if (!email.includes("@")) {
      alert("Email inválido");
      return;
    }
    if (senha.length < 8) {
      alert("Senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (senha !== confirmarSenha) {
      alert("Senhas não coincidem");
      return;
    }

    try {
      const resposta = await fetch("/api/usuario/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (dados.sucesso) {
        alert("Senha alterada com sucesso!");
        onVoltar();
      } else {
        alert(dados.erro);
      }
    } catch {
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="form-card">
      <h1 className="form-title">Recuperar senha</h1>
      <p className="form-subtitle">Informe seu email e a nova senha</p>

      <div className="form-group">
        <label htmlFor="rec-email">Email</label>
        <input
          id="rec-email"
          type="email"
          placeholder="seuemail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rec-senha">Nova senha</label>
        <div className="password-container">
          <input
            id="rec-senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <span className="toggle-password" onClick={() => setMostrarSenha(!mostrarSenha)}>
            {mostrarSenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="rec-confirmar">Confirmar nova senha</label>
        <div className="password-container">
          <input
            id="rec-confirmar"
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
          >
            {mostrarConfirmar ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={handleRecuperar}>
          Alterar senha
        </button>
        <button type="button" className="btn btn-secondary" onClick={onVoltar}>
          Voltar para login
        </button>
      </div>
    </div>
  );
}

export default Esqueceuasenha;
