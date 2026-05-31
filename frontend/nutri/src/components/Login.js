import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { FcGoogle } from "react-icons/fc";

function Login({ onLogin, onCadastrar, onRecuperarsenha }) {
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function loginGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user.email) {
        alert("Não foi possível obter seu email do Google.");
        return;
      }
      const res = await fetch(`http://localhost:3001/api/usuario/por-email/${encodeURIComponent(user.email)}`);
      const dados = await res.json();
      if (dados.sucesso) {
        onLogin("usuario", dados.usuario);
      } else {
        alert(`Email ${user.email} não encontrado. Cadastre-se primeiro com esse email.`);
      }
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        alert("Erro ao entrar com Google: " + err.message);
      }
    }
  }

  async function handlelogin(tipo) {
    if (senha.length < 8) {
      alert("Senha inválida — mínimo 8 caracteres");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3001/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name, senha: senha }),
      });

      const dados = await resposta.json();

      if (dados.sucesso) {
        onLogin(tipo, dados.usuario);
      } else {
        alert(dados.erro || "Credenciais inválidas");
      }
    } catch {
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="form-card">
      <h1 className="form-title">Nutri+</h1>
      <p className="form-subtitle">Entre na sua conta</p>

      <div className="form-group">
        <label htmlFor="login-nome">Nome</label>
        <input
          id="login-nome"
          type="text"
          placeholder="Digite seu nome"
          minLength={8}
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-senha">Senha</label>
        <div className="password-container">
          <input
            id="login-senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Mínimo 12 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            role="button"
            tabIndex={0}
            aria-label="Mostrar senha"
          >
            {mostrarSenha ? "🙈" : "👁️"}
          </span>
        </div>
      </div>

      <div className="form-actions login-actions">
        <button type="button" className="btn btn-primary" onClick={() => handlelogin("usuario")}>
          Entrar
        </button>
        <button type="button" className="btn btn-accent" onClick={() => handlelogin("admin")}>
          Profissional
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-recuperar"
          onClick={onRecuperarsenha}
        >
          Esqueceu a senha?
        </button>
      </div>

      <div className="form-actions" style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" className="btn btn-secondary" onClick={onCadastrar} style={{ flex: 1 }}>
          Cadastrar
        </button>
        <button type="button" className="btn btn-google" onClick={loginGoogle} style={{ flex: 1 }}>
          <FcGoogle size={20} /> Google
        </button>
      </div>
    </div>
  );
}

export default Login;
