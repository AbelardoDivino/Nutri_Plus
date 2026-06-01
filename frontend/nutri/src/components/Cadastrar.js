import { useEffect, useState } from "react";
import Pesobasal from "./pages/Pesobasal";

function Cadastrar({ onVoltar, onCadastrado, tipo = "usuario" }) {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [genero, setGenero] = useState("Masculino");
  const [idade, setIdade] = useState("");
  const [sedentario, setSedentario] = useState("Sim");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalId, setProfissionalId] = useState("");

  useEffect(() => {
    if (tipo !== "admin") {
      fetch("/api/profissional")
        .then((r) => r.json())
        .then((d) => { if (d.sucesso) setProfissionais(d.profissionais); })
        .catch(() => {});
    }
  }, [tipo]);

  async function handleCadastro() {
    if (nome.length < 10 || nome.length > 40) {
      alert("Nome deve ter entre 10 e 40 caracteres");
      return;
    }
    if (senha.length < 12 || senha.length > 60) {
      alert("Senha deve ter entre 12 e 60 caracteres");
      return;
    }
    if (senha !== confirmarSenha) {
      alert("Senhas não coincidem");
      return;
    }
    if (!email.includes("@")) {
      alert("Email inválido");
      return;
    }
    if (tipo !== "admin") {
      if (!peso || Number(peso) <= 0) {
        alert("Informe um peso válido");
        return;
      }
      const alturaCm = Number(altura);
      if (!alturaCm || alturaCm < 50 || alturaCm > 250) {
        alert("Altura deve estar entre 50 e 250 cm");
        return;
      }
      if (!idade || idade < 1 || idade > 120) {
        alert("Idade deve estar entre 1 e 120 anos");
        return;
      }
      if (!profissionalId) {
        alert("Selecione um profissional para acompanhar seu plano");
        return;
      }
    }

    const alturaMetros = altura ? Number((Number(altura) / 100).toFixed(2)) : null;

    const url = tipo === "admin"
      ? "/api/profissional/cadastro"
      : "/api/usuario/cadastro";

    const body = tipo === "admin"
      ? { nome, senha, email, telefone }
      : { nome, senha, email, telefone, altura: alturaMetros, genero, sedentario, peso: Number(peso), idade: Number(idade), profissional_id: Number(profissionalId) };

    try {
      const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const dados = await resposta.json();

      if (dados.sucesso) {
        alert("Cadastro realizado com sucesso!");
        onCadastrado();
      } else {
        alert(dados.erro || "Erro no cadastro");
      }
    } catch {
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="form-card form-card--wide">
      <h1 className="form-title">Cadastro</h1>
      <p className="form-subtitle">Olá, seja bem-vindo ao Nutri+</p>

      <div className="form-group">
        <label htmlFor="cad-nome">Nome</label>
        <input
          id="cad-nome"
          type="text"
          minLength={10}
          maxLength={40}
          placeholder="Digite seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      {tipo !== "admin" && (
        <section className="pesobasal-section" aria-label="Dados corporais">
          <h3>Seus dados para o plano nutricional</h3>
          <Pesobasal
            peso={peso}
            altura={altura}
            genero={genero}
            sedentario={sedentario}
            onPeso={setPeso}
            onAltura={setAltura}
            onGenero={setGenero}
            onSedentario={setSedentario}
          />
        </section>
      )}

      <div className="form-group">
        <label htmlFor="cad-senha">Senha</label>
        <div className="password-container">
          <input
            id="cad-senha"
            type={mostrarSenha ? "text" : "password"}
            minLength={12}
            maxLength={60}
            placeholder="Mínimo 12 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <span className="toggle-password" onClick={() => setMostrarSenha(!mostrarSenha)}>
            {mostrarSenha ? "🙈" : "👁️"}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cad-confirmar">Confirmar senha</label>
        <div className="password-container">
          <input
            id="cad-confirmar"
            type={mostrarConfirmar ? "text" : "password"}
            minLength={12}
            maxLength={60}
            placeholder="Digite a senha novamente"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
          >
            {mostrarConfirmar ? "🙈" : "👁️"}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cad-email">Email</label>
        <input
          id="cad-email"
          type="email"
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cad-telefone">Telefone</label>
        <input
          id="cad-telefone"
          type="tel"
          placeholder="99-99999-9999"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>

      {tipo !== "admin" && (
        <>
          <div className="form-group">
            <label htmlFor="cad-idade">Idade</label>
            <input
              id="cad-idade"
              type="number"
              min={1}
              max={120}
              placeholder="Ex: 25"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cad-profissional">Escolha seu nutricionista / profissional</label>
            <select
              id="cad-profissional"
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={handleCadastro}>
          Cadastrar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onVoltar}>
          Voltar para login
        </button>
      </div>
    </div>
  );
}

export default Cadastrar;
